import { isFullDocument, type SourceFiles } from './sandbox'

// Link chia sẻ của Playground có dạng /thuc-hanh/playground#code=<base64url>.
// Nội dung nằm sau dấu # nên không bao giờ được gửi lên server.

/** Mã hóa code ba tab thành chuỗi base64url (UTF-8, giữ được tiếng Việt). */
export function encodeShare(files: SourceFiles): string {
  const bytes = new TextEncoder().encode(JSON.stringify([files.html, files.css, files.js]))
  let binary = ''
  for (const b of bytes) binary += String.fromCharCode(b)
  return btoa(binary).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '')
}

export function decodeShare(value: string): SourceFiles | null {
  try {
    const binary = atob(value.replace(/-/g, '+').replace(/_/g, '/'))
    const bytes = Uint8Array.from(binary, (c) => c.charCodeAt(0))
    const data: unknown = JSON.parse(new TextDecoder().decode(bytes))
    if (!Array.isArray(data) || data.length !== 3 || !data.every((x) => typeof x === 'string')) {
      return null
    }
    return { html: data[0], css: data[1], js: data[2] }
  } catch {
    return null
  }
}

/** Bỏ phần thụt lề chung của mọi dòng (nội dung lấy ra từ trong thẻ <style>/<script>). */
function dedent(text: string): string {
  const lines = text.replace(/^\n+|\s+$/g, '').split('\n')
  const indents = lines.filter((l) => l.trim()).map((l) => /^ */.exec(l)![0].length)
  const cut = indents.length ? Math.min(...indents) : 0
  return lines.map((l) => l.slice(cut)).join('\n')
}

/**
 * Tách một đoạn HTML ví dụ thành ba tab: nội dung các thẻ <style> sang tab CSS, các thẻ <script>
 * thường (không có thuộc tính) sang tab JS. Tài liệu HTML đầy đủ được giữ nguyên trong tab HTML.
 */
export function splitSnippet(snippet: string): SourceFiles {
  if (isFullDocument(snippet)) return { html: snippet, css: '', js: '' }
  const css: string[] = []
  const js: string[] = []
  const html = snippet
    .replace(/<style>([\s\S]*?)<\/style>\s*/gi, (_, code: string) => {
      css.push(dedent(code))
      return ''
    })
    .replace(/<script>([\s\S]*?)<\/script>\s*/gi, (_, code: string) => {
      js.push(dedent(code))
      return ''
    })
  const join = (parts: string[]) => (parts.length ? parts.join('\n\n') + '\n' : '')
  return { html: html.trim() + '\n', css: join(css), js: join(js) }
}

/** Ghép ba tab thành một tệp .html chạy độc lập (để tải về máy). */
export function standaloneHtml(files: SourceFiles, title = 'Bài tập WebBasic'): string {
  const css = files.css.trim()
  const js = files.js.trim()
  if (isFullDocument(files.html)) {
    let doc = files.html
    if (css) {
      const style = `<style>\n${css}\n</style>\n`
      doc = /<\/head>/i.test(doc) ? doc.replace(/<\/head>/i, `${style}</head>`) : style + doc
    }
    if (js) {
      const script = `<script>\n${js}\n</script>\n`
      doc = /<\/body>/i.test(doc) ? doc.replace(/<\/body>/i, `${script}</body>`) : doc + '\n' + script
    }
    return doc
  }
  const indent = (text: string, pad: string) =>
    text
      .split('\n')
      .map((l) => (l ? pad + l : l))
      .join('\n')
  return [
    '<!DOCTYPE html>',
    '<html lang="vi">',
    '<head>',
    '  <meta charset="UTF-8">',
    '  <meta name="viewport" content="width=device-width, initial-scale=1.0">',
    `  <title>${title}</title>`,
    ...(css ? ['  <style>', indent(css, '    '), '  </style>'] : []),
    '</head>',
    '<body>',
    indent(files.html.trim(), '  '),
    ...(js ? ['  <script>', indent(js, '    '), '  </script>'] : []),
    '</body>',
    '</html>',
    '',
  ].join('\n')
}
