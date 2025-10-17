// app/categories/[id]/page.js

import { notFound } from 'next/navigation';
import clientPromise from '@/lib/mongodb';
import { ObjectId } from 'mongodb';
import CategoryPageClient from '@/components/categories/CategoryPageClient';

// Enable ISR - Revalidate every 24 hours (1 day)
export const revalidate = 86400;

// Generate dynamic metadata for SEO
export async function generateMetadata({ params }) {
  const { id } = await params;
  const category = await getCategory(id);
  
  if (!category) {
    return {
      title: 'Category Not Found - DimenShop',
      description: 'The requested category could not be found.',
    };
  }

  return {
    title: `${category.name} - DimenShop 3D Printed Products`,
    description: category.description || `Browse our collection of ${category.name} 3D printed products. High-quality custom prints delivered fast.`,
    keywords: `3D printed ${category.name}, ${category.name} products, custom ${category.name}, buy ${category.name}, 3D printing`,
    openGraph: {
      title: `${category.name} - DimenShop`,
      description: category.description || `Browse our collection of ${category.name} 3D printed products.`,
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: `${category.name} - DimenShop`,
      description: category.description || `Browse our collection of ${category.name} 3D printed products.`,
    },
  };
}

// Fetch category data
async function getCategory(id) {
  try {
    if (!ObjectId.isValid(id)) {
      return null;
    }

    const client = await clientPromise;
    const db = client.db('dimenshopdb');
    
    const category = await db.collection('categories').findOne({
      _id: new ObjectId(id)
    });
    
    if (!category) {
      return null;
    }
    
    return {
      ...category,
      _id: category._id.toString(),
    };
  } catch (error) {
    console.error('Error fetching category:', error);
    return null;
  }
}

// Fetch products for category
async function getCategoryProducts(categoryId) {
  try {
    const client = await clientPromise;
    const db = client.db('dimenshopdb');
    
    console.log('Fetching products for category:', categoryId);
    
    // Products store category as a string ID, not ObjectId
    const products = await db.collection('products')
      .find({ category: categoryId })
      .sort({ featured: -1, createdAt: -1 })
      .toArray();
    
    console.log('Found products:', products.length);
    
    return products.map(product => ({
      ...product,
      _id: product._id.toString(),
      category: typeof product.category === 'string' ? product.category : product.category.toString(),
    }));
  } catch (error) {
    console.error('Error fetching products:', error);
    return [];
  }
}

// Server Component
export default async function CategoryPage({ params }) {
  const { id } = await params;
  const category = await getCategory(id);
  
  if (!category) {
    notFound();
  }
  
  const products = await getCategoryProducts(id);
  
  return <CategoryPageClient category={category} products={products} />;
}