---
title: Gọi API với fetch
description: API và REST, gửi request GET bằng fetch, kiểm tra response.ok, xử lý lỗi mạng và lỗi HTTP, hiển thị trạng thái đang tải, lỗi, rỗng, query string với URL và URLSearchParams, gửi JSON bằng POST, hủy request với AbortController, timeout và CORS.
quiz:
  - q: "`fetch()` trả về server lỗi `404` hoặc `500`. Promise của `fetch` thế nào?"
    options:
      - "Bị reject"
      - "Vẫn **fulfilled**; bạn phải tự kiểm tra `response.ok` hoặc `response.status`"
      - "Trả về `null`"
      - "Tự thử lại 3 lần"
    answer: 1
    explain: "`fetch` chỉ reject khi **không nhận được phản hồi** (mất mạng, tên miền sai, bị CORS chặn, bị hủy). Có phản hồi, dù là lỗi HTTP, thì vẫn là fulfilled."
  - q: "Gửi JSON bằng POST, cần gì?"
    options:
      - "Chỉ cần `method: 'POST'`"
      - "`method: 'POST'`, header `Content-Type: application/json` và `body: JSON.stringify(duLieu)`"
      - "`body: duLieu` (object)"
      - "Đặt dữ liệu vào URL"
    answer: 1
    explain: "`body` phải là chuỗi (hoặc FormData, Blob...). Header Content-Type cho server biết cách đọc body."
  - q: "Vì sao **không** được đặt khóa bí mật (secret API key) trong code JavaScript phía trình duyệt?"
    options:
      - "Vì JavaScript không đọc được biến môi trường"
      - "Vì ai cũng xem được mã nguồn và các request trong DevTools, nên khóa sẽ bị lộ"
      - "Vì fetch không gửi được header"
      - "Không sao cả nếu đã minify code"
    answer: 1
    explain: "Mọi thứ gửi tới trình duyệt đều công khai. Khóa bí mật phải nằm ở server của bạn, trình duyệt gọi server đó, và server mới gọi API bên thứ ba."
  - q: "Trình duyệt báo lỗi CORS khi gọi API ở tên miền khác. Ai cần sửa?"
    options:
      - "Trình duyệt của người dùng"
      - "**Server của API**: phải trả header `Access-Control-Allow-Origin` cho phép trang của bạn"
      - "Thêm `mode: 'no-cors'` là xong"
      - "Đổi `fetch` sang `XMLHttpRequest`"
    answer: 1
    explain: "CORS là cơ chế bảo vệ của trình duyệt; quyền cho phép do server API quyết định. `no-cors` chỉ cho bạn một response “mờ” không đọc được nội dung. Nếu không sửa được server API, hãy gọi qua server của chính bạn (proxy)."
  - q: "Ô tìm kiếm gọi API mỗi lần gõ. Vì sao nên hủy request cũ bằng `AbortController`?"
    options:
      - "Để tiết kiệm pin"
      - "Để kết quả của request cũ (về muộn) không ghi đè kết quả của từ khóa mới nhất"
      - "Vì trình duyệt chỉ cho chạy một fetch"
      - "Không cần thiết"
    answer: 1
    explain: "Request gửi trước có thể về sau (race condition). Hủy request cũ khi có request mới, kèm debounce, cho kết quả đúng và ít tải cho server."
---

# Gọi API với fetch

::: info Mục tiêu bài học
- Hiểu **API**, **REST** và cách trao đổi dữ liệu JSON qua HTTP.
- Lấy dữ liệu bằng `fetch`, kiểm tra **`response.ok`**, phân biệt lỗi mạng và lỗi HTTP.
- Hiển thị đủ các trạng thái: **đang tải**, **lỗi**, **rỗng**, **có dữ liệu**.
- Tạo URL có tham số bằng `URL`/`URLSearchParams`; gửi dữ liệu bằng **POST** JSON.
- **Hủy** request và đặt **thời gian chờ** với `AbortController`; hiểu **CORS** và các nguyên tắc an toàn.
:::

## 1. API là gì?

**API** (Application Programming Interface) là "cửa giao tiếp" một chương trình mở ra cho chương trình khác dùng. Trên web, **Web API** thường là các địa chỉ URL trả về dữ liệu **JSON** thay vì trang HTML:

```text
GET https://jsonplaceholder.typicode.com/users/1

{
  "id": 1,
  "name": "Leanne Graham",
  "email": "Sincere@april.biz",
  ...
}
```

