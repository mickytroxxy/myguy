import { createStackNavigator } from '@react-navigation/stack';
import React, {useState,useContext } from "react";
import { StyleSheet, View, SafeAreaView ,Linking,ScrollView, Platform,TouchableOpacity,Text,TextInput} from "react-native";
import {MaterialCommunityIcons,AntDesign,Feather } from "@expo/vector-icons";
import { Col, Row, Grid } from 'react-native-easy-grid';
import { LinearGradient } from 'expo-linear-gradient';
import { AppContext } from '../context/AppContext';
import AisInput from '../components/forms/AisInput';
import { WebView } from 'react-native-webview';
import { shareAsync } from 'expo-sharing';

const RootStack = createStackNavigator();
const Download = ({navigation,route}) =>{
    const {appState:{fontFamilyObj}} = useContext(AppContext);
    return(
        <RootStack.Navigator screenOptions={{headerStyle: {elevation: 1,shadowOpacity: 0,backgroundColor: "#fff",borderBottomWidth: 0},headerTintColor: "#fff",headerTitleStyle: { fontWeight: "bold" }}}>
        <RootStack.Screen name="AddItemScreen" component={PageContent} options={{
            headerLeft: () => (
                <Feather.Button backgroundColor="#fff" name="arrow-left-circle" size={28} color="#757575" onPress={()=>{navigation.goBack()}}></Feather.Button>
            ), 
            title:"Download",
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
const PageContent = ({navigation}) =>{
    // function onMessage(message) {
    //     const info = message.nativeEvent.data;
    //     alert(info)
    // }
    const onMessage = async (message) => {
        const info = message.nativeEvent.data;
        //const { uri } = await Print.printToFileAsync({ info });
        //console.log('File has been saved to:', uri);
        alert(info)
        //await shareAsync(url, { UTI: '.pdf', mimeType: 'application/pdf' });
      };
    return(
        <View style={styles.container}>
            <LinearGradient colors={["#fff","#fff","#fff","#A2DDF3"]} style={{flex:1,paddingTop:10,borderRadius:10}}>
            <WebView source={{ html: `
                <html>
                    <head>
                        <meta charset="utf-8" />
                        <script src="https://unpkg.com/pdf-lib@1.4.0"></script>
                        <script src="https://unpkg.com/downloadjs@1.4.7"></script>
                    </head>
                
                    <body onLoad="modifyPdf()">
                        <button onclick="modifyPdf()">Modify PDF</button>
                    </body>
                    
                    <script>
                        const { degrees, PDFDocument, rgb, StandardFonts } = PDFLib
                        async function modifyPdf() {
                            const url = 'https://pdf-lib.js.org/assets/with_update_sections.pdf'
                            const existingPdfBytes = await fetch(url).then(res => res.arrayBuffer())
                            const pdfDoc = await PDFDocument.load(existingPdfBytes)
                            const helveticaFont = await pdfDoc.embedFont(StandardFonts.Helvetica)
                            const pages = pdfDoc.getPages()
                            const firstPage = pages[0]
                            const { width, height } = firstPage.getSize()
                            firstPage.drawText('This text was added with JavaScript!', {
                                x: 5,
                                y: height / 2 + 300,
                                size: 50,
                                font: helveticaFont,
                                color: rgb(0.95, 0.1, 0.1),
                                rotate: degrees(-45),
                            })
                            const pdfBytes = await pdfDoc.save()
                            const pdfUrl = window.URL.createObjectURL(new Blob([pdfBytes], { type: 'application/pdf' }))
                            //window.ReactNativeWebView.postMessage(pdfUrl)
                            const link = document.createElement('a')
                            link.href = pdfUrl
                            link.download = 'my-modified-pdf.pdf'
                            link.click()
                        }
                    </script>
                </html>
                ` }} onMessage={onMessage} scrollEnabled={true}
                javaScriptEnabled={true}
                domStorageEnabled={true}
                originWhitelist={["*"]}  />
            </LinearGradient>
        </View>
    )
};
export default Download;
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