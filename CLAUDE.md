# WebBasic — tóm tắt dự án để phát triển tiếp

> Cập nhật lần cuối: 28/10/2026. File này gom những gì cần biết để phát triển tiếp: mục tiêu, cách chạy, kiến trúc, quy ước viết bài, cách kiểm tra, trạng thái và việc còn mở. Claude Code tự đọc file này mỗi khi mở dự án. Khi thay đổi kiến trúc, quy ước hoặc trạng thái, hãy cập nhật file này. [README.md](README.md) là bản giới thiệu ngắn cho người dùng.

## 1. Dự án là gì

- Website **tĩnh** tự học HTML, CSS, JavaScript bằng **tiếng Việt**, từ cơ bản đến nâng cao, xây bằng VitePress. Không có backend, không đăng nhập: tiến độ, điểm quiz và trạng thái Playground lưu trong `localStorage`.
- Kiến trúc site (curriculum, tiến độ, quiz, sơ đồ) lấy từ dự án anh em **K8sLearn** (`../K8sLearn`). Phần riêng của WebBasic: ví dụ chạy trực tiếp trong bài (`LiveDemo`) và **Code Playground** thay cho kubectl Playground.
- Người học: người mới bắt đầu, sinh viên, lập trình viên back-end muốn học front-end. Nội dung bám chuẩn web hiện hành (HTML Living Standard, CSS, ECMAScript 2025) và chỉ dùng tính năng Baseline; tính năng mới hơn được ghi chú riêng.
- Quy mô:
  - 35 bài (HTML 7 · CSS 10 · JavaScript 9 · Nâng cao 9) + Dự án cuối khóa = 36 mục trong lộ trình, ước tính 1.275 phút (~21 giờ).
  - 184 câu quiz trong 36 bài.
  - 140 khối ```` ```html live ````, 129 khối ```` ```js run ````, 19 sơ đồ Mermaid, 42 trang Markdown.
  - Code Playground với 17 bài tập tự chấm.

## 2. Chạy và build

| Lệnh | Tác dụng |
| --- | --- |
| `npm install` | Cài thư viện. Cần Node ≥ 18 (máy dev dùng Node 20, Docker và CI dùng Node 22) |
| `npm run dev` | Server phát triển tại http://localhost:5173 |
| `npm run build` | Build ra `docs/.vitepress/dist` (~45 giây). Build phải sạch: không lỗi, không cảnh báo |
| `npm run preview` | Xem bản build tại http://localhost:4173 |

- Thư mục con: build với `BASE_PATH=/ten/`.
- `npm run preview` chỉ quét `dist` lúc khởi động: build lại thì chạy lại preview.

## 3. Triển khai

- **GitHub Pages**: [deploy-pages.yml](.github/workflows/deploy-pages.yml) build với `BASE_PATH=/<tên-repo>/` mỗi lần push vào `main`. Cần bật *Settings → Pages → Source: GitHub Actions*.
- **Docker**: [Dockerfile](Dockerfile) build bằng `node:22-alpine`, phục vụ bằng `nginxinc/nginx-unprivileged:1.30-alpine` ở cổng 8080. [deploy/nginx.conf](deploy/nginx.conf) xử lý `cleanUrls` (`try_files $uri $uri.html $uri/`, `$uri/` cần cho `/du-an-mau/`), cache dài cho `/assets/`, endpoint `/healthz`.

## 4. Công nghệ

- **VitePress 1.6.4** (Vue 3.5): theme mặc định + slot Layout + component riêng.
- **mermaid ^11.17**: giữ bản 11 vì mermaid 12 đòi Node ≥ 22.12 (giống K8sLearn).
- **CodeMirror 6** (`codemirror`, `@codemirror/*`): trình soạn của Playground. Chỉ trang Playground tải (component async). Được liệt kê trong `vite.optimizeDeps.include` để dev server không nạp hai bản `@codemirror/state`.
- Chưa có bộ test tự động trong repo (xem mục 9).

