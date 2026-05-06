// src/payload.config.ts
import { buildConfig } from 'payload'
import { postgresAdapter } from '@payloadcms/db-postgres'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import { vercelBlobStorage } from '@payloadcms/storage-vercel-blob'; // 🚀 NUEVO
import path from 'path'
import { fileURLToPath } from 'url'


import { DoctorsMedia } from './collections/Media/DoctorsMedia';
import { FacilitiesMedia } from './collections/Media/FacilitiesMedia';
import { InstitutionsMedia } from './collections/Media/InstitutionsMedia';
import { CertificatesMedia } from './collections/Media/CertificatesMedia';
import { ProceduresMedia } from './collections/Media/ProceduresMedia';
import { GlobalMedia } from './collections/Media/GlobalsMedia'
import { PatientJourney } from './globals/PatientJourney'
import { WhyQueretaro } from './globals/WhyQueretaro'
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

console.log('--- PAYLOAD BOOT SEQUENCE ---');
console.log('1. Is GlobalsMedia object loaded?:', !!GlobalMedia);
if (GlobalMedia) {
  console.log('2. Registered Slug:', GlobalMedia.slug);
} else {
  console.error('❌ FATAL: GlobalsMedia is undefined! Check export/import pathing.');
}
console.log('-----------------------------');


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
      titleSuffix: '- Admin',
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
    ProceduresMedia,
    GlobalMedia
  ],

  globals: [
    SiteSettings, // ✅ Registra el Global aquí
    PatientJourney, // ✅ Registra el Global aquí
    WhyQueretaro, // 
  ],

  plugins: [

    /**
     * 🛡️ ESTRATEGIA DE ALMACENAMIENTO VZSOLUCIONES:
     * Redirigimos todas las subidas de archivos a Vercel Blob.
     * Esto garantiza que las fotos de doctores y quirófanos sean persistentes.
     */
    vercelBlobStorage({
      enabled: !!process.env.BLOB_READ_WRITE_TOKEN, // Solo se activa si el token existe
      collections: {
        // ⚠️ IMPORTANTE: Pon aquí los SLUGS exactos de tus colecciones de Media
        'medical-assets': true,
        'certificates-media': true,
        'doctors-media': true,
        'facilities-media': true,
        'institutions-media': true,
        'procedures-media': true,
      },
      token: process.env.BLOB_READ_WRITE_TOKEN,
    }),

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
      // 🚀 TECH LEAD TIP: Standard Neon connection string for Serverless/Build
      connectionString: process.env.DATABASE_URI || '',
      /**
       * SSL is mandatory for Neon. 
       * 'rejectUnauthorized: false' is common for cloud providers, 
       * but ensure your string has ?sslmode=require
       */
      ssl: true,
      // Lowering pool limits during build to avoid exhausting Neon connections
      max: 10,
      connectionTimeoutMillis: 10000, // 10s timeout to allow Neon to wake up
      
    },
    push: process.env.NODE_ENV === 'development',
    
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