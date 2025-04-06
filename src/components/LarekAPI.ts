import { Api, ApiListResponse } from './base/Api';
import { IOrder, IProduct, IOrderResult } from '../types';

// интерфейс для класса работы с API
export interface ILarekAPI {
	getProductsList: () => Promise<IProduct[]>;
	orderProducts: (order: IOrder) => Promise<IOrderResult>;
}

// Класс для работы с API
export class LarekAPI extends Api implements ILarekAPI {
	readonly cdn: string;
	constructor(cdn: string, baseUrl: string, options?: RequestInit) {
		super(baseUrl, options);
		this.cdn = cdn;
	}

  // Метод получения списка товаров сервера 
	getProductsList(): Promise<IProduct[]> {
		return this.get('/product').then((data: ApiListResponse<IProduct>) =>
			data.items.map((item) => ({ ...item, image: this.cdn + item.image }))
		);
	}

  // Метод для отправки заказа на сервер
	orderProducts(order: IOrder): Promise<IOrderResult> {
		return this.post('/order', order).then((data: IOrderResult) => data);
	}
}
