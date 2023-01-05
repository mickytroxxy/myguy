import React, { memo, useContext, useState } from 'react'
import { View, Text, TouchableOpacity, Image, Platform } from 'react-native'
import { AppContext } from '../../context/AppContext'
import * as Animatable from 'react-native-animatable';
import { LinearGradient } from 'expo-linear-gradient';
import moment from 'moment';
import { AntDesign, EvilIcons, Feather } from "@expo/vector-icons";
import { getMyProducts,getScans,updateData,uploadFile } from '../../context/Api';
const Profile = memo(() => {
  const {appState:{accountInfo,saveUser,logout,setConfirmDialog,pickImage,takePicture,nativeLink,fontFamilyObj:{fontBold,fontLight}}} = useContext(AppContext);
  const [indicators,setIndicators] = useState([
    {status:"ALL",selected:true},
    {status:"RECEIVED",selected:false},
    {status:"SHIPPING",selected:false},
    {status:"STOLEN",selected:false}
  ])
  const selectedIndicator = indicators.filter(item => item.selected)[0].status;
  const {fname,avatar,id,phoneNumber} = accountInfo;
  const [userProducts,setUserProducts] = useState(null);
  const [showMyScans,setShowMyScans] = useState(false);
  const [scannedItems,setScannedItems] = useState(null);
  React.useEffect(() => {
    getMyProducts(id.toUpperCase(),(response) => response.length > 0 && setUserProducts(response));
    getScans(id.toUpperCase(),(response) => response.length > 0 && setScannedItems(response))
  },[])
  return (
    <View style={{marginTop:15}}>
      <Animatable.View animation="slideInRight" duration={750} useNativeDriver={true}>
        <LinearGradient colors={["#6B8597","rgba(0, 0, 0, 0.1)","rgba(0, 0, 0, 0.1)","rgba(0, 0, 0, 0.1)"]} start={{ x: 0, y: 1 }} end={{ x: 1, y: 0 }} style={{height:150,alignItems:'center',backgroundColor:'rgba(0, 0, 0, 0.2)',justifyContent:'center',padding:15,borderTopRightRadius:30,borderTopLeftRadius:30,justifyContent:'center',flexDirection:'row'}}>
          <View style={{flex:1}}>
            <View style={{height:100,width:100,borderRadius:100,backgroundColor:'#fff',justifyContent:'center',alignItems:'center'}}>
              {avatar ? <Image source={{uri:avatar}} style={{height:90,width:90,borderRadius:100}}/> : <EvilIcons name='user' size={90} color='#757575' />}
              <TouchableOpacity style={{position:'absolute',right:0,bottom:0,backgroundColor:'#14678B',borderRadius:100,width:40,height:40,alignItems:'center',justifyContent:'center',alignContent:'center'}} onPress={() => {
                setConfirmDialog({isVisible:true,text:`Choose your avatar source, Press camera to snap one now or choose from your gallery!`,okayBtn:'GALLERY',cancelBtn:'CAMERA',response:(res) => { 
                  if(res){
                    pickImage('avatar',(file)=>{
                      uploadFile(file,`avatar/${id}`,avatar =>{
                        const obj = {...accountInfo,avatar};
                        if(updateData("clients",id,obj)){
                          saveUser(obj)
                        }
                      })
                    })
                  }else{
                    takePicture('avatar',(file)=>{
                      uploadFile(file,`avatar/${id}`,avatar =>{
                        const obj = {...accountInfo,avatar};
                        if(updateData("clients",id,obj)){
                          saveUser(obj)
                        }
                      })
                    })
                  }
                }})
              }}><AntDesign name='edit' size={20} color='#fff'/></TouchableOpacity>
            </View>
          </View>
          <View>
            <Text style={{color:'#14678B',fontFamily:fontBold}}>{fname.toUpperCase()}</Text>
            <Text style={{color:'#fff',fontFamily:Platform.OS === 'ios' ? fontBold : fontLight}}>{phoneNumber}</Text>
            <Text style={{color:'#fff',fontFamily:Platform.OS === 'ios' ? fontBold : fontLight}}>{id}</Text>
          </View>
          <TouchableOpacity style={{position:'absolute',bottom:6,right:50,borderWidth:0.6,padding:5,borderRadius:10,borderColor:'#e7e6e8'}} onPress={()=>{
            setShowMyScans(!showMyScans)
          }}>
            <Text style={{fontFamily:fontLight,color:'#14678B'}}>{!showMyScans ? 'SHOW MY SCANS' : 'SHOW MY ITEMS'}</Text>
          </TouchableOpacity>
          <TouchableOpacity style={{position:'absolute',bottom:5,right:5}} onPress={()=>{
            setConfirmDialog({isVisible:true,text:`Would you like to logout? Your phone number and password may be required the next time you sign in.`,okayBtn:'NOT NOW',cancelBtn:'LOGOUT',response:(res) => { 
              if(!res){
                logout();
              }
            }})
          }}>
            <Feather name="lock" size={36} color="tomato"></Feather>
          </TouchableOpacity>
        </LinearGradient>
      </Animatable.View>
      <Animatable.View animation="fadeInUpBig" duration={750} useNativeDriver={true} style={{flexDirection:'row',marginTop:5,backgroundColor:'rgba(0, 0, 0, 0.1)',padding:6,borderBottomRightRadius:5,borderBottomLeftRadius:5}}>
        {indicators.map(({status,selected},i) =>(
          <TouchableOpacity key={i} style={{flex:1,alignContent:'center',alignItems:'center',justifyContent:'center',backgroundColor:selected ? 'rgba(0, 0, 0, 0.1)' : 'transparent',borderBottomRightRadius:5,borderBottomLeftRadius:5,padding:5}} 
            onPress={() => {
              setIndicators(indicators.map(item => item.status === status ? {...item,selected:true} : {...item,selected:false}))
            }}>
            {status === "RECEIVED" && <AntDesign name='checkcircleo' size={24} color={selected ? "#fff" : "green"}/>}
            {status === "SHIPPING" && <AntDesign name='clockcircleo' size={24} color={selected ? "#fff" : "orange"}/>}
            {status === "STOLEN" && <AntDesign name="minuscircleo" size={24} color={selected ? "#fff" : "tomato"}/>}
            {status === "ALL" && <Feather name='list' size={24} color={selected ? "#fff" : "#14678B"}/>}
            <Text style={{fontFamily:Platform.OS === 'ios' ? fontBold : fontLight,color:selected ? '#fff' : '#757575',fontSize:11}}>{status}</Text>
          </TouchableOpacity>
        ))}
      </Animatable.View>

      <Animatable.View style={{marginTop:10}} animation="fadeInUpBig" duration={1000} useNativeDriver={true}> 
        {!showMyScans && userProducts?.map((mainCart) => {
          return mainCart.cart.map((item,i) => {
            const {category,productUrl,price,brandName,status} = item
              if(status === selectedIndicator || selectedIndicator === 'ALL'){
                return(
                  <TouchableOpacity key={i} style={{height:100,alignItems:'center',backgroundColor:'rgba(0, 0, 0, 0.1)',marginBottom:5,justifyContent:'center',padding:10,borderRadius:5,flexDirection:'row'}}>
                    <View style={{flex:1,justifyContent:'center',alignContent:'center',alignItems:'center'}}>
                      <View style={{height:80,width:80,borderRadius:10,backgroundColor:'#fff',justifyContent:'center',alignItems:'center'}}>
                        <Image source={{uri:productUrl}} style={{height:75,width:75,borderRadius:10}}/>
                      </View>
                    </View>
                    <View style={{flex:3,marginLeft:10}}>
                      <Text style={{color:'#14678B',fontFamily:fontBold}}>{brandName?.toUpperCase()} {category}</Text>
                      <Text style={{color:'#6B8597',fontFamily:Platform.OS === 'ios' ? fontBold : fontLight}}>Price (ZAR {parseFloat(price).toFixed(2)})</Text>
                      <Text style={{color:'#6B8597',fontFamily:Platform.OS === 'ios' ? fontBold : fontLight}}>{moment(mainCart.date).format("YYYY-MM-DD")}</Text>
                    </View>
                    {status === "RECEIVED" && <AntDesign name='checkcircleo' size={30} color="green"/>}
                    {status === "SHIPPING" && <AntDesign name='clockcircleo' size={30} color="orange"/>}
                    {status === "STOLEN" && <AntDesign name="minuscircleo" size={30} color="tomato"/>}
                  </TouchableOpacity>
                )
              }
          })
        })}
        {showMyScans && scannedItems?.map((item,i) => {
          const {avatar,scanDate,phoneNumber,fname,scanLocation,productName,productUrl} = item;
          const {latitude:lat,longitude:lng} = scanLocation;
          return(
            <TouchableOpacity onPress={()=>nativeLink('map',{lat,lng,label:fname})} key={i} style={{height:100,alignItems:'center',backgroundColor:'rgba(0, 0, 0, 0.1)',marginBottom:5,justifyContent:'center',padding:10,borderRadius:5,flexDirection:'row'}}>
              <View style={{flex:1,justifyContent:'center',alignContent:'center',alignItems:'center'}}>
                <View style={{height:80,width:80,borderRadius:10,backgroundColor:'#fff',justifyContent:'center',alignItems:'center'}}>
                  {avatar ? <Image source={{uri:avatar}} style={{height:75,width:75,borderRadius:10}}/> : <EvilIcons name='user' size={90} color='#757575' />}
                </View>
              </View>
              <View style={{flex:3,marginLeft:15}}>
                <Text style={{color:'#14678B',fontFamily:fontBold}}>{fname}</Text>
                <Text style={{color:'#6B8597',fontFamily:Platform.OS === 'ios' ? fontBold : fontLight}}>{phoneNumber}</Text>
                <Text style={{color:'#6B8597',fontFamily:Platform.OS === 'ios' ? fontBold : fontLight}}>{moment(scanDate).format("YYYY-MM-DD")}</Text>
                <Text style={{color:'#6B8597',fontFamily:Platform.OS === 'ios' ? fontBold : fontLight}} numberOfLines={1}>{productName}</Text>
              </View>
              <View style={{height:60,width:60,borderRadius:10,backgroundColor:'#fff',justifyContent:'center',alignItems:'center'}}>
                  <Image source={{uri:productUrl}} style={{height:55,width:55,borderRadius:10}}/>
                </View>
            </TouchableOpacity>
          )
        })}
      </Animatable.View>
    </View>
  )
})

export default Profile