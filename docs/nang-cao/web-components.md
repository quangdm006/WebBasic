---
title: Web Components & API trình duyệt hiện đại
description: Tạo phần tử HTML riêng với Custom Elements, đóng gói với Shadow DOM, template và slot; hộp thoại dialog, Popover API, accordion với details, View Transitions, các API hữu ích khác và nguyên tắc tăng cường dần (progressive enhancement).
quiz:
  - q: "Tên của một custom element phải tuân theo quy tắc nào?"
    options:
      - "Viết hoa chữ cái đầu"
      - "Phải chứa ít nhất một dấu gạch ngang, ví dụ `the-san-pham`"
      - "Bắt đầu bằng `x-`"
      - "Không có quy tắc"
    answer: 1
    explain: "Dấu gạch ngang đảm bảo tên của bạn không bao giờ trùng với thẻ HTML chuẩn trong tương lai (thẻ chuẩn không bao giờ có gạch ngang)."
  - q: "Shadow DOM mang lại lợi ích chính nào?"
    options:
      - "Làm trang tải nhanh hơn"
      - "Đóng gói: CSS và cấu trúc bên trong component không bị CSS bên ngoài ảnh hưởng, và ngược lại"
      - "Tự động lưu dữ liệu"
      - "Cho phép chạy code trên server"
    answer: 1
    explain: "Style viết trong shadow root chỉ áp dụng bên trong nó; selector bên ngoài không “chọc” vào được. Biến CSS thì vẫn xuyên qua, nên là cách chuẩn để tùy biến component."
  - q: "Mở `<dialog>` bằng `showModal()` (thay vì `show()`) có gì khác?"
    options:
      - "Không khác gì"
      - "Hộp thoại nằm trên mọi nội dung (top layer), có lớp nền `::backdrop`, phần còn lại của trang không tương tác được, Esc để đóng, focus được chuyển vào trong"
      - "Hộp thoại tự đóng sau 3 giây"
      - "Chỉ chạy trên điện thoại"
    answer: 1
    explain: "`showModal()` cho bạn gần như mọi thứ một hộp thoại cần về accessibility mà không phải tự viết. `show()` mở dạng không chặn (non-modal)."
  - q: "Thuộc tính HTML nào biến một phần tử thành popover, bật tắt bằng nút có `popovertarget` mà không cần JavaScript?"
    options:
      - "`hidden`"
      - "`popover`"
      - "`dialog`"
      - "`toggle`"
    answer: 1
    explain: "`<div id=\"menu\" popover>` + `<button popovertarget=\"menu\">`: bấm để mở, bấm ra ngoài hoặc Esc để đóng (light dismiss), nằm trên mọi thứ."
  - q: "**Tăng cường dần** (progressive enhancement) nghĩa là gì?"
    options:
      - "Viết trang chỉ chạy trên trình duyệt mới nhất"
      - "Đảm bảo chức năng cơ bản chạy ở mọi nơi, rồi dùng tính năng mới để làm trải nghiệm tốt hơn ở nơi hỗ trợ (kiểm tra bằng feature detection)"
      - "Tăng dần cỡ chữ"
      - "Tải ảnh từ mờ đến rõ"
    answer: 1
    explain: "Ví dụ: chỉ gọi `document.startViewTransition` khi nó tồn tại; trình duyệt chưa hỗ trợ vẫn cập nhật nội dung, chỉ là không có hiệu ứng chuyển cảnh."
---

# Web Components & API trình duyệt hiện đại

::: info Mục tiêu bài học
- Tạo phần tử HTML của riêng bạn với **Custom Elements**; hiểu vòng đời của chúng.
- Đóng gói giao diện với **Shadow DOM**, `<template>` và `<slot>`.
- Dùng các tính năng có sẵn thay cho JavaScript tự viết: `<dialog>`, **Popover API**, `<details name>`.
- Thêm hiệu ứng chuyển cảnh với **View Transitions**; biết thêm các API hữu ích khác.
- Áp dụng **tăng cường dần** và **kiểm tra tính năng** (feature detection).
:::

## 1. Custom Elements: thẻ HTML của riêng bạn

Bạn đã dùng `<button>`, `<video>`, `<details>`: mỗi thẻ đóng gói sẵn giao diện và hành vi. **Custom Elements** cho phép bạn tạo thẻ mới theo cùng cách, dùng được ở bất kỳ trang nào, với bất kỳ framework nào (hoặc không framework):

