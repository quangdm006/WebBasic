---
title: Xử lý lỗi & debug
description: Các loại lỗi, try catch finally, throw và đối tượng Error, lớp lỗi tùy chỉnh, nơi nên bắt lỗi, lỗi bất đồng bộ, bắt lỗi toàn cục, quy trình debug, breakpoint và các công cụ debug trong DevTools.
quiz:
  - q: "Vì sao nên `throw new Error('...')` thay vì `throw 'chuỗi lỗi'`?"
    options:
      - "Vì throw chuỗi là lỗi cú pháp"
      - "Vì object `Error` có `name`, `message` và đặc biệt là `stack` cho biết lỗi xảy ra ở đâu, qua những hàm nào"
      - "Vì chuỗi không hiển thị được tiếng Việt"
      - "Không có khác biệt"
    answer: 1
    explain: "JavaScript cho phép throw bất kỳ giá trị nào, nhưng chỉ `Error` (và lớp con) mới có stack trace, thứ quý nhất khi debug."
  - q: "Khối `finally` chạy khi nào?"
    options:
      - "Chỉ khi có lỗi"
      - "Chỉ khi không có lỗi"
      - "Luôn chạy, dù `try` thành công, có lỗi, hay có `return`"
      - "Chỉ trong hàm async"
    answer: 2
    explain: "`finally` dành cho việc dọn dẹp: tắt biểu tượng đang tải, đóng kết nối, bật lại nút."
  - q: "Đoạn `try { ... } catch (e) {}` (catch rỗng) có vấn đề gì?"
    options:
      - "Lỗi cú pháp"
      - "Nó “nuốt” lỗi: chương trình sai mà không ai biết, rất khó tìm nguyên nhân sau này"
      - "Làm chương trình chạy chậm"
      - "Không có vấn đề gì"
    answer: 1
    explain: "Chỉ bắt lỗi khi bạn **làm được gì đó** với nó: thông báo cho người dùng, thử lại, dùng giá trị dự phòng, ghi log. Không thì để lỗi lan lên tầng có thể xử lý."
  - q: "Câu lệnh `debugger;` trong code có tác dụng gì?"
    options:
      - "Tự sửa lỗi"
      - "Khi DevTools đang mở, chương trình dừng tại dòng đó như một breakpoint"
      - "Xóa console"
      - "In ra stack trace"
    answer: 1
    explain: "Khi đã dừng, bạn xem được giá trị mọi biến, call stack, và chạy từng bước. Nhớ xóa `debugger` trước khi đưa code lên production."
  - q: "Bước đầu tiên khi debug một lỗi người dùng báo là gì?"
    options:
      - "Sửa thử vài chỗ nghi ngờ"
      - "Tái hiện được lỗi một cách ổn định (biết chính xác các bước gây ra lỗi)"
      - "Viết lại cả tính năng"
      - "Tắt console để bớt rối"
    answer: 1
    explain: "Không tái hiện được thì không biết đã sửa đúng hay chưa. Sau đó mới khoanh vùng, đặt giả thuyết, kiểm chứng."
---

# Xử lý lỗi & debug

::: info Mục tiêu bài học
- Phân biệt lỗi **cú pháp**, lỗi **lúc chạy** và lỗi **logic**; đọc được stack trace.
- Dùng `try...catch...finally`, `throw` và đối tượng `Error`; tạo **lớp lỗi riêng**.
- Biết **nên bắt lỗi ở đâu**, xử lý lỗi **bất đồng bộ** và bắt lỗi **toàn cục**.
- Debug có phương pháp và dùng thành thạo **breakpoint** trong DevTools.
:::

## 1. Ba loại lỗi

| Loại | Khi nào lộ ra | Ví dụ |
| --- | --- | --- |
| **Lỗi cú pháp** (SyntaxError) | Trước khi chạy: cả tệp không chạy được | Thiếu `}`, gõ `functon` |
| **Lỗi lúc chạy** (runtime error) | Khi chạy tới dòng đó | Gọi hàm không tồn tại, đọc thuộc tính của `undefined` |
| **Lỗi logic** | Không có thông báo gì, chỉ là **kết quả sai** | Dùng `<=` thay vì `<`, cộng chuỗi thay vì cộng số |

