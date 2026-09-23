import "./scss/styles.scss";

import { Products } from "./components/models/Products";
import { Basket } from "./components/models/Basket";
import { Buyer } from "./components/models/Buyer";
import { Api } from "./components/base/Api";
import { CommApi } from "./components/models/CommApi";
import { API_URL } from "./utils/constants";

const products = new Products();
const basket = new Basket();
const buyer = new Buyer();

const api = new Api(API_URL);
const commApi = new CommApi(api);

commApi.getProducts().then((data) => {
  products.setItems(data.items);
  console.log("Каталог товаров:", products.getItems());

  const firstProduct = data.items[0];

  console.log("Товар, найденный по id:", products.getItem(firstProduct.id));

  products.setItem(firstProduct);
  console.log("Выбранный товар:", products.getCurItem());

  basket.addToBasket(firstProduct);
  console.log("Товары в корзине:", basket.getItems());

  console.log(
    `Есть ли товар "${firstProduct.title}" в корзине:`,
    basket.isInBasket(firstProduct.id),
  );

  console.log("Всего товаров в корзине:", basket.getItemsNumber());
  console.log("В корзине товаров на сумму:", basket.getTotalPrice());

  basket.removeFromBasket(firstProduct);
  console.log("Товары в корзине после удаления:", basket.getItems());

  basket.addToBasket(firstProduct);
  basket.clearBasket();
  console.log("Товары в корзине после очистки:", basket.getItems());

  console.log("Исходные данные покупателя:", buyer.getData());

  buyer.setData({ payment: "card" });
  console.log("Данные покупателя после выбора оплаты:", buyer.getData());

  buyer.setData({
    address: "Moscow",
    phone: "+7(999)765-92-22",
    email: "test@test.ru",
  });

  console.log("Заполненные данные покупателя:", buyer.getData());
  console.log("Ошибки валидации покупателя:", buyer.validateData());

  buyer.clearData();
  console.log("Данные покупателя после очистки:", buyer.getData());
  console.log(
    "Ошибки валидации покупателя после очистки:",
    buyer.validateData(),
  );
});
