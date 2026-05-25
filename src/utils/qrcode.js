/**
 * Generador de QR Code mínimo, frontend-only, sin deps externas.
 *
 * Por qué existe: el componente CrossDeviceQR usaba api.qrserver.com para
 * generar el código. Eso leakea el resume token (que contiene email del
 * lead) a un tercero sin DPA → viola GDPR y Ley 25.326 (Arg).
 *
 * Esta implementación produce un QR válido para URLs típicas del onboarding
 * (~80 chars), versión 5 (37x37 módulos, ECC level L). Para URLs más largas,
 * cambiá QR_VERSION y los polinomios ECC.
 *
 * Limitaciones aceptadas:
 *  - Solo Byte mode (no numeric/alphanumeric optimization)
 *  - Solo ECC level L (7% recovery — suficiente para uso en pantalla limpia)
 *  - Versión 5 fija (caben 106 bytes en L) → si el token + URL supera ~100
 *    chars, fallback a usar una versión mayor en el futuro.
 *
 * Si quisieras 0 limitaciones, importá `qrcode` (24KB gzipped). Para nuestro
 * caso ese costo no se justifica.
 */

const QR_VERSION = 5
const MODULE_COUNT = 4 * QR_VERSION + 17  // 37 for version 5
const TOTAL_DATA_CODEWORDS = 108  // version 5, level L
const ECC_CODEWORDS = 26          // version 5, level L

// Galois Field tables for Reed-Solomon ECC
const GF_EXP = new Uint8Array(512)
const GF_LOG = new Uint8Array(256)
;(function buildGFTables() {
  let x = 1
  for (let i = 0; i < 255; i++) {
    GF_EXP[i] = x
    GF_LOG[x] = i
    x <<= 1
    if (x & 0x100) x ^= 0x11d
  }
  for (let i = 255; i < 512; i++) GF_EXP[i] = GF_EXP[i - 255]
})()

function gfMul(a, b) {
  if (!a || !b) return 0
  return GF_EXP[(GF_LOG[a] + GF_LOG[b]) % 255]
}

// Reed-Solomon ECC generator polynomial for version 5 / level L
function makeECCPoly(degree) {
  let poly = [1]
  for (let i = 0; i < degree; i++) {
    const next = Array.from({ length: poly.length + 1 }, () => 0)
    for (let j = 0; j < poly.length; j++) {
      next[j] ^= poly[j]
      next[j + 1] ^= gfMul(poly[j], GF_EXP[i])
    }
    poly = next
  }
  return poly
}

function computeECC(data, eccLen) {
  const gen = makeECCPoly(eccLen)
  const buf = data.slice()
  for (let i = 0; i < eccLen; i++) buf.push(0)
  for (let i = 0; i < data.length; i++) {
    const coef = buf[i]
    if (coef === 0) continue
    for (let j = 0; j < gen.length; j++) {
      buf[i + j] ^= gfMul(gen[j], coef)
    }
  }
  return buf.slice(data.length)
}

// Convert text to byte-mode QR bitstream (mode 0100 + length + data + terminator)
function encodeBytes(text) {
  const bytes = new TextEncoder().encode(text)
  if (bytes.length > 106) {
    // Trunca al máximo soportado en v5/L (deja terminator + padding)
    console.warn('[QR] payload too long, truncating')
  }
  const bits = []
  // Mode indicator: byte mode = 0100
  bits.push(0, 1, 0, 0)
  // Char count: 8 bits for v1-9
  const len = Math.min(bytes.length, 106)
  for (let i = 7; i >= 0; i--) bits.push((len >> i) & 1)
  for (let i = 0; i < len; i++) {
    for (let j = 7; j >= 0; j--) bits.push((bytes[i] >> j) & 1)
  }
  // Terminator (max 4 zeros)
  for (let i = 0; i < 4 && bits.length < TOTAL_DATA_CODEWORDS * 8; i++) bits.push(0)
  // Pad to byte boundary
  while (bits.length % 8 !== 0) bits.push(0)
  // Pad with alternating 0xEC / 0x11 until full
  const padBytes = [0xEC, 0x11]
  let p = 0
  while (bits.length < TOTAL_DATA_CODEWORDS * 8) {
    const byte = padBytes[p++ % 2]
    for (let i = 7; i >= 0; i--) bits.push((byte >> i) & 1)
  }
  // Convert bits to bytes
  const data = []
  for (let i = 0; i < bits.length; i += 8) {
    let b = 0
    for (let j = 0; j < 8; j++) b = (b << 1) | bits[i + j]
    data.push(b)
  }
  return data
}

