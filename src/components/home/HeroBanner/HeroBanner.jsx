// components/HeroBanner
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import AnimatedWrapper from './AnimatedWrapper'; 

export default function HeroBanner() {
  return (
    <AnimatedWrapper> 
      <div className="relative z-10 flex flex-col items-center justify-center min-h-[80vh] py-20 px-4">
        <h1 className="text-3xl md:text-5xl lg:text-7xl font-bold text-center text-foreground font-sans tracking-tight mb-6">
          Bring Imagination to Life
          <div className="relative mx-auto inline-block w-max">
           
            <div className="py-4">
              <span>with 3D Prints</span>
            </div>
          </div>
        </h1>
        <p className="text-lg md:text-xl text-muted-foreground text-center max-w-2xl mx-auto mb-8">
          Custom 3D printed products—from characters to props. Fast, affordable, magical.
        </p>
        <div className="flex flex-col sm:flex-row gap-4">
          <Link href="/products">
            <Button size="lg" className="bg-primary text-primary-foreground hover:bg-primary/90">
              Shop Now
            </Button>
          </Link>
          <Link href="/about">
            <Button variant="outline" size="lg" className="border-primary text-primary hover:bg-accent">
              Learn More
            </Button>
          </Link>
        </div>
      </div>
    </AnimatedWrapper>
  );
}