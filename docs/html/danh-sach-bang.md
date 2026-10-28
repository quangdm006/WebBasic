---
title: Danh sách & bảng
description: Danh sách không thứ tự, có thứ tự, lồng nhau, danh sách mô tả; bảng với thead, tbody, tfoot, caption, scope, gộp ô colspan, rowspan và khi nào không nên dùng bảng.
quiz:
  - q: "Các bước của một công thức nấu ăn nên dùng loại danh sách nào?"
    options:
      - "`<ul>` vì danh sách nào cũng như nhau"
      - "`<ol>` vì thứ tự các bước có ý nghĩa"
      - "`<dl>` vì có tên món"
      - "Nhiều `<p>` có đánh số bằng tay"
    answer: 1
    explain: "`<ol>` (ordered list) dành cho danh sách mà đổi thứ tự sẽ đổi nghĩa. Trình duyệt tự đánh số, và trình đọc màn hình báo “mục 2 trên 5”."
  - q: "Phần tử con trực tiếp hợp lệ của `<ul>` là gì?"
    options:
      - "`<li>`, và chỉ `<li>`"
      - "`<li>` hoặc `<p>`"
      - "Bất kỳ phần tử nào"
      - "`<ul>` không có con"
    answer: 0
    explain: "Con trực tiếp của `<ul>`/`<ol>` phải là `<li>`. Muốn danh sách lồng nhau thì đặt `<ul>` mới **bên trong** một `<li>`."
  - q: "Thuộc tính `colspan=\"3\"` trên một ô `<td>` có tác dụng gì?"
    options:
      - "Ô chiếm chiều rộng của 3 cột"
      - "Ô chiếm chiều cao của 3 hàng"
      - "Bảng có 3 cột"
      - "Lặp nội dung ô 3 lần"
    answer: 0
    explain: "`colspan` gộp ô theo chiều ngang (nhiều cột), `rowspan` gộp theo chiều dọc (nhiều hàng). Nhớ bớt số ô ở hàng (hoặc các hàng) bị chiếm chỗ."
  - q: "`<th scope=\"col\">` khác `<td>` ở điểm nào quan trọng nhất?"
    options:
      - "Chỉ khác là chữ đậm và căn giữa"
      - "`<th>` là ô **tiêu đề**; `scope` cho trình đọc màn hình biết nó làm tiêu đề cho cột hay hàng"
      - "`<th>` chỉ được dùng trong `<tfoot>`"
      - "`<th>` không được chứa chữ"
    answer: 1
    explain: "Khi đọc một ô dữ liệu, trình đọc màn hình đọc kèm tiêu đề cột/hàng tương ứng (“Giá: 35.000 ₫”). Kiểu chữ đậm chỉ là hiển thị mặc định."
  - q: "Vì sao ngày nay không dùng `<table>` để dàn trang (chia cột header, sidebar, nội dung)?"
    options:
      - "Vì bảng không hiển thị được trên Chrome"
      - "Vì bảng mang ý nghĩa dữ liệu dạng lưới; dàn trang là việc của CSS (Flexbox, Grid)"
      - "Vì bảng chỉ có tối đa 3 cột"
      - "Vì bảng làm trang chạy chậm 10 lần"
    answer: 1
    explain: "Dàn trang bằng bảng làm sai ngữ nghĩa (trình đọc màn hình đọc như dữ liệu), khó responsive và khó bảo trì. CSS Grid làm việc này tốt hơn nhiều."
---

# Danh sách & bảng

::: info Mục tiêu bài học
- Dùng đúng **danh sách không thứ tự** `<ul>`, **có thứ tự** `<ol>` và **danh sách mô tả** `<dl>`.
- Lồng danh sách nhiều cấp đúng cú pháp.
- Dựng **bảng** đầy đủ: `<caption>`, `<thead>`, `<tbody>`, `<tfoot>`, ô tiêu đề `<th>` có `scope`.
- **Gộp ô** bằng `colspan` và `rowspan`.
- Biết khi nào **không nên** dùng bảng.
:::

## 1. Danh sách không thứ tự và có thứ tự