Phần lớn API theo kiểu **REST**: mỗi URL là một **tài nguyên**, và **phương thức HTTP** cho biết bạn muốn làm gì với nó:

| Phương thức | URL | Ý nghĩa |
| --- | --- | --- |
| `GET` | `/posts` | Lấy danh sách bài viết |
| `GET` | `/posts/5` | Lấy bài viết số 5 |
| `POST` | `/posts` | Tạo bài viết mới (dữ liệu trong body) |
| `PUT` / `PATCH` | `/posts/5` | Thay toàn bộ / sửa một phần bài 5 |
| `DELETE` | `/posts/5` | Xóa bài 5 |

Ví dụ trong bài dùng hai API công khai miễn phí, không cần đăng ký: [JSONPlaceholder](https://jsonplaceholder.typicode.com) (dữ liệu giả để tập) và [Open-Meteo](https://open-meteo.com) (thời tiết thật). Các ví dụ cần kết nối Internet.

## 2. Request đầu tiên

```js run
async function layNguoiDung(id) {
  const response = await fetch(`https://jsonplaceholder.typicode.com/users/${id}`);
  console.log('Mã trạng thái:', response.status, response.ok);

  const nguoiDung = await response.json();   // đọc body và chuyển JSON → object
  console.log(nguoiDung.name, '—', nguoiDung.email, '—', nguoiDung.address.city);
}

layNguoiDung(1);
```

Hai bước, hai lần `await`:

1. `await fetch(url)`: chờ **phản hồi đầu tiên** (mã trạng thái, header). Lúc này body có thể chưa tải xong.
2. `await response.json()`: chờ tải xong body và chuyển JSON thành object. Tùy loại dữ liệu còn có `response.text()`, `response.blob()` (ảnh, tệp).

Mở tab **Network** của DevTools (lọc **Fetch/XHR**) để xem từng request: URL, phương thức, mã trạng thái, header, nội dung trả về. Đây là công cụ số một khi làm việc với API.

## 3. Xử lý lỗi đúng cách

::: warning `fetch` không reject khi gặp lỗi HTTP
Server trả `404 Not Found` hay `500 Internal Server Error`, Promise của `fetch` **vẫn thành công**. `fetch` chỉ reject khi không có phản hồi nào: mất mạng, sai tên miền, bị CORS chặn, bị hủy. Bạn phải **tự kiểm tra `response.ok`** (đúng khi mã trạng thái từ 200 đến 299).
:::

```js run
async function layJSON(url) {
  let response;
  try {
    response = await fetch(url);
  } catch (loi) {
    throw new Error('Không kết nối được. Kiểm tra mạng của bạn.', { cause: loi });
  }
  if (!response.ok) {
    throw new Error(`Máy chủ trả lỗi ${response.status}`);
  }
  return response.json();
}

async function thu() {
  try {
    const bai = await layJSON('https://jsonplaceholder.typicode.com/posts/1');
    console.log('OK:', bai.title);
    await layJSON('https://jsonplaceholder.typicode.com/posts/999999');   // không tồn tại
  } catch (loi) {
    console.log('Lỗi:', loi.message);
  }

  try {
    await layJSON('https://ten-mien-khong-ton-tai.invalid/api');
  } catch (loi) {
    console.log('Lỗi:', loi.message);
  }
}

thu();
```

Gom việc gọi API vào một hàm như `layJSON` để mọi nơi xử lý lỗi giống nhau. Thông báo hiển thị cho người dùng nên dễ hiểu ("Không kết nối được"), còn chi tiết kỹ thuật (`cause`) để lại cho lập trình viên.

## 4. Đủ bốn trạng thái giao diện

Mỗi khi tải dữ liệu, giao diện có ít nhất bốn trạng thái. Bỏ sót trạng thái nào, người dùng sẽ thấy màn hình trống không hiểu vì sao:

```html live
<button id="tai" type="button">Tải danh sách người dùng</button>
<label><input id="gia-loi" type="checkbox"> Giả lập lỗi</label>
<p id="trang-thai" role="status"></p>
<ul id="ds"></ul>

<style>
  body { font-family: system-ui, sans-serif; }
  #trang-thai.loi { color: #b91c1c; }
</style>

