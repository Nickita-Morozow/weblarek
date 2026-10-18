# Проектная работа "Веб-ларек"

Стек: HTML, SCSS, TS, Vite

Структура проекта:

- src/ — исходные файлы проекта
- src/components/ — папка с JS компонентами
- src/components/base/ — папка с базовым кодом

Важные файлы:

- index.html — HTML-файл главной страницы
- src/types/index.ts — файл с типами
- src/main.ts — точка входа приложения
- src/scss/styles.scss — корневой файл стилей
- src/utils/constants.ts — файл с константами
- src/utils/utils.ts — файл с утилитами

## Установка и запуск

Для установки и запуска проекта необходимо выполнить команды

```
npm install
npm run dev
```

или

```
yarn
yarn dev
```

### Настройка API

Для работы приложения необходимо создать файл `.env` в корне проекта и указать адрес API:

```env
VITE_API_ORIGIN=https://larek.ffapi.ru
```

После этого установите зависимости и запустите приложение:

```bash
npm install
npm run dev
```

Для создания production-сборки:

```bash
npm run build
```

## Сборка

```
npm run build
```

или

```
yarn build
```

# Интернет-магазин «Web-Larёk»

«Web-Larёk» — это интернет-магазин с товарами для веб-разработчиков, где пользователи могут просматривать товары, добавлять их в корзину и оформлять заказы. Сайт предоставляет удобный интерфейс с модальными окнами для просмотра деталей товаров, управления корзиной и выбора способа оплаты, обеспечивая полный цикл покупки с отправкой заказов на сервер.

## Архитектура приложения

Код приложения разделен на слои согласно парадигме MVP (Model-View-Presenter), которая обеспечивает четкое разделение ответственности между классами слоев Model и View. Каждый слой несет свой смысл и ответственность:

Model - слой данных, отвечает за хранение и изменение данных.  
View - слой представления, отвечает за отображение данных на странице.  
Presenter - презентер содержит основную логику приложения и отвечает за связь представления и данных.

Взаимодействие между классами обеспечивается использованием событийно-ориентированного подхода. Модели и Представления генерируют события при изменении данных или взаимодействии пользователя с приложением, а Презентер обрабатывает эти события используя методы как Моделей, так и Представлений.

### Базовый код

#### Класс Component

Является базовым классом для всех компонентов интерфейса.
Класс является дженериком и принимает в переменной `T` тип данных, которые могут быть переданы в метод `render` для отображения.

Конструктор:  
`constructor(container: HTMLElement)` - принимает ссылку на DOM элемент за отображение, которого он отвечает.

Поля класса:  
`container: HTMLElement` - поле для хранения корневого DOM элемента компонента.

Методы класса:  
`render(data?: Partial<T>): HTMLElement` - Главный метод класса. Он принимает данные, которые необходимо отобразить в интерфейсе, записывает эти данные в поля класса и возвращает ссылку на DOM-элемент. Предполагается, что в классах, которые будут наследоваться от `Component` будут реализованы сеттеры для полей с данными, которые будут вызываться в момент вызова `render` и записывать данные в необходимые DOM элементы.  
`setImage(element: HTMLImageElement, src: string, alt?: string): void` - утилитарный метод для модификации DOM-элементов `<img>`

#### Класс Api

Содержит в себе базовую логику отправки запросов.

Конструктор:  
`constructor(baseUrl: string, options: RequestInit = {})` - В конструктор передается базовый адрес сервера и опциональный объект с заголовками запросов.

Поля класса:  
`baseUrl: string` - базовый адрес сервера  
`options: RequestInit` - объект с заголовками, которые будут использованы для запросов.

Методы:  
`get(uri: string): Promise<object>` - выполняет GET запрос на переданный в параметрах ендпоинт и возвращает промис с объектом, которым ответил сервер  
`post(uri: string, data: object, method: ApiPostMethods = 'POST'): Promise<object>` - принимает объект с данными, которые будут переданы в JSON в теле запроса, и отправляет эти данные на ендпоинт переданный как параметр при вызове метода. По умолчанию выполняется `POST` запрос, но метод запроса может быть переопределен заданием третьего параметра при вызове.  
`handleResponse(response: Response): Promise<object>` - защищенный метод проверяющий ответ сервера на корректность и возвращающий объект с данными полученный от сервера или отклоненный промис, в случае некорректных данных.

