// Lọc và tính toán trên danh sách giao dịch. Toàn hàm thuần: nhận dữ liệu, trả kết quả mới,
// không đụng tới DOM hay localStorage, nên kiểm thử được dễ dàng (xem thong-ke.test.js).
import { boDau } from './dinh-dang.js';

/** Giao dịch trong một tháng, thang dạng 'YYYY-MM'. */
export function locTheoThang(ds, thang) {
  return ds.filter((gd) => gd.ngay.startsWith(thang + '-'));
}

export function tinhTong(ds) {
  let thu = 0;
  let chi = 0;
  for (const gd of ds) {
    if (gd.loai === 'thu') thu += gd.soTien;
    else chi += gd.soTien;
  }
  return { thu, chi, soDu: thu - chi };
}

/** Tổng chi theo từng danh mục, danh mục chi nhiều nhất đứng đầu. */
export function chiTheoDanhMuc(ds) {
  const tong = new Map();
  for (const gd of ds) {
    if (gd.loai === 'chi') tong.set(gd.danhMuc, (tong.get(gd.danhMuc) ?? 0) + gd.soTien);
  }
  return [...tong]
    .map(([danhMuc, soTien]) => ({ danhMuc, soTien }))
    .sort((a, b) => b.soTien - a.soTien);
}

/** Lọc theo loại và từ khóa (không phân biệt dấu), mới nhất lên đầu. */
export function locGiaoDich(ds, { loai = 'tat-ca', tuKhoa = '' } = {}) {
  const tuKhoaChuan = boDau(tuKhoa.trim());
  return ds
    .toReversed() // giao dịch thêm sau đứng trước khi cùng ngày (sort giữ nguyên thứ tự khi bằng nhau)
    .filter((gd) => loai === 'tat-ca' || gd.loai === loai)
    .filter((gd) => !tuKhoaChuan || boDau(gd.moTa).includes(tuKhoaChuan))
    .sort((a, b) => b.ngay.localeCompare(a.ngay));
}
