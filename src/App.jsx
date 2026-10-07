import { useCallback, useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion, MotionConfig, useMotionValue } from 'framer-motion'
import CustomCursor from './CustomCursor'
import LoadingScreen from './LoadingScreen'
import CaptchaBox from './CaptchaBox'
import { generateCaptchaCode, validateCaptcha } from './captchaUtils'
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
  socialLinks,
  stats as portfolioStats,
} from './portfolioData'
import './App.css'

function SocialIcon({ name, label }) {
  const key = String(name || label || '').toLowerCase().trim()

  if (key.includes('github') || key.includes('git')) {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path fill="currentColor" d="M12 .9a11.1 11.1 0 0 0-3.51 21.63c.55.1.76-.24.76-.53v-2.08c-3.1.67-3.76-1.32-3.76-1.32-.5-1.28-1.23-1.62-1.23-1.62-1-.69.08-.68.08-.68 1.1.08 1.68 1.13 1.68 1.13.98 1.67 2.57 1.19 3.2.91.1-.71.38-1.2.7-1.48-2.48-.28-5.1-1.24-5.1-5.53 0-1.22.44-2.22 1.13-3-.12-.28-.49-1.42.1-2.96 0 0 .92-.3 3.05 1.15a10.6 10.6 0 0 1 5.55 0c2.12-1.44 3.04-1.15 3.04-1.15.6 1.54.22 2.68.11 2.96.7.78 1.12 1.78 1.12 3.01 0 4.3-2.62 5.24-5.12 5.51.4.35.75 1.03.75 2.08V22c0 .3.2.64.77.53A11.1 11.1 0 0 0 12 .9Z" />
      </svg>
    )
  }

  if (key.includes('linkedin')) {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path fill="currentColor" d="M5.2 3.4a2.2 2.2 0 1 1 0 4.4 2.2 2.2 0 0 1 0-4.4ZM3.3 9.5h3.8v11.2H3.3V9.5Zm6.1 0H13v1.5h.05a4.1 4.1 0 0 1 3.7-2c4 0 4.7 2.6 4.7 5.9v5.8h-3.8v-5.2c0-1.25-.02-2.85-1.74-2.85-1.74 0-2 1.36-2 2.76v5.29H9.4V9.5Z" />
      </svg>
    )
  }

  if (key.includes('instagram') || key.includes('ig')) {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path fill="currentColor" d="M7.2 2.5h9.6a4.7 4.7 0 0 1 4.7 4.7v9.6a4.7 4.7 0 0 1-4.7 4.7H7.2a4.7 4.7 0 0 1-4.7-4.7V7.2a4.7 4.7 0 0 1 4.7-4.7Zm0 1.8a2.9 2.9 0 0 0-2.9 2.9v9.6a2.9 2.9 0 0 0 2.9 2.9h9.6a2.9 2.9 0 0 0 2.9-2.9V7.2a2.9 2.9 0 0 0-2.9-2.9H7.2Zm4.8 2.9a4.8 4.8 0 1 1 0 9.6 4.8 4.8 0 0 1 0-9.6Zm0 1.8a3 3 0 1 0 0 6 3 3 0 0 0 0-6Zm5-3.2a1.15 1.15 0 1 1 0 2.3 1.15 1.15 0 0 1 0-2.3Z" />
      </svg>
    )
  }

  if (key.includes('twitter') || key === 'x' || key.includes('x.com')) {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path fill="currentColor" d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
      </svg>
    )
  }

  if (key.includes('youtube') || key.includes('yt')) {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path fill="currentColor" d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
      </svg>
    )
  }

  if (key.includes('discord')) {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path fill="currentColor" d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028c.462-.63.874-1.295 1.226-1.994.021-.041.001-.09-.041-.106a13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.929 1.793 8.18 1.793 12.061 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.894.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.028zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z" />
      </svg>
    )
  }

  if (key.includes('tiktok')) {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path fill="currentColor" d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-1.01-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.24 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z" />
      </svg>
    )
  }

  if (key.includes('telegram')) {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path fill="currentColor" d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.562 8.161c-.18.868-1.015 4.675-1.441 6.545-.18.791-.476 1.055-.764 1.08-.626.057-1.101-.414-1.708-.811-.95-.623-1.487-1.01-2.408-1.618-1.065-.702-.375-1.088.232-1.72.159-.165 2.92-2.677 2.973-2.905.007-.028.013-.135-.05-.191s-.155-.037-.222-.022c-.095.021-1.609 1.024-4.544 3.003-.43.296-.82.441-1.169.433-.385-.008-1.125-.218-1.676-.397-.676-.22-1.214-.336-1.167-.709.025-.194.298-.393.818-.598 3.208-1.396 5.348-2.317 6.421-2.763 3.06-1.272 3.696-1.493 4.11-1.501.091-.002.294.021.425.127.111.089.141.21.153.295.012.086.027.28.016.435z" />
      </svg>
    )
  }

  if (key.includes('whatsapp') || key.includes('wa')) {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path fill="currentColor" d="M17.472 14.382c-.301-.15-1.78-.878-2.056-.979-.276-.1-.476-.15-.677.15-.2.301-.777.979-.953 1.18-.175.2-.351.226-.652.075-.301-.15-1.272-.469-2.423-1.496-.896-.799-1.5-1.786-1.676-2.087-.175-.301-.019-.464.132-.614.135-.135.301-.351.451-.527.151-.176.201-.301.301-.502.1-.2.05-.376-.025-.526-.075-.15-.677-1.632-.928-2.235-.245-.587-.494-.508-.677-.517-.175-.009-.376-.01-.577-.01-.2 0-.526.075-.802.376-.276.301-1.053 1.028-1.053 2.508 0 1.48 1.078 2.909 1.229 3.11.15.2 2.122 3.24 5.141 4.545.718.31 1.279.496 1.716.635.722.23 1.38.197 1.9.12.58-.087 1.78-.728 2.03-1.43.251-.703.251-1.304.176-1.43-.076-.125-.276-.201-.577-.351zM12.04 21.732c-1.739 0-3.447-.466-4.95-1.353l-.355-.21-3.684.966.984-3.593-.231-.368A9.702 9.702 0 0 1 2.308 12.04c0-5.367 4.366-9.733 9.735-9.733 2.6 0 5.044 1.013 6.883 2.851A9.67 9.67 0 0 1 21.773 12.04c0 5.367-4.366 9.733-9.733 9.733z" />
      </svg>
    )
  }

  if (key.includes('facebook') || key.includes('fb')) {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path fill="currentColor" d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
      </svg>
    )
  }

  // Fallback icon: clean link/globe icon
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <line x1="2" y1="12" x2="22" y2="12" />
      <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
    </svg>
  )
}

