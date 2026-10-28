---
title: Định vị & lớp xếp chồng
description: Thuộc tính position (static, relative, absolute, fixed, sticky), top/right/bottom/left và inset, khối chứa, z-index, stacking context và các mẫu hay gặp như huy hiệu, header dính, lớp phủ.
quiz:
  - q: "Phần tử `position: absolute` được định vị so với cái gì?"
    options:
      - "Luôn so với cửa sổ trình duyệt"
      - "So với tổ tiên gần nhất có `position` khác `static`; nếu không có thì so với khối chứa ban đầu (trang)"
      - "So với phần tử cha trực tiếp, dù cha có position gì"
      - "So với vị trí ban đầu của chính nó"
    answer: 1
    explain: "Đó là lý do mẫu quen thuộc là đặt `position: relative` cho khung bao ngoài, rồi `position: absolute` cho phần tử con cần định vị bên trong."
  - q: "`position: relative; top: 20px` làm gì?"
    options:
      - "Đẩy phần tử xuống 20px so với vị trí bình thường, chỗ cũ vẫn được giữ nguyên trong bố cục"
      - "Đặt phần tử cách đỉnh trang 20px"
      - "Gỡ phần tử ra khỏi bố cục"
      - "Không có tác dụng"
    answer: 0
    explain: "`relative` dịch phần tử so với chính nó nhưng các phần tử khác vẫn coi như nó ở chỗ cũ. Công dụng chính của `relative` là làm mốc cho con `absolute`."
  - q: "Header dùng `position: sticky; top: 0` nhưng không dính khi cuộn. Nguyên nhân hay gặp là gì?"
    options:
      - "Trình duyệt không hỗ trợ sticky"
      - "Một tổ tiên có `overflow: hidden`/`auto`, hoặc phần tử cha không cao hơn chính header"
      - "Thiếu `z-index: 9999`"
      - "Phải dùng `bottom: 0` thay vì `top: 0`"
    answer: 1
    explain: "Sticky chỉ dính trong phạm vi phần tử cha và trong vùng cuộn gần nhất. Tổ tiên có `overflow` khác `visible` sẽ trở thành vùng cuộn đó."
  - q: "Phần tử A có `z-index: 9999` nhưng vẫn nằm dưới phần tử B có `z-index: 2`. Giải thích hợp lý nhất là gì?"
    options:
      - "z-index tối đa chỉ là 999"
      - "A nằm trong một stacking context (ví dụ cha có `z-index: 1`, `opacity` < 1, `transform`...) thấp hơn B; z-index chỉ so sánh trong cùng context"
      - "z-index chỉ chạy với `position: static`"
      - "B được viết sau trong HTML nên luôn thắng"
    answer: 1
    explain: "Mỗi stacking context là một “tầng” khép kín. Con có z-index cao mấy cũng không thoát khỏi tầng của cha."
  - q: "Thuộc tính `inset: 0` trên phần tử `position: absolute` tương đương với gì?"
    options:
      - "`top: 0; right: 0; bottom: 0; left: 0`, tức phủ kín khối chứa"
      - "`margin: 0`"
      - "`padding: 0`"
      - "`z-index: 0`"
    answer: 0
    explain: "`inset` là cách viết gọn cho bốn thuộc tính định vị, rất tiện để làm lớp phủ (overlay) kín khung."
---

# Định vị & lớp xếp chồng

::: info Mục tiêu bài học
- Hiểu năm giá trị của `position`: `static`, `relative`, `absolute`, `fixed`, `sticky`.
- Dùng `top`/`right`/`bottom`/`left` và `inset`, hiểu **khối chứa** (containing block).
- Điều khiển lớp trên dưới bằng `z-index` và hiểu **stacking context**.
- Làm các mẫu hay gặp: huy hiệu góc thẻ, header dính, nút nổi, lớp phủ toàn màn hình.
:::

## 1. Dòng chảy bình thường và `position`

Mặc định, phần tử xếp theo **dòng chảy bình thường** (normal flow): khối chồng từ trên xuống, nội tuyến chảy theo dòng chữ. Flexbox và Grid vẫn nằm trong dòng chảy đó. Thuộc tính `position` cho phép **dịch** phần tử khỏi vị trí bình thường, hoặc **gỡ** nó ra khỏi dòng chảy để đặt ở vị trí tùy ý.

| Giá trị | Còn chiếm chỗ trong bố cục? | Định vị so với |
| --- | --- | --- |
| `static` (mặc định) | Có | Không định vị được, `top`/`left` không có tác dụng |
| `relative` | Có (giữ chỗ cũ) | Vị trí bình thường của chính nó |
| `absolute` | **Không** | Tổ tiên gần nhất có `position` khác `static` |
| `fixed` | **Không** | Cửa sổ trình duyệt (đứng yên khi cuộn) |
| `sticky` | Có | Như `relative`, rồi **dính lại** khi cuộn tới ngưỡng |