```html live
<danh-gia-sao gia-tri="3"></danh-gia-sao>
<danh-gia-sao gia-tri="5" toi-da="5"></danh-gia-sao>

<script>
  class DanhGiaSao extends HTMLElement {
    // Những thuộc tính HTML cần theo dõi thay đổi
    static observedAttributes = ['gia-tri'];

    connectedCallback() {               // khi phần tử được gắn vào trang
      this.addEventListener('click', this.#khiBam);
      this.#ve();
    }

    disconnectedCallback() {            // khi phần tử bị gỡ khỏi trang: dọn dẹp
      this.removeEventListener('click', this.#khiBam);
    }

    attributeChangedCallback() {        // khi gia-tri thay đổi
      this.#ve();
    }

    get giaTri() {
      return Number(this.getAttribute('gia-tri')) || 0;
    }

    #khiBam = (event) => {
      const nut = event.target.closest('button');
      if (!nut) return;
      this.setAttribute('gia-tri', nut.dataset.sao);
      this.dispatchEvent(new CustomEvent('doi-danh-gia', { detail: this.giaTri, bubbles: true }));
    };

    #ve() {
      const toiDa = Number(this.getAttribute('toi-da')) || 5;
      this.replaceChildren(...Array.from({ length: toiDa }, (_, i) => {
        const nut = document.createElement('button');
        nut.type = 'button';
        nut.dataset.sao = i + 1;
        nut.textContent = i < this.giaTri ? '★' : '☆';
        nut.setAttribute('aria-label', `${i + 1} sao`);
        nut.setAttribute('aria-pressed', String(i < this.giaTri));
        return nut;
      }));
    }
  }

  customElements.define('danh-gia-sao', DanhGiaSao);

  document.addEventListener('doi-danh-gia', (event) => console.log('Đánh giá mới:', event.detail, 'sao'));
</script>

<style>
  danh-gia-sao { display: block; margin-bottom: 8px; }
  danh-gia-sao button { border: 0; background: none; font-size: 28px; color: #f59e0b; cursor: pointer; padding: 0 2px; }
</style>
```

- Class kế thừa `HTMLElement`, đăng ký bằng `customElements.define('ten-the', LopCuaBan)`.
- Tên thẻ **bắt buộc có dấu gạch ngang** (`danh-gia-sao`), để không bao giờ trùng với thẻ HTML chuẩn.
- **Vòng đời**: `connectedCallback` (gắn vào trang), `disconnectedCallback` (bị gỡ, nên dọn listener, interval), `attributeChangedCallback` (thuộc tính trong `observedAttributes` thay đổi).
- Component giao tiếp ra ngoài bằng **sự kiện tùy chỉnh** (`CustomEvent`, dữ liệu trong `detail`), giống thẻ chuẩn phát sự kiện `change`.

## 2. Shadow DOM: đóng gói giao diện

Component trên dùng CSS chung của trang: một rule `button { ... }` ở đâu đó sẽ làm hỏng giao diện ngôi sao. **Shadow DOM** tạo một "cây DOM riêng" bên trong phần tử, có CSS riêng, cách ly với bên ngoài:

```html live
<the-thong-bao loai="thanh-cong">
  <strong slot="tieu-de">Đã lưu!</strong>
  Thay đổi của bạn đã được lưu lúc 10:30.
</the-thong-bao>

<the-thong-bao loai="loi">
  <strong slot="tieu-de">Lỗi kết nối</strong>
  Kiểm tra mạng rồi thử lại.
</the-thong-bao>

<template id="mau-thong-bao">
  <style>
    :host { display: block; margin-bottom: 10px; --mau: #3f3f46; --nen: #f4f4f5; }
    :host([loai="thanh-cong"]) { --mau: #15803d; --nen: #dcfce7; }
    :host([loai="loi"]) { --mau: #b91c1c; --nen: #fee2e2; }
    .hop { display: flex; gap: 10px; padding: 12px 14px; border-left: 4px solid var(--mau);
           border-radius: 8px; background: var(--nen); color: var(--mau); font-family: system-ui, sans-serif; }
    button { margin-left: auto; border: 0; background: none; color: inherit; font-size: 18px; cursor: pointer; }
    ::slotted(strong) { display: block; }
  </style>
  <div class="hop" role="status">
    <div>
      <slot name="tieu-de"></slot>
      <slot></slot>
    </div>
    <button type="button" aria-label="Đóng thông báo">✕</button>
  </div>
</template>

<style>
  /* CSS bên ngoài KHÔNG lọt vào trong shadow DOM */
  button { background: red !important; }
  .hop { border: 5px dotted blue; }
</style>

<script>
  class TheThongBao extends HTMLElement {
    constructor() {
      super();
      const goc = this.attachShadow({ mode: 'open' });
      goc.append(document.querySelector('#mau-thong-bao').content.cloneNode(true));
      goc.querySelector('button').addEventListener('click', () => this.remove());
    }
  }
  customElements.define('the-thong-bao', TheThongBao);
</script>
```

