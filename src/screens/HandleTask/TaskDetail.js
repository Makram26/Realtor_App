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
import Spinner from 'react-native-loading-spinner-overlay';

import firestore from '@react-native-firebase/firestore'

import Icon from 'react-native-vector-icons/AntDesign';
import Icon1 from 'react-native-vector-icons/EvilIcons';
import Icon2 from 'react-native-vector-icons/FontAwesome'
import Ionicons from 'react-native-vector-icons/Ionicons'

import TasksCard from '../../components/TasksCard';
import TaskAPI from '../../api/TasksRequest'

const Header = ({ goBack, photoURL }) => {
    return (
        <View style={HeaderStyle.mainContainer}>
            <View style={HeaderStyle.arrowbox}>
                <TouchableOpacity onPress={goBack}>
                    <Icon name="left" color="#1A1E25" size={20} />
                </TouchableOpacity>
            </View>
            <View style={HeaderStyle.HeaderTextContainer}>
                <Text style={HeaderStyle.HeaderText}>Task Details</Text>
                <Image
                    style={HeaderStyle.HeaderImage} resizeMode='contain'
                    //source={require('../../assets/images/personpic.png')}
                    source={{ uri: photoURL }}
                />
            </View>
        </View>
    )
}

const InventoryCard = ({ propertyImg, propertyType, houseName, address, rooms, area, areatype, rent, transactionType }) => {
    return (
        // <View style={styles.card}>
        //     <View style={styles.imageContainer}>
        //         {
        //             propertyImg ?
        //                 <Image
        //                     source={{ uri: propertyImg }}
        //                     style={{ width: '100%', height: '100%' }}
        //                     resizeMode='stretch'
        //                 />
        //                 :
        //                 <Image
        //                     //source={require('../assets/images/image2.jpg')}
        //                     source={require('../../assets/images/nommage.jpg')}
        //                     style={{ width: '100%', height: '100%' }}
        //                     resizeMode='contain'
        //                 />
        //         }
        //     </View>
        //     <View style={styles.detailsContainer}>
        //         <Text style={styles.houseName}>{houseName}</Text>
        //         <Text style={styles.houseAddress}>{address}</Text>
        //         <View style={{ flexDirection: 'row', justifyContent: 'space-between', width: '60%', marginTop: 10, alignItems: 'center' }}>
        //             <Icon2
        //                 name='bed'
        //                 color='#7D7F88'
        //                 size={14}
        //             />
        //             <Text style={styles.houseAddress}>{rooms} Rooms</Text>
        //             <Icon2
        //                 name='home'
        //                 color='#7D7F88'
        //                 size={14}
        //             />
        //             <Text style={styles.houseAddress}>{area + " " + areatype}</Text>
        //         </View>
        //         <View style={{ flexDirection: 'row', justifyContent: 'space-between', width: '90%', alignItems: 'center', marginBottom: 10 }}>
        //             <Text style={styles.houseRent}>Rs. {rent.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
        //                 {
        //                     transactionType == "Sale" ?
        //                         <Text style={styles.rentType}></Text>
        //                         :
        //                         <Text style={styles.rentType}>/ month</Text>
        //                 }
        //             </Text>
        //             <Text style={styles.typeText}>Inventory</Text>
        //         </View>
        //     </View>
        // </View>




        <View style={{ ...inventoryModalStyles.card, height: 140, width: "100%" }}>
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
                <Text numberOfLines={1} style={{ ...inventoryModalStyles.houseName, width: "80%", marginTop: 10 }}>{houseName}</Text>
                <Text numberOfLines={1} style={{ ...inventoryModalStyles.houseAddress, width: "90%" }}>{address}</Text>
                <Text style={inventoryModalStyles.property}>{propertyType}</Text>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', width: '80%', alignItems: 'center' }}>
                    {
                        propertyType == 'Plot' || propertyType == 'Files' || propertyType == 'Shop' || propertyType == 'Agriculture' ?
                            null
                            :

                            <>

                                <Icon2
                                    name='bed'
                                    color='#7D7F88'
                                    size={14}
                                    style={{ marginRight: 5 }}
                                />
                                <View style={{ width: "30%" }}>

                                    <Text numberOfLines={1} style={{ ...inventoryModalStyles.houseAddress }}>{rooms} Rooms</Text>
                                </View>
                            </>
                    }
                    <View style={{ flexDirection: "row", alignItems: "center", }}>

                        <Icon2
                            name='home'
                            color='#7D7F88'
                            size={14}
                            style={{ marginRight: 5 }}
                        />
                        <View style={{ width: "70%" }}>

                            <Text numberOfLines={1} style={{ ...inventoryModalStyles.houseAddress }}>{area + " " + areatype}</Text>
                        </View>
                    </View>
                    {/* <Icon2
                    name='home'
                    color='#7D7F88'
                    size={14}
                />
                <Text style={inventoryModalStyles.houseAddress}>{area + " " + areatype}</Text> */}
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
                    {/* <Text style={inventoryModalStyles.typeText}>Inventory</Text> */}
                </View>
            </View>
        </View>
    )
}

