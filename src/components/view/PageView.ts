import { ensureElement } from '../../utils/utils';
import { Component } from '../base/Component';
import { IEvents } from '../base/Events';

// интерфейс главной страницы
interface IPage {
	counter: number;
	catalog: HTMLElement[];
	scrollLocked: boolean;
}

// Класс создания главной страницы
export class Page extends Component<IPage> {
	protected _cartCounter: HTMLElement;
	protected _productsCatalog: HTMLElement;
	protected _cart: HTMLElement;
	protected _pageWrapper: HTMLElement;

	constructor(container: HTMLElement, protected events: IEvents) {
		super(container);
		this._cartCounter = ensureElement<HTMLElement>('.header__basket-counter');
		this._productsCatalog = ensureElement<HTMLElement>('.gallery');
		this._cart = ensureElement<HTMLElement>('.header__basket');
		this._pageWrapper = ensureElement<HTMLElement>('.page__wrapper');
		this._cart.addEventListener('click', () => {
			this.events.emit('cart:open');
		});
	}

	// сеттер счетчика товаров в корзине
	set cartCounter(value: number) {
		this.setText(this._cartCounter, String(value));
	}

	// сеттер католога товаров на странице
	set productsCatalog(items: HTMLElement[]) {
		this._productsCatalog.replaceChildren(...items);
	}

	// сеттер прокрутки страницы
	set scrollLocked(value: boolean) {
		this.toggleClass(this._pageWrapper, 'page__wrapper_locked', value);
	}
}
