import { useCallback, useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion, MotionConfig, useMotionValue, useSpring } from 'framer-motion'
import {
  albumPhotos,
  certifications,
  developer,
  education,
  experience,
  leadership,
  links,
  navigation,
  projects,
  skills,
} from './portfolioData'
import './App.css'

const interactiveElements = 'a, button, [role="button"]'

function SocialIcon({ name }) {
  if (name === 'github') {
    return <svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M12 .9a11.1 11.1 0 0 0-3.51 21.63c.55.1.76-.24.76-.53v-2.08c-3.1.67-3.76-1.32-3.76-1.32-.5-1.28-1.23-1.62-1.23-1.62-1-.69.08-.68.08-.68 1.1.08 1.68 1.13 1.68 1.13.98 1.67 2.57 1.19 3.2.91.1-.71.38-1.2.7-1.48-2.48-.28-5.1-1.24-5.1-5.53 0-1.22.44-2.22 1.13-3-.12-.28-.49-1.42.1-2.96 0 0 .92-.3 3.05 1.15a10.6 10.6 0 0 1 5.55 0c2.12-1.44 3.04-1.15 3.04-1.15.6 1.54.22 2.68.11 2.96.7.78 1.12 1.78 1.12 3.01 0 4.3-2.62 5.24-5.12 5.51.4.35.75 1.03.75 2.08V22c0 .3.2.64.77.53A11.1 11.1 0 0 0 12 .9Z" /></svg>
  }

  if (name === 'linkedin') {
    return <svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M5.2 3.4a2.2 2.2 0 1 1 0 4.4 2.2 2.2 0 0 1 0-4.4ZM3.3 9.5h3.8v11.2H3.3V9.5Zm6.1 0H13v1.5h.05a4.1 4.1 0 0 1 3.7-2c4 0 4.7 2.6 4.7 5.9v5.8h-3.8v-5.2c0-1.25-.02-2.85-1.74-2.85-1.74 0-2 1.36-2 2.76v5.29H9.4V9.5Z" /></svg>
  }

  if (name === 'instagram') {
    return <svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M7.2 2.5h9.6a4.7 4.7 0 0 1 4.7 4.7v9.6a4.7 4.7 0 0 1-4.7 4.7H7.2a4.7 4.7 0 0 1-4.7-4.7V7.2a4.7 4.7 0 0 1 4.7-4.7Zm0 1.8a2.9 2.9 0 0 0-2.9 2.9v9.6a2.9 2.9 0 0 0 2.9 2.9h9.6a2.9 2.9 0 0 0 2.9-2.9V7.2a2.9 2.9 0 0 0-2.9-2.9H7.2Zm4.8 2.9a4.8 4.8 0 1 1 0 9.6 4.8 4.8 0 0 1 0-9.6Zm0 1.8a3 3 0 1 0 0 6 3 3 0 0 0 0-6Zm5-3.2a1.15 1.15 0 1 1 0 2.3 1.15 1.15 0 0 1 0-2.3Z" /></svg>
  }

  return null
}

const skillLogoSources = {
  React: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg',
  TypeScript: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/typescript/typescript-original.svg',
  JavaScript: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/javascript/javascript-original.svg',
  HTML: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/html5/html5-original.svg',
  CSS: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/css3/css3-original.svg',
  'Framer Motion': 'https://cdn.simpleicons.org/framer/0055FF',
  'Web Audio': 'https://cdn.simpleicons.org/mdnwebdocs/000000',
  'Responsive UI': 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/css3/css3-original.svg',
  Git: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/git/git-original.svg',
  Figma: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/figma/figma-original.svg',
  Accessibility: 'https://cdn.jsdelivr.net/npm/@fortawesome/fontawesome-free@6/svgs/solid/universal-access.svg',
  'Design systems': 'https://cdn.simpleicons.org/storybook/FF4785',
}

