import Link from "next/link";
import { 
  HelpCircle, 
  MessageCircle, 
  Mail, 
  Phone, 
  ShoppingCart, 
  Package, 
  CreditCard, 
  RefreshCw,
  User,
  Shield
} from "lucide-react";

export const metadata = {
  title: "Help Center - DimenShop",
  description: "Get help with your orders, payments, and more at DimenShop",
};

export default function HelpPage() {
  const helpTopics = [
    {
      icon: ShoppingCart,
      title: "Ordering & Shopping",
      questions: [
        { q: "How do I place an order?", link: "#ordering" },
        { q: "Can I modify my order after placing it?", link: "#modify-order" },
        { q: "How do I track my order?", link: "#track-order" },
      ]
    },
    {
      icon: CreditCard,
      title: "Payment & Billing",
      questions: [
        { q: "What payment methods do you accept?", link: "#payment-methods" },
        { q: "Is my payment information secure?", link: "#payment-security" },
        { q: "Can I get a refund?", link: "#refunds" },
      ]
    },
    {
      icon: Package,
      title: "Shipping & Delivery",
      questions: [
        { q: "What are the delivery charges?", link: "#delivery-charges" },
        { q: "How long does delivery take?", link: "#delivery-time" },
        { q: "Do you ship internationally?", link: "#international-shipping" },
      ]
    },
    {
      icon: RefreshCw,
      title: "Returns & Exchanges",
      questions: [
        { q: "What is your return policy?", link: "#return-policy" },
        { q: "How do I initiate a return?", link: "#initiate-return" },
        { q: "When will I receive my refund?", link: "#refund-timeline" },
      ]
    },
    {
      icon: User,
      title: "Account & Profile",
      questions: [
        { q: "How do I create an account?", link: "#create-account" },
        { q: "I forgot my password, what should I do?", link: "#forgot-password" },
        { q: "How do I update my profile?", link: "#update-profile" },
      ]
    },
    {
      icon: Shield,
      title: "Security & Privacy",
      questions: [
        { q: "How is my personal data protected?", link: "#data-protection" },
        { q: "What information do you collect?", link: "#data-collection" },
        { q: "Can I delete my account?", link: "#delete-account" },
      ]
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b bg-gradient-to-br from-primary/10 via-background to-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
          <HelpCircle className="w-16 h-16 mx-auto mb-4 text-primary" />
          <h1 className="text-4xl font-bold text-foreground mb-4">
            How Can We Help You?
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Find answers to common questions or get in touch with our support team
          </p>
        </div>
      </div>

      {/* Quick Contact */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
          <Link
            href="/contact"
            className="flex items-center gap-4 p-6 rounded-xl border bg-card hover:shadow-lg transition-all duration-300 group"
          >
            <MessageCircle className="w-8 h-8 text-primary group-hover:scale-110 transition-transform" />
            <div>
              <h3 className="font-semibold text-foreground mb-1">Live Chat</h3>
              <p className="text-sm text-muted-foreground">Chat with our team</p>
            </div>
          </Link>

          <a
            href="mailto:support@dimenshop.example"
            className="flex items-center gap-4 p-6 rounded-xl border bg-card hover:shadow-lg transition-all duration-300 group"
          >
            <Mail className="w-8 h-8 text-primary group-hover:scale-110 transition-transform" />
            <div>
              <h3 className="font-semibold text-foreground mb-1">Email Us</h3>
              <p className="text-sm text-muted-foreground">support@dimenshop.example</p>
            </div>
          </a>

          <a
            href="tel:+1234567890"
            className="flex items-center gap-4 p-6 rounded-xl border bg-card hover:shadow-lg transition-all duration-300 group"
          >
            <Phone className="w-8 h-8 text-primary group-hover:scale-110 transition-transform" />
            <div>
              <h3 className="font-semibold text-foreground mb-1">Call Us</h3>
              <p className="text-sm text-muted-foreground">+1 (234) 567-890</p>
            </div>
          </a>
        </div>

        {/* Help Topics */}
        <div>
          <h2 className="text-3xl font-bold text-foreground mb-8">Browse Help Topics</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {helpTopics.map((topic, idx) => {
              const Icon = topic.icon;
              return (
                <div
                  key={idx}
                  className="p-6 rounded-xl border bg-card hover:shadow-md transition-shadow"
                >
                  <div className="flex items-center gap-3 mb-4">
                    <div className="p-2 rounded-lg bg-primary/10">
                      <Icon className="w-6 h-6 text-primary" />
                    </div>
                    <h3 className="text-xl font-semibold text-foreground">{topic.title}</h3>
                  </div>
                  <ul className="space-y-2">
                    {topic.questions.map((item, qIdx) => (
                      <li key={qIdx}>
                        <Link
                          href={`/faq${item.link}`}
                          className="text-muted-foreground hover:text-primary transition-colors text-sm"
                        >
                          • {item.q}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              );
            })}
          </div>
        </div>

        {/* Still Need Help */}
        <div className="mt-16 p-8 rounded-2xl bg-gradient-to-br from-primary/10 to-background border text-center">
          <h2 className="text-2xl font-bold text-foreground mb-4">
            Still Need Help?
          </h2>
          <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
            Our support team is here to assist you. Get in touch and we&apos;ll respond within 24 hours.
          </p>
          <Link
            href="/contact"
            className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors font-medium"
          >
            <MessageCircle className="w-5 h-5" />
            Contact Support
          </Link>
        </div>
      </div>
    </div>
  );
}
