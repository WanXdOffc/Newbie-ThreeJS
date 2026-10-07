import { useEffect, useRef, useCallback, useState } from 'react'
import {
  DEFAULT_CAPTCHA_LENGTH,
  REFRESH_COOLDOWN_SECONDS,
  MAX_RAPID_REFRESHES,
  PENALTY_COOLDOWN_SECONDS,
  validateCaptcha,
} from './captchaUtils'
import './CaptchaBox.css'

export default function CaptchaBox({
  captchaCode,
  userInput,
  onChangeInput,
  onRefresh,
  isVerified,
  error,
  honeypotValue,
  onChangeHoneypot,
}) {
  const canvasRef = useRef(null)
  const [cooldown, setCooldown] = useState(0)
  const [cooldownNotice, setCooldownNotice] = useState('')
  const [isSpeaking, setIsSpeaking] = useState(false)
  const [isRotating, setIsRotating] = useState(false)
  const refreshBurstRef = useRef({ count: 0, firstTime: 0 })

  // 1. Draw High-Definition (Hi-DPI) Neo-Brutalist Captcha Canvas
  const drawCaptcha = useCallback(() => {
    const canvas = canvasRef.current
    if (!canvas || !captchaCode) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const cssWidth = 190
    const cssHeight = 52
    const dpr = typeof window !== 'undefined' ? Math.min(window.devicePixelRatio || 2, 2) : 2

    canvas.width = cssWidth * dpr
    canvas.height = cssHeight * dpr
    canvas.style.width = `${cssWidth}px`
    canvas.style.height = `${cssHeight}px`

    ctx.save()
    ctx.scale(dpr, dpr)

    const isDark = document.documentElement.getAttribute('data-theme') === 'dark'

    // Background gradient
    const bgGradient = ctx.createLinearGradient(0, 0, cssWidth, cssHeight)
    if (isDark) {
      bgGradient.addColorStop(0, '#181818')
      bgGradient.addColorStop(1, '#242424')
    } else {
      bgGradient.addColorStop(0, '#fffef8')
      bgGradient.addColorStop(1, '#f5eed3')
    }
    ctx.fillStyle = bgGradient
    ctx.fillRect(0, 0, cssWidth, cssHeight)

    // Cyber dot matrix
    ctx.fillStyle = isDark ? 'rgba(255, 255, 255, 0.08)' : 'rgba(16, 16, 16, 0.08)'
    for (let x = 6; x < cssWidth; x += 11) {
      for (let y = 6; y < cssHeight; y += 11) {
        ctx.fillRect(x, y, 1.8, 1.8)
      }
    }

    // Smooth sinusoidal interference waves
    const waveColors = isDark
      ? ['#ffd500', '#00e5ff', '#ff007f']
      : ['#ff007f', '#0052cc', '#008f43']

    for (let w = 0; w < 2; w++) {
      ctx.beginPath()
      ctx.strokeStyle = waveColors[w % waveColors.length]
      ctx.lineWidth = 1.6
      const freq = 0.032 + w * 0.014
      const amp = 6.5 + w * 2.5
      const phase = w * 2.2 + (captchaCode.charCodeAt(0) % 5)
      for (let x = 0; x <= cssWidth; x += 3) {
        const y = cssHeight / 2 + Math.sin(x * freq + phase) * amp
        if (x === 0) ctx.moveTo(x, y)
        else ctx.lineTo(x, y)
      }
      ctx.stroke()
    }

    // Micro geometric noise particles
    const noiseColors = isDark
      ? ['#ffd500', '#ff007f', '#00e5ff', '#ffffff']
      : ['#ff007f', '#0070f3', '#101010', '#00aa55']

    for (let i = 0; i < 36; i++) {
      ctx.fillStyle = noiseColors[i % noiseColors.length]
      const nx = (i * 37 + 11) % cssWidth
      const ny = (i * 29 + 9) % cssHeight
      ctx.beginPath()
      ctx.arc(nx, ny, 1.1, 0, Math.PI * 2)
      ctx.fill()
    }

    // Fine crosshairs (+)
    for (let i = 0; i < 4; i++) {
      ctx.strokeStyle = isDark ? 'rgba(255,255,255,0.22)' : 'rgba(16,16,16,0.18)'
      ctx.lineWidth = 1
      const cx = 32 + i * 42
      const cy = i % 2 === 0 ? 11 : cssHeight - 11
      ctx.beginPath()
      ctx.moveTo(cx - 3, cy)
      ctx.lineTo(cx + 3, cy)
      ctx.moveTo(cx, cy - 3)
      ctx.lineTo(cx, cy + 3)
      ctx.stroke()
    }

    // Dynamic Typography
    const fonts = [
      '"Space Grotesk", sans-serif',
      '"Trebuchet MS", sans-serif',
      'Arial, sans-serif',
      'Verdana, sans-serif',
    ]
    const textColors = isDark
      ? ['#ffffff', '#00e5ff', '#ffd500', '#ff007f', '#00e870']
      : ['#101010', '#1c1b18', '#b5004f', '#004fc2', '#0a7536']

    const charSlotWidth = (cssWidth - 24) / captchaCode.length

    for (let i = 0; i < captchaCode.length; i++) {
      const char = captchaCode[i]
      ctx.save()

      const x = 14 + charSlotWidth * i + charSlotWidth / 2
      const yOffset = (i % 2 === 0 ? 1 : -1) * ((i * 3) % 5)
      const y = cssHeight / 2 + yOffset

      // Pseudo-random angle deterministically derived from character code
      const angle = ((((char.charCodeAt(0) * 7 + i * 13) % 37) - 18) * Math.PI) / 180

      ctx.translate(x, y)
      ctx.rotate(angle)

      const fontChoice = fonts[(char.charCodeAt(0) + i) % fonts.length]
      const fontSize = 27 + (i % 3) * 2
      ctx.font = `800 ${fontSize}px ${fontChoice}`
      ctx.textAlign = 'center'
      ctx.textBaseline = 'middle'

      // Sharp neo-brutalist solid shadow
      ctx.shadowColor = isDark ? 'rgba(0,0,0,0.9)' : 'rgba(16, 16, 16, 0.28)'
      ctx.shadowOffsetX = 2.4
      ctx.shadowOffsetY = 2.4
      ctx.shadowBlur = 0

      ctx.fillStyle = textColors[(i + char.charCodeAt(0)) % textColors.length]
      ctx.fillText(char, 0, 0)

      ctx.restore()
    }

    // Strike-through line
    ctx.strokeStyle = isDark ? 'rgba(255, 255, 255, 0.3)' : 'rgba(16, 16, 16, 0.25)'
    ctx.lineWidth = 1.3
    ctx.beginPath()
    ctx.moveTo(8, cssHeight / 2 - 2)
    ctx.lineTo(cssWidth - 8, cssHeight / 2 + 2)
    ctx.stroke()

    ctx.restore()
  }, [captchaCode])

  useEffect(() => {
    drawCaptcha()

    const observer = new MutationObserver(() => {
      drawCaptcha()
    })
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['data-theme'],
    })
    return () => observer.disconnect()
  }, [drawCaptcha])

  // 2. Cooldown Countdown Timer
  useEffect(() => {
    if (cooldown <= 0) return

    const timer = setInterval(() => {
      setCooldown((prev) => {
        if (prev <= 1) {
          clearInterval(timer)
          setCooldownNotice('')
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [cooldown])

  // 3. Anti-Spam Protected Refresh Handler
  const handleProtectedRefresh = useCallback(() => {
    if (cooldown > 0) {
      setCooldownNotice(`Tunggu ${cooldown} detik sebelum memuat ulang kode.`)
      return
    }

    const now = Date.now()
    const burst = refreshBurstRef.current

    // Check burst limit in a 15-second window
    if (now - burst.firstTime > 15000) {
      burst.count = 1
      burst.firstTime = now
    } else {
      burst.count += 1
    }

    // Apply longer penalty cooldown if user/bot clicks rapidly 4+ times
    const cooldownDuration =
      burst.count >= MAX_RAPID_REFRESHES
        ? PENALTY_COOLDOWN_SECONDS
        : REFRESH_COOLDOWN_SECONDS

    setCooldown(cooldownDuration)
    if (burst.count >= MAX_RAPID_REFRESHES) {
      setCooldownNotice(
        `Terlalu sering mengganti kode. Penalti cooldown ${PENALTY_COOLDOWN_SECONDS} detik aktif.`
      )
    } else {
      setCooldownNotice('')
    }

    setIsRotating(true)
    setTimeout(() => setIsRotating(false), 500)

    onRefresh()
  }, [cooldown, onRefresh])

  // 4. Audio Text-to-Speech Accessibility
  const playAudioCode = () => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
      alert('Browser Anda tidak mendukung text-to-speech audio.')
      return
    }
    window.speechSynthesis.cancel()

    setIsSpeaking(true)
    const lettersSpelled = captchaCode
      .split('')
      .map((c) => {
        if (/[A-Z]/.test(c)) return `capital ${c}`
        return c
      })
      .join(', ')

    const utterance = new SpeechSynthesisUtterance(
      `Security verification code is: ${lettersSpelled}. Characters are case insensitive.`
    )
    utterance.rate = 0.82
    utterance.pitch = 1
    utterance.onend = () => setIsSpeaking(false)
    utterance.onerror = () => setIsSpeaking(false)

    window.speechSynthesis.speak(utterance)
  }

  const isFullInput = userInput.length === DEFAULT_CAPTCHA_LENGTH
  const hasTypo = isFullInput && !validateCaptcha(userInput, captchaCode)

  return (
    <div className="captcha-block" aria-labelledby="captcha-heading">
      {/* Honeypot field invisible to humans to trap automated bots */}
      <div className="captcha-honeypot" aria-hidden="true">
        <label htmlFor="hp_contact_url">Leave this empty</label>
        <input
          id="hp_contact_url"
          type="text"
          name="_hp_url"
          tabIndex={-1}
          autoComplete="off"
          value={honeypotValue}
          onChange={(e) => onChangeHoneypot(e.target.value)}
        />
      </div>

      <div className="captcha-header">
        <span id="captcha-heading" className="captcha-title">
          <span className={`status-pip ${isVerified ? 'verified' : cooldown > 0 ? 'cooldown' : ''}`} />
          ANTI-BOT VERIFICATION
        </span>
        <span className={`captcha-badge ${isVerified ? 'is-verified' : cooldown > 0 ? 'is-cooldown' : ''}`}>
          {isVerified
            ? '✓ HUMAN VERIFIED'
            : cooldown > 0
              ? `COOLDOWN (${cooldown}S)`
              : 'CAPTCHA REQUIRED'}
        </span>
      </div>

      <p className="captcha-desc">
        Ketik karakter pada kotak gambar di bawah (tidak membedakan huruf besar/kecil):
      </p>

      <div className="captcha-body">
        <div className="captcha-visual-group">
          <div
            className={`captcha-canvas-wrap ${cooldown > 0 ? 'locked' : ''}`}
            onClick={handleProtectedRefresh}
            title={cooldown > 0 ? `Tunggu ${cooldown} detik` : 'Klik gambar untuk mengganti kode baru'}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault()
                handleProtectedRefresh()
              }
            }}
            aria-label="Gambar kode verifikasi CAPTCHA. Klik untuk muat ulang."
          >
            <canvas
              ref={canvasRef}
              className="captcha-canvas"
              aria-label="Captcha security challenge"
            />
            {cooldown > 0 && (
              <div className="canvas-cooldown-overlay">
                <span>⏳ {cooldown}s</span>
              </div>
            )}
          </div>

          <div className="captcha-controls">
            <button
              type="button"
              className={`captcha-ctrl-btn ${cooldown > 0 ? 'is-disabled' : ''}`}
              onClick={handleProtectedRefresh}
              disabled={cooldown > 0}
              title={cooldown > 0 ? `Tunggu ${cooldown} detik` : 'Muat ulang kode CAPTCHA'}
              aria-label="Generate new captcha code"
            >
              {cooldown > 0 ? (
                <span className="cooldown-counter">{cooldown}s</span>
              ) : (
                <span
                  className={`ctrl-icon ${isRotating ? 'spinning' : ''}`}
                  aria-hidden="true"
                >
                  &#8635;
                </span>
              )}
            </button>
            <button
              type="button"
              className={`captcha-ctrl-btn ${isSpeaking ? 'is-speaking' : ''}`}
              onClick={playAudioCode}
              title="Dengarkan pengucapan kode CAPTCHA"
              aria-label="Listen to captcha code aloud"
            >
              <span aria-hidden="true">&#128266;</span>
            </button>
          </div>
        </div>

        <div className="captcha-input-group">
          <div className="captcha-input-wrapper">
            <input
              id="captcha-input-field"
              type="text"
              className={`captcha-input ${isVerified ? 'verified' : ''} ${error || hasTypo ? 'has-error' : ''}`}
              placeholder="KODE..."
              value={userInput}
              onChange={(e) => onChangeInput(e.target.value)}
              maxLength={DEFAULT_CAPTCHA_LENGTH}
              autoComplete="off"
              autoCapitalize="characters"
              spellCheck="false"
              aria-label="Ketik kode captcha di sini"
              aria-describedby="captcha-feedback-msg"
            />
            <span className="captcha-char-counter" aria-hidden="true">
              {userInput.length}/{DEFAULT_CAPTCHA_LENGTH}
            </span>
          </div>
        </div>
      </div>

      <div id="captcha-feedback-msg" className="captcha-feedback-area" role="status">
        {cooldownNotice ? (
          <span className="captcha-msg warning">
            <span aria-hidden="true">&#9888;</span> {cooldownNotice}
          </span>
        ) : error ? (
          <span className="captcha-msg error">
            <span aria-hidden="true">&#9888;</span> {error}
          </span>
        ) : isVerified ? (
          <span className="captcha-msg success">
            <span aria-hidden="true">&#10003;</span> Verifikasi berhasil! Siap dikirim.
          </span>
        ) : hasTypo ? (
          <span className="captcha-msg error">
            <span aria-hidden="true">&#9888;</span> Kode belum cocok, periksa kembali karakter di atas.
          </span>
        ) : (
          <span className="captcha-msg hint">
            Anti-Spam aktif: Tombol muat ulang dibatasi jeda {REFRESH_COOLDOWN_SECONDS} detik.
          </span>
        )}
      </div>
    </div>
  )
}
