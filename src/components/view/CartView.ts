import { IProduct } from '../../types';
import { ensureElement } from '../../utils/utils';
import { Component } from '../base/component';
import { IEvents } from '../base/events';

// интерфейс окна корзины
export interface ICartView {
	items: HTMLElement[];
	title: string;
	total: number;
	button: HTMLElement;
}

interface ICartActions {
	onClick: (event: MouseEvent) => void;
}

// Класс создания корзины
export class Cart extends Component<ICartView> {
	protected _title: HTMLElement;
	protected _list: HTMLElement;
	protected _total: HTMLElement;
	protected _button: HTMLButtonElement;

	constructor(container: HTMLElement, protected events: IEvents) {
		super(container);

		this._title = ensureElement<HTMLElement>('.modal__title', this.container);
		this._list = ensureElement<HTMLElement>('.basket__list', this.container);
		this._button = ensureElement<HTMLButtonElement>('.basket__button',this.container);
		this._total = ensureElement<HTMLElement>('.basket__price', this.container);

		if (this._button) {
			this._button.addEventListener('click', () => {
				this.events.emit('order:started');
			});
		}
	}

	// сеттер списка товаров
	set items(items: HTMLElement[]) {
		this._list.replaceChildren(...items);
	}

  // сеттер суммы корзины
	set total(total: number) {
		this._total.textContent = total + ' синапсов';
		this._button.disabled = total > 0 ? false : true;
	}
}

// интерфейс карточки товара в корзине
export interface IProductInCart extends IProduct {
	index: number;
	title: string;
	buttonDelete: HTMLButtonElement;
	price: number;
}


// Класс создания карточки товара в корзине
export class CartProduct extends Component<IProductInCart> {
	protected _index: HTMLElement;
	protected _buttonDelete: HTMLButtonElement;
	protected _title: HTMLElement;
	protected _price: HTMLElement;

	constructor(container: HTMLElement, actions?: ICartActions) {
		super(container);

		this._index = ensureElement<HTMLElement>('.basket__item-index', this.container);
		this._title = ensureElement<HTMLElement>('.card__title', this.container);
		this._price = ensureElement<HTMLElement>('.card__price', this.container);
		this._buttonDelete = ensureElement<HTMLButtonElement>('.basket__item-delete', this.container);

		if (this._buttonDelete) {
			this._buttonDelete.addEventListener('click', (evt) => {
				this.container.remove();
				actions?.onClick(evt);
			});
		}
	}
  // сеттер номера товара в корзине
	set index(value: number) {
		this._index.textContent = value.toString();
	}

  // сеттер названия товара в корзине
	set title(value: string) {
		this._title.textContent = value;
	}

  // сеттер цены товара в корзине
	set price(value: string) {
		if (value === null) {
			this._price.textContent = 'Бесценно';
		} else {
			this._price.textContent = value + ' синапсов';
		}
	}
}
