import React, { useState, useContext, useEffect,useRef } from 'react'
import {
    Image,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
    FlatList,
    Alert,
    ActivityIndicator,
    ImageBackground,
    ScrollView,
    Dimensions,
    Button,
    BackHandler,
    PermissionsAndroid,
    Modal
} from 'react-native';



import { AuthContext } from '../../auth/AuthProvider'
import firestore from '@react-native-firebase/firestore'
import storage from "@react-native-firebase/storage"

import Icon from 'react-native-vector-icons/Ionicons'
import { Picker } from '@react-native-picker/picker'
import Icons from 'react-native-vector-icons/MaterialCommunityIcons'
import Spinner from 'react-native-loading-spinner-overlay';
import AsyncStorage from '@react-native-async-storage/async-storage'
import { launchCamera, launchImageLibrary } from 'react-native-image-picker';

import { AreaData, apartmentAreaData } from "../../utils/AreaData"
import PlaceRow from "../../components/PlaceRow"
import AlertModal from '../../components/AlertModal'

const Header = ({ goBack, photoURL }) => {
    return (
        <View style={styles.header}>
            <TouchableOpacity style={styles.headerIconContainer} onPress={goBack}>
                <Icon
                    name='chevron-back-outline'
                    color="black"
                    size={25}
                />
            </TouchableOpacity>
            <View>
                <Text style={styles.headerText}>Edit Inventory</Text>
            </View>
            <Image
                style={{ width: 30, height: 30, borderRadius: 50 }} resizeMode='contain'
                source={{ uri: photoURL }}
            />
        </View>
    )
}

