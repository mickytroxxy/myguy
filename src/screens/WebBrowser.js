import React, { useState } from "react";
import { View,Text,StyleSheet,TouchableOpacity,ActivityIndicator } from "react-native";
import { WebView } from 'react-native-webview';
import FontAwesome from "react-native-vector-icons/FontAwesome";
import { AppContext } from "../context/AppContext";
import { createData } from "../context/Api";
const WebBrowser = ({route,navigation}) =>{
    const { appState:{fontFamilyObj} } = React.useContext(AppContext);
    const { object,baseUrl } = route.params;
    const [successStatus,setSuccessStatus]=useState('processing');
    React.useEffect(()=>{
        setSuccessStatus("processing")
    },[])
    if (successStatus=="processing") {
        return(
            <WebView
                source={{uri: baseUrl}}
                onLoadStart={(syntheticEvent) => {
                    const { nativeEvent } = syntheticEvent;
                    if (!nativeEvent.url.includes("https://www.payfast.co.za/eng/process?cmd=_paynow&receiver=")) {
                        if (nativeEvent.url.includes("smartstore")) {
                            setSuccessStatus("failed");
                        }else if (nativeEvent.url.includes("lifestyle") && (!nativeEvent.url.includes("www.payfast.co.za"))) {
                            setSuccessStatus("loading");
                        }
                    }
                }}
            />
        )
    }else if (successStatus=="processed") {
        return(
            <View style={styles.container}>
                <FontAwesome name="check-circle" color="green" size={200}></FontAwesome>
                <Text style={{color:'#2a2828',fontFamily:fontFamilyObj.fontBold,padding:10,textAlign:'center'}}>YOUR ORDER HAS BEEN PLACED SUCCESSFULLY AND WE WILL UPDATE YOU VIA SMSs</Text>
                <TouchableOpacity style={{marginTop:50}} onPress={()=>{
                    navigation.goBack();
                    navigation.goBack()
                }}>
                    <FontAwesome name="arrow-circle-left" color="#757575" size={50}></FontAwesome>
                </TouchableOpacity>
            </View>
        )
    }else if (successStatus=="failed") {
        return(
            <View style={styles.container}>
                <FontAwesome name="times-circle-o" color="tomato" size={200}></FontAwesome>
                <View>
                    <Text style={{color:'#2a2828',fontFamily:fontFamilyObj.fontBold,padding:10,alignItems: 'center',alignContent:'center',textAlign:'center'}}>ERROR! EITHER YOU CANCELLED THE TRANSACTION OR YOUR PAYMENT IS NOT VALID</Text>
                </View>
                <TouchableOpacity style={{marginTop:50}} onPress={()=>{
                    navigation.goBack();
                    navigation.goBack()
                }}>
                    <FontAwesome name="arrow-circle-left" color="#757575" size={50}></FontAwesome>
                </TouchableOpacity>
            </View>
        )
    }
    else if (successStatus=="loading") {
        const {id,obj} = object;
        if(createData("purchases",id,{...obj,paid:true})){
            setSuccessStatus("processed")
        }
        return(
            <View style={styles.container}>
                <ActivityIndicator size="large" color="#0000ff" style={{marginTop:50}}/>
            </View>
        )
    }
}
export default WebBrowser;
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
    },
});