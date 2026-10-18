import './scss/styles.scss';
import { Products } from './components/models/Products';
import { Basket } from './components/models/Basket';
import { Buyer } from './components/models/Buyer';
import { Api } from './components/base/Api';
import { EventEmitter } from './components/base/Events';
import { CommApi } from './components/CommApi';
import { API_URL } from './utils/constants';
import { cloneTemplate, ensureElement } from './utils/utils';
import { IProduct, IBuyerData, IOrder, TPayment } from './types';
import { Page } from './components/views/Page';
import { Modal } from './components/views/Modal';
import { CatalogCard } from './components/views/CatalogCard';
import { PreviewCard } from './components/views/PreviewCard';
import { BasketCard } from './components/views/BasketCard';
import { BasketView } from './components/views/BasketView';
import { OrderForm } from './components/views/OrderForm';
import { ContactsForm } from './components/views/ContactsForm';
import { Success } from './components/views/Success';

const events = new EventEmitter();
const products = new Products(events);
const basket = new Basket(events);
const buyer = new Buyer(events);
const commApi = new CommApi(new Api(API_URL));

const modal = new Modal(ensureElement<HTMLElement>('#modal-container'));
const page = new Page(
    ensureElement<HTMLElement>('.page__wrapper'),
    () => events.emit('basket:open'),
);
const preview = new PreviewCard(cloneTemplate<HTMLElement>('#card-preview'), () => events.emit('product:action'));
const basketView = new BasketView(cloneTemplate<HTMLElement>('#basket'), () => events.emit('order:open'));
const orderForm = new OrderForm(
    cloneTemplate<HTMLFormElement>('#order'),
    () => events.emit('order:next'),
    (field, value) => events.emit('buyer:input', { field, value }),
);
const contactsForm = new ContactsForm(
    cloneTemplate<HTMLFormElement>('#contacts'),
    () => events.emit('order:submit'),
    (field, value) => events.emit('buyer:input', { field, value }),
);
const success = new Success(cloneTemplate<HTMLElement>('#success'), () => modal.close());

function renderBasket(): HTMLElement {
    const items = basket.getItems().map((product, index) => {
        const card = new BasketCard(cloneTemplate<HTMLElement>('#card-basket'), () => {
            events.emit('basket:remove', { id: product.id });
        });
        return card.render({ ...product, index: index + 1 });
    });
    return basketView.render({ items, total: basket.getTotalPrice() });
}

function renderOrder(): HTMLElement {
    const data = buyer.getData();
    const errors = buyer.validateData();
    return orderForm.render({
        payment: data.payment,
        address: data.address,
        valid: !errors.payment && !errors.address,
        errors: [errors.payment, errors.address].filter((error): error is string => Boolean(error)),
    });
}

function renderContacts(): HTMLElement {
    const data = buyer.getData();
    const errors = buyer.validateData();
    return contactsForm.render({
        email: data.email,
        phone: data.phone,
        valid: !errors.email && !errors.phone,
        errors: [errors.email, errors.phone].filter((error): error is string => Boolean(error)),
    });
}

// События моделей: только они инициируют обновление представлений данных.
events.on('products:changed', () => {
    page.items = products.getItems().map((product: IProduct) => {
        const card = new CatalogCard(cloneTemplate<HTMLElement>('#card-catalog'), () => {
            events.emit('catalog:select', { id: product.id });
        });
        return card.render(product);
    });
});
events.on('product:selected', () => {
    const product = products.getCurrentItem();
    if (!product) return;
    modal.content = preview.render({ ...product, inBasket: basket.isInBasket(product.id) });
    modal.open();
});
events.on('basket:changed', () => {
    page.counter = basket.getItemsNumber();
    // Если корзина в данный момент открыта, обновляем её содержимое.
    if (modal.render().classList.contains('modal_active') &&
        modal.render().querySelector('.basket')) {
        modal.content = renderBasket();
    }
});
events.on('buyer:changed', () => {
    const content = modal.render();
    if (!content.classList.contains('modal_active')) return;
    if (content.querySelector('form[name="order"]')) orderForm.render({
        payment: buyer.getData().payment,
        address: buyer.getData().address,
        valid: !buyer.validateData().payment && !buyer.validateData().address,
        errors: [buyer.validateData().payment, buyer.validateData().address].filter((error): error is string => Boolean(error)),
    });
    if (content.querySelector('form[name="contacts"]')) contactsForm.render({
        email: buyer.getData().email,
        phone: buyer.getData().phone,
        valid: !buyer.validateData().email && !buyer.validateData().phone,
        errors: [buyer.validateData().email, buyer.validateData().phone].filter((error): error is string => Boolean(error)),
    });
});

// События представлений: действия пользователя обрабатывает Presenter.
events.on<{ id: string }>('catalog:select', ({ id }) => {
    const product = products.getItem(id);
    if (product) products.setItem(product);
});
events.on('product:action', () => {
    const product = products.getCurrentItem();
    if (!product || product.price === null) return;
    if (basket.isInBasket(product.id)) basket.removeFromBasket(product);
    else basket.addToBasket(product);
    modal.close();
});
events.on('basket:open', () => {
    modal.content = renderBasket();
    modal.open();
});
events.on<{ id: string }>('basket:remove', ({ id }) => {
    const product = basket.getItems().find((item) => item.id === id);
    if (product) basket.removeFromBasket(product);
});
events.on('order:open', () => {
    modal.content = renderOrder();
    modal.open();
});
events.on<{ field: string; value: string }>('buyer:input', ({ field, value }) => {
    if (field === 'payment' && (value === 'cash' || value === 'card')) {
        buyer.setData({ payment: value as TPayment });
    } else if (field === 'address' || field === 'email' || field === 'phone') {
        buyer.setData({ [field]: value } as Partial<IBuyerData>);
    }
});
events.on('order:next', () => {
    const errors = buyer.validateData();
    if (errors.address || errors.payment) return;
    modal.content = renderContacts();
    modal.open();
});
events.on('order:submit', () => {
    const errors = buyer.validateData();
    if (Object.keys(errors).length || !basket.getItemsNumber()) return;
    const data = buyer.getData();
    if (data.payment === null) return;
    const order: IOrder = {
        ...data,
        payment: data.payment,
        total: basket.getTotalPrice(),
        items: basket.getItems().map((product) => product.id),
    };
    contactsForm.render({ valid: false });
    commApi.sendOrder(order).then((response) => {
        modal.content = success.render({ total: response.total });
        basket.clearBasket();
        buyer.clearData();
        modal.open();
    }).catch((error: unknown) => {
        contactsForm.render({
            valid: true,
            errors: [error instanceof Error ? error.message : 'Не удалось оформить заказ'],
        });
    });
});

commApi.getProducts().then((response) => products.setItems(response.items)).catch((error: unknown) => {
    console.error('Не удалось загрузить каталог', error);
});
