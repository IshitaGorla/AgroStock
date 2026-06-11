import { db } from '@/lib/server/db';
import { jsonError, requireUser } from '@/lib/server/http';

export async function POST(request: Request) {
  try {
    const auth = requireUser(request, 'quality_inspections');

    if (auth.response) {
      return auth.response;
    }

    const body = await request.json();
    const result = await db().query(
      `insert into quality_inspections
        (vehicle_id, moisture_content, foreign_matter, organic_matter, damaged_grains, weeviled_grains, fragments, shrivelled_grains, admixture, fumigation, qc_status, remarks, inspected_by)
       values ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)
       returning *`,
      [
        Number(body.vehicleId),
        Number(body.moistureContent ?? 0),
        Number(body.foreignMatter ?? 0),
        Number(body.organicMatter ?? 0),
        Number(body.damagedGrains ?? 0),
        Number(body.weeviledGrains ?? 0),
        Number(body.fragments ?? 0),
        Number(body.shrivelledGrains ?? 0),
        Number(body.admixture ?? 0),
        Boolean(body.fumigation),
        String(body.qcStatus ?? 'PENDING'),
        String(body.remarks ?? ''),
        auth.user.id,
      ],
    );

    return Response.json({ row: result.rows[0] });
  } catch (error) {
    return jsonError(error);
  }
}
