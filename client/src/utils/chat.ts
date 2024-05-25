/* eslint-disable no-useless-escape */
export function readFileAsBase64 (file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onloadend = () => resolve((reader.result as string)?.split(',')[1])
    reader.onerror = reject
    reader.readAsDataURL(file)
  })
}

export const extractUrlsFromText = (text: string) => {
  const linkRegex =
    /((https?:\/\/)?(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()!@:%_\+.~#?&\/\/=]*))/gm

  const words = text.split(/[\s]/)
  const textWithLinks = words.reduce(
    (acc: ({ link: string } | string)[], word: string) => {
      if (linkRegex.test(word)) acc.push({ link: word })
      else {
        const lastItem = acc[acc.length - 1]
        if (typeof lastItem === 'string') {
          acc[acc.length - 1] = `${lastItem} ${word}`
        } else {
          acc.push(word)
        }
      }

      return acc
    },
    []
  )

  return textWithLinks
}
