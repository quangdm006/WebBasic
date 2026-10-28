---
title: Module, npm & Vite
description: ES module với import và export, named và default export, dynamic import, Node.js và npm, package.json, dependencies, scripts, tạo dự án bằng Vite, biến môi trường, Prettier, ESLint và viết kiểm thử đầu tiên với Vitest.
quiz:
  - q: "Mở trực tiếp tệp `index.html` (đường dẫn `file:///...`) có `<script type=\"module\" src=\"app.js\">`, trình duyệt báo lỗi CORS. Vì sao?"
    options:
      - "Vì module không chạy trên Windows"
      - "Vì module được tải theo quy tắc CORS, mà trang mở từ `file://` không có origin hợp lệ; cần chạy qua một web server (Live Preview, Vite...)"
      - "Vì thiếu `defer`"
      - "Vì tệp phải có đuôi `.mjs`"
    answer: 1
    explain: "Script module luôn được tải như request CORS. Hãy mở trang qua `http://localhost` bằng một server phát triển."
  - q: "`export default function tinhTong() {}` được import thế nào?"
    options:
      - "`import { tinhTong } from './tinh.js'`"
      - "`import tinhTong from './tinh.js'` (tên tùy chọn, không có ngoặc nhọn)"
      - "`import * from './tinh.js'`"
      - "`require('./tinh.js')`"
    answer: 1
    explain: "Default export import không cần ngoặc nhọn và đặt tên tùy ý. Named export (`export function tinhTong`) phải import đúng tên trong ngoặc nhọn."
  - q: "Khác nhau giữa `dependencies` và `devDependencies` trong `package.json`?"
    options:
      - "Không khác gì"
      - "`dependencies` là thư viện ứng dụng cần khi chạy (ví dụ thư viện biểu đồ); `devDependencies` chỉ cần lúc phát triển và build (Vite, ESLint, Vitest)"
      - "`devDependencies` được tải nhanh hơn"
      - "`dependencies` chỉ dành cho Node.js"
    answer: 1
    explain: "Cài công cụ phát triển bằng `npm install -D`. Với ứng dụng front-end được build ra tệp tĩnh, sự phân biệt này chủ yếu giúp người đọc hiểu vai trò của từng gói."
  - q: "Có nên commit thư mục `node_modules` lên Git không?"
    options:
      - "Có, để người khác khỏi phải cài"
      - "Không; commit `package.json` và `package-lock.json`, người khác chạy `npm install` (hoặc `npm ci`) để tải lại đúng phiên bản"
      - "Chỉ commit khi dự án nhỏ"
      - "Chỉ commit trên nhánh main"
    answer: 1
    explain: "`node_modules` rất nặng và phụ thuộc hệ điều hành. Tệp lock ghi chính xác phiên bản của từng gói, đủ để tái tạo `node_modules` giống hệt."
  - q: "Trong dự án Vite, biến `VITE_API_URL` trong tệp `.env` có đặc điểm gì quan trọng?"
    options:
      - "Được giữ bí mật trên server"
      - "Được nhúng thẳng vào mã JavaScript gửi tới trình duyệt, nên ai cũng đọc được; không được đặt bí mật vào đó"
      - "Chỉ dùng được trong CSS"
      - "Bị xóa khi build"
    answer: 1
    explain: "Tiền tố `VITE_` nghĩa là “cho phép lộ ra phía trình duyệt”. Chỉ đặt cấu hình công khai (địa chỉ API, khóa công khai) vào đó."
---

# Module, npm & Vite

::: info Mục tiêu bài học
- Chia code thành **module** với `import`/`export`; phân biệt named và default export; dùng `import()` động.
- Hiểu **Node.js**, **npm** và tệp `package.json`: cài thư viện, chạy script, tệp lock.
- Tạo và build dự án bằng **Vite**; dùng biến môi trường đúng cách.
- Giữ code sạch với **Prettier** và **ESLint**; viết **kiểm thử** đầu tiên với **Vitest**.
:::

## 1. Vì sao cần module?

