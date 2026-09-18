/**
 * Ambient declaration for `@hermes/plugin-sdk`.
 *
 * The Hermes Desktop runtime loader rewrites this bare specifier to a live
 * shim blob before evaluating the plugin (see the app's
 * `src/contrib/runtime-loader.ts`), so at build time it is a normal import and
 * at runtime it resolves to the app-provided SDK. Only the names Lumen uses
 * are declared; extend here when adopting more of the SDK.
 */

declare module '@hermes/plugin-sdk' {
  /** Registry area id for theme contributions (`'themes'`). */
  export const THEMES_AREA: 'themes'
}
