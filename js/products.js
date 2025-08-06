import * as API from "./api.js";
import { formatPrice } from "./utils.js";

$(document).ready(function () {
	$.get(API.products, function (data) {
		let html = "";

		if (data.length === 0) {
			$("#productsList").replaceWith(`
        <div class="section--no-content">No products available :'(</div>
      `);
			return;
		}

		data.forEach(function (product) {
			// Helper function to format price with dots
			html += `
      <div class="product-card">
        <img
          src="${product.images[0]}"
          class="product-card__image"
          alt="Syltherine"
        />
        <div class="product-card__overlay">
          <a href="#" class="product-card__button">Add to cart</a>

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
										Math.round((product.price * (100 - product.discount)) / 100)
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

		$("#productsList").html(html);
	});
});
