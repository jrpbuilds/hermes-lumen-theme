/**
 * Ambient declarations for esbuild's text/dataurl loaders: styles and embedded
 * assets are imported as strings and concatenated into the plugin stylesheet.
 */

declare module "*.css" {
    const css: string
    export default css
}

declare module "*.woff2" {
    const font: string
    export default font
}
