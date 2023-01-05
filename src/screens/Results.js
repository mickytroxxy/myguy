import { createStackNavigator } from '@react-navigation/stack';
import React, {useRef,useContext, useState, useEffect, useCallback } from "react";
import { StyleSheet, View, Image, Text, ScrollView, ActivityIndicator, TouchableOpacity, Dimensions} from "react-native";
import {Feather, FontAwesome, MaterialIcons } from "@expo/vector-icons";
import { AppContext } from '../context/AppContext';
import { createData, updateData, uploadAsPDF, uploadFile } from '../context/Api';
import Pdf from 'react-native-pdf';
import { QRCode } from 'react-native-custom-qr-codes-expo';
import ViewShot from "react-native-view-shot";
import {captureRef} from "react-native-view-shot";
import { Configuration, OpenAIApi } from 'openai';
import {printToFileAsync} from 'expo-print';
import { shareAsync } from 'expo-sharing';
const RootStack = createStackNavigator();
let object;
const { width, height } = Dimensions.get('window');
const configuration = new Configuration({
    apiKey: "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",
});
const openai = new OpenAIApi(configuration);
const Results = ({navigation,route}) => {
    const {appState:{fontFamilyObj}} = useContext(AppContext);
    object = route.params;
    return(
        <RootStack.Navigator screenOptions={{headerStyle: {elevation: 1,shadowOpacity: 0,backgroundColor: "#fff",borderBottomWidth: 0},headerTintColor: "#fff",headerTitleStyle: { fontWeight: "bold" }}}>
        <RootStack.Screen name="AddItemScreen" component={PageContent} options={{
            headerLeft: () => (
                <Feather.Button backgroundColor="#fff" name="arrow-left-circle" size={28} color="#757575" onPress={()=>{navigation.goBack()}}></Feather.Button>
            ), 
            title: "RESULTS FOR "+object.item.type,
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
const PageContent = ({navigation}) =>{
    const {appState:{showToast,handleFileUpload,accountInfo,fontFamilyObj:{fontBold,fontLight},documents,setDocuments} } = useContext(AppContext);
    const {item} = object;
    const {type,summary} = item;
    const [isLoading,setIsLoading] = useState(false);
    const [AIResults,setAIResults] = useState(null);
    const [fakeImage,setFakeImage] = useState(null)
    const viewRef = useRef();
    const generateText = async (prompt) => {
        try {
            const completion = await openai.createCompletion({
                model: 'text-davinci-003', prompt,temperature: 1, max_tokens: 4048,
            });
            setIsLoading(false)
            setAIResults(completion.data.choices[0].text)
        } catch (error) {
            console.log(error)
            setIsLoading(false)
        }
    }

    const initializePrompt = useCallback(() => {
        const prompt = `Generate a ${type} based on ${summary}`
        setIsLoading(true)
        generateText(prompt)
    })
    const saveDocument = () => {
        captureRef(viewRef, {
            format: "jpg",
            quality: 1,
          }).then((uri) => {
            generatePDF(uri)
          },(error) => console.error("Oops, snapshot failed", error)
        );
    }
    let generatePDF = async () => {
        const html = `
            <html>
                <head>
                    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0, user-scalable=no" />
                </head>
                <body style="text-align: left;">
                    <div style="white-space: pre-wrap;font-size:16px">${AIResults}</div>
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
        //await shareAsync(file.uri, { UTI: '.pdf', mimeType: 'application/pdf' });
    }
    useEffect(() => {
        //initializePrompt()
    },[])
    return(
        <View style={styles.container}>
            {isLoading && 
                <View style={{flex:1,justifyContent:'center'}}>
                    <ActivityIndicator size={48}/>
                    <Text style={{fontFamily:fontBold,textAlign:'center'}}>Generating Your {type} Document, Please wait...</Text>
                </View>
            }
            {!isLoading && 
                <View style={{flex:1}}>
                    {AIResults && 
                        <ScrollView showsVerticalScrollIndicator={false} style={{flex:1}}>
                            <ViewShot ref={viewRef}>
                                <Text style={{fontFamily:fontLight,textAlign:'left',alignSelf:'flex-start'}}>{AIResults}</Text>
                            </ViewShot>
                            <View style={{flexDirection:'row',justifyContent:'space-between',paddingBottom:30}}>
                                <TouchableOpacity onPress={initializePrompt} style={{borderWidth:1,borderColor:'#14678B',padding:15,borderRadius:10,marginTop:30}}><Text style={{fontFamily:fontBold,color:'#14678B'}}>RETRY</Text></TouchableOpacity>
                                <TouchableOpacity onPress={initializePrompt} style={{borderWidth:1,borderColor:'#14678B',padding:15,borderRadius:10,marginTop:30}}><Text style={{fontFamily:fontBold,color:'#14678B'}}>COPY TEXT</Text></TouchableOpacity>
                                <TouchableOpacity onPress={generatePDF} style={{borderWidth:1,borderColor:'#14678B',padding:15,borderRadius:10,marginTop:30}}><Text style={{fontFamily:fontBold,color:'#14678B'}}>UPLOAD</Text></TouchableOpacity>
                            </View>
                        </ScrollView>
                    }
                    {!AIResults && 
                        <View style={{flex:1,justifyContent:'center'}}>
                            <Text style={{fontFamily:fontBold,textAlign:'center'}}>Failed To Generate Your {type} Document...</Text>
                            <TouchableOpacity onPress={initializePrompt} style={{borderWidth:1,borderColor:'#14678B',padding:15,borderRadius:10,marginTop:30}}><Text style={{fontFamily:fontBold,color:'#14678B'}}>RETRY</Text></TouchableOpacity>
                        </View>
                    }
                    {/* {fakeImage && 
                        <ScrollView>
                            <Image source={{uri:fakeImage}} resizeMode="contain" style={{width:width,height:700}} />
                        </ScrollView>
                    } */}
                </View>
            }
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
export default Results