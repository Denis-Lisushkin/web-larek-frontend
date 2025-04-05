import { Component } from '../base/component';
import { ensureElement } from '../../utils/utils';
import { IProduct } from '../../types/index';

export interface ICardActions {
	onClick: (event: MouseEvent) => void;
}

// Класс создания карточки товара
export class Card extends Component<IProduct> {
  protected _image: HTMLImageElement;
  protected _title: HTMLElement;
  protected _category: HTMLElement;
  protected _price: HTMLElement;
  protected _categories = <Record<string, string>>{
	  'дополнительное': 'additional',
    'софт-скил': 'soft',
    'кнопка': 'button',
    'хард-скил': 'hard',
    'другое': 'other',
  };

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
	this._title.textContent = String(value);
  }

  // сеттер категории товара
  set category(value: string) {
	this._category.textContent = value;
	this._category.className = `card__category card__category_${this._categories[value]}`;
  }

  // сеттер изображения товара
  set image(value: string) {
	this._image.src = value;
  }

	// устанавливаю цену
  set price(value: number | null) {
	if (value === null) {
	  this._price.textContent = 'Бесценно';
	} else {
	  this._price.textContent = value + ' синапсов';
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
	this._description.textContent = value;
  }

  // сеттер кнопки добавления в корзину
  set selected(value: boolean) {
	if (!this._button.disabled) {
	  this._button.disabled = value;
	}
  }
}
