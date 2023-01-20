import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Home from './screens/Home';
import Register from './screens/Register';
import CameraScreen from './screens/CameraScreen';
import ConfirmScreen from './screens/ConfirmScreen';
import Contact from './screens/Contact';
import DocumentView from './screens/DocumentView';
import Results from './screens/Results';
import Scanner from './screens/Scanner';
import WebBrowser from './screens/WebBrowser';
import GenerateDocs from './screens/GenerateDocs';
import Profile from './screens/Profile';
import CreateProject from './screens/CreateProject';
import Review from './screens/Review';
import AddDocument from './screens/AddDocument';
import Participants from './screens/Participants';
import ActivateProject from './screens/Subcribe';
import RequestApp from './screens/RequestApp';
const Stack = createNativeStackNavigator();
function Navigation() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName='Home' screenOptions={{
    headerShown: false
  }}>
        <Stack.Screen name="Home" component={Home} />
        <Stack.Screen name="Register" component={Register} />
        <Stack.Screen name="CameraScreen" component={CameraScreen} />
        <Stack.Screen name="ConfirmScreen" component={ConfirmScreen} />
        <Stack.Screen name="Contact" component={Contact} />
        <Stack.Screen name="DocumentView" component={DocumentView} />
        <Stack.Screen name="Results" component={Results} />
        <Stack.Screen name="Scanner" component={Scanner} />
        <Stack.Screen name="WebBrowser" component={WebBrowser} />
        <Stack.Screen name="GenerateDocs" component={GenerateDocs} />
        <Stack.Screen name="Profile" component={Profile} />
        <Stack.Screen name="CreateProject" component={CreateProject} />
        <Stack.Screen name="Review" component={Review} />
        <Stack.Screen name="AddDocument" component={AddDocument} />
        <Stack.Screen name="Participants" component={Participants} />
        <Stack.Screen name="ActivateProject" component={ActivateProject} />
        <Stack.Screen name="RequestApp" component={RequestApp} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
export default Navigation;