import './scss/styles.scss';
import { LarekAPI } from './components/LarekAPI';
import { API_URL, CDN_URL } from './utils/constants';
import { EventEmitter } from './components/base/Events';
import { cloneTemplate, createElement, ensureElement } from './utils/utils';
import { Page } from './components/view/PageView';
import { Modal } from './components/common/Modal';
import { Card, CardPreview } from './components/view/Card';
import { Cart, CartProduct } from './components/view/CartView';
import { AppData } from './components/AppData';
import { IProduct, IOrderForm, IOrderResult } from './types';
import { OrderForm, ContactsForm } from './components/view/OrderView';
import { Success } from './components/view/SuccessView';

const api = new LarekAPI(CDN_URL, API_URL);
const events = new EventEmitter();
const appData = new AppData(events);

const cardCatalogTemplate = ensureElement<HTMLTemplateElement>('#card-catalog');
const cardPreviewTemplate = ensureElement<HTMLTemplateElement>('#card-preview');
const cartTemplate = ensureElement<HTMLTemplateElement>('#basket');
const cardInCartTemplate = ensureElement<HTMLTemplateElement>('#card-basket');
const orderFormTemplate = ensureElement<HTMLTemplateElement>('#order');
const contactsFormTemplate = ensureElement<HTMLTemplateElement>('#contacts');
const successTemplate = ensureElement<HTMLTemplateElement>('#success');

const page = new Page(document.body, events);
const modal = new Modal(ensureElement<HTMLElement>('#modal-container'), events);
const cart = new Cart(cloneTemplate(cartTemplate), events);
const orderForm = new OrderForm(cloneTemplate(orderFormTemplate), events);
const contactsForm = new ContactsForm(
	cloneTemplate(contactsFormTemplate),
	events
);
const success = new Success(cloneTemplate(successTemplate), events);

api.getProductsList().then((products) => {
	appData.setProducts(products);
});

// отоброжение котолога товаров
events.on('products:changed', (items: IProduct[]) => {
	page.productsCatalog = items.map((item) => {
		const card = new Card(cloneTemplate(cardCatalogTemplate), {
			onClick: () => events.emit('card:open', item),
		});
		return card.render(item);
	});
});

// открытие карточки
events.on('card:open', (item: IProduct) => {
	const card = new CardPreview(cloneTemplate(cardPreviewTemplate), {
		onClick: () => events.emit('card:addToCart', item),
	});
	modal.render({
		content: card.render(item),
	});
	//modal.open();
});

// добавление товара в корзину
events.on('card:addToCart', (item: IProduct) => {
	item.selected = true;
	appData.addProductToCart(item);
	page.cartCounter = appData.getCartCounter();
	modal.close();
});

// открытие корзины
events.on('cart:open', (item: IProduct) => {
	const cartProducts = appData.cart.items.map((item, index) => {
		const cartProduct = new CartProduct(cloneTemplate(cardInCartTemplate), {
			onClick: () => events.emit('card:removeFromCart', item),
		});
		return cartProduct.render({
			index: index + 1,
			title: item.title,
			price: item.price,
		});
	});
	modal.render({
		content: cart.render({
			items: cartProducts,
			total: appData.getCartTotal(),
		}),
	});
});

// удаление товара из корзины
events.on('card:removeFromCart', (item: IProduct) => {
	appData.removeProductFromCart(item);
	item.selected = false;
	page.cartCounter = appData.getCartCounter();
	cart.total = appData.getCartTotal();
});

// блокировка прокрутки страницы
events.on('modal:open', () => {
	page.scrollLocked = true;
});

// разблокировка прокрутки страницы
events.on('modal:close', () => {
	page.scrollLocked = false;
});

// изменение одного из полей формы заказа
events.on(
	/^order\..*:change/,
	(data: { field: keyof IOrderForm; value: string }) => {
		appData.setOrderField(data.field, data.value);
	}
);

// изменение одного из полей формы контактов
events.on(
	/^contacts\..*:change/,
	(data: { field: keyof IOrderForm; value: string }) => {
		appData.setContactField(data.field, data.value);
	}
);

// Изменение состояния валидации формы заказа
events.on('orderFormErrors:change', (errors: Partial<IOrderForm>) => {
	const { payment, address } = errors;
	orderForm.valid = !payment && !address;
	orderForm.errors = Object.values({ payment, address })
		.filter((i) => !!i)
		.join('; ');
});

// Изменение  состояния валидации формы контактов
events.on('contactsFormErrors:change', (errors: Partial<IOrderForm>) => {
	const { email, phone } = errors;
	contactsForm.valid = !email && !phone;
	contactsForm.errors = Object.values({ email, phone })
		.filter((i) => !!i)
		.join('; ');
});

events.on('order:started', () => {
	modal.close();
	modal.render({
		content: orderForm.render({
			payment: appData.order.payment,
			address: appData.order.address,
			valid: appData.validateForm('order'),
			errors: [],
		}),
	});
});

events.on('order:submit', () => {
	modal.close();
	appData.order.total = appData.getCartTotal();
	appData.setOrderProductsList();
	modal.render({
		content: contactsForm.render({
			email: appData.order.email,
			phone: appData.order.phone,
			valid: appData.validateForm('contacts'),
			errors: [],
		}),
	});
});

events.on('contacts:submit', () => {
	api
		.orderProducts(appData.order)
		.then((result) => {
			orderForm.resetPaymentButtons();
			appData.resetOrderAndCart();
			page.cartCounter = appData.getCartCounter();
			events.emit('order:success', result);
		})
		.catch((error) => {
			console.error('Error:', error);
		});
});

events.on('order:success', (result: IOrderResult) => {
	modal.close();
	modal.render({
		content: success.render({
			total: result.total,
		}),
	});
});

events.on('success:close', () => {
	modal.close();
});
