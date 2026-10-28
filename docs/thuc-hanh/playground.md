---
title: Code Playground
description: Viết HTML, CSS và JavaScript rồi xem kết quả ngay trong trình duyệt. 17 bài tập được chấm tự động, có gợi ý và lời giải, chia sẻ code bằng một đường link.
layout: page
sidebar: false
---

<ClientOnly>
  <CodePlayground />
</ClientOnly>

<div class="vp-doc pg-notes">

## Playground hoạt động thế nào?

- Code của bạn chạy trong một **iframe sandbox**, tức một khung trang tách biệt không có quyền gì với trang WebBasic. Vì vậy mở link chia sẻ của người khác cũng an toàn.
- **Tự chạy** sẽ chạy lại code khoảng 0,8 giây sau khi bạn ngừng gõ. Tắt nó đi nếu code nặng, rồi bấm **▶ Chạy** hoặc `Ctrl` + `Enter` khi cần.
- **Console** hiện mọi thứ `console.log()` in ra cùng các lỗi chưa được bắt, kèm vị trí kiểu *JS · dòng 3*. Cách hiển thị giống console trong DevTools: chuỗi trong mảng/object có nháy đơn, object hiện dạng `{ten: 'Lan', tuoi: 20}`.
- Tab **JS** chạy như một thẻ `<script>` thường đặt cuối `<body>`, nên lúc code chạy HTML đã có sẵn. Muốn dùng `import`, hãy viết `<script type="module">` trong tab HTML.
- `localStorage` và `sessionStorage` được **giả lập**: dữ liệu vẫn còn sau mỗi lần chạy lại (giống tải lại trang), cho tới khi bạn bấm **Làm lại từ đầu**.
- Vòng lặp chạy liền quá 2 giây ở tab JS sẽ bị dừng và báo lỗi, để một vòng lặp vô hạn không làm treo trang.

## Bài tập tự chấm được chấm thế nào?

Mỗi lần chạy, Playground chạy code của bạn thêm một lần nữa trong một iframe ẩn, rồi kiểm tra từng yêu cầu: đếm thẻ HTML, đọc style đã tính (`getComputedStyle`), bấm thử nút, gửi thử form, đổi bề rộng khung để thử media query... Vì vậy những gì bạn thấy ở phần *Kết quả* không bị trình chấm làm thay đổi.

Code của từng bài tập, bài đã xong và trạng thái được lưu trong trình duyệt này. **Chia sẻ** tạo một đường link chứa toàn bộ code (nằm sau dấu `#`, không gửi lên server nào). **Tải tệp .html** ghép ba tab thành một tệp chạy được ngay khi mở bằng trình duyệt.

Học lý thuyết đi kèm: [Trang HTML đầu tiên](/html/trang-html-dau-tien) · [Nhập môn CSS](/css/nhap-mon-css) · [Flexbox](/css/flexbox) · [Grid](/css/grid) · [DOM](/javascript/dom) · [Sự kiện](/javascript/su-kien).

</div>
