export type CategoryDto = {
  id: string
  name: string
  description?: string | null
}

export type CreateCategoryRequest = {
  name: string
  description?: string
}

export type UpdateCategoryRequest = {
  name: string
  description?: string
}

