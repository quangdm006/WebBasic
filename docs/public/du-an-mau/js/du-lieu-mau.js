// Dữ liệu mẫu để thử ứng dụng: các giao dịch rải trong tháng hiện tại (không vượt quá hôm nay).
import { homNay } from './dinh-dang.js';

const MAU = [
  { ngay: 1, moTa: 'Lương tháng', soTien: 15_000_000, loai: 'thu', danhMuc: 'Lương' },
  { ngay: 1, moTa: 'Tiền nhà', soTien: 4_000_000, loai: 'chi', danhMuc: 'Hóa đơn' },
  { ngay: 2, moTa: 'Đi chợ cuối tuần', soTien: 650_000, loai: 'chi', danhMuc: 'Ăn uống' },
  { ngay: 3, moTa: 'Đổ xăng', soTien: 80_000, loai: 'chi', danhMuc: 'Đi lại' },
  { ngay: 5, moTa: 'Khóa học tiếng Anh', soTien: 1_200_000, loai: 'chi', danhMuc: 'Học tập' },
  { ngay: 6, moTa: 'Cà phê với bạn', soTien: 55_000, loai: 'chi', danhMuc: 'Ăn uống' },
  { ngay: 8, moTa: 'Bán sách cũ', soTien: 300_000, loai: 'thu', danhMuc: 'Bán hàng' },
  { ngay: 9, moTa: 'Xem phim', soTien: 180_000, loai: 'chi', danhMuc: 'Giải trí' },
  { ngay: 10, moTa: 'Tiền điện', soTien: 520_000, loai: 'chi', danhMuc: 'Hóa đơn' },
  { ngay: 12, moTa: 'Áo khoác', soTien: 450_000, loai: 'chi', danhMuc: 'Mua sắm' },
];

export function taoDuLieuMau() {
  const homNayChuoi = homNay();
  const thang = homNayChuoi.slice(0, 7);
  const ngayHomNay = Number(homNayChuoi.slice(8));
  return MAU.map((gd, i) => ({
    ...gd,
    id: `mau-${i + 1}`,
    ngay: `${thang}-${String(Math.min(gd.ngay, ngayHomNay)).padStart(2, '0')}`,
  }));
}
