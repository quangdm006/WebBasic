---
title: Điều kiện & vòng lặp
description: Câu lệnh if, else if, else, giá trị truthy và falsy, toán tử ba ngôi, switch, vòng lặp for, while, do while, for of, for in, break, continue và cách tránh vòng lặp vô hạn.
quiz:
  - q: "Giá trị nào sau đây là **truthy** (được coi là đúng trong `if`)?"
    options:
      - "`0`"
      - "`''` (chuỗi rỗng)"
      - "`'0'` (chuỗi chứa ký tự 0)"
      - "`null`"
    answer: 2
    explain: "Chỉ có 8 giá trị falsy: `false`, `0`, `-0`, `0n`, `''`, `null`, `undefined`, `NaN`. Mọi giá trị khác đều truthy, kể cả `'0'`, `'false'`, `[]` và `{}`."
  - q: "Trong `switch`, quên `break` ở cuối một `case` thì sao?"
    options:
      - "Lỗi cú pháp"
      - "Code “rơi” xuống chạy tiếp các `case` bên dưới cho tới khi gặp `break`"
      - "Bỏ qua case đó"
      - "Chạy lại switch từ đầu"
    answer: 1
    explain: "Hiện tượng này gọi là fall-through. Đôi khi được dùng có chủ ý để gom nhiều case, nhưng quên `break` là lỗi rất hay gặp."
  - q: "Vòng lặp nào phù hợp nhất để duyệt **từng phần tử** của một mảng?"
    options:
      - "`for...in`"
      - "`for...of`"
      - "`while (true)`"
      - "`switch`"
    answer: 1
    explain: "`for...of` lấy trực tiếp giá trị từng phần tử. `for...in` duyệt **tên thuộc tính** (với mảng là chỉ số dạng chuỗi), dùng cho object chứ không nên dùng cho mảng."
  - q: "`const nhan = diem >= 5 ? 'Đạt' : 'Chưa đạt';` với `diem = 5` thì `nhan` là gì?"
    options:
      - "`'Đạt'`"
      - "`'Chưa đạt'`"
      - "`true`"
      - "`5`"
    answer: 0
    explain: "Toán tử ba ngôi: `điều-kiện ? giá-trị-nếu-đúng : giá-trị-nếu-sai`. 5 >= 5 là đúng."
  - q: "Đoạn `let i = 0; while (i < 5) { console.log(i); }` có vấn đề gì?"
    options:
      - "Không có vấn đề"
      - "Vòng lặp vô hạn vì `i` không bao giờ thay đổi"
      - "Chỉ in số 5"
      - "Lỗi cú pháp"
    answer: 1
    explain: "Điều kiện `i < 5` luôn đúng vì `i` mãi là 0. Thiếu `i++` trong thân vòng lặp. Trang sẽ bị treo (Playground của khóa học có cơ chế tự dừng)."
---

# Điều kiện & vòng lặp

::: info Mục tiêu bài học
- Rẽ nhánh với `if`, `else if`, `else` và toán tử ba ngôi `? :`.
- Hiểu **truthy** và **falsy**.
- Dùng `switch` khi so sánh một giá trị với nhiều trường hợp.
- Lặp với `for`, `while`, `do...while`, `for...of`, `for...in`; dùng `break` và `continue`.
- Tránh **vòng lặp vô hạn** và các lỗi "lệch một".
:::

## 1. `if`, `else if`, `else`

Chương trình cần ra quyết định: "nếu điểm từ 8 trở lên thì xếp loại Giỏi, nếu không thì...":

```js run
const diem = 7.5;

if (diem >= 8) {
  console.log('Giỏi');
} else if (diem >= 6.5) {
  console.log('Khá');
} else if (diem >= 5) {
  console.log('Trung bình');
} else {
  console.log('Chưa đạt');
}
```

- Điều kiện đặt trong ngoặc tròn, khối lệnh trong ngoặc nhọn.
- JS kiểm tra **từ trên xuống**, gặp điều kiện đúng đầu tiên thì chạy khối đó và bỏ qua phần còn lại. Thứ tự điều kiện rất quan trọng: nếu viết `diem >= 5` lên đầu, điểm 9 cũng bị xếp "Trung bình".
- Kết hợp điều kiện bằng `&&`, `||`, `!`:

