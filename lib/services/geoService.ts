import { Prisma } from '@prisma/client';
import prisma from '@/lib/db';

/**
 * Get nearby incidents using the Haversine formula to calculate distances.
 * 
 * @param lat - Latitude of the center point
 * @param lng - Longitude of the center point
 * @param radiusMeters - Search radius in meters (default: 10000m = 10km)
 * @returns Array of HelpRequest objects with distance field
 */
export async function getNearbyIncidents(
  lat: number,
  lng: number,
  radiusMeters: number = 10000
) {
  // Using Prisma's sql template tag for safe parameterized queries
  // Haversine formula: calculates great-circle distance between two points on a sphere
  // 6371000 = Earth's radius in meters
  const incidents = await prisma.$queryRaw<
    Array<{
      id: number;
      description: string;
      lat: number;
      lng: number;
      category: string;
      urgency: number;
      summary: string;
      status: string;
      createdAt: Date;
      distance: number;
    }>
  >(
    Prisma.sql`
      SELECT *,
      ( 6371000 * acos( 
          cos( radians(${lat}) ) 
          * cos( radians( lat ) ) 
          * cos( radians( lng ) - radians(${lng}) ) 
          + sin( radians(${lat}) ) 
          * sin( radians( lat ) ) 
        ) 
      ) AS distance
      FROM "HelpRequest"
      WHERE ( 6371000 * acos( 
          cos( radians(${lat}) ) 
          * cos( radians( lat ) ) 
          * cos( radians( lng ) - radians(${lng}) ) 
          + sin( radians(${lat}) ) 
          * sin( radians( lat ) ) 
        ) 
      ) < ${radiusMeters}
      ORDER BY urgency DESC, distance ASC
    `
  );

  return incidents;
}

/**
 * Get all incidents (for debugging or admin views)
 */
export async function getAllIncidents() {
  return await prisma.helpRequest.findMany({
    orderBy: [
      { urgency: 'desc' },
      { createdAt: 'desc' },
    ],
  });
}

/**
 * Get incident by ID
 */
export async function getIncidentById(id: number) {
  return await prisma.helpRequest.findUnique({
    where: { id },
  });
}

/**
 * Update incident status
 */
export async function updateIncidentStatus(id: number, status: string) {
  return await prisma.helpRequest.update({
    where: { id },
    data: { status },
  });
}

