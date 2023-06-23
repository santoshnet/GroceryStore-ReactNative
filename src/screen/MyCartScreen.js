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
import {Color, Fonts, Strings, Dimension} from '../theme';
import ToolBar from '../components/ToolBar';
import {TouchableOpacity} from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import {getUserDetails, getCart, setCart} from '../utils/LocalStorage';
import BadgeIcon from '../components/BadgeIcon';
import Cart from '../utils/Cart';
import CartItem from '../components/CartItem';
import EmptyCart from '../assets/images/emptycart.png';
import {connect} from 'react-redux';
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

  render() {
    const {navigation, cartItems, cartTotal, cartCount} = this.props;
    return (
      <View style={styles.container}>
        <View style={styles.box1}>
          <AppStatusBar
            backgroundColor={Color.colorPrimary}
            barStyle="light-content"
          />
          <ToolBar
            title="My Cart"
            icon="arrow-left"
            onPress={() => navigation.goBack()}
          />

          <FlatList
            key={'flatlist'}
            data={cartItems}
            renderItem={({item, index}) => this.renderCartItem(item, index)}
            keyExtractor={item => item.id}
            extraData={this.state}
            contentInset={{bottom: 150}}
            contentContainerStyle={{paddingBottom: 150}}
          />
        </View>
        {cartCount > 0 ? (
          <View style={styles.box2}>
            <View style={{width: '50%'}}>
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
            </View>
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
    flexDirection: 'column',
  },
  box1: {
    display: 'flex',
    flexDirection: 'column',
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
});

const mapStateToProps = state => {
  return {
    cartItems: state.cart?.cartItems, // Updated
    cartCount: state.cart?.cartCount,
    cartTotal: state.cart?.cartTotal,
  };
};
const mapDispatchToProps = {
  removeFromCart: itemid => {
    return dispatch(removeFromCart(itemid));
  },
  resetCart,
  increaseQuantity,
  decreaseQuantity,
  addToCart,
};

export default connect(mapStateToProps, mapDispatchToProps)(MyCartScreen);
