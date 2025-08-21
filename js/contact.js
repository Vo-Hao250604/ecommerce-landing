$(function () {
	const $form = $(".contact-form");
	const $inputs = $(".contact-form__input, .contact-form__textarea");

	// Thêm class error và message
	function showError($input, message) {
		$input.addClass("contact-form__input--error");
		const $error = $('<div class="contact-form__error"></div>').text(message);
		$input.after($error);
	}

	// Xóa error và message
	function clearError($input) {
		$input.removeClass("contact-form__input--error");
		$input.next(".contact-form__error").remove();
	}

	// Validate từng field
	function validateField($input) {
		const value = $input.val().trim();
		const type = $input.attr("type");
		const name = $input.prev("label").text();

		clearError($input);

		if (!value) {
			showError($input, `${name} is required`);
			return false;
		}

		if (type === "email") {
			const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
			if (!emailRegex.test(value)) {
				showError($input, "Please enter a valid email address");
				return false;
			}
		}

		return true;
	}

	// Validate khi blur khỏi field
	$inputs.on("blur", function () {
		validateField($(this));
	});

	// Clear error khi focus vào field
	$inputs.on("focus", function () {
		clearError($(this));
	});

	// Validate khi submit form
	$form.on("submit", function (e) {
		e.preventDefault();
		let isValid = true;

		// Validate tất cả fields
		$inputs.each(function () {
			if (!validateField($(this))) {
				isValid = false;
			}
		});

		if (isValid) {
			// Thêm loading state
			const $submitBtn = $form.find(".contact-form__button");
			const originalText = $submitBtn.text();
			$submitBtn.prop("disabled", true).text("Sending...");

			// Giả lập gửi form (thay bằng API call thực tế sau)
			setTimeout(() => {
				// Reset form
				$form[0].reset();

				// Hiển thị chữ gửi thành công (hiển thị bằng nút submit)
				$submitBtn
					.text("Thank you! Your message has been sent.")
					.addClass("contact-form__button--success");

				// Reset lại nút gửi
				setTimeout(() => {
					$submitBtn
						.prop("disabled", false)
						.text(originalText)
						.removeClass("contact-form__button--success");
				}, 5000);
			}, 1500);
		}
	});
});
