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
import {BASE_URL} from '../axios/API';

class ProductsScreen extends Component {
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
    };
  }

  async componentDidMount() {
    this.reRenderSomething = this.props.navigation.addListener('focus', () => {
      this.init();
    });
  }

  init = async () => {
    this.fetchProductsList(this.props.route.params.item.category);
    let cart = await getCart();

    console.log('Category===================>', this.props.route.params.item);
    this.fetchCategory();
    this.setState({
      cartList: cart,
      cartCount: Cart.getTotalCartCount(cart),
      category: this.props.route.params.item.category,
      subcategoryData: this.props.route.params.item.subCategory,
    });

    if (
      this.props.route.params.item.subCategory &&
      this.props.route.params.item.subCategory.length > 0
    ) {
      this.fetchProductBySubCategory(
        this.props.route.params.item.subCategory[0].id,
      );
    } else {
      this.fetchProductByCategory(this.props.route.params.item.id);
    }
  };

  fetchCategory = () => {
    this.refs.loading.show();
    getAllCategory()
      .then(response => {
        // console.log('category====>', response.data);
        this.setState({categoryData: response.data.categories});
        this.refs.loading.close();
      })
      .catch(error => {
        console.log(error);
        this.refs.loading.close();
      });
  };

  fetchProductBySubCategory = async id => {
    this.refs.loading.show();
    await getProductBySubCategory(id)
      .then(res => {
        console.log(res.data);
        this.setState({products: res.data.products});
        this.refs.loading.close();
      })
      .catch(err => {
        console.log(err);
        this.refs.loading.close();
      });
  };
  fetchProductByCategory = async id => {
    this.refs.loading.show();
    await getProductByCategory(id)
      .then(res => {
        console.log(res.data);
        this.setState({products: res.data.products});
        this.refs.loading.close();
      })
      .catch(err => {
        console.log(err);
        this.refs.loading.close();
      });
  };

  fetchProductsList = category => {
    this.refs.loading.show();

    getProductList(category)
      .then(response => {
        console.log(response.data.products, 'all');
        this.setState({products: response.data.products});
        this.refs.loading.close();
      })
      .catch(error => {
        console.log(error);
        this.refs.loading.close();
      });
  };

  resetData = () => {
    this.setState({popularProduct: this.state.popularProduct});
  };

  navigateToScreen = item => {
    this.props.navigation.navigate('ProductView', {item: item});
  };

  renderProductItem(item) {
    let cart = Cart.getItemCount(this.state.cartList, item);
    return (
      <ProductRow
        item={item}
        // addToCart={this.addToCart}
        count={cart}
        onPress={() => {
          this.navigateToScreen(item);
        }}
      />
    );
  }

  renderSubcategoryItem(item) {
    return (
      <TouchableOpacity
        style={{marginTop: 10}}
        onPress={() => {
          this.fetchProductBySubCategory(item.id);
        }}>
        <View style={styles.card}>
          <Image style={{height: 40, width: 40}} source={DummyImage} />
          <Text style={{fontSize: 10}} numberOfLines={2} ellipsizeMode="tail">
            {item.sub_category_title}
          </Text>
        </View>
      </TouchableOpacity>
    );
  }

  renderCategoryList = () => {
    const {
      categoryData,
      bestSellingProducts,
      newProducts,
      offers,
      banners,
      loading,
      error,
    } = this.props.productsReducer;
    return (
      <View style={{marginTop: 10, marginBottom: 20, paddingBottom: 10}}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{paddingHorizontal: 10}}>
          {categoryData &&
            categoryData.map((item, index) => {
              return (
                <TouchableOpacity
                  key={index}
                  onPress={() => {
                    this.fetchProductByCategory(item.id);

                    this.setState({category: item?.category});
                  }}
                  style={{
                    width: 100,
                    height: 100,
                    borderRadius: 10,
                    marginRight: 10,
                    shadowColor: '#000',
                    shadowOffset: {
                      width: 0,
                      height: 2,
                    },
                    shadowOpacity: 0.2,
                    shadowRadius: 2,
                    elevation: 2,
                    justifyContent: 'center',
                    alignItems: 'center',
                    backgroundColor: '#F2F2F2', // Light silver color
                  }}>
                  <Image
                    source={{
                      uri: `${BASE_URL + item?.cateimg}`,
                    }}
                    style={{
                      width: 50,
                      height: 50,
                      resizeMode: 'cover',
                    }}
                  />
                  <Text
                    style={{
                      fontFamily: Fonts.primaryRegular,
                      color: Color.black,
                      fontSize: 12,
                      textAlign: 'center',
                      marginTop: 5,
                    }}>
                    {item.category}
                  </Text>
                </TouchableOpacity>
              );
            })}
        </ScrollView>
      </View>
    );
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
                    onPress={this.props.onPress}>
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
            {this.state.category}
          </Text>
          <View
            style={{
              width: 37,
              height: 27,
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              marginRight:7,
              marginTop:5
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

        <ScrollView
          contentContainerStyle={{paddingVertical: 20, marginBottom: 100}}>
          {this.renderCategoryList()}
          {this.renderProductCards(this.state.products)}
        </ScrollView>

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
};

export default connect(mapStateToProps, mapDispatchToProps)(ProductsScreen);
