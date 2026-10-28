---
title: "Responsive: media query & container query"
description: Thiết kế responsive, thẻ viewport, mobile-first, media query với cú pháp khoảng giá trị, breakpoint, chữ co giãn bằng clamp, container query, ảnh responsive và các media query về sở thích người dùng.
quiz:
  - q: "Thiếu thẻ `<meta name=\"viewport\" content=\"width=device-width, initial-scale=1\">`, trang trên điện thoại sẽ thế nào?"
    options:
      - "Hiển thị bình thường"
      - "Trình duyệt giả lập màn hình rộng khoảng 980px rồi thu nhỏ cả trang, chữ bé xíu, media query cho màn hình nhỏ không bao giờ khớp"
      - "Trang không tải được"
      - "Chỉ hiện phiên bản dành cho máy tính bảng"
    answer: 1
    explain: "Thẻ viewport báo trình duyệt dùng bề rộng thật của thiết bị. Đây là dòng bắt buộc cho mọi trang responsive."
  - q: "Theo cách viết **mobile-first**, CSS mặc định (ngoài media query) dành cho đâu?"
    options:
      - "Màn hình máy tính lớn"
      - "Màn hình nhỏ (điện thoại); màn hình lớn hơn được bổ sung bằng `@media (width >= ...)`"
      - "Máy tính bảng"
      - "Máy in"
    answer: 1
    explain: "Bắt đầu từ bố cục đơn giản nhất (thường là một cột), rồi thêm dần cho màn hình rộng. CSS gọn hơn và điện thoại không phải tải rồi ghi đè kiểu dành cho máy tính."
  - q: "`font-size: clamp(1.5rem, 1rem + 3vw, 3rem)` có ý nghĩa gì?"
    options:
      - "Cỡ chữ luôn là 3rem"
      - "Cỡ chữ co giãn theo bề rộng màn hình nhưng không nhỏ hơn 1.5rem và không lớn hơn 3rem"
      - "Cỡ chữ ngẫu nhiên trong khoảng"
      - "Cỡ chữ chỉ đổi khi in"
    answer: 1
    explain: "`clamp(min, giá-trị-mong-muốn, max)`. Phần `1rem + 3vw` vừa co giãn vừa giữ một phần theo `rem` để vẫn tôn trọng cỡ chữ người dùng chọn."
  - q: "Container query (`@container`) khác media query ở điểm nào?"
    options:
      - "Container query chỉ chạy trên điện thoại"
      - "Container query dựa vào kích thước của **khối chứa** component, nên cùng một thẻ có thể đổi giao diện tùy chỗ nó được đặt (cột chính hay sidebar)"
      - "Không khác gì, chỉ là cú pháp mới"
      - "Container query dựa vào chiều cao trang"
    answer: 1
    explain: "Media query hỏi “màn hình rộng bao nhiêu?”, container query hỏi “chỗ dành cho tôi rộng bao nhiêu?”. Phải khai báo `container-type` trên khối chứa trước."
  - q: "Media query `(prefers-reduced-motion: reduce)` dùng để làm gì?"
    options:
      - "Phát hiện máy yếu"
      - "Tôn trọng người dùng đã bật tùy chọn giảm chuyển động trong hệ điều hành: tắt hoặc giảm animation"
      - "Phát hiện chế độ tối"
      - "Phát hiện màn hình cảm ứng"
    answer: 1
    explain: "Với người bị rối loạn tiền đình, animation lớn có thể gây chóng mặt, buồn nôn. Tương tự có `prefers-color-scheme` (sáng/tối) và `prefers-contrast`."
---

# Responsive: media query & container query

::: info Mục tiêu bài học
- Hiểu **thiết kế responsive** và vai trò của thẻ **viewport**.
- Viết **media query** theo hướng **mobile-first**, dùng cú pháp khoảng giá trị hiện đại.
- Làm chữ và khoảng cách **co giãn mượt** với `clamp()`.
- Dùng **container query** cho component tự thích nghi theo chỗ đặt.
- Tôn trọng **sở thích người dùng**: chế độ tối, giảm chuyển động; viết CSS cho bản in.
:::

## 1. Responsive là gì?

Hơn một nửa lượt truy cập web ở Việt Nam đến từ điện thoại. **Thiết kế responsive** là làm một trang duy nhất hiển thị tốt trên mọi kích thước màn hình, từ điện thoại 360px đến màn hình 2560px, thay vì làm riêng một bản "mobile".

Ba nguyên liệu chính:

1. **Bố cục linh hoạt**: Flexbox, Grid, đơn vị `%`, `fr`, `max-width` thay vì độ rộng cố định.
2. **Media/container query**: đổi CSS khi không gian thay đổi.
3. **Ảnh và chữ linh hoạt**: `max-width: 100%`, `srcset`, `clamp()`.

Thực ra, phần lớn công việc đã được giải quyết bằng nguyên liệu số 1. Lưới `repeat(auto-fit, minmax(...))` ở [bài Grid](/css/grid) hay hàng thẻ `flex-wrap` ở [bài Flexbox](/css/flexbox) đã tự thích nghi mà không cần một media query nào.

## 2. Thẻ viewport — dòng bắt buộc

```html
<meta name="viewport" content="width=device-width, initial-scale=1">
```

Thiếu dòng này, trình duyệt điện thoại giả định trang được thiết kế cho màn hình khoảng 980px rồi **thu nhỏ** cả trang cho vừa: chữ bé xíu, phải phóng to mới đọc được, và media query cho màn hình nhỏ không bao giờ khớp. Đừng thêm `user-scalable=no` hay `maximum-scale=1`: chặn phóng to gây khó khăn cho người mắt kém.

**Thử trên DevTools:** bấm biểu tượng điện thoại (**Toggle device toolbar**, `Ctrl` + `Shift` + `M`) để giả lập các thiết bị, hoặc kéo bề rộng tùy ý.

## 3. Media query

```css
/* Khi cửa sổ rộng từ 768px trở lên */
@media (width >= 768px) {
  .luoi { grid-template-columns: repeat(2, 1fr); }
}

/* Cú pháp cũ, tương đương, vẫn gặp rất nhiều */
@media (min-width: 768px) {
  .luoi { grid-template-columns: repeat(2, 1fr); }
}

/* Khoảng giữa hai giá trị */
@media (600px <= width < 1024px) { ... }

/* Kết hợp điều kiện */
@media (width >= 768px) and (orientation: landscape) { ... }
```

Cú pháp **khoảng giá trị** (`width >= 768px`) dễ đọc hơn `min-width`/`max-width` và tránh được lỗi "lệch 1px" ở đúng điểm chuyển. Mọi trình duyệt chính đều đã hỗ trợ từ năm 2023.

## 4. Mobile-first

Viết CSS **cho màn hình nhỏ trước** (thường là bố cục một cột, đơn giản nhất), sau đó **bổ sung** cho màn hình lớn hơn:

```html live
<div class="trang">
  <header>Header</header>
  <main>Nội dung chính</main>
  <aside>Sidebar</aside>
  <footer>Footer</footer>
</div>

<style>
  body { margin: 0; font-family: system-ui, sans-serif; }
  .trang > * { padding: 16px; border-radius: 8px; }
  header { background: #fed7aa; } main { background: #fef3c7; min-height: 120px; }
  aside { background: #ddd6fe; } footer { background: #e7e5e4; }

  /* Mặc định (điện thoại): một cột */
  .trang { display: grid; gap: 8px; padding: 8px; }

  /* Từ 640px: nội dung và sidebar nằm cạnh nhau */
  @media (width >= 640px) {
    .trang {
      grid-template-columns: 1fr 200px;
      grid-template-areas: "header header" "main aside" "footer footer";
    }
    header { grid-area: header; } main { grid-area: main; }
    aside { grid-area: aside; } footer { grid-area: footer; }
  }
</style>
```

Mở ví dụ trong Playground rồi kéo hẹp cửa sổ để thấy bố cục đổi ở mốc 640px.

**Chọn breakpoint (điểm chuyển) thế nào?** Đừng chọn theo tên thiết bị ("iPhone 15", "iPad"), vì thiết bị mới ra liên tục. Hãy kéo hẹp trang dần, **chỗ nào bố cục bắt đầu xấu** (dòng chữ quá dài, thẻ bị bóp méo) thì đặt breakpoint ở đó. Vài mốc tham khảo hay dùng: 640px, 768px, 1024px, 1280px. Dùng 2–4 mốc là đủ cho hầu hết website.

## 5. Chữ và khoảng cách co giãn với `clamp()`

Thay vì nhảy cỡ chữ ở từng breakpoint, `clamp()` cho chữ **lớn dần mượt mà** theo bề rộng màn hình, có chặn trên và chặn dưới:

```html live
<h1 class="lon">Tiêu đề co giãn mượt</h1>
<p>Kéo hẹp hoặc nới rộng cửa sổ (trong Playground) để thấy tiêu đề và khoảng đệm thay đổi.</p>

<style>
  body { font-family: system-ui, sans-serif; }
  .lon {
    font-size: clamp(1.75rem, 1rem + 4vw, 3.5rem);  /* min, mong muốn, max */
    line-height: 1.15;
    padding-block: clamp(1rem, 4vw, 3rem);
    margin: 0;
  }
</style>
```

`clamp(MIN, MONG-MUỐN, MAX)`: dùng giá trị mong muốn, nhưng không nhỏ hơn MIN, không lớn hơn MAX. Hãy để phần mong muốn có cả `rem` (như `1rem + 4vw`) thay vì chỉ `vw`, để chữ vẫn to lên khi người dùng phóng to trang.

Các hàm tương tự: `min(a, b)` lấy giá trị nhỏ hơn, ví dụ `width: min(100%, 720px)`; `max(a, b)` lấy giá trị lớn hơn.

## 6. Container query

Media query hỏi "**màn hình** rộng bao nhiêu?". Nhưng một thẻ sản phẩm có thể nằm ở cột chính rộng 800px **hoặc** ở sidebar hẹp 250px trên cùng một màn hình. **Container query** hỏi "**chỗ dành cho tôi** rộng bao nhiêu?":

```html live
<div class="bo-cuc">
  <div class="cot-chinh"><article class="the"><img src="https://picsum.photos/id/1050/240/160" alt="Vách đá ven biển" width="240" height="160"><div><h3>Tour biển Phú Yên</h3><p>Ghềnh Đá Đĩa, Bãi Xép, Mũi Điện — 3 ngày 2 đêm.</p></div></article></div>
  <div class="sidebar"><article class="the"><img src="https://picsum.photos/id/1050/240/160" alt="Vách đá ven biển" width="240" height="160"><div><h3>Tour biển Phú Yên</h3><p>Ghềnh Đá Đĩa, Bãi Xép, Mũi Điện — 3 ngày 2 đêm.</p></div></article></div>
</div>

<style>
  body { font-family: system-ui, sans-serif; }
  .bo-cuc { display: grid; grid-template-columns: 2fr 1fr; gap: 12px; }

  /* 1. Khai báo khối chứa có thể "được hỏi" về bề rộng */
  .cot-chinh, .sidebar { container-type: inline-size; }

  .the { display: grid; gap: 10px; padding: 10px; border: 1px solid #e7e5e4; border-radius: 10px; }
  .the img { width: 100%; height: auto; border-radius: 6px; }
  .the h3, .the p { margin: 0 0 4px; }

  /* 2. Khi khối chứa rộng từ 360px: ảnh bên trái, chữ bên phải */
  @container (width >= 360px) {
    .the { grid-template-columns: 160px 1fr; align-items: start; }
  }
</style>
```

Cùng một thẻ, cùng một CSS: ở cột chính nó nằm ngang, ở sidebar nó xếp dọc. Component trở nên **độc lập với bố cục trang**, dùng ở đâu cũng đúng. Container query (theo kích thước) đã có trên mọi trình duyệt chính từ năm 2023.

- `container-type: inline-size`: cho phép hỏi bề rộng. Đặt trên **khối chứa**, không phải trên chính component.
- Có thể đặt tên: `container-name: sidebar;` rồi `@container sidebar (width >= 300px)`.
- Đơn vị `cqi` = 1% bề rộng khối chứa, ví dụ `font-size: clamp(1rem, 4cqi, 1.5rem)`.

## 7. Ảnh và media responsive

Nhắc lại từ [bài head & media](/html/head-media):

```css
img, video {
  max-width: 100%;
  height: auto;
}
```

Kèm `srcset`/`sizes` để điện thoại tải ảnh nhỏ, `<picture>` khi cần ảnh cắt khác cho màn hình hẹp. Với khung video hay bản đồ nhúng, `aspect-ratio: 16 / 9; width: 100%` giữ tỉ lệ khi co giãn.

## 8. Tôn trọng sở thích người dùng

Media query còn đọc được cài đặt của hệ điều hành:

```css
/* Người dùng bật giao diện tối */
@media (prefers-color-scheme: dark) {
  :root { --nen: #18181b; --chu: #f4f4f5; }
}

/* Người dùng bật "giảm chuyển động" (Windows: Hiệu ứng hoạt ảnh; iOS: Giảm chuyển động) */
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    transition-duration: 0.01ms !important;
    scroll-behavior: auto !important;
  }
}

/* Thiết bị dùng chuột (có hover thật) */
@media (hover: hover) and (pointer: fine) {
  .the:hover { transform: translateY(-2px); }
}

/* Khi in trang */
@media print {
  nav, footer, .quang-cao { display: none; }
  a[href^="http"]::after { content: " (" attr(href) ")"; }
}
```

