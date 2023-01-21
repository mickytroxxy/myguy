import React, { useState } from "react";
import { View,Text,StyleSheet,TouchableOpacity,ActivityIndicator } from "react-native";
import { WebView } from 'react-native-webview';
import FontAwesome from "react-native-vector-icons/FontAwesome";
import { AppContext } from "../context/AppContext";
import { createData, getUserDetails, updateData } from "../context/Api";
const WebBrowser = ({route,navigation}) =>{
    const { appState:{fontFamilyObj,accountInfo,clients,setActiveProfile,setAccountInfo,activeProfile,sendPushNotification} } = React.useContext(AppContext);
    const { object,baseUrl } = route.params;
    const [successStatus,setSuccessStatus]=useState('processing');
    React.useEffect(()=>{
        setSuccessStatus("processing")
    },[])
    if (successStatus=="processing") {
        return(
            <WebView
                source={{uri: baseUrl}}
                onLoadStart={(syntheticEvent) => {
                    const { nativeEvent } = syntheticEvent;
                    if (!nativeEvent.url.includes("https://www.payfast.co.za/eng/process?cmd=_paynow&receiver=")) {
                        if (nativeEvent.url.includes("smartstore")) {
                            setSuccessStatus("loading");
                        }else if (nativeEvent.url.includes("lifestyle") && (!nativeEvent.url.includes("www.payfast.co.za"))) {
                            setSuccessStatus("loading");
                        }
                    }
                }}
            />
        )
    }else if (successStatus=="processed") {
        const {type,amount} = object;
        return(
            <View style={styles.container}>
                <FontAwesome name="check-circle" color="green" size={200}></FontAwesome>
                {type === "SUBSCRIPTION" && <Text style={{color:'#2a2828',fontFamily:fontFamilyObj.fontBold,padding:10,textAlign:'center'}}>Your subscription of ZAR {amount.toFixed(2)} has been processed successfully. Your project is now live!</Text>}
                {type === "PURCHASE" && <Text style={{color:'#2a2828',fontFamily:fontFamilyObj.fontBold,padding:10,textAlign:'center'}}>Your purchase was successfully processed. Wish you the best in your business!</Text>}
                {type === "SUPPORT" && <Text style={{color:'#2a2828',fontFamily:fontFamilyObj.fontBold,padding:10,textAlign:'center'}}>Your support of ZAR {parseFloat(amount).toFixed(2)} has been processed successfully. Thank you for supporting!</Text>}
                <TouchableOpacity style={{marginTop:50}} onPress={()=>{
                    navigation.goBack();
                    navigation.goBack()
                }}>
                    <FontAwesome name="arrow-circle-left" color="#757575" size={50}></FontAwesome>
                </TouchableOpacity>
            </View>
        )
    }else if (successStatus=="failed") {
        return(
            <View style={styles.container}>
                <FontAwesome name="times-circle-o" color="tomato" size={200}></FontAwesome>
                <View>
                    <Text style={{color:'#2a2828',fontFamily:fontFamilyObj.fontBold,padding:10,alignItems: 'center',alignContent:'center',textAlign:'center'}}>ERROR! EITHER YOU CANCELLED THE TRANSACTION OR YOUR PAYMENT IS NOT VALID</Text>
                </View>
                <TouchableOpacity style={{marginTop:50}} onPress={()=>{
                    navigation.goBack();
                    navigation.goBack()
                }}>
                    <FontAwesome name="arrow-circle-left" color="#757575" size={50}></FontAwesome>
                </TouchableOpacity>
            </View>
        )
    }
    else if (successStatus=="loading") {
        const {type} = object;
        const date = Date.now();
        if(type !== "SUPPORT"){
            const {plan,amount,documents,signatures,projectId} = object;
            if(type === "SUBSCRIPTION"){
                const projectInfo = clients.filter(item => item.projectId === projectId)[0];
                const subscriptions = [...projectInfo.subscriptions,{date,amount:parseFloat(amount),plan}];
                const docs = parseFloat(accountInfo.documents) + documents;
                const sigs = parseFloat(accountInfo.signatures) + signatures;
                updateData("projects",projectId,{isActive:true,activationDate:date,subscriptions,plan})
                updateData("clients",accountInfo.id,{plan,documents:docs,signatures:sigs})
                setActiveProfile(prevState => ({...prevState,isActive:true,activationDate:date,subscriptions,plan}));
            }else{
                updateData("clients",accountInfo.id,{plan,documents,signatures});
                if(accountInfo.referredBy !== "" && accountInfo.referredBy !== null){
                    const referralBonus = 20 / 100 * amount;
                    const referralId = Math.floor(Math.random()*89999000+1000000000).toString();
                    createData("referrals",referralId,{referralBonus,referralId,receiver:accountInfo.referredBy,sender:accountInfo.id,date})
                }
            }
            setAccountInfo(prevState => ({...prevState,plan,documents:parseFloat(documents),signatures:parseFloat(signatures)}))
        }else{
            const {amount,projectId,funder} = object;
            const funded = parseFloat(activeProfile.funded) + parseFloat(amount);
            const funders = [...activeProfile.funders,funder]
            setActiveProfile(prevState => ({...prevState,funded,funders}));
            updateData("projects",projectId,{funded,funders});
            getUserDetails(activeProfile.projectOwner,(accountOwner) => {
                if(accountOwner.length > 0){
                    if(accountOwner[0]?.notificationToken){
                        sendPushNotification(accountOwner[0]?.notificationToken,"YOU GOT FUNDED",`Hello ${accountOwner[0].fname}, Someone just supported your project with ZAR ${amount}`,{});
                    }
                }
            })
        }
        setSuccessStatus("processed");
        return(
            <View style={styles.container}>
                <ActivityIndicator size="large" color="#0000ff" style={{marginTop:50}}/>
            </View>
        )
    }
}
export default WebBrowser;
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
    },
});