// In App.js in a new project

import * as React from 'react';
import { View, Text, TouchableOpacity, Dimensions } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Pdf from 'react-native-pdf';
import QRCode from 'react-native-qrcode-svg'
const Stack = createNativeStackNavigator();
const source = { uri: 'http://samples.leanpub.com/thereactnativebook-sample.pdf', cache: true };
function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName='Home' screenOptions={{
    headerShown: false
  }}>
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="Details" component={DetailsScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
function HomeScreen({navigation}) {
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <QRCode value='some text'/>
      <Pdf
                    source={source}
                    trustAllCerts={false}
                    onLoadComplete={(numberOfPages,filePath) => {
                        console.log(`Number of pages: ${numberOfPages}`);
                    }}
                    onPageChanged={(page,numberOfPages) => {
                        console.log(`Current page: ${page}`);
                    }}
                    onError={(error) => {
                        console.log(error);
                    }}
                    onPressLink={(uri) => {
                        console.log(`Link pressed: ${uri}`);
                    }}
                    style={{
                      flex:1,
                      width:Dimensions.get('window').width,
                      height:Dimensions.get('window').height,
                  }}/>
    </View>
  );
}
function DetailsScreen({navigation}) {
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <TouchableOpacity onPress={() => navigation.goBack()}>
        <Text>Details Screen jjj</Text>
      </TouchableOpacity>
      {/* <Pdf
                    source={source}
                    trustAllCerts={false}
                    onLoadComplete={(numberOfPages,filePath) => {
                        console.log(`Number of pages: ${numberOfPages}`);
                    }}
                    onPageChanged={(page,numberOfPages) => {
                        console.log(`Current page: ${page}`);
                    }}
                    onError={(error) => {
                        console.log(error);
                    }}
                    onPressLink={(uri) => {
                        console.log(`Link pressed: ${uri}`);
                    }}
                    style={{
                      flex:1,
                      width:Dimensions.get('window').width,
                      height:Dimensions.get('window').height,
                  }}/> */}
    </View>
  );
}
export default App;