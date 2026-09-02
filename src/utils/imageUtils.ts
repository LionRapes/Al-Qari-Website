export const cropAndCompressImage = (
  file: File,
  targetSize: number = 400,
  quality: number = 0.85,
): Promise<File> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = (e) => {
      const img = new Image()
      img.onload = () => {
        const canvas = document.createElement('canvas')
        const ctx = canvas.getContext('2d')
        if (!ctx) return reject(new Error('Canvas context not available'))

        canvas.width = targetSize
        canvas.height = targetSize

        const size = Math.min(img.width, img.height)
        const startX = (img.width - size) / 2
        const startY = (img.height - size) / 2

        ctx.drawImage(img, startX, startY, size, size, 0, 0, targetSize, targetSize)

        canvas.toBlob(
          (blob) => {
            if (blob) {
              resolve(new File([blob], 'avatar.webp', { type: 'image/webp' }))
            } else {
              reject(new Error('Canvas to Blob failed'))
            }
          },
          'image/webp',
          quality,
        )
      }
      img.onerror = reject
      img.src = e.target?.result as string
    }
    reader.onerror = reject
    reader.readAsDataURL(file)
  })
}
