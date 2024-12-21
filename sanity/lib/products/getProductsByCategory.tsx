import { sanityFetch } from '../live'

export const getProductByCategory = async (categorySlug: string) => {
  const PRODUCTS_BY_CATEGORY_QUERY = `
    *[_type == "product" 
      && references(*[_type == "category" && slug.current == $categorySlug]._id)] 
    | order(name asc)
  `

  try {
    // Fetch the products using the query and parameters
    const products = await sanityFetch({
      query: PRODUCTS_BY_CATEGORY_QUERY,
      params: {
        categorySlug,
      },
    })

    // Return the list of products or an empty array if none are found

    return products.data || []
  } catch (error) {
    console.error('Error fetching products by category:', error)
    return []
  }
}
