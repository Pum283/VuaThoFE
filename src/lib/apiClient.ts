import axios from 'axios'
import { ENV } from '../env'

export const apiClient = axios.create({
  baseURL: (ENV.apiBaseUrl ?? '').replace(/\/$/, ''),
  headers: { 'Content-Type': 'application/json' },
})

