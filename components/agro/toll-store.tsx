import { createContext, PropsWithChildren, useCallback, useContext, useMemo, useState } from 'react';

export type EmployeeRole = 'security' | 'quality_inspector' | 'weighbridge' | 'admin' | 'stock_manager';
export type TollEntryStatus = 'IN PREMISES' | 'BILL GENERATED' | 'EXITED';
export type BillingStatus = 'UNPAID' | 'PAID';

export type Employee = {
  id: number;
  empId: string;
  fullName: string;
  userId: string;
  aadhaarNumber: string;
  panNumber: string;
  email: string;
  mobile: string;
  role: EmployeeRole;
  department: string;
  password: string;
};

export type TollEntry = {
  id: string;
  vehicleNumber: string;
  vehicleType: string;
  type: string;
  destination: string;
  operator: string;
  goodDescription: string;
  driver: string;
  driverPhoneNumber: string;
  numberOfPersons: number;
  commodity: string;
  entryTime: string;
  exitTime?: string;
  status: TollEntryStatus;
  createdBy: number;
};

export type WeighbridgeRecord = {
  id: string;
  vehicleId: string;
  transportReceiptNo: string;
  companyName: string;
  customerName: string;
  phoneNumber: string;
  aadhaarNumber: string;
  panNumber: string;
  gstNumber: string;
  address: string;
  loadedWeight: number;
  emptyWeight: number;
  netWeight: number;
  applicationNumber: string;
  verifiedBy: number;
  createdAt: string;
};

export type QualityInspection = {
  id: string;
  vehicleId: string;
  moistureContent: number;
  foreignMatter: number;
  organicMatter: number;
  damagedGrains: number;
  weeviledGrains: number;
  fragments: number;
  shrivelledGrains: number;
  admixture: number;
  fumigation: boolean;
  qcStatus: 'PENDING' | 'APPROVED' | 'REJECTED';
  remarks: string;
  inspectedAt: string;
  inspectedBy: number;
};

export type StorageLocation = {
  id: number;
  unitType: string;
  floorName: string;
  roomName: string;
  capacityInTonnes: number;
  currentOccupancy: number;
};

export type StockAssignment = {
  id: string;
  vehicleId: string;
  storageLocationId: number;
  stackNumber: string;
  lotNumber: string;
  bagCount: number;
  totalWeight: number;
  averageBagWeight: number;
  assignedAt: string;
  assignedBy: number;
};

export type CommodityMovement = {
  id: string;
  vehicleId: string;
  fromLocation: number;
  toLocation: number;
  movementTime: string;
  remarks: string;
  movedBy: number;
};

export type BillingRecord = {
  id: string;
  vehicleId: string;
  commodityType: string;
  quantityInTonnes: number;
  loadingCharge: number;
  unloadingCharge: number;
  rentCharge: number;
  laborCharge: number;
  totalAmount: number;
  generatedAt: string;
  generatedBy: number;
  paidAt?: string;
  paidBy?: number;
  status: BillingStatus;
};

export type CameraLog = {
  id: string;
  vehicleId: string;
  imageUrl: string;
  capturedAt: string;
  captureType: 'ENTRY' | 'EXIT';
};

type NewTollEntry = {
  vehicleNumber: string;
  vehicleType: string;
  type: string;
  destination: string;
  customerName: string;
  goodDescription: string;
  driver: string;
  driverPhoneNumber: string;
  numberOfPersons: number;
  commodity: string;
};

type NewWeighbridgeRecord = Omit<WeighbridgeRecord, 'id' | 'createdAt' | 'verifiedBy' | 'netWeight'>;
type NewQualityInspection = Omit<QualityInspection, 'id' | 'inspectedAt' | 'inspectedBy'>;
type NewStockAssignment = Omit<StockAssignment, 'id' | 'assignedAt' | 'assignedBy' | 'averageBagWeight'>;
type NewCommodityMovement = Omit<CommodityMovement, 'id' | 'movementTime' | 'movedBy'>;
export type NewEmployee = {
  fullName: string;
  userId: string;
  password: string;
  aadhaarNumber: string;
  panNumber: string;
  email: string;
  mobile: string;
  role: EmployeeRole;
  empId: string;
};