## 2. `relative` và `absolute`

```html live
<div class="khung">
  <div class="hop">1</div>
  <div class="hop tuong-doi">2 · relative, top 20px, left 30px</div>
  <div class="hop">3</div>
  <div class="hop tuyet-doi">4 · absolute, bottom 8px, right 8px</div>
</div>

<style>
  body { font-family: system-ui, sans-serif; }
  .khung { position: relative; height: 230px; padding: 8px; border: 2px dashed #a8a29e; }
  .hop { width: 140px; padding: 10px; margin-bottom: 6px; background: #e7e5e4; border-radius: 6px; }
  .tuong-doi { position: relative; top: 20px; left: 30px; background: #fdba74; }
  .tuyet-doi { position: absolute; bottom: 8px; right: 8px; background: #c4b5fd; }
</style>
```

- Hộp 2 (`relative`) bị dịch đi, nhưng hộp 3 vẫn nằm như thể hộp 2 chưa dịch: **chỗ cũ được giữ nguyên**.
- Hộp 4 (`absolute`) bị **gỡ khỏi dòng chảy** và đặt ở góc dưới phải của `.khung`, vì `.khung` có `position: relative`.

::: tip Mẫu "cha relative, con absolute"
Đây là mẫu bạn sẽ dùng nhiều nhất: đặt `position: relative` cho khung bao ngoài (không cần dịch nó đi đâu cả), nó trở thành **mốc** cho các con `absolute` bên trong. Thiếu dòng này, con `absolute` sẽ định vị theo... cả trang.
:::

Vài điều về `absolute`:

- `top`, `right`, `bottom`, `left` là khoảng cách tới **cạnh trong** (phần padding) của khối chứa. `inset: 0` là viết gọn của cả bốn bằng 0.
- Đặt cả `left` và `right` thì phần tử giãn ra giữa hai mốc đó. Không đặt kích thước, phần tử absolute co lại vừa nội dung.
- `inset: 0; margin: auto` kèm `width`/`height` là một cách căn giữa phần tử absolute.

## 3. Mẫu hay gặp: huy hiệu và lớp phủ trên ảnh

```html live
<article class="the">
  <img src="https://picsum.photos/id/1039/320/200" alt="Thác nước trong rừng" width="320" height="200">
  <span class="huy-hieu">-30%</span>
  <div class="phu"><h3>Tour Tây Nguyên</h3><p>3 ngày 2 đêm</p></div>
</article>

<style>
  body { font-family: system-ui, sans-serif; }
  .the { position: relative; width: 320px; border-radius: 12px; overflow: hidden; }
  .the img { display: block; width: 100%; height: auto; }
  .huy-hieu {
    position: absolute; top: 10px; right: 10px;
    padding: 4px 10px; border-radius: 999px;
    background: #dc2626; color: white; font-weight: 700; font-size: 14px;
  }
  .phu {
    position: absolute; inset: auto 0 0 0;   /* bám đáy, trải hết chiều ngang */
    padding: 32px 14px 10px; color: white;
    background: linear-gradient(transparent, rgb(0 0 0 / 0.75));
  }
  .phu h3, .phu p { margin: 0; }
</style>
```

## 4. `fixed`: đứng yên khi cuộn

`fixed` định vị so với **cửa sổ trình duyệt** (viewport): nút chat ở góc màn hình, thanh cookie, hộp thoại.

```html live height=260
<p>Cuộn nội dung trong khung này: nút tròn vẫn đứng yên ở góc.</p>
<div style="height: 700px; background: linear-gradient(#fafaf9, #e7e5e4)"></div>
<button class="chat" type="button" aria-label="Mở hộp chat">💬</button>

<style>
  body { font-family: system-ui, sans-serif; }
  .chat {
    position: fixed; right: 16px; bottom: 16px;
    width: 52px; height: 52px; border: 0; border-radius: 50%;
    font-size: 24px; background: #c2410c; color: white;
    box-shadow: 0 4px 12px rgb(0 0 0 / 0.25);
  }
</style>
```

Phần tử `fixed` có thể che nội dung bên dưới (đặc biệt trên điện thoại màn hình nhỏ). Hãy chừa khoảng trống, ví dụ thêm `padding-bottom` cho `body`.

::: warning `fixed` bị "bắt giữ" bởi `transform`
Nếu một tổ tiên có `transform`, `filter` hay `perspective`, phần tử `fixed` bên trong sẽ định vị theo tổ tiên đó thay vì cửa sổ. Đây là lỗi khó hiểu hay gặp khi đặt hộp thoại bên trong một khối có animation.
:::