const deviconMap = {
  react: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg',
  'react.js': 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg',
  'react native': 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg',
  typescript: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/typescript/typescript-original.svg',
  ts: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/typescript/typescript-original.svg',
  javascript: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/javascript/javascript-original.svg',
  js: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/javascript/javascript-original.svg',
  html: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/html5/html5-original.svg',
  html5: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/html5/html5-original.svg',
  css: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/css3/css3-original.svg',
  css3: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/css3/css3-original.svg',
  'node.js': 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nodejs/nodejs-original.svg',
  nodejs: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nodejs/nodejs-original.svg',
  node: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nodejs/nodejs-original.svg',
  express: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/express/express-original.svg',
  'express.js': 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/express/express-original.svg',
  expressjs: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/express/express-original.svg',
  mongodb: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mongodb/mongodb-original.svg',
  mongo: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mongodb/mongodb-original.svg',
  postgresql: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/postgresql/postgresql-original.svg',
  postgres: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/postgresql/postgresql-original.svg',
  docker: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/docker/docker-original.svg',
  git: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/git/git-original.svg',
  github: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/github/github-original.svg',
  python: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/python/python-original.svg',
  py: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/python/python-original.svg',
  java: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/java/java-original.svg',
  c: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/c/c-original.svg',
  'c++': 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/cplusplus/cplusplus-original.svg',
  cpp: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/cplusplus/cplusplus-original.svg',
  'c#': 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/csharp/csharp-original.svg',
  csharp: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/csharp/csharp-original.svg',
  php: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/php/php-original.svg',
  laravel: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/laravel/laravel-original.svg',
  tailwind: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/tailwindcss/tailwindcss-original.svg',
  'tailwind css': 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/tailwindcss/tailwindcss-original.svg',
  tailwindcss: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/tailwindcss/tailwindcss-original.svg',
  bootstrap: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/bootstrap/bootstrap-original.svg',
  sass: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/sass/sass-original.svg',
  scss: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/sass/sass-original.svg',
  vue: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/vuejs/vuejs-original.svg',
  'vue.js': 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/vuejs/vuejs-original.svg',
  vuejs: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/vuejs/vuejs-original.svg',
  angular: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/angularjs/angularjs-original.svg',
  'next.js': 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nextjs/nextjs-original.svg',
  nextjs: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nextjs/nextjs-original.svg',
  next: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nextjs/nextjs-original.svg',
  mysql: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mysql/mysql-original.svg',
  sqlite: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/sqlite/sqlite-original.svg',
  redis: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/redis/redis-original.svg',
  firebase: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/firebase/firebase-plain.svg',
  flutter: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/flutter/flutter-original.svg',
  dart: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/dart/dart-original.svg',
  kotlin: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/kotlin/kotlin-original.svg',
  swift: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/swift/swift-original.svg',
  go: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/go/go-original.svg',
  golang: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/go/go-original.svg',
  rust: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/rust/rust-original.svg',
  figma: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/figma/figma-original.svg',
  vite: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/vite/vite-original.svg',
  vitejs: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/vite/vite-original.svg',
  graphql: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/graphql/graphql-plain.svg',
  webpack: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/webpack/webpack-original.svg',
  redux: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/redux/redux-original.svg',
  'three.js': 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/threejs/threejs-original.svg',
  threejs: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/threejs/threejs-original.svg',
  supabase: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/supabase/supabase-original.svg',
  prisma: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/prisma/prisma-original.svg',
  linux: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/linux/linux-original.svg',
  ubuntu: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/ubuntu/ubuntu-plain.svg',
  aws: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/amazonwebservices/amazonwebservices-original-wordmark.svg',
  azure: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/azure/azure-original.svg',
  googlecloud: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/googlecloud/googlecloud-original.svg',
  kubernetes: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/kubernetes/kubernetes-plain.svg',
  android: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/android/android-original.svg',
  'framer motion': 'https://cdn.simpleicons.org/framer/0055FF',
  'web audio': 'https://cdn.simpleicons.org/mdnwebdocs/000000',
  'responsive ui': 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/css3/css3-original.svg',
  'design systems': 'https://cdn.simpleicons.org/storybook/FF4785',
  accessibility: 'https://cdn.jsdelivr.net/npm/@fortawesome/fontawesome-free@6/svgs/solid/universal-access.svg',
}

function getTechLogoUrl(name) {
  if (!name) return ''
  const trimmed = name.trim()
  const lower = trimmed.toLowerCase()
  if (deviconMap[lower]) return deviconMap[lower]

  // Dynamic slug for Simple Icons
  const slug = lower
    .replace(/\.js$/i, 'dotjs')
    .replace(/\+/g, 'plus')
    .replace(/#/g, 'sharp')
    .replace(/[^a-z0-9]/g, '')
  return `https://cdn.simpleicons.org/${slug}`
}

function TechIcon({ name }) {
  const [loadFailed, setLoadFailed] = useState(false)
  const logoUrl = getTechLogoUrl(name)

  if (loadFailed || !logoUrl) {
    const initials = name
      .replace(/[^a-zA-Z0-9\s]/g, '')
      .split(/\s+/)
      .map((part) => part[0])
      .join('')
      .slice(0, 2)
      .toUpperCase() || name.slice(0, 2).toUpperCase()

    return <span className="tech-logo-fallback">{initials}</span>
  }

  return (
    <img
      src={logoUrl}
      alt=""
      loading="lazy"
      onError={() => setLoadFailed(true)}
    />
  )
}

function playCarHorn() {
  try {
    const AudioContextClass = window.AudioContext || window.webkitAudioContext
    if (!AudioContextClass) return
    const ctx = new AudioContextClass()
    if (ctx.state === 'suspended') {
      ctx.resume()
    }
    const now = ctx.currentTime

    // Master gain envelope
    const masterGain = ctx.createGain()

    // Resonant peaking filter emulating the acoustic snail horn chamber
    const acousticFilter = ctx.createBiquadFilter()
    acousticFilter.type = 'peaking'
    acousticFilter.frequency.setValueAtTime(950, now)
    acousticFilter.Q.setValueAtTime(2.2, now)
    acousticFilter.gain.setValueAtTime(6.5, now)

    // Smooth lowpass to cut off harsh high digital buzz
    const lowpass = ctx.createBiquadFilter()
    lowpass.type = 'lowpass'
    lowpass.frequency.setValueAtTime(3200, now)

    // Soft-clip shaper to bind harmonics into cohesive brassy metal diaphragm sound
    const waveShaper = ctx.createWaveShaper()
    const curve = new Float32Array(256)
    for (let i = 0; i < 256; i++) {
      const x = (i * 2) / 256 - 1
      curve[i] = Math.tanh(x * 1.6)
    }
    waveShaper.curve = curve
    waveShaper.oversample = '2x'

    // Dual-tone international automotive chord: Low (405 Hz) + High (505 Hz)
    const fLow = 405
    const fHigh = 505

    // Low tone: saw (bite) + triangle (body)
    const oscLowSaw = ctx.createOscillator()
    oscLowSaw.type = 'sawtooth'
    oscLowSaw.frequency.setValueAtTime(fLow + 20, now)
    oscLowSaw.frequency.exponentialRampToValueAtTime(fLow, now + 0.02)

    const oscLowTri = ctx.createOscillator()
    oscLowTri.type = 'triangle'
    oscLowTri.frequency.setValueAtTime(fLow, now)

    // High tone: saw (bite) + triangle (body)
    const oscHighSaw = ctx.createOscillator()
    oscHighSaw.type = 'sawtooth'
    oscHighSaw.frequency.setValueAtTime(fHigh + 22, now)
    oscHighSaw.frequency.exponentialRampToValueAtTime(fHigh, now + 0.02)

    const oscHighTri = ctx.createOscillator()
    oscHighTri.type = 'triangle'
    oscHighTri.frequency.setValueAtTime(fHigh, now)

    // Mix balance
    const lowSawGain = ctx.createGain()
    lowSawGain.gain.value = 0.22
    const lowTriGain = ctx.createGain()
    lowTriGain.gain.value = 0.28

    const highSawGain = ctx.createGain()
    highSawGain.gain.value = 0.20
    const highTriGain = ctx.createGain()
    highTriGain.gain.value = 0.25

    oscLowSaw.connect(lowSawGain)
    oscLowTri.connect(lowTriGain)
    oscHighSaw.connect(highSawGain)
    oscHighTri.connect(highTriGain)

    const mixBus = ctx.createGain()
    lowSawGain.connect(mixBus)
    lowTriGain.connect(mixBus)
    highSawGain.connect(mixBus)
    highTriGain.connect(mixBus)

    // Snappy attack (8ms) -> solid sustain (190ms) -> clean decay (~0.26s total)
    masterGain.gain.setValueAtTime(0.0001, now)
    masterGain.gain.linearRampToValueAtTime(0.36, now + 0.008)
    masterGain.gain.setValueAtTime(0.36, now + 0.20)
    masterGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.26)

    mixBus.connect(acousticFilter)
    acousticFilter.connect(lowpass)
    lowpass.connect(waveShaper)
    waveShaper.connect(masterGain)
    masterGain.connect(ctx.destination)

    oscLowSaw.start(now)
    oscLowTri.start(now)
    oscHighSaw.start(now)
    oscHighTri.start(now)

    oscLowSaw.stop(now + 0.27)
    oscLowTri.stop(now + 0.27)
    oscHighSaw.stop(now + 0.27)
    oscHighTri.stop(now + 0.27)

    setTimeout(() => {
      try { ctx.close() } catch { /* ignore audio close error */ }
    }, 400)
  } catch {
    // Audio fallback silent if blocked
  }
}

