---
title: Nhập môn CSS
description: CSS là gì, cú pháp rule, selector và khai báo, ba cách đưa CSS vào trang, selector cơ bản (thẻ, class, id), class nhiều giá trị, kế thừa và cách xem CSS bằng DevTools.
quiz:
  - q: "Trong rule `h1 { color: navy; }`, phần `color: navy;` gọi là gì?"
    options:
      - "Selector"
      - "Một khai báo (declaration) gồm thuộc tính và giá trị"
      - "Một thẻ HTML"
      - "Một class"
    answer: 1
    explain: "`h1` là selector (chọn phần tử nào), phần trong ngoặc nhọn gồm các khai báo `thuộc-tính: giá-trị;`."
  - q: "Cách đưa CSS vào trang nào được khuyên dùng cho một website nhiều trang?"
    options:
      - "Viết `style=\"...\"` trực tiếp trên từng thẻ"
      - "Đặt `<style>` trong `<head>` của mỗi trang"
      - "Tệp `.css` riêng, nạp bằng `<link rel=\"stylesheet\">`"
      - "Viết CSS trong JavaScript"
    answer: 2
    explain: "Tệp riêng dùng chung cho mọi trang: sửa một chỗ là đổi cả website, và trình duyệt chỉ tải tệp đó một lần rồi lưu vào bộ đệm."
  - q: "Selector `.nut` chọn phần tử nào?"
    options:
      - "Phần tử có `id=\"nut\"`"
      - "Mọi phần tử có class `nut` trong danh sách class"
      - "Mọi thẻ `<nut>`"
      - "Phần tử có `name=\"nut\"`"
    answer: 1
    explain: "Dấu chấm cho class, dấu `#` cho id. `<button class=\"nut nut-lon\">` khớp cả `.nut` lẫn `.nut-lon`."
  - q: "Đặt `color: green` cho `<body>`. Vì sao chữ trong `<p>` bên trong cũng màu xanh, nhưng viền (`border`) thì không lan xuống?"
    options:
      - "Vì `<p>` không có viền"
      - "Vì một số thuộc tính (chữ, màu chữ...) được **kế thừa** từ phần tử cha, còn các thuộc tính như border, padding, margin thì không"
      - "Vì trình duyệt bị lỗi"
      - "Vì `color` mạnh hơn `border`"
    answer: 1
    explain: "Thuộc tính liên quan đến chữ (`color`, `font-*`, `line-height`...) kế thừa để bạn không phải đặt lại ở mọi nơi. Thuộc tính về hộp (`border`, `margin`, `background`...) thì không."
  - q: "Vì sao nên dùng class thay vì id để định kiểu?"
    options:
      - "Vì id không dùng được trong CSS"
      - "Vì class dùng lại được cho nhiều phần tử và có độ ưu tiên thấp hơn, dễ ghi đè hơn"
      - "Vì id chỉ dành cho JavaScript"
      - "Vì class nhanh hơn 100 lần"
    answer: 1
    explain: "Mỗi id chỉ được xuất hiện một lần trong trang và có độ ưu tiên rất cao (bài sau), làm CSS khó ghi đè. Class linh hoạt hơn nhiều."
---

# Nhập môn CSS

::: info Mục tiêu bài học
- Hiểu **CSS** làm gì và đọc được cú pháp một **rule**.
- Biết ba cách đưa CSS vào trang và chọn cách phù hợp.
- Dùng **selector** cơ bản: theo thẻ, theo class, theo id, nhóm nhiều selector.
- Hiểu **kế thừa** (inheritance) và giá trị mặc định của trình duyệt.
- Xem và sửa thử CSS bằng **DevTools**.
:::

## 1. CSS là gì?

**CSS** (Cascading Style Sheets) quyết định trang web **trông ra sao**: màu sắc, font chữ, khoảng cách, bố cục, hiệu ứng. HTML nói "đây là tiêu đề", CSS nói "tiêu đề màu cam, cỡ 32px, căn giữa".

Tách nội dung (HTML) khỏi trình bày (CSS) mang lại lợi ích lớn: cùng một HTML có thể có nhiều giao diện (sáng/tối, máy tính/điện thoại, bản in), và đổi giao diện cả website chỉ bằng cách sửa một tệp CSS.

