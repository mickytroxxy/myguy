import { createNativeStackNavigator as createStackNavigator } from '@react-navigation/native-stack';
import React, {useState,useContext } from "react";
import { StyleSheet, View, Dimensions ,Image,ScrollView, Platform,TouchableOpacity,Text,TextInput, AppState} from "react-native";
import {MaterialCommunityIcons,AntDesign,Feather,Ionicons, FontAwesome } from "@expo/vector-icons";
import { Col, Row, Grid } from 'react-native-easy-grid';
import { LinearGradient } from 'expo-linear-gradient';
import { AppContext } from '../context/AppContext';
import AisInput from '../components/forms/AisInput';
let obj;
let return_url,cancel_url;
const mechantId = 15759218;
const RootStack = createStackNavigator();
const ActivateProject = ({navigation,route}) =>{
    const {appState:{fontFamilyObj}} = useContext(AppContext);
    obj = route.params;
    return(
        <RootStack.Navigator screenOptions={{headerStyle: {elevation: 1,shadowOpacity: 0,backgroundColor: "#fff",borderBottomWidth: 0},headerTintColor: "#fff",headerTitleStyle: { fontWeight: "bold" }}}>
        <RootStack.Screen name="AddItemScreen" component={PageContent} options={{
            headerLeft: () => (
                <Feather.Button backgroundColor="#fff" name="arrow-left-circle" size={28} color="#757575" onPress={()=>{navigation.goBack()}}></Feather.Button>
            ), 
            title: "ACTIVATE PROJECT",
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
const PageContent = ({navigation,route}) =>{
    const {appState:{fontFamilyObj:{fontBold,fontLight},plans,setPlans} } = useContext(AppContext);
    
    const selectedPlan = plans.filter(item => item.selected)[0];
    const activateProject = () => {
        if (Platform.OS == 'android') {
            return_url = encodeURIComponent('https://lifestyle.empiredigitals.org/');
            cancel_url = encodeURIComponent('https://smartstore.empiredigitals.org/');
        }else{
            return_url = 'https://lifestyle.empiredigitals.org/';
            cancel_url = 'https://smartstore.empiredigitals.org/';
        }
        const baseUrl = "https://www.payfast.co.za/eng/process?cmd=_paynow&receiver="+mechantId+"&item_name=Subcription&item_description="+selectedPlan.type+" subscription for ZAR "+selectedPlan.fee+"&amount="+selectedPlan.fee+"&return_url="+return_url+"&cancel_url="+cancel_url+""
        const object = {type:"SUBSCRIPTION",plan:selectedPlan.type,amount:selectedPlan.fee,documents:selectedPlan.documents,signatures:selectedPlan.signatures,projectId:obj.projectId}
        navigation.navigate("WebBrowser",{object,baseUrl});
    }
    return(
        <View style={styles.container}>
            <LinearGradient colors={["#fff","#fff","#fff","#f1f7fa"]} style={{flex:1,paddingTop:10,borderRadius:10,padding:10}}>
                <ScrollView>
                    <View style={{flexDirection:'row',marginTop:10,justifyContent:'space-between'}}>
                        {plans?.map((item,i) => {
                            return(
                                <TouchableOpacity onPress={() => setPlans(plans.map(data => data.type === item.type ? {...data,selected:true} : {...data,selected:false}))}  style={{borderRadius:10,margin:5,padding:10,borderColor:!item.selected ? "orange" : "green",borderWidth:1,flexDirection:'row',width:'45%'}}>
                                    <Ionicons name='heart-circle-outline' size={24} color={!item.selected ? "orange" : "green"} />
                                    <View style={{marginLeft:10,justifyContent:'center'}}>
                                        <Text style={{fontFamily:fontBold,color:!item.selected ? "orange" : "green",fontSize:11}}>{item.type}</Text>
                                    </View>
                                </TouchableOpacity>
                            )
                        })}
                    </View>
                    <View style={{backgroundColor:'#F4B55A',flexDirection:'row',borderRadius:5,marginTop:10,marginBottom:20,padding:10,width:'100%'}}>
                        <Ionicons name='heart-circle-outline' size={24} color='green' />
                        <Text style={{fontFamily:fontBold,color:'#41444B',fontSize:11,color:'#fff',marginLeft:10,marginTop:4}}>{selectedPlan.type} ZAR {selectedPlan.fee.toFixed(2)}</Text>
                    </View>
                    <View>
                        {selectedPlan.attr.map((item,i) => 
                            <View key={item+i} style={{padding:5,borderBottomWidth:0.7,borderBottomColor:'#E8E7E4',flexDirection:'row'}}>
                                <View style={{flex:1}}><Text style={{fontFamily:fontLight}}>{item}</Text></View>
                                <View><FontAwesome name='check-circle' size={24} color="green" /></View>
                            </View>
                        )}
                    </View>
                    <TouchableOpacity onPress={() => activateProject()}  style={{borderRadius:10,padding:10,borderColor:'green',borderWidth:1,flexDirection:'row',marginTop:30}}>
                        <Ionicons name='heart-circle-outline' size={24} color="green" />
                        <View style={{marginLeft:10,justifyContent:'center'}}>
                            <Text style={{fontFamily:fontBold,color:'green',fontSize:11}}>ACTIVATE PROJECT</Text>
                        </View>
                    </TouchableOpacity>
                </ScrollView>
            </LinearGradient>
        </View>
    )
};
export default ActivateProject;
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