## 5. Cấu trúc thư mục

```text
docs/
├── index.md, gioi-thieu.md       Trang chủ, giới thiệu & lộ trình (<Roadmap />)
├── html/ css/ javascript/ nang-cao/   Bài học, mỗi bài một tệp .md
├── thuc-hanh/                    du-an-cuoi-khoa.md, playground.md
├── tham-khao/                    cheatsheet.md, thuat-ngu.md, tai-nguyen.md
├── public/
│   ├── logo.svg
│   └── du-an-mau/                Lời giải dự án cuối khóa: index.html, css/, js/ (module + thong-ke.test.js)
└── .vitepress/
    ├── config.mts                Nav, sidebar (từ curriculum.ts), tìm kiếm không dấu, slugify riêng
    ├── markdown.ts               Plugin: mermaid, html live / js run → <LiveDemo>, checklist
    └── theme/
        ├── index.ts, style.css, curriculum.ts
        ├── composables/progress.ts
        ├── components/           LessonHeader, LessonComplete, SidebarProgress, Quiz, Mermaid,
        │                         Roadmap, LiveDemo, CodePlayground
        ├── sandbox/              runtime.ts, sandbox.ts, share.ts (mục 7)
        └── playground/           editor.ts, loopGuard.ts, missions.ts (mục 8)
```

## 6. Kiến trúc site

Phần dùng lại từ K8sLearn (đọc `../K8sLearn/CLAUDE.md` mục 6 để biết chi tiết):

- **[curriculum.ts](docs/.vitepress/theme/curriculum.ts)** là nguồn dữ liệu duy nhất cho sidebar, header bài, nút hoàn thành, lộ trình, tổng số bài. Section id = tên thư mục: `html`, `css`, `javascript`, `nang-cao`, `thuc-hanh`. `nav` trong config.mts và `features` trong `index.md` khai báo tay.
- **Tiến độ** ([progress.ts](docs/.vitepress/theme/composables/progress.ts)): khóa `webbasic:done:v1`, `webbasic:quiz:v1`. Chỉ đọc localStorage sau khi mount (tránh lỗi hydration).
- **Quiz** ([Quiz.vue](docs/.vitepress/theme/components/Quiz.vue)): đáp án xáo cố định theo hạt giống từ nội dung câu hỏi; `fmt()` escape HTML rồi hỗ trợ `code` và **đậm**.
- **Màu**: brand cam (`--vp-c-brand-*`, nút dùng `#c2410c` để đủ tương phản); màu từng phần `--wb-c-html|css|js|adv|proj` (+ `-soft`), dùng ở badge của LessonHeader và tab của Playground.
- **Slugify riêng** trong config.mts: đổi `đ` → `d`, bỏ `—`/`–`. Anchor có dạng `#_3-url-dia-chi-cua-mot-tai-nguyen`. Tiêu đề bắt đầu bằng số thì id có tiền tố `_`. Đổi tiêu đề thì kiểm tra lại link có `#`.

## 7. Chạy code trong sandbox (LiveDemo và Playground)

