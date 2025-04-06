import { ensureElement } from '../../utils/utils';
import { Component } from '../base/Component';
import { IEvents } from '../base/Events';

// интерфейс окна удчного заказа
interface ISuccessView {
	total: number;
}

// Класс создания окна удачного заказа
export class Success extends Component<ISuccessView> {
	protected _total: HTMLElement;
	protected _button: HTMLButtonElement;

	constructor(container: HTMLElement, protected events: IEvents) {
		super(container);

		this._total = ensureElement<HTMLElement>(
			'.order-success__description',
			this.container
		);
		this._button = ensureElement<HTMLButtonElement>(
			'.order-success__close',
			this.container
		);

		if (this._button) {
			this._button.addEventListener('click', () =>
				events.emit('success:close')
			);
		}
	}

	// сеттер общей суммы заказа
	set total(value: number) {
		this.setText(this._total, 'Списано ' + '' + value + '' + ' синапсов');
	}
}
