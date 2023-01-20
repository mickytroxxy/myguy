import 'react-native-gesture-handler';
import { Text, View, ScrollView,TouchableOpacity,Platform } from 'react-native';
import * as Animatable from 'react-native-animatable';
import { FontAwesome } from "@expo/vector-icons";
import React from "react";
import { LinearGradient } from 'expo-linear-gradient';
import { styles } from '../../styles';
export const RequestBtns = ({data})=>{
    const {accountInfo,activeProfile,fontBold,fontLight,profileOwner,page} = data;
    const services = activeProfile.services;
    const get_gradient = i => !(i % 2) ? ["#e44528","#d6a8e7","#f3bf4f"] : ["#92e6f5","#c792f5"];
    return(
        <Animatable.View animation="slideInLeft" duration={1000} useNativeDriver={true}>
            <ScrollView horizontal={true} showsHorizontalScrollIndicator={false} style={{padding:10,paddingRight:20}}>
                {services.map((item,i) => 
                    <View style={styles.actionViewBtnContainer} key={item.type + i}>
                        <LinearGradient colors={get_gradient(i)} start={{ x: 0, y: 1 }} end={{ x: 1, y: 0 }} style={[styles.actionViewBtn]}>
                            <TouchableOpacity style={{alignContent:'center',alignItems:'center',justifyContent:'center',flex:1}} onPress={() => {}}>
                            <Text style={{fontFamily:fontBold,fontSize:12,color:'#fff'}}>R {parseFloat(item.fees[0].fee).toFixed(2)}</Text>
                                <FontAwesome name="heart" color="tomato" size={30}></FontAwesome>
                                <Text style={{fontFamily:fontBold,fontSize:10,color:'#fff'}}>{item.type}</Text>
                            </TouchableOpacity>
                        </LinearGradient>
                    </View>
                )}
            </ScrollView>
        </Animatable.View>
    )
}