import { defineConfig, type DefaultTheme } from 'vitepress'
import { sections } from './theme/curriculum'
import { liveDemos, mermaidFence, taskLists } from './markdown'

// Khi deploy vào thư mục con (ví dụ GitHub Pages: /WebBasic/), đặt BASE_PATH=/WebBasic/
const base = process.env.BASE_PATH || '/'

/**
 * Id của tiêu đề, dùng cho link `#anchor`. Giống slugify mặc định của VitePress nhưng đổi `đ` thành
 * `d` và bỏ gạch dài `—`, `–`: "## 3. URL — địa chỉ" → `_3-url-dia-chi` thay vì `_3-url-—-đia-chi`.
 */
function slugify(text: string): string {
  return text
    .replace(/đ/g, 'd')
    .replace(/Đ/g, 'D')
    .normalize('NFKD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[\u0000-\u001f]/g, '')
    .replace(/[\s~`!@#$%^&*()\-_+=[\]{}|\\;:"'“”‘’<>,.?/—–]+/g, '-')
    .replace(/-{2,}/g, '-')
    .replace(/^-+|-+$/g, '')
    .replace(/^(\d)/, '_$1')
    .toLowerCase()
}

function buildSidebar(): DefaultTheme.SidebarItem[] {
  const levels = sections
    .filter((s) => s.id !== 'thuc-hanh')
    .map((s) => ({
      text: `${s.icon} ${s.label} · ${s.title}`,
      // Nhóm chứa trang đang xem sẽ tự mở ra.
      collapsed: true,
      items: s.lessons.map((l, i) => ({
        text: `${i + 1}. ${l.title}`,
        link: `/${s.id}/${l.slug}`,
      })),
    }))

  return [
    {
      text: '📍 Bắt đầu',
      items: [{ text: 'Giới thiệu & lộ trình', link: '/gioi-thieu' }],
    },
    ...levels,
    {
      text: '🚀 Thực hành',
      items: [
        { text: 'Dự án cuối khóa', link: '/thuc-hanh/du-an-cuoi-khoa' },
        { text: 'Code Playground', link: '/thuc-hanh/playground' },
      ],
    },
    {
      text: '📚 Tham khảo',
      collapsed: true,
      items: [
        { text: 'Cheat sheet HTML/CSS/JS', link: '/tham-khao/cheatsheet' },
        { text: 'Thuật ngữ', link: '/tham-khao/thuat-ngu' },
        { text: 'Tài nguyên học tiếp', link: '/tham-khao/tai-nguyen' },
      ],
    },
  ]
}

export default defineConfig({
  lang: 'vi-VN',
  title: 'WebBasic',
  titleTemplate: ':title · WebBasic',
  description:
    'Tự học HTML, CSS và JavaScript bằng tiếng Việt từ cơ bản đến nâng cao: ví dụ chạy ngay trong trang, bài tập tự chấm, quiz và code playground.',
  base,
  cleanUrls: true,
  head: [
    ['link', { rel: 'icon', type: 'image/svg+xml', href: `${base}logo.svg` }],
    ['meta', { name: 'theme-color', content: '#c2410c' }],
  ],

  vite: {
    // Các chunk lớn nhất là của Mermaid và CodeMirror, chỉ tải ở trang cần dùng.
    build: { chunkSizeWarningLimit: 800 },
    // Gom CodeMirror khi chạy dev để không có hai bản @codemirror/state cùng lúc.
    optimizeDeps: {
      include: [
        'codemirror',
        '@codemirror/state',
        '@codemirror/view',
        '@codemirror/language',
        '@codemirror/commands',
        '@codemirror/lang-html',
        '@codemirror/lang-css',
        '@codemirror/lang-javascript',
        '@codemirror/theme-one-dark',
      ],
    },
  },

  markdown: {
    anchor: { slugify },
    container: {
      tipLabel: 'Mẹo',
      infoLabel: 'Thông tin',
      noteLabel: 'Ghi chú',
      warningLabel: 'Lưu ý',
      dangerLabel: 'Cảnh báo',
      detailsLabel: 'Chi tiết',
      importantLabel: 'Quan trọng',
      cautionLabel: 'Thận trọng',
    },
    config(md) {
      md.use(mermaidFence)
      md.use(liveDemos)
      md.use(taskLists)
    },
  },

  themeConfig: {
    logo: '/logo.svg',
    nav: [
      { text: 'Lộ trình', link: '/gioi-thieu' },
      { text: 'HTML', link: '/html/web-hoat-dong-the-nao', activeMatch: '^/html/' },
      { text: 'CSS', link: '/css/nhap-mon-css', activeMatch: '^/css/' },
      { text: 'JavaScript', link: '/javascript/gioi-thieu-js', activeMatch: '^/javascript/' },
      { text: 'Nâng cao', link: '/nang-cao/scope-closure', activeMatch: '^/nang-cao/' },
      { text: 'Playground', link: '/thuc-hanh/playground' },
      {
        text: 'Tham khảo',
        activeMatch: '^/tham-khao/',
        items: [
          { text: 'Cheat sheet HTML/CSS/JS', link: '/tham-khao/cheatsheet' },
          { text: 'Thuật ngữ', link: '/tham-khao/thuat-ngu' },
          { text: 'Tài nguyên học tiếp', link: '/tham-khao/tai-nguyen' },
        ],
      },
    ],
    sidebar: buildSidebar(),
    outline: { level: [2, 3], label: 'Trong bài này' },
    docFooter: { prev: 'Bài trước', next: 'Bài tiếp theo' },
    darkModeSwitchLabel: 'Giao diện',
    lightModeSwitchTitle: 'Chuyển sang nền sáng',
    darkModeSwitchTitle: 'Chuyển sang nền tối',
    sidebarMenuLabel: 'Danh mục bài học',
    returnToTopLabel: 'Lên đầu trang',
    langMenuLabel: 'Ngôn ngữ',
    notFound: {
      title: 'KHÔNG TÌM THẤY TRANG',
      quote: '404 Not Found — trình duyệt đã tìm khắp nơi mà không thấy trang này.',
      linkLabel: 'Về trang chủ',
      linkText: 'Về trang chủ',
    },
    footer: {
      message:
        'Tài liệu phục vụ mục đích học tập. Nội dung đối chiếu với MDN Web Docs và các đặc tả của WHATWG, W3C, Ecma.',
      copyright: 'WebBasic — tự học HTML, CSS & JavaScript bằng tiếng Việt',
    },
    search: {
      provider: 'local',
      options: {
        miniSearch: {
          options: {
            // Cho phép gõ không dấu: "bien" vẫn tìm thấy "biến".
            processTerm: (term: string) =>
              term
                .toLowerCase()
                .normalize('NFD')
                .replace(/[̀-ͯ]/g, '')
                .replace(/đ/g, 'd'),
          },
        },
        translations: {
          button: { buttonText: 'Tìm kiếm', buttonAriaLabel: 'Tìm kiếm' },
          modal: {
            displayDetails: 'Hiện chi tiết',
            resetButtonTitle: 'Xóa từ khóa',
            backButtonTitle: 'Đóng',
            noResultsText: 'Không có kết quả cho',
            footer: {
              selectText: 'mở',
              selectKeyAriaLabel: 'enter',
              navigateText: 'di chuyển',
              navigateUpKeyAriaLabel: 'mũi tên lên',
              navigateDownKeyAriaLabel: 'mũi tên xuống',
              closeText: 'đóng',
              closeKeyAriaLabel: 'escape',
            },
          },
        },
      },
    },
  },
})
