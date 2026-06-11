import { EmployeeRole, SessionUser } from './auth';

export type TableName =
  | 'audit_logs'
  | 'billing'
  | 'commodity_movements'
  | 'employees'
  | 'quality_inspections'
  | 'stock_assignments'
  | 'storage_locations'
  | 'vehicle_camera_logs'
  | 'vehicles'
  | 'weighbridge_records';

const roleTables: Record<EmployeeRole, TableName[]> = {
  admin: [
    'audit_logs',
    'billing',
    'commodity_movements',
    'employees',
    'quality_inspections',
    'stock_assignments',
    'storage_locations',
    'vehicle_camera_logs',
    'vehicles',
    'weighbridge_records',
  ],
  quality_inspector: ['vehicles', 'quality_inspections'],
  security: ['vehicles', 'commodity_movements', 'billing', 'vehicle_camera_logs'],
  stock_manager: ['vehicles', 'storage_locations', 'stock_assignments', 'commodity_movements'],
  weighbridge: ['vehicles', 'weighbridge_records'],
};

export function canAccessTable(user: SessionUser, table: TableName) {
  return user.role === 'admin' || roleTables[user.role].includes(table);
}

export function assertTableAccess(user: SessionUser, table: TableName) {
  if (!canAccessTable(user, table)) {
    return Response.json({ error: 'Forbidden' }, { status: 403 });
  }

  return null;
}
