// src/collections/Media/DoctorsMedia.ts
import { createMediaCollection } from './BaseMedia';
export const DoctorsMedia = createMediaCollection('doctors-media', 'Doctor Media', 'doctors', {
  adminDescription: 'Images and short videos used for doctor portraits, clinical galleries, and profile backgrounds.',
  mimeTypes: ['image/*', 'video/mp4', 'video/webm', 'video/ogg'],
});
