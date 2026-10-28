---
title: Transition, transform & animation
description: Biến đổi hình học với transform, chuyển động mượt bằng transition, hàm thời gian, keyframes và animation, thuộc tính nào nên animate để mượt, và tôn trọng người dùng muốn giảm chuyển động.
quiz:
  - q: "Đặt `transition` ở đâu để hiệu ứng chạy **cả khi** di chuột vào lẫn khi rời ra?"
    options:
      - "Trong rule `:hover`"
      - "Trong rule trạng thái bình thường của phần tử (không có `:hover`)"
      - "Trong `@keyframes`"
      - "Phải đặt ở cả hai nơi với giá trị khác nhau"
    answer: 1
    explain: "Đặt trong `:hover` thì chỉ có hiệu ứng lúc vào; lúc rời ra, rule `:hover` không còn áp dụng nên mất luôn transition và phần tử “giật” về ngay."
  - q: "Vì sao nên animate `transform` và `opacity` thay vì `top`, `left`, `width`?"
    options:
      - "Vì `top`, `left` không animate được"
      - "Vì `transform` và `opacity` không làm trình duyệt tính lại bố cục; thường được xử lý trên GPU nên mượt hơn nhiều"
      - "Vì `transform` có nhiều màu hơn"
      - "Không có khác biệt về hiệu năng"
    answer: 1
    explain: "Đổi `width`/`top` buộc trình duyệt tính lại layout rồi vẽ lại ở từng khung hình, dễ giật trên máy yếu. `transform`/`opacity` chỉ cần ghép lớp (composite)."
  - q: "`transform: translateX(100px)` khác `position: relative; left: 100px` ở điểm nào khi nói về bố cục?"
    options:
      - "`translateX` làm các phần tử xung quanh dịch theo"
      - "Cả hai đều giữ chỗ cũ trong bố cục và không đẩy phần tử khác; nhưng `transform` không gây tính lại layout nên phù hợp cho chuyển động"
      - "`translateX` gỡ phần tử khỏi bố cục"
      - "Không thể dùng `translateX` với phần tử khối"
    answer: 1
    explain: "Cả hai chỉ dịch phần **hiển thị**. Khác nhau ở hiệu năng khi tạo chuyển động, và `transform` còn làm được xoay, phóng to, nghiêng."
  - q: "`animation: xoay 1s linear infinite` nghĩa là gì?"
    options:
      - "Chạy keyframes `xoay` một lần trong 1 giây"
      - "Chạy keyframes `xoay` mỗi vòng 1 giây, tốc độ đều, lặp vô hạn"
      - "Xoay 1 độ mỗi giây"
      - "Chờ 1 giây rồi xoay"
    answer: 1
    explain: "Thứ tự hay dùng: tên, thời lượng, hàm thời gian, (độ trễ), số lần lặp. `linear` là tốc độ đều, rất hợp cho vòng xoay loading."
  - q: "Người dùng bật “giảm chuyển động” trong hệ điều hành. Bạn nên làm gì?"
    options:
      - "Bỏ qua vì đó là cài đặt của hệ điều hành"
      - "Dùng `@media (prefers-reduced-motion: reduce)` để tắt hoặc giảm các animation lớn"
      - "Làm animation chạy nhanh gấp đôi"
      - "Hiện thông báo yêu cầu tắt cài đặt đó"
    answer: 1
    explain: "Hiệu ứng trượt, phóng to lớn có thể gây chóng mặt cho người bị rối loạn tiền đình. Thay bằng hiệu ứng mờ dần nhẹ hoặc tắt hẳn."
---

# Transition, transform & animation

::: info Mục tiêu bài học
- Biến đổi phần tử bằng `transform`: dịch, xoay, phóng to, nghiêng.
- Tạo chuyển động mượt giữa hai trạng thái với `transition` và chọn **hàm thời gian** phù hợp.
- Tạo animation nhiều bước với `@keyframes` và `animation`.
- Biết thuộc tính nào nên animate để mượt (`transform`, `opacity`).
- Tôn trọng người dùng muốn **giảm chuyển động**.
:::

