export const COUPON_CODE = {
  BFRIDAY: 'BFRIDAY',
  XMAS: 'XMAS',
  KMF: 'KMF',
} as const

export type CouponCode = keyof typeof COUPON_CODE
