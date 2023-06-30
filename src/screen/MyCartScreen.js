/* eslint-disable no-undef */
/* eslint-disable react-native/no-inline-styles */
import React, {Component} from 'react';

import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  FlatList,
  Button,
} from 'react-native';
import AppStatusBar from '../components/AppStatusBar';
import {Color, Fonts, Strings, Dimension, COLORS, SIZES, FONTS} from '../theme';
import ToolBar from '../components/ToolBar';
import {TouchableOpacity} from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import {getUserDetails, getCart, setCart} from '../utils/LocalStorage';
import BadgeIcon from '../components/BadgeIcon';
import Cart from '../utils/Cart';
import CartItem from '../components/CartItem';
import EmptyCart from '../assets/images/emptycart.png';
import {connect} from 'react-redux';
import {SwipeListView} from 'react-native-swipe-list-view';
import {BASE_URL} from '../axios/API';
import {
  removeFromCart,
  increaseQuantity,
  decreaseQuantity,
  updateCartCountAndTotal,
  addToCart,
  resetCart,
} from '../redux/cart/cartActions';

class MyCartScreen extends Component {
  constructor(props) {
    super(props);
  }

  renderCartItem(item) {
    return (
      <CartItem
        item={item}
        addToCart={this.addToCart}
        count={this.props.cartCount}
      />
    );
  }

  getProductQuantity(productId) {
    const {cartItems} = this.props;
    const cartItem = cartItems.find(item => item.id === productId);
    return cartItem ? cartItem.quantity : 0;
  }

