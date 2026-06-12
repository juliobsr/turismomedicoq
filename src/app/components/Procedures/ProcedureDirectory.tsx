'use client'

import { useMemo, useState } from 'react'
import Link from 'next/link'
import {
  ClockIcon,
  MagnifyingGlassIcon,
  UserGroupIcon,
  CurrencyDollarIcon,
} from '@heroicons/react/24/outline'

type ProcedureCard = {
  id: string
  name: string
  slug: string
  shortSummary: string
  recoveryTime?: string | null
  surgeryDuration?: string | null
  startingPriceUSD?: number | null
  coverImage?: {
    url?: string | null
    alt?: string | null
    mimeType?: string | null
  } | null
  specialty?: {
    title?: string | null
  } | null
  doctors: {
    id: string
    fullName: string
    slug?: string | null
  }[]
}

type DoctorOption = {
  id: string
  fullName: string
}

interface ProcedureDirectoryProps {
  procedures: ProcedureCard[]
  doctors: DoctorOption[]
}

export const ProcedureDirectory = ({ procedures, doctors }: ProcedureDirectoryProps) => {
  const [query, setQuery] = useState('')
  const [doctorId, setDoctorId] = useState('')

  const normalizedQuery = query.trim().toLowerCase()

  const filteredProcedures = useMemo(() => {
    return procedures.filter((procedure) => {
      const matchesName =
        !normalizedQuery ||
        procedure.name.toLowerCase().includes(normalizedQuery) ||
        procedure.shortSummary.toLowerCase().includes(normalizedQuery) ||
        procedure.specialty?.title?.toLowerCase().includes(normalizedQuery)

      const matchesDoctor =
        !doctorId || procedure.doctors.some((doctor) => doctor.id === doctorId)

      return matchesName && matchesDoctor
    })
  }, [doctorId, normalizedQuery, procedures])

  const resetFilters = () => {
    setQuery('')
    setDoctorId('')
  }

  return (
    <div className="space-y-10">
      <section className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm sm:p-6">
        <div className="grid gap-4 lg:grid-cols-[1fr_280px_auto] lg:items-end">
          <div>
            <label htmlFor="procedure-search" className="text-xs font-black uppercase tracking-[0.18em] text-slate-500">
              Search by procedure
            </label>
            <div className="relative mt-2">
              <MagnifyingGlassIcon className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
              <input
                id="procedure-search"
                type="search"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Search spine surgery, fracture treatment, scoliosis..."
                className="h-12 w-full rounded-lg border border-slate-200 bg-slate-50 pl-12 pr-4 text-sm font-medium text-slate-900 outline-none transition focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-100"
              />
            </div>
          </div>

          <div>
            <label htmlFor="doctor-filter" className="text-xs font-black uppercase tracking-[0.18em] text-slate-500">
              Filter by doctor
            </label>
            <select
              id="doctor-filter"
              value={doctorId}
              onChange={(event) => setDoctorId(event.target.value)}
              className="mt-2 h-12 w-full rounded-lg border border-slate-200 bg-slate-50 px-4 text-sm font-bold text-slate-800 outline-none transition focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-100"
            >
              <option value="">All specialists</option>
              {doctors.map((doctor) => (
                <option key={doctor.id} value={doctor.id}>
                  {doctor.fullName}
                </option>
              ))}
            </select>
          </div>

          <button
            type="button"
            onClick={resetFilters}
            className="h-12 rounded-lg border border-slate-200 px-5 text-sm font-black uppercase tracking-[0.12em] text-slate-600 transition hover:border-blue-200 hover:bg-blue-50 hover:text-blue-700"
          >
            Reset
          </button>
        </div>

        <p className="mt-4 text-sm font-semibold text-slate-500">
          Showing {filteredProcedures.length} of {procedures.length} active procedures.
        </p>
      </section>

      {filteredProcedures.length > 0 ? (
        <section
          className="grid grid-cols-1 gap-7 md:grid-cols-2 xl:grid-cols-3"
          aria-label="Medical procedures directory"
        >
          {filteredProcedures.map((procedure) => (
            <Link
              key={procedure.id}
              href={`/procedures/${procedure.slug}`}
              className="group flex min-h-full flex-col overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm transition hover:-translate-y-1 hover:border-blue-200 hover:shadow-xl focus:outline-none focus:ring-4 focus:ring-blue-100"
            >
              <div className="relative aspect-[16/10] overflow-hidden bg-slate-900">
                {procedure.coverImage?.url && (!procedure.coverImage.mimeType || procedure.coverImage.mimeType.startsWith('image/')) ? (
                  <img
                    src={procedure.coverImage.url}
                    alt={procedure.coverImage.alt || procedure.name}
                    loading="lazy"
                    className="h-full w-full object-cover opacity-90 transition duration-700 group-hover:scale-105"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-slate-900 to-blue-950 text-4xl font-black text-white/20">
                    EMJ
                  </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-slate-950/10 to-transparent" />
                {procedure.specialty?.title && (
                  <span className="absolute left-4 top-4 rounded-md bg-white/90 px-3 py-2 text-xs font-black uppercase tracking-[0.14em] text-blue-700 shadow-sm">
                    {procedure.specialty.title}
                  </span>
                )}
              </div>

              <div className="flex flex-1 flex-col p-6">
                <h2 className="text-2xl font-black leading-tight text-slate-950 transition group-hover:text-blue-700">
                  {procedure.name}
                </h2>
                <p className="mt-3 line-clamp-3 text-sm leading-6 text-slate-600">
                  {procedure.shortSummary}
                </p>

                <div className="mt-5 grid grid-cols-2 gap-3 text-sm">
                  {procedure.surgeryDuration && (
                    <div className="rounded-lg bg-slate-50 p-3">
                      <ClockIcon className="mb-1 h-4 w-4 text-blue-700" />
                      <p className="font-bold text-slate-900">{procedure.surgeryDuration}</p>
                      <p className="text-xs font-semibold text-slate-500">Duration</p>
                    </div>
                  )}
                  {procedure.startingPriceUSD && procedure.startingPriceUSD > 0 && (
                    <div className="rounded-lg bg-slate-50 p-3">
                      <CurrencyDollarIcon className="mb-1 h-4 w-4 text-blue-700" />
                      <p className="font-bold text-slate-900">
                        ${procedure.startingPriceUSD.toLocaleString()} USD
                      </p>
                      <p className="text-xs font-semibold text-slate-500">Starting at</p>
                    </div>
                  )}
                </div>

                <div className="mt-5 border-t border-slate-100 pt-5">
                  <div className="flex items-start gap-2">
                    <UserGroupIcon className="mt-0.5 h-5 w-5 shrink-0 text-blue-700" />
                    <div>
                      <p className="text-xs font-black uppercase tracking-[0.14em] text-slate-500">
                        Available specialists
                      </p>
                      <p className="mt-1 text-sm font-semibold leading-6 text-slate-800">
                        {procedure.doctors.length > 0
                          ? procedure.doctors.map((doctor) => doctor.fullName).join(', ')
                          : 'Specialist assignment available after clinical review'}
                      </p>
                    </div>
                  </div>
                </div>

                <span className="mt-6 inline-flex text-sm font-black uppercase tracking-[0.12em] text-blue-700">
                  View procedure details
                </span>
              </div>
            </Link>
          ))}
        </section>
      ) : (
        <section className="rounded-lg border border-dashed border-slate-300 bg-white px-6 py-20 text-center shadow-sm">
          <h2 className="text-2xl font-black text-slate-950">No procedures found</h2>
          <p className="mx-auto mt-3 max-w-xl text-slate-600">
            Try a different procedure name or specialist. Our coordinators can also help match your case with the right clinical path.
          </p>
          <button
            type="button"
            onClick={resetFilters}
            className="mt-6 rounded-lg bg-blue-700 px-6 py-3 text-sm font-black uppercase tracking-[0.14em] text-white transition hover:bg-blue-800"
          >
            Clear filters
          </button>
        </section>
      )}
    </div>
  )
}