- **[markdown.ts](docs/.vitepress/markdown.ts)**: ```` ```html live ```` (tuỳ chọn `height=N`) và ```` ```js run ```` được render thành khối code thường + `<LiveDemo kind code height>`; `code` mã hóa bằng `encodeURIComponent`. `html` chỉ đi với `live`, `js` chỉ đi với `run`.
- **[LiveDemo.vue](docs/.vitepress/theme/components/LiveDemo.vue)**: `html` tự chạy khi cuộn tới (IntersectionObserver, nên ví dụ trong `::: details` chỉ chạy khi mở ra) và tự co giãn chiều cao (40–640px); `js` chạy khi bấm, iframe ẩn, chỉ hiện console. Nút "Sửa trong Playground" tạo link `#code=` (HTML ví dụ được tách `<style>`/`<script>` sang tab CSS/JS bởi `splitSnippet`).
- **[sandbox.ts](docs/.vitepress/theme/sandbox/sandbox.ts)**:
  - `buildDocument` ghép HTML/CSS/JS thành `srcdoc`. HTML dạng đoạn được bọc trong khung chuẩn; tài liệu đầy đủ (có doctype/`<html>`) được giữ nguyên, runtime chèn sau `<head>`, CSS/JS nối vào cuối. Runtime gộp thành **một dòng** để `locate()` đổi số dòng lỗi thành "JS · dòng N" / "HTML · dòng N".
  - iframe `sandbox` **không có** `allow-same-origin` (opaque origin): code người học không chạm được localStorage/DOM của site, nên link chia sẻ an toàn. `SANDBOX_ALLOW` cho kết quả, `TEST_SANDBOX_ALLOW` (không modals/popups) cho iframe chấm bài.
  - Mỗi lần chạy dùng token mới; component đổi `:key` để tạo iframe mới (bỏ iframe cũ nếu bị treo).
  - `Sandbox.test()` chạy code trong iframe ẩn, chờ `ready`, gửi `run-tests`, nhận `results`. Phát hiện trang tải lại giữa chừng (form gửi đi khi thiếu `preventDefault`) qua sự kiện `load` hoặc `ready` thứ hai.
- **[runtime.ts](docs/.vitepress/theme/sandbox/runtime.ts)**: chạy trong iframe trước code người học. Chuyển `console.*` (định dạng giống DevTools: `{ten: 'An'}`, `[1, 'b']`, `Map(1) {...}`, bảng cho `console.table`), lỗi chưa bắt, chiều cao; giả lập `localStorage`/`sessionStorage` (dữ liệu giữ giữa các lần chạy qua message `storage`); `__wbLoop()` ném lỗi khi vòng lặp chạy liền > 2 giây; chạy bài kiểm tra với helper `$`, `$$`, `css`, `text`, `sleep`, `resize`, `logs`.
  - **Quy tắc khi sửa runtime**: ES5 thuần, không comment `//`, không template literal hay `${`, luôn có `;`, vì mã được nhúng nguyên văn từ `String.raw` và gộp thành một dòng.
- **[share.ts](docs/.vitepress/theme/sandbox/share.ts)**: `encodeShare`/`decodeShare` (base64url của JSON `[html, css, js]`), `splitSnippet`, `standaloneHtml` (tải tệp .html).
- Ví dụ trong bài chạy như `<script>` thường: không dùng top-level `await` trong ```` ```js run ```` (bọc trong hàm async). `new URL(x, document.baseURI)` thay vì `location.href` (trong iframe là `about:srcdoc`).

## 8. Code Playground

- Trang [playground.md](docs/thuc-hanh/playground.md): `layout: page`, `sidebar: false`, `<ClientOnly><CodePlayground /></ClientOnly>`.
- **[CodePlayground.vue](docs/.vitepress/theme/components/CodePlayground.vue)**: 3 EditorView CodeMirror (HTML/CSS/JS, ẩn hiện bằng `v-show`), iframe kết quả + console, iframe chấm bài ẩn (`position: fixed; opacity: 0`, vẫn "trên màn hình" để timer không bị hãm). Tự chạy sau 800ms ngừng gõ; `Ctrl+Enter`/`Ctrl+S` để chạy. Slot code: `tu-do` (sân chơi tự do), `chia-se` (mở từ link `#code=`, không ghi đè sân chơi tự do), và từng id bài tập.
  - localStorage `webbasic:playground:v1`: `{ active, code, done, storage, autoRun }`. Đổi cấu trúc thì tăng hậu tố khóa.