function LoadingScreen({ onComplete }) {
  const [isLoading, setIsLoading] = useState(true)
    const [progress, setProgress] = useState(0)
  const completedExitAnimations = useRef(0)

  const completeExitAnimation = () => {
    if (isLoading) return
    completedExitAnimations.current += 1
    if (completedExitAnimations.current === 3) onComplete()
  }

  useEffect(() => {
    const startedAt = performance.now()
      const duration = 2600
    let frame
    let exitTimeout
    const updateProgress = (now) => {
      const nextProgress = Math.min(Math.round(((now - startedAt) / duration) * 100), 100)
      setProgress(nextProgress)

      if (nextProgress < 100) frame = window.requestAnimationFrame(updateProgress)
        else exitTimeout = window.setTimeout(() => setIsLoading(false), 100)
    }

    frame = window.requestAnimationFrame(updateProgress)

    return () => {
      window.cancelAnimationFrame(frame)
      window.clearTimeout(exitTimeout)
    }
  }, [])

  const marqueeText = '// SYSTEM INITIALIZING // LOADING ASSETS // MARA KIM PORTFOLIO //'
  const marqueeCopies = Array.from({ length: 4 }, (_, index) => <span className="loading-tape-copy" key={index}>{marqueeText}</span>)

  return (
    <motion.div
      className="loading-screen"
      role="status"
      aria-label={`Assembling portfolio, ${progress}%`}
    >
      <motion.div
        className="loading-split-panel loading-split-panel-top"
        animate={{ y: isLoading ? '0%' : '-105%' }}
          transition={{ type: 'spring', stiffness: 320, damping: 30, mass: 0.62 }}
        onAnimationComplete={completeExitAnimation}
      >
        <div className="loading-tape loading-tape-top" aria-hidden="true">
          <div className="loading-tape-track">{marqueeCopies}</div>
        </div>
      </motion.div>

      <motion.div
        className="loading-centerpiece"
        animate={{ scale: isLoading ? 1 : 55, opacity: isLoading ? 1 : 0 }}
          transition={{ duration: 0.48, ease: 'easeInOut' }}
        onAnimationComplete={completeExitAnimation}
      >
        <div className="loading-spline-placeholder" aria-label="Spline 3D canvas placeholder">
          <span className="loading-spline-label">SPLINE / 3D SCENE PLACEHOLDER</span>
        </div>
        <div className="loading-counter-wrap">
          <strong className="loading-percentage">{progress}%</strong>
          <span className="loading-status-badge">[ STATUS: ASSEMBLING VOXEL MODULES ]</span>
        </div>
      </motion.div>

      <motion.div
        className="loading-split-panel loading-split-panel-bottom"
        animate={{ y: isLoading ? '0%' : '105%' }}
        transition={{ type: 'spring', stiffness: 320, damping: 30, mass: 0.62 }}
        onAnimationComplete={completeExitAnimation}
      >
        <div className="loading-tape loading-tape-bottom" aria-hidden="true">
          <div className="loading-tape-track">{marqueeCopies}</div>
        </div>
        <div className="loading-bottom-content">
          <div className="loading-progress-bar" role="progressbar" aria-label="Portfolio loading progress" aria-valuemin="0" aria-valuemax="100" aria-valuenow={progress}>
            <motion.span className="loading-progress-fill" animate={{ scaleX: progress / 100 }} transition={{ duration: 0.12, ease: 'linear' }} />
          </div>
        </div>
      </motion.div>
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
      if (event.target instanceof Element && event.target.closest(interactiveElements)) setHovering(true)
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

function HomeBento({ onAction }) {
  const [carColorIndex, setCarColorIndex] = useState(0)
  const [carLabelVisible, setCarLabelVisible] = useState(false)
  const [carIsTurbo, setCarIsTurbo] = useState(false)
  const carOffset = useMotionValue('0%')
  const carHoverRef = useRef(false)
  const carTurboRef = useRef(false)
  const turboTimeoutRef = useRef(null)
  const labelTimeoutRef = useRef(null)
  const carColors = [
    { name: 'Red Racer', color: '#c51626', accent: '#ffd500' },
    { name: 'Blue Comet', color: '#0879c9', accent: '#fffdf5' },
    { name: 'Yellow Turbo', color: '#ffd500', accent: '#101010' },
    { name: 'Green Flash', color: '#009b62', accent: '#fffdf5' },
  ]
  const selectedCar = carColors[carColorIndex]
  const [tickerCopies, setTickerCopies] = useState(12)

  useEffect(() => {
    const updateCopies = () => setTickerCopies(Math.max(4, Math.ceil(window.innerWidth / 250) * 2))
    updateCopies()
    window.addEventListener('resize', updateCopies)
    return () => window.removeEventListener('resize', updateCopies)
  }, [])

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return undefined

    let frame
    let previousTime = 0
    let progress = 0
    let currentSpeed = 1 / 24000

    const moveCar = (time) => {
      if (!previousTime) previousTime = time
      const elapsed = Math.min(time - previousTime, 48)
      previousTime = time
      const targetSpeed = 1 / (carTurboRef.current ? 8000 : carHoverRef.current ? 13000 : 24000)
      currentSpeed += (targetSpeed - currentSpeed) * (1 - Math.exp(-elapsed / 500))
      progress = (progress + currentSpeed * elapsed) % 1
      carOffset.set(`${progress * 100}%`)
      frame = window.requestAnimationFrame(moveCar)
    }

    frame = window.requestAnimationFrame(moveCar)
    return () => window.cancelAnimationFrame(frame)
  }, [carOffset])

  useEffect(() => () => {
    window.clearTimeout(turboTimeoutRef.current)
    window.clearTimeout(labelTimeoutRef.current)
  }, [])

  return (
    <main id="home" className="home-stage">
      <section className="hero-showcase" aria-label={`${developer.name}'s portfolio introduction`}>
        <div className="hero-copy">
          <p className="hero-status"><span className="status-light" /> STATUS: READY TO BUILD</p>
          <h1 className="hero-title">{developer.name.split(' ')[0]}<br /><span>{developer.name.split(' ').slice(1).join(' ')}</span></h1>
          <div className="hero-bio-panel">
            <p>{developer.bio}</p>
            <div className="hero-tags" aria-label="Specialties">
              <span>{developer.role.split('&')[0].trim()}</span>
              <span>Creative Developer</span>
              <span>UI / UX</span>
              <span>Motion & Interaction</span>
            </div>
          </div>
          <a className="hero-project-button" href="#projects" onClick={onAction}>
            VIEW PROJECTS <span aria-hidden="true">&#8594;</span>
          </a>
        </div>

        <div className="hero-portrait-wrap" onPointerLeave={() => { carHoverRef.current = false }}>
          <div className="hero-portrait-frame">
            <img src={developer.profileImages[0]} alt={`${developer.name}, portrait`} />
            <span className="portrait-corner portrait-corner-top" aria-hidden="true" />
            <span className="portrait-corner portrait-corner-bottom" aria-hidden="true" />
          </div>
          <div className="car-orbit-track">
            <motion.button
              className={`portrait-car${carIsTurbo ? ' is-turbo' : ''}`}
              type="button"
              aria-label={`Change car color. Current color: ${selectedCar.name}`}
              title="Click to change car color"
              style={{ '--car-color': selectedCar.color, '--car-accent': selectedCar.accent, offsetDistance: carOffset }}
              onPointerEnter={() => { carHoverRef.current = true }}
              onPointerLeave={() => { carHoverRef.current = false }}
              onFocus={() => { carHoverRef.current = true }}
              onBlur={() => { carHoverRef.current = false }}
              onClick={() => {
                setCarColorIndex((index) => (index + 1) % carColors.length)
                window.clearTimeout(turboTimeoutRef.current)
                window.clearTimeout(labelTimeoutRef.current)
                carHoverRef.current = false
                carTurboRef.current = true
                setCarIsTurbo(true)
                setCarLabelVisible(true)
                turboTimeoutRef.current = window.setTimeout(() => {
                  carTurboRef.current = false
                  setCarIsTurbo(false)
                }, 2600)
                labelTimeoutRef.current = window.setTimeout(() => setCarLabelVisible(false), 2600)
              }}
            >
              <span className="car-headlight-beam" aria-hidden="true" />
              <span className="car-body" aria-hidden="true">
                <span className="car-window car-window-front" />
                <span className="car-window car-window-back" />
                <span className="car-light car-light-front" />
                <span className="car-light car-light-back" />
              </span>
              <span className="car-wheel car-wheel-front-left" aria-hidden="true" />
              <span className="car-wheel car-wheel-front-right" aria-hidden="true" />
              <span className="car-wheel car-wheel-back-left" aria-hidden="true" />
              <span className="car-wheel car-wheel-back-right" aria-hidden="true" />
            </motion.button>
            <motion.span
              className={`car-nameplate${carLabelVisible ? ' is-visible' : ''}`}
              aria-live="polite"
              style={{ offsetDistance: carOffset }}
            >
              {selectedCar.name}
            </motion.span>
          </div>
          <span className="floating-label floating-label-top">&#9998; {developer.role}</span>
          <span className="floating-label floating-label-bottom">&#9673; AVAILABLE FOR WORK</span>
        </div>
      </section>

      <section className="marquee-tape" aria-label="Code, design, build">
        <div className="marquee-track" aria-hidden="true">
          {Array.from({ length: tickerCopies }, (_, copy) => (
            <span className="marquee-group" key={copy}>
              {['CODE', 'DESIGN', 'BUILD'].map((word) => (
                <span className="marquee-item" key={`${copy}-${word}`}>{word}<span>*</span></span>
              ))}
            </span>
          ))}
        </div>
      </section>
    </main>
  )
}

