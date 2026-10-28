---
title: Chuỗi, số & ngày giờ
description: Phương thức xử lý chuỗi, chuẩn hóa và bỏ dấu tiếng Việt, biểu thức chính quy cơ bản, đối tượng Math, làm tròn và số ngẫu nhiên, định dạng tiền tệ, số và ngày giờ theo kiểu Việt Nam với Intl, làm việc với Date.
quiz:
  - q: "Chuỗi trong JavaScript là bất biến (immutable). Điều đó có nghĩa là gì?"
    options:
      - "Không thể tạo chuỗi mới"
      - "Phương thức như `toUpperCase()` không sửa chuỗi gốc mà trả về chuỗi mới"
      - "Không thể nối chuỗi"
      - "Chuỗi không có độ dài"
    answer: 1
    explain: "`ten.toUpperCase()` trả về chuỗi mới; `ten` vẫn như cũ. Muốn đổi thì gán lại: `ten = ten.toUpperCase()`."
  - q: "Cách nào hiển thị `1250000` thành `1.250.000 ₫` theo kiểu Việt Nam?"
    options:
      - "`1250000 + ' ₫'`"
      - "`new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(1250000)`"
      - "`(1250000).toFixed(3)`"
      - "`String(1250000).split('').join('.')`"
    answer: 1
    explain: "`Intl.NumberFormat` định dạng đúng dấu phân cách và ký hiệu tiền theo từng ngôn ngữ. `toLocaleString('vi-VN')` là cách viết ngắn tương đương."
  - q: "`new Date(2026, 0, 15)` là ngày nào?"
    options:
      - "15/01/2026"
      - "15/00/2026 (lỗi)"
      - "15/02/2026"
      - "01/15/2026"
    answer: 0
    explain: "Tháng trong `Date` đếm **từ 0**: 0 là tháng Một, 11 là tháng Mười Hai. Ngày thì đếm từ 1. Đây là bẫy nổi tiếng."
  - q: "`Math.floor(Math.random() * 6) + 1` tạo ra số gì?"
    options:
      - "Số thực từ 0 đến 6"
      - "Số nguyên ngẫu nhiên từ 1 đến 6"
      - "Số nguyên từ 0 đến 5"
      - "Luôn là 6"
    answer: 1
    explain: "`Math.random()` cho số thực trong [0, 1); nhân 6 được [0, 6); làm tròn xuống được 0–5; cộng 1 được 1–6. Đây là công thức tung xúc xắc."
  - q: "Muốn tìm kiếm không phân biệt dấu (gõ “ha noi” tìm được “Hà Nội”), bước quan trọng là gì?"
    options:
      - "Dùng `toUpperCase()`"
      - "Chuẩn hóa `normalize('NFD')`, xóa các dấu kết hợp, đổi `đ` thành `d`, rồi so sánh chữ thường"
      - "Dùng `==` thay cho `===`"
      - "Không làm được trong JavaScript"
    answer: 1
    explain: "NFD tách chữ có dấu thành chữ gốc + dấu kết hợp (U+0300–U+036F) để xóa đi. Chữ `đ` là chữ riêng nên phải thay tay. Thanh tìm kiếm của chính trang này làm đúng như vậy."
---

# Chuỗi, số & ngày giờ

::: info Mục tiêu bài học
- Dùng các phương thức **chuỗi** hay gặp: tìm, cắt, thay thế, tách, viết hoa, cắt khoảng trắng.
- Xử lý **tiếng Việt**: so sánh, sắp xếp, bỏ dấu để tìm kiếm.
- Dùng **biểu thức chính quy** (regex) ở mức cơ bản.
- Làm tròn, lấy số ngẫu nhiên với **Math**; định dạng **tiền tệ, số, ngày giờ** kiểu Việt Nam với `Intl`.
- Làm việc với **Date** và tránh các bẫy thường gặp.
:::

## 1. Phương thức chuỗi hay dùng

Chuỗi là **bất biến**: mọi phương thức đều trả về chuỗi **mới**, không sửa chuỗi gốc.