Dù trang có rule `button { background: red !important }` và `.hop { border: 5px dotted blue }`, component không hề bị ảnh hưởng.

- `this.attachShadow({ mode: 'open' })` tạo **shadow root**. Nội dung và `<style>` bên trong chỉ có tác dụng trong đó.
- `:host` là chính phần tử; `:host([loai="loi"])` là phần tử khi có thuộc tính đó.
- **`<slot>`** là "lỗ" để nội dung bên ngoài (do người dùng component viết) hiện vào đúng chỗ; slot có `name` nhận phần tử có `slot="..."` tương ứng; `::slotted()` định kiểu cho nội dung được đưa vào.
- **Biến CSS xuyên qua** shadow DOM: đây là cách chuẩn để cho phép tùy biến từ bên ngoài (`the-thong-bao { --mau: purple }`).

::: tip Khi nào dùng Web Components?
Web Components hợp với **thành phần dùng chung** giữa nhiều dự án, nhiều framework: thư viện giao diện của công ty (design system), widget nhúng vào trang của khách hàng (nút chat, bản đồ). Với ứng dụng lớn có nhiều trạng thái, framework (React, Vue, Svelte...) vẫn tiện hơn; và các framework này dùng được Web Components bên trong.
:::

## 3. `<dialog>`: hộp thoại có sẵn

Tự làm hộp thoại đúng chuẩn (lớp nền, khóa phần còn lại của trang, giữ focus bên trong, Esc để đóng, trả focus khi đóng) mất cả trăm dòng code. `<dialog>` có sẵn tất cả:

```html live height=330
<button id="mo" type="button">Xóa tài khoản</button>
<p id="kq"></p>

<dialog id="hop-thoai" aria-labelledby="tieu-de-ht">
  <form method="dialog">
    <h2 id="tieu-de-ht">Xóa tài khoản?</h2>
    <p>Mọi dữ liệu sẽ bị xóa vĩnh viễn và không thể khôi phục.</p>
    <div class="nut-bam">
      <button value="huy" autofocus>Hủy</button>
      <button value="xoa" class="nguy-hiem">Xóa vĩnh viễn</button>
    </div>
  </form>
</dialog>

<style>
  body { font-family: system-ui, sans-serif; }
  dialog { max-width: 360px; border: 0; border-radius: 12px; padding: 20px; box-shadow: 0 20px 40px rgb(0 0 0 / 0.25); }
  dialog::backdrop { background: rgb(0 0 0 / 0.5); }
  dialog h2 { margin-top: 0; }
  .nut-bam { display: flex; justify-content: flex-end; gap: 8px; }
  .nguy-hiem { background: #b91c1c; color: white; border: 0; border-radius: 6px; padding: 6px 12px; }
</style>

<script>
  const hopThoai = document.querySelector('#hop-thoai');
  document.querySelector('#mo').addEventListener('click', () => hopThoai.showModal());

  hopThoai.addEventListener('close', () => {
    // returnValue = value của nút đã bấm ('' nếu đóng bằng Esc)
    document.querySelector('#kq').textContent = `Bạn chọn: ${hopThoai.returnValue || 'đóng bằng Esc'}`;
  });
</script>
```

- `showModal()`: mở dạng modal, nằm trên mọi thứ (**top layer**), có `::backdrop`, trang phía sau bị vô hiệu, focus chuyển vào trong. `show()`: mở dạng không chặn. `close(giaTri)`: đóng.
- `<form method="dialog">`: bấm nút trong form sẽ **đóng** hộp thoại, và `value` của nút thành `dialog.returnValue`. Không cần dòng JavaScript nào cho việc đóng.
- Khi đóng, focus tự quay về nút đã mở hộp thoại.

