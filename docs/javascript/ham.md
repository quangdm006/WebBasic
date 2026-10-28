---
title: Hàm (function)
description: Khai báo hàm, tham số và đối số, giá trị trả về, tham số mặc định và rest, function expression, arrow function, phạm vi biến, hàm là giá trị, callback và cách viết hàm tốt.
quiz:
  - q: "Hàm không có câu lệnh `return` trả về gì khi được gọi?"
    options:
      - "`0`"
      - "`null`"
      - "`undefined`"
      - "Lỗi"
    answer: 2
    explain: "Mọi hàm đều trả về một giá trị; không có `return` (hoặc `return;` trống) thì giá trị đó là `undefined`. Lỗi hay gặp: tính đúng nhưng quên `return` nên kết quả là `undefined`."
  - q: "Trong `function chao(ten) {...}` và lời gọi `chao('An')`, đâu là tham số, đâu là đối số?"
    options:
      - "`ten` là đối số, `'An'` là tham số"
      - "`ten` là tham số (tên trong định nghĩa), `'An'` là đối số (giá trị truyền vào khi gọi)"
      - "Cả hai đều là tham số"
      - "Không có khác biệt"
    answer: 1
    explain: "Tham số (parameter) là biến khai báo trong định nghĩa hàm; đối số (argument) là giá trị thực tế truyền vào lúc gọi."
  - q: "Arrow function `const binhPhuong = (x) => x * x;` trả về gì khi gọi `binhPhuong(4)`?"
    options:
      - "`undefined` vì thiếu `return`"
      - "`16`, vì arrow function có thân là một biểu thức sẽ tự trả về biểu thức đó"
      - "`8`"
      - "Lỗi cú pháp"
    answer: 1
    explain: "Không có ngoặc nhọn thì kết quả của biểu thức được trả về ngầm. Có ngoặc nhọn `{ }` thì phải viết `return` như hàm thường."
  - q: "`function tinh(gia, giam = 0) { return gia - giam; }`, gọi `tinh(100)` cho kết quả gì?"
    options:
      - "`NaN`"
      - "`100`"
      - "`undefined`"
      - "Lỗi vì thiếu đối số"
    answer: 1
    explain: "Tham số mặc định `giam = 0` được dùng khi đối số bị bỏ qua (hoặc là `undefined`). Thiếu giá trị mặc định thì `100 - undefined` sẽ là `NaN`."
  - q: "**Callback** là gì?"
    options:
      - "Một hàm gọi lại chính nó"
      - "Một hàm được truyền làm đối số cho hàm khác, để hàm kia gọi vào lúc thích hợp"
      - "Một hàm trả về số điện thoại"
      - "Một từ khóa của JavaScript"
    answer: 1
    explain: "Ví dụ: `nut.addEventListener('click', xuLy)`. `xuLy` là callback, được gọi mỗi lần nút được bấm. Hàm gọi lại chính nó có tên khác: đệ quy."
---

# Hàm (function)

::: info Mục tiêu bài học
- Hiểu vì sao cần **hàm** và viết được hàm có **tham số**, **giá trị trả về**.
- Dùng **tham số mặc định**, **rest parameter** và đối số dạng object.
- Phân biệt **function declaration**, **function expression** và **arrow function**.
- Hiểu **phạm vi biến** (scope) cơ bản.
- Hiểu "hàm là giá trị": truyền hàm làm đối số (**callback**), trả hàm về từ hàm khác.
:::

## 1. Vì sao cần hàm?

Giả sử bạn tính tiền có giảm giá ở 10 chỗ khác nhau. Copy công thức 10 lần, rồi một ngày công thức đổi, bạn phải sửa 10 chỗ và chắc chắn sẽ sót một chỗ. **Hàm** gói một đoạn code thành một khối có tên, để **dùng lại** và **đặt tên cho ý tưởng**:

```js run
function tinhTienSauGiam(gia, phanTramGiam) {
  const tienGiam = gia * phanTramGiam / 100;
  return gia - tienGiam;
}

console.log(tinhTienSauGiam(200000, 10));   // 180000
console.log(tinhTienSauGiam(50000, 25));    // 37500
```

- `function` + **tên hàm** + danh sách **tham số** trong ngoặc + **thân hàm** trong ngoặc nhọn.
- **Gọi hàm**: tên hàm + ngoặc tròn chứa **đối số**: `tinhTienSauGiam(200000, 10)`.
- `return` **trả kết quả** về nơi gọi và **kết thúc hàm** ngay lập tức.

