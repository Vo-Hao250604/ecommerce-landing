import * as API from "./api.js";
import { formatPrice } from "./utils.js";

let currentPage = 1;
let itemsPerPage = 16;
let totalProducts = 0;
let currentSortBy = "default";

/**
 * Tải danh sách sản phẩm từ API và hiển thị lên giao diện.
 *
 * @param {number} [page=1] - Trang hiện tại cần tải (mặc định là 1).
 * @param {number} [limit=16] - Số lượng sản phẩm trên mỗi trang (mặc định là 16).
 * @param {string} [sortBy="default"] - Cách sắp xếp sản phẩm (mặc định là "default").
 * 
 * Hàm này sẽ gọi API để lấy danh sách sản phẩm theo trang và số lượng chỉ định.
 * Nếu không có sản phẩm, sẽ hiển thị thông báo không có sản phẩm.
 * Nếu có lỗi khi tải dữ liệu, sẽ hiển thị thông báo lỗi.
 * Sau khi lấy dữ liệu thành công, hàm sẽ cập nhật các biến toàn cục, hiển thị sản phẩm,
 * cập nhật thông tin thanh công cụ và phân trang.
 */
function loadProducts(page = 1, limit = 16, sortBy = "default") {
	const apiUrl = `${API.products}?page=${page}&limit=${limit}`;

	$.get(apiUrl, function (res) {
		if (res.total === 0) {
			$("#productsList").replaceWith(`
                <div class="section--no-content">No products available :'(</div>
            `);
			return;
		}

		// Sắp xếp client-side
        let sortedProducts = [...res.data];
        if (sortBy === "Price: Low to High") {
            sortedProducts.sort((a, b) => a.price - b.price);
        } else if (sortBy === "Price: High to Low") {
            sortedProducts.sort((a, b) => b.price - a.price);
        } else if (sortBy === "Newest") {
            // Nếu có createdAt thì dùng, nếu không thì sort theo id giảm dần
            if (sortedProducts[0]?.createdAt) {
                sortedProducts.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
            } else {
                sortedProducts.sort((a, b) => b.id - a.id);
            }
		}
        // default thì không sắp xếp, giữ nguyên thứ tự backend trả về

		// Cập nhật các biến thông tin về trang hiện tại
		currentPage = res.page;
		itemsPerPage = res.limit;
		totalProducts = res.total;
		currentSortBy = sortBy;

		// Render danh sách các sản phẩm lên màn hình
		renderProducts(sortedProducts);

		// Cập nhật dữ liệu lên thanh toolbar
		updateToolbarResult(res);

		// Render danh sách các trang dữ liệu
		renderPagination();
	}).fail(function () {
		$("#productsList").html(`
            <div class="section--no-content">Failed to load products :'(</div>
        `);
	});
}

/**
 * Hiển thị danh sách các sản phẩm
 *
 * @param {Array<Object>} products - Danh sách sản phẩm để hiển thị.
 * Mỗi sản phẩm là một object có các thuộc tính:
 *   @param {string} products[].name - Tên sản phẩm.
 *   @param {string} products[].description - Mô tả sản phẩm.
 *   @param {number} products[].price - Giá sản phẩm.
 *   @param {number} [products[].discount] - Phần trăm giảm giá.
 *   @param {boolean} [products[].new] - Đánh dấu sản phẩm mới.
 *   @param {Array<string>} products[].images - Danh sách đường dẫn ảnh sản phẩm.
 *
 * Hàm này sẽ tạo HTML cho từng sản phẩm và chèn vào phần tử có id `productsList`
 */
