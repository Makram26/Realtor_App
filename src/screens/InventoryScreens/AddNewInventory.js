import React, { useState, useContext, useEffect, useRef } from 'react'
import { StyleSheet, Text, View, ScrollView, TouchableOpacity, TextInput, Alert, Image, BackgroundImage, Modal, PermissionsAndroid, FlatList } from 'react-native'

import { AuthContext } from '../../auth/AuthProvider'
import firestore from '@react-native-firebase/firestore'
import storage from "@react-native-firebase/storage"

import Icon from 'react-native-vector-icons/Ionicons'
import Icons from 'react-native-vector-icons/MaterialCommunityIcons'
import Spinner from 'react-native-loading-spinner-overlay';
import { Picker } from '@react-native-picker/picker'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { launchCamera, launchImageLibrary } from 'react-native-image-picker';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete'

import { AreaData, apartmentAreaData } from "../../utils/AreaData"
import PlaceRow from "../../components/PlaceRow"
import AlertModal from '../../components/AlertModal'

import SocietyAPI from '../../api/AreaAPI'


export default function AddNewInventory({ navigation, route }) {

    const { user } = useContext(AuthContext);
    // console.log("user=>>", user)

    const { type, businessID } = route.params
    console.log("businessID>>>>>>>>>>>", businessID)
    console.log("type>>>>>>>>>>>>", type)

    // Image
    const [imageUri, setimageUri] = useState('');
    const [uploading, setUploading] = useState(false);
    const [transferred, setTransferred] = useState(0);


    // Transaction States
    const [saleType, setSaleType] = useState(true)
    const [letType, setLetType] = useState(false)

    // Catagory Type
    const [btnColorResidentiol, setBtnColorResidentiol] = useState(true)
    const [btnColorComercial, setBtnColorComercial] = useState(false)
    const [btnColorSemiComercial, setBtnColorSemiComercial] = useState(false)

    // Property States
    const [houseProperty, setHouseProperty] = useState(true)
    const [flatProperty, setFlatProperty] = useState(false)
    const [farmHouseProperty, setFarmHouseProperty] = useState(false)
    const [pentHouseProperty, setPentHouseProperty] = useState(false)

    const [officeProperty, setOfficeProperty] = useState(false)
    const [shopProperty, setShopProperty] = useState(false)
    const [buildingProperty, setBuildingProperty] = useState(false)
    const [factoryProperty, setFactoryProperty] = useState(false)

    const [housesProperty, setHousesProperty] = useState(false)
    const [plotsProperty, setPlotsProperty] = useState(false)
    const [shopsProperty, setShopsProperty] = useState(false)
    const [officesProperty, setOfficesProperty] = useState(false)
    const [agricultureProperty, setAgrecultureProperty] = useState(false)
    const [farmHousesProperty, setFarmHousesProperty] = useState(false)
    const [pentHopusesProperty, setPentHousesProperty] = useState(false)
    const [buildingsProperty, setBuildingsProperty] = useState(false)
    const [flatsProperty, setFlatsProperty] = useState(false)
    const [files, setFiles] = useState(false)

    // Unit States
    const [singleUnit, setSingleUnit] = useState(false)
    const [doubleUnit, setDoubleUnit] = useState(false)
    const [otherUnit, setOtherUnit] = useState(true)

    // Area Size
    const [size, setSize] = useState("")
    const [sizeType, setSizeType] = useState("Marla")
    const [value, setValue] = useState("")

    // Floor States
    const [anyFloor, setAnyFloor] = useState(true)
    const [basementFloor, setBasementFloor] = useState(false)
    const [firstFloor, setFirstFloor] = useState(false)
    const [secondFloor, setSecondFloor] = useState(false)
    const [completeFloor, setCompleteFloor] = useState(false)

    // Rooms States
    const [bedrooms, setBedrooms] = useState(0)
    const [bathrooms, setBathrooms] = useState(0)
    const [kitchen, setKitchen] = useState(0)
    const [garage, setGarage] = useState(0)

    // Facilities States
    const [gasFacilities, setGasFacilities] = useState(false)
    const [facingParkFacilities, setFacingParkFacilities] = useState(true)
    const [mainRoadFacilities, setMainRoadFacilities] = useState(false)
    const [cornerFacilities, setCornerFacilities] = useState(false)
    const [gatedFacilities, setGatedFacilities] = useState(false)
    const [ownerBuildFacilities, setOwnerBuildFacilities] = useState(false)

    // Input States
    const [location, setLocation] = useState('Lahore, DHA')
    const [originPlace, setOriginPlace] = useState(null);
    const [longitude, setLongitude] = useState(0.0)
    const [latitude, setlLatitude] = useState(0.0)
    const [demand, setDemand] = useState('')
    const [propertyName, setPropertyName] = useState('')
    const [description, setDescription] = useState('')

    // Loading States
    const [loading, setLoading] = useState(false)
    const [alertModal, setAlertModal] = useState(false)

    // open Model
    const [modalOpen, setModalOpen] = useState(false)
    const [addressModalOpen, setAddressModalOpen] = useState(false)
    const [showImageModal, setShowImageModel] = useState(false)
    const [fileAddressModal, setFileAddressModal] = useState(false)

    //const [imageUri, setimageUri] = useState(null);
    const [image, setimage] = useState(null);

    // Files Input States
    const [fileSociety, setFileSociety] = useState('')
    const [fileAddress, setFileAddress] = useState('')
    const [fileAreas, setFileAreas] = useState([])


    // Society States
    const [societyName, setSocietyName] = useState('')
    const [searchSocietyName, setSearchSocietyName] = useState('')
    const [societyData, setSocietyData] = useState()
    const [filterSocietyData, setFilterSocietyData] = useState()
    const [houseName, setHouseName] = useState("")
    const [cityName, setCityName] = useState()
    const [country, setCountry] = useState()
    const firstTextInputRef = useRef(null);
    // view Status
    const [viewStatus, setViewStatus] = useState("Matched")

    // Seller information 
    const [sellerName, setSellerName] = useState("")
    const [mobile, setMobile] = useState("")
    const [nameError, setNameError] = useState("")
    const [mobileError, setMobileError] = useState("")


     // Focus on Error statement
     const mobileFocus = useRef(null);
     const NameFocus = useRef(null);
     const AddressFocus = useRef(null);


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
    // console.log("image=>>>>>",image)

    const uploadImage = async () => {
        if (image !== null) {
            const { uri } = image;
            const filename = uri.substring(uri.lastIndexOf('/') + 1);
            const uploadUri = Platform.OS === 'ios' ? uri.replace('file://', '') : uri;
            // console.log("Image Uploading....")
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

                setLoading(false);

                // console.log("Image Uploaded")
                return url;
            } catch (e) {
                console.error(e);
                setLoading(false)
                return null;
            }
        }
        else {
            // Alert.alert("Attention","Pleasen Upload Product Image")
            return image;
        }
    };


    const changeTransactionHandler = (id) => {
        // console.log("id", id)
        if (id == 1) {
            setSaleType(true)
            setLetType(false)
        }
        else {
            setSaleType(false)
            setLetType(true)
        }

    }

    const CategoryHandler = (id) => {
        // console.log("id :", id)
        switch (id) {
            case 1:
                setBtnColorResidentiol(true)
                setBtnColorComercial(false)
                setBtnColorSemiComercial(false)
                changePropertyHandler(1)
                break;
            case 2:
                setBtnColorResidentiol(false)
                setBtnColorComercial(true)
                setBtnColorSemiComercial(false)
                changePropertyHandler(5)
                break;
            case 3:
                setBtnColorResidentiol(false)
                setBtnColorComercial(false)
                setBtnColorSemiComercial(true)
                changePropertyHandler(9)

                break;
            default:
                break;
        }
    }

    const changePropertyHandler = (id) => {
        // console.log("id", id)
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
                setSizeType("Marla")
                setValue("Marla")
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
                setSizeType("Sq.Ft.")
                setValue("Sq.Ft.")
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
                setSizeType("Marla")
                setValue("Marla")
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
                setSizeType("Marla")
                setValue("Marla")
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
                setSizeType("Marla")
                setValue("Marla")
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
                setSizeType("Marla")
                setValue("Marla")
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
                setSizeType("Marla")
                setValue("Marla")
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
                setSizeType("Marla")
                setValue("Marla")
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
                setSizeType("Marla")
                setValue("Marla")
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
                setSizeType("Marla")
                setValue("Marla")
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
                setSizeType("Marla")
                setValue("Marla")
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
                setSizeType("Marla")
                setValue("Marla")
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
                setSizeType("Marla")
                setValue("Marla")
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
                setSizeType("Marla")
                setValue("Marla")
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
                setSizeType("Marla")
                setValue("Marla")
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
                setSizeType("Marla")
                setValue("Marla")
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
                setSizeType("Sq.Ft.")
                setValue("Sq.Ft.")
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

                setFiles(true)
                setSaleType(true)
                setLetType(false)
                setSizeType("Marla")
                setValue("Marla")
                break;

        }
    }

    const changeUnitHandler = (id) => {
        // console.log("unitID", id)
        switch (id) {
            case 1:
                setDoubleUnit(true)
                setSingleUnit(false)
                setOtherUnit(false)
                break;
            case 2:
                setDoubleUnit(false)
                setSingleUnit(true)
                setOtherUnit(false)
                break;
            case 3:
                setDoubleUnit(false)
                setSingleUnit(false)
                setOtherUnit(true)
                break
        }
    }

    const changeFloorHandler = (id) => {
        // console.log("floorID", id)
        switch (id) {
            case 1:
                setAnyFloor(true)
                setBasementFloor(false)
                setFirstFloor(false)
                setSecondFloor(false)
                setCompleteFloor(false)
                break;
            case 2:
                setAnyFloor(false)
                setBasementFloor(true)
                setFirstFloor(false)
                setSecondFloor(false)
                setCompleteFloor(false)
                break;
            case 3:
                setAnyFloor(false)
                setBasementFloor(false)
                setFirstFloor(true)
                setSecondFloor(false)
                setCompleteFloor(false)
                break;
            case 4:
                setAnyFloor(false)
                setBasementFloor(false)
                setFirstFloor(false)
                setSecondFloor(true)
                setCompleteFloor(false)
                break;
            case 5:
                setAnyFloor(false)
                setBasementFloor(false)
                setFirstFloor(false)
                setSecondFloor(false)
                setCompleteFloor(true)
                break;
        }
    }

    const OnchangePickerSeletedHandler = (value, index) => {
        setValue(value)
        if (flatProperty == true || flatsProperty == true) {
            setSizeType(apartmentAreaData[index].name)
        }
        else {
            setSizeType(AreaData[index].name)
        }

        // setSelectCountry(country[index].name)
    }

    useEffect(() => {
        getID()
    }, [])

    // var cityName

    const getID = async () => {
        var data = await AsyncStorage.getItem("@areas");
        var city = await AsyncStorage.getItem("@city");
        var country = await AsyncStorage.getItem("@country");
        // console.log(data)
        setCityName(city)
        setCountry(country)
        data = data.replace(/'/g, '"');
        data = JSON.parse(data);
        // console.log(typeof data)
        // console.log(data)
        // setData(data)
        setSocietyData(data)
        // console.log("id===>>", data)

    }
    // console.log("=>>>>>>",cityName)
    // console.log("society===>>", typeof societyData)

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

    const addressModalHandler = () => {
        setAddressModalOpen(false)
        setHouseName("")
        setSocietyName("")
    }

    const fileAddressModalHandler = () => {
        setFileAddressModal(false)
        setHouseName("")
        setSocietyName("")
    }

    const adrressModalContinueHandler = () => {
        if (houseName && societyName) {
            setAddressModalOpen(false)
        }
        else {
            Alert.alert("Please fill all fields")
        }
    }

    const filterModalContinueHandler = () => {
        if (societyName) {
            setFileAddressModal(false)
        } else {
            Alert.alert("Please Enter Society Name")
        }
    }
    console.log(">>>>>>>>>>>>>>>>>>>>>>>>>", sizeType)
    const addInventoryHandler = async () => {
        const username_regux = /^[a-zA-Z\s]*$/;
        if (username_regux.test(sellerName) == false) {
            setNameError("Seller Name Should Contain Only Alphabets")
            NameFocus.current.focus()
            setLoading(false)
            return true
        }

        if (sellerName.length > 25) {
            setNameError("Seller Name should have 25 characters max.")
            NameFocus.current.focus()
            setLoading(false)
            return true
        }
        if (mobile.length > 15) {
            setMobileError("Seller Mobile number should have 15 characters max.")
            mobileFocus.current.focus()
            setLoading(false)
            return true
        }
        if (parseInt(demand) <= 0) {
            Alert.alert("Please enter valid demand")
            setLoading(false)
            return true
        }
        setLoading(true)
        const imageUrl = await uploadImage();
        // console.log("data Uploading....")
        //setLoading(true)
        if (demand && demand !== "" && size && size !== "" && houseName !== "" && societyName !== "" && sellerName !== "" && mobile !== "") {
            try {
                firestore()
                    .collection('Inventory')
                    .add({
                        user_id: user.uid,
                        houseName: houseName != "" ? houseName.trim() : "",
                        country: country,
                        cityName: cityName,
                        societyName: societyName,
                        transactionType: saleType ? "Sale" : "Let",
                        catagory: btnColorResidentiol ? 'Residential' : btnColorComercial ? 'Commercial' : 'Semi Commercial',
                        propertyType: houseProperty ? 'House' : flatProperty ? 'Flat' : farmHouseProperty ? 'Farm House' : pentHouseProperty ? 'Pent House' : officeProperty ? 'Office' : shopProperty ? 'Shop' : buildingProperty ? 'Building' : factoryProperty ? 'Factory' : housesProperty ? 'House' : plotsProperty ? 'Plot' : shopsProperty ? 'Shop' : officesProperty ? 'Office' : agricultureProperty ? 'Agriculture' : farmHousesProperty ? 'Farm House' : pentHopusesProperty ? 'Pent House' : buildingsProperty ? 'Building' : files ? 'Files' : 'Flat',
                        unitType: otherUnit ? 'Other' : doubleUnit ? 'Double' : 'Single',
                        floorType: anyFloor ? 'Any' : basementFloor ? 'Basement' : completeFloor ? 'Complete' : firstFloor ? 'First Floor' : secondFloor ? 'Second Floor' : '',
                        propertyImg: imageUrl ? imageUrl : null,
                        demand: demand,
                        size: size,
                        sellerName:sellerName,
                        sellerMobile:mobile,
                        sizeType: sizeType,
                        longitude: longitude,
                        latitude: latitude,
                        rooms: {
                            bedrooms: bedrooms,
                            bathrooms: bathrooms,
                            kitchen: kitchen,
                            garage: garage
                        },
                        facilities: {
                            gas: gasFacilities, //gas
                            facingPark: facingParkFacilities, //facing park
                            mainRoad: mainRoadFacilities, //mainRoad
                            corner: cornerFacilities, //corner
                            gated: gatedFacilities, //gated
                            ownerBuild: ownerBuildFacilities //owner built
                        },
                        description: description.trim(),
                        timestamp: firestore.Timestamp.fromDate(new Date()),
                        viewStatus: "Matched",
                        deal: false,
                        isLead: false,
                        toMarketplace: false,
                        businessID: type == "own" ? businessID : user.uid,
                        role: type,
                        name: user.displayName
                    })
                    .then(() => {
                        setLoading(false)
                        navigation.pop(1)
                    })

            } catch (err) {
                console.log(err)
                setLoading(false)
            }
        } else {
            Alert.alert(
                "Notice",
                "Please fill all fields first ..."
            )
            setLoading(false)
        }
    }

    const addSocietyHandler = async () => {
        setLoading(true)
        try {
            firestore()
                .collection('Societies')
                .add({
                    user_id: user.uid,
                    societyName: societyName
                })
                .then(() => {
                    setLoading(false)

                })
        } catch (error) {
            console.log(err)
            setLoading(false)
        }
    }

    const getFilesAreas = async () => {
        setLoading(true)
        const userID = user.uid
        const response = await SocietyAPI.getFileSocieties(userID)
        if (response && response.length > 0) {
            setFileAreas(response)
            setLoading(false)
        } else {
            setLoading(false)
        }
    }

    const resetAllHandler = () => {
        setLocation('')
        setDemand('')
        setSize('')
        setPropertyName('')
        setimageUri('')
        setSocietyName('')
        setHouseName('')

        setBedrooms(0)
        setBathrooms(0)
        setKitchen(0)
        setGarage(0)

        setGasFacilities(false)
        setFacingParkFacilities(true)
        setMainRoadFacilities(false)
        setCornerFacilities(false)
        setGatedFacilities(false)
        setOwnerBuildFacilities(false)

        setDescription('')
    }

    const closeInventoryModalHandler = () => {
        setAlertModal(!alertModal)
    }

    // Focus to add , in Input text at running Time
    const LostFocus = (e) => {
        setDemand(e.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ","))
        // setDemand(e.toLocaleString())
        console.log("numeric value", demand)
    }

    const getFocus = (e) => {
        setDemand(e.replace(/,/g, ""))
        // setDemand(e.toLocaleString())
        console.log("numeric value", demand)
    }


    const [actualPrice, setActualPrice] = useState(" Price must contain numbers only")
    const ChangePrice = (e) => {
        var regex = /^[0-9]+$/;
        setDemand(e)
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


    // handle validate of lead name
    const validateName = (text) => {
        setSellerName(text)
        setNameError("")
    }
    // handle validate Mobile Number
    const validateMobileNumber = (text) => {
        setMobile(text.trim())
        setMobileError("")
    }
    return (
        <View style={styles.screen}>
            {
                loading ?
                    <Spinner visible={true} />
                    :
                    null
            }
            <View style={styles.header}>
                <TouchableOpacity style={styles.headerIconContainer} onPress={() => navigation.pop()}>
                    <Icon
                        name='chevron-back-outline'
                        color="black"
                        size={25}
                    />
                </TouchableOpacity>
                <View>
                    <Text style={styles.headerText}>Add New Inventory</Text>
                </View>
                <Image
                    style={{ width: 30, height: 30, borderRadius: 50 }} resizeMode='contain'
                    //source={user.photoURL}
                    source={{ uri: user.photoURL }}
                />
                {/* <Icon
                    color="#917AFD"
                    size={30}
                    name='person-circle-sharp'
                /> */}
            </View>

            <ScrollView keyboardShouldPersistTaps="always" style={styles.body} showsVerticalScrollIndicator={false}>

                {/* Image  */}
                <View style={{ width: "95%", alignItems: "center", justifyContent: "center", alignSelf: 'center', flexDirection: 'row' }}>
                    <TouchableOpacity
                        style={{ width: 90, height: 90, justifyContent: "center", alignItems: "center", borderColor: "#6F54F0", borderWidth: 1, backgroundColor: 'white', marginBottom: 10 }}
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
                    {/* <Text style={{ color: 'red', alignSelf: 'flex-start', marginLeft: 5 }}>*</Text> */}
                </View>

                {/* Seller Name */}
                <Text style={styles.heading}>
                   Seller Name
                    <Text style={{ color: 'red' }}> *</Text>
                </Text>
                <TextInput
                    ref={NameFocus}
                    style={styles.inputStyle}
                    placeholder='Enter Seller Name'
                    placeholderTextColor={"#A1A1A1"}
                    value={sellerName}
                    onChangeText={(value) => validateName(value)}
                />
                {
                    nameError != "" ?
                        <Text style={styles.errorStyle}>{nameError}</Text>
                        : null
                }

                {/* Phone Number */}
                <Text style={[styles.heading, { marginTop: 8 }]}>
                    Mobile Number
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

                {/* Transaction */}
                <View style={{...transactionStyles.container,marginTop:15}}>
                    <Text style={transactionStyles.heading}>Transaction Type</Text>
                    <TouchableOpacity style={transactionStyles.resetContainer} onPress={resetAllHandler}>
                        <Icon
                            name='reload'
                            color="#917AFD"
                            size={16}
                        />
                        <Text style={transactionStyles.resetText}>
                            Reset all
                        </Text>
                    </TouchableOpacity>
                </View>

                {/* <View style={styles.demandContainer}>
                    <TextInput
                        placeholder='Type title here...'
                        placeholderTextColor="#1A1E25"
                        style={styles.demandInput}
                        keyboardType='default'
                        value={propertyName}
                        onChangeText={(value) => setPropertyName(value)}
                    />
                </View>
                <View style={{ borderColor: '#E2E2E2', borderWidth: 1, marginVertical: 10 }} /> */}

                {/* Transaction Type */}

                <View style={transactionStyles.typeContainer}>
                    <TouchableOpacity
                        style={[transactionStyles.type, { backgroundColor: saleType ? '#917AFD' : '#F2F2F3' }]}
                        onPress={() => changeTransactionHandler(1)}
                    >
                        <Text style={[transactionStyles.typeText, { color: saleType ? 'white' : '#7D7F88' }]}>For Sale</Text>
                    </TouchableOpacity>
                    {
                        files ?
                            null
                            :
                            <TouchableOpacity
                                style={[transactionStyles.type, { backgroundColor: letType ? '#917AFD' : '#F2F2F3' }]}
                                onPress={() => changeTransactionHandler(2)}
                            >
                                <Text style={[transactionStyles.typeText, { color: letType ? 'white' : '#7D7F88' }]}>To Let</Text>
                            </TouchableOpacity>
                    }

                </View>
                <View style={{ borderColor: '#E2E2E2', borderWidth: 1, marginVertical: 10 }} />

                {/* Find your place */}
                {/* <Text style={styles.heading}>
                    Find your place in
                </Text>
                <TouchableOpacity onPress={() => setModalOpen(true)}>
                    <View style={styles.placeFindContainer}>
                        <Icon
                            name='location'
                            color="#917AFD"
                            size={25}
                            style={{ marginLeft: 5 }}
                        />
                        <Text style={{ flex: 1, marginLeft: 5, color: '#1A1E25', }}>{location}</Text>
                        <Icon
                            name='search'
                            color="#1A1E25"
                            size={22}
                            style={{ marginRight: 10 }}
                        />
                    </View>
                </TouchableOpacity> */}


                {/* <View style={{ borderColor: '#E2E2E2', borderWidth: 1, marginVertical: 10 }} /> */}

                {/* <View style={{ borderColor: '#E2E2E2', borderWidth: 1, marginVertical: 10 }} /> */}
                {/* <GooglePlaces /> */}

                {/* Catagory Type */}
                <Text style={styles.heading}>Category</Text>
                <View style={propertyStyles.containerCatagory}>
                    <TouchableOpacity onPress={() => CategoryHandler(1)}
                        style={[propertyStyles.typeContainercatagory, { backgroundColor: btnColorResidentiol ? '#826AF7' : '#F2F2F3' }]}>
                        <Text style={[propertyStyles.typecategory, { color: btnColorResidentiol ? '#FFFFFF' : '#7D7F88', }]}>Residential</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => CategoryHandler(2)}
                        style={[propertyStyles.typeContainercatagory, { backgroundColor: btnColorComercial ? '#826AF7' : '#F2F2F3' }]}>
                        <Text style={[propertyStyles.typecategory, { color: btnColorComercial ? '#FFFFFF' : '#7D7F88', }]}>Commercial</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => CategoryHandler(3)}
                        style={[propertyStyles.typeContainercatagory, { backgroundColor: btnColorSemiComercial ? '#826AF7' : '#F2F2F3' }]}>
                        <Text style={[propertyStyles.typecategory, { color: btnColorSemiComercial ? '#FFFFFF' : '#7D7F88', }]}>Semi Commercial</Text>
                    </TouchableOpacity>
                </View>
                <View style={{ borderColor: '#E2E2E2', borderWidth: 1, marginVertical: 10 }} />

                {/* Property Type */}
                <Text style={styles.heading}>
                    Property type
                </Text>
                {
                    btnColorResidentiol == true && btnColorComercial == false && btnColorSemiComercial == false ?
                        <ScrollView
                            horizontal={true}
                            showsHorizontalScrollIndicator={false}
                            contentContainerStyle={propertyStyles.container}>
                            <TouchableOpacity style={[propertyStyles.typeContainer, { backgroundColor: plotsProperty ? '#917AFD' : '#F2F2F3' }]} onPress={() => changePropertyHandler(10)}>
                                <Text style={[propertyStyles.type, { color: plotsProperty ? 'white' : '#7D7F88' }]}>Plot</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={[propertyStyles.typeContainer, { backgroundColor: houseProperty ? '#917AFD' : '#F2F2F3' }]} onPress={() => changePropertyHandler(1)}>
                                <Text style={[propertyStyles.type, { color: houseProperty ? 'white' : '#7D7F88' }]}>House</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={[propertyStyles.typeContainer, { backgroundColor: flatProperty ? '#917AFD' : '#F2F2F3' }]} onPress={() => changePropertyHandler(2)}>
                                <Text style={[propertyStyles.type, { color: flatProperty ? 'white' : '#7D7F88' }]}>Apartment</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={[propertyStyles.typeContainer, , { backgroundColor: files ? '#917AFD' : '#F2F2F3' }]} onPress={() => changePropertyHandler(18)}>
                                <Text style={[propertyStyles.type, { color: files ? 'white' : '#7D7F88' }]}>Files</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={[propertyStyles.typeContainer, { backgroundColor: farmHouseProperty ? '#917AFD' : '#F2F2F3' }]} onPress={() => changePropertyHandler(3)}>
                                <Text style={[propertyStyles.type, { color: farmHouseProperty ? 'white' : '#7D7F88' }]}>Farm House</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={[propertyStyles.typeContainer, , { backgroundColor: pentHouseProperty ? '#917AFD' : '#F2F2F3' }]} onPress={() => changePropertyHandler(4)}>
                                <Text style={[propertyStyles.type, { color: pentHouseProperty ? 'white' : '#7D7F88' }]}>Pent House</Text>
                            </TouchableOpacity>

                        </ScrollView>
                        :
                        btnColorComercial === true && btnColorResidentiol == false && btnColorSemiComercial == false ?
                            <ScrollView
                                horizontal={true}
                                showsHorizontalScrollIndicator={false}
                                contentContainerStyle={propertyStyles.container}>
                                <TouchableOpacity style={[propertyStyles.typeContainer, { backgroundColor: plotsProperty ? '#917AFD' : '#F2F2F3' }]} onPress={() => changePropertyHandler(10)}>
                                    <Text style={[propertyStyles.type, { color: plotsProperty ? 'white' : '#7D7F88' }]}>Plot</Text>
                                </TouchableOpacity>

                                <TouchableOpacity style={[propertyStyles.typeContainer, { backgroundColor: officeProperty ? '#917AFD' : '#F2F2F3' }]} onPress={() => changePropertyHandler(5)}>
                                    <Text style={[propertyStyles.type, { color: officeProperty ? 'white' : '#7D7F88' }]}>Office</Text>
                                </TouchableOpacity>
                                <TouchableOpacity style={[propertyStyles.typeContainer, { backgroundColor: shopProperty ? '#917AFD' : '#F2F2F3' }]} onPress={() => changePropertyHandler(6)}>
                                    <Text style={[propertyStyles.type, { color: shopProperty ? 'white' : '#7D7F88' }]}>Shop</Text>
                                </TouchableOpacity>
                                <TouchableOpacity style={[propertyStyles.typeContainer, , { backgroundColor: files ? '#917AFD' : '#F2F2F3' }]} onPress={() => changePropertyHandler(18)}>
                                    <Text style={[propertyStyles.type, { color: files ? 'white' : '#7D7F88' }]}>Files</Text>
                                </TouchableOpacity>
                                <TouchableOpacity style={[propertyStyles.typeContainer, { backgroundColor: buildingProperty ? '#917AFD' : '#F2F2F3' }]} onPress={() => changePropertyHandler(7)}>
                                    <Text style={[propertyStyles.type, { color: buildingProperty ? 'white' : '#7D7F88' }]}>Building</Text>
                                </TouchableOpacity>
                                <TouchableOpacity style={[propertyStyles.typeContainer, , { backgroundColor: factoryProperty ? '#917AFD' : '#F2F2F3' }]} onPress={() => changePropertyHandler(8)}>
                                    <Text style={[propertyStyles.type, { color: factoryProperty ? 'white' : '#7D7F88' }]}>Factory</Text>
                                </TouchableOpacity>

                            </ScrollView>
                            :
                            btnColorComercial === false && btnColorResidentiol == false && btnColorSemiComercial == true ?
                                <ScrollView
                                    horizontal={true}
                                    showsHorizontalScrollIndicator={false}
                                    contentContainerStyle={propertyStyles.container}>
                                    <TouchableOpacity style={[propertyStyles.typeContainer, { backgroundColor: housesProperty ? '#917AFD' : '#F2F2F3' }]} onPress={() => changePropertyHandler(9)}>
                                        <Text style={[propertyStyles.type, { color: housesProperty ? 'white' : '#7D7F88' }]}>House</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity style={[propertyStyles.typeContainer, { backgroundColor: plotsProperty ? '#917AFD' : '#F2F2F3' }]} onPress={() => changePropertyHandler(10)}>
                                        <Text style={[propertyStyles.type, { color: plotsProperty ? 'white' : '#7D7F88' }]}>Plot</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity style={[propertyStyles.typeContainer, { backgroundColor: shopsProperty ? '#917AFD' : '#F2F2F3' }]} onPress={() => changePropertyHandler(11)}>
                                        <Text style={[propertyStyles.type, { color: shopsProperty ? 'white' : '#7D7F88' }]}>Shop</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity style={[propertyStyles.typeContainer, , { backgroundColor: files ? '#917AFD' : '#F2F2F3' }]} onPress={() => changePropertyHandler(18)}>
                                        <Text style={[propertyStyles.type, { color: files ? 'white' : '#7D7F88' }]}>Files</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity style={[propertyStyles.typeContainer, , { backgroundColor: officesProperty ? '#917AFD' : '#F2F2F3' }]} onPress={() => changePropertyHandler(12)}>
                                        <Text style={[propertyStyles.type, { color: officesProperty ? 'white' : '#7D7F88' }]}>Office</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity style={[propertyStyles.typeContainer, { backgroundColor: agricultureProperty ? '#917AFD' : '#F2F2F3' }]} onPress={() => changePropertyHandler(13)}>
                                        <Text style={[propertyStyles.type, { color: agricultureProperty ? 'white' : '#7D7F88' }]}>Agriculture</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity style={[propertyStyles.typeContainer, { backgroundColor: farmHousesProperty ? '#917AFD' : '#F2F2F3' }]} onPress={() => changePropertyHandler(14)}>
                                        <Text style={[propertyStyles.type, { color: farmHousesProperty ? 'white' : '#7D7F88' }]}>Farm House</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity style={[propertyStyles.typeContainer, { backgroundColor: pentHopusesProperty ? '#917AFD' : '#F2F2F3' }]} onPress={() => changePropertyHandler(15)}>
                                        <Text style={[propertyStyles.type, { color: pentHopusesProperty ? 'white' : '#7D7F88' }]}>Pent House</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity style={[propertyStyles.typeContainer, , { backgroundColor: buildingsProperty ? '#917AFD' : '#F2F2F3' }]} onPress={() => changePropertyHandler(16)}>
                                        <Text style={[propertyStyles.type, { color: buildingsProperty ? 'white' : '#7D7F88' }]}>Building</Text>
                                    </TouchableOpacity>

                                    <TouchableOpacity style={[propertyStyles.typeContainer, , { backgroundColor: flatsProperty ? '#917AFD' : '#F2F2F3' }]} onPress={() => changePropertyHandler(17)}>
                                        <Text style={[propertyStyles.type, { color: flatsProperty ? 'white' : '#7D7F88' }]}>Apartment</Text>
                                    </TouchableOpacity>

                                </ScrollView>
                                : null
                }
                {/* </>
                        :
                        null
                } */}
                <View style={{ borderColor: '#E2E2E2', borderWidth: 1, marginVertical: 10 }} />

                {/* Unit */}
                {
                    houseProperty || housesProperty ?
                        <>
                            <Text style={styles.heading}>
                                Unit
                            </Text>
                            <View style={unitStyles.container}>
                                <TouchableOpacity style={[unitStyles.unitContainer, , { backgroundColor: singleUnit ? '#917AFD' : '#F2F2F3' }]} onPress={() => changeUnitHandler(2)}>
                                    <Text style={[unitStyles.unit, { color: singleUnit ? 'white' : '#7D7F88' }]}>Single</Text>
                                </TouchableOpacity>
                                <TouchableOpacity style={[unitStyles.unitContainer, , { backgroundColor: doubleUnit ? '#917AFD' : '#F2F2F3' }]} onPress={() => changeUnitHandler(1)}>
                                    <Text style={[unitStyles.unit, { color: doubleUnit ? 'white' : '#7D7F88' }]}>Double</Text>
                                </TouchableOpacity>
                                <TouchableOpacity style={[unitStyles.unitContainer, , { backgroundColor: otherUnit ? '#917AFD' : '#F2F2F3' }]} onPress={() => changeUnitHandler(3)}>
                                    <Text style={[unitStyles.unit, { color: otherUnit ? 'white' : '#7D7F88' }]}>Other</Text>
                                </TouchableOpacity>
                            </View>
                            <View style={{ borderColor: '#E2E2E2', borderWidth: 1, marginVertical: 10 }} />
                        </>
                        : null
                }

                <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                    <Text style={styles.heading}>
                        Address
                        <Text style={{ color: 'red' }}> *</Text>
                    </Text>
                    {
                        houseName && societyName ?
                            // files ?
                            //     <TouchableOpacity
                            //         style={{ width: '40%', alignItems: 'flex-end' }}
                            //         onPress={() => setFileAddressModal(true)}
                            //     >
                            //         <Icons
                            //             name='pencil-outline'
                            //             size={25}
                            //             color="black"
                            //         />
                            //     </TouchableOpacity>
                            //     :
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
                    houseName && societyName ?
                        <Text style={transactionStyles.houseText}>
                            {houseName + ", " + societyName + ", " + cityName}
                        </Text>
                        :
                        // files ?
                        //     <TouchableOpacity onPress={() => setFileAddressModal(true)}>
                        //         <View style={styles.placeFindContainer}>
                        //             <Icon
                        //                 name='location'
                        //                 color="#917AFD"
                        //                 size={25}
                        //                 style={{ marginLeft: 5 }}
                        //             />
                        //             <Text style={{ flex: 1, marginLeft: 5, color: '#1A1E25', }}>Enter Address</Text>
                        //             <Icon
                        //                 name='search'
                        //                 color="#1A1E25"
                        //                 size={22}
                        //                 style={{ marginRight: 10 }}
                        //             />
                        //         </View>
                        //     </TouchableOpacity>
                        //     :
                        <TouchableOpacity onPress={() => setAddressModalOpen(true)}>
                            <View style={styles.placeFindContainer}>
                                <Icon
                                    name='location'
                                    color="#917AFD"
                                    size={25}
                                    style={{ marginLeft: 5 }}
                                />
                                <Text style={{ flex: 1, marginLeft: 5, color: '#1A1E25', }}>Enter Address</Text>
                                <Icon
                                    name='search'
                                    color="#1A1E25"
                                    size={22}
                                    style={{ marginRight: 10 }}
                                />
                            </View>
                        </TouchableOpacity>
                }



                {/* Floor to Rent */}
                {
                    saleType === false ?
                        <>
                            <Text style={styles.heading}>
                                Floor For Rent
                            </Text>
                            <ScrollView
                                horizontal={true}
                                showsHorizontalScrollIndicator={false}
                                contentContainerStyle={propertyStyles.container}
                            >
                                <TouchableOpacity style={[propertyStyles.typeContainer, { marginRight: 10, backgroundColor: anyFloor ? '#917AFD' : '#F2F2F3' }]} onPress={() => changeFloorHandler(1)}>
                                    <Text style={[propertyStyles.type, { color: anyFloor ? 'white' : '#7D7F88' }]}>Any</Text>
                                </TouchableOpacity>
                                <TouchableOpacity style={[propertyStyles.typeContainer, { marginHorizontal: 10, backgroundColor: basementFloor ? '#917AFD' : '#F2F2F3' }]} onPress={() => changeFloorHandler(2)}>
                                    <Text style={[propertyStyles.type, { color: basementFloor ? 'white' : '#7D7F88' }]}>Basement</Text>
                                </TouchableOpacity>
                                <TouchableOpacity style={[propertyStyles.typeContainer, { marginHorizontal: 10, backgroundColor: firstFloor ? '#917AFD' : '#F2F2F3' }]} onPress={() => changeFloorHandler(3)}>
                                    <Text style={[propertyStyles.type, { color: firstFloor ? 'white' : '#7D7F88' }]}>1st</Text>
                                </TouchableOpacity>
                                <TouchableOpacity style={[propertyStyles.typeContainer, , { marginHorizontal: 10, backgroundColor: secondFloor ? '#917AFD' : '#F2F2F3' }]} onPress={() => changeFloorHandler(4)}>
                                    <Text style={[propertyStyles.type, { color: secondFloor ? 'white' : '#7D7F88' }]}>2nd</Text>
                                </TouchableOpacity>
                                <TouchableOpacity style={[propertyStyles.typeContainer, , { marginLeft: 5, backgroundColor: completeFloor ? '#917AFD' : '#F2F2F3' }]} onPress={() => changeFloorHandler(5)}>
                                    <Text style={[propertyStyles.type, { color: completeFloor ? 'white' : '#7D7F88' }]}>Complete</Text>
                                </TouchableOpacity>
                            </ScrollView>
                            <View style={{ borderColor: '#E2E2E2', borderWidth: 1, marginVertical: 10 }} />
                        </>
                        :
                        null
                }

                {/* Area */}
                <Text style={[styles.heading, { marginTop: 25 }]}>
                    Size (Area)
                    <Text style={{ color: 'red' }}> *</Text>
                </Text>
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
                                    itemStyle={{ color: "white", alignItems: 'center' }}
                                >
                                    {
                                        AreaData.map((item, index) => {
                                            return (
                                                <Picker.Item label={item.name} value={item.id} style={{ alignSelf: 'center' }} />
                                            )
                                        })
                                    }
                                </Picker>
                            </View>
                    }

                </View>

                <View style={{ borderColor: '#E2E2E2', borderWidth: 1, marginVertical: 10 }} />


                {/* Rooms and beds */}
                {
                    shopProperty || plotsProperty || shopsProperty || files || agricultureProperty == true ? null :
                        <View>
                            <Text style={styles.heading}>
                                Rooms and beds
                            </Text>
                        </View>


                }
                {
                    shopProperty || plotsProperty || shopsProperty || agricultureProperty || files == true ?
                        null
                        :
                        <>
                            <View style={roomStyles.container}>
                                <Text style={roomStyles.containerHeading}>Bedrooms</Text>
                                <View style={roomStyles.countContainer}>
                                    <TouchableOpacity onPress={() => { setBedrooms(prev => prev - 1) }} disabled={bedrooms < 1 ? true : false}>
                                        <Icons
                                            name='minus-circle-outline'
                                            color={bedrooms < 1 ? '#BABCBF' : "#1A1E25"}
                                            size={25}
                                        />
                                    </TouchableOpacity>
                                    <Text style={roomStyles.count}>
                                        {bedrooms}
                                    </Text>
                                    <TouchableOpacity onPress={() => { setBedrooms(prev => prev + 1) }}>
                                        <Icons
                                            name='plus-circle-outline'
                                            color="#1A1E25"
                                            size={25}
                                        />
                                    </TouchableOpacity>

                                </View>
                            </View>
                            <View style={roomStyles.container}>
                                <Text style={roomStyles.containerHeading}>Bathrooms</Text>
                                <View style={roomStyles.countContainer}>
                                    <TouchableOpacity onPress={() => { setBathrooms(prev => prev - 1) }} disabled={bathrooms < 1 ? true : false}>
                                        <Icons
                                            name='minus-circle-outline'
                                            color={bathrooms < 1 ? '#BABCBF' : "#1A1E25"}
                                            size={25}
                                        />
                                    </TouchableOpacity>
                                    <Text style={roomStyles.count}>
                                        {bathrooms}
                                    </Text>
                                    <TouchableOpacity onPress={() => { setBathrooms(prev => prev + 1) }}>
                                        <Icons
                                            name='plus-circle-outline'
                                            color="#1A1E25"
                                            size={25}
                                        />
                                    </TouchableOpacity>
                                </View>
                            </View>
                            {/* <View style={roomStyles.container}>
                                <Text style={roomStyles.containerHeading}>Kitchen</Text>
                                <View style={roomStyles.countContainer}>
                                    <TouchableOpacity onPress={() => { setKitchen(prev => prev - 1) }} disabled={kitchen < 1 ? true : false}>
                                        <Icons
                                            name='minus-circle-outline'
                                            color={kitchen < 1 ? '#BABCBF' : "#1A1E25"}
                                            size={25}
                                        />
                                    </TouchableOpacity>
                                    <Text style={roomStyles.count}>
                                        {kitchen}
                                    </Text>
                                    <TouchableOpacity onPress={() => { setKitchen(prev => prev + 1) }}>
                                        <Icons
                                            name='plus-circle-outline'
                                            color="#1A1E25"
                                            size={25}
                                        />
                                    </TouchableOpacity>
                                </View>
                            </View>
                            <View style={roomStyles.container}>
                                <Text style={roomStyles.containerHeading}>Garage</Text>
                                <View style={roomStyles.countContainer}>
                                    <TouchableOpacity onPress={() => { setGarage(prev => prev - 1) }} disabled={garage < 1 ? true : false}>
                                        <Icons
                                            name='minus-circle-outline'
                                            color={garage < 1 ? '#BABCBF' : "#1A1E25"}
                                            size={25}
                                        />
                                    </TouchableOpacity>
                                    <Text style={roomStyles.count}>
                                        {garage}
                                    </Text>
                                    <TouchableOpacity onPress={() => { setGarage(prev => prev + 1) }}>
                                        <Icons
                                            name='plus-circle-outline'
                                            color="#1A1E25"
                                            size={25}
                                        />
                                    </TouchableOpacity>
                                </View>
                            </View> */}
                            <View style={{ borderColor: '#E2E2E2', borderWidth: 1, marginVertical: 15 }} />
                        </>
                }


                {/* Property Facilities */}
                <Text style={styles.heading}>
                    Property Facilities
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

                {/* Demand */}
                <Text style={styles.heading}>
                    Demand
                    <Text style={{ color: 'red' }}> *</Text>
                </Text>
                {
                    letType ?
                        <View style={styles.demandContainer}>
                            <TextInput
                                placeholder='Type demand here...'
                                placeholderTextColor="#1A1E25"
                                style={[styles.demandInput, { width: '60%' }]}
                                // onBlur={() =>  LostFocus(demand)}
                                keyboardType='numeric'


                                value={demand}
                                onChangeText={(val) => ChangePrice(val)}
                            />
                            <Text style={{ color: '#6C51EE', fontFamily: 'Lato', fontWeight: '600', fontSize: 16, marginRight: 5 }}>PKR Per/Month</Text>
                        </View>
                        :
                        <View style={styles.demandContainer}>
                            <TextInput
                                placeholder='Type demand here...'
                                placeholderTextColor="#1A1E25"
                                style={[styles.demandInput, { width: '70%' }]}
                                keyboardType='numeric'
                                value={demand}
                                onChangeText={(val) => ChangePrice(val)}
                            />
                            <Text style={{ color: '#6C51EE', fontFamily: 'Lato', fontWeight: '600', fontSize: 16, marginRight: 10 }}>PKR</Text>
                        </View>
                }

                {
                    actualPrice == "Demand must contain numbers only" ?
                        <Text style={{ marginTop: 5, marginLeft: 5 }}>Price must contain numbers only</Text>
                        :
                        <Text style={{ marginTop: 5, marginLeft: 5 }} >{demand.length == 4 ? demand.charAt(0) : demand.length == 5 ? demand.slice(0, 2) : demand.length == 6 ? demand.charAt(0) + "  Lakh and " + demand.slice(1, 3) : demand.length == 7 ? demand.slice(0, 2) + "  Lakh and " + demand.slice(2, 4) : demand.length == 8 ? demand.charAt(0) + "  Crore  " + demand.slice(1, 3) + "  Lakh and  " + demand.slice(3, 5) : demand.length == 9 ? demand.slice(0, 2) + "  Crore  " + demand.slice(2, 4) + "  Lakh and  " + demand.slice(4, 6) : demand.length == 10 ? demand.charAt(0) + "  Arab  " + demand.slice(1, 3) + "  Crore  " + demand.slice(3, 5) + "  Lakh and  " + demand.slice(5, 7) : demand.length == 11 ? demand.slice(0, 2) + "  Arab  " + demand.slice(2, 4) + "  Crore  " + demand.slice(4, 6) + "  Lakh and  " + demand.slice(6, 8) : null} {actualPrice}</Text>
                }

                {
                    demand && parseInt(demand) <= 0 ?
                        <Text style={{ color: 'red', fontSize: 10, marginTop: 5 }}>Demand should be greater than zero</Text>
                        : null
                }

                <View style={{ borderColor: '#E2E2E2', borderWidth: 1, marginVertical: 10 }} />

                {/* Description */}
                <Text style={styles.heading}>
                    Description
                </Text>
                <TextInput
                    style={{ borderBottomColor: '#E2E2E2', borderBottomWidth: 1 }}
                    placeholder='Enter Description'
                    placeholderTextColor={"#A1A1A1"}
                    keyboardType="default"
                    multiline
                    numberOfLines={3}
                    value={description}
                    onChangeText={(value) => setDescription(value)}
                />

                <TouchableOpacity style={styles.buttonContainer} onPress={addInventoryHandler}>
                    <Text style={styles.buttonText}>SAVE</Text>
                </TouchableOpacity>


            </ScrollView>

            {/* Model View  */}
            <Modal visible={modalOpen} animationType='slide'>
                <View style={{ flex: 1, backgroundColor: "#ffffff" }}>
                    <TouchableOpacity style={[styles.headerIconContainer, { margin: 10 }]} onPress={() => setModalOpen(false)}>
                        <Icon
                            name='chevron-back-outline'
                            color="black"
                            size={25}
                        />
                    </TouchableOpacity>

                    {/* Location */}
                    <Text style={[styles.heading, { marginLeft: 10, marginTop: 20, marginBottom: 10 }]}>
                        Find your place in
                    </Text>
                    <View style={[styles.placeFindContainer, { width: "95%", marginLeft: "2.5%" }]}>
                        <Icon
                            name='location'
                            color="#917AFD"
                            size={25}
                            style={{ marginLeft: 5 }}
                        />
                        <GooglePlacesAutocomplete
                            placeholder='Lahore, DHA'
                            onPress={(data, details = null) => {
                                setOriginPlace({ data, details });
                                // 'details' is provided when fetchDetails = true
                                // console.log(details.geometry.location.lat);
                                // console.log(details.geometry.location.lng)
                                setlLatitude(details.geometry.location.lat)
                                setLongitude(details.geometry.location.lng)
                                setLocation(data.description)
                                // console.log(data.description)
                                setModalOpen(false)
                            }}
                            enablePoweredByContainer={false}
                            suppressDefaultStyles
                            // currentLocation={true}
                            // currentLocationLabel='Current Location'
                            styles={{
                                textInput: {
                                    flex: 1,
                                    marginLeft: 30,
                                    marginRight: 50,
                                    color: "#000000",
                                    height: 50,
                                },
                                container: {
                                    position: 'absolute',
                                    top: 0,
                                    left: 0,
                                    right: 0,
                                    elevation: 3
                                },
                                listView: {
                                    position: 'absolute',
                                    top: 50,
                                    // backgroundColor: "white",
                                    //elevation:9
                                },
                                separator: {
                                    backgroundColor: '#efefef',
                                    height: 1,
                                }
                            }}

                            fetchDetails
                            query={{
                                key: 'AIzaSyDSlZT_xn6oICMDHlSSALDGRMWePBr2Uck',
                                language: 'en',
                                components: 'country:pk'
                            }}
                            renderRow={(data) =>
                                <PlaceRow data={data} />
                            }
                            // renderDescription={(data)=>
                            //     data.description || data.name 
                            // }
                            renderDescription={(data) =>
                                data.description || data.name + ',  ' + data.vicinity
                            }
                        />
                        <Icon
                            name='search'
                            color="#1A1E25"
                            size={22}
                            style={{ marginRight: 10, marginLeft: 330 }}
                        />
                    </View>
                </View>
            </Modal>

            {/* Modal for Address */}
            <Modal visible={addressModalOpen} animationType='slide' transparent={true}>
                <View style={{ backgroundColor: 'gray', opacity: 0.5, height: '40%' }}></View>
                <View style={{ height: '60%', elevation: 7, backgroundColor: '#ccc' }}>
                    <View style={{
                        flex: 1, backgroundColor: '#fbfcfa', bottom: 0, elevation: 9,
                        left: 0,
                        right: 0,
                        zIndex: 10,
                        borderTopLeftRadius: 20,
                        borderTopRightRadius: 20
                    }}
                    >
                        <ScrollView keyboardShouldPersistTaps="always" contentContainerStyle={{ flexGrow: 1, backgroundColor: '#fbfcfa' }}>
                            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                                <View />
                                <Text style={{ fontSize: 18, color: 'black', alignSelf: 'center', fontWeight: '700' }}>Enter Property Address</Text>
                                <TouchableOpacity style={[styles.closeIconContainer, { margin: 10 }]} onPress={() => addressModalHandler()}>
                                    <Icon
                                        name='close'
                                        color="black"
                                        size={25}
                                    />
                                </TouchableOpacity>
                            </View>

                            <View style={{ width: '90%', alignSelf: 'center', justifyContent: 'space-between', marginTop: 20 }}>
                                <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 15, alignItems: 'center' }}>
                                    <Text style={{ fontSize: 18, color: 'black', fontWeight: '600' }}>City:</Text>
                                    <Text style={{ fontSize: 16, color: 'black', fontWeight: '500' }}>{cityName}</Text>
                                </View>

                                <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 15, alignItems: 'center' }}>
                                    <Text style={{ fontSize: 18, color: 'black', fontWeight: '600' }}>Society: <Text style={{ color: 'red' }}> *</Text></Text>
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
                                    <Icon
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

                                {
                                    files ?
                                        <>
                                            <Text style={{ fontSize: 18, color: 'black', fontWeight: '600', marginVertical: 15 }}>File No. <Text style={{ color: 'red' }}> *</Text></Text>
                                            <View style={[styles.societyContainer, { height: 100 }]}>
                                                <TextInput
                                                    placeholder='Enter file number here...'
                                                    placeholderTextColor="#1A1E25"
                                                    style={styles.demandInput1}
                                                    keyboardType='default'
                                                    multiline
                                                    numberOfLines={3}
                                                    keyboardAppearance="dark"
                                                    value={houseName}
                                                    onChangeText={(text) => setHouseName(text)}
                                                />
                                            </View>
                                        </>
                                        :
                                        <>
                                            <Text style={{ fontSize: 18, color: 'black', fontWeight: '600', marginVertical: 15 }}>Residence: <Text style={{ color: 'red' }}> *</Text></Text>
                                            <View style={[styles.societyContainer, { height: 100 }]}>
                                                <TextInput
                                                    placeholder='Enter house number here...'
                                                    placeholderTextColor="#1A1E25"
                                                    style={styles.demandInput1}
                                                    keyboardType='default'
                                                    multiline
                                                    numberOfLines={3}
                                                    keyboardAppearance="dark"
                                                    value={houseName}
                                                    onChangeText={(text) => setHouseName(text)}
                                                />
                                            </View>
                                        </>
                                }


                                <TouchableOpacity style={styles.continueButton}
                                    onPress={() => adrressModalContinueHandler()}
                                >
                                    <Text style={{ alignSelf: 'center', color: 'white', fontSize: 16, fontWeight: '700' }}>Continue</Text>
                                    {/* <Icons
                                        name='chevron-right'
                                        color="white"
                                        size={20}
                                    /> */}
                                </TouchableOpacity>

                            </View>
                        </ScrollView>
                    </View>
                </View>
            </Modal>

            {/* Modal For Files Address */}
            <Modal visible={fileAddressModal} animationType='slide' transparent={true}>
                <View style={{ backgroundColor: 'gray', opacity: 0.5, height: '40%' }}></View>
                <View style={{ height: '60%', elevation: 7, backgroundColor: '#ccc' }}>
                    <View style={{
                        flex: 1, backgroundColor: '#fbfcfa', bottom: 0, elevation: 9,
                        left: 0,
                        right: 0,
                        zIndex: 10,
                        borderTopLeftRadius: 20,
                        borderTopRightRadius: 20
                    }}
                    >
                        <ScrollView contentContainerStyle={{ flexGrow: 1, backgroundColor: '#fbfcfa' }}>
                            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                                <View />
                                <Text style={{ fontSize: 18, color: 'black', alignSelf: 'center', fontWeight: '700' }}>Enter File Address</Text>
                                <TouchableOpacity style={[styles.closeIconContainer, { margin: 10 }]} onPress={() => fileAddressModalHandler()}>
                                    <Icon
                                        name='close'
                                        color="black"
                                        size={25}
                                    />
                                </TouchableOpacity>
                            </View>
                            <View style={{ width: '90%', alignSelf: 'center', justifyContent: 'space-between', marginTop: 20 }}>
                                <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 15, alignItems: 'center' }}>
                                    <Text style={{ fontSize: 18, color: 'black', fontWeight: '600' }}>City:</Text>
                                    <Text style={{ fontSize: 16, color: 'black', fontWeight: '500' }}>{cityName}</Text>
                                </View>
                                <Text style={{ fontSize: 18, color: 'black', fontWeight: '600', marginVertical: 15 }}>Society:</Text>
                                <View style={styles.societyContainer}>
                                    <TextInput
                                        placeholder='Search society here from file...'
                                        placeholderTextColor="#1A1E25"
                                        style={styles.demandInput1}
                                        keyboardType='default'
                                        value={societyName}
                                        onChangeText={(text) => setSocietyName(text)}
                                    />
                                    <Icon
                                        name='search-outline'
                                        color="#1A1E25"
                                        size={25}
                                        style={{ marginRight: 20 }}
                                    />
                                </View>
                                <Text style={{ fontSize: 18, color: 'black', fontWeight: '600', marginVertical: 15 }}>Residence</Text>
                                <View style={[styles.societyContainer, { height: 100 }]}>
                                    <TextInput
                                        placeholder='Enter house number here...'
                                        placeholderTextColor="#1A1E25"
                                        style={styles.demandInput1}
                                        keyboardType='default'
                                        multiline
                                        numberOfLines={3}
                                        keyboardAppearance="dark"
                                        value={houseName}
                                        onChangeText={(text) => setHouseName(text)}
                                    />
                                </View>
                                <TouchableOpacity style={styles.continueButton}
                                    onPress={() => filterModalContinueHandler()}
                                >
                                    <Text style={{ alignSelf: 'center', color: 'white', fontSize: 16, fontWeight: '700' }}>Continue</Text>
                                    {/* <Icons
                                        name='chevron-right'
                                        color="white"
                                        size={20}
                                    /> */}
                                </TouchableOpacity>
                            </View>
                        </ScrollView>
                    </View>
                </View>
            </Modal>
            {/* Modal for Permissions */}
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
                                <Text style={{ alignSelf: 'center', fontSize: 20, fontWeight: '900', color: 'white', marginTop: 5 }}>Select Image From:</Text>
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
                                    style={userSettingsStyles.cameraBtn}
                                    onPress={() => requestCameraPermission()}
                                >
                                    <Icon
                                        name='camera'
                                        size={30}
                                        color='#674CEC'
                                        style={{ alignSelf: 'center' }}
                                    />
                                </TouchableOpacity>
                                <TouchableOpacity
                                    style={userSettingsStyles.cameraBtn}
                                    onPress={() => requestGalleryPermission()}
                                >
                                    <Icon
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

            {/* Notify Modal */}
            <Modal
                animationType="slide"
                transparent={true}
                visible={alertModal}
                onRequestClose={() => {
                    //Alert.alert('Modal has been closed.');
                    setAlertModal(!alertModal);
                }}
            >
                <AlertModal
                    onPress={() => closeInventoryModalHandler()}
                    body="Inventory Created"
                />
            </Modal>


        </View>
    )
}

