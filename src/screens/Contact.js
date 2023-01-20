import { createNativeStackNavigator as createStackNavigator } from '@react-navigation/native-stack';
import React, {useState,useContext, useEffect } from "react";
import { StyleSheet, View,Text, TouchableOpacity, Linking} from "react-native";
import {Feather, FontAwesome, MaterialIcons } from "@expo/vector-icons";
import { AppContext } from '../context/AppContext';
import { getContact } from '../context/Api';
const RootStack = createStackNavigator();
const Contact = ({navigation,route}) =>{
    const {appState:{fontFamilyObj}} = useContext(AppContext);
    return(
        <RootStack.Navigator screenOptions={{headerStyle: {elevation: 1,shadowOpacity: 0,backgroundColor: "#fff",borderBottomWidth: 0},headerTintColor: "#fff",headerTitleStyle: { fontWeight: "bold" }}}>
        <RootStack.Screen name="AddItemScreen" component={PageContent} options={{
            headerLeft: () => (
                <Feather.Button backgroundColor="#fff" name="arrow-left-circle" size={28} color="#757575" onPress={()=>{navigation.goBack()}}></Feather.Button>
            ), 
            title: "CONTACT US",
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
    const {appState:{accountInfo,nativeLink,fontFamilyObj:{fontBold,fontLight}} } = useContext(AppContext);
    const [contactInfo,setContactInfo] = useState(null)
    useEffect(() => {
        getContact(response => response.length > 0 && setContactInfo(response[0]))
    },[])
    return(
        <View style={styles.container}>
            <View style={{marginBottom:30}}>
                <View style={{backgroundColor:'#2277BA',padding:20,borderRadius:10}}><Text style={{fontFamily:fontBold,color:'#fff'}}>GET IN TOUCH WITH US</Text></View>
                <TouchableOpacity onPress={() => nativeLink('email',{email:contactInfo?.email1})} style={{flexDirection:'row',marginTop:15,borderBottomColor:'#757575',borderBottomWidth:0.5,padding:10,marginBottom:10}}>
                    <View style={{flex:1}}><Feather name='mail' color='#757575' size={34} /></View>
                    <View style={{alignItems:'center',alignContent:'center',justifyContent:'center'}}><Text style={{fontFamily:fontLight}}>{contactInfo?.email1}</Text></View>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => nativeLink('email',{email:contactInfo?.email2})} style={{flexDirection:'row',marginTop:15,borderBottomColor:'#757575',borderBottomWidth:0.5,padding:10,marginBottom:10}}>
                    <View style={{flex:1}}><Feather name='mail' color='#757575' size={34} /></View>
                    <View style={{alignItems:'center',alignContent:'center',justifyContent:'center'}}><Text style={{fontFamily:fontLight}}>{contactInfo?.email2}</Text></View>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => nativeLink('email',{email:contactInfo?.email3})} style={{flexDirection:'row',marginTop:15,borderBottomColor:'#757575',borderBottomWidth:0.5,padding:10,marginBottom:10}}>
                    <View style={{flex:1}}><Feather name='mail' color='#757575' size={34} /></View>
                    <View style={{alignItems:'center',alignContent:'center',justifyContent:'center'}}><Text style={{fontFamily:fontLight}}>{contactInfo?.email3}</Text></View>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => nativeLink('call',{phoneNumber:contactInfo?.tel})} style={{flexDirection:'row',marginTop:15,borderBottomColor:'#757575',borderBottomWidth:0.5,padding:10,marginBottom:10}}>
                    <View style={{flex:1}}><Feather name='phone' color='#757575' size={34} /></View>
                    <View style={{alignItems:'center',alignContent:'center',justifyContent:'center'}}><Text style={{fontFamily:fontBold}}>{contactInfo?.tel}</Text></View>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => Linking.openURL('whatsapp://send?text=Hello there, I need help&phone='+contactInfo?.whatsapp)} style={{flexDirection:'row',marginTop:15,borderBottomColor:'#757575',borderBottomWidth:0.5,padding:10,marginBottom:10}}>
                    <View style={{flex:1}}><FontAwesome name='whatsapp' color='green' size={34} /></View>
                    <View style={{alignItems:'center',alignContent:'center',justifyContent:'center'}}><Text style={{fontFamily:fontBold}}>{contactInfo?.whatsapp}</Text></View>
                </TouchableOpacity>
                <TouchableOpacity style={{flexDirection:'row',marginTop:15,borderBottomColor:'#757575',borderBottomWidth:0.5,padding:10,marginBottom:10}}>
                    <View style={{padding:3}}><MaterialIcons name='location-pin' color='#757575' size={34} /></View>
                    <View style={{alignItems:'center',alignContent:'center',justifyContent:'center',flex:1}}><Text style={{fontFamily:fontLight}}>{contactInfo?.address}</Text></View>
                </TouchableOpacity>
            </View>
        </View>
    )
};
export default Contact;
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
        padding:10
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