#### Класс EventEmitter

Брокер событий реализует паттерн "Наблюдатель", позволяющий отправлять события и подписываться на события, происходящие в системе. Класс используется для связи слоя данных и представления.

Конструктор класса не принимает параметров.

Поля класса:  
`_events: Map<string | RegExp, Set<Function>>)` - хранит коллекцию подписок на события. Ключи коллекции - названия событий или регулярное выражение, значения - коллекция функций обработчиков, которые будут вызваны при срабатывании события.

Методы класса:  
`on<T extends object>(event: EventName, callback: (data: T) => void): void` - подписка на событие, принимает название события и функцию обработчик.  
`emit<T extends object>(event: string, data?: T): void` - инициализация события. При вызове события в метод передается название события и объект с данными, который будет использован как аргумент для вызова обработчика.  
`trigger<T extends object>(event: string, context?: Partial<T>): (data: T) => void` - возвращает функцию, при вызове которой инициализируется требуемое в параметрах событие с передачей в него данных из второго параметра.

## Данные

Тип данных `TPayment` описывает доступные формы оплаты заказа клиентом.

```ts
export type TPayment = "card" | "cash";
```

Тип данных `IProduct` описывает cтруктуру данных товара.

```ts
export interface IProduct {
  id: string;

  description: string;

  image: string;

  title: string;

  category: string;

  price: number | null;
}
```

Тип данных `IBuyer` описывает структуру данных покупателя.

```ts
export interface IBuyer {
  payment: TPayment;

  email: string;

  phone: string;

  address: string;
}
```

Тип данных `IBuyerData` описывает текущее состояние данных покупателя. Тип основан на `IBuyer`, но допускает значение `null` для способа оплаты.

```ts
export type IBuyerData = Omit<IBuyer, "payment"> & {
  payment: TPayment | null;
};
```

Тип данных `IBuyerErrors` описывает возможные ошибки при валидации данных покупателя. Ключами объекта могут быть поля `IBuyerData`, а значениями являются строки с текстами ошибок.

```ts
export type IBuyerErrors = Partial<Record<keyof IBuyerData, string>>;
```

Тип данных `IProductResponse` описывает данные ответа сервера при получении списка товаров.

```ts
export interface IProductResponse {
  total: number;

  items: IProduct[];
}
```

Тип данных `IOrder` описывает данные заказа, отправляемые на сервер при оформлении покупки.

```ts
export interface IOrder extends IBuyer {
  total: number;

  items: string[];
}
```

Тип данных `IOrderResponse` описывает ответ сервера после успешного оформления заказа.

```ts
export interface IOrderResponse {
  id: string;

  total: number;
}
```

## Модели данных

### Класс `Products`

Класс `Products` отвечает за хранение данных каталога товаров и товара, выбранного для подробного отображения, а также предоставляет методы для работы с этими данными.

Конструктор `Products(events?: IEvents)` принимает необязательный брокер событий и инициализирует пустой каталог товаров и устанавливает значение выбранного товара в `null`.

Поля класса:

`private items: IProduct[]` — массив товаров каталога.

`private currentItem: IProduct | null` — товар, выбранный для подробного отображения. Если товар не выбран, хранит `null`.

Методы класса:

`setItems(items: IProduct[]): void` — метод принимает в качестве аргумента массив товаров `items` типа `IProduct[]` и сохраняет его в каталоге, ничего не возвращает.

`getItems(): IProduct[]` — метод не принимает аргументов, возвращает каталог товаров в виде массива `IProduct[]`.

`getItem(id: string): IProduct | null` — метод принимает идентификатор товара `id` типа `string` и возвращает объект товара `IProduct` либо `null`, если товар не найден.

`setItem(item: IProduct): void` — метод принимает объект товара `item` типа `IProduct` и устанавливает его выбранным, ничего не возвращает.

`getCurrentItem(): IProduct | null` — метод не принимает аргументов, возвращает объект выбранного товара `IProduct` либо `null`, если товар не выбран.

### Класс `Basket`

Класс `Basket` отвечает за хранение товаров, выбранных покупателем, и управление содержимым корзины.

Конструктор `Basket(events?: IEvents)` принимает необязательный брокер событий и инициализирует пустой массив товаров.

Поля класса:

`private basketItems: IProduct[]` — массив товаров в корзине.

