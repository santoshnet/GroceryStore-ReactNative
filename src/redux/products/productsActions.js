import {
  getBestSellingProducts as getBestSellingProductsAPI,
  getNewProducts as getNewProductsAPI,
  getOffers as getOffersAPI,
  getBanners as getBannersAPI,
  getAllCategory
} from '../../axios/ServerRequest';

// Action types
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

export const FETCH_BANNERS_REQUEST = 'FETCH_BANNERS_REQUEST';
export const FETCH_BANNERS_SUCCESS = 'FETCH_BANNERS_SUCCESS';
export const FETCH_BANNERS_FAILURE = 'FETCH_BANNERS_FAILURE';

// Action types
export const FETCH_CATEGORIES_REQUEST = 'FETCH_CATEGORIES_REQUEST';
export const FETCH_CATEGORIES_SUCCESS = 'FETCH_CATEGORIES_SUCCESS';
export const FETCH_CATEGORIES_FAILURE = 'FETCH_CATEGORIES_FAILURE';

// Action creators
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
      const response = await getBestSellingProductsAPI();
      dispatch(fetchBestSellingProductsSuccess(response.data.products));
    } catch (error) {
      dispatch(fetchBestSellingProductsFailure(error));
    }
  };
};

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
      const response = await getNewProductsAPI();
      dispatch(fetchNewProductsSuccess(response.data.products));
    } catch (error) {
      dispatch(fetchNewProductsFailure(error));
    }
  };
};

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
      const response = await getOffersAPI();
      dispatch(fetchOffersSuccess(response.data.offers));
    } catch (error) {
      dispatch(fetchOffersFailure(error));
    }
  };
};

export const fetchBannersRequest = () => ({
  type: FETCH_BANNERS_REQUEST,
});

export const fetchBannersSuccess = banners => ({
  type: FETCH_BANNERS_SUCCESS,
  payload: banners,
});

export const fetchBannersFailure = error => ({
  type: FETCH_BANNERS_FAILURE,
  payload: error,
});

export const fetchBanners = () => {
  return async dispatch => {
    dispatch(fetchBannersRequest());
    try {
      const response = await getBannersAPI();
      dispatch(fetchBannersSuccess(response.data.banners));
    } catch (error) {
      dispatch(fetchBannersFailure(error));
    }
  };
};

// Combine all the action creators into a single export statement
// export {
//   fetchBestSellingProducts,
//   fetchNewProducts,
//   fetchOffers,
//   fetchBanners,
// };
