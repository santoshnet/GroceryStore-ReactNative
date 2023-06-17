/* eslint-disable no-dupe-keys */
/* eslint-disable react-native/no-inline-styles */
import React, {Component} from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  FlatList,
} from 'react-native';
import AppStatusBar from '../components/AppStatusBar';
import {Color, Fonts, Strings, Dimension} from '../theme';
import ToolBar from '../components/ToolBar';
import {TouchableOpacity} from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import {
  getUserDetails,
  getCart,
  setCart,
  getToken,
} from '../utils/LocalStorage';
import BadgeIcon from '../components/BadgeIcon';
import Cart from '../utils/Cart';
import Logo from '../components/Logo';
import OrderItem from '../components/ProductItem/OrderItem';
import {Picker} from '@react-native-community/picker';
import {cancelPayment, orderPlace, updatePayment} from '../axios/ServerRequest';
import RazorpayCheckout from 'react-native-razorpay';
import Loading from '../components/Loading';
import {
  addSelectedAddress,
  setSelectedAddress,
  deleteSelectedAddress,
} from '../redux/userAddress/actions';
import {connect} from 'react-redux';
import {
  removeFromCart,
  increaseQuantity,
  decreaseQuantity,
  updateCartCountAndTotal,
  addToCart,
  resetCart,
} from '../redux/cart/cartActions';
import {
  set_User_Details,
  clearUserDetails,
} from './../redux/userDetails/userActions';
class PlaceOrder extends Component {
  constructor(props) {
    super(props);
    this.state = {
      user: null,
      cartList: [],
      totalPrice: '',
      paymentMethod: 'ONLINE',
    };
  }



  onPlaceOrder = () => {
    // if (this.state.paymentMethod === 'Online payment') {
    //   this.onRazorpayInit();
    // }
    // this.refs.loading.show();
    const {userAddress} = this.props;

    let orderitems = [];
    for (const element of this.props.cartItems) {
      let orderItem = {
        itemName: element.name,
        itemQuantity: element.quantity,
        attribute: element.attribute,
        currency: element.currency,
        itemImage: element.images[0].image,
        itemPrice: element.price,
        itemTotal: element.price * element.quantity,
      };
      orderitems.push(orderItem);
    }

    let orderDetails = {
      token: userAddress[0]?.token,
      name: userAddress[0]?.name,
      email: userAddress[0]?.email,
      mobile: userAddress[0]?.mobile,
      city: userAddress[0]?.city,
      address: userAddress[0]?.address,
      state: userAddress[0]?.state,
      zip_code: userAddress[0]?.zip,
      user_id: userAddress[0]?.userId,
      payment_mode: this.state.paymentMethod,
      orderitems: orderitems,
    };
    console.log(orderDetails, 'orderDetails');

    orderPlace(orderDetails)
      .then(response => {
        let data = response.data;
        console.log(response);
        if (data.status === 200) {
          setCart(null);
          if (this.state.paymentMethod === 'COD') {
            this.props.resetCart();
            this.props.navigation.navigate('ThankYou');
          } else {
            this.onRazorpayInit(data.data);
          }
          this.refs.loading.close();
        }
      })
      .catch(error => {
        console.log(error);
        this.refs.loading.close();
      });
  };

  onRazorpayInit = async data => {
    // alert(RAZOR_RAZOR_KEY)
    this.refs.loading.show();

    var options = data;
    RazorpayCheckout.open(options)
      .then(data => {
        // handle success
        if (data.status_code === 200) {
          this.props.resetCart();
          this.updatePaymentData(data);
        }

        // navigation.navigate("orderdetails")
      })
      .catch(error => {
        // handle failure
        console.log(`Error: ${error.code} | ${error.description}`);
        this.refs.loading.close();
        this.cancelPaymentData(data);
        // navigation.navigate('orderdetails');
      });

    // setModalVisible(!modalVisible)
  };
  renderCartItem(item) {
    console.log(item, 'renderItem');
    return (
      <OrderItem
        item={item}
        count={item?.quantity}
        subTotal={this.props.cartTotal}
      />
    );
  }

  updatePaymentData = async data => {
    this.refs.loading.show();

    let options = {
      razorpay_order_id: data.razorpay_order_id,
      razorpay_payment_id: data.razorpay_payment_id,
      razorpay_signature: data.razorpay_signature,
      token: await getToken(),
    };
    await updatePayment(options)
      .then(res => {
        if (res.data.status === 200) {
          this.props.resetCart();
          this.props.navigation.navigate('ThankYou');
        }
        this.refs.loading.close();
      })
      .catch(err => {
        console.log(err);
        this.refs.loading.close();
      });
  };
  cancelPaymentData = async data => {
    this.refs.loading.show();

    let options = {
      razorpay_order_id: data.order_id,
      token: await getToken(),
    };
    await cancelPayment(options)
      .then(res => {
        if (res.data.status === 400) {
          this.props.navigation.navigate('MyOrder');
        }
      })
      .catch(err => {
        console.log(err);
        this.refs.loading.close();
      });
  };

