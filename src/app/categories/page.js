import Link from "next/link";
import clientPromise from "@/lib/mongodb";

export const metadata = {
  title: "Categories - DimenShop",
  description: "Browse all product categories at DimenShop",
};

async function getCategories() {
  try {
    const client = await clientPromise;
    const db = client.db("dimenshopdb");
    
    const categories = await db.collection("categories")
      .find({})
      .sort({ name: 1 })
      .toArray();
    
    return categories.map(cat => ({
      _id: cat._id.toString(),
      name: cat.name,
      slug: cat.slug,
      description: cat.description || "",
      image: cat.image || "/placeholder-category.png",
    }));
  } catch (error) {
    console.error("Error fetching categories:", error);
    return [];
  }
}

export default async function CategoriesPage() {
  const categories = await getCategories();

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b bg-muted/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <h1 className="text-4xl font-bold text-foreground mb-4">
            Product Categories
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl">
            Explore our diverse range of 3D printed products organized by category. 
            Find exactly what you&apos;re looking for.
          </p>
        </div>
      </div>

      {/* Categories Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {categories.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-muted-foreground text-lg">No categories available yet.</p>
            <Link 
              href="/products" 
              className="inline-block mt-4 px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
            >
              Browse All Products
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {categories.map((category) => (
              <Link
                key={category._id}
                href={`/categories/${category._id}`}
                className="group block rounded-xl overflow-hidden border bg-card hover:shadow-lg transition-all duration-300"
              >
                <div className="p-6">
                  <h3 className="text-xl font-semibold text-foreground mb-2 group-hover:text-primary transition-colors">
                    {category.name}
                  </h3>
                  {category.description && (
                    <p className="text-muted-foreground line-clamp-3">
                      {category.description}
                    </p>
                  )}
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