<script>
  const nut = document.querySelector('#tai');
  const trangThai = document.querySelector('#trang-thai');
  const ds = document.querySelector('#ds');

  async function taiNguoiDung() {
    const url = document.querySelector('#gia-loi').checked
      ? 'https://jsonplaceholder.typicode.com/khong-co-duong-dan-nay'
      : 'https://jsonplaceholder.typicode.com/users';

    // 1. Đang tải
    nut.disabled = true;
    trangThai.className = '';
    trangThai.textContent = 'Đang tải...';
    ds.replaceChildren();

    try {
      const response = await fetch(url);
      if (!response.ok) throw new Error(`Lỗi ${response.status}`);
      const nguoiDung = await response.json();

      // 2. Rỗng
      if (nguoiDung.length === 0) {
        trangThai.textContent = 'Chưa có người dùng nào.';
        return;
      }

      // 3. Có dữ liệu
      ds.replaceChildren(...nguoiDung.map((nd) => {
        const li = document.createElement('li');
        li.textContent = `${nd.name} (${nd.address.city})`;   // textContent: an toàn với dữ liệu từ API
        return li;
      }));
      trangThai.textContent = `Đã tải ${nguoiDung.length} người dùng.`;
    } catch (loi) {
      // 4. Lỗi
      trangThai.className = 'loi';
      trangThai.textContent = `Không tải được dữ liệu (${loi.message}). Hãy thử lại.`;
    } finally {
      nut.disabled = false;
    }
  }

  nut.addEventListener('click', taiNguoiDung);
</script>
```

- **Vô hiệu nút** khi đang tải để người dùng không bấm liên tục gửi nhiều request.
- Dùng `textContent` cho dữ liệu từ API: API cũng là nguồn dữ liệu **không đáng tin** (ai đó có thể đã lưu tên chứa mã độc).
- `role="status"` giúp trình đọc màn hình đọc lên thông báo trạng thái khi nó thay đổi.

## 5. Tham số trên URL

Ghép chuỗi bằng tay dễ lỗi khi giá trị có dấu cách, dấu `&`, chữ có dấu. Dùng `URL` và `URLSearchParams`:

```js run
const url = new URL('https://api.open-meteo.com/v1/forecast');
url.searchParams.set('latitude', 21.03);          // Hà Nội
url.searchParams.set('longitude', 105.85);
url.searchParams.set('current', 'temperature_2m,relative_humidity_2m,wind_speed_10m');
url.searchParams.set('timezone', 'Asia/Ho_Chi_Minh');
console.log(url.toString());

async function thoiTiet() {
  const response = await fetch(url);
  if (!response.ok) throw new Error(`Lỗi ${response.status}`);
  const { current, current_units: donVi } = await response.json();
  console.log(`Hà Nội lúc ${current.time}: ${current.temperature_2m}${donVi.temperature_2m}, ` +
    `độ ẩm ${current.relative_humidity_2m}%, gió ${current.wind_speed_10m} ${donVi.wind_speed_10m}`);
}
thoiTiet().catch((loi) => console.log('Lỗi:', loi.message));

// Đọc tham số từ URL hiện tại của trang, ví dụ trang /tim-kiem?q=áo+thun&trang=2
const thamSo = new URLSearchParams('?q=áo+thun&trang=2');
console.log(thamSo.get('q'), Number(thamSo.get('trang')));
```

`URLSearchParams` tự mã hóa ký tự đặc biệt (dấu cách thành `+`, chữ có dấu thành `%C3%A1`...). `new URLSearchParams(location.search)` đọc tham số của chính trang đang mở, rất hữu ích cho bộ lọc, phân trang, và để người dùng chia sẻ link kết quả tìm kiếm.

## 6. Gửi dữ liệu: POST, PUT, DELETE

```js run
async function taoBaiViet() {
  const response = await fetch('https://jsonplaceholder.typicode.com/posts', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      title: 'Học fetch',
      body: 'fetch thật là tiện!',
      userId: 1,
    }),
  });
  if (!response.ok) throw new Error(`Lỗi ${response.status}`);
  const baiMoi = await response.json();
  console.log('Đã tạo:', response.status, baiMoi);   // 201 Created, kèm id mới
}

async function xoaBaiViet(id) {
  const response = await fetch(`https://jsonplaceholder.typicode.com/posts/${id}`, { method: 'DELETE' });
  console.log('Xóa bài', id, '→', response.status);
}

