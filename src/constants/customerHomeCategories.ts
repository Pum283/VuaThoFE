import type { CustomerHomeCategoryIconId } from '../types/customerHome'

export type CustomerHomeCategoryDto = {
  id: string
  title: string
  workerCount: number
  iconId: CustomerHomeCategoryIconId
}

/**
 * Danh mục hiển thị trang chủ khách hàng.
 * Khi có API danh mục + số thợ, thay bằng dữ liệu từ server.
 */
export const CUSTOMER_HOME_CATEGORIES: readonly CustomerHomeCategoryDto[] = [
  { id: 'electric', title: 'Thợ điện', workerCount: 234, iconId: 'electric' },
  { id: 'plumbing', title: 'Thợ nước', workerCount: 189, iconId: 'plumbing' },
  { id: 'electronics', title: 'Sửa chữa điện tử', workerCount: 156, iconId: 'electronics' },
  { id: 'construction', title: 'Xây dựng', workerCount: 298, iconId: 'construction' },
  { id: 'furniture', title: 'Nội thất', workerCount: 167, iconId: 'furniture' },
  { id: 'cleaning', title: 'Vệ sinh', workerCount: 145, iconId: 'cleaning' },
  { id: 'beauty', title: 'Làm đẹp', workerCount: 98, iconId: 'beauty' },
  { id: 'hvac', title: 'Điều hòa', workerCount: 132, iconId: 'hvac' },
] as const
