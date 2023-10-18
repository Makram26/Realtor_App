import React, { useState,useContext } from 'react'
import { StyleSheet, Text, View, TouchableOpacity, Image, ScrollView, Dimensions } from 'react-native'
import { BackgroundImage } from 'react-native-elements/dist/config';
import Spinner from 'react-native-loading-spinner-overlay';
import Icon1 from 'react-native-vector-icons/AntDesign';
import Icon from 'react-native-vector-icons/Ionicons'
import { AuthContext } from '../../auth/AuthProvider'
import Icon2 from 'react-native-vector-icons/MaterialIcons'
import { HeaderStyle } from '../../constants/Styles';

const { width } = Dimensions.get('window')
const height = width * 0.4

export default function DealLeadDetail({ route, navigation }) {

    const { user } = useContext(AuthContext);
    const items = route.params
    // console.log("items", items)
    const { leadName, mobile, societyName, bedroomsQuantity, size, size_type, portion_type, property_type, leadNotes, leadDemand, unitType, description, budget } = items.leadDetail

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
                {/* Header */}
                <View style={HeaderStyle.mainContainer}>
                    <View style={HeaderStyle.arrowbox}>
                        <TouchableOpacity onPress={() => navigation.goBack()}>
                            <Icon1 name="left" color="#1A1E25" size={20} />
                        </TouchableOpacity>
                    </View>
                    <View style={HeaderStyle.HeaderTextContainer}>
                        <Text style={HeaderStyle.HeaderText}>Deal Lead Details</Text>
                        <Image style={HeaderStyle.HeaderImage} resizeMode='contain' source={{ uri: user.photoURL }} />
                    </View>
                </View>

                {/* Body Container */}
                <View style={{ width: '90%', marginLeft: "5%" }}>

                    {/* Lead info */}
                    <View style={{ marginTop: 15 }}>
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', }}>
                            <Text style={{ fontSize: 14, fontWeight: '600', color: "#1A1E25" }}>{leadName}</Text>
                            <Text style={{ fontSize: 12, fontWeight: '400', color: '#7D7F88' }}>Lead Owner</Text>
                        </View>
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 10 }}>
                            <Text style={{ fontSize: 12, fontWeight: '400', color: "#1A1E25" }}>{mobile}</Text>
                            {/* <Text style={{ fontSize: 14, fontWeight: '500', color: '#917AFD' }}>Edit</Text> */}
                        </View>
                    </View>
                    <View style={{ borderBottomWidth: 1, borderColor: "#E2E2E2", marginVertical: 20 }} />

                    {/* Property Catagory */}
                    <Text style={{ fontSize: 20, height: 40, fontWeight: '600', color: '#1A1E25', }}>
                        {/* {items.leadDetail.catagory} */}
                        {items.leadDetail.catagory == "Residentiol" ? "Residential" : items.leadDetail.catagory == "Comercial" ? "Commercial" : "Semi-Commercial"}
                    </Text>

                    {/* Property Description */}
                    <View >
                        <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 5 }}>
                            <Icon
                                name='location-sharp'
                                color="#7D7F88"
                                size={15}
                            />
                            <Text style={{ fontSize: 16, fontWeight: '400', marginLeft: 6, color: '#7D7F88' }}>
                                {societyName}
                            </Text>
                        </View>
                        <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 5 }}>
                            <Icon
                                name='bed'
                                color="#7D7F88"
                                size={15}
                            />
                            <Text style={{ fontSize: 16, fontWeight: '400', marginLeft: 6, color: '#7D7F88', }}>
                                {bedroomsQuantity} Room
                            </Text>
                        </View>
                        <View style={{ flexDirection: 'row', alignItems: 'center', }}>
                            <Image source={require('../../assets/icons/Vector.png')} />
                            <Text style={{ fontSize: 16, fontWeight: '400', marginLeft: 6, color: '#7D7F88' }}>
                                {size} {size_type}
                            </Text>
                        </View>
                    </View>
                    <View style={{ borderBottomWidth: 1, borderColor: "#E2E2E2", marginTop: 20 }} />

                    {/* Unit Type */}

                    {
                        unitType !== "" ?
                        <View style={{ marginTop: 10 }}>
                        {/* Unit Type */}
                        <Text style={{ fontSize: 16, fontWeight: '700', color: '#1A1E25' }}>Unit</Text>
                        {unitType === "Double" ?
                            <View style={{ flexDirection: 'row', marginVertical: 10 }}>
                                <View style={{ width: 81, height: 32, marginRight: 10, backgroundColor: '#917AFD', borderRadius: 92, justifyContent: 'center', alignItems: 'center' }}>
                                    <Text style={{ fontSize: 12, fontWeight: '400', color: "#FDFDFD" }}>Single</Text>
                                </View>
                                <View style={{ width: 119, height: 32, marginHorizontal: 10, backgroundColor: '#F2F2F3', borderWidth: 0.8, borderColor: "#E3E3E7", borderRadius: 92, justifyContent: 'center', alignItems: 'center' }}>
                                    <Text style={{ fontSize: 12, fontWeight: '400', color: "#7D7F88" }}>Double</Text>
                                </View>
                            </View>
                            :
                            <View style={{ flexDirection: 'row', marginVertical: 10 }}>
                                <View style={{ width: 81, height: 32, marginRight: 10, backgroundColor: '#F2F2F3', borderWidth: 0.8, borderRadius: 92, borderColor: "#E3E3E7", justifyContent: 'center', alignItems: 'center' }}>
                                    <Text style={{ fontSize: 12, fontWeight: '400', color: "#7D7F88" }}>Single</Text>
                                </View>
                                <View style={{ width: 119, height: 32, marginHorizontal: 10, backgroundColor: '#917AFD', borderRadius: 92, justifyContent: 'center', alignItems: 'center' }}>
                                    <Text style={{ fontSize: 12, fontWeight: '400', color: "#FDFDFD" }}>Double</Text>
                                </View>
                            </View>
                        }
                            <View style={{ borderBottomWidth: 1, borderColor: "#E2E2E2", marginTop: 10 }} />
                        </View> : null
                    }
                   

                    {/* Portion Type */}
                    {
                        portion_type !== "" ?

                    <View style={{ marginTop: 10 }}>
                        {/* Unit Type */}
                        <Text style={{ fontSize: 16, fontWeight: '700', color: '#1A1E25' }}>Portion</Text>
                        {portion_type === "FirstFloor" ?
                            <View style={{ flexDirection: 'row', marginVertical: 10 }}>
                                <View style={{ width: 101, height: 32, marginRight: 10, backgroundColor: '#F2F2F3', borderWidth: 0.8, borderRadius: 92, borderColor: "#E3E3E7", justifyContent: 'center', alignItems: 'center' }}>
                                    <Text style={{ fontSize: 12, fontWeight: '400', color: "#7D7F88" }}>Complete</Text>
                                </View>
                                <View style={{ width: 119, height: 32, marginHorizontal: 10, backgroundColor: '#917AFD', borderRadius: 92, justifyContent: 'center', alignItems: 'center' }}>
                                    <Text style={{ fontSize: 12, fontWeight: '400', color: "#FDFDFD" }}>1st Floor</Text>
                                </View>
                            </View>
                            :
                            <View style={{ flexDirection: 'row', marginVertical: 10 }}>
                                <View style={{ width: 101, height: 32, marginRight: 10, backgroundColor: '#917AFD', borderRadius: 92, justifyContent: 'center', alignItems: 'center' }}>
                                    <Text style={{ fontSize: 12, fontWeight: '400', color: "#FDFDFD" }}>Complete</Text>
                                </View>
                                <View style={{ width: 119, height: 32, marginHorizontal: 10, backgroundColor: '#F2F2F3', borderWidth: 0.8, borderColor: "#E3E3E7", borderRadius: 92, justifyContent: 'center', alignItems: 'center' }}>
                                    <Text style={{ fontSize: 12, fontWeight: '400', color: "#7D7F88" }}>1st Floor </Text>
                                </View>
                            </View>
                        }
                        <View style={{ borderBottomWidth: 1, borderColor: "#E2E2E2", marginTop: 10 }} />
                    </View> : null
                    }

                    {/* Description */}
                    <View style={{ marginTop: 20 }}>
                        <Text style={{ fontSize: 18, fontWeight: '600', color: '#1A1E25' }}>Description</Text>
                        <Text style={{ fontSize: 16, fontWeight: '400', color: '#7D7F88' }}>{description}</Text>
                    </View>

                    {/* Map View */}
                    {/* <Image
                        source={require("../../assets/images/Googlemap.png")}
                        style={{ width: "100%", height: 209, borderRadius: 10, marginTop: 20 }}
                    /> */}

                    {/* View Task Button */}
                    {/* <TouchableOpacity style={styles.btn} onPress={() => navigation.navigate('Tasks')}>
                        <Text style={{ fontSize: 16, fontWeight: '600', color: '#917AFD' }}>View Tasks</Text>
                    </TouchableOpacity> */}
                </View>
            </ScrollView>

            {/* Payment Detail */}
            <View style={{ margin: 10, width: '90%', alignSelf: 'center', }}>
                <Text style={{ fontSize: 18, fontWeight: '600', color: '#917AFD', margin: 10 }}>{property_type == "Let" || property_type == "Sale" ? "Demand" : "Budget"}</Text>
                <Text style={{ fontSize: 16, fontWeight: '600', color: '#1A1E25',marginLeft: 10, marginBottom: 10 }}>PKR {budget.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")} {property_type == "Buy" || property_type == "Sale" ? "" : "/ month"}</Text>
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