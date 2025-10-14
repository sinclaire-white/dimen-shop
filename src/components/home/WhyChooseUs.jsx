// components/home/WhyChooseUs.jsx
'use client';

import { Card, CardContent } from '@/components/ui/card';
import { Shield, TrendingUp, Users, Zap, Award, Heart } from 'lucide-react';

const features = [
	{
		icon: Award,
		title: 'Premium Quality',
		description:
			'Every 3D model is meticulously crafted and tested to ensure the highest quality and printability.',
	},
	{
		icon: Zap,
		title: 'Instant Download',
		description:
			'Get immediate access to your files after purchase. No waiting, start printing right away.',
	},
	{
		icon: Shield,
		title: 'Secure & Trusted',
		description:
			'Join thousands of satisfied creators who trust us with their 3D printing projects.',
	},
	{
		icon: TrendingUp,
		title: 'Regular Updates',
		description:
			'Our library is constantly growing with new models and updated versions of existing ones.',
	},
	{
		icon: Users,
		title: 'Community Support',
		description:
			'Access our vibrant community for tips, support, and custom modification requests.',
	},
	{
		icon: Heart,
		title: 'Creator Focused',
		description:
			'We support independent 3D artists and share profits fairly with our creators.',
	},
];

export function WhyChooseUs() {
	return (
		<section className="py-12 md:py-16 bg-background">
			<div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
				<div className="text-center mb-8 md:mb-12">
					<h2 className="text-3xl font-bold text-foreground mb-4">
						Why Choose DimenShop?
					</h2>
					<p className="text-muted-foreground text-lg max-w-2xl mx-auto">
						We&apos;re more than just a marketplace - we&apos;re your partner in
						bringing creative ideas to life
					</p>
				</div>

				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
					{features.map((feature, index) => {
						const Icon = feature.icon;
						return (
							<Card
								key={index}
								className="group hover:shadow-lg transition-all duration-300 border border-muted bg-background"
							>
								<CardContent className="p-6 text-center">
									<div className="w-16 h-16 mx-auto mb-4 bg-primary/10 dark:bg-primary/20 rounded-full flex items-center justify-center group-hover:bg-primary group-hover:text-primary-foreground transition-colors duration-300">
										<Icon className="w-8 h-8 text-primary group-hover:text-primary-foreground" />
									</div>
									<h3 className="text-xl font-semibold text-foreground mb-3">
										{feature.title}
									</h3>
									<p className="text-muted-foreground leading-relaxed">
										{feature.description}
									</p>
								</CardContent>
							</Card>
						);
					})}
				</div>
			</div>
		</section>
	);
}