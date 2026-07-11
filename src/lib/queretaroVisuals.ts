import type { QueretaroVisual } from '@/app/components/QueretaroVisualGallery'

const queretaroImageBasePath = '/imagenes/queretaro'

export const queretaroVisuals: QueretaroVisual[] = [
  {
    src: `${queretaroImageBasePath}/manuel-gopar-O8rpzmHgYQM-unsplash.jpg`,
    alt: 'Wide view of Queretaro city and surrounding hills in Mexico',
    title: 'A city that feels organized, modern and calm',
    description:
      'Queretaro gives medical travelers a rare combination: private healthcare infrastructure, strong urban planning and a recovery environment that feels calmer than larger destination cities.',
    orientation: 'wide',
  },
  {
    src: `${queretaroImageBasePath}/pexels-el-mango-sabroso-268384372-12978513.jpg`,
    alt: 'Historic streets and architecture in Queretaro, Mexico',
    title: 'Culture without overwhelming the patient',
    description:
      'For companions and later-stage recovery, the city offers historic plazas, refined dining and walkable cultural areas that can make the medical journey feel less clinical.',
  },
  {
    src: `${queretaroImageBasePath}/tania-ramirez-trejo-UzGzuAcvlKY-unsplash.jpg`,
    alt: 'Queretaro urban landscape with warm natural light',
    title: 'A polished alternative to high-volume corridors',
    description:
      'Patients from the United States often want savings, but they also need clarity, comfort and confidence. Queretaro supports that higher standard of medical travel.',
  },
  {
    src: `${queretaroImageBasePath}/pexels-hugoml-5697077.jpg`,
    alt: 'Colonial detail in Queretaro, Mexico',
    title: 'A strong setting for companions',
    description:
      'The right destination matters for the person traveling with the patient too. Queretaro offers hotels, restaurants, culture and practical mobility in a more measured city rhythm.',
    orientation: 'tall',
  },
  {
    src: `${queretaroImageBasePath}/rubenz-arizta-XZHH3_So4oM-unsplash.jpg`,
    alt: 'Historic architecture in Queretaro suitable for light recovery walks',
    title: 'Recovery can be quiet, beautiful and planned',
    description:
      'Once the physician clears light activity, the city gives patients access to gentle cultural experiences without losing the practical benefits of a modern medical base.',
    orientation: 'tall',
  },
]

