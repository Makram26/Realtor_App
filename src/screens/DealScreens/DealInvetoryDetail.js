import React, { useState } from 'react'
import { StyleSheet, Text, View, TouchableOpacity, Image, ScrollView, Dimensions } from 'react-native'
import { BackgroundImage } from 'react-native-elements/dist/config';
import Spinner from 'react-native-loading-spinner-overlay';
import Icon from 'react-native-vector-icons/Ionicons'
import Icon1 from 'react-native-vector-icons/Entypo'
import Icon2 from 'react-native-vector-icons/MaterialIcons'
import Icon3 from 'react-native-vector-icons/AntDesign'
// import MapView, { Marker } from 'react-native-maps';

const { width } = Dimensions.get('window')
const height = width * 0.4

export default function DealInventoryDetail({ route, navigation }) {
    const items = route.params
    // console.log("items", items)
    // const { inventoryAddress, inventoryId, inventoryTransactionType, inventoryPropertyType, inventoryDemand, inventoryRooms, inventorySize, inventorySizeType, inventoryPropertyImg, inventoryFacilities } = items.inventoryDetail
    const [loading, setLoading] = useState(false)
    return (
        <View style={styles.body}>
            <ScrollView contentContainerStyle={{ flexGrow: 1, backgroundColor: "#FCFCFC" }}>
                {
                    loading ?
                        <Spinner visible={true} />
                        :
                        null
                }

                {/* Image Container */}
                {
                    items.inventoryDetail.propertyImg ?
                        <BackgroundImage
                            source={{ uri: items.inventoryDetail.propertyImg }}
                            style={{ width: "100%", alignSelf: 'center', height: 269, backgroundColor: 'white' }}>
                            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                                <TouchableOpacity style={styles.headerIconContainer} onPress={() => navigation.pop()}>
                                    <Icon
                                        name='chevron-back-outline'
                                        color="black"
                                        size={25}
                                    />
                                </TouchableOpacity>
                                {/* <TouchableOpacity
                                    style={styles.headerIconContainer}
                                // onPress={() => navigation.navigate('EditInventory', items)}
                                >
                                    <Image
                                        source={require('../../assets/icons/Edit.png')}
                                        style={{ width: 18, height: 18 }}
                                    />
                                </TouchableOpacity> */}
                            </View>
                        </BackgroundImage>
                        :
                        <BackgroundImage
                            source={require('../../assets/images/nommage.jpg')}
                            style={{ width: "100%", alignSelf: 'center', height: 269, backgroundColor: 'white' }}
                            resizeMode="contain"
                        >
                            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                                <TouchableOpacity style={styles.headerIconContainer} onPress={() => navigation.pop()}>
                                    <Icon
                                        name='chevron-back-outline'
                                        color="black"
                                        size={25}
                                    />
                                </TouchableOpacity>
                                {/* <View
                                    style={styles.headerIconContainer}
                                // onPress={() => navigation.navigate('EditInventory', items)}
                                >
                                    <Image
                                        source={require('../../assets/icons/Edit.png')}
                                        style={{ width: 18, height: 18 }}
                                    />
                                </View> */}
                            </View>
                        </BackgroundImage>
                }

                {/* Data Container */}
                <View style={{ width: '90%', marginLeft: "5%" }}>

                    <View style={{ marginTop: 20, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Text style={{ fontSize: 18, fontWeight: '600', color: '#1A1E25' }}>Property Category</Text>
                        <Text style={{ fontSize: 17, fontWeight: '400', color: '#7D7F88' }}>{items.inventoryDetail.propertyType}</Text>
                    </View>

                    {/* Property Type and Favorite Icon */}
                    <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 5, marginTop: 20 }}>
                        {
                            items.inventoryDetail.houseName !== "" ?
                                <>
                                    {
                                        items.inventoryDetail.propertyType === "Files" ?
                                            <Text style={{ fontSize: 20, height: 40, fontWeight: '700', color: '#1A1E25' }}>
                                                File# <Text style={{ fontSize: 18, fontWeight: '500', color: '#1A1E25', lineHeight: 20 }}>
                                                    {items.inventoryDetail.houseName}
                                                </Text>
                                            </Text>
                                            :
                                            <Text style={{ fontSize: 20, height: 40, fontWeight: '700', color: '#1A1E25' }}>
                                                House# <Text style={{ fontSize: 18, fontWeight: '500', color: '#1A1E25', lineHeight: 20 }}>
                                                    {items.inventoryDetail.houseName}
                                                </Text>
                                            </Text>
                                    }
                                </>
                                :
                                null
                        }
                    </View>

                    {/* Property Description */}
                    <View>
                        {/* <View style={{ flexDirection: 'row' ,justifyContent:'space-between'}}> */}
                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                            <Image source={require('../../assets/icons/location.png')} />
                            <Text style={{ fontSize: 16, fontWeight: '400', marginLeft: 6, color: '#7D7F88' }}>
                                {items.inventoryDetail.societyName + ", " + items.inventoryDetail.cityName}
                            </Text>
                        </View>

                        {
                            items.inventoryDetail.propertyType == 'Plot' || items.inventoryDetail.propertyType == 'Files' || items.inventoryDetail.propertyType == 'Shop' || items.inventoryDetail.propertyType == 'Agriculture' ?
                                null
                                :
                                <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 5 }}>
                                    <Image source={require('../../assets/icons/room.png')} />
                                    <Text style={{ width: 154, fontSize: 16, fontWeight: '400', marginLeft: 6, color: '#7D7F88' }}>
                                        {items.inventoryDetail.rooms.bedrooms} Room
                                    </Text>
                                </View>
                        }

                        <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 5 }}>
                            <Image source={require('../../assets/icons/house.png')} />
                            <Text style={{ width: 154, fontSize: 16, fontWeight: '400', marginLeft: 6, color: '#7D7F88' }}>
                                {items.inventoryDetail.size} {items.inventoryDetail.sizeType}
                            </Text>
                        </View>
                    </View>
                    <View style={{ borderBottomWidth: 1, borderColor: "#E2E2E2", marginTop: 20 }} />

                    {/* Home Facilities */}
                    <View style={{ marginTop: 20 }}>
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                            <Text style={{ fontSize: 18, fontWeight: '700', color: '#1A1E25' }}>Facilities</Text>
                            {/* <Text style={{ fontSize: 14, fontWeight: '400', color: '#917AFD', marginTop: 6 }}>See All Facilities</Text> */}
                        </View>

                        <View style={{ flexWrap: 'wrap', justifyContent: 'space-between', width: '100%', flexDirection: 'row' }}>

                            {
                                items.inventoryDetail.facilities.gas ?
                                    <View style={{ marginTop: 15, flexDirection: 'row', width: '45%', }}>
                                        <Image source={require('../../assets/icons/Vector2.png')} style={{ width: 20, height: 20, marginRight: 4 }} />
                                        <Text style={{ fontSize: 16, fontWeight: '400', alignSelf: 'center', color: '#1A1E25', marginLeft: 5 }}>Sui Gas</Text>
                                    </View>
                                    : null
                            }


                            {
                                items.inventoryDetail.facilities.mainRoad ?
                                    <View style={{ marginTop: 15, flexDirection: 'row', width: '45%', }}>
                                        <Icon
                                            name='water'
                                            color="#7D7F88"
                                            size={18}
                                            style={{ width: 20, height: 20 }}
                                        />
                                        <Text style={{ fontSize: 16, fontWeight: '400', alignSelf: 'center', color: '#1A1E25', marginLeft: 5 }}>Main Road</Text>
                                    </View>
                                    : null
                            }



                            {
                                items.inventoryDetail.facilities.facingPark ?
                                    <View style={{ marginTop: 15, flexDirection: 'row', width: '45%', }}>
                                        <Image source={require('../../assets/icons/Vector5.png')} style={{ width: 20, height: 20, marginRight: 4 }} />
                                        <Text style={{ fontSize: 16, fontWeight: '400', alignSelf: 'center', color: '#1A1E25', marginLeft: 5 }}>Facing Park</Text>

                                    </View>
                                    : null
                            }
                            {
                                items.inventoryDetail.facilities.corner ?
                                    <View style={{ marginTop: 15, flexDirection: 'row', width: '45%', }}>
                                        <Icon2
                                            name='electrical-services'
                                            color="#7D7F88"
                                            size={18}
                                            style={{ width: 20, height: 20, }}
                                        />
                                        <Text style={{ fontSize: 16, fontWeight: '400', alignSelf: 'center', color: '#1A1E25', marginLeft: 5 }}>Corner</Text>
                                    </View>
                                    : null
                            }
                            {
                                items.inventoryDetail.facilities.ownerBuild ?
                                    <View style={{ marginTop: 15, flexDirection: 'row', width: '45%', }}>
                                        <Image source={require('../../assets/icons/Vector1.png')} style={{ width: 20, height: 20, marginRight: 9 }} />
                                        <Text style={{ fontSize: 16, fontWeight: '400', alignSelf: 'center', color: '#1A1E25', marginLeft: 5 }}>Owner Built</Text>
                                    </View>
                                    : null
                            }
                            {
                                items.inventoryDetail.facilities.gated ?
                                    <View style={{ marginTop: 15, flexDirection: 'row', width: '45%' }}  >
                                        <Image source={require('../../assets/icons/Vector3.png')} style={{ width: 20, height: 20, marginRight: 9 }} />
                                        <Text style={{ fontSize: 16, fontWeight: '400', alignSelf: 'center', color: '#1A1E25', marginLeft: 5 }}>Gated</Text>
                                    </View>
                                    : null
                            }
                        </View>
                    </View>
                    <View style={{ borderBottomWidth: 1, borderColor: "#E2E2E2", marginTop: 25 }} />

                    {/* Description */}
                    <View style={{ marginTop: 20 }}>
                        <Text style={{ fontSize: 18, fontWeight: '600', color: '#1A1E25' }}>Description</Text>
                        <Text style={{ fontSize: 16, fontWeight: '400', color: '#7D7F88' }}>{items.inventoryDetail.description}</Text>
                    </View>

                </View>
            </ScrollView>

            {/* Payment Detail */}
            <View style={{ margin: 10, width: '90%', alignSelf: 'center', }}>
                <Text style={{ fontSize: 18, fontWeight: '600', color: '#917AFD', marginLeft: 10, marginTop: 10 }}>{items.inventoryDetail.transactionType == "Sale" ? "Demand" : "Budget"}</Text>
                <Text style={{ fontSize: 16, fontWeight: '400', color: '#8169F7', marginLeft: 10, marginTop: 10, marginBottom: 10 }}>PKR {items.inventoryDetail.demand.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")} {items.inventoryDetail.transactionType == "Sale" ? "" : "/ month"}</Text>
                {/* <Text style={{ fontSize: 14, fontWeight: '400', color: '#1A1E25', }}>Payment Estimation</Text> */}
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    body: {
        flex: 1,
        backgroundColor: '#FCFCFC'
    },
    header: {
        flexDirection: 'row',
        width: '95%',
        alignSelf: 'center',
        // borderColor: 'red',
        // borderWidth: 1,
        marginTop: 10,
        alignItems: 'center',
        justifyContent: 'space-between'
    },
    headerIconContainer: {
        backgroundColor: '#FCFCFC',
        borderWidth: 0.5,
        borderRadius: 50,
        borderColor: '#E3E3E7',
        width: 34,
        height: 34,
        alignItems: 'center',
        justifyContent: 'center',
        elevation: 7,
        margin: 20
    },

    headerIconContainerMove: {
        width: 34,
        height: 34,
        alignItems: 'center',
        justifyContent: 'center',
        elevation: 1,
        margin: 30,
    },

    imageText: {
        backgroundColor: "#FCFCFC",
        width: 58,
        height: 25,
        borderRadius: 40,
        justifyContent: 'center',
        alignItems: 'center',
        alignSelf: 'flex-end',
        marginTop: 60,
        marginRight: 30,
        elevation: 10,
    },

    headerText: {
        fontFamily: 'Lato',
        fontWeight: '700',
        fontSize: 21,
        color: '#404040'
    },

    favoriteIcon: {
        width: 20,
        height: 17.8,
        marginTop: 5,
        alignSelf: 'flex-end',
        marginRight: 5,
    },

    inventoryCard: {
        width: '95%',
        alignSelf: 'center',
        borderColor: '#c3c3c3',
        borderWidth: 1,
        marginTop: 30,
        marginBottom: 15,
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'space-between',
        borderRadius: 5,
        elevation: 9,
        backgroundColor: 'white',
        overflow: 'hidden'
    },
    imageContainer: {
        backgroundColor: 'white',
        height,
        width,
        elevation: 5,
        borderRadius: 6
    },

    btn: {
        backgroundColor: '#F2F0FB',
        marginTop: 18,
        height: 48,
        borderWidth: 1.5,
        borderRadius: 54,
        borderColor: '#917AFD',
        justifyContent: 'center',
        alignItems: 'center'
    }
})