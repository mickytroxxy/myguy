import 'react-native-url-polyfill/auto';
import { StatusBar } from 'expo-status-bar';
import { View } from 'react-native';
import { AppProvider } from './src/context/AppContext';
import { LogBox } from 'react-native';
import Constants from 'expo-constants'
import Navigation from './src/Navigation';
LogBox.ignoreLogs(['Warning: ...']);
LogBox.ignoreAllLogs();
export default function App() {
  return (
    <View style={{ flex: 1, paddingTop: Platform.OS === 'ios' ? Constants.statusBarHeight === 20 ? Constants.statusBarHeight : Constants.statusBarHeight - 5 : StatusBar.currentHeight,backgroundColor:"#e8e9f5" }}>
      <StatusBar backgroundColor="#e8e9f5" translucent={false} barStyle="dark-content"/>
      <AppProvider>
        <Navigation/>
      </AppProvider>
    </View>
  );
}