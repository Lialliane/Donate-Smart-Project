import React, { useState } from 'react'

const ERROR_IMG_SRC = "https://placehold.co/1080x720/5c5c5c/fefff5.png?text=No%20image.&font=inter";

export function ImageWithFallback(props) {
  const [didError, setDidError] = useState(false)

  const handleError = () => {
    setDidError(true);
  }

  const { src, alt, style, className, ...rest } = props

  return didError ? (
    <div
      className={`inline-block bg-gray-100 text-center align-middle ${className ?? ''}`}
      style={style}
    >
      <div className="flex items-center justify-center w-full h-full">
        <img src={ERROR_IMG_SRC} alt="Error loading image" {...rest} data-original-url={src} />
      </div>
    </div>
  ) : (
    <img src={src} alt={alt} className={className} style={style} {...rest} onError={handleError} />
  )
}
