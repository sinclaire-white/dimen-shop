import FAQ from "@/components/faq/FAQ";
import { Button } from "@/components/ui/button";
import { Mail, MessageCircle } from "lucide-react";
import Link from "next/link";

// app/faq/page.js: FAQ page (server-rendered)
export const metadata = {
  title: 'FAQ | DimenShop',
  description: 'Quick answers to common questions about our 3D models and services.',
};

const faqItems = [
  {
    question: 'What is DimenShop?',
    answer: 'DimenShop is a premium marketplace for high-quality 3D models used in game development, architecture, animation, and 3D printing.',
  },
  {
    question: 'What file formats do you support?',
    answer: 'We support FBX, OBJ, BLEND, STL, 3MF, and other major 3D formats. Each model listing shows available formats.',
  },
  {
    question: 'Can I use models commercially?',
    answer: 'Yes, all purchases include a commercial license for personal and commercial projects. You cannot resell the original files.',
  },
  {
    question: 'Do you offer refunds?',
    answer: 'We offer refunds only for corrupt files or if the product doesn\'t match its description due to the digital nature of our products.',
  },
  {
    question: 'Are models optimized for 3D printing?',
    answer: 'Many models are specifically designed for 3D printing with STL/3MF files. Look for the "3D Printable" tag on product pages.',
  },
  {
    question: 'What software do I need?',
    answer: 'Our models work with Blender, Maya, 3ds Max, Unity, Unreal Engine, and most 3D software. Requirements are listed per product.',
  },
  {
    question: 'Do you offer technical support?',
    answer: 'Yes, our support team helps with compatibility issues, import problems, and technical questions about our models.',
  },
  {
    question: 'Can I request custom models?',
    answer: 'Yes! We offer custom modeling services. Contact us with your project requirements for a quote.',
  },
];

export default function FAQPage() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="mt-4 md:mt-8">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            FAQ
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Quick answers to common questions about our 3D models and services.
          </p>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-5 md:py-10 lg:py-20">
        <div className="container mx-auto px-4 max-w-4xl">
          <FAQ faqItems={faqItems} />
        </div>
      </section>

      {/* CTA Section */}
      <section className="mb-5 md:mb-10 bg-muted/30">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-6">Still Need Help?</h2>
          <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
            Cannot find your answer? Our support team is ready to assist you.
          </p>
          <div className="flex gap-4 justify-center">
            <Link href="/contact">
              <Button size="lg">
                <MessageCircle className="mr-2 h-5 w-5" />
                Contact Support
              </Button>
            </Link>
            <a href="mailto:support@dimenshop.com">
              <Button size="lg" variant="outline">
                <Mail className="mr-2 h-5 w-5" />
                Email Us
              </Button>
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}