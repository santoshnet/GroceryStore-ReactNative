/* eslint-disable react-native/no-inline-styles */
import React, {Component} from 'react';
import {View, Text, StyleSheet} from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import Color from '../theme/Color';

import {TouchableOpacity} from 'react-native';
import {COLORS} from '../theme';

function BadgeIcon(props) {
  return (
    <TouchableOpacity
      onPress={props.onPress}
      style={{
        display: 'flex',
        height: 40,
        width: 40,
        justifyContent: 'center',
        alignContent: 'center',
      }}>
      <View style={styles.badgeContainer}>
        {props.icon ? (
          <Icon name={props.icon} size={18} color={COLORS.lightGray1} />
        ) : null}
        {props.count && props.count > 0 ? (
          <View style={styles.badge}>
            <Text style={styles.badgeText}>{props.count}</Text>
          </View>
        ) : null}
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  badgeContainer: {
    position: 'relative',
    backgroundColor: COLORS.lightGray2,
    padding: 10,
    borderRadius: 90,
  },

  badge: {
    position: 'absolute',
    top: -10,
    right: 0,
    alignItems: 'center',
    backgroundColor: COLORS.green,
    borderRadius: 20,
    width: 20,
    height: 20,
    textAlign: 'center',
    paddingTop: 2,
    fontSize: 10,
    color: Color.white,
  },
  badgeText: {
    fontSize: 10,
    color: COLORS.white,
  },
});

export default BadgeIcon;