Lỗi logic là loại khó nhất, vì máy không báo gì cả. Đó là lúc bạn cần kiểm thử và kỹ năng debug.

Các loại lỗi lúc chạy có sẵn:

| Lỗi | Nguyên nhân thường gặp |
| --- | --- |
| `ReferenceError` | Dùng biến chưa khai báo (sai tên, sai hoa thường), hoặc dùng `let`/`const` trước khi khai báo |
| `TypeError` | Dùng sai kiểu: gọi thứ không phải hàm, đọc thuộc tính của `null`/`undefined`, gán lại `const` |
| `RangeError` | Giá trị ngoài khoảng cho phép: `new Array(-1)`, đệ quy quá sâu |
| `SyntaxError` | Sai cú pháp, kể cả khi `JSON.parse` một chuỗi hỏng |

## 2. Đọc stack trace

```js run
function tinhTrungBinh(diem) {
  return tong(diem) / diem.length;
}
function tong(ds) {
  return ds.reduce((t, x) => t + x, 0);
}
function hienKetQua(hocVien) {
  console.log(hocVien.ten, tinhTrungBinh(hocVien.diem));
}

try {
  hienKetQua({ ten: 'An' });           // quên truyền mảng điểm
} catch (loi) {
  console.log(loi.name, '|', loi.message);
  console.log(loi.stack);
}
```

**Stack trace** liệt kê các hàm đang được gọi lúc lỗi xảy ra, **trên cùng là nơi lỗi nổ ra**, bên dưới là ai gọi nó: `tong` ← `tinhTrungBinh` ← `hienKetQua`. Lỗi nổ ở `tong` (gọi `reduce` trên `undefined`) nhưng **nguyên nhân** nằm ở nơi gọi `hienKetQua` thiếu dữ liệu. Đọc stack trace từ trên xuống để tìm chỗ nổ, rồi lần ngược để tìm nguồn gốc. Trong DevTools, tên tệp và số dòng trong stack trace bấm được.

## 3. `try...catch...finally` và `throw`

```js run
function rutTien(soDu, soTien) {
  if (typeof soTien !== 'number' || Number.isNaN(soTien)) {
    throw new TypeError('Số tiền phải là một con số');
  }
  if (soTien <= 0) {
    throw new RangeError('Số tiền rút phải lớn hơn 0');
  }
  if (soTien > soDu) {
    throw new Error(`Không đủ số dư (còn ${soDu}, cần ${soTien})`);
  }
  return soDu - soTien;
}

for (const soTien of [200, -5, 'abc', 5000]) {
  try {
    const conLai = rutTien(1000, soTien);
    console.log('Rút', soTien, '→ còn', conLai);
  } catch (loi) {
    console.log(`${loi.name}: ${loi.message}`);
  } finally {
    console.log('— kết thúc giao dịch —');
  }
}
```

- `throw` **ném** lỗi: hàm dừng ngay, lỗi lan ngược lên theo chuỗi lời gọi cho tới khi gặp một `catch`. Không có `catch` nào thì lỗi thành "Uncaught" và script dừng.
- `catch (loi)` nhận lỗi. Không cần dùng biến lỗi thì viết `catch { ... }`.
- `finally` **luôn chạy**: dọn dẹp, bật lại nút, ẩn biểu tượng đang tải.
- Luôn ném **object `Error`** (hoặc lớp con) để có `stack`. Thêm nguyên nhân gốc bằng `{ cause }`: `throw new Error('Không lưu được đơn hàng', { cause: loiGoc })`.

## 4. Lớp lỗi riêng

Khi ứng dụng có nhiều loại lỗi cần xử lý khác nhau, hãy tạo lớp lỗi riêng (kế thừa `Error`, xem [bài Class](/nang-cao/class-prototype)):

