import { useEffect, useState } from 'react'
import { motion, useMotionValue, useSpring } from 'framer-motion'
import './CustomCursor.css'

function CustomCursor() {
  const [enabled, setEnabled] = useState(false)
  const x = useMotionValue(-20)
  const y = useMotionValue(-20)
  const ringX = useSpring(x, { stiffness: 190, damping: 24, mass: 0.25 })
  const ringY = useSpring(y, { stiffness: 190, damping: 24, mass: 0.25 })

  useEffect(() => {
    const pointerQuery = window.matchMedia('(pointer: fine) and (min-width: 768px)')
    const updateEnabled = () => setEnabled(pointerQuery.matches)
    updateEnabled()
    pointerQuery.addEventListener('change', updateEnabled)

    return () => pointerQuery.removeEventListener('change', updateEnabled)
  }, [])

  useEffect(() => {
    if (!enabled) return undefined

    const updatePointer = (event) => {
      x.set(event.clientX)
      y.set(event.clientY)
    }

    window.addEventListener('pointermove', updatePointer, { passive: true })
    return () => window.removeEventListener('pointermove', updatePointer)
  }, [enabled, x, y])

  if (!enabled) return null

  return (
    <>
      <motion.span className="custom-cursor-ring" aria-hidden="true" style={{ x: ringX, y: ringY }} />
      <motion.span className="custom-cursor-dot" aria-hidden="true" style={{ x, y }} />
    </>
  )
}

export default CustomCursor
