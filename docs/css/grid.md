---
title: CSS Grid — bố cục hai chiều
description: Grid container, grid-template-columns, đơn vị fr, repeat, minmax, auto-fill và auto-fit, đặt item theo đường kẻ, span, grid-template-areas, căn chỉnh trong grid và subgrid.
quiz:
  - q: "`grid-template-columns: 200px 1fr 1fr` trong container rộng 800px (không có gap). Hai cột `1fr` rộng bao nhiêu?"
    options:
      - "Mỗi cột 200px"
      - "Mỗi cột 300px"
      - "Mỗi cột 400px"
      - "Mỗi cột 266px"
    answer: 1
    explain: "`fr` chia phần **còn lại** sau khi trừ các cột cố định: 800 − 200 = 600px, chia đôi = 300px mỗi cột."
  - q: "`repeat(auto-fit, minmax(200px, 1fr))` làm gì?"
    options:
      - "Luôn có đúng 200 cột"
      - "Tự tạo nhiều cột nhất có thể, mỗi cột ít nhất 200px, rồi giãn đều cho đầy hàng: lưới responsive không cần media query"
      - "Mỗi cột rộng đúng 200px"
      - "Chỉ chạy trên màn hình rộng hơn 200px"
    answer: 1
    explain: "Đây là “câu thần chú” phổ biến nhất của Grid. Màn hình hẹp có thể còn 1 cột, màn hình rộng 4–5 cột, ô luôn đều nhau."
  - q: "`grid-column: 1 / -1` trên một item có nghĩa là gì?"
    options:
      - "Item nằm ở cột 1 và cột cuối"
      - "Item trải từ đường kẻ đầu tiên đến đường kẻ cuối cùng, tức chiếm trọn chiều ngang lưới"
      - "Item bị ẩn"
      - "Item lùi về cột trước"
    answer: 1
    explain: "Grid đánh số các **đường kẻ** (line) từ 1; số âm đếm từ cuối, `-1` là đường cuối cùng. Rất hợp cho header/footer trải hết lưới."
  - q: "Muốn bố cục trang có vùng header, sidebar, main, footer dễ đọc và dễ đổi sắp xếp trên điện thoại, dùng tính năng nào?"
    options:
      - "`grid-template-areas` kết hợp `grid-area` trên từng item"
      - "`float`"
      - "`order` của flexbox"
      - "`position: absolute`"
    answer: 0
    explain: "Bạn “vẽ” bố cục bằng chuỗi tên vùng. Trên điện thoại chỉ cần đổi `grid-template-areas` trong media query là bố cục đổi theo."
  - q: "Khác nhau giữa `auto-fill` và `auto-fit` khi số item ít hơn số cột có thể chứa?"
    options:
      - "Không khác gì"
      - "`auto-fill` giữ các cột trống (item không giãn), `auto-fit` gộp các cột trống lại nên item giãn ra lấp đầy hàng"
      - "`auto-fit` giữ cột trống, `auto-fill` thì giãn"
      - "`auto-fill` chỉ dùng với hàng"
    answer: 1
    explain: "Chỉ khác khi lưới “dư chỗ”. Ví dụ có 2 item trong khung chứa được 5 cột: `auto-fill` để 3 cột trống, `auto-fit` cho 2 item giãn ra hết bề rộng."
---

# CSS Grid — bố cục hai chiều

::: info Mục tiêu bài học
- Hiểu **grid container**, **track** (hàng, cột), **line** (đường kẻ), **cell** (ô), **area** (vùng).
- Định nghĩa cột và hàng với `grid-template-columns`, `fr`, `repeat()`, `minmax()`.
- Làm **lưới responsive không cần media query** với `auto-fit`/`auto-fill`.
- Đặt item theo đường kẻ, cho item **trải nhiều ô** với `span`.
- Dựng bố cục trang bằng `grid-template-areas`; biết dùng `subgrid`.
:::

## 1. Grid là gì?

Flexbox xếp phần tử theo **một chiều**. **Grid** chia không gian thành **lưới hàng và cột**, rồi đặt phần tử vào lưới: điều khiển cùng lúc cả hai chiều.

```html live
<div class="luoi">
  <div>1</div><div>2</div><div>3</div>
  <div>4</div><div>5</div><div>6</div>
</div>

<style>
  body { font-family: system-ui, sans-serif; }
  .luoi {
    display: grid;
    grid-template-columns: 1fr 1fr 1fr;   /* 3 cột bằng nhau */
    gap: 12px;                            /* khoảng cách giữa các ô */
  }
  .luoi > div { padding: 20px; background: #ddd6fe; border-radius: 8px; text-align: center; font-weight: 700; }
</style>
```

