/**
 * Class names by their key, eg. `css["home-link"]`, as the kit types its own
 * CSS modules. VBlocks types them `any`, which the typed lint rules reject.
 */
declare module "*.css" {
  const classNames: { readonly [key: string]: string }

  export default classNames
}

/**
 * The text of the file, as VBlocks' `?raw` import gives it.
 */
declare module "*?raw" {
  const source: string

  export default source
}