function GithubActivityCard() {
  const [githubData, setGithubData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [failed, setFailed] = useState(false)

  useEffect(() => {
    const controller = new AbortController()
    const username = developer.githubUsername

    Promise.all([
      fetch(`https://api.github.com/users/${username}`, { signal: controller.signal }),
      fetch(`https://github-contributions-api.jogruber.de/v4/${username}?y=last`, { signal: controller.signal }),
    ])
      .then(async ([profileResponse, activityResponse]) => {
        if (!profileResponse.ok || !activityResponse.ok) throw new Error('GitHub data request failed')
        const [profile, activity] = await Promise.all([profileResponse.json(), activityResponse.json()])
        setGithubData({ profile, activity })
      })
      .catch((error) => {
        if (error.name !== 'AbortError') setFailed(true)
      })
      .finally(() => {
        if (!controller.signal.aborted) setLoading(false)
      })

    return () => controller.abort()
  }, [])

  const contributions = githubData?.activity.contributions ?? []
  const weeks = []
  contributions.forEach((day, index) => {
    const weekIndex = Math.floor(index / 7)
    weeks[weekIndex] ??= []
    weeks[weekIndex].push(day)
  })

  if (weeks.length && weeks.at(-1).length < 7) {
    weeks[weeks.length - 1].push(...Array.from({ length: 7 - weeks.at(-1).length }, (_, index) => ({
      date: `empty-${index}`,
      count: 0,
      level: 0,
    })))
  }

  const productiveDays = contributions.filter(({ count }) => count > 0).length
  let longestStreak = 0
  let currentStreak = 0
  contributions.forEach(({ count }) => {
    currentStreak = count > 0 ? currentStreak + 1 : 0
    longestStreak = Math.max(longestStreak, currentStreak)
  })

  const stats = githubData ? [
    { label: 'KONTRIBUSI / 1 TAHUN', value: githubData.activity.total.lastYear.toLocaleString('id-ID') },
    { label: 'STREAK TERBAIK', value: `${longestStreak} HARI` },
    { label: 'HARI PRODUKTIF', value: productiveDays },
    { label: 'PUBLIC REPOSITORY', value: githubData.profile.public_repos },
  ] : []

  return (
    <section className="github-card" aria-label={`Aktivitas GitHub @${developer.githubUsername}`}>
      <div className="github-heading">
        <div className="github-profile-links">
          <a className="github-profile-pill" href={`https://github.com/${developer.githubUsername}`} target="_blank" rel="noreferrer">
            {githubData && <img src={githubData.profile.avatar_url} alt="" />}
            @{developer.githubUsername} <span aria-hidden="true">&#8599;</span>
          </a>
          {githubData && <span className="github-contribution-total">{githubData.activity.total.lastYear.toLocaleString('id-ID')} KONTRIBUSI</span>}
        </div>
        <a className="github-period-pill" href={`https://github.com/${developer.githubUsername}`} target="_blank" rel="noreferrer">1 TAHUN TERAKHIR</a>
      </div>

      <div className="github-graph-scroll">
        {loading ? (
          <p className="github-load-state" role="status">Memuat aktivitas GitHub...</p>
        ) : failed ? (
          <p className="github-load-state" role="status">Data GitHub belum bisa dimuat. <a href={`https://github.com/${developer.githubUsername}`} target="_blank" rel="noreferrer">Buka profil</a></p>
        ) : (
          <div className="github-graph-layout">
            <div className="github-day-labels" aria-hidden="true">
              <span />
              <span>Sen</span>
              <span />
              <span>Rab</span>
              <span />
              <span>Jum</span>
              <span />
            </div>
            <div
              className="github-activity-grid"
              role="img"
              aria-label={`${githubData.activity.total.lastYear.toLocaleString('id-ID')} GitHub contributions by ${developer.githubUsername} in the last year`}
              style={{ '--week-count': weeks.length }}
            >
              {weeks.flatMap((week, weekIndex) => week.map((day, dayIndex) => (
                <span
                  className={`activity-square activity-level-${day.level}`}
                  key={`${weekIndex}-${dayIndex}`}
                  title={day.date.startsWith('empty-') ? '' : `${day.count} kontribusi · ${day.date}`}
                  aria-hidden="true"
                />
              )))}
            </div>
          </div>
        )}
      </div>

      {!loading && !failed && (
        <div className="github-live-stats">
          {stats.map((stat) => (
            <article className="github-live-stat" key={stat.label}>
              <span>{stat.label}</span>
              <strong>{stat.value}</strong>
            </article>
          ))}
        </div>
      )}
      <div className="github-legend" aria-hidden="true">
        <span>SEDIKIT</span>
        {[0, 1, 2, 3, 4].map((level) => <span className={`activity-square activity-level-${level}`} key={level} />)}
        <span>BANYAK</span>
      </div>
    </section>
  )
}

function AboutSection({ onSelectDetail }) {
  const [showAllEducation, setShowAllEducation] = useState(false)
  const [showAllOrganizations, setShowAllOrganizations] = useState(false)
  const [showAllCertificates, setShowAllCertificates] = useState(false)
  const [showAllSkills, setShowAllSkills] = useState(false)
  const skillItems = skills.flatMap((group) => group.items.map((name) => ({ name, category: group.category })))
  const careerStart = Math.min(...experience.map(({ period }) => Number(period.slice(0, 4))))
  const stats = [
    { value: projects.length, suffix: '+', label: 'PROJECTS COMPLETED' },
    { value: new Date().getFullYear() - careerStart, suffix: '+', label: 'YEARS EXPERIENCE' },
    { value: skillItems.length, suffix: '+', label: 'SKILLS IN TOOLKIT' },
    { value: 100, suffix: '%', label: 'PASSION FOR CODE' },
  ]

  return (
    <motion.section
      id="about"
      className="content-section about-section scroll-reveal"
      aria-labelledby="about-title"
      initial={{ opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.08 }}
      transition={{ duration: 0.48, ease: [0.22, 0.7, 0.2, 1] }}
    >
      <div className="section-heading">
        <div>
          <p className="section-kicker">ABOUT ME</p>
          <h2 id="about-title">Human first. Pixel precise.</h2>
        </div>
        <span className="section-aside">MORE THAN JUST THE SCREEN</span>
      </div>

      <div className="about-layout">
        <article className="about-copy-card">
          <span className="card-index">THE SHORT VERSION</span>
          <h3>Curiosity in.<br />Useful things out.</h3>
          <p>{developer.bio}</p>
          <span className="about-signature">{developer.monogram} / {developer.location}</span>
        </article>

        <GithubActivityCard />
      </div>

      <section className="education-section" aria-labelledby="education-title">
        <div className="about-subsection-heading">
          <span className="detail-kicker">EDUCATION</span>
          <span className="about-subsection-spacer" id="education-title" />
        </div>
        <div className="education-list">
          {education.slice(0, showAllEducation ? education.length : 4).map((item, index) => (
            <motion.article
              className="education-entry"
              key={item.id}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              whileHover={{ y: -3 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.22, delay: index * 0.04 }}
            >
              <span className="education-mark" aria-hidden="true">{item.institution.slice(0, 1)}</span>
              <div className="education-copy">
                <span className="detail-period">{item.period}</span>
                <h4>{item.institution}</h4>
                <p className="education-qualification">{item.qualification}</p>
                <p className="education-detail">{item.detail}</p>
              </div>
            </motion.article>
          ))}
        </div>
        {education.length > 4 && (
          <button className="about-more-button" type="button" aria-expanded={showAllEducation} onClick={() => setShowAllEducation((value) => !value)}>
            {showAllEducation ? 'SHOW LESS' : `VIEW ALL EDUCATION (${education.length - 4} MORE)`}
          </button>
        )}
      </section>

      <div className="about-stats" aria-label="Portfolio statistics">
        {stats.map((stat) => <CountUpStat key={stat.label} {...stat} />)}
      </div>

      <ExperienceSection />

      <div className="about-collections">
        <section className="about-collection" aria-labelledby="organizations-title">
          <div className="about-subsection-heading">
            <span className="detail-kicker">ORGANIZATIONS & LEADERSHIP</span>
            <span id="organizations-title" className="about-subsection-spacer" />
          </div>
          <div className="organization-grid">
            {leadership.slice(0, showAllOrganizations ? leadership.length : 4).map((item, index) => (
              <motion.article className="organization-card" key={item.id} initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }} whileHover={{ y: -4 }} viewport={{ once: true, amount: 0.15 }} transition={{ duration: 0.2, delay: index * 0.04 }}>
                {(item.images?.[0] || item.image) && <div className="organization-cover"><img src={item.images?.[0] || item.image} alt={`${item.organization} activity`} loading="lazy" /></div>}
                <span className="detail-period">{item.period}</span>
                <h4>{item.organization}</h4>
                <p className="organization-role">{item.role}</p>
                <p className="organization-detail">{item.detail}</p>
                <button className="entry-detail-button" type="button" onClick={() => onSelectDetail({ ...item, title: item.organization, type: 'ORGANIZATION', subtitle: item.role, description: item.detail, details: [{ label: 'PERIODE', value: item.period }, { label: 'PERAN', value: item.role }, ...(item.location ? [{ label: 'LOKASI', value: item.location }] : [])] })}>VIEW DETAIL <span aria-hidden="true">&#8594;</span></button>
              </motion.article>
            ))}
          </div>
          {leadership.length > 4 && (
            <button className="about-more-button" type="button" aria-expanded={showAllOrganizations} onClick={() => setShowAllOrganizations((value) => !value)}>
              {showAllOrganizations ? 'SHOW LESS' : `VIEW ALL ORGANIZATIONS (${leadership.length - 4} MORE)`}
            </button>
          )}
        </section>

        <section className="about-collection" aria-labelledby="certificates-title">
          <div className="about-subsection-heading">
            <span className="detail-kicker">LICENSES & CERTIFICATIONS</span>
            <span className="about-subsection-spacer" id="certificates-title" />
          </div>
          <div className="certificate-grid">
            {certifications.slice(0, showAllCertificates ? certifications.length : 4).map((item, index) => (
              <motion.article className="certificate-card" key={item.id} initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }} whileHover={{ y: -4 }} viewport={{ once: true, amount: 0.15 }} transition={{ duration: 0.2, delay: index * 0.04 }}>
                <div className="certificate-art" aria-hidden="true">
                  {(item.images?.[0] || item.image) ? (
                    <img src={item.images?.[0] || item.image} alt="" loading="lazy" />
                  ) : (
                    <div className="certificate-cover-copy"><span>{item.issuer}</span><strong>{item.name}</strong><small>{item.year}</small></div>
                  )}
                </div>
                <span className="certificate-year">{item.year}</span>
                <h4>{item.name}</h4>
                <p>{item.issuer}</p>
                <button className="entry-detail-button" type="button" onClick={() => onSelectDetail({ ...item, title: item.name, type: 'CERTIFICATE', subtitle: item.issuer, description: item.description || '', details: [{ label: 'PENERBIT', value: item.issuer }, { label: 'TAHUN', value: item.year }, { label: 'CREDENTIAL ID', value: item.credentialId || 'Belum dicantumkan' }, ...(item.credentialUrl ? [{ label: 'URL KREDENSIAL', value: item.credentialUrl, href: item.credentialUrl }] : [])] })}>VIEW DETAIL <span aria-hidden="true">&#8594;</span></button>
              </motion.article>
            ))}
          </div>
          {certifications.length > 4 && (
            <button className="about-more-button" type="button" aria-expanded={showAllCertificates} onClick={() => setShowAllCertificates((value) => !value)}>
              {showAllCertificates ? 'SHOW LESS' : `VIEW ALL CERTIFICATES (${certifications.length - 4} MORE)`}
            </button>
          )}
        </section>

        <section className="about-collection skills-section" aria-labelledby="skills-title">
          <div className="skills-heading-row">
            <div className="about-subsection-heading">
              <span className="detail-kicker">TECHNICAL ARSENAL</span>
              <h3 id="skills-title">BRICKBOX <span>// SKILLS</span></h3>
            </div>
            <span className="skills-count">{skillItems.length} SKILLS</span>
          </div>
          <div className="skill-tile-grid">
            {skillItems.slice(0, showAllSkills ? skillItems.length : 8).map((item, index) => (
              <motion.article className="skill-tile" key={item.name} initial={{ opacity: 0, y: 8 }} whileInView={{ opacity: 1, y: 0 }} whileHover={{ y: -3, scale: 1.02 }} viewport={{ once: true, amount: 0.2 }} transition={{ duration: 0.18, delay: index * 0.025 }}>
                <span className="skill-tile-mark" aria-hidden="true">
                  <img src={skillLogoSources[item.name]} alt="" loading="lazy" />
                </span>
                <span className="skill-tile-copy"><strong>{item.name}</strong><small>{item.category}</small></span>
              </motion.article>
            ))}
          </div>
          {skillItems.length > 8 && (
            <button className="about-more-button" type="button" aria-expanded={showAllSkills} onClick={() => setShowAllSkills((value) => !value)}>
              {showAllSkills ? 'SHOW LESS' : `VIEW ALL SKILLS (${skillItems.length - 8} MORE)`}
            </button>
          )}
        </section>
      </div>
    </motion.section>
  )
}

