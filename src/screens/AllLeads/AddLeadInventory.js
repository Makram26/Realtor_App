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
    FlatList,
    PermissionsAndroid,
    Modal,
    BackHandler
} from 'react-native';

import { HeaderStyle } from '../../constants/Styles';
import { AuthContext } from '../../auth/AuthProvider'

import firestore from '@react-native-firebase/firestore'
import Spinner from 'react-native-loading-spinner-overlay';
import storage from "@react-native-firebase/storage"


import AsyncStorage from '@react-native-async-storage/async-storage'

import Icon from 'react-native-vector-icons/Ionicons';
import Icon1 from 'react-native-vector-icons/EvilIcons';
import Icon2 from 'react-native-vector-icons/FontAwesome'

import AlertModal from '../../components/AlertModal'

import { launchCamera, launchImageLibrary } from 'react-native-image-picker';

const Header = ({ goBack, photoURL }) => {
    return (
        <View style={HeaderStyle.mainContainer}>
            <View style={HeaderStyle.arrowbox}>
                <TouchableOpacity onPress={goBack}>
                    <Icon name='chevron-back-outline' color="#1A1E25" size={20} />
                </TouchableOpacity>
            </View>
            <View style={HeaderStyle.HeaderTextContainer}>
                <Text style={HeaderStyle.HeaderText}>Add Lead Inventory</Text>
                <Image
                    style={HeaderStyle.HeaderImage} resizeMode='contain'
                    //source={require('../../assets/images/personpic.png')}
                    source={{ uri: photoURL }}
                />
            </View>
        </View>
    )
}