## 4. Popover API

Menu thả xuống, gợi ý (tooltip), bảng tùy chọn nhỏ... dùng thuộc tính **`popover`**, không cần JavaScript:

```html live height=220
<button popovertarget="menu-tk" type="button">👤 Tài khoản ▾</button>
<div id="menu-tk" popover>
  <a href="#">Hồ sơ</a>
  <a href="#">Cài đặt</a>
  <a href="#">Đăng xuất</a>
</div>

<button popovertarget="meo" popovertargetaction="show" type="button">💡 Mẹo</button>
<div id="meo" popover="manual">
  Popover "manual" không tự đóng khi bấm ra ngoài.
  <button popovertarget="meo" popovertargetaction="hide" type="button">Đã hiểu</button>
</div>

<style>
  body { font-family: system-ui, sans-serif; }
  [popover] { border: 1px solid #e7e5e4; border-radius: 10px; padding: 8px; box-shadow: 0 10px 30px rgb(0 0 0 / 0.15); }
  #menu-tk a { display: block; padding: 6px 12px; color: inherit; text-decoration: none; border-radius: 6px; }
  #menu-tk a:hover { background: #f5f5f4; }
</style>
```

- Phần tử có `popover` mặc định bị ẩn; nút có `popovertarget="id"` bật/tắt nó.
- `popover` (mặc định là `auto`): tự đóng khi bấm ra ngoài hoặc nhấn Esc (*light dismiss*), và chỉ một popover `auto` mở tại một thời điểm. `popover="manual"`: chỉ đóng khi bạn bảo.
- Nằm trong **top layer**, nên không bao giờ bị che hay bị `overflow: hidden` cắt mất, cũng không cần `z-index`.
- JavaScript: `el.showPopover()`, `el.hidePopover()`, `el.togglePopover()`, sự kiện `toggle`.

Popover API đã có trên mọi trình duyệt chính từ năm 2024. Việc **đặt vị trí** popover cạnh nút bấm bằng CSS (*anchor positioning*) là tính năng mới hơn; kiểm tra mức hỗ trợ trên caniuse trước khi dùng.

## 5. Accordion với `<details name>`

Nhiều khối `<details>` có cùng `name` hoạt động như **accordion**: mở cái này thì cái kia tự đóng.

```html live
<details name="faq" open>
  <summary>Khóa học có mất phí không?</summary>
  <p>Không, toàn bộ nội dung miễn phí.</p>
</details>
<details name="faq">
  <summary>Cần cài gì để học?</summary>
  <p>Trình duyệt và VS Code là đủ.</p>
</details>
<details name="faq">
  <summary>Học xong làm được gì?</summary>
  <p>Tự xây trang web hoàn chỉnh và sẵn sàng học tiếp framework.</p>
</details>

<style>
  body { font-family: system-ui, sans-serif; }
  details { border: 1px solid #e7e5e4; border-radius: 8px; padding: 8px 12px; margin-bottom: 6px; }
  summary { cursor: pointer; font-weight: 600; }
</style>
```

Không một dòng JavaScript, dùng được bằng bàn phím, trình đọc màn hình hiểu ngay, và nội dung bên trong vẫn tìm được bằng `Ctrl` + `F`.

## 6. View Transitions: chuyển cảnh mượt

**View Transitions API** tạo hiệu ứng chuyển cảnh giữa hai trạng thái giao diện: trình duyệt "chụp" giao diện cũ, bạn cập nhật DOM, rồi trình duyệt tự làm hiệu ứng mờ chuyển sang giao diện mới.

