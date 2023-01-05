import { createStackNavigator } from '@react-navigation/stack';
import React, {useState,useContext } from "react";
import { StyleSheet, View, Dimensions ,Image,ScrollView, Platform,TouchableOpacity,Text,TextInput, AppState} from "react-native";
import {MaterialCommunityIcons,AntDesign,Feather,Ionicons, FontAwesome } from "@expo/vector-icons";
import { Col, Row, Grid } from 'react-native-easy-grid';
import { LinearGradient } from 'expo-linear-gradient';
import { AppContext } from '../context/AppContext';
const RootStack = createStackNavigator();
const Cart = ({navigation}) =>{
    const {appState:{fontFamilyObj}} = useContext(AppContext);
    return(
        <RootStack.Navigator screenOptions={{headerStyle: {elevation: 1,shadowOpacity: 0,backgroundColor: "#fff",borderBottomWidth: 0},headerTintColor: "#fff",headerTitleStyle: { fontWeight: "bold" }}}>
        <RootStack.Screen name="AddItemScreen" component={PageContent} options={{
            headerLeft: () => (
                <Feather.Button backgroundColor="#fff" name="arrow-left-circle" size={28} color="#757575" onPress={()=>{navigation.goBack()}}></Feather.Button>
            ), 
            title: "YOUR CART",
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
    const {appState:{cart,accountInfo,setCart,fontFamilyObj:{fontBold,fontLight}} } = useContext(AppContext);
    const handleQuantity = (status,productId) => setCart(cart.map(item => item.productId === productId ? {...item,quantity : status === 'add' ? item.quantity + 1 : (item.quantity > 1 ? item.quantity - 1 : 1)} : item));
    React.useEffect(() => {

    },[])
    return(
        <View style={styles.container}>
            <LinearGradient colors={["#fff","#fff","#fff","#f1f7fa"]} style={{flex:1,paddingTop:10,borderRadius:10}}>
                <ScrollView style={{padding:10}}>
                    <TouchableOpacity style={{flexDirection:'row',borderWidth:1,padding:10,borderColor:'#757575',borderRadius:20,marginBottom:20}}>
                        <View style={{flex:1}}>
                            <MaterialCommunityIcons name='cart-heart' size={30} color="#757575"></MaterialCommunityIcons>
                        </View>
                        <View style={{alignContent:'center',alignItems:'center',justifyContent:'center'}}>
                        <Text style={{fontFamily:fontBold,fontSize:18,color:'green'}}>ZAR {cart.length > 0 ? (cart.reduce((total, obj) => (parseFloat(obj.price) * parseFloat(obj.quantity)) + total,0)).toFixed(2) : '0.00'}</Text>
                        </View>
                    </TouchableOpacity>
                    {cart?.map(({productUrl,price,quantity,productName,productId},i) => {
                        return(
                            <View key={i} style={{height:100,alignItems:'center',backgroundColor:'rgba(0, 0, 0, 0.1)',marginBottom:5,justifyContent:'center',padding:10,borderRadius:5,flexDirection:'row'}}>
                                <View style={{flex:1,justifyContent:'center',alignContent:'center',alignItems:'center'}}>
                                    <View style={{height:80,width:80,borderRadius:10,backgroundColor:'#fff',justifyContent:'center',alignItems:'center'}}>
                                    <Image source={{uri:productUrl}} style={{height:75,width:75,borderRadius:10}}/>
                                    </View>
                                </View>
                                <View style={{flex:3,marginLeft:10}}>
                                    <Text style={{color:'#14678B',fontFamily:fontBold}}>{productName}</Text>
                                    <Text style={{color:'#6B8597',fontFamily:Platform.OS === 'ios' ? fontBold : fontLight}}>Price (ZAR {parseFloat(price).toFixed(2)}) ({quantity})</Text>
                                    <View style={{flexDirection:'row'}}>
                                        <TouchableOpacity onPress={()=> handleQuantity('add',productId)}>
                                            <Ionicons name='ios-add-circle-outline' size={33} color='green'></Ionicons>
                                        </TouchableOpacity>
                                        <TouchableOpacity onPress={()=> handleQuantity('minus',productId)} style={{alignContent:'center',alignItems:'center',justifyContent:'center',flex:1.8}}>
                                            <AntDesign name='minuscircleo' size={26} color='tomato' />
                                        </TouchableOpacity>
                                    </View>
                                </View>
                                <TouchableOpacity onPress={()=>{
                                    setCart(cart.filter(item => item.productId !== productId))
                                }}>
                                    <AntDesign name="delete" size={30} color="tomato"/>
                                </TouchableOpacity>
                            </View>
                        )
                    })}
                    {cart.length > 0 && <View style={{alignItems:'center',marginTop:30}}>
                        <TouchableOpacity onPress={()=>{
                            if(accountInfo){
                                navigation.navigate("DeliveryInfo");
                            }else{
                                navigation.navigate("Register");
                            }
                        }}>
                            <FontAwesome name='check-circle' size={120} color="green"></FontAwesome>
                        </TouchableOpacity>
                    </View>}
                    {cart.length === 0 && (
                        <View style={{marginTop:200,alignContent:'center',alignItems:'center'}}>
                            <Text style={{fontFamily:fontBold}}>YOUR CART IS EMPTY</Text>
                            <MaterialCommunityIcons name='cart-off' size={120} color="#757575"></MaterialCommunityIcons>
                        </View>
                    )}
                </ScrollView>
            </LinearGradient>
        </View>
    )
};
export default Cart;
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