## 1. `transform`: biến đổi hình học

```html live
<div class="hang">
  <div class="o dich">translate</div>
  <div class="o xoay">rotate</div>
  <div class="o phong">scale</div>
  <div class="o nghieng">skew</div>
  <div class="o ket-hop">kết hợp</div>
</div>

<style>
  body { font-family: system-ui, sans-serif; }
  .hang { display: flex; flex-wrap: wrap; gap: 28px; padding: 24px; }
  .o { width: 90px; height: 70px; display: grid; place-items: center; border-radius: 8px; background: #fdba74; font-size: 13px; outline: 2px dashed #a8a29e; outline-offset: 0; }
  .dich { transform: translate(10px, 10px); }      /* dịch phải 10px, xuống 10px */
  .xoay { transform: rotate(15deg); }              /* xoay 15 độ theo chiều kim đồng hồ */
  .phong { transform: scale(1.2); }                /* phóng to 120% */
  .nghieng { transform: skewX(-12deg); }           /* nghiêng */
  .ket-hop { transform: translateY(-8px) rotate(-6deg) scale(0.9); }
</style>
```

- `translate(x, y)`, `translateX()`, `translateY()`: dịch chuyển. Phần trăm tính theo **chính phần tử**: `translate(-50%, -50%)` dịch lùi một nửa kích thước của nó.
- `rotate(45deg)`: xoay. `scale(1.5)`: phóng to; `scale(-1, 1)`: lật ngang.
- Nhiều biến đổi viết cách nhau bằng dấu cách, áp dụng **từ phải sang trái**, nên thứ tự ảnh hưởng tới kết quả.
- `transform-origin`: tâm biến đổi, mặc định là giữa phần tử. Ví dụ `transform-origin: top left`.

`transform` **không làm thay đổi bố cục**: khung nét đứt cho thấy chỗ phần tử "thật sự" chiếm, các phần tử xung quanh không bị đẩy đi.

CSS hiện đại còn có các thuộc tính riêng `translate`, `rotate`, `scale` (ví dụ `scale: 1.1`), tiện khi chỉ muốn đổi một phép biến đổi mà không viết lại cả chuỗi `transform`.

## 2. `transition`: chuyển động giữa hai trạng thái

Không có transition, đổi trạng thái (khi di chuột, khi thêm class) là "nhảy" tức thì. `transition` làm cho sự thay đổi diễn ra **từ từ**:

```html live
<button class="nut">Di chuột vào tôi</button>
<a class="the" href="#">
  <strong>Thẻ nổi lên</strong>
  <span>khi di chuột hoặc focus bằng Tab</span>
</a>

<style>
  body { font-family: system-ui, sans-serif; display: flex; gap: 24px; align-items: center; padding: 20px; }
  .nut {
    padding: 10px 18px; border: 0; border-radius: 8px; font: inherit; color: white;
    background: #c2410c;
    transition: background-color 0.2s ease, transform 0.2s ease;   /* đặt ở trạng thái THƯỜNG */
  }
  .nut:hover { background: #7c2d12; transform: scale(1.05); }
  .nut:active { transform: scale(0.97); }

  .the {
    display: grid; gap: 4px; padding: 16px; border-radius: 12px; color: inherit; text-decoration: none;
    background: white; box-shadow: 0 1px 3px rgb(0 0 0 / 0.12);
    transition: transform 0.25s ease-out, box-shadow 0.25s ease-out;
  }
  .the:is(:hover, :focus-visible) { transform: translateY(-4px); box-shadow: 0 12px 24px rgb(0 0 0 / 0.15); }
</style>
```

