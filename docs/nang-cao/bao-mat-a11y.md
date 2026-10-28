---
title: Bảo mật & accessibility chuyên sâu
description: Mô hình bảo mật front-end, XSS và các điểm nguy hiểm trong DOM, kiểm tra URL, Content Security Policy, cookie an toàn, CSRF, HTTPS và SRI; accessibility với WCAG, quản lý focus, skip link, ARIA đúng cách, thông báo lỗi form và công cụ kiểm tra.
quiz:
  - q: "Đoạn nào **an toàn** khi hiển thị bình luận do người dùng gửi?"
    options:
      - "`khung.innerHTML = binhLuan`"
      - "`khung.textContent = binhLuan`"
      - "`khung.insertAdjacentHTML('beforeend', binhLuan)`"
      - "`document.write(binhLuan)`"
    answer: 1
    explain: "`textContent` luôn hiển thị nguyên văn như chữ. Ba cách còn lại phân tích chuỗi thành HTML, nên thẻ `<img onerror=...>` trong bình luận sẽ chạy được mã độc."
  - q: "Người dùng nhập link website cá nhân, bạn gán vào `a.href`. Cần kiểm tra gì?"
    options:
      - "Không cần kiểm tra"
      - "Chỉ cho phép giao thức `http:` hoặc `https:`, vì `javascript:...` sẽ chạy mã khi bấm vào link"
      - "Độ dài không quá 100 ký tự"
      - "Phải có chữ www"
    answer: 1
    explain: "`new URL(link).protocol` cho biết giao thức. Link dạng `javascript:alert(document.cookie)` là một dạng XSS kinh điển."
  - q: "Cookie phiên đăng nhập nên có những thuộc tính nào?"
    options:
      - "Không cần thuộc tính gì"
      - "`HttpOnly` (JavaScript không đọc được), `Secure` (chỉ gửi qua HTTPS), `SameSite` (hạn chế gửi kèm request từ trang khác)"
      - "`Public` và `Shared`"
      - "Chỉ cần lưu vào localStorage là đủ"
    answer: 1
    explain: "`HttpOnly` khiến dù có XSS, kẻ tấn công cũng không đọc trộm được cookie phiên. `SameSite=Lax`/`Strict` giúp chống CSRF."
  - q: "Mở một hộp thoại (modal), focus bàn phím nên đặt ở đâu?"
    options:
      - "Giữ nguyên ở nút vừa bấm phía sau"
      - "Chuyển vào trong hộp thoại; khi đóng thì trả focus về nút đã mở nó"
      - "Đưa về đầu trang"
      - "Bỏ focus khỏi mọi phần tử"
    answer: 1
    explain: "Thẻ `<dialog>` mở bằng `showModal()` làm sẵn hầu hết việc này: chuyển focus vào trong, giữ focus không thoát ra ngoài, đóng bằng Esc."
  - q: "Ô nhập có lỗi. Cách nào giúp trình đọc màn hình đọc được thông báo lỗi khi người dùng vào ô?"
    options:
      - "Tô viền đỏ là đủ"
      - "Đặt `aria-invalid=\"true\"` và nối ô với đoạn thông báo bằng `aria-describedby=\"id-cua-thong-bao\"`"
      - "Đặt thông báo trong `title`"
      - "Dùng `alert()`"
    answer: 1
    explain: "Màu sắc không truyền được tới người khiếm thị. `aria-describedby` làm trình đọc màn hình đọc kèm nội dung lỗi sau tên ô nhập."
---

# Bảo mật & accessibility chuyên sâu

::: info Mục tiêu bài học
- Hiểu **mô hình bảo mật** của front-end: không tin bất kỳ dữ liệu nào từ trình duyệt.
- Phòng chống **XSS**: nhận ra các "điểm nguy hiểm" trong DOM, kiểm tra URL, dùng **CSP**.
- Biết các lớp bảo vệ khác: cookie an toàn, CSRF, HTTPS, SRI, clickjacking.
- Nắm **WCAG** và làm accessibility vững hơn: quản lý **focus**, skip link, **ARIA đúng cách**, thông báo lỗi form, vùng thông báo động.
- Dùng **công cụ** kiểm tra cả hai mặt.
:::

## Phần A — Bảo mật

## 1. Mô hình bảo mật của front-end

