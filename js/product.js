$(function () {
	// Gallery thumbnails
	$(".product-gallery__thumb").click(function () {
		$(".product-gallery__thumb").removeClass("product-gallery__thumb--active");
		$(this).addClass("product-gallery__thumb--active");

		const imgSrc = $(this).attr("src");
		$(".product-gallery__image").attr("src", imgSrc);
	});

	// Quantity selector
	$(".quantity-selector__btn").click(function () {
		const input = $(this).siblings(".quantity-selector__input");
		let value = parseInt(input.val());

		if ($(this).text() === "+") {
			value++;
		} else if (value > 1) {
			value--;
		}

		input.val(value);
	});

	// Size selector
	$(".size-selector__btn").on("click", function () {
		$(".size-selector__btn").removeClass("size-selector__btn--active");
		$(this).addClass("size-selector__btn--active");
	});

	// Color selector
	$(".color-selector__btn").on("click", function () {
		$(".color-selector__btn").removeClass("color-selector__btn--active");
		$(this).addClass("color-selector__btn--active");
	});

	// Tabs
	$(".product-tabs__btn").on("click", function () {
		$(".product-tabs__btn").removeClass("product-tabs__btn--active");
		$(this).addClass("product-tabs__btn--active");

		const index = $(this).index();
		$(".product-tabs__content").removeClass("product-tabs__content--active");
		$(".product-tabs__content")
			.eq(index)
			.addClass("product-tabs__content--active");
	});
});

// Xử lý carousel trượt ảnh
$(function () {
	// Lấy các elements cần thiết
	const $mainImage = $(".carousel__image-container img");
	const $thumbs = $(".carousel__thumbs img");

	// Xử lý click vào thumbnail
	$thumbs.on("click", function () {
		// Xóa active class khỏi tất cả thumbnails
		$thumbs.removeClass("product-gallery__thumb--active");

		// Thêm active class vào thumbnail được click
		$(this).addClass("product-gallery__thumb--active");

		// Cập nhật ảnh chính
		const newImageSrc = $(this).attr("src");

		// Thêm fade effect khi đổi ảnh
		$mainImage.fadeOut(300, function () {
			$(this).attr("src", newImageSrc).fadeIn(300);
		});
	});
});
