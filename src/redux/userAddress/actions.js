import {getUserAddress, storeUserData} from '../helper/helper';

export const SET_SELECTED_ADDRESS = 'SET_SELECTED_ADDRESS';
export const ADD_ADDRESS = 'ADD_ADDRESS';
export const UPDATE_ADDRESS = 'UPDATE_ADDRESS';
export const UPDATE_SELECTED_ADDRESS = 'UPDATE_SELECTED_ADDRESS';
export const DELETE_ADDRESS = 'DELETE_ADDRESS';
export const CHECK_PRODUCT_DELIVERY_LOCATION =
  'CHECK_PRODUCT_DELIVERY_LOCATION';
export const FETCH_DELIVERY_PINCODE = 'FETCH_DELIVERY_PINCODE';

export const fetchDeliveryPinCodeAddressSuccess = deliveryAvailablePin => ({
  type: FETCH_DELIVERY_PINCODE,
  payload: {deliveryAvailablePin},
});

export function fetchDeliveryPinCodeAddress(deliveryAvailablePin) {
  return async dispatch => {
    dispatch(fetchDeliveryPinCodeAddressSuccess(deliveryAvailablePin));
  };
}

export const checkItemDeliveryAddressSuccess = selectedPin => ({
  type: CHECK_PRODUCT_DELIVERY_LOCATION,
  payload: {selectedPin},
});

export function checkItemDeliveryAddress(selectedPin) {
  return async dispatch => {
    dispatch(checkItemDeliveryAddressSuccess(selectedPin));
  };
}

export const addSelectedAddressSuccess = selectedAddress => ({
  type: ADD_ADDRESS,
  payload: {selectedAddress},
});

export function addSelectedAddress(selectedAddress) {
  return async dispatch => {
    dispatch(addSelectedAddressSuccess(selectedAddress));
    setSelectedAddress(selectedAddress);
  };
}

export const updateSelectedAddressSuccess = selectedAddress => ({
  type: UPDATE_ADDRESS,
  payload: {selectedAddress},
});

export function updateSelectedAddress(selectedAddress) {
  return dispatch => {
    dispatch(updateSelectedAddressSuccess(selectedAddress));
  };
}



export const deleteSelectedAddressSuccess = selectedAddressId => ({
  type: DELETE_ADDRESS,
  payload: {selectedAddressId},
});

export function deleteSelectedAddress(selectedAddressId) {
  return dispatch => {
    dispatch(deleteSelectedAddressSuccess(selectedAddressId));
  };
}

export const setSelectedAddressSuccess = selectedAddress => ({
  type: SET_SELECTED_ADDRESS,
  payload: {selectedAddress},
});

export function setSelectedAddress(selectedAddress) {
  return dispatch => {
    dispatch(setSelectedAddressSuccess(selectedAddress));
  };
}
