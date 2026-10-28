---
title: Văn bản, liên kết & hình ảnh
description: Tiêu đề, đoạn văn, nhấn mạnh, trích dẫn, ký tự đặc biệt, liên kết với đường dẫn tuyệt đối và tương đối, liên kết trong trang, hình ảnh và văn bản thay thế alt.
quiz:
  - q: "Vì sao không nên dùng `<h3>` chỉ vì muốn chữ nhỏ hơn `<h2>`?"
    options:
      - "Vì `<h3>` không hiển thị được tiếng Việt"
      - "Vì thẻ tiêu đề thể hiện **cấp bậc nội dung**; cỡ chữ là việc của CSS"
      - "Vì `<h3>` chỉ dùng trong bảng"
      - "Không có lý do gì, chọn thẻ theo cỡ chữ là đúng"
    answer: 1
    explain: "Trình đọc màn hình và công cụ tìm kiếm dựa vào cấp tiêu đề để hiểu dàn ý trang. Chọn thẻ theo ý nghĩa, rồi chỉnh cỡ chữ bằng CSS."
  - q: "Trang đang ở `/blog/html/bai-1.html`. Liên kết `href=\"../css/bai-2.html\"` dẫn tới đâu?"
    options:
      - "`/blog/html/css/bai-2.html`"
      - "`/blog/css/bai-2.html`"
      - "`/css/bai-2.html`"
      - "`/blog/html/bai-2.html`"
    answer: 1
    explain: "Đường dẫn tương đối tính từ thư mục của trang hiện tại (`/blog/html/`). `..` đi lên một cấp thành `/blog/`, rồi vào `css/bai-2.html`."
  - q: "Ảnh chỉ để trang trí (họa tiết nền, đường kẻ) thì nên viết `alt` thế nào?"
    options:
      - "Bỏ hẳn thuộc tính `alt`"
      - "`alt=\"\"` (rỗng)"
      - "`alt=\"ảnh\"`"
      - "`alt` bằng tên tệp ảnh"
    answer: 1
    explain: "`alt` rỗng báo cho trình đọc màn hình bỏ qua ảnh. Thiếu hẳn `alt`, nhiều trình đọc sẽ đọc tên tệp (ví dụ “hoa-van-03 chấm png”), rất khó chịu."
  - q: "Khác nhau giữa `<strong>` và `<b>` là gì?"
    options:
      - "Không khác gì, chỉ là hai cách viết"
      - "`<strong>` nghĩa là **nội dung quan trọng**; `<b>` chỉ làm chữ nổi bật về hình thức, không thêm ý nghĩa"
      - "`<b>` mới là chuẩn, `<strong>` đã lỗi thời"
      - "`<strong>` làm chữ to hơn"
    answer: 1
    explain: "Hai thẻ trông giống nhau (in đậm) nhưng mang ý nghĩa khác. Tương tự `<em>` (nhấn giọng) so với `<i>` (chữ nghiêng cho thuật ngữ, tên riêng...)."
  - q: "Muốn liên kết cuộn tới tiêu đề `<h2 id=\"lien-he\">` trong cùng trang, bạn viết `href` thế nào?"
    options:
      - "`href=\"lien-he\"`"
      - "`href=\"#lien-he\"`"
      - "`href=\".lien-he\"`"
      - "`href=\"/lien-he\"`"
    answer: 1
    explain: "Dấu `#` theo sau là `id` của phần tử cần tới. Có thể kết hợp với trang khác: `href=\"lien-he.html#ban-do\"`."
---

# Văn bản, liên kết & hình ảnh

::: info Mục tiêu bài học
- Dùng đúng các thẻ **tiêu đề**, **đoạn văn** và thẻ **nhấn mạnh** theo ý nghĩa.
- Viết **ký tự đặc biệt** (`<`, `&`, `©`...) đúng cách.
- Tạo **liên kết** tới trang khác, tới tệp, tới vị trí trong trang, email và số điện thoại.
- Phân biệt **đường dẫn tuyệt đối** và **tương đối**.
- Chèn **hình ảnh** với `alt` có ý nghĩa và kích thước rõ ràng.
:::

## 1. Tiêu đề: `<h1>` đến `<h6>`

