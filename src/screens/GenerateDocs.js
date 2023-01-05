import { createStackNavigator } from '@react-navigation/stack';
import React, {useRef,useContext, useState, useEffect } from "react";
import { StyleSheet, View,Text, Image, TouchableOpacity, Dimensions} from "react-native";
import {Feather, FontAwesome, MaterialIcons } from "@expo/vector-icons";
import { AppContext } from '../context/AppContext';
import { createData, updateData, uploadAsPDF, uploadFile } from '../context/Api';
import Pdf from 'react-native-pdf';
import { QRCode } from 'react-native-custom-qr-codes-expo';
import ViewShot from "react-native-view-shot";
import {captureRef} from "react-native-view-shot";
import { Configuration, OpenAIApi } from 'openai';
import { ScrollView } from 'react-native-gesture-handler';
import Textarea from 'react-native-textarea';
const RootStack = createStackNavigator();
let object;
const { width, height } = Dimensions.get('window');
const configuration = new Configuration({
    apiKey: "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",
});
const openai = new OpenAIApi(configuration);
const GenerateDocs = ({navigation,route}) => {
    const {appState:{fontFamilyObj}} = useContext(AppContext);
    object = route.params;
    return(
        <RootStack.Navigator screenOptions={{headerStyle: {elevation: 1,shadowOpacity: 0,backgroundColor: "#fff",borderBottomWidth: 0},headerTintColor: "#fff",headerTitleStyle: { fontWeight: "bold" }}}>
        <RootStack.Screen name="AddItemScreen" component={PageContent} options={{
            headerLeft: () => (
                <Feather.Button backgroundColor="#fff" name="arrow-left-circle" size={28} color="#757575" onPress={()=>{navigation.goBack()}}></Feather.Button>
            ), 
            title: "GENERATE A "+object.item.type,
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
    const {appState:{showToast,setConfirmDialog,accountInfo,fontFamilyObj:{fontBold,fontLight},documents,setDocuments} } = useContext(AppContext);
    const [summary,setSummary] = useState("");
    const {item} = object;
    const {type,hint} = item;
    const onChange = (value) => setSummary(value)
    return(
        <View style={styles.container}>
            <Text style={{fontFamily:fontBold,marginBottom:15,color:'orange'}}>{hint}</Text>
            <Textarea
                containerStyle={styles.textareaContainer}
                style={[styles.textarea,{fontFamily:fontBold}]}
                onChangeText={onChange}
                maxLength={1500}
                placeholder={'Give Us Enough Information About Your '+type+' document'}
                placeholderTextColor={'#14678B'}
                underlineColorAndroid={'transparent'}
            />
            <TouchableOpacity onPress={() => {
                navigation.navigate("Results",{item:{...item,summary}})
            }} style={{borderWidth:1,borderColor:'#14678B',padding:15,borderRadius:10,marginTop:30}}><Text style={{fontFamily:fontBold,color:'#14678B'}}>GENERATE DOCUMENT</Text></TouchableOpacity>
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
export default GenerateDocs