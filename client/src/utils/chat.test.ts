import { describe, expect, it } from 'vitest'
import { extractUrlsFromText } from './chat'

describe('extractUrlsFromText', () => {
  it('detects links and keeps surrounding text grouped', () => {
    const result = extractUrlsFromText('see https://chatify.test and reply')

    expect(result).toEqual([
      'see',
      { link: 'https://chatify.test' },
      'and reply'
    ])
  })

  it('returns plain text when no links are present', () => {
    expect(extractUrlsFromText('plain message')).toEqual(['plain message'])
  })
})
