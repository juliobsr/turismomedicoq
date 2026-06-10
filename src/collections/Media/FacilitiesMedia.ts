// src/collections/Media/FacilitiesMedia.ts
import { createMediaCollection } from './BaseMedia';
export const FacilitiesMedia = createMediaCollection('facilities-media', 'Facility Media', 'facilities', {
  adminDescription: 'Images and short videos used for facility hero backgrounds and galleries.',
  mimeTypes: ['image/*', 'video/mp4', 'video/webm', 'video/ogg'],
});
