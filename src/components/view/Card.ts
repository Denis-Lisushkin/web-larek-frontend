import { Component } from '../base/Component';
import { ensureElement } from '../../utils/utils';
import { IProduct } from '../../types/index';
import { settings } from '../../utils/constants';

export interface ICardActions {
	onClick: (event: MouseEvent) => void;
}

// Класс создания карточки товара
export class Card extends Component<IProduct> {
	protected _image: HTMLImageElement;
	protected _title: HTMLElement;
	protected _category: HTMLElement;
	protected _price: HTMLElement;

	constructor(container: HTMLElement, actions?: ICardActions) {
		super(container);

		this._title = ensureElement<HTMLElement>('.card__title', container);
		this._image = ensureElement<HTMLImageElement>('.card__image', container);
		this._category = container.querySelector('.card__category');
		this._price = container.querySelector('.card__price');

		if (actions?.onClick) {
			container.addEventListener('click', actions.onClick);
		}
	}

	// получение идентификатора товара
	get id(): string {
		return this.container.dataset.id || '';
	}

	// сеттер  идентификатора товара
	set id(value: string) {
		this.container.dataset.id = value;
	}

	// получение названия товара
	get title(): string {
		return this._title.textContent || '';
	}

	// сеттер названия товара
	set title(value: string) {
		this.setText(this._title, String(value));
	}

	// сеттер категории товара
	set category(value: string) {
		this.setText(this._category, value);
		this._category.className = `card__category card__category_${settings.categories[value]}`;
	}

	// сеттер изображения товара
	set image(value: string) {
		this.setImage(this._image, value);
		//this._image.src = value;
	}

	// устанавливаю цену
	set price(value: number | null) {
		if (value === null) {
			this.setText(this._price, 'Бесценно');
		} else {
			this.setText(this._price, value + ' синапсов');
		}
	}
}

// Класс предпросмотра карточки товара
export class CardPreview extends Card {
	protected _description: HTMLElement;
	protected _button: HTMLButtonElement;

	constructor(container: HTMLElement, actions?: ICardActions) {
		super(container, undefined);

		this._description = ensureElement<HTMLElement>('.card__text', container);
		this._button = ensureElement<HTMLButtonElement>('.card__button', container);

		if (actions?.onClick) {
			this._button.addEventListener('click', actions.onClick);
		}
	}

	// сеттер описания товара
	set description(value: string) {
		this.setText(this._description, value);
	}

	// Переопределённый set price в CardPreview
	set price(value: number | null) {
		super.price = value;
		this.setDisabled(this._button, value === null);
	}
	// сеттер кнопки добавления в корзину
	set selected(value: boolean) {
		this.setDisabled(this._button, value);
	}
}
