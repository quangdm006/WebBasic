// Kiểm thử cho các hàm thuần trong thong-ke.js. Chạy bằng Vitest (xem bài Module, npm & Vite):
//   npm install -D vitest && npx vitest
import { describe, expect, it } from 'vitest';
import { chiTheoDanhMuc, locGiaoDich, locTheoThang, tinhTong } from './thong-ke.js';

const DS = [
  { id: '1', moTa: 'Lương', soTien: 10_000_000, loai: 'thu', danhMuc: 'Lương', ngay: '2026-10-01' },
  { id: '2', moTa: 'Ăn trưa', soTien: 50_000, loai: 'chi', danhMuc: 'Ăn uống', ngay: '2026-10-02' },
  { id: '3', moTa: 'Cà phê sữa đá', soTien: 30_000, loai: 'chi', danhMuc: 'Ăn uống', ngay: '2026-10-02' },
  { id: '4', moTa: 'Tiền điện', soTien: 500_000, loai: 'chi', danhMuc: 'Hóa đơn', ngay: '2026-10-05' },
  { id: '5', moTa: 'Ăn tối', soTien: 120_000, loai: 'chi', danhMuc: 'Ăn uống', ngay: '2026-09-30' },
];

describe('locTheoThang', () => {
  it('chỉ giữ giao dịch của tháng được chọn', () => {
    expect(locTheoThang(DS, '2026-10').map((gd) => gd.id)).toEqual(['1', '2', '3', '4']);
  });
});

describe('tinhTong', () => {
  it('tính tổng thu, tổng chi và số dư', () => {
    expect(tinhTong(locTheoThang(DS, '2026-10'))).toEqual({ thu: 10_000_000, chi: 580_000, soDu: 9_420_000 });
  });

  it('danh sách rỗng thì mọi số đều bằng 0', () => {
    expect(tinhTong([])).toEqual({ thu: 0, chi: 0, soDu: 0 });
  });
});

describe('chiTheoDanhMuc', () => {
  it('gộp theo danh mục, nhiều nhất đứng đầu, bỏ qua khoản thu', () => {
    expect(chiTheoDanhMuc(locTheoThang(DS, '2026-10'))).toEqual([
      { danhMuc: 'Hóa đơn', soTien: 500_000 },
      { danhMuc: 'Ăn uống', soTien: 80_000 },
    ]);
  });
});

describe('locGiaoDich', () => {
  it('tìm không phân biệt dấu và hoa thường', () => {
    expect(locGiaoDich(DS, { tuKhoa: 'CA PHE' }).map((gd) => gd.id)).toEqual(['3']);
  });

  it('lọc theo loại và sắp xếp mới nhất lên đầu', () => {
    expect(locGiaoDich(DS, { loai: 'chi' }).map((gd) => gd.id)).toEqual(['4', '3', '2', '5']);
  });
});
