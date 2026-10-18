import "./scss/styles.scss";
import { Products } from "./components/models/Products";
import { Basket } from "./components/models/Basket";
import { Buyer } from "./components/models/Buyer";
import { Api } from "./components/base/Api";
import { EventEmitter } from "./components/base/Events";
import { CommApi } from "./components/CommApi";
import { API_URL, CDN_URL } from "./utils/constants";
import { cloneTemplate, ensureElement } from "./utils/utils";
import { IProduct, IOrder } from "./types";
import { Modal } from "./components/views/Modal";
import { CatalogCard } from "./components/views/CatalogCard";
import { PreviewCard } from "./components/views/PreviewCard";
import { BasketCard } from "./components/views/BasketCard";
import { BasketView } from "./components/views/BasketView";
import { OrderForm } from "./components/views/OrderForm";
import { ContactsForm } from "./components/views/ContactsForm";
import { Success } from "./components/views/Success";
import { Header } from "./components/views/Header";
import { Gallery } from "./components/views/Gallery";

const events = new EventEmitter();
const products = new Products(events);
const basket = new Basket(events);
const buyer = new Buyer(events);
const api = new Api(API_URL);
const commApi = new CommApi(api);

const modal = new Modal(ensureElement<HTMLElement>("#modal-container"));
const header = new Header(ensureElement<HTMLElement>(".header"), events);

const gallery = new Gallery(ensureElement<HTMLElement>(".gallery"));
const preview = new PreviewCard(
  cloneTemplate<HTMLElement>("#card-preview"),
  events,
);
const basketView = new BasketView(
  cloneTemplate<HTMLElement>("#basket"),
  events,
);
const orderForm = new OrderForm(
  cloneTemplate<HTMLFormElement>("#order"),
  events,
);

const contactsForm = new ContactsForm(
  cloneTemplate<HTMLFormElement>("#contacts"),
  events,
);
const success = new Success(cloneTemplate<HTMLElement>("#success"), () =>
  modal.close(),
);

function renderBasket(): HTMLElement {
  const items = basket.getItems().map((product, index) => {
    const card = new BasketCard(
      cloneTemplate<HTMLElement>("#card-basket"),
      () => {
        events.emit("basket:remove", { id: product.id });
      },
    );
    return card.render({ ...product, index: index + 1 });
  });
  return basketView.render({
    items,
    total: basket.getTotalPrice(),
    valid: basket.getItemsNumber() > 0,
  });
}

function renderOrder(): HTMLElement {
  const data = buyer.getData();
  const errors = buyer.validateData();
  return orderForm.render({
    payment: data.payment,
    address: data.address,
    valid: !errors.payment && !errors.address,
    errors: [errors.payment, errors.address].filter((error): error is string =>
      Boolean(error),
    ),
  });
}

function renderContacts(): HTMLElement {
  const data = buyer.getData();
  const errors = buyer.validateData();
  return contactsForm.render({
    email: data.email,
    phone: data.phone,
    valid: !errors.email && !errors.phone,
    errors: [errors.email, errors.phone].filter((error): error is string =>
      Boolean(error),
    ),
  });
}

// События моделей: только они инициируют обновление представлений данных.
events.on("products:changed", () => {
  const items = products.getItems().map((product: IProduct) => {
    const card = new CatalogCard(
      cloneTemplate<HTMLElement>("#card-catalog"),
      () => {
        events.emit("catalog:select", { id: product.id });
      },
    );

    return card.render({
      ...product,
      image: {
        src: `${CDN_URL}${product.image}`,
        alt: product.title,
      },
    });
  });

  gallery.render({ items });
});
events.on("product:selected", () => {
  const product = products.getCurrentItem();
  if (!product) return;

  const inBasket = basket.isInBasket(product.id);

  modal.render({
    content: preview.render({
      ...product,
      image: {
        src: `${CDN_URL}${product.image}`,
        alt: product.title,
      },
      buttonDisabled: product.price === null,
      buttonText:
        product.price === null
          ? "Недоступно"
          : inBasket
            ? "Удалить из корзины"
            : "Купить",
    }),
  });

  modal.open();
});

events.on("basket:changed", () => {
  header.render({ counter: basket.getItemsNumber() });
  renderBasket();
});

events.on("buyer:changed", () => {
  renderOrder();
  renderContacts();
});

// События представлений: действия пользователя обрабатывает Presenter.
events.on<{ id: string }>("catalog:select", ({ id }) => {
  const product = products.getItem(id);
  if (product) products.setItem(product);
});
events.on("product:action", () => {
  const product = products.getCurrentItem();
  if (!product) return;

  if (basket.isInBasket(product.id)) {
    basket.removeFromBasket(product);
  } else {
    basket.addToBasket(product);
  }

  modal.close();
});
events.on("basket:open", () => {
  modal.render({ content: basketView.render() });
  modal.open();
});
events.on<{ id: string }>("basket:remove", ({ id }) => {
  const product = basket.getItems().find((item) => item.id === id);
  if (product) basket.removeFromBasket(product);
});
events.on("order:open", () => {
  modal.render({ content: renderOrder() });
  modal.open();
});

events.on<{ field: string; value: string }>(
  "buyer:input",
  ({ field, value }) => {
    if (field === "payment" && (value === "cash" || value === "card")) {
      buyer.setData({ payment: value });
    } else if (field === "address" || field === "email" || field === "phone") {
      buyer.setData({ [field]: value });
    }
  },
);

events.on("order:next", () => {
  modal.render({ content: renderContacts() });
  modal.open();
});
events.on("order:submit", () => {
  const data = buyer.getData();
  const order: IOrder = {
    ...data,
    payment: data.payment!,
    total: basket.getTotalPrice(),
    items: basket.getItems().map((product) => product.id),
  };
  contactsForm.render({ valid: false });
  commApi
    .sendOrder(order)
    .then((response) => {
      modal.render({
        content: success.render({ total: response.total }),
      });
      basket.clearBasket();
      buyer.clearData();
      modal.open();
    })
    .catch((error: unknown) => {
      contactsForm.render({
        valid: true,
        errors: [
          error instanceof Error ? error.message : "Не удалось оформить заказ",
        ],
      });
    });
});

basket.clearBasket();
buyer.clearData();

commApi
  .getProducts()
  .then((response) => products.setItems(response.items))
  .catch((error: unknown) => {
    console.error("Не удалось загрузить каталог", error);
  });
