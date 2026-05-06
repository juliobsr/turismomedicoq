import type { FieldHook } from 'payload'

/**
 * Automatically formats a string into a URL-friendly slug.
 */
const format = (val: string): string =>
  val
    .replace(/ /g, '-')
    .replace(/[^\w-]+/g, '')
    .toLowerCase()

export const formatSlug = (fallback: string): FieldHook => ({ value, originalDoc, data }) => {
  if (typeof value === 'string') {
    return format(value)
  }
  const fallbackData = data?.[fallback] || originalDoc?.[fallback]

  if (fallbackData && typeof fallbackData === 'string') {
    return format(fallbackData)
  }

  return value
}