Mọi thứ chạy trong trình duyệt nằm **trong tay người dùng**: họ (hoặc kẻ tấn công) có thể sửa HTML, gọi hàm JavaScript, đổi request trong DevTools, hoặc bỏ qua trang web để gửi request thẳng tới server. Vì vậy:

- **Kiểm tra quyền và dữ liệu ở server.** Ẩn nút "Xóa" với người không có quyền chỉ là trải nghiệm người dùng, không phải bảo mật.
- **Không đặt bí mật trong front-end**: khóa API bí mật, mật khẩu, logic "giảm giá 100% nếu mã là X".
- Nhiệm vụ bảo mật chính của front-end: **không để code của kẻ khác chạy trên trang của bạn** (XSS), và **không vô tình làm lộ dữ liệu** của người dùng.

## 2. XSS — Cross-Site Scripting

**XSS** xảy ra khi dữ liệu do kẻ tấn công kiểm soát được trình duyệt hiểu thành **code** và chạy trên trang của bạn. Khi đó mã độc có toàn quyền như chính trang: đọc nội dung, gửi request dưới danh nghĩa người dùng, đánh cắp token trong localStorage, giả mạo form đăng nhập...

```html live
<label>Bình luận: <input id="bl" value='Hay quá! <img src=x onerror="alert(&apos;XSS! Mã độc đã chạy&apos;)">' size="60"></label>
<p>
  <button id="nguy-hiem" type="button">Hiển thị bằng innerHTML ❌</button>
  <button id="an-toan" type="button">Hiển thị bằng textContent ✅</button>
</p>
<div id="khung" style="padding: 8px; border: 1px dashed #a8a29e; min-height: 24px"></div>

<script>
  const bl = document.querySelector('#bl');
  const khung = document.querySelector('#khung');
  document.querySelector('#nguy-hiem').addEventListener('click', () => {
    khung.innerHTML = bl.value;        // chuỗi được phân tích thành HTML → onerror chạy
  });
  document.querySelector('#an-toan').addEventListener('click', () => {
    khung.textContent = bl.value;      // chỉ là chữ, không bao giờ chạy
  });
</script>
```

Dữ liệu "không đáng tin" không chỉ là ô nhập: còn có tham số trên URL (`?q=...`), phần `#hash`, dữ liệu từ API (người khác đã lưu vào), localStorage, tin nhắn `postMessage`, nội dung tệp người dùng tải lên.

**Các "điểm nguy hiểm" (sink) cần tránh với dữ liệu không đáng tin:**

| Nguy hiểm | Thay bằng |
| --- | --- |
| `el.innerHTML = x`, `el.outerHTML = x`, `insertAdjacentHTML(..., x)` | `el.textContent = x`; tạo phần tử bằng `createElement` |
| `document.write(x)` | Thao tác DOM |
| `eval(x)`, `new Function(x)`, `setTimeout('chuỗi code')` | Không chạy chuỗi thành code; truyền hàm |
| `a.href = x`, `iframe.src = x` với URL chưa kiểm tra | Kiểm tra giao thức trước (mục 3) |
| `el.setAttribute('onclick', x)` hay mọi thuộc tính `on*` | `addEventListener` với hàm của bạn |

Khi **buộc phải** hiển thị HTML từ người dùng (trình soạn thảo văn bản, nội dung bài viết có định dạng), hãy **làm sạch** (sanitize) bằng một thư viện chuyên dụng như **DOMPurify** trước khi gán vào `innerHTML`. Đừng tự viết regex để lọc thẻ: kẻ tấn công có hàng trăm cách lách. Trình duyệt cũng đang bổ sung API làm sạch có sẵn (`setHTML()`, Sanitizer API); kiểm tra mức hỗ trợ trước khi dùng.

Các framework như React, Vue tự escape dữ liệu khi hiển thị, nên an toàn mặc định, **trừ khi** bạn dùng lối thoát như `dangerouslySetInnerHTML` (React) hay `v-html` (Vue).

## 3. Kiểm tra URL

```js run
function laLinkAnToan(chuoi) {
  try {
    const url = new URL(chuoi, document.baseURI);   // đường dẫn tương đối tính theo trang hiện tại
    return url.protocol === 'https:' || url.protocol === 'http:';
  } catch {
    return false;
  }
}

for (const link of [
  'https://example.com/ho-so',
  'javascript:alert(document.cookie)',
  ' JavaScript:alert(1)',
  'data:text/html,<script>alert(1)</script>',
  '/trang-noi-bo',
  'http://[không hợp lệ',
]) {
  console.log(laLinkAnToan(link) ? '✅' : '❌', link);
}
```