```js run
class LoiKiemTra extends Error {
  constructor(truong, message) {
    super(message);
    this.name = 'LoiKiemTra';
    this.truong = truong;             // thêm thông tin riêng
  }
}

class LoiMang extends Error {
  name = 'LoiMang';
}

function kiemTraDangKy({ email, tuoi }) {
  if (!email.includes('@')) throw new LoiKiemTra('email', 'Email chưa đúng định dạng');
  if (tuoi < 16) throw new LoiKiemTra('tuoi', 'Bạn phải từ 16 tuổi trở lên');
}

try {
  kiemTraDangKy({ email: 'an@example.com', tuoi: 14 });
} catch (loi) {
  if (loi instanceof LoiKiemTra) {
    console.log(`Hiện lỗi cạnh ô "${loi.truong}": ${loi.message}`);
  } else if (loi instanceof LoiMang) {
    console.log('Hiện thông báo mất mạng, cho nút thử lại');
  } else {
    throw loi;                        // lỗi không lường trước: ném tiếp, đừng nuốt
  }
}
```

## 5. Bắt lỗi ở đâu?

- **Chỉ bắt khi làm được gì đó**: hiện thông báo dễ hiểu, thử lại, dùng giá trị dự phòng. Không thì để lỗi lan lên.
- **Đừng "nuốt" lỗi** bằng `catch` rỗng hay `catch (e) { console.log(e) }` rồi chạy tiếp như không có gì: chương trình ở trạng thái sai mà không ai biết.
- **Bắt ở ranh giới**: nơi người dùng tương tác (listener của nút bấm, của form), nơi gọi API, nơi đọc dữ liệu bên ngoài (`JSON.parse`, localStorage). Hàm tính toán bên trong thường chỉ cần `throw`.
- **Thông báo cho người dùng** bằng ngôn ngữ của họ ("Không lưu được, vui lòng thử lại"); chi tiết kỹ thuật dành cho console/log.
- **Kiểm tra đầu vào sớm** (guard clause) và ném lỗi rõ ràng, thay vì để chương trình chạy tiếp với dữ liệu sai rồi nổ ở một chỗ xa không liên quan.

## 6. Lỗi bất đồng bộ và bắt lỗi toàn cục

`try...catch` chỉ bắt được lỗi của Promise khi có `await`:

```js run
async function taiDuLieu() {
  throw new Error('Máy chủ không phản hồi');
}

async function dung() {
  try {
    await taiDuLieu();                  // ✅ có await → catch bắt được
  } catch (loi) {
    console.log('Đã bắt:', loi.message);
  }
}
dung();

function sai() {
  try {
    taiDuLieu();                        // ❌ không await → lỗi thoát ra ngoài try
  } catch (loi) {
    console.log('Không bao giờ chạy tới đây');
  }
}
sai();                                  // → Uncaught (in promise) Error: Máy chủ không phản hồi
```

Lưới an toàn cuối cùng là bắt lỗi **toàn cục**, dùng để ghi log và hiện thông báo chung, không phải để thay cho việc xử lý lỗi đúng chỗ:

```js
window.addEventListener('error', (event) => {
  guiLog({ message: event.message, nguon: event.filename, dong: event.lineno });
});

window.addEventListener('unhandledrejection', (event) => {
  guiLog({ message: String(event.reason) });
});
```

Ứng dụng thật thường gửi các lỗi này về một dịch vụ theo dõi lỗi (như Sentry) để biết người dùng gặp lỗi gì trên máy họ.

## 7. Debug có phương pháp

1. **Tái hiện** lỗi: những bước nào, dữ liệu nào, trình duyệt nào gây ra lỗi? Không tái hiện được thì không biết đã sửa xong chưa.
2. **Đọc** thông báo lỗi và stack trace, kỹ từng chữ.
3. **Khoanh vùng**: lỗi nằm ở dữ liệu đầu vào, ở xử lý, hay ở hiển thị? Thêm `console.log` hoặc breakpoint ở giữa để chia đôi vùng nghi ngờ, rồi lại chia đôi.
4. **Đặt giả thuyết** cụ thể ("biến `gia` là chuỗi chứ không phải số") rồi **kiểm chứng** nó, đừng sửa mò.
5. **Sửa nguyên nhân**, không sửa triệu chứng. Sau đó viết một kiểm thử để lỗi không quay lại.

