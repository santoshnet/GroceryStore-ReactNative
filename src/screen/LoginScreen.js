import React, {Component} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  Button,
  Image,
  KeyboardAvoidingView,
  StatusBar,
} from 'react-native';
import AppStatusBar from '../components/AppStatusBar';
import {Color, Fonts, Strings, Dimension} from '../theme';

import Logo from '../components/Logo';
import Card from '../components/Card';
import UserInput from '../components/UserInput';
import LoadingButton from '../components/LoadingButton';
import {
  checkInternetConnection,
  resendOTP,
  userLogin,
} from '../axios/ServerRequest';
import Validator from '../utils/Validator/Validator';
import {DEFAULT_RULE, PHONE_RULE, PASSWORD_RULE} from '../utils/Validator/rule';
import Toast from 'react-native-simple-toast';
import {setUserDetails} from '../utils/LocalStorage';
const defaultHandler = global.ErrorUtils.getGlobalHandler();
import SmoothPinCodeInput from 'react-native-smooth-pincode-input';
import alertmessages from '../utils/helpers';
import {
  addSelectedAddress,
  setSelectedAddress,
  deleteSelectedAddress,
  checkItemDeliveryAddress,
} from '../redux/userAddress/actions';
import {connect} from 'react-redux';
import Icon from 'react-native-vector-icons/Feather';
import FLAGIMAGE from '../assets/images/flag.png';
class LoginScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      mobile: '',
      password: '',
      mobileError: false,
      mobileErrorMessage: '',
      passwordError: false,
      passwordErrorMessage: '',
      showOTP: false,
      otp: '',
    };
  }

  componentDidMount = () => {
    checkInternetConnection();
  };

  onChangeMobile(text) {
    this.resetState();
    this.setState({
      mobile: text.replace(/[^0-9]/g, ''),
    });
  }

  login = () => {
    const {mobile} = this.state;

    if (!Validator(mobile, DEFAULT_RULE)) {
      this.setState({
        mobileErrorMessage: Strings.mobileErrorMessage,
        mobileError: true,
      });
      return;
    }
    if (!Validator(mobile, PHONE_RULE)) {
      this.setState({
        mobileErrorMessage: Strings.mobileErrorMessage,
        mobileError: true,
      });
      return;
    }

    this.resendUserOtp();
  };

  resendUserOtp = async () => {
    if (this.state.mobile.length < 10) {
      this.showToast('Please Enter Valid Mobile Number');
      return;
    } else {
      resendOTP(this.state.mobile)
        .then(res => {
          let data = res.data;
          console.log(data, 'logindata');
          if (data?.status === 200) {
            this.showToast(data?.message);
            this.setState({showOTP: true});
          } else {
            alertmessages.showError('Invalid User');
          }
        })
        .catch(err => {
          alertmessages.showError('Something  getting wrong');
        });
    }
  };

  verifyOTP = () => {
    if (this.state.mobile.length < 10) {
      this.showToast('Please Enter Valid Mobile Number');
      return;
    } else if (this.state.otp.length < 4) {
      this.showToast('Please Enter Valid OTP');
      return;
    }
    this.setState({loading: true});
    userLogin(this.state.mobile, this.state.otp)
      .then(res => {
        let data = res.data;
        console.log(res.data);
        if (data?.status === 200) {
          this.showToast(data?.message);
          setUserDetails(data?.data);
          if (this.props.userAddress.length === 0) {
            let userdatas = {
              userId: data?.data?.id,
              id: data?.data?.id,
              mobile: data?.data?.mobile,
              name: data?.data?.name,
              email: data?.data?.email,
              address: data?.data?.address,
              city: data?.data?.city,
              state: data?.data?.state,
              zip: data?.data?.zip,
              token: data?.data?.token,
            };
            console.log(userdatas, 'userdata in login');
            this.props.addSelectedAddress(userdatas);
            this.props.setSelectedAddress(userdatas);
            this.props.navigation.replace('HomeScreen');
          }
        } else {
          this.showToast(data?.message);
        }
        this.setState({loading: false});
      })
      .catch(error => {
        console.log(error);
      });
  };

  resetState = () => {
    this.setState({
      mobileErrorMessage: '',
      mobileError: false,
      passwordErrorMessage: '',
      passwordError: false,
    });
  };

  showToast = message => {
    Toast.showWithGravity(message, Toast.SHORT, Toast.BOTTOM);
  };

  render() {
    return (
      <View style={styles.mainContainer}>
        <AppStatusBar
          barStyle="dark-content"
          translucent={true}
          backgroundColor={Color.transparent}
        />

        <KeyboardAvoidingView
          behavior={Platform.OS == 'ios' ? 'padding' : 'height'}
          style={styles.container}>
          <View>
            <ScrollView
              style={styles.scrollView}
              contentContainerStyle={styles.scrollview}
              onContentSizeChange={this.onContentSizeChange}
              showsVerticalScrollIndicator={false}
              keyboardShouldPersistTaps={'always'}>
              {!this.state.showOTP ? (
                <View>
                  <TouchableOpacity>
                    <Icon name="chevron-left" size={24} />
                  </TouchableOpacity>
                  <Text style={[styles.heading, {fontSize: 18, marginTop: 20}]}>
                    Enter your mobile number
                  </Text>
                  <Text
                    style={{fontSize: 14, marginTop: 20, textAlign: 'left'}}>
                    Mobile Number
                  </Text>
                  <View style={{position: 'relative'}}>
                    <UserInput
                      textStyle={{
                        fontWeight: '900',
                        fontSize: 20,
                        marginLeft: 70,
                        color:'black'
                      }}
                      keyboardType="numeric"
                      placeholder={'0000000000'}
                      error={this.state.mobileError}
                      value={this.state.mobile}
                      errorMessage={this.state.mobileErrorMessage}
                      maxLength={10}
                      onChangeText={mobile => this.onChangeMobile(mobile)}
                    />
                    <View
                      style={{
                        position: 'absolute',
                        top: 10,
                        display: 'flex',
                        flexDirection: 'row',
                        alignItems:'center',
                        borderRightWidth:1,
                        borderRightColor:'#7C7C7C'
                      }}>
                      <Image
                        style={{ width:20,height:20, resizeMode:'contain', marginTop:5 }}
                        source={FLAGIMAGE}
                      />
                      <Text style={{fontWeight: '900', fontSize: 20, marginLeft:10, marginEnd:10, color:'#000'}}>91</Text>
                    </View>
                  </View>
                  <View style={styles.buttonContainer}>
                    <LoadingButton
                      style={{height: 50, width: 50, borderRadius: 30}}
                      title={
                        <Icon name="chevron-right" size={24} color={'#fff'} />
                      }
                      loading={this.state.loading}
                      onPress={() => {
                        this.login();
                      }}
                    />
                  </View>
                </View>
              ) : (
                <View style={styles.container}>
                  <TouchableOpacity
                    onPress={() => {
                      this.setState({showOTP: false});
                    }}>
                    <Icon name="chevron-left" size={24} />
                  </TouchableOpacity>

                  <Text style={[styles.heading, {fontSize: 18, marginTop: 30}]}>
                    Enter your 4-digit code
                  </Text>
                  <Text style={[styles.subTitle, {fontSize: 12}]}>Code</Text>

                  <SmoothPinCodeInput
                    ref={this.pinInput}
                    cellSpacing={5}
                    cellSize={20}
                    textStyle={{fontSize: 16}}
                    cellStyle={{
                      borderBottomWidth: 2,
                      borderColor: Color.lightgray,
                      backgroundColor: Color.transparent,
                    }}
                    cellStyleFocused={{
                      borderColor: Color.colorPrimary,
                    }}
                    value={this.state.otp}
                    onTextChange={otp => this.setState({otp})}
                    onBackspace={() => console.log('No more back.')}
                  />
                  <View
                    style={{
                      borderBottomWidth: 1,
                      borderBottomColor: '#C0C0C0',
                      marginTop: 10,
                    }}
                  />
                  <View
                    style={{
                      display: 'flex',
                      flexDirection: 'row',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      marginTop: 40,
                    }}>
                    <TouchableOpacity
                      onPress={() => {
                        this.resendUserOtp();
                      }}>
                      <Text
                        style={[
                          styles.subTitle,
                          {color: Color.colorPrimary, marginBottom: 10},
                        ]}>
                        {Strings.resendOTP}
                      </Text>
                    </TouchableOpacity>

                    <LoadingButton
                      style={{height: 50, width: 50, borderRadius: 30}}
                      title={
                        <Icon name="chevron-right" size={24} color={'#fff'} />
                      }
                      loading={this.state.loading}
                      onPress={() => {
                        this.verifyOTP();
                      }}
                    />
                  </View>
                </View>
              )}
            </ScrollView>
          </View>
        </KeyboardAvoidingView>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  scrollView: {
    height: Dimension.window.height,
    paddingBottom: 20,
  },
  mainContainer: {
    flex: 1,
    backgroundColor: '#F5F5F5',
    flexDirection: 'column',
  },
  scrollView: {
    flexDirection: 'column',
    padding: 20,
    flexGrow: 1,
  },
  container: {
    flex: 1,
    zIndex: 99999999,
  },
  loginLinkContainer: {
    display: 'flex',

    flexDirection: 'row',
    width: '100%',
  },
  headingContainer: {
    display: 'flex',
    flexDirection: 'column',
    width: '100%',
    marginTop: 30,
    marginBottom: 30,
    marginLeft: 20,
  },

  heading: {
    fontSize: 20,
    fontFamily: Fonts.primarySemiBold,
    color: Color.headingColor,
  },
  subTitle: {
    fontSize: 14,
    fontFamily: Fonts.primarySemiBold,
    marginTop: 10,
    color: Color.graylight,
    textAlign: 'center',
    marginLeft: '10%',
    marginRight: '10%',
  },
  tagline: {
    fontSize: 12,
    fontFamily: Fonts.primaryRegular,
    color: Color.taglineColor,
  },

  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
    fontFamily: Fonts.primaryRegular,
  },
  instructions: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5,
    fontFamily: Fonts.primaryBold,
  },
  linkText: {
    flex: 1,
    color: Color.textColor,
    padding: 10,
    fontSize: 16,
    fontFamily: Fonts.primaryRegular,
    justifyContent: 'space-between',
    textAlign: 'right',
  },
  activeLinkText: {
    flex: 1,
    color: Color.colorPrimaryDark,
    padding: 10,
    fontSize: 16,
    fontFamily: Fonts.primaryRegular,
    textAlign: 'left',
  },
  bottomImage: {
    height: 150,
    width: 150,
    position: 'absolute',
    bottom: 0,
    right: 80,
    zIndex: 1,
    flex: 1,
    justifyContent: 'flex-end',
  },
  buttonContainer: {
    display: 'flex',
    marginTop: 100,
    justifyContent: 'flex-end',
    alignItems: 'flex-end',
  },
});

function mapStateToProps(state) {
  console.log(state, 'state');
  return {
    userAddress: state?.userAddressReducer.userAddress,
    selectedUserAddress: state?.userAddressReducer.selectedUserAddress,
    isDeliveryToLocation: state?.userAddressReducer.isDeliveryToLocation,
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
    checkItemDeliveryAddress: selectedAddressPin => {
      return dispatch(checkItemDeliveryAddress(selectedAddressPin));
    },
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(LoginScreen);
