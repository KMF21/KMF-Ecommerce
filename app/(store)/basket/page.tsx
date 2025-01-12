'use client'

import useBasketStore from '@/store'
import { useAuth, useUser } from '@clerk/nextjs'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import AddToBasketButton from '@/components/AddToBasketButton'
import Image from 'next/image'
import { imageUrl } from '@/lib/imageUrl'
import Loader from '@/components/ui/Loader'
import {
  createCheckoutSession,
  Metadata,
} from '@/actions/createCheckoutSession'

function BasketPage() {
  const groupedItems = useBasketStore((state) => state.getGroupedItems())
  const { isSignedIn } = useAuth()
  const { user } = useUser()
  const router = useRouter()

  const [isClient, setIsClient] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  // Ensure client-side rendering is detected
  useEffect(() => {
    setIsClient(true)
  }, [])

  const handleCheckout = async () => {
    if (!isSignedIn) return
    setIsLoading(true)

    try {
      const metadata: Metadata = {
        orderNumber: crypto.randomUUID(),
        customerName: user?.fullName ?? 'Unknown',
        customerEmail: user?.emailAddresses[0].emailAddress ?? 'Unknown',
        clerkUserId: user?.id || '',
      }

      const checkoutUrl = await createCheckoutSession(groupedItems, metadata)

      if (checkoutUrl) {
        window.location.href = checkoutUrl
      }
    } catch (error) {
      console.error('Error creating checkout session:', error)
      alert('Failed to initiate checkout. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="container mx-auto p-4 max-w-6xl">
      {!isClient ? (
        <Loader />
      ) : !isSignedIn ? (
        <div className="flex flex-col items-center justify-center min-h-[50vh]">
          <h1 className="text-2xl font-bold mb-4 text-gray-800">Your Basket</h1>
          <p className="text-gray-600 text-lg">
            Please sign in to view your basket.
          </p>
          <button
            className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            onClick={() => router.push('/sign-in')}
          >
            Sign In
          </button>
        </div>
      ) : groupedItems.length === 0 ? (
        <div className="flex flex-col items-center justify-center min-h-[50vh]">
          <h1 className="text-2xl font-bold mb-4 text-gray-800">Your Basket</h1>
          <p className="text-gray-600 text-lg">Your basket is empty.</p>
        </div>
      ) : (
        <div className="flex flex-col lg:flex-row gap-8">
          <div className="flex-grow">
            {groupedItems.map((item) => (
              <div
                key={item.product._id}
                className="mb-4 p-4 border rounded flex items-center justify-between"
              >
                <div
                  className="flex items-center cursor-pointer flex-1 min-w-0"
                  onClick={() =>
                    router.push(`/product/${item.product.slug?.current}`)
                  }
                >
                  <div className="w-20 h-20 sm:w-24 sm:h-24 flex-shrink-0 mr-4">
                    {item.product.image && (
                      <Image
                        src={imageUrl(item.product.image).url()}
                        alt={item.product.name ?? 'Product image'}
                        className="w-full h-full object-cover rounded"
                        width={96}
                        height={96}
                      />
                    )}
                  </div>
                  <div className="min-w-0">
                    <h2 className="text-lg sm:text-xl font-semibold truncate">
                      {item.product.name}
                    </h2>
                    <p className="text-sm sm:text-base">
                      Price: N
                      {((item.product.price ?? 0) * item.quantity).toFixed(2)}
                    </p>
                  </div>
                </div>
                <div className="flex items-center ml-4 flex-shrink-0">
                  <AddToBasketButton product={item.product} />
                </div>
              </div>
            ))}
          </div>

          <div className="w-full lg:w-80 lg:sticky lg:top-4 h-fit bg-white p-6 border rounded">
            <h3 className="text-xl font-semibold">Order summary</h3>
            <div className="mt-4 space-y-2">
              <p className="flex justify-between">
                <span>Items: </span>
                <span>
                  {groupedItems.reduce(
                    (total, item) => total + item.quantity,
                    0
                  )}
                </span>
              </p>
              <p className="flex justify-between text-2xl font-bold border-t pt-2">
                <span>Total: </span>
                <span>
                  N{useBasketStore.getState().getTotalPrice().toFixed(2)}
                </span>
              </p>
            </div>

            <button
              onClick={handleCheckout}
              disabled={isLoading}
              className="mt-4 w-full bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 disabled:bg-gray-400"
            >
              {isLoading ? 'Processing...' : 'Checkout'}
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

export default BasketPage
