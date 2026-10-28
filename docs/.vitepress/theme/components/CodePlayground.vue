<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, onMounted, reactive, ref, watch } from 'vue'
import { useData, withBase } from 'vitepress'
import { createEditor, type EditorHandle, type Tab } from '../playground/editor'
import { guardLoops } from '../playground/loopGuard'
import { MISSIONS, type Mission } from '../playground/missions'
import {
  SANDBOX_ALLOW,
  Sandbox,
  TEST_SANDBOX_ALLOW,
  type ConsoleLine,
  type SourceFiles,
  type StorageSnapshot,
  type TestResult,
} from '../sandbox/sandbox'
import { decodeShare, encodeShare, standaloneHtml } from '../sandbox/share'

// Toàn bộ trạng thái (code từng bài, bài đang mở, bài đã xong, localStorage giả lập) lưu trong
// localStorage của trình duyệt. Đổi cấu trúc dữ liệu đã lưu thì tăng hậu tố :v1 của khóa.
const STORAGE_KEY = 'webbasic:playground:v1'
const FREE = 'tu-do'
const SHARED = 'chia-se'
const MAX_LINES = 500

const TABS: { id: Tab; label: string }[] = [
  { id: 'html', label: 'HTML' },
  { id: 'css', label: 'CSS' },
  { id: 'js', label: 'JS' },
]
const GROUPS = ['HTML', 'CSS', 'JavaScript'] as const

const FREE_CODE: SourceFiles = {
  html: '<h1>Xin chào 👋</h1>\n<p>Sửa code bên trái, kết quả hiện ngay ở đây.</p>\n<button id="nut" type="button">Bấm thử</button>\n',
  css: 'body {\n  font-family: system-ui, sans-serif;\n  margin: 24px;\n}\n\nh1 {\n  color: #c2410c;\n}\n',
  js: "const nut = document.querySelector('#nut');\nlet dem = 0;\n\nnut.addEventListener('click', () => {\n  dem++;\n  nut.textContent = `Đã bấm ${dem} lần`;\n  console.log('Số lần bấm:', dem);\n});\n",
}

interface Saved {
  active: string
  code: Record<string, SourceFiles>
  done: string[]
  storage: StorageSnapshot
  autoRun: boolean
}

const { isDark } = useData()

const active = ref(FREE)
const code = reactive<Record<string, SourceFiles>>({})
const done = ref<string[]>([])
const storage = ref<StorageSnapshot>({ local: {}, session: {} })
const autoRun = ref(true)
const tab = ref<Tab>('html')
const lines = ref<ConsoleLine[]>([])
const results = ref<(TestResult | null)[]>([])
const testing = ref(false)
const showHint = ref(false)
const listOpen = ref(false)
const notice = ref('')
const runKey = ref(0)
const testKey = ref(0)

const hosts = reactive<Partial<Record<Tab, HTMLElement>>>({})
const previewFrame = ref<HTMLIFrameElement>()
const testFrame = ref<HTMLIFrameElement>()
const editors: Partial<Record<Tab, EditorHandle>> = {}

const mission = computed<Mission | undefined>(() => MISSIONS.find((m) => m.id === active.value))
const missionIndex = computed(() => MISSIONS.findIndex((m) => m.id === active.value))
const nextMission = computed(() => MISSIONS[missionIndex.value + 1])
const passed = computed(() => results.value.filter((r) => r?.pass).length)
const allPassed = computed(
  () => !!mission.value && results.value.length > 0 && results.value.every((r) => r?.pass),
)
const hasShared = computed(() => !!code[SHARED])

function starterOf(id: string): SourceFiles {
  if (id === FREE) return { ...FREE_CODE }
  const m = MISSIONS.find((x) => x.id === id)
  return m ? { ...m.starter } : { html: '', css: '', js: '' }
}

const current = (): SourceFiles => code[active.value] ?? starterOf(active.value)

// ───────────── lưu & nạp ─────────────
let saveTimer: number | undefined
function save() {
  clearTimeout(saveTimer)
  saveTimer = window.setTimeout(() => {
    const data: Saved = {
      active: active.value,
      code: { ...code },
      done: done.value,
      storage: storage.value,
      autoRun: autoRun.value,
    }
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
    } catch {
      // Trình duyệt chặn storage: Playground vẫn chạy, chỉ là không nhớ được code.
    }
  }, 400)
}