type TollStore = {
  employees: Employee[];
  entries: TollEntry[];
  weighbridgeRecords: WeighbridgeRecord[];
  qualityInspections: QualityInspection[];
  storageLocations: StorageLocation[];
  stockAssignments: StockAssignment[];
  commodityMovements: CommodityMovement[];
  billingRecords: BillingRecord[];
  cameraLogs: CameraLog[];
  currentEmployee?: Employee;
  currentUser: string;
  addEntry: (entry: NewTollEntry) => TollEntry;
  addWeighbridgeRecord: (record: NewWeighbridgeRecord) => WeighbridgeRecord | undefined;
  addQualityInspection: (inspection: NewQualityInspection) => QualityInspection | undefined;
  addStockAssignment: (assignment: NewStockAssignment) => StockAssignment | undefined;
  addCommodityMovement: (movement: NewCommodityMovement) => CommodityMovement | undefined;
  findEntry: (vehicleNumber: string) => TollEntry | undefined;
  generateExitBill: (vehicleNumber: string) => BillingRecord | undefined;
  markBillPaid: (billId: string) => TollEntry | undefined;
  setCurrentUser: (name: string) => void;
  registerUser: (employee: NewEmployee) => Employee | undefined;
  loginUser: (userIdOrEmail: string, password: string) => Employee | undefined;
  logoutUser: () => void;
  canAccess: (module: AppModule) => boolean;
};

export type AppModule =
  | 'vehicles'
  | 'vehicle-entry'
  | 'vehicle-exit'
  | 'billing'
  | 'weighbridge'
  | 'weighbridge-table'
  | 'quality'
  | 'quality-table'
  | 'stock'
  | 'stock-table'
  | 'admin';

const roleModules: Record<EmployeeRole, AppModule[]> = {
  security: ['vehicles', 'vehicle-entry', 'vehicle-exit', 'billing'],
  quality_inspector: ['vehicles', 'quality', 'quality-table'],
  weighbridge: ['vehicles', 'weighbridge', 'weighbridge-table'],
  admin: ['vehicles', 'vehicle-entry', 'vehicle-exit', 'billing', 'weighbridge', 'weighbridge-table', 'quality', 'quality-table', 'stock', 'stock-table', 'admin'],
  stock_manager: ['vehicles', 'stock', 'stock-table'],
};

const employeesSeed: Employee[] = [
  {
    id: 1,
    empId: 'EMP-SEC-001',
    fullName: 'Security Officer',
    userId: 'security',
    aadhaarNumber: '000000000001',
    panNumber: 'SECUR0001A',
    email: 'security@agrostock.local',
    mobile: '9000000001',
    role: 'security',
    department: 'Security Gate',
    password: 'security123',
  },
  {
    id: 2,
    empId: 'EMP-QC-001',
    fullName: 'Quality Inspector',
    userId: 'quality',
    aadhaarNumber: '000000000002',
    panNumber: 'QUALI0002A',
    email: 'quality@agrostock.local',
    mobile: '9000000002',
    role: 'quality_inspector',
    department: 'Quality Control',
    password: 'quality123',
  },
  {
    id: 3,
    empId: 'EMP-WB-001',
    fullName: 'Weighbridge Operator',
    userId: 'weighbridge',
    aadhaarNumber: '000000000003',
    panNumber: 'WEIGH0003A',
    email: 'weighbridge@agrostock.local',
    mobile: '9000000003',
    role: 'weighbridge',
    department: 'Weighbridge',
    password: 'weigh123',
  },
  {
    id: 4,
    empId: 'EMP-ADM-001',
    fullName: 'Admin User',
    userId: 'admin',
    aadhaarNumber: '000000000004',
    panNumber: 'ADMIN0004A',
    email: 'admin@agrostock.local',
    mobile: '9000000004',
    role: 'admin',
    department: 'Administration',
    password: 'admin123',
  },
  {
    id: 5,
    empId: 'EMP-STK-001',
    fullName: 'Stock Manager',
    userId: 'stock',
    aadhaarNumber: '000000000005',
    panNumber: 'STOCK0005A',
    email: 'stock@agrostock.local',
    mobile: '9000000005',
    role: 'stock_manager',
    department: 'Stock Management',
    password: 'stock123',
  },
];

