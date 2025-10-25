import Link from "next/link";
import { FileText, Scale, ShieldCheck } from "lucide-react";

export const metadata = {
  title: "Terms of Service - DimenShop",
  description: "Terms and conditions for using DimenShop",
};

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b bg-muted/30">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex items-center gap-3 mb-4">
            <Scale className="w-10 h-10 text-primary" />
            <h1 className="text-4xl font-bold text-foreground">
              Terms of Service
            </h1>
          </div>
          <p className="text-muted-foreground">
            Last updated: October 26, 2025
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="prose prose-slate dark:prose-invert max-w-none">
          
          <section className="mb-10">
            <h2 className="text-2xl font-bold text-foreground mb-4 flex items-center gap-2">
              <FileText className="w-6 h-6 text-primary" />
              1. Acceptance of Terms
            </h2>
            <p className="text-muted-foreground leading-relaxed">
              By accessing and using DimenShop (&quot;the Service&quot;), you accept and agree to be bound by the terms and provision of this agreement. If you do not agree to these terms, please do not use our Service.
            </p>
          </section>

          <section className="mb-10">
            <h2 className="text-2xl font-bold text-foreground mb-4">
              2. Use License
            </h2>
            <p className="text-muted-foreground leading-relaxed mb-4">
              Permission is granted to temporarily download materials on DimenShop for personal, non-commercial transitory viewing only. This is the grant of a license, not a transfer of title, and under this license you may not:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
              <li>Modify or copy the materials</li>
              <li>Use the materials for any commercial purpose or public display</li>
              <li>Attempt to reverse engineer any software contained on DimenShop</li>
              <li>Remove any copyright or other proprietary notations from the materials</li>
              <li>Transfer the materials to another person or &quot;mirror&quot; the materials on any other server</li>
            </ul>
          </section>

          <section className="mb-10">
            <h2 className="text-2xl font-bold text-foreground mb-4">
              3. User Accounts
            </h2>
            <p className="text-muted-foreground leading-relaxed mb-4">
              When you create an account with us, you must provide accurate, complete, and current information. You are responsible for:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
              <li>Maintaining the confidentiality of your account and password</li>
              <li>Restricting access to your computer and account</li>
              <li>All activities that occur under your account</li>
              <li>Ensuring you are at least 18 years of age</li>
            </ul>
            <p className="text-muted-foreground leading-relaxed mt-4">
              We reserve the right to refuse service, terminate accounts, or remove content at our sole discretion.
            </p>
          </section>

          <section className="mb-10">
            <h2 className="text-2xl font-bold text-foreground mb-4">
              4. Products and Services
            </h2>
            <p className="text-muted-foreground leading-relaxed mb-4">
              All products and services are subject to availability. We reserve the right to:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
              <li>Limit quantities of any products or services</li>
              <li>Discontinue any product at any time</li>
              <li>Refuse any order placed through the Service</li>
              <li>Update product information and pricing without notice</li>
            </ul>
          </section>

          <section className="mb-10">
            <h2 className="text-2xl font-bold text-foreground mb-4">
              5. Pricing and Payment
            </h2>
            <p className="text-muted-foreground leading-relaxed mb-4">
              All prices are listed in the currency specified on the product page and are subject to change without notice. Payment must be received before products are shipped. We accept various payment methods as displayed at checkout.
            </p>
            <p className="text-muted-foreground leading-relaxed">
              We reserve the right to refuse or cancel any order for any reason including availability, errors in product or pricing information, or suspected fraud.
            </p>
          </section>

          <section className="mb-10">
            <h2 className="text-2xl font-bold text-foreground mb-4">
              6. Intellectual Property
            </h2>
            <p className="text-muted-foreground leading-relaxed mb-4">
              All content on DimenShop, including but not limited to text, graphics, logos, images, and software, is the property of DimenShop or its content suppliers and is protected by copyright laws.
            </p>
            <p className="text-muted-foreground leading-relaxed">
              The 3D designs and models are for personal use only. Commercial use, redistribution, or resale of our digital files is strictly prohibited without explicit written permission.
            </p>
          </section>

          <section className="mb-10">
            <h2 className="text-2xl font-bold text-foreground mb-4">
              7. Prohibited Uses
            </h2>
            <p className="text-muted-foreground leading-relaxed mb-4">
              You may not use our Service:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
              <li>For any unlawful purpose or to solicit others to perform unlawful acts</li>
              <li>To violate any international, federal, provincial, or state regulations, rules, laws, or local ordinances</li>
              <li>To infringe upon or violate our intellectual property rights or the intellectual property rights of others</li>
              <li>To harass, abuse, insult, harm, defame, slander, disparage, intimidate, or discriminate</li>
              <li>To submit false or misleading information</li>
              <li>To upload or transmit viruses or any other type of malicious code</li>
              <li>To spam, phish, pharm, pretext, spider, crawl, or scrape</li>
            </ul>
          </section>

          <section className="mb-10">
            <h2 className="text-2xl font-bold text-foreground mb-4">
              8. Limitation of Liability
            </h2>
            <p className="text-muted-foreground leading-relaxed">
              In no event shall DimenShop or its suppliers be liable for any damages (including, without limitation, damages for loss of data or profit, or due to business interruption) arising out of the use or inability to use the materials on DimenShop, even if DimenShop or a DimenShop authorized representative has been notified orally or in writing of the possibility of such damage.
            </p>
          </section>

          <section className="mb-10">
            <h2 className="text-2xl font-bold text-foreground mb-4">
              9. Governing Law
            </h2>
            <p className="text-muted-foreground leading-relaxed">
              These terms and conditions are governed by and construed in accordance with the laws of your jurisdiction, and you irrevocably submit to the exclusive jurisdiction of the courts in that location.
            </p>
          </section>

          <section className="mb-10">
            <h2 className="text-2xl font-bold text-foreground mb-4">
              10. Changes to Terms
            </h2>
            <p className="text-muted-foreground leading-relaxed">
              We reserve the right to modify these terms at any time. We will notify users of any material changes by posting the new Terms of Service on this page. Your continued use of the Service after any such changes constitutes your acceptance of the new Terms of Service.
            </p>
          </section>

          <section className="mb-10">
            <h2 className="text-2xl font-bold text-foreground mb-4">
              11. Contact Information
            </h2>
            <p className="text-muted-foreground leading-relaxed mb-4">
              If you have any questions about these Terms of Service, please contact us:
            </p>
            <ul className="space-y-2 text-muted-foreground">
              <li>Email: <a href="mailto:legal@dimenshop.example" className="text-primary hover:underline">legal@dimenshop.example</a></li>
              <li>Phone: +1 (234) 567-890</li>
              <li>Address: Your Business Address Here</li>
            </ul>
          </section>

        </div>

        {/* Related Links */}
        <div className="mt-12 pt-8 border-t">
          <h3 className="text-lg font-semibold text-foreground mb-4">Related Documents</h3>
          <div className="flex flex-wrap gap-4">
            <Link
              href="/privacy"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border bg-card hover:bg-accent transition-colors"
            >
              <ShieldCheck className="w-4 h-4" />
              Privacy Policy
            </Link>
            <Link
              href="/faq"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border bg-card hover:bg-accent transition-colors"
            >
              <FileText className="w-4 h-4" />
              FAQ
            </Link>
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border bg-card hover:bg-accent transition-colors"
            >
              <FileText className="w-4 h-4" />
              Contact Us
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
