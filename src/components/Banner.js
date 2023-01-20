import React, { memo,useContext,useEffect,useState } from 'react'
import { View,TouchableOpacity,Text, ScrollView, Image, Platform } from 'react-native'
import { AppContext } from '../context/AppContext'
import * as Animatable from 'react-native-animatable';
import { ActivityIndicator } from 'react-native-paper';
import { MaterialCommunityIcons, FontAwesome, MaterialIcons, Ionicons} from "@expo/vector-icons";
import { getDocuments } from '../context/Api';
import Pdf from 'react-native-pdf';
import { LinearGradient } from 'expo-linear-gradient';
const Banner = memo(({navigation}) => {
    const {appState:{
        fontFamilyObj:{fontBold,fontLight},
    }} = useContext(AppContext);
    return (
        <View>
            <LinearGradient colors={["#A7E7AD","#14678B","#fff","#BED0D8"]} start={{ x: 0, y: 1 }} end={{ x: 1, y: 0 }} style={{height:120,alignItems:'center',justifyContent:'center',padding:10,borderTopLeftRadius:5,borderTopRightRadius:30,marginTop:10}}>  
                <Animatable.View animation="slideInRight" duration={750} useNativeDriver={true} style={{marginTop:10,paddingBottom:15}}>
                    <Text style={{fontFamily:fontBold,color:'orange',fontSize:12}}>Would You Like Help In Any Of The Below? </Text>
                    <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{marginTop:10}}>
                        <TouchableOpacity onPress={() => navigation.navigate("RequestApp",{type:"WEB APP DEVELOPMENT",summary:""})} style={{borderRadius:10,padding:10,borderColor:'green',borderWidth:1,flexDirection:'row',backgroundColor:'green'}}>
                            <MaterialIcons name='public' size={24} color="orange" />
                            <View style={{marginLeft:10,justifyContent:'center'}}>
                                <Text style={{fontFamily:fontBold,color:'white',fontSize:11}}>WEB APP DEVELOPMENT</Text>
                            </View>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => navigation.navigate("RequestApp",{type:"MOBILE APP DEVELOPMENT",summary:""})}  style={{borderRadius:10,padding:10,borderColor:'green',borderWidth:1,flexDirection:'row',marginLeft:10,backgroundColor:'green'}}>
                            <FontAwesome name='mobile' size={24} color="orange" />
                            <View style={{marginLeft:10,justifyContent:'center'}}>
                                <Text style={{fontFamily:fontBold,color:'white',fontSize:11}}>MOBILE APP DEVELOPMENT</Text>
                            </View>
                        </TouchableOpacity>
                    </ScrollView>
                </Animatable.View>
            </LinearGradient>
        </View>
    )
})

export default Banner