Sáu cấp tiêu đề tạo thành **dàn ý** của trang, giống mục lục của một cuốn sách:

```html live
<h1>Cẩm nang du lịch Đà Lạt</h1>
<h2>Đi lại</h2>
<h3>Máy bay</h3>
<h3>Xe khách</h3>
<h2>Ăn uống</h2>
<h3>Đặc sản nên thử</h3>
```

Quy tắc:

- Mỗi trang có **một** `<h1>` nói về nội dung chính của trang.
- **Không nhảy cấp**: sau `<h2>` là `<h3>`, đừng nhảy thẳng xuống `<h5>`.
- **Chọn thẻ theo ý nghĩa, không theo cỡ chữ.** Muốn tiêu đề nhỏ hơn thì dùng CSS.

Người dùng trình đọc màn hình (screen reader) thường **nhảy giữa các tiêu đề** để lướt trang, và Google cũng dựa vào chúng để hiểu nội dung. Dàn ý tốt có lợi cho cả hai.

## 2. Đoạn văn, xuống dòng và đường kẻ

- `<p>`: một **đoạn văn**. Trình duyệt tự thêm khoảng cách giữa các đoạn.
- `<br>`: **xuống dòng** bên trong một đoạn. Chỉ dùng khi xuống dòng là một phần của nội dung (địa chỉ, bài thơ), đừng dùng nhiều `<br>` để tạo khoảng trống, việc đó để CSS lo.
- `<hr>`: **chuyển ý** giữa các phần, trình duyệt vẽ thành một đường kẻ ngang.

```html live
<p>Hôm nay trời đẹp. Mình đi dạo quanh hồ Xuân Hương.</p>
<p>
  Địa chỉ quán:<br>
  12 Nguyễn Chí Thanh<br>
  Phường 1, Đà Lạt
</p>
<hr>
<p>Phần tiếp theo của bài viết...</p>
```

## 3. Nhấn mạnh và ngữ nghĩa trong câu

| Thẻ | Ý nghĩa | Hiển thị mặc định |
| --- | --- | --- |
| `<strong>` | Nội dung **quan trọng**, cần chú ý | Đậm |
| `<em>` | **Nhấn giọng**, đổi nghĩa câu ("tôi *không* nói vậy") | Nghiêng |
| `<b>`, `<i>` | Chỉ nổi bật về hình thức: từ khóa, thuật ngữ, tên tác phẩm | Đậm / nghiêng |
| `<mark>` | Đánh dấu, tô sáng (ví dụ từ khóa tìm kiếm) | Nền vàng |
| `<small>` | Ghi chú phụ, điều khoản | Chữ nhỏ |
| `<sub>`, `<sup>` | Chỉ số dưới, số mũ: H₂O, x² | Dịch xuống / lên |
| `<code>`, `<kbd>` | Đoạn code; phím người dùng bấm | Font đơn cách |
| `<abbr title="...">` | Chữ viết tắt, `title` là dạng đầy đủ | Gạch chân chấm |
| `<blockquote>`, `<q>` | Trích dẫn dài (khối) / ngắn (trong câu) | Thụt lề / có ngoặc kép |

```html live
<p><strong>Lưu ý:</strong> không tắt máy khi đang cập nhật.</p>
<p>Tôi <em>đã</em> nói là đừng bấm nút đỏ!</p>
<p>Công thức nước: H<sub>2</sub>O. Diện tích: 25 m<sup>2</sup>.</p>
<p>Nhấn <kbd>Ctrl</kbd> + <kbd>S</kbd> để lưu, rồi gọi hàm <code>luu()</code>.</p>
<p><abbr title="HyperText Markup Language">HTML</abbr> ra đời năm 1991.</p>
<blockquote cite="https://vi.wikipedia.org/wiki/Tim_Berners-Lee">
  <p>Sức mạnh của Web nằm ở tính phổ quát của nó.</p>
</blockquote>
<p>Như người ta vẫn nói, <q>học đi đôi với hành</q>.</p>
```

## 4. Ký tự đặc biệt (entity)

Một số ký tự có nghĩa đặc biệt trong HTML. Muốn hiển thị chúng như chữ thường, bạn viết dưới dạng **entity** `&ten;`:

| Muốn hiện | Viết | Ghi chú |
| --- | --- | --- |
| `<` `>` | `&lt;` `&gt;` | Bắt buộc khi muốn hiện thẻ HTML trong nội dung |
| `&` | `&amp;` | |
| `"` | `&quot;` | Cần khi đặt dấu nháy kép trong giá trị thuộc tính |
| dấu cách không ngắt dòng | `&nbsp;` | Giữ hai từ luôn trên cùng một dòng: `100&nbsp;km` |
| `©` `→` `…` | `&copy;` `&rarr;` `&hellip;` | Với UTF-8, bạn cũng có thể gõ thẳng ký tự |

```html live
<p>Thẻ &lt;p&gt; dùng cho đoạn văn.</p>
<p>Bánh mì &amp; cà phê — giá 35.000&nbsp;₫</p>
<p>&copy; 2026 WebBasic &rarr; Học web &hellip;</p>
```

## 5. Liên kết với `<a>`

Liên kết (*hyperlink*) là chữ "H" trong HTML. Thuộc tính `href` chỉ nơi cần tới:

```html live height=230
<p><a href="https://developer.mozilla.org/vi/">MDN Web Docs</a> — tài liệu web chuẩn nhất.</p>
<p><a href="https://www.w3.org" target="_blank" rel="noopener">W3C</a> (mở tab mới)</p>
<p><a href="mailto:hotro@example.com?subject=Hỏi%20về%20khóa%20học">Gửi email hỗ trợ</a></p>
<p><a href="tel:+842812345678">Gọi (028) 1234 5678</a></p>
<p><a href="#cuoi-trang">Xuống cuối trang ↓</a></p>
<p style="margin-top: 400px" id="cuoi-trang">Đây là cuối trang. <a href="#">Lên đầu ↑</a></p>
```

- `target="_blank"` mở trong **tab mới**. Chỉ dùng khi thật cần (người dùng tự chọn mở tab mới được), và kèm `rel="noopener"` để trang mới không điều khiển được trang của bạn qua `window.opener`. Trình duyệt hiện đại đã tự áp dụng `noopener` cho `_blank`, nhưng ghi rõ vẫn an toàn hơn với trình duyệt cũ.
- `mailto:` mở ứng dụng email, `tel:` gọi điện (rất tiện trên điện thoại).
- `href="#id"` cuộn tới phần tử có `id` tương ứng trong cùng trang. `href="#"` đưa về đầu trang.
- Thuộc tính `download` (`<a href="bao-gia.pdf" download>`) gợi ý trình duyệt **tải về** thay vì mở.

::: tip Chữ của liên kết phải có nghĩa khi đứng một mình
Người dùng trình đọc màn hình thường nghe **danh sách các liên kết** trong trang. Mười liên kết đều tên "Bấm vào đây" thì vô dụng. Hãy viết `Tải <a href="...">bảng giá 2026 (PDF)</a>` thay vì `Bảng giá: <a href="...">bấm vào đây</a>`.
:::

## 6. Đường dẫn tuyệt đối và tương đối

Giả sử website có cấu trúc:

```text
website/
├── index.html
├── lien-he.html
├── blog/
│   ├── index.html
│   └── bai-1.html        ← trang đang xem
└── images/
    └── logo.png
```

| Loại | Ví dụ (viết trong `blog/bai-1.html`) | Trỏ tới |
| --- | --- | --- |
| Tuyệt đối (URL đầy đủ) | `https://example.com/lien-he.html` | Đúng địa chỉ đó, dùng cho trang web khác |
| Tương đối, cùng thư mục | `index.html` hoặc `./index.html` | `blog/index.html` |
| Tương đối, lên một cấp | `../lien-he.html` | `lien-he.html` ở gốc |
| Tương đối, vào thư mục con | `../images/logo.png` | `images/logo.png` |
| Tính từ gốc website | `/images/logo.png` | `images/logo.png`, dù trang đang ở thư mục nào |

- Liên kết **trong** website của bạn: dùng đường dẫn tương đối hoặc tính từ gốc.
- Đường dẫn bắt đầu bằng `/` tính từ **gốc tên miền**. Khi mở tệp trực tiếp từ ổ đĩa (`file:///C:/...`), gốc là ổ đĩa, nên `/images/logo.png` sẽ hỏng. Đó là một lý do nên dùng Live Preview/Live Server.
- Luôn dùng dấu `/`, kể cả trên Windows: `images/logo.png`, không phải `images\logo.png`.

