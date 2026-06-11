import { db } from '@/lib/server/db';
import { jsonError, requireUser } from '@/lib/server/http';

export async function POST(request: Request) {
  try {
    const auth = requireUser(request, 'stock_assignments');

    if (auth.response) {
      return auth.response;
    }

    const body = await request.json();
    const bagCount = Number(body.bagCount ?? 0);
    const totalWeight = Number(body.totalWeight ?? 0);
    const result = await db().query(
      `insert into stock_assignments
        (vehicle_id, storage_location_id, stack_number, lot_number, bag_count, total_weight, average_bag_weight, assigned_by)
       values ($1, $2, $3, $4, $5, $6, case when $5 > 0 then $6 / $5 else 0 end, $7)
       returning *`,
      [
        Number(body.vehicleId),
        Number(body.storageLocationId),
        String(body.stackNumber ?? '').trim(),
        String(body.lotNumber ?? '').trim(),
        bagCount,
        totalWeight,
        auth.user.id,
      ],
    );

    return Response.json({ row: result.rows[0] });
  } catch (error) {
    return jsonError(error);
  }
}
