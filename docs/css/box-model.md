---
title: Box model & display
description: Mọi phần tử là một hộp gồm content, padding, border, margin; box-sizing border-box, gộp margin, width, height, min và max, overflow, các giá trị display và cách ẩn phần tử.
quiz:
  - q: "Phần tử có `width: 200px; padding: 20px; border: 5px solid` và `box-sizing` mặc định (`content-box`). Bề rộng hiển thị là bao nhiêu?"
    options:
      - "200px"
      - "225px"
      - "250px"
      - "240px"
    answer: 2
    explain: "Với `content-box`, `width` chỉ là phần nội dung: 200 + 20 × 2 (padding) + 5 × 2 (border) = 250px. Với `border-box` thì đúng 200px."
  - q: "Hai đoạn văn liền nhau, đoạn trên có `margin-bottom: 30px`, đoạn dưới có `margin-top: 20px`. Khoảng cách giữa chúng là bao nhiêu?"
    options:
      - "50px"
      - "30px"
      - "20px"
      - "10px"
    answer: 1
    explain: "Margin dọc của các khối liền kề bị **gộp** (margin collapsing): chỉ lấy giá trị lớn hơn. Margin ngang và margin trong Flexbox/Grid không bị gộp."
  - q: "Đặt `width` và `margin-top` cho một thẻ `<span>` nhưng không thấy tác dụng. Vì sao?"
    options:
      - "Vì `<span>` là phần tử inline: `width`, `height` và margin dọc không áp dụng"
      - "Vì `<span>` không nhận được CSS"
      - "Vì phải dùng đơn vị %"
      - "Vì thiếu `!important`"
    answer: 0
    explain: "Phần tử inline chảy theo dòng chữ. Đổi sang `display: inline-block` (vẫn nằm trong dòng) hoặc `block` để kích thước và margin dọc có tác dụng."
  - q: "Khác nhau giữa `display: none` và `visibility: hidden`?"
    options:
      - "Không khác gì"
      - "`display: none` gỡ phần tử khỏi bố cục (không chiếm chỗ); `visibility: hidden` vẫn giữ chỗ trống"
      - "`visibility: hidden` xóa phần tử khỏi HTML"
      - "`display: none` chỉ ẩn trên điện thoại"
    answer: 1
    explain: "Cả hai đều ẩn với trình đọc màn hình. Muốn ẩn khỏi mắt nhưng vẫn đọc được cho trình đọc màn hình thì dùng lớp “visually-hidden”."
  - q: "Cách nào căn giữa theo chiều ngang một khối có `width: 600px`?"
    options:
      - "`text-align: center` trên chính khối đó"
      - "`margin: 0 auto` (margin trái phải bằng `auto`)"
      - "`padding: auto`"
      - "`align: center`"
    answer: 1
    explain: "`auto` chia đều khoảng trống còn lại cho hai bên. `text-align: center` chỉ căn giữa nội dung inline (chữ, ảnh) **bên trong** khối."
---

# Box model & display

::: info Mục tiêu bài học
- Hiểu **box model**: mọi phần tử là một hộp gồm content, padding, border, margin.
- Dùng `box-sizing: border-box` và hiểu vì sao gần như mọi dự án đều bật nó.
- Nắm hiện tượng **gộp margin** và cách căn giữa bằng `margin: auto`.
- Kiểm soát kích thước với `width`, `height`, `min-*`, `max-*` và `overflow`.
- Phân biệt các giá trị `display` và các cách **ẩn** phần tử.
:::

## 1. Mọi thứ đều là một cái hộp

Trình duyệt vẽ mỗi phần tử thành một **hộp chữ nhật** gồm bốn lớp, từ trong ra ngoài:

```html live
<div class="hop">Nội dung (content)</div>

<style>
  body { font-family: system-ui, sans-serif; padding: 16px; }
  .hop {
    width: 220px;
    padding: 24px;                  /* đệm trong: nằm giữa nội dung và viền */
    border: 8px solid #c2410c;      /* viền */
    margin: 32px;                   /* lề ngoài: khoảng cách với phần tử khác */
    background: #fed7aa;            /* nền phủ cả content và padding */
    outline: 32px solid #ede9fe;    /* chỉ để tô màu vùng margin cho dễ thấy */
  }
</style>
```

