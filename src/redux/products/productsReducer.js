import {
  FETCH_CATEGORIES_REQUEST,
  FETCH_CATEGORIES_SUCCESS,
  FETCH_CATEGORIES_FAILURE,
  FETCH_BEST_SELLING_PRODUCTS_REQUEST,
  FETCH_BEST_SELLING_PRODUCTS_SUCCESS,
  FETCH_BEST_SELLING_PRODUCTS_FAILURE,
  FETCH_NEW_PRODUCTS_REQUEST,
  FETCH_NEW_PRODUCTS_SUCCESS,
  FETCH_NEW_PRODUCTS_FAILURE,
  FETCH_OFFERS_REQUEST,
  FETCH_OFFERS_SUCCESS,
  FETCH_OFFERS_FAILURE,
} from './productsActions';

const initialState = {
  categoryData: [],
  bestSellingProducts: [],
  newProducts: [],
  offers: [],
  loading: false,
  error: null,
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
    default:
      return state;
  }
};

export default productsReducer;
