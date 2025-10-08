import ContactForm from "@/components/contact/ContactForm";
import { Card, CardContent } from "@/components/ui/card";
import { Clock, Mail, MapPin, Phone } from "lucide-react";

// app/contact/page.js:
export const metadata = {
  title: 'Contact Us | DimenShop',
  description: 'Get in touch with DimenShop support team. Contact us for questions about 3D models, technical support, or custom project inquiries.',
};

const contactInfo = [
  { icon: Mail, title: 'Email', detail: 'support@dimenshop.com', desc: 'We respond within 24 hours' },
  { icon: Phone, title: 'Phone', detail: '+1 (555) 123-4567', desc: 'Mon-Fri, 9AM-6PM EST' },
  { icon: MapPin, title: 'Office', detail: '123 3D Street', desc: 'Tech City, TC 10101' },
  { icon: Clock, title: 'Live Chat', detail: '24/7 Available', desc: 'Instant support' },
];

export default function Contact() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="mt-4 md:mt-8">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Contact Us
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Have questions? We are here to help. Get in touch with our team.
          </p>
        </div>
      </section>

      {/* Contact Content */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 max-w-6xl mx-auto">
            {/* Contact Form */}
            <ContactForm />

            {/* Contact Information */}
            <div className="space-y-6">
              <h2 className="text-2xl font-bold mb-6">Get in Touch</h2>
              <div className="grid gap-4">
                {contactInfo.map((item) => {
                  const Icon = item.icon;
                  return (
                    <Card key={item.title}>
                      <CardContent className="pt-6">
                        <div className="flex items-start gap-4">
                          <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                            <Icon className="h-6 w-6 text-primary" />
                          </div>
                          <div>
                            <h3 className="font-semibold text-lg">{item.title}</h3>
                            <p className="text-primary font-medium">{item.detail}</p>
                            <p className="text-sm text-muted-foreground mt-1">{item.desc}</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}