const styles = StyleSheet.create({
    screen: {
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
        backgroundColor: '#FDFDFD',
        borderWidth: 0.5,
        borderRadius: 10,
        borderColor: '#E3E3E7',
        width: 34,
        height: 34,
        alignItems: 'center',
        justifyContent: 'center',
        elevation: 7
    },
    headerText: {
        fontFamily: 'Lato',
        fontWeight: '700',
        fontSize: 21,
        color: '#404040'
    },
    body: {
        width: '95%',
        alignSelf: 'center',
        // borderColor:'green',
        // borderWidth:1,
        marginTop: 25,
        // flex: 1
    },
    heading: {
        fontFamily: 'Lato',
        fontWeight: '700',
        fontSize: 16,
        color: 'black',
        marginTop: 2
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
    demandContainer: {
        backgroundColor: '#F2F2F3',
        borderWidth: 0.8,
        borderColor: '#E3E3E7',
        borderRadius: 94,
        alignItems: 'center',
        height: 48,
        marginTop: 15,
        marginBottom: 10,
        flexDirection: 'row',
        justifyContent: 'space-between'
    },
    demandInput: {
        color: '#1A1E25',
        fontSize: 16,
        fontFamily: 'Lato',
        fontWeight: '600',
        alignSelf: 'flex-start',
        marginLeft: 15,
        // lex:1,
        width: '90%',

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
    facilitiesContainer: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 10,
        // width: '65%',
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
    saleButtonContainer: {
        width: '90%',
        alignSelf: 'center',
        // borderColor:'red',
        // borderWidth:1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginVertical: 20,
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
    countryPickerStyle: {
        backgroundColor: "white",
        color: "#7D7F88",
        // alignItems: 'center', 
        justifyContent: 'center',
        // margin: 15, 
        width: '50%',
        borderRadius: 4,
        borderColor: "#BABCBF",
        //marginTop: -20,
        borderWidth: 1,
        // marginBottom: 10,
        elevation: 2,
        height: 35
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
    continueButton: {
        marginTop: '10%',
        width: '100%',
        borderRadius: 15,
        backgroundColor: '#876FF9',
        alignSelf: 'flex-end',
        height: 55,
        alignItems: 'center',
        justifyContent: 'space-evenly',
        flexDirection: 'row',
        elevation: 2
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
    errorStyle: {
        color: 'red',
        // marginBottom: 5,
        fontSize: 10
    },
})

const roomStyles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        marginTop: 15,
        // borderColor:'red',
        // borderWidth:1,
        justifyContent: 'space-between',
        alignItems: 'center'
    },
    containerHeading: {
        color: '#7D7F88',
        fontSize: 16,
        fontFamily: 'Lato',
        fontWeight: '500'
    },
    countContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '35%',
        // borderColor:'green',
        // borderWidth:1
    },
    count: {
        fontFamily: 'SF Pro Text',
        fontWeight: '500',
        fontSize: 16,
        fontStyle: 'normal'
    }
})

const propertyStyles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        // borderColor:'green',
        // borderWidth:1,
        marginTop: 20,
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
        height: 35,
        width: 80,
        marginHorizontal: 5,
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

const unitStyles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        // borderColor:'green',
        // borderWidth:1,
        marginTop: 20,
        width: '98%',
        justifyContent: 'space-between',
        marginBottom: 10
    },
    unitContainer: {
        backgroundColor: '#F2F2F3',
        alignItems: 'center',
        justifyContent: 'center',
        borderColor: '#E3E3E7',
        borderWidth: 0.8,
        borderRadius: 92,
        height: 36,
        width: 106,
        // elevation: 7,
    },
    unit: {
        fontFamily: 'SF Pro Text',
        fontWeight: '400',
        fontSize: 12,
        color: '#7D7F88'
    }
})