function CountUpStat({ value, suffix, label }) {
  const [count, setCount] = useState(value)
  const [isCounting, setIsCounting] = useState(false)

  useEffect(() => {
    if (!isCounting) return undefined

    const start = performance.now()
    let frame
    const update = (now) => {
      const progress = Math.min((now - start) / 850, 1)
      const easedProgress = 1 - (1 - progress) ** 3
      setCount(Math.round(value * easedProgress))

      if (progress < 1) frame = window.requestAnimationFrame(update)
      else setIsCounting(false)
    }

    frame = window.requestAnimationFrame(update)
    return () => window.cancelAnimationFrame(frame)
  }, [isCounting, value])

  const startCount = () => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setCount(value)
      setIsCounting(false)
      return
    }

    setCount(0)
    setIsCounting(true)
  }
  const resetCount = () => {
    setIsCounting(false)
    setCount(value)
  }

  return (
    <motion.article
      className="about-stat"
      tabIndex={0}
      aria-label={`${value}${suffix} ${label.toLowerCase()}`}
      onHoverStart={startCount}
      onHoverEnd={resetCount}
      onFocus={startCount}
      onBlur={resetCount}
      whileHover={{ y: -4 }}
      transition={{ duration: 0.16 }}
    >
      <strong aria-hidden="true">{count}{suffix}</strong>
      <span>{label}</span>
    </motion.article>
  )
}

