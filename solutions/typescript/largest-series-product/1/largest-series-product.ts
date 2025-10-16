export const largestProduct = (digits: string, span: number): number => {
  if (span < 0) throw new Error('Span must not be negative')
  if (span > digits.length || (digits.length === 0 && span > 0))
    throw new Error('Span must be smaller than string length')
  if (/[^0-9]/.test(digits))
    throw new Error('Digits input must only contain digits')
  if (span === 0) return 1

  let maxProduct = 0

  for (let i = 0; i <= digits.length - span; i++) {
    const slice = digits.slice(i, i + span)
    const product = slice.split('').reduce((acc, d) => acc * Number(d), 1)
    if (product > maxProduct) maxProduct = product
  }

  return maxProduct
}
