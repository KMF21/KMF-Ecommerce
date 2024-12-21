// import { Product } from './sanity.types'
// import {create} from "zustand"
// import {persist} from "zustand/middleware"

// // export interface BasketItem {
// //   product: Product
// //   quantity: number
// // }

// // interface BasketState {
// //   items: BasketItem[]
// //   addItem: (product: Product) => void
// //   removeItem: (productId: string) => void
// //   clearBasket: () => void
// //   getTotalPrice: () => number
// //   getItemCount: (productId: string) => number
// //   getGroupedItems: () => BasketItem[]
// // }

// // const useBasketStore =
// //   create <
// //   BasketState >
// //   [](
// //     persist((set, get) => ({}), {
// //       name: 'basket',
// //     })
// //   )

import { Product } from './sanity.types'
import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export interface BasketItem {
  product: Product
  quantity: number
}

interface BasketState {
  items: BasketItem[]
  addItem: (product: Product) => void
  removeItem: (productId: string) => void
  clearBasket: () => void
  getTotalPrice: () => number
  getItemCount: (productId: string) => number
  getGroupedItems: () => BasketItem[]
}

const useBasketStore = create<BasketState>()(
  persist(
    (set, get) => ({
      items: [],
      addItem: (product: Product) => {
        const existingItems = get().items
        const existingItem = existingItems.find(
          (item) => item.product._id === product._id
        )

        if (existingItem) {
          set({
            items: existingItems.map((item) =>
              item.product._id === product._id
                ? { ...item, quantity: item.quantity + 1 }
                : item
            ),
          })
        } else {
          set({
            items: [...existingItems, { product, quantity: 1 }],
          })
        }
      },
      removeItem: (productId: string) => {
        const existingItems = get().items
        const updatedItems = existingItems
          .map((item) =>
            item.product._id === productId
              ? { ...item, quantity: item.quantity - 1 }
              : item
          )
          .filter((item) => item.quantity > 0)

        set({ items: updatedItems })
      },
      clearBasket: () => set({ items: [] }),
      getTotalPrice: () => {
        return get().items.reduce(
          (total, item) => total + (item?.product?.price ?? 0) * item.quantity,
          0
        )
      },
      getItemCount: (productId: string) => {
        const item = get().items.find((item) => item.product._id === productId)
        return item ? item.quantity : 0
      },
      getGroupedItems: () => get().items,
    }),
    {
      name: 'basket-store', // Key for localStorage
    }
  )
)

export default useBasketStore
