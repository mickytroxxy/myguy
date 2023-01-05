import React, {useContext,useState,useRef} from 'react';
import { StyleSheet, Text, View, TouchableOpacity, ScrollView } from 'react-native';
import * as Animatable from 'react-native-animatable';
import { LinearGradient } from 'expo-linear-gradient';
import { AppContext } from "../context/AppContext";
import { FontAwesome, AntDesign, Ionicons, MaterialCommunityIcons, FontAwesome5, MaterialIcons, Feather } from "@expo/vector-icons";
import Products from '../components/Products';
import Entry from '../components/user/Entry';
import { updateData } from '../context/Api';
import AddDocument from '../components/AddDocument';


export default function Home({navigation}) {
  const {appState:{
    fontFamilyObj:{fontBold,fontLight},
    setModalState,
    accountInfo,
    showToast,
    setConfirmDialog
  }} = useContext(AppContext);
  const [loginTypes,setLoginTypes] = useState([{btnType:'DOCUMENTS',selected:true},{btnType:'+ CREATE',selected:false},{btnType:'MY ACCOUNT',selected:false}]);
  const selectedComponent = loginTypes.filter(item => item.selected)[0].btnType;
  const claimItem = (itemId) =>{
    if(accountInfo){
      setConfirmDialog({isVisible:true,text:`Hi ${accountInfo.fname}, You are about to claim an item with the ID ${itemId}, Press claim to proceed`,okayBtn:'CLAIM',cancelBtn:'Cancel',response:(res) => { 
        if(res){
          if(updateData("productItems",itemId,{productOwner:accountInfo.id,purchaseDate:Date.now()})){
            showToast("Congrats, you now own the claimed item!")
          }else{
            showToast("Something went wrong while trying to claim your item!")
          }
        }
      }})
    }else{
      showToast("Please login or register first to claim")
    }
  }
  const scannedResults = (itemId) => setModalState({isVisible:true,attr:{headerText:'PRODUCT OWNER',itemId,claimItem}});
  return (
    <ScrollView style={{backgroundColor:'#e8e9f5'}} showsVerticalScrollIndicator={false}>
      <View style={{padding:10,flex:1,backgroundColor:'#e8e9f5'}}>
        <TouchableOpacity onPress={()=>{
          navigation.navigate("Scanner",{scannedResults})
          //scannedResults('https://qr.link/ffhlsy')
          //scannedResults('AD170930917')
        }}>
          <LinearGradient colors={["#BED0D8","#14678B","#5586cc","#EFEFEF"]} start={{ x: 0, y: 1 }} end={{ x: 1, y: 0 }} style={{height:120,alignItems:'center',justifyContent:'center',padding:15,borderTopLeftRadius:50,borderBottomRightRadius:50}}>  
            <Animatable.View animation="bounceIn" duration={1500} useNativeDriver={true} style={{width:'100%',flexDirection:'row'}}>
              <MaterialIcons name='qr-code-scanner' color={"#fff"} size={60} style={{flex:1}}></MaterialIcons>
              <View style={{paddingLeft:15,paddingRight:15,backgroundColor:'rgba(0, 0, 0, 0.1)',borderRadius:15,justifyContent:'center',borderBottomRightRadius:50}}>
                <Text style={{color:'#fff',fontFamily:fontBold}}>SCAN DOCUMENT</Text>
              </View>
            </Animatable.View>
          </LinearGradient>
        </TouchableOpacity>
        <View style={{backgroundColor:'#fff',height:60,marginTop:15,borderRadius:30,padding:3,flexDirection:'row'}}>
          {loginTypes.map((btn,i) =>(
            <TouchableOpacity key={i} style={{flex:1,alignContent:'center',alignItems:'center',justifyContent:'center',backgroundColor:btn.selected ? '#14678B' : '#fff',borderRadius:30,padding:5}} onPress={() => setLoginTypes(loginTypes.map(item => item.btnType === btn.btnType ? {...item,selected:true} : {...item,selected:false}))}>
              <Text style={{fontFamily: btn.selected ? fontBold : fontLight,color:btn.selected ? '#fff' : '#757575',fontSize:11}}>{btn.btnType}</Text>
            </TouchableOpacity>
          ))}
        </View>
        {selectedComponent === 'DOCUMENTS' && <Products navigation={navigation} />}
        {selectedComponent === 'MY ACCOUNT' && <Entry navigation={navigation}/>}
        {selectedComponent === '+ CREATE' && <AddDocument navigation={navigation}/>}
      </View>
    </ScrollView>
  );
}