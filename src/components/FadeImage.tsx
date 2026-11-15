import { useState } from "react"
import type { ImgHTMLAttributes } from "react"

/**
 * <img> that fades in once loaded, over a subtle placeholder,
 * so images don't pop in line by line.
 */
const FadeImage = ({ className = "", onLoad, ...props }: ImgHTMLAttributes<HTMLImageElement>) => {
  const [loaded, setLoaded] = useState(false)

  return (
    <img
      loading="lazy"
      decoding="async"
      {...props}
      onLoad={(e) => {
        setLoaded(true)
        onLoad?.(e)
      }}
      className={`transition-opacity duration-700 ease-out ${loaded ? "opacity-100" : "opacity-0"} ${className}`}
    />
  )
}

export default FadeImage
