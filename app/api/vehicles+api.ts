import { db } from '@/lib/server/db';
import { jsonError, requireUser } from '@/lib/server/http';

export async function POST(request: Request) {
  try {
    const auth = requireUser(request, 'vehicles');

    if (auth.response) {
      return auth.response;
    }

    const body = await request.json();
    const result = await db().query(
      `insert into vehicles
        (vehicle_number, vehicle_type, driver_name, driver_phone, number_of_persons, commodity, created_by)
       values ($1, $2, $3, $4, $5, $6, $7)
       returning *`,
      [
        String(body.vehicleNumber ?? '').trim().toLowerCase(),
        String(body.vehicleType ?? '').trim(),
        String(body.driver ?? '').trim(),
        String(body.driverPhoneNumber ?? '').trim(),
        Number(body.numberOfPersons ?? 0),
        String(body.commodity ?? body.goodDescription ?? '').trim(),
        auth.user.id,
      ],
    );

    return Response.json({ row: result.rows[0] });
  } catch (error) {
    return jsonError(error);
  }
}
