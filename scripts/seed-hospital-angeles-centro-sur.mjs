import 'dotenv/config'
import pg from 'pg'

const { Client } = pg

const facilitySlug = 'hospital-angeles-centro-sur'
const specialtyIds = [1, 2, 3]
const doctorIds = [1]

const media = [
  {
    key: 'hero',
    filename: 'hospital-angeles-centro-sur-hero.jpeg',
    alt: 'Hospital Angeles Centro Sur tower in Queretaro',
    caption: 'Exterior tower of Hospital Angeles Centro Sur in Queretaro.',
    mimeType: 'image/jpeg',
    filesize: 134419,
    width: 1280,
    height: 791,
  },
  {
    key: 'exterior1',
    filename: 'hospital-angeles-centro-sur-exterior-1.jpg',
    alt: 'Modern glass facade of Hospital Angeles Centro Sur',
    caption: 'Modern hospital facade and critical medical infrastructure in Centro Sur.',
    mimeType: 'image/jpeg',
    filesize: 110497,
    width: 1280,
    height: 720,
  },
  {
    key: 'exterior2',
    filename: 'hospital-angeles-centro-sur-exterior-2.jpg',
    alt: 'Hospital Angeles Centro Sur exterior in Queretaro',
    caption: 'Hospital Angeles Centro Sur, a private hospital tower in Queretaro.',
    mimeType: 'image/jpeg',
    filesize: 181158,
    width: 1280,
    height: 720,
  },
  {
    key: 'hospitalization',
    filename: 'hospital-angeles-hospitalizacion.webp',
    alt: 'Private hospital room at Hospital Angeles',
    caption: 'Hospitalization areas designed for privacy, comfort and recovery.',
    mimeType: 'image/webp',
    filesize: 34046,
    width: 1024,
    height: 768,
  },
  {
    key: 'imaging',
    filename: 'hospital-angeles-imagenologia.webp',
    alt: 'Advanced imaging equipment at Hospital Angeles',
    caption: 'Imaging and diagnostic services for surgical planning and follow-up.',
    mimeType: 'image/webp',
    filesize: 68200,
    width: 1024,
    height: 768,
  },
  {
    key: 'icu',
    filename: 'hospital-angeles-terapia-intensiva.webp',
    alt: 'Intensive care unit at Hospital Angeles',
    caption: 'Critical care infrastructure for complex medical cases.',
    mimeType: 'image/webp',
    filesize: 52114,
    width: 1024,
    height: 768,
  },
]

const text = (value) => ({
  detail: 0,
  format: 0,
  mode: 'normal',
  style: '',
  text: value,
  type: 'text',
  version: 1,
})

const paragraph = (...children) => ({
  children,
  direction: 'ltr',
  format: '',
  indent: 0,
  type: 'paragraph',
  version: 1,
  textFormat: 0,
  textStyle: '',
})

const heading = (tag, value) => ({
  children: [text(value)],
  direction: 'ltr',
  format: '',
  indent: 0,
  type: 'heading',
  version: 1,
  tag,
})

const listItem = (value) => ({
  children: [text(value)],
  direction: 'ltr',
  format: '',
  indent: 0,
  type: 'listitem',
  version: 1,
  value: 1,
})

const bulletList = (items) => ({
  children: items.map(listItem),
  direction: 'ltr',
  format: '',
  indent: 0,
  type: 'list',
  version: 1,
  listType: 'bullet',
  start: 1,
  tag: 'ul',
})

