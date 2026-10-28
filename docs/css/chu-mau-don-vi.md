---
title: Chữ, màu sắc & đơn vị
description: Font chữ và web font hỗ trợ tiếng Việt, các thuộc tính văn bản, đơn vị px, em, rem, %, vw, vh, cách viết màu hex, rgb, hsl, oklch, nền, gradient và đổ bóng.
quiz:
  - q: "`html` có cỡ chữ 16px. Một phần tử nằm trong khối có `font-size: 20px` và đặt `padding: 2rem`. Padding bằng bao nhiêu?"
    options:
      - "40px"
      - "32px"
      - "20px"
      - "2px"
    answer: 1
    explain: "`rem` luôn tính theo cỡ chữ của phần tử gốc `html` (16px), không phụ thuộc phần tử cha: 2 × 16 = 32px. Nếu là `2em` thì tính theo cỡ chữ của chính phần tử (20px kế thừa) = 40px."
  - q: "Vì sao nên viết `line-height: 1.5` (không đơn vị) thay vì `line-height: 24px`?"
    options:
      - "Vì đơn vị px không hợp lệ cho line-height"
      - "Vì số không đơn vị là **hệ số nhân** theo cỡ chữ của từng phần tử, nên chữ to nhỏ thế nào khoảng cách dòng vẫn cân đối"
      - "Vì trình duyệt cũ không hiểu px"
      - "Không khác gì nhau"
    answer: 1
    explain: "`24px` cố định sẽ được kế thừa nguyên xi: tiêu đề cỡ 40px với line-height 24px thì các dòng đè lên nhau. `1.5` kế thừa dưới dạng hệ số."
  - q: "Mã màu `#c2410c80` nghĩa là gì?"
    options:
      - "Màu cam với độ trong suốt khoảng 50% (hai số cuối là kênh alpha)"
      - "Mã màu sai, hex chỉ có 6 ký tự"
      - "Màu cam đậm hơn 80%"
      - "Màu xám"
    answer: 0
    explain: "Hex 8 ký tự `#RRGGBBAA`: `80` (hệ 16) = 128/255 ≈ 50% độ đục. Cách viết tương đương: `rgb(194 65 12 / 50%)`."
  - q: "`font-display: swap` trong `@font-face` có tác dụng gì?"
    options:
      - "Đổi font khi người dùng di chuột"
      - "Hiện chữ ngay bằng font dự phòng, rồi đổi sang web font khi tải xong, thay vì giấu chữ trong lúc chờ"
      - "Tải font nhanh gấp đôi"
      - "Chỉ dùng font của hệ điều hành"
    answer: 1
    explain: "Không có `swap`, nhiều trình duyệt giấu chữ tới 3 giây khi chờ font, khiến người dùng nhìn trang trống. Google Fonts thêm `display=swap` vào URL để làm việc này."
  - q: "Muốn ảnh nền **phủ kín** khung mà không bị méo (chấp nhận cắt bớt mép), dùng gì?"
    options:
      - "`background-size: contain`"
      - "`background-size: cover`"
      - "`background-size: 100% 100%`"
      - "`background-repeat: repeat`"
    answer: 1
    explain: "`cover` phóng ảnh vừa đủ phủ kín, phần thừa bị cắt. `contain` hiện trọn ảnh nên có thể chừa khoảng trống. `100% 100%` kéo giãn làm méo ảnh."
---

# Chữ, màu sắc & đơn vị

::: info Mục tiêu bài học
- Chọn **font chữ** an toàn cho tiếng Việt, dùng **web font** đúng cách.
- Định dạng văn bản: cỡ chữ, độ đậm, khoảng cách dòng, căn lề, gạch chân...
- Hiểu và chọn đúng **đơn vị**: `px`, `em`, `rem`, `%`, `vw`, `vh`, `ch`.
- Viết **màu** theo nhiều cách: tên, hex, `rgb()`, `hsl()`, `oklch()`; đảm bảo **tương phản**.
- Dùng **nền**, **gradient** và **đổ bóng**.
:::