- **[editor.ts](docs/.vitepress/theme/playground/editor.ts)**: theme lấy biến CSS của VitePress; giao diện tối đổi qua Compartment (`setDark`).
- **[loopGuard.ts](docs/.vitepress/theme/playground/loopGuard.ts)**: dùng parser Lezer của `@codemirror/lang-javascript` chèn `__wbLoop();` vào đầu thân mỗi vòng `for`/`while`/`do` trong tab JS, không thêm dòng. Code có lỗi cú pháp được giữ nguyên. Không áp dụng cho `<script>` trong tab HTML.
- **[missions.ts](docs/.vitepress/theme/playground/missions.ts)**: 17 bài (HTML 5, CSS 7, JavaScript 5). Mỗi bài: `starter`, `solution`, `hint`, `lesson`, `setup?` (JS chạy trước code người học), `tests[]` với `code` là **thân hàm async** chạy trong iframe chấm; trả `true` là đạt, trả chuỗi là thông báo. Các test chạy tuần tự, dùng chung trạng thái trang. Biến `let`/`const` cấp cao nhất của tab JS đọc được trực tiếp.
  - **Thêm bài tập**: thêm phần tử vào `MISSIONS`, rồi kiểm tra: nạp `solution` phải đạt hết, `starter` không được đạt hết (mục 9).

## 9. Quy ước viết bài

**Thêm bài mới:** tạo `docs/<phần>/<slug>.md` (slug không dấu, nối bằng gạch ngang), khai báo trong `curriculum.ts`.

**Khung một bài** (mọi bài đều theo):
1. Frontmatter: `title`, `description`, `quiz` (4–6 câu, chuỗi trong nháy kép, `answer` tính từ 0, câu nào cũng có `explain`). Tiêu đề có dấu `:` thì đặt trong nháy.
2. `::: info Mục tiêu bài học`.
3. Mục `## 1. …`, `## 2. …`: "vì sao" trước "làm thế nào", có ví dụ chạy được.
4. `## Thực hành` với **Bài 1.**, **Bài 2.**…, mỗi bài kèm `::: details Xem lời giải` (lời giải nên là ```` ```html live ```` hoặc ```` ```js run ````).
5. `## Lỗi thường gặp`, `## Tóm tắt`, `## Kiểm tra kiến thức` + `<Quiz />`.

**Văn phong và code:**
- Tiếng Việt có dấu, xưng "bạn". Thuật ngữ giữ tiếng Anh, giải thích lần đầu; bảng ở [Thuật ngữ](docs/tham-khao/thuat-ngu.md).
- JavaScript: nháy đơn, có `;`, thụt lề 2, tên biến tiếng Việt không dấu camelCase (`tongTien`), `const` mặc định. CSS ví dụ thường đặt `font-family: system-ui, sans-serif` vì iframe hiển thị font mặc định của trình duyệt.
- Output trong comment theo định dạng console của runtime (giống DevTools): `// {ten: 'An', diem: 9}`.
- Ảnh minh họa dùng `https://picsum.photos/id/<id>/<w>/<h>`; **alt phải đúng nội dung ảnh** (đã kiểm tra: 1015 vịnh hẹp giữa núi đá, 1039 thác nước trong rừng, 1043 sông dưới vách núi và rừng thông, 1050 vách đá ven biển, 1056 mây phản chiếu trên cánh đồng muối, 1069 sứa màu cam, 64 người đeo kính râm cầm hoa).
- API công khai dùng trong ví dụ (có CORS): `jsonplaceholder.typicode.com`, `api.open-meteo.com`.

**Bẫy kỹ thuật:**
- Thẻ HTML trong văn bản luôn đặt trong backtick; nếu không Vue/markdown hiểu là HTML thật.
- **Không viết `</script>`, `</style>` trong frontmatter** (kể cả trong quiz): VitePress nhúng frontmatter vào thẻ `<script>` của trang, chuỗi này làm build lỗi "Element is missing end tag".
- `{{ }}` trong văn bản bị Vue hiểu là biểu thức.
- Link nội bộ dùng đường dẫn tuyệt đối không đuôi `.md`. Link tới tệp trong `public/` (như `/du-an-mau/`) dùng `withBase` qua `<script setup>` trong markdown để không bị kiểm tra dead link và có base path đúng.
- Nhúng tệp: `<<< @/public/du-an-mau/js/main.js`.
- Ví dụ có `alert`/`confirm` chạy được (sandbox có `allow-modals`); ví dụ dùng clipboard không chạy trong iframe, chỉ để dạng code tĩnh.