```html live
<button id="doi" type="button">Đổi chế độ xem</button>
<ul id="ds" class="luoi">
  <li style="view-transition-name: sp-1">🍎 Táo</li>
  <li style="view-transition-name: sp-2">🍌 Chuối</li>
  <li style="view-transition-name: sp-3">🍇 Nho</li>
  <li style="view-transition-name: sp-4">🍊 Cam</li>
</ul>

<style>
  body { font-family: system-ui, sans-serif; }
  ul { list-style: none; padding: 0; gap: 8px; }
  li { padding: 14px; border-radius: 10px; background: #ffedd5; }
  .luoi { display: grid; grid-template-columns: repeat(2, 1fr); }
  .danh-sach { display: flex; flex-direction: column; }
</style>

<script>
  const ds = document.querySelector('#ds');

  function doiCheDo() {
    ds.classList.toggle('luoi');
    ds.classList.toggle('danh-sach');
  }

  document.querySelector('#doi').addEventListener('click', () => {
    // Tăng cường dần: trình duyệt chưa hỗ trợ vẫn đổi giao diện, chỉ không có hiệu ứng
    if (!document.startViewTransition) {
      doiCheDo();
      return;
    }
    document.startViewTransition(doiCheDo);
  });
</script>
```

- `document.startViewTransition(hamCapNhat)`: trình duyệt chụp trạng thái cũ, gọi hàm cập nhật DOM, rồi tạo hiệu ứng.
- `view-transition-name` (mỗi tên là duy nhất trên trang) cho trình duyệt biết phần tử nào "là một" giữa hai trạng thái, để nó **di chuyển** mượt từ vị trí cũ sang vị trí mới.
- Tùy biến hiệu ứng bằng CSS qua các pseudo-element `::view-transition-old()`, `::view-transition-new()`. Nhớ tôn trọng `prefers-reduced-motion`.

## 7. Các API hữu ích khác

| API | Dùng để | Ghi chú |
| --- | --- | --- |
| `navigator.clipboard.writeText(chuoi)` | Copy vào clipboard (nút "Sao chép") | Cần HTTPS và thao tác của người dùng |
| `navigator.share({ title, url })` | Mở bảng chia sẻ của hệ điều hành | Chủ yếu trên điện thoại; kiểm tra `navigator.share` trước |
| `navigator.geolocation` | Vị trí người dùng | Hỏi quyền; chỉ xin khi thật cần |
| `Notification` | Thông báo hệ thống | Hỏi quyền; đừng xin ngay khi vừa vào trang |
| `IntersectionObserver`, `ResizeObserver` | Theo dõi hiển thị, kích thước | Bài [Hiệu năng](/nang-cao/hieu-nang) |
| `BroadcastChannel` | Gửi tin giữa các tab cùng trang | Đồng bộ đăng xuất, giỏ hàng |
| `document.visibilityState` | Biết tab có đang được xem không | Tạm dừng video, polling |
| IndexedDB | Cơ sở dữ liệu trong trình duyệt, lưu nhiều dữ liệu | API phức tạp; thường dùng qua thư viện nhỏ |
| Service Worker | Chạy offline, cache, thông báo đẩy | Nền tảng của PWA (ứng dụng web cài được) |

```js
// Nút sao chép: tăng cường dần và báo kết quả cho người dùng
nutCopy.addEventListener('click', async () => {
  try {
    await navigator.clipboard.writeText(maGiamGia.textContent);
    trangThai.textContent = 'Đã sao chép mã!';
  } catch {
    trangThai.textContent = 'Không sao chép được, hãy chọn mã và nhấn Ctrl + C.';
  }
});
```

## 8. Tăng cường dần và kiểm tra tính năng

**Tăng cường dần** (progressive enhancement): xây chức năng cốt lõi bằng những gì chạy **ở mọi nơi** (HTML có ngữ nghĩa, form gửi được, liên kết hoạt động), rồi **thêm** những trải nghiệm tốt hơn ở trình duyệt hỗ trợ.

```js
// Kiểm tra tính năng (feature detection), KHÔNG kiểm tra tên trình duyệt
if ('share' in navigator) {
  nutChiaSe.hidden = false;
}

if (document.startViewTransition) {
  document.startViewTransition(capNhat);
} else {
  capNhat();
}
```

```css
@supports (anchor-name: --a) {
  /* chỉ áp dụng khi trình duyệt hỗ trợ anchor positioning */
}
```

