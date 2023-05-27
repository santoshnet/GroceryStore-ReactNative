/* eslint-disable react-native/no-inline-styles */

import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import React, {Component} from 'react';
import {
  addSelectedAddress,
  setSelectedAddress,
  deleteSelectedAddress,
} from '../redux/userAddress/actions';
import {connect} from 'react-redux';
import AppStatusBar from '../components/AppStatusBar';
import {Color, Fonts, Strings, Dimension, COLORS} from '../theme';
import ToolBar from '../components/ToolBar';
import Icon from 'react-native-vector-icons/Entypo';
import EditIcon from 'react-native-vector-icons/FontAwesome';
import LoadingButton from '../components/LoadingButton';
import {getUserDetails} from '../utils/LocalStorage';
import {updateUser} from '../axios/ServerRequest';
import {getToken, setUserDetails} from '../utils/LocalStorage';
import alertmessages from '../utils/helpers';
import {
  set_User_Details,
  clearUserDetails,
} from './../redux/userDetails/userActions';
export class AllAddress extends Component {
  constructor(props) {
    super(props);
    this.state = {
      user: null,
      name: '',
      phone: '',
      id: '',
      email: '',
      address: '',
      city: '',
      state: '',
      zip: '',
      emailError: '',
      addressError: '',
      cityError: '',
      stateError: '',
      zipError: '',
      token: '',
      loading: false,
      userId: '',
    };
  }

  async componentDidMount() {
    let user = await getUserDetails();
    this.props.set_User_Details(user)
    this.setState({
      token: user.token,
      userId: user.id,
    });
  }

