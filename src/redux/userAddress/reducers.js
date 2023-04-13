import * as addeessActionTypes from './actions';

const initialstate = {
  userAddress: new Array(),
};

const userAddressReducer = (state = initialstate, action) => {
  switch (action.type) {
    case addeessActionTypes.ADD_ADDRESS:
      return {
        ...state,
        userAddress: [...state.userAddress, action.payload.selectedAddress],
      };
    case addeessActionTypes.SET_SELECTED_ADDRESS:
      return {
        ...state,
        selectedUserAddress: action.payload.selectedAddress,
      };
    case addeessActionTypes.DELETE_ADDRESS:
      return {
        ...state,
        userAddress: state.userAddress.filter(
          item => item.id !== action.payload.selectedAddressId,
        ),
      };
    case addeessActionTypes.UPDATE_ADDRESS:
      return {
        ...state,
        userAddress: state.userAddress.map(updateaddress => {
          if (updateaddress.id === action.payload.selectedAddress.id) {
            return {
              ...updateaddress,
              ...action.payload.selectedAddress,
            };
          }
          return updateaddress;
        }),
      };

    case addeessActionTypes.FETCH_DELIVERY_PINCODE:
      return {
        ...state,
        deliveryItemPinCode: action.payload.deliveryAvailablePin,
      };
    case addeessActionTypes.CHECK_PRODUCT_DELIVERY_LOCATION:
      return {
        ...state,
        isDeliveryToLocation: state.deliveryItemPinCode.some(
          ele => ele.pin === action.payload.selectedPin,
        ),
      };
    case 'RESET_ADDRESS':
      return initialstate;
    default:
      return state;
  }
};

export default userAddressReducer;
