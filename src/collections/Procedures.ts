import type { CollectionConfig } from 'payload'

const Procedures: CollectionConfig = {
  slug: 'procedures',
  admin: {
    useAsTitle: 'name',
  },
  access: {
    read: () => true,
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
    },
    {
      name: 'description',
      type: 'textarea',
      required: true,
    },
    {
      name: 'priceRange',
      type: 'text',
      required: true,
    },
    {
      name: 'recoveryTime',
      type: 'text',
      required: true,
    },
  ],
}

export default Procedures