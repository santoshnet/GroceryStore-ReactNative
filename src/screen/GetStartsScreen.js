/* eslint-disable react-native/no-inline-styles */
import {Text, View, Image, TouchableOpacity} from 'react-native';
import React, {Component} from 'react';
import startImg from '../assets/images/start.png';

export class GetStartsScreen extends Component {
  render() {
    return (
      <View
        style={{
          flex: 1,
          backgroundColor: 'white',
        }}>
        <View
          style={{
            flex: 5,
            display: 'flex',
            justifyContent: 'flex-end',
            alignItems: 'flex-end',
          }}>
          <Image
            style={{
              width: '100%',
              height: '100%',
              maxHeight: 750,
              // transform: 'rotate(-152.63deg)',
            }}
            source={startImg}
          />
        </View>
        <View
          style={{

            bottom: 100,
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          <Text
            style={{
              textAlign: 'center',
              position: 'absolute',
              color: '#016839',
              fontSize: 25,
              fontFamily: 'Poppins',
              fontWeight: '400',
              lineHeight: 29,
            }}>
            Welcome to
          </Text>
        </View>
        <View
          style={{
            flex: 1,
            bottom: 130,
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          <Text
            style={{
              textAlign: 'center',
              color: '#016839',
              position: 'absolute',
              fontSize: 38,
              fontFamily: 'Gilroy',
              fontWeight: '800',
              //   lineHeight: 29,
            }}>
            Primee Fresh
          </Text>
        </View>
        <View
          style={{
            flex: 1,
            bottom: 159,
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          <TouchableOpacity
            style={{
              backgroundColor: '#63AC36',
              borderRadius: 13,
              height: 67,
              width: 356,

              justifyContent: 'center',
              alignItems: 'center',
              display: 'flex',
            }}
            onPress={() => this.props.navigation.navigate('WelcomeScreen')}>
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
              Get Started
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }
}

export default GetStartsScreen;