Một tệp `app.js` dài 3000 dòng thì khó đọc, khó tìm, dễ trùng tên biến. **Module** cho phép chia code thành nhiều tệp nhỏ, mỗi tệp một nhiệm vụ, và chỉ "công khai" những gì cần thiết:

```text
du-an/
├── index.html
└── js/
    ├── app.js          ← điểm bắt đầu
    ├── dinh-dang.js    ← hàm định dạng tiền, ngày
    ├── api.js          ← gọi API
    └── giao-dien.js    ← dựng DOM
```

Mỗi module có **phạm vi riêng**: biến khai báo trong `dinh-dang.js` không lọt ra ngoài, không đụng biến cùng tên ở tệp khác. Module tự động chạy ở **strict mode** và được tải giống `defer`.

## 2. `export` và `import`

```js
// js/dinh-dang.js
const VND = new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' });

export function dinhDangTien(soTien) {          // named export
  return VND.format(soTien);
}

export function dinhDangNgay(ngay) {
  return new Date(ngay).toLocaleDateString('vi-VN');
}

export const PHI_GIAO_HANG = 15000;
```

```js
// js/gio-hang.js
export default class GioHang {                   // default export: "thứ chính" của module
  // ...
}
```

```js
// js/app.js
import { dinhDangTien, PHI_GIAO_HANG } from './dinh-dang.js';   // named: đúng tên, trong { }
import GioHang from './gio-hang.js';                            // default: tên tùy ý, không { }
import { dinhDangNgay as ngayVN } from './dinh-dang.js';        // đổi tên khi import
import * as dinhDang from './dinh-dang.js';                     // gom tất cả vào một object

console.log(dinhDangTien(PHI_GIAO_HANG), ngayVN('2026-10-27'), dinhDang.PHI_GIAO_HANG);
const gio = new GioHang();
```

```html
<!-- index.html: chỉ cần nạp điểm bắt đầu -->
<script type="module" src="js/app.js"></script>
```

- Đường dẫn import trong trình duyệt phải **đầy đủ**, có đuôi `.js` và bắt đầu bằng `./`, `../` hoặc `/`.
- **Named export** (có thể nhiều cái mỗi tệp) dễ tìm kiếm và đổi tên an toàn hơn. Nhiều nhóm chỉ dùng named export cho thống nhất. **Default export** hợp cho tệp chỉ xuất một thứ chính (một class, một component).
- Module chỉ chạy **một lần** dù được import ở nhiều nơi; mọi nơi dùng chung một bản.

::: warning Module không chạy khi mở tệp trực tiếp
Mở `index.html` bằng cách nhấp đúp (địa chỉ `file:///C:/...`), console sẽ báo lỗi CORS. Script module phải được phục vụ qua HTTP: dùng **Live Preview** trong VS Code, hoặc Vite (mục 5).
:::

**Import động** (`import()`) tải module **khi cần**, giúp trang ban đầu nhẹ hơn:

```js
nutXuatBaoCao.addEventListener('click', async () => {
  const { xuatPDF } = await import('./xuat-pdf.js');   // chỉ tải khi người dùng bấm
  xuatPDF(duLieu);
});
```

Chính trang bạn đang đọc làm như vậy: thư viện vẽ sơ đồ và trình soạn code của Playground chỉ được tải ở trang cần dùng.

## 3. Node.js và npm

