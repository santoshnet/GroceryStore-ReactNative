/* eslint-disable no-sequences */
/* eslint-disable react-native/no-inline-styles */
/* eslint-disable no-undef */
import React, {Component} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  Button,
  KeyboardAvoidingView,
  Image,
} from 'react-native';
import AppStatusBar from '../components/AppStatusBar';
import {Color, Fonts, Strings, Dimension} from '../theme';

import Logo from '../components/Logo';
import Card from '../components/Card';
import UserInput from '../components/UserInput';
import LoadingButton from '../components/LoadingButton';
import {StackActions, CommonActions} from '@react-navigation/native';
import {setUserDetails} from '../utils/LocalStorage';
import SmoothPinCodeInput from 'react-native-smooth-pincode-input';

import {
  checkInternetConnection,
  resendOTP,
  userRegister,
  userVerification,
} from '../axios/ServerRequest';
import Validator from '../utils/Validator/Validator';
import {
  DEFAULT_RULE,
  NAME_RULE,
  PHONE_RULE,
  PASSWORD_RULE,
  EMAIL_RULE,
  PINCODE_RULE,
} from '../utils/Validator/rule';
import Toast from 'react-native-simple-toast';
import alertmessages from '../utils/helpers';
import {
  addSelectedAddress,
  setSelectedAddress,
  deleteSelectedAddress,
  checkItemDeliveryAddress,
} from '../redux/userAddress/actions';
import {connect} from 'react-redux';
import Icon from 'react-native-vector-icons/Feather';

class RegisterScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      name: '',
      mobile: '',
      password: '',
      pincode: '',
      mobileError: false,
      nameError: false,
      passwordError: false,
      nameErrorMessage: '',
      mobileErrorMessage: '',
      pincodeErrorMessage: '',
      passwordErrorMessage: '',
      zipErrorMessage: '',
      showOTP: false,
      otp: '',
      zipError: '',
      zip: '',
      pincodeError: false,
      email: '',
      emailError: '',
      emailErrorMessage: '',
    };
  }

  resetState = () => {
    this.setState({
      nameErrorMessage: '',
      nameError: false,
      mobileErrorMessage: '',
      mobileError: false,
      passwordErrorMessage: '',
      passwordError: false,
      pincodeErrorMessage: '',
      pincodeError: false,
      zipError: false,
      zipErrorMessage: '',
      emailError: false,
      emailErrorMessage: '',
    });
  };
  componentDidMount = () => {
    checkInternetConnection();
  };

  onChangeMobile(text) {
    this.resetState();
    this.setState({
      mobile: text.replace(/[^0-9]/g, ''),
    });
  }

  onChangePincode(code) {
    this.resetState();
    this.setState({
      zip: code,
    });
  }

  register = () => {
    const {
      name,
      mobile,
      password,
      email,
      pincode,
      nameError,
      mobileError,
      passwordError,
      nameErrorMessage,
      mobileErrorMessage,
      passwordErrorMessage,
      pincodeErrorMessage,
      pincodeError,
      zipErrorMessage,
      zip,
    } = this.state;

    if (!Validator(name, DEFAULT_RULE)) {
      this.setState({
        nameErrorMessage: Strings.nameErrorMessage,
        nameError: true,
      });
      return;
    }
    if (!Validator(name, NAME_RULE)) {
      this.setState({
        nameErrorMessage: Strings.nameErrorMessage,
        nameError: true,
      });
      return;
    }
    if (!Validator(email, EMAIL_RULE)) {
      this.setState({
        emailErrorMessage: Strings.emailErrorMessage,
        emailError: true,
      });
      return;
    }
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
    if (!Validator(zip, PINCODE_RULE)) {
      this.setState({
        zipErrorMessage: Strings.pincodeErrorMessage,
        zipError: true,
      });
      return;
    }

    // if (!Validator(password, DEFAULT_RULE)) {
    //   this.setState({
    //     passwordErrorMessage: Strings.passwordErrorMessage,
    //     passwordError: true,
    //   });
    //   return;
    // }
    // if (!Validator(password, PASSWORD_RULE)) {
    //   this.setState({
    //     passwordErrorMessage: Strings.passwordErrorMessage,
    //     passwordError: true,
    //   });
    //   return;
    // }
    this.setState({loading: true});
    userRegister(name, mobile, email, zip, password)
      .then(response => {
        let data = response.data;

        if (data.status === 201) {
          alertmessages.showSuccess(data.message);
          // this.showToast(data.message);
          this.setState({showOTP: true});
          // setUserDetails(data.data);
        } else {
          this.showToast(data.message);
          alertmessages.showError(data.message);
        }

        this.setState({loading: false});
      })
      .catch(error => {
        console.log(error);
      });
  };

  verifyOTP = () => {
    if (this.state.mobile.length < 10) {
      this.showToast('Please Enter Valid Mobile Number');
      return;
    } else if (this.state.otp.length < 4) {
      this.showToast('Please Enter Valid OTP');
      return;
    } else {
      userVerification(this.state.mobile, this.state.otp).then(res => {
        let data = res.data;
        if (data.status === 200) {
          this.showToast(data.message);
          setUserDetails(data.data);
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
            console.log(userdatas, 'userdatas in register');
            this.props.addSelectedAddress(userdatas);
            this.props.setSelectedAddress(userdatas);
          }
          this.props.navigation.replace('HomeScreen');
        } else {
          this.showToast(data.message);
        }
      });
    }
  };

  resendUserOtp = async () => {
    if (this.state.mobile.length < 10) {
      this.showToast('Please Enter Valid Mobile Number');
      return;
    } else {
      await resendOTP(this.state.mobile).then(res => {
        let data = res.data;
        if (data.status === 200) {
          this.showToast(data.message);
        } else {
          this.showToast(data.message);
        }
      });
    }
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
                <View style={styles.container}>
                  <Logo />
                  <Text style={styles.heading}>Sign Up</Text>
                  <Text style={styles.tagline}>
                    Enter Your Credential to Continue
                  </Text>
                  <View>
                    <Text style={styles.label}>Username</Text>
                    <UserInput
                      placeholder={Strings.nameHint}
                      error={this.state.nameError}
                      value={this.state.name}
                      errorMessage={this.state.nameErrorMessage}
                      maxLength={50}
                      onChangeText={name => {
                        this.setState({
                          name,
                        }),
                          this.resetState();
                      }}
                    />
                  </View>
                  <View>
                    <Text style={styles.label}>Email</Text>
                    <UserInput
                      placeholder={Strings.emailHint}
                      value={this.state.email}
                      error={this.state.emailError}
                      errorMessage={this.state.emailErrorMessage}
                      onChangeText={email => {
                        this.setState({
                          email,
                        }),
                          this.resetState();
                      }}
                    />
                  </View>
                  <View>
                    <Text style={styles.label}>Phone Number</Text>
                    <UserInput
                      keyboardType="numeric"
                      placeholder={Strings.mobileHint}
                      error={this.state.mobileError}
                      value={this.state.mobile}
                      errorMessage={this.state.mobileErrorMessage}
                      maxLength={10}
                      onChangeText={mobile => this.onChangeMobile(mobile)}
                    />
                  </View>
                  <View>
                    <Text style={styles.label}>Zip Code</Text>
                    <UserInput
                      keyboardType="numeric"
                      placeholder={Strings.zipHint}
                      error={this.state.zipError}
                      value={this.state.zip}
                      errorMessage={this.state.zipErrorMessage}
                      maxLength={6}
                      onChangeText={zip => this.onChangePincode(zip)}
                    />
                  </View>
                  <View style={{marginBottom: 15}}>
                    <Text style={styles.subTitle}>
                      By continuing you agree to our Terms of Service and
                      Privacy Policy.
                    </Text>
                  </View>

                  <View style={styles.buttonContainer}>
                    <LoadingButton
                      title={Strings.sendOTP}
                      loading={this.state.loading}
                      style={{height: 50}}
                      onPress={() => {
                        this.register();
                      }}
                    />
                  </View>
                  <View
                    style={{
                      display: 'flex',
                      justifyContent: 'center',
                      alignItems: 'center',
                      marginBottom: 20,
                      flexDirection: 'row',
                    }}>
                    <Text style={styles.subTitle}>
                      Already have an account?
                    </Text>
                    <TouchableOpacity
                      onPress={() => {
                        this.props.navigation.navigate('Login');
                      }}>
                      <Text
                        style={{
                          color: '#53B175',
                          paddingLeft: 5,
                          marginTop: 5,
                        }}>
                        Login
                      </Text>
                    </TouchableOpacity>
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
  container: {
    flex: 1,
    zIndex: 99999999,
    width: '100%',
    padding: 15,
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
    fontSize: 25,
    fontFamily: Fonts.primarySemiBold,
    color: Color.headingColor,
    marginTop: 20,
  },
  subTitle: {
    fontSize: 14,
    fontFamily: Fonts.primaryRegular,
    marginTop: 10,
    color: '#7C7C7C',
  },
  tagline: {
    fontSize: 16,
    fontFamily: Fonts.primaryRegular,
    color: Color.taglineColor,
    marginBottom: 20,
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
    textAlign: 'left',
  },
  activeLinkText: {
    flex: 1,
    color: Color.colorPrimaryDark,
    padding: 10,
    fontSize: 16,
    fontFamily: Fonts.primaryRegular,
    textAlign: 'right',
  },
  bottomImage: {
    height: 100,
    width: 100,
    position: 'absolute',
    bottom: 0,
    right: 0,
    zIndex: 1,
    flex: 1,
    justifyContent: 'flex-end',
  },
  buttonContainer: {
    width: '100%',
  },
  label: {
    color: '#7C7C7C',
    fontSize: 16,
    fontWeight: '600',
    fontFamily: Fonts.primaryRegular,
    lineHeight: 24,
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

export default connect(mapStateToProps, mapDispatchToProps)(RegisterScreen);
