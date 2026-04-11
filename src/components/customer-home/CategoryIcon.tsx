import type { CustomerHomeCategoryIconId } from '../../types/customerHome'

const SIZE = 48

type Props = {
  iconId: CustomerHomeCategoryIconId
}

export function CategoryIcon({ iconId }: Props) {
  const common = { width: SIZE, height: SIZE, viewBox: '0 0 48 48', 'aria-hidden': true as const }

  switch (iconId) {
    case 'electric':
      return (
        <svg {...common} className="customer-home-category-icon customer-home-category-icon--electric">
          <path fill="currentColor" d="M28 4L12 26h10l-4 18 20-28H26l2-12z" />
        </svg>
      )
    case 'plumbing':
      return (
        <svg {...common} className="customer-home-category-icon customer-home-category-icon--plumbing">
          <path
            fill="currentColor"
            d="M24 4C18 14 12 18 12 26c0 6.6 5.4 12 12 12s12-5.4 12-12c0-8-6-12-12-22zm0 30c-3.3 0-6-2.7-6-6s2.7-6 6-6 6 2.7 6 6-2.7 6-6 6z"
          />
        </svg>
      )
    case 'electronics':
      return (
        <svg {...common} className="customer-home-category-icon customer-home-category-icon--electronics">
          <path fill="currentColor" d="M14 18h20v14H14V18zm4-4V8h12v6H18zm2 8h12v6H20v-6zm-6 16h20v4H14v-4z" />
        </svg>
      )
    case 'construction':
      return (
        <svg {...common} className="customer-home-category-icon customer-home-category-icon--construction">
          <path fill="currentColor" d="M8 40h32v4H8v-4zm4-8h6v8H12v-8zm8-20l12 12H20L12 16l8-4zm10 12h6v16h-6V24zM6 20h8v20H6V20z" />
        </svg>
      )
    case 'furniture':
      return (
        <svg {...common} className="customer-home-category-icon customer-home-category-icon--furniture">
          <path fill="currentColor" d="M6 28h36v10H6V28zm4-8c0-4 4-8 10-8s10 4 10 8v6H10v-6zm8 14h12v6H18v-6z" />
        </svg>
      )
    case 'cleaning':
      return (
        <svg {...common} className="customer-home-category-icon customer-home-category-icon--cleaning">
          <path fill="currentColor" d="M10 38h28v4H10v-4zm2-18l4 20h16l4-20H12zm6-12l2 8h8l2-8H18z" />
        </svg>
      )
    case 'beauty':
      return (
        <svg {...common} className="customer-home-category-icon customer-home-category-icon--beauty" aria-hidden="true">
          <path fill="currentColor" d="M18 8h12v32H18V8zm-8 6h6v20h-6V14zm28 0h6v20h-6V14zM22 36h4v4h-4v-4z" />
        </svg>
      )
    case 'hvac':
      return (
        <svg {...common} className="customer-home-category-icon customer-home-category-icon--hvac">
          <path
            fill="currentColor"
            d="M24 6l3 9 9 1-7 6 2 9-7-4-7 4 2-9-7-6 9-1 3-9zm0 22c-6 0-10 4-10 10h4c0-3 3-6 6-6s6 3 6 6h4c0-6-4-10-10-10z"
          />
        </svg>
      )
    default: {
      const _exhaustive: never = iconId
      void _exhaustive
      return null
    }
  }
}
