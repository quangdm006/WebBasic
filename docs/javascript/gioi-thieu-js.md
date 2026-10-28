---
title: JavaScript là gì? Chạy code đầu tiên
description: JavaScript và ECMAScript, JavaScript chạy ở đâu, đưa script vào trang, dùng console để in và thử code, câu lệnh, chú thích, quy ước đặt tên, strict mode và cách đọc thông báo lỗi.
quiz:
  - q: "Quan hệ giữa JavaScript và Java là gì?"
    options:
      - "JavaScript là phiên bản rút gọn của Java"
      - "Hai ngôn ngữ khác nhau hoàn toàn; cái tên chỉ là chiến lược tiếp thị năm 1995"
      - "JavaScript chạy được mọi chương trình Java"
      - "Java là phiên bản mới của JavaScript"
    answer: 1
    explain: "JavaScript được tạo ra tại Netscape năm 1995 trong 10 ngày. Tên “Java” khi đó đang nổi nên được mượn để quảng bá. Tên chuẩn chính thức của ngôn ngữ là ECMAScript."
  - q: "Đặt thẻ `<script src=\"app.js\">` (không có `defer`) trong `<head>` mà trong `app.js` có `document.querySelector('#nut')`. Kết quả thường là gì?"
    options:
      - "Chạy bình thường"
      - "`querySelector` trả về `null` vì lúc script chạy, phần `<body>` chưa được đọc tới"
      - "Trình duyệt tự đợi tải xong trang"
      - "Lỗi cú pháp"
    answer: 1
    explain: "Script thường chạy ngay khi gặp. Thêm `defer` (hoặc dùng `type=\"module\"`, hoặc đặt script cuối `<body>`) để code chạy sau khi HTML đã được đọc xong."
  - q: "Lệnh nào in ra một **bảng** từ mảng các object trong console?"
    options:
      - "`console.log()`"
      - "`console.table()`"
      - "`console.grid()`"
      - "`console.print()`"
    answer: 1
    explain: "`console.table()` hiển thị mỗi object là một hàng, mỗi thuộc tính là một cột. Rất tiện để xem dữ liệu."
  - q: "`ReferenceError: tong is not defined` thường có nghĩa là gì?"
    options:
      - "Biến `tong` có giá trị `0`"
      - "Bạn dùng một tên chưa được khai báo (hoặc gõ sai tên, sai chữ hoa thường)"
      - "Hàm `tong` trả về sai kết quả"
      - "Trình duyệt không hỗ trợ biến"
    answer: 1
    explain: "JavaScript phân biệt chữ hoa thường: `tong`, `Tong` và `tOng` là ba tên khác nhau. Lỗi kèm số dòng giúp bạn tìm đúng chỗ."
  - q: "Quy ước đặt tên biến và hàm phổ biến nhất trong JavaScript là gì?"
    options:
      - "`ten_bien` (snake_case)"
      - "`tenBien` (camelCase)"
      - "`TEN-BIEN`"
      - "`Ten bien`"
    answer: 1
    explain: "Biến và hàm dùng camelCase (`tongTien`, `layDuLieu`), class dùng PascalCase (`NguoiDung`), hằng số cấu hình thường viết HOA_GẠCH_DƯỚI (`SO_LAN_THU_TOI_DA`)."
---

# JavaScript là gì? Chạy code đầu tiên

::: info Mục tiêu bài học
- Hiểu **JavaScript** là gì, chạy ở đâu và quan hệ với chuẩn **ECMAScript**.
- Chạy code JavaScript theo nhiều cách: console của DevTools, ví dụ trong bài, tệp `.js`.
- Đưa JavaScript vào trang đúng cách (`defer`, `type="module"`).
- Dùng **console** để in và thử nghiệm; nắm câu lệnh, chú thích, quy ước đặt tên.
- **Đọc thông báo lỗi** để tự sửa code.
:::

## 1. JavaScript là gì?

**JavaScript** (JS) là ngôn ngữ lập trình chạy trong mọi trình duyệt. Nếu HTML là khung nhà và CSS là phần sơn, thì JavaScript là hệ thống điện: phản hồi khi người dùng bấm, kiểm tra form, tải dữ liệu mới mà không cần tải lại trang, vẽ biểu đồ, làm game...

