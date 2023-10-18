import React, { useState, useEffect, useContext } from 'react';
import {
    Image, StyleSheet, Text, TextInput, TouchableOpacity, View, Alert, ActivityIndicator, ImageBackground, FlatList,
    ScrollView, Dimensions, BackHandler, Modal, RefreshControl,
} from 'react-native';
import Icon from 'react-native-vector-icons/AntDesign';
import Icon1 from 'react-native-vector-icons/EvilIcons';
import Icon2 from 'react-native-vector-icons/MaterialIcons';
import FontAwesome from 'react-native-vector-icons/FontAwesome'

import { HeaderStyle } from '../../constants/Styles';
import { AuthContext } from '../../auth/AuthProvider'
// import DealLeadsCard from '../../components/DealCard/DealLeadsCard';
import LeadCard from '../../components/LeadCard';
import Spinner from 'react-native-loading-spinner-overlay';

import LeadApi from '../../api/LeadsRequest'
import UsersAPI from '../../api/UserSettingAPIs/UserSettingsAPI'
import PermissionAPI from '../../api/PermissionsAPIs/checkUserAPI'

// import LeadsApi from '../../api/LeadsRequest'

const LeadCard2 = ({
    name,
    mobile,
    assign
}) => {
    return (
        <TouchableOpacity style={{
            width: '90%',
            padding: 5,
            margin: 10,
            elevation: 4,
        }} onPress={assign}>
            <Text >{name}</Text>
            <View>
                <Text >{mobile}</Text>
                <View >
                    <Text >Reassign</Text>
                </View>
            </View>
        </TouchableOpacity>
    )
}



