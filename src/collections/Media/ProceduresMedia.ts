// src/collections/Media/ProceduresMedia.ts
import { createMediaCollection } from './BaseMedia';
export const ProceduresMedia = createMediaCollection('procedures-media', 'Procedure Media', 'procedures', {
  adminDescription: 'Images and short videos used for procedure covers and media galleries.',
  mimeTypes: ['image/*', 'video/mp4', 'video/webm', 'video/ogg'],
});
