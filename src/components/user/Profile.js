import React, { memo, useContext, useEffect, useState } from 'react'
import { View, Text, TouchableOpacity, Image, Platform } from 'react-native'
import { AppContext } from '../../context/AppContext'
import * as Animatable from 'react-native-animatable';
import { Feather, FontAwesome, MaterialIcons } from "@expo/vector-icons";
import LuckyProjects from '../LuckyProjects';
import Products from '../Documents';
import { getMyProjects } from '../../context/Api';
const Profile = memo(({navigation}) => {
  const {appState:{accountInfo,myProjects,loadAIDocs,loadSignatures,logout,setConfirmDialog,fontFamilyObj:{fontBold,fontLight}}} = useContext(AppContext);
  const {documents,signatures} = accountInfo;
  return (
    <View style={{marginTop:15}}>
      <View style={{flexDirection:'row',marginTop:10,justifyContent:'space-between'}}>
          <TouchableOpacity onPress={() => loadSignatures(navigation)} style={{borderRadius:10,padding:10,backgroundColor:'#fff',width:'48%',alignItems:'center',borderWidth:2,borderColor:'#F4B55A'}}>
              <MaterialIcons name='qr-code-scanner' size={48} color={"#F4B55A"} />
              <View style={{marginLeft:10,justifyContent:'center'}}>
                  <Text style={{fontFamily:fontBold,color:'#14678B',fontSize:11,textAlign:'center'}}>({signatures}) BIO-METRIC SIGNATURES</Text>
              </View>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => loadAIDocs(navigation)}  style={{borderRadius:10,padding:10,backgroundColor:'#fff',width:'48%',alignItems:'center',borderWidth:2,borderColor:'#F4B55A'}}>
              <FontAwesome name='file-o' size={48} color={"#F4B55A"} />
              <View style={{marginLeft:10,justifyContent:'center'}}>
                  <Text style={{fontFamily:fontBold,color:'#14678B',fontSize:11,textAlign:'center'}}>({documents}) AI DOCUMENT GENERATOR</Text>
              </View>
          </TouchableOpacity>
      </View>
      <Animatable.View animation="slideInRight" duration={750} useNativeDriver={true}>
        {myProjects?.length > 0 && 
          <View style={{backgroundColor:'#F4B55A',flexDirection:'row',borderRadius:5,marginTop:10,marginBottom:20,padding:10}}>
            <Feather name='pen-tool' size={24} color='#fff' />
            <Text style={{fontFamily:fontBold,color:'#41444B',fontSize:11,color:'#fff',marginLeft:10,marginTop:4}}>MY PROJECTS</Text>
          </View>
        }
        <LuckyProjects navigation={navigation} data={myProjects} />
      </Animatable.View>
      <Animatable.View animation="slideInRight" duration={750} useNativeDriver={true}>
        <View style={{backgroundColor:'#F4B55A',flexDirection:'row',borderRadius:5,marginBottom:20,padding:10}}>
          <Feather name='pen-tool' size={24} color='#fff' />
          <Text style={{fontFamily:fontBold,color:'#41444B',fontSize:11,color:'#fff',marginLeft:10,marginTop:4}}>MY DOCUMENTS</Text>
        </View>
        <Products navigation={navigation} data={myProjects} />
        <TouchableOpacity onPress={()=>{
            setConfirmDialog({isVisible:true,text:`Would you like to logout? Your phone number and password may be required the next time you sign in.`,okayBtn:'NOT NOW',cancelBtn:'LOGOUT',response:(res) => { 
              if(!res){
                logout();
              }
            }})
          }} style={{alignContent:'center',alignItems:'center'}}>
          <Feather name='lock' size={48} color="tomato" />
        </TouchableOpacity>
      </Animatable.View>
    </View>
  )
})

export default Profile