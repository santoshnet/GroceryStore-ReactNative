import React from 'react';
import {Text, ToastAndroid, Alert} from 'react-native';
import WebView from 'react-native-webview';
import {BackHandler} from 'react-native';
import {cancelPayment} from '../axios/ServerRequest';
import {getToken} from '../utils/LocalStorage';

export default class InstamojoPayment extends React.Component {
  constructor(props) {
    super(props);
    this.state = {url: null};
    this.handleBackButtonClick = this.handleBackButtonClick.bind(this);
  }

  componentWillMount() {
    BackHandler.addEventListener(
      'hardwareBackPress',
      this.handleBackButtonClick,
    );
  }
  componentWillUnmount() {
    BackHandler.removeEventListener(
      'hardwareBackPress',
      this.handleBackButtonClick,
    );
  }

  componentDidMount() {
    var url = this.props.route.params.url;
    this.setState({url: url});
  }
  handleBackButtonClick() {
    this.cancelPaymentData();
    this.props.navigation.replace('MyCart');
    return true;
  }

  cancelPaymentData = async () => {
    let paymentURL = this.props.route.params.url;
    paymentURL = paymentURL.split('/');
    let request_id = paymentURL[paymentURL.length - 1];
    let options = {
      razorpay_order_id: request_id,
      token: await getToken(),
    };
    await cancelPayment(options)
      .then(res => {
        if (res.data.status === 200) {
          this.props.navigation.navigate('MyOrder');
        }
      })
      .catch(err => {
        console.log(err);
      });
  };
  onNavigationChange(webViewState) {
    let hitUrl = webViewState.url;
    console.log('==============>', webViewState);
    if (
      hitUrl &&
      hitUrl.includes('https://primeefresh.com/api/v1/update_payment')
    ) {
      console.log(hitUrl);
      this.props.navigation.navigate('ThankYou');
    }
  }

  // getPaymentDetails(trans_id) {
  //     ToastAndroid.show('Getting transaction status', ToastAndroid.SHORT);

  //     //insted of this you can do whatever you wan with the response , loading a custom success page with details etc
  //     const self = this;
  //     axios.get(`https://test.instamojo.com/api/1.1/payment-requests/${trans_id}`, {
  //         headers: {
  //             'Content-Type': 'application/json',
  //             'X-Api-Key': 'test_',
  //             'X-Auth-Token': 'test_'
  //         }
  //     }).then(function (response) {
  //         console.log(response);
  //         Alert.alert('Response of txn', JSON.stringify(response.data));

  //     })
  //         .catch(function (error) {
  //             console.log(JSON.stringify(error));
  //             ToastAndroid.show('Error', ToastAndroid.SHORT);

  //         })
  // }

  render() {
    var url = this.props.route?.params?.url;
    return (
      <>
        {url && url.length > 0 ? (
          <WebView
            ref="webview"
            source={{uri: url}}
            onNavigationStateChange={this.onNavigationChange.bind(this)}
            javaScriptEnabled={true}
            domStorageEnabled={true}
            startInLoadingState={true}
            // renderLoading={this.renderLoading.bind(this)}
            onMessage={event => console.log(event.nativeEvent.data)}
          />
        ) : null}
      </>
    );
  }
}