function AlbumSection() {
  const [tilts] = useState(() => albumPhotos.map(() => Number((-3 + Math.random() * 8).toFixed(1))))

  return (
    <motion.section
      className="content-section album-section scroll-reveal"
      aria-labelledby="album-title"
      initial={{ opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.12 }}
      transition={{ duration: 0.48, ease: [0.22, 0.7, 0.2, 1] }}
    >
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
    </motion.section>
  )
}

function ProjectsSection({ onSelectProject, onAction }) {
  const [showAll, setShowAll] = useState(false)
  const [activeFilter, setActiveFilter] = useState('ALL')
  const projectCategories = [...new Set(projects.map((project) => project.category.split('/')[0].trim()))]
  const filteredProjects = activeFilter === 'ALL'
    ? projects
    : projects.filter((project) => project.category.startsWith(activeFilter))
  const visibleProjects = showAll ? filteredProjects : filteredProjects.slice(0, 6)

  return (
    <motion.section
      id="projects"
      className="content-section projects-section scroll-reveal"
      aria-labelledby="projects-title"
      initial={{ opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.08 }}
      transition={{ duration: 0.48, ease: [0.22, 0.7, 0.2, 1] }}
    >
      <div className="section-heading project-heading">
        <div>
          <p className="section-kicker">SELECTED WORKS</p>
          <h2 id="projects-title">BUILT <span>PROJECTS</span></h2>
        </div>
        <div className="project-filters" role="group" aria-label="Filter projects">
          {['ALL', ...projectCategories].map((filter) => (
            <button
              className={`project-filter${activeFilter === filter ? ' is-active' : ''}`}
              type="button"
              key={filter}
              aria-pressed={activeFilter === filter}
              onClick={() => {
                onAction()
                setActiveFilter(filter)
                setShowAll(false)
              }}
            >
              {filter}
            </button>
          ))}
        </div>
      </div>

      <motion.div className="project-grid" layout>
        <AnimatePresence initial={false}>
          {visibleProjects.map((project) => (
          <motion.article
            className="project-card"
            key={project.id}
            layout
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 8 }}
            transition={{ duration: 0.18 }}
          >
            <div className="project-image-frame">
              {project.images?.[0] || project.image ? (
                <img src={project.images?.[0] || project.image} alt={`${project.title} project preview`} loading="lazy" />
              ) : (
                <div className="project-text-cover">
                  <span>{project.category}</span>
                  <strong>{project.title}</strong>
                </div>
              )}
              <span className="project-category-badge">{project.category.split('/')[0].trim()}</span>
              <span className="project-year">{project.category.split('/')[1]?.trim()}</span>
            </div>
            <div className="project-card-content">
              <p className="project-category">{project.category}</p>
              <h3>{project.title}</h3>
              <p className="project-summary">{project.summary}</p>
              <ul className="project-card-tech" aria-label="Technologies">
                {project.technologies.slice(0, 4).map((technology) => <li key={technology}>{technology}</li>)}
                {project.technologies.length > 4 && <li>+{project.technologies.length - 4}</li>}
              </ul>
              <div className="project-card-footer">
                <button
                  className="project-open-button"
                  type="button"
                  aria-haspopup="dialog"
                  onClick={() => {
                    onAction()
                    onSelectProject(project)
                  }}
                >
                  READ CASE STUDY <span aria-hidden="true">&#8594;</span>
                </button>
                <a className="project-code-link" href={project.repositoryUrl} target="_blank" rel="noreferrer" aria-label={`View ${project.title} code`} onClick={onAction}>
                  &lt;/&gt;
                </a>
              </div>
            </div>
          </motion.article>
          ))}
        </AnimatePresence>
      </motion.div>
      {filteredProjects.length > 6 && (
        <div className="projects-more-row">
          <button
            className="projects-more-button"
            type="button"
            aria-expanded={showAll}
            onClick={() => {
              onAction()
              setShowAll((current) => !current)
            }}
          >
            {showAll ? 'SHOW LESS' : `SHOW MORE / ${filteredProjects.length - 6}`}
          </button>
        </div>
      )}
    </motion.section>
  )
}