## 2. Cú pháp một rule

```css
h1 {                 /* selector: chọn mọi thẻ <h1> */
  color: #c2410c;    /* khai báo: thuộc tính color, giá trị #c2410c */
  font-size: 32px;   /* khai báo thứ hai */
}
```

- **Selector**: chọn phần tử nào được áp dụng.
- **Khai báo**: `thuộc-tính: giá-trị;`, mỗi khai báo kết thúc bằng dấu `;`.
- Toàn bộ khối trên là một **rule**. Tệp CSS là một danh sách rule.
- Chú thích trong CSS viết trong `/* ... */`.

```html live
<h1>Quán cà phê Phố Cổ</h1>
<p>Mở cửa từ 7:00 đến 22:00 hằng ngày.</p>

<style>
  /* Mọi thẻ h1 */
  h1 {
    color: #c2410c;
    font-family: Georgia, serif;
    text-align: center;
  }

  /* Mọi đoạn văn */
  p {
    color: #44403c;
    font-size: 18px;
    background-color: #fff7ed;
    padding: 12px;
  }
</style>
```

CSS **không báo lỗi**: viết sai tên thuộc tính hay giá trị, trình duyệt chỉ lặng lẽ bỏ qua khai báo đó và đọc tiếp. Khi CSS "không ăn", DevTools là nơi đầu tiên cần mở (mục 7).

## 3. Ba cách đưa CSS vào trang

**1. Tệp CSS riêng (nên dùng):**

```html
<!-- index.html -->
<head>
  <link rel="stylesheet" href="css/style.css">
</head>
```

```css
/* css/style.css */
h1 {
  color: #c2410c;
}
```

**2. Thẻ `<style>` trong trang** (cho trang đơn lẻ, ví dụ nhỏ, hoặc CSS chỉ dùng cho riêng trang đó):

```html
<head>
  <style>
    h1 { color: #c2410c; }
  </style>
</head>
```

**3. Thuộc tính `style` trên thẻ** (inline):

```html
<h1 style="color: #c2410c; font-size: 32px;">Tiêu đề</h1>
```

| Cách | Ưu điểm | Nhược điểm |
| --- | --- | --- |
| Tệp riêng | Dùng chung mọi trang, trình duyệt lưu đệm, HTML gọn | Thêm một request (không đáng kể) |
| `<style>` | Nhanh gọn cho một trang | Không dùng lại được cho trang khác |
| `style="..."` | Tiện khi JavaScript đổi style động | Trộn trình bày vào nội dung, khó bảo trì, độ ưu tiên rất cao |

::: tip Trong khóa học này
Các ví dụ dùng `<style>` đặt chung với HTML cho gọn. Khi làm dự án thật, hãy tách CSS ra tệp riêng. Nút **✎ Sửa trong Playground** tự chuyển phần `<style>` sang tab CSS.
:::

## 4. Selector cơ bản

```html live
<h1 id="tieu-de">Thực đơn</h1>
<p>Đồ uống hôm nay:</p>
<p class="mon">Cà phê sữa đá</p>
<p class="mon noi-bat">Bạc xỉu — món mới!</p>
<p class="ghi-chu">Giá đã gồm VAT.</p>

<style>
  /* 1. Theo thẻ: mọi <p> */
  p { font-family: system-ui, sans-serif; }

  /* 2. Theo class: phần tử có class="mon" */
  .mon { padding-left: 16px; border-left: 4px solid #fdba74; }

  /* 3. Phần tử có CẢ hai class mon và noi-bat (viết liền, không dấu cách) */
  .mon.noi-bat { border-left-color: #c2410c; font-weight: bold; }

  /* 4. Theo id: phần tử có id="tieu-de" */
  #tieu-de { letter-spacing: 2px; }

  /* 5. Nhóm nhiều selector cách nhau bởi dấu phẩy */
  h1, .ghi-chu { color: #78716c; }

  /* 6. Mọi phần tử */
  * { margin-top: 4px; }
</style>
```

