import { RUNTIME } from './runtime'

// Chạy code HTML/CSS/JS của người học trong một <iframe sandbox> không có origin riêng
// (thiếu allow-same-origin): code không đọc được localStorage, cookie hay DOM của trang học,
// nên mở link chia sẻ của người khác cũng an toàn. Trang cha và iframe nói chuyện qua postMessage;
// mỗi lần chạy có một token riêng để bỏ qua tin nhắn của lần chạy cũ.

export interface SourceFiles {
  html: string
  css: string
  js: string
}

export type LogLevel = 'log' | 'info' | 'warn' | 'error' | 'debug'

export interface ConsoleLine {
  level: LogLevel
  text: string
  /** Vị trí lỗi trong code người học, ví dụ "JS · dòng 3". */
  where?: string
}

export interface TestResult {
  pass: boolean
  message: string
}

export interface StorageSnapshot {
  local: Record<string, string>
  session: Record<string, string>
}

export interface RunOptions {
  /** iframe tự báo chiều cao nội dung (dùng cho ví dụ trong bài học). */
  autoHeight?: boolean
  /** Đoạn JS chạy trước code của người học (hàm dựng sẵn của bài tập Playground). */
  setup?: string
  /** Dữ liệu ban đầu cho localStorage/sessionStorage giả lập. */
  storage?: StorageSnapshot
}

export interface SandboxEvents {
  console?(line: ConsoleLine): void
  clear?(): void
  height?(px: number): void
  storage?(area: keyof StorageSnapshot, data: Record<string, string>): void
}

export const SANDBOX_ALLOW =
  'allow-scripts allow-modals allow-forms allow-popups allow-popups-to-escape-sandbox'
/** iframe chấm bài chạy ẩn: không cho hộp thoại alert/confirm hay mở cửa sổ mới. */
export const TEST_SANDBOX_ALLOW = 'allow-scripts allow-forms'

const countLines = (s: string) => s.split('\n').length

/** Có phải một tài liệu HTML đầy đủ (có <!DOCTYPE> hoặc <html>) không. */
export const isFullDocument = (html: string) => /<!doctype|<html[\s>]/i.test(html)

/** Chặn chuỗi "</script" trong JS làm đóng sớm thẻ <script> bao ngoài. */
const safeScript = (js: string) => js.replace(/<\/script/gi, '<\\/script')

interface BuiltDocument {
  doc: string
  /** Đổi số dòng trong srcdoc thành vị trí trong code của người học. */
  locate(line: number): string | undefined
}

export function buildDocument(files: SourceFiles, token: string, opts: RunOptions = {}): BuiltDocument {
  const cfg = JSON.stringify({
    token,
    autoHeight: !!opts.autoHeight,
    storage: opts.storage ?? { local: {}, session: {} },
  }).replace(/</g, '\\u003c')
  // Gộp runtime thành một dòng: chèn vào đầu tài liệu mà không đẩy số dòng của code phía sau.
  const runtime = `<script>${RUNTIME.replace(/\s*\n\s*/g, ' ')}(${cfg});</script>`
  const setup = opts.setup ? `<script>${safeScript(opts.setup.replace(/\s*\n\s*/g, ' '))}</script>` : ''

  let doc = ''
  let line = 1
  const add = (s: string) => {
    doc += s
    line += countLines(s) - 1
  }

  let htmlStart: number
  let jsStart = 0
  if (isFullDocument(files.html)) {
    // Tài liệu đầy đủ: runtime chèn ngay sau <head> (hoặc <html>/<!DOCTYPE>) trên cùng dòng;
    // CSS và JS của các tab còn lại nối vào cuối để không làm lệch dòng của HTML.
    const anchor = /<head[^>]*>/i.exec(files.html) ?? /<html[^>]*>/i.exec(files.html) ?? /<!doctype[^>]*>/i.exec(files.html)
    const at = anchor ? anchor.index + anchor[0].length : 0
    htmlStart = 1
    add(files.html.slice(0, at) + runtime + files.html.slice(at))
    if (files.css.trim()) add(`\n<style>\n${files.css}\n</style>`)
    add('\n' + setup)
  } else {
    add('<!DOCTYPE html><html lang="vi"><head><meta charset="utf-8">')
    add('<meta name="viewport" content="width=device-width, initial-scale=1">' + runtime)
    add(`<style>\n${files.css}\n</style></head><body>\n`)
    htmlStart = line
    add(files.html + '\n' + setup)
  }
  if (files.js.trim()) {
    add('<script>\n')
    jsStart = line
    add(safeScript(files.js) + '\n</script>')
  }
  if (!isFullDocument(files.html)) add('</body></html>')

  const htmlLines = countLines(files.html)
  const jsLines = countLines(files.js)
  return {
    doc,
    locate(n) {
      if (!n) return undefined
      if (jsStart && n >= jsStart && n < jsStart + jsLines) return `JS · dòng ${n - jsStart + 1}`
      if (n >= htmlStart && n < htmlStart + htmlLines) return `HTML · dòng ${n - htmlStart + 1}`
      return undefined
    },
  }
}

