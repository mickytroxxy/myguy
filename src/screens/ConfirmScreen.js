import { createStackNavigator } from '@react-navigation/stack';
import React, {useState,useContext } from "react";
import { StyleSheet, View, Dimensions ,Image,ScrollView, Platform,TouchableOpacity,Text,TextInput, AppState} from "react-native";
import {MaterialCommunityIcons,AntDesign,Feather,Ionicons, FontAwesome } from "@expo/vector-icons";
import { Col, Row, Grid } from 'react-native-easy-grid';
import { LinearGradient } from 'expo-linear-gradient';
import { AppContext } from '../context/AppContext';
import AisInput from '../components/forms/AisInput';
import { createData, getUserDetailsByPhone, updateData } from '../context/Api';
let obj;
const RootStack = createStackNavigator();
const ConfirmScreen = ({navigation,route}) =>{
    const {appState:{fontFamilyObj}} = useContext(AppContext);
    obj = route.params;
    return(
        <RootStack.Navigator screenOptions={{headerStyle: {elevation: 1,shadowOpacity: 0,backgroundColor: "#fff",borderBottomWidth: 0},headerTintColor: "#fff",headerTitleStyle: { fontWeight: "bold" }}}>
        <RootStack.Screen name="AddItemScreen" component={PageContent} options={{
            headerLeft: () => (
                <Feather.Button backgroundColor="#fff" name="arrow-left-circle" size={28} color="#757575" onPress={()=>{navigation.goBack()}}></Feather.Button>
            ), 
            title: "CONFIRMATION SCREEN",
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
const PageContent = ({navigation,route}) =>{
    const {appState:{saveUser,fontFamilyObj:{fontBold,fontLight},showToast,cart} } = useContext(AppContext);
    const [confirmationCode,setConfirmationCode] = useState('');
    const confirm = () =>{
        if(confirmationCode.toString() === obj.code.toString()){
            const phoneNumber = obj.phoneNumber;
            const id = obj.fname.toUpperCase().slice(0,2) + Math.floor(Math.random()*8999999+1000009).toString();
            obj = {...obj,id}
            getUserDetailsByPhone(phoneNumber,(response) => {
                if(response.length === 0){
                    if(createData("clients",id,obj)){
                        saveUser(obj);
                        if(cart.length > 0){
                          navigation.navigate("DeliveryInfo");
                        }else{
                          navigation.goBack();
                          navigation.goBack();
                        }
                    }
                }else{
                    const client = response[0]
                    const newObj = {...obj,id:client.id,avatar:client.avatar}
                    updateData("clients",client.id,newObj)
                    saveUser(newObj);
                    if(cart.length > 0){
                        navigation.navigate("DeliveryInfo");
                    }else{
                        navigation.goBack();
                        navigation.goBack();
                    }
                }
            })
        }else{
            showToast("Invalid confirmation code!");
        }
    }
    return(
        <View style={styles.container}>
            <LinearGradient colors={["#fff","#fff","#fff","#f1f7fa"]} style={{flex:1,paddingTop:10,borderRadius:10,alignContent:'center',alignItems:'center',justifyContent:'center',padding:20}}>
                <Text style={{fontFamily:fontLight,marginBottom:15,textAlign:'center'}}>We have sent the confirmation code to {obj.phoneNumber}!</Text>
                <AisInput attr={{field:'search',icon:{name:'list',type:'Ionicons',min:5,color:'#5586cc'},keyboardType:null,placeholder:'Enter Confirmation Code',color:'#009387',handleChange:(field,value)=>{
                    setConfirmationCode(value)
                }}} />
                <View style={{alignItems:'center',marginTop:15}}>
                    <TouchableOpacity onPress={confirm}>
                        <FontAwesome name='check-circle' size={120} color="#14678B"></FontAwesome>
                    </TouchableOpacity>
                </View>
            </LinearGradient>
        </View>
    )
};
export default ConfirmScreen;
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
        backgroundColor: "blue",
        marginTop:5,
        borderRadius:10,
        elevation:5
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