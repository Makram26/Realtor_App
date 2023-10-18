import React, { useState, useEffect, useContext } from 'react';
import {
    Image,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
    Modal,
    Alert,
    ActivityIndicator,
    ImageBackground,
    FlatList,
    ScrollView,
    LogBox,
    Dimensions,
    BackHandler,
    RefreshControl
} from 'react-native';
import Icon from 'react-native-vector-icons/AntDesign';
import Icon1 from 'react-native-vector-icons/SimpleLineIcons';
import Icon2 from 'react-native-vector-icons/FontAwesome'
import Cross from 'react-native-vector-icons/Entypo'
import userData from '../../utils/UserData';
import { HeaderStyle } from '../../constants/Styles';
import { AuthContext } from '../../auth/AuthProvider'
import Spinner from 'react-native-loading-spinner-overlay';
import { uid } from '../../services/uid';
import InventoryApi from '../../api/InventoryAPIs/CreateInventory'
import InventoryCard from '../../components/InventoryCard'
import LeadInventoryCard from '../../components/LeadInventoryCard';
import firestore from '@react-native-firebase/firestore'
import { Item } from 'react-native-paper/lib/typescript/components/List/List';

import { shortenAddress } from '../../functions/shortenAddress';

import PermissionAPI from '../../api/PermissionsAPIs/checkUserAPI'
import MarketplaceAPI from '../../api/MarketplaceAPI'

import CheckBox from '@react-native-community/checkbox';
import AsyncStorage from '@react-native-async-storage/async-storage'

import CustomMatched from './CustomMatched';

// import { shortenAddress} from '../../functions/shortenAddress'

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
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', width: '90%', alignItems: 'center', marginBottom: 15 }}>
                    <Text style={inventoryModalStyles.houseRent}>Rs. {rent.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                        {
                            transactionType == "Sale" ?
                                <Text style={inventoryModalStyles.rentType}></Text>
                                :
                                <Text style={inventoryModalStyles.rentType}>/ month</Text>
                        }
                    </Text>
                    <TouchableOpacity
                        style={inventoryModalStyles.AddTaskButton}
                        onPress={backPress}
                    >
                        <Text style={inventoryModalStyles.AddTaskButtonText}>Inconsideration</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    )
}

const MATCHING_PRICE_LIMIT = 20 //Price percentage to match leads to inventory price
const MATCHING_AREA_LIMIT = 4 //Property size percentage to match leads to inventory size

