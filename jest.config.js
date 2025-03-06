import baseConfig from "@asd14/jest-config"

/** @satisfies {import("jest").Config} */
export default /** @type {const} */ ({
  ...baseConfig,
  testEnvironment: "jsdom",
})
