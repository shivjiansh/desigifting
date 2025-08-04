'use client'

import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { Product, CartItem } from '@/lib/types'
import { toast } from 'sonner';  // or whatever toast library you use


interface CartState {
  items: CartItem[]
  total: number
  shipping: number
  tax: number
  addItem: (product: Product, quantity?: number) => boolean // return false if failed due to seller mismatch
  removeItem: (productId: string) => void
  updateQuantity: (productId: string, quantity: number) => void
  clearCart: () => void
  itemExists: (productId: string) => boolean
  getCount: () => number
  calculateTotals: () => void
}

const TAX_RATE = 0.13 // 13% tax
const SHIPPING_COST = 0 // Free shipping

const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      total: 0,
      shipping: 0,
      tax: 0,

      addItem: (product, quantity = 1) => {
        const { items, calculateTotals } = get()

        // Check if cart is empty or new product has the same seller as existing items
        if (items.length > 0) {
          const currentSellerId = items[0].sellerId
          const newSellerId = product.sellerId

          if (newSellerId !== currentSellerId) {
            // Different seller - reject adding, caller should show user message
            return false
          }
        }

        // Now add or update quantity
        const existingIndex = items.findIndex(
          (item) => item.id === product.id || item._id === product._id
        )

        if (existingIndex >= 0) {
          // Update quantity but not exceeding stock
          const existingItem = items[existingIndex]
          const newQty = Math.min(existingItem.quantity + quantity, product.stock)
          const updatedItems = [...items]
          updatedItems[existingIndex] = { ...existingItem, quantity: newQty }
          set({ items: updatedItems })
        } else {
          // Add new item with clamped quantity
          const newQty = Math.min(quantity, product.stock)
          set({
            items: [
              ...items,
              {
                ...product,
                quantity: newQty,
                id: product.id || product._id || '',
              },
            ],
          })
        }

        calculateTotals()
        return true
      },

      removeItem: (productId) => {
        set({
          items: get().items.filter(
            (item) => item.id !== productId && item._id !== productId
          ),
        })
        get().calculateTotals()
      },

      updateQuantity: (productId, quantity) => {
        // Get current items from store
        const items = get().items
        const item = items.find(
          (i) => i.id === productId || i._id === productId
        )

        if (!item) return

        // Clamp requested quantity to [1, stock]
        const clampedQty = Math.min(Math.max(quantity, 1), item.stock)

        // Remove item if quantity goes below 1
        if (clampedQty < 1) {
          get().removeItem(productId)
          return
        }

        set({
          items: items.map((curr) =>
            curr.id === productId || curr._id === productId
              ? { ...curr, quantity: clampedQty }
              : curr
          ),
        })
        get().calculateTotals()
      },

      clearCart: () => set({ items: [], total: 0, shipping: 0, tax: 0 }),

      itemExists: (productId) =>
        get().items.some(
          (item) => item.id === productId || item._id === productId
        ),

      getCount: () =>
        get().items.reduce((sum, item) => sum + item.quantity, 0),

      calculateTotals: () => {
        const items = get().items
        const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0)

        const tax = subtotal * TAX_RATE
        const shipping = SHIPPING_COST

        set({
          shipping,
          tax,
          total: subtotal + tax + shipping,
        })
      },
    }),
    {
      name: 'giftly-cart',
      partialize: (state) => ({
        items: state.items,
      }),
    }
  )
)

// Initialize totals on startup
useCartStore.getState().calculateTotals()

export default useCartStore
