/* eslint-disable react-native/no-inline-styles */

import React, {Component} from 'react';
import {
  FlatList,
  Image,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  View,
  TextInput,
  Platform,
} from 'react-native';

import AppStatusBar from '../components/AppStatusBar';
import {Color, Dimension, Fonts, SIZES, COLORS, FONTS, item} from '../theme';

import ToolBar from '../components/ToolBar';

import {TouchableOpacity} from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import BadgeIcon from '../components/BadgeIcon';
import BannerSlider from '../components/BannerSlider';
import Loading from '../components/Loading';
import {
  CategoryImage,
  getAllCategory,
  getBanners,
  getNewProducts,
  getOffers,
  getPopularProducts,
  ProductImage,
  searchProduct,
  getAllPincode,
} from '../axios/ServerRequest';
import {getCart, getUserDetails, setCart} from '../utils/LocalStorage';
import ProductItem from '../components/ProductItem';
import Cart from '../utils/Cart';
import SearchBar from '../components/SearchBar';
import Offer1 from '../assets/images/offer1.jpg';
import Offer2 from '../assets/images/offer2.jpg';
import {BASE_URL} from '../axios/API';
import FastImage from 'react-native-fast-image';
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
} from '../redux/products/productsActions';
import drawerMenu from '../assets/images/menu.png';

import {
  addSelectedAddress,
  setSelectedAddress,
  fetchDeliveryPinCodeAddress,
} from '../redux/userAddress/actions';
import {connect} from 'react-redux';

class HomeScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: true,
      categoryData: [],
      popularProduct: [],
      newProduct: [],
      banners: [],
      offers: [],
      selected: false,
      cartCount: 0,
      cartList: [],
      showSearch: false,
      searchData: [],
      searchText: '',
    };
  }

  async componentDidMount() {
    const {
      fetchCategories,
      fetchBestSellingProducts,
      fetchNewProducts,
      fetchOffers,
    } = this.props;

    fetchCategories();
    fetchBestSellingProducts();
    fetchNewProducts();
    fetchOffers();
    this.reRenderSomething = this.props.navigation.addListener('focus', () => {
      this.init();
    });
  }

  init = async () => {
    console.log(await getUserDetails());
    this.fetchCategory();
    this.fetchBanners();
    this.fetchOffers();
    this.fetchNewProducts();
    this.fetchPincode();
    this.fetchPopularProducts();
    let cart = await getCart();
    this.setState({searchProduct: [], showSearch: false});
    this.setState({
      cartList: await getCart(),
      cartCount: Cart.getTotalCartCount(cart),
    });
  };

  fetchPincode = () => {
    this.refs.loading.show();
    getAllPincode()
      .then(response => {
        console.log('pin====>', response.data.delivery_available_location);
        this.props.fetchDeliveryPinCodeAddress(
          response.data.delivery_available_location,
        );
        // this.setState({categoryData: response.data.categories});
        // this.refs.loading.close();
      })
      .catch(error => {
        console.log(error);
        this.refs.loading.close();
      });
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
  fetchBanners = () => {
    this.refs.loading.show();
    getBanners()
      .then(response => {
        // console.log('banners====>', response.data);
        this.setState({banners: response.data.banners});
        this.refs.loading.close();
      })
      .catch(error => {
        console.log(error);
        this.refs.loading.close();
      });
  };
  fetchOffers = () => {
    this.refs.loading.show();
    getOffers()
      .then(response => {
        // console.log('offers====>', response.data);
        this.setState({offers: response.data.offers});
        this.refs.loading.close();
      })
      .catch(error => {
        console.log(error);
        this.refs.loading.close();
      });
  };

  fetchNewProducts = () => {
    this.refs.loading.show();
    getNewProducts()
      .then(response => {
        // console.log(response.data.products);
        this.setState({newProduct: response.data.products});
        this.refs.loading.close();
      })
      .catch(error => {
        console.log(error);
        this.refs.loading.close();
      });
  };
  fetchPopularProducts = () => {
    this.refs.loading.show();
    getPopularProducts()
      .then(response => {
        // console.log(response.data.products);
        this.setState({popularProduct: response.data.products});
        this.refs.loading.close();
      })
      .catch(error => {
        console.log(error);
        this.refs.loading.close();
      });
  };

  resetData = () => {
    this.setState({newProduct: this.state.newProduct});
    this.setState({popularProduct: this.state.popularProduct});
  };

  navigateToScreen = item => {
    this.props.navigation.navigate('ProductView', {
      screen: 'ProductView',
      params: {item: item},
    });
  };

  onchangeSearchText(text) {
    this.setState({searchText: text});
    searchProduct(text)
      .then(response => {
        this.setState({searchData: response.data.products, showSearch: true});
      })
      .catch(error => {
        console.log(error);
        this.setState({showSearch: false});
      });
  }

  renderProductItem(item) {
    let cart = Cart.getItemCount(this.state.cartList, item);
    return (
      <ProductItem
        item={item}
        count={cart}
        onPress={() => {
          this.navigateToScreen(item);
        }}
      />
    );
  }

  renderSearchProductItem(item) {
    return (
      <View style={styles.itemContainer}>
        <TouchableOpacity
          style={{display: 'flex', flexDirection: 'row'}}
          activeOpacity={1}
          onPress={() => {
            this.setState({searchProduct: [], showSearch: false});
            this.navigateToScreen(item);
          }}>
          <View style={{width: 50, height: 50}}>
            <Image
              source={{
                uri: `${BASE_URL + item?.images[0]?.image}`,
              }}
              style={{height: 35, width: 35}}
            />
          </View>
          <Text style={{fontSize: 16}}>{item?.name}</Text>
        </TouchableOpacity>
      </View>
    );
  }

  renderHeader = () => {
    const {navigation, cartCount} = this.props;
    return (
      <View
        style={{
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          paddingHorizontal: 20,
          paddingVertical: 20,
        }}>
        <View style={{width: 27, height: 27}}>
          <TouchableOpacity
            activeOpacity={1}
            style={styles.toggle}
            onPress={() => navigation.openDrawer()}>
            <Image source={drawerMenu} style={styles.iconFilter} />
          </TouchableOpacity>
        </View>

        <View style={styles.containerSearch}>
          {/* Icon */}
          <Icon
            name="search"
            style={styles.iconSearch}
            size={20}
            color={COLORS.black}
          />

          {/* Text Input */}
          <TextInput
            style={styles.textInputSearch}
            placeholder="search ..."
            value={this.state.searchText}
            onChangeText={text => this.onchangeSearchText(text)}
          />
        </View>

        <View
          style={{
            width: 37,
            height: 27,
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          <BadgeIcon
            icon="shopping-cart"
            count={cartCount}
            onPress={() => {
              navigation.navigate('MyCart');
            }}
          />
        </View>
      </View>
    );
  };

  render() {
    const {
      categoryData,
      bestSellingProducts,
      newProducts,
      offers,
      loading,
      error,
    } = this.props.productsReducer;
    return (
      <View style={styles.mainContainer}>
        <View style={styles.mainContainer}>
          <AppStatusBar backgroundColor="#44C062" barStyle="light-content" />

          {this.renderHeader()}

          {this.state.showSearch ? (
            <View style={{paddingHorizontal: 20}}>
              <View
                style={{
                  display: 'flex',
                  justifyContent: 'flex-end',
                  alignItems: 'flex-end',
                  flexDirection: 'row',
                }}>
                <Icon
                  name="x-circle"
                  style={styles.iconSearch}
                  size={20}
                  color={COLORS.black}
                  onPress={() =>
                    this.setState({showSearch: false, searchText: ''})
                  }
                />
              </View>
              <FlatList
                key={'flatlist3'}
                data={this.state.searchData}
                renderItem={({item, index}) =>
                  this.renderSearchProductItem(item, index)
                }
                keyExtractor={item => item.id}
                extraData={this.props}
              />
            </View>
          ) : (
            <ScrollView style={styles.scrollView}>
              <ScrollView
                horizontal={true}
                showsHorizontalScrollIndicator={false}>
                {categoryData &&
                  categoryData.slice(0, 7).map((item, index) => {
                    return (
                      <View style={styles.categoryDetailsContainer} key={index}>
                        <TouchableOpacity
                          activeOpacity={1}
                          onPress={() => {
                            this.props.navigation.navigate('ProductView', {
                              screen: 'Products',
                              params: {item: item},
                            });
                          }}>
                          <View style={styles.categoryContainer}>
                            <Image
                              source={{
                                uri: `${BASE_URL + item?.cateimg}`,
                              }}
                              style={{
                                height: 65,
                                width: 65,
                                resizeMode: 'cover',
                                borderRadius: 10,
                              }}
                            />
                          </View>
                          <Text style={styles.catTitle}>{item.category}</Text>
                        </TouchableOpacity>
                      </View>
                    );
                  })}
              </ScrollView>

              <View>
                {this.state.banners.length > 0 && (
                  <BannerSlider banners={this.state.banners} />
                )}
                <View style={styles.categoryMainContainer}>
                  <View
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      flexDirection: 'row',
                    }}>
                    <View style={{marginLeft: 20, marginTop: 20}}>
                      <Text style={styles.title}>New Products</Text>
                    </View>
                    <View style={{marginRight: 20, marginTop: 20}}>
                      <TouchableOpacity
                        onPress={() => {
                          this.props.navigation.navigate('ProductView', {
                            screen: 'Products',
                            params: {item: item},
                          });
                        }}>
                        <Text style={{color: COLORS.green}}>See all</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                  <FlatList
                    style={{marginLeft: 10}}
                    showsHorizontalScrollIndicator={false}
                    horizontal={true}
                    key={'flatlist'}
                    data={newProducts}
                    renderItem={({item, index}) =>
                      this.renderProductItem(item, index)
                    }
                    keyExtractor={item => item.id}
                    extraData={this.state}
                  />

                  <ScrollView horizontal={true}>
                    <View
                      style={{
                        display: 'flex',
                        flexDirection: 'row',
                        padding: 10,
                      }}>
                      {this.state.offers.map((item, index) => {
                        return (
                          <Image
                            key={index}
                            source={{uri: BASE_URL + item.image}}
                            style={{
                              width: Dimension.window.width - 70,
                              resizeMode: 'contain',
                              borderRadius: 10,
                              height: 150,
                              marginRight: 20,
                            }}
                          />
                        );
                      })}
                    </View>
                  </ScrollView>
                </View>

                {bestSellingProducts?.length > 0 && (
                  <View style={{marginLeft: 20, marginTop: 20}}>
                    <Text style={styles.title}>Popular Products</Text>
                  </View>
                )}

                <FlatList
                  style={{marginLeft: 10}}
                  showsHorizontalScrollIndicator={false}
                  horizontal={true}
                  key={'flatlist1'}
                  data={bestSellingProducts}
                  renderItem={({item, index}) =>
                    this.renderProductItem(item, index)
                  }
                  keyExtractor={item => item.id}
                  extraData={this.state}
                />
              </View>
            </ScrollView>
          )}
        </View>

        {/* {this.state.showSearch ? (
          <View style={styles.searchContainer}>
            <SearchBar
              onChangeText={text => this.onchangeSearchText(text)}
              onClose={() => {
                this.setState({showSearch: false, searchData: []});
              }}
              data={this.state.searchData}
            />

            <FlatList
              key={'flatlist3'}
              data={this.state.searchData}
              renderItem={({item, index}) =>
                this.renderSearchProductItem(item, index)
              }
              keyExtractor={item => item.id}
              extraData={this.props}
            />
          </View>
        ) : null} */}

        <Loading ref="loading" indicatorColor={Color.colorPrimary} />
      </View>
    );
  }
}

