import React, { useState, useEffect, useContext } from 'react'
import { StyleSheet, Text, View, TextInput, TouchableOpacity, FlatList, Image, RefreshControl } from 'react-native'
import { LogBox } from 'react-native';
import { uid } from '../../services/uid';
import { INVENTORY } from '../../data/InventoryData'
import { AuthContext } from '../../auth/AuthProvider'

import InventoryApi from '../../api/InventoryAPIs/CreateInventory'
import MarketplaceAPI from '../../api/MarketplaceAPI'

import Spinner from 'react-native-loading-spinner-overlay';
import AsyncStorage from '@react-native-async-storage/async-storage'
import Icon from 'react-native-vector-icons/FontAwesome'
import Icon1 from 'react-native-vector-icons/AntDesign';
import InventoryDeal from '../../components/DealCard/InventoryDeal';
import HeaderDeal from '../../components/DealCard/HeaderDeal';

import { HeaderStyle } from '../../constants/Styles';

const Header = ({goBack, profile}) => {
    return (
        <View style={HeaderStyle.mainContainer}>
            <View style={HeaderStyle.arrowbox}>
                <TouchableOpacity onPress={goBack}>
                    <Icon1 name="left" color="#1A1E25" size={20} />
                </TouchableOpacity>
            </View>

            <View style={HeaderStyle.HeaderTextContainer}>
                <Text style={HeaderStyle.HeaderText}>View Inventory</Text>
                <Image style={HeaderStyle.HeaderImage} resizeMode='contain' source={{ uri: profile }} />
            </View>
        </View>
    )
}