function VehicleSprite({ type }) {
  switch (type) {
    case 'speed_green': // Formula GT / Race Car (Matching user photo 2!)
      return (
        <svg viewBox="0 0 64 34" className="vehicle-svg vehicle-speed-green" aria-hidden="true">
          <rect x="2" y="3" width="5" height="28" rx="2" fill="#101010" stroke="#000" strokeWidth="1.5" />
          <rect x="1" y="2" width="7" height="3" rx="1" fill="#facc15" />
          <rect x="1" y="29" width="7" height="3" rx="1" fill="#facc15" />
          <line x1="7" y1="12" x2="13" y2="12" stroke="#101010" strokeWidth="2" />
          <line x1="7" y1="22" x2="13" y2="22" stroke="#101010" strokeWidth="2" />

          <rect x="9" y="1" width="12" height="6" rx="2" fill="#171717" stroke="#101010" strokeWidth="1.5" />
          <rect x="9" y="27" width="12" height="6" rx="2" fill="#171717" stroke="#101010" strokeWidth="1.5" />
          <rect x="42" y="2" width="11" height="5.5" rx="2" fill="#171717" stroke="#101010" strokeWidth="1.5" />
          <rect x="42" y="26.5" width="11" height="5.5" rx="2" fill="#171717" stroke="#101010" strokeWidth="1.5" />

          <circle cx="15" cy="4" r="1.5" fill="#facc15" />
          <circle cx="15" cy="30" r="1.5" fill="#facc15" />
          <circle cx="47.5" cy="4.7" r="1.5" fill="#facc15" />
          <circle cx="47.5" cy="29.3" r="1.5" fill="#facc15" />

          <path
            d="M 12,9 L 32,8 L 46,12 L 58,15 L 58,19 L 46,22 L 32,26 L 12,25 Z"
            fill="#059669"
            stroke="#101010"
            strokeWidth="2"
          />

          <path d="M 12,15.5 L 56,15.5 L 56,18.5 L 12,18.5 Z" fill="#ffffff" />

          <rect x="54" y="5" width="4.5" height="24" rx="1.5" fill="#101010" stroke="#000" strokeWidth="1.2" />
          <rect x="56" y="6" width="3" height="4" rx="1" fill="#facc15" />
          <rect x="56" y="24" width="3" height="4" rx="1" fill="#facc15" />

          <ellipse cx="31" cy="17" rx="7" ry="5" fill="#0f172a" stroke="#101010" strokeWidth="1.5" />
          <circle cx="31" cy="17" r="3.6" fill="#facc15" stroke="#101010" strokeWidth="1" />
          <path d="M 31,14.5 Q 34.5,17 31,19.5" fill="none" stroke="#101010" strokeWidth="1.8" />

          <text x="47" y="18.5" fontSize="5" fontWeight="900" fontFamily="sans-serif" fill="#101010" textAnchor="middle">01</text>

          <circle cx="56" cy="12" r="1.8" fill="#fef08a" stroke="#ca8a04" strokeWidth="0.8" />
          <circle cx="56" cy="22" r="1.8" fill="#fef08a" stroke="#ca8a04" strokeWidth="0.8" />
        </svg>
      )

    case 'fire': // BLAZE TITAN / Fire Engine
      return (
        <svg viewBox="0 0 64 34" className="vehicle-svg vehicle-fire" aria-hidden="true">
          <rect x="10" y="1" width="13" height="5" rx="1.5" fill="#262626" stroke="#101010" strokeWidth="1.5" />
          <rect x="10" y="28" width="13" height="5" rx="1.5" fill="#262626" stroke="#101010" strokeWidth="1.5" />
          <rect x="42" y="1" width="13" height="5" rx="1.5" fill="#262626" stroke="#101010" strokeWidth="1.5" />
          <rect x="42" y="28" width="13" height="5" rx="1.5" fill="#262626" stroke="#101010" strokeWidth="1.5" />

          <rect x="5" y="4" width="54" height="26" rx="4" fill="#d90429" stroke="#101010" strokeWidth="2" />

          <rect x="57" y="7" width="4.5" height="20" rx="1.5" fill="#e2e8f0" stroke="#101010" strokeWidth="1.5" />
          <line x1="57" y1="12" x2="60" y2="12" stroke="#101010" strokeWidth="1" />
          <line x1="57" y1="17" x2="60" y2="17" stroke="#101010" strokeWidth="1" />
          <line x1="57" y1="22" x2="60" y2="22" stroke="#101010" strokeWidth="1" />

          <rect x="43" y="6" width="10" height="22" rx="2" fill="#7dd3fc" stroke="#101010" strokeWidth="1.5" />
          <line x1="48" y1="6" x2="48" y2="28" stroke="#0284c7" strokeWidth="1" />

          <rect x="10" y="9" width="30" height="7" rx="1" fill="#f8fafc" stroke="#101010" strokeWidth="1.4" />
          <line x1="16" y1="9" x2="16" y2="16" stroke="#101010" strokeWidth="1.2" />
          <line x1="22" y1="9" x2="22" y2="16" stroke="#101010" strokeWidth="1.2" />
          <line x1="28" y1="9" x2="28" y2="16" stroke="#101010" strokeWidth="1.2" />
          <line x1="34" y1="9" x2="34" y2="16" stroke="#101010" strokeWidth="1.2" />

          <circle cx="15" cy="22" r="3.5" fill="#eab308" stroke="#101010" strokeWidth="1.2" />
          <circle cx="15" cy="22" r="1.5" fill="#713f12" />

          <rect x="23" y="19" width="17" height="6" rx="1" fill="#facc15" stroke="#101010" strokeWidth="1" />
          <text x="31.5" y="23.8" fontSize="4.5" fontWeight="900" fontFamily="sans-serif" fill="#101010" textAnchor="middle">911</text>

          <circle cx="40" cy="7" r="2.8" className="siren-beacon-red" fill="#ff1e27" stroke="#101010" strokeWidth="1" />
          <circle cx="40" cy="27" r="2.8" className="siren-beacon-red" fill="#ff1e27" stroke="#101010" strokeWidth="1" />

          <circle cx="58" cy="8" r="2" fill="#fff" stroke="#ca8a04" strokeWidth="0.8" />
          <circle cx="58" cy="26" r="2" fill="#fff" stroke="#ca8a04" strokeWidth="0.8" />
        </svg>
      )

    case 'police': // METRO INTERCEPTOR / Police Cruiser
      return (
        <svg viewBox="0 0 64 34" className="vehicle-svg vehicle-police" aria-hidden="true">
          <rect x="10" y="1.5" width="12" height="5" rx="1.5" fill="#171717" stroke="#101010" strokeWidth="1.5" />
          <rect x="10" y="27.5" width="12" height="5" rx="1.5" fill="#171717" stroke="#101010" strokeWidth="1.5" />
          <rect x="42" y="1.5" width="12" height="5" rx="1.5" fill="#171717" stroke="#101010" strokeWidth="1.5" />
          <rect x="42" y="27.5" width="12" height="5" rx="1.5" fill="#171717" stroke="#101010" strokeWidth="1.5" />

          <path
            d="M 5,9 C 5,6 10,4.5 18,4.5 L 48,4.5 C 56,4.5 58,8 58,17 C 58,26 56,29.5 48,29.5 L 18,29.5 C 10,29.5 5,28 5,25 Z"
            fill="#0f2b5c"
            stroke="#101010"
            strokeWidth="2"
          />

          <rect x="18" y="6" width="22" height="22" rx="2" fill="#ffffff" stroke="#101010" strokeWidth="1.5" />

          <path d="M 39,7 L 46,9 C 48,12 48,22 46,25 L 39,27 Z" fill="#38bdf8" stroke="#101010" strokeWidth="1.2" />
          <path d="M 21,7 L 16,9 C 14,12 14,22 16,25 L 21,27 Z" fill="#38bdf8" stroke="#101010" strokeWidth="1.2" />

          <rect x="27" y="4" width="7" height="26" rx="2" fill="#101010" stroke="#000" strokeWidth="1" />
          <rect x="28" y="5" width="5" height="11" rx="1" className="police-strobe-red" fill="#ff1e27" />
          <rect x="28" y="18" width="5" height="11" rx="1" className="police-strobe-blue" fill="#0070f3" />
          <circle cx="30.5" cy="17" r="1.5" fill="#ffffff" />

          <polygon points="52,14 53,16 55,16 53.5,17.5 54,19.5 52,18 50,19.5 50.5,17.5 49,16 51,16" fill="#facc15" stroke="#101010" strokeWidth="0.6" />

          <rect x="58" y="9" width="3.5" height="16" rx="1" fill="#101010" stroke="#000" strokeWidth="1" />
          <circle cx="57" cy="8" r="2" fill="#fff" stroke="#ca8a04" strokeWidth="0.8" />
          <circle cx="57" cy="26" r="2" fill="#fff" stroke="#ca8a04" strokeWidth="0.8" />
        </svg>
      )

    case 'taxi': // CYBER CAB / Yellow Taxi
      return (
        <svg viewBox="0 0 64 34" className="vehicle-svg vehicle-taxi" aria-hidden="true">
          <rect x="10" y="1.5" width="12" height="5" rx="1.5" fill="#171717" stroke="#101010" strokeWidth="1.5" />
          <rect x="10" y="27.5" width="12" height="5" rx="1.5" fill="#171717" stroke="#101010" strokeWidth="1.5" />
          <rect x="42" y="1.5" width="12" height="5" rx="1.5" fill="#171717" stroke="#101010" strokeWidth="1.5" />
          <rect x="42" y="27.5" width="12" height="5" rx="1.5" fill="#171717" stroke="#101010" strokeWidth="1.5" />

          <path
            d="M 6,9 C 6,6.5 11,5 19,5 L 48,5 C 56,5 58,8 58,17 C 58,26 56,29 48,29 L 19,29 C 11,29 6,27.5 6,25 Z"
            fill="#f59e0b"
            stroke="#101010"
            strokeWidth="2"
          />

          <g fill="#101010">
            <rect x="16" y="5.5" width="4" height="2" />
            <rect x="24" y="5.5" width="4" height="2" />
            <rect x="32" y="5.5" width="4" height="2" />
            <rect x="40" y="5.5" width="4" height="2" />
            <rect x="16" y="26.5" width="4" height="2" />
            <rect x="24" y="26.5" width="4" height="2" />
            <rect x="32" y="26.5" width="4" height="2" />
            <rect x="40" y="26.5" width="4" height="2" />
          </g>

          <path d="M 39,7 L 46,9 C 48,12 48,22 46,25 L 39,27 Z" fill="#93c5fd" stroke="#101010" strokeWidth="1.2" />
          <path d="M 21,7 L 16,9 C 14,12 14,22 16,25 L 21,27 Z" fill="#93c5fd" stroke="#101010" strokeWidth="1.2" />

          <rect x="26" y="10" width="14" height="14" rx="2" fill="#ffd500" stroke="#101010" strokeWidth="1.5" />
          <text x="33" y="19" fontSize="5.5" fontWeight="900" fontFamily="sans-serif" fill="#101010" textAnchor="middle">TAXI</text>

          <rect x="4" y="10" width="3" height="14" rx="1" fill="#e2e8f0" stroke="#101010" strokeWidth="1" />
          <rect x="57" y="10" width="3" height="14" rx="1" fill="#e2e8f0" stroke="#101010" strokeWidth="1" />
          <circle cx="58" cy="8" r="2" fill="#fef08a" stroke="#ca8a04" strokeWidth="0.8" />
          <circle cx="58" cy="26" r="2" fill="#fef08a" stroke="#ca8a04" strokeWidth="0.8" />
        </svg>
      )

    case 'ambulance': // LIFE SQUAD / Rapid Medic
      return (
        <svg viewBox="0 0 64 34" className="vehicle-svg vehicle-ambulance" aria-hidden="true">
          <rect x="10" y="1" width="12" height="5" rx="1.5" fill="#262626" stroke="#101010" strokeWidth="1.5" />
          <rect x="10" y="28" width="12" height="5" rx="1.5" fill="#262626" stroke="#101010" strokeWidth="1.5" />
          <rect x="42" y="1" width="12" height="5" rx="1.5" fill="#262626" stroke="#101010" strokeWidth="1.5" />
          <rect x="42" y="28" width="12" height="5" rx="1.5" fill="#262626" stroke="#101010" strokeWidth="1.5" />

          <rect x="6" y="4" width="52" height="26" rx="4" fill="#ffffff" stroke="#101010" strokeWidth="2" />
          <rect x="41" y="6" width="11" height="22" rx="2" fill="#67e8f9" stroke="#101010" strokeWidth="1.5" />

          <rect x="6" y="4" width="46" height="2.5" fill="#06b6d4" />
          <rect x="6" y="27.5" width="46" height="2.5" fill="#06b6d4" />

          <path
            d="M 23,14 H 26 V 11 H 30 V 14 H 33 V 20 H 30 V 23 H 26 V 20 H 23 Z"
            fill="#e11d48"
            stroke="#9f1239"
            strokeWidth="0.8"
          />

          <rect x="38" y="7" width="4" height="20" rx="1.5" className="siren-beacon-red" fill="#ff1e27" stroke="#101010" strokeWidth="1" />

          <circle cx="58" cy="8" r="2" fill="#fff" stroke="#ca8a04" strokeWidth="0.8" />
          <circle cx="58" cy="26" r="2" fill="#fff" stroke="#ca8a04" strokeWidth="0.8" />
        </svg>
      )

    case 'dune_brawler': // DUNE BRAWLER / Cyber 4x4 Offroader
      return (
        <svg viewBox="0 0 64 34" className="vehicle-svg vehicle-dune" aria-hidden="true">
          <rect x="8" y="0" width="15" height="7" rx="2" fill="#171717" stroke="#101010" strokeWidth="1.6" />
          <rect x="8" y="27" width="15" height="7" rx="2" fill="#171717" stroke="#101010" strokeWidth="1.6" />
          <rect x="40" y="0" width="15" height="7" rx="2" fill="#171717" stroke="#101010" strokeWidth="1.6" />
          <rect x="40" y="27" width="15" height="7" rx="2" fill="#171717" stroke="#101010" strokeWidth="1.6" />

          <line x1="12" y1="1" x2="12" y2="6" stroke="#404040" strokeWidth="1.2" />
          <line x1="17" y1="1" x2="17" y2="6" stroke="#404040" strokeWidth="1.2" />
          <line x1="12" y1="28" x2="12" y2="33" stroke="#404040" strokeWidth="1.2" />
          <line x1="17" y1="28" x2="17" y2="33" stroke="#404040" strokeWidth="1.2" />
          <line x1="44" y1="1" x2="44" y2="6" stroke="#404040" strokeWidth="1.2" />
          <line x1="49" y1="1" x2="49" y2="6" stroke="#404040" strokeWidth="1.2" />
          <line x1="44" y1="28" x2="44" y2="33" stroke="#404040" strokeWidth="1.2" />
          <line x1="49" y1="28" x2="49" y2="33" stroke="#404040" strokeWidth="1.2" />

          <path
            d="M 6,8 L 18,5 L 48,5 L 56,9 L 56,25 L 48,29 L 18,29 L 6,26 Z"
            fill="#ea580c"
            stroke="#101010"
            strokeWidth="2"
          />

          <rect x="20" y="7" width="20" height="20" rx="3" fill="#1e293b" stroke="#101010" strokeWidth="1.6" />
          <line x1="20" y1="7" x2="40" y2="27" stroke="#64748b" strokeWidth="1.5" />
          <line x1="20" y1="27" x2="40" y2="7" stroke="#64748b" strokeWidth="1.5" />

          <rect x="38" y="9" width="6" height="16" rx="1.5" fill="#38bdf8" stroke="#101010" strokeWidth="1.2" />

          <rect x="42" y="6" width="3.5" height="22" rx="1" fill="#101010" stroke="#000" strokeWidth="1" />
          <circle cx="43.8" cy="8" r="1.5" fill="#facc15" />
          <circle cx="43.8" cy="13" r="1.5" fill="#facc15" />
          <circle cx="43.8" cy="21" r="1.5" fill="#facc15" />
          <circle cx="43.8" cy="26" r="1.5" fill="#facc15" />

          <circle cx="10" cy="17" r="4.5" fill="#171717" stroke="#101010" strokeWidth="1.5" />
          <circle cx="10" cy="17" r="2" fill="#ea580c" />

          <rect x="56" y="7" width="4" height="20" rx="1.5" fill="#334155" stroke="#101010" strokeWidth="1.5" />
          <circle cx="56.5" cy="10" r="1.8" fill="#fef08a" />
          <circle cx="56.5" cy="24" r="1.8" fill="#fef08a" />
        </svg>
      )

    case 'viper_77': // VIPER 77 / V8 Muscle Hotrod
    default:
      return (
        <svg viewBox="0 0 64 34" className="vehicle-svg vehicle-viper" aria-hidden="true">
          <rect x="8" y="1" width="14" height="6.5" rx="2" fill="#171717" stroke="#101010" strokeWidth="1.6" />
          <rect x="8" y="26.5" width="14" height="6.5" rx="2" fill="#171717" stroke="#101010" strokeWidth="1.6" />
          <rect x="44" y="2" width="10" height="4.5" rx="1.5" fill="#171717" stroke="#101010" strokeWidth="1.5" />
          <rect x="44" y="27.5" width="10" height="4.5" rx="1.5" fill="#171717" stroke="#101010" strokeWidth="1.5" />

          <path
            d="M 5,9 C 5,7 10,5 18,5 L 50,5 C 57,5 59,9 59,17 C 59,25 57,29 50,29 L 18,29 C 10,29 5,27 5,25 Z"
            fill="#7c3aed"
            stroke="#101010"
            strokeWidth="2"
          />

          <rect x="5" y="12" width="53" height="3" fill="#e2e8f0" />
          <rect x="5" y="19" width="53" height="3" fill="#e2e8f0" />

          <path d="M 33,7 L 39,9 C 41,12 41,22 39,25 L 33,27 Z" fill="#38bdf8" stroke="#101010" strokeWidth="1.2" />
          <path d="M 17,7 L 13,9 C 12,12 12,22 13,25 L 17,27 Z" fill="#38bdf8" stroke="#101010" strokeWidth="1.2" />

          <rect x="42" y="12.5" width="8" height="9" rx="1.5" fill="#e2e8f0" stroke="#101010" strokeWidth="1.4" />
          <circle cx="47" cy="14" r="1.3" fill="#dc2626" />
          <circle cx="47" cy="17" r="1.3" fill="#dc2626" />
          <circle cx="47" cy="20" r="1.3" fill="#dc2626" />

          <rect x="4" y="6" width="3.5" height="22" rx="1" fill="#101010" stroke="#000" strokeWidth="1" />

          <circle cx="4" cy="9" r="1.2" fill="#f8fafc" />
          <circle cx="4" cy="12" r="1.2" fill="#f8fafc" />
          <circle cx="4" cy="22" r="1.2" fill="#f8fafc" />
          <circle cx="4" cy="25" r="1.2" fill="#f8fafc" />

          <circle cx="58" cy="8" r="2" fill="#fef08a" stroke="#ca8a04" strokeWidth="0.8" />
          <circle cx="58" cy="26" r="2" fill="#fef08a" stroke="#ca8a04" strokeWidth="0.8" />
        </svg>
      )
  }
}

