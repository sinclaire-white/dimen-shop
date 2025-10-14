'use client';

import { cn } from '@/lib/utils';
import { forwardRef } from 'react';

const StarButton = forwardRef(({ className, children, ...props }, ref) => {
  return (
    <button
      ref={ref}
      className={cn(
        "star-button relative px-8 py-4 bg-background text-foreground text-lg font-semibold rounded-full border-2 border-foreground cursor-pointer transition-all duration-300 ease-in-out hover:bg-foreground hover:text-background hover:shadow-[0_0_80px_rgba(255,255,255,0.55)] dark:hover:shadow-[0_0_80px_rgba(255,255,255,0.3)]",
        className
      )}
      {...props}
    >
      {children}
      
      {/* Star 1 */}
      <div className="star-1 absolute top-[20%] left-[20%] w-6 h-auto z-[-5] transition-all duration-[0.8s] cubic-bezier-[0.05,0.83,0.43,0.96]">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 784.11 815.53"
          className="w-full h-full"
          style={{
            shapeRendering: 'geometricPrecision',
            textRendering: 'geometricPrecision',
            imageRendering: 'optimizeQuality',
            fillRule: 'evenodd',
            clipRule: 'evenodd'
          }}
        >
          <path
            d="M392.05 0c-20.9,210.08 -184.06,378.41 -392.05,407.78 207.96,29.37 371.12,197.68 392.05,407.74 20.93,-210.06 184.09,-378.37 392.05,-407.74 -207.98,-29.38 -371.16,-197.69 -392.06,-407.78z"
            className="fill-yellow-400"
          />
        </svg>
      </div>

      {/* Star 2 */}
      <div className="star-2 absolute top-[45%] left-[45%] w-4 h-auto z-[-5] transition-all duration-[0.8s] cubic-bezier-[0,0.4,0,1.01]">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 784.11 815.53"
          className="w-full h-full"
          style={{
            shapeRendering: 'geometricPrecision',
            textRendering: 'geometricPrecision',
            imageRendering: 'optimizeQuality',
            fillRule: 'evenodd',
            clipRule: 'evenodd'
          }}
        >
          <path
            d="M392.05 0c-20.9,210.08 -184.06,378.41 -392.05,407.78 207.96,29.37 371.12,197.68 392.05,407.74 20.93,-210.06 184.09,-378.37 392.05,-407.74 -207.98,-29.38 -371.16,-197.69 -392.06,-407.78z"
            className="fill-blue-400"
          />
        </svg>
      </div>

      {/* Star 3 */}
      <div className="star-3 absolute top-[40%] left-[40%] w-2 h-auto z-[-5] transition-all duration-[0.8s] cubic-bezier-[0,0.4,0,1.01]">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 784.11 815.53"
          className="w-full h-full"
          style={{
            shapeRendering: 'geometricPrecision',
            textRendering: 'geometricPrecision',
            imageRendering: 'optimizeQuality',
            fillRule: 'evenodd',
            clipRule: 'evenodd'
          }}
        >
          <path
            d="M392.05 0c-20.9,210.08 -184.06,378.41 -392.05,407.78 207.96,29.37 371.12,197.68 392.05,407.74 20.93,-210.06 184.09,-378.37 392.05,-407.74 -207.98,-29.38 -371.16,-197.69 -392.06,-407.78z"
            className="fill-purple-400"
          />
        </svg>
      </div>

      {/* Star 4 */}
      <div className="star-4 absolute top-[20%] left-[40%] w-3 h-auto z-[-5] transition-all duration-[0.8s] cubic-bezier-[0,0.4,0,1.01]">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 784.11 815.53"
          className="w-full h-full"
          style={{
            shapeRendering: 'geometricPrecision',
            textRendering: 'geometricPrecision',
            imageRendering: 'optimizeQuality',
            fillRule: 'evenodd',
            clipRule: 'evenodd'
          }}
        >
          <path
            d="M392.05 0c-20.9,210.08 -184.06,378.41 -392.05,407.78 207.96,29.37 371.12,197.68 392.05,407.74 20.93,-210.06 184.09,-378.37 392.05,-407.74 -207.98,-29.38 -371.16,-197.69 -392.06,-407.78z"
            className="fill-pink-400"
          />
        </svg>
      </div>

      {/* Star 5 */}
      <div className="star-5 absolute top-[25%] left-[45%] w-4 h-auto z-[-5] transition-all duration-[0.8s] cubic-bezier-[0,0.4,0,1.01]">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 784.11 815.53"
          className="w-full h-full"
          style={{
            shapeRendering: 'geometricPrecision',
            textRendering: 'geometricPrecision',
            imageRendering: 'optimizeQuality',
            fillRule: 'evenodd',
            clipRule: 'evenodd'
          }}
        >
          <path
            d="M392.05 0c-20.9,210.08 -184.06,378.41 -392.05,407.78 207.96,29.37 371.12,197.68 392.05,407.74 20.93,-210.06 184.09,-378.37 392.05,-407.74 -207.98,-29.38 -371.16,-197.69 -392.06,-407.78z"
            className="fill-green-400"
          />
        </svg>
      </div>

      {/* Star 6 */}
      <div className="star-6 absolute top-[5%] left-[50%] w-2 h-auto z-[-5] transition-all duration-[0.8s] cubic-bezier-[0,0.4,0,1.01]">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 784.11 815.53"
          className="w-full h-full"
          style={{
            shapeRendering: 'geometricPrecision',
            textRendering: 'geometricPrecision',
            imageRendering: 'optimizeQuality',
            fillRule: 'evenodd',
            clipRule: 'evenodd'
          }}
        >
          <path
            d="M392.05 0c-20.9,210.08 -184.06,378.41 -392.05,407.78 207.96,29.37 371.12,197.68 392.05,407.74 20.93,-210.06 184.09,-378.37 392.05,-407.74 -207.98,-29.38 -371.16,-197.69 -392.06,-407.78z"
            className="fill-red-400"
          />
        </svg>
      </div>

      <style jsx>{`
        .star-button:hover .star-1 {
          top: -20%;
          left: -20%;
          width: 20px;
          filter: drop-shadow(0 0 10px #fbbf24);
          z-index: 2;
        }

        .star-button:hover .star-2 {
          top: 35%;
          left: -25%;
          width: 15px;
          filter: drop-shadow(0 0 10px #60a5fa);
          z-index: 2;
        }

        .star-button:hover .star-3 {
          top: 80%;
          left: -10%;
          width: 10px;
          filter: drop-shadow(0 0 10px #c084fc);
          z-index: 2;
        }

        .star-button:hover .star-4 {
          top: -25%;
          left: 105%;
          width: 20px;
          filter: drop-shadow(0 0 10px #f472b6);
          z-index: 2;
        }

        .star-button:hover .star-5 {
          top: 30%;
          left: 115%;
          width: 15px;
          filter: drop-shadow(0 0 10px #4ade80);
          z-index: 2;
        }

        .star-button:hover .star-6 {
          top: 80%;
          left: 105%;
          width: 10px;
          filter: drop-shadow(0 0 10px #f87171);
          z-index: 2;
        }
      `}</style>
    </button>
  );
});

StarButton.displayName = 'StarButton';

export { StarButton };