export default function AddLeadInventory({ route, navigation }) {
    const items = route.params;
    // console.log("Leads Data :", items)

    const { user } = useContext(AuthContext);

    const [loading, setLoading] = useState(false)
    const [alertModal, setAlertModal] = useState(false)

    // Property State
    const [houseProperty, setHouseProperty] = useState(false)
    const [flatProperty, setFlatProperty] = useState(false)
    const [farmHouseProperty, setFarmHouseProperty] = useState(false)
    const [pentHouseProperty, setPentHouseProperty] = useState(false)

    const [officeProperty, setOfficeProperty] = useState(false)
    const [shopProperty, setShopProperty] = useState(false)
    const [buildingProperty, setBuildingProperty] = useState(false)
    const [factoryProperty, setFactoryProperty] = useState(false)

    const [housesProperty, setHousesProperty] = useState(false)
    const [plotsProperty, setPlotsProperty] = useState(true)
    const [shopsProperty, setShopsProperty] = useState(false)
    const [officesProperty, setOfficesProperty] = useState(false)
    const [agricultureProperty, setAgrecultureProperty] = useState(false)
    const [farmHousesProperty, setFarmHousesProperty] = useState(false)
    const [pentHopusesProperty, setPentHousesProperty] = useState(false)
    const [buildingsProperty, setBuildingsProperty] = useState(false)
    const [flatsProperty, setFlatsProperty] = useState(false)

    // Image states
    const [showImageModal, setShowImageModel] = useState(false)
    const [imageUri, setimageUri] = useState('');
    const [image, setimage] = useState(null);
    const [transferred, setTransferred] = useState(0);

    

    const {
        bathroomQuantity,
        bedroomsQuantity,
        budget,
        catagory,
        description,
        docID,
        houseNo,
        leadName,
        mobile,
        portion_type,
        property_type,
        size,
        size_type,
        societyName,
        unitType,
        user_id,
        cityName,
        businessID,
        role,
        name,
        inventoryProperty,
        facilities,

    } = items



    // Facilities States
    const [gasFacilities, setGasFacilities] = useState(facilities.gas)
    const [facingParkFacilities, setFacingParkFacilities] = useState(facilities.facingPark)
    const [mainRoadFacilities, setMainRoadFacilities] = useState(facilities.mainRoad)
    const [cornerFacilities, setCornerFacilities] = useState(facilities.corner)
    const [gatedFacilities, setGatedFacilities] = useState(facilities.gated)
    const [ownerBuildFacilities, setOwnerBuildFacilities] = useState(facilities.ownerBuild)

    const [countryID, setCountryID] = useState('')

    useEffect(() => {
        getCurrency()
    }, [])

    const getCurrency = async() => {
        var country = await AsyncStorage.getItem("@countryID");
        setCountryID(country)
    }

    // Disable backpress
    useEffect(() => {
        const backHandler = BackHandler.addEventListener('hardwareBackPress', () => true)
        return () => backHandler.remove()
    }, [])

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

                setLoading(false);

                console.log("Image Uploaded")
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

    const addInventoryHandler = async () => {
        setLoading(true)
        const imageUrl = await uploadImage();
        console.log("data Uploading....")
        //setLoading(true)
        // if (demand && demand !== "" && size && size !== "" && imageUrl && houseName !=="" && societyName !=="") {
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
                        transactionType: property_type,
                        catagory: catagory == "Residentiol"  ? 'Residential' : catagory == "Comercial"  ? 'Commercial' : 'Semi Commercial',
                        propertyType: inventoryProperty,
                        unitType: unitType,
                        floorType: portion_type,
                        propertyImg: imageUrl ? imageUrl : null,
                        demand: budget,
                        size: size,
                        sizeType: size_type,
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
                        leadID: docID,
                        leadName: leadName,
                        isLead: true,
                        toMarketplace: false,
                        businessID: businessID,
                        role: role,
                        name : name
                    })
                    .then((docRef) => {
                        // Alert.alert(
                        //     "Inventory Added",
                        //     //"Image and Data has been uploaded successfully!"
                        // )
                        // setAlertModal(true)
                        setLoading(false)
                        dealLead(docRef.id)
                        // setAlertModal(true)
                        // resetAllHandler()
                        // navigation.pop(2)
                    })

            } catch (err) {
                console.log(err)
                setLoading(false)
            }
        // } else {
        //     Alert.alert(
        //         "Notice",
        //         "Please fill all fields first ..."
        //     )
        //     setLoading(false)
        // }
    }

    const dealLead = async (docRef) => {
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
                    setLoading(false)
                    navigation.pop(2)
                    // Alert.alert("Status Updated")
                    // navigation.navigate("Leads")
                })

        } catch (err) {
            console.log(err)
            setLoading(false)
        }
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
                goBack={() => navigation.pop(2)}
                photoURL={user.photoURL}
            />

            <ScrollView contentContainerStyle={{ flexGrow: 1, backgroundColor: "#FCFCFC",width:'95%',alignSelf:'center',marginTop:10 }}>

                {/* Image */}
                <View style={{ width: "95%", alignItems: "center", justifyContent: "center",alignSelf:'center' }}>
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
                </View>
                <View style={{ borderColor: '#E2E2E2', borderWidth: 1, marginVertical: 10 }} />

                {/* Lead Name */}
                <View style={transactionStyles.container}>
                    <Text style={transactionStyles.heading}>Lead Name</Text>
                    <Text style={transactionStyles.typeText}>{leadName}</Text>
                </View>
                <View style={transactionStyles.container}>
                    <Text style={transactionStyles.heading}>Lead Contact</Text>
                    <Text style={transactionStyles.typeText}>{mobile}</Text>
                </View>
                <View style={{ borderColor: '#E2E2E2', borderWidth: 1, marginVertical: 10 }} />

                {/* Address */}
                <View style={{...transactionStyles.container,marginBottom:10}}>
                    <View style={{width:"20%"}}>

                    <Text style={{...transactionStyles.heading,marginBottom:0}}>House No.</Text>
                    </View>
                    <View   style={{width:"80%",alignItems:"flex-end"}}>

                    <Text numberOfLines={1} style={transactionStyles.typeText}>{houseNo}</Text>
                    </View>
                </View>
                <View style={transactionStyles.container}>
                    <Text style={transactionStyles.heading}>Society</Text>
                    <Text style={transactionStyles.typeText}>{societyName}</Text>
                </View>
                <View style={transactionStyles.container}>
                    <Text style={transactionStyles.heading}>City</Text>
                    <Text style={transactionStyles.typeText}>{cityName}</Text>
                </View>
                <View style={{ borderColor: '#E2E2E2', borderWidth: 1, marginVertical: 10 }} />

                {/* Transaction type */}
                <View style={transactionStyles.container}>
                    <Text style={transactionStyles.heading}>Transaction Type</Text>
                    <Text style={transactionStyles.typeText}>{property_type}</Text>
                </View>
                <View style={{ borderColor: '#E2E2E2', borderWidth: 1, marginVertical: 10 }} />

                {/* Inventory Property */}
                <View style={transactionStyles.container}>
                    <Text style={transactionStyles.heading}>Property Type</Text>
                    <Text style={transactionStyles.typeText}>{inventoryProperty}</Text>
                </View>
                <View style={{ borderColor: '#E2E2E2', borderWidth: 1, marginVertical: 10 }} />

                {/*  */}

                {/* Property Type */}
                {/* <Text style={styles.heading}>
                    Property type
                    <Text style={{color:'red'}}> *</Text>
                </Text>
                {
                    catagory == "Residentiol" ?
                        <ScrollView
                            horizontal={true}
                            showsHorizontalScrollIndicator={false}
                            contentContainerStyle={propertyStyles.container}
                        >
                            <TouchableOpacity style={[propertyStyles.typeContainer, { marginHorizontal: 10, backgroundColor: plotsProperty ? '#917AFD' : '#F2F2F3' }]} onPress={() => changePropertyHandler(10)}>
                                <Text style={[propertyStyles.type, { color: plotsProperty ? 'white' : '#7D7F88' }]}>Plot</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={[propertyStyles.typeContainer, { marginRight: 10, backgroundColor: houseProperty ? '#917AFD' : '#F2F2F3' }]} onPress={() => changePropertyHandler(1)}>
                                <Text style={[propertyStyles.type, { color: houseProperty ? 'white' : '#7D7F88' }]}>House</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={[propertyStyles.typeContainer, { marginHorizontal: 10, backgroundColor: flatProperty ? '#917AFD' : '#F2F2F3' }]} onPress={() => changePropertyHandler(2)}>
                                <Text style={[propertyStyles.type, { color: flatProperty ? 'white' : '#7D7F88' }]}>Flat</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={[propertyStyles.typeContainer, { marginHorizontal: 10, backgroundColor: farmHouseProperty ? '#917AFD' : '#F2F2F3' }]} onPress={() => changePropertyHandler(3)}>
                                <Text style={[propertyStyles.type, { color: farmHouseProperty ? 'white' : '#7D7F88' }]}>Farm House</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={[propertyStyles.typeContainer, , { marginLeft: 10, backgroundColor: pentHouseProperty ? '#917AFD' : '#F2F2F3' }]} onPress={() => changePropertyHandler(4)}>
                                <Text style={[propertyStyles.type, { color: pentHouseProperty ? 'white' : '#7D7F88' }]}>Pent House</Text>
                            </TouchableOpacity>
                        </ScrollView>
                        : catagory == "SemiComercial" ?
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
                                    <Text style={[propertyStyles.type, { color: flatsProperty ? 'white' : '#7D7F88' }]}>Flat</Text>
                                </TouchableOpacity>
                            </ScrollView>
                            :
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
                }
                <View style={{ borderColor: '#E2E2E2', borderWidth: 1, marginVertical: 10 }} /> */}

                {/* Budget */}
                <View style={transactionStyles.container}>
                    <Text style={transactionStyles.heading}>Demand</Text>
                    <Text style={transactionStyles.typeText}>
                        {/* PKR  */}
                        {countryID == 2 ? "AED " : countryID == 3 ? "INR " : countryID == 4 ? "BDT " : "PKR "} 
                        {budget.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                    </Text>
                </View>
                <View style={{ borderColor: '#E2E2E2', borderWidth: 1, marginVertical: 10 }} />

                {/* Property Facilities */}
                <Text style={styles.heading}>
                    Property Facilities
                    <Text style={{color:'red'}}> *</Text>
                </Text>
                {/* <View style={styles.facilitiesContainer}>
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
                </View> */}
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

                <TouchableOpacity style={styles.buttonContainer} onPress={addInventoryHandler}>
                    <Text style={styles.buttonText}>SAVE</Text>
                </TouchableOpacity>

            </ScrollView>

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
                    onPress={() => setAlertModal(false)}
                    body="Inventory Created"
                />
            </Modal>
        </View>
    )
}

const styles = StyleSheet.create({
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
        // alignItems: 'center',
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

const transactionStyles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between'
    },
    heading: {
         fontSize: 16, fontWeight: '600', color: "#1A1E25",
         marginBottom:10 
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
        marginTop:10,
        lineHeight:30
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
        fontSize: 14, fontWeight: '400', color: '#7D7F88'
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