/* eslint-disable react-native/no-inline-styles */
import React, {Component} from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  FlatList,
} from 'react-native';
import AppStatusBar from '../components/AppStatusBar';
import {Color, Fonts, Strings, Dimension, COLORS} from '../theme';
import ToolBar from '../components/ToolBar';
import {TouchableOpacity} from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import {getUserDetails, getCart} from '../utils/LocalStorage';
import BadgeIcon from '../components/BadgeIcon';
import Cart from '../utils/Cart';
import Logo from '../components/Logo';
import {connect} from 'react-redux';
import {
  removeFromCart,
  increaseQuantity,
  decreaseQuantity,
  updateCartCountAndTotal,
  addToCart,
} from '../redux/cart/cartActions';
class ProfileScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      cartCount: 0,
      user: null,
    };
  }

  async componentDidMount() {
    this.reRenderSomething = this.props.navigation.addListener('focus', () => {
      this.init();
    });
  }

  init = async () => {
    let cart = await getCart();
    let userDetails = await getUserDetails();
    this.setState({
      cartCount: Cart.getTotalCartCount(cart),
      user: userDetails,
    });
  };

  render() {
    const {navigation} = this.props;
    const {user} = this.state;
    return (
      <View style={styles.mainContainer}>
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
            Profile
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
        <ScrollView style={{flex: 1}} contentContainerStyle={styles.scrollview}>
          <View style={styles.container}>
            <Image
               source={require('../assets/images/user.png')}
              style={styles.profileImage}
            />
            <Text style={styles.name}>{user ? user.name : ''}</Text>
            <Text style={styles.mobile}>{user ? user.mobile : ''}</Text>
            <Text style={styles.address}>
              {user
                ? ` ${user.address},  ${user.city},  ${user.state}- ${user.zip}`
                : ''}
            </Text>
          </View>
          {/* <View style={{marginTop: '10%', marginBottom: '5%'}}>
            <Logo />
          </View>
          <View style={styles.userRow}>
            <Text>Name : </Text>
            <Text>{user ? user.name : null}</Text>
          </View>
          <View style={styles.border} />
          <View style={styles.userRow}>
            <Text>Mobile : </Text>
            <Text>{user ? user.mobile : null}</Text>
          </View>
          <View style={styles.border} />
          <View style={styles.userRow}>
            <Text>Address : </Text>
            <Text>
              {user
                ? ` ${user.address},  ${user.city},  ${user.state}- ${user.zip}`
                : null}
            </Text>
          </View> */}
          {/* <View style={styles.border} /> */}
        </ScrollView>
        <View style={styles.bottomImage}>
          <Image source={require('../assets/images/thumb1.png')} />
        </View>
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
    backgroundColor: Color.white,
    flexDirection: 'column',
    padding: 20,
    flexGrow: 1,
  },
  bottomImage: {
    height: 150,
    width: 150,
    position: 'absolute',
    bottom: 0,
    right: 80,
    zIndex: 1,
    flex: 1,
    // opacity: 0.5,
    justifyContent: 'flex-end',
  },
  userRow: {
    display: 'flex',
    flexDirection: 'row',
    marginLeft: 15,
    marginTop: 10,
  },
  border: {
    borderBottomWidth: 1,
    borderColor: Color.graylight,
    margin: 10,
  },
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f5f5f5',
  },
  profileImage: {
    width: 150,
    height: 150,
    borderRadius: 75,
    marginBottom: 20,
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#333',
  },
  mobile: {
    fontSize: 18,
    marginBottom: 10,
    color: '#555',
  },
  address: {
    fontSize: 18,
    marginBottom: 10,
    textAlign: 'center',
    color: '#555',
    paddingHorizontal: 20,
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

export default connect(mapStateToProps, mapDispatchToProps)(ProfileScreen);
