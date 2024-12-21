import { defineQuery } from 'next-sanity'
import { sanityFetch } from '../live'

export const getAllProducts = async () => {
  const ALL_PRODUCTS_QUERY = defineQuery(`
        *[
        _type=="product"]|order(name asc)`)

  try {
    // use sanityfetch to send the query
    const products = await sanityFetch({
      query: ALL_PRODUCTS_QUERY,
    })

    // return the list of products, or an empty array if name are found
    return products.data || []
  } catch (error) {
    console.error('Error fatch all products', error)
    return []
  }
}