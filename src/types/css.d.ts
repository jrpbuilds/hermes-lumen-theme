/**
 * Ambient declaration for esbuild's `text` loader: styles are imported as
 * plain strings and concatenated into the injected stylesheet.
 */

declare module '*.css' {
  const css: string
  export default css
}