Cú pháp: `transition: thuộc-tính thời-lượng hàm-thời-gian độ-trễ;`, nhiều thuộc tính cách nhau bằng dấu phẩy.

| Phần | Ví dụ | Ghi chú |
| --- | --- | --- |
| Thuộc tính | `transform`, `background-color`, `opacity` | Hạn chế `all`: nó animate cả những thứ bạn không định |
| Thời lượng | `0.2s`, `300ms` | Hiệu ứng giao diện thường 150–300ms; dài hơn sẽ thấy "chậm chạp" |
| Hàm thời gian | `ease`, `ease-out`, `linear`... | Xem mục 3 |
| Độ trễ | `0.1s` | Hiếm khi cần |

::: tip Đặt transition ở trạng thái thường, không phải trong `:hover`
Như vậy chuyển động diễn ra ở **cả hai chiều**: khi di chuột vào và khi rời ra.
:::

Không phải thứ gì cũng transition được: `display` (ẩn/hiện) và `height: auto` không chuyển động mượt theo cách thông thường. Mẹo hay dùng là kết hợp `opacity` với `visibility`, hoặc animate `grid-template-rows` từ `0fr` sang `1fr` để mở rộng một khối có chiều cao tự động.

## 3. Hàm thời gian (easing)

Hàm thời gian quyết định tốc độ thay đổi trong suốt quá trình chuyển động:

```html live
<div class="duong"><div class="bi" style="--e: linear">linear</div></div>
<div class="duong"><div class="bi" style="--e: ease">ease</div></div>
<div class="duong"><div class="bi" style="--e: ease-in">ease-in</div></div>
<div class="duong"><div class="bi" style="--e: ease-out">ease-out</div></div>
<div class="duong"><div class="bi" style="--e: cubic-bezier(0.34, 1.56, 0.64, 1)">bật nảy</div></div>
<p>Di chuột vào vùng này để chạy.</p>

<style>
  body { font-family: system-ui, sans-serif; }
  .duong { position: relative; height: 34px; margin-bottom: 6px; background: #f4f4f5; border-radius: 6px; }
  .bi {
    position: absolute; top: 4px; left: 4px; padding: 4px 8px; border-radius: 6px;
    background: #8b5cf6; color: white; font-size: 12px;
    transition: transform 1.2s var(--e);
  }
  body:hover .bi { transform: translateX(calc(min(100vw, 600px) - 140px)); }
</style>
```

| Hàm | Cảm giác | Dùng cho |
| --- | --- | --- |
| `ease` (mặc định) | Nhanh dần rồi chậm dần | Đa số trường hợp |
| `ease-out` | Bắt đầu nhanh, kết thúc êm | Phần tử **xuất hiện**, phản hồi khi bấm |
| `ease-in` | Bắt đầu chậm, kết thúc nhanh | Phần tử **biến mất** |
| `ease-in-out` | Chậm hai đầu | Chuyển động qua lại |
| `linear` | Tốc độ đều | Vòng xoay, thanh tiến độ |
| `cubic-bezier(...)` | Tự định nghĩa | Hiệu ứng bật nảy (giá trị vượt 1) |
| `steps(n)` | Nhảy từng bước | Hiệu ứng gõ chữ, sprite |

DevTools có trình chỉnh đường cong: bấm vào biểu tượng nhỏ cạnh giá trị hàm thời gian trong bảng Styles.

## 4. `@keyframes` và `animation`

Transition chỉ chạy giữa **hai trạng thái** và cần một sự kiện kích hoạt. **Animation** định nghĩa **nhiều bước**, tự chạy, có thể lặp:

```html live
<div class="hang">
  <div class="loading" role="status" aria-label="Đang tải"></div>
  <div class="tim">❤</div>
  <p class="hien-ra">Tôi trượt lên và hiện dần</p>
</div>

<style>
  body { font-family: system-ui, sans-serif; }
  .hang { display: flex; gap: 32px; align-items: center; padding: 20px; }

  @keyframes xoay {
    to { transform: rotate(1turn); }       /* 1turn = 360deg */
  }
  .loading {
    width: 36px; height: 36px; border-radius: 50%;
    border: 4px solid #e7e5e4; border-top-color: #c2410c;
    animation: xoay 0.8s linear infinite;
  }

  @keyframes dap {
    0%, 100% { transform: scale(1); }
    15% { transform: scale(1.25); }
    30% { transform: scale(1); }
    45% { transform: scale(1.15); }
  }
  .tim { font-size: 40px; color: #e11d48; animation: dap 1.2s ease-in-out infinite; }

  @keyframes truot-len {
    from { opacity: 0; transform: translateY(16px); }
    to { opacity: 1; transform: none; }
  }
  .hien-ra { animation: truot-len 0.6s ease-out 0.3s both; }
</style>
```

`@keyframes ten { ... }` định nghĩa các mốc theo phần trăm (`from` = `0%`, `to` = `100%`). Sau đó gắn vào phần tử bằng `animation`:

| Thuộc tính | Ví dụ | Ý nghĩa |
| --- | --- | --- |
| `animation-name` | `xoay` | Tên keyframes |
| `animation-duration` | `0.8s` | Thời lượng mỗi vòng |
| `animation-timing-function` | `linear` | Hàm thời gian |
| `animation-delay` | `0.3s` | Độ trễ trước khi bắt đầu |
| `animation-iteration-count` | `3`, `infinite` | Số lần lặp |
| `animation-direction` | `alternate` | Chạy xuôi rồi ngược |
| `animation-fill-mode` | `both` | Giữ trạng thái `from` khi đang chờ trễ, giữ `to` sau khi xong |
| `animation-play-state` | `paused` | Tạm dừng |

Viết gọn: `animation: truot-len 0.6s ease-out 0.3s both;`. Thời lượng đứng trước độ trễ.

## 5. Animate thế nào cho mượt?

Để chạy mượt 60 khung hình mỗi giây, mỗi khung hình trình duyệt chỉ có khoảng 16ms. Nhớ lại các bước dựng trang ở [bài 1](/html/web-hoat-dong-the-nao): **layout → paint → composite**.

| Thuộc tính animate | Trình duyệt phải làm lại | Độ mượt |
| --- | --- | --- |
| `transform`, `opacity` | Chỉ composite (ghép lớp, thường trên GPU) | ✅ Rất mượt |
| `color`, `background-color`, `box-shadow` | Paint + composite | ⚠️ Được, dùng vừa phải |
| `width`, `height`, `top`, `left`, `margin`, `padding` | Layout + paint + composite | ❌ Dễ giật |

Muốn "di chuyển" phần tử, hãy dùng `translate` thay vì `left`/`top`; muốn "to ra", dùng `scale` thay vì `width`. Thuộc tính `will-change: transform` báo trước cho trình duyệt chuẩn bị, nhưng chỉ dùng khi đã thấy giật, đừng đặt tràn lan.

## 6. Tôn trọng người dùng muốn giảm chuyển động

Một số người bị **rối loạn tiền đình** cảm thấy chóng mặt, buồn nôn với chuyển động lớn (trượt, phóng to, cuộn thị sai). Họ bật tùy chọn "giảm chuyển động" trong hệ điều hành, và CSS đọc được tùy chọn đó:

```css
@media (prefers-reduced-motion: reduce) {
  .hien-ra {
    animation: none;   /* hoặc chỉ giữ hiệu ứng mờ dần nhẹ */
  }
}
```

Hoặc làm ngược lại: chỉ thêm chuyển động khi người dùng **không** yêu cầu giảm:

```css
@media (prefers-reduced-motion: no-preference) {
  .the { transition: transform 0.25s ease-out; }
}
```