function renderProducts(products) {
	let productsListHtml = "";

	products.forEach(function (product) {
		productsListHtml += `
            <div class="product-card">
                <img
                    src="${product.images[0]}"
                    class="product-card__image"
                    alt="${product.name}"
                />
                <div class="product-card__overlay">
                    <button 
                        class="product-card__button add-to-cart"
                        data-id="${product.id}"
                        data-name="${product.name}"
                        data-price="${product.price}"
                        data-images="${product.images[0]}"
                    >
                        Add to cart
                    </button>

                    <div class="product-card__actions">
                        <a href="#" class="product-card__action">
                            <img
                                src="images/icons/share.svg"
                                class="product-card__action-icon"
                                alt="Share"
                            />
                            Share
                        </a>
                        <a href="#" class="product-card__action">
                            <img
                                src="images/icons/compare.svg"
                                class="product-card__action-icon"
                                alt="Compare"
                            />
                            Compare
                        </a>
                        <a href="#" class="product-card__action">
                            <img
                                src="images/icons/heart.svg"
                                class="product-card__action-icon"
                                alt="Like"
                            />
                            Like
                        </a>
                    </div>
                </div>
                ${
									product.discount
										? `<div class="product-card__badge product-card__badge--red">-${product.discount}%</div>`
										: product.new
										? `<div class="product-card__badge product-card__badge--green">New</div>`
										: ""
								}
                <div class="product-card__content">
                    <h3 class="product-card__title">${product.name}</h3>
                    <p class="product-card__subtitle">${product.description}</p>
                    <div class="product-card__price-container">
                        ${
													product.discount
														? `<p class="product-card__price">Rp ${formatPrice(
																Math.round(
																	(product.price * (100 - product.discount)) /
																		100
																)
														  )}</p>
                                <p class="product-card__old-price">Rp ${formatPrice(
																	product.price
																)}</p>`
														: `<p class="product-card__price">Rp ${formatPrice(
																product.price
														  )}</p>`
												}
                    </div>
                </div>
            </div>`;
	});

	$("#productsList").html(productsListHtml);
}

/**
 * Cập nhật dữ liệu trên thanh toolbar, dữ liệu này dùng để hiển thị tổng số sản phẩm trong
 * trang hiện tại, tổng tất cả các sản phẩm hiện có
 */
function updateToolbarResult(res) {
	const start = (res.page - 1) * res.limit + 1;
	const end = Math.min(res.page * res.limit, res.total);
	$("#toolbarResult").html(`Showing ${start}–${end} of ${res.total} results`);
}

/**
 * Hiển thị phân trang cho danh sách sản phẩm
 *
 * Hàm này tạo HTML cho các nút phân trang bao gồm:
 * - Nút trang trước ("Previous") nếu không ở trang đầu.
 * - Các nút số trang, hiển thị trang hiện tại, các trang lân cận, trang đầu, trang cuối và dấu "..." nếu cần.
 * - Nút trang tiếp theo ("Next") nếu không ở trang cuối.
 *
 * Với cơ chế đánh số trang cho các nút bằng dữ liệu `data-page`
 *
 * Kết quả sẽ được gán vào phần tử có id là `pagination`
 */
function renderPagination() {
	const totalPages = Math.ceil(totalProducts / itemsPerPage);
	let paginationHtml = "";

	// Nút trang trước
	if (currentPage > 1) {
		paginationHtml += `<a href="#" class="page" data-page="${
			currentPage - 1
		}">Previous</a>`;
	}

	// Nút các trang theo số thứ tự
	for (let i = 1; i <= totalPages; i++) {
		if (i === currentPage) {
			paginationHtml += `<a href="#" class="page active" data-page="${i}">${i}</a>`;
		} else if (
			i === 1 ||
			i === totalPages ||
			(i >= currentPage - 1 && i <= currentPage + 1)
		) {
			paginationHtml += `<a href="#" class="page" data-page="${i}">${i}</a>`;
		} else if (i === currentPage - 2 || i === currentPage + 2) {
			paginationHtml += `<span class="page-dots">...</span>`;
		}
	}

	// Nút trang tiếp theo
	if (currentPage < totalPages) {
		paginationHtml += `<a href="#" class="page" data-page="${
			currentPage + 1
		}">Next</a>`;
	}

	$("#pagination").html(paginationHtml);
}

/**
 * Thiết lập các sự kiện cho phân trang sản phẩm, chọn số lượng sản phẩm mỗi trang và sắp xếp.
 *
 * - Xử lý khi nhấn vào số trang để tải trang sản phẩm tương ứng và cuộn lên phần sản phẩm.
 * - Xử lý khi thay đổi số lượng sản phẩm trên mỗi trang, sẽ quay về trang đầu tiên.
 * - Xử lý khi thay đổi lựa chọn sắp xếp, tải lại sản phẩm với tuỳ chọn sắp xếp mới.
 */
function setupEventHandlers() {
	// Xử lý khi nhấn vào số trang để tải trang sản phẩm tương ứng và cuộn lên phần sản phẩm
	$(document).on("click", ".page", function (e) {
		e.preventDefault();
		const page = parseInt($(this).data("page"));
		if (page && page !== currentPage) {
			loadProducts(page, itemsPerPage, currentSortBy);
			// Cuộn lên đầu của phần sản phẩm
			$("html, body").animate(
				{
					scrollTop: $(".section--products").offset().top - 100,
				},
				300
			);
		}
	});

	// Xử lý khi thay đổi số lượng sản phẩm trên mỗi trang, sẽ quay về trang đầu tiên
	$("#productsPerPage").on("change", function () {
		const newLimit = parseInt($(this).val());
		itemsPerPage = newLimit;
		loadProducts(1, newLimit, currentSortBy); // Quay về trang đầu tiên nếu ta thay đỏi số lượng sản phẩm trên mỗi trang
	});

	// Xử lý khi thay đổi lựa chọn sắp xếp, tải lại sản phẩm với tuỳ chọn sắp xếp mới
	$("#productsSortBy").on("change", function () {
		const sortBy = $(this).val();
		// TODO thiết kế khả năng sắp xếp
		loadProducts(currentPage, itemsPerPage, sortBy);
	});
}

