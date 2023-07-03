/* eslint-disable no-dupe-keys */
/* eslint-disable react-native/no-inline-styles */
import React, {Component} from 'react';
import {
  View,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Text,
  Image,
  TextInput,
  Platform,
  StatusBar,
  ScrollView,
} from 'react-native';
import {BASE_URL} from '../axios/API';
import FastImage from 'react-native-fast-image';
import {
  removeFromCart,
  increaseQuantity,
  decreaseQuantity,
  updateCartCountAndTotal,
  addToCart,
} from '../redux/cart/cartActions';
import {searchProduct} from '../axios/ServerRequest';
import BadgeIcon from '../components/BadgeIcon';
import {
  fetchCategories,
  fetchBestSellingProducts,
  fetchNewProducts,
  fetchOffers,
  fetchBanners,
  getProductByCategory,
} from '../redux/products/productsActions';
import drawerMenu from '../assets/images/menu.png';
import AppStatusBar from '../components/AppStatusBar';
import {Color, Dimension, Fonts, SIZES, COLORS, FONTS, item} from '../theme';
import Icon from 'react-native-vector-icons/Feather';
import {
  addSelectedAddress,
  setSelectedAddress,
  fetchDeliveryPinCodeAddress,
} from '../redux/userAddress/actions';
import {connect} from 'react-redux';

// Define your product categories

class OurProductScreen extends Component {
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
      showSearch: false,
    };
  }

  componentDidMount() {
    this.props.fetchCategories();
  }

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
          paddingVertical: 10,
        }}>
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
            placeholder="Search ..."
            value={this.state.searchText}
            onChangeText={text => this.onchangeSearchText(text)}
          />

          {/* Clear Search Icon */}
          {this.state.searchText !== '' && (
            <TouchableOpacity
              onPress={() => {
                this.setState({searchText: '', showSearch: false});
              }}>
              <Icon
                name="x"
                style={styles.iconClearSearch}
                size={20}
                color={COLORS.black}
              />
            </TouchableOpacity>
          )}
        </View>
      </View>
    );
  };

  generateRandomColor = () => {
    const colors = [
      // 'rgba(83, 177, 117, 0.70)',
      // 'rgba(248, 164, 76, 0.10)',
      // 'rgba(247, 165, 147, 0.25)',
      // 'rgba(209, 209, 210, 0.25)',
      '#DFFDCD',
      'rgba(183, 223, 245, 0.25)',
    ];
    const randomIndex = Math.floor(Math.random() * colors.length);
    return colors[randomIndex];
  };

  renderCategoryItem = ({item}) => {
    const cardColor = this.generateRandomColor();
    const cardBorderColor = this.generateRandomColor();

    return (
      <TouchableOpacity
        onPress={() => {
          console.log(item, 'ajcsk');
          this.props.getProductByCategory(item.id);
          this.props.navigation.navigate('CategoryWiseProducts');
        }}
        style={[
          styles.categoryCard,
          {backgroundColor: cardColor, borderColor: cardBorderColor},
        ]}>
        <Image
          source={{
            uri: `${BASE_URL + item?.cateimg}`,
          }}
          style={{
            height: 112,
            width: 112,
            resizeMode: 'cover',
            // borderRadius: 10,
          }}
        />
        {/* <Image source={item.image} style={styles.categoryImage} /> */}
        <Text style={styles.categoryName}>{item.category}</Text>
      </TouchableOpacity>
    );
  };

  renderSearchProductItem(item) {
    return (
      <View style={{flex: 1, backgroundColor: '#ffffff'}}>
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
      </View>
    );
  }

  render() {
    const {categoryData} = this.props.productsReducer;
    return (
      <View style={styles.container}>
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
            Our Products
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

        {this.renderHeader()}

        {this.state.showSearch && this.state.searchData ? (
          <ScrollView>
            <View style={{paddingHorizontal: 20}}>
              <FlatList
                key={'flatlist3'}
                data={this.state.searchData}
                renderItem={({item, index}) =>
                  this.renderSearchProductItem(item, index)
                }
                keyExtractor={item => item.id}
                extraData={this.props}
                // numColumns={2}
                showsVerticalScrollIndicator={false}
                nestedScrollEnabled={false}
              />
            </View>
          </ScrollView>
        ) : (
          <FlatList
            data={categoryData}
            renderItem={this.renderCategoryItem}
            keyExtractor={item => item.id.toString()}
            numColumns={2}
          />
        )}
      </View>
    );
  }
}

const BAR_HEIGHT = Platform.OS === 'ios' ? 35 : StatusBar.currentHeight;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    backgroundColor: '#ffffff',
  },
  categoryCard: {
    flex: 1,
    margin: 5,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    // borderColor: '#e0e0e0',
    width: 174,
    height: 190,
    backgroundColor: '#f5f5f5',
    borderRadius: 18,
  },
  categoryImage: {
    width: 100,
    height: 100,
    resizeMode: 'cover',
    borderRadius: 5,
  },
  categoryName: {
    marginTop: 5,
    fontSize: 16,
    // fontWeight: 'bold',
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
    marginTop: 7,
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
    width: '100%',
    alignItems: 'center',

    marginVertical: SIZES.base,
    paddingHorizontal: SIZES.radius,
    borderRadius: SIZES.radius,
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
    fetchBanners: () => dispatch(fetchBanners()),
    getProductByCategory: id => dispatch(getProductByCategory(id)),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(OurProductScreen);
