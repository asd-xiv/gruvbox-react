import { JSDOM } from "jsdom"

/**
 * HTML template for creating a minimal DOM structure
 */
const HTML_TEMPLATE = "<!DOCTYPE html><html><body></body></html>"

/**
 * Creates a virtual DOM environment using JSDOM
 * This simulates a browser environment in Node.js for testing
 */
const dom = new JSDOM(HTML_TEMPLATE, {
  url: "http://localhost",
  pretendToBeVisual: true,
  resources: "usable",
})

/**
 * Attach browser DOM objects to global scope for Node.js testing environment.
 * This enables browser-like functionality including DOM manipulation, storage,
 * element creation, and navigator information access.
 */
globalThis.window = /** @type {Window & typeof globalThis} */ (
  /** @type {unknown} */ (dom.window)
)
globalThis.document = dom.window.document
globalThis.HTMLElement = dom.window.HTMLElement
globalThis.localStorage = dom.window.localStorage

Object.defineProperty(globalThis, "navigator", {
  value: dom.window.navigator,
  writable: true,
})
