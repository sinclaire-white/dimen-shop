// components/FAQ.jsx
'use client';

import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { ChevronDown } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';  // Framer Motion for animations

export default function FAQ({ faqItems }) {
  const [openIndex, setOpenIndex] = useState(null);

  const toggleFAQ = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="space-y-4">
      {faqItems.map((item, index) => (
        <Card key={index} className="overflow-hidden">
          <button
            onClick={() => toggleFAQ(index)}
            className="w-full p-6 text-left flex justify-between items-center hover:bg-muted/50 transition-colors"
          >
            <h3 className="text-lg font-semibold pr-4">{item.question}</h3>
            <ChevronDown
              className={`h-5 w-5 text-muted-foreground transition-transform ${
                openIndex === index ? 'rotate-180' : ''
              }`}
            />
          </button>
          <AnimatePresence>
            {openIndex === index && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.3, ease: 'easeInOut' }}
                className="overflow-hidden"
              >
                <CardContent className="p-6 pt-0 border-t">
                  <p className="text-muted-foreground leading-relaxed mt-4">{item.answer}</p> 
                </CardContent>
              </motion.div>
            )}
          </AnimatePresence>
        </Card>
      ))}
    </div>
  );
}