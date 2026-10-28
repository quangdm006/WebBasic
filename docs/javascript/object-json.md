---
title: Object, JSON, Map & Set
description: Tạo và truy cập object, phương thức, duyệt object, destructuring, spread, sao chép nông và sâu, optional chaining, JSON.stringify và JSON.parse, lưu dữ liệu vào localStorage, cấu trúc Map và Set.
quiz:
  - q: "Biến `khoa = 'gia'`. Cách nào đọc đúng `sanPham.gia`?"
    options:
      - "`sanPham.khoa`"
      - "`sanPham[khoa]`"
      - "`sanPham['khoa']`"
      - "`sanPham(khoa)`"
    answer: 1
    explain: "Ngoặc vuông nhận một **biểu thức** làm tên thuộc tính, ở đây là giá trị của biến `khoa`. `sanPham.khoa` tìm thuộc tính có tên đúng là “khoa”."
  - q: "`const { ten, tuoi = 18 } = { ten: 'An' };` thì `tuoi` bằng bao nhiêu?"
    options:
      - "`undefined`"
      - "`18`"
      - "Lỗi vì thiếu thuộc tính"
      - "`null`"
    answer: 1
    explain: "Destructuring cho phép giá trị mặc định, dùng khi thuộc tính không tồn tại (hoặc là `undefined`)."
  - q: "`const b = { ...a };` rồi `b.diaChi.thanhPho = 'Huế'`. Object `a` có bị ảnh hưởng không (với `diaChi` là object con)?"
    options:
      - "Không, spread tạo bản sao hoàn toàn độc lập"
      - "Có, vì spread chỉ sao chép **một cấp**; `a.diaChi` và `b.diaChi` vẫn là cùng một object"
      - "Lỗi"
      - "Chỉ khi `a` khai báo bằng `let`"
    answer: 1
    explain: "Đó là sao chép nông (shallow copy). Cần bản sao sâu thì dùng `structuredClone(a)`."
  - q: "`JSON.stringify({ ten: 'An', chao() {}, ghiChu: undefined })` cho chuỗi gì?"
    options:
      - "`'{\"ten\":\"An\",\"chao\":{},\"ghiChu\":null}'`"
      - "`'{\"ten\":\"An\"}'`"
      - "Lỗi"
      - "`'[object Object]'`"
    answer: 1
    explain: "JSON chỉ chứa dữ liệu: chuỗi, số, boolean, null, mảng, object. Hàm và `undefined` bị bỏ qua; `Date` thành chuỗi; `Map`/`Set` thành `{}`."
  - q: "`nguoiDung?.diaChi?.thanhPho` trả về gì khi `nguoiDung` không có `diaChi`?"
    options:
      - "Lỗi `TypeError: Cannot read properties of undefined`"
      - "`undefined`, không báo lỗi"
      - "`null`"
      - "Chuỗi rỗng"
    answer: 1
    explain: "Optional chaining `?.` dừng lại và trả về `undefined` ngay khi gặp `null`/`undefined`, thay vì ném lỗi."
  - q: "Khi nào nên dùng `Set` thay vì mảng?"
    options:
      - "Khi cần giữ thứ tự và phần tử trùng nhau"
      - "Khi cần tập hợp các giá trị **không trùng lặp** và kiểm tra “có chứa không” thật nhanh"
      - "Khi cần lưu cặp khóa–giá trị"
      - "Không bao giờ, Set đã lỗi thời"
    answer: 1
    explain: "`Set` tự loại trùng và `has()` rất nhanh. Cặp khóa–giá trị với khóa bất kỳ kiểu gì thì dùng `Map`."
---

# Object, JSON, Map & Set

::: info Mục tiêu bài học
- Tạo, đọc, sửa, xóa thuộc tính của **object**; viết **phương thức**.
- Duyệt object với `Object.keys`, `values`, `entries`.
- Dùng **destructuring**, **spread**, **optional chaining** `?.`; phân biệt sao chép **nông** và **sâu**.
- Chuyển đổi dữ liệu với **JSON** và lưu vào **localStorage**.
- Biết khi nào dùng **Map** và **Set**.
:::

## 1. Object là gì?

Mảng là danh sách có thứ tự. **Object** là tập hợp các cặp **khóa: giá trị** (key: value), dùng để mô tả **một đối tượng** với nhiều đặc điểm:

```js run
const sanPham = {
  ten: 'Bàn phím cơ',
  gia: 450000,
  conHang: true,
  mauSac: ['đen', 'trắng'],
  thongSo: { soPhim: 87, ketNoi: 'USB-C' },
  'ma-sp': 'BP-087',            // khóa có ký tự đặc biệt phải đặt trong nháy
};

// Đọc bằng dấu chấm
console.log(sanPham.ten);
console.log(sanPham.thongSo.ketNoi);
console.log(sanPham.mauSac[1]);

// Đọc bằng ngoặc vuông: khi khóa nằm trong biến, hoặc có ký tự đặc biệt
const khoa = 'gia';
console.log(sanPham[khoa]);
console.log(sanPham['ma-sp']);

console.log(sanPham.giamGia);   // undefined — thuộc tính không tồn tại
```

**Thêm, sửa, xóa, kiểm tra:**

```js run
const nguoiDung = { ten: 'An' };

nguoiDung.email = 'an@example.com';   // thêm
nguoiDung.ten = 'Nguyễn Văn An';      // sửa
delete nguoiDung.email;               // xóa
console.log(nguoiDung);

console.log('ten' in nguoiDung);      // true
console.log(Object.hasOwn(nguoiDung, 'email'));   // false
```

**Viết gọn:**

```js run
const ten = 'Lan';
const tuoi = 20;

const hocVien = { ten, tuoi };              // = { ten: ten, tuoi: tuoi }
console.log(hocVien);

const truong = 'diem' + 'HTML';
const ketQua = { [truong]: 9 };             // khóa tính toán: { diemHTML: 9 }
console.log(ketQua);
```

## 2. Phương thức

Thuộc tính có giá trị là hàm gọi là **phương thức** (method):

```js run
const gioHang = {
  danhSach: [],
  them(ten, gia) {                 // viết gọn của them: function (ten, gia) {...}
    this.danhSach.push({ ten, gia });
  },
  tongTien() {
    return this.danhSach.reduce((t, sp) => t + sp.gia, 0);
  },
};

gioHang.them('Áo', 199000);
gioHang.them('Mũ', 89000);
console.log(gioHang.tongTien());
```

`this` bên trong phương thức trỏ tới object đứng trước dấu chấm khi gọi (ở đây là `gioHang`). Quy tắc của `this` có vài cái bẫy, sẽ được giải thích đầy đủ ở [bài this & class](/nang-cao/class-prototype).

## 3. Duyệt object

```js run
const diem = { html: 9, css: 8, js: 7 };

console.log(Object.keys(diem));      // ['html', 'css', 'js']
console.log(Object.values(diem));    // [9, 8, 7]
console.log(Object.entries(diem));   // [['html', 9], ['css', 8], ['js', 7]]

for (const [mon, d] of Object.entries(diem)) {
  console.log(`${mon.toUpperCase()}: ${d}`);
}

// Kết hợp với phương thức mảng
const tong = Object.values(diem).reduce((t, d) => t + d, 0);
console.log('Trung bình:', tong / Object.keys(diem).length);

// entries → biến đổi → fromEntries: tạo object mới
const thangDiem100 = Object.fromEntries(
  Object.entries(diem).map(([mon, d]) => [mon, d * 10]),
);
console.log(thangDiem100);
```

**Object làm bảng tra cứu**, thay cho chuỗi `if`/`switch` dài:

```js run
const PHI_GIAO_HANG = { 'tieu-chuan': 15000, nhanh: 30000, 'hoa-toc': 60000 };

function tinhPhi(loai) {
  return PHI_GIAO_HANG[loai] ?? 15000;
}
console.log(tinhPhi('nhanh'), tinhPhi('khong-ro'));
```

## 4. Destructuring và spread