| Selector | Chọn | Ví dụ |
| --- | --- | --- |
| `p` | Mọi phần tử theo **tên thẻ** | `p`, `h1`, `button` |
| `.ten` | Phần tử có **class** `ten` | `.mon`, `.nut-chinh` |
| `#ten` | Phần tử có **id** `ten` (duy nhất trong trang) | `#tieu-de` |
| `a, b` | **Nhóm**: chọn cả `a` và `b` | `h1, h2, h3` |
| `.a.b` | Phần tử có **cả hai** class | `.mon.noi-bat` |
| `*` | **Mọi** phần tử | `*` |

Một phần tử có thể có **nhiều class**, cách nhau bởi dấu cách: `class="mon noi-bat"`. Đây là cách phổ biến nhất để "lắp ghép" giao diện: một class cho kiểu chung, các class khác cho biến thể.

**Class hay id?** Hầu như luôn dùng **class** để định kiểu. Id chỉ xuất hiện một lần trong trang và có độ ưu tiên rất cao, nên CSS viết bằng id khó ghi đè về sau ([bài sau](/css/selector-cascade)). Hãy để id cho liên kết `#neo`, cho `<label for>` và cho JavaScript.

**Đặt tên class** theo **vai trò**, không theo hình thức: `.canh-bao` tốt hơn `.chu-do`, vì một ngày nào đó cảnh báo có thể chuyển sang màu cam. Dùng chữ thường, nối bằng gạch ngang.

## 5. Kế thừa

Một số thuộc tính tự **truyền từ cha xuống con**:

```html live
<article>
  <h2>Kế thừa</h2>
  <p>Đoạn văn này không có CSS riêng nhưng vẫn có font và màu của article.</p>
  <p>Nhưng viền và nền <strong>không</strong> được truyền xuống.</p>
</article>

<style>
  article {
    font-family: Georgia, serif;   /* kế thừa */
    color: #1e3a8a;                /* kế thừa */
    border: 2px solid #93c5fd;     /* KHÔNG kế thừa */
    padding: 8px 16px;             /* KHÔNG kế thừa */
  }
</style>
```

- **Kế thừa**: phần lớn thuộc tính liên quan đến **chữ**: `color`, `font-family`, `font-size`, `font-weight`, `line-height`, `text-align`, `letter-spacing`, `list-style`, `visibility`, `cursor`.
- **Không kế thừa**: thuộc tính về **hộp**: `margin`, `padding`, `border`, `background`, `width`, `height`, `display`, `position`.

Nhờ kế thừa, bạn chỉ cần đặt font và màu chữ một lần trên `body`. Muốn ép kế thừa, dùng giá trị `inherit`; muốn về giá trị mặc định của thuộc tính, dùng `initial`.

::: warning Ngoại lệ hay gây bối rối
Ô nhập và nút (`<input>`, `<button>`, `<select>`, `<textarea>`) **không** kế thừa font từ trang. Hầu hết các bộ CSS đều thêm: `button, input, select, textarea { font: inherit; }`.
:::

## 6. CSS mặc định của trình duyệt

Ngay cả khi bạn chưa viết dòng CSS nào, `<h1>` vẫn to và đậm, `<a>` vẫn xanh và gạch chân, `<body>` có lề 8px. Đó là **stylesheet mặc định** (user agent stylesheet) của trình duyệt. CSS của bạn được viết **chồng lên** nó.

Nhiều dự án bắt đầu bằng một đoạn "reset" nhẹ cho đồng nhất:

```css
*,
*::before,
*::after {
  box-sizing: border-box;   /* giải thích ở bài Box model */
}

body {
  margin: 0;
  font-family: system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif;
  line-height: 1.5;
}

img {
  max-width: 100%;
  height: auto;
}

button, input, select, textarea {
  font: inherit;
}
```

## 7. Xem và sửa CSS bằng DevTools

1. Chuột phải vào phần tử → **Kiểm tra** (Inspect).
2. Trong bảng **Styles**, bạn thấy mọi rule đang áp dụng lên phần tử, rule ưu tiên cao nằm trên.
3. Khai báo bị **gạch ngang** là bị rule khác ghi đè. Khai báo có **dấu cảnh báo vàng** là viết sai tên thuộc tính hoặc giá trị.
4. Bấm vào giá trị để sửa thử, bấm ô vuông màu để mở bộ chọn màu, bấm vào khoảng trống trong rule để thêm khai báo mới.
5. Tab **Computed** cho biết giá trị **cuối cùng** của từng thuộc tính và nó đến từ rule nào.

