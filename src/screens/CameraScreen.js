import React, { useEffect, useState } from 'react';
import {StyleSheet, View, Text, Dimensions, Platform,TouchableOpacity,ActivityIndicator } from 'react-native';
import { Camera } from 'expo-camera';
import FontAwesome from "react-native-vector-icons/FontAwesome";
import { MaterialIcons } from "@expo/vector-icons";
import * as Permissions from 'expo-permissions';
import * as ImagePicker from 'expo-image-picker';
import * as ImageManipulator from 'expo-image-manipulator';
const {height} = Dimensions.get("screen");
const {width} = Dimensions.get("screen");
export default function CameraScreen({route,navigation}) {
  const selfieResponse = route.params;
  const [hasCameraPermission, setHasCameraPermission] = useState(null);
  const [camera, setCamera] = useState(null);
  const [type, setType] = useState(Camera.Constants.Type.front);
  const [flashMode,setFlashMode]=useState(Camera.Constants.FlashMode.off);
  const [imagePadding, setImagePadding] = useState(0);
  const [ratio, setRatio] = useState('4:3');  // default is 4:3
  const { height, width } = Dimensions.get('window');
  const screenRatio = height / width;
  const [isRatioSet, setIsRatioSet] =  useState(false);

  useEffect(() => {
    async function getCameraStatus() {
      const { status } = await Permissions.askAsync(Permissions.CAMERA);
      setHasCameraPermission(status == 'granted');
    }
    getCameraStatus();
  }, []);
  const prepareRatio = async () => {
    let desiredRatio = '4:3';
    // This issue only affects Android
    if (Platform.OS === 'android') {
      const ratios = await camera.getSupportedRatiosAsync();
      let distances = {};
      let realRatios = {};
      let minDistance = null;
      for (const ratio of ratios) {
        const parts = ratio.split(':');
        const realRatio = parseInt(parts[0]) / parseInt(parts[1]);
        realRatios[ratio] = realRatio;
        const distance = screenRatio - realRatio; 
        distances[ratio] = realRatio;
        if (minDistance == null) {
          minDistance = ratio;
        } else {
          if (distance >= 0 && distance < distances[minDistance]) {
            minDistance = ratio;
          }
        }
      }
      desiredRatio = minDistance;
      //  calculate the difference between the camera width and the screen height
      const remainder = Math.floor(
        (height - realRatios[desiredRatio] * width) / 2
      );
      // set the preview padding and preview ratio
      setImagePadding(remainder / 2);
      setRatio(desiredRatio);
      // Set a flag so we don't do this 
      // calculation each time the screen refreshes
      setIsRatioSet(true);
    }
  };
  const setCameraReady = async() => {
    if (!isRatioSet) {
      await prepareRatio();
    }
  };
  const takePicture = async () => {
    if (camera) {
      const result = await camera.takePictureAsync(null);
      await ImageManipulator.manipulateAsync(result.uri, [{ resize: { width: width*2, height: height*2 } }], {
        compress: 0.4,
        format: ImageManipulator.SaveFormat.JPEG,
        base64: false,
      }).then(async (result) => {
        selfieResponse(result.uri)
        navigation.goBack();
      });
    }
  }
  if (hasCameraPermission === null) {
    return (
      <View style={styles.information}>
        <ActivityIndicator size="large" color="#757575"></ActivityIndicator>
      </View>
    );
  } else if (hasCameraPermission === false) {
    return (
      <View style={styles.information}>
        <Text>No access to camera</Text>
      </View>
    );
  } else {
    return (
      <View style={styles.container}>
        <Camera
          type={type} whiteBalance={'auto'} flashMode={flashMode}
          style={[styles.cameraPreview, {marginTop: imagePadding, marginBottom: imagePadding}]}
          onCameraReady={setCameraReady}
          ratio={ratio}
          ref={(ref) => {
            setCamera(ref);
          }}>
            <View style={{flex: 1,flexDirection:'row', padding:10}}>
          <View style={{flex:2}}>
            <TouchableOpacity onPress={()=>{navigation.goBack()}}>
                <MaterialIcons name="highlight-off" size={36} color="#fff" alignSelf="center"></MaterialIcons>
              </TouchableOpacity>
          </View>
          <View style={{flex:2}}>
            <TouchableOpacity style={{flexDirection:'row-reverse'}} onPress={()=>{setFlashMode(flashMode === 0? 1: 0)}}>
              {flashMode===0?(
                <MaterialIcons name="flash-on" size={36} color="#fff" alignSelf="center"></MaterialIcons>
              ):(
                <MaterialIcons name="flash-off" size={36} color="#fff" alignSelf="center"></MaterialIcons>
              )}
            </TouchableOpacity>
          </View>
        </View>
          <View style={styles.cameraActionView}>
            <View style={{alignItems:'center',alignContent:'center',justifyContent:'center',flex:1}}>
              <TouchableOpacity onPress={()=>{takePicture()}}>
                <MaterialIcons name="radio-button-checked" size={100} color="#fff" alignSelf="center"></MaterialIcons>
              </TouchableOpacity>
            </View>
          </View>
        </Camera>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  information: { 
    flex: 1,
    justifyContent: 'center',
    alignContent: 'center',
    alignItems: 'center',
  },
  container: {
    flex: 1,
    backgroundColor: '#000',
    justifyContent: 'center',
  },
  cameraPreview: {
    flex: 1,
  },cameraActionView:{
    justifyContent:'center',
    flexDirection:'row'
  },
  image: {
    flex: 1,
    resizeMode: "cover",
    justifyContent: "center",
    width: '100%', height: '100%',
  },
});