taoBaiViet().then(() => xoaBaiViet(1)).catch((loi) => console.log(loi.message));
```

JSONPlaceholder chỉ **giả vờ** lưu: nó trả kết quả như thật nhưng không thay đổi dữ liệu.

- `body` phải là **chuỗi** (dùng `JSON.stringify`), kèm header `Content-Type: application/json`.
- Gửi form có tệp đính kèm: truyền thẳng `body: new FormData(form)` và **không** tự đặt Content-Type (trình duyệt tự đặt kèm ranh giới giữa các phần).
- API cần đăng nhập thường yêu cầu header `Authorization: Bearer <token>`.

::: danger Không bao giờ để khóa bí mật trong code front-end
Mọi thứ gửi xuống trình duyệt đều **công khai**: ai cũng xem được mã nguồn, tab Network, và các biến môi trường đã được nhúng vào bản build. Khóa API trả phí, khóa có quyền ghi dữ liệu phải nằm ở **server của bạn**. Trình duyệt gọi server của bạn, server gọi API bên thứ ba. Các dịch vụ dành riêng cho trình duyệt (bản đồ, thanh toán) cấp "khóa công khai" có giới hạn tên miền; chỉ những khóa như vậy mới được để ở front-end.
:::

## 7. Hủy request và thời gian chờ

```js run
// 1. Thời gian chờ tối đa: AbortSignal.timeout
async function layVoiThoiGianCho(url, ms) {
  try {
    const response = await fetch(url, { signal: AbortSignal.timeout(ms) });
    return await response.json();
  } catch (loi) {
    if (loi.name === 'TimeoutError') throw new Error(`Quá ${ms} ms không phản hồi`);
    throw loi;
  }
}
layVoiThoiGianCho('https://jsonplaceholder.typicode.com/photos', 5)
  .then((anh) => console.log('Tải được', anh.length, 'ảnh'))
  .catch((loi) => console.log('Lỗi:', loi.message));

// 2. Hủy chủ động: AbortController
const boDieuKhien = new AbortController();
fetch('https://jsonplaceholder.typicode.com/comments', { signal: boDieuKhien.signal })
  .then((r) => r.json())
  .then((ds) => console.log('Bình luận:', ds.length))
  .catch((loi) => console.log('Request đã bị hủy:', loi.name));
boDieuKhien.abort();
```

Ứng dụng quan trọng nhất là **ô tìm kiếm**: người dùng gõ "h", "hà", "hà n"... mỗi lần gõ là một request, và request cũ có thể về **sau** request mới, ghi đè kết quả sai (race condition). Cách chuẩn là hủy request cũ khi gửi request mới:

```js
let boDieuKhienCu;

async function timKiem(tuKhoa) {
  boDieuKhienCu?.abort();                     // hủy request trước đó (nếu còn)
  boDieuKhienCu = new AbortController();
  try {
    const r = await fetch(`/api/tim?q=${encodeURIComponent(tuKhoa)}`, { signal: boDieuKhienCu.signal });
    hienKetQua(await r.json());
  } catch (loi) {
    if (loi.name !== 'AbortError') hienLoi(loi);   // bị hủy là chuyện bình thường
  }
}
```

Kết hợp thêm **debounce** (chỉ gọi khi người dùng ngừng gõ khoảng 300ms, ở [bài Hiệu năng](/nang-cao/hieu-nang)) để giảm số request.

## 8. CORS

Mặc định, trình duyệt **không cho** JavaScript của trang `a.com` đọc phản hồi từ `b.com` (chính sách **same-origin**), để trang độc hại không đọc trộm dữ liệu của bạn ở website khác. **CORS** (Cross-Origin Resource Sharing) là cách để server `b.com` **cho phép** điều đó, bằng header:

```text
Access-Control-Allow-Origin: https://a.com      (hoặc * cho mọi nơi)
```

Khi gặp lỗi trong console kiểu `blocked by CORS policy: No 'Access-Control-Allow-Origin' header`:

- Vấn đề nằm ở **server API**, không phải code của bạn. Bạn không "sửa" được CORS từ phía trình duyệt.
- `mode: 'no-cors'` **không** giải quyết được: response nhận về bị "mờ", không đọc được nội dung.
- Nếu là API của nhóm bạn: nhờ back-end cấu hình CORS. Nếu là API bên thứ ba không hỗ trợ: gọi qua server của bạn (proxy). Khi phát triển với Vite, có tùy chọn `server.proxy` làm việc này.

Hai API dùng trong bài đều trả `Access-Control-Allow-Origin`, nên gọi được từ bất kỳ trang nào.

## Thực hành

**Bài 1.** Dùng `https://jsonplaceholder.typicode.com/posts?userId=2`, hiển thị tiêu đề các bài viết của người dùng số 2 thành danh sách có đánh số, kèm đủ trạng thái đang tải và lỗi.