const BAR_HEIGHT = Platform.OS === 'ios' ? 35 : StatusBar.currentHeight;

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
  categoryMainContainer: {
    flex: 1,
    paddingLeft: 10,
    paddingRight: 20,
    paddingTop: 20,
    flexDirection: 'column',
  },
  categoryHeaderContainer: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },

  categoryContainer: {
    height: 75,
    width: 75,
    padding: 10,
    borderRadius: 45,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#B5F98B',
    marginBottom: 10,
    marginTop: 10,
    marginLeft: 10,
    marginRight: 10,
  },

  categoryDetailsContainer: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'column',
  },

  title: {
    fontFamily: Fonts.primarySemiBold,
    color: Color.black,
    fontSize: 14,
    marginLeft: 10,
  },
  subtitle: {
    fontFamily: Fonts.primarySemiBold,
    color: Color.gray,
    fontSize: 12,
    marginLeft: 10,
  },
  catTitle: {
    fontFamily: Fonts.primaryRegular,
    color: Color.black,
    fontSize: 12,
    width: 80,
    height: 35,
    textAlign: 'center',
    marginLeft: 10,
  },
  searchContainer: {
    marginTop: BAR_HEIGHT,
    width: '100%',
    backgroundColor: '#ffffff',
    position: 'absolute',
    display: 'flex',
    flexDirection: 'column',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,

    elevation: 5,
  },
  itemContainer: {
    marginTop: 10,
  },
  spinnerTextStyle: {
    color: '#FFF',
  },

  containerSearch: {
    flexDirection: 'row',
    ...Platform.select({
      android: {height: 45},
      ios: {height: 40},
    }),
    display: 'flex',
    justifyContent: 'center',
    width: '70%',
    maxWidth: 290,
    alignItems: 'center',
    marginHorizontal: SIZES.padding,
    marginVertical: SIZES.base,
    paddingHorizontal: SIZES.radius,
    borderRadius: SIZES.radius * 2,
    backgroundColor: COLORS.lightGray2,
  },
  iconSearch: {
    height: 20,
    width: 20,
    tintColor: COLORS.black,
  },
  iconFilter: {
    height: 30,
    width: 30,
    tintColor: '#D9D9D9',
  },
  textInputSearch: {
    flex: 1,
    marginLeft: SIZES.radius,
    ...FONTS.body3,
    ...Platform.select({
      android: {justifyContent: 'center', top: 3},
    }),
  },
});

function mapStateToProps(state) {
  console.log(state, 'state');
  return {
    userAddress: state?.userAddressReducer.userAddress,
    selectedUserAddress: state?.userAddressReducer.selectedUserAddress,
    isDeliveryToLocation: state?.userAddressReducer.isDeliveryToLocation,
    cartItems: state.cart.cartItems,
    cartTotal: state.cart.cartTotal,
    cartCount: state.cart.cartCount,
    productsReducer: state.productsReducer,
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
    fetchDeliveryPinCodeAddress: deliveryAvailablePin => {
      return dispatch(fetchDeliveryPinCodeAddress(deliveryAvailablePin));
    },
    increaseQuantity,
    decreaseQuantity,
    removeFromCart,
    fetchCategories: () => dispatch(fetchCategories()),
    fetchBestSellingProducts: () => dispatch(fetchBestSellingProducts()),
    fetchNewProducts: () => dispatch(fetchNewProducts()),
    fetchOffers: () => dispatch(fetchOffers()),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(HomeScreen);