const description = {
  root: {
    children: [
      heading('h2', 'A Tier 1 private hospital environment in Queretaro'),
      paragraph(
        text(
          'Hospital Angeles Centro Sur is one of Queretaro’s most important private hospital environments for international patients who expect advanced infrastructure, privacy, coordinated specialty care and a recovery setting that feels modern, secure and practical.'
        )
      ),
      paragraph(
        text(
          'The hospital is located in Centro Sur, one of the most convenient medical and business zones in the city. For patients traveling from the United States, that location matters: hotels, mobility routes, specialist offices and hospital access can be planned with less friction.'
        )
      ),
      heading('h3', 'Why it matters for medical travel'),
      bulletList([
        'Modern private-hospital infrastructure designed for complex specialty care.',
        'Access to operating rooms, intensive care, imaging, laboratory and hospitalization services.',
        'Comfort-focused rooms that support privacy and post-treatment recovery.',
        'A strong medical staff ecosystem with specialists across major clinical areas.',
      ]),
      heading('h3', 'A competitive standard for US patients'),
      paragraph(
        text(
          'For many American patients, the decision is not only about cost. It is about confidence: the hospital environment, the physician team, the ability to understand the plan, and the quality of recovery after treatment. Hospital Angeles Centro Sur helps position Queretaro as a serious alternative to high-end private care settings in the United States, while offering the logistical and recovery advantages of Mexico.'
        )
      ),
      heading('h3', 'Publicly documented infrastructure'),
      paragraph(
        text(
          'Public information from Hospital Angeles describes modern facilities, advanced technology, specialized areas such as operating rooms, intensive care and laboratory services, and 24/7 emergency attention. Guardian Glass also describes the Centro Sur tower as a 65,000 square meter healthcare project expanding critical medical infrastructure.'
        )
      ),
    ],
    direction: 'ltr',
    format: '',
    indent: 0,
    type: 'root',
    version: 1,
  },
}

const client = new Client({ connectionString: process.env.DATABASE_URI })

await client.connect()

try {
  await client.query('begin')

  const mediaIds = new Map()

  for (const item of media) {
    const url = `/media/facilities/${item.filename}`
    const result = await client.query(
      `
        insert into facilities_media (
          alt,
          caption,
          url,
          filename,
          mime_type,
          filesize,
          width,
          height,
          focal_x,
          focal_y,
          updated_at,
          created_at
        )
        values ($1, $2, $3, $4, $5, $6, $7, $8, 50, 50, now(), now())
        on conflict (filename) do update set
          alt = excluded.alt,
          caption = excluded.caption,
          url = excluded.url,
          mime_type = excluded.mime_type,
          filesize = excluded.filesize,
          width = excluded.width,
          height = excluded.height,
          updated_at = now()
        returning id
      `,
      [
        item.alt,
        item.caption,
        url,
        item.filename,
        item.mimeType,
        item.filesize,
        item.width,
        item.height,
      ]
    )
    mediaIds.set(item.key, result.rows[0].id)
  }

  const facilityResult = await client.query(
    `
      insert into facilities (
        name,
        slug,
        description,
        city,
        hero_image_id,
        is_active,
        updated_at,
        created_at
      )
      values ($1, $2, $3::jsonb, $4, $5, true, now(), now())
      on conflict (slug) do update set
        name = excluded.name,
        description = excluded.description,
        city = excluded.city,
        hero_image_id = excluded.hero_image_id,
        is_active = true,
        updated_at = now()
      returning id
    `,
    [
      'Hospital Ángeles Centro Sur',
      facilitySlug,
      JSON.stringify(description),
      'Queretaro, Mexico',
      mediaIds.get('hero'),
    ]
  )

  const facilityId = facilityResult.rows[0].id

  await client.query('delete from facilities_rels where parent_id = $1', [facilityId])

  for (const [index, specialtyId] of specialtyIds.entries()) {
    await client.query(
      'insert into facilities_rels ("order", parent_id, path, specialties_id) values ($1, $2, $3, $4)',
      [index, facilityId, 'specialtiesOffered', specialtyId]
    )
  }

  for (const [index, doctorId] of doctorIds.entries()) {
    await client.query(
      'insert into facilities_rels ("order", parent_id, path, doctors_id) values ($1, $2, $3, $4)',
      [index, facilityId, 'doctors', doctorId]
    )
    await client.query(
      `
        insert into doctors_rels ("order", parent_id, path, facilities_id)
        select $1, $2, 'facilities', $3
        where not exists (
          select 1 from doctors_rels
          where parent_id = $2 and path = 'facilities' and facilities_id = $3
        )
      `,
      [facilityId, doctorId, facilityId]
    )
  }

  const galleryKeys = ['exterior1', 'exterior2', 'hospitalization', 'imaging', 'icu']
  for (const [index, key] of galleryKeys.entries()) {
    await client.query(
      'insert into facilities_rels ("order", parent_id, path, facilities_media_id) values ($1, $2, $3, $4)',
      [index, facilityId, 'infrastructureGallery', mediaIds.get(key)]
    )
  }

  await client.query('commit')
  console.log(`upserted Hospital Ángeles Centro Sur with id ${facilityId}`)
} catch (error) {
  await client.query('rollback')
  throw error
} finally {
  await client.end()
}
