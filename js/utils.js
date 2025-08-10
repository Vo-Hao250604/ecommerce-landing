// Định dạng số tiền với dấu chấm phân tách hàng nghìn
export function formatPrice(price) {
	return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
}
