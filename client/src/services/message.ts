import { StaticFile, uuid } from '../types/chat'
import { getSignedUrls } from './chat'

export const updateSignedFile = async (file: StaticFile, msgId: uuid) => {
  if (new Date().getTime() < new Date(file.expiresAt).getTime()) return file

  const updatedSignedUrls = await getSignedUrls([msgId])
  if (updatedSignedUrls.length > 0) {
    return updatedSignedUrls[0].file
  }
}

export const openFile = async (file: StaticFile, msgId: uuid) => {
  const updatedFile = await updateSignedFile(file, msgId)
  if (!updatedFile) return
  window.open(updatedFile.url, '_blank')
  return updatedFile
}

export const downloadFile = async (file: StaticFile, msgId: uuid) => {
  const updatedFile = await updateSignedFile(file, msgId)
  if (!updatedFile) return
  const response = await fetch(updatedFile.url)
  const blob = await response.blob()
  const url = URL.createObjectURL(new Blob([blob]))
  const link = document.createElement('a')
  link.href = url
  link.setAttribute('download', updatedFile.filename ?? 'file')
  document.body.appendChild(link)
  link.click()
  document.body?.removeChild(link)
  window.URL.revokeObjectURL(url)
  return updatedFile
}
