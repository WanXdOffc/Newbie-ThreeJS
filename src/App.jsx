import { useCallback, useEffect, useState } from 'react'
import { AnimatePresence, motion, MotionConfig, useMotionValue, useSpring } from 'framer-motion'
import { albumPhotos, developer, githubActivity, links, techStack } from './portfolioData'
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

function HomeBento() {
  const [profileHovered, setProfileHovered] = useState(false)
  const [canDrag, setCanDrag] = useState(false)

  useEffect(() => {
    const media = window.matchMedia('(pointer: fine) and (min-width: 768px)')
    const updateCanDrag = () => setCanDrag(media.matches)

    updateCanDrag()
    media.addEventListener('change', updateCanDrag)

    return () => media.removeEventListener('change', updateCanDrag)
  }, [])

  const quickLinks = links.filter(({ id }) => ['blog', 'api', 'code-library'].includes(id))

  return (
    <main id="top" className="home-stage">
      <div className="home-heading-line">
        <p className="home-kicker"><span className="status-light" /> PERSONAL WORKSPACE / 2025</p>
        <span className="home-coordinate">{developer.location}</span>
      </div>

      <section className="bento-grid" aria-label={`${developer.name}'s portfolio introduction`}>
        <motion.article
          className="bento-card profile-card"
          drag={canDrag}
          dragSnapToOrigin
          dragElastic={0.16}
          dragMomentum={false}
          whileDrag={{ scale: 1.025, zIndex: 5 }}
        >
          <div className="profile-content">
            <span className="card-index">01 / INTRODUCTION</span>
            <p className="profile-hello">HEY, I'M</p>
            <h1 className="profile-name">{developer.name}<span>.</span></h1>
            <p className="profile-role">{developer.role}</p>
            <p className="profile-availability"><span />{developer.availability}</p>
          </div>
          <button
            className="profile-photo-control"
            type="button"
            aria-label={`Reveal alternate portrait of ${developer.name}`}
            onMouseEnter={() => setProfileHovered(true)}
            onMouseLeave={() => setProfileHovered(false)}
            onFocus={() => setProfileHovered(true)}
            onBlur={() => setProfileHovered(false)}
          >
            <motion.img
              className="profile-photo profile-photo-primary"
              src={developer.profileImages[0]}
              alt={`${developer.name}, portrait one`}
              animate={{ opacity: profileHovered ? 0 : 1 }}
              transition={{ duration: 0.18 }}
            />
            <motion.img
              className="profile-photo profile-photo-alternate"
              src={developer.profileImages[1]}
              alt={`${developer.name}, portrait two`}
              animate={{ opacity: profileHovered ? 1 : 0 }}
              transition={{ duration: 0.18 }}
            />
            <span className="photo-caption">HOVER TO SWITCH / 02</span>
          </button>
          <span className="profile-corner-mark" aria-hidden="true">MK</span>
        </motion.article>

        <motion.article
          className="bento-card cube-card"
          drag={canDrag}
          dragSnapToOrigin
          dragElastic={0.16}
          dragMomentum={false}
          whileDrag={{ scale: 1.025, zIndex: 5 }}
        >
          <span className="card-index">02 / PLAYGROUND</span>
          <div className="cube-copy">
            <h2>Curiosity<br />in 3D.</h2>
            <p>A tiny corner for big ideas.</p>
          </div>
          <div className="cube-scene" aria-hidden="true">
            <div className="css-cube">
              <span className="cube-face cube-front">JS</span>
              <span className="cube-face cube-back">UI</span>
              <span className="cube-face cube-right">&lt;/&gt;</span>
              <span className="cube-face cube-left">CSS</span>
              <span className="cube-face cube-top">01</span>
              <span className="cube-face cube-bottom">MK</span>
            </div>
          </div>
          <span className="cube-orbit" aria-hidden="true" />
        </motion.article>

        <article className="bento-card mobile-art-card">
          <span className="card-index">02 / PLAYGROUND</span>
          <img src={albumPhotos[0].image} alt={albumPhotos[0].alt} />
          <span className="mobile-art-caption">A LITTLE CORNER FOR BIG IDEAS</span>
        </article>

        <section className="bento-card links-card" aria-labelledby="links-title">
          <div className="links-card-heading">
            <span className="card-index">03 / AROUND THE WEB</span>
            <h2 id="links-title">Find me out there.</h2>
          </div>
          <div className="quick-links">
            {quickLinks.map((link, index) => (
              <a
                className="quick-link"
                href={link.href}
                key={link.id}
                target="_blank"
                rel="noreferrer"
              >
                <span className="quick-link-number">0{index + 1}</span>
                <span>{link.label}</span>
                <span className="quick-link-arrow" aria-hidden="true">&#8599;</span>
              </a>
            ))}
          </div>
        </section>

        <motion.article
          className="bento-card availability-card"
          drag={canDrag}
          dragSnapToOrigin
          dragElastic={0.2}
          dragMomentum={false}
          whileDrag={{ scale: 1.04, zIndex: 5 }}
        >
          <span className="availability-spark" aria-hidden="true">*</span>
          <span className="card-index">CURRENT STATUS</span>
          <p>{developer.availability}</p>
          <span className="availability-dot" aria-hidden="true" />
        </motion.article>

        <motion.article
          className="bento-card note-card"
          drag={canDrag}
          dragSnapToOrigin
          dragElastic={0.2}
          dragMomentum={false}
          whileDrag={{ scale: 1.04, zIndex: 5 }}
        >
          <span className="card-index">CURRENTLY INTO</span>
          <p>Useful things.<br />Unusual details.</p>
          <span className="note-stamp" aria-hidden="true">MK / NYC</span>
        </motion.article>
      </section>

      <section className="marquee-tape" aria-label={`Tech stack: ${techStack.join(', ')}`}>
        <motion.div
          className="marquee-track"
          aria-hidden="true"
          animate={{ x: ['0%', '-50%'] }}
          transition={{ duration: 26, ease: 'linear', repeat: Infinity }}
        >
          {[0, 1].map((copy) => (
            <span className="marquee-group" key={copy}>
              {techStack.map((technology) => (
                <span className="marquee-item" key={`${copy}-${technology}`}>
                  {technology}<span aria-hidden="true">*</span>
                </span>
              ))}
            </span>
          ))}
        </motion.div>
      </section>
    </main>
  )
}