## 10. Kiểm tra chất lượng

**Sau mỗi thay đổi:** `npm run build` sạch, rồi `npm run preview` và mở các trang đã sửa (cả giao diện sáng/tối, cả bề rộng điện thoại).

**Các kiểm tra đã chạy (10/2026).** Script nằm ngoài repo, ở thư mục tạm, nên sẽ mất. Nếu cần chạy lại, hãy viết lại vào `scripts/`:
- **Tĩnh**: 184 câu quiz hợp lệ (đủ trường, `answer` trong khoảng, không trùng đáp án, không có `</script>`); 3.009 liên kết nội bộ trong bản build và mọi `#anchor` trỏ đúng id.
- **Hạ tầng (Chrome headless, puppeteer-core)**: LiveDemo chạy và co giãn; console định dạng đúng; lỗi báo đúng "HTML · dòng 4", "JS · dòng 5"; localStorage giả lập giữ dữ liệu qua lần chạy lại; vòng lặp vô hạn bị dừng sau ~2 giây; 17/17 bài tập đạt khi nạp lời giải, và không bài nào đạt hết với code ban đầu.
  Trình chấm phát hiện đúng trường hợp form gửi đi khi thiếu `preventDefault()` và hiện gợi ý.
- **Từng trang (44)**: mở bằng Chrome headless, mở mọi `<details>`, cuộn hết trang và bấm mọi nút ▶ Chạy. 140/140 ví dụ HTML và 129/129 ví dụ JS đều chạy; 19/19 sơ đồ vẽ xong; không có lỗi hydration hay cảnh báo Vue. Lỗi xuất hiện trong ví dụ đều là lỗi **cố ý** để minh họa (`giaban is not defined`, gán lại `const`, đọc thuộc tính của `undefined`, Promise bị reject không bắt, ảnh `anh-khong-ton-tai.jpg`, request 404 và tên miền `.invalid`). Output của các ví dụ JS đã được đối chiếu với chú thích `// kết quả` trong bài.
- **Dự án mẫu**: 6/6 kiểm thử Vitest của `thong-ke.js` đạt; luồng dữ liệu mẫu, báo lỗi form, thêm, xóa (focus chuyển sang dòng kế), hoàn tác, tìm không dấu, lọc, đổi giao diện, tải lại trang đều đúng, không lỗi console, không tràn ngang ở 390px.
- **Giao diện**: chụp màn hình trang chủ, bài học ở bề rộng điện thoại, bài học và Playground ở chế độ tối.

## 11. Trạng thái và việc còn mở (28/10/2026)

**Đã xong:**
- 35 bài + dự án cuối khóa, 3 trang tham khảo, Code Playground 17 bài tập, theo dõi tiến độ, tìm kiếm không dấu, giao diện tối, mobile.
- Tệp triển khai GitHub Pages và Docker. Repo **chưa** khởi tạo Git.

**Việc nên làm tiếp**, theo thứ tự ưu tiên:
1. Khởi tạo Git, đẩy lên GitHub, bật GitHub Pages và kiểm tra lần deploy đầu (base path `/WebBasic/`).
2. Nhờ người có kinh nghiệm front-end duyệt nội dung trước khi dùng để dạy chính thức.
3. Đưa các script kiểm tra ở mục 10 vào `scripts/` và chạy trong CI.
4. Kiểm tra trên Safari/iOS và Firefox thật (đã kiểm tra trên Chrome).
5. Ý tưởng mở rộng: thêm bài tập Playground (Grid areas, fetch có mock, class), bài về TypeScript/Git cơ bản, bản tiếng Anh bằng `locales`.
