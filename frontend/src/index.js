import Header from './components/Header';
import CartScreen from './srceens/CartScreen';
import Error404Screen from './srceens/Error404Screen';
import HomeScreen from './srceens/HomeScreen';
import ProductScreen from './srceens/ProductScreen';
import RegisterScreen from './srceens/RegisterScreen';
import SigninScreen from './srceens/SigninScreen';
import ProfileScreen from './srceens/ProfileScreen';
import ShippingScreen from './srceens/ShippingScreen';
import { hideLoading, parseRequestUrl, showLoading } from './utils';
import PaymentScreen from './srceens/PaymentScreen';
import PlaceOrderScreen from './srceens/PlaceOrderScreen';
import OrderScreen from './srceens/OrderScreen';

const routes = {
    "/": HomeScreen,
    "/product/:id": ProductScreen,
    "/cart/:id": CartScreen,
    "/order/:id": OrderScreen,
    "/cart": CartScreen,
    "/register": RegisterScreen,
    "/signin": SigninScreen,
    "/profile": ProfileScreen,
    "/shipping": ShippingScreen,
    "/payment": PaymentScreen,
    "/placeorder": PlaceOrderScreen
}

const router = async () => {
    showLoading();
    const request = parseRequestUrl();
    const parseUrl = (request.resource ? `/${request.resource}` : '/') + (request.id ? '/:id' : '') + (request.verb ? `/${request.verb}` : '');

    const screen = routes[parseUrl] ? routes[parseUrl] : Error404Screen;
    const header = document.getElementById('header-container');
    header.innerHTML = await Header.render()
    const main = document.getElementById('main-container');
    await Header.after_render();
    main.innerHTML = await screen.render();
    if(screen.after_render) {await screen.after_render()};
    hideLoading();
};
window.addEventListener('load', router);
window.addEventListener('hashchange', router);