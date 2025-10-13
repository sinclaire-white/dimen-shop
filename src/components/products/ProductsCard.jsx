import UnifiedProductCard from '@/components/products/UnifiedProductCard';

export default function ProductsCard({ product }) {
  return (
    <UnifiedProductCard
      product={product}
      showBadge={product.featured}
      badge="Featured"
      badgeColor="bg-primary text-primary-foreground"
      showFavorites={true}
    />
  );
}
