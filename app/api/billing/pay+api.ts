import { db } from '@/lib/server/db';
import { jsonError, requireUser } from '@/lib/server/http';

export async function POST(request: Request) {
  try {
    const auth = requireUser(request, 'billing');

    if (auth.response) {
      return auth.response;
    }

    const body = await request.json();
    const bill = await db().query('select * from billing where id = $1 limit 1', [Number(body.billId)]);

    if (!bill.rows[0]) {
      return Response.json({ error: 'Bill not found' }, { status: 404 });
    }

    const vehicleId = bill.rows[0].vehicle_id;
    await db().query(`update vehicles set status = 'EXITED', exit_time = now() where id = $1`, [vehicleId]);
    const vehicle = await db().query('select * from vehicles where id = $1 limit 1', [vehicleId]);

    return Response.json({ row: vehicle.rows[0] });
  } catch (error) {
    return jsonError(error);
  }
}
