import { createNativeStackNavigator as createStackNavigator } from '@react-navigation/native-stack';
import React, {useRef,useContext, useState, useEffect, useCallback } from "react";
import { StyleSheet, View, Image, Text, ScrollView, ActivityIndicator, TouchableOpacity, Dimensions, Clipboard} from "react-native";
import {Feather, FontAwesome, MaterialIcons } from "@expo/vector-icons";
import { AppContext } from '../context/AppContext';
import ViewShot from "react-native-view-shot";
import { Configuration, OpenAIApi } from 'openai';
const RootStack = createStackNavigator();
let object;
const { width, height } = Dimensions.get('window');

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
    const {appState:{showToast,handleFileUpload,secrets,fontFamilyObj:{fontBold,fontLight},accountInfo,setAccountInfo} } = useContext(AppContext);
    const {item} = object;
    const guideLines = item.guideLines;
    const {type,summary} = item;
    const [isLoading,setIsLoading] = useState(false);
    const [AIResults,setAIResults] = useState(null);
    const viewRef = useRef();
    const configuration = new Configuration({
        apiKey: secrets?.OPENAI_KEY
    });
    const openai = new OpenAIApi(configuration);
    const generateText = async (prompt) => {
        try {
            const completion = await openai.createCompletion({
                model: 'text-davinci-003', 
                prompt,
                temperature: 1, 
                max_tokens: 4048,
            });
            setIsLoading(false)
            setAIResults(completion.data.choices[0].text);
        } catch (error) {
            console.log(error)
            setIsLoading(false)
        }
    }

    const initializePrompt = useCallback(() => {
        generateText(`Generate a ${type} based on ${summary}`)
        setIsLoading(true)
    })
    const copyToClipboard = () => {
        Clipboard.setString(AIResults)
        showToast(AIResults)
    }
    useEffect(() => {
        initializePrompt()
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
                            <ViewShot ref={viewRef} style={{paddingBottom:100}}>
                                <Text style={{fontFamily:fontLight,textAlign:'left',alignSelf:'flex-start'}}>{AIResults}</Text>
                            </ViewShot>
                        </ScrollView>
                    }
                    {AIResults && 
                        <View style={{position:'absolute',flexDirection:'row',backgroundColor:'rgba(0, 0, 0, 0.8)',bottom:0,left:0,width:'100%',zIndex:100,padding:5,justifyContent:'space-between',borderRadius:5}}>
                            <TouchableOpacity onPress={initializePrompt} style={{borderWidth:1,borderColor:'#14678B',padding:15,borderRadius:5,marginTop:10}}><Text style={{fontFamily:fontBold,color:'#14678B'}}>RETRY</Text></TouchableOpacity>
                            <TouchableOpacity onPress={copyToClipboard} style={{borderWidth:1,borderColor:'#14678B',padding:15,borderRadius:5,marginTop:10}}><Text style={{fontFamily:fontBold,color:'#14678B'}}>COPY TEXT</Text></TouchableOpacity>
                            <TouchableOpacity onPress={() => navigation.navigate("ReviewDoc",{AIResults,type})} style={{borderWidth:1,borderColor:'#14678B',padding:15,borderRadius:5,marginTop:10}}><Text style={{fontFamily:fontBold,color:'#14678B'}}>REVIEW</Text></TouchableOpacity>
                        </View>
                    }
                    {!AIResults && 
                        <View style={{flex:1,justifyContent:'center'}}>
                            <Text style={{fontFamily:fontBold,textAlign:'center'}}>Failed To Generate Your {type} Document. Please try to adjust your summary or check your internet connection...</Text>
                            <TouchableOpacity onPress={initializePrompt} style={{borderWidth:1,borderColor:'#14678B',padding:15,borderRadius:10,marginTop:30}}><Text style={{fontFamily:fontBold,color:'#14678B'}}>RETRY</Text></TouchableOpacity>
                        </View>
                    }
                </View>
            }
        </View>
    )
};
const styles = StyleSheet.create({
    container: {
      flex: 1,
      padding: 10,
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