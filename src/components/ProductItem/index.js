import React, {Component} from 'react';
import {View, Text, StyleSheet, ScrollView, Image} from 'react-native';
import {Color, Fonts, Strings, Dimension} from '../../theme';
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
      <View style={styles.container}>
        <View style={styles.box1}>
          <View style={styles.innerContainer}>
            <TouchableOpacity activeOpacity={1} onPress={this.props.onPress}>
              <Image
                style={styles.productImage}
                source={{
                  uri: `${BASE_URL + item?.images[0]?.image}`,
                }}
              />
              <Text style={styles.title}>{item.name}</Text>

              <Text style={styles.option}>
                {item.attribute + ' - ' + item.currency + ' ' + item.price}
              </Text>
            </TouchableOpacity>
          </View>

          {productQuantity > 0 ? (
            <View style={styles.quantity}>
              <TouchableOpacity
                activeOpacity={1}
                style={styles.plusBtn}
                onPress={() => {
                  // this.setState({
                  //   count: this.state.count - 1,
                  // });
                  // this.setCart(item, item.id, this.state.count - 1, item.price);
                  this.props.decreaseQuantity(item.id);
                }}>
                <Icon name="minus" size={20} color={Color.red} />
              </TouchableOpacity>
              <Text style={styles.counter}>{productQuantity}</Text>
              <TouchableOpacity
                activeOpacity={1}
                style={styles.plusBtn}
                onPress={() => {
                  // this.setState({
                  //   count: this.state.count + 1,
                  // });
                  // this.setCart(item, item.id, this.state.count + 1, item.price);
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
                  // this.setState({count: this.state.count + 1});
                  // this.setCart(item, item.id, this.state.count + 1, item.price);
                  addToCart({...item, quantity: 1});
                }}>
                <Text style={styles.addToCartText}>Add To Cart</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
        <View style={styles.box2}>
          <TouchableOpacity activeOpacity={1} style={styles.favoriteContainer}>
            <Icon name="heart" size={24} color={Color.colorPrimary} />
          </TouchableOpacity>
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
  container: {
    height: 280,
    width: 220,
    backgroundColor: Color.white,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    borderRadius: 10,
    elevation: 5,
    margin: 10,
    justifyContent: 'center',
    alignItems: 'center',
    display: 'flex',
    flexDirection: 'column',
  },
  box1: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  innerContainer: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontFamily: Fonts.primarySemiBold,
    fontSize: 14,
    color: Color.black,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    fontWeight: '600',
    textAlign: 'center',
    marginLeft: 10,
    marginRight: 10,
    marginTop: 10,
    height: 35,
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
    fontSize: 14,
    color: Color.red,
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
    backgroundColor: Color.colorPrimary,
    color: Color.white,
    textAlign: 'center',
    borderRadius: 20,
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
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,

    elevation: 2,
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
