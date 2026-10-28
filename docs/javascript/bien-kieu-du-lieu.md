---
title: Biến, kiểu dữ liệu & toán tử
description: Khai báo biến với let, const (và vì sao tránh var), các kiểu dữ liệu nguyên thủy, typeof, chuỗi và template literal, số và các bẫy số thực, toán tử số học, so sánh, logic, toán tử nullish và chuyển đổi kiểu.
quiz:
  - q: "Đoạn `const gia = 100; gia = 120;` chạy thế nào?"
    options:
      - "`gia` thành 120"
      - "Lỗi `TypeError: Assignment to constant variable.`"
      - "`gia` vẫn là 100, không báo gì"
      - "`gia` thành `undefined`"
    answer: 1
    explain: "`const` không cho **gán lại**. Cần đổi giá trị thì dùng `let`. Lưu ý: `const` với object/mảng vẫn cho sửa nội dung bên trong, chỉ không cho gán sang object khác."
  - q: "`'5' + 3` và `'5' - 3` lần lượt cho kết quả gì?"
    options:
      - "`8` và `2`"
      - "`'53'` và `2`"
      - "`'53'` và `'5-3'`"
      - "Lỗi cả hai"
    answer: 1
    explain: "`+` với một chuỗi thì **nối chuỗi**. Còn `-` chỉ có nghĩa với số, nên `'5'` bị tự đổi thành số 5. Tránh dựa vào chuyển kiểu ngầm: hãy đổi rõ ràng bằng `Number()`."
  - q: "`typeof null` trả về gì?"
    options:
      - "`'null'`"
      - "`'object'`"
      - "`'undefined'`"
      - "`'number'`"
    answer: 1
    explain: "Đây là lỗi lịch sử từ phiên bản JavaScript đầu tiên và được giữ lại để không làm hỏng các trang web cũ. Kiểm tra null bằng `x === null`."
  - q: "Vì sao nên dùng `===` thay cho `==`?"
    options:
      - "`===` nhanh gấp 3 lần"
      - "`===` so sánh cả kiểu dữ liệu, không tự chuyển kiểu nên không có kết quả bất ngờ như `0 == ''` là `true`"
      - "`==` đã bị xóa khỏi JavaScript"
      - "`===` dùng cho chuỗi, `==` dùng cho số"
    answer: 1
    explain: "`==` chuyển kiểu theo những quy tắc khó nhớ: `'' == 0`, `'0' == 0`, `null == undefined` đều `true`. Dùng `===` và `!==` để code dễ đoán."
  - q: "`const soLuong = 0; const hienThi = soLuong ?? 10;` thì `hienThi` bằng bao nhiêu?"
    options:
      - "`10`"
      - "`0`"
      - "`null`"
      - "`undefined`"
    answer: 1
    explain: "`??` chỉ dùng giá trị bên phải khi bên trái là `null` hoặc `undefined`. Nếu viết `soLuong || 10` thì sẽ ra 10, vì `0` bị coi là falsy, sai với ý định khi 0 là giá trị hợp lệ."
  - q: "`0.1 + 0.2 === 0.3` cho kết quả gì?"
    options:
      - "`true`"
      - "`false`, vì số thực dạng nhị phân không biểu diễn chính xác 0,1 và 0,2"
      - "Lỗi"
      - "`NaN`"
    answer: 1
    explain: "`0.1 + 0.2` ra `0.30000000000000004`. Với tiền tệ, hãy tính bằng số nguyên (đồng, xu), hoặc làm tròn khi hiển thị."
---

# Biến, kiểu dữ liệu & toán tử

::: info Mục tiêu bài học
- Khai báo **biến** bằng `let` và `const`, biết vì sao nên tránh `var`.
- Nắm các **kiểu dữ liệu** nguyên thủy và dùng `typeof` để kiểm tra.
- Làm việc với **chuỗi** (template literal) và **số** (kể cả các bẫy của số thực).
- Dùng toán tử **số học**, **gán**, **so sánh**, **logic** và **nullish** `??`.
- Hiểu **chuyển đổi kiểu** ngầm và tường minh, luôn dùng `===`.
:::

## 1. Biến: chiếc hộp có dán nhãn

**Biến** là tên gắn với một giá trị, để lưu lại và dùng sau:

```js run
let diem = 7;          // khai báo biến diem, giá trị ban đầu 7
console.log(diem);

diem = 9;              // gán giá trị mới (không có let)
console.log(diem);

const PI = 3.14159;    // hằng: không gán lại được
const tenKhoaHoc = 'WebBasic';
console.log(tenKhoaHoc, PI);
```

| Từ khóa | Gán lại được? | Phạm vi | Ghi chú |
| --- | --- | --- | --- |
| `const` | Không | Khối `{ }` | **Mặc định nên dùng** |
| `let` | Có | Khối `{ }` | Khi giá trị cần thay đổi (bộ đếm, tổng dồn) |
| `var` | Có | Cả hàm | Cách cũ, có nhiều hành vi khó lường, **đừng dùng** |

**Quy tắc đơn giản:** luôn dùng `const`; chỉ đổi sang `let` khi thật sự cần gán lại. Đọc code thấy `const` là biết ngay giá trị đó không đổi.

```js run
const gioHang = ['áo'];
gioHang.push('quần');      // ✅ được: sửa NỘI DUNG mảng, không gán lại biến
console.log(gioHang);
gioHang = ['giày'];        // ❌ TypeError: không gán lại được
```

`const` giữ cho **biến** luôn trỏ tới cùng một mảng/object, nhưng nội dung bên trong vẫn sửa được. Bài [Object](/javascript/object-json) sẽ giải thích sâu hơn. Vì sao `var` "khó lường" (hoisting, phạm vi hàm) có ở bài [Scope & closure](/nang-cao/scope-closure).

## 2. Các kiểu dữ liệu

JavaScript có 7 kiểu **nguyên thủy** (primitive) và kiểu **object**:

| Kiểu | Ví dụ | Ghi chú |
| --- | --- | --- |
| `number` | `42`, `3.14`, `-7`, `NaN`, `Infinity` | Một kiểu cho cả số nguyên và số thực |
| `string` | `'Xin chào'`, `"Hà Nội"`, `` `Tổng: ${x}` `` | Chuỗi ký tự |
| `boolean` | `true`, `false` | Đúng/sai |
| `undefined` | `undefined` | Biến đã khai báo nhưng **chưa có giá trị** |
| `null` | `null` | **Cố ý** không có giá trị |
| `bigint` | `9007199254740993n` | Số nguyên rất lớn |
| `symbol` | `Symbol('id')` | Định danh duy nhất (dùng ở mức nâng cao) |
| `object` | `{ ten: 'An' }`, `[1, 2]`, hàm, ngày tháng... | Mọi thứ còn lại |

```js run
console.log(typeof 42);           // 'number'
console.log(typeof 'chào');       // 'string'
console.log(typeof true);         // 'boolean'
let chuaGan;
console.log(typeof chuaGan);      // 'undefined'
console.log(typeof { a: 1 });     // 'object'
console.log(typeof [1, 2, 3]);    // 'object' — mảng cũng là object!
console.log(typeof null);         // 'object' — lỗi lịch sử của JS
console.log(Array.isArray([1, 2])); // true — cách đúng để kiểm tra mảng
```

JavaScript là ngôn ngữ **kiểu động**: biến không gắn với kiểu cố định, cùng một biến có thể chứa số rồi chuỗi. Linh hoạt nhưng dễ sinh lỗi. Đó là lý do nhiều dự án lớn dùng **TypeScript** (JavaScript có thêm kiểu), một hướng học tiếp sau khóa này.

## 3. Chuỗi (string)

```js run
const ho = 'Nguyễn';
const ten = "An";

// Nối chuỗi bằng +
console.log(ho + ' ' + ten);

// Template literal: dấu backtick ` ` và ${biểu thức} — dễ đọc hơn nhiều
const tuoi = 20;
console.log(`${ho} ${ten} năm nay ${tuoi} tuổi, sang năm ${tuoi + 1} tuổi.`);

// Template literal viết được nhiều dòng
const thongBao = `Xin chào ${ten},
Đơn hàng của bạn đã được giao.`;
console.log(thongBao);

// Ký tự đặc biệt với dấu \
console.log('Tôi tên là \'An\'');   // \' là dấu nháy đơn
console.log('Dòng 1\nDòng 2');      // \n là xuống dòng
console.log('Độ dài:', ten.length);
```