::: tip Phương pháp "con vịt cao su"
Giải thích từng dòng code cho một người khác, hoặc cho con vịt cao su trên bàn. Rất thường xuyên, bạn tự nhận ra lỗi giữa chừng khi buộc phải nói rõ "dòng này làm gì".
:::

**Console nâng cao:**

```js run
const donHang = { id: 7, sanPham: [{ ten: 'Áo', gia: 199000 }], tong: '199000' };

console.log({ donHang });                        // in kèm tên biến: {donHang: {...}}
console.table(donHang.sanPham);
console.assert(typeof donHang.tong === 'number', 'tong phải là số!', donHang.tong);
console.count('xử lý đơn');
console.count('xử lý đơn');
console.group('Chi tiết');
console.log('Mã:', donHang.id);
console.log('Số món:', donHang.sanPham.length);
console.groupEnd();
```

`console.log({ bien })` (bọc trong ngoặc nhọn) là mẹo nhỏ: in kèm cả tên biến.

## 8. Breakpoint trong DevTools

`console.log` tiện nhưng phải sửa code và chạy lại nhiều lần. **Breakpoint** dừng chương trình ngay giữa chừng để bạn xem **mọi thứ**:

1. DevTools → tab **Sources**, mở tệp JS (`Ctrl` + `P` để tìm tệp).
2. Bấm vào **số dòng** để đặt breakpoint (chấm xanh).
3. Thao tác trên trang để code chạy tới dòng đó: chương trình **dừng lại**.
4. Lúc này bạn có thể:
   - Di chuột lên biến để xem giá trị; xem mục **Scope** (mọi biến hiện có), **Call Stack** (ai gọi hàm này).
   - Thêm biểu thức vào **Watch** để theo dõi.
   - Gõ lệnh trong Console để thử với đúng dữ liệu đang có.
5. Điều khiển: **Resume** (`F8`) chạy tiếp, **Step over** (`F10`) chạy dòng tiếp theo, **Step into** (`F11`) đi vào trong hàm, **Step out** (`Shift` + `F11`) ra khỏi hàm.

Những loại breakpoint rất đáng biết:

| Loại | Dùng khi |
| --- | --- |
| **Conditional breakpoint** (chuột phải số dòng) | Chỉ dừng khi điều kiện đúng, ví dụ `sanPham.gia < 0` trong vòng lặp 1000 lần |
| **Logpoint** | In ra console mà không cần sửa code |
| `debugger;` trong code | Dừng tại đó khi DevTools đang mở (nhớ xóa trước khi commit) |
| **Event Listener Breakpoints** | Dừng khi có sự kiện `click`, `submit`... mà không cần biết code nằm ở đâu |
| **DOM breakpoint** (Elements → chuột phải phần tử → Break on) | Dừng khi phần tử bị đổi thuộc tính hoặc bị xóa: tìm ra "ai đã sửa cái này" |
| **Pause on exceptions** | Dừng ngay tại dòng ném lỗi, kể cả lỗi đã được `catch` |

Kết hợp với tab **Network** (request có đi không, trả về gì) và tab **Application** (localStorage đang lưu gì), bạn có thể tìm ra gần như mọi lỗi front-end.

## Thực hành

**Bài 1.** Hàm sau tính tổng giỏ hàng nhưng ra kết quả sai. Đừng đọc đáp án vội: hãy chạy, dùng `console.log` hoặc `console.table` để tìm lỗi, rồi sửa.

```js run
const gio = [
  { ten: 'Áo', gia: '199000', soLuong: 2 },
  { ten: 'Mũ', gia: 89000, soLuong: 1 },
];

function tongTien(gio) {
  let tong = 0;
  for (let i = 0; i <= gio.length; i++) {
    tong += gio[i]?.gia * gio[i]?.soLuong;
  }
  return tong;
}

console.log(tongTien(gio));
```

::: details Xem lời giải
Kết quả là `NaN` do lỗi lệch một `i <= gio.length`: vòng cuối `gio[2]` là `undefined`, phép nhân ra `NaN`, và `?.` vô tình **che giấu** lỗi thay vì để nó nổ ra rõ ràng. Giá `'199000'` là chuỗi; phép nhân tình cờ tự đổi sang số nên chạy được, nhưng phép cộng thì sẽ nối chuỗi. Sửa:

