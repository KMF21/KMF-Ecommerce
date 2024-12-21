import { defineQuery } from 'next-sanity'
import { sanityFetch } from '../live'

export const getAllCategories = async () => {
  const ALL_CATEGORIES_QUERY = defineQuery(`
        *[
        _type=="category"]|order(name asc)`)

  try {
    // use sanityfetch to send the query
    const categories = await sanityFetch({
      query: ALL_CATEGORIES_QUERY,
    })

    // return the list of products, or an empty array if name are found
    return categories.data || []
  } catch (error) {
    console.error('Error fatch all products', error)
    return []
  }
}
