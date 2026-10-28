import type { SourceFiles } from '../sandbox/sandbox'

// Bài tập tự chấm của Code Playground.
//
// Mỗi bài kiểm tra (`tests[].code`) là THÂN một hàm async, chạy bên trong iframe chấm bài sau khi
// trang đã tải xong. Trả về `true` là đạt; trả về chuỗi thì chuỗi đó hiện ra làm gợi ý; ném lỗi
// hoặc trả giá trị khác là chưa đạt. Các bài chạy lần lượt và dùng chung trạng thái trang, nên bài
// sau có thể dựa vào kết quả của bài trước (ví dụ bấm nút ba lần rồi mới kiểm tra).
//
// Hàm hỗ trợ có sẵn (định nghĩa trong sandbox/runtime.ts):
//   $(sel), $$(sel)   querySelector / querySelectorAll (trả về mảng)
//   css(el, prop)     giá trị computed style; `el` là phần tử hoặc selector
//   text(el)          textContent đã gộp khoảng trắng
//   sleep(ms)         chờ
//   resize(width)     đổi bề rộng iframe (để thử media query)
//   logs              mảng các dòng đã in ra console
//
// Biến khai báo ở cấp cao nhất của tab JS (kể cả let/const) đọc được trực tiếp, vì code chạy
// trong <script> thường chứ không phải module.

export interface MissionTest {
  name: string
  code: string
}

export interface Mission {
  id: string
  group: 'HTML' | 'CSS' | 'JavaScript'
  title: string
  /** Đề bài; hỗ trợ `code` và **đậm**. */
  brief: string
  hint: string
  /** Bài học liên quan. */
  lesson: string
  starter: SourceFiles
  solution: SourceFiles
  /** JS dựng sẵn, chạy trước code của người học (cả khi xem trước lẫn khi chấm). */
  setup?: string
  tests: MissionTest[]
}

const EMPTY = { html: '', css: '', js: '' }

const GRID_HTML = `<div class="grid">
  <div class="item">1</div>
  <div class="item">2</div>
  <div class="item">3</div>
  <div class="item">4</div>
  <div class="item">5</div>
  <div class="item">6</div>
</div>
`

const ITEM_CSS = `.item {
  padding: 24px;
  border-radius: 8px;
  background: #ede9fe;
  font: 600 20px system-ui, sans-serif;
  text-align: center;
}
`

const columns = "css('.grid', 'grid-template-columns').split(' ').length"

