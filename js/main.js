// JS để tạo hiệu ứng slider, toggle menu,...
document.addEventListener("DOMContentLoaded", () => {
  console.log("JS loaded. Add your code here.");
});

let products = [];
let currentPage = 1;
let itemsPerPage = 16;
let sortOption = "default";

// Định dạng tiền tệ
function formatCurrency(num) {
  return "Rp " + num.toLocaleString("id-ID");
}

function renderProducts() {
  let sortedProducts = [...products];

  // Sắp xếp
  if (sortOption === "Price: Low to High") {
    sortedProducts.sort((a, b) => a.price - b.price);
  } else if (sortOption === "Price: High to Low") {
    sortedProducts.sort((a, b) => b.price - a.price);
  }

  // Phân trang
  let start = (currentPage - 1) * itemsPerPage;
  let paginated = sortedProducts.slice(start, start + itemsPerPage);

  let html = paginated.map(p => `
    <div class="product-card">
      <img src="${p.image}" alt="${p.name}" class="product-card__image" />
      <div class="product-card__overlay">
        <a href="#" class="product-card__button">Add to cart</a>
        <div class="product-card__actions">
          <a href="#"><img src="images/icons/share.svg" alt="Share" /> Share</a>
          <a href="#"><img src="images/icons/compare.svg" alt="Compare" /> Compare</a>
          <a href="#"><img src="images/icons/Heart.png" alt="Like" /> Like</a>
        </div>
      </div>

      ${p.discount ? `<div class="product-card__badge sale">-${p.discount}%</div>` : ""}
      ${p.isNew ? `<div class="product-card__badge new">New</div>` : ""}

      <div class="product-card__content">
        <h3 class="product-card__title">${p.name}</h3>
        <p class="product-card__subtitle">${p.description}</p>
        <div class="product-card__price-container">
          <span class="product-card__price">${formatCurrency(p.price)}</span>
          ${p.oldPrice ? `<span class="product-card__old-price">${formatCurrency(p.oldPrice)}</span>` : ""}
        </div>
      </div>
    </div>
  `).join("");

  $("#productGrid").html(html);
  updateResultsInfo();
}

function renderPagination() {
  let totalPages = Math.ceil(products.length / itemsPerPage);
  let html = "";

  for (let i = 1; i <= totalPages; i++) {
    html += `<a href="#" class="page ${i === currentPage ? "active" : ""}" data-page="${i}">${i}</a>`;
  }

  if (currentPage < totalPages) {
    html += `<a href="#" class="page next" data-page="${currentPage + 1}">Next</a>`;
  }

  $("#pagination").html(html);

  $(".page").on("click", function (e) {
    e.preventDefault();
    let page = parseInt($(this).data("page"));
    if (!isNaN(page) && page > 0 && page <= totalPages) {
      currentPage = page;
      renderProducts();
      renderPagination();
    }
  });
}

$(document).ready(function () {
  // Load dữ liệu JSON 1 lần
  $.getJSON("data/products.json", function (data) {
    products = data;
    renderProducts();
    renderPagination();
  });

  // Bộ lọc theo loại sản phẩm
  $("#sortBy").on("change", function () {
    sortOption = $(this).val();
    currentPage = 1;
    renderProducts();
    renderPagination();
  });

  // Số lượng sản phẩm / trang
  $("#showCount").on("change", function () {
    itemsPerPage = parseInt($(this).val());
    currentPage = 1;
    renderProducts();
    renderPagination();
  });
});

function updateResultsInfo() {
    const total = products.length;
    const start = (currentPage - 1) * itemsPerPage + 1;
    const end = Math.min(currentPage * itemsPerPage, total);
    $("#resultsInfo").text(`Showing ${start}-${end} of ${total} results`);
}

$("#showCount").on("change", function () {
    itemsPerPage = parseInt($(this).val());
    renderPagination();
    renderProducts();
    updateResultsInfo();
});