```html live
<h3>Cần mua</h3>
<ul>
  <li>Trứng</li>
  <li>Sữa tươi</li>
  <li>Bánh mì</li>
</ul>

<h3>Cách luộc trứng lòng đào</h3>
<ol>
  <li>Đun sôi nước.</li>
  <li>Thả trứng vào, luộc đúng 6 phút.</li>
  <li>Vớt ra ngâm nước đá 2 phút.</li>
</ol>
```

- `<ul>` (*unordered list*): đổi thứ tự không đổi nghĩa, ví dụ danh sách đi chợ hay các tính năng sản phẩm.
- `<ol>` (*ordered list*): thứ tự có ý nghĩa, ví dụ các bước, bảng xếp hạng.
- Mỗi mục là một `<li>` (*list item*), và **chỉ `<li>`** mới được làm con trực tiếp của `<ul>`/`<ol>`.

`<ol>` có vài thuộc tính hữu ích:

```html live
<ol start="5">
  <li>Bắt đầu từ số 5</li>
  <li>Số 6</li>
</ol>
<ol type="A">
  <li>Đánh dấu bằng chữ A, B, C...</li>
  <li>Hợp với đáp án trắc nghiệm</li>
</ol>
<ol reversed>
  <li>Đếm ngược: 3</li>
  <li>2</li>
  <li>1</li>
</ol>
```

Kiểu dấu đầu dòng (chấm tròn, ô vuông, không có gì...) thuộc phần trình bày, nên chỉnh bằng CSS `list-style`. Thanh menu ngang bạn thấy trên các website thường là một `<ul>` đã được CSS bỏ dấu chấm và xếp ngang (bài [Flexbox](/css/flexbox)).

## 2. Danh sách lồng nhau

Danh sách con phải nằm **bên trong** một `<li>`, ngay sau nội dung của mục đó:

```html live
<ul>
  <li>Front-end
    <ul>
      <li>HTML</li>
      <li>CSS</li>
      <li>JavaScript</li>
    </ul>
  </li>
  <li>Back-end
    <ul>
      <li>Node.js</li>
      <li>Cơ sở dữ liệu</li>
    </ul>
  </li>
</ul>
```

```html
<!-- ❌ Sai: <ul> con là con trực tiếp của <ul> cha -->
<ul>
  <li>Front-end</li>
  <ul>
    <li>HTML</li>
  </ul>
</ul>
```

## 3. Danh sách mô tả `<dl>`

Dùng cho các cặp **thuật ngữ – mô tả**: từ điển, câu hỏi thường gặp, thông số kỹ thuật.

```html live
<dl>
  <dt>HTML</dt>
  <dd>Ngôn ngữ đánh dấu mô tả nội dung trang web.</dd>

  <dt>CSS</dt>
  <dd>Ngôn ngữ định kiểu, quyết định trang trông ra sao.</dd>

  <dt>Trọng lượng</dt>
  <dd>1,2 kg</dd>
</dl>
```

`<dt>` (*term*) là thuật ngữ, `<dd>` (*description*) là phần mô tả. Một `<dt>` có thể có nhiều `<dd>`, và ngược lại.

## 4. Bảng: cấu trúc cơ bản

Bảng dành cho **dữ liệu dạng lưới**: mỗi hàng là một đối tượng, mỗi cột là một thuộc tính.

```html live
<table>
  <caption>Bảng giá đồ uống</caption>
  <thead>
    <tr>
      <th scope="col">Món</th>
      <th scope="col">Size M</th>
      <th scope="col">Size L</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <th scope="row">Cà phê sữa</th>
      <td>29.000 ₫</td>
      <td>35.000 ₫</td>
    </tr>
    <tr>
      <th scope="row">Trà đào</th>
      <td>35.000 ₫</td>
      <td>42.000 ₫</td>
    </tr>
  </tbody>
  <tfoot>
    <tr>
      <td colspan="3">Giá đã gồm VAT</td>
    </tr>
  </tfoot>
</table>
```

