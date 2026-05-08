import 'dotenv/config'
import pg from 'pg'

const { Client } = pg

const names = [
  ['minimally-invasive-spine-surgery-queretaro', 'Minimally Invasive Spine Surgery'],
  ['endoscopic-spine-surgery-queretaro', 'Endoscopic Spine Surgery'],
  ['pediatric-scoliosis-treatment-queretaro', 'Pediatric Scoliosis Treatment'],
  ['adult-spinal-deformity-treatment-queretaro', 'Adult Spinal Deformity Treatment'],
  ['spinal-fracture-treatment-queretaro', 'Spinal Fracture Treatment'],
  ['sciatica-treatment-queretaro', 'Sciatica Treatment'],
]

const client = new Client({ connectionString: process.env.DATABASE_URI })

await client.connect()

try {
  await client.query('begin')

  for (const [slug, name] of names) {
    await client.query('update procedures set name = $1, updated_at = now() where slug = $2', [
      name,
      slug,
    ])
    console.log(`renamed ${name}`)
  }

  await client.query('commit')
} catch (error) {
  await client.query('rollback')
  throw error
} finally {
  await client.end()
}
