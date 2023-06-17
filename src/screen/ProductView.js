/* eslint-disable react-native/no-inline-styles */

/* eslint-disable no-dupe-keys */
import React, {Component} from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  ScrollView,
  Animated,
  TextInput,
  Modal,
} from 'react-native';
import AppStatusBar from '../components/AppStatusBar';
import {Color, Fonts, Strings, Dimension, COLORS, SIZES, FONTS} from '../theme';
import ToolBar from '../components/ToolBar';
import {TouchableOpacity} from 'react-native';
import Icon from 'react-native-vector-icons/Feather';

import BadgeIcon from '../components/BadgeIcon';
import Cart from '../utils/Cart';
import {ProductImage} from '../axios/ServerRequest';
import ReadMore from 'react-native-read-more-text';
import {
  getProductItem,
  getCart,
  setCart,
  setProductItem,
} from '../utils/LocalStorage';
import {BASE_URL} from '../axios/API';
import alertmessages from '../utils/helpers';
import RenderHTML from 'react-native-render-html';
import {
  addSelectedAddress,
  setSelectedAddress,
  deleteSelectedAddress,
  checkItemDeliveryAddress,
} from '../redux/userAddress/actions';
import {connect} from 'react-redux';
import CheckPinCode from './CheckPinCode';
import {listenerCount} from 'process';
import {
  removeFromCart,
  increaseQuantity,
  decreaseQuantity,
  updateCartCountAndTotal,
  addToCart,
} from '../redux/cart/cartActions';

class ProductView extends Component {
  constructor(props) {
    super(props);
    this.state = {
      cartCount: 0,
      productItem: null,
      count: 0,
      cart: null,
      itemIndex: -1,
      showFilterModal: false,
      pinErrorMesg: '',
      zip: this.props.selectedUserAddress?.zip,
    };
  }
  async componentDidMount() {
    let item = null;
    if (this.props.route.params !== undefined) {
      item = this.props.route.params.item;
    }

    this.setState({
      productItem: item,
    });

    if (this.checkPin() == true) {
      this.setState({
        pinErrorMesg: true,
      });
    } else if (this.checkPin() == false) {
      this.setState({
        pinErrorMesg: false,
      });
    }
  }

  setToCart = productItem => {
    if (this.checkPin() == true) {
      this.props.addToCart({...productItem, quantity: 1});
      alertmessages.showSuccess('This  product is added in the cart!');
      setTimeout(() => {
        this.props.navigation.goBack();
      }, 1000);
    } else {
      this.setState({
        pinErrorMesg: false,
      });
    }
  };

  checkPin = () => {
    let {deliveryItemPinCode} = this.props;
    let checkpinCode = deliveryItemPinCode.some(
      ele => ele.pin === this.props?.selectedUserAddress?.zip,
    );
    return checkpinCode;
  };

  renderFoodInfo(productItem, count) {
    const scrollX = new Animated.Value(0);
    return (
      <Animated.ScrollView
        horizontal
        pagingEnabled
        scrollEventThrottle={16}
        snapToAlignment="center"
        showsHorizontalScrollIndicator={false}
        onScroll={Animated.event(
          [{nativeEvent: {contentOffset: {x: scrollX}}}],
          {useNativeDriver: false},
        )}>
        {/* {restaurant?.menu.map((item, index) => ( */}
        <View style={{alignItems: 'center'}}>
          <View style={{height: SIZES.height * 0.38}}>
            {/* Food Image */}
            <Image
              source={{
                uri: `${BASE_URL + productItem?.images[0]?.image}`,
              }}
              resizeMode="cover"
              style={{
                width: SIZES.width,
                height: '100%',
              }}
            />
          </View>

          {/* Name & Description */}

          <View
            style={{
              width: SIZES.width,
              alignItems: 'center',
              marginTop: 15,
              paddingHorizontal: SIZES.padding * 9,
              paddingVertical: SIZES.padding * 9,
              marginBottom: 20,
            }}>
            <Text
              style={{marginVertical: 10, textAlign: 'center', ...FONTS.h2}}>
              {productItem?.attribute} - {productItem?.price}
            </Text>
          </View>

          {/* Calories */}

          <View
            style={{
              display: 'flex',
              justifyContent: 'flex-start',
              alignItems: 'flex-start',
              flexDirection: 'row',
              marginTop: 6,
              width: SIZES.width,
            }}>
            <Text
              style={{
                ...FONTS.body3,
                fontFamily: Fonts.primaryRegular,
                fontSize: 14,
                color: Color.gray,
                textAlign: 'left',
                padding: 12,
              }}>
              {productItem?.description.replace(/<\/?[^>]+(>|$)/g, '')}
            </Text>
          </View>

          <View
            style={{
              display: 'flex',
              justifyContent: 'flex-start',
              alignItems: 'flex-start',
              flexDirection: 'row',
              marginBottom: 6,
              width: SIZES.width,
            }}
          />
        </View>
      </Animated.ScrollView>
    );
  }