Đặt tên hàm bằng **động từ** mô tả việc nó làm: `tinhTong`, `layDanhSach`, `kiemTraEmail`, `hienThiLoi`. Hàm trả về true/false thường bắt đầu bằng `la`/`co`/`is`/`has`: `laSoChan`, `coQuyenSua`.

## 2. Tham số và giá trị trả về

```js run
function chao(ten) {
  console.log(`Xin chào ${ten}!`);   // in ra, nhưng KHÔNG return
}

const ketQua = chao('An');
console.log(ketQua);                 // undefined — hàm không return gì

function laSoChan(n) {
  return n % 2 === 0;
}
console.log(laSoChan(4), laSoChan(7));

function xepLoai(diem) {
  if (diem < 0 || diem > 10) return 'Điểm không hợp lệ';   // return sớm, dừng hàm
  if (diem >= 8) return 'Giỏi';
  if (diem >= 5) return 'Đạt';
  return 'Chưa đạt';
}
console.log(xepLoai(9), xepLoai(6), xepLoai(12));
```

- `console.log` chỉ **in ra để xem**; `return` mới **trả giá trị** cho code khác dùng tiếp. Đây là điều người mới hay nhầm nhất.
- Hàm không có `return` trả về `undefined`.
- **Return sớm** (guard clause) để xử lý trường hợp đặc biệt ngay đầu hàm giúp code ít lồng nhau hơn.
- Gọi thiếu đối số thì tham số đó là `undefined`; truyền thừa thì phần thừa bị bỏ qua.

## 3. Tham số mặc định, rest và tham số dạng object

```js run
// Tham số mặc định: dùng khi đối số bị bỏ qua (hoặc là undefined)
function taoThe(tieuDe, mau = 'xám') {
  return `[${mau}] ${tieuDe}`;
}
console.log(taoThe('Thông báo'));
console.log(taoThe('Cảnh báo', 'vàng'));

// Rest parameter: gom mọi đối số còn lại thành một mảng
function tong(...cacSo) {
  let kq = 0;
  for (const so of cacSo) kq += so;
  return kq;
}
console.log(tong(1, 2, 3), tong(10, 20, 30, 40));

// Nhiều tùy chọn? Truyền một object và lấy ra bằng destructuring
function datVe({ diemDi, diemDen, soNguoi = 1, khuHoi = false }) {
  return `${soNguoi} vé ${diemDi} → ${diemDen}${khuHoi ? ' (khứ hồi)' : ''}`;
}
console.log(datVe({ diemDi: 'Hà Nội', diemDen: 'Đà Nẵng', khuHoi: true }));
```

Khi hàm có nhiều hơn 3 tham số, gọi `datVe('Hà Nội', 'Đà Nẵng', 1, true)` rất khó đọc (`true` là gì?). Truyền **một object** làm cho lời gọi tự giải thích, và thứ tự không còn quan trọng. Cú pháp `{ diemDi, diemDen }` trong ngoặc gọi là **destructuring**, giải thích kỹ ở [bài Object](/javascript/object-json).

## 4. Ba cách viết hàm

```js run
// 1. Function declaration — khai báo hàm
function cong(a, b) {
  return a + b;
}

// 2. Function expression — gán một hàm cho biến
const tru = function (a, b) {
  return a - b;
};

// 3. Arrow function — cú pháp ngắn gọn (ES2015)
const nhan = (a, b) => {
  return a * b;
};

// Arrow function có thân là MỘT biểu thức: bỏ { } và return
const chia = (a, b) => a / b;
const binhPhuong = (x) => x * x;        // một tham số: có thể bỏ ngoặc → x => x * x
const loiChao = () => 'Xin chào!';      // không tham số: phải có ()
const taoDiem = (x, y) => ({ x, y });   // trả về object: bọc trong ( )

console.log(cong(2, 3), tru(5, 1), nhan(4, 2), chia(9, 3), binhPhuong(7), loiChao(), taoDiem(1, 2));
```

| | Declaration | Expression / Arrow |
| --- | --- | --- |
| Gọi trước dòng khai báo | ✅ Được (hoisting) | ❌ Lỗi |
| Có `this` riêng | Có | Arrow **không** có (dùng `this` của nơi bao ngoài) |
| Hay dùng cho | Hàm chính, có tên rõ ràng | Callback ngắn, hàm truyền đi |

