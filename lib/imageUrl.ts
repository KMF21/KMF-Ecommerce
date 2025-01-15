import { backendClient } from '@/sanity/lib/backendClient'
import imageUrlBuilder from '@sanity/image-url'
import { SanityImageSource } from '@sanity/image-url/lib/types/types'

const builder = imageUrlBuilder(backendClient)

export function imageUrl(source: SanityImageSource) {
  return builder.image(source)
}
