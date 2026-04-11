/** Giới hạn upload đăng ký thợ — đồng bộ với backend `WorkerRegistrationFileRules`. */
export const WORKER_REGISTRATION_MAX_FILE_BYTES = 10 * 1024 * 1024

export const WORKER_REGISTRATION_ALLOWED_EXTENSIONS = [
  '.pdf',
  '.jpg',
  '.jpeg',
  '.png',
  '.webp',
] as const