function load() {
  try {
    const data = JSON.parse(localStorage.getItem(STORAGE_KEY) || 'null') as Partial<Saved> | null
    if (!data || typeof data !== 'object') return
    for (const [id, files] of Object.entries(data.code ?? {})) {
      if (files && typeof files.html === 'string' && typeof files.css === 'string' && typeof files.js === 'string') {
        code[id] = files
      }
    }
    if (Array.isArray(data.done)) done.value = data.done.filter((id) => MISSIONS.some((m) => m.id === id))
    if (data.storage?.local && data.storage?.session) storage.value = data.storage
    if (typeof data.autoRun === 'boolean') autoRun.value = data.autoRun
    if (typeof data.active === 'string' && (data.active === FREE || code[data.active] || MISSIONS.some((m) => m.id === data.active))) {
      active.value = data.active
    }
  } catch {
    // Dữ liệu hỏng: bắt đầu lại từ đầu.
  }
}

// ───────────── chạy & chấm ─────────────
// Không bọc trong ref: Sandbox giữ tham chiếu DOM và listener, không cần reactive.
let preview: Sandbox | undefined
let tester: Sandbox | undefined
let testSeq = 0
// Đang nạp code vào trình soạn bằng chương trình (đổi bài, làm lại...): bỏ qua sự kiện sửa.
let applying = false

function prepared(files: SourceFiles): SourceFiles {
  return { ...files, js: guardLoops(files.js) }
}

async function run() {
  clearTimeout(autoTimer)
  const files = prepared(current())
  const m = mission.value
  lines.value = []
  runKey.value++
  await nextTick()
  if (previewFrame.value && preview) {
    preview.run(previewFrame.value, files, { setup: m?.setup, storage: storage.value })
  }
  if (m) test(m, files)
}

async function test(m: Mission, files: SourceFiles) {
  const seq = ++testSeq
  testing.value = true
  results.value = m.tests.map(() => null)
  testKey.value++
  await nextTick()
  if (!testFrame.value || !tester) {
    testing.value = false
    return
  }
  const res = await tester.test(
    testFrame.value,
    files,
    m.tests.map((t) => t.code),
    { setup: m.setup },
  )
  if (!res || seq !== testSeq || active.value !== m.id) return
  results.value = res
  testing.value = false
  if (res.every((r) => r.pass) && !done.value.includes(m.id)) {
    done.value = [...done.value, m.id]
    save()
  }
}

let autoTimer: number | undefined
function onEdit(t: Tab, text: string) {
  if (applying) return
  const files = { ...current(), [t]: text }
  code[active.value] = files
  save()
  if (autoRun.value) {
    clearTimeout(autoTimer)
    autoTimer = window.setTimeout(run, 800)
  }
}

function loadIntoEditors(files: SourceFiles) {
  applying = true
  for (const t of TABS) editors[t.id]?.setDoc(files[t.id])
  applying = false
}

function select(id: string) {
  if (id === active.value) {
    listOpen.value = false
    return
  }
  active.value = id
  showHint.value = false
  listOpen.value = false
  results.value = []
  const files = current()
  loadIntoEditors(files)
  // Mở tab có nội dung đầu tiên mà bài tập yêu cầu sửa.
  const m = mission.value
  tab.value = m ? (m.group === 'JavaScript' && files.js ? 'js' : m.group === 'CSS' ? 'css' : 'html') : 'html'
  save()
  run()
}

function reset() {
  const label = mission.value ? 'code ban đầu của bài tập' : 'code mẫu'
  if (!window.confirm(`Xóa code hiện tại và quay về ${label}? localStorage giả lập cũng bị xóa.`)) return
  const files = starterOf(active.value)
  code[active.value] = files
  storage.value = { local: {}, session: {} }
  loadIntoEditors(files)
  save()
  run()
}