const LeadCard = ({ name, size, type, mobile, transaction }) => {
    return (

        <View style={{ ...leadModalStyles.card, width: "100%", marginTop: 20 }}>


            <View style={{ flex: 1, marginBottom: 10 }}>
                <Text style={leadModalStyles.name}>{name}</Text>
                <Text style={{ ...leadModalStyles.size, marginTop: 10 }}>{size} {type}</Text>
            </View>
            <View style={{ flex: 1, marginBottom: 10 }}>
                <Text style={leadModalStyles.phone}>{mobile}</Text>
                {/* <View style={{ ...leadModalStyles.button, marginTop: 10 }}> */}
                <Text style={{ ...leadModalStyles.size, marginTop: 10, textAlign: "right", marginRight: 20 }}>{transaction}</Text>
                {/* </View> */}
            </View>

        </View>


        // <View style={styles.leadCard}>
        //     <View style={{ flex: 1 }}>
        //         <Text style={styles.leadName}>{name}</Text>
        //         <Text style={styles.leadSize}>{size} {type}</Text>
        //     </View>
        //     <View style={{ flex: 1 }}>
        //         <Text style={styles.leadPhone}>{mobile}</Text>
        //         <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', width: '90%', alignSelf: 'flex-end', marginRight: 10 }}>
        //             {/* <TouchableOpacity style={styles.leadButton}>
        //                 <Text style={styles.leadButtonText}>Inventory</Text>
        //             </TouchableOpacity> */}
        //             <View></View>
        //             <Text style={{
        //                 color: '#6246EA',
        //                 fontFamily: 'SF Pro Text',
        //                 fontWeight: '500',
        //                 fontSize: 14
        //             }}>
        //                 {transaction}
        //             </Text>
        //         </View>

        //     </View>
        // </View>
    )
}