const newToken = () => Math.random().toString(36).slice(2) + Date.now().toString(36)

/**
 * Quản lý một iframe sandbox. Mỗi lần chạy nên dùng một thẻ <iframe> MỚI (đổi :key trong Vue):
 * nếu code cũ bị treo vì vòng lặp vô hạn, trình duyệt bỏ hẳn iframe đó thay vì chờ nó dừng.
 */
export class Sandbox {
  private token = ''
  private frame?: HTMLIFrameElement
  private locate: BuiltDocument['locate'] = () => undefined
  private onReady?: () => void
  private onResults?: (results: TestResult[]) => void
  private cancelPending?: () => void

  constructor(private events: SandboxEvents = {}) {
    window.addEventListener('message', this.onMessage)
  }

  run(frame: HTMLIFrameElement, files: SourceFiles, opts: RunOptions = {}) {
    this.frame = frame
    this.token = newToken()
    const built = buildDocument(files, this.token, opts)
    this.locate = built.locate
    frame.srcdoc = built.doc
  }

  /**
   * Chạy code trong iframe (thường là iframe ẩn) rồi chạy lần lượt các bài kiểm tra.
   * Trả về null nếu bị hủy vì một lần chấm mới bắt đầu.
   */
  test(
    frame: HTMLIFrameElement,
    files: SourceFiles,
    tests: string[],
    opts: RunOptions = {},
  ): Promise<TestResult[] | null> {
    this.cancelPending?.()
    return new Promise((resolve) => {
      let ready = false
      let settled = false
      const finish = (results: TestResult[] | null) => {
        if (settled) return
        settled = true
        clearTimeout(timer)
        frame.removeEventListener('load', onLoad)
        if (this.cancelPending === cancel) {
          this.cancelPending = this.onReady = this.onResults = undefined
        }
        resolve(results)
      }
      const cancel = () => finish(null)
      this.cancelPending = cancel
      const failAll = (message: string) => finish(tests.map(() => ({ pass: false, message })))
      const timer = window.setTimeout(
        () => failAll('Không nhận được kết quả. Code có bị treo, hay trang bị tải lại khi gửi form?'),
        5000 + tests.length * 3500,
      )
      // Trang trong iframe tải lại giữa chừng (thường do form được gửi đi mà chưa preventDefault).
      const onLoad = () => {
        if (ready) failAll('Trang bị tải lại giữa chừng. Nếu có form, bạn đã gọi event.preventDefault() chưa?')
      }
      this.onReady = () => {
        if (ready) return onLoad()
        ready = true
        this.post({ type: 'run-tests', tests })
      }
      this.onResults = finish
      frame.addEventListener('load', onLoad)
      this.run(frame, files, opts)
    })
  }

  dispose() {
    this.cancelPending?.()
    window.removeEventListener('message', this.onMessage)
    this.frame = undefined
  }

  private post(msg: Record<string, unknown>) {
    this.frame?.contentWindow?.postMessage({ ...msg, __wb: this.token }, '*')
  }

  private onMessage = (e: MessageEvent) => {
    const d = e.data
    if (!d || d.__wb !== this.token || !this.frame || e.source !== this.frame.contentWindow) return
    switch (d.type) {
      case 'console':
        this.events.console?.({ level: d.level, text: String(d.text), where: this.locate(d.line) })
        break
      case 'clear':
        this.events.clear?.()
        break
      case 'height':
        this.events.height?.(Number(d.value) || 0)
        break
      case 'storage':
        this.events.storage?.(d.area, { ...d.data })
        break
      case 'resize': {
        const frame = this.frame
        frame.style.width = `${Number(d.width) || 800}px`
        requestAnimationFrame(() => requestAnimationFrame(() => this.post({ type: 'resized' })))
        break
      }
      case 'ready':
        this.onReady?.()
        break
      case 'results':
        this.onResults?.(Array.isArray(d.results) ? d.results : [])
        break
    }
  }
}
