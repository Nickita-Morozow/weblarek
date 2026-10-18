# Web-ларёк

Учебный интернет-магазин товаров для веб-разработчиков. Пользователь может просматривать каталог, открывать подробную карточку, добавлять и удалять товары из корзины и оформлять заказ в два этапа.

**Стек:** TypeScript, HTML, SCSS, Vite. Архитектура — MVP (Model–View–Presenter) с брокером событий.

## Запуск

1. Установить зависимости: `npm install`.
2. Создать в корне `.env` по образцу `.env.example` и задать `VITE_API_ORIGIN` — адрес сервера API.
3. Запустить разработку: `npm run dev`.

Проверка TypeScript и production-сборка: `npm run build`. Просмотр собранного приложения: `npm run preview`.

Файл `.env` с локальными настройками не следует добавлять в Git.

## Структура

- `src/main.ts` — презентер: создаёт объекты, подписывается на события, связывает модели и представления, отправляет запросы.
- `src/types/index.ts` — типы товаров, покупателя, заказа и состояний представлений.
- `src/components/models/` — модели `Products`, `Basket`, `Buyer`.
- `src/components/views/` — классы отображения интерфейса.
- `src/components/base/` — базовые `Component`, `EventEmitter` и `Api`.
- `src/components/CommApi.ts` — методы API каталога и заказов.
- `src/utils/` — константы и DOM-утилиты.
- `src/scss/` — стили.
- `index.html` — страница и шаблоны карточек, форм и модальных окон.

## Архитектура MVP

**Model** хранит состояние и изменяет его через методы. Каждая модель обязательно получает `IEvents` в конструкторе и публикует события после изменения данных. Модели не работают с DOM.

**View** отвечает за отображение и пользовательские действия. Представления наследуют `Component<T>` и обновляются через `render(data?: Partial<T>)`. Базовый `render()` присваивает свойства, вызывая сеттеры представления; переопределять его не требуется. Обязательные DOM-элементы находятся через `ensureElement`, группы — через `ensureAllElements`. Статичные интерактивные представления публикуют события через переданный брокер. Для динамических карточек каталога и корзины используются колбэки, замыкающие идентификатор товара.

**Presenter** реализован в `src/main.ts`. Он обрабатывает события, получает данные из моделей, вычисляет состояния кнопок и ошибок и передаёт готовые данные в `render()` представлений. Здесь же формируются полные URL изображений через `CDN_URL`.

### Базовые классы

- `Component<T>` — хранит `container`, предоставляет `render()` и `setImage()`.
- `EventEmitter` — предоставляет подписку `on()`, публикацию `emit()` и другие методы управления событиями.
- `Api` — универсальные GET/POST-запросы.
- `CommApi` — `getProducts()` для `/product/` и `sendOrder(order)` для `/order/`; получает готовый экземпляр `Api` через конструктор.

### Модели

| Модель | Ответственность и методы | События |
| --- | --- | --- |
| `Products(events: IEvents)` | Каталог и выбранный товар: `setItems`, `getItems`, `getItem`, `setItem`, `getCurrentItem` | `products:changed`, `product:selected` |
| `Basket(events: IEvents)` | Состав и сумма корзины: `getItems`, `addToBasket`, `removeFromBasket`, `clearBasket`, `getTotalPrice`, `getItemsNumber`, `isInBasket` | `basket:changed` |
| `Buyer(events: IEvents)` | Данные покупателя: `setData`, `getData`, `clearData`, `validateData` | `buyer:changed` |

`Buyer.validateData()` проверяет наличие способа оплаты и непустые после `trim()` адрес, телефон и почту. Сохранённые значения при этом не изменяются.

### Представления

| Класс | Отображение и состояние |
| --- | --- |
| `Header` | Кнопка открытия корзины; сеттер `counter` |
| `Gallery` | Список карточек каталога; сеттер `items` |
| `Card<T>` | Общие для карточек сеттеры `title`, `price` |
| `CatalogCard` | Категория и изображение (`category`, `image`), выбор товара |
| `PreviewCard` | Категория, изображение, описание и кнопка действия (`category`, `image`, `description`, `buttonText`, `buttonDisabled`) |
| `BasketCard` | Карточка в корзине, порядковый номер (`index`) и удаление |
| `BasketView` | Список товаров, сумма и доступность оформления (`items`, `total`, `valid`) |
| `Modal` | Содержимое (`content`), методы `open()` и `close()` |
| `Form<T extends FormState>` | Общие для форм сеттеры `valid`, `errors`, обновление полей через `setField()` |
| `OrderForm` | Способ оплаты и адрес (`payment`, `address`) |
| `ContactsForm` | Почта и телефон (`email`, `phone`) |
| `Success` | Сообщение об успешной покупке и сумма (`total`) |

`Header`, `PreviewCard`, `BasketView` и формы получают брокер событий для уведомления презентера о действиях пользователя. `Gallery` только отображает полученные карточки. `Success`, `CatalogCard` и `BasketCard` получают колбэки соответствующих действий.

### Типы состояний представлений

- `ICardImage` — `{ src: string; alt: string }`, готовые данные изображения.
- `CatalogCardData` — данные товара с изображением типа `ICardImage`.
- `PreviewData` — данные карточки с `buttonText` и `buttonDisabled`.
- `BasketCardData` — товар и его `index` в корзине.
- `BasketData` — `{ items: HTMLElement[]; total: number; valid: boolean }`.
- `FormState` — `{ valid: boolean; errors: string[] }`.
- `OrderFormData` — `FormState`, `payment` и `address`.
- `ContactsFormData` — `FormState`, `email` и `phone`.
- `ModalData` — `{ content: HTMLElement }`.
- `SuccessData` — `{ total: number }`.

Доменная модель товара описана `IProduct`; данные покупателя — `IBuyerData`, ошибки — `IBuyerErrors`, запрос заказа — `IOrder`.

### Основные события

| Событие | Назначение |
| --- | --- |
| `products:changed` | Обновить карточки каталога |
| `catalog:select` | Выбрать товар по `id` |
| `product:selected` | Показать подробную карточку |
| `product:action` | Добавить выбранный товар в корзину или удалить из неё |
| `basket:changed` | Обновить счётчик и представление корзины |
| `basket:open` | Открыть подготовленную корзину |
| `basket:remove` | Удалить товар по `id` |
| `order:open` | Открыть первый шаг оформления |
| `buyer:input` | Обновить поле покупателя (`field`, `value`) |
| `buyer:changed` | Обновить обе формы и их валидацию |
| `order:next` | Перейти к контактным данным |
| `order:submit` | Отправить заказ |

## Сценарий заказа

1. После загрузки товаров модель `Products` публикует `products:changed`, а презентер строит карточки каталога.
2. Пользователь открывает товар и добавляет его в корзину. `Basket` публикует `basket:changed`, обновляя счётчик и список.
3. При оформлении пользователь выбирает способ оплаты, вводит адрес, затем телефон и email. `Buyer` публикует `buyer:changed`; презентер обновляет формы и доступность кнопок.
4. Презентер формирует `IOrder` из данных покупателя, суммы и идентификаторов товаров и отправляет его через `CommApi.sendOrder()`.
5. После успешного ответа показывается `Success` с суммой из ответа сервера; корзина и данные покупателя очищаются. При ошибке запроса сообщение выводится в форме контактов.