```js run
const cau = '  Học JavaScript thật vui  ';

console.log(cau.trim());                     // bỏ khoảng trắng hai đầu
console.log(cau.trim().length);
console.log(cau.toUpperCase());              // VIẾT HOA
console.log(cau.toLowerCase());              // viết thường

const email = 'an.nguyen@example.com';
console.log(email.includes('@'));            // true
console.log(email.startsWith('an'));         // true
console.log(email.endsWith('.vn'));          // false
console.log(email.indexOf('@'));             // 9 — vị trí đầu tiên, -1 nếu không có
console.log(email.slice(0, 9));              // 'an.nguyen' — cắt từ 0 tới trước 9
console.log(email.slice(email.indexOf('@') + 1));   // 'example.com'
console.log(email.at(-1));                   // 'm' — ký tự cuối

console.log('a-b-c'.split('-'));             // ['a', 'b', 'c'] — tách thành mảng
console.log('ha ha ha'.replace('ha', 'hi')); // 'hi ha ha' — chỉ thay lần đầu
console.log('ha ha ha'.replaceAll('ha', 'hi'));
console.log('5'.padStart(3, '0'));           // '005' — đệm cho đủ độ dài
console.log('=-'.repeat(5));
```

| Phương thức | Việc làm |
| --- | --- |
| `trim()`, `trimStart()`, `trimEnd()` | Bỏ khoảng trắng: luôn dùng cho dữ liệu người dùng nhập |
| `toUpperCase()`, `toLowerCase()` | Đổi hoa/thường |
| `includes()`, `startsWith()`, `endsWith()` | Kiểm tra có chứa / bắt đầu / kết thúc bằng |
| `indexOf()`, `lastIndexOf()` | Tìm vị trí |
| `slice(dau, cuoi)` | Cắt chuỗi con (nhận cả chỉ số âm) |
| `split(phanCach)` | Tách thành mảng; `join` làm ngược lại |
| `replace()`, `replaceAll()` | Thay thế |
| `padStart()`, `padEnd()` | Đệm cho đủ độ dài (số thứ tự, giờ phút) |

## 2. Tiếng Việt: so sánh, sắp xếp, bỏ dấu

```js run
// So sánh và sắp xếp theo thứ tự chữ cái tiếng Việt
const ten = ['Ước', 'Anh', 'Đạt', 'Ân', 'Bảo'];
console.log(ten.toSorted((a, b) => a.localeCompare(b, 'vi')));

// Viết hoa chữ cái đầu mỗi từ
function vietHoaDau(chuoi) {
  return chuoi
    .toLowerCase()
    .split(' ')
    .map((tu) => tu.charAt(0).toUpperCase() + tu.slice(1))
    .join(' ');
}
console.log(vietHoaDau('nguyễn THỊ minh khai'));

// Bỏ dấu tiếng Việt — dùng cho tìm kiếm, tạo đường dẫn
function boDau(chuoi) {
  return chuoi
    .normalize('NFD')                   // tách 'ế' thành 'e' + dấu mũ + dấu sắc
    .replace(/[̀-ͯ]/g, '')    // xóa các dấu kết hợp
    .replace(/đ/g, 'd')
    .replace(/Đ/g, 'D');
}
console.log(boDau('Thành phố Hồ Chí Minh — Đà Lạt'));

// Tạo slug cho URL
function taoSlug(tieuDe) {
  return boDau(tieuDe)
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')        // mọi ký tự không phải chữ/số → gạch ngang
    .replace(/^-+|-+$/g, '');           // bỏ gạch ngang thừa ở hai đầu
}
console.log(taoSlug('  Học CSS Grid trong 10 phút!  '));

// Tìm kiếm không phân biệt dấu và hoa thường
const thanhPho = ['Hà Nội', 'Hải Phòng', 'Đà Nẵng', 'Huế'];
const tuKhoa = 'ha';
console.log(thanhPho.filter((tp) => boDau(tp).toLowerCase().includes(boDau(tuKhoa).toLowerCase())));
```

