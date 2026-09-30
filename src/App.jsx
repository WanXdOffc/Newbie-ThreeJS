import { useCallback, useEffect, useState } from 'react'
import { AnimatePresence, motion, MotionConfig, useMotionValue, useSpring } from 'framer-motion'
import { developer } from './portfolioData'
import './App.css'

const interactiveElements = 'a, button, [role="button"]'

function LoadingScreen({ onComplete }) {
  const [progress, setProgress] = useState(0)
  const [opening, setOpening] = useState(false)

  useEffect(() => {
    let current = 0
    let openingTimeout
    const interval = window.setInterval(() => {
      current = Math.min(current + 5, 100)
      setProgress(current)

      if (current === 100) {
        window.clearInterval(interval)
        openingTimeout = window.setTimeout(() => setOpening(true), 90)
      }
    }, 18)

    return () => {
      window.clearInterval(interval)
      window.clearTimeout(openingTimeout)
    }
  }, [])

  useEffect(() => {
    if (!opening) return undefined

    const timeout = window.setTimeout(onComplete, 720)
    return () => window.clearTimeout(timeout)
  }, [onComplete, opening])

  return (
    <motion.div
      className="loading-screen"
      role="status"
      aria-label="Loading portfolio"
      exit={{ opacity: 0 }}
      transition={{ duration: 0.16 }}
    >
      <motion.div
        className="loading-door loading-door-left"
        animate={{ x: opening ? '-102%' : '0%' }}
        transition={{ type: 'spring', stiffness: 110, damping: 24, mass: 0.85 }}
      />
      <motion.div
        className="loading-door loading-door-right"
        animate={{ x: opening ? '102%' : '0%' }}
        transition={{ type: 'spring', stiffness: 110, damping: 24, mass: 0.85 }}
      />
      <motion.div
        className="loading-copy"
        animate={{ opacity: opening ? 0 : 1, scale: opening ? 0.88 : 1 }}
        transition={{ duration: 0.18 }}
      >
        <span className="loading-kicker">{developer.name} / PORTFOLIO</span>
        <strong className="loading-count" aria-hidden="true">{progress}%</strong>
        <span className="loading-caption">MAKING AN ENTRANCE</span>
      </motion.div>
      <span className="loading-corner loading-corner-left">EST. 2025</span>
      <span className="loading-corner loading-corner-right">PLEASE STAND BY</span>
    </motion.div>
  )
}

function CustomCursor() {
  const [enabled, setEnabled] = useState(false)
  const [hovering, setHovering] = useState(false)
  const x = useMotionValue(-20)
  const y = useMotionValue(-20)
  const springX = useSpring(x, { stiffness: 420, damping: 34, mass: 0.3 })
  const springY = useSpring(y, { stiffness: 420, damping: 34, mass: 0.3 })

  useEffect(() => {
    const media = window.matchMedia('(pointer: fine) and (min-width: 768px)')
    const updateEnabled = () => setEnabled(media.matches)

    updateEnabled()
    media.addEventListener('change', updateEnabled)

    return () => media.removeEventListener('change', updateEnabled)
  }, [])

  useEffect(() => {
    if (!enabled) return undefined

    const moveCursor = (event) => {
      x.set(event.clientX)
      y.set(event.clientY)
    }
    const enterTarget = (event) => {
      if (event.target instanceof Element && event.target.closest(interactiveElements)) {
        setHovering(true)
      }
    }
    const leaveTarget = (event) => {
      if (!(event.target instanceof Element) || !event.target.closest(interactiveElements)) return
      if (event.relatedTarget instanceof Element && event.relatedTarget.closest(interactiveElements)) return
      setHovering(false)
    }

    window.addEventListener('pointermove', moveCursor)
    document.addEventListener('pointerover', enterTarget)
    document.addEventListener('pointerout', leaveTarget)

    return () => {
      window.removeEventListener('pointermove', moveCursor)
      document.removeEventListener('pointerover', enterTarget)
      document.removeEventListener('pointerout', leaveTarget)
    }
  }, [enabled, x, y])

  if (!enabled) return null

  return (
    <motion.div
      className={`custom-cursor${hovering ? ' is-hovering' : ''}`}
      aria-hidden="true"
      animate={{ scale: hovering ? 2.7 : 1 }}
      transition={{ type: 'spring', stiffness: 500, damping: 28 }}
      style={{ x: springX, y: springY }}
    />
  )
}

function App() {
  const [theme, setTheme] = useState(() => {
    try {
      return window.localStorage.getItem('portfolio-theme') === 'dark' ? 'dark' : 'light'
    } catch {
      return 'light'
    }
  })
  const [isLoaded, setIsLoaded] = useState(false)
  const completeLoading = useCallback(() => setIsLoaded(true), [])

  useEffect(() => {
    document.documentElement.dataset.theme = theme
    document.title = `${developer.name} - Developer Portfolio`

    try {
      window.localStorage.setItem('portfolio-theme', theme)
    } catch {
      return
    }
  }, [theme])

  return (
    <MotionConfig reducedMotion="user">
      <div className="portfolio-app">
        <div className="page-frame">
          <header className="topbar">
            <a className="wordmark" href="#top" aria-label={`${developer.name} home`}>
              {developer.monogram}<span>.</span>
            </a>
            <div className="build-status" aria-label="Build step one of four">
              <span className="status-light" />
              <span>FOUNDATION</span>
              <span className="status-step">01 / 04</span>
            </div>
            <button
              className="theme-toggle inline-flex items-center gap-2"
              type="button"
              aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
              aria-pressed={theme === 'dark'}
              onClick={() => setTheme((current) => current === 'light' ? 'dark' : 'light')}
            >
              <span className="theme-symbol" aria-hidden="true">{theme === 'light' ? 'L' : 'D'}</span>
              <span>{theme === 'light' ? 'LIGHT MODE' : 'DARK MODE'}</span>
            </button>
          </header>

          <main id="top" className="foundation-stage">
            <div className="stage-index stage-index-left" aria-hidden="true">INDEPENDENT DEVELOPER</div>
            <div className="stage-index stage-index-right" aria-hidden="true">CREATIVE TECHNOLOGIST</div>

            <section className="foundation-panel" aria-labelledby="foundation-title">
              <div className="panel-topline">
                <span className="panel-stamp">SITE UNDER CONSTRUCTION</span>
                <span className="panel-coordinate">40N 43' 55.3&quot;</span>
              </div>

              <p className="eyebrow"><span /> A PORTFOLIO IN FOUR ACTS</p>
              <h1 id="foundation-title">GOOD IDEAS<br />MAKE <span>NOISE.</span></h1>
              <p className="stage-description">
                {developer.role}. A new corner of the internet is taking shape.
              </p>

              <div className="stage-bottomline">
                <div className="progress-track" aria-label="Step one of four complete">
                  <span className="progress-segment is-complete" />
                  <span className="progress-segment" />
                  <span className="progress-segment" />
                  <span className="progress-segment" />
                </div>
                <span className="stage-note">FOUNDATION / 2025</span>
              </div>
              <span className="panel-sticker" aria-hidden="true">NO<br />BORING<br />BITS</span>
            </section>

            <div className="stage-footer">
              <span>DESIGNED TO STAND OUT</span>
              <span className="footer-spark" aria-hidden="true">*</span>
              <span>SCROLLING SOON</span>
            </div>
          </main>
        </div>

        <CustomCursor />
        <AnimatePresence>
          {!isLoaded && <LoadingScreen key="loading-screen" onComplete={completeLoading} />}
        </AnimatePresence>
      </div>
    </MotionConfig>
  )
}

export default App
