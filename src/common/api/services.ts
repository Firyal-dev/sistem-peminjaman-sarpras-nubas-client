import { api } from "./axios";

// ─── Types ────────────────────────────────────────────────────────────────────

export interface ApiClass {
  id: number;
  grade: number;   // 10 | 11 | 12 | 13
  major: string;   // e.g. "PPLG", "Farmasi", "Analis Kimia"
  rombel: number;  // 1, 2, 3, …
  full_name: string; // accessor from backend: "10 PPLG 1"
  students_count?: number; // withCount('students') from index
  created_at: string;
  updated_at: string;
}

export interface ApiStudent {
  id: number;
  name: string;
  nis: string;
  class_id: number;
  class: ApiClass;
  created_at: string;
  updated_at: string;
}

export interface ApiItem {
  id: number;
  name: string;
  photo: string | null;
  units_count: number;
  available_units_count: number;
  created_at: string;
  updated_at: string;
}

export interface ApiUnit {
  id: number;
  item_id: number;
  qr_code: string;
  status: "available" | "borrowed";
  created_at: string;
  updated_at: string;
}

export interface ApiTransactionDetail {
  id: number;
  transaction_id: number;
  unit_id: number;
  status: "borrowed" | "returned";
  unit: ApiUnit & { item: ApiItem };
}

export interface ApiTransaction {
  id: number;
  student_id: number;
  borrow_time: string;
  due_time: string;
  return_time: string | null;
  status: "active" | "done";
  notes: string | null;
  student: ApiStudent & { class: ApiClass };
  details: ApiTransactionDetail[];
}

export interface PaginatedResponse<T> {
  data: T[];
  current_page: number;
  last_page: number;
  per_page: number;
  total: number;
}

export interface ScanBorrowResponse {
  data: {
    unit_id: number;
    qr_code: string;
    status: string;
    item: ApiItem;
  };
}

// ─── Auth ─────────────────────────────────────────────────────────────────────

export const authService = {
  login: (email: string, password: string) =>
    api
      .post<{
        token: string;
        user: { id: number; name: string; email: string };
      }>("/login", { email, password })
      .then((r) => r.data),
  logout: () => api.post("/logout"),
  me: () => api.get("/me").then((r) => r.data),
};

// ─── Classes ──────────────────────────────────────────────────────────────────

export const classesService = {
  getAll: () => api.get<ApiClass[]>("/classes").then((r) => r.data),
  getOne: (id: number) => api.get<ApiClass>(`/classes/${id}`).then((r) => r.data),
  create: (data: { grade: number; major: string; rombel: number }) =>
    api.post<ApiClass>("/classes", data).then((r) => r.data),
  update: (id: number, data: Partial<{ grade: number; major: string; rombel: number }>) =>
    api.put<ApiClass>(`/classes/${id}`, data).then((r) => r.data),
  delete: (id: number) => api.delete(`/classes/${id}`),
};

// ─── Students ─────────────────────────────────────────────────────────────────

export const studentsService = {
  getAll: (classId?: number) =>
    api
      .get<
        ApiStudent[]
      >("/students", { params: classId ? { class_id: classId } : {} })
      .then((r) => r.data),
  create: (data: { name: string; nis: string; class_id: number }) =>
    api.post<ApiStudent>("/students", data).then((r) => r.data),
  update: (
    id: number,
    data: Partial<{ name: string; nis: string; class_id: number }>,
  ) => api.put<ApiStudent>(`/students/${id}`, data).then((r) => r.data),
  delete: (id: number) => api.delete(`/students/${id}`),
};

// ─── Items ────────────────────────────────────────────────────────────────────

export const itemsService = {
  getAll: () => api.get<ApiItem[]>("/items").then((r) => r.data),
  getOne: (id: number) => api.get<ApiItem>(`/items/${id}`).then((r) => r.data),
  create: (data: FormData | { name: string; photo?: string | null }) =>
    api.post<ApiItem>("/items", data).then((r) => r.data),
  update: (
    id: number,
    data: FormData | Partial<{ name: string; photo?: string | null }>,
  ) => api.post<ApiItem>(`/items/${id}`, data).then((r) => r.data),
  delete: (id: number) => api.delete(`/items/${id}`),
};

// ─── Units ────────────────────────────────────────────────────────────────────

export const unitsService = {
  getByItem: (itemId: number) =>
    api.get<ApiUnit[]>(`/items/${itemId}/units`).then((r) => r.data),
  generate: (itemId: number, jumlah: number) =>
    api
      .post<ApiUnit[]>(`/items/${itemId}/units`, { jumlah })
      .then((r) => r.data),
  delete: (unitId: number) => api.delete(`/units/${unitId}`),
  getQrUrl: (unitId: number) => `${api.defaults.baseURL}/units/${unitId}/qr`,
};

// ─── Scan ─────────────────────────────────────────────────────────────────────

export const scanService = {
  borrowScan: (qrCode: string) =>
    api
      .post<ScanBorrowResponse>("/scan", { qr_code: qrCode })
      .then((r) => r.data),
  returnScan: (qrCode: string, transactionId: number) =>
    api
      .post("/return/scan", { qr_code: qrCode, transaction_id: transactionId })
      .then((r) => r.data),
};

// ─── Transactions ─────────────────────────────────────────────────────────────

export const transactionsService = {
  getAll: (params?: {
    student_id?: number
    status?: "active" | "done"
    page?: number
  }) =>
    api
      .get<PaginatedResponse<ApiTransaction>>("/transactions", { params })
      .then((r) => r.data),

  getOne: (id: number) =>
    api.get<ApiTransaction>(`/transactions/${id}`).then((r) => r.data),

  create: (data: {
    student_id: number
    units: number[]
    due_time: string
    notes?: string
  }) =>
    api.post<ApiTransaction>("/transactions", data).then((r) => r.data),

  processReturn: (transactionId: number, unitIds: number[]) =>
    api
      .post<ApiTransaction>(`/transactions/${transactionId}/return`, {
        units: unitIds,
      })
      .then((r) => r.data),

  exportUrl: () => `${api.defaults.baseURL}/transactions/export`,

  exportExcel: async (filename = "laporan-transaksi.xlsx") => {
    const res = await api.get("/transactions/export", { responseType: "blob" })
    const url = URL.createObjectURL(new Blob([res.data]))
    const a = document.createElement("a")
    a.href = url
    a.download = filename
    a.click()
    URL.revokeObjectURL(url)
  },

  exportRekap: async (filename = "rekap-transaksi.xlsx") => {
    const res = await api.get("/transactions/rekap", { responseType: "blob" })
    const url = URL.createObjectURL(new Blob([res.data]))
    const a = document.createElement("a")
    a.href = url
    a.download = filename
    a.click()
    URL.revokeObjectURL(url)
  },

  getAllFull: (params?: { status?: "active" | "done" }) =>
    api
      .get<PaginatedResponse<ApiTransaction>>("/transactions", {
        params: { ...params, per_page: 9999 },
      })
      .then((r) => r.data),
}