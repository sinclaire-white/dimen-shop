import { CategoriesCard } from './CategoriesCard';

async function fetchCategories() {
  const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';
  const response = await fetch(`${baseUrl}/api/categories`, {
    cache: 'no-store',
  });
  if (!response.ok) {
    throw new Error('Failed to fetch categories');
  }
  return response.json();
}

export default async function Categories() {
  try {
    const categories = await fetchCategories();
    return <CategoriesCard categories={categories} />;
  } catch (error) {
    console.error('Error fetching categories:', error);
    return <CategoriesCard categories={[]} />;
  }
}