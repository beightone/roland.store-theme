import { useEffect, useRef, useState } from 'react'

interface StickyLayoutObserverProps {
  elementObserver: string
  elementSticky: string
}

const StickyLayoutObserver = ({
  elementObserver,
  elementSticky,
}: StickyLayoutObserverProps) => {
  console.log(elementObserver, elementSticky, 'here aqui')
  const [isVisible, setIsVisible] = useState(false)
  const observerRef = useRef<IntersectionObserver | null>(null)

  useEffect(() => {
    const target = document.querySelector(elementObserver)
    const stickyElement = document.querySelector(elementSticky) as HTMLElement

    console.log('target, sticky here aqui', target, stickyElement)

    if (!target || !stickyElement) return

    observerRef.current = new IntersectionObserver(
      ([entry]) => {
        setIsVisible(entry.isIntersecting)
      },
      { root: null, threshold: 0.1 }
    )

    observerRef.current.observe(target)

    return () => {
      observerRef.current?.disconnect()
    }
  }, [])

  useEffect(() => {
    const stickyElement = document.querySelector(elementSticky) as HTMLElement

    if (stickyElement) {
      stickyElement.style.display = isVisible ? 'none' : ''
    }
  }, [isVisible])

  return null
}

export default StickyLayoutObserver
