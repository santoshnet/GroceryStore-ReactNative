import {
  FETCH_BEST_SELLING_PRODUCTS_REQUEST,
  FETCH_BEST_SELLING_PRODUCTS_SUCCESS,
  FETCH_BEST_SELLING_PRODUCTS_FAILURE,
  FETCH_NEW_PRODUCTS_REQUEST,
  FETCH_NEW_PRODUCTS_SUCCESS,
  FETCH_NEW_PRODUCTS_FAILURE,
  FETCH_OFFERS_REQUEST,
  FETCH_OFFERS_SUCCESS,
  FETCH_OFFERS_FAILURE,
  FETCH_BANNERS_REQUEST,
  FETCH_BANNERS_SUCCESS,
  FETCH_BANNERS_FAILURE,
  FETCH_PRODUCTS_BY_CATEGORY_REQUEST,
  FETCH_PRODUCTS_BY_CATEGORY_SUCCESS,
  FETCH_PRODUCTS_BY_CATEGORY_FAILURE,
  FETCH_CATEGORIES_REQUEST,
  FETCH_CATEGORIES_SUCCESS,
  FETCH_CATEGORIES_FAILURE,
} from './productsActions';

const initialState = {
  bestSellingProducts: [],
  newProducts: [],
  offers: [],
  banners: [],
  loading: false,
  error: null,
  products: [],
  categoryData: [],
};

const productsReducer = (state = initialState, action) => {
  switch (action.type) {
    case FETCH_CATEGORIES_REQUEST:
      return {
        ...state,
        loading: true,
        error: null,
      };
    case FETCH_CATEGORIES_SUCCESS:
      return {
        ...state,
        categoryData: action.payload,
        loading: false,
        error: null,
      };
    case FETCH_CATEGORIES_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload,
      };
    case FETCH_BEST_SELLING_PRODUCTS_REQUEST:
      return {
        ...state,
        loading: true,
        error: null,
      };
    case FETCH_BEST_SELLING_PRODUCTS_SUCCESS:
      return {
        ...state,
        bestSellingProducts: action.payload,
        loading: false,
        error: null,
      };
    case FETCH_BEST_SELLING_PRODUCTS_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload,
      };
    case FETCH_NEW_PRODUCTS_REQUEST:
      return {
        ...state,
        loading: true,
        error: null,
      };
    case FETCH_NEW_PRODUCTS_SUCCESS:
      return {
        ...state,
        newProducts: action.payload,
        loading: false,
        error: null,
      };
    case FETCH_NEW_PRODUCTS_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload,
      };
    case FETCH_OFFERS_REQUEST:
      return {
        ...state,
        loading: true,
        error: null,
      };
    case FETCH_OFFERS_SUCCESS:
      return {
        ...state,
        offers: action.payload,
        loading: false,
        error: null,
      };
    case FETCH_OFFERS_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload,
      };
    case FETCH_BANNERS_REQUEST:
      return {
        ...state,
        loading: true,
        error: null,
      };
    case FETCH_BANNERS_SUCCESS:
      return {
        ...state,
        banners: action.payload,
        loading: false,
        error: null,
      };
    case FETCH_BANNERS_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload,
      };
    case FETCH_PRODUCTS_BY_CATEGORY_REQUEST:
      return {
        ...state,
        loading: true,
        error: null,
      };
    case FETCH_PRODUCTS_BY_CATEGORY_SUCCESS:
      return {
        ...state,
        products: action.payload,
        loading: false,
        error: null,
      };
    case FETCH_PRODUCTS_BY_CATEGORY_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload,
      };
    default:
      return state;
  }
};

export default productsReducer;
