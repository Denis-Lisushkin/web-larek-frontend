import { IEvents } from './base/Events';
import { IProduct, ICart, IOrder, IOrderForm, IAppData } from '../types';
import { settings } from '../utils/constants';

export class AppData implements IAppData {
	products: IProduct[] = [];
	cart: ICart = { items: [], total: 0 };
	order: IOrder = {
		payment: '',
		email: '',
		phone: '',
		address: '',
		total: 0,
		items: [],
	};

	constructor(protected events: IEvents) {}

	setProducts(products: IProduct[]) {
		this.products = products;
		this.events.emit('products:changed', this.products);
	}

	addProductToCart(item: IProduct) {
		this.cart.items.push(item);
		this.cart.total = this.getCartTotal();
	}

	removeProductFromCart(item: IProduct) {
		this.cart.items = this.cart.items.filter(
			(cartItem) => cartItem.id !== item.id
		);
		this.events.emit('cart:open');
	}

	getCartTotal() {
		return this.cart.items.reduce(
			(total, item) => total + (item.price ?? 0),
			0
		);
	}

	getCartCounter() {
		return this.cart.items.length;
	}

	setOrderField(field: keyof IOrderForm, value: string) {
		this.order[field] = value;
		this.validateForm('order');
	}

	setContactField(field: keyof IOrderForm, value: string) {
		this.order[field] = value;
		this.validateForm('contacts');
	}

	setOrderProductsList() {
		this.order.items = this.cart.items.map((item) => item.id);
	}

	validateForm(formName: 'order' | 'contacts') {
		const errors: Partial<IOrderForm> = {};

		if (formName === 'order') {
			if (!this.order.address) {
				errors.address = settings.errorMessages.address;
			}
			if (!this.order.payment) {
				errors.payment = settings.errorMessages.payment;
			}
			this.events.emit('orderFormErrors:change', errors);
		}

		if (formName === 'contacts') {
			if (!this.order.email) {
				errors.email = settings.errorMessages.email;
			}
			if (!this.order.phone) {
				errors.phone = settings.errorMessages.phone;
			}
			this.events.emit('contactsFormErrors:change', errors);
		}

		return Object.keys(errors).length === 0;
	}

	resetCart() {
		this.cart = { items: [], total: 0 };
	}
	resetOrder() {
		this.order = {
			payment: '',
			email: '',
			phone: '',
			address: '',
			total: 0,
			items: [],
		};
	}

	resetSelectedProducts() {
		this.products.forEach((item) => {
			if (item.price === null) {
				item.selected = true;
			} else {
				item.selected = false;
			}
		});
	}

	resetOrderAndCart() {
		this.resetCart();
		this.resetOrder();
		this.resetSelectedProducts();
	}
}
