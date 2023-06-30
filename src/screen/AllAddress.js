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
import Icon from 'react-native-vector-icons/Feather';
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
    this.props.set_User_Details(user);
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
        <TouchableOpacity
          style={{
            backgroundColor: '#63AC36',
            borderRadius: 13,
            height: 67,
            width: '100%',
            paddingHorizontal: 10,
            justifyContent: 'center',
            alignItems: 'center',
            display: 'flex',
            flexDirection: 'row',
          }}
          onPress={() => {
            this.handleCheckOut();
          }}>
          <Text
            style={{
              color: '#FFF9FF',
              fontSize: 18,
              fontFamily: 'Poppins',
              fontWeight: '400',
              textAlign: 'center',
              lineHeight: 18,

              //   lineHeight: 29,
            }}>
            Proceed to Checkout
          </Text>
        </TouchableOpacity>
      </View>
    );
  }

  generateRandomColor = () => {
    const colors = ['#B5F98B', 'white', '#B5F98B'];
    const randomIndex = Math.floor(Math.random() * colors.length);
    return colors[randomIndex];
  };

  chooesAddress = (item, selectedUserAddress, deleteSelectedAddress) => {
    const cardColor = this.generateRandomColor();
    const cardBorderColor = this.generateRandomColor();
    return (
      <View
        style={[
          styles.item,
          {
            backgroundColor:
              item?.id === selectedUserAddress?.id
                ? '#B5F98B'
                : COLORS.lightGray2,
            borderColor: COLORS.lightGray2,
          },
        ]}>
        <View style={styles.itemLeft}>
          <View style={{marginRight: 16}}>
            <Icon
              name="home"
              style={{paddingLeft: 7}}
              size={45}
              color={'#016839'}
              onPress={() => this.props.navigation.goBack()}
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
              <EditIcon name="edit" size={30} color={Color.gray} />
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
            style={{paddingLeft: 14}}
            size={25}
            color={COLORS.black}
            onPress={() => this.props.navigation.goBack()}
          />
          <Text
            style={{fontSize: 20, paddingVertical: 10, color: COLORS.black}}>
            Select Address
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
            }}
          />
        </View>
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
          <View>
            <TouchableOpacity
              onPress={() => {
                this.props.navigation.navigate('AddressDetailsScreen');
              }}>
              <Text style={styles.checkout}>Add New Delivery Address +</Text>
            </TouchableOpacity>
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
    set_User_Details,
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
    width: 32,
    height: 32,
    // backgroundColor: COLORS.green,
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
    paddingHorizontal: 25,
    right: 2,
    width: '100%',
    height: 50,
    bottom: 40,
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
    textAlign: 'center',
    fontSize: 20,
    fontWeight: '400',
    color: Color.black,
  },
});