  handleCheckOut() {
    if (this.props.userAddress.length > 0) {
      this.setState({loading: true});
      const checkoutlocation = {
        id: this.state.userId,
        mobile: this.props?.selectedUserAddress?.mobile,
        name: this.props?.selectedUserAddress?.name,
        email: this.props?.selectedUserAddress?.email,
        address: this.props?.selectedUserAddress?.address,
        city: this.props?.selectedUserAddress?.city,
        state: this.props?.selectedUserAddress?.state,
        zip: this.props?.selectedUserAddress?.zip,
        token: this.state.token,
      };
      // console.log(checkoutlocation,"checkoutlocation")
      updateUser(checkoutlocation)
        .then(response => {
          let data = response.data;
 
          if (data.status === 200) {
            this.props.navigation.navigate('PlaceOrder');
            setUserDetails(checkoutlocation);
          }

          this.setState({loading: false});
        })
        .catch(error => {
          console.log(error);
          this.setState({loading: false});
        });
    } else {
      alertmessages.showError('please add your address');
    }
  }
  footerPart() {
    return (
      <View style={styles.box2}>
        <View style={{width: '50%'}}>
          <TouchableOpacity
            style={styles.Add_address_container}
            onPress={() => {
              this.props.navigation.navigate('AddressDetailsScreen');
            }}>
            <Text style={styles.checkout}>ADD ADDRESS +</Text>
          </TouchableOpacity>
        </View>
        <View style={{width: '50%'}}>
          <TouchableOpacity
            style={styles.checkout_container}
            onPress={() => {
              this.handleCheckOut();
            }}>
            <Text style={styles.checkout}>CHECKOUT</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }
  chooesAddress = (item, selectedUserAddress, deleteSelectedAddress) => {
    return (
      <View style={styles.item}>
        <View style={styles.itemLeft}>
          <View style={{marginRight: 16}}>
            <View
              style={
                item?.id === selectedUserAddress?.id
                  ? styles.selectcircular
                  : styles.circular
              }
            />
          </View>
          <View>
            <Text style={styles.itemText}>{item.name}</Text>
            <Text style={styles.itemText}>{item.zip}</Text>
            <Text style={styles.itemText}>{item.address}</Text>
          </View>
        </View>
        <View style={{display: 'flex', flexDirection: 'row'}}>
          <View style={styles.square}>
            <TouchableOpacity
              onPress={() => {
                this.props.navigation.push('UpdateAddress');
              }}>
              <EditIcon name="edit" size={20} color={Color.gray} />
            </TouchableOpacity>
          </View>
          {/* <View style={styles.square}>
            <Icon
              name="circle-with-cross"
              size={20}
              color={Color.gray}
              onPress={() => deleteSelectedAddress(item.id)}
            />
          </View> */}
        </View>
      </View>
    );
  };

  AddressContainer = (
    userAddress,
    setSelectedAddress,
    selectedUserAddress,
    deleteSelectedAddress,
  ) => {
    return (
      <View
        style={{
          marginBottom: 200,
          backgroundColor: COLORS.white,
          background: COLORS.white,
          marginTop: 2,
          height: '100%',
        }}>
        {/* Added this scroll view to enable scrolling when list gets longer than the page */}
        <AppStatusBar
          backgroundColor={Color.colorPrimary}
          barStyle="light-content"
        />
        <ToolBar
          title="Address"
          icon="arrow-left"
          onPress={() => this.props.navigation.goBack()}
        />
        <ScrollView>
          {/* Today's Tasks */}

          <View style={styles.tasksWrapper}>
            {userAddress && userAddress.length > 0 ? (
              <>
                <Text style={styles.sectionTitle}>Select Delivery Address</Text>
                <View style={styles.items}>
                  {/* This is where the tasks will go! */}
                  {userAddress?.map((item, index) => {
                    return (
                      <TouchableOpacity
                        key={index}
                        onPress={() => {
                          setSelectedAddress(item);
                        }}>
                        {this.chooesAddress(
                          item,
                          selectedUserAddress,
                          deleteSelectedAddress,
                        )}
                      </TouchableOpacity>
                    );
                  })}
                </View>
              </>
            ) : (
              <View
                style={{
                  display: 'flex',
                  flexDirection: 'row',
                  marginTop: 50,
                  backgroundColor: COLORS.lightGray2,
                  padding: 15,
                  borderRadius: 10,
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  marginBottom: 20,
                }}>
                <View style={{display: 'flex', flexDirection: 'row'}}>
                  <Text
                    style={{
                      display: 'flex',
                      flexDirection: 'row',
                      marginRight: 5,
                      color: COLORS.primary,
                    }}>
                    !
                  </Text>
                  <Text>Please Add your Delivery Address</Text>
                </View>
              </View>
            )}
            <View
              style={{
                marginBottom: 100,
                display: 'flex',
                justifyContent: 'space-between',
                // alignItems: 'center',
                flexDirection: 'column',
              }}
            />
          </View>
        </ScrollView>

        {/* Write a task */}
        {/* Uses a keyboard avoiding view which ensures the keyboard does not cover the items on screen */}
      </View>
    );
  };

  render() {
    const {
      navigation,
      userAddress,
      setSelectedAddress,
      selectedUserAddress,
      deleteSelectedAddress,
    } = this.props;
    return (
      <View style={styles.container}>
        {this.AddressContainer(
          userAddress,
          setSelectedAddress,
          selectedUserAddress,
          deleteSelectedAddress,
        )}
        {this.footerPart()}
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
    set_User_Details
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(AllAddress);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    backgroundColor: COLORS.white,
    background: COLORS.white,
  },
  box1: {
    display: 'flex',
    flexDirection: 'column',
    backgroundColor: COLORS.white,
    background: COLORS.white,
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
    backgroundColor: COLORS.lightGray2,
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
    backgroundColor: COLORS.green,
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
    paddingHorizontal: 10,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'flex-start',
    paddingHorizontal: 20,
    paddingTop: 10,
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
  box2: {
    // flex:1,
    position: 'absolute',
    // top: 2,
    right: 2,
    width: '100%',
    height: 50,
    bottom: 0,
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
  },
  contentContainer: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 30,
  },
  Add_address_container: {
    textAlign: 'center',
    height: 50,
    backgroundColor: COLORS.primary,
    color: Color.white,
  },
  checkout_container: {
    textAlign: 'center',
    height: 50,
    backgroundColor: Color.colorPrimary,
    color: Color.white,
  },
  checkout: {
    width: '100%',
    paddingTop: 10,
    textAlign: 'center',
    fontSize: 20,
    fontWeight: '700',
    color: Color.white,
  },
});
