import { createNativeStackNavigator as createStackNavigator } from '@react-navigation/native-stack';
import React, {useRef,useContext, useState, useEffect, useCallback } from "react";
import { StyleSheet, View, Image, Text, ScrollView, ActivityIndicator, TouchableOpacity, Dimensions, Clipboard} from "react-native";
import {Feather} from "@expo/vector-icons";
import { AppContext } from '../context/AppContext';
import ViewShot from "react-native-view-shot";
import { Configuration, OpenAIApi } from 'openai';
import { createData } from '../context/Api';
const RootStack = createStackNavigator();
let object;

const Review = ({navigation,route}) => {
    const {appState:{fontFamilyObj}} = useContext(AppContext);
    object = route.params;
    return(
        <RootStack.Navigator screenOptions={{headerStyle: {elevation: 1,shadowOpacity: 0,backgroundColor: "#fff",borderBottomWidth: 0},headerTintColor: "#fff",headerTitleStyle: { fontWeight: "bold" }}}>
        <RootStack.Screen name="AddItemScreen" component={PageContent} options={{
            headerLeft: () => (
                <Feather.Button backgroundColor="#fff" name="arrow-left-circle" size={28} color="#757575" onPress={()=>{navigation.goBack()}}></Feather.Button>
            ), 
            title: object.item.fname.toUpperCase(),
            headerTintColor: '#757575',
            headerTitleStyle: {
                fontWeight: '900',
                fontSize:13,
                fontFamily:fontFamilyObj.fontBold
            },
        }}/>
        </RootStack.Navigator>
    )
};
const PageContent = ({navigation}) =>{
    const {appState:{showToast,setConfirmDialog,secrets,fontFamilyObj:{fontBold,fontLight},accountInfo,setClients} } = useContext(AppContext);
    const {item} = object;
    const {fname,summary,mainCategory,subCategory,target} = item;
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
            setAIResults(eval(completion.data.choices[0].text));
            setIsLoading(false)
        } catch (error) {
            console.log(error)
            setIsLoading(false)
        }
    }

    const initializePrompt = useCallback(() => {
        generateText(`Generate a business plan based on ${summary} the project name is ${fname}, The result should be an array of object like [{section:"sectionText",content:"contentText"}]`)
        setIsLoading(true)
    })
    useEffect(() => {
        initializePrompt()
    },[])
    const saveProject = () => {
        setConfirmDialog({isVisible:true,text:`You are about to save your project, Please confirm if you have entered the correct details`,okayBtn:'CONFIRM',cancelBtn:'Cancel',response:(res) => { 
            if(res){
                const projectId = Math.floor(Math.random()*89999000+1000000000).toString();
                const projectOwner = accountInfo?.id;
                const details = AIResults;
                const avatar = "";
                const funded = 0;
                const votes = [];
                const address = {text:'No Address Specified',lat:0,lon:0};
                const isVerified = true;
                const photos = [];
                const privacy = [
                    {type:'STILL AN ADEA',selected:true},
                    {type:'PROTOTYPE IS READY',selected:false},
                    {type:'DO YOU HAVE AN OFFICE',selected:false},
                    {type:'PROJECT IS RUNNING',selected:false}
                ]
                const joiningDate = Date.now();
                const funders = [];
                const whatsApp = '';
                const phoneNumber = '';
                const emailAddress = '';
                const isActive = false;
                const subscriptions = [];
                const plan = 'FREE PLAN';
                const isLucky10 = false;
                const obj = {projectId,funders,whatsApp,phoneNumber,isActive,emailAddress,subscriptions,plan,projectOwner,fname,mainCategory,subCategory,joiningDate,details,avatar,target:parseFloat(target),funded,votes,address,isVerified,photos,privacy,isLucky10}
                createData("projects",projectId,obj);
                setClients(prevState => ([...prevState,obj]));
                navigation.goBack();
                navigation.goBack();
            }
        }})
    }
    return(
        <View style={styles.container}>
            {isLoading && 
                <View style={{flex:1,justifyContent:'center'}}>
                    <ActivityIndicator size={48}/>
                    <Text style={{fontFamily:fontBold,textAlign:'center'}}>Generating Your Compelling Summary, Please wait...</Text>
                </View>
            }
            {!isLoading && 
                <View style={{flex:1}}>
                    {AIResults && 
                        <ScrollView showsVerticalScrollIndicator={false} style={{flex:1}}>
                            <ViewShot ref={viewRef}>
                                <Text style={{fontFamily:fontLight,textAlign:'left',alignSelf:'flex-start'}}></Text>
                                {AIResults?.length > 0 && AIResults?.map(({section,content},i) => 
                                    <View key={section + i} style={{marginBottom:20}} >
                                        <View><Text style={{fontFamily:fontBold}}>{section}</Text></View>
                                        <View style={{marginTop:8}}><Text style={{fontFamily:fontLight}}>{content}</Text></View>
                                    </View>
                                )}
                            </ViewShot>
                            <View style={{flexDirection:'row',justifyContent:'space-between',paddingBottom:30}}>
                                <TouchableOpacity onPress={initializePrompt} style={{borderWidth:1,borderColor:'#14678B',padding:15,borderRadius:5,marginTop:30}}><Text style={{fontFamily:fontBold,color:'#14678B'}}>REGENERATE</Text></TouchableOpacity>
                                <TouchableOpacity onPress={saveProject} style={{backgroundColor:'green',padding:15,borderRadius:5,marginTop:30}}><Text style={{fontFamily:fontBold,color:'#fff'}}>SAVE PROJECT</Text></TouchableOpacity>
                            </View>
                        </ScrollView>
                    }
                    {!AIResults && 
                        <View style={{flex:1,justifyContent:'center'}}>
                            <Text style={{fontFamily:fontBold,textAlign:'center'}}>Failed To Generate Your Summary. Please try to adjust your summary or check your internet connection...</Text>
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
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor:'#fff'
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
export default Review