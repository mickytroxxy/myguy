import { createStackNavigator } from '@react-navigation/stack';
import React, {useState,useContext } from "react";
import { StyleSheet, View,Text, Platform} from "react-native";
import {Feather, FontAwesome } from "@expo/vector-icons";
import { Col, Row, Grid } from 'react-native-easy-grid';
import { LinearGradient } from 'expo-linear-gradient';
import { AppContext } from '../context/AppContext';
import { createData } from '../context/Api';
const RootStack = createStackNavigator();
let object;
let return_url,cancel_url;
const mechantId = 15759218;
const Payment = ({navigation,route}) =>{
    const {appState:{fontFamilyObj}} = useContext(AppContext);
    object = route.params;
    return(
        <RootStack.Navigator screenOptions={{headerStyle: {elevation: 1,shadowOpacity: 0,backgroundColor: "#fff",borderBottomWidth: 0},headerTintColor: "#fff",headerTitleStyle: { fontWeight: "bold" }}}>
        <RootStack.Screen name="AddItemScreen" component={PageContent} options={{
            headerLeft: () => (
                <Feather.Button backgroundColor="#fff" name="arrow-left-circle" size={28} color="#757575" onPress={()=>{navigation.goBack()}}></Feather.Button>
            ), 
            title: "PAYMENT STATUS",
            headerTintColor: '#757575',
            headerTitleStyle: {
                fontWeight: '900',
                fontSize:16,
                fontFamily:fontFamilyObj.fontBold
            },
        }}/>
        </RootStack.Navigator>
    )
};
const PageContent = ({navigation}) =>{
    const {appState:{cart,setConfirmDialog,accountInfo,fontFamilyObj:{fontBold,fontLight}} } = useContext(AppContext);
    const {obj,id} = object;
    
    React.useEffect(() => {
        if(obj.paymentMethod === 'CASH ON DELIVERY'){
            createData("purchases",id,{...obj,paid:false});
        }else{
            const amount = (cart.reduce((total, obj) => (parseFloat(obj.price) * parseFloat(obj.quantity)) + total,0))
            if (Platform.OS == 'android') {
                return_url = encodeURIComponent('https://lifestyle.empiredigitals.org/');
                cancel_url = encodeURIComponent('https://smartstore.empiredigitals.org/');
            }else{
                return_url = 'https://lifestyle.empiredigitals.org/';
                cancel_url = 'https://smartstore.empiredigitals.org/';
            }
            const baseUrl = "https://www.payfast.co.za/eng/process?cmd=_paynow&receiver="+mechantId+"&item_name=valid fashion purchase&item_description=valid fashion purchase&amount="+amount+"&return_url="+return_url+"&cancel_url="+cancel_url+""
            navigation.navigate("WebBrowser",{object,baseUrl});
        }
    },[])
    return(
        <View style={styles.container}>
            {obj.paymentMethod === 'CASH ON DELIVERY' && (
                <View style={{justifyContent:'center',alignContent:'center',alignItems:'center'}}>
                    <Text style={{fontFamily:fontBold,color:'#757575',textAlign:'center'}}>YOUR ORDER HAS BEEN PLACED SUCCESSFULLY AND WE WILL UPDATE YOU VIA SMSs</Text>
                    <FontAwesome name='check-circle' size={180} color="green"></FontAwesome>
                </View>
            )}
        </View>
    )
};
export default Payment;
const styles = StyleSheet.create({
    searchInputHolder:{
        height:40,
        borderRadius:10,
        flexDirection:'row',
        borderWidth:0.5,
        borderColor:'#a8a6a5'
    },
    container: {
        flex: 1,
        backgroundColor: "#fff",
        marginTop:5,
        borderRadius:10,
        elevation:5,
        justifyContent:'center',alignContent:'center',alignItems:'center'
    },
    myBubble:{
        backgroundColor:'#7ab6e6',
        padding:5,
        minWidth:100,
    },
    preference: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingVertical: 12,
        paddingHorizontal: 16,
    },
});