Sửa trong DevTools chỉ là tạm thời. Thử ở đó cho đẹp rồi copy sang tệp CSS.

## Thực hành

**Bài 1.** Làm bài **Màu sắc & chữ** trong [Code Playground](/thuc-hanh/playground). Trình chấm sẽ kiểm tra font của `body`, màu của `h1` và cỡ chữ của `.lead`.

::: details Xem gợi ý
Ba rule: `body { font-family: system-ui, sans-serif; }`, `h1 { color: #c2410c; }`, `.lead { font-size: 20px; line-height: 1.6; }`. Chữ trong `.lead` không bị ảnh hưởng bởi rule `p` nào cả, vì bài chưa có rule `p`.
:::

**Bài 2.** Cho HTML sau. Viết CSS để: toàn trang dùng font không chân; mọi nút có nền xám nhạt; nút `.chinh` có nền cam `#c2410c` chữ trắng; nút có cả `.chinh` và `.lon` thì cỡ chữ 20px.

```html
<button>Hủy</button>
<button class="chinh">Lưu</button>
<button class="chinh lon">Đặt hàng ngay</button>
```

::: details Xem lời giải
```html live
<button>Hủy</button>
<button class="chinh">Lưu</button>
<button class="chinh lon">Đặt hàng ngay</button>

<style>
  body {
    font-family: system-ui, sans-serif;
  }

  button {
    font: inherit;
    padding: 8px 14px;
    border: 1px solid #d6d3d1;
    border-radius: 6px;
    background: #f5f5f4;
  }

  .chinh {
    background: #c2410c;
    border-color: #c2410c;
    color: white;
  }

  .chinh.lon {
    font-size: 20px;
  }
</style>
```
`font: inherit` cần thiết vì nút không tự kế thừa font của trang.
:::

**Bài 3.** Mở một website bất kỳ, dùng DevTools đổi màu nền trang và font của tiêu đề chính. Tìm một khai báo bị gạch ngang và giải thích vì sao nó bị ghi đè.

::: details Xem gợi ý
Chọn `<body>` trong tab Elements, thêm `background: pink` vào rule `element.style` ở đầu bảng Styles. Khai báo gạch ngang thường do một rule khác có selector mạnh hơn hoặc nằm sau trong tệp. Bài tiếp theo giải thích chi tiết quy tắc này.
:::

## Lỗi thường gặp

- **Quên dấu `;`** giữa các khai báo → khai báo sau bị hiểu sai và bỏ qua.
- **Thiếu dấu chấm** khi chọn class (`mon` thay vì `.mon`) → selector tìm thẻ `<mon>` không tồn tại.
- **Viết dấu cách giữa hai class** (`.mon .noi-bat`) khi muốn "có cả hai class" → đó lại là selector **con cháu** (bài sau).
- **Đường dẫn `href` của `<link>` sai** → toàn bộ CSS không được nạp. Kiểm tra tab Network xem tệp CSS có bị `404` không.
- **Tưởng CSS báo lỗi như JavaScript** → CSS lặng lẽ bỏ qua. Hãy xem dấu cảnh báo trong DevTools.

## Tóm tắt

- Rule CSS = selector + các khai báo `thuộc-tính: giá-trị;`.
- Dùng tệp `.css` riêng nạp bằng `<link rel="stylesheet">`; `<style>` cho trang lẻ; `style="..."` hạn chế dùng.
- Selector cơ bản: thẻ `p`, class `.ten`, id `#ten`, nhóm `a, b`, kết hợp `.a.b`, tất cả `*`.
- Ưu tiên class để định kiểu, đặt tên theo vai trò.
- Thuộc tính về chữ được kế thừa, thuộc tính về hộp thì không; ô nhập và nút cần `font: inherit`.
- DevTools → Styles/Computed để xem rule nào đang áp dụng và rule nào bị ghi đè.

## Kiểm tra kiến thức

<Quiz />