function AboutSection() {
  return (
    <section className="content-section about-section" aria-labelledby="about-title">
      <div className="section-heading">
        <div>
          <p className="section-kicker">04 / THE PERSON BEHIND THE PIXELS</p>
          <h2 id="about-title">A little about me.</h2>
        </div>
        <span className="section-aside">MORE THAN JUST THE SCREEN</span>
      </div>

      <div className="about-layout">
        <article className="about-copy-card">
          <span className="card-index">THE SHORT VERSION</span>
          <h3>Human first.<br />Pixel precise.</h3>
          <p>{developer.bio}</p>
          <span className="about-signature">{developer.monogram} / {developer.location}</span>
        </article>

        <section className="github-card" aria-labelledby="github-title">
          <div className="github-heading">
            <div>
              <span className="card-index">A YEAR OF TINY WINS</span>
              <h3 id="github-title">GitHub activity</h3>
            </div>
            <span className="mock-badge">MOCK DATA</span>
          </div>
          <p className="github-subtitle">A sample year in commits. Real rhythm, imaginary numbers.</p>
          <div className="github-graph-scroll">
            <div className="github-graph-layout">
              <div className="github-day-labels" aria-hidden="true">
                <span />
                <span>Mon</span>
                <span />
                <span>Wed</span>
                <span />
                <span>Fri</span>
                <span />
              </div>
              <div
                className="github-activity-grid"
                role="img"
                aria-label="Mock GitHub contribution graph with 52 weeks and 7 days per week"
              >
                {githubActivity.flatMap((week, weekIndex) =>
                  week.map((level, dayIndex) => (
                    <span
                      className={`activity-square activity-level-${level}`}
                      key={`${weekIndex}-${dayIndex}`}
                      aria-hidden="true"
                    />
                  )),
                )}
              </div>
            </div>
          </div>
          <div className="github-legend" aria-hidden="true">
            <span>LESS</span>
            {[0, 1, 2, 3, 4].map((level) => (
              <span className={`activity-square activity-level-${level}`} key={level} />
            ))}
            <span>MORE</span>
          </div>
        </section>
      </div>
    </section>
  )
}

function AlbumSection() {
  const [tilts] = useState(() => albumPhotos.map(() => Number((-3 + Math.random() * 8).toFixed(1))))

  return (
    <section className="content-section album-section" aria-labelledby="album-title">
      <div className="section-heading">
        <div>
          <p className="section-kicker">05 / OUTSIDE THE TAB</p>
          <h2 id="album-title">Little things, kept close.</h2>
        </div>
        <span className="section-aside">A FEW FRAMES FROM REAL LIFE</span>
      </div>

      <div className="album-grid">
        {albumPhotos.map((photo, index) => (
          <motion.figure
            className="polaroid"
            key={photo.id}
            initial={{ rotate: tilts[index] }}
            whileHover={{ rotate: 0, scale: 1.045, y: -7 }}
            transition={{ type: 'spring', stiffness: 340, damping: 22, mass: 0.65 }}
          >
            <span className="polaroid-tape" aria-hidden="true" />
            <div className="polaroid-photo-frame">
              <img src={photo.image} alt={photo.alt} loading="lazy" />
            </div>
            <figcaption>
              <span>{photo.caption}</span>
              <span className="polaroid-number">0{index + 1}</span>
            </figcaption>
          </motion.figure>
        ))}
      </div>
    </section>
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
            <div className="build-status" aria-label="Build step two of four">
              <span className="status-light" />
              <span>HOME</span>
              <span className="status-step">02 / 04</span>
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

          <HomeBento />
          <AboutSection />
          <AlbumSection />
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
