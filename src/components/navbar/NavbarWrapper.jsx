// components/navbar/NavbarWrapper.jsx
import clientPromise from '@/lib/mongodb';
import Navbar from './Navbar';

// Server component to fetch categories
async function getCategories() {
  try {
    const client = await clientPromise;
    const db = client.db('dimenshopdb');
    const collection = db.collection('categories');
    
    const categories = await collection
      .find({})
      .sort({ createdAt: -1 })
      .limit(20)
      .toArray();
    
    // Convert MongoDB ObjectIds to strings for serialization
    return categories.map(category => ({
      ...category,
      _id: category._id.toString(),
    }));
  } catch (error) {
    console.error('Failed to fetch categories:', error);
    return [];
  }
}

// Server-side navbar component with SSR categories
export default async function NavbarWrapper() {
  const categories = await getCategories();
  
  return <Navbar initialCategories={categories} />;
}