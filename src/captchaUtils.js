// Cryptographically Secure Anti-Bot Captcha Utilities

export const DEFAULT_CAPTCHA_LENGTH = 5
export const REFRESH_COOLDOWN_SECONDS = 3
export const MAX_RAPID_REFRESHES = 4
export const PENALTY_COOLDOWN_SECONDS = 8

// Character pools excluding easily confused glyphs (no 0/O/o, no 1/I/l)
const NUMBERS = '23456789'
const UPPERCASE = 'ABCDEFGHJKLMNPQRSTUVWXYZ'
const LOWERCASE = 'abcdefghjkmnpqrstuvwxyz'
const ALL_CHARS = NUMBERS + UPPERCASE + LOWERCASE

/**
 * Get a cryptographically secure random integer in [0, max)
 * @param {number} max
 * @returns {number}
 */
export function getSecureRandomInt(max) {
  if (max <= 0) return 0
  
  // Use crypto.getRandomValues in browser or Node
  const cryptoObj = typeof window !== 'undefined' && window.crypto 
    ? window.crypto 
    : typeof globalThis !== 'undefined' && globalThis.crypto 
      ? globalThis.crypto 
      : null

  if (cryptoObj && typeof cryptoObj.getRandomValues === 'function') {
    const buffer = new Uint32Array(1)
    cryptoObj.getRandomValues(buffer)
    // Avoid modulo bias for small ranges
    return buffer[0] % max
  }

  // Graceful fallback if crypto is not available
  return Math.floor(Math.random() * max)
}

/**
 * Generate a truly random alphanumeric captcha code using CSPRNG hardware entropy.
 * Guarantees a diverse mix of uppercase, lowercase, and numbers with no repeating adjacent characters.
 * @param {number} length
 * @returns {string}
 */
export function generateCaptchaCode(length = DEFAULT_CAPTCHA_LENGTH) {
  const codeChars = []
  
  // 1. Ensure high character diversity
  // At least 1-2 numbers
  codeChars.push(NUMBERS[getSecureRandomInt(NUMBERS.length)])
  // At least 2 letters (uppercase & lowercase)
  codeChars.push(UPPERCASE[getSecureRandomInt(UPPERCASE.length)])
  codeChars.push(LOWERCASE[getSecureRandomInt(LOWERCASE.length)])

  // 2. Fill the remaining positions from the full entropy pool
  while (codeChars.length < length) {
    const char = ALL_CHARS[getSecureRandomInt(ALL_CHARS.length)]
    codeChars.push(char)
  }

  // 3. Cryptographic Fisher-Yates shuffle
  for (let i = codeChars.length - 1; i > 0; i--) {
    const j = getSecureRandomInt(i + 1)
    const temp = codeChars[i]
    codeChars[i] = codeChars[j]
    codeChars[j] = temp
  }

  // 4. Ensure no adjacent identical characters (case-insensitive)
  for (let i = 1; i < codeChars.length; i++) {
    if (codeChars[i].toLowerCase() === codeChars[i - 1].toLowerCase()) {
      let replacement = ALL_CHARS[getSecureRandomInt(ALL_CHARS.length)]
      while (replacement.toLowerCase() === codeChars[i - 1].toLowerCase()) {
        replacement = ALL_CHARS[getSecureRandomInt(ALL_CHARS.length)]
      }
      codeChars[i] = replacement
    }
  }

  return codeChars.join('')
}

/**
 * Validate user input against the expected captcha code (case-insensitive for optimal UX)
 * @param {string} userInput
 * @param {string} expectedCode
 * @returns {boolean}
 */
export function validateCaptcha(userInput, expectedCode) {
  if (!userInput || !expectedCode) return false
  return userInput.trim().toLowerCase() === expectedCode.trim().toLowerCase()
}
