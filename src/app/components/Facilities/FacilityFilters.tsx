'use client';

import React from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

/**
 * Enterprise Interface for Facility Filters
 * We replace 'cities' with 'doctors' to focus on specialist-based discovery.
 */
interface FilterProps {
  specialties?: { id: string; title: string }[];
  doctors?: { id: string; fullName: string }[];
}

/**
 * FacilityFilters Component
 * 
 * Strategy: Synchronizes UI state with URL search parameters to trigger
 * Server Component re-renders and maintain SEO-friendly deep links.
 * 
 * Security & Stability: Implemented defensive programming with default 
 * empty arrays to prevent runtime crashes if props are undefined.
 * 
 * @author Vzsoluciones Engineering Team
 */
export const FacilityFilters = ({ 
  specialties = [], 
  doctors = [] 
}: FilterProps) => {
  const router = useRouter();
  const searchParams = useSearchParams();

  /**
   * Updates the URL search parameters and pushes a new entry to the history stack.
   * Logic: If a value is empty, the key is removed to keep the URL clean.
   */
  const handleFilterChange = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    
    if (value) {
      params.set(key, value);
    } else {
      params.delete(key);
    }

    // Scroll: false prevents the page from jumping to the top on filter update
    router.push(`/facilities?${params.toString()}`, { scroll: false });
  };

  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 flex flex-wrap gap-6 items-end mb-10">
      
      {/* 👨‍⚕️ Doctors Filter */}
      <div className="flex flex-col gap-2 min-w-[240px]">
        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
          Doctors
        </label>
        <select
          onChange={(e) => handleFilterChange('doctor', e.target.value)}
          defaultValue={searchParams.get('doctor') || ''}
          className="bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-medium focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all cursor-pointer"
        >
          <option value="">All Specialists</option>
          {/* SAFE ITERATION: Guaranteed to be an array */}
          {doctors.map((doc) => (
            <option key={doc.id} value={doc.id}>
              {doc.fullName}
            </option>
          ))}
        </select>
      </div>

      {/* ⚕️ Specialty Filter */}
      <div className="flex flex-col gap-2 min-w-[240px]">
        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
          Medical Specialty
        </label>
        <select
          onChange={(e) => handleFilterChange('specialty', e.target.value)}
          defaultValue={searchParams.get('specialty') || ''}
          className="bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-medium focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all cursor-pointer"
        >
          <option value="">All Specialties</option>
          {/* SAFE ITERATION: Guaranteed to be an array */}
          {specialties.map((spec) => (
            <option key={spec.id} value={spec.id}>
              {spec.title}
            </option>
          ))}
        </select>
      </div>

      {/* 🔄 Reset Interface */}
      <button
        onClick={() => router.push('/facilities')}
        className="h-[46px] px-6 text-sm font-bold text-slate-500 hover:text-blue-600 transition-colors flex items-center gap-2 group"
      >
        <svg 
          className="w-4 h-4 transition-transform group-hover:rotate-180 duration-500" 
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
        </svg>
        Reset Filters
      </button>
    </div>
  );
};