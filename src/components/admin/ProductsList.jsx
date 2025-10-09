"use client";

import { useEffect, useState } from "react";
import { useAdminStore } from "@/lib/store";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Edit, Trash2 } from "lucide-react";
import { LoaderFour } from "@/components/ui/loader";
import { toast } from "sonner";

import Link from "next/link";

export function ProductsList() {
  // Zustand store for fetching and deleting products, with loading state
  const { products, fetchProducts, deleteProduct, loading } = useAdminStore();
  // State for search filtering
  const [searchTerm, setSearchTerm] = useState("");

  // Fetch products on component mount
  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  // Filter products based on search term
  const filteredProducts = products.filter(
    (product) =>
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Handle product deletion with confirmation
  const handleDelete = async (product) => {
    if (confirm("Are you sure you want to delete this product?")) {
      try {
        // Use _id for MongoDB, id for the UI
        const idToDelete = product._id || product.id;
        await deleteProduct(idToDelete);
        toast.success("Product deleted successfully!");
      } catch (error) {
        console.error("Delete error:", error);
        toast.error("Failed to delete product");
      }
    }
  };

  return (
    // Main container for product list
    <div className="space-y-4">
      {/* Loading state: Show LoaderFour spinner */}
      {loading && (
        <div className="flex justify-center items-center h-64">
          <LoaderFour />
        </div>
      )}

      {/* Fallback: Show message and link when no products */}
      {!loading && filteredProducts.length === 0 && (
        <div className="text-center py-12">
          <h3 className="text-lg font-semibold text-foreground dark:text-foreground">
            No products added
          </h3>
          <p className="text-sm text-muted-foreground dark:text-muted-foreground mt-2">
            Start by adding your first product!
          </p>
          <Button asChild className="mt-4">
            <Link href="/dashboard/products/add">Add Product</Link>
          </Button>
        </div>
      )}

      {/* Product list: Show when not loading and products exist */}
      {!loading && filteredProducts.length > 0 && (
        <div className="grid gap-4">
          {filteredProducts.map((product) => (
            // Card for each product, theme-sensitive
            <Card
              key={product._id}
              className="bg-background dark:bg-background border-muted dark:border-muted"
            >
              {/* Responsive layout: column on mobile, row on larger screens */}
              <CardContent className="pt-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div className="flex items-center space-x-4">
                  {/* Product image or placeholder */}
                  {product.images?.[0] ? (
                    <img
                      src={`${product.images[0]}?w_100,h_100,c_thumb,q_auto`} // Optimized Cloudinary image
                      alt={product.name}
                      className="w-12 h-12 object-cover rounded-lg"
                    />
                  ) : (
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-100 to-purple-100 dark:from-blue-900 dark:to-purple-900 rounded-lg flex items-center justify-center">
                      <span className="text-lg">🎮</span>
                    </div>
                  )}
                  <div>
                    <h3 className="font-semibold text-foreground dark:text-foreground">
                      {product.name}
                    </h3>
                    <p className="text-sm text-muted-foreground dark:text-muted-foreground">
                      {product.category} • ${product.price}
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  {/* Stock display */}
                  <span className="text-sm text-muted-foreground dark:text-muted-foreground">
                    Stock: {product.stock || 0}
                  </span>
                  {/* Action buttons: Edit and Delete */}
                  <div className="flex space-x-2">
                    <Button variant="outline" size="sm" asChild>
                      <Link href={`/dashboard/products/edit/${product.id}`}>
                        <Edit className="h-4 w-4" />
                      </Link>
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDelete(product)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
