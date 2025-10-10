// components/Footer.jsx
'use client';

import Link from 'next/link';
import { Facebook, Twitter, Instagram, Youtube, Mail } from 'lucide-react';

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-background border-t border-muted">
      <div className="container mx-auto px-4 py-12">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
          
          {/* Brand Section */}
          <div className="lg:col-span-1">
            <Link href="/" className="flex items-center space-x-2 mb-4">
              <div className="w-8 h-8 bg-gradient-to-br from-primary to-accent rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">3D</span>
              </div>
              <span className="text-xl font-bold text-foreground">DimenShop</span>
            </Link>
            <p className="text-muted-foreground mb-4 max-w-xs">
              Premium 3D models for games, architecture, animation, and 3D printing. 
              Bring your imagination to life with our digital assets.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                <Facebook className="h-5 w-5" />
              </a>
              <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                <Twitter className="h-5 w-5" />
              </a>
              <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                <Instagram className="h-5 w-5" />
              </a>
              <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                <Youtube className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Products Section */}
          <div>
            <h3 className="font-semibold text-foreground mb-4">Products</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/products?category=characters" className="text-muted-foreground hover:text-primary transition-colors">
                  3D Characters
                </Link>
              </li>
              <li>
                <Link href="/products?category=environment" className="text-muted-foreground hover:text-primary transition-colors">
                  Environment Packs
                </Link>
              </li>
              <li>
                <Link href="/products?category=props" className="text-muted-foreground hover:text-primary transition-colors">
                  Props & Assets
                </Link>
              </li>
              <li>
                <Link href="/products?category=vehicles" className="text-muted-foreground hover:text-primary transition-colors">
                  Vehicles
                </Link>
              </li>
              <li>
                <Link href="/products?category=weapons" className="text-muted-foreground hover:text-primary transition-colors">
                  Weapons & Armor
                </Link>
              </li>
            </ul>
          </div>

          {/* Support Section */}
          <div>
            <h3 className="font-semibold text-foreground mb-4">Support</h3>
            <ul className="space-y-2">
             
              <li>
                <Link href="/contact" className="text-muted-foreground hover:text-primary transition-colors">
                  Contact Us
                </Link>
              </li>
              <li>
                <Link href="/shipping" className="text-muted-foreground hover:text-primary transition-colors">
                  Shipping Info
                </Link>
              </li>
              <li>
                <Link href="/returns" className="text-muted-foreground hover:text-primary transition-colors">
                  Returns
                </Link>
              </li>
              <li>
                <Link href="/faq" className="text-muted-foreground hover:text-primary transition-colors">
                  FAQ
                </Link>
              </li>
            </ul>
          </div>

          {/* Company Section */}
          <div>
            <h3 className="font-semibold text-foreground mb-4">Company</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/about" className="text-muted-foreground hover:text-primary transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/careers" className="text-muted-foreground hover:text-primary transition-colors">
                  Careers
                </Link>
              </li>
              <li>
                <Link href="/blog" className="text-muted-foreground hover:text-primary transition-colors">
                  Blog
                </Link>
              </li>
             
            </ul>
          </div>
        </div>

       

        {/* Bottom Footer */}
        <div className="border-t border-muted pt-2">
          
            <div className="text-center">
              <p className="text-muted-foreground text-sm">
                © {currentYear} DimenShop. All rights reserved.
              </p>
            </div>
            
            
          
        </div>
      </div>
    </footer>
  );
}

export default Footer;