Vài điều nên biết:

- JS ra đời năm 1995 tại Netscape. Dù tên giống, **JavaScript và Java là hai ngôn ngữ khác hẳn nhau**.
- Tên chuẩn chính thức là **ECMAScript** (ES), do tổ chức Ecma quản lý. Từ năm 2015 (ES2015, còn gọi ES6, bản cập nhật lớn nhất), mỗi năm có một phiên bản mới: ES2016, ES2017... ES2025. Khóa học này dùng JavaScript hiện đại, mọi trình duyệt chính đều đã hỗ trợ.
- Mỗi trình duyệt có một **engine** chạy JS: V8 (Chrome, Edge), SpiderMonkey (Firefox), JavaScriptCore (Safari).
- JS không chỉ chạy trong trình duyệt. **Node.js** (dùng V8) cho phép chạy JS trên máy tính và server. Các công cụ bạn sẽ dùng ở [Phần 4](/nang-cao/module-cong-cu) như npm, Vite đều chạy trên Node.js.

## 2. Chạy đoạn code đầu tiên

**Cách 1: Ví dụ trong bài.** Bấm **▶ Chạy**, kết quả của `console.log()` hiện ở ô Console:

```js run
console.log('Xin chào, JavaScript!');
console.log(2026 - 1995, 'năm tuổi');
console.log('Kết quả 7 × 6 =', 7 * 6);
```

`console.log()` in giá trị ra **console**, nơi lập trình viên xem kết quả và lỗi. Người dùng bình thường không nhìn thấy console.

**Cách 2: Console của DevTools.** Mở DevTools (`F12`) → tab **Console**, gõ `1 + 2` rồi `Enter`. Console vừa là nơi xem log, vừa là nơi **thử nhanh** từng dòng code. Mẹo: `Shift` + `Enter` để xuống dòng mà chưa chạy.

::: warning Đừng dán code lạ vào console
Kẻ gian hay dụ người dùng "dán đoạn mã này vào F12 để nhận quà". Code chạy trong console có toàn quyền với trang bạn đang mở, kể cả tài khoản đang đăng nhập. Chính vì vậy Chrome bắt bạn gõ chữ "allow pasting" trước khi cho dán lần đầu.
:::

**Cách 3: Code Playground.** Tab **JS** của [Playground](/thuc-hanh/playground) cho bạn viết code dài hơn, có HTML và CSS đi kèm.

## 3. Đưa JavaScript vào trang web

```html
<!DOCTYPE html>
<html lang="vi">
<head>
  <meta charset="UTF-8">
  <title>Trang có JavaScript</title>
  <!-- Cách nên dùng: tệp riêng + defer -->
  <script src="js/app.js" defer></script>
</head>
<body>
  <button id="nut">Bấm tôi</button>

  <!-- Cũng được: script viết trực tiếp, đặt cuối body -->
  <script>
    console.log('Trang đã sẵn sàng');
  </script>
</body>
</html>
```

| Cách | Khi nào chạy | Ghi chú |
| --- | --- | --- |
| `<script src="app.js" defer>` trong `<head>` | Sau khi đọc xong HTML, theo thứ tự | **Nên dùng** |
| `<script type="module" src="app.js">` | Giống `defer` | Dùng được `import`/`export` ([bài Module](/nang-cao/module-cong-cu)) |
| `<script>` cuối `<body>` | Ngay khi gặp, lúc này HTML phía trên đã có | Cách truyền thống |
| `<script>` trong `<head>` không `defer` | Ngay khi gặp, khi `<body>` **chưa có** | Tránh: `querySelector` trả về `null` |

Viết JS trong tệp riêng có cùng lợi ích như CSS riêng: dùng lại ở nhiều trang, trình duyệt lưu đệm, HTML gọn gàng. Đừng viết JavaScript trong thuộc tính HTML kiểu `onclick="..."`. Ở [bài Sự kiện](/javascript/su-kien) bạn sẽ dùng `addEventListener`.

## 4. Console — người bạn thân nhất

