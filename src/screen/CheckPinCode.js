/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-dupe-keys */
/* eslint-disable no-shadow */
/* eslint-disable react-native/no-inline-styles */
import React, {FunctionComponent, useState, useEffect, useRef} from 'react';
import {
  View,
  Text,
  StyleSheet,
  Animated,
  ScrollView,
  TouchableNativeFeedback,
  Modal,
  Platform,
  TouchableOpacity,
  TextInput,
} from 'react-native';
// import TwoPointSlider from '@ptomasroos/react-native-multi-slider';

import {Color, Fonts, Strings, Dimension, COLORS, SIZES, FONTS} from '../theme';
import CrossIcon from 'react-native-vector-icons/Entypo';
import Icon from 'react-native-vector-icons/Entypo';
import EditIcon from 'react-native-vector-icons/FontAwesome';
import {
  addSelectedAddress,
  setSelectedAddress,
  deleteSelectedAddress,
  checkItemDeliveryAddress,
  updateSelectedAddress,
} from '../redux/userAddress/actions';
import {connect} from 'react-redux';

const CheckPinCode = ({
  isVisible,
  onClose,
  pinsuccess,
  pinfailure,
  userAddress,
  setSelectedAddress,
  selectedUserAddress,
  deleteSelectedAddress,
  checkItemDeliveryAddress,
  isDeliveryToLocation,
  updateSelectedAddress,
  deliveryItemPinCode,
}) => {
  const [pinCode, setPincode] = React.useState(selectedUserAddress.zip || '');
  const [pincodemesg, setPincodemesg] = React.useState([]);

  React.useEffect(() => {
    let checkpinCode = deliveryItemPinCode?.some(ele => ele.pin === pinCode);
    if (checkpinCode === true) {
      setPincodemesg(true);
      let newAddress = {
        id: selectedUserAddress.id,
        zip: pinCode,
      };
      updateSelectedAddress(newAddress);
      let updateuseraddress = selectedUserAddress;
      updateuseraddress.zip = newAddress.zip;
      // console.log(updateuseraddress, 'updateuseraddress in pin');
      setSelectedAddress(updateuseraddress);
    } else {
      setPincodemesg(false);
    }
  }, [pinCode, deliveryItemPinCode, selectedUserAddress]);

  const handleCheckPincode = () => {
    console.log(pinCode.length, 'pinCode', isDeliveryToLocation);
    if (pinCode.length === 6) {
      let checkpinCode = deliveryItemPinCode?.some(ele => ele.pin === pinCode);
      if (checkpinCode === true) {
        setPincodemesg(true);
        let newAddress = {
          id: selectedUserAddress.id,
          zip: pinCode,
        };
        updateSelectedAddress(newAddress);
        let updateuseraddress = selectedUserAddress;
        updateuseraddress.zip = newAddress.zip;
        console.log(updateuseraddress, 'updateuseraddress in pin');
        setSelectedAddress(updateuseraddress);
        onClose(false);
        pinsuccess();
      } else {
        setPincodemesg(false);
        pinfailure(false);
      }
    } else if (pinCode.length !== 6) {
      setPincodemesg('Invalid zipcode');
      onClose(false);
    }
  };

  const renderPincodeChange = () => {
    return (
      <View
        style={{
          color: COLORS.black,
          paddingBottom: 10,
          paddingTop: 20,
        }}>
        {/* Label & Error msg */}
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
          }}>
          <Text
            style={{
              color: COLORS.black,
              ...FONTS.h5,
              fontWeight: 500,
            }}>
            Delivery & Services For
          </Text>
        </View>

        {/* Text Input */}
        <View
          style={{
            flexDirection: 'row',
            height: 55,
            paddingHorizontal: SIZES.padding,
            marginTop: SIZES.base,
            borderRadius: SIZES.radius,
            backgroundColor: COLORS.lightGray2,
          }}>
          <TextInput
            style={{
              flex: 1,
              color: COLORS.black,
            }}
            value={pinCode}
            placeholder={'pincode'}
            placeholderTextColor={COLORS.grey}
            keybordType="numeric"
            autoCompleteType={true}
            maxLength={6}
            // autoCapitalize={autoCapitalize}
            onChangeText={text => setPincode(text)}
          />
          <View
            style={{
              justifyContent: 'center',
            }}>
            <TouchableOpacity onPress={() => handleCheckPincode()}>
              <Text
                style={{
                  color: COLORS.primary,
                  ...FONTS.h3,
                  fontWeight: 500,
                }}>
                check
              </Text>
            </TouchableOpacity>
          </View>
        </View>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
          }}>
          {pincodemesg == true ? (
            <Text
              style={{
                color: COLORS.green,
                ...FONTS.h5,
                fontWeight: 500,
              }}>
              delivery is availble to this location
            </Text>
          ) : (
            <Text
              style={{
                color: COLORS.red,
                ...FONTS.h5,
                fontWeight: 500,
              }}>
              delivery is not availble to this location
            </Text>
          )}
        </View>
      </View>
    );
  };
  const chooesAddress = (item, selectedUserAddress, deleteSelectedAddress) => {
    return (
      <View style={styles.item}>
        <View style={styles.itemLeft}>
          <View>
            <Text style={styles.itemText}>{item.name}</Text>
            <Text style={styles.itemText}>{item.zip}</Text>
            <Text style={styles.itemText}>{item.address}</Text>
          </View>
        </View>
        <View style={{marginRight: 16}}>
          <View
            style={
              item?.id === selectedUserAddress?.id
                ? styles.selectcircular
                : styles.circular
            }
          />
        </View>
      </View>
    );
  };

  // eslint-disable-next-line react/no-unstable-nested-components
  const AddressContainer = (
    userAddress,
    setSelectedAddress,
    selectedUserAddress,
    deleteSelectedAddress,
  ) => {
    return (
      <View
        style={{
          marginBottom: 200,
          //   backgroundColor: '#E8EAED',
          marginTop: 2,
          height: '100%',
        }}>
        {/* Added this scroll view to enable scrolling when list gets longer than the page */}

        {/* Today's Tasks */}

        <View style={styles.tasksWrapper}>
          {userAddress && userAddress.length > 0 ? (
            <>
              <Text style={styles.sectionTitle}>
                Selected a saved address to check delivery info
              </Text>

              <View style={styles.items}>
                {/* This is where the tasks will go! */}
                {userAddress?.map((item, index) => {
                  return (
                    <TouchableOpacity
                      key={index}
                      onPress={() => {
                        setSelectedAddress(item);
                        setPincode(item.zip);
                        handleCheckPincode();
                      }}>
                      {chooesAddress(
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
                justifyContent: 'center',
              }}
            />
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

        {/* Write a task */}
        {/* Uses a keyboard avoiding view which ensures the keyboard does not cover the items on screen */}
      </View>
    );
  };

  return (
    <Modal animationType="fade" transparent={true} visible={isVisible}>
      <View style={styles.container}>
        {/* Transparent Background */}
        <TouchableNativeFeedback
          onPress={() => {
            onClose(false);
          }}>
          <View style={styles.shadowTransparentBackground} />
        </TouchableNativeFeedback>
        <Animated.View
          style={[
            styles.containerFilter,
            {top: SIZES.height - SIZES.height * 0.85},
          ]}>
          {/* Header */}

          {renderPincodeChange()}
          {/* Line Divider */}
          <View style={styles.lineDivider} />
          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{paddingBottom: 30}}>
            {AddressContainer(
              userAddress,
              setSelectedAddress,
              selectedUserAddress,
              deleteSelectedAddress,
            )}
          </ScrollView>
          {/* Apply Button */}
        </Animated.View>
      </View>
    </Modal>
  );
};

function mapStateToProps(state) {
  console.log(state, 'state');
  return {
    userAddress: state?.userAddressReducer.userAddress,
    selectedUserAddress: state?.userAddressReducer.selectedUserAddress,
    isDeliveryToLocation: state?.userAddressReducer.isDeliveryToLocation,
    deliveryItemPinCode: state.userAddressReducer?.deliveryItemPinCode,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    addSelectedAddress: selectedAddress => {
      return dispatch(addSelectedAddress(selectedAddress));
    },
    updateSelectedAddress: selectedAddress => {
      return dispatch(updateSelectedAddress(selectedAddress));
    },
    setSelectedAddress: selectedAddress => {
      return dispatch(setSelectedAddress(selectedAddress));
    },
    deleteSelectedAddress: selectedAddressId => {
      return dispatch(deleteSelectedAddress(selectedAddressId));
    },
    checkItemDeliveryAddress: selectedPin => {
      return dispatch(checkItemDeliveryAddress(selectedPin));
    },
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(CheckPinCode);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.transparentBlack7,
  },
  shadowTransparentBackground: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  containerFilter: {
    position: 'absolute',
    left: 0,
    width: '100%',
    height: '100%',
    padding: SIZES.padding,
    borderTopRightRadius: SIZES.padding,
    borderTopLeftRadius: SIZES.padding,
    backgroundColor: COLORS.white,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    // backgroundColor: 'red'
  },
  textFilter: {
    flex: 1,
    ...FONTS.h3,
    fontSize: 18,
    color: 'black',
  },
  iconButtonContainer: {
    borderWidth: 2,
    borderRadius: 10,
    borderColor: COLORS.gray2,
  },
  applyButton: {
    position: 'absolute',
    ...Platform.select({
      android: {bottom: 100, height: 100},
      ios: {bottom: 150, height: 110},
    }),
    left: 0,
    right: 0,
    paddingHorizontal: SIZES.padding,
    paddingVertical: SIZES.radius,
    backgroundColor: COLORS.white,
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
    width: '100%',
    backgroundColor: Color.colorPrimary,
    color: Color.white,
    borderRadius: 12,
  },
  checkout: {
    width: '100%',
    paddingTop: 10,
    textAlign: 'center',
    fontSize: 20,
    fontWeight: '700',
    color: Color.white,
  },
  tasksWrapper: {
    // paddingTop: 80,
    paddingHorizontal: 10,
  },
  lineDivider: {
    height: 1,
    marginVertical: SIZES.radius,
    marginLeft: SIZES.radius,
    backgroundColor: COLORS.lightGray2,
    marginBottom: 10,
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
    backgroundColor: COLORS.primary,
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
    fontSize: 13,
    fontWeight: 'bold',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'flex-start',
    paddingTop: 10,
    textAlign: 'left',
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
});