`new URL()` chuẩn hóa chuỗi theo đúng cách trình duyệt sẽ hiểu (bỏ khoảng trắng đầu, không phân biệt hoa thường `JavaScript:`), nên an toàn hơn kiểm tra chuỗi bằng tay. Dùng **danh sách cho phép** (chỉ http/https) thay vì danh sách cấm.

## 4. Content Security Policy (CSP)

**CSP** là lớp phòng thủ thứ hai: một header (hoặc thẻ `<meta>`) báo trình duyệt **chỉ chạy script từ những nguồn được phép**. Dù kẻ tấn công chèn được thẻ `<script>` hay `onerror=`, trình duyệt cũng từ chối chạy.

```text
Content-Security-Policy:
  default-src 'self';
  script-src 'self';
  style-src 'self' https://fonts.googleapis.com;
  font-src https://fonts.gstatic.com;
  img-src 'self' data: https:;
  connect-src 'self' https://api.example.com;
  frame-ancestors 'none'
```

- `script-src 'self'`: chỉ chạy script từ chính tên miền của bạn; **chặn mọi script nội tuyến** và thuộc tính `onclick=`. Đây là lý do nên viết JavaScript trong tệp riêng và dùng `addEventListener`.
- `frame-ancestors 'none'`: không cho trang khác nhúng trang của bạn vào iframe (chống **clickjacking**, kiểu lừa người dùng bấm vào nút trong một iframe tàng hình).
- Bắt đầu bằng header `Content-Security-Policy-Report-Only` để xem chính sách sẽ chặn những gì mà chưa làm hỏng trang.

## 5. Cookie, CSRF, HTTPS và chuỗi cung ứng

**Cookie phiên đăng nhập** do server đặt, nên có đủ:

```text
Set-Cookie: phien=abc123; HttpOnly; Secure; SameSite=Lax; Path=/
```

- `HttpOnly`: JavaScript **không đọc được** cookie, nên XSS cũng không lấy trộm được nó. Đây là lý do nhiều chuyên gia khuyên không lưu token đăng nhập trong localStorage (nơi mọi script đều đọc được).
- `Secure`: chỉ gửi qua HTTPS.
- `SameSite=Lax` hoặc `Strict`: trình duyệt không gửi cookie kèm các request do **trang khác** khởi tạo, giúp chống **CSRF**: tấn công khiến trình duyệt của bạn (đang đăng nhập) gửi request "chuyển tiền" từ một trang độc hại. Server nên kiểm tra thêm token CSRF cho các thao tác quan trọng.

**HTTPS** ở mọi nơi: không có HTTPS, ai ở giữa đường truyền (wifi công cộng) cũng đọc và sửa được trang. Trang HTTPS tải tài nguyên qua HTTP sẽ bị chặn (*mixed content*).

**Chuỗi cung ứng** (supply chain): code của bạn chạy cùng code của hàng trăm gói npm và script bên thứ ba (quảng cáo, thống kê, chat).

- Chỉ dùng gói/script đáng tin, cập nhật thường xuyên, chạy `npm audit`.
- Script tải từ CDN nên có **SRI** (Subresource Integrity): trình duyệt kiểm tra mã băm, tệp bị sửa thì không chạy.

```html
<script src="https://cdn.example.com/thu-vien@2.1.0.min.js"
        integrity="sha384-..." crossorigin="anonymous"></script>
```

- Liên kết `target="_blank"` tới trang lạ nên có `rel="noopener noreferrer"`.

## Phần B — Accessibility chuyên sâu

## 6. WCAG và bốn nguyên tắc POUR

**WCAG** (Web Content Accessibility Guidelines) là bộ tiêu chuẩn quốc tế về khả năng truy cập; mức **AA** là mức phổ biến mà luật pháp nhiều nước yêu cầu. WCAG xoay quanh bốn nguyên tắc:

| Nguyên tắc | Nghĩa là | Ví dụ |
| --- | --- | --- |
| **P**erceivable (Nhận biết được) | Ai cũng tiếp nhận được nội dung | `alt` cho ảnh, phụ đề video, đủ tương phản |
| **O**perable (Thao tác được) | Ai cũng điều khiển được | Dùng được bằng bàn phím, đủ thời gian, không gây co giật |
| **U**nderstandable (Hiểu được) | Nội dung và cách dùng dễ hiểu | Nhãn rõ ràng, thông báo lỗi cụ thể, hành vi nhất quán |
| **R**obust (Bền vững) | Chạy tốt với công nghệ hỗ trợ | HTML đúng chuẩn, ARIA đúng cách |

