---
title: Biến CSS, nesting & tổ chức code
description: Custom properties (biến CSS) và cách chúng kế thừa, chế độ sáng tối với color-scheme và light-dark, CSS nesting, cascade layers, @supports, quy ước đặt tên BEM và cách tổ chức tệp CSS cho dự án.
quiz:
  - q: "Biến CSS `--mau-chinh` khai báo trên `:root`. Một phần tử con đặt lại `--mau-chinh: green`. Điều gì xảy ra?"
    options:
      - "Lỗi, vì biến đã khai báo thì không đổi được"
      - "Biến đổi thành `green` cho phần tử đó và **các con cháu** của nó; phần còn lại của trang vẫn dùng giá trị cũ"
      - "Toàn bộ trang đổi sang `green`"
      - "Chỉ đổi khi tải lại trang"
    answer: 1
    explain: "Biến CSS là thuộc tính bình thường, được **kế thừa** theo cây DOM. Đây là cách làm biến thể (nút phụ, giao diện tối cho một vùng) chỉ bằng cách gán lại biến."
  - q: "`color: var(--mau-chu, #333)` — `#333` ở đây là gì?"
    options:
      - "Giá trị bắt buộc phải bằng nhau với biến"
      - "Giá trị dự phòng khi biến `--mau-chu` chưa được định nghĩa"
      - "Độ trong suốt"
      - "Màu nền"
    answer: 1
    explain: "Tham số thứ hai của `var()` là fallback, dùng khi biến không tồn tại (hoặc là giá trị không hợp lệ ở thời điểm khai báo)."
  - q: "Trong CSS nesting, `&` trong đoạn `.nut { &:hover { ... } }` đại diện cho gì?"
    options:
      - "Phần tử cha của `.nut`"
      - "Chính selector bao ngoài, tức `.nut`; nên `&:hover` thành `.nut:hover`"
      - "Mọi phần tử con"
      - "Toán tử “và” logic"
    answer: 1
    explain: "`&` thay cho selector cha. Không có `&` thì selector lồng được hiểu là con cháu: `.nut { .icon { } }` thành `.nut .icon`."
  - q: "Với `@layer reset, base, components;`, một rule trong layer `components` có độ ưu tiên thấp gặp rule trong layer `base` có độ ưu tiên rất cao. Rule nào thắng?"
    options:
      - "Rule trong `base` vì độ ưu tiên cao hơn"
      - "Rule trong `components` vì layer khai báo sau thắng, bất kể độ ưu tiên của selector"
      - "Rule viết sau cùng trong tệp"
      - "Không rule nào được áp dụng"
    answer: 1
    explain: "Cascade so sánh layer **trước** khi so độ ưu tiên. Nhờ vậy CSS nền có thể viết selector tùy ý mà không “lấn” component. CSS không nằm trong layer nào thắng mọi layer."
  - q: "Thuộc tính `color-scheme: light dark` trên `:root` có tác dụng gì?"
    options:
      - "Tự đảo màu toàn bộ trang"
      - "Báo trình duyệt trang hỗ trợ cả hai chế độ, để các phần tử mặc định (thanh cuộn, ô nhập, nền trang) tự theo chế độ của hệ điều hành, và để `light-dark()` hoạt động"
      - "Bắt buộc trang luôn tối"
      - "Chỉ ảnh hưởng khi in"
    answer: 1
    explain: "Thiếu `color-scheme`, ở chế độ tối ô nhập và thanh cuộn vẫn trắng toát giữa nền tối. `light-dark(sáng, tối)` cũng cần `color-scheme` để biết chọn giá trị nào."
---

# Biến CSS, nesting & tổ chức code

::: info Mục tiêu bài học
- Dùng **custom properties** (biến CSS) để quản lý màu, khoảng cách, cỡ chữ ở một nơi.
- Làm **chế độ sáng/tối** bằng biến, `prefers-color-scheme`, `color-scheme` và `light-dark()`.
- Viết CSS gọn hơn với **nesting**; kiểm soát cascade bằng **@layer**; kiểm tra hỗ trợ với **@supports**.
- Tổ chức CSS cho dự án: đặt tên class (BEM), chia tệp, design token.
:::

## 1. Custom properties — biến CSS

Một website có thể dùng màu thương hiệu ở 40 chỗ. Đổi màu là 40 lần tìm và thay. **Biến CSS** giải quyết chuyện đó:

```html live
<button class="nut">Nút chính</button>
<button class="nut phu">Nút phụ</button>
<div class="vung-toi"><button class="nut">Nút trong vùng tối</button></div>

<style>
  :root {
    --mau-chinh: #c2410c;
    --mau-chu-tren-nen: white;
    --bo-goc: 8px;
    --khoang-cach: 12px;
  }

  body { font-family: system-ui, sans-serif; display: flex; flex-wrap: wrap; gap: var(--khoang-cach); padding: var(--khoang-cach); }

  .nut {
    padding: 10px 18px; border: 0; font: inherit;
    border-radius: var(--bo-goc);
    color: var(--mau-chu-tren-nen);
    background: var(--mau-chinh);
  }
  .nut.phu { --mau-chinh: #0f766e; }   /* chỉ gán lại biến */

  .vung-toi { --mau-chinh: #fdba74; --mau-chu-tren-nen: #1c1917; padding: 12px; background: #1c1917; border-radius: 10px; }
</style>
```

- Khai báo: tên bắt đầu bằng **hai gạch ngang**, phân biệt chữ hoa thường: `--mau-chinh: #c2410c;`.
- Sử dụng: `var(--mau-chinh)`, có thể kèm giá trị dự phòng `var(--mau-chinh, orange)`.
- Thường khai báo trên `:root` (chính là `<html>`) để dùng cho cả trang.
- Biến được **kế thừa** như `color` hay `font-family`: gán lại biến ở một phần tử là đổi cho cả cây con của nó. Đó là cách nút `.phu` và cả `.vung-toi` đổi màu mà không viết lại một rule nào cho `.nut`.
- Biến tính toán được: `padding: calc(var(--khoang-cach) * 2);`.
- JavaScript đọc và ghi được: `element.style.setProperty('--mau-chinh', 'purple')`. Đây là cầu nối rất tiện giữa JS và CSS.

Khác với biến của Sass/Less (bị thay bằng giá trị cố định lúc build), biến CSS **sống** trong trình duyệt: đổi lúc nào, trang cập nhật lúc đó, hợp với media query, `:hover` và JavaScript.

## 2. Chế độ sáng và tối

Cách làm phổ biến: định nghĩa **bảng màu bằng biến**, rồi đổi giá trị biến cho chế độ tối.

```html live
<main class="trang">
  <h1>Chế độ sáng / tối</h1>
  <p>Đổi chế độ sáng/tối của hệ điều hành để thấy trang đổi theo. Ô nhập bên dưới cũng đổi màu nhờ <code>color-scheme</code>.</p>
  <input placeholder="Ô nhập mặc định">
  <div class="the">Thẻ dùng biến màu</div>
</main>

<style>
  :root {
    color-scheme: light dark;            /* báo trình duyệt: trang hỗ trợ cả hai chế độ */
    --nen: #ffffff;
    --chu: #1c1917;
    --nen-the: #f5f5f4;
    --nhan: #c2410c;
  }

  @media (prefers-color-scheme: dark) {
    :root {
      --nen: #18181b;
      --chu: #f4f4f5;
      --nen-the: #27272a;
      --nhan: #fdba74;
    }
  }

  body { margin: 0; font-family: system-ui, sans-serif; background: var(--nen); color: var(--chu); }
  .trang { padding: 16px; }
  h1 { color: var(--nhan); }
  .the { margin-top: 12px; padding: 16px; border-radius: 10px; background: var(--nen-the); }
</style>
```

- `color-scheme: light dark`: các phần tử mặc định của trình duyệt (nền trang, ô nhập, thanh cuộn, checkbox) tự đổi theo chế độ hệ điều hành.
- **`light-dark()`** viết gọn hơn nữa, không cần media query: `--nen: light-dark(#ffffff, #18181b);`. Hàm này đã có trên mọi trình duyệt chính từ năm 2024 và cần có `color-scheme` mới hoạt động.
- Muốn có **nút chuyển** chế độ: JavaScript gắn thuộc tính lên `<html>` (ví dụ `data-theme="dark"`), CSS viết `:root[data-theme="dark"] { ... }`, và lưu lựa chọn vào `localStorage`. Bạn sẽ làm điều này trong [dự án cuối khóa](/thuc-hanh/du-an-cuoi-khoa).

Chế độ tối không chỉ là đảo màu: tránh đen tuyệt đối `#000` và trắng tuyệt đối trên nền tối (gây chói), giảm độ bão hòa của màu nhấn, và kiểm tra lại độ tương phản.

## 3. CSS Nesting

Trước đây, muốn viết rule lồng nhau phải dùng Sass. Nay CSS đã hỗ trợ **nesting** (lồng rule) trực tiếp trên mọi trình duyệt chính:

```html live
<article class="the">
  <h3 class="the__tieu-de">Khóa học CSS</h3>
  <p>10 bài · 5 giờ</p>
  <a class="the__lien-ket" href="#">Xem chi tiết →</a>
</article>

<style>
  body { font-family: system-ui, sans-serif; }

  .the {
    max-width: 280px;
    padding: 16px;
    border: 1px solid #e7e5e4;
    border-radius: 12px;
    transition: box-shadow 0.2s;

    /* & = chính .the → .the:hover */
    &:hover { box-shadow: 0 8px 20px rgb(0 0 0 / 0.1); }

    /* không có & → con cháu: .the p */
    p { color: #78716c; margin: 4px 0 12px; }

    /* media query lồng bên trong rule */
    @media (width >= 600px) { padding: 24px; }
  }

  .the__tieu-de { margin: 0; }
  .the__lien-ket {
    color: #c2410c;
    text-decoration: none;
    &:hover { text-decoration: underline; }
  }
</style>
```

- `&` đại diện cho selector bao ngoài: `&:hover`, `&.active`, `& + &`, `.dark &` (khi `.the` nằm trong `.dark`).
- Selector lồng không có `&` được hiểu là **con cháu**.
- Đừng lồng quá 2–3 cấp: lồng sâu tạo selector dài, độ ưu tiên cao, đúng như vấn đề đã nói ở [bài Selector](/css/selector-cascade).

## 4. `@layer`: kiểm soát cascade

Dự án lớn có CSS reset, CSS nền, CSS thư viện, component, tiện ích... **Cascade layers** cho phép quyết định **lớp nào thắng lớp nào**, bất kể độ ưu tiên của selector:

```css
/* Khai báo thứ tự: layer sau thắng layer trước */
@layer reset, base, components, utilities;

@layer reset {
  *, *::before, *::after { box-sizing: border-box; }
  body { margin: 0; }
}

@layer base {
  /* Selector mạnh trong base vẫn thua component */
  main article p { line-height: 1.7; }
}

@layer components {
  .ghi-chu { line-height: 1.4; }   /* thắng rule trên dù độ ưu tiên thấp hơn */
}

@layer utilities {
  .an { display: none; }
}
```

- Thứ tự layer được quyết định bởi dòng khai báo `@layer a, b, c;` đầu tiên.
- CSS **không nằm trong layer nào** thắng mọi layer. Có thể dùng để ghi đè nhanh, hoặc đưa CSS của thư viện vào một layer thấp: `@import url('thu-vien.css') layer(thu-vien);`.

## 5. `@supports`: dùng tính năng mới an toàn

```css
.luoi { display: flex; flex-wrap: wrap; }      /* phương án cho trình duyệt cũ */

@supports (display: grid) {
  .luoi { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); }
}

@supports not (color: oklch(50% 0.1 200)) {
  :root { --mau-chinh: #c2410c; }               /* màu dự phòng */
}
```

