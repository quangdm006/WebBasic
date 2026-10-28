// Định dạng tiền, ngày và chuỗi theo kiểu Việt Nam. Toàn hàm thuần: dễ kiểm thử.

const VND = new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' });

export function dinhDangTien(soTien) {
  return VND.format(soTien);
}

/** 'YYYY-MM-DD' → 'DD/MM/YYYY'. Tách chuỗi thay vì dùng new Date() để không bị lệch múi giờ. */
export function dinhDangNgay(ngay) {
  const [nam, thang, ngayTrongThang] = ngay.split('-');
  return `${ngayTrongThang}/${thang}/${nam}`;
}

/** Ngày hôm nay theo giờ địa phương, dạng 'YYYY-MM-DD'. */
export function homNay() {
  const d = new Date();
  const thang = String(d.getMonth() + 1).padStart(2, '0');
  const ngay = String(d.getDate()).padStart(2, '0');
  return `${d.getFullYear()}-${thang}-${ngay}`;
}

/** '2026-10-27' → '2026-10' */
export function thangCuaNgay(ngay) {
  return ngay.slice(0, 7);
}

/** '2026-10' → 'tháng 10/2026' */
export function tenThang(thang) {
  const [nam, so] = thang.split('-');
  return `tháng ${Number(so)}/${nam}`;
}

/** Bỏ dấu và viết thường, dùng để tìm kiếm không phân biệt dấu. */
export function boDau(chuoi) {
  return chuoi
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/đ/g, 'd')
    .replace(/Đ/g, 'D')
    .toLowerCase();
}

/** Đọc số tiền người dùng gõ: chấp nhận '45000', '45.000', '45,000 ₫'. Không hợp lệ thì trả về NaN. */
export function docSoTien(chuoi) {
  const chiConSo = String(chuoi).replace(/[\s.,₫]/g, '');
  return /^\d{1,13}$/.test(chiConSo) ? Number(chiConSo) : NaN;
}
