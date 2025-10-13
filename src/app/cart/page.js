import CartClient from '@/components/cart/CartClient';

export const metadata = {
  title: 'Shopping Cart | DimenShop',
  description: 'Review your selected 3D printed products and proceed to checkout.',
  openGraph: {
    title: 'Shopping Cart | DimenShop',
    description: 'Review your selected products and proceed to checkout.',
    type: 'website',
  },
};

export default function CartPage() {
  return <CartClient />;
}