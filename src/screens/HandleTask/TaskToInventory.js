import React, { useContext, useState, useEffect } from 'react'
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
    RefreshControl,
    FlatList
} from 'react-native';

import { HeaderStyle } from '../../constants/Styles';
import { AuthContext } from '../../auth/AuthProvider'
import InventoryApi from '../../api/InventoryAPIs/CreateInventory'

import Icon from 'react-native-vector-icons/AntDesign';
import Icon2 from 'react-native-vector-icons/FontAwesome'

const Header = ({ goBack, photoURL }) => {
    return (
        <View style={HeaderStyle.mainContainer}>
            <View style={HeaderStyle.arrowbox}>
                <TouchableOpacity onPress={goBack}>
                    <Icon name="left" color="#1A1E25" size={20} />
                </TouchableOpacity>
            </View>
            <View style={HeaderStyle.HeaderTextContainer}>
                <Text style={HeaderStyle.HeaderText}>Link Inventory</Text>
                <Image
                    style={HeaderStyle.HeaderImage} resizeMode='contain'
                    //source={require('../../assets/images/personpic.png')}
                    source={{ uri: photoURL }}
                />
            </View>
        </View>
    )
}

const InventoryCard = ({ propertyImg, houseName, address, rooms, area, areatype, rent, transactionType, backPress }) => {
    return (
        <View style={styles.card}>
            <View style={styles.imageContainer}>
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
            <View style={styles.detailsContainer}>
                <TouchableOpacity
                    style={styles.AddTaskButton}
                    onPress={backPress}
                >
                    <Text style={styles.AddTaskButtonText}>Add to Task</Text>
                </TouchableOpacity>
                <Text style={styles.houseName}>{houseName}</Text>
                <Text style={styles.houseAddress}>{address}</Text>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', width: '60%', marginTop: 10, alignItems: 'center' }}>
                    <Icon2
                        name='bed'
                        color='#7D7F88'
                        size={14}
                    />
                    <Text style={styles.houseAddress}>{rooms} Rooms</Text>
                    <Icon2
                        name='home'
                        color='#7D7F88'
                        size={14}
                    />
                    <Text style={styles.houseAddress}>{area + " " + areatype}</Text>
                </View>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', width: '90%', alignItems: 'center', marginBottom: 10 }}>
                    <Text style={styles.houseRent}>Rs. {rent.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                        {
                            transactionType == "Sale" ?
                                <Text style={styles.rentType}></Text>
                                :
                                <Text style={styles.rentType}>/ month</Text>
                        }
                    </Text>
                    {/* <Text style={styles.typeText}>Inventory</Text> */}
                </View>
            </View>
        </View>
    )
}

export default function TaskToInventory({ navigation }) {
    const { user } = useContext(AuthContext);

    // filter states
    const [filterSale, setFilterSale] = useState(true)
    const [filterLet, setFilterLet] = useState(false)

    const [inventoryList, setInventoryList] = useState([])
    const [totalProperties, setTotalProperties] = useState(0)

    const [loading, setLoading] = useState(false)

    useEffect(() => {
        getInventories()
    }, [])

    const getInventories = async () => {
        const userID = user.uid
        // console.log(userID)
        const response = await InventoryApi.getInventory(userID);
        console.log("response=>>>>=>>", response)
        if (response && response.length > 0) {
            setInventoryList(response)
            // setFilteredDataSource(response)
            setTotalProperties(response.length)
            setLoading(false)
        }
        else {
            setLoading(false)
            setInventoryList([])
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
            <Header
                goBack={() => navigation.pop(1)}
                photoURL={user.photoURL}
            />

            <View style={styles.body}>
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

                <Text style={styles.screenHeading}>My Inventory</Text>
                <Text style={styles.totalInventory}>Total Properties: 2</Text>

                {
                    filterLet == false && filterSale == true ?
                        <FlatList
                            data={inventoryList}
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
                                            areatype={item.sizeType}
                                            transactionType={item.transactionType}
                                            //image="https://images.pexels.com/photos/323780/pexels-photo-323780.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
                                            backPress={() => navigation.navigate('CreateTask', { "item": item, "type": "Inventory" })}
                                        />
                                    )
                                }
                            }}
                            refreshControl={<RefreshControl refreshing={loading} onRefresh={getInventories} />}
                        />
                        :
                        filterLet == true && filterSale == false ?
                            <FlatList
                                data={inventoryList}
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
                                                backPress={() => navigation.navigate('CreateTask', { "item": item, "type": "Inventory" })}
                                            //image="https://images.pexels.com/photos/323780/pexels-photo-323780.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
                                            // navigatePress={() => navigation.navigate('InventoryDetailScreen', item)}
                                            />
                                        )
                                    }
                                }}
                                refreshControl={<RefreshControl refreshing={loading} onRefresh={getInventories} />}
                            />
                            : <Text style={styles.errorText}>No Inventories Found</Text>
                }

                {/* {
                    filterLet == false && filterSale == true ?
                        <Text style={styles.errorText}>No Inventories Found</Text>
                    :
                        <Text style={styles.errorText}>No Inventories Found</Text>
                } */}

            </View>

        </View>
    )
}

const styles = StyleSheet.create({
    screen: {
        backgroundColor: '#fcfcfc',
        flex: 1
    },
    body: {
        width: '92%',
        alignSelf: 'center',
        flex: 1
    },
    filterContainer: {
        // borderColor:'red',
        // borderWidth:1, 
        flexDirection: 'row',
        marginTop: 30,
        width: 140,
        alignSelf: 'flex-end',
        justifyContent: 'space-between'
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
    AddTaskButton: {
        width: 70,
        backgroundColor: '#F0F0F1',
        height: 30,
        borderRadius: 4,
        // alignItems:'center',
        justifyContent: 'center',
        elevation: 2,
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
    screenHeading: {
        color: '#1A1E25',
        fontSize: 20,
        fontWeight: '700',
        fontStyle: 'normal',
        fontFamily: 'SF Pro Text',
        letterSpacing: 0.13,
        marginTop: 10
    },
    totalInventory: {
        color: '#7D7F88',
        fontFamily: 'SF Pro Text',
        fontWeight: '400',
        fontSize: 12,
        fontStyle: 'normal',
        marginTop: 5
    },
    card: {
        marginTop: 10,
        // borderColor:'red',
        // borderWidth:1,
        height: 189,
        marginBottom: 10,
        flexDirection: 'row',
        backgroundColor: 'white',
        elevation: 3,
        borderRadius: 10,
        overflow: 'hidden',
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
        marginTop: 5
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
    typeText: {
        fontFamily: 'Lato',
        fontWeight: '900',
        fontSize: 14,
        color: '#826AF7',
        // alignSelf:'flex-end'
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