function ProjectModal({ project, onClose, onAction }) {
  const [imageIndex, setImageIndex] = useState(0)
  const closeButtonRef = useRef(null)
  const modalRef = useRef(null)
  const projectImages = Array.isArray(project.images) ? project.images.filter(Boolean) : project.image ? [project.image] : []
  const imageCount = Math.max(projectImages.length, 1)

  useEffect(() => {
    const previouslyFocused = document.activeElement
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    closeButtonRef.current?.focus()

    const handleKeyDown = (event) => {
      if (event.key === 'Escape') onClose()
      if (event.key === 'ArrowLeft') setImageIndex((current) => (current - 1 + imageCount) % imageCount)
      if (event.key === 'ArrowRight') setImageIndex((current) => (current + 1) % imageCount)

      if (event.key === 'Tab') {
        const focusable = modalRef.current?.querySelectorAll('button:not([disabled]), a[href]')
        const first = focusable?.[0]
        const last = focusable?.[focusable.length - 1]

        if (event.shiftKey && document.activeElement === first) {
          event.preventDefault()
          last?.focus()
        } else if (!event.shiftKey && document.activeElement === last) {
          event.preventDefault()
          first?.focus()
        }
      }
    }

    document.addEventListener('keydown', handleKeyDown)

    return () => {
      document.body.style.overflow = previousOverflow
      document.removeEventListener('keydown', handleKeyDown)
      if (previouslyFocused instanceof HTMLElement) previouslyFocused.focus()
    }
  }, [imageCount, onClose])

  const changeImage = (direction) => {
    onAction()
    setImageIndex((current) => (current + direction + imageCount) % imageCount)
  }

  return (
    <motion.div
      className="modal-backdrop"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose()
      }}
    >
      <motion.section
        className="project-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-project-title"
        ref={modalRef}
        initial={{ opacity: 0, scale: 0.94, y: 18 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.96, y: 12 }}
        transition={{ type: 'spring', stiffness: 360, damping: 28 }}
      >
        <div className="modal-topline">
          <div className="modal-window-dots" aria-hidden="true"><span /><span /><span /></div>
          <span className="modal-file-label">{project.category ? 'PROJECT FILE' : 'PORTFOLIO DETAIL'} / {project.category || project.type}</span>
          <button
            className="modal-close"
            type="button"
            aria-label="Close project details"
            onClick={onClose}
            ref={closeButtonRef}
          >
            <span aria-hidden="true">X</span>
          </button>
        </div>

        <div className="modal-content-grid">
          <div className="modal-gallery">
            <div className="modal-image-frame">
              {projectImages.length ? (
                <AnimatePresence mode="wait" initial={false}>
                  <motion.img
                    key={projectImages[imageIndex]}
                    src={projectImages[imageIndex]}
                    alt={`${project.title} preview ${imageIndex + 1}`}
                    initial={{ opacity: 0, x: 12 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -12 }}
                    transition={{ duration: 0.16 }}
                  />
                </AnimatePresence>
              ) : (
                <div className="modal-text-cover">
                  <span>{project.category}</span>
                  <strong>{project.title}</strong>
                  <p>{project.summary || project.subtitle || project.description}</p>
                </div>
              )}
            </div>
            {projectImages.length > 1 && (
              <div className="carousel-controls">
                <button type="button" aria-label="Previous project image" onClick={() => changeImage(-1)}>PREV</button>
                <span className="carousel-count">0{imageIndex + 1} / 0{imageCount}</span>
                <button type="button" aria-label="Next project image" onClick={() => changeImage(1)}>NEXT</button>
              </div>
            )}
          </div>

          <div className="modal-project-details">
            <p className="project-category">{project.category || project.type}</p>
            <h2 id="modal-project-title">{project.title}</h2>
            {project.subtitle && <p className="entry-modal-subtitle">{project.subtitle}</p>}
            {project.description && <p className="modal-description">{project.description}</p>}
            {project.details?.length > 0 && (
              <dl className="entry-modal-details">
                {project.details.map((detail) => (
                  <div key={detail.label}>
                    <dt>{detail.label}</dt>
                    <dd>{detail.href ? <a href={detail.href} target="_blank" rel="noreferrer">{detail.value} &#8599;</a> : detail.value}</dd>
                  </div>
                ))}
              </dl>
            )}
            {project.technologies?.length > 0 && <>
              <span className="modal-stack-label">BUILT WITH</span>
              <ul className="project-tags">
                {project.technologies.map((technology) => <li key={technology}>{technology}</li>)}
              </ul>
            </>}
            {(project.repositoryUrl || project.liveUrl) && (
              <div className="modal-project-links">
                {project.repositoryUrl && <a href={project.repositoryUrl} target="_blank" rel="noreferrer" onClick={onAction}>GITHUB REPO <span aria-hidden="true">&#8599;</span></a>}
                {project.liveUrl && <a href={project.liveUrl} target="_blank" rel="noreferrer" onClick={onAction}>LIVE DEMO <span aria-hidden="true">&#8599;</span></a>}
              </div>
            )}
          </div>
        </div>

      </motion.section>
    </motion.div>
  )
}

function ExperienceSection() {
  const [showAllExperience, setShowAllExperience] = useState(false)

  return (
    <div className="experience-section" aria-labelledby="experience-title">
      <div className="about-subsection-heading">
        <span className="detail-kicker">EXPERIENCE</span>
        <span id="experience-title" className="about-subsection-spacer" />
      </div>
      <ol className="experience-list">
        {experience.slice(0, showAllExperience ? experience.length : 4).map((position, index) => (
          <motion.li
            className="experience-entry"
            key={position.id}
            initial={{ opacity: 0, y: 14 }}
            whileInView={{ opacity: 1, y: 0 }}
            whileHover={{ x: 5 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ type: 'spring', stiffness: 260, damping: 24, delay: index * 0.04 }}
          >
            <span className="experience-node" aria-hidden="true" />
            <article className="experience-card">
              <span className="experience-period">{position.period}</span>
              <h3>{position.role}</h3>
              <p className="experience-organization">{position.organization}</p>
              <p className="experience-description">{position.description}</p>
            </article>
          </motion.li>
        ))}
      </ol>
      {experience.length > 4 && (
        <button className="about-more-button" type="button" aria-expanded={showAllExperience} onClick={() => setShowAllExperience((value) => !value)}>
          {showAllExperience ? 'SHOW LESS' : `VIEW ALL EXPERIENCE (${experience.length - 4} MORE)`}
        </button>
      )}
    </div>
  )
}

function ContactSection({ onAction }) {
  const [status, setStatus] = useState('')

  const prepareEmail = (event) => {
    event.preventDefault()
    const formData = new FormData(event.currentTarget)
    const subject = `Portfolio inquiry from ${formData.get('name')}`
    const body = `From: ${formData.get('name')}\nEmail: ${formData.get('email')}\n\n${formData.get('message')}`
    const mailto = `mailto:${developer.contactEmail}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`

    onAction()
    setStatus('Your email draft is ready. Send it from your email app.')
    window.location.href = mailto
  }

  return (
    <motion.section
      id="contact"
      className="content-section contact-section scroll-reveal"
      aria-labelledby="contact-title"
      initial={{ opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.08 }}
      transition={{ duration: 0.48, ease: [0.22, 0.7, 0.2, 1] }}
    >
      <div className="contact-layout">
        <div className="contact-intro">
          <span className="contact-kicker">CONTACT</span>
          <h2 id="contact-title">LET'S BUILD<br /><span>SOMETHING TOGETHER</span></h2>
          <p>Have a project in mind, an opportunity to discuss, or just want to connect? Send me a message or find me on social media.</p>
          <a className="contact-cta" href={`mailto:${developer.contactEmail}`} onClick={onAction}>
            <span aria-hidden="true">&#9998;</span> HIRE ME TO UNLOCK MY POTENTIAL <span aria-hidden="true">&#8594;</span>
          </a>
          <div className="contact-socials" aria-label="Social links">
            {links.filter((link) => link.kind === 'social').map((link) => (
              <a href={link.href} key={link.id} target="_blank" rel="noreferrer" aria-label={link.label} onClick={onAction}>
                <SocialIcon name={link.id} />
              </a>
            ))}
            <a href={`mailto:${developer.contactEmail}`} aria-label="Email" onClick={onAction}>@</a>
          </div>
        </div>
        <form className="contact-form" onSubmit={prepareEmail}>
          <div className="form-row">
            <label>
              <span>NAME</span>
              <input autoComplete="name" name="name" placeholder="Your name" required />
            </label>
            <label>
              <span>EMAIL</span>
              <input autoComplete="email" name="email" type="email" placeholder="you@example.com" required />
            </label>
          </div>
          <label>
            <span>MESSAGE</span>
            <textarea name="message" placeholder="What's on your mind?" rows="4" required />
          </label>
          <div className="contact-submit-row">
            <button className="send-button" type="submit">
              SEND <span aria-hidden="true">&#8594;</span>
            </button>
            <p className="contact-status" role="status">{status}</p>
          </div>
        </form>
      </div>
    </motion.section>
  )
}

function SiteFooter({ onAction }) {
  const socialLinks = links.filter((link) => link.kind === 'social')

  return (
    <footer className="site-footer">
      <div className="site-footer-inner">
        <div className="footer-brand">
          <h2>READY TO BUILD?</h2>
          <p>I create digital experiences. Let's turn ideas into functional, beautiful realities.</p>
          <div className="footer-links" aria-label="Social and contact links">
          {socialLinks.map((link) => (
            <a href={link.href} key={link.id} target="_blank" rel="noreferrer" aria-label={link.label} onClick={onAction}>
              <SocialIcon name={link.id} />
            </a>
          ))}
          <a href={`mailto:${developer.contactEmail}`} aria-label="Email" onClick={onAction}>@</a>
          </div>
        </div>
        <div className="footer-meta">
          <p className="footer-credit">&copy; {new Date().getFullYear()} {developer.name} &middot; BUILT WITH REACT</p>
          <p className="footer-location">{developer.location}</p>
          <a className="back-to-top" href="#home" aria-label="Back to top">TOP <span aria-hidden="true">&#8593;</span></a>
        </div>
      </div>
    </footer>
  )
}

function App() {
  const [isLoaded, setIsLoaded] = useState(false)
  const [activeProject, setActiveProject] = useState(null)
  const [activeSection, setActiveSection] = useState(() => navigation.find((item) => item.href === window.location.hash)?.id || 'home')
  const completeLoading = useCallback(() => setIsLoaded(true), [])
  const closeProjectModal = useCallback(() => setActiveProject(null), [])
  const handleAction = useCallback(() => {}, [])

  useEffect(() => {
    document.title = `${developer.name} - Developer Portfolio`
  }, [])

  useEffect(() => {
    let frame
    const updateActiveSection = () => {
      let currentSection = 'home'
      navigation.forEach((item) => {
        const section = document.querySelector(item.href)
        if (section && section.getBoundingClientRect().top <= 220) currentSection = item.id
      })
      frame = window.requestAnimationFrame(() => setActiveSection(currentSection))
    }
    const syncHashSection = () => {
      const hashSection = navigation.find((item) => item.href === window.location.hash)
      if (hashSection) setActiveSection(hashSection.id)
      else updateActiveSection()
    }

    updateActiveSection()
    window.addEventListener('scroll', updateActiveSection, { passive: true })
    window.addEventListener('hashchange', syncHashSection)

    return () => {
      window.cancelAnimationFrame(frame)
      window.removeEventListener('scroll', updateActiveSection)
      window.removeEventListener('hashchange', syncHashSection)
    }
  }, [])

  return (
    <MotionConfig reducedMotion="user">
      <div className="portfolio-app">
        <header className="topbar site-nav">
          <div className="nav-inner">
            <div className="nav-brand">
              <a className="wordmark" href="#home" aria-label={`${developer.name} home`}>
                {developer.monogram}<span>.</span>
              </a>
              <a className="brand-name" href="#home">{developer.name}</a>
            </div>
            <nav className="primary-nav" aria-label="Main navigation">
              {navigation.map((item) => (
                <a
                  className={`nav-link${activeSection === item.id ? ' is-active' : ''}`}
                  href={item.href}
                  key={item.id}
                  aria-current={activeSection === item.id ? 'location' : undefined}
                  onClick={() => setActiveSection(item.id)}
                >
                  {item.label}
                </a>
              ))}
            </nav>
          </div>
        </header>

        <div className="page-frame">
          <HomeBento onAction={handleAction} />
          <AboutSection onSelectDetail={setActiveProject} />
          <AlbumSection />
          <ProjectsSection onSelectProject={setActiveProject} onAction={handleAction} />
          <ContactSection onAction={handleAction} />
        </div>

        <SiteFooter onAction={handleAction} />
        <CustomCursor />
        <AnimatePresence>
          {activeProject && (
            <ProjectModal
              key={activeProject.id}
              project={activeProject}
              onClose={closeProjectModal}
              onAction={handleAction}
            />
          )}
          {!isLoaded && <LoadingScreen key="loading-screen" onComplete={completeLoading} />}
        </AnimatePresence>
      </div>
    </MotionConfig>
  )
}

export default App
