export class BasePlugin {
  constructor({ name, test, renderer, priority = 0, meta }) {
    this.name = name
    this.test = test
    this.renderer = renderer
    this.priority = priority
    this.meta = meta
  }

  createCopy({ name, test, priority, renderer, meta }) {
    return new BasePlugin({
      name: name || this.name,
      test: test || this.test,
      renderer: renderer || this.renderer,
      priority: priority || this.priority,
      meta: meta || this.meta,
    })
  }

  render(...args) {
    return this.renderer(...args)
  }
}

BasePlugin.create = ({ name, test, renderer, priority = 0 }) =>
  new BasePlugin({
    name,
    test,
    renderer,
    priority,
  })
