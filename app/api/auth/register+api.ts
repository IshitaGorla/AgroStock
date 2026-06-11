import { createToken, EmployeeRole, hashPassword } from '@/lib/server/auth';
import { db } from '@/lib/server/db';
import { jsonError } from '@/lib/server/http';

const roles: EmployeeRole[] = ['admin', 'quality_inspector', 'security', 'stock_manager', 'weighbridge'];

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const role = String(body.role ?? '') as EmployeeRole;

    if (!roles.includes(role)) {
      return Response.json({ error: 'Invalid role' }, { status: 400 });
    }

    const result = await db().query(
      `insert into employees
        (emp_id, full_name, user_id, password_hash, aadhaar_number, pan_number, email, mobile, role, department)
       values ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
       returning id, emp_id, full_name, user_id, aadhaar_number, pan_number, email, mobile, role, department`,
      [
        String(body.empId ?? '').trim().toUpperCase(),
        String(body.fullName ?? '').trim(),
        String(body.userId ?? '').trim().toLowerCase(),
        hashPassword(String(body.password ?? '')),
        String(body.aadhaarNumber ?? '').trim(),
        String(body.panNumber ?? '').trim().toUpperCase(),
        String(body.email ?? '').trim().toLowerCase(),
        String(body.mobile ?? '').trim(),
        role,
        String(body.department ?? role.replace('_', ' ')),
      ],
    );
    const row = result.rows[0];

    return Response.json({
      employee: {
        aadhaarNumber: row.aadhaar_number,
        department: row.department,
        email: row.email,
        empId: row.emp_id,
        fullName: row.full_name,
        id: row.id,
        mobile: row.mobile,
        panNumber: row.pan_number,
        role: row.role,
        userId: row.user_id,
      },
      token: createToken({ id: row.id, role: row.role }),
    });
  } catch (error) {
    return jsonError(error, 400);
  }
}