```js run
const tuoi = 16;
const coNguoiLonDiCung = true;

if (tuoi >= 18 || coNguoiLonDiCung) {
  console.log('Được vào xem phim');
}

if (!(tuoi >= 18)) {
  console.log('Chưa đủ 18 tuổi');
}
```

::: tip Luôn dùng ngoặc nhọn
JS cho phép bỏ `{ }` khi khối chỉ có một câu lệnh (`if (x) lamGi();`). Nhưng khi thêm dòng thứ hai mà quên thêm ngoặc, dòng đó sẽ luôn chạy. Viết ngoặc đầy đủ cho an toàn; ngoại lệ hợp lý là câu lệnh ngắn trên cùng một dòng như `if (!du) return;`.
:::

## 2. Truthy và falsy

Điều kiện trong `if` không nhất thiết là `true`/`false`: JS tự chuyển giá trị bất kỳ sang boolean. Chỉ có **8 giá trị falsy**:

```text
false   0   -0   0n   ''   null   undefined   NaN
```

**Mọi giá trị khác đều truthy**, kể cả `'0'`, `'false'`, `' '` (có dấu cách), `[]` (mảng rỗng), `{}`.

```js run
const ten = '';
if (ten) {
  console.log(`Xin chào ${ten}`);
} else {
  console.log('Bạn chưa nhập tên');
}

const danhSach = [];
if (danhSach) console.log('Mảng rỗng vẫn là truthy!');
if (danhSach.length === 0) console.log('Muốn kiểm tra rỗng thì xem .length');
```

Viết `if (ten)` gọn và phổ biến, nhưng cẩn thận khi `0` là giá trị hợp lệ (số lượng, điểm số): `if (soLuong)` sẽ coi `0` như "không có".

## 3. Toán tử ba ngôi `? :`

Chọn **một trong hai giá trị** theo điều kiện, viết trong một biểu thức:

```js run
const diem = 6;
const ketQua = diem >= 5 ? 'Đạt' : 'Chưa đạt';
console.log(ketQua);

const soLuong = 1;
console.log(`Bạn có ${soLuong} ${soLuong === 1 ? 'thông báo' : 'thông báo mới'}`);
```

Hợp với lựa chọn đơn giản. Đừng lồng nhiều tầng `a ? b : c ? d : e`: khó đọc, hãy dùng `if...else`.

## 4. `switch`

Khi so sánh **một giá trị** với nhiều trường hợp cụ thể:

```js run
const thu = 6;

switch (thu) {
  case 7:
  case 8:                       // gom nhiều case: không có lệnh, "rơi" xuống case dưới
    console.log('Cuối tuần 🎉');
    break;
  case 6:
    console.log('Thứ Sáu, sắp nghỉ rồi');
    break;
  default:
    console.log('Ngày làm việc');
}
```

- `switch` so sánh bằng `===`.
- Mỗi `case` thường kết thúc bằng `break`. Quên `break` là code chạy tiếp sang case bên dưới.
- `default` chạy khi không case nào khớp.

Với ánh xạ đơn giản "giá trị này → kết quả kia", một **object tra cứu** thường gọn hơn `switch` (bạn sẽ gặp ở [bài Object](/javascript/object-json)).

## 5. Vòng lặp `for`

Lặp lại một việc nhiều lần:

```js run
for (let i = 1; i <= 5; i++) {
  console.log(`Lần thứ ${i}`);
}
```

Ba phần trong ngoặc, cách nhau bởi dấu `;`:

1. **Khởi tạo** (`let i = 1`): chạy một lần trước khi lặp.
2. **Điều kiện** (`i <= 5`): kiểm tra trước **mỗi** vòng, sai thì dừng.
3. **Cập nhật** (`i++`): chạy sau mỗi vòng.