export default function Leads({ navigation }) {
    const { user } = useContext(AuthContext);
    const [btnAllLeads, setBtnAllLeads] = useState(false)
    const [btnColorRent, setBtnColorRent] = useState(false)
    const [btnColorSale, setBtnColorSale] = useState(false)
    const [btnColorBuy, setBtnColorBuy] = useState(true)
    const [btnColorToLet, setBtnColorToLet] = useState(false)
    const [filteredData, setFilteredData] = useState([])
    const [search, setSearch] = useState('')
    const [noFoundUser, setNoFoundUser] = useState('')
    const [saleRecord, setSaleRecord] = useState([])
    const [rentRecord, setRentRecord] = useState([])
    const [buyRecord, setBuyRecord] = useState([])
    const [toLetRecord, setToLetRecord] = useState([])
    const [loading, setLoading] = useState(false)
    const [leadName, setLeadName] = useState('')

    const [newStatus, setNewStatus] = useState(true)
    const [qualifiedStatus, setQualifiedStatus] = useState(false)
    const [negotiationStatus, setNegotiationStatus] = useState(false)
    const [coldStatus, setColdStatus] = useState(false)
    const [wonStatus, setWonStatus] = useState(false)
    const [rejectedStatus, setRejectedStatus] = useState(false)

    // handle Leads and agent tasks button
    const [myLeadsStatus, setMyLeadsStatus] = useState(true)
    const [agentLeadsStatus, setAgentLeadsStatus] = useState(false)


    const [showAgentModal, setAgentModal] = useState(false)


    var BtnRent = btnColorRent ? '#826AF7' : '#F2F2F3'
    var BtnSale = btnColorSale ? '#826AF7' : '#F2F2F3'
    var BtnBuy = btnColorBuy ? '#826AF7' : '#F2F2F3'
    var BtnToLet = btnColorToLet ? '#826AF7' : '#F2F2F3'

    var textAllLeads = btnAllLeads ? '#826AF7' : '#000000'
    var textRent = btnColorRent ? '#FFFFFF' : '#7D7F88'
    var textSale = btnColorSale ? '#FFFFFF' : '#7D7F88'
    var textBuy = btnColorBuy ? '#FFFFFF' : '#7D7F88'
    var textToLet = btnColorToLet ? '#FFFFFF' : '#7D7F88'
    const [leadData, setLeadData] = useState([])

    const [accessType, setAccessType] = useState()
    const [accessBusinessID, setAccessBusinessID] = useState()

    const [users, setUsers] = useState([])

    useEffect(() => {
        checkPermissions()
        const unsubscribe = navigation.addListener('focus', () => {
            checkPermissions()
        });
        return () => {
            unsubscribe;
        };
    }, [])

    const checkPermissions = async () => {
        setLoading(true)
        setMyLeadsStatus(true)
        setAgentLeadsStatus(false)
        const response = await PermissionAPI.checkUserType(user.uid)
        // console.log("type", response)
        if (response && response == 1) {
            const respone = await PermissionAPI.checkAccessType(user.uid)
            // console.log("access", respone)
            setAccessType(respone[0].user_role)
            setAccessBusinessID(respone[0].businessID)
            ShowLeads(respone[0].user_role, respone[0].businessID)
        }
        else {
            ShowLeads("business", user.uid)
        }
    }

    const ShowLeads = async (access, business) => {
        let tempSale = []
        let tempRent = []
        let tempBuy = []
        let tempToLet = []

        const response = await LeadApi.getLeads(user.uid, access, business)
        // console.log("respone", response)
        if (response && response.length > 0) {
            setLeadData(response)
            for (let i = 0; i < response.length; i++) {
                if (response[i].property_type === "Sale") {
                    tempSale.push(response[i])
                }
                if (response[i].property_type === "Rent") {
                    tempRent.push(response[i])
                }
                if (response[i].property_type === "Buy") {
                    tempBuy.push(response[i])
                }
                if (response[i].property_type === "ToLet") {
                    tempToLet.push(response[i])
                }
            }
            setLoading(false)
        }
        else {
            setNoFoundUser("Don't have any Lead....")
            setLoading(false)
        }
        setRentRecord(tempRent)
        setSaleRecord(tempSale)
        setBuyRecord(tempBuy)
        setToLetRecord(tempToLet)
    }

    const ColorAllLeads = () => {
        setBtnAllLeads(true)
        setBtnColorSale(false)
        setBtnColorRent(false)
        setBtnColorBuy(false)
        setBtnColorToLet(false)
    }
    const ColorChangeSale = () => {
        setBtnAllLeads(false)
        setBtnColorSale(true)
        setBtnColorRent(false)
        setBtnColorBuy(false)
        setBtnColorToLet(false)
    }
    const ColorChangeRent = () => {
        setBtnAllLeads(false)
        setBtnColorSale(false)
        setBtnColorRent(true)
        setBtnColorBuy(false)
        setBtnColorToLet(false)
    }
    const ColorChangeBuy = () => {
        setBtnAllLeads(false)
        setBtnColorSale(false)
        setBtnColorRent(false)
        setBtnColorBuy(true)
        setBtnColorToLet(false)
    }
    const ColorChangeToLet = () => {
        setBtnAllLeads(false)
        setBtnColorSale(false)
        setBtnColorRent(false)
        setBtnColorBuy(false)
        setBtnColorToLet(true)
    }

    const searchLeadFilter = (text) => {
        if (text) {
            //   setSearchData(false)
            const newData = leadData.filter((item) => {
                const itemData = item.leadName ? item.leadName.toUpperCase() : ''.toUpperCase();
                const textData = text.toUpperCase()
                return itemData.indexOf(textData) > -1
            })
            setFilteredData(newData)
            setSearch(text)
        } else {
            //   setSearchData(true)
            setFilteredData("")
            setSearch(text)
        }
    }

    const searchLeadSaleFilter = (text) => {
        if (text) {
            //   setSearchData(false)
            const newData = saleRecord.filter((item) => {
                const itemData = item.leadName ? item.leadName.toUpperCase() : ''.toUpperCase();
                const textData = text.toUpperCase()
                return itemData.indexOf(textData) > -1
            })
            setFilteredData(newData)
            setSearch(text)
        } else {
            //   setSearchData(true)
            setFilteredData("")
            setSearch(text)
        }
    }

    const searchLeadRentFilter = (text) => {
        if (text) {
            //   setSearchData(false)
            const newData = rentRecord.filter((item) => {
                const itemData = item.leadName ? item.leadName.toUpperCase() : ''.toUpperCase();
                const textData = text.toUpperCase()
                return itemData.indexOf(textData) > -1
            })
            setFilteredData(newData)
            setSearch(text)
        } else {
            //   setSearchData(true)
            setFilteredData("")
            setSearch(text)
        }
    }

    const searchLeadBuyFilter = (text) => {
        if (text) {
            //   setSearchData(false)
            const newData = buyRecord.filter((item) => {
                const itemData = item.leadName ? item.leadName.toUpperCase() : ''.toUpperCase();
                const textData = text.toUpperCase()
                return itemData.indexOf(textData) > -1
            })
            setFilteredData(newData)
            setSearch(text)
        } else {
            //   setSearchData(true)
            setFilteredData("")
            setSearch(text)
        }
    }

    const searchLeadToLetFilter = (text) => {
        if (text) {
            //   setSearchData(false)
            const newData = toLetRecord.filter((item) => {
                const itemData = item.leadName ? item.leadName.toUpperCase() : ''.toUpperCase();
                const textData = text.toUpperCase()
                return itemData.indexOf(textData) > -1
            })
            setFilteredData(newData)
            setSearch(text)
        } else {
            //   setSearchData(true)
            setFilteredData("")
            setSearch(text)
        }
    }
    // console.log(filteredData)

    // Handel Status selected
    const StatusHandler = (text) => {
        switch (true) {
            case (text == "new"):
                setNewStatus(true)
                setQualifiedStatus(false)
                setNegotiationStatus(false)
                setColdStatus(false)
                setWonStatus(false)
                setRejectedStatus(false)
                break;
            case (text == "qualified"):
                setNewStatus(false)
                setQualifiedStatus(true)
                setNegotiationStatus(false)
                setColdStatus(false)
                setWonStatus(false)
                setRejectedStatus(false)
                break;
            case (text == "negotiation"):
                setNewStatus(false)
                setQualifiedStatus(false)
                setNegotiationStatus(true)
                setColdStatus(false)
                setWonStatus(false)
                setRejectedStatus(false)

                break;
            case (text == "cold"):
                setNewStatus(false)
                setQualifiedStatus(false)
                setNegotiationStatus(false)
                setColdStatus(true)
                setWonStatus(false)
                setRejectedStatus(false)

                break;
            case (text == "won"):
                setNewStatus(false)
                setQualifiedStatus(false)
                setNegotiationStatus(false)
                setColdStatus(false)
                setWonStatus(true)
                setRejectedStatus(false)

                break;
            case (text == "rejected"):
                setNewStatus(false)
                setQualifiedStatus(false)
                setNegotiationStatus(false)
                setColdStatus(false)
                setWonStatus(false)
                setRejectedStatus(true)

                break;
            default:
                break;
        }
    }


    const leadsModalHandler = () => {
        setAgentModal(true)
        setMyLeadsStatus(false)
        setAgentLeadsStatus(true)
        getUsersList()
    }

    const closeModalHandler = () => {
        setAgentModal(false)
        setMyLeadsStatus(true)
        setAgentLeadsStatus(false)
    }

    const closeAgentModal = (userID) => {
        setAgentModal(false)
        getLeadsAgent(userID)
    }

    const getLeadsAgent = async (userID) => {

        // setTaskData([])
        // setFilteredData([])
        // const userID = user.uid
        let tempSale = []
        let tempRent = []
        let tempBuy = []
        let tempToLet = []
        setLoading(true)
        const response = await LeadApi.getLeadsByAgent(userID)
        if (response && response.length > 0) {
            // setTaskData(response)
            // setFilteredData(response)
            // console.log("agent leads >>>>>>>>>>>", response)
            for (let i = 0; i < response.length; i++) {
                if (response[i].property_type === "Sale") {
                    tempSale.push(response[i])
                }
                if (response[i].property_type === "Rent") {
                    tempRent.push(response[i])
                }
                if (response[i].property_type === "Buy") {
                    tempBuy.push(response[i])
                }
                if (response[i].property_type === "ToLet") {
                    tempToLet.push(response[i])
                }
            }
            setLoading(false)
            setAgentModal(false)
        } else {
            setLoading(false)
            setAgentModal(false)
        }
        setRentRecord(tempRent)
        setSaleRecord(tempSale)
        setBuyRecord(tempBuy)
        setToLetRecord(tempToLet)
    }

    const getUsersList = async () => {
        // console.log(">>>>>>>>>>>>>>>>>>>>>>>")
        setLoading(true)
        const userID = user.uid
        const response = await UsersAPI.getLeadUsers(userID, accessBusinessID)
        // console.log("response>leads>>>>", response)
        if (response && response.length > 0) {
            setUsers(response)
            setLoading(false)
        }
        else {
            setLoading(false)
            setUsers([])
        }
    }
    return (
        <View style={{ flex: 1, backgroundColor: "#FCFCFC" }}>
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
                        <Icon name="left" color="#1A1E25" size={20} />
                    </TouchableOpacity>
                </View>
                <View style={HeaderStyle.HeaderTextContainer}>
                    <TouchableOpacity onPress={() => navigation.navigate('Notification')}>
                        <Text style={HeaderStyle.HeaderText}>Leads</Text>
                    </TouchableOpacity>
                    <Image
                        style={HeaderStyle.HeaderImage}
                        resizeMode='contain'
                        // source={require('../../assets/images/personpic.png')} 
                        source={{ uri: user.photoURL }}
                    />
                </View>
            </View>
            {/* Search Container */}
            <View style={HeaderStyle.searchContainer}>
                <Icon1 name="search" color="#1A1E25" size={30} style={{ marginLeft: 10 }} />
                <TextInput style={HeaderStyle.searchText}
                    placeholder='Search Leads by Name here...'
                    placeholderTextColor={"#7D7F88"}
                    value={search}
                    onChangeText={(text) => btnColorSale === true ? searchLeadSaleFilter(text) : btnColorRent === true ? searchLeadRentFilter(text) : btnColorBuy === true ? searchLeadBuyFilter(text) : btnColorToLet === true ? searchLeadToLetFilter(text) : null}
                />
            </View>
            {
                filteredData.length === 0 && search.length > 0 ?
                    <View style={{ width: "92%", alignSelf: "center", marginTop: 5, marginLeft: 5 }} >
                        <Text style={styles.searchRecord}>{search} Not found!</Text>
                    </View>
                    :
                    null
            }
            {/* Show Lead */}
            <View style={{ width: "92%", flexDirection: 'row', justifyContent: "space-between", margin: 15, alignSelf: "center" }}>
                <View style={{ flex: 1, flexDirection: "row", justifyContent: "space-between", }}>
                    <TouchableOpacity onPress={() => ColorChangeBuy()}
                        style={{ flex: 1, backgroundColor: BtnBuy, borderWidth: 1, borderColor: "#E3E3E7", height: 30, justifyContent: 'center', alignItems: 'center', borderRadius: 92, marginRight: 10 }}>
                        <Text style={{ color: textBuy, fontSize: 12 }}>Buy</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => ColorChangeRent()}
                        style={{ flex: 1, backgroundColor: BtnRent, borderWidth: 1, borderColor: "#E3E3E7", height: 30, justifyContent: 'center', alignItems: 'center', borderRadius: 92, marginRight: 10 }}>
                        <Text style={{ color: textRent, fontSize: 12 }}>To Rent</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => ColorChangeSale()}
                        style={{ flex: 1, backgroundColor: BtnSale, borderWidth: 1, borderColor: "#E3E3E7", height: 30, justifyContent: 'center', alignItems: 'center', borderRadius: 92, marginRight: 10 }}>
                        <Text style={{ color: textSale, fontSize: 12 }}>Sale</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => ColorChangeToLet()}
                        style={{ flex: 1, backgroundColor: BtnToLet, borderWidth: 1, borderColor: "#E3E3E7", height: 30, justifyContent: 'center', alignItems: 'center', borderRadius: 92, marginRight: 10 }}>
                        <Text style={{ color: textToLet, fontSize: 12 }}>To Let</Text>
                    </TouchableOpacity>
                </View>
            </View>
            <View style=
                {{
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    alignSelf: "center",
                    width: "92%",
                    marginBottom: 10
                }}
            >
                <View style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    // justifyContent: 'space-between',
                    width: '55%'
                }}>
                    {
                        accessType != "own" ?
                            <>

                                <TouchableOpacity
                                    style={{
                                        borderColor: '#E3E3E7',
                                        borderWidth: 1,
                                        padding: 5,
                                        borderRadius: 5,
                                        backgroundColor: myLeadsStatus ? '#917AFD' : '#F2F2F3',
                                        marginRight: 10
                                    }}
                                    onPress={() => checkPermissions()}
                                >
                                    <Text style={{
                                        fontSize: 12,
                                        color: 'black',
                                        fontWeight: '500',
                                        color: myLeadsStatus ? 'white' : '#1A1E25'
                                    }}>My Leads</Text>
                                </TouchableOpacity>
                                {/* <TouchableOpacity
                        style={{
                            borderColor: '#E3E3E7',
                            borderWidth: 1,
                            padding: 5,
                            borderRadius: 5
                        }}
                    // onPress={() => checkPermissions()}
                    >
                        <Text style={{
                            fontSize: 12,
                            color: 'black',
                            fontWeight: '500'
                        }}>All Leads</Text>
                    </TouchableOpacity> */}
                                <TouchableOpacity
                                    style={{
                                        borderColor: '#E3E3E7',
                                        borderWidth: 1,
                                        padding: 5,
                                        borderRadius: 5,
                                        backgroundColor: agentLeadsStatus ? '#917AFD' : '#F2F2F3'
                                    }}
                                    onPress={() => leadsModalHandler()}
                                >
                                    <Text style={{
                                        fontSize: 12,
                                        color: 'black',
                                        fontWeight: '500',
                                        color: agentLeadsStatus ? 'white' : '#1A1E25'
                                    }}>By Agent</Text>
                                </TouchableOpacity>
                            </>

                            :
                            null
                    }

                </View>
                {/* <TouchableOpacity
                        style={{
                            flexDirection: 'row',
                            alignSelf: 'flex-end',
                            width: 80,
                            justifyContent: 'space-between',
                            alignItems: 'center'
                        }}
                        onPress={() => navigation.navigate('CreateTask',
                            {
                                "type": accessType ? accessType[0].user_role : "business",
                                "businessID": accessType ? accessType[0].businessID : user.uid
                            }
                        )}
                    >
                        <FontAwesome
                            name='plus'
                            color="#826AF7"
                            size={15}
                        />
                        <Text style={{
                            fontSize: 14,
                            fontWeight: '600',
                            fontFamily: 'Lato',
                            color: '#826AF7'
                        }}>Add Task</Text>
                    </TouchableOpacity> */}
                <TouchableOpacity
                    style={{
                        flexDirection: 'row',
                        alignSelf: 'flex-end',
                        width: 80,
                        justifyContent: 'space-between',
                        alignItems: 'center', marginRight: 10
                    }}
                    onPress={() => navigation.navigate("CreateLeads",
                        {
                            "type": accessType ? accessType : "business",
                            "businessID": accessBusinessID ? accessBusinessID : user.uid
                        }
                    )}
                >
                    {/* <View style={{ flexDirection: 'row', width: "92%", alignItems: 'center', justifyContent: 'flex-end', marginLeft: 10 }}> */}
                    <FontAwesome name="plus" color="#826AF7" size={15} />
                    <Text style={{ fontSize: 14, fontWeight: '600', color: '#826AF7' }}>Add Lead</Text>
                    {/* </View> */}
                </TouchableOpacity>

            </View>

            <View style=
                {{
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    alignSelf: "center",
                    width: "92%",
                    // marginLeft:12
                }}
            >
                <ScrollView
                    horizontal={true}
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={propertyStyles.container}>
                    <TouchableOpacity style={[propertyStyles.typeContainer, { backgroundColor: newStatus ? '#917AFD' : '#F2F2F3' }]} onPress={() => StatusHandler("new")}>
                        <Text style={[propertyStyles.type, { color: newStatus ? 'white' : '#7D7F88' }]}>New</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={[propertyStyles.typeContainer, { marginHorizontal: 5, backgroundColor: qualifiedStatus ? '#917AFD' : '#F2F2F3' }]} onPress={() => StatusHandler("qualified")}>
                        <Text style={[propertyStyles.type, { color: qualifiedStatus ? 'white' : '#7D7F88' }]}>Qualified</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={[propertyStyles.typeContainer, { marginHorizontal: 5, backgroundColor: negotiationStatus ? '#917AFD' : '#F2F2F3' }]} onPress={() => StatusHandler("negotiation")}>
                        <Text style={[propertyStyles.type, { color: negotiationStatus ? 'white' : '#7D7F88' }]}>Negotiation</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={[propertyStyles.typeContainer, , { marginHorizontal: 5, backgroundColor: coldStatus ? '#917AFD' : '#F2F2F3' }]} onPress={() => StatusHandler("cold")}>
                        <Text style={[propertyStyles.type, { color: coldStatus ? 'white' : '#7D7F88' }]}>Cold</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={[propertyStyles.typeContainer, { marginHorizontal: 5, backgroundColor: wonStatus ? '#917AFD' : '#F2F2F3' }]} onPress={() => StatusHandler("won")}>
                        <Text style={[propertyStyles.type, { color: wonStatus ? 'white' : '#7D7F88' }]}>Won</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={[propertyStyles.typeContainer, , { marginLeft: 5, backgroundColor: rejectedStatus ? '#917AFD' : '#F2F2F3' }]} onPress={() => StatusHandler("rejected")}>
                        <Text style={[propertyStyles.type, { color: rejectedStatus ? 'white' : '#7D7F88' }]}>Rejected</Text>
                    </TouchableOpacity>
                </ScrollView>
            </View>


            {
                saleRecord.length < 1 && btnColorSale === true ?
                    <View >
                        <Text style={styles.emptyUserRecord}>You do not have any Lead!</Text>
                    </View>
                    :
                    rentRecord.length < 1 && btnColorRent === true ?
                        <View >
                            <Text style={styles.emptyUserRecord}>You do not have any Lead!</Text>
                        </View>
                        :
                        buyRecord.length < 1 && btnColorBuy === true ?
                            <View >
                                <Text style={styles.emptyUserRecord}>You do not have any Lead!</Text>
                            </View>
                            :
                            toLetRecord.length < 1 && btnColorToLet === true ?
                                <View >
                                    <Text style={styles.emptyUserRecord}>You do not have any Lead!</Text>
                                </View>
                                :
                                null
            }
            {/* {
                console.log(saleRecord)
            } */}
            {
                btnColorSale === true ?
                    <FlatList
                        data={filteredData.length > 0 ? filteredData : saleRecord}

                        keyExtractor={(stock) => stock.id}
                        renderItem={({ item }) => {
                            if (newStatus == true && item.status == "new") {
                                return (
                                    <LeadCard
                                        key={item.id}
                                        name={item.leadName}
                                        mobile={item.mobile}
                                        notes={item.societyName}
                                        budget={item.budget}
                                        houseNo={item.houseNo}
                                        size={item.size}
                                        sizeType={item.size_type}
                                        property={item.property_type}
                                        goTo={() => navigation.navigate("LeadDetail", item)}
                                        navigation={() => navigation.navigate("Leads", item)}
                                    />
                                )
                            }
                            else if (qualifiedStatus == true && item.status == "qualified") {
                                return (
                                    <LeadCard
                                        key={item.id}
                                        name={item.leadName}
                                        mobile={item.mobile}
                                        notes={item.societyName}
                                        budget={item.budget}
                                        houseNo={item.houseNo}
                                        size={item.size}
                                        sizeType={item.size_type}
                                        property={item.property_type}
                                        goTo={() => navigation.navigate("LeadDetail", item)}
                                        navigation={() => navigation.navigate("Leads", item)}
                                    />
                                )
                            }
                            else if (negotiationStatus == true && item.status == "negotiation") {
                                return (
                                    <LeadCard
                                        key={item.id}
                                        name={item.leadName}
                                        mobile={item.mobile}
                                        notes={item.societyName}
                                        budget={item.budget}
                                        houseNo={item.houseNo}
                                        size={item.size}
                                        sizeType={item.size_type}
                                        property={item.property_type}
                                        goTo={() => navigation.navigate("LeadDetail", item)}
                                        navigation={() => navigation.navigate("Leads", item)}
                                    />
                                )
                            }
                            else if (coldStatus == true && item.status == "cold") {
                                return (
                                    <LeadCard
                                        key={item.id}
                                        name={item.leadName}
                                        mobile={item.mobile}
                                        notes={item.societyName}
                                        budget={item.budget}
                                        houseNo={item.houseNo}
                                        size={item.size}
                                        sizeType={item.size_type}
                                        property={item.property_type}
                                        goTo={() => navigation.navigate("LeadDetail", item)}
                                        navigation={() => navigation.navigate("Leads", item)}
                                    />
                                )
                            }
                            else if (wonStatus == true && item.status == "won") {
                                return (
                                    <LeadCard
                                        key={item.id}
                                        name={item.leadName}
                                        mobile={item.mobile}
                                        notes={item.societyName}
                                        budget={item.budget}
                                        houseNo={item.houseNo}
                                        size={item.size}
                                        sizeType={item.size_type}
                                        property={item.property_type}
                                        goTo={() => navigation.navigate("LeadDetail", item)}
                                        navigation={() => navigation.navigate("Leads", item)}
                                    />
                                )
                            }
                            else if (rejectedStatus == true && item.status == "rejected") {
                                return (
                                    <LeadCard
                                        key={item.id}
                                        name={item.leadName}
                                        mobile={item.mobile}
                                        notes={item.societyName}
                                        budget={item.budget}
                                        houseNo={item.houseNo}
                                        size={item.size}
                                        sizeType={item.size_type}
                                        property={item.property_type}
                                        goTo={() => navigation.navigate("LeadDetail", item)}
                                        navigation={() => navigation.navigate("Leads", item)}
                                    />
                                )
                            }
                        }
                        }
                    />
                    :
                    btnColorBuy === true ?
                        <FlatList
                            data={filteredData.length > 0 ? filteredData : buyRecord}
                            keyExtractor={(stock) => stock.id}
                            renderItem={({ item }) => {

                                if (newStatus == true && item.status == "new") {

                                    return (
                                        <LeadCard
                                            key={item.id}
                                            name={item.leadName}
                                            mobile={item.mobile}
                                            notes={item.societyName}
                                            budget={item.budget}
                                            houseNo={item.houseNo}
                                            size={item.size}
                                            sizeType={item.size_type}
                                            property={item.property_type}
                                            goTo={() => navigation.navigate("LeadDetail", item)}
                                            navigation={() => navigation.navigate("ViewInventory", item)}
                                        />
                                    )
                                }
                                else if (qualifiedStatus == true && item.status == "qualified") {

                                    return (
                                        <LeadCard
                                            key={item.id}
                                            name={item.leadName}
                                            mobile={item.mobile}
                                            notes={item.societyName}
                                            budget={item.budget}
                                            houseNo={item.houseNo}
                                            size={item.size}
                                            sizeType={item.size_type}
                                            property={item.property_type}
                                            goTo={() => navigation.navigate("LeadDetail", item)}
                                            navigation={() => navigation.navigate("ViewInventory", item)}
                                        />
                                    )
                                }
                                else if (negotiationStatus == true && item.status == "negotiation") {

                                    return (
                                        <LeadCard
                                            key={item.id}
                                            name={item.leadName}
                                            mobile={item.mobile}
                                            notes={item.societyName}
                                            budget={item.budget}
                                            houseNo={item.houseNo}
                                            size={item.size}
                                            sizeType={item.size_type}
                                            property={item.property_type}
                                            goTo={() => navigation.navigate("LeadDetail", item)}
                                            navigation={() => navigation.navigate("ViewInventory", item)}
                                        />
                                    )
                                }
                                else if (coldStatus == true && item.status == "cold") {

                                    return (
                                        <LeadCard
                                            key={item.id}
                                            name={item.leadName}
                                            mobile={item.mobile}
                                            notes={item.societyName}
                                            budget={item.budget}
                                            houseNo={item.houseNo}
                                            size={item.size}
                                            sizeType={item.size_type}
                                            property={item.property_type}
                                            goTo={() => navigation.navigate("LeadDetail", item)}
                                            navigation={() => navigation.navigate("ViewInventory", item)}
                                        />
                                    )
                                }
                                else if (wonStatus == true && item.status == "won") {

                                    return (
                                        <LeadCard
                                            key={item.id}
                                            name={item.leadName}
                                            mobile={item.mobile}
                                            notes={item.societyName}
                                            budget={item.budget}
                                            houseNo={item.houseNo}
                                            size={item.size}
                                            sizeType={item.size_type}
                                            property={item.property_type}
                                            goTo={() => navigation.navigate("LeadDetail", item)}
                                            navigation={() => navigation.navigate("ViewInventory", item)}
                                        />
                                    )
                                }
                                else if (rejectedStatus == true && item.status == "rejected") {


                                    return (
                                        <LeadCard
                                            key={item.id}
                                            name={item.leadName}
                                            mobile={item.mobile}
                                            notes={item.societyName}
                                            budget={item.budget}
                                            houseNo={item.houseNo}
                                            size={item.size}
                                            sizeType={item.size_type}
                                            property={item.property_type}
                                            goTo={() => navigation.navigate("LeadDetail", item)}
                                            navigation={() => navigation.navigate("ViewInventory", item)}
                                        />
                                    )
                                }
                            }}
                        />
                        :
                        btnColorRent === true ?
                            <FlatList
                                data={filteredData.length > 0 ? filteredData : rentRecord}
                                keyExtractor={(stock) => stock.id}
                                renderItem={({ item }) => {
                                    if (newStatus == true && item.status == "new") {
                                        return (
                                            <LeadCard
                                                key={item.id}
                                                name={item.leadName}
                                                mobile={item.mobile}
                                                notes={item.societyName}
                                                budget={item.budget}
                                                houseNo={item.houseNo}
                                                size={item.size}
                                                sizeType={item.size_type}
                                                property={item.property_type}
                                                goTo={() => navigation.navigate("LeadDetail", item)}
                                                navigation={() => navigation.navigate("ViewInventory", item)}
                                            />
                                        )
                                    }
                                    else if (qualifiedStatus == true && item.status == "qualified") {
                                        return (
                                            <LeadCard
                                                key={item.id}
                                                name={item.leadName}
                                                mobile={item.mobile}
                                                notes={item.societyName}
                                                budget={item.budget}
                                                houseNo={item.houseNo}
                                                size={item.size}
                                                sizeType={item.size_type}
                                                property={item.property_type}
                                                goTo={() => navigation.navigate("LeadDetail", item)}
                                                navigation={() => navigation.navigate("ViewInventory", item)}
                                            />
                                        )
                                    }
                                    else if (negotiationStatus == true && item.status == "negotiation") {
                                        return (
                                            <LeadCard
                                                key={item.id}
                                                name={item.leadName}
                                                mobile={item.mobile}
                                                notes={item.societyName}
                                                budget={item.budget}
                                                houseNo={item.houseNo}
                                                size={item.size}
                                                sizeType={item.size_type}
                                                property={item.property_type}
                                                goTo={() => navigation.navigate("LeadDetail", item)}
                                                navigation={() => navigation.navigate("ViewInventory", item)}
                                            />
                                        )
                                    }
                                    else if (coldStatus == true && item.status == "cold") {
                                        return (
                                            <LeadCard
                                                key={item.id}
                                                name={item.leadName}
                                                mobile={item.mobile}
                                                notes={item.societyName}
                                                budget={item.budget}
                                                houseNo={item.houseNo}
                                                size={item.size}
                                                sizeType={item.size_type}
                                                property={item.property_type}
                                                goTo={() => navigation.navigate("LeadDetail", item)}
                                                navigation={() => navigation.navigate("ViewInventory", item)}
                                            />
                                        )
                                    }
                                    else if (wonStatus == true && item.status == "won") {
                                        return (
                                            <LeadCard
                                                key={item.id}
                                                name={item.leadName}
                                                mobile={item.mobile}
                                                notes={item.societyName}
                                                budget={item.budget}
                                                houseNo={item.houseNo}
                                                size={item.size}
                                                sizeType={item.size_type}
                                                property={item.property_type}
                                                goTo={() => navigation.navigate("LeadDetail", item)}
                                                navigation={() => navigation.navigate("ViewInventory", item)}
                                            />
                                        )
                                    }
                                    else if (rejectedStatus == true && item.status == "rejected") {
                                        return (
                                            <LeadCard
                                                key={item.id}
                                                name={item.leadName}
                                                mobile={item.mobile}
                                                notes={item.societyName}
                                                budget={item.budget}
                                                houseNo={item.houseNo}
                                                size={item.size}
                                                sizeType={item.size_type}
                                                property={item.property_type}
                                                goTo={() => navigation.navigate("LeadDetail", item)}
                                                navigation={() => navigation.navigate("ViewInventory", item)}
                                            />
                                        )
                                    }
                                }}
                            />
                            :
                            <FlatList
                                data={filteredData.length > 0 ? filteredData : toLetRecord}
                                keyExtractor={(stock) => stock.id}
                                renderItem={({ item }) => {
                                    if (newStatus == true && item.status == "new") {
                                        return (
                                            <LeadCard
                                                key={item.id}
                                                name={item.leadName}
                                                mobile={item.mobile}
                                                notes={item.societyName}
                                                budget={item.budget}
                                                houseNo={item.houseNo}
                                                size={item.size}
                                                sizeType={item.size_type}
                                                property={item.property_type}
                                                goTo={() => navigation.navigate("LeadDetail", item)}
                                                navigation={() => navigation.navigate("Leads", item)}
                                            />
                                        )
                                    }
                                    else if (qualifiedStatus == true && item.status == "qualified") {
                                        return (
                                            <LeadCard
                                                key={item.id}
                                                name={item.leadName}
                                                mobile={item.mobile}
                                                notes={item.societyName}
                                                budget={item.budget}
                                                houseNo={item.houseNo}
                                                size={item.size}
                                                sizeType={item.size_type}
                                                property={item.property_type}
                                                goTo={() => navigation.navigate("LeadDetail", item)}
                                                navigation={() => navigation.navigate("Leads", item)}
                                            />
                                        )
                                    }
                                    else if (negotiationStatus == true && item.status == "negotiation") {
                                        return (
                                            <LeadCard
                                                key={item.id}
                                                name={item.leadName}
                                                mobile={item.mobile}
                                                notes={item.societyName}
                                                budget={item.budget}
                                                houseNo={item.houseNo}
                                                size={item.size}
                                                sizeType={item.size_type}
                                                property={item.property_type}
                                                goTo={() => navigation.navigate("LeadDetail", item)}
                                                navigation={() => navigation.navigate("Leads", item)}
                                            />
                                        )
                                    }
                                    else if (coldStatus == true && item.status == "cold") {
                                        return (
                                            <LeadCard
                                                key={item.id}
                                                name={item.leadName}
                                                mobile={item.mobile}
                                                notes={item.societyName}
                                                budget={item.budget}
                                                houseNo={item.houseNo}
                                                size={item.size}
                                                sizeType={item.size_type}
                                                property={item.property_type}
                                                goTo={() => navigation.navigate("LeadDetail", item)}
                                                navigation={() => navigation.navigate("Leads", item)}
                                            />
                                        )
                                    }
                                    else if (wonStatus == true && item.status == "won") {
                                        return (
                                            <LeadCard
                                                key={item.id}
                                                name={item.leadName}
                                                mobile={item.mobile}
                                                notes={item.societyName}
                                                budget={item.budget}
                                                houseNo={item.houseNo}
                                                size={item.size}
                                                sizeType={item.size_type}
                                                property={item.property_type}
                                                goTo={() => navigation.navigate("LeadDetail", item)}
                                                navigation={() => navigation.navigate("Leads", item)}
                                            />
                                        )
                                    }
                                    else if (rejectedStatus == true && item.status == "rejected") {
                                        return (
                                            <LeadCard
                                                key={item.id}
                                                name={item.leadName}
                                                mobile={item.mobile}
                                                notes={item.societyName}
                                                budget={item.budget}
                                                houseNo={item.houseNo}
                                                size={item.size}
                                                sizeType={item.size_type}
                                                property={item.property_type}
                                                goTo={() => navigation.navigate("LeadDetail", item)}
                                                navigation={() => navigation.navigate("Leads", item)}
                                            />
                                        )
                                    }
                                }}
                            />
            }
            <Modal visible={showAgentModal} animationType='slide' transparent={true}>
                <View style={{ backgroundColor: '#D3D3D3', opacity: 0.5, height: '40%' }}></View>
                <View style={{ height: '60%', elevation: 7, backgroundColor: 'white' }}>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                        <View />
                        <Text style={{ fontSize: 18, color: 'black', alignSelf: 'center', fontWeight: '700' }}>Select Agent</Text>
                        <TouchableOpacity
                            style={[styles.closeIconContainer, { margin: 10 }]}
                            onPress={() => closeModalHandler()}
                        >
                            <Icon1
                                name='close'
                                color="black"
                                size={25}
                            />
                        </TouchableOpacity>
                    </View>

                    {
                        users && users.length > 0 ?
                            <FlatList
                                data={users}
                                keyExtractor={(stock) => stock.id}
                                renderItem={({ item, index }) => {
                                    return (
                                        // <LeadCard2
                                        //     name={item.name}
                                        //     mobile={item.contact}
                                        //     assign={() => closeAgentModal(item.uid)}
                                        // />
                                        <TouchableOpacity style={{
                                            width: '90%',
                                            padding: 5,
                                            margin: 10,
                                            elevation: 4,
                                        }} onPress={() => closeAgentModal(item.admin_id)}>
                                            <Text >{item.name}</Text>
                                            <View>
                                                <Text >{item.contact}</Text>
                                                <View >
                                                    <Text >Reassign</Text>
                                                </View>
                                            </View>
                                        </TouchableOpacity>
                                    )
                                }}
                                refreshControl={<RefreshControl refreshing={false} onRefresh={getLeadsAgent} />}
                            />
                            :
                            <Text style={styles.errorText}>No Users Found</Text>
                    }


                </View>

            </Modal>
        </View>
    );
}

