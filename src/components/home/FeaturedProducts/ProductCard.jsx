// src/components/home/FeaturedProducts/ProductCard.jsx

import UnifiedProductCard from '@/components/products/UnifiedProductCard';

export default function ProductCard({ product, index }) {
  return (
    <UnifiedProductCard
      product={product}
      showBadge={true}
      badge="Featured"
      badgeColor="bg-primary text-primary-foreground"
      className="group"
      showFavorites={true}
    />
  );
}