| Lớp | Thuộc tính | Ghi chú |
| --- | --- | --- |
| **Content** | `width`, `height` | Nơi chứa chữ, ảnh, phần tử con |
| **Padding** | `padding` | Khoảng đệm **bên trong** viền, có màu nền của phần tử |
| **Border** | `border` | Viền |
| **Margin** | `margin` | Khoảng cách **bên ngoài**, luôn trong suốt |

Mở DevTools → Elements → tab **Computed**: ở đầu tab có sơ đồ box model của phần tử đang chọn, với số đo từng lớp. Di chuột lên phần tử trong tab Elements, trình duyệt tô màu từng lớp ngay trên trang.

## 2. Viết padding, margin, border

```css
.the {
  padding: 16px;               /* cả 4 phía */
  padding: 8px 16px;           /* trên-dưới 8px, trái-phải 16px */
  padding: 8px 16px 24px;      /* trên 8, trái-phải 16, dưới 24 */
  padding: 8px 16px 24px 32px; /* theo chiều kim đồng hồ: trên, phải, dưới, trái */
  padding-top: 8px;            /* từng phía riêng */

  border: 1px solid #d4d4d8;   /* độ dày, kiểu, màu */
  border-bottom: 3px dashed #c2410c;
  border-radius: 8px;          /* bo góc */
  border-radius: 50%;          /* hình tròn nếu phần tử vuông */
}
```

Kiểu viền thường gặp: `solid`, `dashed`, `dotted`, `double`, `none`.

**Thuộc tính logic.** `margin-inline` (trái-phải), `margin-block` (trên-dưới), `padding-inline-start`... tự đổi chiều theo hướng viết của ngôn ngữ (ví dụ tiếng Ả Rập viết từ phải sang trái). Bạn sẽ gặp chúng ngày càng nhiều trong CSS hiện đại: `margin-inline: auto` là cách viết gọn để căn giữa.

## 3. `box-sizing`: bẫy lớn nhất của người mới

Mặc định (`box-sizing: content-box`), `width` chỉ tính **phần nội dung**. Padding và border được **cộng thêm** vào:

```html live
<div class="a">content-box: width 200px</div>
<div class="b">border-box: width 200px</div>

<style>
  body { font-family: system-ui, sans-serif; }
  div { width: 200px; padding: 20px; border: 5px solid #7c3aed; margin-bottom: 12px; background: #ede9fe; }
  .a { box-sizing: content-box; }  /* hiển thị rộng 200 + 40 + 10 = 250px */
  .b { box-sizing: border-box; }   /* hiển thị rộng đúng 200px */
</style>
```

Với `border-box`, `width` là bề rộng **cả hộp** (gồm padding và border), dễ tính toán hơn hẳn: "cột rộng 50%" là đúng 50%, thêm padding không làm vỡ bố cục. Vì vậy hầu hết dự án đều bắt đầu bằng:

```css
*,
*::before,
*::after {
  box-sizing: border-box;
}
```

## 4. Gộp margin (margin collapsing)

Margin **dọc** của hai khối liền kề không cộng lại mà **gộp**, chỉ lấy giá trị lớn hơn:

```html live
<p class="tren">margin-bottom: 30px</p>
<p class="duoi">margin-top: 20px → khoảng cách chỉ là 30px</p>

<style>
  p { background: #fef3c7; margin: 0; font-family: system-ui, sans-serif; }
  .tren { margin-bottom: 30px; }
  .duoi { margin-top: 20px; }
</style>
```

Margin của phần tử con đầu tiên cũng có thể "trồi" ra ngoài phần tử cha (khi cha không có padding hay border ở phía đó). Đây là lý do `<h1>` đầu trang đôi khi đẩy cả khối header xuống.

Hiện tượng gộp **không xảy ra** với margin ngang, với phần tử trong Flexbox/Grid, hay khi cha có `padding`/`border`. Nhiều người tránh hẳn chuyện này bằng quy ước **chỉ dùng margin một phía** (ví dụ chỉ `margin-bottom`), hoặc dùng `gap` của Flexbox/Grid.

## 5. Kích thước: width, height, min, max

