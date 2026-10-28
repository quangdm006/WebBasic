// Kho dữ liệu: danh sách giao dịch, lưu trong localStorage của trình duyệt.
// Mọi thay đổi đi qua các hàm của module này, nên chỉ có một nơi đọc/ghi localStorage.

export const KHOA = 'so-chi-tieu:giao-dich:v1';

export const DANH_MUC = {
  chi: ['Ăn uống', 'Đi lại', 'Mua sắm', 'Hóa đơn', 'Giải trí', 'Sức khỏe', 'Học tập', 'Khác'],
  thu: ['Lương', 'Thưởng', 'Bán hàng', 'Được cho', 'Khác'],
};

export const BIEU_TUONG = {
  'Ăn uống': '🍜',
  'Đi lại': '🛵',
  'Mua sắm': '🛍️',
  'Hóa đơn': '🧾',
  'Giải trí': '🎬',
  'Sức khỏe': '💊',
  'Học tập': '📚',
  Lương: '💼',
  Thưởng: '🎁',
  'Bán hàng': '🏷️',
  'Được cho': '🧧',
  Khác: '📦',
};

/** Một giao dịch: { id, moTa, soTien (số nguyên, đồng), loai: 'thu' | 'chi', danhMuc, ngay: 'YYYY-MM-DD' } */
export function laGiaoDichHopLe(gd) {
  return (
    gd !== null &&
    typeof gd === 'object' &&
    typeof gd.id === 'string' &&
    gd.id.length > 0 &&
    typeof gd.moTa === 'string' &&
    gd.moTa.trim().length > 0 &&
    Number.isInteger(gd.soTien) &&
    gd.soTien > 0 &&
    (gd.loai === 'thu' || gd.loai === 'chi') &&
    typeof gd.danhMuc === 'string' &&
    typeof gd.ngay === 'string' &&
    /^\d{4}-\d{2}-\d{2}$/.test(gd.ngay) &&
    !Number.isNaN(Date.parse(gd.ngay))
  );
}

// crypto.randomUUID chỉ có trên HTTPS hoặc localhost; dự phòng cho trường hợp còn lại.
const taoId = () => crypto.randomUUID?.() ?? Date.now().toString(36) + Math.random().toString(36).slice(2);

function docTuBoNho() {
  try {
    const duLieu = JSON.parse(localStorage.getItem(KHOA) ?? '[]');
    // Dữ liệu cũ hoặc bị sửa tay có thể hỏng: chỉ giữ những giao dịch hợp lệ.
    return Array.isArray(duLieu) ? duLieu.filter(laGiaoDichHopLe) : [];
  } catch {
    return [];
  }
}

let danhSach = docTuBoNho();

function luu() {
  try {
    localStorage.setItem(KHOA, JSON.stringify(danhSach));
  } catch {
    // Hết dung lượng hoặc trình duyệt chặn storage: dữ liệu chỉ còn trong phiên này.
  }
}

export function layTatCa() {
  return danhSach;
}

export function them(duLieu) {
  const gd = { id: taoId(), ...duLieu };
  danhSach = [...danhSach, gd];
  luu();
  return gd;
}

export function xoa(id) {
  const gd = danhSach.find((x) => x.id === id);
  danhSach = danhSach.filter((x) => x.id !== id);
  luu();
  return gd;
}

/** Hoàn tác thao tác xóa. */
export function khoiPhuc(gd) {
  if (danhSach.some((x) => x.id === gd.id)) return;
  danhSach = [...danhSach, gd];
  luu();
}

export function thayTatCa(dsMoi) {
  danhSach = dsMoi.filter(laGiaoDichHopLe);
  luu();
  return danhSach.length;
}

/** Đọc lại từ localStorage, dùng khi tab khác vừa thay đổi dữ liệu. */
export function napLai() {
  danhSach = docTuBoNho();
}
