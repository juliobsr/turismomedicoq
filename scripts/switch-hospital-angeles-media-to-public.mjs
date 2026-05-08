import 'dotenv/config'
import pg from 'pg'

const { Client } = pg

const files = [
  'hospital-angeles-centro-sur-hero.jpeg',
  'hospital-angeles-centro-sur-exterior-1.jpg',
  'hospital-angeles-centro-sur-exterior-2.jpg',
  'hospital-angeles-hospitalizacion.webp',
  'hospital-angeles-imagenologia.webp',
  'hospital-angeles-terapia-intensiva.webp',
]

const client = new Client({ connectionString: process.env.DATABASE_URI })

await client.connect()

try {
  await client.query('begin')

  for (const filename of files) {
    await client.query(
      `
        update facilities_media
        set url = $1, updated_at = now()
        where filename = $2
      `,
      [`/media/facilities/${filename}`, filename]
    )
    console.log(`media url switched to /media/facilities/${filename}`)
  }

  await client.query('commit')
} catch (error) {
  await client.query('rollback')
  throw error
} finally {
  await client.end()
}
