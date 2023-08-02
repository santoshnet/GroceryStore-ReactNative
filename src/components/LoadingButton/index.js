import React, {Component} from 'react';
import {View, Button, StyleSheet, Text, ActivityIndicator} from 'react-native';
import Color from '../../theme/Color';
import Font from '../../theme/Fonts';
import {TouchableOpacity} from 'react-native';
function LoadingButton(props) {
  return (
    <View style={{marginBottom: 10}}>
      {props.loading ? (
        <View style={[styles.buttonStyle, props.style]}>
          <ActivityIndicator size="small" color="#ffffff" />
        </View>
      ) : (
        <TouchableOpacity
          onPress={props.onPress}
          style={[styles.buttonStyle, props.style]}>
          <Text style={styles.buttonText}>{props.title}</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  buttonStyle: {
    color: Color.white,
    borderRadius: 5,
    backgroundColor: Color.colorPrimary,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonText: {
    color: Color.white,
    fontFamily: Font.primarySemiBold,
    fontSize: 14,
    textAlign: 'center',
  },
});

export default LoadingButton;