```js run
console.log('Thông tin thường');
console.info('Thông tin (info)');
console.warn('Cảnh báo: sắp hết dung lượng');
console.error('Lỗi: không lưu được tệp');

const hocVien = [
  { ten: 'An', diem: 9 },
  { ten: 'Bình', diem: 7 },
  { ten: 'Chi', diem: 8 },
];
console.table(hocVien);

console.log('Nhiều giá trị cùng lúc:', 42, true, ['a', 'b'], { lop: 'Web K1' });
```

- `console.log` / `info` / `warn` / `error`: in với mức độ khác nhau. Trong DevTools có thể lọc theo mức.
- `console.table`: in mảng/object thành bảng.
- `console.group('tên')` … `console.groupEnd()`: gom log thành nhóm.
- `console.time('đo')` … `console.timeEnd('đo')`: đo thời gian chạy một đoạn code.

Ô Console trong bài học và Playground hiển thị giá trị giống console của DevTools: chuỗi nằm trong mảng/object có dấu nháy đơn, object hiện dạng `{ten: 'An', diem: 9}`.

## 5. Câu lệnh, chú thích và cách đặt tên

```js run
// Chú thích một dòng: máy bỏ qua, dành cho người đọc code
/*
  Chú thích
  nhiều dòng
*/

let soLuong = 3;                 // mỗi câu lệnh kết thúc bằng dấu ;
let donGia = 25000;
let tongTien = soLuong * donGia;
console.log(tongTien);

// Phân biệt chữ hoa, chữ thường: tongtien và tongTien là hai tên KHÁC nhau
```

- Chương trình là một dãy **câu lệnh** (statement), chạy lần lượt từ trên xuống.
- **Dấu chấm phẩy** `;` kết thúc câu lệnh. JS có cơ chế tự chèn dấu chấm phẩy (ASI) nên quên `;` thường vẫn chạy, nhưng có vài trường hợp hiểu sai. Khóa học này luôn viết `;`. Công cụ Prettier sẽ tự thêm giúp bạn.
- **Khoảng trắng và xuống dòng** không quan trọng với máy, nhưng rất quan trọng với người đọc: thụt lề 2 dấu cách mỗi cấp.
- **Đặt tên**: chữ cái, số, `_`, `$`, không bắt đầu bằng số, không trùng từ khóa (`let`, `if`, `class`...).

| Quy ước | Dùng cho | Ví dụ |
| --- | --- | --- |
| camelCase | Biến, hàm | `tongTien`, `layDanhSach` |
| PascalCase | Class | `NguoiDung`, `GioHang` |
| UPPER_SNAKE_CASE | Hằng số cấu hình | `SO_LAN_THU_TOI_DA` |

Tên biến nên viết tiếng Việt không dấu hoặc tiếng Anh, **thống nhất một kiểu** trong cả dự án. JS cho phép tên có dấu (`const giá = 1`) nhưng đừng làm vậy: khó gõ, dễ lỗi bảng mã. Khóa học dùng tiếng Việt không dấu cho dễ hiểu; trong công việc thực tế, phần lớn các nhóm dùng tiếng Anh.

## 6. Strict mode

Ngày xưa, JavaScript rất "dễ dãi": gán vào biến chưa khai báo sẽ âm thầm tạo biến toàn cục. **Strict mode** biến những lỗi thầm lặng đó thành lỗi thật:

```js
'use strict';
tongTien = 100;   // ReferenceError: tongTien is not defined (không strict thì âm thầm tạo biến toàn cục)
```

Tin tốt: code trong **module** (`type="module"`) và trong **class** tự động chạy strict mode. Code hiện đại gần như luôn ở strict mode mà không cần viết dòng `'use strict'`.

## 7. Đọc thông báo lỗi

Lỗi là chuyện bình thường, kể cả với lập trình viên lâu năm. Kỹ năng quan trọng là **đọc** thông báo lỗi:

```js run
console.log('Dòng này chạy bình thường');
const giaBan = 50000;
console.log(giaban * 2);   // gõ sai chữ hoa/thường
console.log('Dòng này không bao giờ chạy tới');
```

Một thông báo lỗi gồm:

