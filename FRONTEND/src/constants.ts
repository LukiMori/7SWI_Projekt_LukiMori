export const EMPTY_MAP_FORM = {
    street: '',
    houseNumber: '',
    city: '',
    zip: '',
    country: '',
};

export const MAP_API_KEY = '4vBH4gDiYth1E7PsV6DeBfiOCQ-4RR2-Xn3ZjBEETbY';
export const MAP_API_URL = 'https://api.mapy.cz/v1/';

export const SIGNUP_TOKEN_URL = "http://localhost:8081/api/auth/register";
export const LOGIN_TOKEN_URL = "http://localhost:8081/api/auth/login";

export const PROFILE_CHANGE_URL = "http://localhost:8081/api/auth/profile/update";
export const PROFILE_GET_INFO_URL = "http://localhost:8081/api/auth/profile";
export const PROFILE_GET_ADDRESS_URL = "http://localhost:8081/api/address";

export const GET_CATEGORY_URL = "http://localhost:8081/api/categories";
export const GET_PRODUCTS_BY_CATEGORY_URL = "http://localhost:8081/api/products/by-category";

export const GET_PRODUCTS_URL = "http://localhost:8081/api/products";

export const GET_ORDERS_URL = "http://localhost:8081/api/orders";

export const GET_CART_URL = "http://localhost:8081/api/cart";
export const UPDATE_CART_URL = "http://localhost:8081/api/cart/update";
export const CHECK_CART_AVAILABILITY_URL = "http://localhost:8081/api/cart/check-availability";

 export const CONFIRM_ORDER_URL = "http://localhost:8081/api/cart/confirm-order";
