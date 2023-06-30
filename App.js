/* eslint-disable react/no-unstable-nested-components */
/* eslint-disable react-native/no-inline-styles */
import React, {Component} from 'react';
import 'react-native-gesture-handler';
import {Text, Image} from 'react-native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {createDrawerNavigator} from '@react-navigation/drawer';
import {NavigationContainer, DefaultTheme} from '@react-navigation/native';
import SplashScreen from './src/screen/SplashScreen';
import WelcomeScreen from './src/screen/WelcomeScreen';
import GetStartsScreen from './src/screen/GetStartsScreen';
import LoginScreen from './src/screen/LoginScreen';
import RegisterScreen from './src/screen/RegisterScreen';
import ForgotPasswordScreen from './src/screen/ForgotPasswordScreen';
import OTPScreen from './src/screen/OTPScreen';
import HomeScreen from './src/screen/HomeScreen';
import ProfileScreen from './src/screen/ProfileScreen';
import CategoryScreen from './src/screen/CategoryScreen';
import OffersScreen from './src/screen/OffersScreen';
import NewProductScreen from './src/screen/NewProductScreen';
import PopularProductScreen from './src/screen/PopularProductScreen';
import ProductsScreen from './src/screen/ProductsScreen';
import AddressScreen from './src/screen/AddressScreen';
import ProductView from './src/screen/ProductView';
import PlaceOrder from './src/screen/PlaceOrder';
import ThankYou from './src/screen/ThankYou';
import MyCartScreen from './src/screen/MyCartScreen';
import MyOrder from './src/screen/MyOrderScreen';
import CustomSidebarMenu from './src/navigation/CustomSidebarMenu';
import {LogBox} from 'react-native';
import FlashMessage from 'react-native-flash-message';
import AddressDetailsScreen from './src/screen/AddressDetailsScreen';
import AllAddress from './src/screen/AllAddress';
import UpdateAddress from './src/screen/UpdateAddress';
import {Provider} from 'react-redux';
import {stores, persistor} from './src/redux/stores';
import {PersistGate} from 'redux-persist/integration/react';
import InstamojoPayment from './src/screen/InstamojoPayment';
import OurProductScreen from './src/screen/OurProductScreen';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import search from './src/assets/images/search.png';
import account from './src/assets/images/account.png';
import store from './src/assets/images/store.png';
import cart from './src/assets/images/cart.png';
import {COLORS} from './src/theme';
import Icon from 'react-native-vector-icons/Feather';
import CategoryWiseProducts from './src/screen/CategoryWiseProducts';

const MainStack = createNativeStackNavigator();
const RootStack = createNativeStackNavigator();
const ProductStack = createNativeStackNavigator();
const Drawer = createDrawerNavigator();
const Tab = createBottomTabNavigator();

global.currentScreenIndex = 0;

