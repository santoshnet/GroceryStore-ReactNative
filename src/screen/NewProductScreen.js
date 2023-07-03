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
  ActivityIndicator,
} from 'react-native';
import AppStatusBar from '../components/AppStatusBar';
import {Color, Fonts, Strings, Dimension, COLORS} from '../theme';

import ToolBar from '../components/ToolBar';

import {TouchableOpacity} from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import BadgeIcon from '../components/BadgeIcon';
import BannerSlider from '../components/BannerSlider';
import {
  getProductByCategory,
  getProductBySubCategory,
  getProductList,
  getAllCategory,
} from '../axios/ServerRequest';
import {getUserDetails, getCart, setCart} from '../utils/LocalStorage';
import ProductRow from '../components/ProductItem/ProductRow';
import Cart from '../utils/Cart';
import Loading from '../components/Loading';
import EmptyProduct from '../assets/images/emptyproduct.png';
import DummyImage from '../assets/images/image.png';
import {connect} from 'react-redux';
import alertmessages from '../utils/helpers';
import {
  removeFromCart,
  increaseQuantity,
  decreaseQuantity,
  updateCartCountAndTotal,
  addToCart,
} from '../redux/cart/cartActions';
import {
  fetchCategories,
  fetchBestSellingProducts,
  fetchNewProducts,
  fetchOffers,
  fetchBanners,
} from '../redux/products/productsActions';
import {BASE_URL} from '../axios/API';

class NewProductScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      categoryData: [],
      subcategoryData: [],
      products: [],
      selected: false,
      cartCount: 0,
      cartList: [],
      category: '',
      loading: true,
    };
  }

  async componentDidMount() {
    this.props.fetchNewProducts();
  }

  navigateToScreen = item => {
    this.props.navigation.navigate('ProductView', {item: item});
  };

  getProductQuantity(productId) {
    const {
      cartItems,
      item,
      count,
      cartCount,
      cartTotal,
      removeFromCart,
      increaseQuantity,
      decreaseQuantity,

      addToCart,
    } = this.props;
    const cartItem = cartItems.find(item => item.id === productId);
    return cartItem ? cartItem.quantity : 0;
  }

  renderProductCards(products) {
    const {
      cartItems,
      item,
      count,
      cartCount,
      cartTotal,
      removeFromCart,
      increaseQuantity,
      decreaseQuantity,

      addToCart,
    } = this.props;

    return (
      <FlatList
        data={products}
        numColumns={2}
        renderItem={({item}) => {
          const productQuantity = this.getProductQuantity(item.id);
          const isSingleProduct = item.length === 1;
          return (
            <View style={[styles.gridCard]}>
              <View style={styles.box1}>
                <View style={styles.innerContainer}>
                  <TouchableOpacity
                    activeOpacity={1}
                    onPress={() =>
                      this.props.navigation.navigate('ProductView', {
                        screen: 'ProductView',
                        params: {item: item},
                      })
                    }>
                    <Image
                      style={styles.productImage}
                      source={{
                        uri: `${BASE_URL + item?.images[0]?.image}`,
                      }}
                    />
                  </TouchableOpacity>
                </View>

                <View style={styles.textContainer}>
                  <Text style={styles.title}>{item.name}</Text>
                  <Text style={styles.option}>{item.attribute}</Text>
                </View>

                <View
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    flexDirection: 'row',
                    padding: 5,
                  }}>
                  <View>
                    <Text style={{color: COLORS.black}}>
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
                          <Text style={styles.counter}>{productQuantity}</Text>
                        </View>
                        <TouchableOpacity
                          activeOpacity={1}
                          style={styles.plusBtn}
                          onPress={() => {
                            this.props.increaseQuantity(item.id);
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
        }}
        keyExtractor={(item, index) => index.toString()}
        contentContainerStyle={styles.flatListContent}
      />
    );
  }

  render() {
    const {navigation} = this.props;
    const {products, loading, newProducts} = this.props.productsReducer;

    return (
      <View style={styles.mainContainer}>
        <AppStatusBar backgroundColor="#44C062" barStyle="light-content" />
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
            New Products
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
                navigation.navigate('MyCart');
              }}
            />
          </View>
        </View>
        {!loading ? (
          <ScrollView
            contentContainerStyle={{paddingVertical: 20, marginBottom: 100}}>
            {this.renderProductCards(newProducts)}
          </ScrollView>
        ) : (
          <View
            style={{
              flex: 1,
              backgroundColor: COLORS.white,
              alignItems: 'center',
              justifyContent: 'center',
              flexDirection: 'row',
              borderRadius: 16,
            }}>
            <ActivityIndicator size="large" color={COLORS.green} />
          </View>
        )}

        <Loading ref="loading" indicatorColor={Color.colorPrimary} />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: Color.white,
    flexDirection: 'column',
  },
  scrollView: {
    flex: 1,
    backgroundColor: Color.white,
    flexDirection: 'column',
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
  flatListContent: {
    paddingVertical: 10,
    paddingHorizontal: 5,
  },
  gridCard: {
    flex: 1,
    borderRadius: 18,
    borderColor: '#E2E2E2',
    borderWidth: 1,
    margin: 5,
    backgroundColor: '#FFF',
    overflow: 'hidden',
    height: 280,
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
    // height: 33,
    // shadowColor: '#000',
    // shadowOffset: {
    //   width: 0,
    //   height: 1,
    // },
    // shadowOpacity: 0.2,
    // shadowRadius: 1.41,

    // elevation: 2,
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
  console.log(state, 'catwise');
  return {
    cartItems: state.cart?.cartItems, // Updated
    cartCount: state.cart?.cartCount,
    cartTotal: state.cart?.cartTotal,
    productsReducer: state.productsReducer,
  };
};
const mapDispatchToProps = {
  removeFromCart,
  increaseQuantity,
  decreaseQuantity,
  addToCart,
  fetchNewProducts: () => dispatch(fetchNewProducts()),
};

export default connect(mapStateToProps, mapDispatchToProps)(NewProductScreen);