Методы класса:

`getItems(): IProduct[]` — метод не принимает аргументов, возвращает массив товаров в корзине типа `IProduct[]`.

`addToBasket(item: IProduct): void` — метод принимает объект товара `item` типа `IProduct` и добавляет его в массив товаров в корзине, ничего не возвращает.

`removeFromBasket(item: IProduct): void` — метод принимает объект товара `item` типа `IProduct` и удаляет его из корзины, ничего не возвращает.

`clearBasket(): void` — метод не принимает аргументов, удаляет все товары из корзины, ничего не возвращает.

`getTotalPrice(): number` — метод не принимает аргументов, подсчитывает и возвращает общую стоимость товаров в корзине типа `number`.

`getItemsNumber(): number` — метод не принимает аргументов, возвращает количество товаров в корзине типа `number`.

`isInBasket(itemId: string): boolean` — метод принимает идентификатор товара `itemId` типа `string`, проверяет наличие товара в корзине и возвращает `true`, если товар найден, иначе `false`.

### Класс `Buyer`

Класс `Buyer` отвечает за хранение информации о покупателе и управление его данными.

Конструктор `Buyer(events?: IEvents)` принимает необязательный брокер событий и инициализирует данные покупателя: способ оплаты значением `null`, адрес, телефон и email — пустыми строками.

Поля класса:

`private payment: TPayment | null` — выбранный способ оплаты. Если способ оплаты не выбран, хранит `null`.

`private address: string` — адрес доставки покупателя.

`private phone: string` — номер телефона покупателя.

`private email: string` — адрес электронной почты покупателя.

Методы класса:

`setData(data: Partial<IBuyerData>): void` — метод принимает данные покупателя `data` типа `Partial<IBuyerData>` в любом составе, записывает переданные значения в соответствующие поля, не изменяя остальные данные, ничего не возвращает.

`getData(): IBuyerData` — метод не принимает аргументов, возвращает данные покупателя типа `IBuyerData`.

`clearData(): void` — метод не принимает аргументов, очищает все данные покупателя и возвращает их в начальное состояние, ничего не возвращает.

`validateData(): IBuyerErrors` — метод не принимает аргументов, валидирует данные покупателя и возвращает объект ошибок типа `IBuyerErrors`. Если ошибок нет, возвращает пустой объект.

## Слой коммуникации

### Класс `CommApi`

Класс `CommApi` отвечает за взаимодействие приложения с API магазина: получение каталога товаров и отправку данных заказа на сервер.

Класс использует композицию: объект, соответствующий интерфейсу `IApi`, передаётся в конструктор `CommApi` и используется для выполнения запросов. Таким образом, класс `CommApi` зависит от интерфейса `IApi`, а не от конкретной реализации класса `Api`.

Конструктор класса:

`constructor(api: IApi)` — принимает объект `api`, соответствующий интерфейсу `IApi`, и сохраняет его для дальнейшего взаимодействия с сервером.

Поля класса:

`private api: IApi` — объект для выполнения запросов к API магазина.

Методы класса:

`getProducts(): Promise<IProductResponse>` — метод не принимает аргументов, выполняет GET-запрос на эндпоинт `/product/` и возвращает `Promise<IProductResponse>` с данными каталога товаров.

`sendOrder(order: IOrder): Promise<IOrderResponse>` — метод принимает объект заказа `order` типа `IOrder`, выполняет POST-запрос на эндпоинт `/order/` и возвращает `Promise<IOrderResponse>` с подтверждением покупки.

## Вторая часть. Архитектура MVP

Приложение использует MVP (Model–View–Presenter): модели содержат данные и методы изменения данных, представления управляют только собственными DOM-узлами и сообщают о действиях пользователя через обработчики, а `src/main.ts` координирует сервисы, модели и компоненты с помощью `EventEmitter`. Представления не вызывают API и не изменяют модели. `CommApi` делегирует HTTP-запросы общему классу `Api`.

### Базовые средства и коммуникационный слой

