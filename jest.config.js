import baseConfig from "@asd14/jest-config"

/** @satisfies {import("@jest/types").Config.InitialOptions} */
export default /** @type {const} */ ({
  ...baseConfig,
  testEnvironment: "jsdom",
})
