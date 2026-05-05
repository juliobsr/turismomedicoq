// src/payload.config.ts
import { buildConfig } from 'payload'
import { postgresAdapter } from '@payloadcms/db-postgres'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import path from 'path'
import { fileURLToPath } from 'url'
import { DoctorsMedia } from './collections/media/DoctorsMedia';
import { FacilitiesMedia } from './collections/media/FacilitiesMedia';
import { InstitutionsMedia } from './collections/media/InstitutionsMedia';
import { CertificatesMedia } from './collections/media/CertificatesMedia';
import { ProceduresMedia } from './collections/media/ProceduresMedia';
import { Specialties } from './collections/Specialties'
import { Doctors } from './collections/Doctors'
import { Certificates } from './collections/Certificates'
import { Facilities } from './collections/Facilities'
import { Institutions } from './collections/Institutions'
import { Leads } from './collections/Leads'
import { Procedures} from './collections/Procedures'
import { resendAdapter } from '@payloadcms/email-resend'
// Import core collections
import { Users } from './collections/Users'

import { SiteSettings } from './globals/SiteSettings'
const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

// ============================================================================
// ENTERPRISE ENVIRONMENT VALIDATION
// Fail fast if critical secrets are missing in CI/CD or local environments
// ============================================================================
const assertEnvironment = () => {
  if (!process.env.DATABASE_URI) throw new Error('FATAL: DATABASE_URI is missing')
  if (!process.env.PAYLOAD_SECRET) throw new Error('FATAL: PAYLOAD_SECRET is missing')
}

assertEnvironment()

/**
 * Enterprise Payload CMS Configuration for Vzsoluciones
 * Architecture: Headless CMS powered by Serverless PostgreSQL (Neon)
 */
export default buildConfig({
  editor: lexicalEditor(),
  
  secret: process.env.PAYLOAD_SECRET as string,
  
  admin: {
    user: Users.slug,
    meta: {
      titleSuffix: '- Queretaro Medical Admin',
    },
  },

  collections: [
    Users,
   
    Specialties,  // 2. Dependency
    Doctors,      // 3. Main Entity
    Certificates,
    Facilities,
    Institutions,
    Leads,
    Procedures,
    DoctorsMedia,
    FacilitiesMedia,
    InstitutionsMedia,
    CertificatesMedia,
    ProceduresMedia
  ],

  globals: [
    SiteSettings, // ✅ Registra el Global aquí
  ],

  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },

  // ============================================================================
  // DATABASE ADAPTER: Serverless PostgreSQL (Neon)
  // Configured for strict relational integrity and massive SSG build concurrency.
  // ============================================================================
// ==========================================================================
  // ENTERPRISE DATABASE CONFIGURATION
  // Ensure this is INSIDE the buildConfig object!
  // ==========================================================================
  db: postgresAdapter({
    pool: {
      connectionString: process.env.DATABASE_URI || '',
      max: 10,
      idleTimeoutMillis: 30000,
      connectionTimeoutMillis: 5000,
      allowExitOnIdle: false,
    },
    idType: 'uuid',
    // MUST be false in production environments (where we use formal migration files).
    push: process.env.NODE_ENV !== 'production',
  }),
  /**
   * ENTERPRISE EMAIL DISPATCHER
   * Provider: Resend
   * Note: Using onboarding domain for development phase.
   */
  email: resendAdapter({
    apiKey: process.env.RESEND_API_KEY || '',
    defaultFromAddress: process.env.RESEND_SENDER_EMAIL || 'onboarding@resend.dev',
    defaultFromName: process.env.RESEND_SENDER_NAME || 'Queretaro Medical',
  }),
})