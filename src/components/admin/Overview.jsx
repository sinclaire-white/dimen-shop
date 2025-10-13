'use client';

import { motion } from 'framer-motion';
import { Package, Users, ShoppingCart, TrendingUp, Eye, Star } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

const statsData = [
  {
    title: 'Total Products',
    value: '124',
    change: '+12%',
    trend: 'up',
    icon: Package,
    color: 'bg-blue-500',
  },
  {
    title: 'Total Users',
    value: '2,847',
    change: '+18%',
    trend: 'up',
    icon: Users,
    color: 'bg-green-500',
  },
  {
    title: 'Total Orders',
    value: '1,264',
    change: '+8%',
    trend: 'up',
    icon: ShoppingCart,
    color: 'bg-purple-500',
  },
  {
    title: 'Revenue',
    value: '$12,847',
    change: '+23%',
    trend: 'up',
    icon: TrendingUp,
    color: 'bg-orange-500',
  },
];

const recentActivity = [
  {
    id: 1,
    action: 'New product added',
    item: 'Gaming Keyboard Stand',
    time: '2 hours ago',
    type: 'product',
  },
  {
    id: 2,
    action: 'Order completed',
    item: 'Order #12847',
    time: '4 hours ago',
    type: 'order',
  },
  {
    id: 3,
    action: 'New user registered',
    item: 'john.doe@example.com',
    time: '6 hours ago',
    type: 'user',
  },
  {
    id: 4,
    action: 'Product featured',
    item: 'Phone Stand Pro',
    time: '8 hours ago',
    type: 'product',
  },
];

const topProducts = [
  {
    id: 1,
    name: 'Phone Stand Pro',
    sales: 234,
    revenue: '$2,340',
    trend: '+15%',
  },
  {
    id: 2,
    name: 'Gaming Mouse Pad',
    sales: 189,
    revenue: '$1,890',
    trend: '+8%',
  },
  {
    id: 3,
    name: 'Desk Organizer',
    sales: 156,
    revenue: '$1,560',
    trend: '+12%',
  },
  {
    id: 4,
    name: 'Cable Management',
    sales: 142,
    revenue: '$1,420',
    trend: '+6%',
  },
];

export default function Overview() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
      },
    },
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="space-y-6"
      >
        {/* Header */}
        <motion.div variants={itemVariants}>
          <h1 className="text-2xl sm:text-3xl font-bold text-foreground">Dashboard Overview</h1>
          <p className="text-muted-foreground">
            Welcome back! Here&apos;s what&apos;s happening with your store.
          </p>
        </motion.div>

      {/* Stats Grid */}
      <motion.div
        variants={itemVariants}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
      >
        {statsData.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <Card key={index} className="relative overflow-hidden">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">
                      {stat.title}
                    </p>
                    <p className="text-2xl font-bold text-foreground">
                      {stat.value}
                    </p>
                    <div className="flex items-center mt-2">
                      <Badge
                        variant={stat.trend === 'up' ? 'default' : 'secondary'}
                        className="text-xs"
                      >
                        {stat.change}
                      </Badge>
                    </div>
                  </div>
                  <div className={`p-3 rounded-full ${stat.color} text-white`}>
                    <Icon className="h-6 w-6" />
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Activity */}
        <motion.div variants={itemVariants}>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Eye className="h-5 w-5" />
                <span>Recent Activity</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentActivity.map((activity) => (
                  <div
                    key={activity.id}
                    className="flex items-center justify-between p-3 bg-muted/50 rounded-lg"
                  >
                    <div>
                      <p className="text-sm font-medium text-foreground">
                        {activity.action}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {activity.item}
                      </p>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      {activity.time}
                    </p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Top Products */}
        <motion.div variants={itemVariants}>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Star className="h-5 w-5" />
                <span>Top Products</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {topProducts.map((product, index) => (
                  <div
                    key={product.id}
                    className="flex items-center justify-between p-3 bg-muted/50 rounded-lg"
                  >
                    <div className="flex items-center space-x-3">
                      <div className="flex items-center justify-center w-8 h-8 bg-primary text-primary-foreground rounded-full text-sm font-bold">
                        {index + 1}
                      </div>
                      <div>
                        <p className="text-sm font-medium text-foreground">
                          {product.name}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {product.sales} sales
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium text-foreground">
                        {product.revenue}
                      </p>
                      <Badge variant="default" className="text-xs">
                        {product.trend}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </motion.div>
    </div>
  );
}