- Ba cách viết chuỗi: `'...'`, `"..."`, `` `...` ``. Khóa học dùng nháy đơn cho chuỗi thường và backtick khi cần chèn giá trị.
- `.length` là số ký tự. Phương thức xử lý chuỗi (tìm, cắt, thay thế, viết hoa...) ở bài [Chuỗi, số & ngày giờ](/javascript/chuoi-so-ngay).

## 4. Số (number)

```js run
console.log(10 / 3);              // 3.3333333333333335
console.log(10 % 3);              // 1 — phép chia lấy dư
console.log(2 ** 10);             // 1024 — lũy thừa
console.log(1_000_000);           // 1000000 — dấu _ chỉ để dễ đọc
console.log(10 / 0);              // Infinity
console.log('abc' * 2);           // NaN — "Not a Number", kết quả phép toán vô nghĩa
console.log(0.1 + 0.2);           // 0.30000000000000004 😱
console.log(Number.isNaN('abc' * 2)); // true — cách đúng để kiểm tra NaN
```

::: warning Số thực và tiền tệ
Máy tính lưu số thực dạng nhị phân, nên `0.1` và `0.2` không được biểu diễn chính xác, dẫn tới `0.1 + 0.2 = 0.30000000000000004`. Đây không phải lỗi riêng của JavaScript, mọi ngôn ngữ dùng chuẩn IEEE 754 đều vậy. Với tiền, hãy tính bằng **số nguyên** (tiền Việt vốn không có phần lẻ; với USD thì tính bằng cent), và làm tròn khi hiển thị.
:::

`NaN` có tính chất kỳ lạ: `NaN === NaN` là `false`. Luôn kiểm tra bằng `Number.isNaN()`.

## 5. Toán tử

**Số học và gán:**

```js run
let diem = 10;
diem += 5;        // diem = diem + 5  → 15
diem -= 3;        // 12
diem *= 2;        // 24
diem /= 4;        // 6
diem++;           // tăng 1 → 7
diem--;           // giảm 1 → 6
console.log(diem);
```

**So sánh** (kết quả là `true`/`false`):

```js run
console.log(5 > 3, 5 >= 5, 2 < 1);   // true true false
console.log(5 === 5);                // true: bằng nhau, cùng kiểu
console.log(5 === '5');              // false: khác kiểu
console.log(5 !== '5');              // true
console.log(5 == '5');               // true 😬 — == tự chuyển kiểu trước khi so
console.log('b' > 'a', 'B' > 'a');   // so chuỗi theo mã ký tự: true false
```

**Logic:**

```js run
const tuoi = 20;
const coVe = true;

console.log(tuoi >= 18 && coVe);   // VÀ: cả hai đúng → true
console.log(tuoi < 12 || coVe);    // HOẶC: một trong hai đúng → true
console.log(!coVe);                // PHỦ ĐỊNH → false
```

**Nullish `??` — giá trị mặc định:**

```js run
let tenHienThi = null;
console.log(tenHienThi ?? 'Khách');   // 'Khách' (vì bên trái là null)

const soLuong = 0;
console.log(soLuong ?? 1);            // 0 — ?? chỉ thay khi null/undefined
console.log(soLuong || 1);            // 1 — || thay cả khi 0, '' (thường là sai ý)
```

Thứ tự ưu tiên giống toán học: `*`, `/` trước `+`, `-`. Khi không chắc, **dùng ngoặc** cho rõ ràng: `(a + b) * c`.

## 6. Chuyển đổi kiểu

**Chuyển ngầm** (coercion): JS tự đổi kiểu khi toán tử gặp kiểu không khớp. Đây là nguồn gốc của nhiều lỗi khó hiểu:

```js run
console.log('5' + 3);     // '53'  — + gặp chuỗi thì nối chuỗi
console.log('5' - 3);     // 2     — - chỉ dành cho số nên '5' thành 5
console.log('5' * '2');   // 10
console.log(true + 1);    // 2     — true thành 1
console.log([] + {});     // '[object Object]' 🤯
```

Dữ liệu từ ô nhập (`input.value`) **luôn là chuỗi**, kể cả `type="number"`. Cộng hai ô nhập "1" và "2" sẽ ra `"12"`. Hãy **chuyển kiểu tường minh**:

```js run
const tuONhap = '25';
console.log(Number(tuONhap) + 5);        // 30
console.log(Number('12abc'));            // NaN — không phải số hợp lệ
console.log(parseInt('12px', 10));       // 12 — đọc số nguyên ở đầu chuỗi
console.log(parseFloat('3.5kg'));        // 3.5
console.log(String(2026));               // '2026'
console.log((123.456).toFixed(1));       // '123.5' — làm tròn, trả về chuỗi
console.log(Boolean(''), Boolean('0'));  // false true
```

::: tip Luôn dùng `===` và `!==`
`==` chuyển kiểu theo một bảng quy tắc dài và khó nhớ (`'' == 0`, `'0' == 0`, `null == undefined` đều là `true`). Dùng `===` thì không có bất ngờ. Ngoại lệ duy nhất hay gặp: `x == null` để kiểm tra cùng lúc `null` hoặc `undefined`. Nhưng dùng `x ?? ...` thường gọn hơn.
:::

## Thực hành

**Bài 1.** Một cốc trà sữa giá 35.000 ₫, mua 3 cốc, phí giao hàng 15.000 ₫, được giảm 10% trên tiền hàng (không giảm phí giao). Tính và in tổng tiền bằng template literal.

::: details Xem lời giải
```js run
const GIA = 35000;
const soLuong = 3;
const phiGiao = 15000;

const tienHang = GIA * soLuong;         // 105000
const giamGia = tienHang * 0.1;         // 10500
const tongTien = tienHang - giamGia + phiGiao;

console.log(`Tiền hàng: ${tienHang} ₫`);
console.log(`Giảm giá: ${giamGia} ₫`);
console.log(`Tổng thanh toán: ${tongTien} ₫`);
```
Bài [Chuỗi, số & ngày giờ](/javascript/chuoi-so-ngay) sẽ chỉ cách hiển thị `109500` thành `109.500 ₫` đúng kiểu Việt Nam.
:::

**Bài 2.** Dự đoán kết quả từng dòng trước khi bấm chạy, rồi kiểm tra:

```js run
console.log(typeof '42');
console.log('42' + 8);
console.log('42' - 8);
console.log(Number('42') + 8);
console.log(null ?? 'mặc định');
console.log('' ?? 'mặc định');
console.log('' || 'mặc định');
console.log(7 % 2 === 1);
```

::: details Xem lời giải
`'string'`, `'428'`, `34`, `50`, `'mặc định'`, `''` (chuỗi rỗng không phải null/undefined nên `??` giữ nguyên), `'mặc định'` (`||` coi chuỗi rỗng là falsy), `true` (7 là số lẻ).
:::

**Bài 3.** Đổi nhiệt độ: cho `const doC = 32;`, tính độ F theo công thức `F = C × 9/5 + 32` và in ra dạng `32°C = 89.6°F`.

::: details Xem lời giải
```js run
const doC = 32;
const doF = doC * 9 / 5 + 32;
console.log(`${doC}°C = ${doF}°F`);
```
:::

## Lỗi thường gặp

- **Gán lại `const`** → `TypeError`. Dùng `let` nếu cần đổi.
- **Dùng `var`** theo thói quen từ tài liệu cũ.
- **Cộng giá trị từ ô nhập** mà quên đổi sang số → nối chuỗi.
- **So sánh bằng `==`**, hoặc nhầm `=` (gán) với `===` (so sánh) trong điều kiện.
- **So sánh tiền bằng số thực** (`0.1 + 0.2 === 0.3`).
- **`||` khi giá trị hợp lệ có thể là `0` hoặc `''`** → dùng `??`.

## Tóm tắt

- `const` mặc định, `let` khi cần gán lại, tránh `var`.
- Kiểu nguyên thủy: number, string, boolean, undefined, null, bigint, symbol; còn lại là object. `typeof null` là `'object'` (lỗi lịch sử); kiểm tra mảng bằng `Array.isArray()`.
- Template literal `` `...${x}...` `` để chèn giá trị vào chuỗi.
- Số thực có sai số: tính tiền bằng số nguyên. `NaN` kiểm tra bằng `Number.isNaN()`.
- Luôn dùng `===`/`!==`; `??` cho giá trị mặc định khi `null`/`undefined`.
- Giá trị từ ô nhập là chuỗi: đổi bằng `Number()`, `parseInt()`, `parseFloat()`.

## Kiểm tra kiến thức

<Quiz />
