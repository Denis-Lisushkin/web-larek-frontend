# Проектная работа "Веб-ларек"

  

Стек: HTML, SCSS, TS, Webpack

  

Структура проекта:

- src/ — исходные файлы проекта

- src/components/ — папка с JS компонентами

- src/components/base/ — папка с базовым кодом

  

Важные файлы:

- src/pages/index.html — HTML-файл главной страницы

- src/types/index.ts — файл с типами

- src/index.ts — точка входа приложения

- src/styles/styles.scss — корневой файл стилей

- src/utils/constants.ts — файл с константами

- src/utils/utils.ts — файл с утилитами

  

## Установка и запуск

Для установки и запуска проекта необходимо выполнить команды

  

```

npm install

npm run start

```

  

или

  

```

yarn

yarn start

```

## Сборка

  

```

npm run build

```

  

или

  

```

yarn build

```

## Интерфейсы проекта

### IProduct
Модель данных одиного товара.
```
  id: string;                 // Уникальный идентификатор товара
  description?: string;       // Описание товара (необязательное поле)
  image: string;              // Ссылка на изображение товара
  title: string;              // Название товара
  category: string;           // Категория, к которой относится товар
  price: number | null;       // Цена товара (может быть null, если не указана)
  selected: boolean;          // Флаг: выбран ли товар (например, добавлен в корзину)
```
---
### ICart 
Модель корзины покупателя.
```
  items: IProduct[];          // Список товаров в корзине
  total: number;              // Общая стоимость товаров
```
---
### IOrder
Модель данных заказа.
```
  payment: string;            // Способ оплаты
  email: string;              // Email пользователя
  phone: string;              // Телефон пользователя
  address: string;            // Адрес доставки
  total: number;              // Общая сумма заказа
  items: string[];            // Массив ID товаров в заказе
```
---
### IOrderResult
модель данных оформленного заказа.
```
  id: string;                 // Уникальный идентификатор заказа
  total: number;              // Итоговая сумма заказа
```
---
### IAppData
Главный интерфейс приложения: содержит данные и управляющие методы.

#### Свойства:
```
  products: IProduct[];       // Список всех доступных товаров
  cart: ICart;                // Текущая корзина
  order: IOrder;              // Текущий заказ
```
#### методы:
```
  setProducts(products: IProduct[]): void;                     // Установить список товаров
  addProductToCart(item: IProduct): void;                      // Добавить товар в корзину
  removeProductFromCart(item: IProduct): void;                 // Удалить товар из корзины
  getCartTotal(): number;                                      // Получить общую стоимость корзины
  getCartCounter(): number;                                    // Получить количество товаров в корзине
  setOrderField(field: keyof IOrderForm, value: string): void; // Установить поле в форме заказа
  setContactField(field: keyof IOrderForm, value: string): void; // Установить поле в форме кантактов
  setOrderProductsList(): void;                                // Заполнить список товаров для заказа
  validateForm(formName: 'order' | 'contacts'): boolean;       // Проверить валидность формы
  resetCart(): void;                                           // Очистить корзину
  resetOrder(): void;                                          // Очистить форму заказа
  resetSelectedProducts(): void;                               // Сбросить флаг выбора у всех товаров
  resetOrderAndCart(): void;                                   // Полностью сбросить корзину и заказ
``` 
---
### ILarekAPI 
Интерфейс для класса работы с API
```
getProductsList: () => Promise<IProduct[]>;              // Получить список всех товаров с сервера
orderProducts: (order: IOrder) => Promise<IOrderResult>; // Отправить заказ на сервер
```
---
### IPage 
Интерфейс главной страницы
```
counter: number;              // Количество товаров в корзине
catalog: HTMLElement[];       // DOM-элементы карточек товаров
scrollLocked: boolean;        // Заблокирована ли прокрутка (например, при открытом модальном окне)
```
---
### ICartView 
Отображение корзины
```
items: HTMLElement[];       // DOM-элементы товаров в корзине
title: string;              // Заголовок
total: number;              // Общая сумма товаров в корзине
button: HTMLElement;        // Кнопка оформления заказа
```
---
### IProductInCart extends IProduct 
Интерфейс карточки товара в корзине
```
index: number;                    // Индекс позиции в списке корзины
title: string;                    // Название товара
price: number;                    // Цена товара (гарантированно не null)
buttonDelete: HTMLButtonElement;  // Кнопка удаления товара из корзины
```
---
### IOrderForm
Отоброжение формы заказа.
```
  payment: string;            // Способ оплаты
  address: string;            // Адрес доставки
  email: string;              // Email пользователя
  phone: string;              // Телефон пользователя
```
---
### ISuccessView
Отображение  окна успешного оформления заказа
```
total: number;                // Итоговая сумма заказа
```
---
### IModalData
Интерфейс модального окна
```
content: HTMLElement;         // Контент, который нужно отобразить в модальном окне
```
---
### IFormState 
Интерфейс родительского класса форм
```
valid: boolean;               // Флаг валидности формы
errors: string[];             // Список ошибок при валидации
```
---

