import React, { memo, useContext, useState } from 'react'
import { View, TouchableOpacity, Text, Image, Platform, ActivityIndicator } from 'react-native'
import { AppContext } from '../../context/AppContext';
import { AntDesign, Ionicons, FontAwesome, EvilIcons} from "@expo/vector-icons";
import * as Animatable from 'react-native-animatable';
import { LinearGradient } from 'expo-linear-gradient';
import { createData, getUserDetails, verifyItem } from '../../context/Api';
import moment from 'moment';
const ProductOwner = memo((props) => {
    const {itemId,claimItem} = props.attr;
    const {appState:{
        fontFamilyObj:{fontBold,fontLight},
        setModalState,
        checkGuestScan,
        showToast,
        saveScan,
        accountInfo,
        getLocation
    }} = useContext(AppContext);
    const [item,setItem] = useState(null)
    React.useEffect(() => {
        verifyItem(itemId,(response) => {
            if(response.length > 0){
                if(checkGuestScan() !== 'guestScan'){
                    if(response[0].productOwner){
                        getUserDetails(response[0].productOwner,(user) => {
                            if(user.length > 0){
                                setItem({...response[0],...user[0]});
                                saveScan((!checkGuestScan() && !accountInfo) ? 'guestScan' : accountInfo);
                                if(accountInfo){
                                    getLocation(({latitude,longitude}) => {
                                        const scanId = Math.floor(Math.random()*8999999+1000009).toString();
                                        createData("scans",scanId,{...accountInfo,scanId,productOwner:response[0].productOwner,scanLocation:{latitude,longitude},scanDate:Date.now(),productName:response[0].productName,productUrl:response[0].productUrl})
                                    })
                                }
                            }
                        })
                    }else{
                        setItem(response[0])
                    }
                }else{
                    showToast("To keep our community safe, Please create an account with us")
                }
            }else{
                setItem('NO RESULTS FOUND')
            }
        })
    },[])
    return (
        <View style={{padding:10}}>
            {(item?.itemId && item?.fname) && 
                <Animatable.View animation="fadeInUpBig" duration={750} useNativeDriver={true}>
                    <LinearGradient colors={["#6B8597","rgba(0, 0, 0, 0.1)","rgba(0, 0, 0, 0.1)","rgba(0, 0, 0, 0.1)"]} start={{ x: 0, y: 1 }} end={{ x: 1, y: 0 }} style={{height:120,alignItems:'center',backgroundColor:'rgba(0, 0, 0, 0.2)',justifyContent:'center',padding:15,borderTopRightRadius:30,borderTopLeftRadius:30,justifyContent:'center',flexDirection:'row'}}>
                        <View style={{flex:1}}>
                            <View style={{height:100,width:100,borderRadius:100,backgroundColor:'#fff',justifyContent:'center',alignItems:'center'}}>
                                {item.avatar ? <Image source={{uri:item.avatar}} style={{height:90,width:90,borderRadius:100}}/> : <EvilIcons name='user' size={90} color='#757575' />}
                            </View>
                        </View>
                        <View>
                            <Text style={{color:'#14678B',fontFamily:fontBold}}>{item.fname.toUpperCase()}</Text>
                            <Text style={{color:'#fff',fontFamily:Platform.OS === 'ios' ? fontBold : fontLight}}>{item.phoneNumber}</Text>
                            <Text style={{color:'#fff',fontFamily:Platform.OS === 'ios' ? fontBold : fontLight}}>{moment(item.purchaseDate).format("YYYY-MM-DD")}</Text>
                        </View>
                    </LinearGradient>
                    <View style={{marginTop:20,flexDirection:'row'}}>
                        <Ionicons name='ios-location-outline' size={24} color='#757575'></Ionicons>
                        <Text style={{fontFamily:fontLight,marginLeft:10,fontSize:Platform.OS === 'android' ? 12 : 14,marginTop:5}}>{item.address.text}</Text>
                    </View>
                    <View style={{marginTop:20,flexDirection:'row'}}>
                        <Text style={{fontFamily:fontBold,flex:1,fontSize:Platform.OS === 'android' ? 9 : 13}}>BRAND NAME</Text>
                        <Text style={{fontFamily:fontLight,marginLeft:10,fontSize:Platform.OS === 'android' ? 12 : 14}}>{item.brandName}</Text>
                    </View>
                    <View style={{marginTop:20,flexDirection:'row'}}>
                        <Text style={{fontFamily:fontBold,flex:1,fontSize:Platform.OS === 'android' ? 9 : 13}}>PRODUCT NAME</Text>
                        <Text style={{fontFamily:fontLight,marginLeft:10,fontSize:Platform.OS === 'android' ? 12 : 14}}>{item.productName}</Text>
                    </View>
                    <View style={{marginTop:20,flexDirection:'row'}}>
                        <Text style={{fontFamily:fontBold,flex:1,fontSize:Platform.OS === 'android' ? 9 : 13}}>PURCHASE PRICE</Text>
                        <Text style={{fontFamily:fontLight,marginLeft:10,fontSize:Platform.OS === 'android' ? 12 : 14}}>ZAR {parseFloat(item.price).toFixed(2)}</Text>
                    </View>
                    <View style={{alignItems:'center',marginTop:30}}>
                        <TouchableOpacity onPress={()=>setModalState({isVisible:false})}>
                            <FontAwesome name='check-circle' size={120} color="green"></FontAwesome>
                        </TouchableOpacity>
                    </View>
                </Animatable.View>
            }
            {(item?.itemId && !item?.productOwner) && 
                <Animatable.View animation="slideInRight" duration={750} useNativeDriver={true}>
                    <View style={{marginTop:20,flexDirection:'row'}}>
                        <FontAwesome name='lightbulb-o' size={24} color='#757575'/>
                        <Text style={{fontFamily:fontLight,marginLeft:10,fontSize:Platform.OS === 'android' ? 12 : 14,color:'tomato'}}>This is a certified item but with no owner. Would you like to claim this item? Claim only if you have purchased this product!</Text>
                    </View>
                    <View style={{marginTop:20,flexDirection:'row'}}>
                        <Text style={{fontFamily:fontBold,flex:1,fontSize:Platform.OS === 'android' ? 9 : 13}}>BRAND NAME</Text>
                        <Text style={{fontFamily:fontLight,marginLeft:10,fontSize:Platform.OS === 'android' ? 12 : 14}}>{item.brandName}</Text>
                    </View>
                    <View style={{marginTop:20,flexDirection:'row'}}>
                        <Text style={{fontFamily:fontBold,flex:1,fontSize:Platform.OS === 'android' ? 9 : 13}}>PRODUCT NAME</Text>
                        <Text style={{fontFamily:fontLight,marginLeft:10,fontSize:Platform.OS === 'android' ? 12 : 14}}>{item.productName}</Text>
                    </View>
                    <View style={{marginTop:20,flexDirection:'row'}}>
                        <Text style={{fontFamily:fontBold,flex:1,fontSize:Platform.OS === 'android' ? 9 : 13}}>PURCHASE PRICE</Text>
                        <Text style={{fontFamily:fontLight,marginLeft:10,fontSize:Platform.OS === 'android' ? 12 : 14}}>ZAR {parseFloat(item.price).toFixed(2)}</Text>
                    </View>
                    <View style={{alignItems:'center',marginTop:30}}>
                        <TouchableOpacity style={{borderWidth:1,padding:30,borderRadius:10,borderColor:'tomato'}} onPress={()=>{
                            setModalState({isVisible:false});
                            claimItem(itemId)
                        }}>
                            <Text style={{fontFamily:fontBold,color:'orange'}}>CLAIM THE ITEM</Text>
                        </TouchableOpacity>
                    </View>
                </Animatable.View>
            }
            {item === "NO RESULTS FOUND" && 
                <View style={{justifyContent:'center',alignContent:'center',alignItems:'center',marginTop:30}}>
                    <AntDesign name='frowno' size={120} color="#757575" />
                    <Text style={{fontFamily:fontBold,textAlign:'center',marginTop:30}}>{item}</Text>
                </View>
            }
            {!item && 
                <View style={{flex:1,justifyContent:'center',alignContent:'center',alignItems:'center',marginTop:100}}>
                    <ActivityIndicator size='large' color='#757575'></ActivityIndicator>
                    <Text style={{fontFamily:fontBold,textAlign:'center',marginTop:30}}>Fetching item details...</Text>
                </View>
            }
        </View>
    )
})

export default ProductOwner