Sự khác nhau về `this` được giải thích ở [bài this & class](/nang-cao/class-prototype). Ở mức này, quy tắc thực tế: dùng **function declaration** cho các hàm chính của chương trình, dùng **arrow function** cho callback ngắn.

## 5. Phạm vi biến (scope)

Biến khai báo bằng `let`/`const` chỉ tồn tại **bên trong khối `{ }`** chứa nó. Biến trong hàm là biến **cục bộ** của hàm đó:

```js run
const VAT = 0.08;                     // biến ngoài cùng: dùng được ở mọi nơi bên dưới

function tinhThue(gia) {
  const thue = gia * VAT;             // biến cục bộ: chỉ tồn tại trong hàm
  return thue;
}

console.log(tinhThue(100000));
console.log(typeof thue);             // 'undefined' — bên ngoài không thấy biến thue

if (true) {
  const trongKhoi = 'chỉ sống trong khối if';
  console.log(trongKhoi);
}
// console.log(trongKhoi);            // ReferenceError nếu bỏ dấu //
```

Bên trong **nhìn ra ngoài** được, bên ngoài **không nhìn vào trong** được. Hàm nên nhận dữ liệu qua **tham số** và trả kết quả qua **return**, thay vì đọc và sửa biến bên ngoài: dễ hiểu hơn, dễ kiểm thử hơn. Phạm vi, hoisting và closure được giải thích kỹ ở [bài Scope & closure](/nang-cao/scope-closure).

## 6. Hàm là giá trị: callback

Trong JavaScript, hàm là một **giá trị** như số hay chuỗi: gán vào biến được, truyền vào hàm khác được, trả về từ hàm khác được.

```js run
function lapLai(soLan, viecCanLam) {
  for (let i = 1; i <= soLan; i++) {
    viecCanLam(i);                     // gọi hàm được truyền vào
  }
}

lapLai(3, (lan) => console.log(`Chạy bộ vòng ${lan}`));
lapLai(2, (lan) => console.log(`Hít thở sâu lần ${lan}`));
```

Hàm được truyền vào để hàm khác gọi gọi là **callback**. Bạn sẽ dùng callback ở khắp nơi:

```js
// Mảng: callback được gọi cho từng phần tử (bài Mảng)
[3, 1, 2].map((so) => so * 2);

// Sự kiện: callback được gọi mỗi khi bấm nút (bài Sự kiện)
nut.addEventListener('click', () => console.log('Đã bấm'));

// Hẹn giờ: callback được gọi sau 1 giây (bài Bất đồng bộ)
setTimeout(() => console.log('1 giây đã trôi qua'), 1000);
```

::: warning Truyền hàm, không phải gọi hàm
`setTimeout(chao, 1000)` truyền **hàm** `chao` để gọi sau 1 giây. `setTimeout(chao(), 1000)` thì **gọi ngay** `chao` và truyền **kết quả** của nó (thường là `undefined`). Cần truyền đối số thì bọc trong arrow function: `setTimeout(() => chao('An'), 1000)`.
:::

**Hàm trả về hàm:**

```js run
function taoHamNhan(heSo) {
  return (x) => x * heSo;
}

const gapDoi = taoHamNhan(2);
const gapBa = taoHamNhan(3);
console.log(gapDoi(5), gapBa(5));   // 10 15
```

`gapDoi` "nhớ" được `heSo = 2` dù `taoHamNhan` đã chạy xong. Hiện tượng này gọi là **closure**, một trong những khái niệm quan trọng nhất của JavaScript, ở [Phần 4](/nang-cao/scope-closure).

## 7. Viết hàm tốt

1. **Một hàm làm một việc.** Hàm tên `xuLyDonHang` mà vừa kiểm tra, vừa tính tiền, vừa gửi email, vừa cập nhật giao diện thì nên tách ra.
2. **Tên mô tả đúng việc nó làm.** Đọc lời gọi hàm là hiểu, không cần mở hàm ra xem.
3. **Ngắn.** Hàm dài quá một màn hình thường nên tách.
4. **Ưu tiên hàm "thuần" (pure function)**: cùng đầu vào luôn cho cùng đầu ra, không sửa dữ liệu bên ngoài. Hàm thuần dễ hiểu, dễ kiểm thử, dễ tái sử dụng.

