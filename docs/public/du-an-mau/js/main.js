// Điểm bắt đầu: nối dữ liệu (kho), tính toán (thong-ke) và giao diện (giao-dien) với các sự kiện.
import * as kho from './kho.js';
import { docSoTien, homNay, thangCuaNgay } from './dinh-dang.js';
import { chiTheoDanhMuc, locGiaoDich, locTheoThang, tinhTong } from './thong-ke.js';
import { hienThongBao, veBieuDo, veDanhMuc, veDanhSach, veTongKet } from './giao-dien.js';
import { taoDuLieuMau } from './du-lieu-mau.js';

const form = document.querySelector('#form-giao-dich');
const { moTa: oMoTa, soTien: oSoTien, danhMuc: chonDanhMuc, ngay: oNgay } = form.elements;
const chonThang = document.querySelector('#thang');
const locLoai = document.querySelector('#loc-loai');
const timKiem = document.querySelector('#tim-kiem');
const nutMau = document.querySelector('#nut-mau');

// Trạng thái của giao diện (bộ lọc đang chọn). Dữ liệu giao dịch nằm trong kho.
const boLoc = { thang: thangCuaNgay(homNay()), loai: 'tat-ca', tuKhoa: '' };

function capNhat() {
  const tatCa = kho.layTatCa();
  const trongThang = locTheoThang(tatCa, boLoc.thang);
  veTongKet(tinhTong(trongThang));
  veBieuDo(chiTheoDanhMuc(trongThang));
  veDanhSach(locGiaoDich(trongThang, boLoc), {
    thang: boLoc.thang,
    coLoc: boLoc.loai !== 'tat-ca' || boLoc.tuKhoa.trim() !== '',
  });
  nutMau.hidden = tatCa.length > 0;
}

function debounce(ham, ms) {
  let hen;
  return (...thamSo) => {
    clearTimeout(hen);
    hen = setTimeout(() => ham(...thamSo), ms);
  };
}

// ───────────── Thêm giao dịch ─────────────

/** Hiện hoặc xóa lỗi của một ô nhập, kèm thuộc tính cho trình đọc màn hình. */
function datLoi(oNhap, idLoi, thongDiep) {
  const loi = document.getElementById(idLoi);
  loi.textContent = thongDiep ? `⚠ ${thongDiep}` : '';
  loi.hidden = !thongDiep;
  oNhap.setAttribute('aria-invalid', String(Boolean(thongDiep)));
  if (thongDiep) oNhap.setAttribute('aria-describedby', idLoi);
  else oNhap.removeAttribute('aria-describedby');
}

form.addEventListener('submit', (event) => {
  event.preventDefault();

  const moTa = oMoTa.value.trim();
  const soTien = docSoTien(oSoTien.value);
  const loiMoTa = moTa ? '' : 'Hãy nhập mô tả, ví dụ “Ăn trưa”.';
  const loiSoTien = soTien > 0 ? '' : 'Số tiền phải là số nguyên lớn hơn 0, ví dụ 45000.';
  datLoi(oMoTa, 'mo-ta-loi', loiMoTa);
  datLoi(oSoTien, 'so-tien-loi', loiSoTien);
  if (loiMoTa || loiSoTien) {
    (loiMoTa ? oMoTa : oSoTien).focus();
    return;
  }

  const gd = kho.them({
    moTa,
    soTien,
    loai: form.elements.loai.value,
    danhMuc: chonDanhMuc.value,
    ngay: oNgay.value || homNay(),
  });

  // Chuyển tới tháng của giao dịch vừa thêm để người dùng thấy ngay.
  boLoc.thang = thangCuaNgay(gd.ngay);
  chonThang.value = boLoc.thang;
  oMoTa.value = '';
  oSoTien.value = '';
  oMoTa.focus();
  capNhat();
  hienThongBao(`Đã thêm “${gd.moTa}”.`);
});

// Đổi loại thu/chi thì đổi danh sách danh mục.
form.addEventListener('change', (event) => {
  if (event.target.name === 'loai') veDanhMuc(chonDanhMuc, event.target.value);
});

// ───────────── Xóa (ủy quyền sự kiện) và hoàn tác ─────────────

document.querySelector('#danh-sach').addEventListener('click', (event) => {
  const nutXoa = event.target.closest('.giao-dich__xoa');
  if (!nutXoa) return;

  const dong = nutXoa.closest('li');
  const idKeTiep = (dong.nextElementSibling ?? dong.previousElementSibling)?.dataset.id;
  const daXoa = kho.xoa(dong.dataset.id);
  capNhat();

  // Phần tử đang focus vừa bị xóa: chuyển focus tới dòng kế bên, hoặc tiêu đề danh sách.
  const dich = idKeTiep && document.querySelector(`[data-id="${idKeTiep}"] .giao-dich__xoa`);
  (dich || document.querySelector('#tieu-de-danh-sach')).focus();

  hienThongBao(`Đã xóa “${daXoa.moTa}”.`, () => {
    kho.khoiPhuc(daXoa);
    capNhat();
  });
});