const screenOptions = {
  headerShown: false,
  animationEnabled: false,
  tabBarStyle: {
    borderTopLeftRadius: 18,
    borderTopRightRadius: 18,
    backgroundColor: '#FFF',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: -12,
    },
    shadowOpacity: 0.5,
    shadowRadius: 37,
    elevation: 5,
    height: 62,
  },
  tabBarItemStyle: {
    height: 57,
    margin: 5,
    borderRadius: 10,
  },
};

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  TabNavigator = () => (
    <Tab.Navigator
      tabBarOptions={{
        activeTintColor: COLORS.green, // Color for the active tab
        inactiveTintColor: COLORS.darkGray, // Color for inactive tabs
      }}
      {...{screenOptions}}>
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          tabBarLabel: 'Store',
          tabBarIcon: ({color, focused}) => (
            <Icon name={'home'} size={26} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="OurProductScreen"
        component={OurProductScreen}
        options={{
          tabBarLabel: 'Search',
          tabBarIcon: ({color, focused}) => (
            <Icon name={'search'} size={26} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="MyCart"
        component={MyCartScreen}
        options={{
          tabBarLabel: 'Cart',
          tabBarIcon: ({color, focused}) => (
            <Icon name={'shopping-cart'} size={26} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="Offers"
        component={OffersScreen}
        options={{
          tabBarLabel: 'Offers',
          tabBarIcon: ({color, focused}) => (
            <Icon name={'activity'} size={26} color={color} />
          ),
        }}
      />
    </Tab.Navigator>
  );

  createDrawer = () => (
    <Drawer.Navigator
      initialRouteName="Home"
      // contentOptions={(activeTintColor = 'red')}
      screenOptions={{
        headerShown: false,
        animationEnabled: false,
      }}
      drawerContent={props => <CustomSidebarMenu {...props} />}>
      <Drawer.Screen name="TabNavigator" component={this.TabNavigator} />
      <Drawer.Screen name="Profile" component={ProfileScreen} />
      <Drawer.Screen name="Category" component={CategoryScreen} />
      <Drawer.Screen name="Offers" component={OffersScreen} />
      <Drawer.Screen name="NewProducts" component={NewProductScreen} />
      <Drawer.Screen name="PopularProducts" component={PopularProductScreen} />
      <Drawer.Screen name="MyCart" component={MyCartScreen} />
      <Drawer.Screen name="MyOrder" component={MyOrder} />
      <Drawer.Screen name="OurProductScreen" component={OurProductScreen} />
      <Drawer.Screen
        name="CategoryWiseProducts"
        component={CategoryWiseProducts}
      />
    </Drawer.Navigator>
  );

  MainStackScreen = () => (
    <MainStack.Navigator
      screenOptions={{
        headerShown: false,
        animationEnabled: false,
      }}>
      <MainStack.Screen name="SplashScreen" component={SplashScreen} />
      <MainStack.Screen name="GetStartsScreen" component={GetStartsScreen} />
      <MainStack.Screen name="WelcomeScreen" component={WelcomeScreen} />
    </MainStack.Navigator>
  );
  ProductStackScreen = () => (
    <ProductStack.Navigator
      initialRouteName="ProductView"
      screenOptions={{
        headerShown: false,
        animationEnabled: false,
      }}>
      <ProductStack.Screen name="ProductView" component={ProductView} />
      <ProductStack.Screen name="Products" component={ProductsScreen} />
      <ProductStack.Screen name="AllAddress" component={AllAddress} />
      <ProductStack.Screen name="UpdateAddress" component={UpdateAddress} />

      <ProductStack.Screen
        name="AddressDetailsScreen"
        component={AddressDetailsScreen}
      />
      <ProductStack.Screen name="Address" component={AddressScreen} />
      <ProductStack.Screen
        name="AddressDetails"
        component={AddressDetailsScreen}
      />
      <ProductStack.Screen name="PlaceOrder" component={PlaceOrder} />
      <ProductStack.Screen
        name="InstamojoPayment"
        component={InstamojoPayment}
      />
      <ProductStack.Screen name="ThankYou" component={ThankYou} />
    </ProductStack.Navigator>
  );

  RootStackScreen = () => (
    <RootStack.Navigator
      screenOptions={{
        headerShown: false,
        animationEnabled: false,
      }}>
      <RootStack.Screen name="Main" component={this.MainStackScreen} />
      <RootStack.Screen
        name="ProductView"
        component={this.ProductStackScreen}
      />
      <RootStack.Screen name="Login" component={LoginScreen} />
      <RootStack.Screen name="Register" component={RegisterScreen} />
      <RootStack.Screen name="OTP" component={OTPScreen} />
      <RootStack.Screen
        name="ForgetPassword"
        component={ForgotPasswordScreen}
      />
      <RootStack.Screen name="HomeScreen" children={this.createDrawer} />
    </RootStack.Navigator>
  );

  componentDidMount() {
    LogBox.ignoreLogs(['Warning: ...']); // Ignore log notification by message
    LogBox.ignoreAllLogs(); //Ignore all log notifications
  }

  render() {
    return (
      <Provider store={stores}>
        <NavigationContainer>
          <PersistGate loading={<Text>Loading...</Text>} persistor={persistor}>
            <FlashMessage position="top" style={{marginTop: 10}} />
            {this.RootStackScreen()}
          </PersistGate>
        </NavigationContainer>
      </Provider>
    );
  }
}

export default App;