export { loadProducts, setupEventHandlers };


// Dạng Grid
$("#gridViewBtn").on("click", function () {
    $("#productsList")
        .removeClass("list-view")
        .addClass("grid--4-columns");

    $("#gridViewBtn, #listViewBtn").removeClass("active");
    $(this).addClass("active");
});

// Dạng List
$("#listViewBtn").on("click", function () {
    $("#productsList")
        .removeClass("grid--4-columns")
        .addClass("list-view");

    $("#gridViewBtn, #listViewBtn").removeClass("active");
    $(this).addClass("active");
});

/**
 *  PAGE CART
 */

// Hàm lấy giỏ hàng từ localStorage
function getCart() {
	return JSON.parse(localStorage.getItem("cart")) || [];
}

// Hàm lưu giỏ hàng vào localStorage
function saveCart(cart) {
	localStorage.setItem("cart", JSON.stringify(cart));
}

// Hàm thêm sản phẩm vào giỏ hàng
function addToCart(product) {
	let cart = getCart();

	// kiểm tra sản phẩm đã có trong giỏ hàng chưa
	let existing = cart.find(item => item.id === product.id);
	if (existing) {
		existing.quantity += 1; // nếu có thì tăng số lượng
	}  else {
		cart.push({ ...product, quantity: 1 }); // nếu không thì thêm mới
	}

	saveCart(cart);
	alert(`Đã thêm "${product.name}" vào giỏ hàng!`);
}

$(document).on("click", ".add-to-cart", function (e) {
	e.preventDefault();
	let product = {
		id: $(this).data("id"),
		name: $(this).data("name"),
		price: parseFloat($(this).data("price")),
		images: $(this).data("images")
	};
	addToCart(product);
})

$(document).ready(function () {
    // Lấy giỏ hàng từ localStorage
    let cart = JSON.parse(localStorage.getItem("cart")) || [];

    function renderCart() {
    let tbody = document.querySelector("#cart-table tbody");
    tbody.innerHTML = "";
    let subtotal = 0;

    if (cart.length === 0) {
        tbody.innerHTML = `<tr><td colspan="5" style="text-align:center;">Your cart is empty</td></tr>`;
        document.getElementById("subtotal-value").textContent = "Rs. 0.00";
        document.getElementById("total-value").textContent = "Rs. 0.00";
        return;
    }

    cart.forEach((item, index) => {
        let itemTotal = item.price * item.quantity;
        subtotal += itemTotal;

        let row = `
        <tr>
            <td>
                <img src="${item.images}" alt="${item.name}" style="width:60px; margin-right:10px; vertical-align:middle;">
                ${item.name}
            </td>
            <td>Rs. ${formatPrice(item.price)}</td>
            <td>
                <input type="number" min="1" value="${item.quantity}" data-index="${index}" class="qty-input" style="width:50px;">
            </td>
            <td>Rs. ${formatPrice(itemTotal)}</td>
            <td>
                <button class="delete-btn" data-index="${index}" style="background:none; border:none; cursor:pointer;">
                    <img src="images/icons/delete.png" alt="Delete" style="width:20px;">
                </button>
            </td>
        </tr>
        `;
        tbody.innerHTML += row;
    });

    document.getElementById("subtotal-value").textContent = "Rs. 0.00";
	document.getElementById("total-value").textContent    = "Rs. 0.00";

}


    // Format giá
    function formatPrice(num) {
        return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
    }

    // Thay đổi số lượng
    $(document).on("input", ".cart-qty", function () {
        let index = $(this).data("index");
        let qty = parseInt($(this).val());
        cart[index].quantity = qty;
        localStorage.setItem("cart", JSON.stringify(cart));
        renderCart();
    });

    // Xóa sản phẩm
    $(document).on("click", ".remove-item", function () {
        let index = $(this).data("index");
        cart.splice(index, 1);
        localStorage.setItem("cart", JSON.stringify(cart));
        renderCart();
    });

    renderCart();
});



