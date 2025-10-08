'use client';

import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import Link from 'next/link';

export function CategoriesCard({ categories }) {
  const cardVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.3, ease: 'easeOut' } },
  };

  // Function to make category name URL-friendly
  const formatCategoryName = (name) => {
    return name
      .toLowerCase()
      .replace(/\s+/g, '-') // Replace spaces with hyphens
      .replace(/[^a-z0-9-]/g, ''); // Remove special characters
  };

  return (
    <section className="py-8 bg-background dark:bg-background">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
          className="text-center mb-8"
        >
          <h2 className="text-2xl font-bold text-foreground dark:text-foreground">
            Explore Our Categories
          </h2>
          <p className="mt-2 text-muted-foreground dark:text-muted-foreground">
            Discover our collection of 3D model categories
          </p>
        </motion.div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {categories.map((category, index) => (
            <motion.div
              key={category._id}
              variants={cardVariants}
              initial="hidden"
              animate="visible"
              transition={{ delay: index * 0.1 }}
            >
              <Link href={`/categories/${formatCategoryName(category.name)}`}>
                <Card className="bg-background dark:bg-background border border-muted dark:border-muted hover:bg-muted/50 dark:hover:bg-muted/50 transition-colors">
                  <CardHeader>
                    <CardTitle className="text-lg font-medium text-foreground dark:text-foreground">
                      {category.name}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground dark:text-muted-foreground line-clamp-2">
                      {category.description}
                    </p>
                  </CardContent>
                </Card>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}