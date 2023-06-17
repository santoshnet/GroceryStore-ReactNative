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
    return (
      <View style={{marginTop: 10, marginBottom: 20, paddingBottom: 10}}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{paddingHorizontal: 10}}>
          {this.state.categoryData &&
            this.state.categoryData.map((item, index) => {
              return (
                <TouchableOpacity
                  key={index}
                  onPress={() => {
                    this.fetchProductByCategory(item.id);
                  
                    this.setState({category: item?.category})
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
      <ScrollView
        contentContainerStyle={{
          flexDirection: 'row',
          flexWrap: 'wrap',
          paddingHorizontal: 8,
          marginBottom: 500,
          height: '100%',
        }}>
        {products.map(item => {
          const productQuantity = this.getProductQuantity(item.id);
          return (
            <View
              key={item.id}
              style={{
                width: '50%',
                paddingHorizontal: 3,
                marginBottom: 16,
              }}>
              <View
                style={{
                  backgroundColor: '#fff',
                  borderRadius: 8,
                  overflow: 'hidden',
                  borderWidth: 1,
                  borderColor: '#ddd',
                  shadowColor: '#000',
                  shadowOffset: {width: 0, height: 2},
                  shadowOpacity: 0.7,
                  shadowRadius: 4,
                  elevation: 1,
                  width: '100%',
                  height: '100%',
                  maxHeight: 230,
                  paddingBottom: 10,
                }}>
                <View
                  style={{
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}>
                  <View style={styles.innerContainer}>
                    <TouchableOpacity
                      activeOpacity={1}
                      onPress={() =>
                        this.props.navigation.navigate('ProductView', {
                          item: item,
                        })
                      }>
                      <Image
                        style={styles.productImage}
                        source={{
                          uri: `${BASE_URL + item?.images[0]?.image}`,
                        }}
                      />
                      <Text style={styles.title1}>{item.name}</Text>

                      <Text style={styles.option}>
                        {item.attribute +
                          ' - ' +
                          item.currency +
                          ' ' +
                          item.price}
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
                          alertmessages.showSuccess('This  product is added in the cart!');
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
                          // this.setState({count: this.state.count + 1});
                          // this.setCart(item, item.id, this.state.count + 1, item.price);
                          addToCart({...item, quantity: 1});
                          alertmessages.showSuccess('This  product is added in the cart!');
                        }}>
                        <Text style={styles.addToCartText}>Add To Cart</Text>
                      </TouchableOpacity>
                    </View>
                  )}
                </View>
              </View>
            </View>
          );
        })}
      </ScrollView>
    );
  }

  render() {
    const {navigation} = this.props;

    return (
      <View style={styles.mainContainer}>
        <AppStatusBar backgroundColor="#44C062" barStyle="light-content" />
        <ToolBar
          title={this.state.category}
          icon="arrow-left"
          onPress={() => navigation.goBack()}>
          <TouchableOpacity style={{marginRight: 10}}>
            <Icon name="search" size={24} color="#ffffff" />
          </TouchableOpacity>

          <BadgeIcon
            icon="shopping-cart"
            count={this.props.cartCount}
            onPress={() => {
              navigation.navigate('MyCart');
            }}
          />
        </ToolBar>

        {/* <View style={{marginBottom: 100}}> */}
        {/* <View
            style={{
              // width: 90,
              backgroundColor: '#f2f2f2',
              // height: Dimension.window.height,
              padding: 2,
              // alignItems: 'center',
            }}> */}
        {/* <FlatList
              showsHorizontalScrollIndicator={false}
              horizontal={true}
              data={this.state.subcategoryData}
              renderItem={({item, index}) =>
                this.renderSubcategoryItem(item, index)
              }
              keyExtractor={item => item.id}
              extraData={this.state}
            /> */}

        <ScrollView
          contentContainerStyle={{paddingVertical: 20, marginBottom: 100}}>
          {this.renderCategoryList()}
          {this.renderProductCards(this.state.products)}
        </ScrollView>
        {/* </View> */}

        {/* <View style={{display: 'flex', flexDirection: 'row'}}>
            <View style={{flex: 1}}>
              <FlatList
                showsVerticalScrollIndicator={false}
                data={this.state.products}
                renderItem={({item, index}) =>
                  this.renderProductItem(item, index)
                }
                keyExtractor={item => item.id}
                extraData={this.state}
              />
            </View>
          </View> */}

        {/* <FlatList
            showsVerticalScrollIndicator={false}
            key={'flatlist1'}
            data={this.state.products}
            renderItem={({item, index}) => this.renderProductItem(item, index)}
            keyExtractor={item => item.id}
            extraData={this.state}
          /> */}
        {/* {this.state.products.length == 0 ? (
            <View
              style={{
                flex: 1,
                flexDirection: 'column',
                alignItems: 'center',
              }}>
              <View style={styles.imgContainerStyle}>
                <Image style={styles.imageStyle} source={EmptyProduct} />
              </View>
              <Text style={styles.title}>Empty Product</Text>
            </View>
          ) : null} */}
        {/* </View> */}
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
  title: {
    color: Color.gray,
    fontFamily: Fonts.primarySemiBold,
    fontSize: 20,
    marginBottom: 10,
  },
  card: {
    width: 70,
    height: 70,
    padding: 5,
    backgroundColor: '#fff',
    borderRadius: 8,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
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
  title1: {
    fontFamily: Fonts.primarySemiBold,
    fontSize: 10,
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
    fontSize: 10,
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

export default connect(mapStateToProps, mapDispatchToProps)(ProductsScreen);
