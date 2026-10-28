import { javascriptLanguage } from '@codemirror/lang-javascript'

const LOOPS = new Set(['ForStatement', 'WhileStatement', 'DoStatement'])
const GUARD = '__wbLoop();'

/**
 * Chèn `__wbLoop();` vào đầu thân mỗi vòng lặp trong tab JS. Hàm này (định nghĩa trong runtime)
 * ném lỗi khi một vòng lặp chạy liền quá 2 giây, nên vòng lặp vô hạn không làm treo Playground.
 * Chỉ chèn trên cùng dòng (không thêm xuống dòng) để số dòng báo lỗi vẫn đúng. Code có lỗi cú
 * pháp được giữ nguyên: trình duyệt sẽ báo SyntaxError và không chạy dòng nào.
 */
export function guardLoops(code: string): string {
  const tree = javascriptLanguage.parser.parse(code)
  const edits: { at: number; text: string }[] = []
  let broken = false
  tree.iterate({
    enter(node) {
      if (node.type.isError) broken = true
      if (broken) return false
      if (!LOOPS.has(node.name)) return
      // for/while: thân là con cuối; do…while: thân đứng ngay sau từ khóa `do`.
      const body = node.name === 'DoStatement' ? node.node.firstChild?.nextSibling : node.node.lastChild
      if (!body) return
      if (body.name === 'Block') {
        edits.push({ at: body.from + 1, text: GUARD })
      } else {
        edits.push({ at: body.from, text: '{' + GUARD }, { at: body.to, text: '}' })
      }
    },
  })
  if (broken || !edits.length) return code
  let out = code
  for (const edit of edits.sort((a, b) => b.at - a.at)) {
    out = out.slice(0, edit.at) + edit.text + out.slice(edit.at)
  }
  return out
}
