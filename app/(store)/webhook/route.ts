import { NextApiRequest, NextApiResponse } from 'next'
import crypto from 'crypto'
import { backendClient } from '@/sanity/lib/backendClient'

// Secret key from environment variables
const secret = 'sk_test_90eb1745293480e2f0499fab3524097fa8c401c1'

if (!secret) {
  throw new Error('PAYSTACK_SECRET_KEY is not set in environment variables')
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' })
  }

  try {
    // Validate Paystack signature
    const hash = crypto
      .createHmac('sha512', secret)
      .update(JSON.stringify(req.body))
      .digest('hex')

    if (hash !== req.headers['x-paystack-signature']) {
      return res.status(400).json({ message: 'Invalid signature' })
    }

    // Process the Paystack event
    const event = req.body

    console.log('Valid Paystack event received:', event)

    // Example: Update Sanity CMS with the event data
    if (event.event === 'charge.success') {
      const { reference, customer, amount } = event.data

      await backendClient.create({
        _type: 'payment',
        _id: reference, // Use reference as the unique ID
        customerEmail: customer.email,
        amountPaid: amount / 100, // Convert to base currency
        status: 'success',
        createdAt: new Date().toISOString(),
      })

      console.log('Payment data saved to Sanity')
    }

    res.status(200).json({ message: 'Event processed successfully' })
  } catch (error) {
    console.error('Error processing webhook:', error)
    res.status(500).json({ message: 'Internal server error' })
  }
}
