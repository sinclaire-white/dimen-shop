// app/products/[id]/page.js
'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  ArrowLeft, 
  ShoppingCart, 
  Heart, 
  Share2, 
  Star, 
  Package, 
  Clock, 
  Ruler,
  File
} from 'lucide-react';
import { cn } from '@/lib/utils';

export default function ProductPage() {
  const params = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(0);
  const [relatedProducts, setRelatedProducts] = useState([]);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await fetch(`/api/products/${params.id}`);
        if (response.ok) {
          const productData = await response.json();
          setProduct(productData);
          
          // Fetch related products
          const relatedResponse = await fetch(`/api/products?category=${productData.category}`);
          if (relatedResponse.ok) {
            const allProducts = await relatedResponse.json();
            const related = allProducts
              .filter(p => p._id !== productData._id)
              .slice(0, 4);
            setRelatedProducts(related);
          }
        }
      } catch (error) {
        console.error('Failed to fetch product:', error);
      } finally {
        setLoading(false);
      }
    };

    if (params.id) {
      fetchProduct();
    }
  }, [params.id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background py-8">
        <div className="container mx-auto px-4">
          <div className="animate-pulse">
            <div className="h-6 bg-muted rounded w-32 mb-6"></div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="w-full h-96 bg-muted rounded-lg"></div>
              <div className="space-y-4">
                <div className="h-8 bg-muted rounded w-3/4"></div>
                <div className="h-6 bg-muted rounded w-1/4"></div>
                <div className="h-4 bg-muted rounded w-full"></div>
                <div className="h-4 bg-muted rounded w-2/3"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-background py-8">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-2xl font-bold text-foreground mb-4">Product Not Found</h1>
          <p className="text-muted-foreground mb-6">The product you're looking for doesn't exist.</p>
          <Button asChild>
            <Link href="/products">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Products
            </Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background py-8">
      <div className="container mx-auto px-4">
        {/* Breadcrumb */}
        <nav className="flex items-center space-x-2 text-sm text-muted-foreground mb-6">
          <Link href="/" className="hover:text-foreground transition-colors">Home</Link>
          <span>/</span>
          <Link href="/products" className="hover:text-foreground transition-colors">Products</Link>
          <span>/</span>
          <span className="text-foreground">{product.name}</span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          {/* Product Images */}
          <div className="space-y-4">
            {/* Main Image */}
            <Card>
              <CardContent className="p-0">
                <div className="aspect-square overflow-hidden rounded-lg">
                  <img
                    src={product.images?.[selectedImage] || '/api/placeholder/600/600'}
                    alt={product.name}
                    className="w-full h-full object-cover"
                  />
                </div>
              </CardContent>
            </Card>

            {/* Thumbnail Images */}
            {product.images && product.images.length > 1 && (
              <div className="flex gap-2 overflow-x-auto">
                {product.images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(index)}
                    className={cn(
                      "flex-shrink-0 w-20 h-20 border-2 rounded-lg overflow-hidden transition-all",
                      selectedImage === index 
                        ? "border-primary" 
                        : "border-transparent hover:border-muted-foreground"
                    )}
                  >
                    <img
                      src={image}
                      alt={`${product.name} ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            <div>
              <div className="flex items-center gap-2 mb-2">
                {product.featured && (
                  <Badge className="bg-primary text-primary-foreground">
                    <Star className="w-3 h-3 mr-1 fill-current" />
                    Featured
                  </Badge>
                )}
                <Badge variant="outline">{product.category}</Badge>
              </div>
              <h1 className="text-3xl font-bold text-foreground mb-4">{product.name}</h1>
              <p className="text-2xl font-bold text-primary mb-4">${product.price}</p>
              <p className="text-muted-foreground leading-relaxed">{product.description}</p>
            </div>

            {/* Stock Status */}
            <div className="flex items-center gap-4 text-sm">
              {product.stock > 0 ? (
                <div className="flex items-center text-green-600">
                  <Package className="w-4 h-4 mr-1" />
                  {product.stock} in stock
                </div>
              ) : (
                <div className="flex items-center text-destructive">
                  <Package className="w-4 h-4 mr-1" />
                  Out of stock
                </div>
              )}
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3">
              <Button 
                size="lg" 
                className="flex-1"
                disabled={product.stock === 0}
              >
                <ShoppingCart className="w-5 h-5 mr-2" />
                Add to Cart
              </Button>
              <Button variant="outline" size="icon">
                <Heart className="w-5 h-5" />
              </Button>
              <Button variant="outline" size="icon">
                <Share2 className="w-5 h-5" />
              </Button>
            </div>

            {/* Product Specs */}
            <Card>
              <CardContent className="p-4">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  {product.fileFormat && (
                    <div className="flex items-center">
                      <File className="w-4 h-4 mr-2 text-muted-foreground" />
                      <span>Format: {product.fileFormat}</span>
                    </div>
                  )}
                  {product.printMaterial && (
                    <div className="flex items-center">
                      <Package className="w-4 h-4 mr-2 text-muted-foreground" />
                      <span>Material: {product.printMaterial}</span>
                    </div>
                  )}
                  {product.dimensions && (
                    <div className="flex items-center">
                      <Ruler className="w-4 h-4 mr-2 text-muted-foreground" />
                      <span>Size: {product.dimensions}</span>
                    </div>
                  )}
                  {product.printTime && (
                    <div className="flex items-center">
                      <Clock className="w-4 h-4 mr-2 text-muted-foreground" />
                      <span>Print Time: {product.printTime}</span>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Product Details Tabs */}
        <Tabs defaultValue="description" className="mb-12">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="description">Description</TabsTrigger>
            <TabsTrigger value="specifications">Specifications</TabsTrigger>
            <TabsTrigger value="reviews">Reviews</TabsTrigger>
          </TabsList>
          <TabsContent value="description">
            <Card>
              <CardContent className="p-6">
                <p className="text-muted-foreground leading-relaxed">
                  {product.description || 'No detailed description available for this product.'}
                </p>
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="specifications">
            <Card>
              <CardContent className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-semibold mb-2">File Information</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span>Format:</span>
                        <span>{product.fileFormat || 'Not specified'}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>File Size:</span>
                        <span>Approx. 15-50MB</span>
                      </div>
                    </div>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-2">Printing Details</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span>Recommended Material:</span>
                        <span>{product.printMaterial || 'Any FDM/Resin'}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Print Time:</span>
                        <span>{product.printTime || 'Varies by size'}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Dimensions:</span>
                        <span>{product.dimensions || 'Scalable'}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="reviews">
            <Card>
              <CardContent className="p-6">
                <div className="text-center text-muted-foreground py-8">
                  <Star className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p>No reviews yet. Be the first to review this product!</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <div>
            <h2 className="text-2xl font-bold text-foreground mb-6">Related Products</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {relatedProducts.map((relatedProduct) => (
                <Card key={relatedProduct._id} className="hover:shadow-lg transition-all duration-300">
                  <CardContent className="p-0">
                    <Link href={`/products/${relatedProduct._id}`}>
                      <div className="aspect-square overflow-hidden">
                        <img
                          src={relatedProduct.images?.[0] || '/api/placeholder/400/400'}
                          alt={relatedProduct.name}
                          className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                        />
                      </div>
                    </Link>
                    <div className="p-4">
                      <Link href={`/products/${relatedProduct._id}`}>
                        <h3 className="font-semibold text-foreground mb-2 hover:text-primary transition-colors line-clamp-2">
                          {relatedProduct.name}
                        </h3>
                      </Link>
                      <div className="flex items-center justify-between">
                        <span className="text-lg font-bold text-primary">${relatedProduct.price}</span>
                        <Button size="sm" variant="outline" asChild>
                          <Link href={`/products/${relatedProduct._id}`}>
                            View
                          </Link>
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}