import "./scss/styles.scss";

import { Products } from "./components/models/Products";
import { Basket } from "./components/models/Basket";
import { Buyer } from "./components/models/Buyer";
import { Api } from "./components/base/Api";
import { CommApi } from "./components/CommApi";
import { API_URL } from "./utils/constants";
import { apiProducts } from "./utils/data";

const products = new Products();
const basket = new Basket();
const buyer = new Buyer();

const api = new Api(API_URL);
const commApi = new CommApi(api);

commApi
  .getProducts()
  .then((data) => {
    products.setItems(data.items);
    console.log("Каталог товаров, полученный с сервера:", products.getItems());
  })
  .catch((error) => {
    console.error("Ошибка получения каталога:", error);
  });

products.setItems(apiProducts.items);
console.log("Моковые товары в каталоге:", products.getItems());
console.log(
  "Товар, найденный по id:",
  products.getItem(apiProducts.items[0].id),
);
products.setItem(apiProducts.items[0]);
console.log("Выбранный товар:", products.getCurrentItem());

basket.addToBasket(apiProducts.items[0]);
console.log("Товары в корзине:", basket.getItems());

console.log(
  "Есть ли товар в корзине:",
  basket.isInBasket(apiProducts.items[0].id),
);

console.log("Всего товаров в корзине:", basket.getItemsNumber());
console.log("В корзине товаров на сумму:", basket.getTotalPrice());

basket.removeFromBasket(apiProducts.items[0]);
console.log("Товары в корзине после удаления:", basket.getItems());

basket.addToBasket(apiProducts.items[0]);
basket.clearBasket();
console.log("Товары в корзине после очистки:", basket.getItems());

console.log("Исходные данные покупателя:", buyer.getData());
buyer.setData({ payment: "card" });
console.log("Данные покупателя после выбора оплаты:", buyer.getData());
buyer.setData({
  address: "Moscow",
  phone: "+7 (921) 234-34-22",
  email: "test@test.ru",
});
console.log("Полные данные покупателя:", buyer.getData());
console.log("Ошибки валидации покупателя:", buyer.validateData());
buyer.clearData();
console.log("Данные покупателя после очистки:", buyer.getData());
console.log("Ошибки валидации покупателя после очистки:", buyer.validateData());
