import { createNativeStackNavigator as createStackNavigator } from '@react-navigation/native-stack';
import React, {useContext, useEffect, useState } from "react";
import { StyleSheet, View,Text, TextInput, TouchableOpacity, Dimensions} from "react-native";
import {Feather} from "@expo/vector-icons";
import { AppContext } from '../context/AppContext';
import {printToFileAsync} from 'expo-print';
import { updateData } from '../context/Api';
const RootStack = createStackNavigator();
let object;
const {height} = Dimensions.get("screen");
const ReviewDoc = ({navigation,route}) => {
    const {appState:{fontFamilyObj}} = useContext(AppContext);
    object = route.params;
    return(
        <RootStack.Navigator screenOptions={{headerStyle: {elevation: 1,shadowOpacity: 0,backgroundColor: "#fff",borderBottomWidth: 0},headerTintColor: "#fff",headerTitleStyle: { fontWeight: "bold" }}}>
        <RootStack.Screen name="AddItemScreen" component={PageContent} options={{
            headerLeft: () => (
                <Feather.Button backgroundColor="#fff" name="arrow-left-circle" size={28} color="#757575" onPress={()=>{navigation.goBack()}}></Feather.Button>
            ), 
            title: "REVIEW DOCUMENT",
            headerTintColor: '#757575',
            headerTitleStyle: {
                fontWeight: '900',
                fontSize:11,
                fontFamily:fontFamilyObj.fontBold
            },
        }}/>
        </RootStack.Navigator>
    )
};
/**Today on the 1st of January 2023, I Lameck Ndhlovu made a blood Covenant with Rebecca Khambula to marry each other.  Who ever refuses the wrath of God will come upon him or her */
const PageContent = ({navigation}) =>{
    const {appState:{showToast,setConfirmDialog,handleFileUpload,accountInfo,setAccountInfo,fontFamilyObj:{fontBold,fontLight},documents,setDocuments} } = useContext(AppContext);
    const [summary,setSummary] = useState("");
    const {AIResults,type} = object;
    const onChange = (value) => setSummary(value);
    useEffect(() => {
        setSummary(AIResults)
    },[])

    let generatePDF = async () => {
        const html = `
            <html>
                <head>
                    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0, user-scalable=no" />
                </head>
                <body style="text-align: left;">
                    <div style="white-space: pre-wrap;font-size:16px">${summary}</div>
                </body>
            </html>
        `;
        const file = await printToFileAsync({
            html:html,
            base64:false,
            margins: {
                left: 20,
                top: 50,
                right: 20,
                bottom: 100,
            },
        })
        await handleFileUpload(type,file.uri,navigation);
        const documents = accountInfo.documents - 1;
        updateData("clients",accountInfo.id,{documents})
        setAccountInfo(prevState => ({...prevState,documents}));
        navigation.goBack();
        navigation.goBack();
        navigation.goBack();
    }
    return(
        <View style={styles.container}>
            <Text style={{fontFamily:fontBold,marginBottom:15,color:'orange',alignSelf:'flex-start'}}>YOU CAN EDIT YOUR DOCUMENT</Text>
            <TextInput 
                numberOfLines={10} 
                editable={true} 
                multiline maxLength={10000} 
                onChangeText={onChange}
                underlineColorAndroid={'transparent'}
                placeholder={"Edit results"}
                value = {summary}
                style={{width:'100%',fontFamily:fontLight,padding: 10,backgroundColor: '#F5FCFF',borderRadius:5,borderWidth:1,borderColor:'#14678B',maxHeight:height-350}} 
            />
            <TouchableOpacity onPress={() => {
                generatePDF()
            }} style={{borderWidth:1,borderColor:'#14678B',padding:15,borderRadius:10,marginTop:30}}><Text style={{fontFamily:fontBold,color:'#14678B'}}>UPLOAD DOCUMENT</Text></TouchableOpacity>
        </View>
    )
};
const styles = StyleSheet.create({
    container: {
      flex: 1,
      padding: 10,
      justifyContent: 'center',
      alignItems: 'center',
    },
    textareaContainer: {
      minHeight: 100,
      padding: 7,
      backgroundColor: '#F5FCFF',
      borderRadius:10,
      borderWidth:1,borderColor:'#14678B'
    },
    textarea: {
      textAlignVertical: 'top',  // hack android
      height: 100,
      fontSize: 14,
      color: '#333',
    },
  });
export default ReviewDoc