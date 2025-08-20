$(function () {
	let currentSlide = 0; // Chỉ mục của slide hiện tại
	const totalSlides = $(".carousel__slide").length;

	// Nhấn vào dấu chấm chỉ mục
	$(".carousel__dot").on("click", function () {
		currentSlide = $(this).data("slide");
		updateCarousel();
	});

	// Nhấn vào mũi tên
	$(".carousel__arrow-btn").on("click", function () {
		currentSlide = (currentSlide + 1) % totalSlides;
		updateCarousel();
	});

	function updateCarousel() {
		$(".carousel__slide").removeClass("carousel__slide--active");
		$(".carousel__slide").eq(currentSlide).addClass("carousel__slide--active");

		$(".carousel__dot").removeClass("carousel__dot--active");
		$(".carousel__dot").eq(currentSlide).addClass("carousel__dot--active");

		if ($(window).width() <= 768) {
			// Mobile: Khoảng cách di chuyển = 100% chiều rộng màn hình
			$(".carousel__track").css(
				"transform",
				`translateX(${-currentSlide * 100}%)`
			);
		} else {
			// Desktop: Khoảng cách di chuyển = vị trí hiện tại nhân với (độ rộng của một slide + gap)
			$(".carousel__track").css(
				"transform",
				`translateX(${-currentSlide * (372 + 24)}px)`
			);
		}
	}
});