const initialEntries: TollEntry[] = [
  {
    id: '1',
    vehicleNumber: 'tn557890',
    vehicleType: 'Tractor',
    type: 'Storage',
    destination: 'Packhouse',
    operator: 'Isaac',
    goodDescription: 'Vegetable crates',
    commodity: 'Vegetables',
    driver: 'hello',
    driverPhoneNumber: '9876543210',
    numberOfPersons: 2,
    entryTime: '01.04.2026 03:32 pm',
    status: 'IN PREMISES',
    createdBy: 1,
  },
  {
    id: '2',
    vehicleNumber: 'tn34890',
    vehicleType: 'Mini Truck',
    type: 'Delivery',
    destination: 'Cold Storage',
    operator: 'Isaac',
    goodDescription: 'Dairy supplies',
    commodity: 'Dairy',
    driver: 'Mohan',
    driverPhoneNumber: '9876543211',
    numberOfPersons: 1,
    entryTime: '01.04.2026 03:28 pm',
    exitTime: '01.04.2026 04:10 pm',
    status: 'EXITED',
    createdBy: 1,
  },
  {
    id: '3',
    vehicleNumber: 'tn551234',
    vehicleType: 'Van',
    type: 'Guest',
    destination: 'Cold Storage',
    operator: 'Isaac',
    goodDescription: 'Guest visit',
    commodity: 'Guest',
    driver: 'Ravi',
    driverPhoneNumber: '9876543212',
    numberOfPersons: 3,
    entryTime: '01.04.2026 03:20 pm',
    exitTime: '01.04.2026 03:55 pm',
    status: 'EXITED',
    createdBy: 1,
  },
];

const initialStorageLocations: StorageLocation[] = [
  { id: 1, unitType: 'Warehouse', floorName: 'Ground Floor', roomName: 'A', capacityInTonnes: 500, currentOccupancy: 210 },
  { id: 2, unitType: 'Warehouse', floorName: 'First Floor', roomName: 'B', capacityInTonnes: 420, currentOccupancy: 130 },
  { id: 3, unitType: 'Cold Storage', floorName: 'G + 2', roomName: 'Room 1', capacityInTonnes: 180, currentOccupancy: 88 },
  { id: 4, unitType: 'Pack House', floorName: 'Pre-cooler', roomName: 'Room 1', capacityInTonnes: 90, currentOccupancy: 42 },
  { id: 5, unitType: 'Processing Unit', floorName: 'Delta Millet Unit', roomName: 'Line 1', capacityInTonnes: 240, currentOccupancy: 120 },
];

const initialQualityInspections: QualityInspection[] = [
  {
    id: 'qi-1',
    vehicleId: '1',
    moistureContent: 11.8,
    foreignMatter: 0.6,
    organicMatter: 0.4,
    damagedGrains: 0.9,
    weeviledGrains: 0.1,
    fragments: 0.5,
    shrivelledGrains: 0.7,
    admixture: 0.3,
    fumigation: true,
    qcStatus: 'APPROVED',
    remarks: 'Within acceptable limits.',
    inspectedAt: '01.04.2026 03:45 pm',
    inspectedBy: 2,
  },
  {
    id: 'qi-2',
    vehicleId: '2',
    moistureContent: 16.2,
    foreignMatter: 1.4,
    organicMatter: 0.8,
    damagedGrains: 2.1,
    weeviledGrains: 0.5,
    fragments: 1.2,
    shrivelledGrains: 1.8,
    admixture: 0.9,
    fumigation: false,
    qcStatus: 'REJECTED',
    remarks: 'Moisture and damaged grains above limit.',
    inspectedAt: '01.04.2026 03:36 pm',
    inspectedBy: 2,
  },
];