```js run
const nguoiDung = {
  id: 7,
  ten: 'Trần Thị Bình',
  diaChi: { thanhPho: 'Đà Nẵng', quan: 'Hải Châu' },
};

// Lấy thuộc tính ra biến
const { ten, id } = nguoiDung;
console.log(ten, id);

// Đổi tên biến và giá trị mặc định
const { ten: hoTen, vaiTro = 'học viên' } = nguoiDung;
console.log(hoTen, vaiTro);

// Lồng nhau
const { diaChi: { thanhPho } } = nguoiDung;
console.log(thanhPho);

// Phần còn lại
const { id: _, ...khongCoId } = nguoiDung;
console.log(khongCoId);

// Destructuring ngay ở tham số hàm
function chao({ ten, diaChi: { thanhPho } }) {
  return `Chào ${ten} đến từ ${thanhPho}`;
}
console.log(chao(nguoiDung));
```

**Spread** để gộp object và tạo bản sửa đổi mà **không đụng tới bản gốc**:

```js run
const macDinh = { theme: 'sang', coChu: 16, ngonNgu: 'vi' };
const nguoiDungChon = { theme: 'toi' };

const caiDat = { ...macDinh, ...nguoiDungChon };   // khóa trùng: bên phải thắng
console.log(caiDat);

const caiDatMoi = { ...caiDat, coChu: 18 };         // "sửa" bằng cách tạo object mới
console.log(caiDat.coChu, caiDatMoi.coChu);
```

## 5. Tham chiếu, sao chép nông và sâu

Giống mảng, object được truyền và gán **theo tham chiếu**:

```js run
const a = { ten: 'An', diaChi: { thanhPho: 'Hà Nội' } };

const b = a;                      // cùng một object
b.ten = 'Bình';
console.log(a.ten);               // 'Bình'

const c = { ...a };               // sao chép NÔNG: chỉ cấp ngoài cùng là mới
c.ten = 'Chi';
c.diaChi.thanhPho = 'Huế';        // diaChi vẫn là object chung!
console.log(a.ten, a.diaChi.thanhPho);   // 'Bình' 'Huế'

const d = structuredClone(a);     // sao chép SÂU: mọi cấp đều mới
d.diaChi.thanhPho = 'Cần Thơ';
console.log(a.diaChi.thanhPho);   // vẫn 'Huế'

console.log({ x: 1 } === { x: 1 }); // false — hai object khác nhau dù nội dung giống
```

`structuredClone()` có sẵn trong mọi trình duyệt hiện đại và Node.js; nó sao chép được cả `Date`, `Map`, `Set` nhưng không sao chép được hàm.

## 6. Optional chaining `?.`

Đọc thuộc tính của `undefined` gây lỗi, một trong những lỗi JavaScript phổ biến nhất:

```js run
const donHang = { id: 1, khachHang: { ten: 'An' } };

console.log(donHang.khachHang?.diaChi?.thanhPho);         // undefined, không lỗi
console.log(donHang.khachHang?.diaChi?.thanhPho ?? 'Chưa có địa chỉ');
console.log(donHang.giamGia?.tinh?.());                   // gọi hàm nếu nó tồn tại
console.log(donHang.sanPham?.[0]);                        // phần tử mảng nếu mảng tồn tại

console.log(donHang.khachHang.diaChi.thanhPho);           // TypeError: Cannot read properties of undefined
```

Dùng `?.` khi dữ liệu **thật sự có thể vắng mặt** (dữ liệu từ API, cài đặt tùy chọn). Đừng rải `?.` khắp nơi để "chữa cháy": nếu một giá trị bắt buộc phải có mà lại thiếu, tốt hơn là để lỗi lộ ra sớm.

## 7. JSON

**JSON** (JavaScript Object Notation) là định dạng **văn bản** để lưu trữ và trao đổi dữ liệu: API trả về JSON, tệp cấu hình `package.json`, dữ liệu lưu trong localStorage...

```json
{
  "ten": "Bàn phím cơ",
  "gia": 450000,
  "conHang": true,
  "mauSac": ["đen", "trắng"],
  "giamGia": null
}
```

JSON trông giống object nhưng chặt hơn: khóa **bắt buộc nháy kép**, chuỗi chỉ dùng nháy kép, không có dấu phẩy thừa ở cuối, không chú thích, không có hàm, `undefined` hay `NaN`.

