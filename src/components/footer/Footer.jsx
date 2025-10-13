// components/Footer.jsx
'use client';

import Link from 'next/link';
import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

export default function Footer() {
  const year = new Date().getFullYear();
  const [activeModal, setActiveModal] = useState(null);

  const policyContent = {
    delivery: {
      title: "Delivery Policy",
      content: (
        <div className="space-y-4">
          <h4 className="font-semibold">Delivery Areas</h4>
          <p>We provide delivery services across Bangladesh including Dhaka, Chittagong, Sylhet, Rajshahi, Khulna, Barisal, and Rangpur divisions.</p>
          
          <h4 className="font-semibold">Delivery Timeframes</h4>
          <ul className="list-disc pl-6 space-y-1">
            <li><strong>Dhaka Metro:</strong> 1-2 business days</li>
            <li><strong>Major Cities:</strong> 2-4 business days</li>
            <li><strong>Other Areas:</strong> 4-7 business days</li>
          </ul>
          
          <h4 className="font-semibold">Delivery Charges</h4>
          <ul className="list-disc pl-6 space-y-1">
            <li>Inside Dhaka: ৳60</li>
            <li>Outside Dhaka: ৳120</li>
            <li>Free delivery on orders above ৳2000</li>
          </ul>
          
          <h4 className="font-semibold">Delivery Process</h4>
          <p>Our courier partners will contact you before delivery. Please ensure someone is available to receive the package. Valid ID may be required upon delivery.</p>
        </div>
      )
    },
    return: {
      title: "Return Policy",
      content: (
        <div className="space-y-4">
          <h4 className="font-semibold">Return Period</h4>
          <p>You may return products within 7 days of delivery for a full refund, provided the items are in original condition.</p>
          
          <h4 className="font-semibold">Return Conditions</h4>
          <ul className="list-disc pl-6 space-y-1">
            <li>Products must be unused and in original packaging</li>
            <li>Digital files cannot be returned once downloaded</li>
            <li>Custom printed items are non-returnable</li>
            <li>Return shipping costs are borne by the customer</li>
          </ul>
          
          <h4 className="font-semibold">Return Process</h4>
          <p>Contact our customer service at support@dimenshop.example or call +880-1234-567890 to initiate a return. We'll provide you with return instructions and tracking information.</p>
          
          <h4 className="font-semibold">Refund Timeline</h4>
          <p>Refunds will be processed within 5-7 business days after we receive and inspect the returned items. Refunds will be credited to your original payment method.</p>
        </div>
      )
    },
    terms: {
      title: "Terms and Conditions",
      content: (
        <div className="space-y-4">
          <h4 className="font-semibold">Acceptance of Terms</h4>
          <p>By accessing and using DimenShop, you accept and agree to be bound by the terms and provision of this agreement.</p>
          
          <h4 className="font-semibold">Use License</h4>
          <p>Permission is granted to temporarily download one copy of the materials on DimenShop for personal, non-commercial transitory viewing only.</p>
          
          <h4 className="font-semibold">User Account</h4>
          <ul className="list-disc pl-6 space-y-1">
            <li>You are responsible for maintaining account confidentiality</li>
            <li>You must provide accurate and complete information</li>
            <li>You must be at least 18 years old to create an account</li>
            <li>One person may not maintain multiple accounts</li>
          </ul>
          
          <h4 className="font-semibold">Prohibited Uses</h4>
          <ul className="list-disc pl-6 space-y-1">
            <li>Reselling or redistributing our digital products</li>
            <li>Reverse engineering our 3D models</li>
            <li>Using products for illegal or unauthorized purposes</li>
            <li>Violating any laws in your jurisdiction</li>
          </ul>
          
          <h4 className="font-semibold">Governing Law</h4>
          <p>These terms and conditions are governed by and construed in accordance with the laws of Bangladesh.</p>
        </div>
      )
    },
    payment: {
      title: "Payment Policy",
      content: (
        <div className="space-y-4">
          <h4 className="font-semibold">Accepted Payment Methods</h4>
          <ul className="list-disc pl-6 space-y-1">
            <li><strong>Mobile Banking:</strong> bKash, Nagad, Rocket</li>
            <li><strong>Bank Transfer:</strong> All major banks in Bangladesh</li>
            <li><strong>Credit/Debit Cards:</strong> Visa, MasterCard, American Express</li>
            <li><strong>Cash on Delivery:</strong> Available in selected areas</li>
          </ul>
          
          <h4 className="font-semibold">Payment Security</h4>
          <p>All online transactions are secured with 256-bit SSL encryption. We do not store your payment information on our servers.</p>
          
          <h4 className="font-semibold">Pricing</h4>
          <ul className="list-disc pl-6 space-y-1">
            <li>All prices are listed in Bangladeshi Taka (BDT)</li>
            <li>Prices include applicable VAT and taxes</li>
            <li>Prices are subject to change without notice</li>
            <li>Promotional prices are valid for limited time</li>
          </ul>
          
          <h4 className="font-semibold">Payment Processing</h4>
          <p>Orders are processed immediately upon payment confirmation. For bank transfers, please allow 2-4 hours for verification.</p>
          
          <h4 className="font-semibold">Failed Payments</h4>
          <p>If payment fails, your order will be cancelled automatically. You may retry payment or contact our support team for assistance.</p>
        </div>
      )
    }
  };

  const openModal = (modalType) => {
    setActiveModal(modalType);
  };

  const closeModal = () => {
    setActiveModal(null);
  };

  return (
    <footer className="w-full border-t bg-muted/30 dark:bg-muted/20">
      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 lg:gap-12">
          {/* Brand Section */}
          <div className="lg:col-span-2">
            <Link href="/" className="inline-flex items-center gap-3 mb-4">
              <div className="rounded-lg bg-primary w-10 h-10 flex items-center justify-center">
                <span className="font-bold text-primary-foreground text-lg">D</span>
              </div>
              <span className="text-xl font-bold text-foreground">DimenShop</span>
            </Link>
            
            <p className="text-muted-foreground max-w-md mb-6 leading-relaxed">
              Your premier destination for high-quality 3D printed products. From miniatures to functional prints, 
              we bring digital designs to life with precision and creativity.
            </p>

            {/* Social Links */}
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-foreground mr-2">Follow us:</span>
              <a 
                href="https://wa.me/1234567890" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="inline-flex items-center justify-center w-9 h-9 rounded-lg bg-background hover:bg-accent transition-colors group"
                aria-label="WhatsApp"
              >
                <svg className="w-4 h-4 text-muted-foreground group-hover:text-foreground transition-colors" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M20.52 3.48A11.9 11.9 0 0 0 12 .5C5.73.5.99 5.24.99 11.5c0 2.03.53 3.9 1.46 5.57L.5 23.5l6.7-1.77a11.92 11.92 0 0 0 4.8.97c6.27 0 11.01-4.74 11.01-11.01 0-2.95-1.16-5.73-3.49-7.19zM12 21c-1.43 0-2.83-.37-4.05-1.07l-.29-.17-3.98 1.05 1.05-3.88-.17-.29A9.01 9.01 0 0 1 3 11.5C3 6.25 7.25 2 12 2c2.4 0 4.66.94 6.35 2.64A8.98 8.98 0 0 1 21 11.5c0 4.97-4.03 9-9 9z"/>
                </svg>
              </a>

              <a 
                href="https://www.instagram.com/yourhandle" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="inline-flex items-center justify-center w-9 h-9 rounded-lg bg-background hover:bg-accent transition-colors group"
                aria-label="Instagram"
              >
                <svg className="w-4 h-4 text-muted-foreground group-hover:text-foreground transition-colors" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M7 2h10a5 5 0 0 1 5 5v10a5 5 0 0 1-5 5H7a5 5 0 0 1-5-5V7a5 5 0 0 1 5-5zm10 2H7A3 3 0 0 0 4 7v10a3 3 0 0 0 3 3h10a3 3 0 0 0 3-3V7a3 3 0 0 0-3-3z"/>
                  <path d="M12 7a5 5 0 1 1 0 10 5 5 0 0 1 0-10zm0 2a3 3 0 1 0 .001 6.001A3 3 0 0 0 12 9z"/>
                  <circle cx="17.5" cy="6.5" r="1.2"/>
                </svg>
              </a>

              <a 
                href="https://www.facebook.com/yourpage" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="inline-flex items-center justify-center w-9 h-9 rounded-lg bg-background hover:bg-accent transition-colors group"
                aria-label="Facebook"
              >
                <svg className="w-4 h-4 text-muted-foreground group-hover:text-foreground transition-colors" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M22 12.07C22 6.48 17.52 2 11.93 2S2 6.48 2 12.07c0 4.99 3.66 9.13 8.44 9.93v-7.03H7.9v-2.9h2.54V9.41c0-2.5 1.49-3.89 3.78-3.89 1.1 0 2.25.2 2.25.2v2.48h-1.27c-1.25 0-1.64.78-1.64 1.58v1.9h2.79l-.45 2.9h-2.34v7.03C18.34 21.2 22 17.06 22 12.07z"/>
                </svg>
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold text-foreground mb-4">Quick Links</h4>
            <ul className="space-y-3">
              <li>
                <Link href="/products" className="text-muted-foreground hover:text-foreground transition-colors duration-200">
                  All Products
                </Link>
              </li>
              <li>
                <Link href="/categories" className="text-muted-foreground hover:text-foreground transition-colors duration-200">
                  Categories
                </Link>
              </li>
              <li>
                <Link href="/about" className="text-muted-foreground hover:text-foreground transition-colors duration-200">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-muted-foreground hover:text-foreground transition-colors duration-200">
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* Support & Resources */}
          <div>
            <h4 className="font-semibold text-foreground mb-4">Support</h4>
            <ul className="space-y-3">
              <li>
                <Link href="/faq" className="text-muted-foreground hover:text-foreground transition-colors duration-200">
                  FAQ
                </Link>
              </li>
              <li>
                <Link href="/help" className="text-muted-foreground hover:text-foreground transition-colors duration-200">
                  Help Center
                </Link>
              </li>
              <li>
                <Link href="/terms" className="text-muted-foreground hover:text-foreground transition-colors duration-200">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="text-muted-foreground hover:text-foreground transition-colors duration-200">
                  Privacy Policy
                </Link>
              </li>
            </ul>
          </div>

          {/* Policies */}
          <div>
            <h4 className="font-semibold text-foreground mb-4">Policies</h4>
            <ul className="space-y-3">
              <li>
                <button 
                  onClick={() => openModal('delivery')}
                  className="text-muted-foreground hover:text-foreground transition-colors duration-200 text-left"
                >
                  Delivery Policy
                </button>
              </li>
              <li>
                <button 
                  onClick={() => openModal('return')}
                  className="text-muted-foreground hover:text-foreground transition-colors duration-200 text-left"
                >
                  Return Policy
                </button>
              </li>
              <li>
                <button 
                  onClick={() => openModal('terms')}
                  className="text-muted-foreground hover:text-foreground transition-colors duration-200 text-left"
                >
                  Terms & Conditions
                </button>
              </li>
              <li>
                <button 
                  onClick={() => openModal('payment')}
                  className="text-muted-foreground hover:text-foreground transition-colors duration-200 text-left"
                >
                  Payment Policy
                </button>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Section */}
      <div className="border-t bg-background/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="text-sm text-muted-foreground">
              © {year} DimenShop. All rights reserved.
            </div>

            <div className="flex flex-col sm:flex-row gap-4 text-sm">
              <a 
                href="mailto:support@dimenshop.example" 
                className="text-muted-foreground hover:text-foreground transition-colors duration-200"
              >
                support@dimenshop.example
              </a>
              <a 
                href="tel:+1234567890" 
                className="text-muted-foreground hover:text-foreground transition-colors duration-200"
              >
                +1 (234) 567-890
              </a>
            </div>
          </div>
        </div>
      </div>
      
      {/* Policy Modals */}
      <Dialog open={!!activeModal} onOpenChange={closeModal}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{activeModal && policyContent[activeModal]?.title}</DialogTitle>
            <DialogDescription>
              Please read our policy carefully. If you have any questions, feel free to contact our support team.
            </DialogDescription>
          </DialogHeader>
          <div className="mt-4 text-sm text-muted-foreground">
            {activeModal && policyContent[activeModal]?.content}
          </div>
        </DialogContent>
      </Dialog>
    </footer>
  );
}