```css
.khung {
  width: 100%;            /* theo phần tử cha */
  max-width: 720px;       /* nhưng không rộng quá 720px */
  margin-inline: auto;    /* căn giữa theo chiều ngang */
  min-height: 200px;      /* cao ít nhất 200px, nội dung nhiều thì cao hơn */
}

img {
  max-width: 100%;        /* ảnh không bao giờ tràn ra khỏi khung chứa */
  height: auto;           /* giữ đúng tỉ lệ */
}
```

- Phần tử khối mặc định **rộng hết** phần tử cha (`width: auto`) và **cao vừa nội dung**. Thường thì bạn **không cần** đặt `height`; đặt cứng chiều cao là nguồn gốc của rất nhiều lỗi tràn chữ.
- Bộ ba `width: 100%; max-width: ...; margin-inline: auto` là cách kinh điển tạo **khung nội dung** căn giữa, co lại trên màn hình nhỏ.
- `margin: auto` (trái-phải) chỉ căn giữa được khối **có bề rộng xác định** nhỏ hơn cha.
- `aspect-ratio: 16 / 9` giữ tỉ lệ khung hình, ví dụ cho khung video hay ảnh bìa.

## 6. Khi nội dung tràn: `overflow`

```html live
<div class="o visible">overflow: visible (mặc định) — chữ tràn ra ngoài khung mà vẫn hiển thị, đè lên phần khác.</div>
<div class="o hidden">overflow: hidden — phần tràn bị cắt mất, người dùng không đọc được.</div>
<div class="o auto">overflow: auto — hiện thanh cuộn khi cần. Thêm chữ cho dài ra một chút để thấy thanh cuộn xuất hiện ở đây.</div>

<style>
  body { font-family: system-ui, sans-serif; display: flex; gap: 16px; align-items: flex-start; }
  .o { width: 150px; height: 70px; border: 2px solid #a8a29e; padding: 4px; margin-bottom: 40px; }
  .visible { overflow: visible; }
  .hidden { overflow: hidden; }
  .auto { overflow: auto; }
</style>
```

`overflow-x`, `overflow-y` điều khiển riêng từng chiều. Chữ quá dài không có dấu cách (URL, mã đơn hàng) dễ làm vỡ khung trên điện thoại; `overflow-wrap: anywhere` cho phép ngắt ở bất kỳ đâu. `text-overflow: ellipsis` kèm `white-space: nowrap; overflow: hidden` để cắt chữ thành "…".

## 7. `display`: phần tử hiển thị thế nào

```html live
<p>
  <span class="i">inline</span> nằm trong dòng chữ, width/height không có tác dụng.
  <span class="ib">inline-block</span> nằm trong dòng nhưng nhận width, height, margin.
</p>
<span class="b">block: chiếm cả dòng</span>

<style>
  body { font-family: system-ui, sans-serif; }
  span { padding: 4px 8px; margin: 10px; width: 160px; height: 40px; background: #ddd6fe; }
  .i { display: inline; }
  .ib { display: inline-block; background: #bbf7d0; }
  .b { display: block; background: #fed7aa; }
</style>
```

| Giá trị | Hành vi |
| --- | --- |
| `block` | Bắt đầu dòng mới, rộng hết cha, nhận đủ width/height/margin/padding |
| `inline` | Nằm trong dòng chữ; **bỏ qua** width, height, margin trên-dưới |
| `inline-block` | Nằm trong dòng nhưng có kích thước như khối (nút bấm, huy hiệu) |
| `flex` | Bật **Flexbox** cho các con ([bài Flexbox](/css/flexbox)) |
| `grid` | Bật **Grid** cho các con ([bài Grid](/css/grid)) |
| `none` | Gỡ hẳn khỏi trang |

`display` thay đổi **cách hiển thị**, không đổi **ý nghĩa**: `<a>` có `display: block` vẫn là một liên kết.

## 8. Các cách ẩn phần tử

| Cách | Chiếm chỗ? | Trình đọc màn hình? | Bấm được? |
| --- | --- | --- | --- |
| `display: none` (hoặc thuộc tính HTML `hidden`) | Không | Không đọc | Không |
| `visibility: hidden` | Có (để lại khoảng trống) | Không đọc | Không |
| `opacity: 0` | Có | **Vẫn đọc** | **Vẫn bấm được** (dễ gây lỗi) |
| Lớp `.visually-hidden` | Không | **Vẫn đọc** | Không |