```js run
// Bảng cửu chương 7
for (let i = 1; i <= 10; i++) {
  console.log(`7 × ${i} = ${7 * i}`);
}

// Duyệt mảng bằng chỉ số (đếm từ 0 tới length - 1)
const monAn = ['phở', 'bún chả', 'bánh mì'];
for (let i = 0; i < monAn.length; i++) {
  console.log(i, monAn[i]);
}
```

## 6. `for...of` và `for...in`

**`for...of`** lấy **giá trị** từng phần tử của mảng, chuỗi, Map, Set... Đây là cách duyệt mảng dễ đọc nhất khi không cần chỉ số:

```js run
const monAn = ['phở', 'bún chả', 'bánh mì'];
for (const mon of monAn) {
  console.log(`Hôm nay ăn ${mon}`);
}

for (const kyTu of 'Web') {
  console.log(kyTu);
}

// Cần cả chỉ số? Dùng .entries()
for (const [i, mon] of monAn.entries()) {
  console.log(`${i + 1}. ${mon}`);
}
```

**`for...in`** duyệt **tên thuộc tính** của object:

```js run
const sanPham = { ten: 'Bàn phím', gia: 450000, conHang: true };
for (const khoa in sanPham) {
  console.log(khoa, '→', sanPham[khoa]);
}
```

Đừng dùng `for...in` cho mảng: chỉ số trả về là chuỗi, và có thể duyệt cả thuộc tính lạ. Mảng có những phương thức mạnh hơn nhiều (`forEach`, `map`, `filter`...) ở [bài Mảng](/javascript/mang).

## 7. `while` và `do...while`

Dùng khi **không biết trước số lần lặp**, chỉ biết điều kiện dừng:

```js run
// Gửi tiết kiệm 10 triệu, lãi 6%/năm: bao nhiêu năm thì gấp đôi?
let tien = 10_000_000;
let nam = 0;
while (tien < 20_000_000) {
  tien = tien * 1.06;
  nam++;
}
console.log(`Sau ${nam} năm có ${Math.round(tien)} đồng`);
```

`do...while` chạy thân vòng lặp **ít nhất một lần** rồi mới kiểm tra điều kiện:

```js run
let soLanTung = 0;
let mat;
do {
  mat = Math.floor(Math.random() * 6) + 1;   // tung xúc xắc: số ngẫu nhiên 1–6
  soLanTung++;
  console.log('Tung được', mat);
} while (mat !== 6);
console.log(`Mất ${soLanTung} lần mới ra mặt 6`);
```

## 8. `break` và `continue`

- `break`: **thoát hẳn** vòng lặp.
- `continue`: **bỏ qua phần còn lại của vòng hiện tại**, sang vòng tiếp theo.

```js run
const gia = [120, 80, -1, 300, 45];

// Tìm giá đầu tiên trên 100 rồi dừng
for (const g of gia) {
  if (g > 100) {
    console.log('Giá đầu tiên trên 100:', g);
    break;
  }
}

// Tính tổng, bỏ qua giá trị không hợp lệ
let tong = 0;
for (const g of gia) {
  if (g < 0) continue;
  tong += g;
}
console.log('Tổng các giá hợp lệ:', tong);
```

## 9. Vòng lặp vô hạn và lỗi "lệch một"

**Vòng lặp vô hạn** xảy ra khi điều kiện dừng không bao giờ đạt được, thường do quên cập nhật biến đếm:

```js
let i = 0;
while (i < 5) {
  console.log(i);
  // quên i++ → lặp mãi mãi, trang bị treo
}
```

Khi trang bị treo vì vòng lặp vô hạn, hãy đóng tab đó. Playground của khóa học tự dừng vòng lặp chạy quá 2 giây để bạn khỏi phải làm vậy.

**Lỗi lệch một** (off-by-one): lặp thừa hoặc thiếu đúng một lần. Thường gặp nhất là `i <= mang.length` (thừa một vòng, phần tử cuối là `undefined`) thay vì `i < mang.length`. Mảng đánh chỉ số **từ 0**: mảng 3 phần tử có chỉ số 0, 1, 2.

## Thực hành

