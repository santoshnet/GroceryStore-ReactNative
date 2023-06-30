/* eslint-disable react-native/no-inline-styles */
import React, {Component} from 'react';
import {View, Text, StyleSheet, ScrollView, Image} from 'react-native';
import {Color, Fonts, Strings, Dimension, SIZES, COLORS} from '../../theme';
import {ProductImage} from '../../axios/ServerRequest';
import Icon from 'react-native-vector-icons/Feather';
import {TouchableOpacity} from 'react-native';
import PropTypes from 'prop-types';
import {BASE_URL} from '../../axios/API';
import {connect} from 'react-redux';
import {
  removeFromCart,
  increaseQuantity,
  decreaseQuantity,
  updateCartCountAndTotal,
  addToCart,
} from '../../redux/cart/cartActions';

class ProductItem extends Component {
  constructor(props) {
    super(props);
    this.state = {
      item: this.props.item,
      count: this.props.count ? this.props.count : 0,
      cart: null,
    };
  }

  getProductQuantity(productId) {
    const {cartItems} = this.props;
    const cartItem = cartItems.find(item => item.id === productId);
    return cartItem ? cartItem.quantity : 0;
  }
  onItemClicked = item => {
    // this.props.navi;
  };

  handleRemoveFromCart = itemId => {
    this.props.removeFromCart(itemId);
    this.props.updateCartCountAndTotal();
  };

  handleIncreaseQuantity = itemId => {
    this.props.increaseQuantity(itemId);
    this.props.updateCartCountAndTotal();
  };

  handleDecreaseQuantity = itemId => {
    this.props.decreaseQuantity(itemId);
    this.props.updateCartCountAndTotal();
  };

  render() {
    const {
      item,
      count,
      cartCount,
      cartTotal,
      removeFromCart,
      increaseQuantity,
      decreaseQuantity,
      cartItems,
      addToCart,
    } = this.props;
    const productQuantity = this.getProductQuantity(item.id);
    return (
      <View style={styles.Maincontainer}>
        <View style={styles.box1}>
          <View style={styles.innerContainer}>
            <TouchableOpacity activeOpacity={1} onPress={this.props.onPress}>
              <Image
                style={styles.productImage}
                source={{
                  uri: `${BASE_URL + item?.images[0]?.image}`,
                }}
              />
            </TouchableOpacity>
          </View>

          <View
            style={{
              display: 'flex',
              justifyContent: 'flex-start',
              alignItems: 'flex-start',
              // height:60
            }}>
            <Text style={styles.title}>{item.name}</Text>
            <Text style={styles.option}>{item.attribute}</Text>
          </View>

          <View
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              flexDirection: 'row',
            }}>
            <View>
              <Text style={{ color: COLORS.black}}>
                {item.currency + ' ' + item.price}
              </Text>
            </View>
            <View>
              {productQuantity > 0 ? (
                <View style={styles.quantity}>
                  <TouchableOpacity
                    activeOpacity={1}
                    style={styles.plusBtn}
                    onPress={() => {
                      this.props.decreaseQuantity(item.id);
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
                      this.props.increaseQuantity(item.id);
                    }}>
                    <Icon name="plus" size={18} color={Color.colorPrimary} />
                  </TouchableOpacity>
                </View>
              ) : (
                <View style={styles.addToCart}>
                  <TouchableOpacity
                    activeOpacity={1}
                    onPress={() => {
                      addToCart({...item, quantity: 1});
                    }}>
                    <Text style={styles.addToCartText}>+</Text>
                  </TouchableOpacity>
                </View>
              )}
            </View>
          </View>
        </View>
      </View>
    );
  }
}

ProductItem.propTypes = {
  addToCart: PropTypes.func,
  item: PropTypes.object,
  count: PropTypes.number,
};

const styles = StyleSheet.create({
  Maincontainer: {
    height: 280,
    width: 200,
    backgroundColor: COLORS.white,
    borderColor: '#E2E2E2',
    borderWidth: 1,
    borderRadius: 18,
    boxShadow: '0px 6px 12px 0px rgba(0, 0, 0, 0.00)',
    padding: SIZES.radius,
    alignItems: 'center',
    margin: 10,
  },
  box1: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    // alignItems: 'center',
  },
  innerContainer: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontFamily: Fonts.primarySemiBold,
    fontSize: 12,
    color: Color.black,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    fontWeight: '600',
    textAlign: 'center',
    marginLeft: 10,
    marginRight: 10,
    marginTop: 10,
    height: 45,
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
  productImage: {
    height: 100,
    width: 100,
    resizeMode: 'cover',
    alignSelf: 'center',
  },
  addToCart: {
    backgroundColor: '#53B175',
    color: Color.white,
    textAlign: 'center',
    borderRadius: 17,
    width: 50,
    height: 50,
    display: 'flex',
    justifyContent: 'center',
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
  },

  addToCartText: {
    paddingTop: 7,
    paddingBottom: 7,
    paddingLeft: 20,
    paddingRight: 20,
    color: Color.white,
  },
  box2: {
    position: 'absolute',
    top: 2,
    right: 2,
    width: 30,
    height: 30,
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
  increaseQuantity,
  decreaseQuantity,
  addToCart,
};

export default connect(mapStateToProps, mapDispatchToProps)(ProductItem);
