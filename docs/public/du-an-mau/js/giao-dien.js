// Vẽ giao diện từ dữ liệu. Mọi chữ đến từ người dùng đều đi qua textContent (không innerHTML).
import { BIEU_TUONG, DANH_MUC } from './kho.js';
import { dinhDangNgay, dinhDangTien, tenThang } from './dinh-dang.js';

const $ = (selector) => document.querySelector(selector);

export function veDanhMuc(select, loai) {
  select.replaceChildren(...DANH_MUC[loai].map((ten) => new Option(ten, ten)));
}

export function veTongKet({ thu, chi, soDu }) {
  $('#tong-thu').textContent = dinhDangTien(thu);
  $('#tong-chi').textContent = dinhDangTien(chi);
  $('#so-du').textContent = dinhDangTien(soDu);
}

export function veBieuDo(cacDanhMuc) {
  const lonNhat = Math.max(0, ...cacDanhMuc.map((x) => x.soTien));
  const tong = cacDanhMuc.reduce((t, x) => t + x.soTien, 0);

  $('#bieu-do').replaceChildren(
    ...cacDanhMuc.map(({ danhMuc, soTien }) => {
      const li = document.createElement('li');

      const ten = document.createElement('span');
      ten.textContent = `${BIEU_TUONG[danhMuc] ?? '📦'} ${danhMuc}`;

      const thanh = document.createElement('span');
      thanh.className = 'bieu-do__thanh';
      thanh.setAttribute('aria-hidden', 'true');
      thanh.style.setProperty('--ti-le', `${(soTien / lonNhat) * 100}%`);

      const so = document.createElement('span');
      so.className = 'bieu-do__so';
      so.textContent = `${dinhDangTien(soTien)} · ${Math.round((soTien / tong) * 100)}%`;

      li.append(ten, thanh, so);
      return li;
    }),
  );
  $('#bieu-do-trong').hidden = cacDanhMuc.length > 0;
}

export function veDanhSach(ds, { thang, coLoc }) {
  const mau = $('#mau-giao-dich').content.firstElementChild;

  $('#danh-sach').replaceChildren(
    ...ds.map((gd) => {
      const li = mau.cloneNode(true);
      li.dataset.id = gd.id;
      li.classList.add(`giao-dich--${gd.loai}`);
      li.querySelector('.giao-dich__bieu-tuong').textContent = BIEU_TUONG[gd.danhMuc] ?? '📦';
      li.querySelector('.giao-dich__mo-ta').textContent = gd.moTa;
      li.querySelector('.giao-dich__phu').textContent = `${gd.danhMuc} · ${dinhDangNgay(gd.ngay)}`;
      li.querySelector('.giao-dich__so-tien').textContent =
        (gd.loai === 'thu' ? '+' : '−') + dinhDangTien(gd.soTien);
      li.querySelector('.giao-dich__xoa').setAttribute('aria-label', `Xóa giao dịch: ${gd.moTa}`);
      return li;
    }),
  );

  $('#so-giao-dich').textContent = `${ds.length} giao dịch`;
  const trong = $('#danh-sach-trong');
  trong.hidden = ds.length > 0;
  trong.textContent = coLoc
    ? 'Không có giao dịch nào khớp bộ lọc.'
    : `Chưa có giao dịch nào trong ${tenThang(thang)}.`;
}

// ── Thông báo nổi (toast), có nút "Hoàn tác" khi cần ──
let henAn;
let hanhDongHoanTac = null;

function anThongBao() {
  $('#thong-bao').hidden = true;
  hanhDongHoanTac = null;
}

$('#nut-hoan-tac').addEventListener('click', () => {
  const hanhDong = hanhDongHoanTac;
  anThongBao();
  hanhDong?.();
});

export function hienThongBao(noiDung, hoanTac = null) {
  hanhDongHoanTac = hoanTac;
  $('#thong-bao-chu').textContent = noiDung;
  $('#nut-hoan-tac').hidden = !hoanTac;
  $('#thong-bao').hidden = false;
  clearTimeout(henAn);
  henAn = setTimeout(anThongBao, hoanTac ? 6000 : 3000);
}