function HomeBento({ onAction }) {
  const [carColorIndex, setCarColorIndex] = useState(0)
  const [carLabelVisible, setCarLabelVisible] = useState(false)
  const [carIsTurbo, setCarIsTurbo] = useState(false)
  const [carBurstActive, setCarBurstActive] = useState(false)
  const [burstKey, setBurstKey] = useState(0)
  const carOffset = useMotionValue('0%')
  const carHoverRef = useRef(false)
  const carTurboRef = useRef(false)
  const turboTimeoutRef = useRef(null)
  const labelTimeoutRef = useRef(null)
  const burstTimeoutRef = useRef(null)
  const carColors = [
    {
      id: 'fire',
      name: 'Blaze Titan',
      tag: 'HEAVY RESCUE // 911',
      icon: '🚒',
      color: '#d90429',
      labelColor: '#d90429',
    },
    {
      id: 'speed_green',
      name: 'Speed Green!',
      tag: 'FORMULA GT // 320 KM/H',
      icon: '🏎️',
      color: '#059669',
      labelColor: '#059669',
    },
    {
      id: 'police',
      name: 'Metro Patrol',
      tag: 'POLICE INTERCEPTOR',
      icon: '🚓',
      color: '#0f2b5c',
      labelColor: '#0f2b5c',
    },
    {
      id: 'taxi',
      name: 'Cyber Cab',
      tag: 'CITY FARE // TAXI',
      icon: '🚕',
      color: '#d97706',
      labelColor: '#d97706',
    },
    {
      id: 'ambulance',
      name: 'Life Squad',
      tag: 'RAPID MEDIC // EMS',
      icon: '🚑',
      color: '#e11d48',
      labelColor: '#e11d48',
    },
    {
      id: 'dune_brawler',
      name: 'Dune Brawler',
      tag: '4X4 CYBER OFFROAD',
      icon: '🚙',
      color: '#ea580c',
      labelColor: '#ea580c',
    },
    {
      id: 'viper_77',
      name: 'Viper 77',
      tag: 'V8 BLOWER HOTROD',
      icon: '⚡',
      color: '#7c3aed',
      labelColor: '#7c3aed',
    },
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
      if (window.innerWidth < 768) {
        frame = window.requestAnimationFrame(moveCar)
        return
      }
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
    window.clearTimeout(burstTimeoutRef.current)
  }, [])

  const nameTokens = developer.name.trim().split(/\s+/)
  const heroFirst = nameTokens.length >= 3 && nameTokens[0].length <= 2
    ? `${nameTokens[0]} ${nameTokens[1]}`
    : nameTokens[0]
  const heroLast = nameTokens.length >= 3 && nameTokens[0].length <= 2
    ? nameTokens.slice(2).join(' ')
    : nameTokens.slice(1).join(' ')

  return (
    <main id="home" className="home-stage">
      <section className="hero-showcase" aria-label={`${developer.name}'s portfolio introduction`}>
        <div className="hero-copy">
          <p className="hero-status"><span className="status-light" /> STATUS: READY TO BUILD</p>
          <h1 className="hero-title">{heroFirst}<br /><span>{heroLast}</span></h1>
          <div className="hero-bio-panel">
            <p>{developer.bio}</p>
            <div className="hero-tags" aria-label="Specialties">
              {(developer.specialties && developer.specialties.length > 0
                ? developer.specialties
                : [developer.role.split('&')[0].trim(), 'Creative Developer', 'UI / UX', 'Motion & Interaction']
              ).map((tag) => (
                <span key={tag}>{tag}</span>
              ))}
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
              className={`portrait-car vehicle-${selectedCar.id}${carIsTurbo ? ' is-turbo' : ''}`}
              type="button"
              aria-label={`Change vehicle. Current vehicle: ${selectedCar.name}`}
              title="Click to honk and change vehicle"
              style={{ offsetDistance: carOffset }}
              onPointerEnter={() => { carHoverRef.current = true }}
              onPointerLeave={() => { carHoverRef.current = false }}
              onFocus={() => { carHoverRef.current = true }}
              onBlur={() => { carHoverRef.current = false }}
              onClick={() => {
                playCarHorn()
                setCarColorIndex((index) => (index + 1) % carColors.length)
                window.clearTimeout(turboTimeoutRef.current)
                window.clearTimeout(labelTimeoutRef.current)
                window.clearTimeout(burstTimeoutRef.current)
                carHoverRef.current = false
                carTurboRef.current = true
                setCarIsTurbo(true)
                setCarLabelVisible(true)
                setCarBurstActive(true)
                setBurstKey((k) => k + 1)

                burstTimeoutRef.current = window.setTimeout(() => {
                  setCarBurstActive(false)
                }, 500)

                turboTimeoutRef.current = window.setTimeout(() => {
                  carTurboRef.current = false
                  setCarIsTurbo(false)
                }, 2600)
                labelTimeoutRef.current = window.setTimeout(() => setCarLabelVisible(false), 2600)
              }}
            >
              <span className="car-headlight-beam" aria-hidden="true" />
              <div className="car-taillights-group" aria-hidden="true">
                <span className="car-taillight taillight-top" />
                <span className="car-taillight taillight-bottom" />
                <span className="car-taillight-beam beam-top" />
                <span className="car-taillight-beam beam-bottom" />
              </div>
              <VehicleSprite type={selectedCar.id} isTurbo={carIsTurbo} />
              {carBurstActive && (
                <div key={burstKey} className="car-explosion-burst" aria-hidden="true">
                  <div className="burst-area-flash" />
                  <div className="burst-shockwave" />
                  <div className="burst-particles">
                    <span className="burst-particle p1" />
                    <span className="burst-particle p2" />
                    <span className="burst-particle p3" />
                    <span className="burst-particle p4" />
                  </div>
                </div>
              )}
            </motion.button>
            <motion.div
              className={`car-speech-bubble${carLabelVisible ? ' is-visible' : ''}`}
              aria-live="polite"
              style={{ offsetDistance: carOffset }}
            >
              <div className="bubble-pointer" aria-hidden="true" />
              <div className="bubble-body">
                <span className="bubble-icon" aria-hidden="true">{selectedCar.icon}</span>
                <div className="bubble-content">
                  <span className="bubble-title" style={{ color: selectedCar.labelColor || '#c51626' }}>
                    {selectedCar.name}
                  </span>
                  <span className="bubble-tag">{selectedCar.tag}</span>
                </div>
              </div>
            </motion.div>
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
    <motion.section
      className="github-card"
      aria-label={`Aktivitas GitHub @${developer.githubUsername}`}
      initial={{ opacity: 0, x: 100 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ type: 'spring', stiffness: 78, damping: 20 }}
    >
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
    </motion.section>
  )
}