Muốn biết một tính năng đã dùng được chưa, tra [caniuse.com](https://caniuse.com) hoặc nhãn **Baseline** trên MDN: "Widely available" nghĩa là đã có trên mọi trình duyệt chính ít nhất 30 tháng, dùng thoải mái.

## 6. Đặt tên class: BEM

Khi dự án lớn dần, tên class trùng nhau là nguồn lỗi lớn (đặt `.title` cho thẻ này, lại ảnh hưởng thẻ kia). **BEM** (Block, Element, Modifier) là quy ước phổ biến:

```text
.khoi                    Block: thành phần độc lập          .the
.khoi__phan-tu           Element: phần bên trong block      .the__tieu-de, .the__anh
.khoi--bien-the          Modifier: biến thể                 .the--noi-bat
.khoi__phan-tu--bien-the                                    .the__nut--to
```

```html
<article class="the the--noi-bat">
  <img class="the__anh" src="..." alt="...">
  <h3 class="the__tieu-de">...</h3>
  <a class="the__nut the__nut--to" href="#">Mua ngay</a>
</article>
```

Ưu điểm: mọi selector chỉ có **một class** (độ ưu tiên thấp, đều nhau), nhìn tên là biết thuộc thành phần nào, không sợ trùng. Nhược điểm: tên dài. Cách khác là CSS dạng tiện ích (utility-first, như Tailwind CSS) hoặc CSS gắn theo component trong các framework. Không cách nào "đúng" tuyệt đối, quan trọng là **cả nhóm thống nhất một quy ước**.

## 7. Tổ chức tệp CSS

Dự án nhỏ dùng một tệp `style.css` chia theo phần là đủ:

```css
/* =========== 1. Biến (design tokens) =========== */
:root {
  --mau-chinh: #c2410c;
  --mau-chu: #1c1917;
  --font: system-ui, sans-serif;
  --khoang-1: 0.25rem; --khoang-2: 0.5rem; --khoang-3: 1rem; --khoang-4: 2rem;
  --bo-goc: 8px;
  --z-header: 20; --z-modal: 30;
}

/* =========== 2. Reset & nền =========== */
/* =========== 3. Bố cục (header, footer, khung) =========== */
/* =========== 4. Thành phần (nút, thẻ, form) =========== */
/* =========== 5. Tiện ích (.an, .visually-hidden) =========== */
```

Dự án lớn hơn tách thành nhiều tệp (`tokens.css`, `reset.css`, `layout.css`, `components/the.css`...) rồi gộp lại bằng công cụ build như Vite (bài [Module, npm & Vite](/nang-cao/module-cong-cu)). Dùng `@import` trực tiếp trong CSS cũng được nhưng làm trình duyệt tải tuần tự từng tệp, chậm hơn.

**Design token** là tên gọi cho các giá trị thiết kế cơ bản (màu, khoảng cách, cỡ chữ, bo góc, bóng đổ). Đặt chúng thành biến giúp cả trang nhất quán: dùng `var(--khoang-3)` thay vì lúc `15px`, lúc `16px`, lúc `18px`.

## Thực hành

**Bài 1.** Làm bài **Biến CSS** trong [Code Playground](/thuc-hanh/playground).

::: details Xem gợi ý
Khai báo `--mau-chinh` trong `:root`, dùng `background: var(--mau-chinh)` trong `.btn`, rồi viết rule `.btn.phu { --mau-chinh: #0f766e; }`, chỉ một dòng, không có `background`.
:::

**Bài 2.** Làm một "hộp thông báo" có ba biến thể `--thanh-cong`, `--canh-bao`, `--loi`, mỗi biến thể chỉ đổi **hai biến** (màu nền nhạt và màu viền/chữ). Viết bằng nesting.

::: details Xem lời giải
```html live
<p class="thong-bao thong-bao--thanh-cong">Đã lưu thay đổi.</p>
<p class="thong-bao thong-bao--canh-bao">Phiên làm việc sắp hết hạn.</p>
<p class="thong-bao thong-bao--loi">Không kết nối được máy chủ.</p>

<style>
  body { font-family: system-ui, sans-serif; }

  .thong-bao {
    --mau: #3f3f46;
    --nen: #f4f4f5;
    padding: 10px 14px;
    border-left: 4px solid var(--mau);
    border-radius: 6px;
    color: var(--mau);
    background: var(--nen);

    &.thong-bao--thanh-cong { --mau: #15803d; --nen: #dcfce7; }
    &.thong-bao--canh-bao { --mau: #a16207; --nen: #fef9c3; }
    &.thong-bao--loi { --mau: #b91c1c; --nen: #fee2e2; }
  }
</style>
```
:::

**Bài 3.** Lấy ví dụ chế độ sáng/tối ở mục 2, viết lại bảng màu bằng `light-dark()` thay cho media query.

::: details Xem lời giải
```css
:root {
  color-scheme: light dark;
  --nen: light-dark(#ffffff, #18181b);
  --chu: light-dark(#1c1917, #f4f4f5);
  --nen-the: light-dark(#f5f5f4, #27272a);
  --nhan: light-dark(#c2410c, #fdba74);
}
```
Muốn ép một vùng luôn sáng hoặc luôn tối, đặt `color-scheme: light` (hoặc `dark`) cho vùng đó, và mọi `light-dark()` bên trong sẽ theo.
:::

## Lỗi thường gặp

- **Quên hai gạch ngang** (`-mau` hoặc `mau`) hoặc gọi biến không có `var()` → khai báo không hợp lệ.
- **Dùng biến trong media query**: `@media (width >= var(--bp))` không chạy, vì biến CSS không dùng được trong điều kiện của media query.
- **Chế độ tối thiếu `color-scheme`** → ô nhập, thanh cuộn vẫn trắng.
- **Lồng nesting quá sâu** → selector dài, độ ưu tiên cao.
- **Mỗi người đặt tên class một kiểu** → trùng tên, ghi đè lẫn nhau.

## Tóm tắt

- Biến CSS: `--ten: giá-trị;` trên `:root`, dùng bằng `var(--ten, dự-phòng)`; được kế thừa nên gán lại ở đâu thì đổi ở đó.
- Chế độ tối: bảng màu bằng biến + `prefers-color-scheme` hoặc `light-dark()`, luôn kèm `color-scheme: light dark`.
- Nesting: `&` là selector bao ngoài; lồng không có `&` là con cháu; đừng lồng quá sâu.
- `@layer` quyết định thứ tự thắng giữa các lớp CSS trước cả độ ưu tiên; `@supports` để dùng tính năng mới an toàn.
- Thống nhất quy ước đặt tên (ví dụ BEM), gom giá trị thiết kế thành design token.

## Kiểm tra kiến thức

<Quiz />