::: tip Cùng một chữ, hai cách mã hóa
Chữ "ế" có thể lưu thành **một** ký tự (dạng dựng sẵn, NFC) hoặc **ba** ký tự (e + dấu mũ + dấu sắc, NFD). Hai chuỗi nhìn giống hệt nhau mà `===` lại ra `false`. Văn bản copy từ một số ứng dụng trên macOS hay ở dạng NFD. Khi so sánh dữ liệu từ nhiều nguồn, hãy chuẩn hóa trước: `a.normalize('NFC') === b.normalize('NFC')`.
:::

## 3. Biểu thức chính quy (regex) cơ bản

**Regex** là mẫu để tìm, kiểm tra, thay thế chuỗi. Viết giữa hai dấu `/`:

```js run
const soDienThoai = /^0\d{9}$/;           // bắt đầu bằng 0, đúng 9 chữ số nữa, rồi hết
console.log(soDienThoai.test('0901234567'));   // true
console.log(soDienThoai.test('090123'));       // false

const chiSo = '0901.234.567'.replace(/\D/g, '');   // \D = không phải chữ số; g = mọi chỗ
console.log(chiSo);

const vanBan = 'Liên hệ: an@example.com hoặc binh@truong.edu.vn';
console.log(vanBan.match(/[\w.]+@[\w.]+\.\w+/g));   // tìm mọi email

const ngay = '2026-10-27';
const kq = ngay.match(/^(\d{4})-(\d{2})-(\d{2})$/);  // nhóm ( ) để lấy từng phần
console.log(kq[1], kq[2], kq[3]);
```

| Ký hiệu | Nghĩa |
| --- | --- |
| `^` `$` | Đầu / cuối chuỗi |
| `\d` `\w` `\s` | Chữ số / chữ cái-số-gạch dưới (không gồm chữ có dấu) / khoảng trắng |
| `\D` `\W` `\S` | Phủ định của ba loại trên |
| `.` | Ký tự bất kỳ (trừ xuống dòng). Muốn tìm dấu chấm thật thì viết `\.` |
| `[abc]` `[^abc]` `[a-z]` | Một trong các ký tự / không phải / khoảng |
| `*` `+` `?` `{3}` `{2,5}` | 0+ lần / 1+ lần / 0–1 lần / đúng 3 / từ 2 đến 5 lần |
| `( )` | Nhóm (lấy ra được kết quả) |
| Cờ `g` `i` `u` | Mọi kết quả / không phân biệt hoa thường / Unicode |

