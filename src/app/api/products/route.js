import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/authOptions';
import clientPromise from '@/lib/mongodb';
import { ObjectId } from 'mongodb';
import { z } from 'zod';

// Validation for creating products
const productSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  description: z.string().min(1, 'Description is required'),
  price: z.number().positive('Price must be positive'),
  category: z.string().min(1, 'Category is required'),
  stock: z.number().int().min(0, 'Stock must be non-negative'),
  images: z.array(z.string()).min(1, 'At least one image is required'),
  fileFormat: z.string().optional(),
  printMaterial: z.string().optional(),
  dimensions: z.string().optional(),
  printTime: z.string().optional(),
  featured: z.boolean().optional(),
  buyCount: z.number().int().min(0).optional().default(0),
});

// GET: Fetch products with filtering
export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const category = searchParams.get('category');
    const featured = searchParams.get('featured');
    const limit = searchParams.get('limit');
    const skip = searchParams.get('skip');
    const sort = searchParams.get('sort');

    const client = await clientPromise;
    const db = client.db('dimenshopdb');
    const collection = db.collection('products');
    
    // Build query object
    let query = {};
    
    if (category) {
      query.category = category;
    }
    
    if (featured === 'true') {
      query.featured = true;
    }

    // Build the query with pagination and sorting
    let cursor = collection.find(query);
    
    // Sorting options
    if (sort === 'buyCount') {
      cursor = cursor.sort({ buyCount: -1 });
    } else if (sort === 'price_asc') {
      cursor = cursor.sort({ price: 1 });
    } else if (sort === 'price_desc') {
      cursor = cursor.sort({ price: -1 });
    } else if (sort === 'name') {
      cursor = cursor.sort({ name: 1 });
    } else {
      cursor = cursor.sort({ createdAt: -1 });
    }
    
    if (skip) {
      cursor = cursor.skip(parseInt(skip));
    }
    
    if (limit) {
      cursor = cursor.limit(parseInt(limit));
    }
    
    // Use aggregation to populate category information
    const pipeline = [
      { $match: query },
      {
        $addFields: {
          categoryObjectId: { $toObjectId: "$category" }
        }
      },
      {
        $lookup: {
          from: 'categories',
          localField: 'categoryObjectId',
          foreignField: '_id',
          as: 'categoryInfo'
        }
      },
      {
        $unwind: {
          path: '$categoryInfo',
          preserveNullAndEmptyArrays: true
        }
      },
      {
        $addFields: {
          category: {
            $ifNull: ['$categoryInfo', { _id: '$category', name: 'Unknown Category' }]
          }
        }
      },
      {
        $project: {
          categoryObjectId: 0,
          categoryInfo: 0
        }
      }
    ];

    // Add sorting to pipeline
    if (sort === 'buyCount') {
      pipeline.push({ $sort: { buyCount: -1 } });
    } else if (sort === 'price_asc') {
      pipeline.push({ $sort: { price: 1 } });
    } else if (sort === 'price_desc') {
      pipeline.push({ $sort: { price: -1 } });
    } else if (sort === 'name') {
      pipeline.push({ $sort: { name: 1 } });
    } else {
      pipeline.push({ $sort: { createdAt: -1 } });
    }

    // Add skip and limit to pipeline
    if (skip) {
      pipeline.push({ $skip: parseInt(skip) });
    }
    
    if (limit) {
      pipeline.push({ $limit: parseInt(limit) });
    }

    const products = await collection.aggregate(pipeline).toArray();
    
    // Convert _id to string for frontend
    const formattedProducts = products.map(product => ({
      ...product,
      _id: product._id.toString(),
      category: product.category ? {
        ...product.category,
        _id: product.category._id.toString()
      } : null
    }));
    
    return NextResponse.json(formattedProducts);
  } catch (error) {
    console.error('Error fetching products:', error);
    return NextResponse.json({ error: 'Failed to fetch products' }, { status: 500 });
  }
}

// POST: Create new product (admin only)
export async function POST(req) {
  // Check if user is admin
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== 'admin') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await req.json();
    const validatedData = productSchema.parse(body);

    const client = await clientPromise;
    const db = client.db('dimenshopdb');
    const collection = db.collection('products');
    
    // Add timestamps
    const productData = {
      ...validatedData,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    
    const result = await collection.insertOne(productData);
    const newProduct = await collection.findOne({ _id: result.insertedId });
    
    return NextResponse.json({
      ...newProduct,
      _id: newProduct._id.toString(),
    }, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors }, { status: 400 });
    }
    console.error('Error creating product:', error);
    return NextResponse.json({ error: 'Failed to create product' }, { status: 500 });
  }
}