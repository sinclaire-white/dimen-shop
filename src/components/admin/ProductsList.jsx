// src/components/admin/ProductsList.jsx

"use client";

import { useEffect, useState } from "react";
import { useAdminStore } from "@/lib/store";
import { useProductStore } from "@/lib/store";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Edit, Trash2, Star } from "lucide-react";
import DeleteConfirmationModal from "@/components/modals/DeleteConfirmationModal";
import { toast } from "sonner";
import Link from "next/link";
import { Input } from "@/components/ui/input";
import axios from "axios";

export function ProductsList() {
  const { products = [], fetchProducts } = useProductStore();
  const { deleteProduct, categories = [], fetchCategories } = useAdminStore();
  const [searchTerm, setSearchTerm] = useState("");
  const [deleteModal, setDeleteModal] = useState({ isOpen: false, product: null });
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    fetchProducts();
    fetchCategories(); // Fetch categories to get names
  }, [fetchProducts, fetchCategories]);

  // Helper function to get category name by ID
  const getCategoryName = (categoryId) => {
    const category = categories.find(cat => cat._id === categoryId);
    return category ? category.name : 'Unknown Category';
  };

  // Filter products based on search term
  const filteredProducts = (products || []).filter(
    (product) =>
      product.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.category?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleDeleteClick = (product) => {
    setDeleteModal({ isOpen: true, product });
  };

  // Handle product deletion with confirmation
  const handleDelete = async () => {
    if (!deleteModal.product) return;
    
    setIsDeleting(true);
    try {
      const idToDelete = deleteModal.product._id || deleteModal.product.id;
      await deleteProduct(idToDelete);
      toast.success("Product deleted successfully!");
      setDeleteModal({ isOpen: false, product: null });
    } catch (error) {
      console.error("Delete error:", error);
      toast.error("Failed to delete product");
    } finally {
      setIsDeleting(false);
    }
  };

  // Toggle featured status using axios
  const handleToggleFeatured = async (product) => {
    try {
      await axios.put(`/api/products/${product._id || product.id}`, {
        featured: !product.featured,
      });
      toast.success(
        product.featured ? "Removed from featured" : "Marked as featured"
      );
      fetchProducts();
    } catch (error) {
      toast.error("Failed to update featured status");
    }
  };

  return (
    <div className="space-y-4">
      {/* Search input at the top */}
      <Input
        placeholder="Search products..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="pl-9 mb-2"
      />

      {/* No products fallback */}
      {filteredProducts.length === 0 && (
        <div className="text-center py-12">
          <h3 className="text-lg font-semibold text-foreground">
            No products added
          </h3>
          <p className="text-sm text-muted-foreground mt-2">
            Start by adding your first product!
          </p>
          <Button asChild className="mt-4">
            <Link href="/dashboard/products/add">Add Product</Link>
          </Button>
        </div>
      )}

      {/* Product list */}
      {filteredProducts.length > 0 && (
        <div className="grid gap-4">
          {filteredProducts.map((product) => (
            <Card
              key={product._id || product.id}
              className="bg-background border-muted"
            >
              <CardContent className="pt-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div className="flex items-center space-x-4">
                  {/* Product image or placeholder */}
                  {product.images?.[0] ? (
                    <img
                      src={`${product.images[0]}?w_100,h_100,c_thumb,q_auto`}
                      alt={product.name}
                      className="w-12 h-12 object-cover rounded-lg"
                    />
                  ) : (
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-100 to-purple-100 dark:from-blue-900 dark:to-purple-900 rounded-lg flex items-center justify-center">
                      <span className="text-lg">🎮</span>
                    </div>
                  )}
                  <div>
                    <h3 className="font-semibold text-foreground">
                      {product.name}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      {getCategoryName(product.category)} • ${product.price}
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <span className="text-sm text-muted-foreground">
                    Stock: {product.stock || 0}
                  </span>
                  <div className="flex space-x-2">
                    <Button variant="outline" size="sm" asChild>
                      <Link href={`/dashboard/products/edit/${product._id || product.id}`}>
                        <Edit className="h-4 w-4" />
                      </Link>
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDeleteClick(product)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                    <Button
                      variant={product.featured ? "default" : "outline"}
                      size="sm"
                      onClick={() => handleToggleFeatured(product)}
                    >
                      <Star
                        className={
                          product.featured ? "h-4 w-4 text-yellow-400" : "h-4 w-4"
                        }
                      />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Delete Confirmation Modal */}
      <DeleteConfirmationModal
        isOpen={deleteModal.isOpen}
        onClose={() => setDeleteModal({ isOpen: false, product: null })}
        onConfirm={handleDelete}
        isLoading={isDeleting}
        title="Delete Product"
        description="Are you sure you want to delete this product? This action cannot be undone and all product data will be permanently removed."
        itemName={deleteModal.product?.name}
        confirmText="Yes, Delete Product"
      />
    </div>
  );
}
