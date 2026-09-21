# Finish installing Lumen Desktop

Restart Hermes Desktop so it can materialize Lumen's `desktop/` package half
and register the theme.

## Migrating from the curl installer

If you previously installed Lumen with `curl`, first move the old standalone
copy out of the way. Hermes intentionally will not overwrite a marker-less
Desktop plugin folder with a managed package.

```bash
mv ~/.hermes/desktop-plugins/lumen ~/.hermes/desktop-plugins/lumen.legacy
```

Then restart Hermes Desktop and choose **Lumen** in the theme picker.
