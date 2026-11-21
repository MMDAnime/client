# ANILUME – Anime và tập phim upload từ MongoDB

## Dữ liệu mới
- `Anime` là collection riêng, lưu tiêu đề, mô tả, năm phát hành, thể loại và ảnh poster.
- Mỗi tập là một document `Video`, có `animeId` và `episodeNumber` để liên kết về Anime.
- Video MP4 vẫn dùng cơ chế upload hiện tại tại `POST /videos/upload`.

## API
- `POST /animes` – tạo Anime; yêu cầu đăng nhập với role `creator`, `moderator` hoặc `admin`.
- `GET /animes` – danh sách Anime có tập phim khả dụng; hỗ trợ `search`, `page`, `limit`.
- `GET /animes/:id` – thông tin Anime và danh sách tập.
- `POST /videos/upload` – upload từng tập; gửi thêm `animeId` và `episodeNumber` trong multipart/form-data.

## Trạng thái hiển thị
- Upload từ form hiện đặt `submit=false`, do đó mỗi tập ở trạng thái `draft`.
- Chủ sở hữu đã đăng nhập vẫn nhìn thấy Anime và các tập nháp của mình để kiểm thử.
- Người dùng khác chỉ nhìn thấy tập có trạng thái `published`.
- Video `pending` chỉ hiển thị với chủ sở hữu; staff duyệt theo luồng quản trị hiện có.

## Frontend
- Trang chủ, trang khám phá, tìm kiếm Header và trang chi tiết chỉ dùng API `/animes` của backend.
- `services/animeService.ts` (AniList GraphQL) và các component mẫu AniList vẫn được giữ trong source để tham khảo, nhưng không được gọi/render trên luồng chính.
- Trang phát video: `/watch/:animeId/:episodeId`; video MP4 được stream từ `/uploads/videos/...` và hỗ trợ seek nhờ Express static.

## Chạy thử
1. Đảm bảo MongoDB URI trỏ đến database `MMDAnime`.
2. Tạo ít nhất một category `isActive: true` trong collection `categories`.
3. Đăng nhập bằng tài khoản có role `creator`, `moderator` hoặc `admin`.
4. Vào `/add-anime`, nhập thông tin, chọn category và một hoặc nhiều file MP4.
5. Sau khi upload thành công, frontend chuyển đến `/anime/:id`; trang chủ và `/anime` cũng hiển thị Anime của chủ sở hữu.
6. Đăng nhập tài khoản khác hoặc mở cửa sổ ẩn danh: bản nháp sẽ không xuất hiện cho đến khi được duyệt và published.

## Lưu ý
- Ảnh poster hiện được gửi dưới dạng data URL trong JSON; backend giới hạn JSON 2MB và ImageUploader giới hạn ảnh đầu vào 1MB.
- Nếu upload một tập giữa chừng thất bại, Anime và các tập đã upload trước đó vẫn được lưu; có thể tiếp tục bằng thao tác thêm tập ở phiên bản sau.
