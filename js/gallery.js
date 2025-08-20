$(function () {
	let currentSlide = 0; // Chỉ mục của slide hiện tại
	const totalSlides = $(".gallery__slide").length;

	// Nhấn vào dấu chấm chỉ mục
	$(".gallery__dot").on("click", function () {
		currentSlide = $(this).data("slide");
		updateGallery();
	});

	// Nhấn vào mũi tên
	$(".gallery__arrow-btn").on("click", function () {
		currentSlide = (currentSlide + 1) % totalSlides;
		updateGallery();
	});

	function updateGallery() {
		$(".gallery__slide").removeClass("gallery__slide--active");
		$(".gallery__slide").eq(currentSlide).addClass("gallery__slide--active");

		$(".gallery__dot").removeClass("gallery__dot--active");
		$(".gallery__dot").eq(currentSlide).addClass("gallery__dot--active");

		if ($(window).width() <= 768) {
			// Mobile: Khoảng cách di chuyển = 100% chiều rộng màn hình
			$(".gallery__track").css(
				"transform",
				`translateX(${-currentSlide * 100}%)`
			);
		} else {
			// Desktop: Khoảng cách di chuyển = vị trí hiện tại nhân với (độ rộng của một slide + gap)
			$(".gallery__track").css(
				"transform",
				`translateX(${-currentSlide * (372 + 24)}px)`
			);
		}
	}
});
