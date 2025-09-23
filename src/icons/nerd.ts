/**
 * Nerd Font Icons Collection
 *
 * Terminal-inspired icons safe for browser environments.
 * Designed for JetBrains Mono Nerd Font.
 * Includes ASCII art elements for terminal-style UI components.
 *
 * TODO: Extract to separate @asd14/nerd-icons package
 */

/**
 * Status and informational icons
 */
const status = {
  info: "ℹ",
  warning: "⚠",
  error: "✘",
  success: "✔",
  question: "❓",
  exclamation: "❗",
  cross: "✘",
  tick: "✔",
  minus: "−",
  plus: "✚",
} as const

/**
 * Navigation and directional icons
 */
const navigation = {
  arrowUp: "↑",
  arrowDown: "↓",
  arrowLeft: "←",
  arrowRight: "→",
  pointer: "❯",
  pointerSmall: "›",
  triangleUp: "▲",
  triangleDown: "▼",
  triangleLeft: "◀",
  triangleRight: "▶",
  triangleUpSmall: "▴",
  triangleDownSmall: "▾",
  chevronUp: "^",
  chevronDown: "v",
  chevronLeft: "<",
  chevronRight: ">",
} as const

/**
 * Shapes and containers
 */
const shapes = {
  circle: "◯",
  circleFilled: "◉",
  circleDotted: "◌",
  square: "◻",
  squareFilled: "◼",
  squareSmall: "▪",
  diamond: "◆",
  diamondOutline: "◇",
  star: "★",
  starOutline: "☆",
  heart: "♥",
  bullet: "●",
  dot: "․",
  ellipsis: "…",
  block: "█",
  blockLight: "░",
  blockMedium: "▒",
  blockDark: "▓",
} as const

/**
 * Single lines for borders and dividers
 */
const lines = {
  horizontal: "─",
  vertical: "│",
  cross: "┼",

  // Corners
  cornerTopLeft: "┌",
  cornerTopRight: "┐",
  cornerBottomLeft: "└",
  cornerBottomRight: "┘",

  // T-junctions
  teeDown: "┬",
  teeUp: "┴",
  teeRight: "├",
  teeLeft: "┤",

  // Curved corners
  cornerTopLeftRound: "╭",
  cornerTopRightRound: "╮",
  cornerBottomLeftRound: "╰",
  cornerBottomRightRound: "╯",
} as const

/**
 * Double lines for emphasis
 */
const doubleLines = {
  horizontal: "═",
  vertical: "║",
  cross: "╬",

  // Corners
  cornerTopLeft: "╔",
  cornerTopRight: "╗",
  cornerBottomLeft: "╚",
  cornerBottomRight: "╝",

  // T-junctions
  teeDown: "╦",
  teeUp: "╩",
  teeRight: "╠",
  teeLeft: "╣",
} as const

/**
 * Dashed lines for subtle borders
 */
const dashedLines = {
  horizontal: "┄",
  vertical: "┆",
  horizontalBold: "┅",
  verticalBold: "┇",
  horizontalDotted: "┈",
  verticalDotted: "┊",
} as const

/**
 * Common ASCII characters useful for terminal UI
 */
const ascii = {
  pipe: "|",
  dash: "-",
  underscore: "_",
  equals: "=",
  tilde: "~",
  hash: "#",
  at: "@",
  percent: "%",
  ampersand: "&",
  asterisk: "*",
  slash: "/",
  backslash: "\\",
  colon: ":",
  semicolon: ";",
  comma: ",",
  period: ".",
  questionMark: "?",
  exclamationMark: "!",

  // Brackets
  parenthesesLeft: "(",
  parenthesesRight: ")",
  bracketLeft: "[",
  bracketRight: "]",
  braceLeft: "{",
  braceRight: "}",
  angleLeft: "<",
  angleRight: ">",
} as const

/**
 * Special Nerd Font icons (requires Nerd Font)
 */
const nerdFont = {
  oct: {
    info: "",
    report: "",
    lightbulb: "",
    alert: "",
    stop: "",
    search: "",
    gear: "",
    folder: "",
    file: "",
    home: "",
    home_fill: "",
  },
} as const

/**
 * Common UI element combinations
 */
const ui = {
  // Loading/progress
  spinner: "◐",
  loading: "⋯",

  // Interactive elements
  checkbox: "☐",
  checkboxChecked: "☑",
  radio: "◯",
  radioSelected: "◉",

  // Menu and lists
  menuBullet: "•",
  listItem: "▸",
  submenu: "▸",

  // Code and terminal
  prompt: "$",
  cursor: "_",
  command: ">",
} as const

const icons = {
  ...status,
  ...navigation,
  ...shapes,
  ...lines,
  ...doubleLines,
  ...dashedLines,
  ...ascii,
  ...nerdFont,
  ...ui,
} as const

type IconKey = keyof typeof icons

export { icons }
export { IconKey }