Nền tảng đã có ở [bài HTML ngữ nghĩa](/html/html-ngu-nghia). Phần này đi sâu hơn vào những gì JavaScript làm thay đổi.

## 7. Bàn phím và focus

**Thứ tự focus** đi theo thứ tự trong HTML. Giữ thứ tự HTML hợp lý thay vì sắp xếp lại bằng CSS (`order`, `position`).

**`tabindex`:**

- `tabindex="0"`: cho phần tử tự làm (hiếm khi cần) nhận focus theo thứ tự tự nhiên.
- `tabindex="-1"`: không nằm trong thứ tự Tab, nhưng **focus được bằng JavaScript** (`el.focus()`). Dùng cho tiêu đề vùng nội dung vừa đổi, thông báo lỗi tổng hợp...
- **Không bao giờ** dùng `tabindex` dương (`1`, `2`...): phá vỡ thứ tự tự nhiên của cả trang.

**Viền focus** phải luôn nhìn thấy được. Nếu đổi kiểu, hãy thay bằng kiểu rõ ràng hơn chứ không xóa:

```css
:focus-visible {
  outline: 3px solid #7c3aed;
  outline-offset: 2px;
}
```

**Skip link** cho người dùng bàn phím nhảy qua menu dài, tới thẳng nội dung chính:

```html live height=180
<a class="skip" href="#noi-dung">Bỏ qua, tới nội dung chính</a>
<nav>
  <a href="#">Trang chủ</a> · <a href="#">Sản phẩm</a> · <a href="#">Tin tức</a> · <a href="#">Liên hệ</a>
</nav>
<main id="noi-dung" tabindex="-1">
  <h1>Nội dung chính</h1>
  <p>Bấm vào khung, rồi nhấn <kbd>Tab</kbd> một lần: liên kết "Bỏ qua" hiện ra. Nhấn <kbd>Enter</kbd> để nhảy tới đây.</p>
</main>

<style>
  body { font-family: system-ui, sans-serif; }
  .skip {
    position: absolute; left: 8px; top: -60px;
    padding: 8px 12px; border-radius: 6px; background: #1c1917; color: white;
  }
  .skip:focus { top: 8px; }          /* chỉ hiện khi được focus */
  main:focus { outline: none; }      /* focus bằng chương trình, không cần viền */
</style>
```

**Quản lý focus khi giao diện thay đổi:**

- Mở hộp thoại → focus vào trong hộp thoại; đóng → trả focus về nút đã mở nó. Thẻ `<dialog>` với `showModal()` làm sẵn những việc này ([bài Web Components & API hiện đại](/nang-cao/web-components)).
- Xóa phần tử đang được focus (xóa một dòng trong danh sách) → chuyển focus tới một chỗ hợp lý (dòng kế tiếp, hoặc tiêu đề danh sách), đừng để focus "rơi" về đầu trang.
- Ứng dụng một trang (SPA) đổi "trang" bằng JavaScript → chuyển focus tới tiêu đề `<h1>` của nội dung mới và cập nhật `document.title`.

## 8. ARIA đúng cách

Nhắc lại quy tắc số 1: **dùng phần tử HTML có sẵn trước**. ARIA dành cho những chỗ HTML không có phần tử phù hợp. Những thuộc tính ARIA hay dùng nhất:

| Thuộc tính | Dùng để |
| --- | --- |
| `aria-label="Đóng"` | Đặt tên cho phần tử không có chữ nhìn thấy (nút chỉ có icon) |
| `aria-labelledby="id"` | Lấy tên từ phần tử khác (tiêu đề của hộp thoại) |
| `aria-describedby="id"` | Thêm mô tả phụ (gợi ý định dạng, thông báo lỗi) |
| `aria-expanded="true/false"` | Trạng thái đóng/mở của menu, accordion |
| `aria-current="page"` | Đánh dấu liên kết của trang hiện tại trong menu |
| `aria-invalid="true"` | Ô nhập đang có lỗi |
| `aria-live="polite"`, `role="status"` | Vùng nội dung thay đổi động, trình đọc màn hình sẽ đọc lên |
| `role="alert"` | Thông báo khẩn (đọc ngay lập tức) |
| `aria-hidden="true"` | Ẩn khỏi công nghệ hỗ trợ (icon trang trí). Không dùng cho phần tử focus được |

