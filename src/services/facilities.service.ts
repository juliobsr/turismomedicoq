import { getPayload } from 'payload';
import configPromise from '@payload-config';
import { Facility } from '@/payload-types';

/**
 * Enterprise Service: getFilteredFacilities
 * Optimized for relational filtering between Facilities, Doctors, and Specialties.
 */
export const getFilteredFacilities = async (filters: {
  specialty?: string;
  doctor?: string;
}): Promise<Facility[]> => {
  const payload = await getPayload({ config: configPromise });

  // 1. Construct dynamic 'where' clause for PostgreSQL
  const whereClause: any = {
    isActive: { equals: true },
  };

  if (filters.specialty) {
    // Logic: Matches the specialty ID within the 'specialtiesOffered' relationship array
    whereClause.specialtiesOffered = { contains: filters.specialty };
  }

  if (filters.doctor) {
    // Logic: Matches the doctor ID within the 'doctors' relationship array
    whereClause.doctors = { contains: filters.doctor };
  }

  // 2. Execution with depth 1 to retrieve essential Media and Category titles
  const { docs } = await payload.find({
    collection: 'facilities',
    where: whereClause,
    depth: 1,
    limit: 100,
    sort: '-createdAt',
  });

  return docs as Facility[];
};