## 7. Hình ảnh với `<img>`

```html live
<img
  src="https://picsum.photos/id/1039/480/270"
  alt="Thác nước đổ xuống giữa rừng cây xanh"
  width="480"
  height="270">
<p>Ảnh không tải được thì trình duyệt hiện chữ trong alt:</p>
<img src="anh-khong-ton-tai.jpg" alt="Sơ đồ đường đi từ cổng trường tới thư viện" width="240" height="80">
```

- `src`: đường dẫn tới ảnh (tuyệt đối hoặc tương đối).
- `alt`: **văn bản thay thế**, đọc cho người khiếm thị và hiện khi ảnh lỗi. Đây là thuộc tính **bắt buộc**.
- `width`, `height`: kích thước gốc tính bằng pixel, viết **không có đơn vị**. Trình duyệt dựa vào tỉ lệ này để giữ chỗ trước khi ảnh tải xong, nhờ vậy trang không bị "giật" (xem chỉ số CLS ở bài [Hiệu năng](/nang-cao/hieu-nang)). Kích thước hiển thị thật vẫn chỉnh được bằng CSS.

**Viết `alt` thế nào cho tốt?** Hãy tưởng tượng bạn đang đọc trang cho một người qua điện thoại.

| Ảnh | `alt` tốt | `alt` kém |
| --- | --- | --- |
| Ảnh sản phẩm | `Áo thun cotton màu trắng, cổ tròn` | `ảnh`, `IMG_2031.jpg` |
| Biểu đồ | `Doanh thu tăng từ 2 tỷ (2024) lên 3,5 tỷ (2026)` | `biểu đồ` |
| Logo là liên kết về trang chủ | `WebBasic – Trang chủ` | `logo` |
| Họa tiết trang trí | `alt=""` (rỗng: trình đọc màn hình bỏ qua) | bỏ hẳn `alt` |

Ảnh có chú thích nhìn thấy được thì bọc trong `<figure>` cùng `<figcaption>`:

```html live
<figure>
  <img src="https://picsum.photos/id/1015/400/240" alt="Dòng sông xanh thẫm chảy giữa hai dãy núi đá" width="400" height="240">
  <figcaption>Hình 1. Ảnh minh họa: một vịnh hẹp giữa núi đá (nguồn: Picsum).</figcaption>
</figure>
```

**Chọn định dạng ảnh:**

| Định dạng | Dùng cho |
| --- | --- |
| JPEG | Ảnh chụp, nhiều màu |
| PNG | Ảnh cần nền trong suốt, ảnh chụp màn hình |
| SVG | Logo, icon, hình vẽ vector: phóng to bao nhiêu cũng nét |
| WebP, AVIF | Định dạng mới, nhẹ hơn JPEG/PNG đáng kể; mọi trình duyệt hiện đại đều hỗ trợ |

Cách phục vụ nhiều kích thước ảnh cho điện thoại và máy tính (`srcset`, `<picture>`) có ở bài [Thẻ head, SEO & đa phương tiện](/html/head-media).

## Thực hành

**Bài 1.** Viết một bài blog ngắn "Ba món ăn sáng ở Hà Nội" gồm: một `<h1>`, mỗi món là một `<h2>` với một đoạn văn. Trong bài có ít nhất một `<strong>`, một `<em>` và giá tiền dùng `&nbsp;` để số và đơn vị không bị tách dòng.

::: details Xem lời giải
```html live
<h1>Ba món ăn sáng ở Hà Nội</h1>

<h2>Phở bò</h2>
<p>Nước dùng ninh từ xương bò cả đêm. <strong>Nên ăn trước 9 giờ</strong> vì nhiều quán bán hết sớm. Giá khoảng 50.000&nbsp;₫.</p>

<h2>Bánh cuốn</h2>
<p>Bánh mỏng, chấm nước mắm pha. Bánh cuốn Thanh Trì thì <em>không</em> có nhân.</p>

<h2>Xôi xéo</h2>
<p>Xôi vàng rắc hành phi và đậu xanh, khoảng 25.000&nbsp;₫ một gói.</p>
```
:::

