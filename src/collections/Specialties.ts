// src/collections/Specialties.ts
import type { CollectionConfig } from 'payload'

const Specialties: CollectionConfig = {
  slug: 'specialties',
  admin: {
    useAsTitle: 'name',
    group: 'Medical Directory',
  },
  access: {
    read: () => true,
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
      unique: true,
    },
    {
      name: 'slug',
      type: 'text',
      required: true, // Ahora lo hacemos obligatorio
      unique: true,   // Y único para URLs limpias
      admin: { 
        position: 'sidebar',
        description: 'Used for URLs (e.g., dental-care)',
      },
      index: true,
      hooks: {
        beforeValidate: [
          ({ value, data }) => {
            // Si el slug está vacío pero hay nombre, lo generamos
            if (!value && data?.name) {
              return data.name
                .toLowerCase()
                .replace(/ /g, '-')           // Cambia espacios por guiones
                .replace(/[^\w-]+/g, '');     // Elimina caracteres especiales
            }
            return value;
          },
        ],
      },
    },
  ],
}

export default Specialties