Nguyên tắc chung: chuyển động phải **có mục đích** (cho biết điều gì vừa xảy ra, phần tử đến từ đâu), ngắn gọn, và không bao giờ là cách duy nhất để truyền đạt thông tin.

## Thực hành

**Bài 1.** Làm nút "Thêm vào giỏ": khi di chuột thì nền đậm hơn và nổi lên 2px kèm bóng đổ; khi nhấn thì lún xuống; khi focus bằng bàn phím có viền rõ ràng. Mọi chuyển động 150–200ms.

::: details Xem lời giải
```html live
<button class="mua" type="button">🛒 Thêm vào giỏ</button>

<style>
  body { font-family: system-ui, sans-serif; padding: 24px; }
  .mua {
    padding: 12px 20px; border: 0; border-radius: 10px;
    font: inherit; font-weight: 600; color: white; background: #c2410c;
    box-shadow: 0 1px 2px rgb(0 0 0 / 0.2);
    transition: transform 0.15s ease-out, box-shadow 0.15s ease-out, background-color 0.15s;
  }
  .mua:hover { background: #9a3412; transform: translateY(-2px); box-shadow: 0 6px 14px rgb(0 0 0 / 0.2); }
  .mua:active { transform: translateY(0); box-shadow: 0 1px 2px rgb(0 0 0 / 0.2); }
  .mua:focus-visible { outline: 3px solid #7c3aed; outline-offset: 3px; }
</style>
```
:::

**Bài 2.** Làm hiệu ứng "khung xương" (skeleton) khi đang tải: ba thanh xám có dải sáng chạy ngang lặp lại liên tục. Tắt dải sáng khi người dùng muốn giảm chuyển động.

::: details Xem lời giải
```html live
<div class="skeleton" style="width: 60%"></div>
<div class="skeleton"></div>
<div class="skeleton" style="width: 80%"></div>

<style>
  .skeleton {
    height: 16px; margin-bottom: 10px; border-radius: 6px;
    background: linear-gradient(90deg, #e7e5e4 25%, #f5f5f4 50%, #e7e5e4 75%);
    background-size: 300% 100%;
    animation: anh-sang 1.4s ease-in-out infinite;
  }
  @keyframes anh-sang {
    from { background-position: 100% 0; }
    to { background-position: 0 0; }
  }
  @media (prefers-reduced-motion: reduce) {
    .skeleton { animation: none; }
  }
</style>
```
Ở đây ta animate `background-position` (cần vẽ lại). Với vài thanh nhỏ thì không sao; với danh sách rất dài, có thể chuyển sang animate `transform` của một lớp `::after`.
:::

## Lỗi thường gặp

- **Đặt `transition` trong `:hover`** → không có hiệu ứng khi rời chuột.
- **`transition: all`** → animate cả những thuộc tính không mong muốn, đôi khi gây giật.
- **Animate `width`, `left`, `top`** → giật trên điện thoại. Dùng `transform`.
- **Animation quá dài, quá nhiều** → giao diện chậm chạp, rối mắt.
- **Quên `prefers-reduced-motion`.**
- **Thứ tự trong `transform` sai**: `rotate(45deg) translateX(100px)` khác hẳn `translateX(100px) rotate(45deg)`.

## Tóm tắt

- `transform`: `translate`, `rotate`, `scale`, `skew`; không làm thay đổi bố cục; `transform-origin` đổi tâm.
- `transition: thuộc-tính thời-lượng hàm-thời-gian;` đặt ở trạng thái thường; 150–300ms cho hiệu ứng giao diện.
- Hàm thời gian: `ease-out` khi xuất hiện, `ease-in` khi biến mất, `linear` cho vòng xoay.
- `@keyframes` + `animation` cho chuyển động nhiều bước, tự chạy, có thể lặp; `fill-mode: both` giữ trạng thái.
- Animate `transform` và `opacity` để mượt; tôn trọng `prefers-reduced-motion`.

## Kiểm tra kiến thức

<Quiz />
