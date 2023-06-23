const initialState = {
  products: [],
  cartItems: [],
  cartCount: 0,
  cartTotal: 0,
  error: null,
};

export const calculateCartTotal = cartItems => {
  let total = 0;
  cartItems.forEach(item => {
    const price = parseFloat(item.price);
    const quantity = parseInt(item.quantity);
    total += price * quantity;
  });
  return total.toFixed(2);
};

const cartReducer = (state = initialState, action) => {
  console.log(action, 'checks reducers');
  switch (action.type) {
    case 'FETCH_PRODUCTS_SUCCESS': {
      return {
        ...state,
        products: action.payload.products,
        error: null,
      };
    }
    case 'FETCH_PRODUCTS_FAILURE': {
      return {
        ...state,
        products: [],
        error: action.payload.error,
      };
    }
    case 'ADD_TO_CART': {
      const {product} = action.payload;
      const existingCartItem = state.cartItems.find(
        item => item.id === product.id,
      );

      let updatedCartItems, updatedCartCount, updatedCartTotal;

      if (existingCartItem) {
        updatedCartItems = state.cartItems.map(item => {
          if (item.id === product.id) {
            return {...item, quantity: item.quantity + 1};
          }
          return item;
        });
        updatedCartCount = state.cartCount; // No change in cart count
        updatedCartTotal = (
          parseFloat(state.cartTotal) + parseFloat(product.price)
        ).toFixed(2);
      } else {
        updatedCartItems = [...state.cartItems, {...product, quantity: 1}];
        updatedCartCount = state.cartCount + 1; // Increment cart count by 1
        updatedCartTotal = (
          parseFloat(state.cartTotal) + parseFloat(product.price)
        ).toFixed(2);
      }

      return {
        ...state,
        cartItems: updatedCartItems,
        cartCount: updatedCartCount,
        cartTotal: updatedCartTotal,
      };
    }

    case 'REMOVE_FROM_CART': {
      const {productId} = action.payload;
      const updatedCartItems = state.cartItems.filter(
        item => item.id !== productId,
      );
      const updatedCartCount = state.cartCount - 1;
      const updatedCartTotal = calculateCartTotal(updatedCartItems);
      return {
        ...state,
        cartItems: updatedCartItems,
        cartCount: updatedCartCount,
        cartTotal: updatedCartTotal,
      };
    }
    case 'INCREASE_QUANTITY': {
      const {productId} = action.payload;
      const updatedCartItems = state.cartItems.map(item =>
        item.id === productId ? {...item, quantity: item.quantity + 1} : item,
      );
      const updatedCartTotal = calculateCartTotal(updatedCartItems);
      return {
        ...state,
        cartItems: updatedCartItems,
        cartTotal: updatedCartTotal,
      };
    }
    case 'DECREASE_QUANTITY': {
      const {productId} = action.payload;
      const updatedCartItems = state.cartItems.map(item =>
        item.id === productId && item.quantity > 1
          ? {...item, quantity: item.quantity - 1}
          : item,
      );
      const updatedCartTotal = calculateCartTotal(updatedCartItems);
      return {
        ...state,
        cartItems: updatedCartItems,
        cartTotal: updatedCartTotal,
      };
    }
    case 'RESET_CART': {
      console.log('rest reducers');
      return {
        ...state,
        cartItems: [],
        cartCount: 0,
        cartTotal: 0,
      };
    }

    default:
      return state;
  }
};

export default cartReducer;