Thuật ngữ:

- **Grid container**: phần tử có `display: grid`. **Grid item**: các con trực tiếp của nó.
- **Track**: một hàng hoặc một cột.
- **Line** (đường kẻ): đường phân cách giữa các track, đánh số từ 1. Lưới 3 cột có 4 đường kẻ dọc.
- **Cell**: một ô. **Area**: một vùng chữ nhật gồm nhiều ô.

Mở DevTools → Elements: phần tử grid có nhãn `grid` nhỏ bên cạnh. Bấm vào đó để trình duyệt vẽ đường lưới và số thứ tự đường kẻ lên trang, rất hữu ích khi học.

## 2. Định nghĩa cột và hàng

```css
.luoi {
  display: grid;
  grid-template-columns: 200px 1fr 2fr;  /* cột cố định + chia phần còn lại theo tỉ lệ 1:2 */
  grid-template-rows: auto 1fr auto;     /* hàng: cao theo nội dung, giãn, theo nội dung */
  gap: 16px 24px;                        /* khoảng cách hàng 16px, cột 24px */
}
```

- **`fr`** (fraction) là một **phần của khoảng trống còn lại**, sau khi trừ các track cố định và `gap`.
- `auto`: theo nội dung.
- **`repeat(n, kích-thước)`**: `repeat(4, 1fr)` thay cho `1fr 1fr 1fr 1fr`.
- **`minmax(min, max)`**: track không nhỏ hơn `min` và không lớn hơn `max`. Ví dụ `minmax(200px, 1fr)`.

Nếu có nhiều item hơn số ô đã định nghĩa, Grid **tự tạo thêm hàng** (implicit grid). Chiều cao các hàng tự tạo này chỉnh bằng `grid-auto-rows`:

```css
.luoi {
  grid-template-columns: repeat(3, 1fr);
  grid-auto-rows: minmax(120px, auto);   /* mỗi hàng cao ít nhất 120px */
}
```

## 3. Lưới responsive không cần media query

Đây là kỹ thuật Grid được dùng nhiều nhất:

```html live
<div class="san-pham">
  <div>Áo</div><div>Quần</div><div>Giày</div><div>Mũ</div><div>Túi</div>
</div>

<style>
  body { font-family: system-ui, sans-serif; }
  .san-pham {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
    gap: 12px;
  }
  .san-pham > div { padding: 32px 8px; background: #ffedd5; border-radius: 10px; text-align: center; }
</style>
```

Đọc là: "tạo **nhiều cột nhất có thể**, mỗi cột **ít nhất 140px**, rồi chia đều phần dư". Thu hẹp cửa sổ (mở bằng Playground cho dễ thử) để thấy số cột tự giảm từ 5 xuống 1. Khác với Flexbox wrap, các ô ở hàng cuối vẫn **đều** với hàng trên.

- `auto-fit`: khi có ít item, các cột trống bị gộp lại, nên item **giãn ra** lấp đầy hàng.
- `auto-fill`: giữ lại các cột trống, item **không giãn** quá kích thước một cột.

Mẹo tránh tràn trên màn hình rất hẹp: `minmax(min(140px, 100%), 1fr)`, để cột tối thiểu không bao giờ lớn hơn khung chứa.

## 4. Đặt item theo đường kẻ

```html live
<div class="luoi">
  <div class="lon">Bài nổi bật (2 × 2)</div>
  <div>Tin 1</div>
  <div>Tin 2</div>
  <div class="ngang">Quảng cáo trải hết hàng</div>
  <div>Tin 3</div>
  <div>Tin 4</div>
</div>

<style>
  body { font-family: system-ui, sans-serif; }
  .luoi { display: grid; grid-template-columns: repeat(3, 1fr); grid-auto-rows: 80px; gap: 10px; }
  .luoi > div { padding: 10px; background: #ccfbf1; border-radius: 8px; }
  .luoi > .lon { grid-column: span 2; grid-row: span 2; background: #5eead4; }
  .luoi > .ngang { grid-column: 1 / -1; background: #fde68a; }
</style>
```

| Cách viết | Ý nghĩa |
| --- | --- |
| `grid-column: 2 / 4` | Từ đường kẻ dọc số 2 đến số 4 (chiếm cột 2 và 3) |
| `grid-column: 1 / -1` | Từ đường đầu đến đường **cuối cùng**: trải hết chiều ngang |
| `grid-column: span 2` | Chiếm 2 cột, bắt đầu ở chỗ trống tiếp theo |
| `grid-row: 1 / 3` | Chiếm hàng 1 và 2 |