// ───────────── Bộ lọc ─────────────

chonThang.addEventListener('change', () => {
  boLoc.thang = chonThang.value || thangCuaNgay(homNay());
  capNhat();
});

locLoai.addEventListener('change', () => {
  boLoc.loai = locLoai.value;
  capNhat();
});

timKiem.addEventListener(
  'input',
  debounce(() => {
    boLoc.tuKhoa = timKiem.value;
    capNhat();
  }, 200),
);

// ───────────── Giao diện sáng/tối ─────────────

const KHOA_GIAO_DIEN = 'so-chi-tieu:giao-dien';
const CAC_GIAO_DIEN = ['tu-dong', 'sang', 'toi'];
const TEN_GIAO_DIEN = { 'tu-dong': 'Tự động', sang: 'Sáng', toi: 'Tối' };
let giaoDien = document.documentElement.dataset.theme ?? 'tu-dong';

function apDungGiaoDien() {
  if (giaoDien === 'tu-dong') delete document.documentElement.dataset.theme;
  else document.documentElement.dataset.theme = giaoDien;
  document.querySelector('#ten-giao-dien').textContent = TEN_GIAO_DIEN[giaoDien];
}

document.querySelector('#nut-giao-dien').addEventListener('click', () => {
  giaoDien = CAC_GIAO_DIEN[(CAC_GIAO_DIEN.indexOf(giaoDien) + 1) % CAC_GIAO_DIEN.length];
  apDungGiaoDien();
  try {
    if (giaoDien === 'tu-dong') localStorage.removeItem(KHOA_GIAO_DIEN);
    else localStorage.setItem(KHOA_GIAO_DIEN, giaoDien);
  } catch {
    // Không lưu được lựa chọn: vẫn áp dụng cho phiên này.
  }
});

// ───────────── Dữ liệu: mẫu, xuất, nhập ─────────────

nutMau.addEventListener('click', () => {
  const mau = taoDuLieuMau();
  kho.thayTatCa(mau);
  boLoc.thang = thangCuaNgay(mau[0].ngay);
  chonThang.value = boLoc.thang;
  capNhat();
  hienThongBao(`Đã thêm ${mau.length} giao dịch mẫu.`);
});

document.querySelector('#nut-xuat').addEventListener('click', () => {
  const tep = new Blob([JSON.stringify(kho.layTatCa(), null, 2)], { type: 'application/json' });
  const lienKet = document.createElement('a');
  lienKet.href = URL.createObjectURL(tep);
  lienKet.download = `so-chi-tieu-${homNay()}.json`;
  lienKet.click();
  setTimeout(() => URL.revokeObjectURL(lienKet.href), 1000);
});

const tepNhap = document.querySelector('#tep-nhap');
document.querySelector('#nut-nhap').addEventListener('click', () => tepNhap.click());

tepNhap.addEventListener('change', async () => {
  const tep = tepNhap.files[0];
  tepNhap.value = ''; // cho phép chọn lại đúng tệp đó lần sau
  if (!tep) return;

  try {
    const duLieu = JSON.parse(await tep.text());
    if (!Array.isArray(duLieu)) throw new Error('tệp không chứa danh sách giao dịch');
    const hopLe = duLieu.filter(kho.laGiaoDichHopLe);
    if (hopLe.length === 0) throw new Error('không tìm thấy giao dịch hợp lệ nào');
    if (!window.confirm(`Thay toàn bộ dữ liệu hiện tại bằng ${hopLe.length} giao dịch trong tệp?`)) return;

    kho.thayTatCa(hopLe);
    capNhat();
    const boQua = duLieu.length - hopLe.length;
    hienThongBao(`Đã nhập ${hopLe.length} giao dịch${boQua ? ` (bỏ qua ${boQua} dòng không hợp lệ)` : ''}.`);
  } catch (loi) {
    const lyDo = loi instanceof SyntaxError ? 'tệp không phải JSON hợp lệ' : loi.message;
    hienThongBao(`Không nhập được: ${lyDo}.`);
  }
});

// Tab khác của cùng trang vừa thay đổi dữ liệu → đọc lại.
window.addEventListener('storage', (event) => {
  if (event.key === kho.KHOA) {
    kho.napLai();
    capNhat();
  }
});

// ───────────── Khởi động ─────────────
chonThang.value = boLoc.thang;
oNgay.value = homNay();
veDanhMuc(chonDanhMuc, 'chi');
apDungGiaoDien();
capNhat();