## Архитектура
Приложение построено по архитектурному паттерну **MVP (Model-View-Presenter)**.

В качестве механизма взаимодействия между компонентами используется брокер событий, что позволяет добиться слабой связанности и повысить масштабируемость кода.

Бизнес-логика вынесена в презентеры, модель хранит и управляет данными, а представление отвечает только за отображение и реакцию на пользовательские действия.

## Базовые классы 

### Component `<T>`
это абстрактный базовый класс для компонентов отображения пользовательского интерфейса , от которого можно наследоваться при создании конкретных компонентов отображения . Он служит основой для всех  компонентов в приложении, предоставляя общие методы для работы с DOM и шаблонный метод render.

**Свойства:** 
`protected readonly container: HTMLElement  // Корневой DOM-элемент `
**Конструктор:**
`protected constructor(protected readonly container: HTMLElement)`
**Методы:**
- toggleClass(element: HTMLElement, className: string, force?: boolean) // Переключить класс
- protected setText(element: HTMLElement, value: unknown) // Установить текстовое содержимое 
- setDisabled(element: HTMLElement, state: boolean) // Сменить статус блокировки 
- protected setImage(element: HTMLImageElement, src: string, alt?: string) // Установить изображение с альтернативным текстом 
- render(data?: Partial<T>): HTMLElement // Вернуть корневой DOM-элемент
---

### Api
Этот класс Api представляет собой универсальный базовый класс для работы с HTTP-запросами к API. Он упрощает выполнение GET, POST, PUT и DELETE запросов и автоматически обрабатывает ответы.

**Свойства:** 
```
readonly  baseUrl:  string;  //Базовый URL для API
protected  options:  RequestInit; //Параметры запроса
```
**Конструктор:**
```
constructor(baseUrl: string, options: RequestInit = {})
Конструктор инициализирует объект API с базовым URL и опциями запроса, устанавливая заголовок Content-Type на application/json.
```
**Методы:**
- `protected handleResponse(response: Response): Promise<object>` // Метод обрабатывает ответ от сервера
- `get(uri: string): Promise<object>`// Метод выполняет HTTP-запрос с методом GET по указанному URI, возвращая промис с результатом.
- `post(uri: string, data: object, method: ApiPostMethods = 'POST'):Promise<object>` // Метод выполняет HTTP-запрос с указанным методом (по умолчанию POST), отправляя данные в теле запроса.


### EventEmitter  
Это класс для работы с событиями в приложении. Он позволяет подписываться на события, инициировать события и обрабатывать данные, передаваемые с этими событиями. Он реализует брокер событий, что позволяет компонентам приложения взаимодействовать друг с другом без тесной связи.
interface  IEvents {
  on<T  extends  object>(event:  EventName, callback: (data:  T) =>  void):  void;
  emit<T  extends  object>(event:  string, data?:  T):  void;
  trigger<T  extends  object>(event:  string, context?:  Partial<T>): (data:  T) =>  void;
**Свойства:** 
```
_events:  Map<EventName, Set<Subscriber>> // Хранит подписчиков на события
```
**Конструктор:**
```
constructor() {this._events = new Map<EventName, Set<Subscriber>>()} //Инициализирует объект EventEmitter
```
**Методы:**
- `on <T extends object>(eventName: EventName, callback: (data: T) => void)` -  Добавляет обработчик (callback) для события (eventName).
- `emit<T extends object>(eventName: string, data?: T)` - Генерирует событие с переданными данными (data). Все подписчики на это событие будут вызваны.
- `off(eventName: EventName, callback: Subscriber)`- Удаляет обработчик для события.
- `onAll(callback: (event: EmitterEvent) => void)`- Позволяет подписаться на все события.
- `offAll()` - Очищает все события и их подписчиков.
- `trigger<T extends object>(eventName: string, context?: Partial<T>)` - Сделать коллбек триггер, генерирующий событие при вызове.

## Слой Model
### AppData
Это основной класс для хранения и управления данными приложения. Он реализует интерфейс IAppData и используется для работы с товарами, корзиной и оформлением заказа. Также он интегрирован с брокером событий (IEvents), чтобы уведомлять другие компоненты об изменениях.
 
