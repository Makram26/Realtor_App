import React, { useState, useContext } from 'react'
import { StyleSheet, Text, View, TouchableOpacity, Image, ScrollView, Dimensions, Modal } from 'react-native'
import { BackgroundImage } from 'react-native-elements/dist/config';

import { AuthContext } from '../../auth/AuthProvider'

import Spinner from 'react-native-loading-spinner-overlay';

import Icon from 'react-native-vector-icons/Ionicons'
import Icon1 from 'react-native-vector-icons/Entypo'
import Icon2 from 'react-native-vector-icons/MaterialIcons'

// import MapView, { Marker } from 'react-native-maps';

const { width } = Dimensions.get('window')
const height = width * 0.4

export default function InventoryDetailScreen({ route, navigation }) {
    const items = route.params
    const {
        societyName, cityName, id, transactionType, houseName,
        demand, rooms, size, sizeType, propertyImg, facilities, description, leadName, propertyType,
        businessID, name, role, catagory, isLead, toMarketplace, sellerName, sellerMobile } = items






    const { user } = useContext(AuthContext);

    const [loading, setLoading] = useState(false)

    const [showImageModal, setShowImageModal] = useState(false)
    console.log("...............", leadName)

    const imageModalOpenHandler = () => {
        setShowImageModal(true)
    }

    return (
        <View style={styles.body}>
            <ScrollView contentContainerStyle={{ flexGrow: 1, backgroundColor: "#fbfcfa" }}>
                {
                    loading ?
                        <Spinner visible={true} />
                        :
                        null
                }

                {/* Image Setting */}
                {/* {
                    propertyImg ? */}
                <BackgroundImage
                    source={propertyImg ? { uri: propertyImg } : require('../../assets/images/nommage.jpg')}
                    resizeMode={propertyImg ? null : "contain"}
                    style={{ width: "100%", alignSelf: 'center', height: 269, backgroundColor: 'white' }}>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                        <TouchableOpacity style={styles.headerIconContainer} onPress={() => navigation.pop()}>
                            <Icon
                                name='chevron-back-outline'
                                color="black"
                                size={25}
                            />
                        </TouchableOpacity>
                        {
                            isLead ?
                                null
                                :

                                <TouchableOpacity
                                    style={styles.headerIconContainer}
                                    onPress={() => navigation.navigate('EditInventory', items)}
                                >
                                    <Image
                                        source={require('../../assets/icons/Edit.png')}
                                        style={{ width: 18, height: 18 }}
                                    />
                                </TouchableOpacity>
                        }
                    </View>
                    {
                        propertyImg ?
                            <TouchableOpacity
                                style={{
                                    alignSelf: 'flex-end',
                                    marginTop: 150,
                                    backgroundColor: '#FCFCFC',
                                    borderWidth: 0.5,
                                    borderRadius: 50,
                                    borderColor: '#E3E3E7',
                                    width: 34,
                                    height: 34,
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    elevation: 7,
                                    marginRight: 15
                                }}
                                onPress={() => setShowImageModal(true)}
                            >
                                {/* <Image 
                                source={require('../../assets/icons/circles.png')}  
                                style={{width: 18, height:18}}
                            /> */}
                                <Icon
                                    name='expand-outline'
                                    size={15}
                                    color="black"
                                />
                            </TouchableOpacity>

                            :
                            null
                    }

                    {/* <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                            <TouchableOpacity style={styles.headerIconContainerMove}>
                                <Icon1
                                    name='triangle-left'
                                    color="#FCFCFC"
                                    size={25}
                                />
                            </TouchableOpacity>
                            <TouchableOpacity style={[styles.headerIconContainerMove, { rotation: 180 }]}>
                                <Icon1
                                    name='triangle-left'
                                    color="#FCFCFC"
                                    size={25}
                                />
                            </TouchableOpacity>
                        </View>

                        <View style={styles.imageText}>
                            <Text style={{ fontWeight: "400" }}> 1/1</Text>
                        </View> */}
                </BackgroundImage>
                {/* :
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
                                <TouchableOpacity
                                    style={styles.headerIconContainer}
                                    onPress={() => navigation.navigate('EditInventory', items)}
                                >
                                    <Image
                                        source={require('../../assets/icons/Edit.png')}
                                        style={{ width: 18, height: 18 }}
                                    />
                                </TouchableOpacity>
                            </View>
                        </BackgroundImage>
                } */}
                {/* -------------------------------------------- */}



                <View style={{ marginTop: 15, width: '90%', alignSelf: 'center' }}>

                    {/* View Tasks */}
                    <TouchableOpacity style={{
                        borderColor: '#917AFD',
                        borderWidth: 1,
                        borderRadius: 54,
                        height: 48,
                        backgroundColor: 'rgba(145, 122, 253, 0.07)',
                        justifyContent: 'center',
                        marginBottom: 15
                    }}
                        onPress={() => navigation.navigate('InventoryTasks', { "id": id, "items": items })}
                    >
                        <Text style={{
                            color: '#917AFD',
                            alignSelf: 'center',
                            fontSize: 17,
                            fontWeight: '700',
                            fontFamily: 'SF Pro Text'
                        }}>View Tasks</Text>
                    </TouchableOpacity>


                    {
                        leadName !== "" ?
                            <View style={{ marginTop: 20, flexDirection: 'row', justifyContent: 'space-between' }}>
                                <Text style={{ fontSize: 18, fontWeight: '600', color: '#1A1E25' }}>Lead Name</Text>
                                <Text style={{ fontSize: 17, fontWeight: '400', color: '#7D7F88', marginTop: 5 }}>{leadName}</Text>
                            </View> : null
                    }

                    {
                        name == !user.displayName ?
                            <View style={{ marginTop: 20, flexDirection: 'row', justifyContent: 'space-between' }}>
                                <Text style={{ fontSize: 18, fontWeight: '600', color: '#1A1E25' }}>Created By:</Text>
                                <Text style={{ fontSize: 17, fontWeight: '400', color: '#7D7F88', marginTop: 5 }}>{name}</Text>
                            </View> : null
                    }

                    <View style={{ marginTop: 20, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Text style={{ fontSize: 18, fontWeight: '600', color: '#1A1E25' }}>Seller Name</Text>
                        <Text style={{ fontSize: 17, fontWeight: '400', color: '#7D7F88', width: "55%", textAlign: "right" }}>{sellerName}</Text>
                    </View>
                    <View style={{ marginTop: 20, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Text style={{ fontSize: 18, fontWeight: '600', color: '#1A1E25' }}>Seller Mobile</Text>
                        <Text style={{ fontSize: 17, fontWeight: '400', color: '#7D7F88', width: "55%", textAlign: "right" }}>{sellerMobile}</Text>
                    </View>

                    <View style={{ marginTop: 20, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Text style={{ fontSize: 18, fontWeight: '600', color: '#1A1E25' }}>Property Category</Text>
                        <Text style={{ fontSize: 17, fontWeight: '400', color: '#7D7F88', width: "55%", textAlign: "right" }}>{catagory}</Text>
                    </View>
                    <View style={{ marginTop: 20, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Text style={{ fontSize: 18, fontWeight: '600', color: '#1A1E25' }}>Property Type</Text>
                        <Text style={{ fontSize: 17, fontWeight: '400', color: '#7D7F88', width: "55%", textAlign: "right" }}>{propertyType}</Text>
                    </View>

                    {/* Property Type and Favorite Icon */}
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 5, marginTop: 10, }}>
                        {
                            houseName !== "" ?
                                <>
                                    {
                                        propertyType === "Files" ?
                                            <Text style={{ fontSize: 20, fontWeight: '700', color: '#1A1E25' }}>
                                                File# <Text style={{ fontSize: 18, fontWeight: '500', color: '#1A1E25' }}>
                                                    {houseName}
                                                </Text>
                                            </Text>
                                            :
                                            <Text style={{ fontSize: 20, fontWeight: '700', color: '#1A1E25' }}>
                                                House# <Text style={{ fontSize: 18, fontWeight: '500', color: '#1A1E25', }}>
                                                    {houseName}
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
                                {societyName + ", " + cityName}
                            </Text>
                        </View>

                        {
                            propertyType == 'Plot' || propertyType == 'Files' || propertyType == 'Shop' || propertyType == 'Agriculture' ?
                                null
                                :
                                <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 5 }}>
                                    <Image source={require('../../assets/icons/room.png')} />
                                    <Text style={{ width: 154, fontSize: 16, fontWeight: '400', marginLeft: 6, color: '#7D7F88' }}>
                                        {rooms.bedrooms} Room
                                    </Text>
                                </View>
                        }

                        <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 5 }}>
                            <Image source={require('../../assets/icons/house.png')} />
                            <Text style={{ width: 154, fontSize: 16, fontWeight: '400', marginLeft: 6, color: '#7D7F88' }}>
                                {size} {sizeType}
                            </Text>
                        </View>
                    </View>


                    {/* Home Facilities */}
                    <View style={{ marginTop: 20 }}>
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                            <Text style={{ fontSize: 18, fontWeight: '700', color: '#1A1E25' }}>Facilities</Text>
                            {/* <Text style={{ fontSize: 14, fontWeight: '400', color: '#917AFD', marginTop: 6 }}>See All Facilities</Text> */}
                        </View>

                        <View style={{ flexWrap: 'wrap', justifyContent: 'space-between', width: '100%', flexDirection: 'row' }}>

                            {
                                facilities.gas ?
                                    <View style={{ marginTop: 15, flexDirection: 'row', width: '45%', }}>
                                        <Image source={require('../../assets/icons/Vector2.png')} style={{ width: 20, height: 20, marginRight: 4 }} />
                                        <Text style={{ fontSize: 16, fontWeight: '400', alignSelf: 'center', color: '#1A1E25', marginLeft: 5 }}>Sui Gas</Text>
                                    </View>
                                    : null
                            }


                            {
                                facilities.mainRoad ?
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
                                facilities.facingPark ?
                                    <View style={{ marginTop: 15, flexDirection: 'row', width: '45%', }}>
                                        <Image source={require('../../assets/icons/Vector5.png')} style={{ width: 20, height: 20, marginRight: 4 }} />
                                        <Text style={{ fontSize: 16, fontWeight: '400', alignSelf: 'center', color: '#1A1E25', marginLeft: 5 }}>Facing Park</Text>

                                    </View>
                                    : null
                            }
                            {
                                facilities.corner ?
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
                                facilities.ownerBuild ?
                                    <View style={{ marginTop: 15, flexDirection: 'row', width: '45%', }}>
                                        <Image source={require('../../assets/icons/Vector1.png')} style={{ width: 20, height: 20, marginRight: 9 }} />
                                        <Text style={{ fontSize: 16, fontWeight: '400', alignSelf: 'center', color: '#1A1E25', marginLeft: 5 }}>Owner Built</Text>
                                    </View>
                                    : null
                            }
                            {
                                facilities.gated ?
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
                    <View style={{ marginVertical: 20 }}>
                        <Text style={{ fontSize: 18, fontWeight: '700', color: '#1A1E25' }}>Description</Text>
                        {
                            description !== "" ?
                                <Text style={{ fontFamily: 'SF Pro Text', fontWeight: '400', fontSize: 16, marginTop: 5 }}>
                                    {description}
                                </Text>
                                :
                                <Text style={{ fontFamily: 'SF Pro Text', fontWeight: '400', fontSize: 16, marginTop: 5, fontStyle: 'italic' }}>No description</Text>
                        }

                    </View>

                    {/* <View style={{marginBottom:25}}>
                        <Image 
                            source={require('../../assets/images/map.png')}  
                            style={{width: '100%', height: 209, }}
                        />
                    </View> */}

                    {/* Map View */}
                    {/* <Image
                        source={require("../../assets/images/Googlemap.png")}
                        style={{ width: "100%", height: 209, borderRadius: 10, marginTop: 20 }}
                    /> */}

                </View>
            </ScrollView>

            <View style={{ marginTop: 10, width: '100%', alignSelf: 'center', elevation: 2, backgroundColor: 'white', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                <View>
                    <Text style={{ fontSize: 18, fontWeight: '600', color: '#917AFD', marginLeft: 10, marginTop: 10 }}>{transactionType == "Sale" ? "Demand" : "Budget"}</Text>
                    <Text style={{ fontSize: 16, fontWeight: '600', color: '#1A1E25', marginLeft: 10, marginTop: 10, marginBottom: 10 }}>PKR {demand.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")} <Text style={{ fontSize: 16, fontWeight: '400', color: '#1A1E25' }}>{transactionType == "Sale" ? "" : "/ month"}</Text></Text>
                </View>

                {
                    toMarketplace ?
                        null
                        :
                        <TouchableOpacity
                            style={{
                                // borderColor:'red',
                                // borderWidth:1,
                                backgroundColor: '#6A4FEE',
                                marginRight: 10,
                                height: 45,
                                width: '40%',
                                alignItems: 'center',
                                justifyContent: 'center',
                                borderRadius: 10,
                                elevation: 2
                            }}
                            onPress={() => navigation.navigate("AddToMarketplace", items)}
                        >
                            <Text style={{ color: 'white', fontSize: 14, fontWeight: '600' }}>Add To Marketplace</Text>
                        </TouchableOpacity>
                }
            </View>

            {/* Image Modal */}
            <Modal visible={showImageModal} animationType='slide' transparent={true}>
                <View style={{ backgroundColor: '#D3D3D3', opacity: 0.5, height: '25%' }}></View>
                <View style={{ height: '50%', elevation: 7, backgroundColor: 'white', flexDirection: 'row' }}>
                    <TouchableOpacity style={[styles.closeIconContainer, { marginLeft: 5, }]} onPress={() => setShowImageModal(false)}>
                        <Icon
                            name='close'
                            color="black"
                            size={25}
                        />
                    </TouchableOpacity>
                    <Image
                        source={{ uri: propertyImg }}
                        style={{ height: '100%', alignSelf: 'center', width: 350 }}
                        resizeMode="contain"
                    />
                </View>
                <View style={{ backgroundColor: '#D3D3D3', opacity: 0.5, height: '25%' }}></View>
            </Modal>
        </View>

    )
}

const styles = StyleSheet.create({
    body: {
        flex: 1,
        backgroundColor: '#fbfcfa'
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
        marginTop: 60,
        marginLeft: 270,
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
        // marginLeft: 60,
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
        // borderColor: 'red',
        // borderWidth: 1,
        backgroundColor: 'white',
        height,
        width,
        elevation: 5,
        borderRadius: 6
    },
    closeIconContainer: {
        backgroundColor: '#FDFDFD',
        borderWidth: 0.5,
        borderRadius: 10,
        borderColor: '#E3E3E7',
        width: 34,
        height: 34,
        alignItems: 'center',
        justifyContent: 'center',
        elevation: 4,
        // alignSelf:'flex-end'
    },
})