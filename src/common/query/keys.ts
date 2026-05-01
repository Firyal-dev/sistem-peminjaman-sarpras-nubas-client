// Centralized query keys — semua cache key ada di sini
export const queryKeys = {
    classes: {
        all: ['classes'] as const,
    },
    students: {
        all: ['students'] as const,
        byClass: (classId: number) => ['students', { classId }] as const,
    },
    items: {
        all: ['items'] as const,
        one: (id: number) => ['items', id] as const,
    },
    units: {
        byItem: (itemId: number) => ['units', { itemId }] as const,
    },
    transactions: {
        all: (params?: { status?: string; student_id?: number; page?: number }) =>
            ['transactions', params ?? {}] as const,
        one: (id: number) => ['transactions', id] as const,
    },
}