## 5. `sticky`: dính khi cuộn tới

`sticky` cư xử như `relative` cho đến khi cuộn tới ngưỡng (ví dụ `top: 0`), sau đó **dính lại** như `fixed`, nhưng chỉ trong phạm vi phần tử cha.

```html live height=280
<header class="dau">Header dính ở đỉnh</header>
<section>
  <h3 class="muc">Mục A</h3>
  <p>Nội dung mục A...</p><p>...</p><p>...</p><p>...</p>
</section>
<section>
  <h3 class="muc">Mục B</h3>
  <p>Nội dung mục B...</p><p>...</p><p>...</p><p>...</p>
</section>

<style>
  body { margin: 0; font-family: system-ui, sans-serif; }
  .dau { position: sticky; top: 0; z-index: 1; padding: 10px 14px; background: #1c1917; color: white; }
  .muc { position: sticky; top: 40px; margin: 0; padding: 6px 14px; background: #fde68a; }
  section p { margin: 0; padding: 14px; border-bottom: 1px solid #e7e5e4; }
</style>
```

Mỗi tiêu đề mục dính ngay dưới header **cho tới khi mục đó cuộn hết**, rồi nhường chỗ cho tiêu đề mục sau. Ứng dụng: header trang, tiêu đề cột của bảng dài, mục lục bên cạnh bài viết (chính trang này đang dùng sticky cho mục lục bên phải).

Sticky không chạy khi: thiếu `top`/`bottom`; phần tử cha không cao hơn chính nó; hoặc một tổ tiên có `overflow: hidden`/`auto`/`scroll`.

## 6. `z-index` và stacking context

Khi các phần tử chồng lên nhau, phần tử nào nằm trên? Mặc định, phần tử **viết sau** trong HTML nằm trên. `z-index` thay đổi thứ tự đó cho các phần tử **đã được định vị** (khác `static`), và cho các item trong Flexbox/Grid:

```html live
<div class="a">A · z-index 3</div>
<div class="b">B · z-index 1</div>
<div class="c">C · z-index 2</div>

<style>
  body { font-family: system-ui, sans-serif; position: relative; height: 180px; }
  div { position: absolute; width: 150px; height: 90px; padding: 8px; border-radius: 8px; color: white; font-weight: 700; }
  .a { top: 10px; left: 10px; background: #c2410c; z-index: 3; }
  .b { top: 40px; left: 70px; background: #7c3aed; z-index: 1; }
  .c { top: 70px; left: 130px; background: #0f766e; z-index: 2; }
</style>
```

**Stacking context** là một "tầng" khép kín: các phần tử con chỉ so `z-index` **với nhau bên trong tầng đó**. Cả tầng được xếp như một khối so với bên ngoài. Một stacking context mới được tạo khi phần tử có:

- `position` khác `static` **và** `z-index` khác `auto`; hoặc `position: fixed`/`sticky`;
- `opacity` nhỏ hơn 1, `transform`, `filter`, `isolation: isolate`;
- là item flex/grid có `z-index` khác `auto`.

```text
body
├── .header   (position: sticky; z-index: 10)
└── .noi-dung (position: relative; z-index: 1)   ← tầng thấp hơn header
    └── .menu-tha (position: absolute; z-index: 9999)
        → vẫn nằm DƯỚI .header, vì 9999 chỉ có nghĩa bên trong tầng của .noi-dung
```

::: tip Giữ z-index có trật tự
Đừng tăng `z-index` lên 9999 mỗi khi gặp lỗi. Hãy định nghĩa vài mức cố định, ví dụ bằng biến CSS (bài [CSS hiện đại](/css/css-hien-dai)): `--z-dropdown: 10; --z-header: 20; --z-modal: 30; --z-toast: 40;`. Khi có lỗi chồng lớp, hãy tìm xem stacking context nào đang "nhốt" phần tử. `isolation: isolate` tạo một context mới mà không cần `z-index`.
:::

Hộp thoại và popup hiện đại còn có thể dùng **top layer** của trình duyệt (`<dialog>`, popover), luôn nằm trên mọi thứ mà không cần `z-index`. Bạn sẽ gặp chúng ở bài [Web Components & API hiện đại](/nang-cao/web-components).

## Thực hành

**Bài 1.** Làm thẻ sản phẩm có ảnh, huy hiệu "Mới" ở góc **trên trái** và nút "♡" yêu thích hình tròn ở góc **trên phải** ảnh.

