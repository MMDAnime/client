# Upload nhiều tập Anime

Trang `AddAnimePage.tsx` đã được nối với các API backend hiện có:

- `GET /categories`: lấy danh mục đang hoạt động (dạng cây), frontend làm phẳng để chọn `categoryId`.
- `POST /videos/upload`: upload từng file MP4 bằng `multipart/form-data`.

Mỗi file được gửi tuần tự với các trường:

- `file`: file MP4 (field bắt buộc, tối đa 1 file/request).
- `title`: `<Tên Anime> - Tập NN`.
- `categoryId`: MongoDB ObjectId của danh mục đã chọn.
- `description`: mô tả Anime, năm phát hành và số tập.
- `tags`: mảng thể loại (được serialize JSON trong FormData).
- `credits`: mảng rỗng; `license`: mặc định `no_repost`; `isNsfw`: false; `submit`: false (được gửi bởi videoService).

## Điều kiện backend hiện tại

- Endpoint upload yêu cầu đăng nhập và role `creator`, `moderator` hoặc `admin`.
- Giới hạn mặc định trong backend là 200 MB/file (có thể thay đổi bằng `MAX_VIDEO_SIZE_MB`).
- `submit: false` lưu video ở trạng thái `draft`. API `GET /videos` chỉ trả video `published`, do đó các tập nháp chưa xuất hiện trong danh sách công khai.
- Model `Video` chưa có `animeId` hoặc `episodeNumber`, và backend chưa có model/route Anime. Vì vậy các tập hiện được tạo thành video độc lập, đặt tên theo quy ước `Tên Anime - Tập NN`; chưa có quan hệ dữ liệu Anime–Episode thực sự.
- Form ảnh hiện tại tạo data URL để xem trước. Backend chưa có API upload ảnh và `thumbnailUrl` chỉ chấp nhận URL HTTP(S), nên ảnh không được lưu lên server trong luồng này.
- Năm phát hành được thêm vào description; thể loại được lưu dưới dạng tags. Chưa có trường riêng cho năm phát hành hoặc poster trong model Video.

Để có chức năng Anime detail hiển thị danh sách tập, chỉnh sửa/xóa Anime theo bộ, và upload ảnh poster thật sự, cần bổ sung model `Anime`, model/quan hệ Episode (hoặc `animeId` + `episodeNumber` trong Video), cùng các API tương ứng ở backend.
