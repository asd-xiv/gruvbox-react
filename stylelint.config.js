/** @type {import("stylelint").Config} */
export default {
  ignoreFiles: ["src/design-system/**"],
  rules: {
    "color-no-hex": true,
    "function-disallowed-list": [
      "rgb",
      "rgba",
      "hsl",
      "hsla",
      "linear-gradient",
      "radial-gradient",
      "conic-gradient",
      "blur",
    ],
    "property-disallowed-list": ["box-shadow"],
    "declaration-property-value-allowed-list": {
      "border-radius": ["/^var\\(--gvb-radius-(none|sm)\\)$/"],
      "opacity": ["0", "1"],
      "transition": [
        "none",
        "/^var\\(--gvb-transition-(fast|normal|slow)\\)$/",
      ],
      "transition-property": [
        "/^(color|background-color|border-color|transform|translate)(, (color|background-color|border-color|transform|translate))*$/",
      ],
    },
    "declaration-property-value-disallowed-list": {
      "justify-content": ["space-between"],
    },
    "declaration-property-unit-allowed-list": {
      "/^(padding|margin)/": ["ch"],
      "/gap$/": ["ch"],
    },
  },
}
