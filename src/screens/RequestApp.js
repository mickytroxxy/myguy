import { createNativeStackNavigator as createStackNavigator } from '@react-navigation/native-stack';
import React, {useState,useContext } from "react";
import { StyleSheet, View, Dimensions ,Image,ScrollView, Platform,TouchableOpacity,Text,TextInput, AppState} from "react-native";
import {MaterialCommunityIcons,AntDesign,Feather,Ionicons, FontAwesome } from "@expo/vector-icons";
import { Col, Row, Grid } from 'react-native-easy-grid';
import { LinearGradient } from 'expo-linear-gradient';
import { AppContext } from '../context/AppContext';
import AisInput from '../components/forms/AisInput';
import { createData, getUserDetailsByPhone, updateData } from '../context/Api';
let obj;
const RootStack = createStackNavigator();
const RequestApp = ({navigation,route}) =>{
    const {appState:{fontFamilyObj}} = useContext(AppContext);
    obj = route.params;
    return(
        <RootStack.Navigator screenOptions={{headerStyle: {elevation: 1,shadowOpacity: 0,backgroundColor: "#fff",borderBottomWidth: 0},headerTintColor: "#fff",headerTitleStyle: { fontWeight: "bold" }}}>
        <RootStack.Screen name="AddItemScreen" component={PageContent} options={{
            headerLeft: () => (
                <Feather.Button backgroundColor="#fff" name="arrow-left-circle" size={28} color="#757575" onPress={()=>{navigation.goBack()}}></Feather.Button>
            ), 
            title: obj.type+ " REQUEST",
            headerTintColor: '#757575',
            headerTitleStyle: {
                fontWeight: '900',
                fontSize:12,
                fontFamily:fontFamilyObj.fontBold
            },
        }}/>
        </RootStack.Navigator>
    )
};
const PageContent = ({navigation,route}) =>{
    const {appState:{saveUser,fontFamilyObj:{fontBold,fontLight},setConfirmDialog,showToast,accountInfo} } = useContext(AppContext);
    const [formData,setFormData] = useState({phoneNumber:'',emailAddress:'',summary:'',type:''});
    const onChange = (value) => setFormData(prevState => ({...prevState,summary:value}));
    const [isSubmitted,setIsSubmitted] = useState(false);
    React.useEffect(() => {
        if(accountInfo){
            setFormData(prevState => ({...prevState,type:obj.type,summary:obj.summary,phoneNumber:accountInfo.phoneNumber,emailAddress:accountInfo.email}))
        }else{
            setFormData(prevState => ({...prevState,type:obj.type,summary:obj.summary}))
        }
    },[])
    return(
        <View style={styles.container}>
            <LinearGradient colors={["#fff","#fff","#fff","#f1f7fa"]} style={{flex:1,paddingTop:10,borderRadius:10,padding:10}}>
                {!isSubmitted && 
                    <ScrollView showsVerticalScrollIndicator={false}>
                        <AisInput attr={{field:'phoneNumber',icon:{name:'phone',type:'FontAwesome',min:5,color:'#5586cc'},keyboardType:'numeric',placeholder:'Enter Your Phone Number',color:'#009387',handleChange:(field,value)=>{
                            setFormData(prevState => ({...prevState,phoneNumber:value}))
                        }}} />
                        <AisInput attr={{field:'emailAddress',icon:{name:'mail',type:'Ionicons',min:5,color:'#5586cc'},keyboardType:null,placeholder:'Enter Email Address',color:'#009387',handleChange:(field,value)=>{
                            setFormData(prevState => ({...prevState,emailAddress:value}))
                        }}} />
                        <TextInput 
                            numberOfLines={6} 
                            editable={true} 
                            multiline maxLength={1500} 
                            onChangeText={onChange}
                            underlineColorAndroid={'transparent'}
                            placeholder={`Please explain your ${obj.type} in details`}
                            style={{width:'100%',fontFamily:fontLight,padding: 10,backgroundColor: '#F5FCFF',borderRadius:10,borderWidth:1,borderColor:'#14678B',marginTop:15}} 
                        />
                        <View style={{alignItems:'center',marginTop:15}}>
                            <TouchableOpacity onPress={() => {
                                if(formData.phoneNumber.length > 8){
                                    if(formData.emailAddress.length > 5){
                                        if(formData.summary.length > 20){
                                            setConfirmDialog({isVisible:true,text:`You are about to send a ${obj.type} request. have you given us enough information to work on your project?`,okayBtn:'CONFIRM',severity:true,cancelBtn:'Cancel',response:(res) => { 
                                                if(res){
                                                    const requestId = Math.floor(Math.random()*89999+10000000000).toString();
                                                    createData("appRequests",requestId,{...formData,requestId,date:Date.now()})
                                                    setIsSubmitted(true)
                                                }
                                            }})
                                        }else{
                                            showToast("Please explain to us in detail")
                                        }
                                    }else{
                                        showToast("Invalid Email Address!")
                                    }
                                }else{
                                    showToast("Invalid Phone Number!")
                                }
                            }}>
                                <FontAwesome name='check-circle' size={120} color="#14678B"></FontAwesome>
                            </TouchableOpacity>
                        </View>
                    </ScrollView>
                }
                {isSubmitted && 
                    <View style={{flex:1,justifyContent:'center',alignItems:'center'}}>
                        <FontAwesome name='check-circle' size={120} color="green"></FontAwesome>
                        <Text style={{fontFamily:fontLight,textAlign:'center'}}>Your {obj.type} request has been submitted. We will get back to you as soon as we can!</Text>
                    </View>
                }
            </LinearGradient>
        </View>
    )
};
export default RequestApp;
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
        backgroundColor: "blue",
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