**Node.js** chạy JavaScript ngoài trình duyệt. Với lập trình viên front-end, nó chủ yếu dùng để chạy **công cụ**: dev server, công cụ build, kiểm tra code, kiểm thử. Tải bản **LTS** (hỗ trợ dài hạn) tại [nodejs.org](https://nodejs.org), rồi kiểm tra trong terminal:

```bash
node --version
npm --version
```

**npm** là trình quản lý gói đi kèm Node.js, cũng là kho thư viện JavaScript lớn nhất thế giới. Mỗi dự án có tệp **`package.json`** mô tả dự án:

```json
{
  "name": "so-chi-tieu",
  "version": "1.0.0",
  "private": true,
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview",
    "test": "vitest",
    "lint": "eslint ."
  },
  "dependencies": {
    "chart.js": "^4.6.1"
  },
  "devDependencies": {
    "eslint": "^10.13.0",
    "vite": "^8.3.5",
    "vitest": "^5.0.5"
  }
}
```

| Lệnh | Tác dụng |
| --- | --- |
| `npm init -y` | Tạo `package.json` mới |
| `npm install chart.js` | Cài thư viện vào `dependencies` |
| `npm install -D vite` | Cài công cụ phát triển vào `devDependencies` |
| `npm install` | Cài mọi gói đã khai báo (sau khi clone dự án) |
| `npm ci` | Cài **đúng** phiên bản trong tệp lock (dùng cho CI, build server) |
| `npm run dev` | Chạy script tên `dev` |
| `npx <công-cụ>` | Chạy công cụ mà không cần cài vào dự án |

- **`node_modules/`** chứa mã của các gói đã cài. Rất nặng, **không commit** lên Git (thêm vào `.gitignore`).
- **`package-lock.json`** ghi lại phiên bản chính xác của mọi gói (kể cả gói con). **Có commit**, để mọi người và server build cài giống hệt nhau.
- **Phiên bản ngữ nghĩa** (semver) `MAJOR.MINOR.PATCH`: `^4.6.1` cho phép cập nhật tới `4.x.x` nhưng không lên `5.0.0`, vì phiên bản major mới có thể thay đổi cách dùng.

::: warning Cẩn thận với gói npm
Mỗi gói bạn cài là code của người khác chạy trên máy bạn và trong sản phẩm của bạn. Trước khi cài, xem số lượt tải, lần cập nhật gần nhất, kho mã nguồn. Gõ đúng tên gói: kẻ xấu hay đăng các gói tên na ná gói nổi tiếng. `npm audit` liệt kê các lỗ hổng đã biết trong gói đã cài.
:::

## 4. Vì sao cần công cụ build?

Với dự án nhỏ, vài tệp module nạp thẳng vào trình duyệt là đủ. Khi dự án lớn dần, **công cụ build** giúp:

- **Gộp và nén** hàng trăm module thành ít tệp nhỏ gọn, tải nhanh hơn.
- Cho phép `import` thư viện từ npm bằng tên (`import Chart from 'chart.js'`), điều trình duyệt không tự hiểu được.
- **Dev server** tự tải lại trang ngay khi bạn lưu tệp, thậm chí giữ nguyên trạng thái (HMR).
- Thêm **mã băm** vào tên tệp (`app.3f9a1c.js`) để trình duyệt lưu đệm lâu mà vẫn nhận bản mới khi bạn cập nhật.
- Hỗ trợ TypeScript, xử lý CSS, tối ưu ảnh...

**Vite** (tiếng Pháp nghĩa là "nhanh") là công cụ build phổ biến nhất hiện nay, được Vue, Svelte và nhiều framework khác dùng làm nền. Chính website này cũng được build bằng Vite (qua VitePress).

## 5. Tạo dự án với Vite

```bash
npm create vite@latest so-chi-tieu -- --template vanilla
cd so-chi-tieu
npm install
npm run dev
```

Lệnh trên tạo dự án JavaScript thuần (template `vanilla`, không framework). Mở địa chỉ hiện ra trong terminal (thường là `http://localhost:5173`), sửa `src/main.js` rồi lưu: trang cập nhật ngay.

```text
so-chi-tieu/
├── index.html          ← điểm bắt đầu (nằm ở gốc, không phải trong public/)
├── package.json
├── public/             ← tệp tĩnh giữ nguyên tên (favicon, robots.txt)
└── src/
    ├── main.js
    └── style.css
```

```js
// src/main.js — Vite cho phép import cả CSS và tệp tĩnh
import './style.css';
import logoUrl from './logo.svg';           // nhận về URL đã có mã băm
import { dinhDangTien } from './dinh-dang.js';

document.querySelector('#logo').src = logoUrl;
```

Khi xong việc:

```bash
npm run build      # tạo thư mục dist/ chứa trang đã tối ưu, sẵn sàng đưa lên mạng
npm run preview    # chạy thử bản build trên máy
```

Thư mục `dist/` chỉ là HTML, CSS, JS tĩnh: đưa lên GitHub Pages, Netlify, Cloudflare Pages, Vercel hoặc bất kỳ web server nào đều được.

**Biến môi trường.** Tạo tệp `.env`:

```bash
VITE_API_URL=https://api.example.com
```

```js
const url = import.meta.env.VITE_API_URL;
```

Chỉ biến có tiền tố `VITE_` mới đọc được trong code front-end, và chúng được **nhúng thẳng vào tệp JS gửi cho trình duyệt**. Nghĩa là ai cũng đọc được. Đừng bao giờ đặt mật khẩu hay khóa bí mật vào đó ([bài Gọi API](/nang-cao/fetch-api#_6-gui-du-lieu-post-put-delete)).

## 6. Giữ code sạch: Prettier và ESLint

**Prettier** tự định dạng code (thụt lề, dấu nháy, xuống dòng) theo một quy tắc thống nhất. Cả nhóm khỏi phải tranh cãi về cách trình bày:

```bash
npm install -D prettier
npx prettier --write .
```

Trong VS Code, cài tiện ích **Prettier** và bật **Format On Save**.

**ESLint** tìm **lỗi tiềm ẩn**: biến khai báo mà không dùng, dùng biến chưa khai báo, `==` thay vì `===`, `await` trong vòng lặp...

```bash
npm init @eslint/config@latest
npx eslint .
```

Lệnh đầu hỏi vài câu rồi tạo tệp `eslint.config.js`. Tiện ích **ESLint** cho VS Code gạch chân lỗi ngay khi bạn gõ. Hai công cụ này bổ sung cho nhau: Prettier lo **hình thức**, ESLint lo **chất lượng**.

## 7. Kiểm thử đầu tiên với Vitest

**Kiểm thử tự động** (automated test) là code kiểm tra code của bạn. Mỗi khi sửa, chạy lại kiểm thử là biết ngay có làm hỏng chỗ nào không.

```bash
npm install -D vitest
```

```js
// src/tinh-tien.js
export function tinhTien(gia, soLuong) {
  const tong = gia * soLuong;
  return soLuong >= 10 ? tong * 0.9 : tong;
}
```

```js
// src/tinh-tien.test.js
import { describe, expect, it } from 'vitest';
import { tinhTien } from './tinh-tien.js';

describe('tinhTien', () => {
  it('nhân giá với số lượng', () => {
    expect(tinhTien(50000, 2)).toBe(100000);
  });

  it('giảm 10% khi mua từ 10 sản phẩm', () => {
    expect(tinhTien(10000, 10)).toBe(90000);
  });

  it('chưa giảm khi mua 9 sản phẩm', () => {
    expect(tinhTien(20000, 9)).toBe(180000);
  });
});
```

```bash
npx vitest
```

```text
 ✓ src/tinh-tien.test.js (3 tests) 2ms
   ✓ tinhTien > nhân giá với số lượng
   ✓ tinhTien > giảm 10% khi mua từ 10 sản phẩm
   ✓ tinhTien > chưa giảm khi mua 9 sản phẩm

 Test Files  1 passed (1)
      Tests  3 passed (3)
```

Bắt đầu kiểm thử từ các **hàm thuần** (tính toán, định dạng, lọc dữ liệu): dễ viết nhất và đáng giá nhất. Trình chấm của Code Playground thực chất cũng là một bộ kiểm thử tự động. Kiểm thử giao diện trong trình duyệt thật (bấm nút, điền form) dùng công cụ như **Playwright**.

## 8. Đi tiếp từ đây

- **TypeScript**: JavaScript có thêm kiểu dữ liệu, bắt được rất nhiều lỗi ngay khi gõ. Vite hỗ trợ sẵn (template `vanilla-ts`).
- **Git** và **GitHub**: quản lý phiên bản code, làm việc nhóm. Đây là kỹ năng bắt buộc khi đi làm.
- **Framework**: React, Vue, Svelte, Angular giúp xây giao diện lớn. Khi đã vững JavaScript, học framework nào cũng nhanh. Xem gợi ý ở trang [Tài nguyên học tiếp](/tham-khao/tai-nguyen).

## Thực hành

**Bài 1.** Tách đoạn code sau thành 3 module: `dinh-dang.js` (hàm `dinhDangTien`), `du-lieu.js` (mảng `SAN_PHAM`, default export) và `app.js` (in danh sách). Chạy bằng Live Preview.

```js
const VND = new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' });
const SAN_PHAM = [{ ten: 'Áo', gia: 199000 }, { ten: 'Mũ', gia: 89000 }];
for (const sp of SAN_PHAM) console.log(sp.ten, VND.format(sp.gia));
```

::: details Xem lời giải
```js
// dinh-dang.js
const VND = new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' });
export function dinhDangTien(soTien) {
  return VND.format(soTien);
}
```

```js
// du-lieu.js
const SAN_PHAM = [{ ten: 'Áo', gia: 199000 }, { ten: 'Mũ', gia: 89000 }];
export default SAN_PHAM;
```

```js
// app.js
import { dinhDangTien } from './dinh-dang.js';
import sanPham from './du-lieu.js';

for (const sp of sanPham) console.log(sp.ten, dinhDangTien(sp.gia));
```

```html
<!-- index.html -->
<script type="module" src="app.js"></script>
```
Biến `VND` nằm trong phạm vi riêng của `dinh-dang.js`, không bị lộ ra `app.js`.
:::

**Bài 2.** Tạo dự án Vite `vanilla`, cài `vitest`, viết hàm `boDau(chuoi)` (bỏ dấu tiếng Việt, xem [bài Chuỗi](/javascript/chuoi-so-ngay)) và 3 kiểm thử cho nó: chữ thường có dấu, chữ `Đ`/`đ`, chuỗi không dấu giữ nguyên.

::: details Xem lời giải
```js
// src/bo-dau.js
export function boDau(chuoi) {
  return chuoi.normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/đ/g, 'd').replace(/Đ/g, 'D');
}
```

```js
// src/bo-dau.test.js
import { expect, it } from 'vitest';
import { boDau } from './bo-dau.js';

it('bỏ dấu chữ thường', () => {
  expect(boDau('tiếng việt')).toBe('tieng viet');
});

it('đổi đ và Đ', () => {
  expect(boDau('Đà Nẵng đẹp')).toBe('Da Nang dep');
});

it('giữ nguyên chuỗi không dấu', () => {
  expect(boDau('hello 123')).toBe('hello 123');
});
```
Thêm `"test": "vitest"` vào `scripts` trong `package.json` rồi chạy `npm test`.
:::

## Lỗi thường gặp

- **Mở tệp có module bằng `file://`** → lỗi CORS. Dùng server phát triển.
- **Thiếu đuôi `.js`** trong đường dẫn import (trình duyệt không tự đoán như Vite hay Node).
- **Nhầm named và default**: `import { GioHang }` khi tệp dùng `export default` (hoặc ngược lại).
- **Commit `node_modules`**, hoặc không commit `package-lock.json`.
- **Đặt bí mật vào `.env` có tiền tố `VITE_`.**
- **Cài thư viện cho việc nhỏ** mà JavaScript có sẵn (định dạng ngày, sao chép sâu, gọi API...).

## Tóm tắt

- Module: mỗi tệp một phạm vi; `export` công khai, `import` sử dụng; nạp bằng `<script type="module">` qua HTTP.
- Named export `import { a }`, default export `import a`; `import()` động để tải khi cần.
- npm + `package.json`: `npm install` (`-D` cho công cụ), `npm run <script>`; commit tệp lock, không commit `node_modules`.
- Vite: `npm create vite@latest`, `npm run dev`, `npm run build` ra `dist/`; biến `VITE_*` là công khai.
- Prettier định dạng, ESLint bắt lỗi, Vitest kiểm thử hàm.

## Kiểm tra kiến thức

<Quiz />