function showSolution() {
  const m = mission.value
  if (!m || !window.confirm('Thay code hiện tại bằng lời giải tham khảo?')) return
  code[m.id] = { ...m.solution }
  loadIntoEditors(m.solution)
  save()
  run()
}

// ───────────── chia sẻ & tải về ─────────────
let noticeTimer: number | undefined
function flash(text: string) {
  notice.value = text
  clearTimeout(noticeTimer)
  noticeTimer = window.setTimeout(() => (notice.value = ''), 3000)
}

async function share() {
  const url = location.origin + withBase('/thuc-hanh/playground') + '#code=' + encodeShare(current())
  try {
    await navigator.clipboard.writeText(url)
    flash('Đã copy link vào clipboard. Ai mở link sẽ thấy đúng code này.')
  } catch {
    window.prompt('Copy link dưới đây:', url)
  }
}

function download() {
  const blob = new Blob([standaloneHtml(current(), mission.value?.title ?? 'Bài tập WebBasic')], {
    type: 'text/html',
  })
  const a = document.createElement('a')
  a.href = URL.createObjectURL(blob)
  a.download = `${active.value === FREE ? 'playground' : active.value}.html`
  a.click()
  setTimeout(() => URL.revokeObjectURL(a.href), 1000)
}

// ───────────── định dạng đề bài ─────────────
function fmt(text: string) {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/`([^`]+)`/g, '<code>$1</code>')
    .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
}

function stateOf(i: number) {
  const r = results.value[i]
  if (!r) return testing.value ? 'pending' : 'idle'
  return r.pass ? 'pass' : 'fail'
}

// ───────────── vòng đời ─────────────
onMounted(() => {
  load()
  // Link chia sẻ hoặc nút "Sửa trong Playground" của bài học: #code=...
  const hash = location.hash
  if (hash.startsWith('#code=')) {
    const files = decodeShare(hash.slice(6))
    if (files) {
      code[SHARED] = files
      active.value = SHARED
      flash('Đã mở code từ link. Code của bạn ở các bài khác vẫn được giữ nguyên.')
    }
    history.replaceState(history.state, '', location.pathname + location.search)
  }

  preview = new Sandbox({
    console: (line) => {
      if (lines.value.length < MAX_LINES) lines.value.push(line)
    },
    clear: () => (lines.value = []),
    storage: (area, data) => {
      storage.value = { ...storage.value, [area]: data }
      save()
    },
  })
  tester = new Sandbox()

  const files = current()
  const m = mission.value
  if (m?.group === 'CSS') tab.value = 'css'
  else if (m?.group === 'JavaScript' || (!m && !files.html.trim() && files.js.trim())) tab.value = 'js'
  for (const t of TABS) {
    const host = hosts[t.id]
    if (!host) continue
    editors[t.id] = createEditor(host, {
      tab: t.id,
      doc: files[t.id],
      dark: isDark.value,
      onChange: (text) => onEdit(t.id, text),
      onRun: run,
    })
  }
  run()
})

watch(isDark, (dark) => {
  for (const t of TABS) editors[t.id]?.setDark(dark)
})
watch(autoRun, save)
watch(tab, async (t) => {
  await nextTick()
  editors[t]?.focus()
})

onBeforeUnmount(() => {
  clearTimeout(autoTimer)
  clearTimeout(saveTimer)
  clearTimeout(noticeTimer)
  for (const t of TABS) editors[t.id]?.destroy()
  preview?.dispose()
  tester?.dispose()
})
</script>

<template>
  <div class="pg">
    <aside class="missions" :class="{ open: listOpen }">
      <button type="button" class="list-toggle" :aria-expanded="listOpen" @click="listOpen = !listOpen">
        <span>📋 Bài tập · {{ done.length }}/{{ MISSIONS.length }} đã xong</span>
        <span aria-hidden="true">{{ listOpen ? '▴' : '▾' }}</span>
      </button>
      <div class="list">
        <div class="list-head">
          <strong>Bài tập tự chấm</strong>
          <span>{{ done.length }}/{{ MISSIONS.length }} đã xong</span>
        </div>
        <div class="bar" aria-hidden="true">
          <div :style="{ width: (done.length / MISSIONS.length) * 100 + '%' }" />
        </div>
        <ul>
          <li>
            <button type="button" :class="{ active: active === FREE }" @click="select(FREE)">
              <span class="num">🧪</span><span>Sân chơi tự do</span>
            </button>
          </li>
          <li v-if="hasShared">
            <button type="button" :class="{ active: active === SHARED }" @click="select(SHARED)">
              <span class="num">🔗</span><span>Code từ link chia sẻ</span>
            </button>
          </li>
          <template v-for="g in GROUPS" :key="g">
            <li class="group">{{ g }}</li>
            <li v-for="m in MISSIONS.filter((x) => x.group === g)" :key="m.id">
              <button
                type="button"
                :class="{ active: active === m.id, done: done.includes(m.id) }"
                @click="select(m.id)"
              >
                <span class="num">{{ done.includes(m.id) ? '✓' : MISSIONS.indexOf(m) + 1 }}</span>
                <span>{{ m.title }}</span>
              </button>
            </li>
          </template>
        </ul>
      </div>
    </aside>

    <section class="work">
      <div v-if="mission" class="task">
        <div class="task-head">
          <span class="tag">Bài {{ missionIndex + 1 }} · {{ mission.group }}</span>
          <h2>{{ mission.title }}</h2>
        </div>
        <p class="brief" v-html="fmt(mission.brief)" />
        <ul class="tests" aria-live="polite">
          <li v-for="(t, i) in mission.tests" :key="i" :class="stateOf(i)">
            <span class="icon" aria-hidden="true">{{
              { pass: '✓', fail: '✗', pending: '…', idle: '○' }[stateOf(i)]
            }}</span>
            <span>
              <span v-html="fmt(t.name)" />
              <small v-if="results[i] && !results[i]!.pass && results[i]!.message">{{ results[i]!.message }}</small>
            </span>
          </li>
        </ul>
        <p v-if="allPassed" class="success">
          🎉 Hoàn thành! Bạn đạt {{ passed }}/{{ mission.tests.length }} yêu cầu.
          <button v-if="nextMission" type="button" @click="select(nextMission.id)">
            Bài tiếp: {{ nextMission.title }} →
          </button>
        </p>
        <div class="task-actions">
          <button type="button" @click="showHint = !showHint">💡 {{ showHint ? 'Ẩn gợi ý' : 'Gợi ý' }}</button>
          <button type="button" @click="showSolution">Xem lời giải</button>
          <a :href="withBase(mission.lesson)" target="_blank" rel="noopener">📖 Bài học liên quan</a>
        </div>
        <p v-if="showHint" class="hint" v-html="fmt(mission.hint)" />
      </div>
      <div v-else class="task intro">
        <h2>{{ active === SHARED ? 'Code từ link chia sẻ' : 'Sân chơi tự do' }}</h2>
        <p>
          Viết HTML, CSS và JavaScript rồi xem kết quả ngay. Bấm <kbd>Ctrl</kbd> + <kbd>Enter</kbd> để chạy;
          trong trình soạn, <kbd>Tab</kbd> để thụt lề, <kbd>Esc</kbd> rồi <kbd>Tab</kbd> để rời trình soạn.
          Chọn một bài tập bên trái để được chấm tự động.
        </p>
      </div>

      <p v-if="notice" class="notice" role="status">{{ notice }}</p>

      <div class="panes">
        <div class="pane editor-pane">
          <div class="tabs" role="tablist" aria-label="Chọn tệp">
            <button
              v-for="t in TABS"
              :key="t.id"
              type="button"
              role="tab"
              :aria-selected="tab === t.id"
              :class="['tab', t.id, { active: tab === t.id }]"
              @click="tab = t.id"
            >
              {{ t.label }}
            </button>
            <span class="spacer" />
            <label class="auto"><input v-model="autoRun" type="checkbox" /> Tự chạy</label>
            <button type="button" class="run" title="Ctrl + Enter" @click="run">▶ Chạy</button>
          </div>
          <div class="editors">
            <div
              v-for="t in TABS"
              v-show="tab === t.id"
              :key="t.id"
              :ref="(el) => (hosts[t.id] = (el as HTMLElement) || undefined)"
              class="editor-host"
              role="tabpanel"
            />
          </div>
          <div class="foot">
            <button type="button" @click="reset">↺ Làm lại từ đầu</button>
            <button type="button" @click="share">🔗 Chia sẻ</button>
            <button type="button" @click="download">⤓ Tải tệp .html</button>
          </div>
        </div>

        <div class="pane output-pane">
          <div class="pane-head">
            <span>Kết quả</span>
            <span v-if="mission && testing" class="testing">Đang chấm…</span>
          </div>
          <iframe
            :key="runKey"
            ref="previewFrame"
            class="preview"
            :sandbox="SANDBOX_ALLOW"
            title="Kết quả chạy code"
          />
          <div class="pane-head console-head">
            <span>Console</span>
            <button type="button" @click="lines = []">Xóa</button>
          </div>
          <ol class="console" aria-live="polite">
            <li v-for="(line, i) in lines" :key="i" :class="line.level">
              <pre>{{ line.text }}</pre>
              <span v-if="line.where" class="where">{{ line.where }}</span>
            </li>
            <li v-if="!lines.length" class="empty">console.log(...) sẽ hiện ở đây.</li>
          </ol>
        </div>
      </div>
    </section>

    <!-- iframe chấm bài: chạy cùng code nhưng ẩn, để thao tác của trình chấm không làm đổi phần Kết quả. -->
    <iframe
      v-if="mission"
      :key="'t' + testKey"
      ref="testFrame"
      class="test-frame"
      :sandbox="TEST_SANDBOX_ALLOW"
      title="Trình chấm bài"
      aria-hidden="true"
      tabindex="-1"
    />
  </div>
</template>

<style scoped>
.pg {
  display: grid;
  grid-template-columns: 260px minmax(0, 1fr);
  gap: 16px;
  max-width: 1600px;
  margin: 0 auto;
  padding: 24px 24px 32px;
}
@media (max-width: 960px) {
  .pg {
    grid-template-columns: minmax(0, 1fr);
    padding: 16px;
  }
}

/* ───── danh sách bài tập ───── */
.missions {
  align-self: start;
  position: sticky;
  top: calc(var(--vp-nav-height) + 16px);
  border: 1px solid var(--vp-c-divider);
  border-radius: 12px;
  background: var(--vp-c-bg-soft);
  overflow: hidden;
}
.list-toggle {
  display: none;
}
.list {
  padding: 14px 10px 10px;
  max-height: calc(100vh - var(--vp-nav-height) - 48px);
  overflow: auto;
}
.list-head {
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  padding: 0 6px;
  font-size: 13px;
}
.list-head span {
  color: var(--vp-c-text-2);
  font-size: 12px;
}
.bar {
  height: 5px;
  margin: 8px 6px 10px;
  border-radius: 999px;
  background: var(--vp-c-default-soft);
  overflow: hidden;
}
.bar > div {
  height: 100%;
  border-radius: inherit;
  background: linear-gradient(90deg, var(--vp-c-brand-3), var(--wb-c-accent));
  transition: width 0.4s ease;
}
.missions ul {
  list-style: none;
  margin: 0;
  padding: 0;
}
.missions li.group {
  margin: 12px 6px 4px;
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  color: var(--vp-c-text-3);
}
.missions li button {
  display: flex;
  align-items: center;
  gap: 10px;
  width: 100%;
  padding: 6px;
  border-radius: 8px;
  text-align: left;
  font-size: 13.5px;
  line-height: 1.35;
  color: var(--vp-c-text-1);
}
.missions li button:hover {
  background: var(--vp-c-default-soft);
}
.missions li button.active {
  background: var(--vp-c-brand-soft);
  color: var(--vp-c-brand-1);
  font-weight: 600;
}
.num {
  flex: none;
  display: inline-grid;
  place-items: center;
  width: 22px;
  height: 22px;
  border-radius: 50%;
  font-size: 11px;
  font-weight: 700;
  color: var(--vp-c-text-2);
  border: 1px solid var(--vp-c-divider);
}
button.done .num {
  color: #fff;
  border-color: var(--vp-c-green-2);
  background: var(--vp-c-green-2);
}
@media (max-width: 960px) {
  .missions {
    position: static;
  }
  .list-toggle {
    display: flex;
    justify-content: space-between;
    width: 100%;
    padding: 12px 14px;
    font-size: 14px;
    font-weight: 600;
  }
  .list {
    display: none;
    max-height: none;
    padding-top: 0;
  }
  .missions.open .list {
    display: block;
  }
  .list-head,
  .bar {
    display: none;
  }
}

/* ───── đề bài ───── */
.work {
  min-width: 0;
}
.task {
  padding: 16px 18px;
  margin-bottom: 14px;
  border: 1px solid var(--vp-c-divider);
  border-radius: 12px;
  background: var(--vp-c-bg-soft);
}
.task-head {
  display: flex;
  flex-wrap: wrap;
  align-items: baseline;
  gap: 4px 12px;
}
.task h2 {
  margin: 0;
  font-size: 19px;
  font-weight: 700;
  line-height: 1.4;
}
.tag {
  font-size: 12px;
  font-weight: 600;
  color: var(--vp-c-brand-1);
}
.brief,
.intro p {
  margin: 8px 0 0;
  font-size: 14px;
  line-height: 1.7;
}
.task :deep(code) {
  padding: 1px 5px;
  border-radius: 4px;
  font-size: 0.9em;
  font-family: var(--vp-font-family-mono);
  color: var(--vp-code-color);
  background: var(--vp-code-bg);
}
.tests {
  list-style: none;
  margin: 12px 0 0;
  padding: 0;
  display: grid;
  gap: 4px;
}
.tests li {
  display: flex;
  gap: 10px;
  font-size: 13.5px;
  line-height: 1.55;
}
.tests small {
  display: block;
  font-size: 12px;
  color: var(--vp-c-red-1);
}
.icon {
  flex: none;
  display: inline-grid;
  place-items: center;
  width: 20px;
  height: 20px;
  margin-top: 1px;
  border-radius: 50%;
  font-size: 11px;
  font-weight: 700;
  color: var(--vp-c-text-3);
  border: 1px solid var(--vp-c-divider);
}
.pass .icon {
  color: #fff;
  border-color: var(--vp-c-green-2);
  background: var(--vp-c-green-2);
}
.fail .icon {
  color: #fff;
  border-color: var(--vp-c-red-2);
  background: var(--vp-c-red-2);
}
.success {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 8px 14px;
  margin: 12px 0 0;
  padding: 10px 12px;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 600;
  background: var(--vp-c-green-soft);
}
.success button {
  padding: 4px 12px;
  border-radius: 8px;
  font-size: 13px;
  color: var(--vp-button-brand-text);
  background: var(--vp-button-brand-bg);
}
.task-actions {
  display: flex;
  flex-wrap: wrap;
  gap: 8px 16px;
  margin-top: 12px;
  font-size: 13px;
}
.task-actions button,
.task-actions a {
  font-weight: 500;
  color: var(--vp-c-brand-1);
  text-decoration: none;
}
.task-actions button:hover,
.task-actions a:hover {
  text-decoration: underline;
}
.hint {
  margin: 10px 0 0;
  padding: 10px 12px;
  border-radius: 8px;
  font-size: 13.5px;
  line-height: 1.7;
  background: var(--vp-c-yellow-soft);
}
.notice {
  margin: 0 0 12px;
  padding: 8px 12px;
  border-radius: 8px;
  font-size: 13px;
  background: var(--vp-c-brand-soft);
}
kbd {
  padding: 0 5px;
  border: 1px solid var(--vp-c-divider);
  border-bottom-width: 2px;
  border-radius: 4px;
  font-size: 12px;
  font-family: var(--vp-font-family-mono);
  background: var(--vp-c-bg);
}

/* ───── trình soạn & kết quả ───── */
.panes {
  display: grid;
  grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);
  gap: 14px;
}
@media (max-width: 1200px) {
  .panes {
    grid-template-columns: minmax(0, 1fr);
  }
}
.pane {
  display: flex;
  flex-direction: column;
  min-width: 0;
  border: 1px solid var(--vp-c-divider);
  border-radius: 12px;
  overflow: hidden;
  background: var(--vp-c-bg);
}
.tabs,
.pane-head,
.foot {
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 6px 8px;
  font-size: 13px;
  background: var(--vp-c-bg-soft);
}
.tabs {
  border-bottom: 1px solid var(--vp-c-divider);
}
.tab {
  padding: 4px 12px;
  border-radius: 6px;
  font-weight: 600;
  color: var(--vp-c-text-2);
}
.tab:hover {
  color: var(--vp-c-text-1);
  background: var(--vp-c-default-soft);
}
.tab.active {
  color: var(--vp-c-text-1);
  background: var(--vp-c-bg);
  box-shadow: inset 0 -2px 0 var(--tab-color);
}
.tab.html {
  --tab-color: var(--wb-c-html);
}
.tab.css {
  --tab-color: var(--wb-c-css);
}
.tab.js {
  --tab-color: var(--wb-c-js);
}
.spacer {
  flex: 1;
}
.auto {
  display: flex;
  align-items: center;
  gap: 4px;
  margin-right: 8px;
  color: var(--vp-c-text-2);
  cursor: pointer;
}
.auto input {
  accent-color: var(--vp-c-brand-3);
}
.run {
  padding: 4px 14px;
  border-radius: 8px;
  font-weight: 600;
  color: var(--vp-button-brand-text);
  background: var(--vp-button-brand-bg);
}
.run:hover {
  background: var(--vp-button-brand-hover-bg);
}
.editors {
  flex: 1;
  height: min(62vh, 560px);
  min-height: 320px;
}
.editor-host {
  height: 100%;
}
.foot {
  flex-wrap: wrap;
  gap: 4px 14px;
  border-top: 1px solid var(--vp-c-divider);
}
.foot button,
.pane-head button {
  font-size: 12.5px;
  color: var(--vp-c-text-2);
}
.foot button:hover,
.pane-head button:hover {
  color: var(--vp-c-brand-1);
}
.pane-head {
  justify-content: space-between;
  border-bottom: 1px solid var(--vp-c-divider);
  font-weight: 600;
  color: var(--vp-c-text-2);
}
.testing {
  font-weight: 500;
  color: var(--vp-c-brand-1);
}
.preview {
  display: block;
  width: 100%;
  height: min(42vh, 380px);
  min-height: 220px;
  border: 0;
  background: #fff;
  color-scheme: light;
}
.console-head {
  border-top: 1px solid var(--vp-c-divider);
}
.console {
  flex: 1;
  min-height: 120px;
  max-height: 260px;
  margin: 0;
  padding: 4px 0;
  overflow: auto;
  list-style: none;
  font-family: var(--vp-font-family-mono);
  font-size: 13px;
  line-height: 1.55;
  background: var(--vp-code-block-bg);
}
.console li {
  display: flex;
  justify-content: space-between;
  gap: 12px;
  padding: 2px 12px;
  border-bottom: 1px solid var(--vp-c-divider);
}
.console pre {
  margin: 0;
  white-space: pre-wrap;
  word-break: break-word;
  font: inherit;
  color: var(--vp-c-text-1);
}
.console li.error {
  background: var(--vp-c-red-soft);
}
.console li.error pre {
  color: var(--vp-c-red-1);
}
.console li.warn {
  background: var(--vp-c-yellow-soft);
}
.console li.warn pre {
  color: var(--vp-c-yellow-1);
}
.console li.info pre,
.console li.debug pre {
  color: var(--vp-c-text-2);
}
.console li.empty {
  border: 0;
  color: var(--vp-c-text-3);
  font-family: var(--vp-font-family-base);
}
.where {
  flex: none;
  font-size: 11px;
  color: var(--vp-c-text-3);
}
/* Nằm dưới mọi nội dung và trong suốt, nhưng vẫn "trên màn hình" để trình duyệt không hãm
   tốc độ hẹn giờ của iframe như với iframe bị ẩn hoặc nằm ngoài khung nhìn. */
.test-frame {
  position: fixed;
  top: 0;
  left: 0;
  z-index: -1;
  width: 800px;
  height: 600px;
  border: 0;
  opacity: 0;
  pointer-events: none;
}
</style>