Tra cứu hỗ trợ trên [caniuse.com](https://caniuse.com) và nhãn **Baseline** trên MDN: "Widely available" là dùng thoải mái; "Newly available" là đã có trên mọi trình duyệt chính nhưng người dùng chưa cập nhật hết, nên cần phương án dự phòng.

## Thực hành

**Bài 1.** Tạo custom element `<bo-dem-nguoc giay="10">` hiển thị số giây đếm ngược về 0 (mỗi giây giảm 1), khi về 0 thì phát sự kiện `het-gio`. Nhớ dừng `setInterval` trong `disconnectedCallback`.

::: details Xem lời giải
```html live
<bo-dem-nguoc giay="5"></bo-dem-nguoc>
<p id="tb"></p>

<script>
  class BoDemNguoc extends HTMLElement {
    #hen;

    connectedCallback() {
      let conLai = Number(this.getAttribute('giay')) || 10;
      this.textContent = `⏳ ${conLai}`;
      this.#hen = setInterval(() => {
        conLai--;
        this.textContent = conLai > 0 ? `⏳ ${conLai}` : '⏰ Hết giờ!';
        if (conLai <= 0) {
          clearInterval(this.#hen);
          this.dispatchEvent(new CustomEvent('het-gio', { bubbles: true }));
        }
      }, 1000);
    }

    disconnectedCallback() {
      clearInterval(this.#hen);
    }
  }

  customElements.define('bo-dem-nguoc', BoDemNguoc);
  document.addEventListener('het-gio', () => {
    document.querySelector('#tb').textContent = 'Đã nhận sự kiện het-gio!';
  });
</script>
```
:::

**Bài 2.** Làm hộp thoại "Đăng ký nhận tin" bằng `<dialog>`: có ô email bắt buộc, nút "Đăng ký" và "Để sau". Bấm "Để sau" thì đóng mà **không** bị kiểm tra `required`; bấm "Đăng ký" thì kiểm tra email rồi đóng và hiện lời cảm ơn.

::: details Xem lời giải
```html live height=320
<button id="mo" type="button">Nhận bản tin</button>
<p id="kq" role="status"></p>

<dialog id="dk" aria-labelledby="dk-tieu-de">
  <form method="dialog">
    <h3 id="dk-tieu-de">Đăng ký nhận tin</h3>
    <label>Email <input name="email" type="email" required></label>
    <p>
      <button value="dang-ky">Đăng ký</button>
      <button value="de-sau" formnovalidate>Để sau</button>
    </p>
  </form>
</dialog>

<script>
  const dk = document.querySelector('#dk');
  document.querySelector('#mo').addEventListener('click', () => dk.showModal());
  dk.addEventListener('close', () => {
    if (dk.returnValue === 'dang-ky') {
      const email = dk.querySelector('input').value;
      document.querySelector('#kq').textContent = `Cảm ơn! Đã đăng ký ${email}.`;
    }
  });
</script>
```
`formnovalidate` trên nút "Để sau" bỏ qua kiểm tra `required`. Kiểm tra email của trình duyệt vẫn chạy với nút "Đăng ký" trước khi hộp thoại đóng.
:::

## Lỗi thường gặp

- **Tên custom element không có gạch ngang**, hoặc gọi `define` hai lần cùng tên (lỗi).
- **Quên dọn dẹp** (listener trên `document`, interval) trong `disconnectedCallback`.
- **Tự viết hộp thoại, menu thả xuống bằng `div` + `z-index`** khi `<dialog>` và `popover` đã có sẵn và dễ tiếp cận hơn.
- **Gọi API mới mà không kiểm tra tính năng** → lỗi trên trình duyệt chưa hỗ trợ.
- **Xin quyền (vị trí, thông báo) ngay khi vừa vào trang** → người dùng từ chối theo phản xạ.

## Tóm tắt

- Custom Elements: `class X extends HTMLElement` + `customElements.define('ten-co-gach', X)`; vòng đời `connected`/`disconnected`/`attributeChangedCallback`; giao tiếp bằng `CustomEvent`.
- Shadow DOM: `attachShadow`, CSS cách ly, `:host`, `<slot>`, `::slotted()`; tùy biến từ ngoài bằng biến CSS.
- `<dialog>` + `showModal()` + `<form method="dialog">`; `popover` + `popovertarget`; `<details name>` cho accordion. Đều có sẵn, dễ tiếp cận, ít hoặc không cần JS.
- View Transitions: `document.startViewTransition(capNhat)` + `view-transition-name`.
- Tăng cường dần: chức năng cốt lõi chạy mọi nơi, kiểm tra tính năng trước khi dùng API mới.

## Kiểm tra kiến thức

<Quiz />
