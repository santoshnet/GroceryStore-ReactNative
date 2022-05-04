import React, {Component} from 'react';
import {View, Text, StyleSheet, Image, FlatList} from 'react-native';
import AppStatusBar from '../components/AppStatusBar';
import {Color, Fonts, Strings, Dimension} from '../theme';
import ToolBar from '../components/ToolBar';
import {TouchableOpacity} from 'react-native-gesture-handler';

import {getCart} from '../utils/LocalStorage';
import BadgeIcon from '../components/BadgeIcon';
import Cart from '../utils/Cart';

import {getAllAdvOffer} from '../axios/ServerRequest';
import {BASE_URL} from '../axios/API';

class OffersScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      cartCount: 0,
      offer: [],
    };
  }

  async componentDidMount() {
    this.init();
    this.reRenderSomething = this.props.navigation.addListener('focus', () => {
      this.init();
    });
    await getAllAdvOffer()
      .then(response => {
        //console.log(response.data.banners);
        this.setState({offer: response.data.offers});
      })
      .catch(error => {
        //console.log(error);
      });
  }

  init = async () => {
    let cart = await getCart();

    this.setState({
      cartCount: Cart.getTotalCartCount(cart),
    });
  };

  renderOfferItem = (item, index) => {
    return (
      <View style={styles.offerItem}>
        <Image
          source={{
            uri: BASE_URL + item.image,
          }}
          style={styles.cover}
        />
      </View>
    );
  };

  render() {
    const {navigation} = this.props;
    return (
      <View style={styles.mainContainer}>
        <AppStatusBar
          backgroundColor={Color.colorPrimary}
          barStyle="light-content"
        />
        <ToolBar
          title="Offer"
          icon="menu"
          onPress={() => navigation.openDrawer()}>
          <BadgeIcon icon="shopping-cart" count={this.state.cartCount} />
        </ToolBar>

        <FlatList
          data={this.state.offer}
          renderItem={({item, index}) => this.renderOfferItem(item, index)}
          keyExtractor={item => item.id}
        />
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

  offerItem: {
    display: 'flex',
    maxHeight: 200,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
    elevation: 6,
    backgroundColor: Color.white,
    borderRadius: 15,
    marginLeft: 20,
    marginRight: 20,
    marginTop: 10,
    marginBottom: 10,
  },
  cover: {
    width: '100%',
    height: 200,
    borderRadius: 15,
  },
});
export default OffersScreen;