export default function TaskDetail({ navigation, route }) {
    const items = route.params
    console.log("items: ", items)

    const { user } = useContext(AuthContext);

    const [loading, setLoading] = useState(false)
    const [data, setData] = useState([])

    const [showNote, setShowNote] = useState(false)

    const [notes, setNote] = useState('')

    // const [loading, setLoading] = useState(false)

    const {
        date,
        id,
        inventory,
        lead,
        note,
        priorty,
        status,
        subject,
        title,
        name,
        role,
        time
    } = items


    console.log("time time time",time)

    const updateTaskHandler = async () => {
        setLoading(true)
        try {
            await firestore()
                .collection('Tasks')
                .doc(id)
                .update({
                    note: note + "-" + notes
                })
                .then(() => {
                    console.log("Note Updated")
                    navigation.pop(1)
                    setLoading(false)
                    // Alert.alert("Note Updated")
                    // navigation.navigate("Leads")
                })
        } catch (err) {
            console.log(err)
            setLoading(false)
            console.log(
                "Error occured",
            )
        }
    }

    return (
        <ScrollView keyboardShouldPersistTaps="always" contentContainerStyle={{ flexGrow: 1, backgroundColor: "#FCFCFC" }}>
            {
                loading ?
                    <Spinner visible={true} />
                    :
                    null
            }
            <Header
                goBack={() => navigation.pop(1)}
                photoURL={user.photoURL}
            />
            <View style={styles.body}>
                {/* <View style={styles.textContainer}>
                    <Text style={styles.type}>Priorty</Text>
                    <Text style={styles.typetext}>{priorty}</Text>
                </View> */}
                <View style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    alignItems: 'center'
                }}>
                    <Text style={{ fontSize: 16, fontWeight: '700', color: '#1A1E25', marginTop: 10 }}>Title</Text>
                    <TouchableOpacity onPress={() => navigation.navigate('EditTask', items)}>
                        <Ionicons
                            name='pencil-outline'
                            size={20}
                            color="black"
                        />
                    </TouchableOpacity>

                </View>
                <Text style={{ fontSize: 14, fontWeight: '500', color: 'black', marginTop: 10 }}>{title}</Text>

                <View style={{ borderBottomWidth: 1, borderColor: "#E2E2E2", marginTop: 20 }} />

                <Text style={{ fontSize: 16, fontWeight: '700', color: '#1A1E25', marginTop: 10 }}>Priorty</Text>


                <View style={styles.portionContainer}>
                    <View
                        style={[styles.BtnPropertyType, { backgroundColor: priorty == "Low" ? '#826AF7' : '#F2F2F3' }]}>
                        <Text style={[styles.ButtonText, { color: priorty == "Low" ? '#FFFFFF' : '#7D7F88', }]}>Low</Text>
                    </View>
                    <View
                        style={[styles.BtnPropertyType, { backgroundColor: priorty == "High" ? '#826AF7' : '#F2F2F3' }]}>
                        <Text style={[styles.ButtonText, { color: priorty == "High" ? '#FFFFFF' : '#7D7F88', }]}>High</Text>
                    </View>
                    <View
                        style={[styles.BtnPropertyType, { backgroundColor: priorty == "Medium" ? '#826AF7' : '#F2F2F3' }]}>
                        <Text style={[styles.ButtonText, { color: priorty == "Medium" ? '#FFFFFF' : '#7D7F88', }]}>Medium</Text>
                    </View>
                </View>
                <View style={{ borderBottomWidth: 1, borderColor: "#E2E2E2", marginTop: 20 }} />

                <Text style={{ fontSize: 16, fontWeight: '700', color: '#1A1E25', marginTop: 10 }}>Status</Text>
                <View style={[styles.portionContainer, { width: '95%' }]}>
                    <View
                        style={[styles.BtnPropertyType, { backgroundColor: status == "New" ? '#826AF7' : '#F2F2F3' }]}>
                        <Text style={[styles.ButtonText, { color: status == "New" ? '#FFFFFF' : '#7D7F88', }]}>New</Text>
                    </View>
                    <View
                        style={[styles.BtnPropertyType, { backgroundColor: status == "Done" ? '#826AF7' : '#F2F2F3' }]}>
                        <Text style={[styles.ButtonText, { color: status == "Done" ? '#FFFFFF' : '#7D7F88', }]}>Done</Text>
                    </View>
                    <View
                        style={[styles.BtnPropertyType, { backgroundColor: status == "Late" ? '#826AF7' : '#F2F2F3' }]}>
                        <Text style={[styles.ButtonText, { color: status == "Late" ? '#FFFFFF' : '#7D7F88', }]}>Late</Text>
                    </View>
                    <View
                        style={[styles.BtnPropertyType, { backgroundColor: status == "Pending" ? '#826AF7' : '#F2F2F3' }]}>
                        <Text style={[styles.ButtonText, { color: status == "Pending" ? '#FFFFFF' : '#7D7F88', }]}>Pending</Text>
                    </View>
                </View>
                <View style={{ borderBottomWidth: 1, borderColor: "#E2E2E2", marginTop: 20 }} />


                {/* <View style={styles.textContainer}>
                    <Text style={styles.type}>Status</Text>
                    <Text style={styles.typetext}>{status}</Text>
                </View> */}

                <Text style={{ fontSize: 16, fontWeight: '700', color: '#1A1E25', marginTop: 10 }}>Subject</Text>
                <View style={[styles.portionContainer, { width: '95%' }]}>
                    <View
                        style={[styles.BtnPropertyType, { backgroundColor: subject == "Meeting" ? '#826AF7' : '#F2F2F3' }]}>
                        <Text style={[styles.ButtonText, { color: subject == "Meeting" ? '#FFFFFF' : '#7D7F88', }]}>Meeting</Text>
                    </View>
                    <View
                        style={[styles.BtnPropertyType, { backgroundColor: subject == "Call" ? '#826AF7' : '#F2F2F3' }]}>
                        <Text style={[styles.ButtonText, { color: subject == "Call" ? '#FFFFFF' : '#7D7F88', }]}>Call</Text>
                    </View>
                    <View
                        style={[styles.BtnPropertyType, { backgroundColor: subject == "ToDo" ? '#826AF7' : '#F2F2F3' }]}>
                        <Text style={[styles.ButtonText, { color: subject == "ToDo" ? '#FFFFFF' : '#7D7F88', }]}>To Do</Text>
                    </View>
                    <View
                        style={[styles.BtnPropertyType, { backgroundColor: subject == "SiteVisit" ? '#826AF7' : '#F2F2F3' }]}>
                        <Text style={[styles.ButtonText, { color: subject == "SiteVisit" ? '#FFFFFF' : '#7D7F88', }]}>Site Visit</Text>
                    </View>
                </View>
                <View style={{ borderBottomWidth: 1, borderColor: "#E2E2E2", marginTop: 20 }} />

                {/* <View style={styles.textContainer}>
                    <Text style={styles.type}>Subject</Text>
                    <Text style={styles.typetext}>{subject}</Text>
                </View> */}
                <View style={{ ...styles.textContainer, width: "100%" }}>
                    <Text style={styles.type}>Date</Text>
                    <Text style={styles.typetext}>{date}</Text>
                </View>

                <View style={{ borderBottomWidth: 1, borderColor: "#E2E2E2", marginTop: 20 }} />

                <View style={{ ...styles.textContainer, width: "100%" }}>
                    <Text style={styles.type}>Time</Text>
                    <Text style={styles.typetext}>{time}</Text>
                </View>

                <View style={{ borderBottomWidth: 1, borderColor: "#E2E2E2", marginTop: 20 }} />

                <View style={styles.textContainer1}>
                    <TouchableOpacity
                        style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}
                        onPress={() => setShowNote(!showNote)}
                    >
                        <Text style={styles.type}>Note</Text>
                        <Ionicons
                            name='add-circle-outline'
                            color="#826AF7"
                            size={25}
                        />
                    </TouchableOpacity>
                    <Text style={{ color: '#1A1E25', fontSize: 15, marginTop: 5, fontStyle: 'italic' }}>
                        {/* jnjcnadjcneciuencinvindivcinvinivnwivnirunvkjndinruikjndwkjnenkjencknekjnekcnknckjnnrnrnui */}
                        {note && note.includes("-") ? note.split("-").join("\n") : note}
                        {/* {
                            note && note.split("-").join("\n")
                        } */}
                    </Text>
                </View>

                <View style={{ borderBottomWidth: 1, borderColor: "#E2E2E2", marginTop: 20 }} />

                {
                    showNote ?
                        <TextInput
                            style={{ borderBottomColor: '#E2E2E2', borderBottomWidth: 1 }}
                            placeholder='Enter Note'
                            placeholderTextColor={"#A1A1A1"}
                            keyboardType="default"
                            multiline
                            numberOfLines={3}
                            value={notes}
                            onChangeText={(value) => setNote(value)}
                        />
                        : null
                }

                {
                    showNote && notes !== "" ?
                        <TouchableOpacity onPress={() => updateTaskHandler()} style={styles.SaveBtn}>
                            <Text style={styles.saveBtnText}>Update</Text>
                        </TouchableOpacity>
                        : null
                }

                {
                    lead ?
                        // LeadData.map((leads) => (
                        <LeadCard
                            name={lead.leadName}
                            size={lead.size}
                            type={lead.size_type}
                            mobile={lead.mobile}
                            transaction={lead.property_type}
                        />
                        // ))  
                        : null
                }

                {
                    inventory ?
                        <InventoryCard
                            houseName={inventory.houseName}
                            propertyImg={inventory.propertyImg}
                            rent={inventory.demand}
                            transactionType={inventory.transactionType}
                            address={inventory.societyName + ", " + inventory.cityName}
                            rooms={inventory.rooms.bedrooms}
                            area={inventory.size}
                            areatype={inventory.sizeType}
                            propertyType={inventory.propertyType}
                        />
                        : null
                }
            </View>
        </ScrollView>
    )
}