**Bài 1.** FizzBuzz, bài phỏng vấn kinh điển: in các số từ 1 đến 20, nhưng số chia hết cho 3 in `Fizz`, chia hết cho 5 in `Buzz`, chia hết cho cả 3 và 5 in `FizzBuzz`.

::: details Xem lời giải
```js run
for (let i = 1; i <= 20; i++) {
  if (i % 15 === 0) {
    console.log('FizzBuzz');
  } else if (i % 3 === 0) {
    console.log('Fizz');
  } else if (i % 5 === 0) {
    console.log('Buzz');
  } else {
    console.log(i);
  }
}
```
Kiểm tra `% 15` **trước**: nếu kiểm tra `% 3` trước thì 15 sẽ in `Fizz` và không bao giờ tới nhánh `FizzBuzz`.
:::

**Bài 2.** Tính tiền điện sinh hoạt theo bậc thang đơn giản hóa: 50 kWh đầu giá 1.900 ₫, 50 kWh tiếp theo giá 2.000 ₫, phần trên 100 kWh giá 2.500 ₫. Với `soDien = 160`, in số tiền.

::: details Xem lời giải
```js run
const soDien = 160;
let tien = 0;

if (soDien <= 50) {
  tien = soDien * 1900;
} else if (soDien <= 100) {
  tien = 50 * 1900 + (soDien - 50) * 2000;
} else {
  tien = 50 * 1900 + 50 * 2000 + (soDien - 100) * 2500;
}

console.log(`${soDien} kWh → ${tien} ₫`);   // 160 kWh → 345000 ₫
```
Bảng giá này chỉ để luyện tập. Giá điện thật có nhiều bậc hơn và thay đổi theo từng thời kỳ.
:::

**Bài 3.** Cho `const matKhau = 'webBasic2026';`. Dùng vòng lặp `for...of` trên chuỗi để đếm số chữ số, số chữ hoa và số chữ thường. Gợi ý: một ký tự `c` là chữ số nếu `c >= '0' && c <= '9'`.

::: details Xem lời giải
```js run
const matKhau = 'webBasic2026';
let chuSo = 0;
let chuHoa = 0;
let chuThuong = 0;

for (const c of matKhau) {
  if (c >= '0' && c <= '9') {
    chuSo++;
  } else if (c >= 'A' && c <= 'Z') {
    chuHoa++;
  } else if (c >= 'a' && c <= 'z') {
    chuThuong++;
  }
}

console.log({ chuSo, chuHoa, chuThuong });   // {chuSo: 4, chuHoa: 1, chuThuong: 7}
```
Cách so sánh này chỉ đúng với chữ không dấu. Ở bài sau về chuỗi, bạn sẽ dùng biểu thức chính quy cho trường hợp tổng quát.
:::

## Lỗi thường gặp

- **Dùng `=` thay vì `===`** trong điều kiện: `if (diem = 10)` gán 10 cho `diem` và luôn đúng.
- **Thứ tự `else if` sai** → điều kiện rộng đứng trước "nuốt" mất điều kiện hẹp.
- **Quên `break` trong `switch`.**
- **Vòng lặp vô hạn** vì quên cập nhật biến đếm, hoặc cập nhật sai chiều (`i--` thay vì `i++`).
- **`i <= arr.length`** thay vì `i < arr.length`.
- **Dùng `for...in` cho mảng.**

## Tóm tắt

- `if / else if / else` kiểm tra từ trên xuống; ba ngôi `đk ? a : b` cho lựa chọn đơn giản.
- 8 giá trị falsy: `false`, `0`, `-0`, `0n`, `''`, `null`, `undefined`, `NaN`; còn lại là truthy (kể cả `[]`, `'0'`).
- `switch` so sánh bằng `===`, nhớ `break`, có `default`.
- `for` khi biết số lần; `for...of` duyệt giá trị (mảng, chuỗi); `for...in` duyệt khóa của object; `while`/`do...while` khi chỉ biết điều kiện dừng.
- `break` thoát vòng lặp, `continue` sang vòng tiếp theo. Cẩn thận vòng lặp vô hạn và lỗi lệch một.

## Kiểm tra kiến thức

<Quiz />
