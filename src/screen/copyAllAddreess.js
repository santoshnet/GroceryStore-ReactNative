/* eslint-disable react-native/no-inline-styles */
import React, {Component} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import AppStatusBar from '../components/AppStatusBar';
import {Color, Fonts, Strings, Dimension, COLORS} from '../theme';
import ToolBar from '../components/ToolBar';
import UserInput from '../components/UserInput';
import LoadingButton from '../components/LoadingButton';
import {DEFAULT_RULE, EMAIL_RULE} from '../utils/Validator/rule';
import Validator from '../utils/Validator/Validator';
import {
  addSelectedAddress,
  setSelectedAddress,
  deleteSelectedAddress,
  updateSelectedAddress,
} from '../redux/userAddress/actions';
import {connect} from 'react-redux';

class UpdateAddress extends Component {
  handleupdateAddress = async (navigation, updateSelectedAddress) => {
    const {name, email, address, state, city, zip, phone} = this.state;

    if (!Validator(email, DEFAULT_RULE)) {
      this.setState({
        emailError: true,
      });
      return;
    }

    if (!Validator(email, EMAIL_RULE)) {
      this.setState({
        emailError: true,
      });
      return;
    }

    if (!Validator(address, DEFAULT_RULE)) {
      this.setState({
        addressError: true,
      });
      return;
    }
    if (!Validator(state, DEFAULT_RULE)) {
      this.setState({
        stateError: true,
      });
      return;
    }
    if (!Validator(city, DEFAULT_RULE)) {
      this.setState({
        cityError: true,
      });
      return;
    }
    if (!Validator(zip, DEFAULT_RULE)) {
      this.setState({
        zipError: true,
      });
      return;
    }

    const newAddress = {
      name: name,
      address: address,
      city: city,
      state: state,
      zip: zip,
    };
    updateSelectedAddress(newAddress);
    // let userAddesss = JSON.parse(
    //   await AsyncStorage.getItem('MULTIPLE_USER_ADDRESS'),
    // );
    // let add = userAddesss.map(ele => {
    //   console.log(ele, 'eke');
    //   if (ele.id === useraddress.address.id) {
    //     return {
    //       ...ele,
    //       name: name,
    //       phone: phone,
    //       email: email,
    //       //   address: address,
    //       city: city,
    //       state: state,
    //       zip: zip,
    //     };
    //   }
    //   return ele;
    // });
    // console.log(add, ':add');
    // AsyncStorage.setItem('MULTIPLE_USER_ADDRESS', JSON.stringify(add));

    this.props.navigation.goBack();
  };

  UpdateAddress(navigation, updateSelectedAddress) {
    return (
      <View style={{paddingBottom: 40}}>
        {/* {user !== null ? ( */}
        <ScrollView
          style={{padding: 20, paddingRight: 20}}
          contentContainerStyle={styles.scrollview}
          onContentSizeChange={this.onContentSizeChange}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps={'always'}>
          <UserInput
            placeholder={Strings.addressHint}
            errorMessage={this.state.addressError}
            // value={this.state.address}
            error={this.state.addressError}
            onChangeText={address => {
              this.onChange('address', address);
              // this.setState({
              //   address,
              // });
            }}
          />
          <UserInput
            placeholder={Strings.stateHint}
            errorMessage={this.state.stateError}
            // value={this.state.state}
            error={this.state.stateError}
            onChangeText={state => {
              this.setState({
                state,
              });
            }}
          />
          <UserInput
            placeholder={Strings.cityHint}
            errorMessage={this.state.cityError}
            // value={this.state.city}
            error={this.state.cityError}
            onChangeText={city => {
              this.setState({
                city,
              });
            }}
          />
          <UserInput
            placeholder={Strings.zipHint}
            errorMessage={this.state.zipError}
            // value={this.state.zip}
            maxLength={6}
            error={this.state.zipError}
            onChangeText={zip => {
              this.setState({
                zip,
              });
            }}
          />
          <View style={{marginTop: 20}}>
            <LoadingButton
              title={'Update'}
              loading={this.state.loading}
              onPress={() => {
                this.handleupdateAddress(navigation, updateSelectedAddress);
              }}
            />
          </View>
        </ScrollView>
        {/* ) : null} */}
      </View>
    );
  }

  userAddressData = route => {
    //    let  products = products.map((product) => {
    //         if (product.name === originalName) {
    //           product.name = name;
    //           product.price = price;
    //         }
    //         return product;
    //       });
    //       this.setState({ products });
  };

  render() {
    const {navigation, updateSelectedAddress} = this.props;

    return (
      <View style={styles.container}>
        <View style={styles.box1}>
          <AppStatusBar
            backgroundColor={Color.colorPrimary}
            barStyle="light-content"
          />
          <ToolBar
            title="Update Address"
            icon="arrow-left"
            onPress={() => navigation.goBack()}
          />
          <ScrollView
            style={{padding: 20, paddingRight: 20, paddingBottom: 40}}
            contentContainerStyle={styles.scrollview}
            onContentSizeChange={this.onContentSizeChange}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps={'always'}>
            {this.UpdateAddress(navigation, updateSelectedAddress)}
          </ScrollView>
        </View>
      </View>
    );
  }
}

function mapStateToProps(state) {
  console.log(state, 'state');
  return {
    userAddress: state?.userAddressReducer.userAddress,
    selectedUserAddress: state?.userAddressReducer.selectedUserAddress,
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
    deleteSelectedAddress: selectedAddressId => {
      return dispatch(deleteSelectedAddress(selectedAddressId));
    },
    updateSelectedAddress: selectedAddressId => {
      return dispatch(updateSelectedAddress(selectedAddressId));
    },
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(UpdateAddress);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
  },
  box1: {
    display: 'flex',
    flexDirection: 'column',
    paddingBottom: 100,
  },
  text: {
    fontSize: 18,
    color: Color.textColor,
  },
  title: {
    fontSize: 16,
    color: Color.black,
    paddingTop: 5,
    paddingBottom: 10,
    paddingLeft: 5,
  },

  addContainer: {
    display: 'flex',
    flexDirection: 'column',
    padding: 10,
  },

  item: {
    backgroundColor: '#FFF',
    padding: 15,
    borderRadius: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  itemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
  },
  square: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    width: 24,
    height: 24,
    backgroundColor: COLORS.primary,
    opacity: 0.4,
    borderRadius: 5,
    marginRight: 15,
  },
  itemText: {
    maxWidth: '100%',
  },
  circular: {
    width: 12,
    height: 12,
    borderColor: '#55BCF6',
    borderWidth: 2,
    borderRadius: 5,
  },
  selectcircular: {
    width: 12,
    height: 12,
    borderColor: '#55BCF6',
    backgroundColor: '#55BCF6',
    borderWidth: 2,
    borderRadius: 5,
  },
  tasksWrapper: {
    // paddingTop: 80,
    paddingHorizontal: 6,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  items: {
    marginTop: 30,
  },
  writeTaskWrapper: {
    position: 'absolute',
    bottom: 60,
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  input: {
    paddingVertical: 15,
    paddingHorizontal: 15,
    backgroundColor: '#FFF',
    borderRadius: 60,
    borderColor: '#C0C0C0',
    borderWidth: 1,
    width: 250,
  },
  addWrapper: {
    width: 60,
    height: 60,
    backgroundColor: '#FFF',
    borderRadius: 60,
    justifyContent: 'center',
    alignItems: 'center',
    borderColor: '#C0C0C0',
    borderWidth: 1,
  },
  addText: {},
});