const transactionStyles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between'
    },
    heading: {
        fontFamily: 'Lato',
        fontWeight: '700',
        fontSize: 16,
        color: '#1A1E25'
    },
    resetContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        width: '22%',
        justifyContent: 'space-between'
    },
    resetText: {
        fontFamily: 'SF Pro Text',
        fontWeight: '500',
        fontSize: 16,
        color: '#7D7F88',
        // marginTop:5
    },
    houseText: {
        fontFamily: 'SF Pro Text',
        fontWeight: '500',
        fontSize: 16,
        color: '#7D7F88',
        marginTop: 10,
        lineHeight: 30
    },

    typeContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        // borderColor:'green',
        // borderWidth:1,
        marginTop: 20,
        width: '60%',
        justifyContent: 'space-between',
        marginBottom: 10
    },
    type: {
        backgroundColor: '#F2F2F3',
        alignItems: 'center',
        justifyContent: 'center',
        borderColor: '#E3E3E7',
        borderWidth: 0.8,
        borderRadius: 92,
        height: 36,
        width: 106,
        // elevation: 7
    },
    typeText: {
        fontFamily: 'SF Pro Text',
        fontWeight: '400',
        fontSize: 14,
        // color: '#7D7F88'
    },








})

const userSettingsStyles = StyleSheet.create({
    screen: {
        backgroundColor: 'white',
        flex: 1
    },
    header: {
        padding: 5,
        backgroundColor: '#282B4E',
        height: 130
    },
    headerTextContainer: {
        width: '91%',
        alignSelf: "center",
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginTop: 20,
        // marginLeft:12,

    },
    headerText: {
        color: 'white',
        fontSize: 18,
        marginLeft: 10,
        fontWeight: 'bold'
    },
    backArrow: {

    },
    headerImage: {

    },
    headerSearchContainer: {
        flexDirection: 'row',
        width: '91%',
        height: 35,
        backgroundColor: 'white',

        alignSelf: 'center',
        marginTop: 15,
        borderRadius: 4,
        // marginBottom: 15,
        alignItems: 'center'
    },
    searchHolder: {
        width: "94%",
        padding: 0,
        marginLeft: 5,
        fontSize: 10,
        fontWeight: "400",
        lineHeight: 20,
        fontFamily: "Roboto",
        color: "#000000"
    },
    searchIcon: {
        marginLeft: 8,
        tintColor: "#606060",
        width: 13.33,
        height: 13.33
    },
    body: {
        width: '95%',
        alignSelf: "center",
        marginTop: 10,
        flex: 1,
    },
    buttonContainer: {
        flexDirection: "row",
        alignItems: 'center',
        justifyContent: 'space-between',
        width: '95%',
        alignSelf: 'center'
    },
    sellerButton: {
        width: 112,
        height: 38,
        backgroundColor: '#38386A',
        justifyContent: 'center',
        // padding: 5,
        borderRadius: 4,
        marginLeft: 8
    },
    sellerButtonText: {
        color: '#FFFFFF',
        alignSelf: 'center',
        fontSize: 10,
        fontWeight: "400",
        fontFamily: "Poppins",
        marginVertical: 7,
        lineHeight: 15,

    },
    centeralView: {
        flex: 1,
        justifyContent: 'center',
        backgroundColor: '#282B4E',
        opacity: 0.92
    },
    modal_title: {
        // margin: 10,
        marginLeft: 10,
        marginRight: 10,

        backgroundColor: 'white',

        borderRadius: 4,
        padding: 35,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
    },
    text_product: {
        color: '#3D459B',
        marginBottom: 10,
        fontSize: 14,
        fontWeight: '600',
        lineHeight: 16.14,
        fontFamily: "Poppins",
        marginTop: 10
    },
    text_product1: {
        color: '#3D459B',
        fontSize: 14,
        fontWeight: '600',
    },
    input_product: {
        borderColor: '#3D459B',
        borderWidth: 1,
        fontSize: 14,
        fontWeight: "400",
        fontFamily: "Lato",
        lineHeight: 16.8,
        padding: 8,
        // height: 40,
        marginBottom: 7,
        borderRadius: 5,
        color: "#000000"
    },
    TextHeading: {
        fontSize: 18,
        fontWeight: '600',
        color: '#38386A',
        fontFamily: "Poppins-SemiBold"
    },
    imagecontainer: {
        alignItems: 'center',
        // marginTop: 8
    },
    imageStyle: {
        width: 69,
        height: 69,
        borderRadius: 69 / 2
    },
    Placeholderimage: {
        width: 69,
        height: 69,
        marginLeft: 12,

    },
    viewEditcontainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center'
    },
    vieweditText: {
        color: '#3D459B',
        fontSize: 12,
        fontWeight: '600',
        lineHeight: 20,
        fontFamily: "Poppins-SemiBold"
    },
    Checkbox_container: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 5
    },
    containerText: {
        color: '#3D459B',
        fontSize: 14,
        fontWeight: '600',
        fontFamily: "Poppins-SemiBold"
    },
    cancelBtn: {
        borderWidth: 1,
        borderColor: '#3D459B',
        alignItems: 'center',
        justifyContent: 'center',
        // padding: 5,
        marginRight: 10,
        width: 97,
        height: 30,
        borderRadius: 14
    },
    cancelBtnText: {
        color: '#3D459B',
        fontSize: 12,
        fontWeight: "600",
        lineHeight: 18,
        fontFamily: "Poppins",
        alignSelf: 'center'
    },
    updateBtn: {
        backgroundColor: '#3D459B',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 5,
        width: 97,
        height: 30,
        marginLeft: 10,

        borderRadius: 14
    },
    updateBtnText: {
        color: '#ffffff',
        fontSize: 13,
        fontWeight: "600",
        lineHeight: 19.5,
        fontFamily: "Poppins",
        alignSelf: 'center'
    },
    selectimageContainer: {
        height: '20%',
        marginTop: 'auto',
        backgroundColor: 'red',
    },
    container_Footer: {
        flex: 1,
        backgroundColor: '#38386A',
        bottom: 0,
        left: 0,
        right: 0,
        zIndex: 10,
    },
    textContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-around'
    },
    textStyle: {
        alignSelf: 'center',
        fontSize: 20,
        fontWeight: '900',
        color: 'white',
        marginTop: 5
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
    errorStyle: {
        color: 'red',
        marginBottom: 5,
        fontSize: 10
    },
    emptyUserRecord: {
        color: '#282B4E',
        alignSelf: 'center',
        fontWeight: '800',
        alignItems: 'center',
        fontSize: 20,
        marginVertical: '20%'
    },
})