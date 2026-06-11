import { db } from '@/lib/server/db';
import { jsonError, requireUser } from '@/lib/server/http';

export async function POST(request: Request) {
  try {
    const auth = requireUser(request, 'commodity_movements');

    if (auth.response) {
      return auth.response;
    }

    const body = await request.json();
    const result = await db().query(
      `insert into commodity_movements
        (vehicle_id, from_location, to_location, remarks, moved_by)
       values ($1, $2, $3, $4, $5)
       returning *`,
      [
        Number(body.vehicleId),
        Number(body.fromLocation),
        Number(body.toLocation),
        String(body.remarks ?? '').trim(),
        auth.user.id,
      ],
    );

    return Response.json({ row: result.rows[0] });
  } catch (error) {
    return jsonError(error);
  }
}
