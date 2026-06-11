import { createToken, verifyPassword } from '@/lib/server/auth';
import { db } from '@/lib/server/db';
import { jsonError } from '@/lib/server/http';

function employee(row: Record<string, unknown>) {
  return {
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
  };
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const login = String(body.login ?? '').trim().toLowerCase();
    const password = String(body.password ?? '');

    if (!login || !password) {
      return Response.json({ error: 'Login and password are required' }, { status: 400 });
    }

    const result = await db().query(
      `select * from employees
       where lower(user_id) = $1 or lower(email) = $1 or lower(emp_id) = $1
       limit 1`,
      [login],
    );
    const row = result.rows[0];

    if (!row || !verifyPassword(password, row.password_hash)) {
      return Response.json({ error: 'Invalid login' }, { status: 401 });
    }

    return Response.json({
      employee: employee(row),
      token: createToken({ id: row.id, role: row.role }),
    });
  } catch (error) {
    return jsonError(error);
  }
}
