// Danh mục bài học — nguồn dữ liệu duy nhất cho sidebar, tiêu đề bài và theo dõi tiến độ.
// Thêm bài mới: tạo file docs/<section.id>/<slug>.md rồi khai báo ở đây.

export interface LessonDef {
  slug: string
  title: string
  minutes: number
}

export interface SectionDef {
  id: string
  label: string
  title: string
  icon: string
  summary: string
  lessons: LessonDef[]
}

export interface Lesson extends LessonDef {
  link: string
  index: number
  section: SectionDef
}

export const sections: SectionDef[] = [
  {
    id: 'html',
    label: 'Phần 1',
    title: 'HTML',
    icon: '🧱',
    summary:
      'Khung xương của mọi trang web: cấu trúc tài liệu, văn bản, liên kết, hình ảnh, bảng, form, HTML ngữ nghĩa và thẻ head.',
    lessons: [
      { slug: 'web-hoat-dong-the-nao', title: 'Web hoạt động thế nào?', minutes: 20 },
      { slug: 'trang-html-dau-tien', title: 'Trang HTML đầu tiên', minutes: 25 },
      { slug: 'van-ban-lien-ket-hinh-anh', title: 'Văn bản, liên kết & hình ảnh', minutes: 30 },
      { slug: 'danh-sach-bang', title: 'Danh sách & bảng', minutes: 25 },
      { slug: 'form', title: 'Form & các ô nhập liệu', minutes: 35 },
      { slug: 'html-ngu-nghia', title: 'HTML ngữ nghĩa & khả năng truy cập', minutes: 30 },
      { slug: 'head-media', title: 'Thẻ head, SEO & đa phương tiện', minutes: 30 },
    ],
  },
  {
    id: 'css',
    label: 'Phần 2',
    title: 'CSS',
    icon: '🎨',
    summary:
      'Trình bày và bố cục: selector, cascade, box model, chữ và màu, Flexbox, Grid, định vị, responsive, chuyển động và CSS hiện đại.',
    lessons: [
      { slug: 'nhap-mon-css', title: 'Nhập môn CSS', minutes: 25 },
      { slug: 'selector-cascade', title: 'Selector, cascade & độ ưu tiên', minutes: 35 },
      { slug: 'box-model', title: 'Box model & display', minutes: 30 },
      { slug: 'chu-mau-don-vi', title: 'Chữ, màu sắc & đơn vị', minutes: 30 },
      { slug: 'flexbox', title: 'Flexbox — bố cục một chiều', minutes: 35 },
      { slug: 'grid', title: 'CSS Grid — bố cục hai chiều', minutes: 40 },
      { slug: 'position', title: 'Định vị & lớp xếp chồng', minutes: 30 },
      { slug: 'responsive', title: 'Responsive: media query & container query', minutes: 35 },
      { slug: 'transition-animation', title: 'Transition, transform & animation', minutes: 30 },
      { slug: 'css-hien-dai', title: 'Biến CSS, nesting & tổ chức code', minutes: 35 },
    ],
  },
  {
    id: 'javascript',
    label: 'Phần 3',
    title: 'JavaScript',
    icon: '⚡',
    summary:
      'Lập trình cho trang web: biến, kiểu dữ liệu, điều kiện, vòng lặp, hàm, mảng, object, chuỗi và ngày giờ, DOM và sự kiện.',
    lessons: [
      { slug: 'gioi-thieu-js', title: 'JavaScript là gì? Chạy code đầu tiên', minutes: 20 },
      { slug: 'bien-kieu-du-lieu', title: 'Biến, kiểu dữ liệu & toán tử', minutes: 35 },
      { slug: 'dieu-kien-vong-lap', title: 'Điều kiện & vòng lặp', minutes: 30 },
      { slug: 'ham', title: 'Hàm (function)', minutes: 35 },
      { slug: 'mang', title: 'Mảng & các phương thức xử lý', minutes: 35 },
      { slug: 'object-json', title: 'Object, JSON, Map & Set', minutes: 35 },
      { slug: 'chuoi-so-ngay', title: 'Chuỗi, số & ngày giờ', minutes: 30 },
      { slug: 'dom', title: 'DOM — đọc và thay đổi trang', minutes: 35 },
      { slug: 'su-kien', title: 'Sự kiện & tương tác người dùng', minutes: 35 },
    ],
  },
  {
    id: 'nang-cao',
    label: 'Phần 4',
    title: 'Nâng cao',
    icon: '🧠',
    summary:
      'JavaScript chuyên sâu và web hiện đại: closure, class, bất đồng bộ, gọi API, module và công cụ, xử lý lỗi, hiệu năng, bảo mật, Web Components.',
    lessons: [
      { slug: 'scope-closure', title: 'Scope, hoisting & closure', minutes: 30 },
      { slug: 'class-prototype', title: 'this, prototype & class', minutes: 40 },
      { slug: 'bat-dong-bo', title: 'Bất đồng bộ: event loop, Promise, async/await', minutes: 40 },
      { slug: 'fetch-api', title: 'Gọi API với fetch', minutes: 35 },
      { slug: 'module-cong-cu', title: 'Module, npm & Vite', minutes: 35 },
      { slug: 'xu-ly-loi-debug', title: 'Xử lý lỗi & debug', minutes: 30 },
      { slug: 'hieu-nang', title: 'Hiệu năng web', minutes: 35 },
      { slug: 'bao-mat-a11y', title: 'Bảo mật & accessibility chuyên sâu', minutes: 35 },
      { slug: 'web-components', title: 'Web Components & API trình duyệt hiện đại', minutes: 35 },
    ],
  },
  {
    id: 'thuc-hanh',
    label: 'Tổng kết',
    title: 'Dự án',
    icon: '🚀',
    summary: 'Ghép mọi thứ lại: tự tay xây một ứng dụng web hoàn chỉnh chỉ với HTML, CSS và JavaScript.',
    lessons: [{ slug: 'du-an-cuoi-khoa', title: 'Dự án cuối khóa: Sổ chi tiêu', minutes: 150 }],
  },
]

export const lessons: Lesson[] = sections.flatMap((section) =>
  section.lessons.map((def, i) => ({
    ...def,
    link: `/${section.id}/${def.slug}`,
    index: i + 1,
    section,
  })),
)

/** Tìm bài học theo `page.relativePath` của VitePress, ví dụ `css/grid.md`. */
export function findLesson(relativePath: string): Lesson | undefined {
  const link = '/' + relativePath.replace(/\.md$/, '')
  return lessons.find((l) => l.link === link)
}

export const totalMinutes = lessons.reduce((sum, l) => sum + l.minutes, 0)