| Thẻ | Ý nghĩa |
| --- | --- |
| `<table>` | Bao toàn bộ bảng |
| `<caption>` | Tiêu đề của bảng, đặt **ngay sau** `<table>`. Giúp mọi người biết bảng nói về gì |
| `<thead>`, `<tbody>`, `<tfoot>` | Phần đầu (tiêu đề cột), thân (dữ liệu), chân (tổng cộng, ghi chú) |
| `<tr>` | Một hàng (*table row*) |
| `<th>` | Ô **tiêu đề** (*table header*); `scope="col"` cho cột, `scope="row"` cho hàng |
| `<td>` | Ô **dữ liệu** (*table data*) |

::: tip Vì sao cần `<th>` và `scope`?
Người nhìn thấy bảng tự dóng hàng, dóng cột để hiểu "35.000 ₫ là giá trà đào size M". Trình đọc màn hình chỉ làm được vậy khi biết ô nào là tiêu đề. Nó sẽ đọc kiểu "Trà đào, Size M, 35.000 đồng".
:::

Bảng mặc định trông khá "trần" (không có đường kẻ). Chỉ cần vài dòng CSS là gọn gàng hơn:

```html live
<table>
  <thead>
    <tr><th scope="col">Học viên</th><th scope="col">HTML</th><th scope="col">CSS</th></tr>
  </thead>
  <tbody>
    <tr><th scope="row">An</th><td>9</td><td>8</td></tr>
    <tr><th scope="row">Bình</th><td>7</td><td>9</td></tr>
  </tbody>
</table>

<style>
  table { border-collapse: collapse; font-family: system-ui, sans-serif; }
  th, td { border: 1px solid #d4d4d8; padding: 6px 12px; text-align: left; }
  thead th { background: #f4f4f5; }
</style>
```

## 5. Gộp ô: `colspan` và `rowspan`

- `colspan="n"`: ô rộng bằng **n cột**.
- `rowspan="n"`: ô cao bằng **n hàng**.

Ô bị gộp chiếm chỗ của các ô khác, nên **hàng đó (hoặc các hàng bên dưới) phải bớt đi số ô tương ứng**.

```html live
<table>
  <caption>Lịch học tuần 1</caption>
  <thead>
    <tr>
      <th scope="col">Buổi</th>
      <th scope="col">Thứ Hai</th>
      <th scope="col">Thứ Ba</th>
      <th scope="col">Thứ Tư</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <th scope="row">Sáng</th>
      <td colspan="2">Dự án nhóm (2 ngày)</td>
      <td>HTML</td>
    </tr>
    <tr>
      <th scope="row">Chiều</th>
      <td rowspan="2">Thực hành</td>
      <td>CSS</td>
      <td>CSS</td>
    </tr>
    <tr>
      <th scope="row">Tối</th>
      <!-- Thứ Hai đã bị ô "Thực hành" phía trên chiếm -->
      <td>Tự học</td>
      <td>Tự học</td>
    </tr>
  </tbody>
</table>

<style>
  table { border-collapse: collapse; font-family: system-ui, sans-serif; }
  th, td { border: 1px solid #d4d4d8; padding: 6px 10px; }
  td[colspan], td[rowspan] { background: #ffedd5; text-align: center; }
</style>
```

Mẹo đếm: vẽ bảng ra giấy trước, rồi kiểm tra **mỗi hàng có tổng số cột bằng nhau** sau khi tính cả các ô `colspan` và các ô bị `rowspan` từ hàng trên chiếm chỗ.

## 6. Khi nào không nên dùng bảng?

Trước năm 2010, người ta hay dùng `<table>` để **dàn trang**: header một hàng, sidebar một cột, nội dung một cột. Đừng làm vậy nữa:

- Sai ngữ nghĩa: trình đọc màn hình đọc trang như một bảng dữ liệu.
- Khó responsive: trên điện thoại không thể biến 3 cột thành 1 cột.
- Code rối, khó sửa.

Hãy dùng thẻ ngữ nghĩa ([bài 6](/html/html-ngu-nghia)) và **CSS Grid/Flexbox** ([Phần 2](/css/flexbox)). Chỉ dùng bảng khi nội dung *thật sự* là dữ liệu dạng hàng và cột.

Bảng nhiều cột trên điện thoại dễ tràn màn hình. Cách đơn giản là bọc bảng trong một khối cho phép cuộn ngang:

```html
<div style="overflow-x: auto">
  <table>...</table>
</div>
```

## Thực hành

**Bài 1.** Làm trang "Câu hỏi thường gặp" cho một khóa học với ba câu hỏi, dùng `<dl>`. Sau đó thêm một danh sách có thứ tự gồm 3 bước đăng ký, trong đó bước 2 có danh sách con (không thứ tự) gồm 2 phương thức thanh toán.

::: details Xem lời giải
```html live
<h2>Câu hỏi thường gặp</h2>
<dl>
  <dt>Khóa học kéo dài bao lâu?</dt>
  <dd>Khoảng 8 tuần nếu học 1 giờ mỗi ngày.</dd>
  <dt>Có cần biết lập trình trước không?</dt>
  <dd>Không cần, khóa học bắt đầu từ con số 0.</dd>
  <dt>Học xong có chứng chỉ không?</dt>
  <dd>Có, sau khi hoàn thành dự án cuối khóa.</dd>
</dl>

<h2>Cách đăng ký</h2>
<ol>
  <li>Tạo tài khoản bằng email.</li>
  <li>Chọn phương thức thanh toán:
    <ul>
      <li>Chuyển khoản ngân hàng</li>
      <li>Ví điện tử</li>
    </ul>
  </li>
  <li>Nhận email xác nhận và bắt đầu học.</li>
</ol>
```
:::

**Bài 2.** Dựng bảng điểm 3 học viên × 3 môn (HTML, CSS, JS) có `<caption>`, `<thead>`, `<th scope>` cho cả cột và hàng, và một hàng `<tfoot>` ghi "Điểm trung bình lớp" với ô gộp `colspan` hợp lý.

::: details Xem lời giải
```html live
<table>
  <caption>Bảng điểm lớp Web K1</caption>
  <thead>
    <tr>
      <th scope="col">Học viên</th>
      <th scope="col">HTML</th>
      <th scope="col">CSS</th>
      <th scope="col">JS</th>
    </tr>
  </thead>
  <tbody>
    <tr><th scope="row">An</th><td>9</td><td>8</td><td>7</td></tr>
    <tr><th scope="row">Bình</th><td>7</td><td>9</td><td>8</td></tr>
    <tr><th scope="row">Chi</th><td>8</td><td>7</td><td>9</td></tr>
  </tbody>
  <tfoot>
    <tr>
      <th scope="row">Điểm trung bình lớp</th>
      <td colspan="3">8,0</td>
    </tr>
  </tfoot>
</table>

<style>
  table { border-collapse: collapse; font-family: system-ui, sans-serif; }
  th, td { border: 1px solid #d4d4d8; padding: 6px 12px; }
</style>
```
:::

## Lỗi thường gặp

- **Đặt nội dung trực tiếp trong `<ul>`** (không có `<li>`) hoặc đặt `<ul>` con ngay trong `<ul>` cha.
- **Đánh số bằng tay** ("1.", "2.") trong `<ul>` thay vì dùng `<ol>`.
- **Số ô trong các hàng không khớp** khi dùng `colspan`/`rowspan`, làm bảng bị lệch cột.
- **Dùng `<td>` có chữ đậm thay cho `<th>`**: nhìn giống nhau nhưng mất ngữ nghĩa.
- **Dùng bảng để dàn trang.**

## Tóm tắt

- `<ul>` khi thứ tự không quan trọng, `<ol>` khi thứ tự có ý nghĩa; con trực tiếp luôn là `<li>`.
- Danh sách lồng nhau: đặt `<ul>`/`<ol>` mới **bên trong** `<li>`.
- `<dl>` + `<dt>` + `<dd>` cho các cặp thuật ngữ – mô tả.
- Bảng đầy đủ: `<caption>`, `<thead>`, `<tbody>`, `<tfoot>`, `<tr>`, `<th scope>`, `<td>`.
- `colspan` gộp theo cột, `rowspan` gộp theo hàng; nhớ bớt ô bị chiếm chỗ.
- Bảng chỉ dành cho dữ liệu dạng lưới, không dùng để dàn trang.

## Kiểm tra kiến thức

<Quiz />
