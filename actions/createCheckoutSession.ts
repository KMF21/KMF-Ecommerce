// 'use server'

import axios from 'axios'
import { BasketItem } from '@/store'

export type Metadata = {
  orderNumber: string
  customerName: string
  customerEmail: string
  clerkUserId: string
}

export type GroupedBasketItem = {
  product: BasketItem['product']
  quantity: number
}

export async function createCheckoutSession(
  items: GroupedBasketItem[],
  metadata: Metadata
): Promise<string> {
  console.log(process.env.SANITY_STUDIO_DATASET)
  try {
    const totalAmount =
      items.reduce(
        (total, item) => total + item.product.price! * item.quantity,
        0
      ) * 100

    const authorizationHeader = `Bearer ${process.env.NEXT_PUBLIC_PAYSTACK_SECRET_KEY}`

    const response = await axios.post(
      'https://api.paystack.co/transaction/initialize',
      {
        email: metadata.customerEmail,
        amount: totalAmount,
        currency: 'NGN',
        reference: metadata.orderNumber,
        metadata: {
          orderNumber: metadata.orderNumber,
          customerName: metadata.customerName,
          clerkUserId: metadata.clerkUserId,
        },
        channels: ['card', 'bank'],
        callback_url: `${
          process.env.VERCEL_URL
            ? `https://${process.env.VERCEL_URL}`
            : process.env.NEXT_PUBLIC_BASE_URL
        }/success?orderNumber=${metadata.orderNumber}`,
      },
      {
        headers: {
          Authorization: authorizationHeader,
          'Content-Type': 'application/json',
        },
      }
    )

    if (
      response.data &&
      response.data.data &&
      response.data.data.authorization_url
    ) {
      return response.data.data.authorization_url
    } else {
      throw new Error('Failed to initialize Paystack transaction.')
    }
  } catch (error) {
    console.error('Error creating checkout session:', error)
    throw new Error('Could not create checkout session. Please try again.')
  }
}

//   mode: 'payment',
//   allow_promotion_codes: true,
//   success_url: `${process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : process.env.NEXT_PUBLIC_BASE_URL}/success?session_id={CHECKOUT_SESSION_ID}&orderNumber=${metadata.orderNumber}`,

//   cancel_url: `${process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : process.env.NEXT_PUBLIC_BASE_URL}/basket`,

//     const paystackConfig = {
//   publicKey: process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY,
//   type: 'button',
//   email: '',
//   amount: 5000, // Paystack expects the amount in kobo (smallest unit of currency)
//   currency: 'NGN',
//   reference: Date.now().toString(),
//   channels: ['card'],
//   onerror: (error: {}) => {
//     console.error(error)
//   },
//   onSuccess: (response: {}) => {
//     // handleSaveCardToProfile(response)
//   },
//   onClose: () => {
//     // toast.warning('Payment cancelled!')
//   },
// }
