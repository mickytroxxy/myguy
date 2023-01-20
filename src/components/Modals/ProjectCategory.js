import React, { memo, useContext, useState, useEffect } from 'react'
import { View, TouchableOpacity,Platform, Text,ScrollView } from 'react-native'
import { AppContext } from '../../context/AppContext';
import { Ionicons} from "@expo/vector-icons";
const ProjectCategory = memo((props) => {
    const {appState:{setModalState,fontFamilyObj:{fontBold,fontLight},categories,setCategories,selectedCategory,industry,setIndustry}} = useContext(AppContext);
    useEffect(() => {
        setIndustry(selectedCategory.attr[0]);
    },[selectedCategory]);
    const onIndustrySelect = industry => setIndustry(industry)
    return (
        <View>
            <View style={{flexDirection:'row',marginTop:10,justifyContent:'space-between'}}>
                {categories?.map((item,i) => {
                    return(
                        <TouchableOpacity key={i} onPress={() => setCategories(categories.map(data => data.type === item.type ? {...data,selected:true} : {...data,selected:false}))}  style={{borderRadius:10,padding:8,borderColor:!item.selected ? "orange" : "green",borderWidth:1,flexDirection:'row',width:'48%',marginBottom:5}}>
                            <Ionicons name='heart-circle-outline' size={24} color={!item.selected ? "orange" : "green"} />
                            <View style={{marginLeft:10,justifyContent:'center'}}>
                                <Text style={{fontFamily:fontBold,color:!item.selected ? "orange" : "green",fontSize:11}}>{item.type}</Text>
                            </View>
                        </TouchableOpacity>
                    )
                })}
            </View>
            <TouchableOpacity onPress={() => {
                setModalState({isVisible:true,attr:{headerText:'SELECT INDUSTRY',list:selectedCategory.attr,cb:onIndustrySelect}});
            }}  style={{borderRadius:10,padding:5,borderColor:"#14678B",borderWidth:1,flexDirection:'row',width:'100%'}}>
                <Ionicons name='heart-circle-outline' size={24} color={"green"} />
                <View style={{marginLeft:10,justifyContent:'center'}}>
                    <Text style={{fontFamily:fontBold,color:"green",fontSize:11}}>{industry}</Text>
                </View>
            </TouchableOpacity>
        </View>
    )
})

export default ProjectCategory