# ecommerce-landing

[Quy định bài tập nhóm](https://docs.google.com/document/d/1-9sdAGNN2jNtelbgRhbbuAA_d0Sxe8ntDypEZ_1r9GA/edit?tab=t.0)

# Techstack

### Frontend

- **HTML5** - Semantic markup
- **CSS3** - Modern CSS với Grid, Flexbox, CSS Variables
- **JavaScript ES6+** - Modules, Promises, Async/Await
- **jQuery 3.7.1** - DOM manipulation và AJAX

### Backend (Mock)

- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **CORS** - Cross-Origin Resource Sharing

### Tools & Libraries

- **Google Fonts** - Typography
- **CSS Custom Properties** - Theming system

# Cấu trúc dự án

```
ecommerce-landing/
├── css/
│   ├── base/
│   │   ├── variables.css      # CSS Variables
│   │   └── initial.css        # Reset styles
│   ├── components/            # Các CSS cho từng phần tử một
│   ├── utils/
│   │   ├── typography.css     # Typography utilities
│   │   └── layout.css         # Layout utilities
│   └── style.css              # Main CSS file
├── js/
│   ├── api.js                 # Cấu hình API
│   ├── utils.js               # Các hàm tiện ích
│   └── products.js            # Các chức năng liên quan đến sản phẩm
├── images/                    # Hình ảnh/icon
├── mock-server/
│   ├── server.js              # Server
│   ├── products.json          # Dữ liệu các sản phẩm ảo
│   └── package.json
├── other-pages/               # Các trang khác
├── index.html                 # Trang chủ
└── README.md
```

# Cài đặt và chạy dự án

Dự án có một thư mục gọi là `mock-server` được sử dụng để tạo một server giả, cung cấp các api cho phép chương trình chạy. Server giả này sử dụng node để chạy, nên trước tiên bạn đã phải cài sẵn node.js trước khi sử dụng nó

Trước tiên ta phải chạy `mock-server` đó, bằng cách chạy các câu lệnh sau theo tuần tự:

```bash
cd mock-server

npm install

node server.js
```

Server này sẽ chạy tại `http://localhost:3000`

Để chạy dự án, ta mở `index.html` trong browser hoặc sử dụng Live Server extension trong VS Code.

# Mock API

`mock-server` cung cấp một API đơn giản để fetch dữ liệu như sau:

#### GET /products

Lấy danh sách sản phẩm với pagination

**Parameters:**

- `page` (optional): Số trang (default: 1)
- `limit` (optional): Số sản phẩm mỗi trang (default: 16)

**Response:**

```json
{
	"total": 24,
	"page": 1,
	"limit": 16,
	"data": [
		{
			"id": 1,
			"name": "Syltherine",
			"description": "Stylish cafe chair",
			"price": 3500000,
			"discount": 30,
			"images": ["images/product/image 1.png"]
		}
	]
}
```
