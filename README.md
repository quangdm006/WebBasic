# WebBasic — tự học HTML, CSS & JavaScript bằng tiếng Việt

Website tự học làm web từ cơ bản đến nâng cao, xây bằng [VitePress](https://vitepress.dev). Mọi ví dụ chạy được ngay trong trang.

- **35 bài học** theo lộ trình: HTML (7) → CSS (10) → JavaScript (9) → Nâng cao (9) → Dự án cuối khóa.
- Mỗi bài có mục tiêu, giải thích, sơ đồ (Mermaid), **ví dụ chạy trực tiếp** (khung *Kết quả* cho HTML/CSS, nút **▶ Chạy** cho JavaScript), bài tập có lời giải, lỗi thường gặp và **quiz** có giải thích.
- **Code Playground**: trình soạn HTML/CSS/JS (CodeMirror) với kết quả, console, **17 bài tập tự chấm**, chia sẻ code bằng link, tải về tệp `.html`.
- **Theo dõi tiến độ**: đánh dấu hoàn thành, dấu ✓ trên sidebar, điểm quiz tốt nhất. Lưu trong `localStorage`, không cần đăng nhập.
- **Dự án cuối khóa** "Sổ chi tiêu": đề bài theo mốc, bản chạy thử và lời giải đầy đủ (JavaScript module, có kiểm thử Vitest).
- Trang tham khảo: cheat sheet, thuật ngữ, tài nguyên học tiếp. Tìm kiếm toàn văn, gõ không dấu vẫn tìm được.

## Chạy trên máy

Yêu cầu Node.js 18+ (khuyến nghị 20 hoặc 22).

```bash
npm install
npm run dev        # http://localhost:5173
npm run build      # build ra docs/.vitepress/dist
npm run preview    # xem bản build: http://localhost:4173
```

## Cấu trúc

```text
docs/
├── index.md, gioi-thieu.md          Trang chủ, giới thiệu & lộ trình
├── html/ css/ javascript/ nang-cao/ Bài học (Markdown)
├── thuc-hanh/                       Dự án cuối khóa, Code Playground
├── tham-khao/                       Cheat sheet, thuật ngữ, tài nguyên
├── public/
│   ├── logo.svg
│   └── du-an-mau/                   Lời giải dự án cuối khóa (bản chạy thử /du-an-mau/)
└── .vitepress/
    ├── config.mts                   Cấu hình site, nav, sidebar (sinh từ curriculum.ts)
    ├── markdown.ts                  Plugin: ```mermaid, ```html live, ```js run, checklist
    └── theme/
        ├── curriculum.ts            DANH MỤC BÀI HỌC — nguồn dữ liệu duy nhất
        ├── composables/progress.ts  Tiến độ & điểm quiz (localStorage)
        ├── components/              Quiz, Mermaid, Roadmap, LessonHeader, LessonComplete,
        │                            SidebarProgress, LiveDemo, CodePlayground
        ├── sandbox/                 Chạy code trong iframe sandbox: runtime, Sandbox, link chia sẻ
        └── playground/              CodeMirror, chặn vòng lặp vô hạn, 17 bài tập tự chấm
deploy/nginx.conf                    Cấu hình nginx cho bản Docker
```

## Thêm hoặc sửa bài học

1. Tạo `docs/<phần>/<slug>.md`, ví dụ `docs/css/scroll-snap.md`.
2. Khai báo trong `docs/.vitepress/theme/curriculum.ts` (tiêu đề, thời lượng). Sidebar, số thứ tự bài, nút "Đánh dấu hoàn thành" và lộ trình tự cập nhật.
3. Thêm quiz vào frontmatter và đặt `<Quiz />` ở cuối bài:

```yaml
---
title: Scroll snap
quiz:
  - q: "Câu hỏi (hỗ trợ `code` và **đậm**)?"
    options: ["Đáp án A", "Đáp án B", "Đáp án C"]
    answer: 1            # chỉ số đáp án đúng, bắt đầu từ 0
    explain: "Giải thích hiện ra sau khi chọn."
---
```

Cú pháp hữu ích trong bài:

````md
```html live
<button>Ví dụ HTML/CSS/JS chạy ngay, có khung Kết quả</button>
<style> button { color: red; } </style>
```

```js run
console.log('Ví dụ JavaScript có nút ▶ Chạy và ô Console');
```
````

- Thêm `height=320` (```` ```html live height=320 ````) để cố định chiều cao khung kết quả, ví dụ khi cần cuộn bên trong.
- Sơ đồ: khối ```` ```mermaid ````; hộp ghi chú `::: tip | info | warning | danger | details`; checklist `- [ ]`.
- Thẻ HTML trong văn bản luôn đặt trong backtick (`` `<p>` ``), nếu không sẽ bị hiểu là HTML thật.

## Triển khai

**GitHub Pages:** đẩy repo lên GitHub, vào *Settings → Pages → Source: GitHub Actions*. Workflow `.github/workflows/deploy-pages.yml` tự build với `BASE_PATH=/<tên-repo>/`.

**Docker:**

```bash
docker build -t web-basic:1.0.0 .
docker run --rm -p 8080:8080 web-basic:1.0.0          # http://localhost:8080
```

Nếu site chạy trong thư mục con (ví dụ `https://example.com/web/`), build với `BASE_PATH=/web/` (`docker build --build-arg BASE_PATH=/web/ ...`).

## Ghi chú

- Ví dụ trong bài và Playground chạy trong `<iframe sandbox>` không có origin riêng: code chạy thử không đọc được localStorage, cookie hay DOM của site. `localStorage` bên trong được giả lập.
- Một số ví dụ dùng API công khai (JSONPlaceholder, Open-Meteo) và ảnh từ Picsum, nên cần Internet.