const styles = StyleSheet.create({
    emptyUserRecord: {
        color: '#8A73FB',
        alignSelf: 'center',
        fontWeight: '800',
        alignItems: 'center',
        fontSize: 20,
        marginVertical: '20%'
    },
    searchRecord: {
        color: 'red',
        fontWeight: '500',
        fontSize: 15,

    },
    mainContainer: {
        width: "98%",
        alignSelf: 'center'
    },
    underline: {
        borderWidth: 0.6,
        margin: 15,
        marginTop: 8,
        borderColor: "#D6D6D6"
    },
    upperContainer: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginLeft: 15,
        marginRight: 15
    },
    textStyle: {
        color: "#7D7F88",
        fontSize: 12,
        fontWeight: "normal",
        width: "55%"
    },
    mobileText: {
        color: "#7D7F88",
        fontSize: 12,
        fontWeight: "normal",
        textAlign: "right"
    },
    nameText: {
        color: "#1A1E25",
        fontSize: 15,
        fontWeight: "600",
        width: "75%"
    },
    lowerContainer: {
        width: "92.3%",
        flexDirection: "row",
        marginTop: 10,
        justifyContent: "space-between",
        marginLeft: 15,
        marginRight: 15,
        marginBottom: 5
    },
    ViewinventryBtn: {
        backgroundColor: "#F2F2F3",
        borderRadius: 5,
        borderWidth: 0.8,
        borderColor: "#E3E3E7",
        width: "47%",
        height: 30,
        marginRight: 22,
        marginLeft: 10,
        justifyContent: 'center',
        alignItems: 'center'
    },
    inventryText: {
        color: "#7D7F88",
        fontSize: 12,
        fontWeight: "normal",
        padding: 5
    }

})

