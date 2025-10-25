import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import clientPromise from "@/lib/mongodb";

export async function GET(req) {
  try {
    const session = await getServerSession(authOptions);

    // Check if user is authenticated and is admin
    if (!session || session.user.role !== "admin") {
      return NextResponse.json(
        { error: "Unauthorized - Admin access required" },
        { status: 401 }
      );
    }

    const client = await clientPromise;
    const db = client.db("dimenshopdb");

    // Get counts
    const totalUsers = await db.collection("users").countDocuments();
    const totalProducts = await db.collection("products").countDocuments();
    const totalOrders = await db.collection("orders").countDocuments();

    // Calculate total revenue from completed orders
    const revenueResult = await db.collection("orders").aggregate([
      { $match: { status: { $in: ["confirmed", "shipped", "delivered"] } } },
      { $group: { _id: null, total: { $sum: "$totalAmount" } } }
    ]).toArray();
    const totalRevenue = revenueResult[0]?.total || 0;

    // Get recent orders for chart (last 7 days)
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const ordersData = await db.collection("orders").aggregate([
      { $match: { createdAt: { $gte: sevenDaysAgo } } },
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
          count: { $sum: 1 },
          revenue: { $sum: "$totalAmount" }
        }
      },
      { $sort: { _id: 1 } }
    ]).toArray();

    // Get top selling products
    const topProducts = await db.collection("products")
      .find()
      .sort({ buyCount: -1 })
      .limit(5)
      .toArray();

    // Get recent orders
    const recentOrders = await db.collection("orders")
      .find()
      .sort({ createdAt: -1 })
      .limit(10)
      .toArray();

    return NextResponse.json({
      stats: {
        totalUsers,
        totalProducts,
        totalOrders,
        totalRevenue
      },
      ordersData: ordersData.map(item => ({
        date: item._id,
        orders: item.count,
        revenue: item.revenue
      })),
      topProducts: topProducts.map(p => ({
        _id: p._id.toString(),
        name: p.name,
        buyCount: p.buyCount || 0,
        price: p.price
      })),
      recentOrders: recentOrders.map(o => ({
        _id: o._id.toString(),
        orderId: o._id.toString().slice(-8).toUpperCase(),
        totalAmount: o.totalAmount,
        status: o.status,
        createdAt: o.createdAt
      }))
    });

  } catch (error) {
    console.error("Analytics fetch error:", error);
    return NextResponse.json(
      { error: "Failed to fetch analytics" },
      { status: 500 }
    );
  }
}
