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
});
console.log(basket.getItems());
console.log(buyer.getData());