Regex rất mạnh nhưng khó đọc. Viết mẫu đơn giản, có chú thích, và thử trên [regex101.com](https://regex101.com) trước khi dùng. Đừng cố viết regex "hoàn hảo" để kiểm tra email: `type="email"` của trình duyệt và một email xác nhận là đủ.

## 4. Math và số

```js run
console.log(Math.round(4.5), Math.round(4.4));   // 5 4 — làm tròn gần nhất
console.log(Math.floor(4.9), Math.ceil(4.1));    // 4 5 — làm tròn xuống / lên
console.log(Math.trunc(-4.7));                   // -4 — bỏ phần thập phân
console.log(Math.max(3, 8, 1), Math.min(3, 8, 1));
console.log(Math.abs(-7), Math.sqrt(16), Math.PI);

// Làm tròn tới 2 chữ số thập phân
const tb = 7.456;
console.log(Math.round(tb * 100) / 100);        // 7.46 (số)
console.log(tb.toFixed(2));                     // '7.46' (chuỗi — dùng để hiển thị)

// Số nguyên ngẫu nhiên trong khoảng [min, max]
function ngauNhien(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}
console.log(ngauNhien(1, 6), ngauNhien(1, 6), ngauNhien(1, 6));

// Kiểm tra số
console.log(Number.isInteger(5), Number.isInteger(5.5));
console.log(Number.isFinite(1 / 0));
console.log(Number.MAX_SAFE_INTEGER);           // số nguyên lớn nhất còn chính xác
```

`Math.random()` **không** đủ an toàn cho mật khẩu, mã OTP hay bất cứ thứ gì liên quan bảo mật. Hãy dùng `crypto.getRandomValues()` hoặc `crypto.randomUUID()`.

## 5. Định dạng kiểu Việt Nam với `Intl`

Đừng tự viết hàm thêm dấu chấm phân cách nghìn: trình duyệt đã có sẵn **`Intl`**, định dạng đúng cho mọi ngôn ngữ:

```js run
const VND = new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' });
console.log(VND.format(1250000));                     // 1.250.000 ₫
console.log(VND.format(99000.5));                     // VND làm tròn: 99.001 ₫

console.log((1234567.891).toLocaleString('vi-VN'));   // 1.234.567,891
console.log((0.256).toLocaleString('vi-VN', { style: 'percent' }));                 // 26%
console.log((2500000).toLocaleString('vi-VN', { notation: 'compact' }));            // 2,5 Tr
console.log(new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(19.9));

// Thời gian tương đối: "3 ngày trước"
const tuongDoi = new Intl.RelativeTimeFormat('vi', { numeric: 'auto' });
console.log(tuongDoi.format(-3, 'day'), '|', tuongDoi.format(1, 'day'), '|', tuongDoi.format(-2, 'hour'));

// Danh sách: "A, B và C"
console.log(new Intl.ListFormat('vi', { type: 'conjunction' }).format(['HTML', 'CSS', 'JavaScript']));
```

Tạo `Intl.NumberFormat` một lần rồi dùng lại (như biến `VND`) sẽ nhanh hơn tạo mới mỗi lần định dạng.

## 6. Ngày giờ với `Date`

```js run
const bayGio = new Date();                        // thời điểm hiện tại
console.log(bayGio.toISOString());                // dạng chuẩn quốc tế, giờ UTC

const khaiGiang = new Date(2026, 10, 15, 8, 30);  // 15/11/2026 8:30 — tháng 10 là THÁNG 11!
console.log(khaiGiang.getFullYear(), khaiGiang.getMonth() + 1, khaiGiang.getDate());
console.log(khaiGiang.getDay());                  // thứ trong tuần: 0 = Chủ nhật

const tuChuoi = new Date('2026-10-27T09:00:00+07:00');   // chuỗi ISO, ghi rõ múi giờ
console.log(tuChuoi.getTime());                   // số mili giây kể từ 1/1/1970 (UTC)

// Định dạng tiếng Việt
console.log(khaiGiang.toLocaleDateString('vi-VN'));                       // 15/11/2026
console.log(khaiGiang.toLocaleString('vi-VN', {
  weekday: 'long', day: 'numeric', month: 'long', year: 'numeric',
  hour: '2-digit', minute: '2-digit',
}));

// Khoảng cách giữa hai ngày
const motNgay = 24 * 60 * 60 * 1000;
const soNgay = Math.round((khaiGiang - tuChuoi) / motNgay);
console.log(`Còn ${soNgay} ngày nữa là khai giảng`);

// Cộng thêm ngày: tạo bản sao rồi sửa
const hanNop = new Date(khaiGiang);
hanNop.setDate(hanNop.getDate() + 30);            // tự xử lý sang tháng sau
console.log(hanNop.toLocaleDateString('vi-VN'));
```

::: warning Các bẫy của `Date`
- **Tháng đếm từ 0** (0 = tháng Một), nhưng ngày đếm từ 1.
- `Date` có thể **sửa được**: `setDate()` thay đổi chính object đó. Muốn giữ bản gốc thì tạo bản sao trước.
- **Múi giờ**: `new Date('2026-10-27')` (chỉ có ngày) được hiểu là nửa đêm **UTC**, tức 7 giờ sáng ở Việt Nam; còn `new Date('2026-10-27T00:00')` lại là giờ địa phương. Hãy dùng chuỗi ISO đầy đủ có múi giờ, hoặc truyền từng thành phần.
- Khi lưu hay gửi lên server, dùng `toISOString()`; chỉ định dạng theo ngôn ngữ khi **hiển thị**.
:::

`Date` có nhiều nhược điểm đến mức JavaScript đang có một API thay thế tên là **Temporal**, rõ ràng và an toàn hơn nhiều. Temporal đã bắt đầu có mặt trên một số trình duyệt; hãy kiểm tra hỗ trợ trên caniuse trước khi dùng trong dự án thật.

## Thực hành

**Bài 1.** Viết hàm `chuanHoaTen(ten)`: bỏ khoảng trắng thừa (cả ở giữa), viết hoa chữ cái đầu mỗi từ. `'  nguyễn   văn    AN '` → `'Nguyễn Văn An'`.

::: details Xem lời giải
```js run
function chuanHoaTen(ten) {
  return ten
    .trim()
    .split(/\s+/)                       // tách theo một hoặc nhiều khoảng trắng
    .map((tu) => tu.charAt(0).toUpperCase() + tu.slice(1).toLowerCase())
    .join(' ');
}
console.log(chuanHoaTen('  nguyễn   văn    AN '));
```
:::

**Bài 2.** Cho mảng giao dịch `[{ ngay: '2026-10-01', soTien: 1500000 }, { ngay: '2026-10-15', soTien: -320000 }]`. In mỗi giao dịch thành dòng `01/10/2026  +1.500.000 ₫` (số dương có dấu `+`).

::: details Xem lời giải
```js run
const giaoDich = [
  { ngay: '2026-10-01', soTien: 1500000 },
  { ngay: '2026-10-15', soTien: -320000 },
];

const tien = new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND', signDisplay: 'always' });

for (const gd of giaoDich) {
  const [nam, thang, ngay] = gd.ngay.split('-');
  console.log(`${ngay}/${thang}/${nam}  ${tien.format(gd.soTien)}`);
}
```
Tách chuỗi ngày thay vì `new Date('2026-10-01')` để khỏi vướng bẫy múi giờ. Tùy chọn `signDisplay: 'always'` của `Intl.NumberFormat` tự thêm dấu `+`.
:::

**Bài 3.** Viết hàm `demNguoc(ngayDich)` trả về chuỗi kiểu `'Còn 12 ngày 5 giờ'` tính từ thời điểm hiện tại tới `ngayDich`, hoặc `'Đã qua'` nếu ngày đã qua.

::: details Xem lời giải
```js run
function demNguoc(ngayDich) {
  const conLai = ngayDich - new Date();         // trừ hai Date → số mili giây
  if (conLai <= 0) return 'Đã qua';
  const gio = Math.floor(conLai / (60 * 60 * 1000));
  return `Còn ${Math.floor(gio / 24)} ngày ${gio % 24} giờ`;
}

console.log(demNguoc(new Date(2030, 0, 1)));
console.log(demNguoc(new Date(2020, 0, 1)));
```
:::

## Lỗi thường gặp

- **Quên chuỗi bất biến**: gọi `ten.trim()` mà không gán lại kết quả.
- **So sánh, sắp xếp chuỗi tiếng Việt bằng `<`, `>`** → sai thứ tự; dùng `localeCompare(b, 'vi')`.
- **Tự viết hàm định dạng tiền** → dễ sai với số âm, số lẻ. Dùng `Intl.NumberFormat`.
- **`toFixed()` trả về chuỗi**, cộng tiếp sẽ thành nối chuỗi.
- **Tháng trong `Date` đếm từ 0**; nhầm múi giờ khi tạo `Date` từ chuỗi chỉ có ngày.
- **Dùng `Math.random()` cho mục đích bảo mật.**

## Tóm tắt

- Chuỗi bất biến; phương thức chính: `trim`, `toUpperCase/LowerCase`, `includes`, `slice`, `split`/`join`, `replace(All)`, `padStart`.
- Tiếng Việt: `localeCompare(b, 'vi')` để sắp xếp; `normalize('NFD')` + xóa `̀-ͯ` + đổi `đ` để bỏ dấu.
- Regex `/mẫu/cờ` với `test`, `match`, `replace` cho mẫu đơn giản.
- `Math.round/floor/ceil`, `toFixed` để hiển thị, `Math.random` cho số ngẫu nhiên (không dùng cho bảo mật).
- `Intl.NumberFormat('vi-VN', ...)`, `toLocaleString('vi-VN')`, `Intl.RelativeTimeFormat` để định dạng đúng kiểu Việt Nam.
- `Date`: tháng từ 0, cẩn thận múi giờ, lưu bằng `toISOString()`, hiển thị bằng `toLocaleDateString('vi-VN')`.

## Kiểm tra kiến thức

<Quiz />