  renderPincodeChange() {
    return (
      <View
        style={{
          color: COLORS.black,
          paddingBottom: 50,
          paddingTop: 20,
        }}>
        {/* Label & Error msg */}
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
          }}>
          <Text
            style={{
              color: COLORS.black,
              ...FONTS.h5,
              fontWeight: 500,
            }}>
            Delivery & Services For
          </Text>
        </View>

        {/* Text Input */}
        <View
          style={{
            flexDirection: 'row',
            height: 55,
            paddingHorizontal: SIZES.padding,
            marginTop: SIZES.base,
            borderRadius: SIZES.radius,
            backgroundColor: COLORS.white,
          }}>
          <TextInput
            style={{
              flex: 1,
              color: COLORS.black,
            }}
            ref={input => {
              this.nameOrId = input;
            }}
            value={this.props.selectedUserAddress?.zip}
            placeholder={'pincode'}
            placeholderTextColor={COLORS.grey}
            contextMenuHidden={true}
            editable={false}
            selectTextOnFocus={false}
            keybordType="numeric"
            autoCompleteType={true}
            // autoCapitalize={autoCapitalize}
            // onChangeText={text => onChange(text)}
          />
          <View
            style={{
              justifyContent: 'center',
            }}>
            <TouchableOpacity
              onPress={() => this.setState({showFilterModal: true})}>
              <Text
                style={{
                  color: COLORS.primary,
                  ...FONTS.h5,
                  fontWeight: 500,
                }}>
                change
              </Text>
            </TouchableOpacity>
          </View>
        </View>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
          }}>
          {this.state.pinErrorMesg === true ? (
            <Text
              style={{
                color: COLORS.green,
                ...FONTS.h5,
                fontWeight: 500,
              }}>
              delivery is availble to this location
            </Text>
          ) : (
            <Text
              style={{
                color: COLORS.red,
                ...FONTS.h5,
                fontWeight: 500,
              }}>
              delivery is not availble to this location
            </Text>
          )}
        </View>
      </View>
    );
  }

  renderDetails(productItem) {
    return (
      <View
        style={{
          marginTop: SIZES.base,
          marginBottom: SIZES.padding,
          paddingHorizontal: SIZES.padding,
        }}>
        {/* item card section */}
        <View
          style={{
            height: 250,
            borderRadius: 15,
            backgroundColor: COLORS.white,
          }}>
          {/* Favourite & new section */}

          {/* {console.log(itemDetails[0]?.image,"itemDetails?.image")} */}
          {/* item image  */}
          <Image
            source={{
              uri: `${BASE_URL + productItem?.images[0]?.image}`,
            }}
            resizeMode="contain"
            style={{
              height: '100%',
              width: '100%',
            }}
          />
        </View>

        {/* item info */}
        <ScrollView style={styles.scrollView}>
          <View
            style={{
              marginTop: SIZES.padding,
            }}>
            {/* Name and Description  */}
            <Text
              style={{
                ...FONTS.h2,
                color: COLORS.black,
                fontWeight: 'bold',
              }}>
              {productItem?.name}
            </Text>
            <ReadMore
              numberOfLines={3}
              renderTruncatedFooter={this._renderTruncatedFooter}
              renderRevealedFooter={this._renderRevealedFooter}
              onReady={this._handleTextReady}>
              <Text
                style={{
                  marginTop: SIZES.base,
                  color: COLORS.darkGray,
                  textAlign: 'justify',
                  ...FONTS.h5,
                }}>
                {productItem?.description.replace(/<\/?[^>]+(>|$)/g, '')}
              </Text>
            </ReadMore>
            {this.renderPincodeChange()}
          </View>
        </ScrollView>
      </View>
    );
  }

  footerPart(productItem) {
    return (
      <View style={styles.box2}>
        <View style={{width: '50%'}}>
          <Text style={styles.total_price}>
            Price: {'\u20B9'} {productItem?.price}
          </Text>
        </View>
        <View style={{width: '50%'}}>
          <TouchableOpacity
            style={styles.checkout_container}
            onPress={() => {
              this.setToCart(productItem);
            }}>
            <Text style={styles.checkout}>ADD CART</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  _renderTruncatedFooter = handlePress => {
    return (
      <Text
        style={{color: COLORS.darkgray, marginTop: 5}}
        onPress={handlePress}>
        Read more
      </Text>
    );
  };

  _renderRevealedFooter = handlePress => {
    return (
      <Text
        style={{color: COLORS.darkgray, marginTop: 5}}
        onPress={handlePress}>
        Show less
      </Text>
    );
  };

  _handleTextReady = () => {
    // ...
  };

  render() {
    const {navigation, checkItemDeliveryAddress, selectedUserAddress} =
      this.props;
    const {productItem, isProductExist} = this.state;

    return (
      <View style={styles.mainContainer}>
        <AppStatusBar
          backgroundColor={Color.colorPrimary}
          barStyle="light-content"
        />
        <ToolBar
          title="ProductView"
          icon="arrow-left"
          onPress={() => navigation.goBack()}>
          <BadgeIcon
            icon="shopping-cart"
            count={this.props.cartCount}
            onPress={() => {
              navigation.navigate('MyCart');
            }}
          />
        </ToolBar>
        <ScrollView style={styles.scrollView}>
          {productItem !== undefined && productItem !== null ? (
            this.renderDetails(productItem)
          ) : (
            <View
              style={{
                display: 'flex',
                flexDirection: 'row',
                marginTop: 50,
                backgroundColor: COLORS.lightGray,
                padding: 15,
                borderRadius: 10,
                alignItems: 'center',
                justifyContent: 'space-between',
                marginBottom: 20,
              }}>
              <View style={{display: 'flex', flexDirection: 'row'}}>
                <Text
                  style={{
                    display: 'flex',
                    flexDirection: 'row',
                    marginRight: 5,
                    color: COLORS.primary,
                  }}>
                  !
                </Text>
                <Text>Please Add your Delivery Address</Text>
              </View>
            </View>
          )}
        </ScrollView>
        {this.state.showFilterModal && (
          <CheckPinCode
            isVisible={this.state.showFilterModal}
            onClose={() => {
              this.setState({showFilterModal: false});
            }}
            pinsuccess={() => this.setState({pinErrorMesg: true})}
            pinfailure={() => this.setState({pinErrorMesg: false})}
          />
        )}
        {this.footerPart(productItem)}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: Color.white,
    // flexDirection: 'column',
  },
  scrollView: {
    flex: 1,
    backgroundColor: Color.backgroundColor,
    flexDirection: 'column',
    marginBottom: 20,
  },
  title: {
    fontFamily: Fonts.primarySemiBold,
    fontSize: 16,
  },
  imageContainer: {
    display: 'flex',
    height: 250,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Color.white,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
  },
  productImage: {
    height: 200,
    width: 200,
  },
  box2: {
    position: 'absolute',
    top: 2,
    right: 2,
    width: 20,
    height: 20,
  },
  contentContainer: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 30,
  },
  title: {
    fontFamily: Fonts.primaryRegular,
    fontSize: 16,
    color: Color.gray,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    fontWeight: '600',
    marginTop: 20,
  },
  description: {
    fontFamily: Fonts.primaryRegular,
    fontSize: 14,
    color: Color.gray,
    textAlign: 'center',
    marginTop: 20,
  },
  counter: {
    fontFamily: Fonts.primarySemiBold,
    fontSize: 16,
    color: Color.black,
    textAlign: 'center',
    width: 30,
  },
  option: {
    fontFamily: Fonts.primarySemiBold,
    fontSize: 16,
    color: Color.colorPrimary,
  },
  addToCartText: {
    paddingTop: 7,
    paddingBottom: 7,
    paddingLeft: 10,
    paddingRight: 10,
    color: Color.white,
  },
  plusBtn: {
    padding: 10,
  },
  addToCart: {
    backgroundColor: Color.colorPrimary,
    color: Color.white,
    textAlign: 'center',
    borderRadius: 20,
    width: 100,
    marginTop: 20,
  },
  quantity: {
    display: 'flex',
    flexDirection: 'row',
    backgroundColor: Color.white,
    color: Color.white,
    textAlign: 'center',
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    height: 33,
    width: 100,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
    elevation: 2,
    marginTop: 20,
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
  },
  total_price: {
    height: 50,
    paddingTop: 10,
    textAlign: 'center',
    fontSize: 20,
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
    isDeliveryToLocation: state?.userAddressReducer.isDeliveryToLocation,
    deliveryItemPinCode: state.userAddressReducer?.deliveryItemPinCode,
    cartItems: state.cart.cartItems,
    cartTotal: state.cart.cartTotal,
    cartCount: state.cart.cartCount,
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
    checkItemDeliveryAddress: selectedAddressPin => {
      return dispatch(checkItemDeliveryAddress(selectedAddressPin));
    },
    addToCart: item => {
      return dispatch(addToCart(item));
    },
    increaseQuantity,
    decreaseQuantity,
    removeFromCart,
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(ProductView);
