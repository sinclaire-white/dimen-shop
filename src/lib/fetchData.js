import clientPromise from '@/lib/mongodb';

// Fetch initial data for server-side rendering
export async function fetchInitialData() {
  try {
    // Connect to MongoDB
    const client = await clientPromise;
    const db = client.db('dimenshopdb');

    // Fetch products and categories
    const [products, categories] = await Promise.all([
      db.collection('products')
        .find({})
        .limit(20)
        .toArray(),
      db.collection('categories')
        .find({})
        .toArray(),
    ]);

    // Format data for client
    const formattedProducts = products.map(product => ({
      ...product,
      _id: product._id.toString(),
      category: product.category ? product.category.toString() : null,
    }));
    const formattedCategories = categories.map(category => ({
      ...category,
      _id: category._id.toString(),
    }));

    return {
      initialProducts: formattedProducts,
      initialCategories: formattedCategories,
    };
  } catch (error) {
    console.error('Fetch initial data error:', error);
    return {
      error: 'Failed to load products and categories. Please try again later.',
    };
  }
}