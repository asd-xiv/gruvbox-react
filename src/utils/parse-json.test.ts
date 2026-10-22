import { deepStrictEqual, strictEqual } from "node:assert"
import { describe, test } from "node:test"

import { parseJson } from "./parse-json.js"

type Settings = { language: string }

const isSettings = (value: unknown): value is Settings =>
  typeof value === "object" &&
  value !== null &&
  typeof (value as Settings).language === "string"

const DEFAULT_SETTINGS: Settings = { language: "en" }

void describe("parseJson :: parse JSON text and check the value", () => {
  void test("given [undefined] should [return the default value]", () => {
    deepStrictEqual(
      parseJson(undefined, {
        isValid: isSettings,
        defaultValue: DEFAULT_SETTINGS,
      }),
      DEFAULT_SETTINGS
    )
  })

  void test("given [JSON that isValid accepts] should [return the parsed value]", () => {
    deepStrictEqual(
      parseJson(JSON.stringify({ language: "ro" }), {
        isValid: isSettings,
        defaultValue: DEFAULT_SETTINGS,
      }),
      { language: "ro" }
    )
  })

  void test("given [a value that isValid rejects] should [return the default value]", () => {
    deepStrictEqual(
      parseJson(JSON.stringify({ language: 42 }), {
        isValid: isSettings,
        defaultValue: DEFAULT_SETTINGS,
      }),
      DEFAULT_SETTINGS
    )
  })

  void test("given [text that is not JSON] should [return the default value]", () => {
    deepStrictEqual(
      parseJson("not json", {
        isValid: isSettings,
        defaultValue: DEFAULT_SETTINGS,
      }),
      DEFAULT_SETTINGS
    )
  })

  void test("given [a function default and no text] should [return the function's result]", () => {
    strictEqual(
      parseJson(undefined, {
        isValid: (value): value is number => typeof value === "number",
        defaultValue: () => 14,
      }),
      14
    )
  })

  void test("given [a function default and a valid value] should [not call the function]", () => {
    let callCount = 0

    parseJson("16", {
      isValid: (value): value is number => typeof value === "number",
      defaultValue: () => {
        callCount += 1
        return 14
      },
    })

    strictEqual(callCount, 0)
  })
})