Item không được đặt vị trí sẽ tự lấp vào các ô trống theo thứ tự. Thêm `grid-auto-flow: dense` để Grid lấp cả các "lỗ" phía trước (khi thứ tự hiển thị không quan trọng, ví dụ một lưới ảnh).

## 5. Đặt tên vùng: `grid-template-areas`

Cách dễ đọc nhất để dựng **bố cục trang**: bạn "vẽ" bố cục bằng chữ.

```html live
<div class="trang">
  <header>Header</header>
  <nav>Menu</nav>
  <main>Nội dung chính</main>
  <aside>Quảng cáo</aside>
  <footer>Footer</footer>
</div>

<style>
  body { font-family: system-ui, sans-serif; margin: 0; }
  .trang {
    display: grid;
    grid-template-columns: 160px 1fr 140px;
    grid-template-rows: auto 1fr auto;
    grid-template-areas:
      "header header header"
      "nav    main   aside"
      "footer footer footer";
    gap: 8px;
    min-height: 320px;
    padding: 8px;
  }
  header { grid-area: header; background: #fed7aa; }
  nav    { grid-area: nav;    background: #ddd6fe; }
  main   { grid-area: main;   background: #fef3c7; }
  aside  { grid-area: aside;  background: #ccfbf1; }
  footer { grid-area: footer; background: #e7e5e4; }
  .trang > * { padding: 12px; border-radius: 6px; }

  /* Màn hình hẹp: xếp chồng thành một cột, chỉ cần "vẽ" lại */
  @media (width < 560px) {
    .trang {
      grid-template-columns: 1fr;
      grid-template-areas: "header" "nav" "main" "aside" "footer";
    }
  }
</style>
```

- Mỗi chuỗi là một hàng, mỗi từ là một cột. Lặp lại tên để vùng trải nhiều ô; vùng phải là hình chữ nhật.
- Dấu `.` là ô trống: `"header header ." `.
- Đổi bố cục cho điện thoại chỉ cần viết lại `grid-template-areas` trong media query (bài [Responsive](/css/responsive)).

## 6. Căn chỉnh trong Grid

Grid dùng chung bộ thuộc tính căn chỉnh với Flexbox:

| Thuộc tính (trên container) | Căn | Trục |
| --- | --- | --- |
| `justify-items` | Nội dung **trong từng ô** | Ngang |
| `align-items` | Nội dung **trong từng ô** | Dọc |
| `place-items` | Viết gọn của hai thuộc tính trên | Cả hai |
| `justify-content`, `align-content` | **Cả lưới** trong container (khi lưới nhỏ hơn container) | Ngang / dọc |

Trên từng item: `justify-self`, `align-self`, `place-self`.

Căn giữa bằng Grid còn ngắn hơn cả Flexbox:

```css
.khung {
  display: grid;
  place-items: center;
}
```

## 7. `subgrid`: thẳng hàng xuyên qua các thẻ

Các thẻ trong lưới có tiêu đề dài ngắn khác nhau, khiến phần mô tả và nút ở mỗi thẻ lệch nhau. `subgrid` cho phép thẻ con **dùng chung đường kẻ hàng** với lưới cha:

```html live
<div class="ds">
  <article class="the"><h3>HTML</h3><p>Cấu trúc trang.</p><a href="#">Học ngay</a></article>
  <article class="the"><h3>CSS cho người mới bắt đầu từ con số 0</h3><p>Trình bày và bố cục, mô tả dài hơn một chút.</p><a href="#">Học ngay</a></article>
  <article class="the"><h3>JavaScript</h3><p>Tương tác.</p><a href="#">Học ngay</a></article>
</div>

<style>
  body { font-family: system-ui, sans-serif; }
  .ds { display: grid; grid-template-columns: repeat(3, 1fr); gap: 12px; }
  .the {
    display: grid;
    grid-row: span 3;               /* mỗi thẻ chiếm 3 hàng của lưới cha */
    grid-template-rows: subgrid;    /* dùng chung 3 hàng đó */
    gap: 8px;
    padding: 12px;
    border: 1px solid #e7e5e4;
    border-radius: 10px;
  }
  .the h3, .the p { margin: 0; }
  .the a { align-self: end; color: #c2410c; }
</style>
```

Tiêu đề, mô tả và liên kết ở cả ba thẻ đều thẳng hàng với nhau, dù độ dài khác nhau. `subgrid` đã có trên mọi trình duyệt chính từ năm 2023.

## Thực hành

