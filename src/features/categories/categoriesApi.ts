import { apiClient } from '../../lib/apiClient'
import type { CategoryDto } from '../../types/api/category'

export async function getCategories() {
  const res = await apiClient.get<CategoryDto[]>('/api/v1/categories')
  return res.data
}

