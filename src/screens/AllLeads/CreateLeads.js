import React, { useState, useEffect, useContext, useRef } from 'react';
import {
    Image,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
    Alert,
    Modal,
    FlatList,
    ActivityIndicator,
    ImageBackground,
    PermissionsAndroid,
    ScrollView,
    Dimensions,
    BackHandler,
    createElement
} from 'react-native';
import { WelcomeScreenStyles } from '../../constants/Styles';
import Icon from 'react-native-vector-icons/AntDesign';
import Icon3 from 'react-native-vector-icons/Ionicons'
import { Picker } from '@react-native-picker/picker';
import Icon1 from 'react-native-vector-icons/EvilIcons'
import Icons from 'react-native-vector-icons/MaterialCommunityIcons'
import { HeaderStyle } from '../../constants/Styles';
import { AuthContext } from '../../auth/AuthProvider'
import Spinner from 'react-native-loading-spinner-overlay';
import { MaskedTextInput } from "react-native-mask-text";
import { AreaData, apartmentAreaData } from '../../utils/AreaData';
import { leadSource } from '../../utils/LeadSource';
import LinearGradient from 'react-native-linear-gradient';
import LeadApi from '../../api/LeadsRequest'
import AsyncStorage from '@react-native-async-storage/async-storage'
import firestore from '@react-native-firebase/firestore'
import { Button } from 'react-native-paper';
import PermissionAPI from '../../api/PermissionsAPIs/checkUserAPI'
import { NotificationApi } from '../../services';
import storage from "@react-native-firebase/storage"
import { launchCamera, launchImageLibrary } from 'react-native-image-picker';
export default function CreateLeads({ navigation, route }) {
    const { user } = useContext(AuthContext);
    const { type, businessID } = route.params
    //Leads Type 
    const [btnColorRent, setBtnColorRent] = useState(false)
    const [btnColorBuy, setBtnColorBuy] = useState(true)
    const [btnColorSale, setBtnColorSale] = useState(false)
    const [btnColorToLet, setBtnColorToLet] = useState(false)
    const [salePerson, setSalePerson] = useState(user.displayName)
    //Property Catagory
    const [btnColorResidentiol, setBtnColorResidentiol] = useState(true)
    const [btnColorComercial, setBtnColorComercial] = useState(false)
    const [btnColorSemiComercial, setBtnColorSemiComercial] = useState(false)
    // Rooms
    const [bedroomsQuantity, setBedroomsQuantity] = useState(0)
    const [bathroomQuantity, setBathroomQuantity] = useState(0)
    // Unit Type
    const [btnColorSingle, setBtnColorSingle] = useState(true)
    const [btnColorDouble, setBtnColorDouble] = useState(false)
    // Portion Type
    const [btnColorComplete, setBtnColorComplete] = useState(false)
    const [btnColorFirstFloor, setBtnColorFirstFloor] = useState(true)
    const [btnColorSecondFloor, setBtnColorSecondFloor] = useState(false)
    // Values Type
    const [value, setValue] = useState("")
    const [valueSource, setValueSource] = useState("")
    const [propertyType, setPropertyType] = useState("Buy")
    const [catagory, setCategory] = useState("Residentiol")
    const [portionType, setPortionType] = useState("FirstFloor")
    const [budget, setBudget] = useState(0)
    const [location, setLocation] = useState("")
    const [showLocationOpetion, setShowLocationOpetion] = useState(true)
    const [size, setSize] = useState("")
    const [sizeType, setSizeType] = useState("Marla")
    const [sourceType, setSourceType] = useState("Medium")
    const [leadName, setLeadName] = useState("")
    const [mobile, setMobile] = useState("")
    const [showPortionOption, setShowPortionOption] = useState(false)
    const [loading, setLoading] = useState(false)
    const [nameError, setNameError] = useState("")
    const [mobileError, setMobileError] = useState("")
    const [budgetError, setBudgetError] = useState("")
    const [unitType, setUnitType] = useState("Single")
    // const [society, setSociety] = useState("")
    const [houseNo, setHouseNo] = useState("")
    const [showHouseNoOpetion, setShowHouseNoOpetion] = useState(false)
    const [houseAddressError, setHouseAddressError] = useState("")
    const [description, setDescription] = useState("")
    const [showButtonOpetion, setShowButtonOpetion] = useState(false)
    // Society States
    const [societyName, setSocietyName] = useState("")
    const [searchSocietyName, setSearchSocietyName] = useState("")
    const [societyData, setSocietyData] = useState("")
    const [filterSocietyData, setFilterSocietyData] = useState("")
    const [cityName, setCityName] = useState("")
    // Property States
    const [houseProperty, setHouseProperty] = useState(true)
    const [flatProperty, setFlatProperty] = useState(false)
    const [farmHouseProperty, setFarmHouseProperty] = useState(false)
    const [pentHouseProperty, setPentHouseProperty] = useState(false)

    const [officeProperty, setOfficeProperty] = useState(false)
    const [shopProperty, setShopProperty] = useState(false)
    const [buildingProperty, setBuildingProperty] = useState(false)
    const [factoryProperty, setFactoryProperty] = useState(false)

    const [housesProperty, setHousesProperty] = useState(true)
    const [plotsProperty, setPlotsProperty] = useState(false)
    const [shopsProperty, setShopsProperty] = useState(false)
    const [officesProperty, setOfficesProperty] = useState(false)
    const [agricultureProperty, setAgrecultureProperty] = useState(false)
    const [farmHousesProperty, setFarmHousesProperty] = useState(false)
    const [pentHopusesProperty, setPentHousesProperty] = useState(false)
    const [buildingsProperty, setBuildingsProperty] = useState(false)
    const [flatsProperty, setFlatsProperty] = useState(false)
    const [files, setFiles] = useState(false)

    const [addressModalOpen, setAddressModalOpen] = useState(false)


    const [newStatus, setNewStatus] = useState(true)
    const [qualifiedStatus, setQualifiedStatus] = useState(false)
    const [negotiationStatus, setNegotiationStatus] = useState(false)
    const [coldStatus, setColdStatus] = useState(false)
    const [wonStatus, setWonStatus] = useState(false)
    const [rejectedStatus, setRejectedStatus] = useState(false)
    const [personalUser, setPersonalUser] = useState([])
    // Facilities States
    const [gasFacilities, setGasFacilities] = useState(false)
    const [facingParkFacilities, setFacingParkFacilities] = useState(true)
    const [mainRoadFacilities, setMainRoadFacilities] = useState(false)
    const [cornerFacilities, setCornerFacilities] = useState(false)
    const [gatedFacilities, setGatedFacilities] = useState(false)
    const [ownerBuildFacilities, setOwnerBuildFacilities] = useState(false)
    const [userType, setUserType] = useState("")
    // ReassignId
    const [reassignId, setReassignId] = useState("")
    const [oneDeviceToken, setOneDeviceToken] = useState("")
    // Focus on Error statement
    const mobileFocus = useRef(null);
    const NameFocus = useRef(null);
    const AddressFocus = useRef(null);
    // lead document id 
    // const [docID, setDocId] = useState("")
    var docID = ""
    // Image states
    const [showImageModal, setShowImageModel] = useState(false)
    const [imageUri, setimageUri] = useState('');
    const [image, setimage] = useState(null);
    const [transferred, setTransferred] = useState(0);
    const username_regux = /^[a-zA-Z\s]*$/;
    var regExp = /^(\d+)?$/
    useEffect(() => {
        getUsers()
        checkPermissions()
    }, [])
    const sendNotification = async () => {
        if (oneDeviceToken !== "") {
            try {
                let res = await NotificationApi("Lead Assign", `${user.displayName} assign a new lead to you`, oneDeviceToken)
                console.log("notification responce: ", res)
                if (res.msg === "Successfully") {
                    navigation.goBack()
                }
                else {
                    alert("Notication not Send But Lead created")
                    navigation.goBack()
                }
            } catch (error) {
                alert("Notication error But Lead created ")
                navigation.goBack()
            }
        }
        else {
            navigation.goBack()
        }

    }

    const getUsers = async () => {
        // var userList = [];
        // console.log(id)
        let id = user.uid
        let tempUser = []
        await firestore()
            .collection('UserSettings')
            .where('user_id', '==', id)
            .get()
            .then(querySnapshot => {
                querySnapshot.forEach(doc => {
                    const { name, uid, deviceToken } = doc.data()
                    tempUser.push({
                        username: name,
                        userId: uid,
                        deviceToken: deviceToken,
                    })

                });
            })
        console.log("temp user", tempUser)
        setPersonalUser(tempUser)
    }
    // check Rights about access somethings 
    const checkPermissions = async () => {
        const response = await PermissionAPI.checkUserType(user.uid)
        setUserType(response)
        console.log("type", response)
    }
    // this function is used to handle property Type 

    const changePropertyHandler = (id) => {
        // console.log("id>>>>>>>>>>>>>>>>", id)

        switch (id) {
            case 1:
                setHouseProperty(true)
                setFlatProperty(false)
                setFarmHouseProperty(false)
                setPentHouseProperty(false)

                setOfficeProperty(false)
                setShopProperty(false)
                setBuildingProperty(false)
                setFactoryProperty(false)

                setHousesProperty(false)
                setPlotsProperty(false)
                setShopsProperty(false)
                setOfficesProperty(false)
                setAgrecultureProperty(false)
                setFarmHousesProperty(false)
                setPentHousesProperty(false)
                setBuildingsProperty(false)
                setFlatsProperty(false)
                setFiles(false)
                break;
            case 2:
                setHouseProperty(false)
                setFlatProperty(true)
                setFarmHouseProperty(false)
                setPentHouseProperty(false)

                setOfficeProperty(false)
                setShopProperty(false)
                setBuildingProperty(false)
                setFactoryProperty(false)

                setHousesProperty(false)
                setPlotsProperty(false)
                setShopsProperty(false)
                setOfficesProperty(false)
                setAgrecultureProperty(false)
                setFarmHousesProperty(false)
                setPentHousesProperty(false)
                setBuildingsProperty(false)
                setFlatsProperty(false)
                setFiles(false)
                break;
            case 3:
                setHouseProperty(false)
                setFlatProperty(false)
                setFarmHouseProperty(true)
                setPentHouseProperty(false)

                setOfficeProperty(false)
                setShopProperty(false)
                setBuildingProperty(false)
                setFactoryProperty(false)

                setHousesProperty(false)
                setPlotsProperty(false)
                setShopsProperty(false)
                setOfficesProperty(false)
                setAgrecultureProperty(false)
                setFarmHousesProperty(false)
                setPentHousesProperty(false)
                setBuildingsProperty(false)
                setFlatsProperty(false)
                setFiles(false)
                break;
            case 4:
                setHouseProperty(false)
                setFlatProperty(false)
                setFarmHouseProperty(false)
                setPentHouseProperty(true)

                setOfficeProperty(false)
                setShopProperty(false)
                setBuildingProperty(false)
                setFactoryProperty(false)

                setHousesProperty(false)
                setPlotsProperty(false)
                setShopsProperty(false)
                setOfficesProperty(false)
                setAgrecultureProperty(false)
                setFarmHousesProperty(false)
                setPentHousesProperty(false)
                setBuildingsProperty(false)
                setFlatsProperty(false)
                setFiles(false)
                break;

            case 5:
                setHouseProperty(false)
                setFlatProperty(false)
                setFarmHouseProperty(false)
                setPentHouseProperty(false)

                setOfficeProperty(true)
                setShopProperty(false)
                setBuildingProperty(false)
                setFactoryProperty(false)

                setHousesProperty(false)
                setPlotsProperty(false)
                setShopsProperty(false)
                setOfficesProperty(false)
                setAgrecultureProperty(false)
                setFarmHousesProperty(false)
                setPentHousesProperty(false)
                setBuildingsProperty(false)
                setFlatsProperty(false)
                setFiles(false)
                break;

            case 6:
                setHouseProperty(false)
                setFlatProperty(false)
                setFarmHouseProperty(false)
                setPentHouseProperty(false)

                setOfficeProperty(false)
                setShopProperty(true)
                setBuildingProperty(false)
                setFactoryProperty(false)

                setHousesProperty(false)
                setPlotsProperty(false)
                setShopsProperty(false)
                setOfficesProperty(false)
                setAgrecultureProperty(false)
                setFarmHousesProperty(false)
                setPentHousesProperty(false)
                setBuildingsProperty(false)
                setFlatsProperty(false)
                setFiles(false)
                break;

            case 7:
                setHouseProperty(false)
                setFlatProperty(false)
                setFarmHouseProperty(false)
                setPentHouseProperty(false)

                setOfficeProperty(false)
                setShopProperty(false)
                setBuildingProperty(true)
                setFactoryProperty(false)

                setHousesProperty(false)
                setPlotsProperty(false)
                setShopsProperty(false)
                setOfficesProperty(false)
                setAgrecultureProperty(false)
                setFarmHousesProperty(false)
                setPentHousesProperty(false)
                setBuildingsProperty(false)
                setFlatsProperty(false)
                setFiles(false)
                break;

            case 8:
                setHouseProperty(false)
                setFlatProperty(false)
                setFarmHouseProperty(false)
                setPentHouseProperty(false)

                setOfficeProperty(false)
                setShopProperty(false)
                setBuildingProperty(false)
                setFactoryProperty(true)

                setHousesProperty(false)
                setPlotsProperty(false)
                setShopsProperty(false)
                setOfficesProperty(false)
                setAgrecultureProperty(false)
                setFarmHousesProperty(false)
                setPentHousesProperty(false)
                setBuildingsProperty(false)
                setFlatsProperty(false)
                setFiles(false)
                break;


            case 9:
                setHouseProperty(false)
                setFlatProperty(false)
                setFarmHouseProperty(false)
                setPentHouseProperty(false)

                setOfficeProperty(false)
                setShopProperty(false)
                setBuildingProperty(false)
                setFactoryProperty(false)

                setHousesProperty(true)
                setPlotsProperty(false)
                setShopsProperty(false)
                setOfficesProperty(false)
                setAgrecultureProperty(false)
                setFarmHousesProperty(false)
                setPentHousesProperty(false)
                setBuildingsProperty(false)
                setFlatsProperty(false)
                setFiles(false)
                break;
            case 10:
                setHouseProperty(false)
                setFlatProperty(false)
                setFarmHouseProperty(false)
                setPentHouseProperty(false)

                setOfficeProperty(false)
                setShopProperty(false)
                setBuildingProperty(false)
                setFactoryProperty(false)

                setHousesProperty(false)
                setPlotsProperty(true)
                setShopsProperty(false)
                setOfficesProperty(false)
                setAgrecultureProperty(false)
                setFarmHousesProperty(false)
                setPentHousesProperty(false)
                setBuildingsProperty(false)
                setFlatsProperty(false)
                setFiles(false)
                break;
            case 11:
                setHouseProperty(false)
                setFlatProperty(false)
                setFarmHouseProperty(false)
                setPentHouseProperty(false)

                setOfficeProperty(false)
                setShopProperty(false)
                setBuildingProperty(false)
                setFactoryProperty(false)

                setHousesProperty(false)
                setPlotsProperty(false)
                setShopsProperty(true)
                setOfficesProperty(false)
                setAgrecultureProperty(false)
                setFarmHousesProperty(false)
                setPentHousesProperty(false)
                setBuildingsProperty(false)
                setFlatsProperty(false)
                setFiles(false)
                break;
            case 12:
                setHouseProperty(false)
                setFlatProperty(false)
                setFarmHouseProperty(false)
                setPentHouseProperty(false)

                setOfficeProperty(false)
                setShopProperty(false)
                setBuildingProperty(false)
                setFactoryProperty(false)

                setHousesProperty(false)
                setPlotsProperty(false)
                setShopsProperty(false)
                setOfficesProperty(true)
                setAgrecultureProperty(false)
                setFarmHousesProperty(false)
                setPentHousesProperty(false)
                setBuildingsProperty(false)
                setFlatsProperty(false)
                setFiles(false)
                break;
            case 13:
                setHouseProperty(false)
                setFlatProperty(false)
                setFarmHouseProperty(false)
                setPentHouseProperty(false)

                setOfficeProperty(false)
                setShopProperty(false)
                setBuildingProperty(false)
                setFactoryProperty(false)

                setHousesProperty(false)
                setPlotsProperty(false)
                setShopsProperty(false)
                setOfficesProperty(false)
                setAgrecultureProperty(true)
                setFarmHousesProperty(false)
                setPentHousesProperty(false)
                setBuildingsProperty(false)
                setFlatsProperty(false)
                setFiles(false)
                break;
            case 14:
                setHouseProperty(false)
                setFlatProperty(false)
                setFarmHouseProperty(false)
                setPentHouseProperty(false)

                setOfficeProperty(false)
                setShopProperty(false)
                setBuildingProperty(false)
                setFactoryProperty(false)

                setHousesProperty(false)
                setPlotsProperty(false)
                setShopsProperty(false)
                setOfficesProperty(false)
                setAgrecultureProperty(false)
                setFarmHousesProperty(true)
                setPentHousesProperty(false)
                setBuildingsProperty(false)
                setFlatsProperty(false)
                setFiles(false)
                break;
            case 15:
                setHouseProperty(false)
                setFlatProperty(false)
                setFarmHouseProperty(false)
                setPentHouseProperty(false)

                setOfficeProperty(false)
                setShopProperty(false)
                setBuildingProperty(false)
                setFactoryProperty(false)

                setHousesProperty(false)
                setPlotsProperty(false)
                setShopsProperty(false)
                setOfficesProperty(false)
                setAgrecultureProperty(false)
                setFarmHousesProperty(false)
                setPentHousesProperty(true)
                setBuildingsProperty(false)
                setFlatsProperty(false)
                setFiles(false)
                break;
            case 16:
                setHouseProperty(false)
                setFlatProperty(false)
                setFarmHouseProperty(false)
                setPentHouseProperty(false)

                setOfficeProperty(false)
                setShopProperty(false)
                setBuildingProperty(false)
                setFactoryProperty(false)

                setHousesProperty(false)
                setPlotsProperty(false)
                setShopsProperty(false)
                setOfficesProperty(false)
                setAgrecultureProperty(false)
                setFarmHousesProperty(false)
                setPentHousesProperty(false)
                setBuildingsProperty(true)
                setFlatsProperty(false)
                setFiles(false)
                break;

            case 17:
                setHouseProperty(false)
                setFlatProperty(false)
                setFarmHouseProperty(false)
                setPentHouseProperty(false)

                setOfficeProperty(false)
                setShopProperty(false)
                setBuildingProperty(false)
                setFactoryProperty(false)

                setHousesProperty(false)
                setPlotsProperty(false)
                setShopsProperty(false)
                setOfficesProperty(false)
                setAgrecultureProperty(false)
                setFarmHousesProperty(false)
                setPentHousesProperty(false)
                setBuildingsProperty(false)
                setFlatsProperty(true)
                setFiles(false)
                break;
            case 18:
                setHouseProperty(false)
                setFlatProperty(false)
                setFarmHouseProperty(false)
                setPentHouseProperty(false)

                setOfficeProperty(false)
                setShopProperty(false)
                setBuildingProperty(false)
                setFactoryProperty(false)

                setHousesProperty(false)
                setPlotsProperty(false)
                setShopsProperty(false)
                setOfficesProperty(false)
                setAgrecultureProperty(false)
                setFarmHousesProperty(false)
                setPentHousesProperty(false)
                setBuildingsProperty(false)
                setFlatsProperty(false)
                setPropertyType(propertyType == "Rent" ? "" : propertyType == "ToLet" ? "" : propertyType)
                setFiles(true)
                // setShowHouseNoOpetion(false)

                // setBtnColorRent(false)
                // setBtnColorSale(false)
                // setBtnColorToLet(false)
                // setBtnColorBuy(true)
                // setPropertyType("Buy")
                // setShowLocationOpetion(true)
                // setShowPortionOption(false)
                // setShowHouseNoOpetion(false)
                // setShowButtonOpetion(false)
                // setBudgetError("")
                break;

        }
    }
    // this function is used to handle Lead Type 

    const PropertyTypeHandler = (text) => {
        switch (true) {
            case (text == "Buy"):
                setBtnColorRent(false)
                setBtnColorSale(false)
                setBtnColorToLet(false)
                setBtnColorBuy(true)
                setPropertyType("Buy")
                setShowLocationOpetion(true)
                setShowPortionOption(false)
                setShowHouseNoOpetion(false)
                setShowButtonOpetion(false)
                setBudgetError("")
                break;
            case (text == "Sale"):
                setBtnColorRent(false)
                setBtnColorBuy(false)
                setBtnColorToLet(false)
                setBtnColorSale(true)
                setPropertyType("Sale")
                setShowLocationOpetion(false)
                setShowPortionOption(false)
                setShowHouseNoOpetion(true)
                setShowButtonOpetion(true)
                setBudgetError("")
                break;
            case (text == "Rent"):
                setBtnColorBuy(false)
                setBtnColorSale(false)
                setBtnColorToLet(false)
                setBtnColorRent(true)
                setPropertyType("Rent")
                setShowLocationOpetion(true)
                setShowPortionOption(true)
                setShowHouseNoOpetion(false)
                setShowButtonOpetion(false)
                setBudgetError("")
                break;
            case (text == "ToLet"):
                setBtnColorRent(false)
                setBtnColorBuy(false)
                setBtnColorSale(false)
                setBtnColorToLet(true)
                setPropertyType("ToLet")
                setShowLocationOpetion(false)
                setShowPortionOption(true)
                setShowHouseNoOpetion(true)
                setShowButtonOpetion(true)
                setBudgetError("")
                break;
            default:
                break;
        }
    }
    // this fucntion is used to handle Property Category
    const CategoryHandler = (text) => {
        switch (true) {
            case (text == "Residentiol"):
                setBtnColorResidentiol(true)
                setBtnColorComercial(false)
                setBtnColorSemiComercial(false)
                setCategory("Residentiol")
                break;
            case (text == "Comercial"):
                setBtnColorResidentiol(false)
                setBtnColorComercial(true)
                setBtnColorSemiComercial(false)
                setCategory("Comercial")
                break;
            case (text == "SemiComercial"):
                setBtnColorResidentiol(false)
                setBtnColorComercial(false)
                setBtnColorSemiComercial(true)
                setCategory("SemiComercial")
                break;
            default:
                break;
        }
    }
    // this line of code handle property Unit 
    const UnitHandler = (text) => {
        switch (true) {
            case (text == "Single"):
                setBtnColorSingle(true)
                setBtnColorDouble(false)
                setUnitType("Single")
                break;
            case (text == "Double"):
                setBtnColorSingle(false)
                setBtnColorDouble(true)
                setUnitType("Double")
                break;
            default:
                break;
        }
    }
    // this function is used to handle property Portion 
    const PortionHandler = (text) => {
        switch (true) {
            case (text == "Complete"):
                setBtnColorComplete(true)
                setBtnColorSecondFloor(false)
                setBtnColorFirstFloor(false)
                setPortionType("Complete")
                break;
            case (text == "SecondFloor"):
                setBtnColorComplete(false)
                setBtnColorSecondFloor(true)
                setBtnColorFirstFloor(false)
                setPortionType("SecondFloor")
                break;
            case (text == "FirstFloor"):
                setBtnColorComplete(false)
                setBtnColorSecondFloor(false)
                setBtnColorFirstFloor(true)
                setPortionType("FirstFloor")
                break;
            default:
                break;
        }
    }
    // handle validate of lead name
    const validateName = (text) => {
        setLeadName(text)
        setNameError("")
    }
    // handle validate Mobile Number
    const validateMobileNumber = (text) => {
        setMobile(text.trim())
        setMobileError("")
    }
    // handle validate Address 
    const validateAddress = (text) => {
        setHouseNo(text)
        setHouseAddressError("")
    }
    // handle validate Budget 
    const validBudget = (text) => {
        setBudget(text)
        setBudgetError("")
    }
    // handle bedrooms quantity 
    const decrementBedroomQuantity = () => {
        if (bedroomsQuantity > 0) {
            setBedroomsQuantity(bedroomsQuantity - 1)
        }
    }
    const incrementBedroomQuantity = () => {
        setBedroomsQuantity(bedroomsQuantity + 1)
    }
    // handle bathroom quantity 
    const decrementBathroomQuantity = () => {
        if (bathroomQuantity > 0) {
            setBathroomQuantity(bathroomQuantity - 1)
        }
    }
    const incrementBathroomQuantity = () => {
        setBathroomQuantity(bathroomQuantity + 1)
    }
    // manage dropdown value picker 
    const OnchangePickerSeletedHandler = (value, index) => {
        setValue(value)
        if (flatProperty == true || flatsProperty == true) {
            setSizeType(apartmentAreaData[index].name)
        }
        else {
            setSizeType(AreaData[index].name)
        }
    }
    
    const OnchangePickerSourceHandler = (value, index) => {
        setValueSource(value)
        setSourceType(leadSource[index].name)
    }
    // this function run if change city name 
    useEffect(() => {
        getID()
    }, [cityName])
    //    get local storage data 
    const getID = async () => {
        var data = await AsyncStorage.getItem("@areas");
        var city = await AsyncStorage.getItem("@city");
        // console.log("city",data)
        setCityName(city)
        data = data.replace(/'/g, '"');
        data = JSON.parse(data);
        setSocietyData(data)
    }
    // this function is used to search society data 
    const searchFilter = (text) => {
        if (text) {
            const newData = societyData.filter((item) => {
                const itemData = item.name ? item.name.toUpperCase() : ''.toUpperCase();
                const textData = text.toUpperCase()
                return itemData.indexOf(textData) > -1
            })
            setFilterSocietyData(newData)
            setSearchSocietyName(text)
        } else {
            setFilterSocietyData(societyData)
            setSearchSocietyName(text)
        }
    }
    // handle society Name
    const changeSocietyName = (name) => {
        setSocietyName(name)
        setSearchSocietyName("")
        setAddressModalOpen(false)
    }
    // handle model open Address
    const addressModalHandler = async () => {
        setAddressModalOpen(false)
        setSocietyName("")
        await getID()
    }


    // upload image on firebase storage 
    const uploadImage = async () => {
        if (image !== null) {
            const { uri } = image;
            const filename = uri.substring(uri.lastIndexOf('/') + 1);
            const uploadUri = Platform.OS === 'ios' ? uri.replace('file://', '') : uri;
            console.log("Image Uploading....")
            setLoading(true);
            setTransferred(0);
            // const task = storage()
            //     .ref('/$productImages')
            //     .child(filename)
            //     .putFile(uploadUri);

            const storageRef = storage().ref(`inventoryImages/${filename}`);
            const task = storageRef.putFile(uploadUri);

            // set progress state
            task.on('state_changed', snapshot => {
                setTransferred(
                    Math.round(snapshot.bytesTransferred / snapshot.totalBytes) * 10000
                );
            });

            try {
                await task;
                const url = await storageRef.getDownloadURL();
                // setLoading(false);
                console.log("Image Uploaded")
                return url;
            } catch (e) {
                console.error(e);
                // setLoading(false)
                return null;
            }
        }
        else {
            // Alert.alert("Attention","Pleasen Upload Product Image")
            return image;
        }
    };
   

    // this fucntion is used to create new Leads 
    const PressHandler = async (text) => {
        setLoading(true)
        if (propertyType != "" && catagory != "" && leadName != "" && mobile != "" && size != "" && unitType != "" && societyName != "") {
            if (username_regux.test(leadName) == false) {
                setNameError("Name Should Contain Only Alphabets")
                NameFocus.current.focus()
                setLoading(false)
                return true
            }

            if (leadName.length > 25) {
                setNameError("Leads Name should have 25 characters max.")
                NameFocus.current.focus()
                setLoading(false)
                return true
            }
            if (mobile.length > 15) {
                setMobileError("Leads Mobile number should have 15 characters max.")
                mobileFocus.current.focus()
                setLoading(false)
                return true
            }
         

            if (showHouseNoOpetion === true && files === false && houseNo === "" || houseNo.length > 50) {
                setHouseAddressError("Enter Adrress & Address should have 50 characters max.")
                AddressFocus.current.focus()
                setLoading(false)
                return true
            }
            // if (regExp.test(budget) == false) {
            //     setBudgetError("Please enter valid amount!")
            //     setLoading(false)
            //     return true
            // }
            // if (budget && budget <= 0) {
            //     Alert.alert("Enter valid amount")
            //     setLoading(false)
            //     return true
            // }

            // if(catagory == "Residentiol"){
            //     if()
            // }
            try {
                firestore()
                    .collection('leads')
                    .add({
                        user_id: reassignId == "" ? user.uid : reassignId,
                        property_type: propertyType,
                        catagory: catagory,
                        leadName: leadName,
                        mobile: mobile,
                        portion_type: housesProperty || houseProperty ? portionType : "",
                        bedroomsQuantity: bedroomsQuantity,
                        bathroomQuantity: bathroomQuantity,
                        budget: budget,
                        // location: location,
                        status: newStatus ? "new" : qualifiedStatus ? "qualified" : negotiationStatus ? "negotiation" : coldStatus ? "cold" : wonStatus ? "won" : "rejected",
                        size: size,
                        size_type: sizeType,
                        unitType: houseProperty || housesProperty ? unitType : "",
                        societyName: societyName,
                        houseNo: houseNo,
                        facilities: {
                            gas: gasFacilities, //gas
                            facingPark: facingParkFacilities, //facing park
                            mainRoad: mainRoadFacilities, //mainRoad
                            corner: cornerFacilities, //corner
                            gated: gatedFacilities, //gated
                            ownerBuild: ownerBuildFacilities //owner built
                        },
                        sourceType: sourceType,
                        description: description,
                        deal: false,
                        hasInventory: text == "stop" ? true : false,
                        businessID: reassignId != "" ? reassignId : user.uid,
                        // type == "own" ? businessID : user.uid,
                        role: type,
                        inventoryProperty: houseProperty ? 'House' : flatProperty ? 'Flat' : farmHouseProperty ? 'Farm House' : pentHouseProperty ? 'Pent House' : officeProperty ? 'Office' : shopProperty ? 'Shop' : buildingProperty ? 'Building' : factoryProperty ? 'Factory' : housesProperty ? 'House' : plotsProperty ? 'Plot' : shopsProperty ? 'Shop' : officesProperty ? 'Office' : agricultureProperty ? 'Agriculture' : farmHousesProperty ? 'Farm House' : pentHopusesProperty ? 'Pent House' : buildingsProperty ? 'Building' : files ? 'Files' : 'Flat',
                        name: user.displayName,
                        timestamp: firestore.Timestamp.fromDate(new Date()),
                        hasTask: false
                    }).then(async docReference => {
                        // console.log("Document written with ID: ", docRef.id);
                        // console.log("LEAD CREATED")
                        docID = docReference.id

                        if (text == "back") {
                            // Alert.alert("Lead Created Successfully")
                            setLeadName("")
                            setMobile("")
                            setBudget("")
                            setLocation("")
                            setSize("")
                            setHouseNo("")
                            setSocietyName("")
                            setDescription("")
                            setLoading(false)
                            sendNotification()
                        }
                        else if (text == "stop") {
                            const imageUrl = await uploadImage();
                            // navigation.navigate("AddLeadInventory", items)
                            try {
                                firestore()
                                    .collection('Inventory')
                                    .add({
                                        user_id: user.uid,
                                        // inventoryID: do
                                        // propertyName:propertyName,
                                        houseName: houseNo,
                                        country: "Pakistan",
                                        cityName: cityName,
                                        country: "Pakistan",
                                        societyName: societyName,
                                        transactionType: btnColorRent ? "Rent" : btnColorBuy ? "Buy" : btnColorSale ? "Sale" : "Let",
                                        catagory: catagory,
                                        propertyType: houseProperty ? 'House' : flatProperty ? 'Flat' : farmHouseProperty ? 'Farm House' : pentHouseProperty ? 'Pent House' : officeProperty ? 'Office' : shopProperty ? 'Shop' : buildingProperty ? 'Building' : factoryProperty ? 'Factory' : housesProperty ? 'House' : plotsProperty ? 'Plot' : shopsProperty ? 'Shop' : officesProperty ? 'Office' : agricultureProperty ? 'Agriculture' : farmHousesProperty ? 'Farm House' : pentHopusesProperty ? 'Pent House' : buildingsProperty ? 'Building': files ? 'Files' : 'Flat',
                                        unitType: houseProperty || housesProperty ? unitType : "",
                                        floorType: housesProperty || houseProperty ? portionType : "",
                                        sellerName:leadName,
                                        sellerMobile:mobile,

                                        propertyImg: imageUrl ? imageUrl : null,



                                        demand: budget,
                                        size: size,
                                        sizeType: sizeType,
                                        longitude: 0,
                                        latitude: 0,
                                        rooms: {
                                            bedrooms: bedroomsQuantity,
                                            bathrooms: bathroomQuantity,
                                            kitchen: 0,
                                            garage: 0
                                        },
                                        facilities: {
                                            gas: gasFacilities, //gas
                                            facingPark: facingParkFacilities, //facing park
                                            mainRoad: mainRoadFacilities, //mainRoad
                                            corner: cornerFacilities, //corner
                                            gated: gatedFacilities, //gated
                                            ownerBuild: ownerBuildFacilities //owner built
                                        },
                                        description: description,
                                        timestamp: firestore.Timestamp.fromDate(new Date()),
                                        viewStatus: "Matched",
                                        deal: false,
                                        leadID: docReference.id,
                                        leadName: leadName,
                                        isLead: true,
                                        toMarketplace: false,
                                        businessID: reassignId != "" ? reassignId : user.uid,
                                        role: type,
                                        name: user.displayName
                                    })
                                    .then((docRef) => {
                                        // Alert.alert(
                                        //     "Inventory Added",
                                        //     //"Image and Data has been uploaded successfully!"
                                        // )
                                        // setAlertModal(true)
                                        // setLoading(false)
                                        dealLead(docRef.id)
                                        // setAlertModal(true)
                                        // resetAllHandler()
                                        // navigation.pop(2)
                                    })

                            } catch (err) {
                                console.log(err)
                                setLoading(false)
                            }
                        }
                        else {
                            // alert("successfully created leads")
                            console.log("Successful Creation")
                        }











                        // const items = {
                        //     user_id: reassignId == "" ? user.uid : reassignId,
                        //     property_type: btnColorRent ? "Rent" : btnColorBuy ? "Buy" : btnColorSale ? "Sale" : "Let",
                        //     catagory: catagory,
                        //     leadName: leadName,
                        //     mobile: mobile,
                        //     portion_type: housesProperty || houseProperty ? portionType : "",
                        //     bedroomsQuantity: bedroomsQuantity,
                        //     bathroomQuantity: bathroomQuantity,
                        //     budget: budget,
                        //     cityName: cityName,
                        //     size: size,
                        //     size_type: sizeType,
                        //     unitType: houseProperty || housesProperty ? unitType : "",
                        //     societyName: societyName,
                        //     houseNo: houseNo,
                        //     facilities: {
                        //         gas: gasFacilities, //gas
                        //         facingPark: facingParkFacilities, //facing park
                        //         mainRoad: mainRoadFacilities, //mainRoad
                        //         corner: cornerFacilities, //corner
                        //         gated: gatedFacilities, //gated
                        //         ownerBuild: ownerBuildFacilities //owner built
                        //     },
                        //     sourceType: sourceType,
                        //     description: description,
                        //     docID: docRef.id,
                        //     businessID: reassignId != "" ? reassignId : type == "own" ? businessID : user.uid,
                        //     businessID: reassignId != "" ? reassignId : user.uid,
                        //     // type == "own" ? businessID : user.uid,
                        //     role: type,
                        //     inventoryProperty: houseProperty ? 'House' : flatProperty ? 'Flat' : farmHouseProperty ? 'Farm House' : pentHouseProperty ? 'Pent House' : officeProperty ? 'Office' : shopProperty ? 'Shop' : buildingProperty ? 'Building' : factoryProperty ? 'Factory' : housesProperty ? 'House' : plotsProperty ? 'Plot' : shopsProperty ? 'Shop' : officesProperty ? 'Office' : agricultureProperty ? 'Agriculture' : farmHousesProperty ? 'Farm House' : pentHopusesProperty ? 'Pent House' : buildingsProperty ? 'Building' : 'Flat',
                        //     name: user.displayName,
                        //     status: newStatus ? "new" : qualifiedStatus ? "qualified" : negotiationStatus ? "negotiation" : coldStatus ? "cold" : wonStatus ? "won" : "rejected"
                        // }


                        // console.log("You can now also access this. as expected: ", this.foo)
                    })
            } catch (err) {
                console.log(err)
                setLoading(false)
            }
        }
        else {
            alert("please fill all mandatory fields")
            setLoading(false)
        }
    }


    const dealLead = async (docRef) => {
        console.log("in side last steps >>>>>>>>>>>>>>>>>>>", docID)
        setLoading(true)
        try {
            firestore()
                .collection('leads')
                .doc(docID)
                .update({
                    // inventoryProperty: houseProperty ? 'House' : flatProperty ? 'Flat' : farmHouseProperty ? 'Farm House' : pentHouseProperty ? 'Pent House' : officeProperty ? 'Office' : shopProperty ? 'Shop' : buildingProperty ? 'Building' : factoryProperty ? 'Factory' : housesProperty ? 'House' : plotsProperty ? 'Plot' : shopsProperty ? 'Shop' : officesProperty ? 'Office' : agricultureProperty ? 'Agriculture' : farmHousesProperty ? 'Farm House' : pentHopusesProperty ? 'Pent House' : buildingsProperty ? 'Building' : 'Flat',
                    inventoryID: docRef
                })
                .then(() => {
                    console.log("Lead Property Updated Updated")
                    // setStatusModalOpen(false)
                    // modalCloseHandler()
                    // loadInventoryList()
                    // setAlertModal(true)
                    setLeadName("")
                    setMobile("")
                    setBudget("")
                    setLocation("")
                    setSize("")
                    setHouseNo("")
                    setSocietyName("")
                    setDescription("")
                    setLoading(false)
                    navigation.pop(1)
                    // Alert.alert("Status Updated")
                    // navigation.navigate("Leads")
                })

        } catch (err) {
            console.log(err)
            setLoading(false)
        }
    }


    const [actualPrice, setActualPrice] = useState(" Price must contain numbers only")
    const ChangePrice = (e) => {
        var regex = /^[0-9]+$/;
        setBudget(e)
        if (e.match(regex) === null) {
            setActualPrice("Price must contain numbers only")
            return true
        }
        if (e.length < 4) {
            setActualPrice(e)
        }
        else if (e.length > 3 && e.length < 12) {
            setActualPrice("Thousand")
        }
        else {
            setActualPrice("Price is too large. Please enter a smaller number.")
        }
    }

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



    // get images through camera and gallery in mobile 
    const requestCameraPermission = async () => {
        setShowImageModel(!showImageModal)
        try {
            const granted = await PermissionsAndroid.request(
                PermissionsAndroid.PERMISSIONS.CAMERA,
                {
                    title: "App Camera Permission",
                    message: "App needs access to your camera ",
                    buttonNeutral: "Ask Me Later",
                    buttonNegative: "Cancel",
                    buttonPositive: "OK"
                }
            );
            if (granted === PermissionsAndroid.RESULTS.GRANTED) {
                console.log("Camera permission given");
                openCamara();
            } else {
                alert("Camera permission denied")
                console.log("Camera permission denied");
            }
        } catch (err) {
            console.warn(err);
        }
    };

    const requestGalleryPermission = async () => {
        setShowImageModel(!showImageModal)
        try {
            const granted = await PermissionsAndroid.request(
                PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
                {
                    title: "App Camera Permission",
                    message: "App needs access to your camera ",
                    buttonNeutral: "Ask Me Later",
                    buttonNegative: "Cancel",
                    buttonPositive: "OK"
                }
            );
            if (granted === PermissionsAndroid.RESULTS.GRANTED) {
                openImageLibrary();
            } else {
                alert("Camera permission denied")
                console.log("Gallery permission denied");
            }
        } catch (err) {
            console.warn(err);
        }
    };

    const openImageLibrary = () => {
        const options = {
            storageOptions: {
                skipBackup: true,
                path: 'images',
            },
        };

        launchImageLibrary(options, response => {
            // console.log('Response = ', response);
            if (response.didCancel) {
                console.log('User cancelled image picker');
            } else if (response.error) {
                console.log('ImagePicker Error: ', response.error);
            } else if (response.customButton) {
                console.log('User tapped custom button: ', response.customButton);
            } else {
                // You can also display the image using data:
                // const source = {uri: 'data:image/png;base64,'+ response.base64};
                const source = { uri: response.assets[0].uri };
                // console.log("source", source)
                if (source !== null) {
                    setimage(source)
                    setimageUri(response.assets[0].uri)
                }
            }
        });
    }

    const openCamara = () => {
        const options = {
            storageOptions: {
                path: 'images',
                mediaType: 'photo',
            },
            includeBase64: true,
            maxWidth: 200,
            maxHeight: 200
        };

        launchCamera(options, response => {
            // console.log('Response = ', response);
            if (response.didCancel) {
                console.log('User cancelled image picker');
            } else if (response.error) {
                console.log('ImagePicker Error: ', response.error);
            } else if (response.customButton) {
                console.log('User tapped custom button: ', response.customButton);
            } else {
                // You can also display the image using data:
                // const source = {uri: 'data:image/png;base64,'+ response.base64};
                const source = { uri: response.assets[0].uri };
                // console.log("source", source)
                if (source !== null) {
                    setimage(source)
                    // setimageUri(response.assets[0].uri)
                    setimageUri(response.assets[0].uri)
                }


                // setimageBase(response.base64)
                // setimageFile(response.filename)
            }
        });
    };





    const OnchangePickerUserSelected = (item, index) => {
        alert("retusalkdfjsal;kdfj")
        // console.log(">>>>>>>>>>>>>>",item)
        // if (item.userId == undefined) {
        //     alert("Your Agent not login in any device so first login then assign leads to Agent")
        //     setLoading(false)
        //     return true
        // }
        // setSalePerson(item.username)
        // setReassignId(item.userId)
        // setOneDeviceToken(item.deviceToken)
    }
     


    console.log("personalUser",personalUser)
    const OnSelectedUser =(item,index)=>{
         console.log("<><><><>",item.userId)
        if (item.userId == undefined) {
            alert("Your Agent not login in any device so first login then assign leads to Agent")
            setLoading(false)
            return true
        }
        setSalePerson(item.username)
        setReassignId(item.userId)
        setOneDeviceToken(item.deviceToken)
    }
    return (
        <ScrollView contentContainerStyle={{ flexGrow: 1, backgroundColor: "#FCFCFC" }} keyboardShouldPersistTaps='always'>
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
                    <Text style={HeaderStyle.HeaderText}>New Leads</Text>
                    <Image style={HeaderStyle.HeaderImage} resizeMode='contain' source={require('../../assets/images/personpic.png')} />
                </View>
            </View>
            <View style={{ width: "92%", alignSelf: 'center', marginTop: 20 }}>
                {/* Lead Name */}
                <Text style={styles.textHeading}>
                    Name
                    <Text style={{ color: 'red' }}> *</Text>
                </Text>
                <TextInput
                    ref={NameFocus}
                    style={styles.inputStyle}
                    placeholder='Enter lead Name'
                    placeholderTextColor={"#A1A1A1"}
                    value={leadName}
                    onChangeText={(value) => validateName(value)}
                />
                {
                    nameError != "" ?
                        <Text style={styles.errorStyle}>{nameError}</Text>
                        : null
                }

                {/* Phone Number */}
                <Text style={[styles.textHeading, { marginTop: 15 }]}>
                    Phone Number
                    <Text style={{ color: 'red' }}> *</Text>
                </Text>
                <TextInput
                    ref={mobileFocus}
                    keyboardType="number-pad"
                    // placeholder="03xx-xxxxxxx"
                    placeholder='Enter Mobile Number'
                    placeholderTextColor={"#A1A1A1"}
                    value={mobile}
                    onChangeText={(text) => validateMobileNumber(text)}
                    style={styles.inputStyle}
                />
                {/* <MaskedTextInput
                    keyboardType="number-pad"
                    // placeholder="03xx-xxxxxxx"
                    placeholder='Enter Mobile Number'
                    placeholderTextColor={"#A1A1A1"}
                    mask='0399-9999999'
                    value={mobile}
                    onChangeText={(text) => validateMobileNumber(text)}
                    style={styles.inputStyle}
                /> */}
                {
                    mobileError != "" ?
                        <Text style={styles.errorStyle}>{mobileError}</Text>
                        : null
                }
                {/* {
                    propertyType == "Buy" || propertyType == "Rent" ?
                    <> */}
                {/* Lead Type */}
                <Text style={styles.property_type}>Lead Type</Text>
                <View style={styles.property_typeContainer}>
                    <TouchableOpacity onPress={() => PropertyTypeHandler("Buy")}
                        style={[styles.BtnPropertyType, { backgroundColor: btnColorBuy ? '#826AF7' : '#F2F2F3' }]}>
                        <Text style={[styles.ButtonText, { color: btnColorBuy ? '#FFFFFF' : '#7D7F88' }]}>Buy</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => PropertyTypeHandler("Sale")}
                        style={[styles.BtnPropertyType, { backgroundColor: btnColorSale ? '#826AF7' : '#F2F2F3' }]}>
                        <Text style={[styles.ButtonText, { color: btnColorSale ? '#FFFFFF' : '#7D7F88' }]}>Sale</Text>
                    </TouchableOpacity>
                    {
                        files ? null :
                            <>
                                <TouchableOpacity onPress={() => PropertyTypeHandler("Rent")}
                                    style={[styles.BtnPropertyType, { backgroundColor: btnColorRent ? '#826AF7' : '#F2F2F3' }]}>
                                    <Text style={[styles.ButtonText, { color: btnColorRent ? '#FFFFFF' : '#7D7F88' }]}>To Rent</Text>
                                </TouchableOpacity>
                                <TouchableOpacity onPress={() => PropertyTypeHandler("ToLet")}
                                    style={[styles.BtnPropertyType, { backgroundColor: btnColorToLet ? '#826AF7' : '#F2F2F3' }]}>
                                    <Text style={[styles.ButtonText, { color: btnColorToLet ? '#FFFFFF' : '#7D7F88' }]}>To Let</Text>
                                </TouchableOpacity>
                            </>
                    }
                </View>
                <View style={{ borderColor: '#E2E2E2', borderWidth: 1, width: "92%", alignSelf: "center" }} />
                {/* Category */}
                <Text style={{ ...styles.property_type, }}>Category</Text>
                <View style={{ ...styles.property_typeContainer, marginLeft: 0 }}>
                    <TouchableOpacity onPress={() => CategoryHandler("Residentiol")}
                        style={[styles.BtnPropertyType, { backgroundColor: btnColorResidentiol ? '#826AF7' : '#F2F2F3' }]}>
                        <Text style={[styles.ButtonText, { color: btnColorResidentiol ? '#FFFFFF' : '#7D7F88', }]}>Residential</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => CategoryHandler("Comercial")}
                        style={[styles.BtnPropertyType, { backgroundColor: btnColorComercial ? '#826AF7' : '#F2F2F3' }]}>
                        <Text style={[styles.ButtonText, { color: btnColorComercial ? '#FFFFFF' : '#7D7F88', }]}>Commercial</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => CategoryHandler("SemiComercial")}
                        style={[styles.BtnPropertyType, { backgroundColor: btnColorSemiComercial ? '#826AF7' : '#F2F2F3' }]}>
                        <Text style={[styles.ButtonText, { color: btnColorSemiComercial ? '#FFFFFF' : '#7D7F88', }]}>Semi-Commercial</Text>
                    </TouchableOpacity>
                </View>
                <View style={{ borderColor: '#E2E2E2', borderWidth: 1, width: "92%", alignSelf: "center" }} />
                {/* Property Type */}
                <Text style={[styles.textHeading, { marginTop: 15 }]}>
                    Property type
                </Text>
                {
                    catagory == "Residentiol" ?
                        <ScrollView
                            horizontal={true}
                            showsHorizontalScrollIndicator={false}
                            contentContainerStyle={propertyStyles.container}>
                            <TouchableOpacity style={[propertyStyles.typeContainer, { backgroundColor: plotsProperty ? '#917AFD' : '#F2F2F3' }]} onPress={() => changePropertyHandler(10)}>
                                <Text style={[propertyStyles.type, { color: plotsProperty ? 'white' : '#7D7F88' }]}>Plot</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={[propertyStyles.typeContainer, { marginHorizontal: 5, backgroundColor: houseProperty ? '#917AFD' : '#F2F2F3' }]} onPress={() => changePropertyHandler(1)}>
                                <Text style={[propertyStyles.type, { color: houseProperty ? 'white' : '#7D7F88' }]}>House</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={[propertyStyles.typeContainer, { marginHorizontal: 5, backgroundColor: flatProperty ? '#917AFD' : '#F2F2F3' }]} onPress={() => changePropertyHandler(2)}>
                                <Text style={[propertyStyles.type, { color: flatProperty ? 'white' : '#7D7F88' }]}>Apartment</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={[propertyStyles.typeContainer, , { marginHorizontal: 5, backgroundColor: files ? '#917AFD' : '#F2F2F3' }]} onPress={() => changePropertyHandler(18)}>
                                <Text style={[propertyStyles.type, { color: files ? 'white' : '#7D7F88' }]}>File</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={[propertyStyles.typeContainer, { marginHorizontal: 5, backgroundColor: farmHouseProperty ? '#917AFD' : '#F2F2F3' }]} onPress={() => changePropertyHandler(3)}>
                                <Text style={[propertyStyles.type, { color: farmHouseProperty ? 'white' : '#7D7F88' }]}>Farm House</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={[propertyStyles.typeContainer, , { marginLeft: 5, backgroundColor: pentHouseProperty ? '#917AFD' : '#F2F2F3' }]} onPress={() => changePropertyHandler(4)}>
                                <Text style={[propertyStyles.type, { color: pentHouseProperty ? 'white' : '#7D7F88' }]}>Pent House</Text>
                            </TouchableOpacity>
                        </ScrollView>
                        :
                        catagory == "Comercial" ?
                            <ScrollView
                                horizontal={true}
                                showsHorizontalScrollIndicator={false}
                                contentContainerStyle={propertyStyles.container}>
                                <TouchableOpacity style={[propertyStyles.typeContainer, { backgroundColor: plotsProperty ? '#917AFD' : '#F2F2F3' }]} onPress={() => changePropertyHandler(10)}>
                                    <Text style={[propertyStyles.type, { color: plotsProperty ? 'white' : '#7D7F88' }]}>Plot</Text>
                                </TouchableOpacity>
                                <TouchableOpacity style={[propertyStyles.typeContainer, { marginHorizontal: 5, backgroundColor: officeProperty ? '#917AFD' : '#F2F2F3' }]} onPress={() => changePropertyHandler(5)}>
                                    <Text style={[propertyStyles.type, { color: officeProperty ? 'white' : '#7D7F88' }]}>Office</Text>
                                </TouchableOpacity>
                                <TouchableOpacity style={[propertyStyles.typeContainer, { marginHorizontal: 5, backgroundColor: shopProperty ? '#917AFD' : '#F2F2F3' }]} onPress={() => changePropertyHandler(6)}>
                                    <Text style={[propertyStyles.type, { color: shopProperty ? 'white' : '#7D7F88' }]}>Shop</Text>
                                </TouchableOpacity>
                                <TouchableOpacity style={[propertyStyles.typeContainer, , { marginHorizontal: 5, backgroundColor: files ? '#917AFD' : '#F2F2F3' }]} onPress={() => changePropertyHandler(18)}>
                                    <Text style={[propertyStyles.type, { color: files ? 'white' : '#7D7F88' }]}>File</Text>
                                </TouchableOpacity>
                                <TouchableOpacity style={[propertyStyles.typeContainer, { marginHorizontal: 5, backgroundColor: buildingProperty ? '#917AFD' : '#F2F2F3' }]} onPress={() => changePropertyHandler(7)}>
                                    <Text style={[propertyStyles.type, { color: buildingProperty ? 'white' : '#7D7F88' }]}>Building</Text>
                                </TouchableOpacity>
                                <TouchableOpacity style={[propertyStyles.typeContainer, , { marginLeft: 5, backgroundColor: factoryProperty ? '#917AFD' : '#F2F2F3' }]} onPress={() => changePropertyHandler(8)}>
                                    <Text style={[propertyStyles.type, { color: factoryProperty ? 'white' : '#7D7F88' }]}>Factory</Text>
                                </TouchableOpacity>

                            </ScrollView>
                            :
                            catagory == "SemiComercial" ?
                                <ScrollView
                                    horizontal={true}
                                    showsHorizontalScrollIndicator={false}
                                    contentContainerStyle={propertyStyles.container}>
                                    {/* horizontal={true}
                                    showsHorizontalScrollIndicator={false}
                                    contentContainerStyle={{
                                        marginTop: 20,
                                        marginBottom: 20,
                                        borderColor: 'red',
                                        borderWidth: 1
                                    }}> */}
                                    <TouchableOpacity style={[propertyStyles.typeContainer, { backgroundColor: housesProperty ? '#917AFD' : '#F2F2F3' }]} onPress={() => changePropertyHandler(9)}>
                                        <Text style={[propertyStyles.type, { color: housesProperty ? 'white' : '#7D7F88' }]}>House</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity style={[propertyStyles.typeContainer, { marginHorizontal: 5, backgroundColor: plotsProperty ? '#917AFD' : '#F2F2F3' }]} onPress={() => changePropertyHandler(10)}>
                                        <Text style={[propertyStyles.type, { color: plotsProperty ? 'white' : '#7D7F88' }]}>Plot</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity style={[propertyStyles.typeContainer, { marginHorizontal: 5, backgroundColor: shopsProperty ? '#917AFD' : '#F2F2F3' }]} onPress={() => changePropertyHandler(11)}>
                                        <Text style={[propertyStyles.type, { color: shopsProperty ? 'white' : '#7D7F88' }]}>Shop</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity style={[propertyStyles.typeContainer, , { marginHorizontal: 5, backgroundColor: officesProperty ? '#917AFD' : '#F2F2F3' }]} onPress={() => changePropertyHandler(12)}>
                                        <Text style={[propertyStyles.type, { color: officesProperty ? 'white' : '#7D7F88' }]}>Office</Text>
                                    </TouchableOpacity>

                                    <TouchableOpacity style={[propertyStyles.typeContainer, { marginHorizontal: 5, marginHorizontal: 5, backgroundColor: agricultureProperty ? '#917AFD' : '#F2F2F3' }]} onPress={() => changePropertyHandler(13)}>
                                        <Text style={[propertyStyles.type, { color: agricultureProperty ? 'white' : '#7D7F88' }]}>Agriculture</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity style={[propertyStyles.typeContainer, { marginHorizontal: 5, marginHorizontal: 5, backgroundColor: farmHousesProperty ? '#917AFD' : '#F2F2F3' }]} onPress={() => changePropertyHandler(14)}>
                                        <Text style={[propertyStyles.type, { color: farmHousesProperty ? 'white' : '#7D7F88' }]}>Farm House</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity style={[propertyStyles.typeContainer, { marginHorizontal: 5, backgroundColor: pentHopusesProperty ? '#917AFD' : '#F2F2F3' }]} onPress={() => changePropertyHandler(15)}>
                                        <Text style={[propertyStyles.type, { color: pentHopusesProperty ? 'white' : '#7D7F88' }]}>Pent House</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity style={[propertyStyles.typeContainer, , { marginHorizontal: 5, backgroundColor: buildingsProperty ? '#917AFD' : '#F2F2F3' }]} onPress={() => changePropertyHandler(16)}>
                                        <Text style={[propertyStyles.type, { color: buildingsProperty ? 'white' : '#7D7F88' }]}>Building</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity style={[propertyStyles.typeContainer, , { marginHorizontal: 5, backgroundColor: flatsProperty ? '#917AFD' : '#F2F2F3' }]} onPress={() => changePropertyHandler(17)}>
                                        <Text style={[propertyStyles.type, { color: flatsProperty ? 'white' : '#7D7F88' }]}>Apartment</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity style={[propertyStyles.typeContainer, , { marginHorizontal: 5, backgroundColor: files ? '#917AFD' : '#F2F2F3' }]} onPress={() => changePropertyHandler(18)}>
                                        <Text style={[propertyStyles.type, { color: files ? 'white' : '#7D7F88' }]}>File</Text>
                                    </TouchableOpacity>
                                </ScrollView>
                                : null
                }
                <View style={{ borderBottomWidth: 1, borderColor: "#E2E2E2", marginTop: 10 }} />
                {/* Portion Type */}
                {
                    showPortionOption === true && (housesProperty || houseProperty) ?
                        <>
                            <Text style={[styles.textHeading, { marginTop: 10 }]}>Portion</Text>
                            <View style={[styles.portionContainer, { width: "80%" }]}>
                                <TouchableOpacity onPress={() => PortionHandler("Complete")}
                                    style={[styles.BtnPropertyType, { backgroundColor: btnColorComplete ? '#826AF7' : '#F2F2F3' }]}>
                                    <Text style={[styles.ButtonText, { color: btnColorComplete ? '#FFFFFF' : '#7D7F88', }]}>Complete</Text>
                                </TouchableOpacity>
                                <TouchableOpacity onPress={() => PortionHandler("FirstFloor")}
                                    style={[styles.BtnPropertyType, { backgroundColor: btnColorFirstFloor ? '#826AF7' : '#F2F2F3' }]}>
                                    <Text style={[styles.ButtonText, { color: btnColorFirstFloor ? '#FFFFFF' : '#7D7F88', }]}>1st Floor</Text>
                                </TouchableOpacity>
                                <TouchableOpacity onPress={() => PortionHandler("SecondFloor")}
                                    style={[styles.BtnPropertyType, { backgroundColor: btnColorSecondFloor ? '#826AF7' : '#F2F2F3' }]}>
                                    <Text style={[styles.ButtonText, { color: btnColorSecondFloor ? '#FFFFFF' : '#7D7F88', }]}>2nd Floor</Text>
                                </TouchableOpacity>
                            </View>
                            <View style={{ borderColor: '#E2E2E2', borderWidth: 1, marginTop: 10 }} />
                        </>
                        :
                        null
                }
                {/* Unit Type */}
                {
                    housesProperty || houseProperty ?
                        <>
                            <Text style={[styles.textHeading, { marginTop: 15 }]}>Unit</Text>
                            <View style={styles.portionContainer}>
                                <TouchableOpacity onPress={() => UnitHandler("Single")}
                                    style={[styles.BtnPropertyType, { backgroundColor: btnColorSingle ? '#826AF7' : '#F2F2F3' }]}>
                                    <Text style={[styles.ButtonText, { color: btnColorSingle ? '#FFFFFF' : '#7D7F88', }]}>Single</Text>
                                </TouchableOpacity>
                                <TouchableOpacity onPress={() => UnitHandler("Double")}
                                    style={[styles.BtnPropertyType, { backgroundColor: btnColorDouble ? '#826AF7' : '#F2F2F3' }]}>
                                    <Text style={[styles.ButtonText, { color: btnColorDouble ? '#FFFFFF' : '#7D7F88', }]}>Double</Text>
                                </TouchableOpacity>
                            </View>
                            <View style={{ borderColor: '#E2E2E2', borderWidth: 1, marginTop: 10 }} />
                        </>
                        : null
                }
                {/* Requirement */}
                {
                    shopProperty || plotsProperty || shopsProperty || agricultureProperty || officesProperty || officeProperty || files == true ? null :
                        <>
                            <Text style={[styles.textHeading, { marginTop: 25 }]}>Requirements</Text>
                            <View style={{ flexDirection: "row", marginTop: 10 }}>
                                <View style={{ width: "60%" }}>
                                    <Text style={styles.requirementHanding}>Bedrooms</Text>
                                </View>
                                <View style={styles.quantityHandlingContainer}>
                                    <TouchableOpacity onPress={() => decrementBedroomQuantity()}
                                        style={[styles.circleStyle, { borderColor: bedroomsQuantity > 0 ? "#1A1E25" : "#BABCBF", }]}>
                                        <Text style={[styles.symbolStyle, { color: bedroomsQuantity > 0 ? "#000000" : "#BABCBF" }]}>-</Text>
                                    </TouchableOpacity>
                                    <Text>
                                        {bedroomsQuantity}
                                    </Text>
                                    <TouchableOpacity onPress={() => incrementBedroomQuantity()}
                                        style={[styles.circleStyle, { borderColor: "#1A1E25", }]}>
                                        <Text style={[styles.symbolStyle, { color: "#000000" }]}>+</Text>
                                    </TouchableOpacity>
                                </View>
                            </View>
                            <View style={{ borderBottomWidth: 1, borderColor: "#E2E2E2", marginTop: 15 }} />
                            <View style={{ flexDirection: "row", marginTop: 10 }}>
                                <View style={{ width: "60%" }}>
                                    <Text style={styles.requirementHanding}>Bathrooms</Text>
                                </View>
                                <View style={styles.quantityHandlingContainer}>
                                    <TouchableOpacity onPress={() => decrementBathroomQuantity()}
                                        style={[styles.circleStyle, { borderColor: bathroomQuantity > 0 ? "#1A1E25" : "#BABCBF", }]}>
                                        <Text style={[styles.symbolStyle, { color: bathroomQuantity > 0 ? "#000000" : "#BABCBF" }]}>-</Text>
                                    </TouchableOpacity>
                                    <Text >
                                        {bathroomQuantity}
                                    </Text>
                                    <TouchableOpacity onPress={() => incrementBathroomQuantity()}
                                        style={[styles.circleStyle, { borderColor: "#1A1E25", }]}>
                                        <Text style={[styles.symbolStyle, { color: "#000000" }]}>+</Text>
                                    </TouchableOpacity>
                                </View>
                            </View>
                            <View style={{ borderBottomWidth: 1, borderColor: "#E2E2E2", marginTop: 15 }} />
                        </>
                }
                {/* Lead Status */}
                <Text style={[styles.textHeading, { marginTop: 15 }]}>
                    Lead Status
                </Text>
                <View style=
                    {{
                        flexDirection: 'row',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        alignSelf: "center",
                        // width: "92%",
                        // marginLeft: 12
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
                <View style={{ borderBottomWidth: 1, borderColor: "#E2E2E2", marginTop: 10 }} />
                {/* {
                    budgetError != "" ?
                        <Text style={styles.errorStyle}>{budgetError}</Text>
                        : null
                } */}
                {/* Society */}
                {
                    files ?
                        <>
                            {/* <Text style={styles.heading}>
                                Society
                            </Text>
                            <View style={styles.demandContainer}>
                                <TextInput
                                    placeholder='Enter society name here'
                                    placeholderTextColor="#7D7F88"
                                    style={styles.demandInput1}
                                    keyboardType='default'
                                    value={societyName}
                                    onChangeText={(value) => setSocietyName(value)}
                                />
                            </View> */}
                            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                                <Text style={styles.heading}>
                                    Society
                                    <Text style={{ color: 'red' }}> *</Text>
                                </Text>
                                {
                                    societyName ?
                                        <TouchableOpacity
                                            style={{ width: '40%', alignItems: 'flex-end' }}
                                            onPress={() => setAddressModalOpen(true)}
                                        >
                                            <Icons
                                                name='pencil-outline'
                                                size={25}
                                                color="black"
                                            />
                                        </TouchableOpacity>
                                        : null
                                }
                            </View>
                            {
                                societyName ?
                                    <Text style={styles.houseText}>
                                        {societyName}
                                    </Text>
                                    :
                                    <TouchableOpacity onPress={() => setAddressModalOpen(true)}>
                                        <View style={styles.placeFindContainer}>
                                            {/* <Icon3
                                            name='location'
                                            color="#917AFD"
                                            size={25}
                                            style={{ marginLeft: 5 }}
                                        /> */}
                                            <Text style={{ flex: 1, marginLeft: 20, color: '#7D7F88', }}>Enter Society name here</Text>
                                            {/* <Icon3
                                            name='search'
                                            color="#1A1E25"
                                            size={22}
                                            style={{ marginRight: 10 }}
                                        /> */}
                                        </View>
                                    </TouchableOpacity>
                            }
                        </>
                        :
                        <>
                            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                                <Text style={styles.heading}>
                                    Society
                                    <Text style={{ color: 'red' }}> *</Text>
                                </Text>
                                {
                                    societyName ?
                                        <TouchableOpacity
                                            style={{ width: '40%', alignItems: 'flex-end' }}
                                            onPress={() => setAddressModalOpen(true)}
                                        >
                                            <Icons
                                                name='pencil-outline'
                                                size={25}
                                                color="black"
                                            />
                                        </TouchableOpacity>
                                        : null
                                }
                            </View>
                            {
                                societyName ?
                                    <Text style={styles.houseText}>
                                        {societyName}
                                    </Text>
                                    :
                                    <TouchableOpacity onPress={() => setAddressModalOpen(true)}>
                                        <View style={styles.placeFindContainer}>
                                            {/* <Icon3
                                            name='location'
                                            color="#917AFD"
                                            size={25}
                                            style={{ marginLeft: 5 }}
                                        /> */}
                                            <Text style={{ flex: 1, marginLeft: 20, color: '#7D7F88', }}>Enter Society name here</Text>
                                            {/* <Icon3
                                            name='search'
                                            color="#1A1E25"
                                            size={22}
                                            style={{ marginRight: 10 }}
                                        /> */}
                                        </View>
                                    </TouchableOpacity>
                            }
                        </>
                }
                <View style={{ borderColor: '#E2E2E2', borderWidth: 1, marginTop: 5 }} />
                {/* House No. */}
                {
                    showHouseNoOpetion === true && files === false ?
                        <>
                            <Text style={styles.heading}>
                                Address
                                <Text style={{ color: 'red' }}> *</Text>
                            </Text>
                            <View style={styles.demandContainer}>
                                <TextInput
                                    ref={AddressFocus}
                                    placeholder='Enter Address'
                                    placeholderTextColor="#7D7F88"
                                    style={{ marginLeft: 10 }}
                                    // textAlign='left'
                                    keyboardType='default'
                                    value={houseNo}
                                    onChangeText={(value) => validateAddress(value)}
                                />
                            </View>
                            {
                                houseAddressError != "" ?
                                    <Text style={{ ...styles.errorStyle, marginTop: 0, marginBottom: 8 }}>{houseAddressError}</Text>
                                    : null
                            }
                            <View style={{ borderColor: '#E2E2E2', borderWidth: 1, marginTop: 2 }} />
                        </>
                        :
                        null
                }
                {/* Location */}
                {/* {
                    showLocationOpetion === true ?
                        <>
                            <Text style={styles.heading}>
                                Location
                            </Text>
                            <View style={styles.demandContainer}>
                                <TextInput
                                    placeholder='Lahore, DHA'
                                    placeholderTextColor="#7D7F88"
                                    style={styles.demandInput}
                                    keyboardType="default"
                                    value={location}
                                    onChangeText={(value) => setLocation(value)}
                                />
                            </View>
                            <View style={{ borderColor: '#E2E2E2', borderWidth: 1, }} />
                        </>
                        :
                        null
                } */}
                {/* Area */}
                <Text style={[styles.textHeading, { marginTop: 15 }]}>Size (Area) <Text style={{ color: 'red' }}> *</Text></Text>
                <View style={{ flexDirection: 'row' }}>
                    <View style={{ width: "50%" }}>
                        <TextInput
                            // style={styles.inputStyle}
                            placeholder='Enter Area'
                            placeholderTextColor={"#A1A1A1"}
                            keyboardType="numeric"
                            value={size}
                            onChangeText={(value) => setSize(value)}
                        />
                    </View>
                    {
                        flatProperty || flatsProperty ?
                            <View style={styles.pickerStyle}>
                                <Picker
                                    selectedValue={value}
                                    onValueChange={(itemValue, itemIndex) => OnchangePickerSeletedHandler(itemValue, itemIndex)}
                                    itemStyle={{ color: "white", alignItems: 'center' }}
                                >
                                    {
                                        apartmentAreaData.map((item, index) => {
                                            return (
                                                <Picker.Item label={item.name} value={item.id} style={{ alignSelf: 'center' }} />
                                            )
                                        })
                                    }
                                </Picker>
                            </View>
                            :
                            <View style={styles.pickerStyle}>
                                <Picker
                                    selectedValue={value}
                                    onValueChange={(itemValue, itemIndex) => OnchangePickerSeletedHandler(itemValue, itemIndex)}
                                    itemStyle={{ color: "white" }} >
                                    {
                                        AreaData.map((item, index) => {
                                            return (

                                                <Picker.Item label={item.name} value={item.id} />
                                            )
                                        })
                                    }
                                </Picker>
                            </View>
                    }
                </View>
                <View style={{ borderColor: '#E2E2E2', borderWidth: 1, marginVertical: 10 }} />
                {/* Budget */}
                {
                    propertyType && propertyType == "Sale" || propertyType == "ToLet" ?
                        // <>
                        //     {
                        //         files ?
                        //             <Text style={[styles.textHeading, { marginTop: 15 }]}>Demand </Text>
                        //             :
                        <Text style={[styles.textHeading, { marginTop: 15 }]}>Demand</Text>
                        //     }
                        // </>
                        :
                        // files ?
                        //     <Text style={[styles.textHeading, { marginTop: 15 }]}>Budget</Text>
                        //     :
                        <Text style={[styles.textHeading, { marginTop: 15 }]}>Budget </Text>
                }
                <TextInput
                    style={styles.inputStyle}
                    placeholder='Enter Budget'
                    placeholderTextColor={"#A1A1A1"}
                    keyboardType="numeric"
                    value={budget}
                    onChangeText={(val) => ChangePrice(val)}
                />
                {
                    actualPrice == "Price must contain numbers only" ?
                        <Text style={{ marginTop: 5 }}>Price must contain numbers only</Text>
                        :
                        <Text style={{ marginTop: 5 }}>{budget.length == 4 ? budget.charAt(0) : budget.length == 5 ? budget.slice(0, 2) : budget.length == 6 ? budget.charAt(0) + "  Lakh and " + budget.slice(1, 3) : budget.length == 7 ? budget.slice(0, 2) + "  Lakh and " + budget.slice(2, 4) : budget.length == 8 ? budget.charAt(0) + "  Crore  " + budget.slice(1, 3) + "  Lakh and  " + budget.slice(3, 5) : budget.length == 9 ? budget.slice(0, 2) + "  Crore  " + budget.slice(2, 4) + "  Lakh and  " + budget.slice(4, 6) : budget.length == 10 ? budget.charAt(0) + "  Arab  " + budget.slice(1, 3) + "  Crore  " + budget.slice(3, 5) + "  Lakh and  " + budget.slice(5, 7) : budget.length == 11 ? budget.slice(0, 2) + "  Arab  " + budget.slice(2, 4) + "  Crore  " + budget.slice(4, 6) + "  Lakh and  " + budget.slice(6, 8) : null} {actualPrice}</Text>
                }
                {
                    budget && parseInt(budget) < 0 ?
                        <Text style={styles.errorStyle}>Please enter valid amount</Text>
                        : null
                }
                <View style={{ borderColor: '#E2E2E2', borderWidth: 1, marginVertical: 10 }} />
                {/* Property Facilities */}
                <Text style={styles.heading}>
                    Lead Preference
                </Text>
                <View style={styles.facilitiesContainer}>
                    <TouchableOpacity style={[styles.facilities, { width: 109, backgroundColor: gasFacilities ? '#917AFD' : '#F2F2F3' }]} onPress={() => { setGasFacilities(!gasFacilities) }}>
                        <Text style={[styles.facilitiesText, { color: gasFacilities ? 'white' : '#7D7F88' }]}>Sui Gas</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={[styles.facilities, { width: 109, backgroundColor: facingParkFacilities ? '#917AFD' : '#F2F2F3' }]} onPress={() => { setFacingParkFacilities(!facingParkFacilities) }}>
                        <Text style={[styles.facilitiesText, { color: facingParkFacilities ? 'white' : '#7D7F88' }]}>Facing Park</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={[styles.facilities, { width: 109, backgroundColor: mainRoadFacilities ? '#917AFD' : '#F2F2F3' }]} onPress={() => { setMainRoadFacilities(!mainRoadFacilities) }}>
                        <Text style={[styles.facilitiesText, { color: mainRoadFacilities ? 'white' : '#7D7F88' }]}>Main Road</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={[styles.facilities, { width: 109, marginTop: 25, backgroundColor: cornerFacilities ? '#917AFD' : '#F2F2F3' }]} onPress={() => { setCornerFacilities(!cornerFacilities) }}>
                        <Text style={[styles.facilitiesText, { color: cornerFacilities ? 'white' : '#7D7F88' }]}>Corner</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={[styles.facilities, { width: 109, backgroundColor: gatedFacilities ? '#917AFD' : '#F2F2F3' }]} onPress={() => { setGatedFacilities(!gatedFacilities) }}>
                        <Text style={[styles.facilitiesText, { color: gatedFacilities ? 'white' : '#7D7F88' }]}>Gated</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={[styles.facilities, { width: 109, backgroundColor: ownerBuildFacilities ? '#917AFD' : '#F2F2F3' }]} onPress={() => { setOwnerBuildFacilities(!ownerBuildFacilities) }}>
                        <Text style={[styles.facilitiesText, { color: ownerBuildFacilities ? 'white' : '#7D7F88' }]}>Owner Built</Text>
                    </TouchableOpacity>
                </View>
                <View style={{ borderColor: '#E2E2E2', borderWidth: 1, marginVertical: 10 }} />
                {/* Lead Source */}
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 10 }}>
                    <Text style={[styles.textHeading, { marginTop: 15 }]}>Lead Source</Text>
                    <View style={[styles.pickerStyle, { marginTop: 8, }]}>
                        <Picker
                            selectedValue={valueSource}
                            onValueChange={(itemValue, itemIndex) => OnchangePickerSourceHandler(itemValue, itemIndex)}
                            itemStyle={{ color: "white" }} >
                            {
                                leadSource.map((item, index) => {
                                    return (
                                        <Picker.Item label={item.name} value={item.id} />
                                    )
                                })
                            }
                        </Picker>
                    </View>
                </View>
                <View style={{ borderColor: '#E2E2E2', borderWidth: 1, marginVertical: 10 }} />
                {/* Description */}
                <Text style={[styles.textHeading, { marginTop: 15 }]}>Description</Text>
                <TextInput
                    style={styles.inputStyle}
                    placeholder='Enter description here'
                    placeholderTextColor={"#A1A1A1"}
                    value={description}
                    onChangeText={(value) => setDescription(value)}
                />


                {
                    // userType == 0 && 
                    propertyType === "Buy" || propertyType === "Rent" ?
                        <>
                            <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
                                <View style={{ flex: 0.6 }}>
                                    <Text style={[styles.textHeading, { marginTop: 15 }]}>Sale Person</Text>
                                </View>
                            </View>

                            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: "center" }}>
                                <View style={{ borderWidth: 1, borderColor: "#000000", width: "48%", marginTop: 15 }}>
                                    <Text style={{ fontSize: 14, fontWeight: '500', color: "#000000", padding: 5 }}>{salePerson}</Text>
                                </View>
                                <View style={{ ...styles.pickerStyle, marginTop: 13 }}>
                                    <Picker
                                        selectedValue={value} 
                                        onValueChange={(item,index) => OnSelectedUser(item)}
                                        itemStyle={{ color: "white" }} >
                                        <Picker.Item label="Reassign" />
                                        {
                                          personalUser && personalUser.map((item, index) => {
                                                return (
                                                    <Picker.Item label={item.username} value={item} />
                                                )
                                            })
                                        }
                                    </Picker>
                                </View>
                            </View>
                        </>
                        :
                        // Image
                        <View style={{ width: "95%", alignItems: "center", justifyContent: "center", alignSelf: 'center', marginTop: 15 }}>
                            <TouchableOpacity
                                style={{ width: 90, height: 90, justifyContent: "center", alignItems: "center", borderColor: "#6F54F0", borderWidth: 1, backgroundColor: 'white', }}
                                onPress={() => setShowImageModel(true)}
                            >
                                {
                                    imageUri ?
                                        <Image source={{ uri: imageUri }}
                                            style={{ width: 85, height: 85 }}
                                        />
                                        :
                                        <Image
                                            //source={require('../assets/images/image2.jpg')}
                                            source={require('../../assets/images/camera.png')}
                                            style={{ width: 35, height: 35 }}
                                            resizeMode='contain'
                                        />
                                }
                            </TouchableOpacity>
                        </View>
                }
                {/* Buttons */}
                {
                    showButtonOpetion === true ?
                        <View style={{ width: "100%", marginBottom: 13 }}>
                            <TouchableOpacity onPress={() => PressHandler("stop")} style={styles.saveBtnContainer}>
                                <LinearGradient colors={["#876FF9", "#6A4FEE"]} style={styles.saveBtn}>
                                    {/* <Text style={styles.textCreate}>Save & Create</Text> */}
                                    <Text style={styles.textCreate}>Save & Create Inventory</Text>
                                </LinearGradient>
                            </TouchableOpacity>
                        </View>
                        :
                        <View style={{ width: "100%", marginBottom: 13 }}>
                            <TouchableOpacity onPress={() => PressHandler("back")} style={styles.saveBtnContainer}>
                                <View style={[styles.saveBtnTwo, { borderColor: "#836AF8", borderWidth: 1 }]}>
                                    <Text style={styles.textSave}>Save</Text>
                                </View>
                            </TouchableOpacity>
                        </View>
                }
            </View>
            {/* Gallery/ Camera Permissions */}
            <View>
                {/* this modal is used for added product in firebase  */}
                <Modal
                    animationType="slide"
                    transparent={true}
                    visible={showImageModal}
                    onRequestClose={() => {
                        setShowImageModel(!showImageModal);
                    }}>
                    <View
                        style={{
                            height: '22%',
                            marginTop: 'auto',
                            elevation: 7
                            // backgroundColor: 'red',
                            // opacity:0.1
                        }}>
                        <View style={styles.footer}>
                            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-around' }}>
                                <Text style={{ alignSelf: 'center', fontSize: 20, fontWeight: '900', color: 'white', marginTop: 5 }}>Select Images From:</Text>
                                <TouchableOpacity style={{ alignSelf: "flex-end" }} onPress={() => setShowImageModel(!showImageModal)}>
                                    <Icon
                                        name='close'
                                        color='red'
                                        size={20}
                                        style={{ alignSelf: 'flex-end' }}
                                    />
                                </TouchableOpacity>
                            </View>

                            <View style={{ marginTop: 20, flexDirection: 'row', justifyContent: 'space-around' }}>
                                <TouchableOpacity
                                    style={styles.cameraBtn}
                                    onPress={() => requestCameraPermission()}
                                >
                                    <Icon3
                                        name='camera'
                                        size={30}
                                        color='#674CEC'
                                        style={{ alignSelf: 'center' }}
                                    />
                                </TouchableOpacity>
                                <TouchableOpacity
                                    style={styles.cameraBtn}
                                    onPress={() => requestGalleryPermission()}
                                >
                                    <Icon3
                                        name='image'
                                        size={30}
                                        color='#674CEC'
                                        style={{ alignSelf: 'center' }}
                                    />
                                </TouchableOpacity>
                            </View>
                        </View>

                    </View>
                </Modal>

            </View>
            {/* Society select modal */}
            <Modal visible={addressModalOpen} animationType='slide' transparent={true}>
                <View style={{ backgroundColor: 'gray', height: '50%', opacity: 0.5 }}></View>
                <View style={{ height: '50%', elevation: 7, backgroundColor: '#ccc' }}>
                    <View style={{
                        flex: 1, backgroundColor: '#fbfcfa', bottom: 0, elevation: 9,
                        left: 0,
                        right: 0,
                        zIndex: 10,
                        borderTopLeftRadius: 20,
                        borderTopRightRadius: 20
                    }}
                    >
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                            <View />
                            <Text style={{ fontSize: 18, color: 'black', alignSelf: 'center', fontWeight: '700' }}>Enter Society Name</Text>
                            <TouchableOpacity style={[styles.closeIconContainer, { margin: 10 }]} onPress={() => addressModalHandler()}>
                                <Icon
                                    name='close'
                                    color="black"
                                    size={25}
                                />
                            </TouchableOpacity>
                        </View>
                        <View style={{ width: '90%', alignSelf: 'center', justifyContent: 'space-between', marginTop: 20 }}>
                            <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 10, alignItems: 'center' }}>
                                <Text style={{ fontSize: 18, color: 'black', fontWeight: '600' }}>City: </Text>
                                <Text style={{ fontSize: 16, color: 'black', fontWeight: '500' }}>{cityName}</Text>
                            </View>
                            <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 15, alignItems: 'center' }}>
                                <Text style={{ fontSize: 18, color: 'black', fontWeight: '600' }}>Society: </Text>
                                <Text style={{ fontSize: 16, color: 'black', fontWeight: '500' }}>{societyName}</Text>
                            </View>
                            <View style={styles.societyContainer}>
                                <TextInput
                                    placeholder='Search society here...'
                                    placeholderTextColor="#1A1E25"
                                    style={styles.demandInput1}
                                    keyboardType='default'
                                    value={searchSocietyName}
                                    onChangeText={(text) => searchFilter(text)}
                                />
                                <Icon3
                                    name='search-outline'
                                    color="#1A1E25"
                                    size={25}
                                    style={{ marginRight: 20 }}
                                />
                            </View>
                            {
                                searchSocietyName !== "" ?
                                    <View style={{ height: 200, marginTop: 10 }}>
                                        <FlatList
                                            data={filterSocietyData}
                                            keyExtractor={(stock) => stock.id}
                                            renderItem={({ item }) => {
                                                return (
                                                    <TouchableOpacity
                                                        style={{ borderBottomColor: '#ccc', borderBottomWidth: 1, marginBottom: 5 }}
                                                        onPress={() => changeSocietyName(item.name)}
                                                    >
                                                        <Text style={{ color: 'black', fontSize: 15, marginBottom: 10, marginLeft: 10 }}>{item.name}</Text>
                                                    </TouchableOpacity>
                                                )
                                            }}
                                        />
                                    </View>
                                    : null
                            }
                            {/* <TouchableOpacity style={styles.continueButton}
                                onPress={() => adrressModalContinueHandler()}
                            >
                                <Text style={{alignSelf:'center',color:'white',fontSize:18,fontWeight:'700'}}>Continue</Text>
                            </TouchableOpacity> */}
                        </View>
                    </View>
                </View>
            </Modal>
        </ScrollView>
    );
}
const styles = StyleSheet.create({
    property_type: {
        color: "#1A1E25",
        fontSize: 14,
        fontWeight: "900",
        marginTop: 15,
        // marginLeft: "4%"
    },
    property_typeContainer: {
        // width: "92%",
        flexDirection: 'row',
        justifyContent: "space-between",
        marginTop: 15,
        marginBottom: 15,
        // marginLeft: 8,
        alignItems: 'center',
        alignSelf: "center"
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
    textHeading: {
        color: "#1A1E25",
        fontSize: 14,
        fontWeight: "900",
    },
    CameraContainer: {
        elevation: 1,
        height: 55,
        width: 55,
        marginBottom: -25,
        borderWidth: 1,
        borderColor: "#F0F0F0",
        alignItems: 'center',
        justifyContent: 'center'
    },
    inputStyle: {
        width: "100%",
        textAlign: "left",
        borderBottomWidth: 1,
        borderColor: "#E2E2E2",
        color: "#000000",
        paddingLeft: 0,
        paddingBottom: 0,
        fontSize: 12,
        fontWeight: "500",
        marginTop: -10,
    },
    requirementHanding: {
        color: "#7D7F88",
        fontSize: 16,
        fontWeight: "400",
    },
    quantityHandlingContainer: {
        width: "40%",
        flexDirection: "row",
        justifyContent: "space-evenly",
        alignItems: "center"
    },
    circleStyle: {
        width: 25,
        height: 25,
        borderRadius: 100,

        borderWidth: 1.5,
    },
    symbolStyle: {
        textAlign: 'center',
        fontSize: 15,
        fontWeight: "bold",
    },
    saveBtnContainer: {
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 35
    },
    saveBtn: {
        height: 47,
        width: '90%',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 10,
    },
    saveBtnTwo: {
        height: 47,
        width: "98%",
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 10,
    },
    textSave: {
        color: "#000000",
        fontSize: 12,
        fontWeight: "900"
    },
    textCreate: {
        color: "#FFFFFF",
        fontSize: 15,
        fontWeight: "900"
    },
    pickerStyle: {
        backgroundColor: "white",
        color: "#7D7F88",
        // alignItems: 'center', 
        justifyContent: 'center',
        // margin: 15, 
        width: 155,
        borderRadius: 4,
        borderColor: "#BABCBF",
        //marginTop: -20,
        borderWidth: 1,
        // marginBottom: 10,
        elevation: 2,
        height: 35,
        marginLeft: 20
    },
    errorStyle: {
        color: 'red',
        fontSize: 10,
        marginTop: 5
    },
    // Design
    heading: {
        fontFamily: 'Lato',
        fontWeight: '900',
        fontSize: 14,
        color: '#1A1E25',
        marginTop: 10
    },
    demandContainer: {
        backgroundColor: '#F2F2F3',
        borderWidth: 0.8,
        borderColor: '#E3E3E7',
        borderRadius: 94,
        // alignItems: 'center',
        height: 48,
        marginTop: 10,
        marginBottom: 10
    },
    demandInput: {
        color: '#1A1E25',
        fontSize: 16,
        fontFamily: 'Lato',
        fontWeight: '400',
        alignSelf: 'flex-start',
        marginLeft: 15,
        width: '65%',
    },
    societyContainer: {
        backgroundColor: '#F2F2F3',
        borderWidth: 0.8,
        borderColor: '#E3E3E7',
        borderRadius: 10,
        alignItems: 'center',
        height: 50,
        flexDirection: 'row',
        // marginTop: 15,
        // marginBottom: 10
    },
    placeFindContainer: {
        backgroundColor: '#F2F2F3',
        borderColor: '#E3E3E7',
        borderWidth: 0.8,
        borderRadius: 94,
        flexDirection: 'row',
        height: 48,
        alignItems: 'center',
        marginTop: 5,
        marginBottom: 5
    },
    demandInput1: {
        color: '#1A1E25',
        fontSize: 16,
        fontFamily: 'Lato',
        fontWeight: '600',
        alignSelf: 'flex-start',
        marginLeft: 5,
        // lex:1,
        width: '90%',
    },
    continueButton: {
        marginTop: '20%',
        width: '100%',
        borderRadius: 7,
        backgroundColor: '#876FF9',
        alignSelf: 'flex-end',
        height: 50,
        alignItems: 'center',
        justifyContent: "center",
        flexDirection: 'row',
        elevation: 2
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
        elevation: 7,
        alignSelf: 'flex-end'
    },
    facilitiesContainer: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        // borderColor:'green',
        // borderWidth:1,
        marginTop: 10,
        // width: '70%',
        justifyContent: 'space-between',
        marginBottom: 15,
        flexWrap: 'wrap',
        marginLeft: 10
    },
    facilities: {
        backgroundColor: '#F2F2F3',
        alignItems: 'center',
        justifyContent: 'center',
        borderColor: '#E3E3E7',
        borderWidth: 0.8,
        borderRadius: 92,
        height: 40,
        width: 77,
        // flex:1,
        elevation: 1
    },
    facilitiesText: {
        fontFamily: 'SF Pro Text',
        fontWeight: '400',
        fontSize: 16,
        color: '#7D7F88'
    },
    cameraBtn: {
        width: 70,
        height: 70,
        backgroundColor: 'white',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 8,
        padding: 5,
        marginBottom: 15
    },
    screen: {
        flex: 1,
        backgroundColor: '#fcfcfc',
    },
    body: {
        flex: 1,
        marginTop: '10%',
        width: '95%',
        alignSelf: 'center',
        // backgroundColor:'green'
    },
    heading: {
        fontFamily: 'Lato',
        fontWeight: '700',
        fontSize: 16,
        color: 'black',
        marginTop: 2
    },
    facilitiesContainer: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginTop: 10,
        // width: '77%',
        marginBottom: 15,
        flexWrap: 'wrap',
        marginLeft: 10
    },
    facilities: {
        backgroundColor: '#F2F2F3',
        alignItems: 'center',
        justifyContent: 'center',
        borderColor: '#E3E3E7',
        borderWidth: 0.8,
        borderRadius: 92,
        height: 40,
        width: 77,
        // flex:1,
        // elevation: 1
    },
    facilitiesText: {
        fontFamily: 'SF Pro Text',
        fontWeight: '400',
        fontSize: 16,
        color: '#7D7F88'
    },
    buttonContainer: {
        width: '100%',
        alignSelf: 'center',
        marginVertical: 20,
        backgroundColor: '#876FF9',
        alignItems: 'center',
        borderRadius: 10,
        marginTop: 20,
        padding: 15,
        //elevation: 9
    },
    buttonText: {
        alignSelf: 'center',
        fontSize: 16,
        fontFamily: 'Lato',
        fontWeight: '900',
        color: 'white'
    },
    footer: {
        flex: 1,
        backgroundColor: '#674CEC',
        bottom: 0,
        left: 0,
        right: 0,
        zIndex: 10,
        borderTopLeftRadius: 8,
        borderTopRightRadius: 8
    },
})

const propertyStyles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        // borderColor:'green',
        // borderWidth:1,
        marginTop: 20,
        // width:'92%',
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
})