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
        <View
          style={{
            alignItems: 'center',
            height: SIZES.height * 0.38,
            borderBottomLeftRadius: 16,
            borderBottomRightRadius: 16,
            backgroundColor: COLORS.green,
          }}>
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

  getProductQuantity(productId) {
    const {cartItems} = this.props;
    const cartItem = cartItems.find(item => item.id === productId);
    return cartItem ? cartItem.quantity : 0;
  }

  renderDetails(productItem) {
    const productQuantity = this.getProductQuantity(productItem.id);
    return (
      <View
        style={{
          marginBottom: SIZES.padding,
          backgroundColor: COLORS.lightGray2,
        }}>
        {/* item card section */}
        <View
          style={{
            height: 250,
            width: '100%',
            backgroundColor: COLORS.white,
            borderBottomLeftRadius: 28,
            borderBottomRightRadius: 28,
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
        <View
          style={{
            backgroundColor: COLORS.lightGray2,
            paddingHorizontal: SIZES.padding,
          }}>
          <ScrollView style={styles.scrollView}>
            <View
              style={{
                marginTop: SIZES.padding,
                color: COLORS.white,
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
              <Text
                style={{
                  ...FONTS.body3,
                  fontSize: 16,
                  fontFamily: 'Poppins',
                  fontStyle: 'normal',
                  color: COLORS.gray2,
                }}>
                {productItem.attribute}
              </Text>

              <View
                style={{
                  paddingVertical: 18,
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  flexDirection: 'row',
                }}>
                <View style={styles.quantity}>
                  <TouchableOpacity
                    activeOpacity={1}
                    style={styles.plusBtn}
                    onPress={() => {
                      this.props.decreaseQuantity(productItem.id);
                    }}>
                    <Icon name="minus" size={20} color={COLORS.darkGray2} />
                  </TouchableOpacity>
                  <View
                    style={{
                      borderColor: '#E2E2E2',
                      borderWidth: 1,
                      borderRadius: 12,
                      boxShadow: '0px 6px 12px 0px rgba(0, 0, 0, 0.00)',
                      height: 40,
                      width: 40,
                      display: 'flex',
                      justifyContent: 'center',
                      alignItems: 'center',
                    }}>
                    <Text style={styles.counter}>{productQuantity}</Text>
                  </View>
                  <TouchableOpacity
                    activeOpacity={1}
                    style={styles.plusBtn}
                    onPress={() => {
                      this.props.increaseQuantity(productItem.id);
                    }}>
                    <Icon name="plus" size={18} color={Color.colorPrimary} />
                  </TouchableOpacity>
                </View>
                <View>
                  <Text
                    style={{
                      ...FONTS.h1,
                      fontSize: 18,
                      fontFamily: 'Poppins',
                      fontStyle: 'normal',
                      color: COLORS.black,
                      fontWeight: 'bold',
                    }}>
                    Rs. {productItem.price}
                  </Text>
                </View>
              </View>

              <View
                style={{
                  backgroundColor: '#E2E2E2',
                  height: 1,
                  marginTop: 17,
                  marginBottom: 12,
                }}
              />
              <View
                style={{
                  paddingVertical: 18,
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  flexDirection: 'row',
                }}>
                <View>
                  <Text
                    style={{
                      ...FONTS.h1,
                      fontSize: 18,
                      fontFamily: 'Poppins',
                      fontStyle: 'normal',
                      color: COLORS.black,
                      fontWeight: 'bold',
                    }}>
                    Product Detail
                  </Text>
                </View>

                <View>
                  {/* <Icon
                    name={'chevron-down'}
                    style={{paddingLeft: 7}}
                    size={25}
                    color={COLORS.black}
                    onPress={() => this._renderRevealedFooter}
                  /> */}
                </View>
              </View>
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
      </View>
    );
  }

  footerPart(productItem) {
    return (
      <View style={styles.box2}>
        <TouchableOpacity
          style={{
            backgroundColor: '#63AC36',
            borderRadius: 16,
            height: 67,
            width: 356,
            paddingHorizontal: 10,
            justifyContent: 'center',
            alignItems: 'center',
            display: 'flex',
            flexDirection: 'row',
          }}
          onPress={() => {
            this.setToCart(productItem);
          }}>
          <View />
          <Text
            style={{
              color: '#FFF9FF',
              fontSize: 18,
              fontFamily: 'Poppins',
              fontWeight: '400',
              textAlign: 'center',
              lineHeight: 18,
            }}>
            Add To Basket
          </Text>
        </TouchableOpacity>
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
        <View
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexDirection: 'row',
            marginHorizontal: 5,
            marginVertical: 5,
            backgroundColor: COLORS.white,
          }}>
          <Icon
            name="arrow-left"
            style={{paddingLeft: 7}}
            size={25}
            color={COLORS.black}
            onPress={() => this.props.navigation.goBack()}
          />
          <Text
            style={{fontSize: 20, paddingVertical: 10, color: COLORS.black}}>
            {/* Our Products */}
          </Text>
          <View
            style={{
              width: 37,
              height: 27,
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              marginRight: 7,
              marginTop: 5,
            }}>
            <BadgeIcon
              icon="shopping-cart"
              count={this.props.cartCount}
              onPress={() => {
                this.props.navigation.navigate('MyCart');
              }}
            />
          </View>
        </View>

        <ScrollView style={styles.scrollView}>
          {productItem !== undefined && productItem !== null ? (
            this.renderDetails(productItem)
          ) : (
            <View
              style={{
                display: 'flex',
                flexDirection: 'row',
                marginTop: 50,
                backgroundColor: COLORS.lightGray1,
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
    backgroundColor: COLORS.white,
    // flexDirection: 'column',
  },
  scrollView: {
    flex: 1,
    flexDirection: 'column',
    marginBottom: 20,
    backgroundColor: COLORS.lightGray2,
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
    width: Dimension.window.width,
    height: 50,
    position: 'absolute',
    bottom: 30,
    flexDirection: 'row',
    backgroundColor: COLORS.lightGray2,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
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
  quantity: {
    display: 'flex',
    flexDirection: 'row',
    color: Color.white,
    textAlign: 'center',
    // borderRadius: 20,
    justifyContent: 'flex-start',
    alignItems: 'center',
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
    increaseQuantity: productId => {
      return dispatch(increaseQuantity(productId));
    },
    decreaseQuantity: productId => {
      return dispatch(decreaseQuantity(productId));
    },
    removeFromCart,
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(ProductView);
