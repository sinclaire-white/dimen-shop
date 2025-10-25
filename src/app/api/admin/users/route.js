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

    // Fetch all users, excluding password field
    const users = await db.collection("users")
      .find({}, { projection: { password: 0 } })
      .sort({ createdAt: -1 })
      .toArray();

    // Get order counts for each user
    const userOrderCounts = await db.collection("orders").aggregate([
      {
        $group: {
          _id: "$userId",
          orderCount: { $sum: 1 }
        }
      }
    ]).toArray();

    // Create a map of userId to order count
    const orderCountMap = {};
    userOrderCounts.forEach(item => {
      orderCountMap[item._id?.toString()] = item.orderCount;
    });

    // Transform users for response
    const formattedUsers = users.map(user => ({
      _id: user._id.toString(),
      name: user.name,
      email: user.email,
      role: user.role || "user",
      image: user.image || null,
      phone: user.phone || null,
      address: user.address || null,
      createdAt: user.createdAt || new Date(),
      orders: orderCountMap[user._id.toString()] || 0,
      status: user.status || "Active",
      joinDate: user.createdAt ? new Date(user.createdAt).toLocaleDateString() : "N/A",
    }));

    return NextResponse.json({ users: formattedUsers });

  } catch (error) {
    console.error("Users fetch error:", error);
    return NextResponse.json(
      { error: "Failed to fetch users" },
      { status: 500 }
    );
  }
}
