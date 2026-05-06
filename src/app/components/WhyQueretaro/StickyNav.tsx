'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';

interface NavItem {
  anchor: string;
  label: string;
}

interface StickyNavProps {
  items: NavItem[];
}

/**
 * Enhanced StickyAdvantageNav with Glassmorphism
 * Architecture: Optimized for high contrast and readability over dynamic backgrounds.
 */
export const StickyAdvantageNav: React.FC<StickyNavProps> = ({ items }) => {
  const [activeAnchor, setActiveAnchor] = useState<string>(items[0]?.anchor || '');

  useEffect(() => {
    const observerOptions: IntersectionObserverInit = {
      root: null,
      rootMargin: '-20% 0px -70% 0px',
      threshold: 0,
    };

    const observerCallback = (entries: IntersectionObserverEntry[]) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setActiveAnchor(entry.target.id);
        }
      });
    };

    const observer = new IntersectionObserver(observerCallback, observerOptions);

    items.forEach((item) => {
      const element = document.getElementById(item.anchor);
      if (element) observer.observe(element);
    });

    return () => observer.disconnect();
  }, [items]);

  return (
    <nav className="hidden lg:block fixed left-6 top-1/2 -translate-y-1/2 z-50">
      {/* 
          ⚡ GLASSMORPHISM CONTAINER
          bg-white/40: Subtle transparency
          backdrop-blur-md: Native GPU-accelerated blur
          border-white/20: Soft edge definition
          shadow-2xl: Adds elevation 
      */}
      <div className="bg-white/40 backdrop-blur-md border border-white/20 p-8 rounded-3xl shadow-2xl ring-1 ring-black/5">
        <ul className="flex flex-col gap-8">
          {items.map((item) => {
            const isActive = activeAnchor === item.anchor;
            
            return (
              <li key={item.anchor} className="relative">
                <Link
                  href={`#${item.anchor}`}
                  className={`relative z-10 block text-xs font-black uppercase tracking-[0.2em] transition-all duration-500 ease-in-out ${
                    isActive 
                      ? 'text-blue-700 scale-110' 
                      : 'text-slate-500 hover:text-slate-800'
                  }`}
                >
                  <span className="flex items-center gap-4">
                    {/* Active Indicator Dot */}
                    <span 
                      className={`h-1.5 transition-all duration-500 rounded-full ${
                        isActive ? 'w-8 bg-blue-600' : 'w-2 bg-slate-300'
                      }`} 
                    />
                    {item.label}
                  </span>
                </Link>
              </li>
            );
          })}
        </ul>
      </div>
    </nav>
  );
};