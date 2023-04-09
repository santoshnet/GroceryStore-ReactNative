import AsyncStorage from '@react-native-async-storage/async-storage';

async function getUserAddress() {
  return JSON.parse(await AsyncStorage.getItem('MULTIPLE_USER_ADDRESS'));
}

function storeUserData(data) {
  AsyncStorage.setItem('MULTIPLE_USER_ADDRESS', JSON.stringify(data));
}

export {getUserAddress, storeUserData};
