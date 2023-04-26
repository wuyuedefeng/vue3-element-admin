/**
 * downloadBlob
 * @param blob 
 * @param fileName 
 * demo
 import axios from "axios"
 const response = axios.get('/xxx', {
   responseType: 'blob'
 })
 downloadBlob(response, 'xx.xlsx')
 */
export const downloadBlob = (blob: Blob, fileName?: string) => {
  const url = window.URL.createObjectURL(new Blob([blob]))
  const link = document.createElement('a')
  link.href = url
  fileName ||= `${+new Date()}.xlsx` // whatever your file name .
  link.setAttribute('download', fileName)
  document.body.appendChild(link)
  link.click()
  link.remove()
  window.URL.revokeObjectURL(url)
}
