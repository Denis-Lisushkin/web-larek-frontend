export interface IProduct {
  id: string;           
  description?: string;  
  image: string;        
  title: string;        
  category: string;     
  price: number | null;
  selected: boolean;   
}

export interface ICart {
  items: IProduct[];
  total: number;
}

export interface IOrder {
  payment: string;     
  email: string;        
  phone: string;       
  address: string;      
  total: number;        
  items: string[];      
}

export interface IOrderForm {
  payment: string;
  address: string;
  email: string;
  phone: string;
}

export interface IOrderResult {
  id: string; 
  total: number;
}

export interface IAppData {
	products: IProduct[];
	cart: ICart;
	order: IOrder;

	setProducts(products: IProduct[]): void;
	addProductToCart(item: IProduct): void;
	removeProductFromCart(item: IProduct): void;
	getCartTotal(): number;
	getCartCounter(): number;
	setOrderField(field: keyof IOrderForm, value: string): void;
	setContactField(field: keyof IOrderForm, value: string): void;
	setOrderProductsList(): void;
	validateForm(formName: 'order' | 'contacts'): boolean;
	resetCart(): void;
	resetOrder(): void;
	resetSelectedProducts(): void;
	resetOrderAndCart(): void;
}
