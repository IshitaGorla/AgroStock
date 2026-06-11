import { db } from '@/lib/server/db';
import { jsonError, requireUser } from '@/lib/server/http';

export async function POST(request: Request) {
  try {
    const auth = requireUser(request, 'billing');

    if (auth.response) {
      return auth.response;
    }

    const body = await request.json();
    const vehicleId = Number(body.vehicleId);
    const weight = await db().query('select net_weight from weighbridge_records where vehicle_id = $1 order by id desc limit 1', [vehicleId]);
    const vehicle = await db().query('select * from vehicles where id = $1 limit 1', [vehicleId]);

    if (!vehicle.rows[0]) {
      return Response.json({ error: 'Vehicle not found' }, { status: 404 });
    }

    const quantity = Math.max(Number(weight.rows[0]?.net_weight ?? 1), 1);
    const loading = quantity * 80;
    const unloading = quantity * 70;
    const rent = 0;
    const labor = Math.max(Number(vehicle.rows[0].number_of_persons ?? 1), 1) * 120;
    const result = await db().query(
      `insert into billing
        (vehicle_id, commodity_type, quantity_in_tonnes, loading_charge, unloading_charge, rent_charge, labor_charge, total_amount, generated_by)
       values ($1, $2, $3, $4, $5, $6, $7, $8, $9)
       returning *`,
      [vehicleId, vehicle.rows[0].commodity, quantity, loading, unloading, rent, labor, loading + unloading + rent + labor, auth.user.id],
    );

    await db().query(`update vehicles set status = 'BILL GENERATED' where id = $1`, [vehicleId]);

    return Response.json({ row: result.rows[0] });
  } catch (error) {
    return jsonError(error);
  }
}
