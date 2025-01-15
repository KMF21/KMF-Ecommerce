import { formatCurrency } from '@/lib/formatCurrency'
import { imageUrl } from '@/lib/imageUrl'
import { getMyOrders } from '@/sanity/lib/products/orders/getMyOrders'
import { auth } from '@clerk/nextjs/server'
import Image from 'next/image'
import { redirect } from 'next/navigation'
import React from 'react'

async function Orders() {
  const { userId } = await auth()

  if (!userId) {
    return redirect('/')
  }

  const orders = await getMyOrders(userId)
  const orders2 = [
    {
      orderNumber: 'ORD123456',
      orderDate: '2025-01-10T14:32:00Z',
      status: 'paid',
      totalPrice: 120.5,
      amountDiscount: 10,
      currency: 'NGN',
      products: [
        {
          product: {
            _id: 'prod1',
            name: 'Wireless Mouse',
            price: 25.5,
            image: 'https://placehold.co/600x400/png',
          },
          quantity: 2,
        },
        {
          product: {
            _id: 'prod2',
            name: 'Mechanical Keyboard',
            price: 69.5,
            image: 'https://placehold.co/600x400/png',
          },
          quantity: 1,
        },
      ],
    },
    {
      orderNumber: 'ORD789012',
      orderDate: '2025-01-12T10:15:00Z',
      status: 'processing',
      totalPrice: 200,
      amountDiscount: 0,
      currency: 'NGN',
      products: [
        {
          product: {
            _id: 'prod3',
            name: 'Gaming Headset',
            price: 100,
            image: 'https://placehold.co/600x400/png',
          },
          quantity: 1,
        },
        {
          product: {
            _id: 'prod4',
            name: 'USB-C Hub',
            price: 50,
            image: 'https://placehold.co/600x400/png',
          },
          quantity: 2,
        },
      ],
    },
    {
      orderNumber: 'ORD345678',
      orderDate: '2025-01-14T08:45:00Z',
      status: 'paid',
      totalPrice: 300,
      amountDiscount: 50,
      currency: 'NGN',
      products: [
        {
          product: {
            _id: 'prod5',
            name: '4K Monitor',
            price: 250,
            image: 'https://placehold.co/600x400/png',
          },
          quantity: 1,
        },
        {
          product: {
            _id: 'prod6',
            name: 'Ergonomic Chair',
            price: 100,
            image: 'https://placehold.co/600x400/png',
          },
          quantity: 1,
        },
      ],
    },
  ]

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 p-4">
      <div className="bg-white p-4 sm:p-8 rounded-xl shadow-lg w-full max-w-4xl">
        <h1 className="text-4xl font-bold text-gray-900 tracking-tight mb-8">
          My Orders
        </h1>
        {orders2.length === 0 ? (
          <div className="text-center text-gray-600">
            <p>You have not placed any orders yet.</p>
          </div>
        ) : (
          <div className="space-y-6 sm:space-y-8">
            {orders2.map((order: any) => (
              <div
                // key={index}
                key={order.orderNumber}
                className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden"
              >
                <div className="p-4 sm:p-6 border-b border-gray-200">
                  <div className="flex flex-col gap-4 sm:flex-row sm:justify-between sm:items-center mb-4">
                    <div>
                      <p className="text-sm text-gray-600 mb-1 font-bold">
                        Order Number
                      </p>

                      <p className="font-mono text-sm text-green-600 break-all">
                        {order.orderNumber}
                      </p>
                    </div>
                    <div className="sm:text-right">
                      <p className="text-sm text-gray-600 mb-1">Order Date</p>
                      <p className="font-medium">
                        {order.orderData
                          ? new Date(order.orderDate).toLocaleDateString()
                          : 'N/A'}
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-col gap-4 sm:flex-row sm:justify-between sm:items-center">
                    <div className="flex items-center">
                      <span className="text-sm mr-2">Status:</span>
                      <span
                        className={`px-3 py-1 rounded-full text-sm ${order.status === 'paid' ? 'bg-green-200 text-green-800' : 'bg-gray-100 text-gray-800'}`}
                      >
                        {order.status}
                      </span>
                    </div>
                    <div className="sm:text-right">
                      <p className="text-sm text-gray-600 mb-1">
                        {' '}
                        Total Amount
                      </p>
                      <p className="font-bold text-lg">
                        {formatCurrency(order.totalPrice ?? 0, order.currency)}
                      </p>
                    </div>
                  </div>
                  {order.amountDiscount ? (
                    <div className="mt-4 p-3 sm:p-4 bg-red-50 rounded-lg">
                      <p className="text-red-600 font-medium mb-1 text-sm sm:text-base">
                        Discount Applied:{' '}
                        {formatCurrency(order.amountDiscount, order.currency)}
                      </p>
                      <p className="text-sm text-gray-600">
                        Original subtotal:{' '}
                        {formatCurrency(
                          (order.totalPrice ?? 0) + (order.amountDiscount ?? 0),
                          order.currency
                        )}
                      </p>
                    </div>
                  ) : null}
                </div>

                <div className="px-4 py-3 sm:px-6 sm:py-4">
                  <p className="text-sm font-semibold text-gray-600 mb-3 sm:mb-4 ">
                    Order Items
                  </p>
                  <div className="space-y-3 sm:space-y-4">
                    {order.products?.map((product: any) => (
                      <div
                        key={product.product?._id}
                        className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 py-2 border-b last:border-b-0"
                      >
                        <div className="flex items-center gap-3 sm:gap-4">
                          {product.product?.image && (
                            <div className="relative h-14 w-14 sm:h-16 sm:w-16 flex-shrink-0 rounded-md overflow-hidden">
                              <Image
                                src={
                                  product.product?.image ||
                                  'https://placehold.co/150x150'
                                }
                                alt={product.product?.name || 'Product Image'}
                                className="object-cover"
                                fill
                              />
                            </div>
                          )}
                          <div>
                            <p className="font-medium text-sm sm:test-base">
                              {product.product?.name}
                            </p>
                            <p className="text-sm text-gray-600">
                              Quantity: {product.quantity ?? 'N/A'}
                            </p>
                          </div>
                        </div>
                        <p className="font-medium text-right ">
                          {product.product?.price && product.quantity
                            ? formatCurrency(
                                product.product.price * product.quantity,
                                order.currency
                              )
                            : 'N/A'}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default Orders