```js run
const gio = [
  { ten: 'Áo', gia: '199000', soLuong: 2 },
  { ten: 'Mũ', gia: 89000, soLuong: 1 },
];

function tongTien(gio) {
  return gio.reduce((tong, sp) => tong + Number(sp.gia) * sp.soLuong, 0);
}

console.log(tongTien(gio));   // 487000
```
Tốt hơn nữa là chuẩn hóa dữ liệu (đổi `gia` sang số) ngay khi nhận về, thay vì xử lý ở mọi nơi dùng.
:::

**Bài 2.** Viết hàm `docCaiDat()` đọc chuỗi JSON từ localStorage khóa `'cai-dat'` và trả về object cài đặt. Yêu cầu: chưa có dữ liệu thì trả về mặc định `{ theme: 'sang', coChu: 16 }`; JSON hỏng thì ghi `console.warn` và trả về mặc định; thiếu trường nào thì lấy trường đó từ mặc định.

::: details Xem lời giải
```js run
const MAC_DINH = { theme: 'sang', coChu: 16 };

function docCaiDat() {
  const chuoi = localStorage.getItem('cai-dat');
  if (chuoi === null) return { ...MAC_DINH };
  try {
    const duLieu = JSON.parse(chuoi);
    return { ...MAC_DINH, ...duLieu };
  } catch (loi) {
    console.warn('Cài đặt bị hỏng, dùng mặc định.', loi.message);
    return { ...MAC_DINH };
  }
}

console.log(docCaiDat());
localStorage.setItem('cai-dat', '{"theme":"toi"}');
console.log(docCaiDat());
localStorage.setItem('cai-dat', '{hỏng');
console.log(docCaiDat());
```
:::

**Bài 3.** Mở [Code Playground](/thuc-hanh/playground), làm lại bài **Danh sách việc cần làm** nhưng cố ý xóa dòng `event.preventDefault()`. Quan sát trình chấm báo gì. Sau đó mở DevTools, bật **Event Listener Breakpoints → Control → submit**, gửi form và quan sát chương trình dừng lại.

::: details Xem gợi ý
Không có `preventDefault`, form được gửi đi và khung kết quả tải lại, mọi việc vừa thêm biến mất. Trình chấm phát hiện trang bị tải lại giữa chừng và nhắc bạn kiểm tra `preventDefault()`. Code trong Playground chạy trong một iframe; ở Sources, tìm iframe đó trong cây tệp bên trái (`about:srcdoc`).
:::

## Lỗi thường gặp

- **`catch` rỗng** hoặc chỉ log rồi chạy tiếp như không có gì.
- **Throw chuỗi** thay vì `Error` → mất stack trace.
- **Quên `await`** trong `try` → lỗi bất đồng bộ lọt ra ngoài.
- **Dùng `?.` để "chữa" mọi lỗi `undefined`** → che giấu lỗi thật, như ví dụ ở Bài 1.
- **Sửa mò** mà không tái hiện được lỗi và không hiểu nguyên nhân.
- **Quên xóa `debugger` và `console.log` thừa** trước khi đưa lên production.

## Tóm tắt

- Lỗi cú pháp (không chạy được), lỗi lúc chạy (`ReferenceError`, `TypeError`, `RangeError`...), lỗi logic (kết quả sai). Stack trace: trên cùng là nơi lỗi nổ ra.
- `throw new Error(msg, { cause })`; `try...catch...finally`; lớp lỗi riêng bằng `extends Error`.
- Chỉ bắt lỗi khi xử lý được; bắt ở ranh giới; không nuốt lỗi; thông báo thân thiện cho người dùng.
- Lỗi Promise cần `await` trong `try`; `error`/`unhandledrejection` là lưới an toàn cuối.
- Debug: tái hiện → đọc lỗi → khoanh vùng → giả thuyết → kiểm chứng; dùng breakpoint, conditional breakpoint, `debugger`, Event Listener và DOM breakpoint.

## Kiểm tra kiến thức

<Quiz />
