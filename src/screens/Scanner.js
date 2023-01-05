import React, { useState, useEffect,useContext } from 'react';
import { Text, View, StyleSheet, Button,Dimensions,TouchableHighlight,TouchableOpacity, ActivityIndicator } from 'react-native';
import { BarCodeScanner } from 'expo-barcode-scanner';
import {FontAwesome} from 'react-native-vector-icons';
import { AppContext } from '../context/AppContext';
import { submitToGoogle, uploadFile } from '../context/Api';
const {height} = Dimensions.get("screen");
const {width} = Dimensions.get("screen");
export default function Scanner({navigation,route}) {
  const [hasPermission, setHasPermission] = useState(null);
  const [scanned, setScanned] = useState(false);
  const {scannedResults} = route.params;
  const {appState:{fontFamilyObj,setModalState,takePicture,accountInfo}} = useContext(AppContext);
  useEffect(() => {
    (async () => {
      const { status } = await BarCodeScanner.requestPermissionsAsync();
      setHasPermission(status === 'granted');
    })(); 
  }, []);

  const handleBarCodeScanned = ({ type, data }) => {
    navigation.goBack();
    setScanned(true);
    scannedResults(data);
  };
  const manualCodeEntered = (data) =>{
    navigation.goBack();
    scannedResults(data);
  }
  if (hasPermission === null) {
    return (
      <View style={{justifyContent:'center',alignItems:'center',alignContent:'center',flex:1}}>
        <ActivityIndicator size="large" color="#757575"></ActivityIndicator>
      </View>
    )
  }
  if (hasPermission === false) {
    return (
      <View style={{justifyContent:'center',alignItems:'center',alignContent:'center',flex:1}}>
        <Text>No access to camera</Text>
      </View>
    );
  }
  const scanner = accountInfo ? accountInfo.phoneNumber : 'guest'
  return (
    <View style={styles.container}>
        <BarCodeScanner onBarCodeScanned={scanned ? undefined : handleBarCodeScanned} style={{ width: height - 188, height: height,alignSelf: "center" }}>
            <View style={{justifyContent:'center',flex:1,alignContent:'center',alignItems:'center'}}>
                <View style={{position:'absolute',zIndex:1000,flexDirection:'row',width:(width-100)}}>
                  <TouchableOpacity style={{width:'50%',alignItems:'center'}} onPress={() => setModalState({isVisible:true,attr:{headerText:'ENTER CODE',manualCodeEntered,placeHolder:'Enter the code manually here...'}}) }>
                    <FontAwesome name="list" color="#fff" size={48}></FontAwesome>
                  </TouchableOpacity>

                  <TouchableOpacity style={{width:'50%',alignItems:'center'}} onPress={() => {
                    takePicture('qr-code',(image) => uploadFile(image,scanner,(result) => submitToGoogle(result,(code) => manualCodeEntered(code))))
                  }}>
                    <FontAwesome name="camera" color="#fff" size={48}></FontAwesome>
                  </TouchableOpacity>
                </View>
                <View>
                    <Text style={{fontFamily:fontFamilyObj.fontBold,color:'#fff'}}>VALID SCANNER</Text>
                </View>
                <View style={{borderWidth:3,borderRadius:50,borderColor:'#fff',width:(width-100),height:(height-200)}}></View>
                <TouchableOpacity onPress={()=>navigation.goBack()}>
                    <FontAwesome name="arrow-circle-o-left" color="#fff" size={48}></FontAwesome>
                </TouchableOpacity>
            </View>
        </BarCodeScanner>
        {scanned && <Button title={'Tap to Scan Again'} onPress={() => setScanned(false)} />}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
  },
});