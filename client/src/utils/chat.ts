export function readFileAsBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onloadend = () => resolve((reader.result as string)?.split(',')[1])
    reader.onerror = reject
    reader.readAsDataURL(file)
  })
}