import React, { memo,useContext,useEffect, useMemo } from 'react'
import { View,TouchableOpacity,Text, ScrollView, Image, Platform } from 'react-native'
import { AppContext } from '../context/AppContext'
import * as Animatable from 'react-native-animatable';
import { ProgressBar } from 'react-native-paper';
const LuckyProjects = memo(({navigation,data}) => {
    const {appState:{
        fontFamilyObj:{fontBold,fontLight},clients,getUserProfile
    }} = useContext(AppContext);
    return (
        <View>
            <Animatable.View animation="slideInLeft" duration={750} useNativeDriver={true} style={{flexDirection:'row',paddingBottom:15,marginTop:10}}>
                <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                {data?.map(({avatar,fname,funded,target,projectId,details,votes,funders,subCategory},i) => {
                    return(
                        <View key={i} style={{flex:1}}>
                            <TouchableOpacity style={{backgroundColor:'#fff',flex:1,marginRight:5,padding:5,borderRadius:10,width:220,borderWidth:0.5,borderColor:'#fff'}} onPress={() => {
                                getUserProfile(navigation,projectId)
                            }}>
                                
                                {avatar !== "" && <Image source={{uri:avatar}} resizeMode="cover" style={{width:'100%',height:130,borderRadius:10}} />}
                                {avatar === "" && <View style={{backgroundColor:'#14678B',width:'100%',height:130,borderRadius:10,justifyContent:'center',alignItems:'center'}}><Text style={{color:'#fff',fontFamily:fontBold}}>NO COMPANY LOGO</Text></View>}
                                <View>
                                    <Text numberOfLines={3} style={{fontFamily:fontLight,fontSize:11}}>{details[0].content}</Text>
                                </View>
                                <Text numberOfLines={1} style={{fontFamily:fontBold,color:'#757575',fontSize:Platform.OS === 'android' ? 11 : 12,marginTop:10,marginBottom:5}}>{subCategory} - {fname}</Text>
                                <ProgressBar progress={(funded / target * 100).toFixed(0) / 100}  color={"green"} />
                                <View style={{flexDirection:'row',marginTop:5}}>
                                    <View style={{flex:1}}><Text style={{fontFamily:fontBold,color:'#757575',fontSize:Platform.OS === 'android' ? 10 : 12}}>Target ZAR {target.toFixed(2)}</Text></View>
                                    <View><Text style={{fontFamily:fontBold,color:'green',fontSize:Platform.OS === 'android' ? 10 : 12}}>{(funded / target * 100).toFixed(0)}%</Text></View>
                                </View>
                            </TouchableOpacity>
                        </View>
                    )
                })}
                </ScrollView>
            </Animatable.View>
        </View>
    )
})

export default LuckyProjects