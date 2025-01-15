export function formatCurrency(
  amount: number,
  currency: string = 'NGN' // Default to Nigerian Naira
): string {
  try {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: currency.toUpperCase(),
    }).format(amount)
  } catch (error) {
    // Fallback formatting if the currency code is invalid
    console.error('Invalid currency code:', currency, error)
    return `${currency.toUpperCase()} ${amount.toFixed(2)}`
  }
}
