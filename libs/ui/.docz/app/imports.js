export const imports = {
  "Ui.mdx": () =>
    import(/* webpackPrefetch: true, webpackChunkName: "ui" */ "Ui.mdx"),
  "atoms/Atoms.mdx": () =>
    import(/* webpackPrefetch: true, webpackChunkName: "atoms-atoms" */ "atoms/Atoms.mdx"),
  "components/Components.mdx": () =>
    import(/* webpackPrefetch: true, webpackChunkName: "components-components" */ "components/Components.mdx"),
  "layouts/Layouts.mdx": () =>
    import(/* webpackPrefetch: true, webpackChunkName: "layouts-layouts" */ "layouts/Layouts.mdx"),
}
