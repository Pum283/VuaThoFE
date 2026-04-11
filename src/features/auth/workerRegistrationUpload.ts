import {
  WORKER_REGISTRATION_ALLOWED_EXTENSIONS,
  WORKER_REGISTRATION_MAX_FILE_BYTES,
} from '../../constants/workerRegistrationUpload'

function getExtensionLower(name: string) {
  const i = name.lastIndexOf('.')
  if (i < 0) return ''
  return name.slice(i).toLowerCase()
}

/** Trả về thông báo lỗi tiếng Việt hoặc `null` nếu hợp lệ. */
export function validateWorkerRegistrationFile(file: File): string | null {
  const ext = getExtensionLower(file.name)
  if (!ext || !(WORKER_REGISTRATION_ALLOWED_EXTENSIONS as readonly string[]).includes(ext)) {
    return `File "${file.name}" không được hỗ trợ. Chỉ chấp nhận: PDF, JPG, JPEG, PNG, WEBP.`
  }
  if (file.size <= 0) {
    return `File "${file.name}" không hợp lệ (kích thước 0).`
  }
  if (file.size > WORKER_REGISTRATION_MAX_FILE_BYTES) {
    return `File "${file.name}" vượt quá 10 MB.`
  }
  return null
}

export type WorkerRegistrationTextFields = {
  otpVerificationToken: string
  phoneNumber: string
  email: string
  password: string
  fullName: string
}

export type WorkerExternalRegistrationFields = WorkerRegistrationTextFields & {
  diploma: File | null
  identityCard: File
  otherDocuments: File[]
}

export function buildWorkerExternalRegistrationFormData(fields: WorkerExternalRegistrationFields) {
  const fd = new FormData()
  fd.append('otpVerificationToken', fields.otpVerificationToken)
  fd.append('phoneNumber', fields.phoneNumber)
  fd.append('email', fields.email)
  fd.append('password', fields.password)
  fd.append('fullName', fields.fullName)
  if (fields.diploma) {
    fd.append('diploma', fields.diploma)
  }
  fd.append('identityCard', fields.identityCard)
  for (const f of fields.otherDocuments) {
    fd.append('otherDocuments', f)
  }
  return fd
}

export type WorkerDirectRegistrationFields = WorkerRegistrationTextFields & { cv: File }

export function buildWorkerDirectRegistrationFormData(fields: WorkerDirectRegistrationFields) {
  const fd = new FormData()
  fd.append('otpVerificationToken', fields.otpVerificationToken)
  fd.append('phoneNumber', fields.phoneNumber)
  fd.append('email', fields.email)
  fd.append('password', fields.password)
  fd.append('fullName', fields.fullName)
  fd.append('cv', fields.cv)
  return fd
}