```js run
// Không thuần: phụ thuộc và sửa biến bên ngoài
let tongGio = 0;
function themVaoGio(gia) {
  tongGio += gia;
}

// Thuần: mọi thứ cần đều đi qua tham số, kết quả đi qua return
function tinhTong(danhSachGia) {
  let tong = 0;
  for (const gia of danhSachGia) tong += gia;
  return tong;
}
console.log(tinhTong([120000, 45000, 30000]));
```

## Thực hành

**Bài 1.** Làm bài **Hàm tính tiền** trong [Code Playground](/thuc-hanh/playground).

::: details Xem gợi ý
Tính `gia * soLuong` trước, nếu `soLuong >= 10` thì trả về tổng nhân `0.9`. Đừng quên `return`, và đừng quên dòng `console.log(tinhTien(50000, 2))` ở cuối.
:::

**Bài 2.** Viết hàm `tinhBMI(canNang, chieuCao)` trả về chỉ số BMI làm tròn 1 chữ số (`canNang / (chieuCao * chieuCao)`, chiều cao tính bằng mét), và hàm `phanLoaiBMI(bmi)` trả về `'Thiếu cân'` (dưới 18.5), `'Bình thường'` (dưới 23), `'Thừa cân'` (dưới 25) hoặc `'Béo phì'`. Thử với 55 kg, 1,65 m.

::: details Xem lời giải
```js run
function tinhBMI(canNang, chieuCao) {
  const bmi = canNang / (chieuCao * chieuCao);
  return Math.round(bmi * 10) / 10;
}

function phanLoaiBMI(bmi) {
  if (bmi < 18.5) return 'Thiếu cân';
  if (bmi < 23) return 'Bình thường';
  if (bmi < 25) return 'Thừa cân';
  return 'Béo phì';
}

const bmi = tinhBMI(55, 1.65);
console.log(bmi, phanLoaiBMI(bmi));   // 20.2 'Bình thường'
```
Ngưỡng 23 và 25 ở đây theo thang phân loại thường dùng cho người châu Á.
:::

**Bài 3.** Viết hàm `apDung(danhSach, bienDoi)` nhận một mảng số và một hàm, trả về **mảng mới** gồm kết quả của `bienDoi` trên từng phần tử. Dùng nó để nhân đôi `[1, 2, 3]` và để đổi `[0, 25, 100]` độ C sang độ F.

::: details Xem lời giải
```js run
function apDung(danhSach, bienDoi) {
  const ketQua = [];
  for (const phanTu of danhSach) {
    ketQua.push(bienDoi(phanTu));
  }
  return ketQua;
}

console.log(apDung([1, 2, 3], (x) => x * 2));
console.log(apDung([0, 25, 100], (c) => c * 9 / 5 + 32));
```
Bạn vừa tự viết lại phương thức `map` có sẵn của mảng. Bài sau sẽ dùng bản có sẵn: `[1, 2, 3].map((x) => x * 2)`.
:::

## Lỗi thường gặp

- **Quên `return`** → hàm trả `undefined`; hoặc nhầm `console.log` với `return`.
- **Quên `()` khi gọi hàm**: `const kq = tinhTong;` gán chính cái hàm chứ không phải kết quả.
- **Gọi hàm thay vì truyền hàm** cho callback: `setTimeout(chao(), 1000)`.
- **Arrow function trả về object quên bọc ngoặc**: `() => { a: 1 }` bị hiểu là khối lệnh, trả `undefined`. Viết `() => ({ a: 1 })`.
- **Hàm quá dài, làm quá nhiều việc**, hoặc sửa biến toàn cục thay vì nhận tham số và trả kết quả.

## Tóm tắt

- Hàm gói code thành khối có tên để dùng lại; tham số trong định nghĩa, đối số khi gọi; `return` trả kết quả và kết thúc hàm.
- Tham số mặc định `x = 0`, rest `...cacSo`, object làm tham số khi có nhiều tùy chọn.
- Declaration (gọi trước được), expression, arrow `(x) => x * 2` (trả về ngầm khi không có `{ }`).
- Biến `let`/`const` có phạm vi khối; bên trong nhìn ra ngoài được, ngược lại thì không.
- Hàm là giá trị: truyền làm callback, trả về từ hàm khác. Truyền `chao`, đừng truyền `chao()`.
- Hàm tốt: một việc, tên rõ, ngắn, ưu tiên thuần.

## Kiểm tra kiến thức

<Quiz />
