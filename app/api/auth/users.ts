// Shared in-memory user store for auth routes
export const users = new Map<string, { username: string; password: string; id: string }>()
