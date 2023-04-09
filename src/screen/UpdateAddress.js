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
  constructor(props) {
    super(props);
    this.state = {
      user: null,
      name: '',
      phone: props.selectedUserAddress.phone,
      id: '',
      email: '',
      address: props.selectedUserAddress.address,
      city: props.selectedUserAddress.city,
      state: props.selectedUserAddress.state,
      zip: props.selectedUserAddress.zip,
      emailError: '',
      addressError: '',
      cityError: '',
      stateError: '',
      zipError: '',
      token: '',
      loading: false,
      multiaddress: [],
      userSelectedaddress: '',
      visibleAllAddress: true,
    };
  }
  handleupdateAddress = async (
    navigation,
    updateSelectedAddress,
    selectedUserAddress,
  ) => {
    const {name, address, state, city, zip, phone} = this.state;

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
      id: selectedUserAddress.id,
      mobile: this.props?.selectedUserAddress?.mobile,
      name: name,
      address: address,
      city: city,
      state: state,
      zip: zip,
    };
    updateSelectedAddress(newAddress);
    let updateuseraddress = selectedUserAddress;
    updateuseraddress.address = newAddress.address;
    updateuseraddress.city = newAddress.city;
    updateuseraddress.state = newAddress.state;
    updateuseraddress.zip = newAddress.zip;
    // console.log(updateuseraddress, 'updateuseraddress in pin');
    setSelectedAddress(updateuseraddress);

   
    this.props.navigation.goBack();
  };

  handleAddressUpdate(navigation, updateSelectedAddress, selectedUserAddress) {
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
            placeholder={Strings.mobileHint}
            value={this.props?.selectedUserAddress?.mobile}
            maxLength={50}
            editable={false}
          />
          <UserInput
            placeholder={Strings.addressHint}
            errorMessage={this.state.addressError}
            value={this.state.address}
            error={this.state.addressError}
            onChangeText={address => {
              this.setState({
                address,
              });
            }}
          />
          <UserInput
            placeholder={Strings.stateHint}
            errorMessage={this.state.stateError}
            value={this.state.state}
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
            value={this.state.city}
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
            value={this.state.zip}
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
                this.handleupdateAddress(
                  navigation,
                  updateSelectedAddress,
                  selectedUserAddress,
                );
              }}
            />
          </View>
        </ScrollView>
        {/* ) : null} */}
      </View>
    );
  }

  render() {
    const {navigation, updateSelectedAddress, selectedUserAddress} = this.props;
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
            {this.handleAddressUpdate(
              navigation,
              updateSelectedAddress,
              selectedUserAddress,
            )}
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
    updateSelectedAddress: selectedAddress => {
      return dispatch(updateSelectedAddress(selectedAddress));
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