 **Свойства:** 
```
products: IProduct[] //Список товаров (массив объектов IProduct)
cart: ICart = { items: [], total: 0 }  //Корзина пользователя, включающая список товаров и общую сумму.
order: IOrder = {
	payment:  '',
	email:  '',
	phone:  '',
	address:  '',
	total:  0,
	items: [],
};  //Заказ пользователя, включая платежную информацию, контактные данные, адрес и список товаров.
```
**Конструктор:**
```
constructor(protected events: IEvents) {} //Конструктор инициализирует класс AppData с объектом событий (IEvents)
```
**Методы:**
- setProducts(products: IProduct[]): void;                     // Установить список товаров
- addProductToCart(item: IProduct): void;                      // Добавить товар в корзину
-  removeProductFromCart(item: IProduct): void;                 // Удалить товар из корзины
  - getCartTotal(): number;                                      // Получить общую стоимость корзины
  - getCartCounter(): number;                                    // Получить количество товаров в корзине
  - setOrderField(field: keyof IOrderForm, value: string): void; // Установить поле в форме заказа
  - setContactField(field: keyof IOrderForm, value: string): void; // Установить поле в форме кантактов
  - setOrderProductsList(): void;                                // Заполнить список товаров для заказа
  - validateForm(formName: 'order' | 'contacts'): boolean;       // Проверить валидность формы
  - resetCart(): void;                                           // Очистить корзину
  - resetOrder(): void;                                          // Очистить форму заказа
 -  resetSelectedProducts(): void;                               // Сбросить флаг выбора у всех товаров
  - resetOrderAndCart(): void;                                   // Полностью сбросить корзину и заказ

### LarekAPI extends Api implements ILarekAPI
Класс LarekAPI наследуется от базового класса Api, который предоставляет общие методы для взаимодействия с API. Он также реализует интерфейс ILarekAPI, что гарантирует наличие методов для работы с продуктами и заказами.
**Свойства:** 
```
readonly  cdn:  string //Адрес CDN, который используется для формирования ссылок на изображения товаров.
```
**Конструктор:**
```
constructor(cdn: string, baseUrl: string, options?: RequestInit) //Конструктор вызывает конструктор родительского класса Api с передачей baseUrl и options. Он также сохраняет значение cdn, которое будет использовано для формирования полных ссылок на изображения товаров.
```
**Методы:**
- getProductsList(): Promise`<IProduct[]>` - Метод выполняет GET-запрос на /product для получения списка продуктов с сервера. Ответ от API обрабатывается в виде объекта типа ApiListResponse`<IProduct>` , из которого извлекаются товары. Для каждого товара добавляется полный путь к изображению. Возвращает промис с массивом объектов IProduct, в котором каждый товар включает полный путь к изображению (формируется на основе cdn).
- orderProducts(order: IOrder): Promise`<IOrderResult>`- Метод выполняет POST-запрос на /order для отправки данных заказа на сервер. Параметр order представляет собой объект, содержащий информацию о заказе (например, товары, контактные данные и адрес).


## Слой View
Слой **View** (представление) — это часть архитектуры приложения, которая отвечает за отображение данных пользователю и взаимодействие с ним.

 

Класс **Page** представляет главную страницу приложения, где отображается каталог товаров и иконка корзины. Наследуется от класса Component.
**Свойства:** 
```
protected  _cartCounter:  HTMLElement //Счетчик количества товаров в корзине
protected  _productsCatalog:  HTMLElement //Контейнер с карточками товаров
protected  _cart:  HTMLElement //Элемент иконки корзины
protected  _pageWrapper:  HTMLElement //Обертка всей страницы, используется для блокировки прокрутки
```
**Конструктор:**
```
constructor(container: HTMLElement, protected events: IEvents) //Инициализирует DOM-элементы. Добавляет обработчик клика по корзине
```
**Методы:**
 - cartCounter: number  - Обновляет значение счетчика товаров в корзине
- productsCatalog: HTMLElement[]  - Перерисовывает каталог товаров на странице
- scrollLocked: boolean - Переключает класс блокировки прокрутки страницы (page__wrapper_locked)
---

Класс **Card  extends  Component`<IProduct>`** представляет карточку товара в каталоге. Наследуется от базового класса Component и управляет отображением информации о товаре: названия, изображения, категории и цены. Также может реагировать на клики.
**Свойства:** 
```
protected  _image:  HTMLImageElement //Название товара
protected  _title:  HTMLElement      //Изображение товара
protected  _category:  HTMLElement   //Категория товара
protected  _price:  HTMLElement      //Цена товара
```
**Конструктор:**
```
constructor(container: HTMLElement, actions?: ICardActions) //Инициализирует DOM-элементы карточки.
```
**Методы:**
- get  id():  string - получение идентификатора товара
- set  id(value:  string) - сеттер идентификатора товара
- get  title():  string -получение названия товара
- set  title(value:  string) -сеттер названия товара 
- set  category(value:  string) - сеттер категории товара
- set  image(value:  string) -сеттер изображения товара
- set  price(value:  number  |  null) -сеттер цены тоара
- --

- Класс **CardPreview  extends  Card** расширяет Card и используется для отображения карточки товара в модальном окне (предпросмотр).
**Свойства:** 
```
protected  _description:  HTMLElement //Текстовое описание
protected  _button:  HTMLButtonElement //Кнопка “Добавить в корзину”
```
**Конструктор:**
```
constructor(container: HTMLElement, actions?: ICardActions) //Вызов родительского конструктора. Находит DOM-элементы описания и кнопки.
```
**Методы:**
- set  description(value:  string) - сеттер описания товара
- set  price(value:  number  |  null) - Переопределённый set price в CardPreview 
- set  selected(value:  boolean) - сеттер кнопки добавления в корзину 
---
Класс **Cart  extends  Component`<ICartView>`** отвечает за отображение окна корзины. Наследуется от Component и управляет заголовком, списком товаров, общей стоимостью и кнопкой оформления заказа.
**Свойства:** 
```
protected  _title:  HTMLElement        //Заголовок модального окна
protected  _list:  HTMLElement         //Контейнер со списком товаров
protected  _total:  HTMLElement        //Элемент с общей суммой
protected  _button:  HTMLButtonElement //Кнопка оформления заказа
```
**Конструктор:**
```
constructor(container:  HTMLElement, protected  events:  IEvents) //Находит все нужные элементы в DOM. Назначает обработчик на кнопку
```
**Методы:**
- set  items(items:  HTMLElement[]) - сеттер списка товаров 
- set  total(total:  number) - сеттер суммы корзины
---
Класс **CartProduct  extends  Component`<IProductInCart>`** представляет карточку одного товара внутри корзины. Отображает порядковый номер, название, цену товара и содержит кнопку удаления.
**Свойства:** 
```
protected  _index:  HTMLElement //Порядковый номер товара в списке
protected  _buttonDelete:  HTMLButtonElement //Кнопка удалеия товара
protected  _title:  HTMLElement //Название товара в списке
protected  _price:  HTMLElement //Цена товара в списке
```
**Конструктор:**
```
constructor(container:  HTMLElement, actions?:  ICartActions) //Находит все нужные элементы в DOM. Назначает обработчик на кнопку удаления
```
**Методы:** 
- set  index(value:  number) - сеттер номера товара в корзине
- set  title(value:  string) - сеттер названия товара в корзине
- set  price(value:  string) - сеттер цены товара в корзине
- ---
Класс **OrderForm  extends  Form`<Pick<IOrderForm, 'payment'  |  'address'>>`** отвечает за отображение и управление первой частью формы заказа — выбором способа оплаты и вводом адреса доставки.
**Свойства:** 
```
protected  _address:  HTMLInputElement //Поле ввода адреса
protected  _online:  HTMLButtonElement //Кнопка оплаты “онлайн”
protected  _inPerson:  HTMLButtonElement //Кнопка оплаты “при получении”
```
**Конструктор:**
```
constructor(container:  HTMLFormElement, events:  IEvents) Находит DOM-элементы.Навешивает обработчики на кнопки оплаты. Меняет активные классы.Передаёт значение через onInputChange.
```
**Методы:**
- set address(value: string) - устанавливает значение в поле.
- resetPaymentButtons() - сбрасывает стиль активных кнопок.
---
Класс **ContactsForm  extends  Form`<Pick<IOrderForm, 'email'  |  'phone'>>`** управляет второй частью формы заказа — контактными данными покупателя. 
**Свойства:** 
```
protected  _email:  HTMLInputElement //Поле ввода почты
protected  _phone:  HTMLInputElement //Поле ввода номерателефона
```
**Конструктор:**
```
constructor(container:  HTMLFormElement, events:  IEvents)
Находит DOM-элементы.
```
**Методы:**
- set  email(value:  string) - сеттер элкктронной почты
- set  phone(value:  string) - сеттер номера телефона
---
Класс **Success  extends  Component`<ISuccessView>`** отвечает за отображение в модальном окне информации о успешном заказе. Наследуется от класса  Component.
**Свойства:** 
```
protected  _total:  HTMLElement //Элемент DOM, в который выводится текст с информацией о списании суммы.
protected  _button:  HTMLButtonElement //Кнопка закрытия окна успешного заказа.
```
**Конструктор:**
```
constructor(container: HTMLElement, protected events: IEvents) //Вызывает конструктор родительского класса Component, передавая container.
```
**Методы:**
- set total(value: number) - сеттер общей суммы заказа
---
Класс **Modal  extends  Component`<IModalData>`** представляет модальное окно, которое используется для отображения различных типов информации в интерфейсе. Наследуется от класса Component
**Свойства:** 
```
protected  _closeButton:  HTMLButtonElement //Кнопка закрытия модального окна
protected  _content:  HTMLElement //Внутренний контейнер, куда подставляется содержимое модального окна.
```
**Конструктор:**
```
constructor(container:  HTMLElement, protected  events:  IEvents)
container — DOM-элемент модального окна. events — объект событий.
```
**Методы:**
- set content(value: HTMLElement) - Сеттер, который заменяет содержимое в контейнере модального окна
- open(): void - Открывает модальное окно, Добавляет класс modal_active контейнеру.
- close(): void - Закрывает модальное окно. Убирает класс modal_active у контейнера. Очищает содержимое (передаёт null в сеттер content).
- render(data: IModalData): HTMLElement - Рендерит модальное окно, Вызывает super.render(data) -класса Component. Открывает окно. Возвращает контейнер
---
Класс **Form<T> extends  Component`<IFormState>`** представляет собой основу для создания форм в приложении. Он предоставляет функционал для обработки ввода, валидации, отправки данных и отображения ошибок. Наследуется от класса  Component.
**Свойства:** 
```
protected  _submit:  HTMLButtonElement //Кнопка отправки формы (type=submit)
protected  _errors:  HTMLElement //Контейнер для отображения ошибок
```
**Конструктор:**
```
onstructor(protected container: HTMLFormElement, protected events: IEvents) //Вызывает super(container) — базовая инициализация от Component. Ищет кнопку submit и контейнер ошибок.Навешивает слушатели:
input — при изменении поля вызывает onInputChange.
submit — отменяет поведение по умолчанию и генерирует событие formName:submit.
```
**Методы:**
- onInputChange(field: keyof T, value: string) - Вызывается при любом вводе в поле формы. Эмитит событие вида: formName.fieldName:change
- set valid(value: boolean) - Сеттер, который блокирует или разблокирует кнопку отправки формы, в зависимости от валидности.
- set errors(value: string) - Сеттер, который устанавливает текст ошибок валидации формы.
- render(state: Partial`<T>` & IFormState): HTMLElement - Метод, обновляющий состояние формы. Отдаёт управление базовому Component.render().
Обновляет все поля формы. Возвращает DOM-элемент формы.

## Presenter

В нашем приложении роль презентера выполняет брокер событий `EventEmitter`. Брокер событий управляет взаимодействием между компонентами представления (Views) и моделью (Model), передавая события между ними и обеспечивая логику обновления данных, реагируя на действия пользователя. Все события, связанные с действиями пользователя (например, добавление товара в корзину, отправка формы, открытие модальных окон), передаются через брокер. Он слушает события от компонентов представления, обновляет модель и уведомляет компоненты представления о необходимых изменениях, например, обновлении UI или изменении состояния данных.

### Список событий
- **products:changed** - Обновляет отображение каталога товаров на странице, перерисовывая карточки товаров, когда их данные изменяются. В нашем случае при получении нового списка продуктов с сервера.
- **card:open** - Открывает карточку товара в модальном окне для просмотра подробной информации о продукте.
- **card:addToCart** -  Добавляет выбранный товар в корзину.
- **cart:open** - Открывает модальное окно корзины с товарами, которые были добавлены в корзину.
- **card:removeFromCart** - Удаляет товар из корзины.
- **modal:open** - Блокирует прокрутку страницы, когда открывается модальное окно.
- **modal:close** - Разблокирует прокрутку страницы, когда закрывается модальное окно.
- **order:started** - Инициализирует отображение формы заказа, если пользователь начинает оформление заказа.
- **orderFormErrors:change** - Обновляет состояние валидации формы заказа и выводит ошибки при неправильном вводе.
- **contactsFormErrors:change** - Обновляет состояние валидации формы контактов и выводит ошибки при неправильном вводе.
- **order:submit** - Обрабатывает отправку формы заказа, переходя к следующему этапу (ввод контактных данных).
- **contacts:submit** - Отправляет заказ на сервер, если пользователь заполнил контактные данные и подтверждает заказ.
- **order:success** - Отображает окно с успешным завершением заказа, показывая итоговую сумму.
- **success:close** - Закрывает окно с подтверждением успешного оформления заказа.

