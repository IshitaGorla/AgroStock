import { createContext, PropsWithChildren, useCallback, useContext, useMemo, useState } from 'react';

export type TollEntryStatus = 'IN PREMISES' | 'EXITED';

export type TollEntry = {
  id: string;
  vehicleNumber: string;
  vehicleType: string;
  type: string;
  destination: string;
  operator: string;
  driver: string;
  entryTime: string;
  status: TollEntryStatus;
};

type NewTollEntry = {
  vehicleNumber: string;
  vehicleType: string;
  type: string;
  destination: string;
  driver: string;
};

type TollStore = {
  entries: TollEntry[];
  currentUser: string;
  addEntry: (entry: NewTollEntry) => TollEntry;
  findEntry: (vehicleNumber: string) => TollEntry | undefined;
  processExit: (vehicleNumber: string) => TollEntry | undefined;
  setCurrentUser: (name: string) => void;
  registerUser: (email: string, password: string) => boolean;
  loginUser: (email: string, password: string) => boolean;
};

const initialEntries: TollEntry[] = [
  {
    id: '1',
    vehicleNumber: 'tn557890',
    vehicleType: 'Tractor',
    type: 'Storage',
    destination: 'Packhouse',
    operator: 'Isaac',
    driver: 'hello',
    entryTime: '01.04.2026 03:32 pm',
    status: 'IN PREMISES',
  },
  {
    id: '2',
    vehicleNumber: 'tn34890',
    vehicleType: 'Mini Truck',
    type: 'Deliver',
    destination: 'Cold Storage',
    operator: 'Isaac',
    driver: 'Mohan',
    entryTime: '01.04.2026 03:28 pm',
    status: 'EXITED',
  },
  {
    id: '3',
    vehicleNumber: 'tn551234',
    vehicleType: 'Van',
    type: 'Guest',
    destination: 'Cold Storage',
    operator: 'Isaac',
    driver: 'Ravi',
    entryTime: '01.04.2026 03:20 pm',
    status: 'EXITED',
  },
  {
    id: '4',
    vehicleNumber: 'tn541234',
    vehicleType: 'Truck',
    type: 'Deliver',
    destination: 'Warehouse',
    operator: 'Isaac',
    driver: 'Kumar',
    entryTime: '01.04.2026 03:12 pm',
    status: 'EXITED',
  },
];

const TollContext = createContext<TollStore | null>(null);

function normalizeEmail(email: string) {
  return email.trim().toLowerCase();
}

export function TollStoreProvider({ children }: PropsWithChildren) {
  const [entries, setEntries] = useState<TollEntry[]>(initialEntries);
  const [currentUser, setCurrentUser] = useState('Customer');
  const [users, setUsers] = useState<{ email: string; password: string }[]>([]);

  const registerUser = useCallback((email: string, password: string) => {
    const normalizedEmail = normalizeEmail(email);

    if (users.some((user) => user.email === normalizedEmail)) {
      return false;
    }

    setUsers((current) => [...current, { email: normalizedEmail, password }]);
    return true;
  }, [users]);

  const loginUser = useCallback((email: string, password: string) => {
    const normalizedEmail = normalizeEmail(email);

    return users.some((user) => user.email === normalizedEmail && user.password === password);
  }, [users]);

  const addEntry = useCallback((entry: NewTollEntry) => {
    const created: TollEntry = {
      id: `${Date.now()}`,
      vehicleNumber: entry.vehicleNumber.trim().toLowerCase(),
      vehicleType: entry.vehicleType.trim() || 'Vehicle',
      type: entry.type.trim() || 'Deliver',
      destination: entry.destination.trim() || 'Packhouse',
      operator: 'Isaac',
      driver: entry.driver.trim() || 'Driver',
      entryTime: '01.04.2026 03:32 pm',
      status: 'IN PREMISES',
    };

    setEntries((current) => [created, ...current]);
    return created;
  }, []);

  const findEntry = useCallback(
    (vehicleNumber: string) => {
      const normalized = vehicleNumber.trim().toLowerCase();
      return entries.find((entry) => entry.vehicleNumber.toLowerCase() === normalized);
    },
    [entries],
  );

  const processExit = useCallback((vehicleNumber: string) => {
    const normalized = vehicleNumber.trim().toLowerCase();
    let updatedEntry: TollEntry | undefined;

    setEntries((current) =>
      current.map((entry) => {
        if (entry.vehicleNumber.toLowerCase() !== normalized) {
          return entry;
        }

        updatedEntry = { ...entry, status: 'EXITED' };
        return updatedEntry;
      }),
    );

    return updatedEntry;
  }, []);

  const value = useMemo(
    () => ({
      addEntry,
      currentUser,
      entries,
      findEntry,
      processExit,
      setCurrentUser,
      registerUser,
      loginUser,
    }),
    [addEntry, currentUser, entries, findEntry, processExit, registerUser, loginUser],
  );

  return <TollContext.Provider value={value}>{children}</TollContext.Provider>;
}

export function useTollStore() {
  const value = useContext(TollContext);

  if (!value) {
    throw new Error('useTollStore must be used inside TollStoreProvider');
  }

  return value;
}
