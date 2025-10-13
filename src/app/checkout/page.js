import CheckoutClient from '@/components/checkout/CheckoutClient';

export const metadata = {
  title: 'Checkout | DimenShop',
  description: 'Complete your order and provide shipping details.',
  openGraph: {
    title: 'Checkout | DimenShop',
    description: 'Complete your order and provide shipping details.',
    type: 'website',
  },
};

export default function CheckoutPage() {
  return <CheckoutClient />;
}