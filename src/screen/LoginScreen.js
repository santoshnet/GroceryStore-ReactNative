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
          if (data.status === 200) {
            this.showToast(data.message);
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
        if (data.status === 200) {
          this.showToast(data.message);
          setUserDetails(data.data);
          this.props.addSelectedAddress(data.data);
          this.props.setSelectedAddress(data.data);
          this.props.navigation.replace('HomeScreen');
        } else {
          this.showToast(data.message);
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
          barStyle="light-content"
          backgroundColor={Color.colorPrimary}
        />

        <KeyboardAvoidingView
          behavior={Platform.OS == 'ios' ? 'padding' : 'height'}
          style={styles.container}>
          <View style={styles.innerContainer}>
            <ScrollView
              style={{flex: 1}}
              contentContainerStyle={styles.scrollview}
              onContentSizeChange={this.onContentSizeChange}
              showsVerticalScrollIndicator={false}
              keyboardShouldPersistTaps={'always'}>
              <View>
                <View style={styles.loginLinkContainer}>
                  <Text style={styles.activeLinkText}>SignIn</Text>
                  <TouchableOpacity
                    onPress={() => {
                      this.props.navigation.navigate('Register');
                    }}>
                    <Text style={styles.linkText}>{Strings.signup_text}</Text>
                  </TouchableOpacity>
                </View>
                <View style={styles.headingContainer}>
                  <Text style={styles.heading}>{Strings.login_text1}</Text>

                  <Text style={styles.tagline}>{Strings.login_text2}</Text>
                </View>
                <Logo />
                <Card style={{margin: 30, padding: 20}}>
                  <UserInput
                    keyboardType="numeric"
                    placeholder={Strings.mobileHint}
                    error={this.state.mobileError}
                    value={this.state.mobile}
                    errorMessage={this.state.mobileErrorMessage}
                    maxLength={10}
                    onChangeText={mobile => this.onChangeMobile(mobile)}
                  />

                  {this.state.showOTP ? (
                    <View
                      style={{
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                      }}>
                      <SmoothPinCodeInput
                        ref={this.pinInput}
                        cellSpacing={20}
                        cellStyle={{
                          borderWidth: 2,
                          borderRadius: 5,
                          borderColor: Color.lightgray,
                          backgroundColor: Color.white,
                        }}
                        cellStyleFocused={{
                          borderColor: Color.colorPrimary,
                        }}
                        value={this.state.otp}
                        onTextChange={otp => this.setState({otp})}
                        onBackspace={() => console.log('No more back.')}
                      />
                    </View>
                  ) : null}
                  <View
                    style={[
                      styles.loginLinkContainer,
                      {marginTop: 20, justifyContent: 'space-between'},
                    ]}>
                    {this.state.showOTP ? (
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
                    ) : (
                      <View />
                    )}

                    <View style={styles.buttonContainer}>
                      {this.state.showOTP ? (
                        <LoadingButton
                          title={Strings.signin}
                          loading={this.state.loading}
                          onPress={() => {
                            this.verifyOTP();
                          }}
                        />
                      ) : (
                        <LoadingButton
                          title={Strings.sendOTP}
                          loading={this.state.loading}
                          onPress={() => {
                            this.login();
                          }}
                        />
                      )}
                    </View>
                  </View>
                </Card>
              </View>
            </ScrollView>
          </View>
        </KeyboardAvoidingView>
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
    justifyContent: 'center',
    alignItems: 'center',
  },
  scrollView: {
    backgroundColor: Color.white,
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
  buttonContainer: {},
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
