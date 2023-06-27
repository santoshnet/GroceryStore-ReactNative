/* eslint-disable react-native/no-inline-styles */
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
  TouchableOpacity,
} from 'react-native';
import AppStatusBar from '../components/AppStatusBar';
import {Color, Dimension, Fonts, SIZES, COLORS, FONTS} from '../theme';
import React, {Component} from 'react';
import Icon from 'react-native-vector-icons/Feather';
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
import {BASE_URL} from '../axios/API';
import {connect} from 'react-redux';
import {
  removeFromCart,
  increaseQuantity,
  decreaseQuantity,
  updateCartCountAndTotal,
  addToCart,
} from '../redux/cart/cartActions';

class SearchScreen extends Component {
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

  onchangeSearchText(text) {
    console.log(text, 'text');
    searchProduct(text)
      .then(response => {
        this.setState({searchData: response.data.products, showSearch: true});
      })
      .catch(error => {
        console.log(error);
      });
  }

  renderSearchProductItem(item) {
    const productQuantity = this.getProductQuantity(item.id);
    return (
      <View
        style={{
          flex: 1,
          flexDirection: 'row',
          justifyContent: 'space-between',
          paddingHorizontal: 16,
          paddingTop: 16,
        }}>
        <View style={styles.itemContainer}>
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
      </View>
    );
  }

  getProductQuantity(productId) {
    const {cartItems} = this.props;
    const cartItem = cartItems.find(item => item.id === productId);
    return cartItem ? cartItem.quantity : 0;
  }

  render() {
    return (
      <View style={{backgroundColor: 'white', flex: 1}}>
        <AppStatusBar backgroundColor="#44C062" barStyle="light-content" />
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
            // value={this.props.value}
            onChangeText={text => this.onchangeSearchText(text)}
          />
          {/* Filter Button */}
          <TouchableOpacity>
            {/* <Image source={icons.filter} style={styles.iconFilter} /> */}
          </TouchableOpacity>
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
    height: 280,
    width: '48%',
    backgroundColor: COLORS.white,
    borderColor: '#E2E2E2',
    borderWidth: 1,
    borderRadius: 18,
    boxShadow: '0px 6px 12px 0px rgba(0, 0, 0, 0.00)',
    padding: SIZES.radius,
    alignItems: 'center',
    margin: 10,
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
    // width: '70%',
    // maxWidth: 290,
    alignItems: 'center',
    marginHorizontal: SIZES.padding,
    marginVertical: SIZES.base,
    paddingHorizontal: SIZES.radius,
    borderRadius: SIZES.radius,
    backgroundColor: '#F2F3F2',
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

export default connect(mapStateToProps, mapDispatchToProps)(SearchScreen);
