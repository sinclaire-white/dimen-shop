// src/app/products/[id]/page.js

import { notFound } from 'next/navigation';
import clientPromise from '@/lib/mongodb';
import { ObjectId } from 'mongodb';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Star, Package, Clock, Ruler, Palette } from 'lucide-react';
import AddToCartButton from '@/components/cart/AddToCartButton';
import BuyNowButton from '@/components/cart/BuyNowButton';

// Enable ISR - Revalidate every 12 hours
export const revalidate = 43200;

async function getProduct(id) {
  try {
    if (!ObjectId.isValid(id)) {
      return null;
    }

    const client = await clientPromise;
    const db = client.db('dimenshopdb');
    
    // Get product with category name
    const product = await db.collection('products').aggregate([
      { $match: { _id: new ObjectId(id) } },
      {
        $lookup: {
          from: 'categories',
          localField: 'category',
          foreignField: '_id',
          as: 'categoryInfo'
        }
      },
      {
        $addFields: {
          categoryName: { $arrayElemAt: ['$categoryInfo.name', 0] }
        }
      },
      {
        $project: {
          categoryInfo: 0
        }
      }
    ]).toArray();

    if (product.length === 0) {
      return null;
    }

    return {
      ...product[0],
      _id: product[0]._id.toString(),
      category: product[0].category.toString()
    };
  } catch (error) {
    console.error('Error fetching product:', error);
    return null;
  }
}

export default async function ProductPage({ params }) {
  const { id } = await params;
  const product = await getProduct(id);

  if (!product) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-6xl mx-auto px-4 md:px-6 py-6 md:py-8">
        <div className="grid grid-cols-1 md:grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8">
          {/* Product Images */}
          <div className="space-y-4">
            <div className="aspect-square relative bg-muted rounded-lg overflow-hidden">
              {product.images && product.images[0] ? (
                <img
                  src={product.images[0]}
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <Package className="h-24 w-24 text-muted-foreground" />
                </div>
              )}
            </div>
            
            {/* Additional Images */}
            {product.images && product.images.length > 1 && (
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {product.images.slice(1, 5).map((image, index) => (
                  <div key={index} className="aspect-square relative bg-muted rounded-lg overflow-hidden">
                    <img
                      src={image}
                      alt={`${product.name} ${index + 2}`}
                      className="w-full h-full object-cover"
                    />
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Product Details */}
          <div className="space-y-6">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Badge variant="secondary">{product.categoryName}</Badge>
                {product.featured && (
                  <Badge variant="default" className="bg-yellow-500 text-black">
                    <Star className="w-3 h-3 mr-1" />
                    Featured
                  </Badge>
                )}
              </div>
              <h1 className="text-3xl font-bold mb-2">{product.name}</h1>
              <p className="text-2xl font-semibold text-primary">${product.price}</p>
            </div>

            <div className="space-y-4">
              <p className="text-muted-foreground leading-relaxed">
                {product.description}
              </p>

              {/* Product Specifications */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Specifications</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {product.dimensions && (
                    <div className="flex items-center gap-3">
                      <Ruler className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">
                        <strong>Dimensions:</strong> {product.dimensions}
                      </span>
                    </div>
                  )}
                  {product.printTime && (
                    <div className="flex items-center gap-3">
                      <Clock className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">
                        <strong>Print Time:</strong> {product.printTime}
                      </span>
                    </div>
                  )}
                  {product.printMaterial && (
                    <div className="flex items-center gap-3">
                      <Palette className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">
                        <strong>Material:</strong> {product.printMaterial}
                      </span>
                    </div>
                  )}
                  {product.fileFormat && (
                    <div className="flex items-center gap-3">
                      <Package className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">
                        <strong>File Format:</strong> {product.fileFormat}
                      </span>
                    </div>
                  )}
                  <div className="flex items-center gap-3">
                    <Package className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">
                      <strong>Stock:</strong> {product.stock} available
                    </span>
                  </div>
                </CardContent>
              </Card>

              {/* Purchase Section */}
              <div className="space-y-4">
                <div className="flex gap-2">
                  <AddToCartButton product={product} size="lg" className="flex-1" />
                  <BuyNowButton product={product} size="lg" className="flex-1" />
                </div>
                
                <p className="text-xs text-muted-foreground text-center">
                  Digital download available after purchase
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export async function generateMetadata({ params }) {
  const { id } = await params;
  const product = await getProduct(id);
  
  if (!product) {
    return {
      title: 'Product Not Found'
    };
  }

  return {
    title: `${product.name} | DimenShop`,
    description: product.description,
    openGraph: {
      title: product.name,
      description: product.description,
      images: product.images || [],
    },
  };
}