const initialStockAssignments: StockAssignment[] = [
  {
    id: 'sa-1',
    vehicleId: '1',
    storageLocationId: 4,
    stackNumber: 'PK-12',
    lotNumber: 'LOT-VEG-041',
    bagCount: 125,
    totalWeight: 18.5,
    averageBagWeight: 0.148,
    assignedAt: '01.04.2026 03:52 pm',
    assignedBy: 5,
  },
  {
    id: 'sa-2',
    vehicleId: '2',
    storageLocationId: 3,
    stackNumber: 'CS-08',
    lotNumber: 'LOT-DRY-022',
    bagCount: 90,
    totalWeight: 11.7,
    averageBagWeight: 0.13,
    assignedAt: '01.04.2026 03:40 pm',
    assignedBy: 5,
  },
];

function normalizeLogin(value: string) {
  return value.trim().toLowerCase();
}

function formatIstDateTime(date: Date) {
  const parts = new Intl.DateTimeFormat('en-GB', {
    day: '2-digit',
    hour: '2-digit',
    hour12: true,
    minute: '2-digit',
    month: '2-digit',
    timeZone: 'Asia/Kolkata',
    year: 'numeric',
  }).formatToParts(date);
  const values = Object.fromEntries(parts.map((part) => [part.type, part.value]));

  return `${values.day}.${values.month}.${values.year} ${values.hour}:${values.minute} ${values.dayPeriod.toLowerCase()}`;
}

function nextId() {
  return `${Date.now()}-${Math.round(Math.random() * 1000)}`;
}

function numberOrZero(value: number) {
  return Number.isFinite(value) ? value : 0;
}

