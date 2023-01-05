import PropTypes from 'prop-types'
import React, { memo,useContext,useEffect,useState } from 'react'
import { View,TouchableOpacity,Text, ScrollView, Image, Platform } from 'react-native'
import { AppContext } from '../context/AppContext'
import * as Animatable from 'react-native-animatable';
import { ActivityIndicator } from 'react-native-paper';
import { MaterialCommunityIcons, FontAwesome, MaterialIcons} from "@expo/vector-icons";
import { createData, getDocuments } from '../context/Api';
import Pdf from 'react-native-pdf';
const Products = memo(({navigation}) => {
    const {appState:{
        fontFamilyObj:{fontBold,fontLight},
        accountInfo,
        documentTypes,documents,setDocuments
    }} = useContext(AppContext);
    useEffect(() => {
        if(accountInfo){
            getDocuments(accountInfo.id,(response) => setDocuments(response))
        }
    },[])
    return (
        <View>
            <Animatable.View animation="slideInLeft" duration={750} useNativeDriver={true} style={{flexDirection:'row',marginTop:10,borderBottomWidth:0.6,borderBottomColor:'#fff',paddingBottom:15}}>
                <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                {[{type:'ALL',selected:true},...documentTypes].map((item,i) => {
                    return(
                        <View key={i} style={{flex:1}}>
                            <TouchableOpacity style={{borderWidth:1,borderColor:'#5586cc',flex:1,margin:5,padding:10,borderRadius:30}} onPress={() => {
                                alert("hey")
                            }}>
                                <Text style={{fontFamily:fontBold,color:'#757575',textAlign:'center',fontSize:Platform.OS === 'android' ? 11 : 12}}>{item.type}</Text>
                            </TouchableOpacity>
                        </View>
                    )
                })}
                </ScrollView>
            </Animatable.View>

            <ScrollView showsVerticalScrollIndicator={false} style={{marginTop:15}}>
                <Animatable.View animation="slideInRight" duration={750} useNativeDriver={true} style={{flexDirection:'row',alignContent:'center',alignItems:'center',display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',flexWrap: 'wrap'}}>
                    {documents?.length > 0 && documents?.map((item,i)=>{
                        const {documentType,documentId,url} = item;
                        return(
                            <TouchableOpacity onPress={() => navigation.navigate("DocumentView",{documentType,documentId,url})} key={i} style={{width:'48%',borderRadius:10,alignContent:'center',alignItems:'center',justifyContent:'center',minHeight:220,marginTop:10}}>
                                <View style={{width:'100%',height:220,backgroundColor:'#fff',borderRadius:10,padding:2,alignContent:'center',justifyContent:'center',alignItems:'center'}}>
                                    <Pdf
                                        source={{ uri: url, cache: true }}
                                        style={{width:'100%',height:'100%',borderRadius:10}}
                                        enableAntialiasing={true}
                                        fitWidth={true}
                                        singlePage ={1}
                                    />
                                </View>
                                <View style={{backgroundColor:'rgba(0, 0, 0, 0.2)',borderRadius:0,justifyContent:'center',borderBottomRightRadius:50,borderTopLeftRadius:50,padding:10,width:'100%',marginTop:5}}><Text style={{fontFamily:fontBold,color:'#14678B',textAlign:'center',fontSize:11}} numberOfLines={1}>{documentType}</Text></View>
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
                <View style={{marginTop:30,alignContent:'center',alignItems:'center'}}>
                    <Text style={{textAlign:'center',fontFamily:fontBold}}>Contact Support</Text>
                    <TouchableOpacity onPress={()=> navigation.navigate("Contact")}>
                        <MaterialIcons name='contact-support' size={75} color="#5586cc" />
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </View>
    )
})

Products.propTypes = {}

export default Products