- `Component<T>(container: HTMLElement)` — абстрактная основа представлений. Поле `container: HTMLElement`; `render(data?: Partial<T>): HTMLElement` обновляет свойства и возвращает DOM-контейнер; `setImage(element: HTMLImageElement, src: string, alt?: string): void` обновляет изображение.
- `EventEmitter()` — брокер событий, хранит `Map<EventName, Set<Subscriber>>`. `on<T>(event, callback): void` регистрирует подписчика; `off(event, callback): void` удаляет; `emit<T>(event, data?): void` публикует событие; `trigger<T>(event, context?)` создаёт генератор события; `onAll(callback)` слушает все события; `offAll()` удаляет все подписки.
- `Api(baseUrl: string, options?: RequestInit)` — основной HTTP-клиент, методы `get<T>(uri: string): Promise<T>` и `post<T>(uri: string, data: object, method?): Promise<T>`.
- `CommApi(api: IApi)` — адаптер серверного API: поле `api: IApi`; `getProducts(): Promise<IProductResponse>` запрашивает каталог, `sendOrder(order: IOrder): Promise<IOrderResponse>` отправляет заказ.

### Модели данных

Модели не содержат DOM-логики. Существующие методы первой части сохранены, при изменениях отправляются события через необязательную зависимость `events?: IEvents` в конструкторе.

| Класс | Поля | Публичные методы |
|---|---|---|
| `Products(events?: IEvents)` | `items: IProduct[]`, `currentItem: IProduct \| null`, `events?: IEvents` | `setItems(items: IProduct[]): void`, `getItems(): IProduct[]`, `getItem(itemId: string): IProduct \| null`, `setItem(item: IProduct): void`, `getCurrentItem(): IProduct \| null` |
| `Basket(events?: IEvents)` | `basketItems: IProduct[]`, `events?: IEvents` | `getItems(): IProduct[]`, `addToBasket(item: IProduct): void`, `removeFromBasket(item: IProduct): void`, `clearBasket(): void`, `getTotalPrice(): number`, `getItemsNumber(): number`, `isInBasket(itemId: string): boolean` |
| `Buyer(events?: IEvents)` | `payment: TPayment \| null`, `address: string`, `phone: string`, `email: string`, `events?: IEvents` | `setData(data: Partial<IBuyerData>): void`, `getData(): IBuyerData`, `clearData(): void`, `validateData(): IBuyerErrors` |

### Представления (View)

Все классы находятся в `src/components/views`; все дополнительные типы данных представлений объявлены в `src/types/index.ts`. В конструкторе сохраняются DOM-ссылки на управляемые элементы; обработчики DOM-событий назначаются один раз. Предметные данные принимаются через `render()` и не хранятся в собственных полях View. Каждый callback, переданный в конструктор, публикует событие.

| Класс, конструктор | Поля и методы |
|---|---|
| `Card<T>(container: HTMLElement)` — абстрактная карточка | `titleElement`, `priceElement: HTMLElement`; `categoryElement: HTMLElement \| null`; `imageElement: HTMLImageElement \| null`; `setProduct(product: IProduct): void` формирует общие поля карточки. |
| `CatalogCard(container: HTMLElement, onSelect: () => void)` | Наследует поля `Card`; `render(data?: Partial<IProduct>): HTMLElement` заполняет карточку каталога. Click вызывает `onSelect`. |
| `PreviewCard(container: HTMLElement, onAction: () => void)` | `actionButton: HTMLButtonElement`, `descriptionElement: HTMLElement`; `description: string` (setter); `render(data?: Partial<PreviewData>): HTMLElement` заполняет подробную карточку, кнопку и описание. |
| `BasketCard(container: HTMLElement, onDelete: () => void)` | `indexElement: HTMLElement`, `deleteButton: HTMLButtonElement`; `render(data?: Partial<BasketCardData>): HTMLElement` заполняет позицию корзины. |
| `Page(container: HTMLElement, onBasket: () => void)` | `galleryElement: HTMLElement`, `counterElement: HTMLElement`, `basketButton: HTMLButtonElement`; сеттеры `items: HTMLElement[]`, `counter: number` обновляют каталог и счётчик. |
| `BasketView(container: HTMLElement, onOrder: () => void)` | `listElement`, `totalElement: HTMLElement`, `submitButton: HTMLButtonElement`; `render(data?: Partial<BasketData>): HTMLElement` обновляет список, сумму и доступность оформления. |
| `Modal(container: HTMLElement)` | `contentElement: HTMLElement`, `closeButton: HTMLButtonElement`; сеттер `content: HTMLElement` вставляет компонент; `open(): void` добавляет `modal_active`, `close(): void` удаляет. |
| `Form<T extends FormData>(container: HTMLFormElement, onSubmit: () => void, onChange: (field: string, value: string) => void)` — абстрактная форма | `submitButton: HTMLButtonElement`, `errorsElement: HTMLElement`, `inputs: HTMLInputElement[]`; `render(data?: Partial<T>): HTMLElement` показывает ошибки и блокирует кнопку; `setField(name: string, value: string): void` обновляет поле. |
| `OrderForm(container: HTMLFormElement, onSubmit, onChange)` | `paymentButtons: HTMLButtonElement[]`; `render(data?: Partial<OrderFormData>): HTMLElement` отображает адрес и способ оплаты с `button_alt-active`. |
| `ContactsForm(container: HTMLFormElement, onSubmit, onChange)` | Наследует поля `Form`; `render(data?: Partial<ContactsFormData>): HTMLElement` обновляет почту и телефон. |
| `Success(container: HTMLElement, onClose: () => void)` | `descriptionElement: HTMLElement`, `closeButton: HTMLButtonElement`; `render(data?: Partial<SuccessData>): HTMLElement` показывает сумму успешной покупки. |