## 1. Font chữ

```css
body {
  font-family: 'Be Vietnam Pro', system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif;
}
```

`font-family` là một **danh sách dự phòng**: trình duyệt dùng font đầu tiên có trên máy (hoặc đã tải về). Cuối danh sách luôn là một **họ font chung** (generic family):

| Họ chung | Kiểu | Ví dụ |
| --- | --- | --- |
| `sans-serif` | Không chân, hiện đại, dễ đọc trên màn hình | Arial, Roboto, Segoe UI |
| `serif` | Có chân, trang trọng | Times New Roman, Georgia |
| `monospace` | Mỗi chữ rộng bằng nhau, dùng cho code | Consolas, Menlo |
| `system-ui` | Font giao diện của hệ điều hành | Segoe UI (Windows), San Francisco (Apple) |

Tên font có dấu cách nên đặt trong nháy: `'Segoe UI'`.

**Web font** là font tải từ Internet, nên mọi người dùng đều thấy giống nhau. Cách dễ nhất là [Google Fonts](https://fonts.google.com): chọn font, chọn độ đậm, copy đoạn `<link>` vào `<head>`:

```html
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Be+Vietnam+Pro:wght@400;600;700&display=swap" rel="stylesheet">
```

::: warning Kiểm tra font có hỗ trợ tiếng Việt không
Rất nhiều font đẹp **thiếu dấu tiếng Việt**: chữ có dấu bị hiển thị bằng font dự phòng, trông lổn nhổn. Trên Google Fonts, lọc **Language → Vietnamese**. Các font hỗ trợ tốt: Be Vietnam Pro, Inter, Roboto, Noto Sans, Nunito, Montserrat, Lora, Merriweather.
:::

Tự phục vụ font (tải tệp `.woff2` về website của bạn) dùng `@font-face`:

```css
@font-face {
  font-family: 'Be Vietnam Pro';
  src: url('/fonts/be-vietnam-pro-400.woff2') format('woff2');
  font-weight: 400;
  font-style: normal;
  font-display: swap;   /* hiện chữ ngay bằng font dự phòng, đổi khi tải xong */
}
```

Mỗi độ đậm là một tệp riêng, nên chỉ tải những độ đậm bạn thật sự dùng (thường là 400, 600, 700).

## 2. Định dạng văn bản

```html live
<h2 class="tieu-de">Định dạng văn bản</h2>
<p class="doan">
  Đoạn văn có <strong>chữ đậm</strong>, <em>chữ nghiêng</em>, khoảng cách dòng thoải mái
  và chiều rộng dòng vừa phải cho dễ đọc. Thử thu nhỏ khung để thấy dòng tự xuống.
</p>
<p class="nho">Ghi chú nhỏ · viết hoa bằng CSS</p>
<a href="#" class="lien-ket">Liên kết không gạch chân, gạch khi di chuột</a>

<style>
  body { font-family: system-ui, sans-serif; color: #27272a; }
  .tieu-de {
    font-size: 1.75rem;
    font-weight: 700;          /* 100 → 900; 400 = normal, 700 = bold */
    letter-spacing: -0.02em;   /* khoảng cách giữa các chữ */
    line-height: 1.2;
  }
  .doan {
    font-size: 1.125rem;
    line-height: 1.7;          /* không đơn vị: 1.7 lần cỡ chữ */
    max-width: 60ch;           /* khoảng 60 ký tự mỗi dòng */
  }
  .nho {
    font-size: 0.875rem;
    text-transform: uppercase; /* viết hoa toàn bộ (chỉ ở phần hiển thị) */
    letter-spacing: 0.08em;
    color: #71717a;
  }
  .lien-ket { color: #c2410c; text-decoration: none; }
  .lien-ket:hover { text-decoration: underline; text-underline-offset: 3px; }
</style>
```

| Thuộc tính | Giá trị thường dùng |
| --- | --- |
| `font-size` | `1rem`, `1.25rem`, `clamp(...)` (bài [Responsive](/css/responsive)) |
| `font-weight` | `400` (thường), `600`, `700` (đậm) |
| `font-style` | `normal`, `italic` |
| `line-height` | `1.5`–`1.7` cho đoạn văn, `1.1`–`1.3` cho tiêu đề. **Không đơn vị** |
| `text-align` | `left`, `center`, `right`, `justify` |
| `text-decoration` | `none`, `underline`, `line-through` |
| `text-transform` | `uppercase`, `lowercase`, `capitalize` |
| `letter-spacing` | `0.05em` (dùng `em` để tỉ lệ theo cỡ chữ) |
| `white-space` | `nowrap` (không xuống dòng), `pre-wrap` (giữ khoảng trắng) |

Đoạn văn dễ đọc nhất khi mỗi dòng khoảng **45–75 ký tự**: `max-width: 60ch` là một mẹo hay. Hạn chế `text-align: justify` với tiếng Việt, vì dễ tạo ra những khoảng trắng lớn giữa các từ.

## 3. Đơn vị

| Đơn vị | Tính theo | Dùng khi |
| --- | --- | --- |
| `px` | Điểm ảnh CSS (cố định) | Viền, bóng đổ, chi tiết nhỏ |
| `rem` | Cỡ chữ của **phần tử gốc** `html` (mặc định 16px) | **Cỡ chữ, khoảng cách** nói chung |
| `em` | Cỡ chữ của **chính phần tử** | Padding của nút (to theo chữ), `letter-spacing` |
| `%` | Phần tử cha | Bề rộng trong bố cục |
| `vw`, `vh` | 1% bề rộng / chiều cao **cửa sổ** | Khối toàn màn hình, chữ co giãn |
| `dvh`, `svh` | Chiều cao cửa sổ có tính thanh địa chỉ trên điện thoại | `min-height: 100dvh` cho màn hình đầu tiên |
| `ch` | Bề rộng ký tự "0" của font | Độ dài dòng chữ, ô nhập |

```html live
<div class="goc">
  Khối có font-size 20px
  <p class="em">padding 1em = 20px (theo chính nó, kế thừa 20px)</p>
  <p class="rem">padding 1rem = 16px (theo html)</p>
</div>

<style>
  body { font-family: system-ui, sans-serif; }
  .goc { font-size: 20px; }
  p { background: #ede9fe; margin: 8px 0; }
  .em { padding: 1em; }
  .rem { padding: 1rem; }
</style>
```

::: tip Vì sao nên dùng `rem` cho cỡ chữ?
Người dùng có thể tăng cỡ chữ mặc định trong cài đặt trình duyệt (người lớn tuổi, người mắt kém hay làm vậy). `rem` tôn trọng thiết lập đó, `px` thì không. Đừng đặt `html { font-size: 62.5%; }` theo một số mẹo cũ: nó làm khó cho chính người dùng cần chữ to.
:::

## 4. Màu sắc

```html live
<div class="o" style="background: tomato">tên màu: tomato</div>
<div class="o" style="background: #c2410c">hex: #c2410c</div>
<div class="o" style="background: #c2410c80">hex + alpha: #c2410c80</div>
<div class="o" style="background: rgb(124 58 237)">rgb(124 58 237)</div>
<div class="o" style="background: rgb(124 58 237 / 40%)">rgb(... / 40%)</div>
<div class="o" style="background: hsl(160 84% 39%)">hsl(160 84% 39%)</div>
<div class="o" style="background: oklch(65% 0.2 250)">oklch(65% 0.2 250)</div>
<div class="o" style="background: color-mix(in oklch, #c2410c, white 60%)">color-mix(...)</div>

<style>
  body { font-family: system-ui, sans-serif; display: grid; grid-template-columns: repeat(auto-fill, minmax(150px, 1fr)); gap: 8px; }
  .o { padding: 18px 8px; border-radius: 8px; color: #18181b; font-size: 13px; text-align: center; }
</style>
```

| Cách viết | Ghi chú |
| --- | --- |
| Tên màu: `red`, `tomato`, `transparent` | Tiện thử nhanh, ít dùng trong dự án |
| `#RRGGBB`, `#RGB`, `#RRGGBBAA` | Phổ biến nhất, copy thẳng từ Figma |
| `rgb(r g b / a)` | Ba kênh 0–255, alpha 0–1 hoặc % |
| `hsl(h s l / a)` | Sắc độ (0–360°), độ bão hòa, độ sáng: dễ tạo màu sáng/tối hơn |
| `oklch(L C H / a)` | Không gian màu hiện đại: cùng độ sáng `L` thì mắt người thấy sáng như nhau. Rất hợp để tạo bảng màu |
| `color-mix(in oklch, A, B 30%)` | Trộn hai màu, ví dụ tạo màu nhạt hơn từ màu thương hiệu |
| `currentColor` | Bằng giá trị `color` hiện tại, tiện cho viền, icon SVG |

Cú pháp có dấu phẩy `rgb(124, 58, 237)` và `rgba()` cũ vẫn chạy tốt; cú pháp cách nhau bằng dấu cách là cách viết hiện đại.

**Tương phản.** Chữ thường cần tỉ lệ tương phản ít nhất **4,5:1** với nền, chữ lớn (từ 24px, hoặc 18,66px đậm) cần **3:1** (chuẩn WCAG AA). Khi chọn màu chữ, DevTools hiển thị tỉ lệ này kèm dấu ✓ hoặc ⚠. Chữ xám nhạt trên nền trắng "nhìn sang" nhưng nhiều người không đọc được.

## 5. Nền và gradient

```html live
<div class="hero">Ảnh nền phủ kín</div>
<div class="grad">linear-gradient</div>
<div class="grad2">radial + conic</div>

<style>
  body { font-family: system-ui, sans-serif; display: grid; gap: 10px; }
  div { padding: 28px; border-radius: 10px; color: white; font-weight: 700; }
  .hero {
    background-color: #44403c;    /* màu dự phòng khi ảnh chưa tải */
    background-image: linear-gradient(rgb(0 0 0 / 0.45), rgb(0 0 0 / 0.45)),
                      url('https://picsum.photos/id/1015/800/300');
    background-size: cover;       /* phủ kín, cắt phần thừa */
    background-position: center;
  }
  .grad { background: linear-gradient(135deg, #f97316, #7c3aed); }
  .grad2 {
    background:
      radial-gradient(circle at 20% 30%, #fde68a 0 20%, transparent 21%),
      conic-gradient(from 90deg, #0f766e, #22d3ee, #0f766e);
  }
</style>
```

- `background-size`: `cover` (phủ kín, có thể cắt), `contain` (hiện trọn ảnh, có thể chừa khoảng trống), hoặc kích thước cụ thể.
- `background-position`: `center`, `top right`, `50% 20%`.
- `background-repeat`: `no-repeat`, `repeat-x`...
- Có thể **chồng nhiều lớp nền**, cách nhau dấu phẩy, lớp viết trước nằm trên. Mẹo hay dùng: đặt một gradient tối mờ đè lên ảnh để chữ trắng dễ đọc.
- Gradient: `linear-gradient` (theo đường thẳng), `radial-gradient` (tỏa tròn), `conic-gradient` (xoay quanh tâm, làm biểu đồ tròn).

Ảnh **mang nội dung** (ảnh sản phẩm, ảnh bài viết) phải dùng `<img>` có `alt`. Ảnh nền CSS chỉ dành cho trang trí.

## 6. Đổ bóng và độ mờ

```html live
<div class="the">box-shadow nhiều lớp</div>
<h2 class="chu">text-shadow</h2>

<style>
  body { font-family: system-ui, sans-serif; padding: 16px; background: #f5f5f4; }
  .the {
    padding: 24px; border-radius: 12px; background: white;
    /* x  y  độ nhòe  độ loang  màu — nhiều lớp cho bóng mềm, tự nhiên */
    box-shadow: 0 1px 2px rgb(0 0 0 / 0.06), 0 8px 24px rgb(0 0 0 / 0.1);
  }
  .chu { color: #c2410c; text-shadow: 2px 2px 0 #fde68a; }
</style>
```

`opacity: 0.5` làm **cả phần tử và mọi thứ bên trong** mờ đi. Nếu chỉ muốn nền mờ, hãy dùng màu có alpha cho `background` thay vì `opacity`.

## Thực hành

**Bài 1.** Làm bài **Màu sắc & chữ** trong [Code Playground](/thuc-hanh/playground) (nếu chưa làm ở bài trước).

::: details Xem gợi ý
Trình chấm đọc giá trị đã tính bằng `getComputedStyle`: màu `#c2410c` sẽ thành `rgb(194, 65, 12)`, `line-height: 1.6` với cỡ chữ 20px thành `32px`.
:::

**Bài 2.** Làm một "banner" cao ít nhất 60% chiều cao màn hình, ảnh nền phủ kín, có lớp phủ tối để chữ trắng dễ đọc, tiêu đề cỡ `2.5rem` căn giữa.

::: details Xem lời giải
```html live
<section class="banner">
  <h1>Khám phá Đà Lạt</h1>
  <p>Thành phố ngàn hoa</p>
</section>

<style>
  body { margin: 0; font-family: system-ui, sans-serif; }
  .banner {
    min-height: 60vh;
    padding: 64px 16px;
    text-align: center;
    color: white;
    background:
      linear-gradient(rgb(0 0 0 / 0.5), rgb(0 0 0 / 0.3)),
      url('https://picsum.photos/id/1039/1200/700') center / cover;
  }
  .banner h1 { font-size: 2.5rem; margin: 0 0 8px; }
</style>
```
`center / cover` trong shorthand `background` nghĩa là `background-position: center` và `background-size: cover`. Trong khung ví dụ, `60vh` tính theo chiều cao của khung kết quả.
:::

**Bài 3.** Đổi hệ thống khoảng cách sau từ `px` sang `rem` (gốc 16px): `padding: 24px 32px; margin-bottom: 48px; font-size: 18px; border: 1px solid;`. Thuộc tính nào nên giữ `px`?

::: details Xem lời giải
`padding: 1.5rem 2rem; margin-bottom: 3rem; font-size: 1.125rem;`. Viền `1px` nên giữ nguyên `px`: viền mảnh không cần to lên theo cỡ chữ, và `0.0625rem` khó đọc hơn nhiều.
:::

## Lỗi thường gặp

- **Dùng font không có dấu tiếng Việt** → chữ có dấu lẫn font khác.
- **Tải quá nhiều độ đậm/kiểu của web font** → trang chậm. Chỉ chọn những gì cần.
- **`line-height` có đơn vị px** được kế thừa xuống tiêu đề to → các dòng đè lên nhau.
- **Chữ xám nhạt trên nền trắng**, hoặc chữ trên ảnh nền không có lớp phủ → không đủ tương phản.
- **`opacity` trên khối cha** khi chỉ muốn nền mờ → chữ bên trong cũng mờ theo.
- **Đặt mọi kích thước bằng `px`** → không tôn trọng cỡ chữ người dùng đã chọn.

## Tóm tắt

- `font-family` là danh sách dự phòng, kết thúc bằng họ chung. Web font: Google Fonts hoặc `@font-face` + `font-display: swap`, kiểm tra hỗ trợ tiếng Việt.
- `line-height` không đơn vị (1.5–1.7); dòng chữ khoảng 60 ký tự (`max-width: 60ch`).
- `rem` cho cỡ chữ và khoảng cách, `em` khi muốn tỉ lệ theo chữ của chính phần tử, `%`/`vw`/`vh` cho bố cục, `px` cho chi tiết nhỏ.
- Màu: hex, `rgb()`, `hsl()`, `oklch()`, `color-mix()`; luôn kiểm tra tương phản (4,5:1).
- Nền: `background-size: cover`, chồng gradient lên ảnh; `box-shadow` nhiều lớp cho bóng tự nhiên.

## Kiểm tra kiến thức

<Quiz />