- `prefers-color-scheme`: làm chế độ tối (chi tiết ở [bài CSS hiện đại](/css/css-hien-dai)).
- `prefers-reduced-motion`: đây là trường hợp `!important` hợp lý, vì nó phải thắng mọi animation khác.
- `hover`/`pointer`: trên màn hình cảm ứng không có "di chuột". Đừng giấu thông tin quan trọng sau `:hover`.

## Thực hành

**Bài 1.** Làm bài **Responsive với media query** trong [Code Playground](/thuc-hanh/playground).

::: details Xem gợi ý
`@media (width < 600px) { .grid { grid-template-columns: 1fr; } }`. Trình chấm tự đổi bề rộng khung kết quả thành 800px và 400px để kiểm tra.
:::

**Bài 2.** Viết lại CSS sau theo hướng **mobile-first**, dùng cú pháp khoảng giá trị:

```css
.menu { display: flex; gap: 24px; }
.menu a { padding: 8px; }
@media (max-width: 767px) {
  .menu { flex-direction: column; gap: 0; }
  .menu a { padding: 12px 16px; border-bottom: 1px solid #e7e5e4; }
}
```

::: details Xem lời giải
```css
/* Mặc định cho điện thoại */
.menu { display: flex; flex-direction: column; }
.menu a { padding: 12px 16px; border-bottom: 1px solid #e7e5e4; }

/* Từ 768px trở lên */
@media (width >= 768px) {
  .menu { flex-direction: row; gap: 24px; }
  .menu a { padding: 8px; border-bottom: 0; }
}
```
Trên điện thoại, link có vùng bấm lớn hơn (`12px 16px`), điều quan trọng với ngón tay.
:::

**Bài 3.** Làm khối "giới thiệu": tiêu đề co giãn từ `2rem` đến `4rem`, khung nội dung rộng tối đa 65 ký tự, padding hai bên co giãn từ `1rem` đến `4rem`. Không dùng media query.

::: details Xem lời giải
```html live
<section class="gioi-thieu">
  <h1>Học web không khó</h1>
  <p>Bắt đầu với HTML, thêm chút CSS và JavaScript. Mỗi ngày một ít, sau 8 tuần bạn đã tự làm được trang web hoàn chỉnh của riêng mình.</p>
</section>

<style>
  body { margin: 0; font-family: system-ui, sans-serif; }
  .gioi-thieu {
    padding-inline: clamp(1rem, 6vw, 4rem);
    padding-block: 2rem;
  }
  .gioi-thieu h1 {
    font-size: clamp(2rem, 1.2rem + 4vw, 4rem);
    line-height: 1.1;
    margin: 0 0 1rem;
  }
  .gioi-thieu p {
    max-width: 65ch;
    font-size: 1.125rem;
    line-height: 1.7;
  }
</style>
```
:::

## Lỗi thường gặp

- **Quên thẻ viewport** → mọi media query cho điện thoại "không chạy".
- **Đặt `width` cố định bằng px** cho khối lớn → tràn ngang trên điện thoại. Dùng `max-width`.
- **Kiểm tra bằng cách thu nhỏ cửa sổ máy tính** mà không thử trên điện thoại thật → bỏ sót bàn phím ảo, vùng an toàn (tai thỏ), cảm ứng.
- **Breakpoint theo thiết bị cụ thể**, hoặc quá nhiều breakpoint.
- **Container query không chạy** vì quên `container-type` trên khối chứa, hoặc đặt nó lên chính phần tử muốn đổi kiểu.
- **Giấu thông tin quan trọng sau `:hover`** → người dùng cảm ứng không bao giờ thấy.

## Tóm tắt

- Thẻ viewport là bắt buộc. Bố cục linh hoạt (Flexbox, Grid, `max-width`) giải quyết phần lớn bài toán.
- Media query: `@media (width >= 768px)`; viết **mobile-first**; chọn breakpoint theo nội dung.
- `clamp(min, mong-muốn, max)` cho chữ và khoảng cách co giãn mượt.
- Container query: `container-type: inline-size` trên khối chứa + `@container (width >= ...)`. Component thích nghi theo chỗ đặt.
- Media query về sở thích: `prefers-color-scheme`, `prefers-reduced-motion`, `hover`/`pointer`, `print`.

## Kiểm tra kiến thức

<Quiz />
