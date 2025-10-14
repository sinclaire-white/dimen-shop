// components/HeroBanner
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { AnimatedGradientText } from '@/components/ui/animated-gradient-text';
import { ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import AnimatedWrapper from './AnimatedWrapper'; 

export default function HeroBanner() {
  return (
    <AnimatedWrapper> 
      <div className="relative z-10 flex flex-col items-center justify-center min-h-[80vh] py-20">
        <div className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8">
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
          <div className="flex flex-col sm:flex-row gap-4 w-full max-w-md mx-auto">
          <Link href="/products" className="flex-1">
            <div className="group relative mx-auto flex items-center justify-center rounded-full px-4 sm:px-6 py-2.5 sm:py-3 bg-white dark:bg-white shadow-lg hover:shadow-xl transition-all duration-500 ease-out border border-gray-200 dark:border-gray-300">
              <span
                className={cn(
                  "animate-gradient absolute inset-0 block h-full w-full rounded-[inherit] bg-gradient-to-r from-[#ffaa40] via-[#9c40ff] to-[#ffaa40] bg-[length:300%_100%] p-[3px] dark:p-[4px]"
                )}
                style={{
                  WebkitMask:
                    "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
                  WebkitMaskComposite: "destination-out",
                  mask: "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
                  maskComposite: "subtract",
                  WebkitClipPath: "padding-box",
                }}
              />
              <AnimatedGradientText 
                className="text-sm sm:text-base font-semibold"
                colorFrom="#ffaa40"
                colorTo="#9c40ff"
              >
                Shop Now
              </AnimatedGradientText>
              <ChevronRight className="ml-2 size-3 sm:size-4 stroke-gray-600 dark:stroke-gray-600 transition-transform duration-300 ease-in-out group-hover:translate-x-0.5" />
            </div>
          </Link>
          <Link href="/about" className="flex-1">
            <div className="group relative mx-auto flex items-center justify-center rounded-full px-4 sm:px-6 py-2.5 sm:py-3 bg-white dark:bg-gray-800 shadow-lg hover:shadow-xl transition-all duration-500 ease-out border border-gray-300 dark:border-gray-600">
              <span
                className={cn(
                  "animate-gradient absolute inset-0 block h-full w-full rounded-[inherit] bg-gradient-to-r from-[#6366f1] via-[#8b5cf6] to-[#6366f1] bg-[length:300%_100%] p-[3px] dark:p-[4px]"
                )}
                style={{
                  WebkitMask:
                    "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
                  WebkitMaskComposite: "destination-out",
                  mask: "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
                  maskComposite: "subtract",
                  WebkitClipPath: "padding-box",
                }}
              />
              <AnimatedGradientText 
                className="text-sm sm:text-base font-semibold text-gray-800 dark:text-gray-200"
                colorFrom="#6366f1"
                colorTo="#8b5cf6"
              >
                Learn More
              </AnimatedGradientText>
              <ChevronRight className="ml-2 size-3 sm:size-4 stroke-gray-600 dark:stroke-gray-400 transition-transform duration-300 ease-in-out group-hover:translate-x-0.5" />
            </div>
          </Link>
        </div>
        </div>
      </div>
    </AnimatedWrapper>
  );
}