---
title: Cheat sheet HTML, CSS, JavaScript
description: Bảng tra nhanh cú pháp HTML, CSS và JavaScript hay dùng nhất, kèm phím tắt DevTools, VS Code và Emmet.
---

# Cheat sheet HTML, CSS, JavaScript

Bảng tra nhanh những gì dùng nhiều nhất. Mỗi mục có liên kết tới bài học để xem giải thích đầy đủ. Dùng `Ctrl` + `F` để tìm trong trang.

## HTML

### Khung trang

```html
<!DOCTYPE html>
<html lang="vi">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Tiêu đề trang</title>
  <meta name="description" content="Mô tả ngắn cho kết quả tìm kiếm">
  <link rel="icon" href="/favicon.svg" type="image/svg+xml">
  <link rel="stylesheet" href="css/style.css">
  <script src="js/app.js" type="module"></script>
</head>
<body>
  <header>...</header>
  <main>...</main>
  <footer>...</footer>
</body>
</html>
```

### Thẻ thường dùng

| Thẻ | Dùng cho | Bài |
| --- | --- | --- |
| `<h1>`…`<h6>` | Tiêu đề, một `<h1>` mỗi trang, không nhảy cấp | [Văn bản](/html/van-ban-lien-ket-hinh-anh) |
| `<p>`, `<br>`, `<hr>` | Đoạn văn, xuống dòng, chuyển ý | [Văn bản](/html/van-ban-lien-ket-hinh-anh) |
| `<strong>`, `<em>`, `<mark>`, `<code>` | Quan trọng, nhấn giọng, đánh dấu, code | [Văn bản](/html/van-ban-lien-ket-hinh-anh) |
| `<a href="...">` | Liên kết; `target="_blank" rel="noopener"` để mở tab mới | [Liên kết](/html/van-ban-lien-ket-hinh-anh#_5-lien-ket-voi-a) |
| `<img src alt width height>` | Ảnh, luôn có `alt` | [Hình ảnh](/html/van-ban-lien-ket-hinh-anh#_7-hinh-anh-voi-img) |
| `<ul>`, `<ol>`, `<li>`, `<dl>` | Danh sách | [Danh sách](/html/danh-sach-bang) |
| `<table>`, `<caption>`, `<thead>`, `<tbody>`, `<th scope>`, `<td>` | Bảng dữ liệu | [Bảng](/html/danh-sach-bang) |
| `<form>`, `<label>`, `<input>`, `<select>`, `<textarea>`, `<button>` | Form | [Form](/html/form) |
| `<header>`, `<nav>`, `<main>`, `<article>`, `<section>`, `<aside>`, `<footer>` | Bố cục ngữ nghĩa | [Ngữ nghĩa](/html/html-ngu-nghia) |
| `<figure>`, `<figcaption>`, `<picture>`, `<video>`, `<audio>`, `<iframe>` | Đa phương tiện | [Media](/html/head-media) |
| `<details>`, `<summary>`, `<dialog>` | Ẩn/hiện, hộp thoại | [Web hiện đại](/nang-cao/web-components) |
| `<div>`, `<span>` | Hộp không mang nghĩa, để định kiểu | [Trang đầu tiên](/html/trang-html-dau-tien) |

### Các loại input

| `type` | Dùng cho |
| --- | --- |
| `text`, `email`, `password`, `tel`, `url`, `search` | Văn bản các loại (bàn phím điện thoại phù hợp) |
| `number`, `range` | Số, thanh trượt |
| `date`, `time`, `month`, `datetime-local` | Ngày giờ |
| `checkbox` (chọn nhiều), `radio` (cùng `name`, chọn một) | Lựa chọn |
| `color`, `file`, `hidden` | Màu, tệp, giá trị ẩn |

Thuộc tính kiểm tra: `required`, `minlength`, `maxlength`, `min`, `max`, `step`, `pattern`. Gợi ý: `autocomplete`, `inputmode`, `placeholder` (chỉ là ví dụ, không thay label).

## CSS

### Selector

| Selector | Chọn |
| --- | --- |
| `p`, `.ten`, `#ten`, `*` | Thẻ, class, id, tất cả |
| `a, b` | Cả `a` và `b` |
| `.a.b` | Có cả hai class |
| `A B`, `A > B`, `A + B`, `A ~ B` | Con cháu, con trực tiếp, liền sau, anh em sau |
| `[type="email"]`, `[href^="https"]`, `[href$=".pdf"]` | Theo thuộc tính |
| `:hover`, `:focus-visible`, `:checked`, `:disabled`, `:user-invalid` | Trạng thái |
| `:first-child`, `:last-child`, `:nth-child(2n)`, `:not(...)` | Vị trí, phủ định |
| `:is(...)`, `:where(...)` (độ ưu tiên 0), `:has(...)` (chọn cha) | Hàm selector |
| `::before`, `::after` (cần `content`), `::placeholder`, `::marker` | Pseudo-element |

Độ ưu tiên (id, class, thẻ): `#a` (1,0,0) > `.a.b` (0,2,0) > `.a` (0,1,0) > `p` (0,0,1). Bằng nhau thì rule viết sau thắng. [Chi tiết](/css/selector-cascade).

### Box model và bố cục

```css
*, *::before, *::after { box-sizing: border-box; }

.khung { max-width: 72rem; margin-inline: auto; padding-inline: 1rem; }

img { max-width: 100%; height: auto; }

/* Flexbox: một chiều */
.hang { display: flex; justify-content: space-between; align-items: center; gap: 1rem; flex-wrap: wrap; }
.item { flex: 1; }            /* chia đều */
.co-dinh { flex: none; }      /* giữ nguyên kích thước */
.day-sang-phai { margin-left: auto; }

/* Căn giữa */
.giua { display: grid; place-items: center; }

/* Grid: hai chiều */
.luoi { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 1rem; }
.trai-het-hang { grid-column: 1 / -1; }
.trang {
  display: grid;
  grid-template-columns: 240px 1fr;
  grid-template-areas: "header header" "sidebar main" "footer footer";
}

/* Định vị */
.cha { position: relative; }
.con { position: absolute; top: 8px; right: 8px; }
.dinh { position: sticky; top: 0; }
.phu-kin { position: fixed; inset: 0; }
```

### Responsive

```css
/* Mobile-first: CSS mặc định cho màn hình nhỏ, bổ sung cho màn hình lớn */
@media (width >= 768px) { ... }
@media (prefers-color-scheme: dark) { ... }
@media (prefers-reduced-motion: reduce) { ... }

/* Chữ co giãn */
h1 { font-size: clamp(1.75rem, 1rem + 4vw, 3.5rem); }

/* Container query */
.vung { container-type: inline-size; }
@container (width >= 400px) { .the { grid-template-columns: 160px 1fr; } }
```

### Chữ, màu, đơn vị

| Mục | Cú pháp |
| --- | --- |
| Font | `font-family: system-ui, sans-serif; font-size: 1rem; font-weight: 600; line-height: 1.6;` |
| Màu | `#c2410c`, `rgb(194 65 12 / 50%)`, `hsl(20 88% 40%)`, `oklch(55% 0.17 40)`, `color-mix(in oklch, red, white 30%)` |
| Đơn vị | `rem` (theo `html`), `em` (theo chính nó), `%`, `vw`/`vh`/`dvh`, `ch`, `fr` (Grid) |
| Nền | `background: linear-gradient(135deg, #f97316, #7c3aed); background-size: cover;` |
| Bóng | `box-shadow: 0 4px 12px rgb(0 0 0 / 0.1);` |

### Biến, nesting, chuyển động

```css
:root { --mau-chinh: #c2410c; color-scheme: light dark; --nen: light-dark(white, #18181b); }
.nut { background: var(--mau-chinh, orange); }
.nut.phu { --mau-chinh: #0f766e; }

.the {
  transition: transform 0.2s ease-out;
  &:hover { transform: translateY(-4px); }
  @media (width >= 600px) { padding: 2rem; }
}

@keyframes xoay { to { transform: rotate(1turn); } }
.loading { animation: xoay 0.8s linear infinite; }
```

## JavaScript

### Biến, kiểu, toán tử

```js
const PI = 3.14;              // mặc định dùng const
let dem = 0;                  // khi cần gán lại
typeof 'a';                   // 'string'
Array.isArray([]);            // true
`Xin chào ${ten}`;            // template literal
a === b; a !== b;             // luôn dùng === và !==
gia ?? 0;                     // mặc định khi null/undefined
obj?.diaChi?.thanhPho;        // đọc an toàn
Number('42'); String(42);     // chuyển kiểu tường minh
```

Falsy: `false`, `0`, `-0`, `0n`, `''`, `null`, `undefined`, `NaN`. Còn lại là truthy (kể cả `[]`, `'0'`).

### Điều kiện, vòng lặp, hàm

```js
if (diem >= 8) { ... } else if (diem >= 5) { ... } else { ... }
const kq = dat ? 'Đạt' : 'Chưa đạt';

for (let i = 0; i < n; i++) { ... }
for (const x of mang) { ... }               // giá trị
for (const [k, v] of Object.entries(o)) { ... }

function tong(a, b = 0) { return a + b; }
const binhPhuong = (x) => x * x;
const taoDiem = (x, y) => ({ x, y });
function tongTatCa(...so) { return so.reduce((t, x) => t + x, 0); }
```

### Mảng

| Phương thức | Kết quả | Sửa mảng gốc? |
| --- | --- | --- |
| `push`, `pop`, `shift`, `unshift`, `splice` | Thêm/xóa | ✅ Có |
| `sort`, `reverse` | Sắp xếp, đảo | ✅ Có |
| `toSorted`, `toReversed`, `with`, `slice`, `concat`, `[...a]` | Mảng mới | ❌ Không |
| `map(fn)` | Mảng mới cùng độ dài, biến đổi từng phần tử | ❌ |
| `filter(fn)` | Mảng mới gồm phần tử thỏa điều kiện | ❌ |
| `reduce((t, x) => ..., 0)` | Gộp thành một giá trị | ❌ |
| `find`, `findIndex`, `some`, `every`, `includes` | Tìm kiếm, kiểm tra | ❌ |
| `forEach(fn)` | Lặp, không trả về gì | ❌ |
| `join(', ')`, `'a,b'.split(',')` | Mảng ↔ chuỗi | ❌ |

Sắp xếp số: `toSorted((a, b) => a - b)`. Chuỗi tiếng Việt: `toSorted((a, b) => a.localeCompare(b, 'vi'))`.

### Object, JSON, lưu trữ

```js
const { ten, tuoi = 18, ...conLai } = nguoiDung;   // destructuring
const moi = { ...cu, tuoi: 21 };                   // sao chép nông + sửa
const sau = structuredClone(cu);                   // sao chép sâu
Object.keys(o); Object.values(o); Object.entries(o); Object.fromEntries(cap);

JSON.stringify(o, null, 2); JSON.parse(chuoi);     // nhớ try...catch khi parse
localStorage.setItem('khoa', JSON.stringify(o));
JSON.parse(localStorage.getItem('khoa') ?? 'null');

new Set([1, 2, 2]);  new Map([['a', 1]]);
```

### Chuỗi, số, ngày

```js
s.trim(); s.toLowerCase(); s.includes('x'); s.startsWith('x'); s.slice(0, 5);
s.replaceAll('a', 'b'); s.padStart(2, '0'); s.split(' ');
s.normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/đ/g, 'd');   // bỏ dấu

Math.round(x); Math.floor(x); x.toFixed(2);
Math.floor(Math.random() * (max - min + 1)) + min;

new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(125000);  // 125.000 ₫
new Date().toLocaleDateString('vi-VN');                                               // dd/mm/yyyy
new Date(2026, 0, 15);                                                                // tháng đếm từ 0!
```

### DOM và sự kiện

```js
const el = document.querySelector('.the');          // một phần tử hoặc null
const ds = document.querySelectorAll('li');         // NodeList

el.textContent = 'chữ';                             // an toàn
el.classList.add('an'); el.classList.toggle('mo', dieuKien);
el.setAttribute('aria-expanded', 'true'); el.dataset.id;   // data-id
el.style.setProperty('--ti-le', '40%');

const li = document.createElement('li');
cha.append(li); cha.replaceChildren(...dsPhanTu); li.remove();
el.closest('.the'); el.matches('.the');

nut.addEventListener('click', (event) => { ... });
form.addEventListener('submit', (event) => {
  event.preventDefault();
  const duLieu = Object.fromEntries(new FormData(form));
});
// Ủy quyền sự kiện
ds.addEventListener('click', (e) => {
  const nut = e.target.closest('.xoa');
  if (!nut) return;
  ...
});
```

### Bất đồng bộ và fetch

```js
async function tai(url) {
  const r = await fetch(url, { signal: AbortSignal.timeout(8000) });
  if (!r.ok) throw new Error(`Lỗi ${r.status}`);
  return r.json();
}

try {
  const [a, b] = await Promise.all([tai(url1), tai(url2)]);   // song song
} catch (loi) {
  console.error(loi);
}

await fetch('/api/bai-viet', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(duLieu),
});

const url = new URL('https://api.example.com/tim');
url.searchParams.set('q', 'áo thun');
```

Thứ tự chạy: code đồng bộ → mọi microtask (Promise, phần sau `await`) → một macrotask (`setTimeout`, sự kiện).

### Class, module, lỗi

```js
export class GioHang {
  #ds = [];                       // riêng tư
  static tao() { return new GioHang(); }
  get soMon() { return this.#ds.length; }
  them(sp) { this.#ds.push(sp); return this; }
}
export default function chinh() {}

import chinh, { GioHang } from './gio-hang.js';
const { xuatPDF } = await import('./pdf.js');      // import động

class LoiKiemTra extends Error { name = 'LoiKiemTra'; }
try { ... } catch (loi) { ... } finally { ... }
throw new Error('Mô tả lỗi', { cause: loiGoc });
```

## Phím tắt

| Phím | Tác dụng |
| --- | --- |
| `F12` / `Ctrl` + `Shift` + `I` | Mở DevTools |
| `Ctrl` + `Shift` + `C` | Chọn phần tử trên trang để kiểm tra |
| `Ctrl` + `Shift` + `M` | Giả lập thiết bị di động |
| `Ctrl` + `U` | Xem mã nguồn gốc |
| `Ctrl` + `Shift` + `R` | Tải lại trang, bỏ qua bộ đệm |
| `F8` / `F10` / `F11` | Debug: chạy tiếp / qua dòng / vào hàm |
| `Ctrl` + `P` (VS Code) | Mở nhanh tệp |
| `Alt` + `Shift` + `F` (VS Code) | Định dạng lại tệp |
| `Ctrl` + `/` (VS Code) | Bật/tắt chú thích dòng |
| `Alt` + `↑` / `↓` (VS Code) | Di chuyển dòng lên/xuống |
| `Ctrl` + `D` (VS Code) | Chọn thêm lần xuất hiện tiếp theo (sửa nhiều chỗ cùng lúc) |
| `Ctrl` + `` ` `` (VS Code) | Mở terminal |

Trên macOS thay `Ctrl` bằng `Cmd` và `Alt` bằng `Option`.

## Emmet (VS Code)

| Gõ rồi nhấn `Tab` | Ra |
| --- | --- |
| `!` | Khung trang HTML |
| `.the` | `<div class="the"></div>` |
| `ul>li*3` | Danh sách 3 mục |
| `nav>a[href=#]*4{Mục $}` | 4 liên kết "Mục 1"…"Mục 4" |
| `section.the>h2+p` | Section chứa h2 rồi p |
| `table>tr*3>td*2` | Bảng 3 hàng × 2 cột |
| `m10` (trong CSS) | `margin: 10px;` |
| `df` / `dg` (trong CSS) | `display: flex;` / `display: grid;` |
