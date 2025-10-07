// components/AnimatedWrapper
'use client';  

import { BackgroundBeamsWithCollision } from '@/components/ui/background-beams-with-collision';  

export default function AnimatedWrapper({ children }) {
  return <BackgroundBeamsWithCollision>{children}</BackgroundBeamsWithCollision>;  // Wraps content with exploding beams
}