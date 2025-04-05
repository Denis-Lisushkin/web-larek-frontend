import { IEvents } from '../base/events';
import { IOrderForm } from '../../types/index';
import { Form } from '../common/Form';
import { ensureElement } from '../../utils/utils';

// Класс создания формы заказа 
export class OrderForm extends Form<Pick<IOrderForm, 'payment' | 'address'>> {
	protected _address: HTMLInputElement;
	protected _online: HTMLButtonElement;
	protected _inPerson: HTMLButtonElement;

	constructor(container: HTMLFormElement, events: IEvents) {
		super(container, events);

		this._address = ensureElement<HTMLInputElement>('input[name="address"]', this.container);
		this._online = ensureElement<HTMLButtonElement>('button[name="card"]', this.container);
		this._inPerson = ensureElement<HTMLButtonElement>('button[name="cash"]', this.container);

		this._online.addEventListener('click', () => {
			this._online.classList.add('button_alt-active');
			this._inPerson.classList.remove('button_alt-active');
			this.onInputChange('payment', 'онлайн');
		});

		this._inPerson.addEventListener('click', () => {
			this._inPerson.classList.add('button_alt-active');
			this._online.classList.remove('button_alt-active');
			this.onInputChange('payment', 'при получении');
		});
	}
  
  //сеттер адресса
	set address(value: string) {
		this._address.value = value;
	}

  //сброс кнопок способов оплаты
	resetPaymentButtons() {
		this._online.classList.remove('button_alt-active');
		this._inPerson.classList.remove('button_alt-active');
	}
}


// Класс создания формы контактов
export class ContactsForm extends Form<Pick<IOrderForm, 'email' | 'phone'>> {
	protected _email: HTMLInputElement;
	protected _phone: HTMLInputElement;

	constructor(container: HTMLFormElement, events: IEvents) {
		super(container, events);

		this._email = ensureElement<HTMLInputElement>('input[name="email"]', this.container);
		this._phone = ensureElement<HTMLInputElement>('input[name="phone"]', this.container);
	}

  // сеттер элкктронной почты
	set email(value: string) {
		this._email.value = value;
	}

  // сеттер номера телефона
	set phone(value: string) {
		this._phone.value = value;
	}
}
