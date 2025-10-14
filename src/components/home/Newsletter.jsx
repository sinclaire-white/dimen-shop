// components/home/Newsletter.jsx
'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Mail, Check } from 'lucide-react';
import { toast } from 'sonner';

export function Newsletter() {
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubscribed, setIsSubscribed] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email) {
      toast.error('Please enter your email address');
      return;
    }

    setIsSubmitting(true);

    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      toast.success('Successfully subscribed to our newsletter!');
      setIsSubscribed(true);
      setEmail('');
    } catch (error) {
      toast.error('Failed to subscribe. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="py-12 md:py-16 bg-background">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
        <Card className="bg-background border border-muted shadow-lg rounded-xl">
          <CardContent className="p-8 text-center">
            <div className="w-16 h-16 mx-auto mb-6 bg-primary/10 dark:bg-primary/20 rounded-full flex items-center justify-center">
              <Mail className="w-8 h-8 text-primary" />
            </div>

            <h2 className="text-2xl font-bold mb-4 text-foreground">
              Stay Updated with DimenShop
            </h2>

            <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
              Get the latest updates on new 3D models, exclusive discounts, and 3D printing tips delivered straight to your inbox.
            </p>

            {!isSubscribed ? (
              <form onSubmit={handleSubmit} className="max-w-md mx-auto flex gap-2">
                <Input
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="bg-background text-foreground border-muted"
                  required
                />
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="bg-primary text-primary-foreground hover:bg-primary/90"
                >
                  {isSubmitting ? 'Subscribing...' : 'Subscribe'}
                </Button>
              </form>
            ) : (
              <div className="flex items-center justify-center gap-2 text-green-600 dark:text-green-400 font-medium">
                <Check className="w-5 h-5" />
                <span>You're subscribed! Thank you.</span>
              </div>
            )}

            <p className="text-xs text-muted-foreground mt-4">
              No spam ever. Unsubscribe at any time.
            </p>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}