'use client';

import Link from 'next/link';
import Image from 'next/image';

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="w-full border-t border-muted bg-background text-muted-foreground">
      {/* Use the same container sizing/padding as other components */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="flex flex-col gap-4">
            <Link href="/" className="flex items-center gap-3">
              {/* replace with <Image /> logo if available */}
              <div className="rounded-md bg-primary/10 dark:bg-primary/20 w-10 h-10 flex items-center justify-center">
                <span className="font-bold text-primary">D</span>
              </div>
              <span className="text-lg font-semibold text-foreground">DimenShop</span>
            </Link>
            <p className="text-sm text-muted-foreground max-w-xs">
              High‑quality, print‑ready 3D models and a community‑first marketplace for creators.
            </p>

            <div className="flex items-center gap-3 mt-2">
              <a
                href="https://wa.me/1234567890"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="WhatsApp"
                className="p-2 rounded hover:bg-muted/50 transition"
              >
                {/* WhatsApp icon */}
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                  <path d="M20.52 3.48A11.9 11.9 0 0 0 12 .5C5.73.5.99 5.24.99 11.5c0 2.03.53 3.9 1.46 5.57L.5 23.5l6.7-1.77a11.92 11.92 0 0 0 4.8.97c6.27 0 11.01-4.74 11.01-11.01 0-2.95-1.16-5.73-3.49-7.19zM12 21c-1.43 0-2.83-.37-4.05-1.07l-.29-.17-3.98 1.05 1.05-3.88-.17-.29A9.01 9.01 0 0 1 3 11.5C3 6.25 7.25 2 12 2c2.4 0 4.66.94 6.35 2.64A8.98 8.98 0 0 1 21 11.5c0 4.97-4.03 9-9 9z"/>
                  <path d="M17.27 14.02c-.28-.14-1.67-.82-1.93-.91-.26-.08-.45-.14-.64.14s-.73.91-.9 1.1c-.16.19-.32.21-.6.07-.27-.14-1.13-.42-2.15-1.32-.8-.71-1.34-1.58-1.5-1.85-.16-.27-.02-.41.12-.55.12-.12.27-.32.4-.48.13-.16.17-.27.26-.45.09-.18.05-.34-.02-.48-.08-.14-.64-1.54-.88-2.12-.23-.55-.47-.48-.64-.49l-.55-.01c-.18 0-.47.07-.72.34-.25.27-.95.92-.95 2.24 0 1.31.98 2.58 1.12 2.76.14.18 1.93 2.95 4.68 4.02 1.33.55 1.88.74 2.53.95.64.21 1.23.18 1.69.11.52-.08 1.67-.68 1.9-1.34.23-.66.23-1.22.16-1.34-.07-.12-.26-.18-.54-.31z"/>
                </svg>
              </a>

              <a
                href="https://www.instagram.com/yourhandle"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
                className="p-2 rounded hover:bg-muted/50 transition"
              >
                {/* Instagram icon */}
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                  <path d="M7 2h10a5 5 0 0 1 5 5v10a5 5 0 0 1-5 5H7a5 5 0 0 1-5-5V7a5 5 0 0 1 5-5zm10 2H7A3 3 0 0 0 4 7v10a3 3 0 0 0 3 3h10a3 3 0 0 0 3-3V7a3 3 0 0 0-3-3z"/>
                  <path d="M12 7a5 5 0 1 1 0 10 5 5 0 0 1 0-10zm0 2a3 3 0 1 0 .001 6.001A3 3 0 0 0 12 9z"/>
                  <circle cx="17.5" cy="6.5" r="1.2"/>
                </svg>
              </a>

              <a
                href="https://www.facebook.com/yourpage"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Facebook"
                className="p-2 rounded hover:bg-muted/50 transition"
              >
                {/* Facebook icon */}
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                  <path d="M22 12.07C22 6.48 17.52 2 11.93 2S2 6.48 2 12.07c0 4.99 3.66 9.13 8.44 9.93v-7.03H7.9v-2.9h2.54V9.41c0-2.5 1.49-3.89 3.78-3.89 1.1 0 2.25.2 2.25.2v2.48h-1.27c-1.25 0-1.64.78-1.64 1.58v1.9h2.79l-.45 2.9h-2.34v7.03C18.34 21.2 22 17.06 22 12.07z"/>
                </svg>
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-sm font-semibold text-foreground mb-3">Quick Links</h4>
            <ul className="flex flex-col gap-2 text-sm">
              <li><Link href="/products" className="hover:text-foreground transition">All Products</Link></li>
              <li><Link href="/categories" className="hover:text-foreground transition">Categories</Link></li>
              <li><Link href="/about" className="hover:text-foreground transition">About Us</Link></li>
              <li><Link href="/contact" className="hover:text-foreground transition">Contact</Link></li>
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h4 className="text-sm font-semibold text-foreground mb-3">Resources</h4>
            <ul className="flex flex-col gap-2 text-sm">
              <li><Link href="/faq" className="hover:text-foreground transition">FAQ</Link></li>
              <li><Link href="/help" className="hover:text-foreground transition">Help Center</Link></li>
              <li><Link href="/terms" className="hover:text-foreground transition">Terms</Link></li>
              <li><Link href="/privacy" className="hover:text-foreground transition">Privacy Policy</Link></li>
            </ul>
          </div>
        </div>

        <div className="mt-8 border-t border-muted/60 pt-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="text-xs text-muted-foreground">
            © {year} DimenShop. All rights reserved.
          </div>

          <div className="flex items-center gap-4 text-xs text-muted-foreground">
            <div>Support: <a href="mailto:support@dimenshop.example" className="text-foreground hover:underline">support@dimenshop.example</a></div>
            <div className="hidden sm:block">Phone: <a href="tel:+1234567890" className="text-foreground hover:underline">+1 (234) 567-890</a></div>
          </div>
        </div>
      </div>
    </footer>
  );
}