export const MISSIONS: Mission[] = [
  // ───────────────────────────── HTML ─────────────────────────────
  {
    id: 'html-trang-dau-tien',
    group: 'HTML',
    title: 'Trang đầu tiên',
    lesson: '/html/trang-html-dau-tien',
    brief:
      'Tạo một tiêu đề `<h1>` với nội dung **Xin chào Web** và một đoạn văn `<p>` giới thiệu về bạn.',
    hint: 'Thẻ mở và thẻ đóng bao lấy nội dung: `<h1>Xin chào Web</h1>`. Đoạn văn viết trong `<p>…</p>`.',
    starter: { ...EMPTY, html: '<!-- Viết HTML của bạn ở đây -->\n' },
    solution: {
      ...EMPTY,
      html: '<h1>Xin chào Web</h1>\n<p>Mình là Lan, mình đang học làm web.</p>\n',
    },
    tests: [
      { name: 'Có đúng một thẻ `<h1>`', code: "return $$('h1').length === 1" },
      { name: 'Nội dung `<h1>` là “Xin chào Web”', code: "return text('h1') === 'Xin chào Web'" },
      { name: 'Có đoạn văn `<p>` chứa chữ', code: "return $$('p').some((p) => text(p).length > 0)" },
    ],
  },
  {
    id: 'html-lien-ket-hinh-anh',
    group: 'HTML',
    title: 'Liên kết & hình ảnh',
    lesson: '/html/van-ban-lien-ket-hinh-anh',
    brief:
      'Tạo liên kết tới `https://developer.mozilla.org` **mở trong tab mới** và có `rel="noopener"`. Thêm một ảnh `<img>` có `src` và văn bản thay thế `alt` mô tả nội dung ảnh.',
    hint: '`<a href="https://developer.mozilla.org" target="_blank" rel="noopener">MDN</a>`. Ảnh: `<img src="https://picsum.photos/320/200" alt="Mô tả ảnh">`.',
    starter: { ...EMPTY, html: '<h1>Tài liệu học web</h1>\n\n<!-- Thêm liên kết và hình ảnh bên dưới -->\n' },
    solution: {
      ...EMPTY,
      html: `<h1>Tài liệu học web</h1>
<p>
  Tra cứu HTML, CSS và JavaScript tại
  <a href="https://developer.mozilla.org" target="_blank" rel="noopener">MDN Web Docs</a>.
</p>
<img src="https://picsum.photos/320/200" alt="Bàn làm việc có laptop đang mở trình soạn code" width="320" height="200">
`,
    },
    tests: [
      {
        name: 'Có liên kết tới developer.mozilla.org',
        code: "return $$('a').some((a) => a.hostname === 'developer.mozilla.org')",
      },
      {
        name: 'Liên kết mở tab mới (`target="_blank"`)',
        code: "const a = $$('a').find((a) => a.hostname === 'developer.mozilla.org'); return !!a && a.target === '_blank'",
      },
      {
        name: 'Liên kết có `rel="noopener"`',
        code: "const a = $$('a').find((a) => a.hostname === 'developer.mozilla.org'); return !!a && a.relList.contains('noopener')",
      },
      { name: 'Có ảnh `<img>` với thuộc tính `src`', code: "return $$('img').some((img) => img.getAttribute('src'))" },
      {
        name: 'Mọi ảnh đều có `alt` mô tả (không để trống)',
        code: "const imgs = $$('img'); return imgs.length > 0 && imgs.every((img) => (img.getAttribute('alt') || '').trim().length > 0)",
      },
    ],
  },
  {
    id: 'html-danh-sach-bang',
    group: 'HTML',
    title: 'Danh sách & bảng',
    lesson: '/html/danh-sach-bang',
    brief:
      'Tạo danh sách **không thứ tự** gồm ít nhất 3 món ăn. Sau đó tạo bảng có `<caption>`, hàng tiêu đề dùng `<th>` đặt trong `<thead>` và ít nhất 2 hàng dữ liệu trong `<tbody>`.',
    hint: 'Danh sách: `<ul><li>…</li></ul>`. Bảng: `<table>` → `<caption>` → `<thead><tr><th>…` → `<tbody><tr><td>…`.',
    starter: { ...EMPTY, html: '<h2>Món ăn yêu thích</h2>\n\n<h2>Thời khóa biểu</h2>\n' },
    solution: {
      ...EMPTY,
      html: `<h2>Món ăn yêu thích</h2>
<ul>
  <li>Phở bò</li>
  <li>Bún chả</li>
  <li>Bánh mì</li>
</ul>

<h2>Thời khóa biểu</h2>
<table>
  <caption>Lịch học tuần này</caption>
  <thead>
    <tr>
      <th scope="col">Thứ</th>
      <th scope="col">Môn</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>Thứ Hai</td>
      <td>HTML</td>
    </tr>
    <tr>
      <td>Thứ Tư</td>
      <td>CSS</td>
    </tr>
  </tbody>
</table>
`,
    },
    tests: [
      {
        name: 'Có `<ul>` với ít nhất 3 mục `<li>`',
        code: "return $$('ul').some((ul) => ul.querySelectorAll(':scope > li').length >= 3)",
      },
      { name: 'Bảng có `<caption>`', code: "return text('table > caption').length > 0" },
      { name: 'Hàng tiêu đề dùng `<th>` nằm trong `<thead>`', code: "return $$('table > thead th').length >= 2" },
      { name: 'Có ít nhất 2 hàng dữ liệu trong `<tbody>`', code: "return $$('table > tbody > tr').length >= 2" },
    ],
  },
  {
    id: 'html-form',
    group: 'HTML',
    title: 'Form đăng ký',
    lesson: '/html/form',
    brief:
      'Hoàn thiện form: ô **email** bắt buộc (`type="email"`, `required`), ô **mật khẩu** tối thiểu 8 ký tự (`minlength`), mỗi ô có `<label>` gắn đúng và có `name`, cuối form là nút gửi.',
    hint: 'Gắn label bằng `for` trùng với `id` của ô nhập: `<label for="email">Email</label> <input id="email" name="email" type="email" required>`.',
    starter: {
      ...EMPTY,
      html: '<h1>Đăng ký tài khoản</h1>\n<form>\n  <!-- Thêm các ô nhập ở đây -->\n</form>\n',
    },
    solution: {
      ...EMPTY,
      html: `<h1>Đăng ký tài khoản</h1>
<form>
  <p>
    <label for="email">Email</label>
    <input id="email" name="email" type="email" required autocomplete="email">
  </p>
  <p>
    <label for="mat-khau">Mật khẩu</label>
    <input id="mat-khau" name="matKhau" type="password" minlength="8" required autocomplete="new-password">
  </p>
  <button type="submit">Đăng ký</button>
</form>
`,
    },
    tests: [
      {
        name: 'Ô email có `type="email"` và `required`',
        code: "const i = $('form input[type=email]'); return !!i && i.required",
      },
      {
        name: 'Ô email có `<label>` gắn với nó',
        code: "const i = $('form input[type=email]'); return !!i && i.labels.length > 0 && text(i.labels[0]).length > 0",
      },
      {
        name: 'Ô mật khẩu có `minlength` từ 8 trở lên',
        code: "const p = $('form input[type=password]'); return !!p && p.minLength >= 8",
      },
      {
        name: 'Ô mật khẩu cũng có `<label>`',
        code: "const p = $('form input[type=password]'); return !!p && p.labels.length > 0",
      },
      {
        name: 'Mọi ô nhập đều có `name` (để dữ liệu được gửi đi)',
        code: "const inputs = $$('form input'); return inputs.length >= 2 && inputs.every((i) => i.name)",
      },
      {
        name: 'Có nút gửi form',
        code: "return !!$('form button:not([type]), form button[type=submit], form input[type=submit]')",
      },
    ],
  },
  {
    id: 'html-ngu-nghia',
    group: 'HTML',
    title: 'Bố cục ngữ nghĩa',
    lesson: '/html/html-ngu-nghia',
    brief:
      'Trang blog dưới đây toàn `<div>`. Hãy thay bằng thẻ ngữ nghĩa: `<header>` chứa `<nav>`, đúng một `<main>`, bài viết là `<article>` với tiêu đề `<h1>`, và `<footer>`. Xong thì trang không còn `<div>` nào.',
    hint: '`<div class="header">` → `<header>`, `<div class="menu">` → `<nav>`, `<div class="content">` → `<main>`, `<div class="post">` → `<article>`, `<div class="title">` → `<h1>`.',
    starter: {
      ...EMPTY,
      html: `<div class="header">
  <a class="logo" href="#">Blog của Lan</a>
  <div class="menu">
    <a href="#">Trang chủ</a>
    <a href="#">Bài viết</a>
    <a href="#">Giới thiệu</a>
  </div>
</div>

<div class="content">
  <div class="post">
    <div class="title">Học HTML trong 7 ngày</div>
    <p>Tuần này mình học về thẻ ngữ nghĩa và thấy code dễ đọc hơn hẳn.</p>
  </div>
</div>

<div class="footer">© 2026 Lan</div>
`,
    },
    solution: {
      ...EMPTY,
      html: `<header class="header">
  <a class="logo" href="#">Blog của Lan</a>
  <nav class="menu">
    <a href="#">Trang chủ</a>
    <a href="#">Bài viết</a>
    <a href="#">Giới thiệu</a>
  </nav>
</header>

<main class="content">
  <article class="post">
    <h1 class="title">Học HTML trong 7 ngày</h1>
    <p>Tuần này mình học về thẻ ngữ nghĩa và thấy code dễ đọc hơn hẳn.</p>
  </article>
</main>

<footer class="footer">© 2026 Lan</footer>
`,
    },
    tests: [
      { name: '`<header>` chứa `<nav>` với 3 liên kết', code: "return $$('header nav a').length >= 3" },
      { name: 'Có đúng một `<main>`', code: "return $$('main').length === 1" },
      { name: 'Bài viết là `<article>` nằm trong `<main>`', code: "return !!$('main article')" },
      {
        name: 'Tiêu đề bài viết là `<h1>` trong `<article>`',
        code: "return text('article h1') === 'Học HTML trong 7 ngày'",
      },
      { name: 'Có `<footer>`', code: "return !!$('footer')" },
      { name: 'Không còn thẻ `<div>` nào', code: "return $$('div').length === 0" },
    ],
  },

  // ───────────────────────────── CSS ─────────────────────────────
  {
    id: 'css-mau-chu',
    group: 'CSS',
    title: 'Màu sắc & chữ',
    lesson: '/css/chu-mau-don-vi',
    brief:
      'Định dạng trang: `body` dùng font `system-ui, sans-serif`; `h1` có màu `#c2410c`; đoạn `.lead` cỡ chữ `20px` và `line-height: 1.6`. Các đoạn văn khác giữ nguyên cỡ chữ.',
    hint: 'Ba rule: `body { font-family: … }`, `h1 { color: … }` và `.lead { font-size: …; line-height: … }`.',
    starter: {
      html: `<h1>WebBasic</h1>
<p class="lead">Học HTML, CSS và JavaScript từ con số 0.</p>
<p>Mỗi bài học có ví dụ chạy được ngay và bài tập tự chấm.</p>
`,
      css: '/* Viết CSS ở đây */\n',
      js: '',
    },
    solution: {
      html: `<h1>WebBasic</h1>
<p class="lead">Học HTML, CSS và JavaScript từ con số 0.</p>
<p>Mỗi bài học có ví dụ chạy được ngay và bài tập tự chấm.</p>
`,
      css: `body {
  font-family: system-ui, sans-serif;
}

h1 {
  color: #c2410c;
}

.lead {
  font-size: 20px;
  line-height: 1.6;
}
`,
      js: '',
    },
    tests: [
      { name: '`body` dùng font không chân (sans-serif)', code: "return /sans-serif/.test(css(document.body, 'font-family'))" },
      { name: '`h1` có màu `#c2410c`', code: "return css('h1', 'color') === 'rgb(194, 65, 12)'" },
      { name: '`.lead` có cỡ chữ 20px', code: "return css('.lead', 'font-size') === '20px'" },
      {
        name: '`.lead` có `line-height: 1.6`',
        code: "return Math.abs(parseFloat(css('.lead', 'line-height')) - 32) < 0.5",
      },
      { name: 'Đoạn văn thường vẫn cỡ chữ 16px', code: "return css('p:not(.lead)', 'font-size') === '16px'" },
    ],
  },
  {
    id: 'css-box-model',
    group: 'CSS',
    title: 'Box model: thẻ card',
    lesson: '/css/box-model',
    brief:
      'Biến `.card` thành một thẻ gọn gàng: rộng **đúng 300px kể cả padding và viền** (`box-sizing: border-box`), padding `16px`, viền `1px solid #ddd`, bo góc `8px`.',
    hint: 'Mặc định `width` chỉ tính phần nội dung. `box-sizing: border-box` làm `width` bao gồm cả padding và border.',
    starter: {
      html: '<div class="card">\n  <h2>Khóa học HTML</h2>\n  <p>7 bài · khoảng 3 giờ</p>\n</div>\n',
      css: '.card {\n  width: 300px;\n}\n',
      js: '',
    },
    solution: {
      html: '<div class="card">\n  <h2>Khóa học HTML</h2>\n  <p>7 bài · khoảng 3 giờ</p>\n</div>\n',
      css: `.card {
  box-sizing: border-box;
  width: 300px;
  padding: 16px;
  border: 1px solid #ddd;
  border-radius: 8px;
}
`,
      js: '',
    },
    tests: [
      { name: '`box-sizing: border-box`', code: "return css('.card', 'box-sizing') === 'border-box'" },
      {
        name: 'Bề rộng hiển thị đúng 300px',
        code: "return Math.round($('.card').getBoundingClientRect().width) === 300",
      },
      {
        name: 'Padding 16px cả bốn phía',
        code: "return ['top', 'right', 'bottom', 'left'].every((s) => css('.card', 'padding-' + s) === '16px')",
      },
      {
        name: 'Viền `1px solid` cả bốn phía',
        code: "return ['top', 'right', 'bottom', 'left'].every((s) => css('.card', 'border-' + s + '-width') === '1px' && css('.card', 'border-' + s + '-style') === 'solid')",
      },
      {
        name: 'Bo góc 8px',
        code: "return css('.card', 'border-top-left-radius') === '8px' && css('.card', 'border-bottom-right-radius') === '8px'",
      },
    ],
  },
  {
    id: 'css-flex-can-giua',
    group: 'CSS',
    title: 'Căn giữa với Flexbox',
    lesson: '/css/flexbox',
    brief: 'Đặt `.box` vào **chính giữa** `.hero` theo cả chiều ngang lẫn chiều dọc bằng Flexbox.',
    hint: 'Trên `.hero`: `display: flex`, `justify-content` căn theo trục chính, `align-items` căn theo trục phụ.',
    starter: {
      html: '<section class="hero">\n  <div class="box">Ở giữa!</div>\n</section>\n',
      css: `.hero {
  height: 300px;
  background: #fff7ed;
}

.box {
  padding: 16px 24px;
  background: #c2410c;
  color: #fff;
}
`,
      js: '',
    },
    solution: {
      html: '<section class="hero">\n  <div class="box">Ở giữa!</div>\n</section>\n',
      css: `.hero {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 300px;
  background: #fff7ed;
}

.box {
  padding: 16px 24px;
  background: #c2410c;
  color: #fff;
}
`,
      js: '',
    },
    tests: [
      { name: '`.hero` dùng `display: flex`', code: "return css('.hero', 'display') === 'flex'" },
      {
        name: '`.box` nằm giữa theo chiều ngang',
        code: "const h = $('.hero').getBoundingClientRect(); const b = $('.box').getBoundingClientRect(); return Math.abs(h.left + h.width / 2 - (b.left + b.width / 2)) < 1.5",
      },
      {
        name: '`.box` nằm giữa theo chiều dọc',
        code: "const h = $('.hero').getBoundingClientRect(); const b = $('.box').getBoundingClientRect(); return Math.abs(h.top + h.height / 2 - (b.top + b.height / 2)) < 1.5",
      },
    ],
  },
  {
    id: 'css-flex-nav',
    group: 'CSS',
    title: 'Thanh điều hướng',
    lesson: '/css/flexbox',
    brief:
      'Dùng Flexbox cho `.nav`: logo sát **bên trái**, menu sát **bên phải**, hai bên thẳng hàng giữa theo chiều dọc. `.menu` cũng là flex container, các mục cách nhau `16px` và không còn dấu chấm đầu dòng.',
    hint: '`.nav { display: flex; justify-content: space-between; align-items: center; }` và `.menu { display: flex; gap: 16px; list-style: none; }`.',
    starter: {
      html: `<nav class="nav">
  <a class="logo" href="#">WebBasic</a>
  <ul class="menu">
    <li><a href="#">Bài học</a></li>
    <li><a href="#">Playground</a></li>
    <li><a href="#">Liên hệ</a></li>
  </ul>
</nav>
`,
      css: `.nav {
  padding: 12px 20px;
  background: #1f2937;
  font-family: system-ui, sans-serif;
}

.nav a {
  color: #fff;
  text-decoration: none;
}

.logo {
  font-size: 20px;
  font-weight: 700;
}
`,
      js: '',
    },
    solution: {
      html: `<nav class="nav">
  <a class="logo" href="#">WebBasic</a>
  <ul class="menu">
    <li><a href="#">Bài học</a></li>
    <li><a href="#">Playground</a></li>
    <li><a href="#">Liên hệ</a></li>
  </ul>
</nav>
`,
      css: `.nav {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 20px;
  background: #1f2937;
  font-family: system-ui, sans-serif;
}

.nav a {
  color: #fff;
  text-decoration: none;
}

.logo {
  font-size: 20px;
  font-weight: 700;
}

.menu {
  display: flex;
  gap: 16px;
  margin: 0;
  padding: 0;
  list-style: none;
}
`,
      js: '',
    },
    tests: [
      { name: '`.nav` là flex container', code: "return css('.nav', 'display') === 'flex'" },
      {
        name: 'Logo sát lề trái, menu sát lề phải',
        code: "const n = $('.nav').getBoundingClientRect(); const l = $('.logo').getBoundingClientRect(); const m = $('.menu').getBoundingClientRect(); return Math.abs(l.left - n.left - parseFloat(css('.nav', 'padding-left'))) < 1.5 && Math.abs(n.right - parseFloat(css('.nav', 'padding-right')) - m.right) < 1.5",
      },
      {
        name: 'Logo và menu thẳng hàng giữa theo chiều dọc',
        code: "const l = $('.logo').getBoundingClientRect(); const m = $('.menu').getBoundingClientRect(); return Math.abs(l.top + l.height / 2 - (m.top + m.height / 2)) < 2",
      },
      {
        name: '`.menu` là flex container, các mục cách nhau 16px',
        code: "if (css('.menu', 'display') !== 'flex') return false; const r = $$('.menu > li').map((li) => li.getBoundingClientRect()); return r.length === 3 && Math.abs(r[1].left - r[0].right - 16) < 1 && Math.abs(r[2].left - r[1].right - 16) < 1",
      },
      { name: 'Không còn dấu chấm đầu dòng', code: "return css('.menu > li', 'list-style-type') === 'none'" },
    ],
  },
  {
    id: 'css-grid',
    group: 'CSS',
    title: 'Lưới 3 cột với Grid',
    lesson: '/css/grid',
    brief: 'Sắp các ô `.item` thành lưới **3 cột bằng nhau**, khoảng cách giữa các ô là `16px` theo cả hàng và cột.',
    hint: '`display: grid`, `grid-template-columns: repeat(3, 1fr)` và `gap: 16px`.',
    starter: { html: GRID_HTML, css: `.grid {\n  /* Viết CSS cho lưới ở đây */\n}\n\n${ITEM_CSS}`, js: '' },
    solution: {
      html: GRID_HTML,
      css: `.grid {\n  display: grid;\n  grid-template-columns: repeat(3, 1fr);\n  gap: 16px;\n}\n\n${ITEM_CSS}`,
      js: '',
    },
    tests: [
      { name: '`.grid` dùng `display: grid`', code: "return css('.grid', 'display') === 'grid'" },
      { name: 'Có đúng 3 cột', code: `return ${columns} === 3` },
      {
        name: 'Ba cột rộng bằng nhau',
        code: "const cols = css('.grid', 'grid-template-columns').split(' ').map(parseFloat); return cols.length === 3 && Math.max(...cols) - Math.min(...cols) < 1",
      },
      {
        name: 'Khoảng cách giữa các ô là 16px',
        code: "return css('.grid', 'column-gap') === '16px' && css('.grid', 'row-gap') === '16px'",
      },
    ],
  },
  {
    id: 'css-responsive',
    group: 'CSS',
    title: 'Responsive với media query',
    lesson: '/css/responsive',
    brief:
      'Lưới đang luôn có 3 cột. Thêm **media query** để khi màn hình hẹp hơn `600px`, lưới chỉ còn **1 cột**. Trình chấm sẽ thử ở bề rộng 800px và 400px.',
    hint: '`@media (width < 600px) { .grid { grid-template-columns: 1fr; } }` — hoặc cú pháp cũ `(max-width: 599px)`.',
    starter: {
      html: GRID_HTML,
      css: `.grid {\n  display: grid;\n  grid-template-columns: repeat(3, 1fr);\n  gap: 16px;\n}\n\n${ITEM_CSS}\n/* Thêm media query ở đây */\n`,
      js: '',
    },
    solution: {
      html: GRID_HTML,
      css: `.grid {\n  display: grid;\n  grid-template-columns: repeat(3, 1fr);\n  gap: 16px;\n}\n\n${ITEM_CSS}\n@media (width < 600px) {\n  .grid {\n    grid-template-columns: 1fr;\n  }\n}\n`,
      js: '',
    },
    tests: [
      { name: 'Rộng 800px: 3 cột', code: `await resize(800); return ${columns} === 3` },
      { name: 'Rộng 400px: còn 1 cột', code: `await resize(400); return ${columns} === 1` },
      { name: 'Rộng trở lại 800px: lại 3 cột', code: `await resize(800); return ${columns} === 3` },
    ],
  },
  {
    id: 'css-bien',
    group: 'CSS',
    title: 'Biến CSS',
    lesson: '/css/css-hien-dai',
    brief:
      'Khai báo biến `--mau-chinh: #7c3aed` trong `:root` và dùng `var(--mau-chinh)` làm nền cho `.btn`. Nút `.btn.phu` chỉ **gán lại biến** thành `#0f766e`, không viết lại `background`.',
    hint: 'Biến CSS được kế thừa: đặt `--mau-chinh` mới trên `.btn.phu` thì `var(--mau-chinh)` của chính nút đó đổi theo.',
    starter: {
      html: '<button class="btn">Nút chính</button>\n<button class="btn phu">Nút phụ</button>\n',
      css: `.btn {
  padding: 10px 18px;
  border: 0;
  border-radius: 8px;
  color: #fff;
  font: inherit;
  background: #7c3aed; /* đổi thành var(--mau-chinh) */
}
`,
      js: '',
    },
    solution: {
      html: '<button class="btn">Nút chính</button>\n<button class="btn phu">Nút phụ</button>\n',
      css: `:root {
  --mau-chinh: #7c3aed;
}

.btn {
  padding: 10px 18px;
  border: 0;
  border-radius: 8px;
  color: #fff;
  font: inherit;
  background: var(--mau-chinh);
}

.btn.phu {
  --mau-chinh: #0f766e;
}
`,
      js: '',
    },
    tests: [
      {
        name: 'Có biến `--mau-chinh: #7c3aed` trong `:root`',
        code: "return css(document.documentElement, '--mau-chinh').toLowerCase() === '#7c3aed'",
      },
      {
        name: '`.btn` dùng `var(--mau-chinh)` cho nền',
        code: "for (const sheet of document.styleSheets) for (const rule of sheet.cssRules) if (rule.selectorText === '.btn' && rule.style.cssText.includes('var(--mau-chinh)')) return true; return false",
      },
      { name: 'Nút chính có nền `#7c3aed`', code: "return css('.btn:not(.phu)', 'background-color') === 'rgb(124, 58, 237)'" },
      { name: 'Nút phụ có nền `#0f766e`', code: "return css('.btn.phu', 'background-color') === 'rgb(15, 118, 110)'" },
      {
        name: 'Nút phụ đổi màu bằng cách gán lại biến',
        code: "return css('.btn.phu', '--mau-chinh').toLowerCase() === '#0f766e'",
      },
    ],
  },

  // ─────────────────────────── JavaScript ───────────────────────────
  {
    id: 'js-ham-tinh-tien',
    group: 'JavaScript',
    title: 'Hàm tính tiền',
    lesson: '/javascript/ham',
    brief:
      'Viết hàm `tinhTien(gia, soLuong)` trả về tổng tiền. Mua từ **10 sản phẩm** trở lên được **giảm 10%**. Sau đó in `tinhTien(50000, 2)` ra console.',
    hint: 'Tính `gia * soLuong` trước, rồi dùng `if (soLuong >= 10)` để trả về `tong * 0.9`. Nhớ `return`!',
    starter: { ...EMPTY, js: '// Viết hàm tinhTien ở đây\n\n' },
    solution: {
      ...EMPTY,
      js: `function tinhTien(gia, soLuong) {
  const tong = gia * soLuong;
  if (soLuong >= 10) {
    return tong * 0.9;
  }
  return tong;
}

console.log(tinhTien(50000, 2));
`,
    },
    tests: [
      { name: 'Có hàm `tinhTien`', code: "return typeof tinhTien === 'function'" },
      { name: '`tinhTien(50000, 2)` trả về 100000', code: 'return tinhTien(50000, 2) === 100000' },
      {
        name: 'Từ 10 sản phẩm được giảm 10%: `tinhTien(10000, 10)` là 90000',
        code: 'return Math.abs(tinhTien(10000, 10) - 90000) < 0.001',
      },
      { name: '9 sản phẩm chưa được giảm: `tinhTien(20000, 9)` là 180000', code: 'return tinhTien(20000, 9) === 180000' },
      { name: 'Đã in 100000 ra console', code: "return logs.some((line) => line.includes('100000'))" },
    ],
  },
  {
    id: 'js-mang-gio-hang',
    group: 'JavaScript',
    title: 'Mảng: giỏ hàng',
    lesson: '/javascript/mang',
    brief:
      'Từ mảng `gioHang` có sẵn, tạo: `conHang` — các sản phẩm còn hàng (`filter`); `tenSanPham` — tên các sản phẩm còn hàng viết HOA (`map`); `tongTien` — tổng `gia * soLuong` của các sản phẩm còn hàng (`reduce`).',
    hint: '`gioHang.filter((sp) => sp.conHang)`, `.map((sp) => sp.ten.toUpperCase())`, `.reduce((tong, sp) => tong + sp.gia * sp.soLuong, 0)`.',
    starter: {
      ...EMPTY,
      js: `const gioHang = [
  { ten: 'Bàn phím', gia: 450000, soLuong: 1, conHang: true },
  { ten: 'Chuột', gia: 150000, soLuong: 2, conHang: true },
  { ten: 'Tai nghe', gia: 700000, soLuong: 1, conHang: false },
  { ten: 'Lót chuột', gia: 50000, soLuong: 3, conHang: true },
];

// Tạo conHang, tenSanPham và tongTien bên dưới

`,
    },
    solution: {
      ...EMPTY,
      js: `const gioHang = [
  { ten: 'Bàn phím', gia: 450000, soLuong: 1, conHang: true },
  { ten: 'Chuột', gia: 150000, soLuong: 2, conHang: true },
  { ten: 'Tai nghe', gia: 700000, soLuong: 1, conHang: false },
  { ten: 'Lót chuột', gia: 50000, soLuong: 3, conHang: true },
];

const conHang = gioHang.filter((sp) => sp.conHang);
const tenSanPham = conHang.map((sp) => sp.ten.toUpperCase());
const tongTien = conHang.reduce((tong, sp) => tong + sp.gia * sp.soLuong, 0);

console.log(tenSanPham, tongTien);
`,
    },
    tests: [
      {
        name: '`conHang` gồm 3 sản phẩm còn hàng',
        code: 'return Array.isArray(conHang) && conHang.length === 3 && conHang.every((sp) => sp.conHang === true)',
      },
      {
        name: '`tenSanPham` là tên viết hoa',
        code: "return JSON.stringify(tenSanPham) === JSON.stringify(['BÀN PHÍM', 'CHUỘT', 'LÓT CHUỘT'])",
      },
      { name: '`tongTien` bằng 900000', code: 'return tongTien === 900000' },
      {
        name: 'Mảng gốc `gioHang` không bị thay đổi',
        code: "return gioHang.length === 4 && gioHang[2].ten === 'Tai nghe'",
      },
    ],
  },
  {
    id: 'js-bo-dem',
    group: 'JavaScript',
    title: 'Bộ đếm',
    lesson: '/javascript/su-kien',
    brief:
      'Làm bộ đếm: nút **+** (`#tang`) tăng số trong `#so`, nút **−** (`#giam`) giảm nhưng **không xuống dưới 0**, nút `#dat-lai` đưa về 0.',
    hint: 'Giữ số đếm trong một biến `let`, mỗi lần bấm cập nhật biến rồi gán `so.textContent = dem`.',
    starter: {
      html: `<p>Số lượng: <output id="so">0</output></p>
<button id="giam" type="button">−</button>
<button id="tang" type="button">+</button>
<button id="dat-lai" type="button">Đặt lại</button>
`,
      css: '',
      js: '// Lấy các phần tử và gắn sự kiện click\n',
    },
    solution: {
      html: `<p>Số lượng: <output id="so">0</output></p>
<button id="giam" type="button">−</button>
<button id="tang" type="button">+</button>
<button id="dat-lai" type="button">Đặt lại</button>
`,
      css: '',
      js: `const so = document.querySelector('#so');
let dem = 0;

function hienThi() {
  so.textContent = dem;
}

document.querySelector('#tang').addEventListener('click', () => {
  dem++;
  hienThi();
});

document.querySelector('#giam').addEventListener('click', () => {
  if (dem > 0) dem--;
  hienThi();
});

document.querySelector('#dat-lai').addEventListener('click', () => {
  dem = 0;
  hienThi();
});
`,
    },
    tests: [
      {
        name: 'Bấm + ba lần → 3',
        code: "for (let i = 0; i < 3; i++) $('#tang').click(); return text('#so') === '3'",
      },
      { name: 'Bấm − một lần → 2', code: "$('#giam').click(); return text('#so') === '2'" },
      { name: 'Bấm Đặt lại → 0', code: "$('#dat-lai').click(); return text('#so') === '0'" },
      { name: 'Không giảm xuống dưới 0', code: "$('#giam').click(); $('#giam').click(); return text('#so') === '0'" },
      { name: 'Từ 0 vẫn tăng tiếp được', code: "$('#tang').click(); return text('#so') === '1'" },
    ],
  },
  {
    id: 'js-todo',
    group: 'JavaScript',
    title: 'Danh sách việc cần làm',
    lesson: '/javascript/su-kien',
    brief:
      'Khi gửi form `#form-viec`: chặn tải lại trang, thêm một `<li>` chứa nội dung ô `#o-nhap` (đã bỏ khoảng trắng hai đầu) vào `#ds`, rồi xóa trống ô nhập. Bỏ qua nếu ô nhập rỗng. Bấm vào một việc để bật/tắt class `xong`.',
    hint: 'Trong hàm xử lý `submit`, gọi `event.preventDefault()` đầu tiên. Dùng `oNhap.value.trim()`, `document.createElement("li")` và `ds.append(li)`. Với click, gắn một listener lên `#ds` rồi dùng `event.target.closest("li")`.',
    starter: {
      html: `<form id="form-viec">
  <input id="o-nhap" placeholder="Việc cần làm..." autocomplete="off">
  <button>Thêm</button>
</form>
<ul id="ds"></ul>
`,
      css: '#ds li {\n  cursor: pointer;\n}\n\n.xong {\n  text-decoration: line-through;\n  opacity: 0.6;\n}\n',
      js: `const form = document.querySelector('#form-viec');
const oNhap = document.querySelector('#o-nhap');
const ds = document.querySelector('#ds');

// Viết code xử lý sự kiện ở đây
`,
    },
    solution: {
      html: `<form id="form-viec">
  <input id="o-nhap" placeholder="Việc cần làm..." autocomplete="off">
  <button>Thêm</button>
</form>
<ul id="ds"></ul>
`,
      css: '#ds li {\n  cursor: pointer;\n}\n\n.xong {\n  text-decoration: line-through;\n  opacity: 0.6;\n}\n',
      js: `const form = document.querySelector('#form-viec');
const oNhap = document.querySelector('#o-nhap');
const ds = document.querySelector('#ds');

form.addEventListener('submit', (event) => {
  event.preventDefault();
  const noiDung = oNhap.value.trim();
  if (noiDung === '') return;

  const li = document.createElement('li');
  li.textContent = noiDung;
  ds.append(li);
  oNhap.value = '';
  oNhap.focus();
});

ds.addEventListener('click', (event) => {
  const li = event.target.closest('li');
  if (li) li.classList.toggle('xong');
});
`,
    },
    tests: [
      {
        name: 'Gửi form thì thêm được việc mới (đã bỏ khoảng trắng hai đầu)',
        code: "$('#o-nhap').value = '  Học HTML  '; $('#form-viec').requestSubmit(); await sleep(30); const items = $$('#ds li'); return items.length === 1 && items[0].textContent === 'Học HTML'",
      },
      { name: 'Ô nhập được xóa trống sau khi thêm', code: "return $('#o-nhap').value === ''" },
      {
        name: 'Không thêm việc rỗng',
        code: "$('#o-nhap').value = '   '; $('#form-viec').requestSubmit(); await sleep(30); return $$('#ds li').length === 1",
      },
      {
        name: 'Bấm vào việc để đánh dấu xong',
        code: "const li = $('#ds li'); li.click(); return li.classList.contains('xong')",
      },
      {
        name: 'Bấm lần nữa để bỏ đánh dấu',
        code: "const li = $('#ds li'); li.click(); return !li.classList.contains('xong')",
      },
    ],
  },
  {
    id: 'js-bat-dong-bo',
    group: 'JavaScript',
    title: 'Tải dữ liệu bất đồng bộ',
    lesson: '/nang-cao/bat-dong-bo',
    brief:
      'Hàm có sẵn `layNguoiDung(id)` trả về **Promise** (mất khoảng 0,3 giây). Viết `async function hienThi(id)`: trước khi tải ghi `Đang tải...` vào `#trang-thai`; tải xong ghi tên vào `#ten` và xóa trống `#trang-thai`; nếu lỗi thì ghi `error.message` vào `#trang-thai`.',
    hint: 'Dùng `try { const nguoiDung = await layNguoiDung(id); … } catch (error) { … }`. Với `id = 0`, Promise bị reject với lỗi "Không tìm thấy người dùng".',
    setup: `function layNguoiDung(id) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (id > 0) resolve({ id: id, ten: 'Nguyễn Văn An', email: 'an@example.com' });
      else reject(new Error('Không tìm thấy người dùng'));
    }, 300);
  });
}`,
    starter: {
      html: '<p id="trang-thai"></p>\n<h2 id="ten"></h2>\n<button id="tai" type="button">Tải người dùng</button>\n',
      css: '',
      js: `// Hàm layNguoiDung(id) đã có sẵn và trả về Promise.
const trangThai = document.querySelector('#trang-thai');
const ten = document.querySelector('#ten');

async function hienThi(id) {
  // Viết code ở đây
}

document.querySelector('#tai').addEventListener('click', () => hienThi(1));
`,
    },
    solution: {
      html: '<p id="trang-thai"></p>\n<h2 id="ten"></h2>\n<button id="tai" type="button">Tải người dùng</button>\n',
      css: '',
      js: `const trangThai = document.querySelector('#trang-thai');
const ten = document.querySelector('#ten');

async function hienThi(id) {
  trangThai.textContent = 'Đang tải...';
  try {
    const nguoiDung = await layNguoiDung(id);
    ten.textContent = nguoiDung.ten;
    trangThai.textContent = '';
  } catch (error) {
    trangThai.textContent = error.message;
  }
}

document.querySelector('#tai').addEventListener('click', () => hienThi(1));
`,
    },
    tests: [
      {
        name: '`hienThi` là hàm async',
        code: "return typeof hienThi === 'function' && hienThi.constructor.name === 'AsyncFunction'",
      },
      {
        name: 'Hiện “Đang tải...” trong lúc chờ',
        code: "hienThi(1); await sleep(50); return text('#trang-thai') === 'Đang tải...'",
      },
      {
        name: 'Tải xong: hiện tên và xóa trạng thái',
        code: "await sleep(400); return text('#ten') === 'Nguyễn Văn An' && text('#trang-thai') === ''",
      },
      {
        name: 'Lỗi (id = 0): hiện thông báo lỗi',
        code: "await hienThi(0); return text('#trang-thai') === 'Không tìm thấy người dùng'",
      },
    ],
  },
]