export default function EditInventory({ navigation, route }) {
    const items = route.params
    // console.log("items[edit]", items)
    const { user } = useContext(AuthContext);

    const {
        societyName,
        cityName,
        id,
        transactionType,
        houseName,
        demand,
        rooms,
        size,
        sizeType,
        propertyImg,
        facilities,
        description,
        catagory,
        unitType,
        floorType,
        propertyType,
        isLead,
        sellerName,
        sellerMobile,
        leadID
    } = items

    // facilities
    const {
        ownerBuild,
        corner,
        gas,
        gated,
        mainRoad,
        facingPark,
    } = facilities

    // Rooms
    const {
        bathrooms,
        bedrooms
    } = rooms
    console.log("><><><><><><><><>><><>", sellerName)
    console.log("><><><><><><><><>><><>", sellerMobile)
    // Edit States
    const [house, setHouse] = useState('')

    // Transaction States
    const [saleType, setSaleType] = useState(transactionType == "Sale" ? true : false)
    const [letType, setLetType] = useState(transactionType == "Let" ? true : false)

    // boolean states
    const [showHouse, setShowHouse] = useState(false)
    const [showSellerName, setShowSellerName] = useState(false)
    const [showSellerMobile, setShowSellerMobile] = useState(false)


    const [showSize, setShowSize] = useState(false)
    const [showDescription, setShowDescription] = useState(false)
    const [showDemand, setShowDemand] = useState(false)
    const [addressModalOpen, setAddressModalOpen] = useState(false)
    const [showSociety, setShowSociety] = useState(false)
    const [showAddress, setShowAddress] = useState(false)

    // Catagory Type
    const [btnColorResidentiol, setBtnColorResidentiol] = useState(catagory == "Residential" ? true : false)
    const [btnColorComercial, setBtnColorComercial] = useState(catagory == "Commercial" ? true : false)
    const [btnColorSemiComercial, setBtnColorSemiComercial] = useState(catagory == "Semi Commercial" ? true : false)

    // Facilities States
    const [gasFacilities, setGasFacilities] = useState(gas)
    const [facingParkFacilities, setFacingParkFacilities] = useState(facingPark)
    const [mainRoadFacilities, setMainRoadFacilities] = useState(mainRoad)
    const [cornerFacilities, setCornerFacilities] = useState(corner)
    const [gatedFacilities, setGatedFacilities] = useState(gated)
    const [ownerBuildFacilities, setOwnerBuildFacilities] = useState(ownerBuild)


    // Unit States
    const [singleUnit, setSingleUnit] = useState(unitType == "Single" ? true : false)
    const [doubleUnit, setDoubleUnit] = useState(unitType == "Double" ? true : false)
    const [otherUnit, setOtherUnit] = useState(unitType == "Other" ? true : false)

    // Property States
    const [houseProperty, setHouseProperty] = useState(propertyType == "House" ? true : false)
    const [flatProperty, setFlatProperty] = useState(propertyType == "Flat" ? true : false)
    const [farmHouseProperty, setFarmHouseProperty] = useState(propertyType == "Farm House" ? true : false)
    const [pentHouseProperty, setPentHouseProperty] = useState(propertyType == "Pent House" ? true : false)

    const [officeProperty, setOfficeProperty] = useState(propertyType == "Office" ? true : false)
    const [shopProperty, setShopProperty] = useState(propertyType == "Shop" ? true : false)
    const [buildingProperty, setBuildingProperty] = useState(propertyType == "Building" ? true : false)
    const [factoryProperty, setFactoryProperty] = useState(propertyType == "Factory" ? true : false)

    const [housesProperty, setHousesProperty] = useState(propertyType == "House" ? true : false)
    const [plotsProperty, setPlotsProperty] = useState(propertyType == "Plot" ? true : false)
    const [shopsProperty, setShopsProperty] = useState(propertyType == "Shop" ? true : false)
    const [officesProperty, setOfficesProperty] = useState(propertyType == "Office" ? true : false)
    const [agricultureProperty, setAgrecultureProperty] = useState(propertyType == "Agriculture" ? true : false)
    const [farmHousesProperty, setFarmHousesProperty] = useState(propertyType == "Farm House" ? true : false)
    const [pentHopusesProperty, setPentHousesProperty] = useState(propertyType == "Pent House" ? true : false)
    const [buildingsProperty, setBuildingsProperty] = useState(propertyType == "Building" ? true : false)
    const [flatsProperty, setFlatsProperty] = useState(propertyType == "Flat" ? true : false)

    // Floor States
    const [anyFloor, setAnyFloor] = useState(floorType == "Any" ? true : false)
    const [basementFloor, setBasementFloor] = useState(floorType == "Basement" ? true : false)
    const [firstFloor, setFirstFloor] = useState(floorType == "First Floor" ? true : false)
    const [secondFloor, setSecondFloor] = useState(floorType == "Second Floor" ? true : false)
    const [completeFloor, setCompleteFloor] = useState(floorType == "Complete" ? true : false)

    // Area Size
    const [sizes, setSize] = useState("")
    const [sizeTypes, setSizeType] = useState(flatProperty || flatsProperty ? "Sq.Ft." : "Marla")
    const [value, setValue] = useState("")

    // Rooms States
    const [bedroom, setBedrooms] = useState(bedrooms)
    const [bathroom, setBathrooms] = useState(bathrooms)

    const [demands, setDemand] = useState('')
    const [descriptions, setDescription] = useState('')
    const [cityNames, setCityName] = useState()

    const [searchSocietyName, setSearchSocietyName] = useState('')
    const [societyData, setSocietyData] = useState()
    const [filterSocietyData, setFilterSocietyData] = useState()
    const [society, setSocietyName] = useState('')

    const [loading, setLoading] = useState(false)

    // Image
    const [imageUri, setimageUri] = useState('');
    const [uploading, setUploading] = useState(false);
    const [image, setimage] = useState(null);
    const [transferred, setTransferred] = useState(0);
    const [showImageModal, setShowImageModel] = useState(false)


     // Seller information 
     const [sellerNewName, setSellerNewName] = useState("")
     const [mobile, setMobile] = useState("")
     const [nameError, setNameError] = useState("")
     const [mobileError, setMobileError] = useState("")
 
 
      // Focus on Error statement
      const mobileFocus = useRef(null);
      const NameFocus = useRef(null);
      const AddressFocus = useRef(null);

    console.log("transactionType", transactionType)

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

    useEffect(() => {
        getID()
    }, [])

    // var cityName

    const getID = async () => {
        var data = await AsyncStorage.getItem("@areas");
        var city = await AsyncStorage.getItem("@city");
        // console.log(city)
        setCityName(city)
        data = data.replace(/'/g, '"');
        data = JSON.parse(data);
        // console.log(typeof data)
        // console.log(data)
        // setData(data)
        setSocietyData(data)
        // console.log("id===>>", data)

    }


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
                break;

        }
    }

    const OnchangePickerSeletedHandler = (value, index) => {
        // setValue(value)
        // setSizeType(AreaData[index].name)
        // setSelectCountry(country[index].name)
        console.log("<><><><><><>", value)
        console.log(">?>?>?>?>?>?>?>", apartmentAreaData[index].name)
        console.log(">?>?>?>?>?>?>?>", AreaData[index].name)

        setValue(value)
        if (flatProperty == true || flatsProperty == true) {
            setSizeType(apartmentAreaData[index].name)
        }
        else {
            setSizeType(AreaData[index].name)
        }

    }

    const addressModalHandler = () => {
        setAddressModalOpen(false)
        // setHouseName("")
        // setSocietyName("")
    }

    const updateInventoryHandler = async () => {
        const username_regux = /^[a-zA-Z\s]*$/;
        if (username_regux.test(sellerNewName) == false) {
            setNameError("Seller Name Should Contain Only Alphabets")
            NameFocus.current.focus()
            setLoading(false)
            return true
        }

        if (sellerNewName.length > 25) {
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
        setLoading(true)
        console.log("test")
        const imageUrl = await uploadImage();
        // if (isLead == true) {
        //     try {
        //         await firestore()
        //             .collection('Inventory')
        //             .doc(id)
        //             .update({
        //                 propertyType: houseProperty ? 'House' : flatProperty ? 'Flat' : farmHouseProperty ? 'Farm House' : pentHouseProperty ? 'Pent House' : officeProperty ? 'Office' : shopProperty ? 'Shop' : buildingProperty ? 'Building' : factoryProperty ? 'Factory' : housesProperty ? 'House' : plotsProperty ? 'Plot' : shopsProperty ? 'Shop' : officesProperty ? 'Office' : agricultureProperty ? 'Agriculture' : farmHousesProperty ? 'Farm House' : pentHopusesProperty ? 'Pent House' : buildingsProperty ? 'Building' : 'Flat',
        //                 facilities: {
        //                     gas: gasFacilities, //gas
        //                     facingPark: facingParkFacilities, //facing park
        //                     mainRoad: mainRoadFacilities, //mainRoad
        //                     corner: cornerFacilities, //corner
        //                     gated: gatedFacilities, //gated
        //                     ownerBuild: ownerBuildFacilities //owner built
        //                 },
        //                 update: firestore.Timestamp.fromDate(new Date())
        //             })
        //             .then(() => {
        //                 console.log("Inventory Updated")
        //                 navigation.pop(2)
        //                 setLoading(false)
        //                 // Alert.alert("Inventory Updated")
        //                 // navigation.navigate("Leads")
        //             })
        //     } catch (err) {
        //         console.log(err)
        //         setLoading(false)
        //         console.log(
        //             "Error occured",
        //         )
        //     }
        // }
        // else {
            // console.log(">>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>", sizeType)
            // console.log(">>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>", sizeTypes)

            try {
                await firestore()
                    .collection('Inventory')
                    .doc(id)
                    .update({
                        houseName: house !== "" ? house : houseName,
                        societyName: society !== "" ? society : societyName,
                        transactionType: saleType ? "Sale" : "Let",
                        catagory: btnColorResidentiol ? 'Residential' : btnColorComercial ? 'Commercial' : 'Semi Commercial',
                        propertyType: houseProperty ? 'House' : flatProperty ? 'Flat' : farmHouseProperty ? 'Farm House' : pentHouseProperty ? 'Pent House' : officeProperty ? 'Office' : shopProperty ? 'Shop' : buildingProperty ? 'Building' : factoryProperty ? 'Factory' : housesProperty ? 'House' : plotsProperty ? 'Plot' : shopsProperty ? 'Shop' : officesProperty ? 'Office' : agricultureProperty ? 'Agriculture' : farmHousesProperty ? 'Farm House' : pentHopusesProperty ? 'Pent House' : buildingsProperty ? 'Building' : 'Flat',
                        unitType: otherUnit ? 'Other' : doubleUnit ? 'Double' : 'Single',
                        floorType: anyFloor ? 'Any' : basementFloor ? 'Basement' : completeFloor ? 'Complete' : firstFloor ? 'First Floor' : secondFloor ? 'Second Floor' : '',
                        demand: demands !== "" ? demands : demand,
                        size: sizes !== "" ? sizes : size,
                        sizeType: sizeTypes == sizeType ? sizeType : sizeTypes,
                        propertyImg: imageUrl ? imageUrl : propertyImg,
                        sellerName:sellerNewName !== "" ? sellerNewName : sellerName ,
                        sellerMobile:mobile !== "" ? mobile :sellerMobile, 
                        rooms: {
                            bedrooms: bedroom,
                            bathrooms: bathroom,
                        },
                        facilities: {
                            gas: gasFacilities, //gas
                            facingPark: facingParkFacilities, //facing park
                            mainRoad: mainRoadFacilities, //mainRoad
                            corner: cornerFacilities, //corner
                            gated: gatedFacilities, //gated
                            ownerBuild: ownerBuildFacilities //owner built
                        },
                        description: descriptions !== "" ? descriptions : description,
                        update: firestore.Timestamp.fromDate(new Date())
                    })
                    .then(() => {
                        console.log("Inventory Updated")
                        navigation.pop(2)
                        setLoading(false)
                        // Alert.alert("Inventory Updated")
                        // navigation.navigate("Leads")
                    })
            } catch (err) {
                console.log(err)
                setLoading(false)
                console.log(
                    "Error occured 1",
                )
            }
        // }
    }


    // handle validate of lead name
    const validateName = (text) => {
        setSellerNewName(text)
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
            <Header
                goBack={() => navigation.pop()}
                photoURL={user.photoURL}
            />
            <ScrollView keyboardShouldPersistTaps="always" contentContainerStyle={{ flexGrow: 1, backgroundColor: "#FCFCFC", marginTop: 10 }} showsVerticalScrollIndicator={false}>
                <View style={{ width: "95%", alignItems: "center", justifyContent: "center", alignSelf: 'center', marginTop: 15 }}>
                    <TouchableOpacity
                        style={{ width: 90, height: 90, justifyContent: "center", alignItems: "center", borderColor: "#6F54F0", borderWidth: 0.5, backgroundColor: 'white', marginBottom: 10, alignSelf: 'center' }}
                        onPress={() => setShowImageModel(true)}
                    >
                        {console.log("<><><><><>",propertyImg)}
                        {/* <Image
                            source={{ uri: propertyImg }}
                            // source={require('../../assets/images/camera.png')}
                            style={{ width: 85, height: 85 }}
                        // resizeMode='contain'
                        /> */}
                        {
                           imageUri === "" &&  propertyImg ?
                                <Image source={{ uri: propertyImg }}
                                    style={{ width: 85, height: 85 }}
                                />
                                :
                                <Image
                                    //source={require('../assets/images/image2.jpg')}
                                    source={imageUri !== "" ? { uri: imageUri } : require('../../assets/images/camera.png')}
                                    style={imageUri !== "" ? { width: 85, height: 85 } : { width: 35, height: 35 }}
                                    resizeMode={imageUri !== "" ? "cover" : 'contain'}
                                />
                        }
                    </TouchableOpacity>
                </View>


                <View style={styles.body}>


                    <View style={{
                        // width: '95%',
                        marginTop: 10,
                        // alignSelf: 'center',
                        flexDirection: 'row',
                        justifyContent: 'space-between'
                    }}>
                        <Text style={styles.heading}>Seller Name</Text>
                        <TouchableOpacity onPress={() => {setSellerNewName(""),setShowSellerName(!showSellerName)}}>
                            <Icon
                                name='pencil-outline'
                                size={20}
                                color="black"
                            />
                        </TouchableOpacity>

                    </View>

                    {
                        showSellerName ?
                            <>
                                <TextInput
                                    ref={NameFocus}
                                    style={styles.inputStyle}
                                    placeholder='Enter Seller Name'
                                    placeholderTextColor={"#A1A1A1"}
                                    value={sellerNewName}
                                    onChangeText={(value) => validateName(value)}
                                />
                                {
                                    nameError != "" ?
                                        <Text style={styles.errorStyle}>{nameError}</Text>
                                        : null
                                }
                            </>
                            :
                            <Text style={transactionStyles.houseText}>
                                {sellerName}
                            </Text>
                    }


                    <View style={{
                        // width: '95%',
                        marginTop: 5,
                        // alignSelf: 'center',
                        flexDirection: 'row',
                        justifyContent: 'space-between'
                    }}>
                        <Text style={styles.heading}>Seller Mobile</Text>
                        <TouchableOpacity onPress={() => { setMobile(""),setShowSellerMobile(!showSellerMobile)}}>
                            <Icon
                                name='pencil-outline'
                                size={20}
                                color="black"
                            />
                        </TouchableOpacity>

                    </View>

                    {
                        showSellerMobile ?
                            <>
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
                                {
                                    mobileError != "" ?
                                        <Text style={styles.errorStyle}>{mobileError}</Text>
                                        : null
                                }

                            </>
                            :
                            <Text style={transactionStyles.houseText}>
                                {sellerMobile}
                            </Text>
                    }

                    {/*  Transaction Styles*/}
                    {
                        isLead ?
                            <View style={transactionStyles.container}>
                                <Text style={transactionStyles.heading}>Transaction Type</Text>
                                <Text style={transactionStyles.typeText}>{transactionType}</Text>
                            </View>
                            :
                            <>
                                <Text style={styles.heading}>
                                    Transaction Type
                                </Text>
                                <View style={transactionStyles.typeContainer}>
                                    <TouchableOpacity
                                        style={[transactionStyles.type, { backgroundColor: saleType ? '#917AFD' : '#F2F2F3' }]}
                                        onPress={() => changeTransactionHandler(1)}
                                    >
                                        <Text style={[transactionStyles.typeText, { color: saleType ? 'white' : '#7D7F88' }]}>For Sale</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity
                                        style={[transactionStyles.type, { backgroundColor: letType ? '#917AFD' : '#F2F2F3' }]}
                                        onPress={() => changeTransactionHandler(2)}
                                    >
                                        <Text style={[transactionStyles.typeText, { color: letType ? 'white' : '#7D7F88' }]}>To Let</Text>
                                    </TouchableOpacity>
                                </View>
                            </>

                    }
                    <View style={{ borderColor: '#E2E2E2', borderWidth: 1, marginVertical: 10 }} />

                    {/* House Name */}

                    {
                        isLead ?
                            <>
                                <View style={transactionStyles.container}>
                                    <Text style={transactionStyles.heading}>House No.</Text>
                                    <Text style={transactionStyles.typeText}>{houseName}</Text>
                                </View>
                                <View style={transactionStyles.container}>
                                    <Text style={transactionStyles.heading}>Society</Text>
                                    <Text style={transactionStyles.typeText}>{societyName}</Text>
                                </View>
                                <View style={transactionStyles.container}>
                                    <Text style={transactionStyles.heading}>City</Text>
                                    <Text style={transactionStyles.typeText}>{cityName}</Text>
                                </View>
                            </>
                            :
                            <>
                                <View style={{
                                    // width: '95%',
                                    marginTop: 10,
                                    // alignSelf: 'center',
                                    flexDirection: 'row',
                                    justifyContent: 'space-between'
                                }}>
                                    <Text style={styles.heading}>Address</Text>
                                    <TouchableOpacity onPress={() => setShowHouse(!showHouse)}>
                                        <Icon
                                            name='pencil-outline'
                                            size={20}
                                            color="black"
                                        />
                                    </TouchableOpacity>

                                </View>

                                {
                                    showHouse ?
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
                                        :
                                        <Text style={transactionStyles.houseText}>
                                            {/* akram */}
                                            {/* {house !== "" ? house : houseName + ", " + society !== "" ? society : societyName + ", " + cityName} */}
                                            {house !== "" ? house : houseName} , {society !== "" ? society : societyName},{cityName}

                                        </Text>
                                }
                            </>

                    }






                    <View style={{ borderColor: '#E2E2E2', borderWidth: 1, marginVertical: 10 }} />

                    {/* Category  */}
                    <Text style={styles.heading}>Category</Text>
                    {
                        isLead ?
                            <View style={transactionStyles.container}>
                                <Text style={transactionStyles.heading}>Catagory</Text>
                                <Text style={transactionStyles.typeText}>{catagory}</Text>
                            </View>
                            :
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
                    }

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
                                <TouchableOpacity style={[propertyStyles.typeContainer, { marginHorizontal: 10, backgroundColor: plotsProperty ? '#917AFD' : '#F2F2F3' }]} onPress={() => changePropertyHandler(10)}>
                                    <Text style={[propertyStyles.type, { color: plotsProperty ? 'white' : '#7D7F88' }]}>Plot</Text>
                                </TouchableOpacity>
                                <TouchableOpacity style={[propertyStyles.typeContainer, { marginRight: 10, backgroundColor: houseProperty ? '#917AFD' : '#F2F2F3' }]} onPress={() => changePropertyHandler(1)}>
                                    <Text style={[propertyStyles.type, { color: houseProperty ? 'white' : '#7D7F88' }]}>House</Text>
                                </TouchableOpacity>
                                <TouchableOpacity style={[propertyStyles.typeContainer, { marginHorizontal: 10, backgroundColor: flatProperty ? '#917AFD' : '#F2F2F3' }]} onPress={() => changePropertyHandler(2)}>
                                    <Text style={[propertyStyles.type, { color: flatProperty ? 'white' : '#7D7F88' }]}>Apartment</Text>
                                </TouchableOpacity>
                                <TouchableOpacity style={[propertyStyles.typeContainer, { marginHorizontal: 10, backgroundColor: farmHouseProperty ? '#917AFD' : '#F2F2F3' }]} onPress={() => changePropertyHandler(3)}>
                                    <Text style={[propertyStyles.type, { color: farmHouseProperty ? 'white' : '#7D7F88' }]}>Farm House</Text>
                                </TouchableOpacity>
                                <TouchableOpacity style={[propertyStyles.typeContainer, , { marginLeft: 10, backgroundColor: pentHouseProperty ? '#917AFD' : '#F2F2F3' }]} onPress={() => changePropertyHandler(4)}>
                                    <Text style={[propertyStyles.type, { color: pentHouseProperty ? 'white' : '#7D7F88' }]}>Pent House</Text>
                                </TouchableOpacity>

                            </ScrollView>
                            :
                            btnColorComercial === true && btnColorResidentiol == false && btnColorSemiComercial == false ?
                                <ScrollView
                                    horizontal={true}
                                    showsHorizontalScrollIndicator={false}
                                    contentContainerStyle={propertyStyles.container}>
                                    <TouchableOpacity style={[propertyStyles.typeContainer, { marginHorizontal: 10, backgroundColor: plotsProperty ? '#917AFD' : '#F2F2F3' }]} onPress={() => changePropertyHandler(10)}>
                                        <Text style={[propertyStyles.type, { color: plotsProperty ? 'white' : '#7D7F88' }]}>Plot</Text>
                                    </TouchableOpacity>

                                    <TouchableOpacity style={[propertyStyles.typeContainer, { marginRight: 10, backgroundColor: officeProperty ? '#917AFD' : '#F2F2F3' }]} onPress={() => changePropertyHandler(5)}>
                                        <Text style={[propertyStyles.type, { color: officeProperty ? 'white' : '#7D7F88' }]}>Office</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity style={[propertyStyles.typeContainer, { marginHorizontal: 10, backgroundColor: shopProperty ? '#917AFD' : '#F2F2F3' }]} onPress={() => changePropertyHandler(6)}>
                                        <Text style={[propertyStyles.type, { color: shopProperty ? 'white' : '#7D7F88' }]}>Shop</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity style={[propertyStyles.typeContainer, { marginHorizontal: 10, backgroundColor: buildingProperty ? '#917AFD' : '#F2F2F3' }]} onPress={() => changePropertyHandler(7)}>
                                        <Text style={[propertyStyles.type, { color: buildingProperty ? 'white' : '#7D7F88' }]}>Building</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity style={[propertyStyles.typeContainer, , { marginLeft: 10, backgroundColor: factoryProperty ? '#917AFD' : '#F2F2F3' }]} onPress={() => changePropertyHandler(8)}>
                                        <Text style={[propertyStyles.type, { color: factoryProperty ? 'white' : '#7D7F88' }]}>Factory</Text>
                                    </TouchableOpacity>
                                </ScrollView>
                                :
                                btnColorComercial === false && btnColorResidentiol == false && btnColorSemiComercial == true ?
                                    <ScrollView
                                        horizontal={true}
                                        showsHorizontalScrollIndicator={false}
                                        contentContainerStyle={{
                                            // flexDirection: 'row',
                                            marginTop: 20,
                                            // width: "100%",
                                            marginBottom: 20,
                                            borderColor: 'red',
                                            borderWidth: 1
                                        }}>
                                        <TouchableOpacity style={[propertyStyles.typeContainer, { marginRight: 10, backgroundColor: housesProperty ? '#917AFD' : '#F2F2F3' }]} onPress={() => changePropertyHandler(9)}>
                                            <Text style={[propertyStyles.type, { color: housesProperty ? 'white' : '#7D7F88' }]}>House</Text>
                                        </TouchableOpacity>
                                        <TouchableOpacity style={[propertyStyles.typeContainer, { marginHorizontal: 10, backgroundColor: plotsProperty ? '#917AFD' : '#F2F2F3' }]} onPress={() => changePropertyHandler(10)}>
                                            <Text style={[propertyStyles.type, { color: plotsProperty ? 'white' : '#7D7F88' }]}>Plot</Text>
                                        </TouchableOpacity>
                                        <TouchableOpacity style={[propertyStyles.typeContainer, { marginHorizontal: 10, backgroundColor: shopsProperty ? '#917AFD' : '#F2F2F3' }]} onPress={() => changePropertyHandler(11)}>
                                            <Text style={[propertyStyles.type, { color: shopsProperty ? 'white' : '#7D7F88' }]}>Shop</Text>
                                        </TouchableOpacity>
                                        <TouchableOpacity style={[propertyStyles.typeContainer, , { marginHorizontal: 10, backgroundColor: officesProperty ? '#917AFD' : '#F2F2F3' }]} onPress={() => changePropertyHandler(12)}>
                                            <Text style={[propertyStyles.type, { color: officesProperty ? 'white' : '#7D7F88' }]}>Office</Text>
                                        </TouchableOpacity>

                                        <TouchableOpacity style={[propertyStyles.typeContainer, { marginHorizontal: 10, marginHorizontal: 5, backgroundColor: agricultureProperty ? '#917AFD' : '#F2F2F3' }]} onPress={() => changePropertyHandler(13)}>
                                            <Text style={[propertyStyles.type, { color: agricultureProperty ? 'white' : '#7D7F88' }]}>Agriculture</Text>
                                        </TouchableOpacity>
                                        <TouchableOpacity style={[propertyStyles.typeContainer, { marginHorizontal: 10, marginHorizontal: 5, backgroundColor: farmHousesProperty ? '#917AFD' : '#F2F2F3' }]} onPress={() => changePropertyHandler(14)}>
                                            <Text style={[propertyStyles.type, { color: farmHousesProperty ? 'white' : '#7D7F88' }]}>Farm House</Text>
                                        </TouchableOpacity>
                                        <TouchableOpacity style={[propertyStyles.typeContainer, { marginHorizontal: 10, backgroundColor: pentHopusesProperty ? '#917AFD' : '#F2F2F3' }]} onPress={() => changePropertyHandler(15)}>
                                            <Text style={[propertyStyles.type, { color: pentHopusesProperty ? 'white' : '#7D7F88' }]}>Pent House</Text>
                                        </TouchableOpacity>
                                        <TouchableOpacity style={[propertyStyles.typeContainer, , { marginHorizontal: 10, backgroundColor: buildingsProperty ? '#917AFD' : '#F2F2F3' }]} onPress={() => changePropertyHandler(16)}>
                                            <Text style={[propertyStyles.type, { color: buildingsProperty ? 'white' : '#7D7F88' }]}>Building</Text>
                                        </TouchableOpacity>

                                        <TouchableOpacity style={[propertyStyles.typeContainer, , { marginLeft: 10, backgroundColor: flatsProperty ? '#917AFD' : '#F2F2F3' }]} onPress={() => changePropertyHandler(17)}>
                                            <Text style={[propertyStyles.type, { color: flatsProperty ? 'white' : '#7D7F88' }]}>Apartment</Text>
                                        </TouchableOpacity>
                                    </ScrollView>
                                    : null
                    }

                    {/* Unit */}
                    {
                        isLead ? null :
                            <>
                                <Text style={styles.heading}>
                                    Unit
                                </Text>
                                <View style={unitStyles.container}>
                                    <TouchableOpacity style={[unitStyles.unitContainer, , { backgroundColor: singleUnit ? '#917AFD' : '#F2F2F3' }]} onPress={() => changeUnitHandler(2)}>
                                        <Text style={[unitStyles.unit, , { color: singleUnit ? 'white' : '#7D7F88' }]}>Single</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity style={[unitStyles.unitContainer, , { backgroundColor: doubleUnit ? '#917AFD' : '#F2F2F3' }]} onPress={() => changeUnitHandler(1)}>
                                        <Text style={[unitStyles.unit, { color: doubleUnit ? 'white' : '#7D7F88' }]}>Double</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity style={[unitStyles.unitContainer, , { backgroundColor: otherUnit ? '#917AFD' : '#F2F2F3' }]} onPress={() => changeUnitHandler(3)}>
                                        <Text style={[unitStyles.unit, , { color: otherUnit ? 'white' : '#7D7F88' }]}>Other</Text>
                                    </TouchableOpacity>
                                </View>
                            </>
                    }
                    <View style={{ borderColor: '#E2E2E2', borderWidth: 1, marginVertical: 10 }} />

                    {/* Floor to Rent */}

                    {
                        isLead ? null :

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


                    {/* Property Size */}

                    {
                        isLead ?
                            <View style={transactionStyles.container}>
                                <Text style={transactionStyles.heading}>Area</Text>
                                <Text style={transactionStyles.typeText}>{size} {sizeType}</Text>
                            </View>
                            :
                            <>
                                <View style={{
                                    // width: '95%',
                                    marginTop: 10,
                                    // alignSelf: 'center',
                                    flexDirection: 'row',
                                    justifyContent: 'space-between'
                                }}>
                                    <Text style={styles.heading}>Size</Text>
                                    <TouchableOpacity onPress={() => setShowSize(!showSize)}>
                                        <Icon
                                            name='pencil-outline'
                                            size={20}
                                            color="black"
                                        />
                                    </TouchableOpacity>

                                </View>

                                {
                                    showSize ?
                                        <View style={{ flexDirection: 'row' }}>
                                            <View style={{ width: "50%" }}>
                                                <TextInput
                                                    // style={styles.inputStyle}
                                                    placeholder='Enter Area'
                                                    placeholderTextColor={"#A1A1A1"}
                                                    keyboardType="numeric"
                                                    value={sizes}
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
                                            {/* <View style={styles.pickerStyle}>
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
                                            </View> */}
                                        </View>
                                        :
                                        <Text style={{ fontSize: 16, color: 'gray', fontWeight: '500', marginTop: 5, marginLeft: 15 }}>{size} {sizeType}</Text>
                                }
                            </>
                    }

                    <View style={{ borderColor: '#E2E2E2', borderWidth: 1, marginVertical: 10 }} />

                    {/* Rooms and beds */}

                    {
                        isLead ?
                            <>
                                <View style={transactionStyles.container}>
                                    <Text style={transactionStyles.heading}>Bedrooms.</Text>
                                    <Text style={transactionStyles.typeText}>{bedrooms}</Text>
                                </View>
                                <View style={transactionStyles.container}>
                                    <Text style={transactionStyles.heading}>Bathrooms</Text>
                                    <Text style={transactionStyles.typeText}>{bathrooms}</Text>
                                </View>
                            </>
                            :
                            <>
                                {
                                    shopProperty || plotsProperty || shopsProperty || agricultureProperty == true ? null :
                                        <View>
                                            <View style={{ borderColor: '#E2E2E2', borderWidth: 1, marginVertical: 10 }} />
                                            <Text style={styles.heading}>
                                                Rooms and beds
                                            </Text>
                                        </View>


                                }
                                {
                                    shopProperty || plotsProperty || shopsProperty || agricultureProperty == true ?
                                        <>
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
                                        </>
                                        :
                                        <>
                                            <View style={roomStyles.container}>
                                                <Text style={roomStyles.containerHeading}>Bedrooms</Text>
                                                <View style={roomStyles.countContainer}>
                                                    <TouchableOpacity onPress={() => { setBedrooms(prev => prev - 1) }} disabled={bedroom < 1 ? true : false}>
                                                        <Icons
                                                            name='minus-circle-outline'
                                                            color={bedroom < 1 ? '#BABCBF' : "#1A1E25"}
                                                            size={25}
                                                        />
                                                    </TouchableOpacity>
                                                    <Text style={roomStyles.count}>
                                                        {bedroom}
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
                                                    <TouchableOpacity onPress={() => { setBathrooms(prev => prev - 1) }} disabled={bathroom < 1 ? true : false}>
                                                        <Icons
                                                            name='minus-circle-outline'
                                                            color={bathroom < 1 ? '#BABCBF' : "#1A1E25"}
                                                            size={25}
                                                        />
                                                    </TouchableOpacity>
                                                    <Text style={roomStyles.count}>
                                                        {bathroom}
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
                                        </>
                                }
                            </>

                    }

                    <View style={{ borderColor: '#E2E2E2', borderWidth: 1, marginVertical: 15 }} />

                    {/* Property Facilities */}
                    <Text style={styles.heading}>
                        Property Facilities
                    </Text>
                    <View style={styles.facilitiesContainer}>
                        <TouchableOpacity style={[styles.facilities, { width: 109, backgroundColor: gasFacilities ? '#917AFD' : '#F2F2F3' }]} onPress={() => { setGasFacilities(!gasFacilities) }}>
                            <Text style={[styles.facilitiesText, { color: gasFacilities ? 'white' : '#7D7F88' }]}>Sui Gas</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={[styles.facilities, { width: 130, backgroundColor: facingParkFacilities ? '#917AFD' : '#F2F2F3' }]} onPress={() => { setFacingParkFacilities(!facingParkFacilities) }}>
                            <Text style={[styles.facilitiesText, { color: facingParkFacilities ? 'white' : '#7D7F88' }]}>Facing Park</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={[styles.facilities, { width: 110, backgroundColor: mainRoadFacilities ? '#917AFD' : '#F2F2F3' }]} onPress={() => { setMainRoadFacilities(!mainRoadFacilities) }}>
                            <Text style={[styles.facilitiesText, { color: mainRoadFacilities ? 'white' : '#7D7F88' }]}>Main Road</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={[styles.facilities, { width: 126, marginTop: 25, backgroundColor: cornerFacilities ? '#917AFD' : '#F2F2F3' }]} onPress={() => { setCornerFacilities(!cornerFacilities) }}>
                            <Text style={[styles.facilitiesText, { color: cornerFacilities ? 'white' : '#7D7F88' }]}>Corner</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={[styles.facilities, { width: 100, backgroundColor: gatedFacilities ? '#917AFD' : '#F2F2F3' }]} onPress={() => { setGatedFacilities(!gatedFacilities) }}>
                            <Text style={[styles.facilitiesText, { color: gatedFacilities ? 'white' : '#7D7F88' }]}>Gated</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={[styles.facilities, { width: 130, backgroundColor: ownerBuildFacilities ? '#917AFD' : '#F2F2F3' }]} onPress={() => { setOwnerBuildFacilities(!ownerBuildFacilities) }}>
                            <Text style={[styles.facilitiesText, { color: ownerBuildFacilities ? 'white' : '#7D7F88' }]}>Owner Built</Text>
                        </TouchableOpacity>
                    </View>
                    <View style={{ borderColor: '#E2E2E2', borderWidth: 1, marginVertical: 10 }} />

                    {/* Demand */}
                    {
                        isLead ?
                            <View style={transactionStyles.container}>
                                <Text style={transactionStyles.heading}>Demand</Text>
                                <Text style={transactionStyles.typeText}>{demand.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}</Text>
                            </View>
                            :
                            <>
                                <View style={{
                                    // width: '95%',
                                    marginTop: 10,
                                    // alignSelf: 'center',
                                    flexDirection: 'row',
                                    justifyContent: 'space-between'
                                }}>
                                    <Text style={styles.heading}>Demand</Text>
                                    <TouchableOpacity onPress={() => setShowDemand(true)}>
                                        <Icon
                                            name='pencil-outline'
                                            size={20}
                                            color="black"
                                        />
                                    </TouchableOpacity>

                                </View>

                                {
                                    showDemand ?
                                        letType ?
                                            <View style={styles.demandContainer}>
                                                <TextInput
                                                    placeholder='Type demand here...'
                                                    placeholderTextColor="#1A1E25"
                                                    style={[styles.demandInput, { width: '60%' }]}
                                                    keyboardType='numeric'
                                                    value={demands}
                                                    onChangeText={(value) => setDemand(value)}
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
                                                    value={demands}
                                                    onChangeText={(value) => setDemand(value)}
                                                />
                                                <Text style={{ color: '#6C51EE', fontFamily: 'Lato', fontWeight: '600', fontSize: 16, marginRight: 10 }}>PKR</Text>
                                            </View>
                                        :
                                        <Text style={{ fontSize: 16, color: 'gray', fontWeight: '500', marginTop: 5 }}>{demand.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}</Text>
                                }
                            </>
                    }

                    <View style={{ borderColor: '#E2E2E2', borderWidth: 1, marginVertical: 10 }} />

                    {/* Description */}

                    {
                        isLead ? null :
                            <>
                                <View style={{
                                    // width: '95%',
                                    marginTop: 10,
                                    // alignSelf: 'center',
                                    flexDirection: 'row',
                                    justifyContent: 'space-between'
                                }}>
                                    <Text style={styles.heading}>Description</Text>
                                    <TouchableOpacity onPress={() => setShowDescription(true)}>
                                        <Icon
                                            name='pencil-outline'
                                            size={20}
                                            color="black"
                                        />
                                    </TouchableOpacity>

                                </View>

                                {
                                    showDescription ?
                                        <TextInput
                                            style={{ borderBottomColor: '#E2E2E2', borderBottomWidth: 1 }}
                                            placeholder='Enter Description'
                                            placeholderTextColor={"#A1A1A1"}
                                            keyboardType="default"
                                            multiline
                                            numberOfLines={3}
                                            value={descriptions}
                                            onChangeText={(value) => setDescription(value)}
                                        />
                                        :
                                        <Text style={{ fontSize: 16, color: 'gray', fontWeight: '500', marginTop: 5 }}>{description}</Text>
                                }
                            </>
                    }


                    {/* <View style={{ borderColor: '#E2E2E2', borderWidth: 1, marginVertical: 10 }} />
                    <Text style={styles.heading}>
                        Description
                    </Text> */}
                    {/* <TextInput
                        style={{ borderBottomColor: '#E2E2E2', borderBottomWidth: 1 }}
                        placeholder='Enter Description'
                        placeholderTextColor={"#A1A1A1"}
                        keyboardType="default"
                        multiline
                        numberOfLines={3}
                        value={description}
                        onChangeText={(value) => setDescription(value)}
                    /> */}


                    <TouchableOpacity style={styles.SaveBtn} onPress={() => updateInventoryHandler()}>
                        <Text style={styles.saveBtnText}>Update</Text>
                    </TouchableOpacity>
                </View>

            </ScrollView>
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


            {/* Adress Modal */}
            <Modal visible={addressModalOpen} animationType='slide' transparent={true}>
                <View style={{ backgroundColor: 'gray', opacity: 0.5, height: '40%' }}></View>
                <ScrollView keyboardShouldPersistTaps="always" style={{ height: '60%', elevation: 7, backgroundColor: '#ccc' }}>
                    <View style={{
                        flex: 1, backgroundColor: '#fbfcfa', bottom: 0, elevation: 9,
                        left: 0,
                        right: 0,
                        zIndex: 10,
                        borderTopLeftRadius: 20,
                        borderTopRightRadius: 20
                    }}>
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
                                <Text style={{ flex: 0.2, fontSize: 18, color: 'black', fontWeight: '600' }}>Society:</Text>
                                <Text style={{ flex: 0.75, fontSize: 18, color: 'black', fontWeight: '600' }}>{showSociety ? society : ""}</Text>

                                <TouchableOpacity style={{ flex: 0.05 }} onPress={() => { setSocietyName(""), setShowSociety(!showSociety) }}>
                                    <Icon
                                        name='pencil-outline'
                                        size={20}
                                        color="black"
                                    />
                                </TouchableOpacity>
                            </View>

                            {
                                showSociety ?
                                    <>
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
                                    </>
                                    : <Text style={{ fontSize: 16, color: 'black', fontWeight: '500' }}>{societyName}</Text>
                            }

                            {/* House Name */}
                            <View style={{
                                // width: '95%',
                                marginTop: 10,
                                // alignSelf: 'center',
                                flexDirection: 'row',
                                justifyContent: 'space-between'
                            }}>
                                <Text style={{ fontSize: 18, color: 'black', fontWeight: '600', marginVertical: 15 }}>Residence:</Text>
                                <TouchableOpacity onPress={() => { setHouse(""), setShowAddress(!showAddress) }}>
                                    <Icon
                                        name='pencil-outline'
                                        size={20}
                                        color="black"
                                    />
                                </TouchableOpacity>

                            </View>

                            {
                                showAddress ?
                                    <View style={[styles.societyContainer, { height: 100 }]}>
                                        <TextInput
                                            placeholder='Enter house number here...'
                                            placeholderTextColor="#1A1E25"
                                            style={styles.demandInput1}
                                            keyboardType='default'
                                            multiline
                                            numberOfLines={3}
                                            keyboardAppearance="dark"
                                            value={house}
                                            onChangeText={(text) => setHouse(text.trim())}
                                        />
                                    </View>
                                    : <Text style={{ fontSize: 16, color: 'black', fontWeight: '500' }}>{houseName}</Text>
                            }
                            <TouchableOpacity style={styles.continueButton}
                                onPress={() => { setAddressModalOpen(false), setShowHouse(!showHouse) }}
                            >
                                <Text style={{ alignSelf: 'center', color: 'white', fontSize: 16, fontWeight: '700' }}>Continue</Text>
                                {/* <Icons
                                    name='chevron-right'
                                    color="white"
                                    size={20}
                                /> */}
                            </TouchableOpacity>

                        </View>

                    </View>

                </ScrollView>
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
    body: {
        flex: 1,
        width: '95%',
        alignSelf: 'center',
        marginTop: 15
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
    heading: {
        fontFamily: 'Lato',
        fontWeight: '700',
        fontSize: 16,
        color: 'black',
        marginTop: 2
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
    facilitiesContainer: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        // borderColor:'green',
        // borderWidth:1,
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
        marginTop:5,
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
        height: 38,
        width: 100,
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
        // marginTop: 10,
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