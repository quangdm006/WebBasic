import { basicSetup } from 'codemirror'
import { EditorView, keymap } from '@codemirror/view'
import { Compartment, EditorState, Prec, type Extension } from '@codemirror/state'
import { indentWithTab } from '@codemirror/commands'
import { defaultHighlightStyle, syntaxHighlighting } from '@codemirror/language'
import { html } from '@codemirror/lang-html'
import { css } from '@codemirror/lang-css'
import { javascript } from '@codemirror/lang-javascript'
import { oneDarkHighlightStyle } from '@codemirror/theme-one-dark'

export type Tab = 'html' | 'css' | 'js'

const LANGUAGES: Record<Tab, () => Extension> = {
  html: () => html(),
  css: () => css(),
  js: () => javascript(),
}

// Màu nền, chữ, lề... lấy từ biến CSS của VitePress để trình soạn hợp với giao diện sáng/tối.
const baseTheme = EditorView.theme({
  '&': {
    height: '100%',
    fontSize: '13.5px',
    color: 'var(--vp-c-text-1)',
    backgroundColor: 'var(--vp-code-block-bg)',
  },
  '.cm-scroller': { fontFamily: 'var(--vp-font-family-mono)', lineHeight: '1.65' },
  '.cm-gutters': { backgroundColor: 'transparent', color: 'var(--vp-c-text-3)', border: 'none' },
  '.cm-activeLineGutter': { backgroundColor: 'transparent', color: 'var(--vp-c-text-1)' },
  '.cm-activeLine': { backgroundColor: 'var(--vp-c-default-soft)' },
  '&.cm-focused': { outline: 'none' },
  '.cm-cursor, .cm-dropCursor': { borderLeftColor: 'var(--vp-c-text-1)' },
  '&.cm-focused > .cm-scroller > .cm-selectionLayer .cm-selectionBackground, .cm-selectionBackground, .cm-content ::selection':
    { backgroundColor: 'var(--wb-editor-selection)' },
})

const themeFor = (dark: boolean): Extension => [
  EditorView.theme({}, { dark }),
  syntaxHighlighting(dark ? oneDarkHighlightStyle : defaultHighlightStyle),
]

export interface EditorHandle {
  setDoc(text: string): void
  setDark(dark: boolean): void
  focus(): void
  destroy(): void
}

export function createEditor(
  parent: HTMLElement,
  opts: { tab: Tab; doc: string; dark: boolean; onChange(text: string): void; onRun(): void },
): EditorHandle {
  const theme = new Compartment()
  const run = () => {
    opts.onRun()
    return true
  }
  const view = new EditorView({
    parent,
    state: EditorState.create({
      doc: opts.doc,
      extensions: [
        basicSetup,
        LANGUAGES[opts.tab](),
        Prec.highest(keymap.of([{ key: 'Mod-Enter', run }, { key: 'Mod-s', run, preventDefault: true }])),
        keymap.of([indentWithTab]),
        EditorState.tabSize.of(2),
        baseTheme,
        theme.of(themeFor(opts.dark)),
        EditorView.contentAttributes.of({ 'aria-label': `Trình soạn ${opts.tab.toUpperCase()}` }),
        EditorView.updateListener.of((u) => {
          if (u.docChanged) opts.onChange(u.state.doc.toString())
        }),
      ],
    }),
  })
  return {
    setDoc(text) {
      if (text === view.state.doc.toString()) return
      view.dispatch({ changes: { from: 0, to: view.state.doc.length, insert: text } })
    },
    setDark(dark) {
      view.dispatch({ effects: theme.reconfigure(themeFor(dark)) })
    },
    focus: () => view.focus(),
    destroy: () => view.destroy(),
  }
}
