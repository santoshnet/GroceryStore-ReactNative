import React, {Component} from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  StatusBar,
  ImageBackground,
} from 'react-native';
import AppIntroSlider from 'react-native-app-intro-slider';
import Color from '../theme/Color';

const slides = [
  {
    key: 1,
    title: 'Buy Premium Quality Fruits',
    text: 'Diversified Items Of Products In Life Genuine Products And Safe',
    image: require('../assets/images/slide1.png'),
  },
  {
    key: 2,
    title: 'Buy Quality  Dairy Products',
    text: 'Order Multiple Order For Multiple Category at The Same Time',
    image: require('../assets/images/slide2.png'),
  },
  {
    key: 3,
    title: 'Primee Fresh',
    text: 'Welcome',
    image: require('../assets/images/slide3.png'),
  },
];

class WelcomeScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  _renderItem = ({item}) => {
    return (
      <View style={styles.slide}>
        <ImageBackground source={item.image} style={styles.image}>
          <View
            // eslint-disable-next-line react-native/no-inline-styles
            style={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              width: '100%',
              marginTop: 80,
              paddingHorizontal: 50,
            }}>
            <Text style={styles.title}>{item.title}</Text>
          </View>
          <View
            // eslint-disable-next-line react-native/no-inline-styles
            style={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              width: '100%',
              paddingHorizontal: 40,
              marginTop: 10,
            }}>
            <Text style={styles.text}>{item.text}</Text>
          </View>
        </ImageBackground>
      </View>
    );
  };
  _onDone = () => {
    this.props.navigation.replace('Login');
  };
  _renderNextButton = () => {
    return (
      <View>
        <Text style={styles.next}>Next</Text>
      </View>
    );
  };
  _renderDoneButton = () => {
    return (
      <View>
        <Text style={styles.done}>Done</Text>
      </View>
    );
  };
  render() {
    return (
      <View style={{flex: 1}}>
        <StatusBar
          translucent
          backgroundColor={Color.transparent}
          barStyle="light-content"
        />
        <AppIntroSlider
          renderItem={this._renderItem}
          data={slides}
          onDone={this._onDone}
          dotStyle={styles.dots}
          activeDotStyle={styles.activeDots}
          renderDoneButton={this._renderDoneButton}
          renderNextButton={this._renderNextButton}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  slide: {
    flex: 1,
    // flexDirection: 'column',
  },
  image: {
    flex: 1,
    // resizeMode: 'cover',
    // justifyContent: 'flex-end',
    // paddingBottom: 100,
    width: '100%',
    height: '100%',
  },
  text: {
    color: Color.graylight,
    textAlign: 'center',
  },
  title: {
    // Buy Premium<br/>Quality Fruits
    color: 'black',
    fontSize: 28,
    fontFamily: 'Poppins',
    fontWeight: '700',
    lineHeight: 39,
    letterSpacing: 0.9,
    textAlign: 'center',
  },
  dots: {
    backgroundColor: Color.gray,
  },
  activeDots: {
    backgroundColor: Color.colorPrimary,
  },
  next: {
    fontSize: 14,
    fontWeight: '700',
    color: Color.gray,
  },
  done: {
    fontSize: 14,
    fontWeight: '700',
    color: Color.colorPrimaryDark,
  },
});

export default WelcomeScreen;