// Build the QR matrix with finder + alignment + timing + format + data + mask
function buildMatrix(codewords) {
  const N = MODULE_COUNT
  const m = Array.from({ length: N }, () => Array.from({ length: N }, () => null))
  const reserved = Array.from({ length: N }, () => Array.from({ length: N }, () => false))

  // Finder patterns (3 corners)
  function placeFinder(r, c) {
    for (let i = -1; i <= 7; i++) {
      for (let j = -1; j <= 7; j++) {
        const y = r + i, x = c + j
        if (y < 0 || y >= N || x < 0 || x >= N) continue
        const inFinder = i >= 0 && i <= 6 && j >= 0 && j <= 6
        if (inFinder) {
          const v = (i === 0 || i === 6 || j === 0 || j === 6 ||
                     (i >= 2 && i <= 4 && j >= 2 && j <= 4)) ? 1 : 0
          m[y][x] = v
        } else {
          m[y][x] = 0
        }
        reserved[y][x] = true
      }
    }
  }
  placeFinder(0, 0)
  placeFinder(0, N - 7)
  placeFinder(N - 7, 0)

  // Alignment pattern (version 5 has one at center (30, 30))
  function placeAlignment(r, c) {
    for (let i = -2; i <= 2; i++) {
      for (let j = -2; j <= 2; j++) {
        const v = (Math.abs(i) === 2 || Math.abs(j) === 2 || (i === 0 && j === 0)) ? 1 : 0
        m[r + i][c + j] = v
        reserved[r + i][c + j] = true
      }
    }
  }
  placeAlignment(30, 30)

  // Timing patterns
  for (let i = 8; i < N - 8; i++) {
    if (m[6][i] === null) { m[6][i] = i % 2 === 0 ? 1 : 0; reserved[6][i] = true }
    if (m[i][6] === null) { m[i][6] = i % 2 === 0 ? 1 : 0; reserved[i][6] = true }
  }

  // Dark module
  m[N - 8][8] = 1
  reserved[N - 8][8] = true

  // Reserve format info areas
  for (let i = 0; i < 9; i++) { reserved[8][i] = true; reserved[i][8] = true }
  for (let i = 0; i < 8; i++) { reserved[8][N - 1 - i] = true; reserved[N - 1 - i][8] = true }

  // Place data with zigzag pattern from bottom-right
  const bits = []
  codewords.forEach((b) => { for (let i = 7; i >= 0; i--) bits.push((b >> i) & 1) })
  let idx = 0
  let upward = true
  for (let col = N - 1; col > 0; col -= 2) {
    if (col === 6) col-- // skip timing column
    for (let row = 0; row < N; row++) {
      const y = upward ? N - 1 - row : row
      for (let dx = 0; dx < 2; dx++) {
        const x = col - dx
        if (reserved[y][x]) continue
        m[y][x] = idx < bits.length ? bits[idx++] : 0
      }
    }
    upward = !upward
  }

  // Apply mask 0 (i+j) % 2 == 0
  for (let y = 0; y < N; y++) {
    for (let x = 0; x < N; x++) {
      if (!reserved[y][x] && m[y][x] !== null && (y + x) % 2 === 0) m[y][x] ^= 1
    }
  }

  // Format info: ECC L (01) + mask 0 (000) = 01000 → BCH-encoded
  // Precomputed for L + mask 0:
  const formatBits = [1, 1, 1, 0, 1, 1, 1, 1, 1, 0, 0, 0, 1, 0, 0]
  for (let i = 0; i < 6; i++) m[8][i] = formatBits[i]
  m[8][7] = formatBits[6]
  m[8][8] = formatBits[7]
  m[7][8] = formatBits[8]
  for (let i = 9; i < 15; i++) m[14 - i][8] = formatBits[i]
  for (let i = 0; i < 8; i++) m[N - 1 - i][8] = formatBits[i]
  for (let i = 0; i < 7; i++) m[8][N - 7 + i] = formatBits[8 + i]

  // Replace nulls with 0
  for (let y = 0; y < N; y++) for (let x = 0; x < N; x++) if (m[y][x] === null) m[y][x] = 0

  return m
}

/**
 * Generate QR code as SVG string for the given text.
 *
 * @param {string} text - URL or text to encode (max ~106 bytes for v5/L)
 * @param {object} opts - { size: pixels, fg: color, bg: color, margin: modules }
 * @returns {string} SVG markup
 */
export function generateQrSvg(text, opts = {}) {
  const size = opts.size || 192
  const fg = opts.fg || '#0f172a'
  const bg = opts.bg || '#ffffff'
  const margin = opts.margin ?? 4
  try {
    const data = encodeBytes(text)
    const ecc = computeECC(data, ECC_CODEWORDS)
    const codewords = data.concat(ecc)
    const matrix = buildMatrix(codewords)
    const N = MODULE_COUNT
    const total = N + margin * 2
    const cell = size / total
    let rects = ''
    for (let y = 0; y < N; y++) {
      for (let x = 0; x < N; x++) {
        if (matrix[y][x] === 1) {
          const px = (x + margin) * cell
          const py = (y + margin) * cell
          rects += `<rect x="${px.toFixed(2)}" y="${py.toFixed(2)}" width="${cell.toFixed(2)}" height="${cell.toFixed(2)}"/>`
        }
      }
    }
    return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${size} ${size}" width="${size}" height="${size}" shape-rendering="crispEdges"><rect width="${size}" height="${size}" fill="${bg}"/><g fill="${fg}">${rects}</g></svg>`
  } catch (e) {
    console.error('[QR] generation failed', e)
    // Fallback visual: caja gris con "QR" para no romper la UI.
    return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${size} ${size}" width="${size}" height="${size}"><rect width="${size}" height="${size}" fill="${bg}" stroke="${fg}"/><text x="50%" y="50%" text-anchor="middle" dominant-baseline="central" fill="${fg}" font-family="monospace" font-size="14">QR error</text></svg>`
  }
}

/**
 * Return data: URL of the SVG QR (useful for <img :src>).
 */
export function generateQrDataUrl(text, opts) {
  const svg = generateQrSvg(text, opts)
  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`
}