::: details Xem lời giải
```html live
<p id="tt">Đang tải...</p>
<ol id="bai"></ol>

<script>
  async function taiBaiViet(userId) {
    const tt = document.querySelector('#tt');
    try {
      const url = new URL('https://jsonplaceholder.typicode.com/posts');
      url.searchParams.set('userId', userId);
      const r = await fetch(url);
      if (!r.ok) throw new Error(`Lỗi ${r.status}`);
      const ds = await r.json();
      document.querySelector('#bai').replaceChildren(...ds.map((b) => {
        const li = document.createElement('li');
        li.textContent = b.title;
        return li;
      }));
      tt.textContent = `${ds.length} bài viết`;
    } catch (loi) {
      tt.textContent = `Không tải được: ${loi.message}`;
    }
  }
  taiBaiViet(2);
</script>
```
:::

**Bài 2.** Làm widget thời tiết: chọn thành phố trong `<select>` (Hà Nội 21.03, 105.85; Đà Nẵng 16.05, 108.2; TP.HCM 10.78, 106.7), hiện nhiệt độ hiện tại từ Open-Meteo. Hủy request cũ nếu người dùng đổi thành phố khi request trước chưa xong.

::: details Xem lời giải
```html live
<label>Thành phố
  <select id="tp">
    <option value="21.03,105.85">Hà Nội</option>
    <option value="16.05,108.2">Đà Nẵng</option>
    <option value="10.78,106.7">TP. Hồ Chí Minh</option>
  </select>
</label>
<p id="kq" role="status">Đang tải...</p>

<script>
  const select = document.querySelector('#tp');
  const kq = document.querySelector('#kq');
  let dieuKhien;

  async function capNhat() {
    dieuKhien?.abort();
    dieuKhien = new AbortController();
    const [lat, lon] = select.value.split(',');
    const url = new URL('https://api.open-meteo.com/v1/forecast');
    url.searchParams.set('latitude', lat);
    url.searchParams.set('longitude', lon);
    url.searchParams.set('current', 'temperature_2m');
    kq.textContent = 'Đang tải...';
    try {
      const r = await fetch(url, { signal: dieuKhien.signal });
      if (!r.ok) throw new Error(`Lỗi ${r.status}`);
      const { current } = await r.json();
      kq.textContent = `${select.selectedOptions[0].text}: ${current.temperature_2m}°C`;
    } catch (loi) {
      if (loi.name !== 'AbortError') kq.textContent = `Không tải được: ${loi.message}`;
    }
  }

  select.addEventListener('change', capNhat);
  capNhat();
</script>
```
:::

## Lỗi thường gặp

- **Không kiểm tra `response.ok`** → xử lý trang lỗi 404 như dữ liệu.
- **Quên `await response.json()`** → làm việc với Promise.
- **Gửi object thẳng vào `body`** thay vì `JSON.stringify`, hoặc quên header `Content-Type`.
- **Chỉ xử lý trường hợp thành công**: không có trạng thái đang tải, lỗi, rỗng.
- **Hiển thị dữ liệu API bằng `innerHTML`** → XSS.
- **Để khóa bí mật trong front-end.**
- **"Sửa" CORS bằng `no-cors`.**

## Tóm tắt

- API trả JSON qua HTTP; REST: URL là tài nguyên, phương thức là hành động.
- `const r = await fetch(url)`, kiểm tra `r.ok`, rồi `await r.json()`. `fetch` chỉ reject khi lỗi mạng hoặc bị hủy.
- Luôn có trạng thái đang tải, lỗi, rỗng, có dữ liệu; vô hiệu nút khi đang tải.
- `URL` + `searchParams` để tạo tham số an toàn.
- POST JSON: `method`, `headers: { 'Content-Type': 'application/json' }`, `body: JSON.stringify(...)`.
- `AbortSignal.timeout(ms)` cho thời gian chờ; `AbortController` để hủy request cũ.
- CORS do server API cho phép; khóa bí mật chỉ nằm ở server.

## Kiểm tra kiến thức

<Quiz />