```js run
const sanPham = { ten: 'Chuột', gia: 150000, ngayTao: new Date('2026-10-27'), chao() {} };

// Object → chuỗi JSON
const chuoi = JSON.stringify(sanPham);
console.log(chuoi);                              // hàm bị bỏ, Date thành chuỗi
console.log(JSON.stringify(sanPham, null, 2));   // có thụt lề cho dễ đọc

// Chuỗi JSON → object
const doc = JSON.parse('{"ten":"Tai nghe","gia":700000,"mau":["đen"]}');
console.log(doc.ten, doc.mau);

// Chuỗi JSON hỏng → lỗi, nên bọc try...catch
try {
  JSON.parse("{ten: 'sai cú pháp'}");
} catch (loi) {
  console.log('Không đọc được JSON:', loi.message);
}
```

## 8. Lưu dữ liệu vào localStorage

`localStorage` lưu dữ liệu **trên trình duyệt** của người dùng, vẫn còn sau khi đóng tab hay tắt máy. Nó chỉ lưu được **chuỗi**, nên object phải đi qua JSON:

```js run
const KHOA = 'gio-hang';

// Đọc (lần đầu chưa có gì → getItem trả về null)
const gioHang = JSON.parse(localStorage.getItem(KHOA) ?? '[]');
console.log('Đã có trong giỏ:', gioHang);

// Thêm và lưu lại
gioHang.push({ ten: 'Mũ', gia: 89000 });
localStorage.setItem(KHOA, JSON.stringify(gioHang));
console.log('Sau khi thêm:', JSON.parse(localStorage.getItem(KHOA)));
```

Bấm **↻ Chạy lại** nhiều lần: giỏ hàng dài thêm, như khi tải lại trang thật. Ví dụ trong bài dùng localStorage giả lập riêng cho từng ví dụ, không đụng tới localStorage thật của trang. Các thao tác khác: `localStorage.removeItem(KHOA)`, `localStorage.clear()`.

::: warning Giới hạn của localStorage
- Chỉ khoảng **5 MB** mỗi tên miền, chỉ lưu chuỗi, đọc ghi **đồng bộ** (dữ liệu lớn làm chậm trang).
- **Không bao giờ** lưu mật khẩu, token đăng nhập hay thông tin nhạy cảm: mọi đoạn JavaScript chạy trên trang (kể cả script bị chèn qua lỗ hổng XSS) đều đọc được.
- Người dùng có thể xóa bất cứ lúc nào, và mỗi trình duyệt có một kho riêng. Đây là bộ nhớ "tiện thì dùng", không phải cơ sở dữ liệu.

Các lựa chọn khác (sessionStorage, IndexedDB, cookie) ở [bài Bảo mật](/nang-cao/bao-mat-a11y) và [Hiệu năng](/nang-cao/hieu-nang).
:::

## 9. Map và Set

**`Set`** là tập hợp **không trùng lặp**:

```js run
const daXem = new Set();
daXem.add('bai-1');
daXem.add('bai-2');
daXem.add('bai-1');                 // trùng → bỏ qua
console.log(daXem.size, daXem.has('bai-2'));
daXem.delete('bai-2');
console.log([...daXem]);            // chuyển thành mảng

// Phép toán tập hợp (ES2025)
const html = new Set(['An', 'Bình', 'Chi']);
const css = new Set(['Bình', 'Chi', 'Dũng']);
console.log(html.intersection(css));   // học cả hai
console.log(html.union(css));          // học ít nhất một
console.log(html.difference(css));     // chỉ học HTML
```

**`Map`** là tập hợp cặp khóa–giá trị như object, nhưng khóa có thể là **bất kỳ kiểu gì** (số, object...), giữ đúng thứ tự thêm vào, và có `size`:

```js run
const soLanBam = new Map();

function dem(nutBam) {
  soLanBam.set(nutBam, (soLanBam.get(nutBam) ?? 0) + 1);
}
dem('mua'); dem('mua'); dem('huy');

console.log(soLanBam.get('mua'), soLanBam.size);
for (const [nut, lan] of soLanBam) {
  console.log(nut, lan);
}
```

| Dùng | Khi |
| --- | --- |
| Object | Mô tả một "thứ" có các thuộc tính cố định (sản phẩm, người dùng); dữ liệu cần chuyển sang JSON |
| Map | Từ điển có khóa thay đổi liên tục, khóa không phải chuỗi, cần đếm/tra cứu nhiều |
| Mảng | Danh sách có thứ tự, có thể trùng |
| Set | Tập hợp không trùng, cần kiểm tra "có chứa không" nhanh |

