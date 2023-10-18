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
    ScrollView,
    Dimensions,
    PermissionsAndroid,
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
import { AreaData } from '../../utils/AreaData';
import LinearGradient from 'react-native-linear-gradient';
import LeadApi from '../../api/LeadsRequest'

import AsyncStorage from '@react-native-async-storage/async-storage'
import storage from "@react-native-firebase/storage"

import firestore from '@react-native-firebase/firestore'

import PermissionAPI from '../../api/PermissionsAPIs/checkUserAPI'
import { launchCamera, launchImageLibrary } from 'react-native-image-picker';



// import { Picker } from '@react-native-picker/picker';
import { NotificationApi } from '../../services';

export default function UpdateLeads({ route, navigation }) {

    const items = route.params.AllleadData
    // const property_image=route.params
    // console.log("all data :", route.params.property_image)
    const {
        leadName,
        mobile,
        catagory,
        societyName,
        bedroomsQuantity,
        bathroomQuantity,
        size,
        size_type,
        portion_type,
        property_type,
        unitType,
        description,
        budget,
        id,
        houseNo,
        hasInventory,
        inventoryID,
        status,
        inventoryProperty,
    } = items
    const property_image = route.params.property_image


    console.log("Property Image =>>>", property_image)

    const { user } = useContext(AuthContext);

    const [loading, setLoading] = useState(false)
    const [showNotes, setShowNotes] = useState(false)

    // Input States
    const [lead, setLead] = useState('')
    const [phone, setPhone] = useState('')
    const [budgets, setBudget] = useState(0)
    const [house, setHouse] = useState(houseNo)
    const [descriptions, setDescription] = useState("")

    // Boolean States
    const [showLeadName, setShowLeadName] = useState(false)
    const [showNumber, setShowNumber] = useState(false)
    const [showBudget, setShowBudget] = useState(false)
    const [showSociety, setShowSociety] = useState(false)
    const [showHouse, setShowHouse] = useState(false)
    const [showArea, setShowArea] = useState(false)
    const [showDescription, setShowDescription] = useState(false)

    const [addressModalOpen, setAddressModalOpen] = useState(false)

    //Lead Type 
    const [btnColorRent, setBtnColorRent] = useState(property_type == "Rent" ? true : false)
    const [btnColorBuy, setBtnColorBuy] = useState(property_type == "Buy" ? true : false)
    const [btnColorSale, setBtnColorSale] = useState(property_type == "Sale" ? true : false)
    const [btnColorToLet, setBtnColorToLet] = useState(property_type == "ToLet" ? true : false)

    const [showLocationOpetion, setShowLocationOpetion] = useState(true)
    const [showPortionOption, setShowPortionOption] = useState(true)
    const [showHouseNoOpetion, setShowHouseNoOpetion] = useState(true)
    const [showButtonOpetion, setShowButtonOpetion] = useState(true)

    //Property Catagory
    const [btnColorResidentiol, setBtnColorResidentiol] = useState(catagory == "Residentiol" ? true : false)
    const [btnColorComercial, setBtnColorComercial] = useState(catagory == "Comercial" ? true : false)
    const [btnColorSemiComercial, setBtnColorSemiComercial] = useState(catagory == "SemiComercial" ? true : false)

    // Rooms
    const [bedroomQuantity, setBedroomsQuantity] = useState(bedroomsQuantity)
    const [bathroomsQuantity, setBathroomQuantity] = useState(bathroomQuantity)

    // Unit Type
    const [btnColorSingle, setBtnColorSingle] = useState(unitType == "Single" ? true : false)
    const [btnColorDouble, setBtnColorDouble] = useState(unitType == "Double" ? true : false)

    // Portion Type
    const [btnColorComplete, setBtnColorComplete] = useState(portion_type == "Complete" ? true : false)
    const [btnColorFirstFloor, setBtnColorFirstFloor] = useState(portion_type == "FirstFloor" ? true : false)
    const [btnColorSecondFloor, setBtnColorSecondFloor] = useState(portion_type == "SecondFloor" ? true : false)

    // Society
    const [searchSocietyName, setSearchSocietyName] = useState('')
    const [societyData, setSocietyData] = useState("")
    const [filterSocietyData, setFilterSocietyData] = useState("")
    const [society, setSocietyName] = useState('')

    const [value, setValue] = useState("")
    const [newSize, setSize] = useState("")
    const [sizeType, setSizeType] = useState(size_type)

    // Lead status
    const [newStatus, setNewStatus] = useState(status == "new" ? true : false)
    const [qualifiedStatus, setQualifiedStatus] = useState(status == "qualified" ? true : false)
    const [negotiationStatus, setNegotiationStatus] = useState(status == "negotiation" ? true : false)
    const [coldStatus, setColdStatus] = useState(status == "cold" ? true : false)
    const [wonStatus, setWonStatus] = useState(status == "won" ? true : false)
    const [rejectedStatus, setRejectedStatus] = useState(status == "rejected" ? true : false)

    const [viewstatus, setViewStatus] = useState("new")

    // Lead Reassign to Lead
    // const [value, setValue] = useState("")
    const [salePerson, setSalePerson] = useState(user.displayName)
    const [personalUser, setPersonalUser] = useState([])
    const [userType, setUserType] = useState("")
    const [reassignId, setReassignId] = useState("")
    const [oneDeviceToken, setOneDeviceToken] = useState("")

    // regux add in Lead name
    const username_regux = /^[a-zA-Z\s]*$/;

    const [nameError, setNameError] = useState("")
    const [mobileError, setMobileError] = useState("")

    // Focus on Error statement
    const LeadNameFocus = useRef(null);
    const mobileFocus = useRef(null);

    // Image states
    const [showImageModal, setShowImageModel] = useState(false)
    const [imageUri, setimageUri] = useState('');
    const [image, setimage] = useState(null);
    const [transferred, setTransferred] = useState(0);

    // show requirement View 
    const [showRequirementView, setShowRequirementView] = useState(inventoryProperty === "Plot" ? false : inventoryProperty === "Files" ? false : inventoryProperty === "Office" ? false : inventoryProperty === "Shop" ? false : inventoryProperty === "Agriculture" ? false : true)

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
                    navigation.pop(2)
                }
                else {
                    alert("Notication not Send But lead updated")
                    navigation.pop(2)
                }
            } catch (error) {
                alert("Error in Notification But lead has been Updated")
                navigation.pop(2)
            }
        }
        else {
            navigation.pop(2)
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

    const checkPermissions = async () => {
        const response = await PermissionAPI.checkUserType(user.uid)
        setUserType(response)
        console.log("type", response)
    }

    const OnchangePickerUserSelected = (item, index) => {
        // console.log(">>>>>>>>>>>>>>",item)
        if (item.userId == undefined) {
            alert("Your Agent not login in any device so first login then assign leads to Agent")
            setLoading(false)
            return true
        }
        setSalePerson(item.username)
        setReassignId(item.userId)
        setOneDeviceToken(item.deviceToken)
    }



    const CategoryHandler = (text) => {
        switch (true) {
            case (text == "Residentiol"):
                setBtnColorResidentiol(true)
                setBtnColorComercial(false)
                setBtnColorSemiComercial(false)
                // setCategory("Residentiol")
                break;
            case (text == "Comercial"):
                setBtnColorResidentiol(false)
                setBtnColorComercial(true)
                setBtnColorSemiComercial(false)
                // setCategory("Comercial")
                break;
            case (text == "SemiComercial"):
                setBtnColorResidentiol(false)
                setBtnColorComercial(false)
                setBtnColorSemiComercial(true)
                // setCategory("SemiComercial")
                break;
            default:
                break;
        }
    }

    const PropertyTypeHandler = (text) => {
        switch (true) {
            case (text == "Buy"):
                setBtnColorRent(false)
                setBtnColorSale(false)
                setBtnColorToLet(false)
                setBtnColorBuy(true)
                // setPropertyType("Buy")
                setShowLocationOpetion(true)
                setShowPortionOption(false)
                setShowHouseNoOpetion(false)
                setShowButtonOpetion(false)
                break;
            case (text == "Sale"):
                setBtnColorRent(false)
                setBtnColorBuy(false)
                setBtnColorToLet(false)
                setBtnColorSale(true)
                // setPropertyType("Sale")
                setShowLocationOpetion(false)
                setShowPortionOption(false)
                setShowHouseNoOpetion(true)
                setShowButtonOpetion(true)
                // setBudgetError("")
                break;
            case (text == "Rent"):
                setBtnColorBuy(false)
                setBtnColorSale(false)
                setBtnColorToLet(false)
                setBtnColorRent(true)
                // setPropertyType("Rent")
                setShowLocationOpetion(true)
                setShowPortionOption(true)
                setShowHouseNoOpetion(false)
                setShowButtonOpetion(false)
                // setBudgetError("")
                break;
            case (text == "ToLet"):
                setBtnColorRent(false)
                setBtnColorBuy(false)
                setBtnColorSale(false)
                setBtnColorToLet(true)
                // setPropertyType("ToLet")
                setShowLocationOpetion(false)
                setShowPortionOption(true)
                setShowHouseNoOpetion(true)
                setShowButtonOpetion(true)
                // setBudgetError("")
                break;
            default:
                break;
        }
    }

    const UnitHandler = (text) => {
        switch (true) {
            case (text == "Single"):
                setBtnColorSingle(true)
                setBtnColorDouble(false)
                // setUnitType("Single")
                break;
            case (text == "Double"):
                setBtnColorSingle(false)
                setBtnColorDouble(true)
                // setUnitType("Double")
                break;
            default:
                break;
        }
    }

    const PortionHandler = (text) => {
        switch (true) {
            case (text == "Complete"):
                setBtnColorComplete(true)
                setBtnColorSecondFloor(false)
                setBtnColorFirstFloor(false)
                // setPortionType("Complete")
                break;
            case (text == "SecondFloor"):
                setBtnColorComplete(false)
                setBtnColorSecondFloor(true)
                setBtnColorFirstFloor(false)
                // setPortionType("SecondFloor")
                break;
            case (text == "FirstFloor"):
                setBtnColorComplete(false)
                setBtnColorSecondFloor(false)
                setBtnColorFirstFloor(true)
                // setPortionType("FirstFloor")
                break;
            default:
                break;
        }
    }

    const decrementBedroomQuantity = () => {
        if (bedroomQuantity > 0) {
            setBedroomsQuantity(bedroomQuantity - 1)
        }
    }
    const incrementBedroomQuantity = () => {
        setBedroomsQuantity(bedroomQuantity + 1)
    }
    const decrementBathroomQuantity = () => {
        if (bathroomsQuantity > 0) {
            setBathroomQuantity(bathroomsQuantity - 1)
        }
    }
    const incrementBathroomQuantity = () => {
        setBathroomQuantity(bathroomsQuantity + 1)
    }

    useEffect(() => {
        getID()
    }, [])

    // var cityName

    const getID = async () => {
        var data = await AsyncStorage.getItem("@areas");
        data = data.replace(/'/g, '"');
        data = JSON.parse(data);
        // console.log(typeof data)
        // console.log(data)
        // setData(data)
        setSocietyData(data)
        // console.log("id===>>", data)

    }

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

    const changeSocietyName = (name) => {
        setSocietyName(name)
        setSearchSocietyName("")
    }

    const OnchangePickerSeletedHandler = (value, index) => {
        setValue(value)
        setSizeType(AreaData[index].name)
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
    const updateInventory = async () => {
        // setLoading(true)
        const imageUrl = await uploadImage();
        try {
            await firestore()
                .collection('Inventory')
                .doc(inventoryID)
                .update({
                    houseName: house !== "" ? house : houseNo,
                    societyName: society && society !== societyName ? society : societyName,
                    transactionType: btnColorSale ? "Sale" : "Let",
                    catagory: btnColorResidentiol ? 'Residential' : btnColorComercial ? 'Commercial' : 'Semi Commercial',
                    unitType: btnColorSingle ? "Single" : "Double",
                    floorType: btnColorComplete ? "Complete" : btnColorFirstFloor ? "First Floor" : "Second Floor",
                    demand: budgets != "" ? budgets : budget,
                    size: newSize !== "" ? newSize : size,
                    sizeType: sizeType && sizeType !== size_type ? sizeType : size_type,
                    leadName: lead !== "" ? lead : leadName,
                    sellerName: lead !== "" ? lead : leadName,
                    sellerMobile: phone !== "" ? phone : mobile,

                    rooms: {
                        bedrooms: bedroomQuantity,
                        bathrooms: bathroomsQuantity,
                    },
                    propertyImg:imageUrl ? imageUrl : property_image,
                    description: descriptions !== "" ? descriptions : description,
                    update: firestore.Timestamp.fromDate(new Date())
                })
                .then(() => {
                    console.log("Inventory Updated")
                    setLoading(false)
                    // navigation.pop(2)
                    // setLoading(false)
                    // return true
                    // Alert.alert("Inventory Updated")
                    navigation.navigate("Leads")
                })
        } catch (err) {
            console.log(err)
            setLoading(false)
            console.log(
                "Error occured",
            )
            return false
        }
    }


    const updateLead = async () => {

        if (lead != "" && username_regux.test(lead) == false) {
            setNameError("Name Should Contain Only Alphabets")
            LeadNameFocus.current.focus()
            setLoading(false)
            return true
        }

        if (lead != "" && lead.length > 25) {
            setNameError("Leads Name should have 25 characters max.")
            LeadNameFocus.current.focus()
            setLoading(false)
            return true
        }
        if (phone != "" && phone.length > 15) {
            setMobileError("Leads Mobile number should have 15 characters max.")
            mobileFocus.current.focus()
            setLoading(false)
            return true
        }

        setLoading(true)
        try {
            await firestore()
                .collection('leads')
                .doc(id)
                .update({
                    // property_type: btnColorRent ? "Rent" : btnColorBuy ? "Buy" : btnColorSale ? "Sale" : "ToLet",
                    catagory: btnColorComercial ? "Comercial" : btnColorResidentiol ? "Residentiol" : "SemiComercial",
                    leadName: lead !== "" ? lead : leadName,
                    mobile: phone !== "" ? phone : mobile,
                    portion_type: btnColorComplete ? "Complete" : btnColorFirstFloor ? "FirstFloor" : "SecondFloor",
                    bedroomsQuantity: bedroomQuantity,
                    bathroomQuantity: bathroomsQuantity,
                    budget: budgets != "" ? budgets : budget,
                    // location: location,
                    size: newSize !== "" ? newSize : size,
                    size_type: sizeType && sizeType !== size_type ? sizeType : size_type,
                    unitType: btnColorSingle ? "Single" : "Double",
                    societyName: society && society !== societyName ? society : societyName,
                    houseNo: house !== "" ? house : houseNo,
                    status: newStatus ? "new" : qualifiedStatus ? "qualified" : negotiationStatus ? "negotiation" : coldStatus ? "cold" : wonStatus ? "won" : "rejected",
                    description: descriptions !== "" ? descriptions : description,
                    update: firestore.Timestamp.fromDate(new Date()),

                    businessID: reassignId !== "" ? reassignId : user.uid,
                    user_id: reassignId == "" ? user.uid : reassignId,

                })
                .then(() => {
                    console.log("lead Updated")
                    if (hasInventory == true) {
                        updateInventory()
                    }
                    else {
                        sendNotification()
                    }
                    // setLoading(false)
                    // return true
                    // Alert.alert("Lead Updated")
                    // navigation.navigate("Leads")
                })
        } catch (err) {
            console.log(err)
            setLoading(false)
            console.log(
                "Error occured",
            )
            return false
        }
    }

    const updateLeadHandler = async () => {
        // console.log("<><><><><><><><><><><><><><><><><><><><>", hasInventory)
        setLoading(true)
        if (hasInventory == true) {
            const inventoryResponse = await updateInventory()
            // console.log("inventoryResponse", inventoryResponse)
            // if (inventoryResponse && inventoryResponse == true) {
            //     const leadResponse = await updateLead()
            //     // if (leadResponse && leadResponse == true) {
            //     //     console.log("Inventory Updated2")
            //     //     // Alert.alert("Lead Updated")
            //     //     navigation.pop(2)
            //     // }
            // }
        }
        else {
            const leadResponse = await updateLead()
            // if (leadResponse && leadResponse == true) {
            //     console.log("Inventory Updated3")
            //     // Alert.alert("Lead Updated")
            //     // navigation.pop(2)

            // }
        }
    }


    // Update Lead Status just press on Status state 
    const updateLeadStatus = async (statuses) => {
        setLoading(true)
        try {
            await firestore()
                .collection('leads')
                .doc(id)
                .update({
                    status: statuses
                })
                .then(() => {
                    console.log("Lead Status Updated")
                    setLoading(false)
                    navigation.pop(2)
                })
        } catch (err) {
            console.log(err)
            setLoading(false)
            console.log(
                "Error occured",
            )
            return false
        }
    }

    const StatusHandler = (text) => {
        switch (true) {
            case (text == "new"):
                setNewStatus(true)
                setQualifiedStatus(false)
                setNegotiationStatus(false)
                setColdStatus(false)
                setWonStatus(false)
                setRejectedStatus(false)
                // updateLeadStatus("new")
                // setViewStatus("new")

                break;
            case (text == "qualified"):
                setNewStatus(false)
                setQualifiedStatus(true)
                setNegotiationStatus(false)
                setColdStatus(false)
                setWonStatus(false)
                setRejectedStatus(false)
                // updateLeadStatus("qualified")
                // setViewStatus("qualified")
                break;
            case (text == "negotiation"):
                setNewStatus(false)
                setQualifiedStatus(false)
                setNegotiationStatus(true)
                setColdStatus(false)
                setWonStatus(false)
                setRejectedStatus(false)
                // updateLeadStatus("negotiation")
                // setViewStatus("negotiation")
                break;
            case (text == "cold"):
                setNewStatus(false)
                setQualifiedStatus(false)
                setNegotiationStatus(false)
                setColdStatus(true)
                setWonStatus(false)
                setRejectedStatus(false)
                // updateLeadStatus("cold")
                // setViewStatus("cold")
                break;
            case (text == "won"):
                setNewStatus(false)
                setQualifiedStatus(false)
                setNegotiationStatus(false)
                setColdStatus(false)
                setWonStatus(true)
                setRejectedStatus(false)
                // updateLeadStatus("won")
                // setViewStatus("won")
                break;
            case (text == "rejected"):
                setNewStatus(false)
                setQualifiedStatus(false)
                setNegotiationStatus(false)
                setColdStatus(false)
                setWonStatus(false)
                setRejectedStatus(true)
                // updateLeadStatus("rejected")
                // setViewStatus("rejected")
                break;
            default:
                break;
        }
    }

    const [actualPrice, setActualPrice] = useState("Price must contain numbers only")
    const ChangePrice = (e) => {
        var regex = /^[0-9]+$/;

        if (e.match(regex) === null) {
            setActualPrice("Price must contain numbers only")
            setBudget("")
            return true
        }
        if (e.length < 4) {
            setActualPrice(e)
            setBudget(e)
        }
        else if (e.length > 3 && e.length < 12) {
            setActualPrice("Thousand")
            setBudget(e)
        }
        else {
            setActualPrice("Price is too large. Please enter a smaller number.")
            setBudget("")
        }
    }




    // handle validate of lead name
    const validateName = (text) => {
        setLead(text)
        setNameError("")
    }
    // handle validate Mobile Number
    const validateMobileNumber = (text) => {
        setPhone(text.trim())
        setMobileError("")
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


    return (
        <ScrollView keyboardShouldPersistTaps="always" contentContainerStyle={{ flexGrow: 1, backgroundColor: "#FCFCFC" }}>
            {
                loading ?
                    <Spinner visible={true} />
                    :
                    null
            }

            {/* Header */}
            <View style={[HeaderStyle.mainContainer, { marginBottom: 20 }]}>
                <View style={HeaderStyle.arrowbox}>
                    <TouchableOpacity onPress={() => navigation.goBack()}>
                        <Icon name="left" color="#1A1E25" size={20} />
                    </TouchableOpacity>
                </View>
                <View style={HeaderStyle.HeaderTextContainer}>
                    <Text style={HeaderStyle.HeaderText}>Update Lead</Text>
                    <Image style={HeaderStyle.HeaderImage} resizeMode='contain'
                        // source={require('../../assets/images/personpic.png')} 
                        source={{ uri: user.photoURL }}
                    />
                </View>
            </View>

            {/* Property Type */}
            {/* <Text style={styles.property_type}>Property type</Text> */}
            {/* {
                hasInventory ? 
                    <View style={styles.property_typeContainer}>
                        {/* <TouchableOpacity onPress={() => PropertyTypeHandler("Buy")}
                            style={[styles.BtnPropertyType, { backgroundColor: btnColorBuy ? '#826AF7' : '#F2F2F3' }]}>
                            <Text style={[styles.ButtonText, { color: btnColorBuy ? '#FFFFFF' : '#7D7F88' }]}>Buy</Text>
                        </TouchableOpacity> */}
            {/* <TouchableOpacity onPress={() => PropertyTypeHandler("Sale")}
                            style={[styles.BtnPropertyType, { backgroundColor: btnColorSale ? '#826AF7' : '#F2F2F3' }]}>
                            <Text style={[styles.ButtonText, { color: btnColorSale ? '#FFFFFF' : '#7D7F88' }]}>Sale</Text>
                        </TouchableOpacity> */}
            {/* <TouchableOpacity onPress={() => PropertyTypeHandler("Rent")}
                            style={[styles.BtnPropertyType, { backgroundColor: btnColorRent ? '#826AF7' : '#F2F2F3' }]}>
                            <Text style={[styles.ButtonText, { color: btnColorRent ? '#FFFFFF' : '#7D7F88' }]}>To Rent</Text>
                        </TouchableOpacity> */}
            {/* <TouchableOpacity onPress={() => PropertyTypeHandler("ToLet")}
                            style={[styles.BtnPropertyType, { backgroundColor: btnColorToLet ? '#826AF7' : '#F2F2F3' }]}>
                            <Text style={[styles.ButtonText, { color: btnColorToLet ? '#FFFFFF' : '#7D7F88' }]}>To Let</Text>
                        </TouchableOpacity>
                    </View>
                : */}
            {/* <View style={styles.property_typeContainer}> */}
            {/* <TouchableOpacity onPress={() => PropertyTypeHandler("Buy")}
                            style={[styles.BtnPropertyType, { backgroundColor: btnColorBuy ? '#826AF7' : '#F2F2F3' }]}>
                            <Text style={[styles.ButtonText, { color: btnColorBuy ? '#FFFFFF' : '#7D7F88' }]}>Buy</Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => PropertyTypeHandler("Sale")}
                            style={[styles.BtnPropertyType, { backgroundColor: btnColorSale ? '#826AF7' : '#F2F2F3' }]}>
                            <Text style={[styles.ButtonText, { color: btnColorSale ? '#FFFFFF' : '#7D7F88' }]}>Sale</Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => PropertyTypeHandler("Rent")}
                            style={[styles.BtnPropertyType, { backgroundColor: btnColorRent ? '#826AF7' : '#F2F2F3' }]}>
                            <Text style={[styles.ButtonText, { color: btnColorRent ? '#FFFFFF' : '#7D7F88' }]}>To Rent</Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => PropertyTypeHandler("ToLet")}
                            style={[styles.BtnPropertyType, { backgroundColor: btnColorToLet ? '#826AF7' : '#F2F2F3' }]}>
                            <Text style={[styles.ButtonText, { color: btnColorToLet ? '#FFFFFF' : '#7D7F88' }]}>To Let</Text>
                        </TouchableOpacity>
                    </View> */}
            {/* } */}




            {/* Lead Name */}
            <View style={{
                width: '92%',
                marginTop: 10,
                alignSelf: 'center',
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center'
            }}>
                <Text style={styles.heading}>Lead Name</Text>
                <TouchableOpacity onPress={() => setShowLeadName(!showLeadName)}>
                    <Icon3
                        name='pencil-outline'
                        size={18}
                        color="black"
                    />
                </TouchableOpacity>

            </View>

            {
                showLeadName ?
                    <>
                        <TextInput
                            ref={LeadNameFocus}
                            style={styles.inputStyle}
                            placeholder='Enter lead Name'
                            placeholderTextColor={"#A1A1A1"}
                            value={lead}
                            onChangeText={(value) => validateName(value)}
                        />
                        {
                            nameError != "" ?
                                <Text style={{ ...styles.errorStyle, marginLeft: 15 }}>{nameError}</Text>
                                : null
                        }
                    </>
                    :
                    <>
                        <Text style={{
                            color: 'gray',
                            fontSize: 15,
                            fontWeight: '600',
                            width: '92%',
                            alignSelf: 'center',
                            marginTop: 10
                        }}>
                            {leadName}

                        </Text>
                        <View style={{ borderColor: '#E2E2E2', borderWidth: 1, width: "92%", alignSelf: "center", marginTop: 20 }} />
                    </>
            }



            {/* Phone Number */}
            <View style={{
                width: '92%',
                marginTop: 5,
                alignSelf: 'center',
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center'
            }}>
                <Text style={styles.heading}>Phone</Text>
                <TouchableOpacity onPress={() => setShowNumber(!showNumber)}>
                    <Icon3
                        name='pencil-outline'
                        size={18}
                        color="black"
                    />
                </TouchableOpacity>

            </View>

            {
                showNumber ?
                    <>
                        <TextInput
                            ref={mobileFocus}
                            keyboardType="number-pad"
                            // placeholder="03xx-xxxxxxx"
                            placeholder='Enter Mobile Number'
                            placeholderTextColor={"#A1A1A1"}
                            value={phone}
                            onChangeText={(text) => validateMobileNumber(text)}
                            style={styles.inputStyle}
                        />
                        {/* <MaskedTextInput
                           ref={mobileFocus}
                            keyboardType="number-pad"
                            placeholder="03xx-xxxxxxx"
                            placeholderTextColor={"#A1A1A1"}
                            mask="0399-9999999"
                            value={phone}
                            onChangeText={(text) => validateMobileNumber(text)}
                            style={styles.inputStyle}
                        /> */}
                        {
                            mobileError != "" ?
                                <Text style={{ ...styles.errorStyle, marginLeft: 15 }}>{mobileError}</Text>
                                : null
                        }
                    </>
                    :
                    <Text style={{
                        color: 'gray',
                        fontSize: 15,
                        fontWeight: '600',
                        width: '92%',
                        alignSelf: 'center',
                        marginTop: 10
                    }}>
                        {mobile}
                    </Text>
            }

            {/* Lead Type  */}
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 15, width: '92%', alignSelf: 'center' }}>
                <Text style={{ fontSize: 16, fontWeight: '700', color: '#1A1E25' }}>Lead Type</Text>
                <Text style={{ fontSize: 14, fontWeight: '600', color: "#7D7F88" }}>{property_type}</Text>
            </View>
            {/* <View style={{ borderBottomWidth: 1, borderColor: "#E2E2E2", marginTop: 10 }} /> */}

            <View style={{ borderColor: '#E2E2E2', borderWidth: 1, width: "92%", alignSelf: "center" }} />

            {/* Property Type */}
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 20, width: '92%', alignSelf: 'center' }}>
                <Text style={{ fontSize: 16, fontWeight: '700', color: '#1A1E25' }}>Property Type</Text>
                <Text style={{ fontSize: 14, fontWeight: '600', color: "#7D7F88" }}>{inventoryProperty}</Text>
            </View>
            {/* <View style={{ borderBottomWidth: 1, borderColor: "#E2E2E2", marginTop: 10 }} /> */}

            <View style={{ borderColor: '#E2E2E2', borderWidth: 1, width: "92%", alignSelf: "center" }} />


            {/* Category */}
            <Text style={styles.property_type}>Catagory</Text>
            <View style={styles.property_typeContainer}>
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

            {/* Portion Type */}
            {
                showPortionOption === true ?
                    property_type == "Rent" || property_type === "Let" ?
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
                    :
                    null
            }

            {/* Unit Type */}
            {
                inventoryProperty === "House" ?
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
                    :
                    null
            }


            {/* Requirement */}
            {
                showRequirementView ?
                    <>
                        <Text style={[styles.textHeading, { marginTop: 25 }]}>Requirements</Text>
                        <View style={{ flexDirection: "row", marginTop: 10, width: '92%', alignSelf: 'center' }}>
                            <View style={{ width: "60%" }}>
                                <Text style={styles.requirementHanding}>Bedrooms</Text>
                            </View>
                            <View style={styles.quantityHandlingContainer}>
                                <TouchableOpacity onPress={() => decrementBedroomQuantity()}
                                    style={[styles.circleStyle, { borderColor: bedroomQuantity > 0 ? "#1A1E25" : "#BABCBF", }]}>
                                    <Text style={[styles.symbolStyle, { color: bedroomQuantity > 0 ? "#000000" : "#BABCBF" }]}>-</Text>
                                </TouchableOpacity>
                                <Text>
                                    {bedroomQuantity}
                                </Text>
                                <TouchableOpacity onPress={() => incrementBedroomQuantity()}
                                    style={[styles.circleStyle, { borderColor: "#1A1E25", }]}>
                                    <Text style={[styles.symbolStyle, { color: "#000000" }]}>+</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                        <View style={{ borderBottomWidth: 1, borderColor: "#E2E2E2", marginTop: 15 }} />
                        <View style={{ flexDirection: "row", marginTop: 10, width: '92%', alignSelf: 'center' }}>
                            <View style={{ width: "60%" }}>
                                <Text style={styles.requirementHanding}>Bathrooms</Text>
                            </View>
                            <View style={styles.quantityHandlingContainer}>
                                <TouchableOpacity onPress={() => decrementBathroomQuantity()}
                                    style={[styles.circleStyle, { borderColor: bathroomsQuantity > 0 ? "#1A1E25" : "#BABCBF", }]}>
                                    <Text style={[styles.symbolStyle, { color: bathroomsQuantity > 0 ? "#000000" : "#BABCBF" }]}>-</Text>
                                </TouchableOpacity>
                                <Text >
                                    {bathroomsQuantity}
                                </Text>
                                <TouchableOpacity onPress={() => incrementBathroomQuantity()}
                                    style={[styles.circleStyle, { borderColor: "#1A1E25", }]}>
                                    <Text style={[styles.symbolStyle, { color: "#000000" }]}>+</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                        <View style={{ borderBottomWidth: 1, borderColor: "#E2E2E2", marginTop: 15 }} />
                    </>
                    :
                    null
            }


            {/* Lead status  */}
            <Text style={[styles.textHeading, { marginTop: 15 }]}>
                Lead Status
            </Text>
            <View style=
                {{
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    alignSelf: "center",

                    width: "92%",
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









            {/* Society */}
            <View style={{
                width: '92%',
                marginTop: 10,
                alignSelf: 'center',
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center'
            }}>
                <Text style={styles.heading}>
                    Society
                </Text>
                <TouchableOpacity onPress={() => setShowSociety(!showSociety)}>
                    <Icon3
                        name='pencil-outline'
                        size={18}
                        color="black"
                    />
                </TouchableOpacity>

            </View>

            {
                showSociety ?
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
                    :
                    <Text style={{
                        color: 'gray',
                        fontSize: 15,
                        fontWeight: '600',
                        width: '92%',
                        alignSelf: 'center',
                        marginTop: 10
                    }}>
                        {society !== "" ? society : societyName}
                    </Text>
            }

            <View style={{ borderColor: '#E2E2E2', borderWidth: 1, marginTop: 5 }} />

            {/* House */}
            {
                property_type === "Sale" || property_type === "ToLet" ?
                    <>
                        <View style={{
                            width: '92%',
                            marginTop: 10,
                            alignSelf: 'center',
                            flexDirection: 'row',
                            justifyContent: 'space-between',
                            alignItems: 'center'
                        }}>
                            <Text style={styles.heading}>
                                House
                            </Text>
                            <TouchableOpacity onPress={() => setShowHouse(!showHouse)}>
                                <Icon3
                                    name='pencil-outline'
                                    size={18}
                                    color="black"
                                />
                            </TouchableOpacity>

                        </View>

                        {
                            showHouse ?
                                <View style={styles.demandContainer}>
                                    <TextInput
                                        placeholder='Enter Address'
                                        placeholderTextColor="#7D7F88"
                                        style={styles.demandInput}
                                        // keyboardType='numeric'
                                        value={house}
                                        onChangeText={(value) => setHouse(value)}
                                    />
                                </View>
                                :
                                <Text style={{
                                    color: 'gray',
                                    fontSize: 15,
                                    fontWeight: '600',
                                    width: '92%',
                                    alignSelf: 'center',
                                    marginTop: 10
                                }}>
                                    {houseNo}
                                </Text>
                        }
                    </>
                    :
                    null
            }
            <View style={{ borderColor: '#E2E2E2', borderWidth: 1 }} />

            {/* Area */}
            <View style={{
                width: '92%',
                marginTop: 10,
                alignSelf: 'center',
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center'
            }}>
                <Text style={styles.heading}>
                    Area
                </Text>
                <TouchableOpacity onPress={() => setShowArea(!showArea)}>
                    <Icon3
                        name='pencil-outline'
                        size={18}
                        color="black"
                    />
                </TouchableOpacity>
            </View>

            {
                showArea ?
                    <View style={{ flexDirection: 'row' }}>
                        <View style={{ width: "50%", marginLeft: 12 }}>
                            <TextInput
                                // style={styles.inputStyle}
                                placeholder='Enter Area'
                                placeholderTextColor={"#A1A1A1"}
                                keyboardType="numeric"
                                value={newSize}
                                onChangeText={(value) => setSize(value)}
                            />
                        </View>
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
                    </View>
                    :
                    <Text style={{
                        color: 'gray',
                        fontSize: 15,
                        fontWeight: '600',
                        width: '92%',
                        alignSelf: 'center',
                        marginTop: 10
                    }}>
                        {size} {size_type}
                    </Text>

            }
            <View style={{ borderColor: '#E2E2E2', borderWidth: 1, marginTop: 5 }} />
            {/* Budget */}
            <View style={{
                width: '92%',
                marginTop: 10,
                alignSelf: 'center',
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center'
            }}>
                {
                    property_type && property_type == "Sale" || property_type == "ToLet" ?
                        <Text style={[styles.textHeading, { marginTop: 15 }]}>Demand</Text>
                        :
                        <Text style={[styles.textHeading, { marginTop: 15 }]}>Budget</Text>
                }
                <TouchableOpacity onPress={() => setShowBudget(!showBudget)}>
                    <Icon3
                        name='pencil-outline'
                        size={18}
                        color="black"
                    />
                </TouchableOpacity>

            </View>

            {
                showBudget ?
                    <>
                        <TextInput
                            style={styles.inputStyle}
                            placeholder='Enter Budget'
                            placeholderTextColor={"#A1A1A1"}
                            keyboardType="numeric"
                            value={budgets}
                            onChangeText={(value) => ChangePrice(value)}
                        />
                        {
                            actualPrice == "Price must contain numbers only" ?
                                <Text style={{ marginLeft: 12 }}>Price must contain numbers only</Text>
                                :
                                <Text style={{ marginLeft: 12 }}>{budgets.length == 4 ? budgets.charAt(0) : budgets.length == 5 ? budgets.slice(0, 2) : budgets.length == 6 ? budgets.charAt(0) + "  Lakh and " + budgets.slice(1, 3) : budgets.length == 7 ? budgets.slice(0, 2) + "  Lakh and " + budgets.slice(2, 4) : budgets.length == 8 ? budgets.charAt(0) + "  Crore  " + budgets.slice(1, 3) + "  Lakh and  " + budgets.slice(3, 5) : budgets.length == 9 ? budgets.slice(0, 2) + "  Crore  " + budgets.slice(2, 4) + "  Lakh and  " + budgets.slice(4, 6) : budgets.length == 10 ? budgets.charAt(0) + "  Arab  " + budgets.slice(1, 3) + "  Crore  " + budgets.slice(3, 5) + "  Lakh and  " + budgets.slice(5, 7) : budgets.length == 11 ? budgets.slice(0, 2) + "  Arab  " + budgets.slice(2, 4) + "  Crore  " + budgets.slice(4, 6) + "  Lakh and  " + budgets.slice(6, 8) : null} {actualPrice}</Text>
                        }



                        {/* {
                            budgets && parseInt(budgets) <= 0 ?
                                <Text style={styles.errorStyle}>Please enter valid amount</Text>
                                : null
                        } */}


                    </>

                    :
                    <Text style={{
                        color: 'gray',
                        fontSize: 15,
                        fontWeight: '600',
                        width: '92%',
                        alignSelf: 'center',
                        marginTop: 10
                    }}>
                        {budget}
                    </Text>
            }
            <View style={{ borderColor: '#E2E2E2', borderWidth: 1, marginTop: 5 }} />

            {/* Description */}
            <View style={{
                width: '92%',
                marginTop: 10,
                alignSelf: 'center',
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center'
            }}>
                <Text style={styles.heading}>
                    Description
                </Text>
                <TouchableOpacity onPress={() => setShowDescription(!showDescription)}>
                    <Icon3
                        name='pencil-outline'
                        size={18}
                        color="black"
                    />
                </TouchableOpacity>
            </View>

            {
                showDescription ?
                    <TextInput
                        style={styles.inputStyle}
                        placeholder='Enter description here'
                        placeholderTextColor={"#A1A1A1"}
                        value={descriptions}
                        onChangeText={(value) => setDescription(value)}
                    />
                    :
                    <Text style={{
                        color: 'gray',
                        fontSize: 15,
                        fontWeight: '600',
                        width: '92%',
                        alignSelf: 'center',
                        marginTop: 10,
                        fontStyle: description ? "normal" : 'italic'
                    }}>
                        {description ? description : "No description"}
                    </Text>
            }
            <View style={{ borderColor: '#E2E2E2', borderWidth: 1, marginTop: 5 }} />
            {
                property_type === "Buy" || property_type === "Rent" ?

                    // {
                    //     userType == 0 ?
                    <>
                        <View style={{ flexDirection: "row", justifyContent: "space-between", }}>
                            <View style={{ flex: 0.6, }}>
                                <Text style={[styles.heading, { marginLeft: 13, marginTop: 15 }]}>Sale Person</Text>
                            </View>
                        </View>

                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: "center", marginHorizontal: 14, }}>
                            <View style={{ borderWidth: 1, borderColor: "#000000", width: "48%", marginTop: 15 }}>
                                <Text style={{ fontSize: 14, fontWeight: '500', color: "#000000", padding: 5 }}>{salePerson}</Text>
                            </View>

                            <View style={[styles.pickerStyle, { marginTop: 13 }]}>
                                <Picker
                                    selectedValue={value}
                                    onValueChange={(itemValue, itemIndex) => OnchangePickerUserSelected(itemValue, itemIndex)}
                                    itemStyle={{ color: "white" }} >
                                    <Picker.Item label="Reassign" />
                                    {
                                        personalUser.map((item, index) => {
                                            return (
                                                <Picker.Item label={item.username} value={item} />
                                            )
                                        })
                                    }
                                </Picker>
                            </View>
                        </View>
                    </>
                    //         :
                    //         null
                    // }

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
                                        source={property_image != null ? {uri:property_image}:require('../../assets/images/camera.png')}
                                        style={property_image != null ?{width:85,height:85 }:{width: 35, height: 35 }}
                                        // resizeMode='contain'
                                    />
                            }
                        </TouchableOpacity>
                    </View>

            }



            <TouchableOpacity style={styles.SaveBtn} onPress={() => updateLead()}>
                <Text style={styles.saveBtnText}>Update</Text>
            </TouchableOpacity>

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

            {/* Address Modal */}
            <Modal visible={addressModalOpen} animationType='slide' transparent={true}>
                <View style={{ backgroundColor: 'gray', height: '45%', opacity: 0.5 }}></View>
                <View style={{ height: '55%', elevation: 7, backgroundColor: '#ccc' }}>
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
                            <TouchableOpacity style={[styles.closeIconContainer, { margin: 10 }]} onPress={() => setAddressModalOpen(false)}>
                                <Icon
                                    name='close'
                                    color="black"
                                    size={25}
                                />
                            </TouchableOpacity>
                        </View>

                        <View style={{ width: '90%', alignSelf: 'center', justifyContent: 'space-between', marginTop: 20 }}>

                            <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 10, alignItems: 'center' }}>
                                {/* <Text style={{fontSize:18, color:'black', fontWeight:'600'}}>City: </Text>
                                <Text style={{fontSize:16, color:'black', fontWeight:'500'}}>{cityName}</Text> */}
                            </View>
                            <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 15, alignItems: 'center' }}>
                                <Text style={{ fontSize: 18, color: 'black', fontWeight: '600' }}>Society: </Text>
                                <Text style={{ fontSize: 16, color: 'black', fontWeight: '500' }}>{society}</Text>
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

                            <TouchableOpacity style={styles.continueButton}
                                onPress={() => { setShowSociety(!showSociety), setAddressModalOpen(false) }}
                            >
                                <Text style={{ alignSelf: 'center', color: 'white', fontSize: 18, fontWeight: '700' }}>Continue</Text>
                                {/* <Icons
                                    name='chevron-right'
                                    color="white"
                                    size={20}
                                /> */}
                            </TouchableOpacity>

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
        marginTop: 20,
        marginLeft: "4%"
    },
    property_typeContainer: {
        width: "92%",
        flexDirection: 'row',
        justifyContent: "space-between",
        margin: 15,
        alignItems: 'center',
        alignSelf: "center"
    },
    portionContainer: {
        width: "60%",
        flexDirection: 'row',
        justifyContent: "space-between",
        marginTop: 15,
        // alignSelf:'center',
        marginLeft: "4%"
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
        width: '92%',
        alignSelf: 'center'
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
        width: "92%",
        textAlign: "left",
        borderBottomWidth: 0.5,
        borderColor: "#E2E2E2",
        color: "#000000",
        paddingLeft: 0,
        paddingBottom: 0,
        fontSize: 12,
        fontWeight: "500",
        marginTop: -5,
        alignSelf: 'center',
        marginBottom: 10
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
    SaveBtn: {
        width: "92%",
        justifyContent: "center",
        alignSelf: "center",
        // alignItems: 'center',
        height: 47,
        backgroundColor: "#876FF9",
        borderRadius: 10,
        marginTop: 40,
        marginBottom: 20,
        elevation: 2
    },
    saveBtnText: {
        color: "#FFFFFF",
        fontSize: 15,
        fontWeight: "900",
        // lineHeight: 14,
        alignSelf: 'center'
    },
    saveBtnContainer: {
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 35
    },
    saveBtn: {
        height: 47,
        width: 133,
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
        fontSize: 12,
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
        alignItems: 'center',
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
        width: '90%',
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
})

const propertyStyles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        // borderColor:'green',
        // borderWidth:1,
        marginTop: 10,
        // width:'60%',
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
        width: 80,
        // elevation: 7,
        marginVertical: 5
    },
    type: {
        fontFamily: 'SF Pro Text',
        fontWeight: '400',
        fontSize: 12,
        color: '#7D7F88'
    },
})