export default function DealInventories({route, navigation }) {
    const items =route.params;
    // const { id } = items
    // console.log("DealLeads Data :", items )

    const {
        societyName,
        budget,
        size,
        sizeType,
        property_type,
        type, 
        businessID,
        id,
        inventoryProperty
    } = items


    console.log("<><><><>",inventoryProperty)
    const { user } = useContext(AuthContext);

    const [inventoryList, setInventoryList] = useState([])
    const [marketplaceList, setMarketplaceList] = useState([])
    const [filteredDataSource, setFilteredDataSource] = useState([]);
    const [totalProperties, setTotalProperties] = useState(0)
    const [loading, setLoading] =  useState(false)

    LogBox.ignoreLogs([
        "[react-native-gesture-handler] Seems like you\'re using an old API with gesture components, check out new Gestures system!",
    ]);

    useEffect(() => {
        // loadInventoryList()
        const unsubscribe = navigation.addListener('focus', () => {
            loadInventoryList()
        });
        return () => {
          unsubscribe;
        };
    }, [])

    const loadInventoryList = async () => {
        setInventoryList([]);
        setFilteredDataSource([])
        setLoading(true)
        const userID = user.uid
        var city = await AsyncStorage.getItem("@city");

        const response = await InventoryApi.getInventory(userID, type, businessID);
        const marketplaceResponse = await MarketplaceAPI.dealMarketplaceInventories(id, userID, city, "Pakistan")

        console.log("response[Inventory]: ", response)
        console.log("marketplaceResponse[Inventory]: ", marketplaceResponse)
        if (response && response.length > 0) {
            const merged = (response).concat(marketplaceResponse)
            setInventoryList(merged)
            setFilteredDataSource(merged)
            setTotalProperties(merged.length)
            setLoading(false)
        }
        else {
            setLoading(false)
        }
    }

    // const getMarketplaceInventory = async () => {
    //     setMarketplaceList([])
    //     setLoading(true)
    //     const response
    // }


    console.log(inventoryList)

    return (
        <View style={styles.screen}>
            {
                loading ?
                    <Spinner visible={true} />
                :
                    null
            }
            {/* Header Component */}
            <Header
                goBack={()=>navigation.goBack()}
                profile={user.photoURL}
            />
            
            {/* Show Inventory  */}
            <View style={{width:'95%',alignSelf:'center'}}>
                <View style={{marginLeft:5,marginBottom:10, marginTop:20}}>
                    <Text style={styles.screenHeading}>My Inventory</Text>
                    <Text style={styles.totalInventory}>Related details</Text>
                </View>
            </View>
            
            {
                property_type == "Rent" ?
            
                <FlatList
                    data={inventoryList}
                    keyExtractor={(stock) => stock.id}
                    renderItem={({ item, index }) => {
                        if (item.viewStatus !== "Rejected" && societyName == item.societyName && inventoryProperty == item.propertyType  && item.transactionType == "Let") {
                            return(
                                <InventoryDeal
                                    cityName={item.cityName}
                                    societyName={item.societyName}
                                    houseName={item.houseName}
                                    rent={item.demand}
                                    rooms={item.rooms.bedrooms}
                                    area={item.size}
                                    areatype={item.sizeType}
                                    propertyImg ={item.propertyImg}
                                    viewStatus ={item.viewStatus}
                                    transactionType={item.transactionType}
                                    propertyType={item.propertyType}
                                    navigation = {()=>navigation.navigate("DealInfo", {items, item})}
                                    // image="https://images.pexels.com/photos/323780/pexels-photo-323780.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
                                    // navigatePress={()=>navigation.navigate('DealInfo', item)}
                                />
                            )
                            
                        }
                    }}
                />
                : 
                property_type == "Buy" ? 
                <FlatList
                    data={inventoryList}
                    keyExtractor={(stock) => stock.id}
                    renderItem={({ item, index }) => {
                        if (item.viewStatus !== "Rejected" && societyName == item.societyName && inventoryProperty == item.propertyType && item.transactionType == "Sale") {
                            return(
                                <InventoryDeal
                                    cityName={item.cityName}
                                    societyName={item.societyName}
                                    houseName={item.houseName}
                                    rent={item.demand}
                                    rooms={item.rooms.bedrooms}
                                    area={item.size}
                                    areatype={item.sizeType}
                                    propertyImg ={item.propertyImg}
                                    viewStatus ={item.viewStatus}
                                    transactionType={item.transactionType}
                                    propertyType={item.propertyType}
                                    navigation = {()=>navigation.navigate("DealInfo", {items, item})}
                                    // image="https://images.pexels.com/photos/323780/pexels-photo-323780.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
                                    // navigatePress={()=>navigation.navigate('DealInfo', item)}
                                />
                            )
                            
                        }
                         else if(item.viewStatus == "Inconsidration" && societyName == item.societyName && inventoryProperty == item.propertyType && item.transactionType == "Sale"){
                            return (
                                <InventoryDeal
                                    cityName={item.cityName}
                                    societyName={item.societyName}
                                    houseName={item.houseName}
                                    rent={item.demand}
                                    rooms={item.rooms.bedrooms}
                                    area={item.size}
                                    areatype={item.sizeType}
                                    propertyImg ={item.propertyImg}
                                    viewStatus ={item.viewStatus}
                                    transactionType={item.transactionType}
                                    propertyType={item.propertyType}
                                    navigation = {()=>navigation.navigate("DealInfo", {items, item})}
                                    // image="https://images.pexels.com/photos/323780/pexels-photo-323780.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
                                    // navigatePress={()=>navigation.navigate('DealInfo', item)}
                                />
                            )
                        }
                    }}
                    refreshControl={<RefreshControl refreshing={loading} onRefresh={loadInventoryList} />}
                />
                :null
            }
            
        </View>
    )
}

const styles = StyleSheet.create({
    screen: {
        backgroundColor: '#FCFCFC',
        flex: 1
    },
    typeContainer:{
        marginTop:15,
        // borderColor:'red',
        // borderWidth:1,
        width:'60%',
        alignSelf:'flex-end',
        flexDirection:'row',
        alignItems:'center',
        justifyContent:'space-between',
        // marginRight:10
    },
    type:{
        backgroundColor:'#F2F2F3',
        borderColor:'#E3E3E7',
        borderWidth:1,
        borderRadius:6,
        alignItems:'center',
        justifyContent:'center',
        width:66,
        height:35,
        elevation:3
        // flex:1
    },
    typeText:{
        color: '#1A1E25',
        fontFamily: 'Lato',
        fontWeight: '400',
        fontSize: 12,
        fontStyle: 'normal',
        alignSelf:'center',
        textAlign:'center'
    },
    screenHeading:{
        color: '#1A1E25',
        fontFamily: 'SF Pro Text',
        fontWeight: '700',
        fontSize: 20,
        fontStyle: 'normal',
    },
    totalInventory:{
        color: '#7D7F88',
        fontFamily: 'SF Pro Text',
        fontWeight: '400',
        fontSize: 12,
        fontStyle: 'normal',
        marginTop:5
    }
})