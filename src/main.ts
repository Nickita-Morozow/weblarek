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
  console.log(products.getItems());
  const firstProduct = data.items[0];
  console.log(products.getItem(firstProduct.id));
  products.setItem(firstProduct);
  console.log(products.getCurItem());
  basket.addToBasket(firstProduct);
  console.log(basket.getItems());
  console.log(basket.isInBasket(firstProduct.id));
  console.log(basket.getItemsNumber());
  console.log(basket.getTotalPrice());
  basket.removeFromBasket(firstProduct);
  console.log(basket.getItems());
  basket.addToBasket(firstProduct);
  basket.clearBasket();
  console.log(basket.getItems());
  console.log(buyer.getData());
  buyer.setData({ payment: "card" });
  console.log(buyer.getData());
  buyer.setData({
    address: "Moscow",
    phone: "+7(999)765-92-22",
    email: "test@test.ru",
  });
  console.log(buyer.getData());
  console.log(buyer.validateData());
  buyer.clearData();
  console.log(buyer.validateData());
});