export function TollStoreProvider({ children }: PropsWithChildren) {
  const [employees, setEmployees] = useState<Employee[]>(employeesSeed);
  const [entries, setEntries] = useState<TollEntry[]>(initialEntries);
  const [weighbridgeRecords, setWeighbridgeRecords] = useState<WeighbridgeRecord[]>([]);
  const [qualityInspections, setQualityInspections] = useState<QualityInspection[]>(initialQualityInspections);
  const [storageLocations] = useState<StorageLocation[]>(initialStorageLocations);
  const [stockAssignments, setStockAssignments] = useState<StockAssignment[]>(initialStockAssignments);
  const [commodityMovements, setCommodityMovements] = useState<CommodityMovement[]>([]);
  const [billingRecords, setBillingRecords] = useState<BillingRecord[]>([]);
  const [cameraLogs, setCameraLogs] = useState<CameraLog[]>([]);
  const [currentEmployee, setCurrentEmployee] = useState<Employee | undefined>();
  const [currentUser, setCurrentUser] = useState('Employee');

  const registerUser = useCallback((employee: NewEmployee) => {
    const normalizedEmail = normalizeLogin(employee.email);
    const normalizedUserId = normalizeLogin(employee.userId);
    const normalizedEmpId = employee.empId.trim().toUpperCase();
    const normalizedAadhaar = employee.aadhaarNumber.trim();
    const normalizedPan = employee.panNumber.trim().toUpperCase();

    if (
      employees.some(
        (item) =>
          item.email === normalizedEmail ||
          item.userId === normalizedUserId ||
          item.empId.toUpperCase() === normalizedEmpId ||
          item.aadhaarNumber === normalizedAadhaar ||
          item.panNumber.toUpperCase() === normalizedPan ||
          item.mobile === employee.mobile.trim(),
      )
    ) {
      return undefined;
    }

    const id = employees.length + 1;
    const created: Employee = {
      id,
      empId: normalizedEmpId,
      fullName: employee.fullName.trim(),
      userId: normalizedUserId,
      aadhaarNumber: normalizedAadhaar,
      panNumber: normalizedPan,
      email: normalizedEmail,
      mobile: employee.mobile.trim(),
      role: employee.role,
      department: employee.role.replace('_', ' '),
      password: employee.password,
    };

    setEmployees((current) => [...current, created]);
    setCurrentEmployee(created);
    setCurrentUser(created.fullName);
    return created;
  }, [employees]);

  const loginUser = useCallback((userIdOrEmail: string, password: string) => {
    const normalized = normalizeLogin(userIdOrEmail);
    const employee = employees.find(
      (item) => (item.userId === normalized || item.email === normalized || item.empId.toLowerCase() === normalized) && item.password === password,
    );

    if (!employee) {
      return undefined;
    }

    setCurrentEmployee(employee);
    setCurrentUser(employee.fullName);
    return employee;
  }, [employees]);

  const logoutUser = useCallback(() => {
    setCurrentEmployee(undefined);
    setCurrentUser('Employee');
  }, []);

  const addEntry = useCallback((entry: NewTollEntry) => {
    const created: TollEntry = {
      id: nextId(),
      vehicleNumber: entry.vehicleNumber.trim().toLowerCase(),
      vehicleType: entry.vehicleType.trim() || 'Vehicle',
      type: entry.type.trim() || 'Delivery',
      destination: entry.destination.trim() || 'Packhouse',
      operator: entry.customerName.trim() || 'Customer',
      goodDescription: entry.goodDescription.trim() || 'Goods',
      commodity: entry.commodity.trim() || entry.goodDescription.trim() || 'Commodity',
      driver: entry.driver.trim() || 'Driver',
      driverPhoneNumber: entry.driverPhoneNumber.trim(),
      numberOfPersons: entry.numberOfPersons,
      entryTime: formatIstDateTime(new Date()),
      status: 'IN PREMISES',
      createdBy: currentEmployee?.id ?? 1,
    };

    setEntries((current) => [created, ...current]);
    setCameraLogs((current) => [
      {
        id: nextId(),
        vehicleId: created.id,
        imageUrl: 'camera://entry-capture',
        capturedAt: created.entryTime,
        captureType: 'ENTRY',
      },
      ...current,
    ]);
    return created;
  }, [currentEmployee?.id]);

  const findEntry = useCallback(
    (vehicleNumber: string) => {
      const normalized = vehicleNumber.trim().toLowerCase();
      return entries.find((entry) => entry.vehicleNumber.toLowerCase() === normalized);
    },
    [entries],
  );

  const addWeighbridgeRecord = useCallback((record: NewWeighbridgeRecord) => {
    if (!currentEmployee) {
      return undefined;
    }

    const loadedWeight = numberOrZero(record.loadedWeight);
    const emptyWeight = numberOrZero(record.emptyWeight);
    const created: WeighbridgeRecord = {
      ...record,
      id: nextId(),
      loadedWeight,
      emptyWeight,
      netWeight: Math.max(loadedWeight - emptyWeight, 0),
      createdAt: formatIstDateTime(new Date()),
      verifiedBy: currentEmployee.id,
    };

    setWeighbridgeRecords((current) => [created, ...current]);
    return created;
  }, [currentEmployee]);

  const addQualityInspection = useCallback((inspection: NewQualityInspection) => {
    if (!currentEmployee) {
      return undefined;
    }

    const created: QualityInspection = {
      ...inspection,
      id: nextId(),
      inspectedAt: formatIstDateTime(new Date()),
      inspectedBy: currentEmployee.id,
    };

    setQualityInspections((current) => [created, ...current]);
    return created;
  }, [currentEmployee]);

  const addStockAssignment = useCallback((assignment: NewStockAssignment) => {
    if (!currentEmployee) {
      return undefined;
    }

    const bagCount = Math.max(numberOrZero(assignment.bagCount), 0);
    const totalWeight = Math.max(numberOrZero(assignment.totalWeight), 0);
    const created: StockAssignment = {
      ...assignment,
      id: nextId(),
      bagCount,
      totalWeight,
      averageBagWeight: bagCount > 0 ? totalWeight / bagCount : 0,
      assignedAt: formatIstDateTime(new Date()),
      assignedBy: currentEmployee.id,
    };

    setStockAssignments((current) => [created, ...current]);
    return created;
  }, [currentEmployee]);

  const addCommodityMovement = useCallback((movement: NewCommodityMovement) => {
    if (!currentEmployee) {
      return undefined;
    }

    const created: CommodityMovement = {
      ...movement,
      id: nextId(),
      movementTime: formatIstDateTime(new Date()),
      movedBy: currentEmployee.id,
    };

    setCommodityMovements((current) => [created, ...current]);
    return created;
  }, [currentEmployee]);

  const generateExitBill = useCallback((vehicleNumber: string) => {
    const normalized = vehicleNumber.trim().toLowerCase();
    const vehicle = entries.find((entry) => entry.vehicleNumber.toLowerCase() === normalized);

    if (!vehicle || vehicle.status === 'EXITED') {
      return undefined;
    }

    const existingBill = billingRecords.find((bill) => bill.vehicleId === vehicle.id && bill.status === 'UNPAID');

    if (existingBill) {
      return existingBill;
    }

    const weight = weighbridgeRecords.find((record) => record.vehicleId === vehicle.id)?.netWeight ?? 1;
    const quantityInTonnes = Math.max(weight, 1);
    const isStorage = vehicle.type.toLowerCase().includes('storage');
    const loadingCharge = quantityInTonnes * 80;
    const unloadingCharge = quantityInTonnes * 70;
    const rentCharge = isStorage ? quantityInTonnes * 45 : 0;
    const laborCharge = Math.max(vehicle.numberOfPersons, 1) * 120;
    const created: BillingRecord = {
      id: nextId(),
      vehicleId: vehicle.id,
      commodityType: vehicle.commodity,
      quantityInTonnes,
      loadingCharge,
      unloadingCharge,
      rentCharge,
      laborCharge,
      totalAmount: loadingCharge + unloadingCharge + rentCharge + laborCharge,
      generatedAt: formatIstDateTime(new Date()),
      generatedBy: currentEmployee?.id ?? 1,
      status: 'UNPAID',
    };

    setBillingRecords((current) => [created, ...current]);
    setEntries((current) =>
      current.map((entry) => (entry.id === vehicle.id ? { ...entry, status: 'BILL GENERATED' } : entry)),
    );
    return created;
  }, [billingRecords, currentEmployee?.id, entries, weighbridgeRecords]);

  const markBillPaid = useCallback((billId: string) => {
    const bill = billingRecords.find((item) => item.id === billId);

    if (!bill) {
      return undefined;
    }

    const exitTime = formatIstDateTime(new Date());
    let updatedEntry: TollEntry | undefined;

    setBillingRecords((current) =>
      current.map((item) =>
        item.id === billId
          ? { ...item, status: 'PAID', paidAt: exitTime, paidBy: currentEmployee?.id ?? 1 }
          : item,
      ),
    );
    setEntries((current) =>
      current.map((entry) => {
        if (entry.id !== bill.vehicleId) {
          return entry;
        }

        updatedEntry = { ...entry, status: 'EXITED', exitTime };
        return updatedEntry;
      }),
    );
    setCameraLogs((current) => [
      {
        id: nextId(),
        vehicleId: bill.vehicleId,
        imageUrl: 'camera://exit-capture',
        capturedAt: exitTime,
        captureType: 'EXIT',
      },
      ...current,
    ]);
    return updatedEntry;
  }, [billingRecords, currentEmployee?.id]);

  const canAccess = useCallback((module: AppModule) => {
    if (!currentEmployee) {
      return false;
    }

    return roleModules[currentEmployee.role].includes(module);
  }, [currentEmployee]);

  const value = useMemo(
    () => ({
      addCommodityMovement,
      addEntry,
      addQualityInspection,
      addStockAssignment,
      addWeighbridgeRecord,
      billingRecords,
      cameraLogs,
      canAccess,
      commodityMovements,
      currentEmployee,
      currentUser,
      employees,
      entries,
      findEntry,
      generateExitBill,
      loginUser,
      logoutUser,
      markBillPaid,
      qualityInspections,
      registerUser,
      setCurrentUser,
      stockAssignments,
      storageLocations,
      weighbridgeRecords,
    }),
    [
      addCommodityMovement,
      addEntry,
      addQualityInspection,
      addStockAssignment,
      addWeighbridgeRecord,
      billingRecords,
      cameraLogs,
      canAccess,
      commodityMovements,
      currentEmployee,
      currentUser,
      employees,
      entries,
      findEntry,
      generateExitBill,
      loginUser,
      logoutUser,
      markBillPaid,
      qualityInspections,
      registerUser,
      stockAssignments,
      storageLocations,
      weighbridgeRecords,
    ],
  );

  return <TollContext.Provider value={value}>{children}</TollContext.Provider>;
}

const TollContext = createContext<TollStore | null>(null);

export function useTollStore() {
  const value = useContext(TollContext);

  if (!value) {
    throw new Error('useTollStore must be used inside TollStoreProvider');
  }

  return value;
}