export default function ViewInventory({ route, navigation }) {
    const items = route.params;
    // console.log("Leads Data :", items.inventoryProperty)
    const { leadName, budget, size, size_type, portion_type, property_type, bedroomsQuantity, address, bathroomQuantity, id } = items
    // console.log("Leads id>>>>>>>>>>>>>>>>>>>>>>>>>>> :", property_type)

    const { user } = useContext(AuthContext);
    // console.log(user.uid)
    // For on-Screen Buttons
    const [btnColorMatched, setBtnColorMatched] = useState(true)
    const [btnColorInconsidration, setBtnColorInconsidration] = useState(false)
    const [btnColorAccepted, setBtnColorAccepted] = useState(false)
    const [btnColorRejected, setBtnColorRejected] = useState(false)

    // For Model Filter Button
    const [btnColorMatchedModel, setBtnColorMatchedModel] = useState(true)
    const [btnColorInconsidrationModel, setBtnColorInconsidrationModel] = useState(false)
    const [btnColorAcceptedModel, setBtnColorAcceptedModel] = useState(false)
    const [btnColorRejectedModel, setBtnColorRejectedModel] = useState(false)

    // for Filter Buttons
    const [btnColorPrice, setBtnColorPrice] = useState(false)
    const [btnColorLocation, setBtnColorLocation] = useState(false)
    const [btnColorSize, setBtnColorSize] = useState(false)
    const [btnColorProperties, setBtnColorProperties] = useState(false)
    const [btnColorAll, setBtnColorAll] = useState(false)


    const [filteredData, setFilteredData] = useState([])
    const [matchedInventoryList, setmatchedInventoryList] = useState([])

    const [restInventory, setRestInventory] = useState({})
    const [loading, setLoading] = useState(false)
    const [preference, setPreference] = useState(false)
    const [matchValue, setMatchValue] = useState([])
    const [inconsidrationValue, setInconsidrationValue] = useState([])
    const [acceptedValue, setAcceptedValue] = useState([])
    const [rejectedValue, setRejectedValue] = useState([])
    const [matchlengthValue, setMatchlengthValue] = useState([])

    // custom matched text box
    const [matchToggleCheckBox, setMatchToggleCheckBox2] = useState(false)

    const [accessType, setAccessType] = useState()
    const [accessBusinessID, setAccessBusinessID] = useState()

    // Marketplace Inventory States
    const [marketplaceInventory, setMarketplaceInventory] = useState([])
    const [showMyInventory, setShowMyInventory] = useState(true)
    const [showMarketplaceInventory, setShowMarketplaceInventory] = useState(false)

    // for On Screen Buttons
    var BtnMatched = btnColorMatched ? '#826AF7' : '#F2F2F3'
    var BtnInconsidration = btnColorInconsidration ? '#826AF7' : '#F2F2F3'
    var BtnAccepted = btnColorAccepted ? '#826AF7' : '#F2F2F3'
    var BtnRejected = btnColorRejected ? '#826AF7' : '#F2F2F3'
    var textMatched = btnColorMatched ? '#FFFFFF' : '#7D7F88'
    var textInconsidration = btnColorInconsidration ? '#FFFFFF' : '#7D7F88'
    var textAccepted = btnColorAccepted ? '#FFFFFF' : '#7D7F88'
    var textRejected = btnColorRejected ? '#FFFFFF' : '#7D7F88'

    // for State Change Buttons
    var BtnMatchedModel = btnColorMatchedModel ? '#866EF9' : '#fff'
    var BtnInconsidrationModel = btnColorInconsidrationModel ? '#866EF9' : '#fff'
    var BtnAcceptedModel = btnColorAcceptedModel ? '#866EF9' : '#fff'
    var BtnRejectedModel = btnColorRejectedModel ? '#866EF9' : '#fff'
    var textMatchedModel = btnColorMatchedModel ? '#fff' : '#7D7F88'
    var textInconsidrationModel = btnColorInconsidrationModel ? '#FFFFFF' : '#7D7F88'
    var textAcceptedModel = btnColorAcceptedModel ? '#FFFFFF' : '#7D7F88'
    var textRejectedModel = btnColorRejectedModel ? '#FFFFFF' : '#7D7F88'

    // For Filter Button
    var BtnPrice = btnColorPrice ? '#826AF7' : '#FFFFFF'
    var BtnAll = btnColorAll ? '#826AF7' : '#FFFFFF'

    var BtnLocation = btnColorLocation ? '#826AF7' : '#FFFFFF'
    var BtnSize = btnColorSize ? '#826AF7' : '#FFFFFF'
    var BtnProperties = btnColorProperties ? '#826AF7' : '#FFFFFF'

    var textPrice = btnColorPrice ? '#FFFFFF' : '#7D7F88'
    var textAll = btnColorAll ? '#FFFFFF' : '#7D7F88'

    var textSize = btnColorSize ? '#FFFFFF' : '#7D7F88'
    var textLocation = btnColorLocation ? '#FFFFFF' : '#7D7F88'
    var textProperties = btnColorProperties ? '#FFFFFF' : '#7D7F88'

    // open Model
    const [filterModalOpen, setFilterModalOpen] = useState(false)
    const [statusModalOpen, setStatusModalOpen] = useState(false)
    const [filterType, setFilterType] = useState("")
    const [viewStatus, setViewStatus] = useState("Matched")
    const [filterPrice, setFilterPrice] = useState([])
    const [filterSize, setFilterSize] = useState([])

    const [filterLocation, setFilterLocation] = useState([])

    const [filterAccomodation, setFilterAccomodation] = useState([])

    const [filterSale, setFilterSale] = useState(property_type == "Buy" ? true:false)
    const [filterLet, setFilterLet] = useState(property_type != "Buy" ? true:false)


    const [docId, setDocId] = useState("")
    const [fromTable, setFromTable] = useState("")
    // console.log("doc id : ", docId)

    const inventoryHandler = (id) => {
        switch (id) {
            case 1:
                setShowMyInventory(true)
                setShowMarketplaceInventory(false)
                loadInventoryList()
                break;
            case 2:
                setShowMyInventory(false)
                setShowMarketplaceInventory(true)
                loadMarketplaceInventory()
                break;
        }
    }

    const FilterTypeHandler = (text) => {
        switch (true) {
            case (text == "Matched"):
                setViewStatus("Matched")
                setBtnColorMatchedModel(true)
                setBtnColorInconsidrationModel(false)
                setBtnColorAcceptedModel(false)
                setBtnColorRejectedModel(false)
                updateInventory("Matched")
                break;
            case (text == "Inconsidration"):
                setBtnColorMatchedModel(false)
                setBtnColorInconsidrationModel(true)
                setBtnColorAcceptedModel(false)
                setBtnColorRejectedModel(false)
                updateInventory("Inconsidration")
                setViewStatus("Inconsidration")
                break;
            case (text == "Accepted"):
                setBtnColorMatchedModel(false)
                setBtnColorInconsidrationModel(false)
                setBtnColorAcceptedModel(true)
                setBtnColorRejectedModel(false)
                updateInventory("Accepted")
                setViewStatus("Accepted")
                break;
            case (text == "Rejected"):
                setBtnColorMatchedModel(false)
                setBtnColorInconsidrationModel(false)
                setBtnColorAcceptedModel(false)
                setBtnColorRejectedModel(true)
                updateInventory("Rejected")
                setViewStatus("Rejected")
                break;
            default:
                break;
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

    // For on Screen Button
    const ColorChangeMatch = () => {
        setBtnColorMatched(true)
        setBtnColorInconsidration(false)
        setBtnColorAccepted(false)
        setBtnColorRejected(false)
    }
    const ColorChangeInconsidration = () => {
        setBtnColorMatched(false)
        setBtnColorInconsidration(true)
        setBtnColorAccepted(false)
        setBtnColorRejected(false)
    }
    const ColorChangeAccepted = () => {
        setBtnColorMatched(false)
        setBtnColorInconsidration(false)
        setBtnColorAccepted(true)
        setBtnColorRejected(false)
    }
    const ColorChangeRejected = () => {
        setBtnColorMatched(false)
        setBtnColorInconsidration(false)
        setBtnColorAccepted(false)
        setBtnColorRejected(true)
    }

    // const ColorChangePrice = () => {
    //     setBtnColorPrice(!btnColorPrice && true)
    // }
    // const ColorChangeSize = () => {
    //     setBtnColorSize(!btnColorSize && true)
    // }
    // const ColorChangeLocation = () => {
    //     setBtnColorLocation(!btnColorLocation && true)
    // }
    // const ColorChangeProperties = () => {
    //     setBtnColorProperties(!btnColorProperties && true)
    // }

    LogBox.ignoreLogs([
        "[react-native-gesture-handler] Seems like you\'re using an old API with gesture components, check out new Gestures system!",
    ]);

    // const id = uid()
    // console.log("id", id)

    const modalHandler = (id, from) => {
        setStatusModalOpen(true)
        setDocId(id)
        setFromTable(from)
    }

    const modalCloseHandler = () => {
        setStatusModalOpen(false)
        setDocId("")
        setFromTable("")
    }

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
        const response = await PermissionAPI.checkUserType(user.uid)
        const businessAccess = {
            user_role: "business",
            businessID: user.uid
        }
        console.log("type", response)
        if (response && response == 1) {
            const respone = await PermissionAPI.checkAccessType(user.uid)
            console.log("access", respone)
            setAccessType(respone[0].user_role)
            setAccessBusinessID(respone[0].businessID)
            loadInventoryList(respone[0].user_role, respone[0].businessID)
        }
        else {
            setAccessType("business")
            setAccessBusinessID(user.uid)
            loadInventoryList("business", user.uid)
        }
    }

    const showCustomMatchedInventory = (text) => {
        setMatchToggleCheckBox2(text)
        loadCustomInventoryList()
    }


    console.log("acessType", accessType)


    const loadCustomInventoryList = async () => {
        setLoading(true)
        const userID = user.uid
        setRestInventory([])
        let customInventory = []

        const response = await InventoryApi.getInventory(userID, accessType, accessBusinessID);
        if (response && response.length > 0) {
            response.map((item) => {
                if (item.viewStatus !== "Inconsidration") {
                    customInventory.push(item)
                }
            })
            setRestInventory(customInventory)
            setLoading(false)
        } else {
            setLoading(false)
        }
    }

    const loadInventoryList = async (access, business) => {
        setmatchedInventoryList([]);
        setMatchlengthValue([])
        // setRestInventory([])
        setLoading(true)
        const userID = user.uid
        let tempMatchValue = []
        let tempInconsidration = []
        let tempaccepted = []
        let tempRejected = []
        let tempmatchvalueLength = []

        let customInventory = []

        let customConsiderationInventory = []
        // console.log("id=>>", userID)
        var value = (items.budget / 100) * MATCHING_PRICE_LIMIT
        const upperPrice = parseInt(items.budget) + parseInt(value)
        const lowerPrice = items.budget - value
        let TotalSize = items.size
        if (items.size_type == "Kanal") {
            TotalSize = items.size * 20
        }
        var uppersize = parseInt(TotalSize) + parseInt(MATCHING_AREA_LIMIT)
        var lowerSize = parseInt(TotalSize) - parseInt(MATCHING_AREA_LIMIT)
        const response = await InventoryApi.getInventory(userID, access, business);
        // console.log("response: ", response)

        if (response && response.length > 0) {
            setmatchedInventoryList(response);
            // setRestInventory(response)
            for (let i = 0; i < response.length; i++) {
                if (
                    (lowerSize <= response[i].size && response[i].size <= uppersize && items.size_type == response[i].sizeType)
                    ||
                    (lowerPrice <= response[i].demand && response[i].demand <= upperPrice)
                    // || (items.societyName === response[i].societyName)
                    || (items.bedroomsQuantity == response[i].rooms.bedrooms && items.bathroomQuantity == response[i].rooms.bathrooms)
                ) {
                    if (items.societyName === response[i].societyName && items.inventoryProperty === response[i].propertyType) {
                        if (
                            (items.property_type === "Buy" && response[i].transactionType === "Sale")
                            || (items.property_type === "Rent" && response[i].transactionType === "Let")
                        ) {
                            tempMatchValue.push(response[i])
                            if (response[i].viewStatus === "Matched") {
                                tempmatchvalueLength.push(response[i])
                            }
                            else if (response[i].viewStatus === "Inconsidration") {
                                tempInconsidration.push(response[i])
                            }
                            else if (response[i].viewStatus === "Accepted") {
                                tempaccepted.push(response[i])
                            }
                            else if (response[i].viewStatus === "Rejected") {
                                tempRejected.push(response[i])
                            }
                        }
                    }

                }
                // else {
                //     customInventory.push(response[i])
                //     console.log("custome Inventory=>>", customInventory)
                // }
            }

            // response.map((item) => {
            //     if(item.viewStatus == "Inconsidration"){
            //         tempMatchValue.push(item)
            //     }
            // })

            // console.log("custom Inventory====>>", tempMatchValue)

            // if(customInventory && customInventory.length > 0 ) {
            //     setRestInventory(customInventory)
            // }
            // else {
            //     setRestInventory([])
            // }


            // console.log("restData", restData)
            // setRestInventory(restData && restData.length>0 ? restData : [])


            setMatchValue(tempMatchValue)
            setInconsidrationValue(tempInconsidration)
            setRejectedValue(tempRejected)
            setAcceptedValue(tempaccepted)
            setMatchlengthValue(tempmatchvalueLength)

            // setRestInventory(customInventory)
            SelectRquiredFilter()
            setLoading(false)
        }
        else {
            setLoading(false)
        }
        // console.log("tempMatchValue=>>>>>>>", tempMatchValue)
        // console.log("ikram",tempmatchvalueLength);
    }

    console.log("==============================<>=======", restInventory)

    const changeInventoryStatusHandler = async (docId) => {
        // const status = {
        //     leadID: id,
        //     status: "Inconsidration"
        // }

        setLoading(true)
        try {
            firestore()
                .collection('Inventory')
                .doc(docId)
                .update({
                    viewStatus: "Inconsidration"
                })
                .then(() => {
                    setMatchToggleCheckBox2(false)
                    setLoading(false)
                    loadInventoryList()
                })
        } catch (err) {
            // console.log(err)
            setLoading(false)
            // console.log(
            //     "Error occured",
            // )
        }
    }




    const updateInventory = async (status) => {
        setLoading(true)
        try {
            firestore()
                .collection(fromTable)
                .doc(docId)
                .update({
                    viewStatus: status,
                    ofLead: id
                })
                .then(() => {
                    // console.log("View Status Updated")
                    // setStatusModalOpen(false)
                    modalCloseHandler()
                    loadInventoryList()

                    setBtnColorPrice(false)
                    setBtnColorSize(false)
                    setBtnColorLocation(false)
                    setBtnColorProperties(false)
                    setFilterPrice([])
                    setFilterSize([])
                    setFilterLocation([])
                    setFilterAccomodation([])
                    setLoading(false)
                    // Alert.alert("Status Updated")
                    // navigation.navigate("Leads")
                })
        } catch (err) {
            // console.log(err)
            setLoading(false)
            // console.log(
            //     "Error occured",
            // )
        }
    }

    const SelectRquiredFilter = (value) => {

        switch (true) {
            case (value == "All"):
                setBtnColorAll(true)
                setBtnColorPrice(false)
                setBtnColorSize(false)
                setBtnColorLocation(false)
                setBtnColorProperties(false)
                setFilterType(value)
                break;
            case (value == "price"):
                setBtnColorPrice(true)
                setBtnColorSize(false)
                setBtnColorLocation(false)
                setBtnColorProperties(false)
                setBtnColorAll(false)

                setFilterType(value)
                break;
            case (value == "size"):
                setBtnColorPrice(false)
                setBtnColorSize(true)
                setBtnColorLocation(false)
                setBtnColorProperties(false)
                setBtnColorAll(false)

                setFilterType(value)
                break;
            case (value == "location"):
                setBtnColorPrice(false)
                setBtnColorSize(false)
                setBtnColorLocation(true)
                setBtnColorProperties(false)
                setBtnColorAll(false)

                setFilterType(value)
                break;
            case (value == "accomodation"):
                setBtnColorPrice(false)
                setBtnColorSize(false)
                setBtnColorLocation(false)
                setBtnColorProperties(true)
                setBtnColorAll(false)

                setFilterType(value)
                break;
            default:
                break;
        }

    }

    const loadMarketplaceInventory = async () => {
        setLoading(true)
        setMatchlengthValue([])
        let tempmatchvalueLength = [];
        let tempMatchValue = []

        const userID = user.uid
        var city = await AsyncStorage.getItem("@city");

        var value = (items.budget / 100) * MATCHING_PRICE_LIMIT
        const upperPrice = parseInt(items.budget) + parseInt(value)
        const lowerPrice = items.budget - value
        let TotalSize = items.size
        if (items.size_type == "Kanal") {
            TotalSize = items.size * 20
        }
        var uppersize = parseInt(TotalSize) + parseInt(MATCHING_AREA_LIMIT)
        var lowerSize = parseInt(TotalSize) - parseInt(MATCHING_AREA_LIMIT)

        const response = await MarketplaceAPI.getLeadInventoryMarketplace(userID, city, "Pakistan")

        // console.log("response>>",response)
        if (response && response.length > 0) {
            // setMarketplaceInventory(response)
            for (let i = 0; i < response.length; i++) {
                if (
                    (lowerSize <= response[i].size && response[i].size <= uppersize && items.size_type == response[i].sizeType)
                    ||
                    (lowerPrice <= response[i].demand && response[i].demand <= upperPrice)
                    // || (items.societyName === response[i].societyName)
                    || (items.bedroomsQuantity == response[i].rooms.bedrooms && items.bathroomQuantity == response[i].rooms.bathrooms)
                ) {
                    if (items.societyName === response[i].societyName && items.inventoryProperty === response[i].propertyType) {
                        if (
                            (items.property_type === "Buy" && response[i].transactionType === "Sale")
                            || (items.property_type === "Rent" && response[i].transactionType === "Let")
                        ) {
                            tempMatchValue.push(response[i])
                            if (response[i].viewStatus === "Matched") {
                                tempmatchvalueLength.push(response[i])
                            }
                        }
                    }
                }
            }
            setMatchValue(tempMatchValue)
            setMatchlengthValue(tempmatchvalueLength)
            setLoading(false)
        }
        else {
            setLoading(false)
        }
    }


    const ShowfilterResult = () => {
        var value = (items.budget / 100) * MATCHING_PRICE_LIMIT
        const upperPrice = parseInt(items.budget) + parseInt(value)
        const lowerPrice = items.budget - value
        let TotalSize = items.size
        if (items.size_type == "Kanal") {
            TotalSize = items.size * 20
        }
        var uppersize = parseInt(TotalSize) + parseInt(MATCHING_AREA_LIMIT)
        var lowerSize = parseInt(TotalSize) - parseInt(MATCHING_AREA_LIMIT)
        let tempPriceValue = []
        let tempSizeValue = []
        let tempLocationValue = []
        let tempAccomodationValue = []
        switch (true) {
            case (filterType == "price"):
                for (let i = 0; i < matchlengthValue.length; i++) {
                    if (lowerPrice <= matchlengthValue[i].demand && matchlengthValue[i].demand <= upperPrice) {
    
                      
                        tempPriceValue.push(matchlengthValue[i])
                    }
                }
                break;
            case (filterType == "size"):
                for (let i = 0; i < matchlengthValue.length; i++) {
                    if (lowerSize <= matchlengthValue[i].size && matchlengthValue[i].size <= uppersize && matchlengthValue[i].sizeType == items.size_type) {
                        tempSizeValue.push(matchlengthValue[i])
                    }
                }
                break;
            case (filterType == "location"):
                for (let i = 0; i < matchlengthValue.length; i++) {
                    if (matchlengthValue[i].societyName == items.societyName) {
                        tempLocationValue.push(matchlengthValue[i])
                    }
                }

                break;
            case (filterType == "accomodation"):
                for (let i = 0; i < matchlengthValue.length; i++) {
                    if (matchlengthValue[i].rooms.bedrooms == items.bedroomsQuantity && matchlengthValue[i].rooms.bathrooms == items.bathroomQuantity) {
                        tempAccomodationValue.push(matchlengthValue[i])
                    }
                }

                break;
            default:
                break;
        }
        const sortByPrice=tempPriceValue.sort((a, b) => (a.demand > b.demand ? 1 : -1));
        const sortBySize=tempSizeValue.sort((a, b) => (a.size > b.size ? 1 : -1));

        setFilterPrice(sortByPrice)
        setFilterSize(sortBySize)
        setFilterLocation(tempLocationValue)
        setFilterAccomodation(tempAccomodationValue)

    }


    // console.log("Match Data", filterPrice)
    // console.log("filterType", filterType)

    // console.log("result",(filterType != "All" )&& filterPrice.length == 0 && filterSize.length == 0 && filterLocation.length == 0 && filterAccomodation.length == 0)


    return (
        <View style={{ flex: 1, backgroundColor: "#fbfcfa" }}>
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
                    <Text style={HeaderStyle.HeaderText}>View Inventory</Text>
                    {
                        btnColorMatched === true ?
                            <TouchableOpacity style={{ rotation: 90, marginRight: 5 }} onPress={() => setFilterModalOpen(true)}>
                                <Icon1 name="equalizer" color="#1A1E25" size={20} />
                            </TouchableOpacity>
                            :
                            null
                    }

                </View>
            </View>


            {/* Menu for On-Screen Buttons */}
            <View style={{ width: "92%", justifyContent: "space-between", margin: 15, marginBottom: 40, alignSelf: "center" }}>
                <Text style={styles.screenHeading}>My Inventory</Text>
                <View style={{ flex: 1, flexDirection: "row", justifyContent: "space-between", marginTop: 15, }}>
                    <TouchableOpacity onPress={() => ColorChangeMatch()}
                        style={{ flex: 1, backgroundColor: BtnMatched, borderWidth: 1, borderColor: "#E3E3E7", height: 30, justifyContent: 'center', alignItems: 'center', borderRadius: 92, marginRight: 10 }}>
                        <Text style={{ color: textMatched, fontSize: 12 }}>Matched</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => ColorChangeInconsidration()}
                        style={{ flex: 1.5, backgroundColor: BtnInconsidration, borderWidth: 1, borderColor: "#E3E3E7", height: 30, justifyContent: 'center', alignItems: 'center', borderRadius: 92, marginRight: 10 }}>
                        <Text style={{ color: textInconsidration, fontSize: 12 }}>In-Considration</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => ColorChangeAccepted()}
                        style={{ flex: 1, backgroundColor: BtnAccepted, borderWidth: 1, borderColor: "#E3E3E7", height: 30, justifyContent: 'center', alignItems: 'center', borderRadius: 92, marginRight: 10 }}>
                        <Text style={{ color: textAccepted, fontSize: 12 }}>Accepted</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => ColorChangeRejected()}
                        style={{ flex: 1, backgroundColor: BtnRejected, borderWidth: 1, borderColor: "#E3E3E7", height: 30, justifyContent: 'center', alignItems: 'center', borderRadius: 92, marginRight: 10 }}>
                        <Text style={{ color: textRejected, fontSize: 12 }}>Rejected</Text>
                    </TouchableOpacity>
                </View>
            </View>

            {/* <View style={{ flexDirection: 'row', alignItems: 'center', alignSelf: 'center', justifyContent:'space-between'}}>
                <View>
                    
                </View>

            </View> */}

            <View style={{ flexDirection: 'row', alignItems: 'center', alignSelf: 'center', justifyContent: 'space-between', width: '95%', marginTop: 15 }}>
                <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                    <TouchableOpacity style={{
                        backgroundColor: showMyInventory ? '#917AFD' : '#F2F2F3',
                        padding: 5,
                        borderRadius: 5,
                        width: 90
                    }}
                        onPress={() => inventoryHandler(1)}
                    >
                        <Text style={{
                            fontSize: 12,
                            color: showMyInventory ? 'white' : '#1A1E25',
                            fontWeight: '500',
                            alignSelf: 'center'
                        }}>My Inventory</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={{
                        backgroundColor: showMarketplaceInventory ? '#917AFD' : '#F2F2F3',
                        padding: 5,
                        borderRadius: 5,
                        marginLeft: 10,
                        width: 90
                    }}
                        onPress={() => inventoryHandler(2)}
                    >
                        <Text style={{
                            fontSize: 12,
                            color: showMarketplaceInventory ? 'white' : '#1A1E25',
                            fontWeight: '500',
                            alignSelf: 'center'
                        }}>Marketplace</Text>
                    </TouchableOpacity>
                </View>
                {
                    btnColorMatched ?
                        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                            <Text style={{ fontSize: 15, color: '#6342E8', fontWeight: '500', marginRight: 10 }}>Custom Match</Text>
                            <CheckBox
                                disabled={false}
                                value={matchToggleCheckBox}
                                // onValueChange={(text) => setMatchToggleCheckBox2(text)}
                                onValueChange={(text) => showCustomMatchedInventory(text)}
                                tintColors={{ true: "#6342E8", false: "#6342E8" }}
                            />
                        </View>
                        : null
                }
            </View>




            {/* {
                matchlengthValue.length === 0 && btnColorMatched === true ?
                    <View >
                        <Text style={styles.emptyUserRecord}>No Match Inventory</Text>
                    </View>
                    :
                    inconsidrationValue.length === 0 && btnColorInconsidration === true ?
                        <View >
                            <Text style={styles.emptyUserRecord}>No In-Considration Inventory</Text>
                        </View>
                        :
                        acceptedValue.length === 0 && btnColorAccepted === true ?
                            <View >
                                <Text style={styles.emptyUserRecord}>No Accepted Inventory</Text>
                            </View>
                            :
                            rejectedValue.length === 0 && btnColorRejected === true ?
                                <View >
                                    <Text style={styles.emptyUserRecord}>No Rejected inventory</Text>
                                </View>
                                :
                                null
            } */}

            {/* {
                matchToggleCheckBox ? 
                <CustomMatched/> : null
            } */}

            <View style={{ marginTop: 15 }} />
            {/* Select Filter and show Items according to Lead Requirement */}
            {
                btnColorMatched === true ?
                    <FlatList
                        data={filterPrice.length > 0 ? filterPrice : filterSize.length > 0 ? filterSize : filterLocation.length > 0 ? filterLocation : filterAccomodation.length > 0 ? filterAccomodation : matchlengthValue}
                        keyExtractor={(stock) => stock.id}

                        renderItem={({ item }) => {
                            return (
                                <LeadInventoryCard
                                    propertyImg={item.propertyImg}
                                    property={item.houseName}
                                    address={item.cityName}
                                    society={item.societyName}
                                    rooms={item.rooms.bedrooms}
                                    id={item.id}
                                    area={item.size}
                                    areatype={item.sizeType}
                                    rent={item.demand}
                                    transactionType={item.transactionType}
                                    propertyType ={item.propertyType}
                                    viewStatus={item.viewStatus}
                                    openModal={() => modalHandler(item.id, item.from)}
                                    navigation={() => navigation.navigate('InventoryDetailScreen', item)}
                                />
                            )
                            // }
                        }}
                    />
                    :
                    <FlatList
                        data={matchValue}
                        keyExtractor={(stock) => stock.id}
                        renderItem={({ item }) => {
                            if (item.viewStatus === "Inconsidration" && btnColorInconsidration === true) {
                                return (
                                    <LeadInventoryCard
                                        propertyImg={item.propertyImg}
                                        property={item.houseName}
                                        address={item.cityName}
                                        society={item.societyName}
                                        rooms={item.rooms.bedrooms}
                                        id={item.id}
                                        area={item.size}
                                        areatype={item.sizeType}
                                        rent={item.demand}
                                        transactionType={item.transactionType}
                                        propertyType ={item.propertyType}
                                        viewStatus={item.viewStatus}
                                        openModal={() => modalHandler(item.id, item.from)}
                                    />
                                )
                            }
                            else if (item.viewStatus === "Accepted" && btnColorAccepted === true) {
                                return (
                                    <LeadInventoryCard
                                        propertyImg={item.propertyImg}
                                        property={item.houseName}
                                        address={item.cityName}
                                        society={item.societyName}
                                        rooms={item.rooms.bedrooms}
                                        id={item.id}
                                        area={item.size}
                                        areatype={item.sizeType}
                                        rent={item.demand}
                                        transactionType={item.transactionType}
                                        propertyType ={item.propertyType}
                                        viewStatus={item.viewStatus}
                                        openModal={() => modalHandler(item.id, item.from)}
                                        navigation1={() => navigation.navigate("DealInfo", { items, item })}
                                    />
                                )

                            }
                            else if (item.viewStatus === "Rejected" && btnColorRejected === true) {
                                return (
                                    <LeadInventoryCard
                                        propertyImg={item.propertyImg}
                                        property={item.houseName}
                                        address={item.cityName}
                                        society={item.societyName}
                                        rooms={item.rooms.bedrooms}
                                        id={item.id}
                                        area={item.size}
                                        areatype={item.sizeType}
                                        rent={item.demand}
                                        transactionType={item.transactionType}
                                        propertyType ={item.propertyType}
                                        viewStatus={item.viewStatus}
                                        openModal={() => modalHandler(item.id, item.from)}
                                    />
                                )
                            }
                        }}
                    />
            }


            {/* Model for changed state changed */}
            <Modal visible={statusModalOpen} animationType='slide' transparent={true}>
                <View style={{ flex: 1, flexDirection: 'column', }}>
                    <View style={{ height: '60%', opacity: 0.5, backgroundColor: '#bebebe', }} />
                    <View style={{ height: '40%', width: "100%", backgroundColor: 'white', borderTopLeftRadius: 40, borderTopRightRadius: 40 }}>
                        <View style={{ flexDirection: 'row', alignContent: 'center', justifyContent: 'space-between', marginTop: 5 }}>
                            <Text style={{ fontSize: 18, fontWeight: '900', color: '#000000', marginLeft: 20, margin: 10 }}>
                                Property Lead Status
                            </Text>
                            <TouchableOpacity style={{ marginHorizontal: 20, marginTop: 15 }} onPress={() => modalCloseHandler()}>
                                <Cross
                                    name='cross'
                                    color="#A1A1A1"
                                    size={20}
                                />
                            </TouchableOpacity>
                        </View>
                        <View style={{ width: "98%", alignContent: "center", alignItems: "center" }}>
                            <TouchableOpacity onPress={() => FilterTypeHandler("Matched")}
                                style={{ height: 48, width: "90%", backgroundColor: BtnMatchedModel, marginVertical: 5, borderColor: '#8A72FA', borderRadius: 39, borderWidth: 1, justifyContent: 'center', alignItems: 'center' }}>
                                <Text style={{ color: textMatchedModel, fontSize: 14, fontWeight: "700" }}>Shown to customer</Text>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={() => FilterTypeHandler("Inconsidration")}
                                style={{ height: 48, width: "90%", backgroundColor: BtnInconsidrationModel, marginVertical: 5, borderColor: '#8A72FA', borderRadius: 39, borderWidth: 1, justifyContent: 'center', alignItems: 'center' }}>
                                <Text style={{ color: textInconsidrationModel, fontSize: 14, fontWeight: "700" }}>Under considration</Text>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={() => FilterTypeHandler("Accepted")}
                                style={{ height: 48, width: "90%", backgroundColor: BtnAcceptedModel, marginVertical: 5, borderColor: '#8A72FA', borderRadius: 39, borderWidth: 1, justifyContent: 'center', alignItems: 'center' }}>
                                <Text style={{ color: textAcceptedModel, fontSize: 14, fontWeight: "700" }}>Accepted</Text>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={() => FilterTypeHandler("Rejected")}
                                style={{ height: 48, width: "90%", backgroundColor: BtnRejectedModel, marginVertical: 5, borderColor: '#8A72FA', borderRadius: 39, borderWidth: 1, justifyContent: 'center', alignItems: 'center' }}>
                                <Text style={{ color: textRejectedModel, fontSize: 14, fontWeight: "700" }}>Rejected</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>

            <Modal visible={filterModalOpen} animationType='slide' transparent={true}>
                <View style={{ flex: 1, flexDirection: 'column', }}>
                    <View style={{ flex: 1, opacity: 0.5, backgroundColor: '#bebebe', }} />
                    <View style={{ width: "100%", backgroundColor: '#FFFFFF', borderTopLeftRadius: 40, borderTopRightRadius: 40 }}>
                        <View style={{ flexDirection: 'row', alignContent: 'center', justifyContent: 'space-between', marginTop: 5 }}>
                            <Text style={{ fontSize: 14, fontWeight: '900', color: '#000000', marginLeft: 20, margin: 10 }}>
                                Match by
                            </Text>
                            <TouchableOpacity style={{ marginHorizontal: 20, marginTop: 15 }} onPress={() => setFilterModalOpen(false)}>
                                <Icon2
                                    name='cross'
                                    color="#A1A1A1"
                                    size={20}
                                />
                            </TouchableOpacity>
                        </View>
                        <View style={{ width: "98%", alignContent: "center", alignItems: "center" }}>
                            <TouchableOpacity onPress={() => SelectRquiredFilter("All")}
                                style={{ height: 48, width: "90%", backgroundColor: BtnAll, marginVertical: 5, borderColor: '#8A72FA', borderRadius: 39, borderWidth: 1, justifyContent: 'center', alignItems: 'center' }}>
                                <Text style={{ color: textAll, fontSize: 14, fontWeight: "700" }}>All Inventory</Text>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={() => SelectRquiredFilter("price")}
                                style={{ height: 48, width: "90%", backgroundColor: BtnPrice, marginVertical: 5, borderColor: '#8A72FA', borderRadius: 39, borderWidth: 1, justifyContent: 'center', alignItems: 'center' }}>
                                <Text style={{ color: textPrice, fontSize: 14, fontWeight: "700" }}>Price</Text>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={() => SelectRquiredFilter("size")}
                                style={{ height: 48, width: "90%", backgroundColor: BtnSize, marginVertical: 5, borderColor: '#8A72FA', borderRadius: 39, borderWidth: 1, justifyContent: 'center', alignItems: 'center' }}>
                                <Text style={{ color: textSize, fontSize: 14, fontWeight: "700" }}>Size</Text>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={() => SelectRquiredFilter("location")}
                                style={{ height: 48, width: "90%", backgroundColor: BtnLocation, marginVertical: 5, borderColor: '#8A72FA', borderRadius: 39, borderWidth: 1, justifyContent: 'center', alignItems: 'center' }}>
                                <Text style={{ color: textLocation, fontSize: 14, fontWeight: "700" }}>Location</Text>
                            </TouchableOpacity>
                            {/* <TouchableOpacity onPress={() => SelectRquiredFilter("accomodation")}
                                style={{ height: 48, width: "90%", backgroundColor: BtnProperties, marginVertical: 5, borderColor: '#8A72FA', borderRadius: 39, borderWidth: 1, justifyContent: 'center', alignItems: 'center' }}>
                                <Text style={{ color: textProperties, fontSize: 14, fontWeight: "700" }}>Accomodation</Text>
                            </TouchableOpacity> */}
                            <TouchableOpacity onPress={() => { setFilterModalOpen(false), ShowfilterResult() }}
                                style={{ height: 38, width: "45%", backgroundColor: "#8A72FA", marginVertical: 10, borderColor: '#8A72FA', borderRadius: 39, borderWidth: 1, justifyContent: 'center', alignItems: 'center' }}>
                                <Text style={{ fontSize: 14, fontWeight: '700', color: "#FFFFFF" }}>Show Results</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>

            {/* Match Inventory Modal */}
            <Modal visible={matchToggleCheckBox} animationType='slide' transparent={true}>
                <View style={{ flex: 1 }}>
                    <View style={{ height: '20%', backgroundColor: 'grey', opacity: 0.5 }}></View>
                    <View style={{ height: '80%', marginTop: 'auto', elevation: 7 }}>
                        <View style={{
                            flex: 1, backgroundColor: '#fbfcfa', bottom: 0,
                            left: 0,
                            right: 0,
                            zIndex: 10,
                            borderTopLeftRadius: 10,
                            borderTopRightRadius: 10
                        }}
                        >
                            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                                <View />
                                <Text style={{ fontSize: 20, color: 'black', alignSelf: 'center', fontWeight: '700', marginLeft: 35, letterSpacing: 0.5 }}>Match Inventory</Text>
                                <TouchableOpacity style={[styles.closeIconContainer, { margin: 10 }]} onPress={() => setMatchToggleCheckBox2(false)}>
                                    <Icon1
                                        name='close'
                                        color="black"
                                        size={25}
                                    />
                                </TouchableOpacity>
                            </View>

                            <View style={inventoryModalStyles.filterContainer}>
                                {
                                    property_type == "Buy" ?
                                        <TouchableOpacity
                                            style={[inventoryModalStyles.filterButton, { backgroundColor: filterSale ? '#826AF7' : '#F2F2F3' }]}
                                            // onPress={() => changeFilterHandler(1)}
                                        >
                                            <Text style={[inventoryModalStyles.filterButtonText, { color: filterSale ? '#FFFFFF' : '#7D7F88' }]}>For Sale</Text>
                                        </TouchableOpacity>
                                        :
                                        <TouchableOpacity
                                            style={[inventoryModalStyles.filterButton, { backgroundColor: filterLet ? '#826AF7' : '#F2F2F3' }]}
                                            // onPress={() => changeFilterHandler(2)}
                                        >
                                            <Text style={[inventoryModalStyles.filterButtonText, { color: filterLet ? '#FFFFFF' : '#7D7F88' }]}>To Let</Text>
                                        </TouchableOpacity>

                                }


                            </View>

                            {/* <Text style={inventoryModalStyles.screenHeading}>My Inventory</Text>
                            <Text style={inventoryModalStyles.totalInventory}>Total Properties: {totalProperties}</Text> */}

                            {
                                restInventory.length < 0 ?
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
                                        data={restInventory}
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
                                                        backPress={() => changeInventoryStatusHandler(item.id)}
                                                    />
                                                )
                                            }
                                        }}
                                        refreshControl={<RefreshControl refreshing={false} onRefresh={loadCustomInventoryList} />}
                                    />
                                    :
                                    filterLet == true && filterSale == false ?
                                        <FlatList
                                            data={restInventory}
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
                                                            backPress={() => changeInventoryStatusHandler(item.id)}
                                                        //image="https://images.pexels.com/photos/323780/pexels-photo-323780.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
                                                        // navigatePress={() => navigation.navigate('InventoryDetailScreen', item)}
                                                        />
                                                    )
                                                }
                                            }}
                                            refreshControl={<RefreshControl refreshing={false} onRefresh={loadCustomInventoryList} />}
                                        />
                                        : <Text style={inventoryModalStyles.errorText}>No Inventories Found</Text>
                            }
                        </View>

                    </View>
                </View>
            </Modal>

            {/* {
                matchToggleCheckBox ? 
                    <CustomMatched/>
                : null
            } */}


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
        // alignSelf: 'center',
        fontWeight: '500',
        // alignItems: 'center',
        fontSize: 15,

    },
    heading: {
        fontFamily: 'Lato',
        fontWeight: '700',
        fontSize: 16,
        color: 'black',
        marginTop: 2
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
    }

})

const inventoryModalStyles = StyleSheet.create({
    filterContainer: {
        // borderColor:'red',
        // borderWidth:1, 
        flexDirection: 'row',
        marginTop: 20,
        // width: 140,
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
        fontWeight: '700',
        fontSize: 17,
        fontStyle: 'normal',
        marginTop: 20
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
        width: 90,
        backgroundColor: '#F0F0F1',
        height: 30,
        borderRadius: 4,
        // alignItems:'center',
        justifyContent: 'center',
        elevation: 1,
        alignSelf: "flex-end",
        // marginRight: 30,
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
