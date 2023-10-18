import React, { useState, useEffect, useContext } from 'react'
import {
    Image,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
    Alert,
    ActivityIndicator,
    ImageBackground,
    ScrollView,
    Button,
    Dimensions,
    BackHandler,
    FlatList,
    RefreshControl,
    Modal
} from 'react-native';

import { AuthContext } from '../../auth/AuthProvider'

import InventoryApi from '../../api/InventoryAPIs/CreateInventory'

const InventoryDetailsCard = ({ propertyImg, houseName, address, rooms, area, areatype, rent, transactionType, backPress }) => {
    return (
        <View style={inventoryModalStyles.card}>
            <View style={inventoryModalStyles.imageContainer}>

                {
                    propertyImg ?
                        <Image
                            source={{ uri: propertyImg }}
                            style={{ width: '100%', height: '100%' }}
                            resizeMode='stretch'
                        />
                        :
                        <Image
                            //source={require('../assets/images/image2.jpg')}
                            source={require('../../assets/images/nommage.jpg')}
                            style={{ width: '100%', height: '100%' }}
                            resizeMode='contain'
                        />
                }

            </View>
            <View style={inventoryModalStyles.detailsContainer}>
                <TouchableOpacity
                    style={inventoryModalStyles.AddTaskButton}
                    onPress={backPress}
                >
                    <Text style={inventoryModalStyles.AddTaskButtonText}>Inconsideration</Text>
                </TouchableOpacity>
                <Text style={inventoryModalStyles.houseName}>{houseName}</Text>
                <Text style={inventoryModalStyles.houseAddress}>{address}</Text>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', width: '60%', marginTop: 10, alignItems: 'center' }}>
                    <Icon2
                        name='bed'
                        color='#7D7F88'
                        size={14}
                    />
                    <Text style={inventoryModalStyles.houseAddress}>{rooms} Rooms</Text>
                    <Icon2
                        name='home'
                        color='#7D7F88'
                        size={14}
                    />
                    <Text style={inventoryModalStyles.houseAddress}>{area + " " + areatype}</Text>
                </View>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', width: '90%', alignItems: 'center', marginBottom: 10 }}>
                    <Text style={inventoryModalStyles.houseRent}>Rs. {rent.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                        {
                            transactionType == "Sale" ?
                                <Text style={inventoryModalStyles.rentType}></Text>
                                :
                                <Text style={inventoryModalStyles.rentType}>/ month</Text>
                        }
                    </Text>
                    {/* <Text style={styles.typeText}>Inventory</Text> */}
                </View>
            </View>
        </View>
    )
}

export default function CustomMatched() {
    const { user } = useContext(AuthContext);

    const [inventories, setInventories] = useState([])

    // inventory filter
    const [filterSale, setFilterSale] = useState(true)
    const [filterLet, setFilterLet] = useState(false)

    useEffect(() => {
        getInventories()
    }, [])

    const getInventories = async () => {
        const userID = user.uid
        // console.log(userID)
        const response = await InventoryApi.getInventory(userID, 0, "business");
        console.log("response=>>>>Inventory=>>", response)
        if (response && response.length > 0) {
            setInventories(response)
            // setFilteredDataSource(response)
            // setTotalProperties(response.length)
            // setLoading(false)
        }
        else {
            // setLoading(false)
            setInventories([])
        }
    }

    const changeFilterHandler = (id) => {
        switch (id) {
            case 1:
                setFilterSale(true)
                setFilterLet(false)
                break;
            case 2:
                setFilterSale(false)
                setFilterLet(true)
                break;
        }
    }

    return (
        <View style={styles.screen}>
            <Text>CustomMatched</Text>
            <View style={styles.filterContainer}>
                <TouchableOpacity
                    style={[styles.filterButton, { backgroundColor: filterSale ? '#826AF7' : '#F2F2F3' }]}
                    onPress={() => changeFilterHandler(1)}
                >
                    <Text style={[styles.filterButtonText, { color: filterSale ? '#FFFFFF' : '#7D7F88' }]}>For Sale</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={[styles.filterButton, { backgroundColor: filterLet ? '#826AF7' : '#F2F2F3' }]}
                    onPress={() => changeFilterHandler(2)}
                >
                    <Text style={[styles.filterButtonText, { color: filterLet ? '#FFFFFF' : '#7D7F88' }]}>To Let</Text>
                </TouchableOpacity>
            </View>

            {
                inventories.length < 0 ?
                    <Text style={{
                        color: '#917AFD',
                        alignSelf: 'center',
                        fontSize: 20,
                        marginTop: '20%',
                        fontWeight: "800"
                        ,
                    }}>Yo Have No Inventory</Text>
                    : null
            }

            {
                filterLet == false && filterSale == true ?
                    <FlatList
                        data={inventories}
                        keyExtractor={(stock) => stock.id}
                        renderItem={({ item, index }) => {
                            if (item.transactionType == 'Sale') {
                                return (
                                    <InventoryDetailsCard
                                        address={item.societyName + ", " + item.cityName}
                                        houseName={item.houseName}
                                        propertyImg={item.propertyImg}
                                        catagory={item.catagory}
                                        rent={item.demand}
                                        rooms={item.rooms.bedrooms}
                                        area={item.size}
                                        areatype={item.sizeType}
                                        transactionType={item.transactionType}
                                    //image="https://images.pexels.com/photos/323780/pexels-photo-323780.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
                                    // backPress={() => addInventoryToTaskHandler(item)}
                                    />
                                )
                            }
                        }}
                        refreshControl={<RefreshControl refreshing={false} onRefresh={getInventories} />}
                    />
                    :
                    filterLet == true && filterSale == false ?
                        <FlatList
                            data={inventories}
                            keyExtractor={(stock) => stock.id}
                            renderItem={({ item, index }) => {
                                if (item.transactionType == 'Let') {
                                    return (
                                        <InventoryDetailsCard
                                            address={item.societyName + ", " + item.cityName}
                                            houseName={item.houseName}
                                            propertyImg={item.propertyImg}
                                            catagory={item.catagory}
                                            rent={item.demand}
                                            rooms={item.rooms.bedrooms}
                                            area={item.size}
                                            areatype={item.sizeType}
                                            transactionType={item.transactionType}
                                        // backPress={() => addInventoryToTaskHandler(item)}
                                        //image="https://images.pexels.com/photos/323780/pexels-photo-323780.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
                                        // navigatePress={() => navigation.navigate('InventoryDetailScreen', item)}
                                        />
                                    )
                                }
                            }}
                            refreshControl={<RefreshControl onRefresh={getInventories} />}
                        />
                        : <Text style={inventoryModalStyles.errorText}>No Inventories Found</Text>
            }
        </View>
    )
}

const styles = StyleSheet.create({
    screen: {
        height: '70%',
        backgroundColor: 'white',
        marginTop: 'auto',
        borderTopRightRadius: 10,
        borderTopLeftRadius: 10,
        borderTopColor: 'gray',
        borderTopWidth: 1
        // elevation:9
    },
    filterContainer: {
        // borderColor:'red',
        // borderWidth:1, 
        flexDirection: 'row',
        marginTop: 20,
        width: 140,
        alignSelf: 'flex-end',
        justifyContent: 'space-between',
        marginRight: 15
    },
    filterButton: {
        width: 64,
        backgroundColor: '#826AF7',
        height: 30,
        borderRadius: 4,
        // alignItems:'center',
        justifyContent: 'center',
        elevation: 2
    },
    filterButtonText: {
        fontSize: 10,
        color: 'white',
        alignSelf: 'center',
        fontWeight: '400'
    },
})

const inventoryModalStyles = StyleSheet.create({
    filterContainer: {
        // borderColor:'red',
        // borderWidth:1, 
        flexDirection: 'row',
        marginTop: 20,
        width: 140,
        alignSelf: 'flex-end',
        justifyContent: 'space-between',
        marginRight: 15
    },
    filterButton: {
        width: 64,
        backgroundColor: '#826AF7',
        height: 30,
        borderRadius: 4,
        // alignItems:'center',
        justifyContent: 'center',
        elevation: 2
    },
    filterButtonText: {
        fontSize: 10,
        color: 'white',
        alignSelf: 'center',
        fontWeight: '400'
    },
    screenHeading: {
        color: '#1A1E25',
        fontSize: 18,
        fontWeight: '600',
        fontStyle: 'normal',
        fontFamily: 'SF Pro Text',
        letterSpacing: 0.13,
        marginTop: 10,
        marginLeft: 10
    },
    totalInventory: {
        color: '#7D7F88',
        fontFamily: 'SF Pro Text',
        fontWeight: '400',
        fontSize: 12,
        fontStyle: 'normal',
        marginTop: 5,
        marginLeft: 10,
        marginBottom: 5
    },
    card: {
        marginTop: 10,
        // borderColor:'red',
        // borderWidth:1,
        height: 175,
        marginBottom: 10,
        flexDirection: 'row',
        backgroundColor: 'white',
        elevation: 3,
        borderRadius: 10,
        overflow: 'hidden',
        width: '95%',
        alignSelf: 'center'
    },
    imageContainer: {
        width: '30%',
        alignItems: 'center',
        // borderColor:'green',
        // borderWidth:1
    },
    detailsContainer: {
        width: '70%',
        // borderColor:'blue',
        // borderWidth:1,
        marginLeft: 15,
        // justifyContent:'space-between'
    },
    rating: {
        color: '#1A1E25',
        fontFamily: 'SF Pro Text',
        fontWeight: '400',
        fontSize: 12,
        fontStyle: 'normal',
        // marginTop: 10
    },
    houseName: {
        color: '#1A1E25',
        fontFamily: 'SF Pro Text',
        fontWeight: '400',
        fontSize: 17,
        fontStyle: 'normal',
        // marginTop: 5
    },
    houseAddress: {
        color: '#7D7F88',
        fontFamily: 'SF Pro Text',
        fontWeight: '400',
        fontSize: 13,
        fontStyle: 'normal',
        flex: 1,
        marginLeft: 3
        // marginTop: 5
    },
    houseRent: {
        color: '#1A1E25',
        fontFamily: 'SF Pro Text',
        fontWeight: '700',
        fontSize: 18,
        fontStyle: 'normal',
        marginTop: 10
        // alignSelf:'flex-end'
    },
    rentType: {
        color: '#7D7F88',
        fontFamily: 'SF Pro Text',
        fontWeight: '400',
        fontSize: 13,
        fontStyle: 'normal'
    },
    AddTaskButton: {
        width: 70,
        backgroundColor: '#F0F0F1',
        height: 30,
        borderRadius: 4,
        // alignItems:'center',
        justifyContent: 'center',
        elevation: 1,
        alignSelf: "flex-end",
        marginRight: 30,
        marginTop: 10
    },
    AddTaskButtonText: {
        fontSize: 10,
        color: '#7D7F88',
        alignSelf: 'center',
        fontWeight: '400'
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