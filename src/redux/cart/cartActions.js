import axios from 'axios';

export const FETCH_PRODUCTS_SUCCESS = 'FETCH_PRODUCTS_SUCCESS';
export const FETCH_PRODUCTS_FAILURE = 'FETCH_PRODUCTS_FAILURE';
export const ADD_TO_CART = 'ADD_TO_CART';
export const REMOVE_FROM_CART = 'REMOVE_FROM_CART';
export const INCREASE_QUANTITY = 'INCREASE_QUANTITY';
export const DECREASE_QUANTITY = 'DECREASE_QUANTITY';
export const RESET_CART = 'RESET_CART';

export const fetchProducts = () => {
  return async dispatch => {
    try {
      const response = await axios.get(
        'https://jsonplaceholder.typicode.com/posts',
      );
      dispatch(fetchProductsSuccess(response.data));
    } catch (error) {
      dispatch(fetchProductsFailure(error.message));
    }
  };
};

export const fetchProductsSuccess = products => ({
  type: FETCH_PRODUCTS_SUCCESS,
  payload: {products},
});

export const fetchProductsFailure = error => ({
  type: FETCH_PRODUCTS_FAILURE,
  payload: {error},
});

export const addToCart = product => ({
  type: ADD_TO_CART,
  payload: {product},
});

export const removeFromCart = productId => ({
  type: REMOVE_FROM_CART,
  payload: {productId},
});

export const increaseQuantity = productId => (
  // console.log(productId, 'productId'),
  {
    type: INCREASE_QUANTITY,
    payload: {productId},
  }
);

export const decreaseQuantity = productId => ({
  type: DECREASE_QUANTITY,
  payload: {productId},
});

export const resetCart = () => ({
  type: RESET_CART,
});
