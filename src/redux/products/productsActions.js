import {
  getAllCategory,
  getBestSellingProducts,
  getNewProducts,
  getOffers,
} from '../../axios/ServerRequest';

// Action types
export const FETCH_CATEGORIES_REQUEST = 'FETCH_CATEGORIES_REQUEST';
export const FETCH_CATEGORIES_SUCCESS = 'FETCH_CATEGORIES_SUCCESS';
export const FETCH_CATEGORIES_FAILURE = 'FETCH_CATEGORIES_FAILURE';

export const FETCH_BEST_SELLING_PRODUCTS_REQUEST =
  'FETCH_BEST_SELLING_PRODUCTS_REQUEST';
export const FETCH_BEST_SELLING_PRODUCTS_SUCCESS =
  'FETCH_BEST_SELLING_PRODUCTS_SUCCESS';
export const FETCH_BEST_SELLING_PRODUCTS_FAILURE =
  'FETCH_BEST_SELLING_PRODUCTS_FAILURE';

export const FETCH_NEW_PRODUCTS_REQUEST = 'FETCH_NEW_PRODUCTS_REQUEST';
export const FETCH_NEW_PRODUCTS_SUCCESS = 'FETCH_NEW_PRODUCTS_SUCCESS';
export const FETCH_NEW_PRODUCTS_FAILURE = 'FETCH_NEW_PRODUCTS_FAILURE';

export const FETCH_OFFERS_REQUEST = 'FETCH_OFFERS_REQUEST';
export const FETCH_OFFERS_SUCCESS = 'FETCH_OFFERS_SUCCESS';
export const FETCH_OFFERS_FAILURE = 'FETCH_OFFERS_FAILURE';

// Category actions
export const fetchCategoriesRequest = () => ({
  type: FETCH_CATEGORIES_REQUEST,
});

export const fetchCategoriesSuccess = categories => ({
  type: FETCH_CATEGORIES_SUCCESS,
  payload: categories,
});

export const fetchCategoriesFailure = error => ({
  type: FETCH_CATEGORIES_FAILURE,
  payload: error,
});

export const fetchCategories = () => {
  return async dispatch => {
    dispatch(fetchCategoriesRequest());
    try {
      const response = await getAllCategory();
      dispatch(fetchCategoriesSuccess(response.data.categories));
    } catch (error) {
      dispatch(fetchCategoriesFailure(error));
    }
  };
};

// Best selling products actions
export const fetchBestSellingProductsRequest = () => ({
  type: FETCH_BEST_SELLING_PRODUCTS_REQUEST,
});

export const fetchBestSellingProductsSuccess = products => ({
  type: FETCH_BEST_SELLING_PRODUCTS_SUCCESS,
  payload: products,
});

export const fetchBestSellingProductsFailure = error => ({
  type: FETCH_BEST_SELLING_PRODUCTS_FAILURE,
  payload: error,
});

export const fetchBestSellingProducts = () => {
  return async dispatch => {
    dispatch(fetchBestSellingProductsRequest());
    try {
      const response = await getBestSellingProducts();
      dispatch(fetchBestSellingProductsSuccess(response.data.products));
    } catch (error) {
      dispatch(fetchBestSellingProductsFailure(error));
    }
  };
};

// New products actions
export const fetchNewProductsRequest = () => ({
  type: FETCH_NEW_PRODUCTS_REQUEST,
});

export const fetchNewProductsSuccess = products => ({
  type: FETCH_NEW_PRODUCTS_SUCCESS,
  payload: products,
});

export const fetchNewProductsFailure = error => ({
  type: FETCH_NEW_PRODUCTS_FAILURE,
  payload: error,
});

export const fetchNewProducts = () => {
  return async dispatch => {
    dispatch(fetchNewProductsRequest());
    try {
      const response = await getNewProducts();
      dispatch(fetchNewProductsSuccess(response.data.products));
    } catch (error) {
      dispatch(fetchNewProductsFailure(error));
    }
  };
};

// Offers actions
export const fetchOffersRequest = () => ({
  type: FETCH_OFFERS_REQUEST,
});

export const fetchOffersSuccess = offers => ({
  type: FETCH_OFFERS_SUCCESS,
  payload: offers,
});

export const fetchOffersFailure = error => ({
  type: FETCH_OFFERS_FAILURE,
  payload: error,
});

export const fetchOffers = () => {
  return async dispatch => {
    dispatch(fetchOffersRequest());
    try {
      const response = await getOffers();
      dispatch(fetchOffersSuccess(response.data.offers));
    } catch (error) {
      dispatch(fetchOffersFailure(error));
    }
  };
};
