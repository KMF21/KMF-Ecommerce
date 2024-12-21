import type { Metadata } from 'next'
import localFont from 'next/font/local'
import '../globals.css'
import { ClerkProvider } from '@clerk/nextjs'
import Header from '@/components/Header'
import { SanityLive } from '@/sanity/lib/live'

// const geistSans = localFont({
//   src: './fonts/GeistVF.woff',
//   variable: '--font-geist-sans',
//   weight: '100 900',
// })
// const geistMono = localFont({
//   src: './fonts/GeistMonoVF.woff',
//   variable: '--font-geist-mono',
//   weight: '100 900',
// })

export const metadata: Metadata = {
  title: 'KMF Ecommerce',
  description: 'Built by KMF',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <ClerkProvider dynamic>
      <html lang="en">
        <body>
          <main>
            <Header />
            {children}
          </main>
          <SanityLive />
        </body>
      </html>
    </ClerkProvider>
  )
}