  render() {
    const {navigation, cartItems, cartCount, cartTotal} = this.props;

    return (
      <View style={styles.mainContainer}>
        <View style={styles.box1}>
          <AppStatusBar
            backgroundColor={Color.colorPrimary}
            barStyle="light-content"
          />
          <ToolBar
            title="Place Order"
            icon="arrow-left"
            onPress={() => navigation.goBack()}
          />
          <ScrollView style={{paddingBottom: 200}}>
            <FlatList
              key={'flatlist'}
              data={cartItems}
              renderItem={({item, index}) => this.renderCartItem(item, index)}
              keyExtractor={item => item.id}
              extraData={this.state}
            />
            <View style={styles.amountContainer}>
              <View
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'flex-end',
                  alignItems: 'flex-end',
                  flexDirection: 'row',
                  marginBottom: 10,
                }}>
                <Text style={styles.title}>SubTotal : </Text>
                <Text style={styles.title}>Rs.{this.props.cartTotal}</Text>
              </View>

              <View
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'flex-end',
                  alignItems: 'flex-end',
                  flexDirection: 'row',
                  marginBottom: 10,
                }}>
                <Text style={styles.title}>Shipping Charges : </Text>
                <Text style={styles.title}>
                  {this.props.cartTotal > 300 ? 'Rs.0.0' : 'Rs.50.00'}
                </Text>
              </View>
              <View
                style={{
                  width: '100%',
                  height: 2,
                  backgroundColor: '#eeeeee',
                  marginBottom: 10,
                }}
              />
              <View
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'flex-end',
                  alignItems: 'flex-end',
                  flexDirection: 'row',
                  marginBottom: 10,
                }}>
                <Text style={styles.title}>Total Amount : </Text>
                <Text style={styles.title}>
                  Rs.
                  {this.props.cartTotal > 300
                    ? this.props.cartTotal
                    : parseFloat(this.props.cartTotal) + 50}
                </Text>
              </View>
            </View>
          </ScrollView>
        </View>
        <View style={styles.box2}>
          <View style={styles.paymentContainer}>
            <View style={{width: '50%'}}>
              <View
                style={{backgroundColor: Color.white, color: Color.primary}}>
                <Picker
                  selectedValue={this.state.paymentMethod}
                  style={{height: 50, width: '100%'}}
                  onValueChange={(itemValue, itemIndex) =>
                    this.setState({paymentMethod: itemValue})
                  }>
                  <Picker.Item label="Cash on Delivery" value="COD" />
                  <Picker.Item label="Online payment" value="ONLINE" />
                </Picker>
              </View>
            </View>
            <View style={{width: '50%'}}>
              <TouchableOpacity
                style={styles.checkout_container}
                onPress={() => this.onPlaceOrder()}>
                <Text style={styles.checkout}>
                  Pay -Rs.{' '}
                  {this.props.cartTotal > 300
                    ? this.props.cartTotal
                    : parseFloat(this.props.cartTotal) + 50}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
        <Loading ref="loading" indicatorColor={Color.colorPrimary} />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: Color.backgroundColor,
    flexDirection: 'column',
  },
  scrollView: {
    backgroundColor: Color.white,
    flexDirection: 'column',
    padding: 20,
    flexGrow: 1,
  },
  bottomImage: {
    height: 150,
    width: 150,
    position: 'absolute',
    bottom: 0,
    right: 80,
    zIndex: 1,
    flex: 1,
    opacity: 0.5,
    justifyContent: 'flex-end',
  },
  userRow: {
    display: 'flex',
    flexDirection: 'row',
    marginLeft: 15,
    marginTop: 10,
  },
  border: {
    borderBottomWidth: 1,
    borderColor: Color.graylight,
    margin: 10,
  },
  amountContainer: {
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.27,
    shadowRadius: 4.65,
    elevation: 5,
    display: 'flex',
    flexDirection: 'column',
    borderRadius: 20,
    padding: 20,
    margin: 20,
    backgroundColor: '#ffffff',
    marginBottom: 180,
  },
  title: {
    fontSize: 16,
    fontFamily: Fonts.primaryRegular,
  },
  box2: {
    width: Dimension.window.width,
    height: 50,
    position: 'absolute',
    bottom: 0,
    flexDirection: 'row',
    backgroundColor: Color.colorPrimary,
    display: 'flex',
    flex: 1,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.29,
    shadowRadius: 4.65,
    elevation: 7,
  },
  paymentContainer: {
    flexDirection: 'row',
  },
  total_price: {
    height: 50,
    paddingTop: 10,
    textAlign: 'center',
    fontSize: 18,
    fontWeight: '700',
    backgroundColor: Color.white,
    color: Color.colorPrimary,
  },
  checkout_container: {
    textAlign: 'center',
    height: 50,
    backgroundColor: Color.colorPrimary,
    color: Color.white,
  },
  checkout: {
    width: '100%',
    paddingTop: 10,
    textAlign: 'center',
    fontSize: 20,
    fontWeight: '700',
    color: Color.white,
  },
});
function mapStateToProps(state) {
  console.log(state, 'state');
  return {
    userAddress: state?.userAddressReducer.userAddress,
    selectedUserAddress: state?.userAddressReducer.selectedUserAddress,
    cartItems: state.cart?.cartItems, // Updated
    cartCount: state.cart?.cartCount,
    cartTotal: state.cart?.cartTotal,
    user_Details: state.user.userDetails,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    addSelectedAddress: selectedAddress => {
      return dispatch(addSelectedAddress(selectedAddress));
    },
    setSelectedAddress: selectedAddress => {
      return dispatch(setSelectedAddress(selectedAddress));
    },
    deleteSelectedAddress: selectedAddressId => {
      return dispatch(deleteSelectedAddress(selectedAddressId));
    },
    resetCart,
    set_User_Details,
    clearUserDetails,
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(PlaceOrder);
