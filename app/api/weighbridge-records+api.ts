import { db } from '@/lib/server/db';
import { jsonError, requireUser } from '@/lib/server/http';

export async function POST(request: Request) {
  try {
    const auth = requireUser(request, 'weighbridge_records');

    if (auth.response) {
      return auth.response;
    }

    const body = await request.json();
    const loadedWeight = Number(body.loadedWeight ?? 0);
    const emptyWeight = Number(body.emptyWeight ?? 0);
    const result = await db().query(
      `insert into weighbridge_records
        (vehicle_id, transport_receipt_no, company_name, customer_name, phone_number, aadhaar_number, pan_number, gst_number, address, loaded_weight, empty_weight, net_weight, application_number, verified_by)
       values ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, greatest($10 - $11, 0), $12, $13)
       returning *`,
      [
        Number(body.vehicleId),
        String(body.transportReceiptNo ?? '').trim(),
        String(body.companyName ?? '').trim(),
        String(body.customerName ?? '').trim(),
        String(body.phoneNumber ?? '').trim(),
        String(body.aadhaarNumber ?? '').trim(),
        String(body.panNumber ?? '').trim(),
        String(body.gstNumber ?? '').trim(),
        String(body.address ?? '').trim(),
        loadedWeight,
        emptyWeight,
        String(body.applicationNumber ?? '').trim(),
        auth.user.id,
      ],
    );

    return Response.json({ row: result.rows[0] });
  } catch (error) {
    return jsonError(error);
  }
}
