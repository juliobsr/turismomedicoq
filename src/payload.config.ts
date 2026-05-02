import { mongooseAdapter } from '@payloadcms/db-mongodb'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import path from 'path'
import { buildConfig } from 'payload'
import { fileURLToPath } from 'url'
import sharp from 'sharp'
import { resendAdapter } from '@payloadcms/email-resend' // 1. Importa el adaptador

import  {Users } from './collections/Users'
import  {Media } from './collections/Media'
import Doctors from './collections/Doctors'
import Procedures from './collections/Procedures'
import Facilities from './collections/Facilities'
import Leads from './collections/Leads'
import Specialties from './collections/Specialties'
import { Certificates } from './collections/Certificates'
import { Institutions } from './collections/Institutions'

// Import Globals (The missing piece)
import { WhyDestination } from './globals/WhyDestination'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

export default buildConfig({
  admin: {
    user: Users.slug,
    importMap: {
      baseDir: path.resolve(dirname),
    },
  },
  collections: [Users, Media, Doctors, Procedures, Facilities, Leads, Specialties, Certificates,Institutions],
  editor: lexicalEditor({}), // <-- ESTA LÍNEA ES OBLIGATORIA
  
// REGISTERING THE GLOBALS ARRAY
  // This is where you define single-instance configurations
  globals: [
    WhyDestination,
    // You can add ThemeConfig, HeaderConfig, etc., here later
  ],

  secret: process.env.PAYLOAD_SECRET || '',
  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },
  db: mongooseAdapter({
    url: process.env.DATABASE_URL || '',
  }),
  sharp,
  plugins: [],
  email: resendAdapter({
    defaultFromAddress: 'onboarding@resend.dev',
    defaultFromName: 'Queretaro Medical Notifications',
    apiKey: process.env.RESEND_API_KEY || '',
  }),
})