**Thông báo lỗi form dễ tiếp cận:**

```html live
<form id="form" novalidate>
  <div class="o">
    <label for="sdt">Số điện thoại</label>
    <input id="sdt" name="sdt" type="tel" aria-describedby="sdt-goi-y" autocomplete="tel">
    <p id="sdt-goi-y" class="goi-y">10 chữ số, bắt đầu bằng 0</p>
    <p id="sdt-loi" class="loi" hidden></p>
  </div>
  <button>Gửi</button>
  <p id="trang-thai" role="status"></p>
</form>

<style>
  body { font-family: system-ui, sans-serif; }
  .goi-y { margin: 4px 0; font-size: 13px; color: #57534e; }
  .loi { margin: 4px 0; font-size: 14px; color: #b91c1c; }
  input[aria-invalid="true"] { border: 2px solid #b91c1c; }
</style>

<script>
  const form = document.querySelector('#form');
  const sdt = document.querySelector('#sdt');
  const loi = document.querySelector('#sdt-loi');

  form.addEventListener('submit', (event) => {
    event.preventDefault();
    const hopLe = /^0\d{9}$/.test(sdt.value.trim());

    sdt.setAttribute('aria-invalid', String(!hopLe));
    loi.hidden = hopLe;
    loi.textContent = hopLe ? '' : '⚠ Số điện thoại chưa đúng: cần đúng 10 chữ số và bắt đầu bằng 0.';
    // Gắn thông báo lỗi vào ô nhập để trình đọc màn hình đọc kèm
    sdt.setAttribute('aria-describedby', hopLe ? 'sdt-goi-y' : 'sdt-goi-y sdt-loi');

    if (!hopLe) {
      sdt.focus();                     // đưa người dùng tới chỗ cần sửa
      return;
    }
    document.querySelector('#trang-thai').textContent = 'Đã gửi thành công!';
  });
</script>
```

Những điểm đáng chú ý: lỗi có **chữ** cụ thể (không chỉ màu đỏ) và có biểu tượng ⚠; nói rõ **cách sửa**; được nối với ô qua `aria-describedby`; focus chuyển tới ô lỗi; thông báo thành công nằm trong `role="status"` nên được đọc lên.

## 9. Các điểm hay bị quên

- **Kích thước vùng bấm** ít nhất khoảng 24 × 24px (khuyến nghị 44 × 44px trên điện thoại).
- **Phóng to 200%** mà trang vẫn dùng được, không bị cắt chữ: dùng `rem`, tránh chiều cao cố định.
- **Chuyển động**: tôn trọng `prefers-reduced-motion`; không có gì nhấp nháy quá 3 lần mỗi giây.
- **Thời gian**: thông báo tự biến mất quá nhanh, hay phiên làm việc hết hạn mà không báo trước, gây khó cho người đọc chậm.
- **Ngôn ngữ**: `lang="vi"`; đoạn tiếng Anh xen giữa có thể đánh dấu `lang="en"`.
- **Tiêu đề trang** (`<title>`) mô tả đúng nội dung, đổi theo khi nội dung đổi.

## 10. Công cụ kiểm tra

