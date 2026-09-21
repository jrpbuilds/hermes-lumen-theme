# Lumen contributor guidance

## Theme-scoped DOM behavior

Lumen's CSS is scoped to `:root[data-hermes-theme="lumen"]`, but JavaScript
enhancements can mutate the shared Hermes DOM. Any behavior that adds classes,
attributes, nodes, or event-driven visual state must therefore be reversible.

- Apply Lumen-specific DOM decoration only while the active theme is Lumen.
- Remove every Lumen-authored DOM change when the active theme changes away
  from Lumen and when the plugin is disposed or hot-reloaded.
- Observe the theme attribute when a long-lived behavior must react to theme
  switching; do not assume a sidebar rerender will clean up the DOM.
- Preserve native nodes and content when decorating them so cleanup restores
  the host UI rather than reconstructing it.
- Add jsdom coverage for both entering Lumen and starting or switching outside
  Lumen. The inactive-theme assertion must verify that no Lumen-specific DOM
  class or child remains.

Follow the `section-glyphs` behavior and its tests as the reference pattern.