  renderCartList = () => {
    const {navigation, cartItems, cartTotal, cartCount} = this.props;
    return (
      <SwipeListView
        data={cartItems}
        key={item => `${item.id}`}
        contentContainerStyle={{
          marginTop: SIZES.radius,
          paddingHorizontal: SIZES.padding,
          paddingBottom: SIZES.padding * 8,
          backgroundColor: COLORS.white,
        }}
        disableRightSwipe={true}
        rightOpenValue={-75}
        renderItem={(data, rowMap) => {
          const productQuantity = this.getProductQuantity(data.item.id);
          return (
            <>
              <View
                style={{
                  height: 130,
                  flexDirection: 'row',
                  alignItems: 'center',
                  marginTop: SIZES.radius,
                  paddingHorizontal: SIZES.radius,
                  marginBottom: 8,
                  backgroundColor: COLORS.white,
                  // borderRadius: SIZES.radius,
                }}>
                {/* Food Image */}
                <View style={{width: 90, height: 100, marginLeft: -10}}>
                  <Image
                    source={{
                      uri: `${BASE_URL + data.item?.images[0]?.image}`,
                    }}
                    resizeMode="contain"
                    style={{
                      width: '100%',
                      height: '100%',
                      position: 'absolute',
                      top: 10,
                    }}
                  />
                </View>
                {/* Food Info */}
                <View style={{flex: 1, paddingHorizontal: 10}}>
                  <Text
                    style={{
                      ...FONTS.body3,
                      fontSize: 14,
                      fontFamily: 'Poppins',
                      fontStyle: 'normal',
                      color: COLORS.black,
                    }}>
                    {data.item.name}
                  </Text>
                  <Text
                    style={{
                      ...FONTS.body3,
                      fontSize: 12,
                      fontFamily: 'Poppins',
                      fontStyle: 'normal',
                      color: COLORS.gray,
                    }}>
                    {data.item.attribute}
                  </Text>

                  {/* Quantity */}
                  <View
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      flexDirection: 'row',
                    }}>
                    <View>
                      {productQuantity > 0 ? (
                        <View style={styles.quantity}>
                          <TouchableOpacity
                            activeOpacity={1}
                            style={styles.plusBtn}
                            onPress={() => {
                              this.props.decreaseQuantity(data.item.id);
                            }}>
                            <Icon
                              name="minus"
                              size={20}
                              color={COLORS.darkGray2}
                            />
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
                            <Text style={styles.counter}>
                              {productQuantity}
                            </Text>
                          </View>
                          <TouchableOpacity
                            activeOpacity={1}
                            style={styles.plusBtn}
                            onPress={() => {
                              this.props.increaseQuantity(data.item.id);
                            }}>
                            <Icon
                              name="plus"
                              size={18}
                              color={Color.colorPrimary}
                            />
                          </TouchableOpacity>
                        </View>
                      ) : (
                        <View style={styles.addToCart}>
                          <TouchableOpacity
                            activeOpacity={1}
                            onPress={() => {
                              addToCart({...data.item, quantity: 1});
                            }}>
                            <Text style={styles.addToCartText}>+</Text>
                          </TouchableOpacity>
                        </View>
                      )}
                    </View>
                    <View>
                      <Text
                        style={{
                          ...FONTS.h1,
                          fontSize: 14,
                          fontFamily: 'Poppins',
                          fontStyle: 'normal',
                          color: COLORS.black,
                          fontWeight: 'bold',
                        }}>
                        {data.item.price}
                      </Text>
                    </View>
                  </View>
                </View>
              </View>
              <View
                style={{
                  backgroundColor: '#E2E2E2',
                  height: 2,
                }}
              />
            </>
          );
        }}
        renderHiddenItem={(data, rowMap) => {
          return (
            <TouchableOpacity
              onPress={() => this.props.removeFromCart(data.item.id)}
              style={{
                flex: 1,
                justifyContent: 'flex-end',
                backgroundColor: 'red',
                flexDirection: 'row',
                alignItems: 'center',
                marginTop: SIZES.radius,
                paddingHorizontal: SIZES.radius,
                marginBottom: 12,
                // borderRadius: SIZES.radius,
              }}>
              <Icon
                name="trash-2"
                style={{width: 30, height: 30, tintColor: COLORS.white}}
                size={30}
                color={COLORS.white}
              />
            </TouchableOpacity>
          );
        }}
      />
    );
  };

  render() {
    const {
      navigation,
      cartItems,
      cartTotal,
      cartCount,
      increaseQuantity,
      decreaseQuantity,
    } = this.props;
    return (
      <View style={styles.container}>
        <View style={styles.box1}>
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
              My Cart
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
              }}
            />
          </View>
          <View
            style={{
              backgroundColor: '#E2E2E2',
              height: 1,
              marginTop: 17,
            }}
          />
          {/* <ToolBar
            title="My Cart"
            icon="arrow-left"
            onPress={() => navigation.goBack()}
          /> */}

          {this.renderCartList()}

          {/* <FlatList
            key={'flatlist'}
            data={cartItems}
            renderItem={({item, index}) => this.renderCartItem(item, index)}
            keyExtractor={item => item.id}
            extraData={this.state}
            contentInset={{bottom: 150}}
            contentContainerStyle={{paddingBottom: 150}}
          /> */}
        </View>
        {cartCount > 0 ? (
          <View style={styles.box2}>
            <TouchableOpacity
              style={{
                backgroundColor: '#63AC36',
                borderRadius: 13,
                height: 67,
                width: 356,
                paddingHorizontal: 10,
                justifyContent: 'space-between',
                alignItems: 'center',
                display: 'flex',
                flexDirection: 'row',
              }}
              onPress={() => {
                this.props.navigation.navigate('ProductView', {
                  screen: 'AllAddress',
                });
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

                  //   lineHeight: 29,
                }}>
                Go to Checkout
              </Text>
              <View
                style={{
                  // width: '100%',
                  // height: '100%',
                  paddingLeft: 5,
                  paddingRight: 5,
                  paddingTop: 2,
                  paddingBottom: 2,
                  backgroundColor: '#489E67',
                  borderRadius: 4,
                  overflow: 'hidden',
                  flexDirection: 'column',
                  justifyContent: 'center',
                  alignItems: 'center',
                  gap: 10,
                  display: 'flex',
                }}>
                <Text
                  style={{
                    color: '#FCFCFC',
                    fontSize: 12,
                    fontFamily: 'Gilroy',
                    fontWeight: '800',
                    lineHeight: 18,
                    wordWrap: 'break-word',
                  }}>
                  RS. {cartTotal}
                </Text>
              </View>
            </TouchableOpacity>
            {/* <View style={{width: '50%'}}>
              <Text style={styles.total_price}>Total: RS. {cartTotal}</Text>
            </View>
            <View style={{width: '50%'}}>
              <TouchableOpacity
                style={styles.checkout_container}
                onPress={() => {
                  this.props.navigation.navigate('ProductView', {
                    screen: 'AllAddress',
                  });
                }}>
                <Text style={styles.checkout}>Checkout</Text>
              </TouchableOpacity>
            </View> */}
          </View>
        ) : (
          <View
            style={{
              flex: 1,
              flexDirection: 'column',
              alignItems: 'center',
            }}>
            <View style={styles.imgContainerStyle}>
              <Image style={styles.imageStyle} source={EmptyCart} />
            </View>
            <Text style={styles.title}>Empty Cart</Text>
            <Button
              color={Color.colorPrimaryDark}
              title="Shop Now"
              onPress={() => {
                this.props.navigation.navigate('Home');
              }}
            />
          </View>
        )}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.white,
  },
  box1: {
    display: 'flex',
    flexDirection: 'column',
  },
  box2: {
    width: Dimension.window.width,
    height: 50,
    position: 'absolute',
    bottom: 30,
    flexDirection: 'row',
    // backgroundColor: Color.colorPrimary,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
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
  imgContainerStyle: {
    height: 250,
    width: 250,
  },
  imageStyle: {
    width: '100%',
    height: '100%',
    overflow: 'hidden',
    alignItems: 'center',
    resizeMode: 'center',
  },
  title: {
    color: Color.textColor,
    fontFamily: Fonts.primarySemiBold,
    fontSize: 20,
    marginBottom: 20,
  },
  btnStyle: {
    padding: 10,
    backgroundColor: Color.colorPrimaryDark,
    borderRadius: 20,
    margin: 20,
    fontSize: 16,
  },
  counter: {
    fontFamily: Fonts.primarySemiBold,
    fontSize: 13,
    color: COLORS.darkGray2,
    textAlign: 'center',
    width: 30,
  },
  option: {
    fontFamily: Fonts.primarySemiBold,
    fontSize: 14,
    fontWeight: '300',
    color: COLORS.lightGray1,
    textAlign: 'center',
    marginLeft: 10,
    marginRight: 10,
    marginBottom: 10,
  },
  quantity: {
    display: 'flex',
    flexDirection: 'row',
    color: Color.white,
    textAlign: 'center',
    borderRadius: 20,
    justifyContent: 'flex-start',
    alignItems: 'center',
  },

  addToCartText: {
    paddingTop: 7,
    paddingBottom: 7,
    paddingLeft: 20,
    paddingRight: 20,
    color: Color.white,
  },

  plusBtn: {
    padding: 10,
  },
});

const mapStateToProps = state => {
  return {
    cartItems: state.cart?.cartItems, // Updated
    cartCount: state.cart?.cartCount,
    cartTotal: state.cart?.cartTotal,
  };
};
const mapDispatchToProps = {
  removeFromCart,
  resetCart,
  increaseQuantity,
  decreaseQuantity,
  addToCart,
};

export default connect(mapStateToProps, mapDispatchToProps)(MyCartScreen);