#### Типы представлений (объявлены в `src/types/index.ts`)

- `PreviewData = IProduct & { inBasket: boolean }` — товар и признак присутствия в корзине.
- `BasketCardData = IProduct & { index: number }` — товар и номер строки корзины.
- `BasketData = { items: HTMLElement[]; total: number }` — содержимое корзины и сумма.
- `PageData = { items: HTMLElement[]; counter: number }` — карточки каталога и число товаров.
- `FormData = { valid: boolean; errors: string[] }` — общая валидация формы.
- `OrderFormData = FormData & { payment: TPayment | null; address: string }` — первый шаг оформления.
- `ContactsFormData = FormData & { email: string; phone: string }` — второй шаг оформления.
- `SuccessData = { total: number }` — результат заказа.

Базовые типы `IProduct`, `TPayment`, `IBuyer`, `IBuyerData`, `IBuyerErrors`, `IOrder`, `IOrderResponse`, `IProductResponse` описаны в `src/types/index.ts` и не изменены.

### События приложения

| Событие | Источник | Назначение |
|---|---|---|
| `products:changed` | `Products.setItems` | Перерисовать каталог. |
| `product:selected` | `Products.setItem` | Показать подробную карточку в модальном окне. |
| `basket:changed` | `Basket.addToBasket/removeFromBasket/clearBasket` | Обновить счётчик и открытую корзину. |
| `buyer:changed` | `Buyer.setData/clearData` | Обновить соответствующую форму, ошибки и доступность отправки. |
| `catalog:select` `{ id: string }` | `CatalogCard` | Выбрать товар для просмотра. |
| `product:action` | `PreviewCard` | Добавить товар или удалить его из корзины. |
| `basket:open` | `Page` | Открыть корзину. |
| `basket:remove` `{ id: string }` | `BasketCard` | Удалить товар из корзины. |
| `order:open` | `BasketView` | Открыть первую форму заказа. |
| `buyer:input` `{ field: string; value: string }` | `OrderForm`, `ContactsForm` | Передать ввод в модель покупателя. |
| `order:next` | `OrderForm` | Проверить оплату и адрес и открыть контакты. |
| `order:submit` | `ContactsForm` | Отправить заказ через коммуникационный слой. |

### Презентер

Презентер реализован в `src/main.ts` без отдельного класса (допустимый вариант для одностраничного приложения). Он создаёт экземпляры сервисов, моделей и представлений, регистрирует обработчики событий и подготавливает данные для компонентов. События создаются только моделями и через переданные в View обработчики, а не самим презентером. Запрос данных каталога выполняется при старте; отправка заказа — по `order:submit`. После успешного ответа сервера очищаются корзина и данные покупателя, отображается `Success`.

### Проверка

Корневым контейнером `Page` служит `.page__wrapper`: каталог `.gallery` и кнопка `.header__basket` находятся внутри него. Метод `items` изменяет только дочернюю галерею и не затрагивает шапку.


Перед сдачей: установить зависимости `npm ci`, создать локальный `.env` по `.env.example`, выполнить `npm run build`, проверить каталог, корзину, оба этапа оформления, ответ API и закрытие модальных окон. Тестовый код из `main.ts` удалён.
