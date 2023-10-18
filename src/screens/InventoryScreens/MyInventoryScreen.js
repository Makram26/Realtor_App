import React, { useState, useEffect, useContext } from 'react'
import { StyleSheet, Text, View, TextInput, TouchableOpacity, FlatList, RefreshControl, LogBox } from 'react-native'

import { AuthContext } from '../../auth/AuthProvider'
import InventoryApi from '../../api/InventoryAPIs/CreateInventory'
import PermissionAPI from '../../api/PermissionsAPIs/checkUserAPI'

import InventoryCard from '../../components/InventoryCard'
import Header from '../../components/Header'

import Spinner from 'react-native-loading-spinner-overlay';
import Icon from 'react-native-vector-icons/FontAwesome'
import AsyncStorage from '@react-native-async-storage/async-storage'

export default function MyInventoryScreen({ navigation }) {

    const [inventoryList, setInventoryList] = useState([])
    const [filteredDataSource, setFilteredDataSource] = useState([]);

    const [inventoryTypeBuy, setInventoryTypeBuy] = useState(false)
    const [inventoryTypeAll, setInventoryTypeAll] = useState(true)
    const [inventoryTypeLet, setInventoryTypeLet] = useState(false)
    const [totalProperties, setTotalProperties] = useState(0)
    // const [inventoryTypeBuy, setInventoryTypeBuy] = useState(false)

    const [loading, setLoading] = useState(false)
    const [search, setSearch] = useState('')

    const { user } = useContext(AuthContext);
    // console.log("user", user)

    const [accessType, setAccessType] = useState()
    const [accessBusinessID, setAccessBusinessID] = useState()

    LogBox.ignoreLogs([
        "[react-native-gesture-handler] Seems like you\'re using an old API with gesture components, check out new Gestures system!",
    ]);

    const [countryID, setCountryID] = useState('')

    useEffect(() => {
        getCurrency()
    }, [])

    const getCurrency = async () => {
        var country = await AsyncStorage.getItem("@country");
        console.log(">>>",country)
        setCountryID(country)
    }

    useEffect(() => {
        // loadInventoryList()
        checkPermissions()
        const unsubscribe = navigation.addListener('focus', () => {
            checkPermissions()
        });

        return () => {
            unsubscribe;
        };
    }, [])

    const checkPermissions = async () => {
        const response = await PermissionAPI.checkUserType(user.uid)
        console.log("type", response)
        if (response && response == 1) {
            const respone = await PermissionAPI.checkAccessType(user.uid)
            console.log("access", respone)
            setAccessType(respone[0].user_role)
            setAccessBusinessID(respone[0].businessID)
            loadInventoryList(respone[0].user_role, respone[0].businessID)

        }
        else {
            loadInventoryList("business", user.uid)
        }
    }


    const loadInventoryList = async (access, business) => {
        setInventoryList([]);
        setFilteredDataSource([])
        setLoading(true)
        const userID = user.uid
        // console.log(userID)
        const response = await InventoryApi.getInventory(userID, access, business);
        // console.log("response", response)
        if (response && response.length > 0) {
            setInventoryList(response)
            setFilteredDataSource(response)
            setTotalProperties(response.length)
            setLoading(false)
        }
        else {
            setLoading(false)
        }
    }

    const chnageInventoryTypeHandler = (name) => {
        switch (name) {
            case 1:
                setInventoryTypeBuy(false)
                setInventoryTypeLet(true)
                setInventoryTypeAll(false)
                break;
            case 2:
                setInventoryTypeBuy(true)
                setInventoryTypeLet(false)
                setInventoryTypeAll(false)
                break;
            case 3:
                navigation.navigate('AddNewInventory')
                break;
            case 4:
                setInventoryTypeAll(true)
                setInventoryTypeBuy(false)
                setInventoryTypeLet(false)
        }
    }

    const searchInventoryFilter = (text) => {
        if (text) {
            // const newData = inventoryList.filter((item) => {
            //     const itemData = item.societyName ? item.societyName.toUpperCase() : ''.toUpperCase();
            //     const textData = text.toUpperCase()
            //     return itemData.indexOf(textData) > -1
            // })
            const newData = inventoryList.filter(function (item) {
                if (item.societyName.toLowerCase().includes(text.toLowerCase())) {
                    return item;
                }
                if (item.houseName.toLowerCase().includes(text.toLowerCase())) {
                    return item;
                }
            });
            setFilteredDataSource(newData)
            setSearch(text)
        } else {
            setFilteredDataSource(inventoryList)
            setSearch(text)
        }
    }

    return (
        <View style={styles.screen}>
            {
                loading ?
                    <Spinner visible={true} />
                    :
                    null
            }
            <Header
                goBackPress={() => navigation.goBack()}
                propertyImg={user.photoURL}
                value={search}
                onChangeText={(text) => searchInventoryFilter(text)}
            />

            <View style={{ width: '95%', alignSelf: 'center' }}>
                <View style={styles.typeContainer}>
                    <TouchableOpacity style={[styles.type, { backgroundColor: inventoryTypeAll ? '#917AFD' : '#F2F2F3' }]} onPress={() => chnageInventoryTypeHandler(4)} >
                        <Text style={[styles.typeText, { color: inventoryTypeAll ? 'white' : '#1A1E25' }]}>All</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={[styles.type, { backgroundColor: inventoryTypeLet ? '#917AFD' : '#F2F2F3' }]} onPress={() => chnageInventoryTypeHandler(1)} >
                        <Text style={[styles.typeText, { color: inventoryTypeLet ? 'white' : '#1A1E25' }]}>To Let</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={[styles.type, { backgroundColor: inventoryTypeBuy ? '#917AFD' : '#F2F2F3' }]} onPress={() => chnageInventoryTypeHandler(2)} >
                        <Text style={[styles.typeText, { color: inventoryTypeBuy ? 'white' : '#1A1E25' }]}>For Sale</Text>
                    </TouchableOpacity>
                    {/* <TouchableOpacity style={styles.type} onPress={() => chnageInventoryTypeHandler(3)} >
                        <Text style={styles.typeText}>New Inventory</Text>
                    </TouchableOpacity> */}
                </View>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                    <View style={{ marginLeft: 5, marginBottom: 10, marginTop: 10 }}>
                        <Text style={styles.screenHeading}>My Inventory</Text>
                        <Text style={styles.totalInventory}>Total Properties: {totalProperties}</Text>
                    </View>
                    {/* Add inventory button */}
                    <TouchableOpacity
                        style={{
                            flexDirection: 'row',
                            alignSelf: 'center',
                            width: 110,
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            marginRight: 5
                        }}
                        onPress={() => navigation.navigate('AddNewInventory',
                            {
                                "type": accessType ? accessType : "business",
                                "businessID": accessBusinessID ? accessBusinessID : user.uid
                            }
                        )}
                    >
                        <Icon
                            name='plus'
                            color="#826AF7"
                            size={15}
                        />
                        <Text style={{
                            fontSize: 14,
                            fontWeight: '600',
                            fontFamily: 'Lato',
                            color: '#826AF7'
                        }}>Add Inventory</Text>
                    </TouchableOpacity>
                </View>
            </View>
            {
                filteredDataSource && filteredDataSource.length > 0 ?
                    inventoryTypeLet == true && inventoryTypeBuy == false && inventoryTypeAll == false ?
                        <FlatList
                            data={filteredDataSource}
                            keyExtractor={(stock) => stock.id}
                            renderItem={({ item, index }) => {
                                if (item.transactionType == 'Let') {
                                    return (
                                        <InventoryCard
                                            address={item.societyName + ", " + item.cityName}
                                            houseName={item.houseName}
                                            propertyImg={item.propertyImg}
                                            catagory={item.catagory}
                                            rent={item.demand}
                                            rooms={item.rooms.bedrooms}
                                            area={item.size}
                                            areatype={item.sizeType}
                                            transactionType={item.transactionType}
                                            propertyType={item.propertyType}
                                            //image="https://images.pexels.com/photos/323780/pexels-photo-323780.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
                                            navigatePress={() => navigation.navigate('InventoryDetailScreen', item)}
                                        />
                                    )
                                }
                            }}
                            refreshControl={<RefreshControl refreshing={loading} onRefresh={loadInventoryList} />}
                        />
                        :
                        inventoryTypeBuy == true && inventoryTypeLet == false && inventoryTypeAll == false ?
                            <FlatList
                                data={filteredDataSource}
                                keyExtractor={(stock) => stock.id}
                                renderItem={({ item, index }) => {
                                    if (item.transactionType == 'Sale') {
                                        return (
                                            <InventoryCard
                                                address={item.societyName + ", " + item.cityName}
                                                houseName={item.houseName}
                                                propertyImg={item.propertyImg}
                                                catagory={item.catagory}
                                                rent={item.demand}
                                                rooms={item.rooms.bedrooms}
                                                area={item.size}
                                                country={countryID}
                                                areatype={item.sizeType}
                                                transactionType={item.transactionType}
                                                propertyType={item.propertyType}
                                                //image="https://images.pexels.com/photos/323780/pexels-photo-323780.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
                                                navigatePress={() => navigation.navigate('InventoryDetailScreen', item)}
                                            />
                                        )
                                    }
                                }}
                                refreshControl={<RefreshControl refreshing={loading} onRefresh={loadInventoryList} />}
                            />
                            :
                            inventoryTypeBuy == false && inventoryTypeLet == false && inventoryTypeAll == true ?
                                <FlatList
                                    data={filteredDataSource}
                                    keyExtractor={(stock) => stock.id}
                                    renderItem={({ item, index }) => {
                                        // if (item.transactionType == 'Sale') {
                                        return (
                                            <InventoryCard
                                                address={item.societyName + ", " + item.cityName}
                                                houseName={item.houseName}
                                                propertyImg={item.propertyImg}
                                                catagory={item.catagory}
                                                rent={item.demand}
                                                rooms={item.rooms.bedrooms}
                                                area={item.size}
                                                country={countryID}
                                                areatype={item.sizeType}
                                                transactionType={item.transactionType}
                                                propertyType={item.propertyType}
                                                //image="https://images.pexels.com/photos/323780/pexels-photo-323780.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
                                                navigatePress={() => navigation.navigate('InventoryDetailScreen', item)}
                                            />
                                        )
                                        // }
                                    }}
                                    refreshControl={<RefreshControl refreshing={loading} onRefresh={loadInventoryList} />}
                                />
                                :
                                <Text style={styles.errorText}>No Inventories Found</Text>

                    :
                    <Text style={styles.errorText}>No Inventories Found</Text>
            }


        </View>
    )
}