| Công cụ | Kiểm tra |
| --- | --- |
| Lighthouse (DevTools) | Accessibility, best practices (gồm một số mục bảo mật như HTTPS, thư viện có lỗ hổng) |
| axe DevTools (tiện ích trình duyệt) | Lỗi accessibility chi tiết, ít báo nhầm |
| Elements → Accessibility tree | Tên, vai trò, trạng thái mà trình đọc màn hình "thấy" |
| Bàn phím + NVDA / VoiceOver | Trải nghiệm thật, bắt được những gì công cụ tự động bỏ sót |
| [securityheaders.com](https://securityheaders.com), Mozilla Observatory | Header bảo mật: CSP, HSTS, X-Frame-Options... |
| `npm audit` | Lỗ hổng đã biết trong các gói npm |

## Thực hành

**Bài 1.** Hàm sau hiển thị danh sách sản phẩm từ API. Tìm hai lỗ hổng XSS và viết lại cho an toàn.

```js
function hienThi(sanPham) {
  danhSach.innerHTML = sanPham.map((sp) => `
    <li>
      <a href="${sp.trangChu}">${sp.ten}</a>
      <p>${sp.moTa}</p>
    </li>`).join('');
}
```

::: details Xem lời giải
`sp.ten`, `sp.moTa` được chèn thẳng vào HTML; `sp.trangChu` có thể là `javascript:...`. Viết lại:

```html live
<ul id="danh-sach"></ul>
<script>
  const danhSach = document.querySelector('#danh-sach');

  function laLinkAnToan(chuoi) {
    try {
      return ['http:', 'https:'].includes(new URL(chuoi).protocol);
    } catch {
      return false;
    }
  }

  function hienThi(sanPham) {
    danhSach.replaceChildren(...sanPham.map((sp) => {
      const li = document.createElement('li');
      const a = document.createElement('a');
      a.textContent = sp.ten;
      if (laLinkAnToan(sp.trangChu)) a.href = sp.trangChu;
      const p = document.createElement('p');
      p.textContent = sp.moTa;
      li.append(a, p);
      return li;
    }));
  }

  hienThi([
    { ten: 'Sản phẩm tốt', trangChu: 'https://example.com', moTa: 'Mô tả bình thường' },
    { ten: '<img src=x onerror=alert(1)>', trangChu: 'javascript:alert(2)', moTa: '<b>chữ đậm?</b>' },
  ]);
</script>
```
Dòng thứ hai hiển thị nguyên văn các thẻ như chữ, và liên kết độc hại không có `href`.
:::

**Bài 2.** Lấy nút "☰ Menu" ở [bài Sự kiện](/javascript/su-kien#_8-tuong-tac-cho-moi-nguoi), bổ sung: nhấn `Esc` khi menu đang mở thì đóng menu và trả focus về nút; liên kết của trang hiện tại có `aria-current="page"`.

::: details Xem lời giải
```html live
<button id="nut-menu" type="button" aria-expanded="false" aria-controls="menu">☰ Menu</button>
<ul id="menu" hidden>
  <li><a href="#" aria-current="page">Trang chủ</a></li>
  <li><a href="#">Bài học</a></li>
  <li><a href="#">Liên hệ</a></li>
</ul>

<style>
  [aria-current="page"] { font-weight: bold; }
</style>

<script>
  const nut = document.querySelector('#nut-menu');
  const menu = document.querySelector('#menu');

  function datTrangThai(mo) {
    nut.setAttribute('aria-expanded', String(mo));
    menu.hidden = !mo;
  }

  nut.addEventListener('click', () => datTrangThai(nut.getAttribute('aria-expanded') !== 'true'));

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && !menu.hidden) {
      datTrangThai(false);
      nut.focus();
    }
  });
</script>
```
:::

## Lỗi thường gặp

- **Gán dữ liệu không đáng tin vào `innerHTML`** hoặc `href` chưa kiểm tra.
- **Kiểm tra quyền chỉ ở front-end** (ẩn nút) mà server không kiểm tra.
- **Lưu token, mật khẩu trong localStorage** hoặc trong mã nguồn.
- **Tự viết regex để lọc HTML** thay vì dùng thư viện làm sạch.
- **Xóa viền focus**, dùng `tabindex` dương, để focus "rơi" khi giao diện thay đổi.
- **Báo lỗi chỉ bằng màu**; dùng ARIA thay cho phần tử HTML phù hợp.

## Tóm tắt

- Front-end không đáng tin: kiểm tra ở server, không đặt bí mật ở trình duyệt.
- Chống XSS: `textContent`/`createElement` thay cho `innerHTML`; kiểm tra giao thức URL; làm sạch HTML bằng thư viện chuyên dụng; CSP chặn script lạ.
- Cookie phiên: `HttpOnly; Secure; SameSite`; HTTPS mọi nơi; SRI cho script CDN; `frame-ancestors` chống clickjacking.
- WCAG: Nhận biết được, Thao tác được, Hiểu được, Bền vững.
- Focus: thứ tự hợp lý, viền rõ ràng, skip link, `tabindex="-1"` để focus bằng code, quản lý focus khi mở/đóng/xóa.
- ARIA: `aria-label`, `aria-describedby`, `aria-expanded`, `aria-current`, `aria-invalid`, `role="status"`; HTML có sẵn luôn được ưu tiên.

## Kiểm tra kiến thức

<Quiz />
