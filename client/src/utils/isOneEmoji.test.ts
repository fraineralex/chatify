import { describe, expect, it } from 'vitest'
import { isOnlyOneEmoji } from './isOneEmoji'

describe('isOnlyOneEmoji', () => {
  it('returns true for a single emoji message', () => {
    expect(isOnlyOneEmoji('😀')).toBe(true)
  })

  it('returns false for text or multiple emojis', () => {
    expect(isOnlyOneEmoji('hello')).toBe(false)
    expect(isOnlyOneEmoji('😀😀')).toBe(false)
  })
})