Lớp `.visually-hidden` ẩn khỏi mắt nhưng giữ cho trình đọc màn hình, dùng cho nhãn của nút chỉ có icon, hay tiêu đề phụ trợ:

```css
.visually-hidden {
  position: absolute;
  width: 1px;
  height: 1px;
  margin: -1px;
  padding: 0;
  overflow: hidden;
  clip-path: inset(50%);
  white-space: nowrap;
  border: 0;
}
```

## Thực hành

**Bài 1.** Làm bài **Box model: thẻ card** trong [Code Playground](/thuc-hanh/playground): thẻ `.card` rộng đúng 300px kể cả padding và viền.

::: details Xem gợi ý
`box-sizing: border-box` làm `width: 300px` bao gồm cả padding và border. Kiểm tra bằng DevTools: sơ đồ box model trong tab Computed phải cho tổng bề rộng 300.
:::

**Bài 2.** Tạo khung bài viết rộng tối đa 680px, căn giữa trang, cách hai mép màn hình ít nhất 16px trên điện thoại. Bên trong là một ảnh không bao giờ tràn ra ngoài khung.

::: details Xem lời giải
```html live
<article class="khung">
  <h1>Một ngày ở Hội An</h1>
  <img src="https://picsum.photos/id/1043/1200/600" alt="Dòng sông phẳng lặng dưới vách núi đá và rừng thông" width="1200" height="600">
  <p>Ảnh gốc rộng 1200px nhưng không bao giờ tràn khỏi khung 680px.</p>
</article>

<style>
  *, *::before, *::after { box-sizing: border-box; }
  body { margin: 0; font-family: system-ui, sans-serif; }
  .khung {
    max-width: 680px;
    margin-inline: auto;
    padding-inline: 16px;
  }
  img {
    max-width: 100%;
    height: auto;
    border-radius: 8px;
  }
</style>
```
Nhờ `border-box`, padding nằm **bên trong** 680px. Không cần `width: 100%` vì khối mặc định đã rộng hết cha.
:::

**Bài 3.** Làm một "huy hiệu" (badge) nhỏ trong dòng chữ: nền tím nhạt, bo tròn hai đầu, có padding, và có `margin-top`. Thử với `display: inline` rồi đổi sang `inline-block` để thấy khác biệt.

::: details Xem lời giải
```html live
<p>Khóa học CSS <span class="badge">Mới</span> vừa được cập nhật.</p>

<style>
  body { font-family: system-ui, sans-serif; }
  .badge {
    display: inline-block;   /* đổi thành inline để so sánh */
    padding: 2px 10px;
    margin-top: 10px;        /* chỉ có tác dụng với inline-block */
    border-radius: 999px;    /* số rất lớn → bo tròn hai đầu */
    font-size: 0.8em;
    font-weight: 600;
    color: #6d28d9;
    background: #ede9fe;
  }
</style>
```
:::

## Lỗi thường gặp

- **Quên `box-sizing: border-box`** → thêm padding là bố cục vỡ, các cột 50% + 50% rơi xuống dòng.
- **Đặt cứng `height`** cho khối chứa chữ → chữ tràn ra ngoài khi nội dung dài hơn hoặc màn hình hẹp hơn. Dùng `min-height`.
- **Bất ngờ vì margin bị gộp** hoặc margin của con "trồi" ra ngoài cha.
- **Đặt `width`, `margin-top` cho phần tử inline** và thắc mắc vì sao không có tác dụng.
- **Ẩn bằng `opacity: 0`** → phần tử vô hình nhưng vẫn bấm được và vẫn nhận focus.

## Tóm tắt

- Hộp = content + padding + border + margin. Nền phủ content và padding; margin luôn trong suốt.
- `box-sizing: border-box` làm `width`/`height` tính cả padding và border. Hãy bật cho mọi phần tử.
- Margin dọc của khối liền kề bị gộp (lấy giá trị lớn hơn).
- `max-width` + `margin-inline: auto` để có khung căn giữa; `img { max-width: 100%; height: auto; }`.
- `overflow` xử lý nội dung tràn: `visible`, `hidden`, `auto`.
- `display`: `block`, `inline`, `inline-block`, `flex`, `grid`, `none`. Ẩn phần tử bằng `display: none`, `visibility: hidden` hoặc `.visually-hidden` tùy mục đích.

## Kiểm tra kiến thức

<Quiz />
