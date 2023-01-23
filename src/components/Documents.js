import React, { memo,useContext,useEffect,useState } from 'react'
import { View,TouchableOpacity,Text, ScrollView, Image, Platform } from 'react-native'
import { AppContext } from '../context/AppContext'
import * as Animatable from 'react-native-animatable';
import { ActivityIndicator } from 'react-native-paper';
import { MaterialCommunityIcons, FontAwesome, MaterialIcons, Ionicons} from "@expo/vector-icons";
import { getDocuments } from '../context/Api';
import Pdf from 'react-native-pdf';
import Banner from './Banner';
const Products = memo(({navigation}) => {
    const {appState:{
        fontFamilyObj:{fontBold,fontLight},
        documents,secrets
    }} = useContext(AppContext);

    return (
        <View>
            <ScrollView showsVerticalScrollIndicator={false} style={{marginTop:15}}>
                <TouchableOpacity onPress={() => navigation.navigate("AddDocument")} style={{borderRadius:10,padding:10,borderColor:'green',borderWidth:1,flexDirection:'row',width:'100%',alignSelf:'center'}}>
                    <MaterialIcons name='add-circle' size={24} color="green" />
                    <View style={{marginLeft:10,justifyContent:'center'}}>
                        <Text style={{fontFamily:fontBold,color:'green',fontSize:11}}>ADD DOCUMENT</Text>
                    </View>
                </TouchableOpacity>
                <Animatable.View animation="slideInRight" duration={750} useNativeDriver={true} style={{flexDirection:'row',alignContent:'center',alignItems:'center',display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',flexWrap: 'wrap'}}>
                    {documents?.length > 0 && documents.sort((a,b)=>b.time - a.time)?.map((item,i)=>{
                        const {documentType,documentId,url} = item;
                        const link = `${secrets.BASE_URL}${url}`
                        return(
                            <TouchableOpacity onPress={() => navigation.navigate("DocumentView",{documentType,documentId,url:link})} key={i} style={{width:'48%',borderRadius:10,alignContent:'center',alignItems:'center',justifyContent:'center',minHeight:220,marginTop:10}}>
                                <View style={{width:'100%',height:220,backgroundColor:'#F4B55A',borderRadius:10,padding:1,alignContent:'center',justifyContent:'center',alignItems:'center'}}>
                                    <Pdf
                                        source={{ uri: link, cache: false }}
                                        trustAllCerts={false}
                                        style={{width:'100%',height:'100%',borderRadius:10}}
                                        enableAntialiasing={true}
                                        fitWidth={true}
                                    />
                                </View>
                                <View style={{backgroundColor:'rgba(0, 0, 0, 0.2)',borderRadius:0,justifyContent:'center',borderBottomRightRadius:50,borderTopLeftRadius:50,padding:10,width:'100%',marginTop:5}}><Text style={{fontFamily:fontBold,color:'#14678B',textAlign:'center',fontSize:9}} numberOfLines={1}>{documentType}</Text></View>
                            </TouchableOpacity>
                        )
                    })}
                    {!documents && (
                        <View style={{alignItems:'center',alignContent:'center',justifyContent:'center',justifyContent:'center',flex:1,marginTop:250}}>
                            <ActivityIndicator color='#757575' size={48}></ActivityIndicator>
                            <Text style={{fontFamily:fontBold,color:'#757575'}}>Fetching documents...</Text>
                        </View>
                    )}
                    {documents?.length === 0 && (
                        <View style={{alignItems:'center',alignContent:'center',justifyContent:'center',justifyContent:'center',flex:1,marginTop:250}}>
                            <MaterialCommunityIcons name='flask-empty-off-outline' color={"#757575"} size={72} />
                            <Text style={{fontFamily:fontBold,color:'#757575'}}>NO DOCUMENTS FOUND</Text>
                        </View>
                    )}
                </Animatable.View>
                <Banner navigation={navigation}/>
                <View style={{marginTop:30,alignContent:'center',alignItems:'center'}}>
                    <Text style={{textAlign:'center',fontFamily:fontBold}}>Contact Support</Text>
                    <TouchableOpacity onPress={()=> navigation.navigate("Contact")}>
                        <MaterialIcons name='contact-support' size={75} color="green" />
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </View>
    )
})

Products.propTypes = {}

export default Products