import { EnvelopeIcon, PhoneIcon, WrenchScrewdriverIcon } from '@heroicons/react/24/outline'

type UnderConstructionPageProps = {
  companyName?: string | null
  contactEmail?: string | null
  contactPhone?: string | null
}

export function UnderConstructionPage({
  companyName,
  contactEmail,
  contactPhone,
}: UnderConstructionPageProps) {
  const brandName = companyName || 'Queretaro Medical Tourism'

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-brand-bg px-6 py-16 text-center">
      <div className="mx-auto w-full max-w-xl rounded-3xl border border-slate-200 bg-white p-10 shadow-xl shadow-slate-200/60">
        <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-brand-primary/10 text-brand-primary">
          <WrenchScrewdriverIcon className="h-8 w-8" aria-hidden="true" />
        </div>

        <p className="text-sm font-bold uppercase tracking-[0.2em] text-brand-primary">
          {brandName}
        </p>

        <h1 className="mt-4 text-3xl font-extrabold tracking-tight text-brand-text md:text-4xl">
          Sitio en construcción
        </h1>

        <p className="mt-4 text-base leading-7 text-slate-600">
          Estamos preparando una nueva experiencia para conectar pacientes con especialistas
          médicos en Querétaro. Vuelve pronto.
        </p>

        {(contactEmail || contactPhone) && (
          <div className="mt-8 space-y-3 border-t border-slate-100 pt-8 text-sm text-slate-600">
            <p className="font-semibold text-brand-text">¿Necesitas contactarnos?</p>

            {contactPhone && (
              <a
                href={`tel:${contactPhone}`}
                className="inline-flex items-center justify-center gap-2 font-medium text-brand-primary transition hover:text-brand-secondary"
              >
                <PhoneIcon className="h-4 w-4" aria-hidden="true" />
                {contactPhone}
              </a>
            )}

            {contactEmail && (
              <a
                href={`mailto:${contactEmail}`}
                className="inline-flex items-center justify-center gap-2 font-medium text-brand-primary transition hover:text-brand-secondary"
              >
                <EnvelopeIcon className="h-4 w-4" aria-hidden="true" />
                {contactEmail}
              </a>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
