import { db, toNumber } from '@/lib/server/db';
import { jsonError, requireUser } from '@/lib/server/http';
import { canAccessTable } from '@/lib/server/permissions';

function vehicle(row: Record<string, unknown>) {
  return {
    commodity: String(row.commodity ?? ''),
    createdBy: toNumber(row.created_by),
    destination: 'Warehouse',
    driver: String(row.driver_name ?? ''),
    driverPhoneNumber: String(row.driver_phone ?? ''),
    entryTime: String(row.entry_time ?? ''),
    exitTime: row.exit_time ? String(row.exit_time) : undefined,
    goodDescription: String(row.commodity ?? ''),
    id: String(row.id),
    numberOfPersons: toNumber(row.number_of_persons),
    operator: 'Customer',
    status: row.status === 'EXITED' ? 'EXITED' : row.status === 'BILL GENERATED' ? 'BILL GENERATED' : 'IN PREMISES',
    type: 'Delivery',
    vehicleNumber: String(row.vehicle_number ?? ''),
    vehicleType: String(row.vehicle_type ?? ''),
  };
}

function employee(row: Record<string, unknown>) {
  return {
    aadhaarNumber: String(row.aadhaar_number ?? ''),
    department: String(row.department ?? ''),
    email: String(row.email ?? ''),
    empId: String(row.emp_id ?? ''),
    fullName: String(row.full_name ?? ''),
    id: toNumber(row.id),
    mobile: String(row.mobile ?? ''),
    panNumber: String(row.pan_number ?? ''),
    role: String(row.role ?? ''),
    userId: String(row.user_id ?? ''),
  };
}

export async function GET(request: Request) {
  try {
    const auth = requireUser(request);

    if (auth.response) {
      return auth.response;
    }

    const user = auth.user;
    const [employees, vehicles, weighbridge, quality, storage, stock, movements, billing, camera] = await Promise.all([
      canAccessTable(user, 'employees') ? db().query('select * from employees order by id desc') : { rows: [] },
      canAccessTable(user, 'vehicles') ? db().query('select * from vehicles order by id desc') : { rows: [] },
      canAccessTable(user, 'weighbridge_records') ? db().query('select * from weighbridge_records order by id desc') : { rows: [] },
      canAccessTable(user, 'quality_inspections') ? db().query('select * from quality_inspections order by id desc') : { rows: [] },
      canAccessTable(user, 'storage_locations') ? db().query('select * from storage_locations order by id') : { rows: [] },
      canAccessTable(user, 'stock_assignments') ? db().query('select * from stock_assignments order by id desc') : { rows: [] },
      canAccessTable(user, 'commodity_movements') ? db().query('select * from commodity_movements order by id desc') : { rows: [] },
      canAccessTable(user, 'billing') ? db().query('select * from billing order by id desc') : { rows: [] },
      canAccessTable(user, 'vehicle_camera_logs') ? db().query('select * from vehicle_camera_logs order by id desc') : { rows: [] },
    ]);

    return Response.json({
      billingRecords: billing.rows.map((row) => ({
        commodityType: String(row.commodity_type ?? ''),
        generatedAt: String(row.generated_at ?? ''),
        generatedBy: toNumber(row.generated_by),
        id: String(row.id),
        laborCharge: toNumber(row.labor_charge),
        loadingCharge: toNumber(row.loading_charge),
        quantityInTonnes: toNumber(row.quantity_in_tonnes),
        rentCharge: toNumber(row.rent_charge),
        status: 'UNPAID',
        totalAmount: toNumber(row.total_amount),
        unloadingCharge: toNumber(row.unloading_charge),
        vehicleId: String(row.vehicle_id),
      })),
      cameraLogs: camera.rows.map((row) => ({
        capturedAt: String(row.captured_at ?? ''),
        captureType: String(row.capture_type ?? 'ENTRY'),
        id: String(row.id),
        imageUrl: String(row.image_url ?? ''),
        vehicleId: String(row.vehicle_id),
      })),
      commodityMovements: movements.rows.map((row) => ({
        fromLocation: toNumber(row.from_location),
        id: String(row.id),
        movedBy: toNumber(row.moved_by),
        movementTime: String(row.movement_time ?? ''),
        remarks: String(row.remarks ?? ''),
        toLocation: toNumber(row.to_location),
        vehicleId: String(row.vehicle_id),
      })),
      employees: employees.rows.map(employee),
      entries: vehicles.rows.map(vehicle),
      qualityInspections: quality.rows.map((row) => ({
        admixture: toNumber(row.admixture),
        damagedGrains: toNumber(row.damaged_grains),
        foreignMatter: toNumber(row.foreign_matter),
        fragments: toNumber(row.fragments),
        fumigation: Boolean(row.fumigation),
        id: String(row.id),
        inspectedAt: String(row.inspected_at ?? ''),
        inspectedBy: toNumber(row.inspected_by),
        moistureContent: toNumber(row.moisture_content),
        organicMatter: toNumber(row.organic_matter),
        qcStatus: String(row.qc_status ?? 'PENDING'),
        remarks: String(row.remarks ?? ''),
        shrivelledGrains: toNumber(row.shrivelled_grains),
        vehicleId: String(row.vehicle_id),
        weeviledGrains: toNumber(row.weeviled_grains),
      })),
      stockAssignments: stock.rows.map((row) => ({
        assignedAt: String(row.assigned_at ?? ''),
        assignedBy: toNumber(row.assigned_by),
        averageBagWeight: toNumber(row.average_bag_weight),
        bagCount: toNumber(row.bag_count),
        id: String(row.id),
        lotNumber: String(row.lot_number ?? ''),
        stackNumber: String(row.stack_number ?? ''),
        storageLocationId: toNumber(row.storage_location_id),
        totalWeight: toNumber(row.total_weight),
        vehicleId: String(row.vehicle_id),
      })),
      storageLocations: storage.rows.map((row) => ({
        capacityInTonnes: toNumber(row.capacity_in_tonnes),
        currentOccupancy: toNumber(row.current_occupancy),
        floorName: String(row.floor_name ?? ''),
        id: toNumber(row.id),
        roomName: String(row.room_name ?? ''),
        unitType: String(row.unit_type ?? ''),
      })),
      weighbridgeRecords: weighbridge.rows.map((row) => ({
        aadhaarNumber: String(row.aadhaar_number ?? ''),
        address: String(row.address ?? ''),
        applicationNumber: String(row.application_number ?? ''),
        companyName: String(row.company_name ?? ''),
        createdAt: String(row.created_at ?? ''),
        customerName: String(row.customer_name ?? ''),
        emptyWeight: toNumber(row.empty_weight),
        gstNumber: String(row.gst_number ?? ''),
        id: String(row.id),
        loadedWeight: toNumber(row.loaded_weight),
        netWeight: toNumber(row.net_weight),
        panNumber: String(row.pan_number ?? ''),
        phoneNumber: String(row.phone_number ?? ''),
        transportReceiptNo: String(row.transport_receipt_no ?? ''),
        vehicleId: String(row.vehicle_id),
        verifiedBy: toNumber(row.verified_by),
      })),
    });
  } catch (error) {
    return jsonError(error);
  }
}