**Bài 1.** Làm hai bài **Lưới 3 cột với Grid** và **Responsive với media query** trong [Code Playground](/thuc-hanh/playground).

::: details Xem gợi ý
Bài đầu: `display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px;`. Bài sau: thêm `@media (width < 600px) { .grid { grid-template-columns: 1fr; } }`. Trình chấm sẽ tự đổi bề rộng khung để kiểm tra.
:::

**Bài 2.** Làm thư viện ảnh: các ảnh vuông, lưới tự co giãn với ô tối thiểu 120px, ảnh đầu tiên to gấp đôi (2 cột × 2 hàng). Ảnh phủ kín ô mà không méo.

::: details Xem lời giải
```html live
<div class="thu-vien">
  <img src="https://picsum.photos/id/1015/400/400" alt="Vịnh hẹp giữa núi đá">
  <img src="https://picsum.photos/id/1039/200/200" alt="Thác nước trong rừng">
  <img src="https://picsum.photos/id/1043/200/200" alt="Sông dưới vách núi">
  <img src="https://picsum.photos/id/1050/200/200" alt="Vách đá ven biển và sóng trắng">
  <img src="https://picsum.photos/id/1056/200/200" alt="Bầu trời mây phản chiếu trên cánh đồng muối">
  <img src="https://picsum.photos/id/1069/200/200" alt="Con sứa màu cam trong làn nước xanh">
</div>

<style>
  .thu-vien {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
    grid-auto-rows: 120px;
    gap: 6px;
  }
  .thu-vien img {
    width: 100%;
    height: 100%;
    object-fit: cover;      /* như background-size: cover nhưng cho <img> */
    border-radius: 6px;
  }
  .thu-vien img:first-child {
    grid-column: span 2;
    grid-row: span 2;
  }
</style>
```
`object-fit: cover` giúp ảnh phủ kín ô mà không bị méo, phần thừa bị cắt.
:::

**Bài 3.** Dựng bố cục bảng điều khiển (dashboard): sidebar 220px bên trái chạy hết chiều cao; bên phải là header trên cùng, dưới là vùng nội dung. Dùng `grid-template-areas`.

::: details Xem lời giải
```html live
<div class="dashboard">
  <aside class="sidebar">Sidebar</aside>
  <header class="top">Header</header>
  <main class="content">Nội dung</main>
</div>

<style>
  body { margin: 0; font-family: system-ui, sans-serif; }
  .dashboard {
    display: grid;
    grid-template-columns: 220px 1fr;
    grid-template-rows: 56px 1fr;
    grid-template-areas:
      "sidebar top"
      "sidebar content";
    min-height: 300px;
  }
  .sidebar { grid-area: sidebar; background: #1c1917; color: white; }
  .top { grid-area: top; background: #f5f5f4; border-bottom: 1px solid #e7e5e4; }
  .content { grid-area: content; }
  .dashboard > * { padding: 16px; }
</style>
```
Trong dự án thật, `min-height` của dashboard thường là `100dvh` để luôn cao bằng màn hình.
:::

## Lỗi thường gặp

- **Đặt `grid-template-columns` lên item** thay vì container.
- **Nhầm số cột với số đường kẻ**: lưới 3 cột có 4 đường kẻ, nên trải hết là `1 / 4` hoặc `1 / -1`.
- **Vùng trong `grid-template-areas` không phải hình chữ nhật** (ví dụ chữ L) → cả khai báo bị bỏ qua.
- **Dùng `%` cho cột rồi thêm `gap`** → tổng vượt 100% và tràn. Dùng `fr`, vì `fr` tự trừ `gap`.
- **Nội dung dài làm cột `1fr` phình to**: `1fr` thật ra là `minmax(auto, 1fr)`. Dùng `minmax(0, 1fr)` nếu muốn cột đều tuyệt đối.

## Tóm tắt

- `display: grid` + `grid-template-columns`/`rows` định nghĩa lưới; `gap` cho khoảng cách.
- `fr` chia phần còn lại; `repeat()`, `minmax()` viết gọn và giới hạn kích thước.
- `repeat(auto-fit, minmax(200px, 1fr))` cho lưới responsive không cần media query.
- `grid-column: 1 / -1`, `span 2` để item trải nhiều ô.
- `grid-template-areas` + `grid-area` để "vẽ" bố cục trang, đổi bố cục trên điện thoại chỉ bằng một khai báo.
- `place-items: center` căn giữa; `subgrid` làm nội dung các thẻ thẳng hàng với nhau.

## Kiểm tra kiến thức

<Quiz />