const styles = StyleSheet.create({
    screen: {
        backgroundColor: '#fcfcfc',
        flex: 1
    },
    textContainer: {
        width: '92%',
        alignSelf: 'center',
        // borderColor:'green',
        // borderWidth:1,
        marginTop: 10,
        flexDirection: 'row',
        justifyContent: 'space-between'
    },
    textContainer1: {
        // width:'95%',
        marginTop: 10
    },
    type: {
        fontSize: 16,
        fontWeight: '500', color: 'black'
    },
    typetext: {
        fontSize: 15,
        fontWeight: '500', color: 'black'
    },
    portionContainer: {
        width: "60%",
        flexDirection: 'row',
        justifyContent: "space-between",
        marginTop: 15,

    },
    BtnPropertyType: {
        flex: 1,
        height: 30,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 5,
        borderRadius: 100
    },
    ButtonText: {
        fontWeight: "400",
        fontSize: 12,
        fontWeight: "normal"
    },
    leadCard: {
        // borderColor:'red',
        // borderWidth:1,
        height: 90,
        width: '100%',
        alignSelf: 'center',
        marginTop: 20,
        flexDirection: 'row',
        backgroundColor: 'white',
        borderRadius: 10,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 4.84,
        elevation: 2,
    },
    leadName: {
        fontFamily: 'SF Pro Text',
        fontWeight: '700',
        fontSize: 16,
        color: '#1A1E25',
        letterSpacing: 0.3,
        margin: 10
    },
    leadSize: {
        fontFamily: 'SF Pro Text',
        fontWeight: '400',
        fontSize: 14,
        color: '#7D7F88',
        letterSpacing: 0.3,
        marginLeft: 10
    },
    leadPhone: {
        fontFamily: 'SF Pro Text',
        fontWeight: '400',
        fontSize: 14,
        color: '#7D7F88',
        letterSpacing: 0.3,
        margin: 10,
        alignSelf: 'flex-end'
    },
    SaveBtn: {
        width: "100%",
        justifyContent: "center",
        alignSelf: "center",
        alignItems: 'center',
        height: 47,
        backgroundColor: "#876FF9",
        borderRadius: 10,
        marginTop: 20,
        //elevation: 9
    },
    saveBtnText: {
        color: "#FFFFFF",
        fontSize: 13,
        fontWeight: "900",
        lineHeight: 14
    },
    leadButton: {
        backgroundColor: '#F2F2F3',
        width: 97,
        borderColor: '#E3E3E7',
        borderWidth: 0.8,
        borderRadius: 1,
        height: 30,
        alignItems: 'center',
        alignSelf: 'flex-end',
        justifyContent: 'center',
        // elevation: 1,
        marginRight: 10
    },
    leadButtonText: {
        fontFamily: 'Lato',
        fontStyle: 'normal',
        fontWeight: '400',
        fontSize: 12,
        color: '#7D7F88'
    },
    card: {
        width: '100%',
        alignSelf: 'center',
        // borderColor:'red',
        // borderWidth:1,
        marginBottom: 20,
        marginTop: 15,
        flexDirection: 'row',
        // padding:5,
        backgroundColor: 'white',
        height: 180,
        elevation: 2,
        borderRadius: 10,
        overflow: 'hidden',
        // flex: 1
    },
    imageContainer: {
        width: '25%',
        alignItems: 'center',
        // borderColor:'green',
        // borderWidth:1
    },
    detailsContainer: {
        width: '70%',
        // borderColor:'blue',
        // borderWidth:1,
        marginLeft: 10,
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
        fontWeight: '800',
        fontSize: 16,
        fontStyle: 'normal',
        marginTop: 10
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
        color: '#826AF7',
        fontFamily: 'Lato',
        fontWeight: '900',
        fontSize: 14
    },
    body: {
        flex: 1,
        marginTop: 20,
        width: '90%',
        alignSelf: 'center'
    }
})
const leadModalStyles = StyleSheet.create({
    filterContainer: {
        // borderColor:'red',
        // borderWidth:1,
        marginTop: 20,
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '95%',
        alignSelf: 'center',

    },
    filterButton: {
        width: 85,
        backgroundColor: '#826AF7',
        height: 33,
        borderRadius: 92,
        // alignItems:'center',
        justifyContent: 'center',
        elevation: 3
    },
    filterButtonText: {
        fontSize: 12,
        color: 'white',
        alignSelf: 'center',
        fontWeight: '400',
        fontFamily: 'Lato'
    },
    card: {
        // borderColor:'red',
        // borderWidth:1,
        marginBottom: 20,
        backgroundColor: "#FFFFFF",
        flexDirection: 'row',
        justifyContent: 'space-between',
        borderRadius: 10,
        // height: 90,
        // borderColor: '#D6D6D6',
        // borderWidth: 0.6,
        width: '95%',
        elevation: 9,
        alignSelf: 'center',
        marginBottom: 10
    },
    name: {
        fontFamily: 'SF Pro Text',
        fontWeight: '700',
        fontSize: 16,
        color: '#1A1E25',
        letterSpacing: 0.3,
        margin: 10
    },
    size: {
        fontFamily: 'SF Pro Text',
        fontWeight: '400',
        fontSize: 14,
        color: '#7D7F88',
        letterSpacing: 0.3,
        marginLeft: 10
    },
    phone: {
        fontFamily: 'SF Pro Text',
        fontWeight: '400',
        fontSize: 14,
        color: '#7D7F88',
        letterSpacing: 0.3,
        margin: 10,
        alignSelf: 'flex-end'
    },
    button: {
        backgroundColor: '#F2F2F3',
        width: 97,
        borderColor: '#E3E3E7',
        borderRadius: 1,
        height: 30,
        alignItems: 'center',
        alignSelf: 'flex-end',
        justifyContent: 'center',
        elevation: 1,
        marginRight: 10
    },
    buttonText: {
        fontFamily: 'Lato',
        fontStyle: 'normal',
        fontWeight: '400',
        fontSize: 12
    }
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
        marginBottom: 10
    },
    card: {
        marginTop: 10,
        // borderColor:'red',
        // borderWidth:1,
        height: 170,
        marginBottom: 10,
        flexDirection: 'row',
        backgroundColor: 'white',
        elevation: 9,
        borderRadius: 10,
        overflow: 'hidden',
        width: '96%',
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
        fontWeight: '800',
        fontSize: 16,
        fontStyle: 'normal',
        // marginTop: 5
    },
    houseAddress: {
        color: '#7D7F88',
        fontFamily: 'SF Pro Text',
        fontWeight: '400',
        fontSize: 13,
        fontStyle: 'normal',
        marginRight: 5,
        // flex: 1,
        // marginLeft: 3
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
    property: {
        color: '#1A1E25',
        fontFamily: 'SF Pro Text',
        fontWeight: '400',
        fontSize: 16,
        fontStyle: 'normal',
        // flex: 1,
        // marginLeft: 3
    },


})