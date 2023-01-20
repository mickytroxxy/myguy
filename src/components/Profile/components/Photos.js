import React, { memo, useContext, useState } from 'react'
import { View, TouchableOpacity, Text, Dimensions, ScrollView, Image, Modal } from 'react-native'
import { Ionicons, MaterialIcons,Feather,FontAwesome } from "@expo/vector-icons";
import * as Animatable from 'react-native-animatable';
import { LinearGradient } from 'expo-linear-gradient';
import { AppContext } from '../../../context/AppContext';
import ImageViewer from 'react-native-image-zoom-viewer';
import { styles } from '../../styles';
const {width,height} = Dimensions.get("screen");
const Photos = memo((props) => {
    const {profileOwner,activeProfile,page,fontBold} = props?.data;
    const photosArray = activeProfile.photos;
    const [photoBrowserVisible, setPhotoBrowserVisible] = useState(false);
    const {appState:{handleUploadPhotos,updateProfile,setModalState,showToast,nativeLink}} = useContext(AppContext)
    const linkClicked = (headerText,field,placeholder,link) => {
        if(profileOwner){
            setModalState({isVisible:true,attr:{headerText:'WEBSITE',field:'websiteLink',placeholder:'Website Link...',handleChange:(field,value) => {
                updateProfile(field,value)
            }}})
        }else{
            if(link){
                nativeLink("url",{url:link})
            }else{
                showToast(`No ${placeholder}`)
            }
        }
    }
    return (
        <Animatable.View animation="bounceIn" duration={1000} useNativeDriver={true} style={{padding:5 }}>
            <ScrollView horizontal={true} showsHorizontalScrollIndicator={false}>
                {photosArray.length > 0 && photosArray.map((item, i) => (
                    <TouchableOpacity key={i} onPress={()=>{
                        photosArray.unshift(photosArray.splice(i, 1)[0]);
                            setPhotoBrowserVisible(true)
                        }}>
                        <View style={styles.mediaImageContainer}>
                            <Animatable.Image animation="zoomInDown" duration={2000} useNativeDriver={true} source={{uri:item.url}} style={styles.image} resizeMode="cover"></Animatable.Image>
                        </View>
                    </TouchableOpacity>
                ))}
            </ScrollView>
            {(profileOwner && photosArray.length > 0) &&
                <LinearGradient colors={["#e44528","#d6a8e7","#f3bf4f"]}start={{ x: 0, y: 1 }} end={{ x: 1, y: 0 }} style={[styles.mediaCount]}>
                    <TouchableOpacity onPress={()=>{handleUploadPhotos('photos',page,activeProfile.projectId)}}>
                        <MaterialIcons name="add-circle" size={30} color="#fff" alignSelf="center"></MaterialIcons>
                    </TouchableOpacity>
                </LinearGradient>
            }
            
            <View style={{flexDirection:'row',justifyContent:'space-between'}}>
                {profileOwner && photosArray.length === 0 &&
                    <LinearGradient colors={["orange","#d6a8e7","#5586cc"]} start={{ x: 0, y: 1 }} end={{ x: 1, y: 0 }} style={{borderRadius:10,marginRight:10,padding:10,borderColor:'#5586cc',marginTop:10,flex:1}}>
                        <TouchableOpacity onPress={()=>{handleUploadPhotos('photos',page,activeProfile.projectId)}} style={{borderRadius:10,flexDirection:'row'}}>
                            <MaterialIcons name='add-a-photo' size={24} color="#fff" />
                            <View style={{marginLeft:10,justifyContent:'center'}}>
                                <Text style={{fontFamily:fontBold,color:'#fff',fontSize:11}}>GALLERY</Text>
                            </View>
                        </TouchableOpacity>
                    </LinearGradient>
                }
                <LinearGradient colors={["orange","#d6a8e7","#5586cc"]} start={{ x: 0, y: 1 }} end={{ x: 1, y: 0 }} style={{borderRadius:10,marginRight:10,padding:10,borderColor:'#5586cc',marginTop:10,flex:1}}>
                    <TouchableOpacity onPress={() => linkClicked('WEBSITE','websiteLink','Website link...',activeProfile.websiteLink)} style={{borderRadius:10,flexDirection:'row'}}>
                        <MaterialIcons name='public' size={24} color="#fff" />
                        <View style={{marginLeft:10,justifyContent:'center'}}>
                            <Text style={{fontFamily:fontBold,color:'#fff',fontSize:11}}>WEBSITE</Text>
                        </View>
                    </TouchableOpacity>
                </LinearGradient>
                <LinearGradient colors={["orange","#d6a8e7","#5586cc"]} start={{ x: 0, y: 1 }} end={{ x: 1, y: 0 }} style={{borderRadius:10,padding:10,borderColor:'#5586cc',marginTop:10,flex:1}}>
                    <TouchableOpacity onPress={() => linkClicked('VIDEO LINK','videoLink','Video link...',activeProfile.videoLink)} style={{borderRadius:10,flexDirection:'row'}}>
                        <Feather name='video' size={24} color="#fff" />
                        <View style={{marginLeft:10,justifyContent:'center'}}>
                            <Text style={{fontFamily:fontBold,color:'#fff',fontSize:11}}>VIDEO</Text>
                        </View>
                    </TouchableOpacity>
                </LinearGradient>
            </View>
            <Modal visible={photoBrowserVisible} transparent={true} animationType="fade">
                <ImageViewer 
                    imageUrls={photosArray} 
                    enableSwipeDown={true} 
                    onSwipeDown={()=>setPhotoBrowserVisible(false)}  
                    renderFooter={(index) => <PhotoFooter photoData={{setPhotoBrowserVisible,index,photosArray,profileOwner}}/>}
                    footerContainerStyle={{}}
                />
            </Modal>
        </Animatable.View>
    )
})
const PhotoFooter = (props) => {
    const {setPhotoBrowserVisible,index,photosArray,profileOwner} = props.photoData;
    const {appState:{setConfirmDialog,updateProfile, showToast}} = useContext(AppContext)
    return(
        <View style={{flexDirection:'row',padding:15}}>
            <TouchableOpacity style={{marginLeft:!profileOwner ? (width / 2 - 33) : 0}} onPress={()=>{
                setPhotoBrowserVisible(false)
            }}>
                <FontAwesome name="remove" color="#fff" size={48}></FontAwesome>
            </TouchableOpacity>
            {profileOwner && (
                <TouchableOpacity style={{marginLeft:width-110}} onPress={()=>{
                    setConfirmDialog({isVisible:true,text:`Are you sure you want to delete this photo? This can not be undone!`,okayBtn:'Cancel',cancelBtn:'Delete',severity:true,response:(res) => { 
                        if(!res){
                            const photos = photosArray.filter((item,i) => i !== index);
                            updateProfile("photos",photos)
                            showToast("Photo deleted");
                            setPhotoBrowserVisible(false);
                        }
                    }})
                }}>
                    <MaterialIcons name="delete-forever" color="tomato" size={48}></MaterialIcons>
                </TouchableOpacity>
            )}
        </View>
    )
}
export default Photos