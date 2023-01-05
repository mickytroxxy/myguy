import { createStackNavigator } from '@react-navigation/stack';
import React, {useState,useContext } from "react";
import { StyleSheet, View, Dimensions ,Image,ScrollView, Platform,TouchableOpacity,Text,TextInput, AppState} from "react-native";
import {MaterialCommunityIcons,AntDesign,Feather,Ionicons, FontAwesome } from "@expo/vector-icons";
import { Col, Row, Grid } from 'react-native-easy-grid';
import { LinearGradient } from 'expo-linear-gradient';
import { AppContext } from '../context/AppContext';
import AisInput from '../components/forms/AisInput';
import Location from '../components/forms/Location';
import { createData } from '../context/Api';
const RootStack = createStackNavigator();
const DeliveryInfo = ({navigation}) =>{
    const {appState:{fontFamilyObj}} = useContext(AppContext);
    return(
        <RootStack.Navigator screenOptions={{headerStyle: {elevation: 1,shadowOpacity: 0,backgroundColor: "#fff",borderBottomWidth: 0},headerTintColor: "#fff",headerTitleStyle: { fontWeight: "bold" }}}>
        <RootStack.Screen name="AddItemScreen" component={PageContent} options={{
            headerLeft: () => (
                <Feather.Button backgroundColor="#fff" name="arrow-left-circle" size={28} color="#757575" onPress={()=>{navigation.goBack()}}></Feather.Button>
            ), 
            title: "DELIVERY INFO",
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
    const [formData,setFormData] = useState({phoneNumber:'',address:null,deliveryInfo:''});
    const [canEdit,setCanEdit] = useState({phoneNumber:false,address:false})
    const [paymentMethods,setPaymentMethods] = useState([{paymentMethod:'PAYFAST',selected:true},{paymentMethod:'CASH ON DELIVERY',selected:false}]);
    const paymentMethod = paymentMethods.filter(item => item.selected)[0].paymentMethod;
    const handleChange = (field,value) => setFormData(v =>({...v, [field] : value}));
    React.useEffect(() => {

    },[])
    const confirmDeliveryInfo = () =>{
        let address,phoneNumber;
        const accountId = accountInfo.id;
        const deliveryInfo = formData.deliveryInfo
        formData.phoneNumber !== '' ? phoneNumber = formData.phoneNumber : phoneNumber = accountInfo.phoneNumber;
        formData.address ? address = formData.address : address = accountInfo.address;
        setConfirmDialog({isVisible:true,text:`Do you confirm that ${phoneNumber} is your contact number and your delivery address is ${address.text}?`,okayBtn:'I CONFIRM',cancelBtn:'CANCEL',response:(res) => { 
            if(res){
                const id = Math.floor(Math.random()*8999999+1000009).toString();
                const obj = {accountId,phoneNumber,address,deliveryInfo,id,paymentMethod,date:Date.now(),cart}
                navigation.navigate("Payment",{id,obj})
            }
        }})
    }
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
                    <View style={{marginTop:20}}>
                        <View style={{borderBottomWidth:1,paddingBottom:15,borderBottomColor:'#D9D9DF'}}>
                            <Grid>
                                <Col size={0.1} style={{justifyContent:'center',alignContent:'center',alignItems:'center'}}>
                                    <Ionicons name='ios-location-outline' size={24} color='green'></Ionicons>
                                </Col>
                                <Col style={{justifyContent:'center',alignContent:'center',alignItems:'center'}}>
                                    <Text style={{fontFamily:fontLight,marginLeft:10,fontSize:Platform.OS === 'android' ? 12 : 14,marginTop:5}}>{accountInfo ? accountInfo.address.text : 'Edit Your Delivery Address'}</Text>
                                </Col>
                                <Col size={0.1} style={{justifyContent:'center',alignContent:'center',alignItems:'center'}}>
                                    <TouchableOpacity onPress={() => setCanEdit({...canEdit,address:!canEdit.address})}>
                                        <AntDesign name='edit' size={26} color='#5586cc'></AntDesign>
                                    </TouchableOpacity>
                                </Col>
                            </Grid>
                            {canEdit.address && <Location handleChange={handleChange} />}
                        </View>
                        <View style={{marginTop:20,borderBottomWidth:1,paddingBottom:15,borderBottomColor:'#D9D9DF'}}>
                            <Grid>
                                <Col size={0.1} style={{justifyContent:'center',alignContent:'center',alignItems:'center'}}>
                                    <Feather name='phone' size={24} color='green' />
                                </Col>
                                <Col style={{justifyContent:'center',alignContent:'center'}}>
                                    <Text style={{fontFamily:fontLight,marginLeft:10,fontSize:Platform.OS === 'android' ? 12 : 14,marginTop:5}}>{accountInfo ? accountInfo.phoneNumber : 'Change Your Phone Number'}</Text>
                                </Col>
                                <Col size={0.1} style={{justifyContent:'center',alignContent:'center',alignItems:'center'}}>
                                    <TouchableOpacity onPress={() => setCanEdit({...canEdit,phoneNumber:!canEdit.phoneNumber})}>
                                        <AntDesign name='edit' size={26} color='#5586cc'></AntDesign>
                                    </TouchableOpacity>
                                </Col>
                            </Grid>
                            {canEdit.phoneNumber && <AisInput attr={{field:'phoneNumber',icon:{name:'phone',type:'Feather',min:5,color:'#5586cc'},keyboardType:'phone-pad',placeholder:'Phone Number',color:'#009387',handleChange}} />}
                        </View>
                        <View style={{marginTop:20}}>
                            <AisInput attr={{field:'deliveryInfo',icon:{name:'list',type:'Feather',min:5,color:'#5586cc'},keyboardType:null,placeholder:'Delivery Instructions (optional)',color:'#009387',handleChange}} />
                        </View>
                        <View style={{marginTop:20}}>
                            <View style={{backgroundColor:'#E2E2E5',height:60,marginTop:15,borderRadius:30,padding:3,flexDirection:'row'}}>
                                {paymentMethods.map((btn,i) =>(
                                    <TouchableOpacity key={i} style={{flex:1,alignContent:'center',alignItems:'center',justifyContent:'center',backgroundColor:btn.selected ? '#14678B' : '#fff',borderRadius:30,padding:10,margin:3}} onPress={() => setPaymentMethods(paymentMethods.map(item => item.paymentMethod === btn.paymentMethod ? {...item,selected:true} : {...item,selected:false}))}>
                                        <Text style={{fontFamily: btn.selected ? fontBold : fontLight,color:btn.selected ? '#fff' : '#757575',fontSize:11}}>{btn.paymentMethod}</Text>
                                    </TouchableOpacity>
                                ))}
                            </View>
                        </View>
                        <View style={{alignItems:'center',marginTop:30}}>
                            <TouchableOpacity onPress={confirmDeliveryInfo}>
                                <FontAwesome name='check-circle' size={120} color="green"></FontAwesome>
                            </TouchableOpacity>
                        </View>
                    </View>
                </ScrollView>
            </LinearGradient>
        </View>
    )
};
export default DeliveryInfo;
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