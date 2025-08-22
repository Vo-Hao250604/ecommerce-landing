$(function () {
	// Nhấn đóng/mở header menu
	$(".header__menu-btn").on("click", function () {
		$(".header").toggleClass("menu-open");
		$("body").toggleClass("no-scroll");
	});
});