const styles = StyleSheet.create({
    screen: {
        backgroundColor: '#FCFCFC',
        flex: 1
    },
    typeContainer: {
        marginTop: 15,
        // borderColor:'red',
        // borderWidth:1,
        width: '56%',
        alignSelf: 'flex-end',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        // marginRight:10
    },
    type: {
        backgroundColor: '#F2F2F3',
        borderColor: '#E3E3E7',
        borderWidth: 1,
        borderRadius: 6,
        alignItems: 'center',
        justifyContent: 'center',
        width: 66,
        height: 35,
        elevation: 1
        // flex:1
    },
    typeText: {
        color: '#1A1E25',
        fontFamily: 'Lato',
        fontWeight: '400',
        fontSize: 12,
        fontStyle: 'normal',
        alignSelf: 'center',
        textAlign: 'center'
    },
    screenHeading: {
        color: '#1A1E25',
        fontFamily: 'SF Pro Text',
        fontWeight: '700',
        fontSize: 20,
        fontStyle: 'normal',
    },
    totalInventory: {
        color: '#7D7F88',
        fontFamily: 'SF Pro Text',
        fontWeight: '400',
        fontSize: 12,
        fontStyle: 'normal',
        marginTop: 5
    },
    errorText: {
        color: '#917AFD',
        alignSelf: 'center',
        marginTop: '30%',
        fontSize: 25,
        fontWeight: 'bold',
        elevation: 6
    },

})