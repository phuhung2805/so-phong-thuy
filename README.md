# Sổ Phong Thủy

Lịch âm (Việt Nam / Trung Quốc), lá số tuổi, xem nhà theo Bát trạch, chọn ngày cưới hỏi, ngày giờ an táng và hạ huyệt.

## Các file

| File | Vai trò |
|---|---|
| `phongthuy-core.js` | Toàn bộ phần tính toán: lịch âm, Can Chi, ngũ hành, cung phi, chấm điểm ngày |
| `so-phong-thuy.html` | Giao diện |
| `build-app.js` | Đóng gói thành app điện thoại (PWA) vào thư mục `docs/` |
| `docs/` | Bản app hoàn chỉnh, GitHub Pages phục vụ thư mục này |

Sửa xong `so-phong-thuy.html` hoặc `phongthuy-core.js` thì chạy lại:

```bash
node build-app.js
```

## Chạy thử trên máy

```bash
npx http-server@14.1.1 docs -p 5180
```

Mở http://localhost:5180

## Đưa lên GitHub Pages để cài vào điện thoại

1. Vào github.com, tạo repo mới, ví dụ `so-phong-thuy`, chọn Public.
2. Bấm "uploading an existing file", kéo **toàn bộ nội dung bên trong thư mục `app/`** (không kéo cả thư mục) vào, rồi Commit.
3. Vào Settings → Pages → Source: "Deploy from a branch", Branch: `main`, thư mục `/ (root)` → Save.
4. Đợi 1–2 phút, link sẽ có dạng `https://<tên-github>.github.io/so-phong-thuy/`.

## Cài lên điện thoại

- **Android (Chrome):** mở link → menu ⋮ → "Cài đặt ứng dụng" hoặc "Thêm vào màn hình chính".
- **iPhone (Safari):** mở link → nút Chia sẻ → "Thêm vào MH chính".

Sau lần mở đầu tiên, app vẫn chạy được khi không có mạng.

Mỗi lần cập nhật: chạy `node build-app.js`, rồi commit và push lên repo. Điện thoại sẽ tự lấy bản mới khi có mạng.