const propertyStyles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        // borderColor:'green',
        // borderWidth:1,
        // marginTop: ,
        // width:'60%',
        justifyContent: 'space-between',
        marginBottom: 10
    },

    containerOne: {
        flexDirection: 'row',
        alignItems: 'center',
        // borderColor:'green',
        // borderWidth:1,
        marginTop: 20,
        // width:'60%',

        width: "250%",
        justifyContent: 'space-between',
        marginBottom: 10
    },
    typeContainer: {
        backgroundColor: '#F2F2F3',
        alignItems: 'center',
        justifyContent: 'center',
        borderColor: '#E3E3E7',
        borderWidth: 0.8,
        borderRadius: 92,
        // paddingHorizontal: 10,
        height: 30,
        width: 85,
        // elevation: 7,
        marginVertical: 5

    },
    type: {
        fontFamily: 'SF Pro Text',
        fontWeight: '400',
        fontSize: 12,
        color: '#7D7F88'
    },


    containerCatagory: {
        flexDirection: 'row',
        alignItems: 'center',
        // borderColor:'green',
        // borderWidth:1,
        marginTop: 20,
        // width:'60%'
        justifyContent: 'space-between',
        marginBottom: 10
    },

    typeContainercatagory: {
        backgroundColor: '#F2F2F3',
        alignItems: 'center',
        justifyContent: 'center',
        borderColor: '#E3E3E7',
        borderWidth: 0.8,
        borderRadius: 92,
        height: 36,
        width: 120,
        // elevation: 7
    },
    typecategory: {
        fontFamily: 'SF Pro Text',
        fontWeight: '400',
        fontSize: 12,
        color: '#7D7F88'
    },


    // LeadCard2
    contactCard: {
        width: '90%',
        padding: 5,
        margin: 10,
        elevation: 4,
    }

})