import { registerHooks } from "node:module"

/**
 * Node cannot import CSS. Load each CSS module as an object that returns each
 * class name unchanged, eg. `css["base"] === "base"`, so a test can render a
 * component that imports one
 */
registerHooks({
  load: (url, context, nextLoad) =>
    url.endsWith(".css")
      ? {
          format: "module",
          shortCircuit: true,
          source: "export default new Proxy({}, { get: (_, name) => name })",
        }
      : nextLoad(url, context),
})