::: details Xem lời giải
```html live
<article class="sp">
  <img src="https://picsum.photos/id/1069/280/200" alt="Con sứa màu cam trong làn nước xanh" width="280" height="200">
  <span class="moi">Mới</span>
  <button class="thich" type="button" aria-label="Thêm vào yêu thích">♡</button>
  <h3>Tranh in "Sứa cam"</h3>
</article>

<style>
  body { font-family: system-ui, sans-serif; }
  .sp { position: relative; width: 280px; }
  .sp img { display: block; width: 100%; height: auto; border-radius: 10px; }
  .moi { position: absolute; top: 8px; left: 8px; padding: 2px 8px; border-radius: 6px; background: #16a34a; color: white; font-size: 13px; }
  .thich {
    position: absolute; top: 8px; right: 8px;
    width: 36px; height: 36px; border: 0; border-radius: 50%;
    background: white; font-size: 18px; cursor: pointer;
  }
</style>
```
:::

**Bài 2.** Làm lớp phủ (overlay) toàn màn hình nền đen mờ, ở giữa là hộp thông báo trắng. Lớp phủ phải nằm trên mọi nội dung khác của trang.

::: details Xem lời giải
```html live height=240
<p>Nội dung trang phía sau...</p>
<div class="overlay">
  <div class="hop" role="alertdialog" aria-labelledby="tb">
    <h3 id="tb">Phiên đăng nhập đã hết hạn</h3>
    <button type="button">Đăng nhập lại</button>
  </div>
</div>

<style>
  body { font-family: system-ui, sans-serif; }
  .overlay {
    position: fixed;
    inset: 0;
    z-index: 100;
    display: grid;
    place-items: center;
    background: rgb(0 0 0 / 0.55);
  }
  .hop { padding: 20px 24px; border-radius: 12px; background: white; }
</style>
```
Trong thực tế, nên dùng `<dialog>` có sẵn: trình duyệt tự xử lý lớp phủ, giữ focus trong hộp và đóng bằng phím Esc.
:::

**Bài 3.** Bảng dài có hàng tiêu đề luôn dính ở đỉnh khi cuộn bên trong khung cao 200px.

::: details Xem lời giải
```html live
<div class="cuon">
  <table>
    <thead><tr><th>STT</th><th>Tên</th><th>Điểm</th></tr></thead>
    <tbody>
      <tr><td>1</td><td>An</td><td>9</td></tr><tr><td>2</td><td>Bình</td><td>8</td></tr>
      <tr><td>3</td><td>Chi</td><td>7</td></tr><tr><td>4</td><td>Dũng</td><td>9</td></tr>
      <tr><td>5</td><td>Giang</td><td>8</td></tr><tr><td>6</td><td>Hà</td><td>10</td></tr>
      <tr><td>7</td><td>Khoa</td><td>7</td></tr><tr><td>8</td><td>Lan</td><td>9</td></tr>
    </tbody>
  </table>
</div>

<style>
  body { font-family: system-ui, sans-serif; }
  .cuon { height: 200px; overflow: auto; border: 1px solid #d4d4d8; }
  table { width: 100%; border-collapse: collapse; }
  th, td { padding: 8px 12px; text-align: left; border-bottom: 1px solid #e4e4e7; }
  thead th { position: sticky; top: 0; background: #f4f4f5; }
</style>
```
Ở đây `.cuon` có `overflow: auto` nên nó chính là vùng cuộn mà tiêu đề dính vào. Điều này là chủ ý, khác với lỗi "tổ tiên có overflow" ở mục 5.
:::

## Lỗi thường gặp

- **Con `absolute` "bay" ra góc trang** vì quên `position: relative` ở khung cha.
- **Dùng `absolute` để dàn trang** → các phần tử không còn đẩy nhau, đổi nội dung hay màn hình là chồng chéo. Bố cục dùng Flexbox/Grid; `absolute` chỉ cho chi tiết trang trí, lớp phủ.
- **Sticky không dính** vì thiếu `top`, cha quá thấp, hoặc tổ tiên có `overflow`.
- **Leo thang `z-index`** thay vì tìm stacking context gây ra lỗi.
- **Phần tử `fixed` che mất nội dung** trên màn hình nhỏ.

## Tóm tắt

- `relative`: dịch so với chính nó, giữ chỗ cũ; thường dùng làm mốc cho con `absolute`.
- `absolute`: gỡ khỏi dòng chảy, định vị theo tổ tiên gần nhất có `position` khác `static`.
- `fixed`: theo cửa sổ, đứng yên khi cuộn. `sticky`: dính khi cuộn tới ngưỡng, trong phạm vi cha.
- `inset: 0` = `top/right/bottom/left: 0`.
- `z-index` chỉ so sánh trong cùng một stacking context; context mới được tạo bởi `z-index` + position, `opacity`, `transform`, `isolation`...

## Kiểm tra kiến thức

<Quiz />