## Thực hành

**Bài 1.** Cho object `const hocVien = { ten: 'An', diem: { html: 9, css: 7, js: 8 } };`. Dùng destructuring lấy `ten` và điểm `js`; tính điểm trung bình ba môn bằng `Object.values` và `reduce`; tạo object mới có thêm `xepLoai: 'Giỏi'` mà không sửa `hocVien`.

::: details Xem lời giải
```js run
const hocVien = { ten: 'An', diem: { html: 9, css: 7, js: 8 } };

const { ten, diem: { js } } = hocVien;
const cacDiem = Object.values(hocVien.diem);
const trungBinh = cacDiem.reduce((t, d) => t + d, 0) / cacDiem.length;
const ketQua = { ...hocVien, xepLoai: trungBinh >= 8 ? 'Giỏi' : 'Khá' };

console.log(ten, js, trungBinh);
console.log(ketQua);
console.log(hocVien);   // không bị thêm xepLoai
```
:::

**Bài 2.** Đếm số lần xuất hiện của mỗi từ trong câu `'học học nữa học mãi nữa'`. In ra object kiểu `{học: 3, nữa: 2, mãi: 1}`.

::: details Xem lời giải
```js run
const cau = 'học học nữa học mãi nữa';
const dem = {};

for (const tu of cau.split(' ')) {
  dem[tu] = (dem[tu] ?? 0) + 1;
}
console.log(dem);
```
Dùng `Map` cũng được: `map.set(tu, (map.get(tu) ?? 0) + 1)`.
:::

**Bài 3.** Viết hai hàm `luuGhiChu(danhSach)` và `docGhiChu()` dùng localStorage với khóa `'ghi-chu'`. `docGhiChu()` trả về mảng rỗng nếu chưa có dữ liệu **hoặc dữ liệu bị hỏng**.

::: details Xem lời giải
```js run
const KHOA = 'ghi-chu';

function luuGhiChu(danhSach) {
  localStorage.setItem(KHOA, JSON.stringify(danhSach));
}

function docGhiChu() {
  try {
    const duLieu = JSON.parse(localStorage.getItem(KHOA) ?? '[]');
    return Array.isArray(duLieu) ? duLieu : [];
  } catch {
    return [];
  }
}

localStorage.setItem(KHOA, '{hỏng');      // giả lập dữ liệu bị hỏng
console.log(docGhiChu());                 // []
luuGhiChu(['Mua sữa', 'Học bài Object']);
console.log(docGhiChu());
```
Dữ liệu trong localStorage do người dùng (hoặc phiên bản cũ của ứng dụng) để lại, nên luôn kiểm tra trước khi tin.
:::

## Lỗi thường gặp

- **`obj.khoa` khi khóa nằm trong biến** → phải dùng `obj[khoa]`.
- **Đọc thuộc tính của `undefined`** → `TypeError: Cannot read properties of undefined`. Kiểm tra dữ liệu hoặc dùng `?.` khi giá trị có thể vắng.
- **Tưởng `{ ...obj }` là bản sao sâu.**
- **So sánh object bằng `===`** để kiểm tra nội dung.
- **Lưu object vào localStorage không qua `JSON.stringify`** → lưu thành chuỗi `'[object Object]'`.
- **`JSON.parse` không có `try...catch`** với dữ liệu không chắc chắn.

## Tóm tắt

- Object là các cặp khóa–giá trị; đọc bằng `.khoa` hoặc `[bieuThuc]`; thêm, sửa, `delete`, `in`.
- `Object.keys/values/entries/fromEntries` để duyệt và biến đổi.
- Destructuring `{ a, b: tenMoi, c = 1 }`, spread `{ ...a, ...b }`.
- Gán object là gán tham chiếu; spread sao chép nông, `structuredClone` sao chép sâu.
- `?.` đọc an toàn khi dữ liệu có thể vắng; kết hợp `??` để có giá trị mặc định.
- JSON: `JSON.stringify` / `JSON.parse`; localStorage chỉ lưu chuỗi, không lưu dữ liệu nhạy cảm.
- `Set` cho tập không trùng, `Map` cho từ điển có khóa bất kỳ.

## Kiểm tra kiến thức

<Quiz />
