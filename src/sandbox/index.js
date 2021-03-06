import { proto } from '../unify/proto'
import { polyfill } from '../unify/polyfill'

export const __Sandbox = () => {
  // Sandbox

  class Sandbox {
    constructor(whitebox) {
      let sandbox, content, context

      this.sandbox = this.iframe = sandbox = document.createElement('iframe')

      // 沙箱拓为明箱及暗箱之别 whitebox && blackbox

      if (!whitebox) {
        sandbox.style.display = 'none'
        document.head.appendChild(sandbox)

        this.init()
      }
    }

    init() {
      let content = this.sandbox.contentDocument

      // init

      content.open()
      content.write('')
      content.close()

      this.window = this.sandbox.contentWindow.window
      this.document = this.sandbox.contentWindow.document

      return this
    }

    unify(un) {

      // 获取被支持的iframe

      polyfill(this.window)

      if (!un) {
        proto(this.window)
      }

      return this
    }

    open() {
      this.sandbox.contentDocument.open()

      return this
    }

    write(style, script) {
      let context

      if (style || script) {
        context = '<!DOCTYPE html>' +
          '<html>' +
          '<head>' +
          (style ? style : '') +
          (script ? script : '') +
          '</head>' +
          '<body>' +
          '</body>' +
          '</html>'
      } else {
        context = '<head><meta charset="utf-8"></head>'
      }

      this.sandbox.contentDocument.write(context)


      return this
    }

    close() {
      this.sandbox.contentDocument.close()
    }

    exit() {
      document.head.removeChild(this.sandbox)
    }

    load(files, callback) {
      files = typeof files == 'object' ? files : [files]

      let html = ''
      for (let i = files.length - 1; i >= 0; i--) {
        html += '<object data=' + files[i] + '</object>';
      }

      this.sandboxWindow.open()
      this.sandboxWindow.write(html)
      this.sandboxWindow.close()

      this.sandboxWindow.onload = function() {
        callback()
      }
    }
  }

  // SandboxFunction

  let sandbox = new Sandbox(),
    sandboxWindow = sandbox.window,
    SandboxFunction = sandboxWindow.Function

  sandbox.unify(true)
  sandbox.exit()

  // shadowRootFunction

  let shadowRoot = new Sandbox(),
    shadowRootWindow = shadowRoot.window,
    ShadowRootFunction = shadowRootWindow.Function

  shadowRoot.unify(true)

  return {
    sandbox: Sandbox,
    sandboxWindow: sandboxWindow,
    SandboxFunction: SandboxFunction,
    shadowRootWindow: shadowRootWindow,
    ShadowRootFunction: ShadowRootFunction,
  }
}
