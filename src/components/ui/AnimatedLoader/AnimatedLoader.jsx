'use client';
import React from "react";
import "./AnimatedLoader.css";

export default function AnimatedLoader() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div role="status" aria-label="Loading" className="spinner">
        <div></div>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
      </div>
    </div>
  );
}