function AboutSection({ onSelectDetail }) {
  const [showAllEducation, setShowAllEducation] = useState(false)
  const [showAllOrganizations, setShowAllOrganizations] = useState(false)
  const [showAllCertificates, setShowAllCertificates] = useState(false)
  const [showAllSkills, setShowAllSkills] = useState(false)
  const skillItems = skills.flatMap((group) => group.items.map((name) => ({ name, category: group.category })))
  const careerStart = Math.min(...experience.map(({ period }) => Number(period.slice(0, 4))))
  const stats = (portfolioStats && portfolioStats.length > 0)
    ? portfolioStats
    : [
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
        <motion.article
          className="about-copy-card"
          initial={{ opacity: 0, x: -100 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ type: 'spring', stiffness: 78, damping: 20 }}
        >
          <span className="card-index">THE SHORT VERSION</span>
          <h3>Curiosity in.<br />Useful things out.</h3>
          <p>{developer.bio}</p>
          <span className="about-signature">{developer.monogram} / {developer.location}</span>
        </motion.article>

        <motion.div
          className="about-github-reveal"
          initial={{ opacity: 0, x: 100 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ type: 'spring', stiffness: 78, damping: 20 }}
        >
          <GithubActivityCard />
        </motion.div>
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
              <span className="education-mark" aria-hidden="true">
                {item.logo ? (
                  <img src={item.logo} alt="" className="education-logo-img" loading="lazy" />
                ) : (
                  item.institution.slice(0, 1)
                )}
              </span>
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
            {leadership.slice(0, showAllOrganizations ? leadership.length : 4).map((item, index) => {
              const itemImages = Array.isArray(item.images) ? item.images.filter(Boolean) : item.image ? [item.image] : []
              return (
                <motion.article
                  className="organization-card"
                  key={item.id}
                  initial={{ opacity: 0, y: 12 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  whileHover={{ y: -4 }}
                  viewport={{ once: true, amount: 0.15 }}
                  transition={{ duration: 0.2, delay: index * 0.04 }}
                >
                  <div className="organization-header">
                    <div className="organization-logo-box">
                      {item.logo ? (
                        <img src={item.logo} alt={`${item.organization} logo`} />
                      ) : (
                        <span>{item.organization.charAt(0)}</span>
                      )}
                    </div>
                    <div className="organization-title-group">
                      <div className="organization-badge-row">
                        <span className="organization-badge">{item.badge || 'LEADERSHIP'}</span>
                      </div>
                      <h4 className="organization-title">{item.organization}</h4>
                      <p className="organization-role">{item.role}</p>
                    </div>
                    {item.period && <span className="organization-period">{item.period}</span>}
                  </div>

                  <p className="organization-detail">{item.detail}</p>

                  {itemImages.length > 0 && (
                    <div className={`organization-gallery count-${Math.min(itemImages.length, 3)}`}>
                      {itemImages.slice(0, 3).map((imgUrl, imgIdx) => (
                        <div
                          className="organization-gallery-item"
                          key={imgIdx}
                          role="button"
                          tabIndex={0}
                          aria-label={`Preview photo ${imgIdx + 1}`}
                          onClick={() =>
                            onSelectDetail({
                              ...item,
                              title: item.organization,
                              type: item.badge || 'LEADERSHIP',
                              subtitle: item.role,
                              description: item.detail,
                              initialImageIndex: imgIdx,
                              images: itemImages,
                              details: [
                                { label: 'PERIODE', value: item.period },
                                { label: 'PERAN', value: item.role },
                                ...(item.location ? [{ label: 'LOKASI', value: item.location }] : []),
                              ],
                            })
                          }
                          onKeyDown={(e) => {
                            if (e.key === 'Enter' || e.key === ' ') {
                              e.preventDefault()
                              onSelectDetail({
                                ...item,
                                title: item.organization,
                                type: item.badge || 'LEADERSHIP',
                                subtitle: item.role,
                                description: item.detail,
                                initialImageIndex: imgIdx,
                                images: itemImages,
                                details: [
                                  { label: 'PERIODE', value: item.period },
                                  { label: 'PERAN', value: item.role },
                                  ...(item.location ? [{ label: 'LOKASI', value: item.location }] : []),
                                ],
                              })
                            }
                          }}
                        >
                          <img src={imgUrl} alt={`${item.organization} photo ${imgIdx + 1}`} loading="lazy" />
                        </div>
                      ))}
                    </div>
                  )}

                  <button
                    className="entry-detail-button organization-view-button"
                    type="button"
                    onClick={() =>
                      onSelectDetail({
                        ...item,
                        title: item.organization,
                        type: item.badge || 'LEADERSHIP',
                        subtitle: item.role,
                        description: item.detail,
                        images: itemImages,
                        details: [
                          { label: 'PERIODE', value: item.period },
                          { label: 'PERAN', value: item.role },
                          ...(item.location ? [{ label: 'LOKASI', value: item.location }] : []),
                        ],
                      })
                    }
                  >
                    VIEW DETAILS <span aria-hidden="true">&#8594;</span>
                  </button>
                </motion.article>
              )
            })}
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
                <div className="certificate-issuer-wrap">
                  <span className="certificate-issuer-dashed">{item.issuer}</span>
                </div>
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
                  <TechIcon name={item.name} />
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
  const [prevValue, setPrevValue] = useState(value)
  const isHoveredRef = useRef(false)
  const frameRef = useRef(null)

  if (prevValue !== value) {
    setPrevValue(value)
    setCount(value)
  }

  const stopAndReset = () => {
    isHoveredRef.current = false
    if (frameRef.current) {
      window.cancelAnimationFrame(frameRef.current)
      frameRef.current = null
    }
    setCount(value)
  }

  const startCount = () => {
    isHoveredRef.current = true
    if (frameRef.current) {
      window.cancelAnimationFrame(frameRef.current)
      frameRef.current = null
    }

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setCount(value)
      return
    }

    const start = performance.now()
    const duration = 800

    const update = (now) => {
      if (!isHoveredRef.current) {
        setCount(value)
        return
      }

      const elapsed = now - start
      const progress = Math.min(elapsed / duration, 1)
      const easedProgress = 1 - (1 - progress) ** 3
      const current = Math.round(value * easedProgress)

      setCount(current)

      if (progress < 1 && isHoveredRef.current) {
        frameRef.current = window.requestAnimationFrame(update)
      } else {
        frameRef.current = null
        if (!isHoveredRef.current) {
          setCount(value)
        }
      }
    }

    setCount(0)
    frameRef.current = window.requestAnimationFrame(update)
  }

  useEffect(() => {
    return () => {
      if (frameRef.current) window.cancelAnimationFrame(frameRef.current)
    }
  }, [])

  return (
    <motion.article
      className="about-stat"
      tabIndex={0}
      aria-label={`${value}${suffix} ${label.toLowerCase()}`}
      onHoverStart={startCount}
      onHoverEnd={stopAndReset}
      onMouseEnter={startCount}
      onMouseLeave={stopAndReset}
      onPointerLeave={stopAndReset}
      onFocus={startCount}
      onBlur={stopAndReset}
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
  const [imageIndex, setImageIndex] = useState(() => project.initialImageIndex || 0)
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
              <>
                <div className="carousel-controls">
                  <button type="button" aria-label="Previous project image" onClick={() => changeImage(-1)}>PREV</button>
                  <span className="carousel-count">0{imageIndex + 1} / 0{imageCount}</span>
                  <button type="button" aria-label="Next project image" onClick={() => changeImage(1)}>NEXT</button>
                </div>
                <div className="modal-thumbnail-strip" role="group" aria-label="Photo gallery previews">
                  {projectImages.map((thumb, tIdx) => (
                    <button
                      key={tIdx}
                      type="button"
                      className={`modal-thumb-btn${imageIndex === tIdx ? ' is-active' : ''}`}
                      onClick={() => {
                        onAction()
                        setImageIndex(tIdx)
                      }}
                      aria-label={`View photo ${tIdx + 1}`}
                    >
                      <img src={thumb} alt="" loading="lazy" />
                    </button>
                  ))}
                </div>
              </>
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
  const [captchaCode, setCaptchaCode] = useState(() => generateCaptchaCode())
  const [captchaInput, setCaptchaInput] = useState('')
  const [captchaError, setCaptchaError] = useState('')
  const [honeypot, setHoneypot] = useState('')
  const formMountTime = useRef(0)

  useEffect(() => {
    formMountTime.current = Date.now()
  }, [])

  const isVerified = Boolean(
    captchaInput &&
    captchaCode &&
    validateCaptcha(captchaInput, captchaCode)
  )

  const handleRefreshCaptcha = useCallback(() => {
    setCaptchaCode(generateCaptchaCode())
    setCaptchaInput('')
    setCaptchaError('')
  }, [])

  const handleCaptchaInputChange = (value) => {
    setCaptchaInput(value)
    if (captchaError) setCaptchaError('')
  }

  const prepareEmail = (event) => {
    event.preventDefault()

    // 1. Anti-spam Honeypot Check (catches automated bot scrapers/submitters)
    if (honeypot) {
      console.warn('Spam bot intercepted via honeypot field.')
      setStatus('Pengiriman diblokir (terdeteksi aktivitas bot otomatis).')
      return
    }

    // 2. Time-gate Check (prevent lightning-fast automated bot scripts)
    const elapsed = Date.now() - formMountTime.current
    if (elapsed < 1200) {
      setCaptchaError('Pengisian terlalu cepat. Harap verifikasi kode.')
      setStatus('Terdeteksi pengisian instan. Harap selesaikan kode CAPTCHA.')
      setCaptchaCode(generateCaptchaCode())
      setCaptchaInput('')
      return
    }

    // 3. Captcha Validation Check
    if (!captchaInput.trim()) {
      setCaptchaError('Harap masukkan kode CAPTCHA di atas.')
      setStatus('Selesaikan verifikasi anti-bot sebelum mengirim email.')
      return
    }

    if (!isVerified) {
      setCaptchaError('Kode CAPTCHA tidak cocok! Kode baru telah dibuat.')
      setStatus('Verifikasi gagal. Coba masukkan kode baru yang muncul.')
      setCaptchaCode(generateCaptchaCode())
      setCaptchaInput('')
      return
    }

    const formData = new FormData(event.currentTarget)
    const subject = `Portfolio inquiry from ${formData.get('name')}`
    const body = `From: ${formData.get('name')}\nEmail: ${formData.get('email')}\n\n${formData.get('message')}`
    const mailto = `mailto:${developer.contactEmail}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`

    onAction()
    setStatus('Verifikasi berhasil! Membuka draft email Anda...')
    window.location.href = mailto

    // Refresh captcha for subsequent interactions
    setTimeout(() => {
      handleRefreshCaptcha()
    }, 1200)
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
            {(socialLinks || links.filter((link) => link.kind === 'social')).map((link) => (
              <a href={link.href} key={link.id} target="_blank" rel="noreferrer" aria-label={link.label} onClick={onAction}>
                <SocialIcon name={link.id} label={link.label} />
              </a>
            ))}
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
          <CaptchaBox
            captchaCode={captchaCode}
            userInput={captchaInput}
            onChangeInput={handleCaptchaInputChange}
            onRefresh={handleRefreshCaptcha}
            isVerified={isVerified}
            error={captchaError}
            honeypotValue={honeypot}
            onChangeHoneypot={setHoneypot}
          />
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
  const activeSocials = socialLinks || links.filter((link) => link.kind === 'social')

  return (
    <footer className="site-footer">
      <div className="site-footer-inner">
        <div className="footer-brand">
          <h2>READY TO BUILD?</h2>
          <p>I create digital experiences. Let's turn ideas into functional, beautiful realities.</p>
          <div className="footer-links" aria-label="Social and contact links">
            {activeSocials.map((link) => (
              <a href={link.href} key={link.id} target="_blank" rel="noreferrer" aria-label={link.label} onClick={onAction}>
                <SocialIcon name={link.id} label={link.label} />
              </a>
            ))}
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
  const [isCvModalOpen, setIsCvModalOpen] = useState(false)
  const closeCvModal = useCallback(() => setIsCvModalOpen(false), [])
  const [activeSection, setActiveSection] = useState(() => navigation.find((item) => item.href === window.location.hash)?.id || 'home')
  const completeLoading = useCallback(() => setIsLoaded(true), [])
  const closeProjectModal = useCallback(() => setActiveProject(null), [])
  const handleAction = useCallback(() => { }, [])

  useEffect(() => {
    document.title = `${developer.name} - Developer Portfolio`
  }, [])

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter((e) => e.isIntersecting)
        if (visible.length > 0) {
          visible.sort((a, b) => Math.abs(a.boundingClientRect.top) - Math.abs(b.boundingClientRect.top))
          setActiveSection(visible[0].target.id)
        }
      },
      {
        rootMargin: '-10% 0px -50% 0px',
        threshold: [0, 0.1, 0.3],
      }
    )

    navigation.forEach((item) => {
      const el = document.querySelector(item.href)
      if (el) observer.observe(el)
    })

    const syncHashSection = () => {
      const hashSection = navigation.find((item) => item.href === window.location.hash)
      if (hashSection) setActiveSection(hashSection.id)
    }

    window.addEventListener('hashchange', syncHashSection)

    return () => {
      observer.disconnect()
      window.removeEventListener('hashchange', syncHashSection)
    }
  }, [])

  return (
    <MotionConfig reducedMotion="user">
      <div className={`portfolio-app${!isLoaded ? ' is-loading' : ''}`}>
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
            <div className="nav-actions">
              <button
                type="button"
                className="nav-cv-button"
                aria-label="Preview and Download CV"
                onClick={() => {
                  handleAction()
                  setIsCvModalOpen(true)
                }}
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                  <polyline points="7 10 12 15 17 10" />
                  <line x1="12" y1="15" x2="12" y2="3" />
                </svg>
                <span>DOWNLOAD CV</span>
              </button>
            </div>
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
          {isCvModalOpen && (
            <CvModal
              key="cv-modal"
              cvUrl={developer.cvUrl || '/cv.pdf'}
              onClose={closeCvModal}
              onAction={handleAction}
            />
          )}
          {!isLoaded && <LoadingScreen key="loading-screen" onComplete={completeLoading} />}
        </AnimatePresence>
      </div>
    </MotionConfig>
  )
}

function CvModal({ cvUrl, onClose, onAction }) {
  const closeButtonRef = useRef(null)
  const modalRef = useRef(null)

  useEffect(() => {
    const previouslyFocused = document.activeElement
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    closeButtonRef.current?.focus()

    const handleKeyDown = (event) => {
      if (event.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', handleKeyDown)

    return () => {
      document.body.style.overflow = previousOverflow
      document.removeEventListener('keydown', handleKeyDown)
      if (previouslyFocused instanceof HTMLElement) previouslyFocused.focus()
    }
  }, [onClose])

  return (
    <motion.div
      className="modal-backdrop cv-modal-backdrop"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose()
      }}
    >
      <motion.section
        className="project-modal cv-modal-card"
        role="dialog"
        aria-modal="true"
        aria-label="CV Preview"
        ref={modalRef}
        initial={{ opacity: 0, scale: 0.94, y: 18 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.96, y: 12 }}
        transition={{ type: 'spring', stiffness: 360, damping: 28 }}
      >
        <div className="modal-topline">
          <div className="modal-window-dots" aria-hidden="true"><span /><span /><span /></div>
          <span className="modal-file-label">CURRICULUM VITAE // PREVIEW</span>
          <button
            className="modal-close"
            type="button"
            aria-label="Close CV preview"
            onClick={onClose}
            ref={closeButtonRef}
          >
            <span aria-hidden="true">X</span>
          </button>
        </div>

        <div className="cv-modal-body">
          <div className="cv-preview-container">
            <iframe
              src={`${cvUrl}#toolbar=0&navpanes=0`}
              title="Curriculum Vitae Preview"
              className="cv-preview-iframe"
            />
          </div>

          <div className="cv-modal-actions">
            <button
              type="button"
              className="cv-btn-secondary"
              onClick={onClose}
            >
              CLOSE
            </button>
            <a
              className="cv-btn-primary"
              href={cvUrl}
              download="IKetut_Dharmawan_CV.pdf"
              target="_blank"
              rel="noreferrer"
              onClick={onAction}
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                <polyline points="7 10 12 15 17 10" />
                <line x1="12" y1="15" x2="12" y2="3" />
              </svg>
              <span>DOWNLOAD CV</span>
            </a>
          </div>
        </div>
      </motion.section>
    </motion.div>
  )
}

export default App
