# Kết nối Frontend ANILUME với Backend MMD Anime

## 1. Cấu hình chạy

1. Chạy backend trong thư mục `server`:
   ```bash
   npm install
   cp .env.example .env
   # Điền MONGODB_CONNECTIONSTRING và ACCESS_TOKEN_SECRET
   npm run dev
   ```
   Backend mặc định chạy tại `http://localhost:1212`.

2. Chạy frontend trong thư mục `frontend`:
   ```bash
   npm install
   cp .env.example .env
   npm run dev
   ```
   `VITE_API_URL` mặc định là `http://localhost:1212`. Backend mount routes tại `/`, không có tiền tố `/api`.

## 2. Đối chiếu Auth API

| Method | URL | Request body | Response / xử lý frontend |
|---|---|---|---|
| POST | `/auth/signup` | `username`, `password`, `email`, `firstName`, `lastName` | HTTP 204, không có JSON body. Frontend gọi signin tiếp theo. |
| POST | `/auth/signin` | `username`, `password` | HTTP 200 `{ accessToken }`; refresh token được set trong cookie HttpOnly. |
| POST | `/auth/refresh` | Không cần body | Đọc cookie `refreshToken`, trả HTTP 200 `{ accessToken }`. |
| POST | `/auth/signout` | Không cần body | Đọc cookie, xóa session, clear cookie; HTTP 204. |
| GET | `/users/me` | Không có body | Cần `Authorization: Bearer <accessToken>`, trả `{ user }`. |

Frontend đăng ký hiện yêu cầu riêng username, họ, tên, email, mật khẩu và xác nhận mật khẩu. `AuthContext.register()` gửi đúng 5 trường backend cần; xác nhận mật khẩu chỉ dùng kiểm tra ở frontend, không gửi lên server. Username được chuẩn hóa chữ thường trước khi gửi.

Frontend đăng nhập bằng username + password, không dùng email. Backend chỉ tìm theo `username`.

## 3. Token, cookie và headers

- Access token được lưu trong `localStorage` với key `anilume-access-token`.
- Axios request interceptor tự thêm `Authorization: Bearer <accessToken>` khi có access token.
- `withCredentials: true` được bật để trình duyệt gửi/nhận cookie refresh token.
- Refresh token là cookie `HttpOnly`, frontend không đọc trực tiếp bằng JavaScript và không gửi trong JSON body.
- Khi request cần đăng nhập nhận 401, response interceptor gọi `POST /auth/refresh`, lưu access token mới rồi gửi lại request ban đầu.
- Các route auth là route công khai, không phụ thuộc access token.

## 4. Đối chiếu các API nội dung

| Method | URL | Request frontend | Backend contract |
|---|---|---|---|
| GET | `/videos` | Query params `page`, `limit`, `category`, `tag`, `author`, `search`, `sort` | Trả `{ items, page, totalPages, total }`. |
| GET | `/videos/:slug` | Slug trên URL | Trả `{ video }`; có thể cần đăng nhập để xem video riêng tư/18+. |
| POST | `/videos` | JSON: `title`, `sourceUrl`, `categoryId`; các trường tùy chọn `description`, `thumbnailUrl`, `tags`, `credits`, `license`, `isNsfw`, `submit` | Cần access token và role được phép đăng video; trả `{ video }`, HTTP 201. |
| POST | `/videos/upload` | `multipart/form-data`: file field tên `file`; `title`, `categoryId`, `description`, `thumbnailUrl`, `tags`, `credits`, `license`, `isNsfw`, `submit` | Cần access token/role; `tags`, `credits` gửi dạng JSON string; boolean gửi `"true"`/`"false"`. |
| PATCH | `/videos/:id` | JSON chỉ gồm trường cập nhật: `title`, `categoryId`, `description`, `thumbnailUrl`, `tags`, `credits`, `license`, `isNsfw`, `submit` | Cần access token; chỉ chủ video được sửa. Không gửi `sourceUrl`. |
| DELETE | `/videos/:id` | Không có body | Cần access token; chủ video hoặc staff; xóa mềm. |
| POST | `/videos/:id/view` | Không có body | Public, token tùy chọn; trả `{ viewsCount, counted }`. |
| GET | `/categories` | Không có body/query | Public; trả `{ items }` dạng cây. |
| GET | `/tags` | Query `q`, `limit` | Public; trả `{ items }`. |

Các hàm tương ứng nằm trong `frontend/src/services/videoService.ts`. `api.ts` dùng chung base URL, credentials và Authorization header.

## 5. User API chưa được giao diện gọi

Backend còn các endpoint quản trị sau, nhưng frontend hiện chưa có màn hình/service gọi chúng:

- `GET /users?page=&limit=&search=&role=&status=` — moderator/admin.
- `PATCH /users/:id/role` — body `{ "role": "creator" }`, chỉ admin.
- `PATCH /users/:id/ban` — body tùy chọn `{ "reason": "..." }`, moderator/admin.
- `PATCH /users/:id/unban` — không cần body, moderator/admin.

`GET /users/me` là endpoint user duy nhất hiện được AuthContext sử dụng.

## 6. Lưu ý về phạm vi hai dự án

Frontend hiện là website khám phá **Anime** (dữ liệu Anime/nhân vật lấy từ AniList), còn backend là hệ thống chia sẻ **video MMD** (Video, Category, Tag, User). Các trang Anime hiện chưa gọi CRUD video; `videoService.ts` cung cấp các hàm API video để tích hợp khi có giao diện nghiệp vụ tương ứng.

Backend không có endpoint cập nhật hồ sơ người dùng. Vì vậy giao diện hồ sơ không giả lập lưu thành công khi người dùng sửa tên/avatar. Dữ liệu Anime và nhân vật tiếp tục lấy từ AniList, không chuyển đổi thành video MMD.
