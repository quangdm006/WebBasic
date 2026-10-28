<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, onMounted, ref } from 'vue'
import { withBase } from 'vitepress'
import { SANDBOX_ALLOW, Sandbox, type ConsoleLine, type SourceFiles } from '../sandbox/sandbox'
import { encodeShare, splitSnippet } from '../sandbox/share'

// Sinh ra từ khối ```html live (xem kết quả ngay) và ```js run (bấm để chạy, xem console)
// bởi plugin trong .vitepress/markdown.ts. `code` được mã hóa bằng encodeURIComponent.
const props = defineProps<{ code: string; kind: 'html' | 'js'; height?: string }>()

const MAX_LINES = 300
const source = computed(() => decodeURIComponent(props.code))
const files = computed<SourceFiles>(() =>
  props.kind === 'js'
    ? { html: '', css: '', js: source.value }
    : { html: source.value, css: '', js: '' },
)
const playgroundHref = computed(
  () =>
    withBase('/thuc-hanh/playground') +
    '#code=' +
    encodeShare(props.kind === 'js' ? files.value : splitSnippet(source.value)),
)

const root = ref<HTMLElement>()
const frame = ref<HTMLIFrameElement>()
const runs = ref(0)
const lines = ref<ConsoleLine[]>([])
const fixedHeight = props.height ? Number(props.height) : 0
const frameHeight = ref(fixedHeight || 150)

let observer: IntersectionObserver | undefined
let sandbox: Sandbox | undefined
// Giữ localStorage giả lập giữa các lần "Chạy lại", giống như tải lại trang thật.
const storage = { local: {} as Record<string, string>, session: {} as Record<string, string> }

function push(line: ConsoleLine) {
  if (lines.value.length < MAX_LINES) lines.value.push(line)
  else if (lines.value.length === MAX_LINES)
    lines.value.push({ level: 'warn', text: `… đã ẩn bớt, chỉ hiện ${MAX_LINES} dòng đầu.` })
}

async function run() {
  sandbox ??= new Sandbox({
    console: push,
    clear: () => (lines.value = []),
    height: (h) => {
      if (!fixedHeight) frameHeight.value = Math.min(Math.max(h, 40), 640)
    },
    storage: (area, data) => (storage[area] = data),
  })
  lines.value = []
  runs.value++ // đổi :key → iframe mới cho mỗi lần chạy
  await nextTick()
  if (frame.value) sandbox.run(frame.value, files.value, { autoHeight: props.kind === 'html' && !fixedHeight, storage })
}

onMounted(() => {
  if (props.kind !== 'html') return
  // Chỉ dựng iframe khi ví dụ sắp cuộn tới (hoặc khi khối "Xem lời giải" được mở ra).
  observer = new IntersectionObserver(
    (entries) => {
      if (entries.some((e) => e.isIntersecting)) {
        observer?.disconnect()
        run()
      }
    },
    { rootMargin: '300px 0px' },
  )
  if (root.value) observer.observe(root.value)
})

onBeforeUnmount(() => {
  observer?.disconnect()
  sandbox?.dispose()
})
</script>

<template>
  <div ref="root" class="live-demo" :class="kind">
    <div class="bar">
      <span class="label">{{ kind === 'html' ? 'Kết quả' : 'Console' }}</span>
      <span class="actions">
        <button type="button" class="run" @click="run">
          {{ kind === 'js' && !runs ? '▶ Chạy' : '↻ Chạy lại' }}
        </button>
        <a class="open" :href="playgroundHref" target="_blank" rel="noopener">✎ Sửa trong Playground</a>
      </span>
    </div>

    <template v-if="kind === 'html'">
      <iframe
        v-if="runs"
        :key="runs"
        ref="frame"
        class="preview"
        :style="{ height: frameHeight + 'px' }"
        :sandbox="SANDBOX_ALLOW"
        title="Kết quả của ví dụ"
      />
      <div v-else class="preview placeholder" :style="{ height: frameHeight + 'px' }" />
    </template>
    <iframe
      v-else-if="runs"
      :key="runs"
      ref="frame"
      class="hidden-frame"
      :sandbox="SANDBOX_ALLOW"
      title="Môi trường chạy ví dụ"
      aria-hidden="true"
      tabindex="-1"
    />

    <ol v-if="lines.length" class="console" aria-live="polite">
      <li v-for="(line, i) in lines" :key="i" :class="line.level">
        <pre>{{ line.text }}</pre>
        <span v-if="line.where" class="where">{{ line.where }}</span>
      </li>
    </ol>
    <p v-else-if="kind === 'js'" class="console empty">
      {{ runs ? 'Chưa có gì được in ra console.' : 'Bấm ▶ Chạy để xem kết quả in ra console.' }}
    </p>
  </div>
</template>

<style scoped>
.live-demo {
  position: relative;
  border: 1px solid var(--vp-c-divider);
  border-top: 0;
  border-radius: 0 0 8px 8px;
  background: var(--vp-c-bg);
  overflow: hidden;
}
.bar {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: 6px 12px;
  padding: 6px 12px;
  font-size: 12px;
  border-bottom: 1px solid var(--vp-c-divider);
  background: var(--vp-c-bg-soft);
}
.label {
  font-weight: 600;
  color: var(--vp-c-text-2);
  text-transform: uppercase;
  letter-spacing: 0.04em;
}
.actions {
  display: flex;
  gap: 12px;
  align-items: center;
}
.run {
  padding: 2px 10px;
  border-radius: 6px;
  font-weight: 600;
  color: var(--vp-button-brand-text);
  background: var(--vp-button-brand-bg);
}
.run:hover {
  background: var(--vp-button-brand-hover-bg);
}
.open {
  font-weight: 500;
  color: var(--vp-c-brand-1);
  text-decoration: none;
}
.open:hover {
  text-decoration: underline;
}
.preview {
  display: block;
  width: 100%;
  border: 0;
  /* Kết quả luôn nền trắng như một trang web thật, kể cả khi site đang ở giao diện tối. */
  background: #fff;
  color-scheme: light;
}
.placeholder {
  background: repeating-linear-gradient(45deg, transparent 0 10px, var(--vp-c-default-soft) 10px 20px);
}
.hidden-frame {
  position: absolute;
  width: 1px;
  height: 1px;
  border: 0;
  opacity: 0;
  pointer-events: none;
}
.console {
  max-height: 320px;
  margin: 0;
  padding: 4px 0;
  overflow: auto;
  list-style: none;
  font-family: var(--vp-font-family-mono);
  font-size: 13px;
  line-height: 1.55;
  border-top: 1px solid var(--vp-c-divider);
  background: var(--vp-code-block-bg);
}
.preview + .console {
  border-top: 1px solid var(--vp-c-divider);
}
.console li {
  display: flex;
  justify-content: space-between;
  gap: 12px;
  margin: 0;
  padding: 2px 12px;
  border-bottom: 1px solid var(--vp-c-divider);
}
.console li:last-child {
  border-bottom: 0;
}
.console pre {
  margin: 0;
  padding: 0;
  white-space: pre-wrap;
  word-break: break-word;
  background: transparent;
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
.where {
  flex: none;
  font-size: 11px;
  color: var(--vp-c-text-3);
}
.console.empty {
  padding: 10px 12px;
  font-family: inherit;
  font-size: 13px;
  color: var(--vp-c-text-3);
}
</style>