**Bài 2.** Làm một trang dài có mục lục ở đầu: ba liên kết tới ba phần `<h2>` có `id` (`#di-lai`, `#an-uong`, `#luu-tru`). Cuối mỗi phần có liên kết "Lên đầu trang".

::: details Xem lời giải
```html live height=320
<h1 id="dau-trang">Du lịch Đà Lạt</h1>
<nav>
  <a href="#di-lai">Đi lại</a> ·
  <a href="#an-uong">Ăn uống</a> ·
  <a href="#luu-tru">Lưu trú</a>
</nav>

<h2 id="di-lai">Đi lại</h2>
<p style="min-height: 250px">Bay tới sân bay Liên Khương rồi đi xe buýt khoảng 40 phút.</p>
<a href="#dau-trang">Lên đầu trang ↑</a>

<h2 id="an-uong">Ăn uống</h2>
<p style="min-height: 250px">Nhớ thử bánh tráng nướng và sữa đậu nành nóng buổi tối.</p>
<a href="#dau-trang">Lên đầu trang ↑</a>

<h2 id="luu-tru">Lưu trú</h2>
<p style="min-height: 250px">Homestay quanh hồ Tuyền Lâm yên tĩnh, đẹp vào sáng sớm.</p>
<a href="#dau-trang">Lên đầu trang ↑</a>
```
`style="min-height: 250px"` chỉ để trang đủ dài mà thử cuộn. Bạn sẽ học CSS ở phần sau. `<nav>` là thẻ ngữ nghĩa cho nhóm liên kết điều hướng ([bài HTML ngữ nghĩa](/html/html-ngu-nghia)).
:::

**Bài 3.** Viết `alt` cho bốn ảnh: (a) ảnh chân dung tác giả cạnh tên tác giả trong bài viết; (b) icon kính lúp trên nút tìm kiếm không có chữ; (c) ảnh chụp màn hình một thông báo lỗi; (d) đường lượn sóng trang trí giữa hai phần.

::: details Xem lời giải
- (a) Tên đã có ngay cạnh nên không cần lặp lại. Mô tả ngắn như `alt="Ảnh chân dung tác giả"` là được; nếu ảnh chỉ để trang trí thì để `alt=""`.
- (b) Mô tả **chức năng**, không mô tả hình: `alt="Tìm kiếm"`.
- (c) Nội dung lỗi mới quan trọng: `alt="Thông báo lỗi: Không kết nối được máy chủ (mã 503)"`.
- (d) Trang trí thuần túy: `alt=""`.
:::

## Lỗi thường gặp

- **Dùng thẻ tiêu đề vì cỡ chữ**, hoặc nhiều `<h1>` trong một trang → dàn ý rối, ảnh hưởng SEO và trình đọc màn hình.
- **Dùng `<br><br><br>` để tạo khoảng cách** → dùng `margin` trong CSS.
- **Quên `alt` hoặc ghi alt vô nghĩa** ("ảnh", "image") → người khiếm thị không biết ảnh nói gì.
- **Đường dẫn sai chữ hoa, chữ thường** → `Logo.PNG` và `logo.png` là hai tệp khác nhau trên server Linux. Ảnh chạy trên Windows nhưng hỏng khi đưa lên mạng.
- **`target="_blank"` cho mọi liên kết** → người dùng bị mở quá nhiều tab, nút Quay lại không dùng được.

## Tóm tắt

- `<h1>`–`<h6>` tạo dàn ý: một `<h1>`, không nhảy cấp, chọn theo ý nghĩa.
- `<p>` cho đoạn văn, `<br>` để xuống dòng trong đoạn, `<strong>`/`<em>` để nhấn mạnh có ý nghĩa.
- Ký tự `<`, `>`, `&` viết thành `&lt;`, `&gt;`, `&amp;`.
- `<a href>`: đường dẫn tuyệt đối cho trang ngoài, tương đối (`./`, `../`) hoặc từ gốc (`/`) cho trang trong website; `#id` để tới vị trí trong trang.
- `<img>` luôn có `alt` mô tả ý nghĩa ảnh (rỗng nếu ảnh chỉ trang trí) và `width`/`height`.

## Kiểm tra kiến thức

<Quiz />
