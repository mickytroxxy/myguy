import React from 'react';
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from '@react-navigation/stack';

import Home from './Home';
import Scanner from './Scanner';
import Cart from './Cart';
import Register from './Register';
import DeliveryInfo from './DeliveryInfo';
import Payment from './Payment';
import WebBrowser from './WebBrowser';
import ConfirmScreen from './ConfirmScreen';
import Contact from './Contact';
import DocumentView from './DocumentView';
import CameraScreen from './CameraScreen';
import GenerateDocs from './GenerateDocs';
import Results from './Results';
import Download from './Download';

const RootStack = createStackNavigator();
const Navigation = props => {
  return (
    <NavigationContainer>
      <RootStack.Navigator initialRouteName="Home"
        screenOptions={{
          headerStyle: {
            elevation: 0,
            shadowOpacity: 0,
            backgroundColor: "#009387",
            borderBottomWidth: 0,
          },
          headerTintColor: "#fff",
          headerTitleStyle: { fontWeight: "bold" },
          headerShown: false
        }}
      >
        <RootStack.Screen
          name="Home"
          component={Home}
        />
        <RootStack.Screen
          name="Scanner"
          component={Scanner}
        />
        <RootStack.Screen
          name="Cart"
          component={Cart}
        />
        <RootStack.Screen
          name="Register"
          component={Register}
        />
        <RootStack.Screen
          name="DeliveryInfo"
          component={DeliveryInfo}
        />
        <RootStack.Screen
          name="Payment"
          component={Payment}
        />
        <RootStack.Screen
          name="WebBrowser"
          component={WebBrowser}
        />
        <RootStack.Screen
          name="ConfirmScreen"
          component={ConfirmScreen}
        />
        <RootStack.Screen
          name="Contact"
          component={Contact}
        />
        <RootStack.Screen
          name="DocumentView"
          component={DocumentView}
        />
        <RootStack.Screen
          name="CameraScreen"
          component={CameraScreen}
        />
        <RootStack.Screen
          name="GenerateDocs"
          component={GenerateDocs}
        />
        <RootStack.Screen
          name="Results"
          component={Results}
        />
         <RootStack.Screen
          name="Download"
          component={Download}
        />
      </RootStack.Navigator>
    </NavigationContainer>
  );
};
export default React.memo(Navigation);