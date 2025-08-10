const express = require("express");
const cors = require("cors");
const products = require("./products.json");
const app = express();
const PORT = 3000;

app.use(cors());

// API endpoint
app.get("/products", (req, res) => {
	const page = parseInt(req.query.page) || 1;
	const limit = parseInt(req.query.limit) || 16;
	const startIndex = (page - 1) * limit;
	const endIndex = startIndex + limit;
	const paginatedProducts = products.slice(startIndex, endIndex);

	res.json({
		total: products.length,
		page,
		limit,
		data: paginatedProducts,
	});
});

// Khởi động server
app.listen(PORT, () => {
	console.log(`Server đang chạy tại http://localhost:${PORT}`);
});