1. **Loại lỗi**: `ReferenceError` (dùng tên chưa khai báo), `TypeError` (dùng sai kiểu, ví dụ gọi thứ không phải hàm, đọc thuộc tính của `undefined`), `SyntaxError` (sai cú pháp, cả tệp không chạy được).
2. **Mô tả**: `giaban is not defined`.
3. **Vị trí**: tệp và số dòng. Trong DevTools, bấm vào là nhảy tới đúng dòng.

Lỗi chưa được xử lý sẽ **dừng** đoạn script đang chạy: các dòng phía sau không được thực hiện. Cách xử lý lỗi bằng `try...catch` có ở [bài Xử lý lỗi & debug](/nang-cao/xu-ly-loi-debug).

::: tip Gặp lỗi lạ?
Copy dòng thông báo lỗi (phần tiếng Anh) để tìm trên Google hoặc hỏi trợ lý AI. Gần như chắc chắn đã có người gặp lỗi đó trước bạn. Nhưng hãy cố hiểu **vì sao** lời giải đúng, đừng chỉ copy lời giải.
:::

## Thực hành

**Bài 1.** Viết code in ra console: tên của bạn, năm sinh, và tuổi của bạn vào năm 2030 (tính bằng phép trừ).

::: details Xem lời giải
```js run
const ten = 'Lan';
const namSinh = 2005;
console.log('Tên:', ten);
console.log('Năm sinh:', namSinh);
console.log('Tuổi vào năm 2030:', 2030 - namSinh);
```
:::

**Bài 2.** Đoạn code sau có 2 lỗi. Chạy thử, đọc thông báo lỗi và sửa.

```js run
const soLuong = 4;
const donGia = 35000;
console.log('Tổng:', soluong * donGia);
console.lg('Cảm ơn quý khách!');
```

::: details Xem lời giải
1. `ReferenceError: soluong is not defined`: biến khai báo là `soLuong` (chữ L hoa).
2. Sửa xong lỗi 1, chạy lại sẽ gặp `TypeError: console.lg is not a function`: gõ thiếu chữ, phải là `console.log`.

Để ý lỗi thứ hai chỉ hiện ra **sau khi** sửa lỗi thứ nhất, vì lỗi đầu tiên đã dừng script.
:::

**Bài 3.** Tạo thư mục `hoc-js` với `index.html` nạp `app.js` bằng `defer`. Trong `app.js`, in một dòng chào. Mở trang bằng Live Preview và xem dòng chào trong Console của DevTools.

::: details Xem gợi ý
```html
<!-- index.html -->
<!DOCTYPE html>
<html lang="vi">
<head>
  <meta charset="UTF-8">
  <title>Học JS</title>
  <script src="app.js" defer></script>
</head>
<body>
  <h1>Mở F12 → Console</h1>
</body>
</html>
```
Nếu Console báo `404` hoặc `Failed to load resource`, kiểm tra tên tệp và đường dẫn trong `src`.
:::

## Lỗi thường gặp

- **Script chạy khi DOM chưa có** (đặt trong `<head>` không `defer`) → `null`.
- **Sai chữ hoa, chữ thường** trong tên biến, tên hàm → `ReferenceError`, `TypeError`.
- **Dùng dấu nháy "thông minh"** (`“ ”`, `‘ ’`) copy từ Word → `SyntaxError: Invalid or unexpected token`. Code chỉ dùng `'`, `"` và `` ` ``.
- **Không mở Console** khi trang "không chạy": hãy luôn mở DevTools khi viết JavaScript.

## Tóm tắt

- JavaScript là ngôn ngữ lập trình của trình duyệt (chuẩn ECMAScript); Node.js cho JS chạy ngoài trình duyệt.
- Chạy thử: ví dụ trong bài, Console của DevTools, Code Playground.
- Nạp script bằng `<script src="..." defer>` hoặc `type="module"`.
- `console.log/warn/error/table` để in và kiểm tra giá trị.
- Câu lệnh kết thúc bằng `;`, chú thích `//` và `/* */`, tên biến camelCase, phân biệt hoa thường.
- Đọc lỗi: loại lỗi, mô tả, số dòng. Lỗi chưa xử lý sẽ dừng script.

## Kiểm tra kiến thức

<Quiz />
