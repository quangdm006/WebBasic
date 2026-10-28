---
title: Thuật ngữ
description: Bảng giải thích các thuật ngữ tiếng Anh thường gặp khi học HTML, CSS, JavaScript và làm web, kèm liên kết tới bài học liên quan.
---

# Thuật ngữ

Khóa học giữ nguyên nhiều thuật ngữ tiếng Anh vì đó là từ bạn sẽ gặp trong tài liệu, thông báo lỗi và khi làm việc. Bảng dưới đây giải thích ngắn gọn từng thuật ngữ. Dùng ô **Tìm kiếm** (gõ không dấu cũng được) hoặc `Ctrl` + `F`.

## Web và trình duyệt

| Thuật ngữ | Giải thích | Bài |
| --- | --- | --- |
| Browser | Trình duyệt: phần mềm tải và hiển thị trang web (Chrome, Edge, Firefox, Safari) | [Web hoạt động thế nào?](/html/web-hoat-dong-the-nao) |
| Client / Server | Máy khách (trình duyệt) gửi yêu cầu; máy chủ trả lời | [Web hoạt động thế nào?](/html/web-hoat-dong-the-nao) |
| URL | Địa chỉ của một tài nguyên: scheme, host, path, query, fragment | [Web hoạt động thế nào?](/html/web-hoat-dong-the-nao#_3-url-dia-chi-cua-mot-tai-nguyen) |
| DNS | Hệ thống đổi tên miền thành địa chỉ IP | [Web hoạt động thế nào?](/html/web-hoat-dong-the-nao) |
| HTTP / HTTPS | Giao thức trao đổi giữa trình duyệt và server; HTTPS có mã hóa | [Web hoạt động thế nào?](/html/web-hoat-dong-the-nao#_4-http-cuoc-hoi-thoai-giua-trinh-duyet-va-server) |
| Request / Response | Yêu cầu và phản hồi HTTP | [Gọi API](/nang-cao/fetch-api) |
| Status code | Mã trạng thái: 200 thành công, 404 không tìm thấy, 500 lỗi server... | [Web hoạt động thế nào?](/html/web-hoat-dong-the-nao) |
| DevTools | Bộ công cụ cho lập trình viên trong trình duyệt (`F12`) | [Web hoạt động thế nào?](/html/web-hoat-dong-the-nao#_7-xem-hau-truong-voi-devtools) |
| Render | Quá trình trình duyệt dựng và vẽ trang lên màn hình | [Hiệu năng](/nang-cao/hieu-nang) |
| Viewport | Vùng hiển thị trang của trình duyệt (cửa sổ, màn hình điện thoại) | [Responsive](/css/responsive) |

## HTML

| Thuật ngữ | Giải thích | Bài |
| --- | --- | --- |
| Element | Phần tử: thẻ mở + nội dung + thẻ đóng | [Trang HTML đầu tiên](/html/trang-html-dau-tien) |
| Tag | Thẻ, ví dụ `<p>`, `</p>` | [Trang HTML đầu tiên](/html/trang-html-dau-tien) |
| Attribute | Thuộc tính của thẻ, dạng `ten="gia-tri"` | [Trang HTML đầu tiên](/html/trang-html-dau-tien) |
| Void element | Phần tử rỗng, không có thẻ đóng: `<img>`, `<br>`, `<input>` | [Trang HTML đầu tiên](/html/trang-html-dau-tien) |
| Block / Inline | Phần tử khối (bắt đầu dòng mới) / nội tuyến (nằm trong dòng chữ) | [Trang HTML đầu tiên](/html/trang-html-dau-tien#_4-phan-tu-khoi-va-phan-tu-noi-tuyen) |
| Semantic HTML | HTML ngữ nghĩa: chọn thẻ theo ý nghĩa của nội dung | [HTML ngữ nghĩa](/html/html-ngu-nghia) |
| Landmark | Vùng mốc của trang (`header`, `nav`, `main`, `footer`) mà trình đọc màn hình dùng để điều hướng | [HTML ngữ nghĩa](/html/html-ngu-nghia) |
| Entity | Cách viết ký tự đặc biệt: `&lt;`, `&amp;`, `&nbsp;` | [Văn bản](/html/van-ban-lien-ket-hinh-anh#_4-ky-tu-dac-biet-entity) |
| Alt text | Văn bản thay thế của ảnh | [Hình ảnh](/html/van-ban-lien-ket-hinh-anh#_7-hinh-anh-voi-img) |
| Form validation | Kiểm tra dữ liệu form (`required`, `pattern`...) | [Form](/html/form) |
| SEO | Tối ưu để trang dễ được tìm thấy trên công cụ tìm kiếm | [Thẻ head & SEO](/html/head-media) |
| Open Graph | Thẻ `og:*` quyết định khung xem trước khi chia sẻ link | [Thẻ head & SEO](/html/head-media) |
| Lazy loading | Tải trễ: chỉ tải ảnh/iframe khi sắp cuộn tới | [Thẻ head & SEO](/html/head-media) |

## CSS

| Thuật ngữ | Giải thích | Bài |
| --- | --- | --- |
| Selector | Phần chọn phần tử để áp dụng kiểu | [Nhập môn CSS](/css/nhap-mon-css) |
| Declaration | Khai báo `thuộc-tính: giá-trị;` | [Nhập môn CSS](/css/nhap-mon-css) |
| Cascade | Cơ chế quyết định rule nào thắng khi nhiều rule cùng nhắm một phần tử | [Selector & cascade](/css/selector-cascade) |
| Specificity | Độ ưu tiên của selector, tính theo (id, class, thẻ) | [Selector & cascade](/css/selector-cascade#_6-do-uu-tien-specificity) |
| Inheritance | Kế thừa: thuộc tính chữ truyền từ cha xuống con | [Nhập môn CSS](/css/nhap-mon-css#_5-ke-thua) |
| Pseudo-class / Pseudo-element | `:hover` (trạng thái) / `::before` (phần tử ảo) | [Selector & cascade](/css/selector-cascade) |
| Box model | Mỗi phần tử là hộp: content, padding, border, margin | [Box model](/css/box-model) |
| Margin collapsing | Margin dọc của hai khối liền kề gộp lại | [Box model](/css/box-model) |
| Flexbox | Mô hình bố cục một chiều | [Flexbox](/css/flexbox) |
| Main axis / Cross axis | Trục chính / trục phụ trong Flexbox | [Flexbox](/css/flexbox#_2-truc-chinh-va-truc-phu) |
| Grid | Mô hình bố cục hai chiều (hàng và cột) | [Grid](/css/grid) |
| `fr` | Đơn vị "một phần khoảng trống còn lại" trong Grid | [Grid](/css/grid) |
| Stacking context | "Tầng" khép kín mà `z-index` chỉ so sánh bên trong | [Định vị](/css/position#_6-z-index-va-stacking-context) |
| Responsive | Trang hiển thị tốt ở mọi kích thước màn hình | [Responsive](/css/responsive) |
| Breakpoint | Mốc bề rộng mà bố cục thay đổi | [Responsive](/css/responsive) |
| Media query / Container query | Điều kiện theo màn hình / theo khối chứa | [Responsive](/css/responsive) |
| Mobile-first | Viết CSS cho màn hình nhỏ trước, bổ sung cho màn hình lớn | [Responsive](/css/responsive#_4-mobile-first) |
| Transition / Animation | Chuyển động giữa hai trạng thái / chuyển động nhiều bước | [Animation](/css/transition-animation) |
| Easing | Hàm thời gian của chuyển động (`ease-out`...) | [Animation](/css/transition-animation) |
| Custom property | Biến CSS `--ten` | [CSS hiện đại](/css/css-hien-dai) |
| Nesting | Viết rule lồng nhau trong CSS | [CSS hiện đại](/css/css-hien-dai) |
| Design token | Giá trị thiết kế cơ bản (màu, khoảng cách) đặt thành biến | [CSS hiện đại](/css/css-hien-dai) |
| BEM | Quy ước đặt tên class Block\_\_Element--Modifier | [CSS hiện đại](/css/css-hien-dai#_6-dat-ten-class-bem) |

## JavaScript

| Thuật ngữ | Giải thích | Bài |
| --- | --- | --- |
| ECMAScript | Tên chuẩn chính thức của JavaScript (ES2015, ES2025...) | [JavaScript là gì?](/javascript/gioi-thieu-js) |
| Console | Nơi in log và thử code trong DevTools | [JavaScript là gì?](/javascript/gioi-thieu-js) |
| Variable | Biến (`let`, `const`) | [Biến & kiểu dữ liệu](/javascript/bien-kieu-du-lieu) |
| Primitive | Kiểu nguyên thủy: number, string, boolean, null, undefined, bigint, symbol | [Biến & kiểu dữ liệu](/javascript/bien-kieu-du-lieu) |
| Template literal | Chuỗi trong dấu backtick, chèn giá trị bằng `${...}` | [Biến & kiểu dữ liệu](/javascript/bien-kieu-du-lieu) |
| Coercion | Chuyển kiểu ngầm định | [Biến & kiểu dữ liệu](/javascript/bien-kieu-du-lieu#_6-chuyen-doi-kieu) |
| Truthy / Falsy | Giá trị được coi là đúng / sai trong điều kiện | [Điều kiện & vòng lặp](/javascript/dieu-kien-vong-lap#_2-truthy-va-falsy) |
| Function | Hàm | [Hàm](/javascript/ham) |
| Parameter / Argument | Tham số (trong định nghĩa) / đối số (khi gọi) | [Hàm](/javascript/ham) |
| Arrow function | Hàm mũi tên `(x) => x * 2` | [Hàm](/javascript/ham) |
| Callback | Hàm được truyền vào hàm khác để được gọi sau | [Hàm](/javascript/ham#_6-ham-la-gia-tri-callback) |
| Pure function | Hàm thuần: cùng đầu vào cho cùng đầu ra, không tác động bên ngoài | [Hàm](/javascript/ham) |
| Array / Object | Mảng (danh sách có thứ tự) / object (cặp khóa–giá trị) | [Mảng](/javascript/mang), [Object](/javascript/object-json) |
| Mutate | Sửa trực tiếp dữ liệu gốc (ví dụ `push`, `sort`) | [Mảng](/javascript/mang#_3-sua-goc-hay-tra-ve-mang-moi) |
| Destructuring | Lấy phần tử/thuộc tính ra biến: `const { a } = obj` | [Object](/javascript/object-json) |
| Spread / Rest | Dấu `...` trải ra / gom lại | [Mảng](/javascript/mang), [Hàm](/javascript/ham) |
| Reference | Tham chiếu: biến trỏ tới cùng một object/mảng | [Object](/javascript/object-json) |
| Shallow / Deep copy | Sao chép nông (một cấp) / sâu (mọi cấp) | [Object](/javascript/object-json) |
| JSON | Định dạng văn bản trao đổi dữ liệu | [Object & JSON](/javascript/object-json#_7-json) |
| Regex | Biểu thức chính quy | [Chuỗi](/javascript/chuoi-so-ngay#_3-bieu-thuc-chinh-quy-regex-co-ban) |
| DOM | Cây đối tượng trình duyệt dựng từ HTML | [DOM](/javascript/dom) |
| Node | Một nút trong cây DOM (phần tử, chữ...) | [DOM](/javascript/dom) |
| Event / Listener | Sự kiện / hàm lắng nghe sự kiện | [Sự kiện](/javascript/su-kien) |
| Bubbling | Sự kiện "nổi bọt" lên các phần tử cha | [Sự kiện](/javascript/su-kien#_5-noi-bot-va-uy-quyen-su-kien) |
| Event delegation | Ủy quyền sự kiện: một listener ở cha xử lý cho các con | [Sự kiện](/javascript/su-kien#_5-noi-bot-va-uy-quyen-su-kien) |
| Scope | Phạm vi nhìn thấy của biến | [Scope & closure](/nang-cao/scope-closure) |
| Hoisting | "Nâng" khai báo lên đầu phạm vi | [Scope & closure](/nang-cao/scope-closure#_2-var-let-const-va-hoisting) |
| TDZ | Vùng chết tạm thời của `let`/`const` trước dòng khai báo | [Scope & closure](/nang-cao/scope-closure) |
| Closure | Hàm cùng phạm vi nơi nó được tạo ra | [Scope & closure](/nang-cao/scope-closure#_3-closure) |
| `this` | Object "sở hữu" lời gọi hàm | [this & class](/nang-cao/class-prototype) |
| Prototype | Object mà một object khác kế thừa thuộc tính từ đó | [this & class](/nang-cao/class-prototype#_4-prototype-ke-thua-kieu-javascript) |
| Class / Instance | Bản thiết kế / object được tạo từ nó bằng `new` | [this & class](/nang-cao/class-prototype) |
| Asynchronous | Bất đồng bộ: việc chờ được giao cho trình duyệt, kết quả về sau | [Bất đồng bộ](/nang-cao/bat-dong-bo) |
| Event loop | Vòng lặp điều phối code đồng bộ, microtask, macrotask | [Bất đồng bộ](/nang-cao/bat-dong-bo#_2-event-loop) |
| Promise | Object đại diện cho kết quả sẽ có trong tương lai | [Bất đồng bộ](/nang-cao/bat-dong-bo#_4-promise) |
| async / await | Cú pháp viết code bất đồng bộ như đồng bộ | [Bất đồng bộ](/nang-cao/bat-dong-bo#_5-async-await) |
| API | Giao diện để chương trình này dùng chương trình khác; Web API trả JSON qua HTTP | [Gọi API](/nang-cao/fetch-api) |
| REST | Phong cách thiết kế API: URL là tài nguyên, phương thức HTTP là hành động | [Gọi API](/nang-cao/fetch-api) |
| CORS | Cơ chế server cho phép trang ở tên miền khác đọc phản hồi | [Gọi API](/nang-cao/fetch-api#_8-cors) |
| Module | Tệp JS có phạm vi riêng, dùng `import`/`export` | [Module](/nang-cao/module-cong-cu) |
| npm / package | Trình quản lý gói / một gói thư viện | [Module](/nang-cao/module-cong-cu#_3-node-js-va-npm) |
| Bundler / Build | Công cụ gộp, nén code (Vite) / quá trình tạo bản phát hành | [Module](/nang-cao/module-cong-cu) |
| Linter / Formatter | Công cụ bắt lỗi (ESLint) / định dạng code (Prettier) | [Module](/nang-cao/module-cong-cu) |
| Unit test | Kiểm thử tự động cho từng hàm nhỏ | [Module](/nang-cao/module-cong-cu#_7-kiem-thu-dau-tien-voi-vitest) |
| Stack trace | Danh sách lời gọi hàm tại thời điểm lỗi | [Xử lý lỗi](/nang-cao/xu-ly-loi-debug#_2-doc-stack-trace) |
| Breakpoint | Điểm dừng để xem trạng thái chương trình khi debug | [Xử lý lỗi](/nang-cao/xu-ly-loi-debug#_8-breakpoint-trong-devtools) |
| Debounce / Throttle | Hoãn tới khi ngừng / giới hạn tần suất chạy | [Hiệu năng](/nang-cao/hieu-nang#_6-debounce-va-throttle) |
| Core Web Vitals | LCP, INP, CLS: ba chỉ số trải nghiệm tốc độ | [Hiệu năng](/nang-cao/hieu-nang#_2-core-web-vitals) |
| Web Worker | Chạy JavaScript ở luồng riêng | [Hiệu năng](/nang-cao/hieu-nang) |
| Custom element / Shadow DOM | Thẻ HTML tự định nghĩa / cây DOM đóng gói riêng | [Web Components](/nang-cao/web-components) |
| Progressive enhancement | Tăng cường dần: cốt lõi chạy mọi nơi, thêm trải nghiệm nơi hỗ trợ | [Web Components](/nang-cao/web-components#_8-tang-cuong-dan-va-kiem-tra-tinh-nang) |

## Bảo mật và khả năng truy cập

| Thuật ngữ | Giải thích | Bài |
| --- | --- | --- |
| Accessibility (a11y) | Khả năng truy cập: mọi người, kể cả người khuyết tật, đều dùng được | [HTML ngữ nghĩa](/html/html-ngu-nghia), [A11y chuyên sâu](/nang-cao/bao-mat-a11y) |
| Screen reader | Trình đọc màn hình (NVDA, VoiceOver, TalkBack) | [HTML ngữ nghĩa](/html/html-ngu-nghia) |
| WCAG | Bộ tiêu chuẩn quốc tế về khả năng truy cập | [A11y chuyên sâu](/nang-cao/bao-mat-a11y#_6-wcag-va-bon-nguyen-tac-pour) |
| ARIA | Thuộc tính `role`, `aria-*` bổ sung thông tin cho công nghệ hỗ trợ | [A11y chuyên sâu](/nang-cao/bao-mat-a11y#_8-aria-dung-cach) |
| Focus | Phần tử đang nhận bàn phím | [A11y chuyên sâu](/nang-cao/bao-mat-a11y#_7-ban-phim-va-focus) |
| Contrast ratio | Tỉ lệ tương phản chữ/nền, tối thiểu 4,5:1 cho chữ thường | [Chữ & màu](/css/chu-mau-don-vi) |
| XSS | Tấn công chèn mã chạy trên trang của bạn | [Bảo mật](/nang-cao/bao-mat-a11y#_2-xss-cross-site-scripting) |
| CSRF | Tấn công lừa trình duyệt gửi request thay người dùng | [Bảo mật](/nang-cao/bao-mat-a11y) |
| CSP | Content Security Policy: giới hạn nguồn script được phép chạy | [Bảo mật](/nang-cao/bao-mat-a11y#_4-content-security-policy-csp) |
| Sanitize | Làm sạch HTML không đáng tin trước khi hiển thị | [Bảo mật](/nang-cao/bao-mat-a11y) |
| Sandbox | Môi trường cách ly, ví dụ `<iframe sandbox>` | [Thẻ head & media](/html/head-media#_6-nhung-noi-dung-voi-iframe) |
