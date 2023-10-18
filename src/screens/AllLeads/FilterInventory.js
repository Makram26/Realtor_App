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
} from 'react-native';
import Icon from 'react-native-vector-icons/AntDesign';
import Icon1 from 'react-native-vector-icons/SimpleLineIcons';
import Icon2 from 'react-native-vector-icons/Entypo';
import userData from '../../utils/UserData';
import { HeaderStyle } from '../../constants/Styles';
import { AuthContext } from '../../auth/AuthProvider'
import Spinner from 'react-native-loading-spinner-overlay';
import { uid } from '../../services/uid';
import InventoryApi from '../../api/InventoryAPIs/CreateInventory'
import InventoryCard from '../../components/InventoryCard'
import LeadInventoryCard from '../../components/LeadInventoryCard';
import firestore from '@react-native-firebase/firestore'

export default function FilterInventory({ route, navigation }) {
    const items = route.params;
    // console.log("Lead Data :", items)

    const { size_type } = items

    const { user } = useContext(AuthContext);
    // for Filter Buttons
    const [btnColorPrice, setBtnColorPrice] = useState(false)
    const [btnColorLocation, setBtnColorLocation] = useState(false)
    const [btnColorSize, setBtnColorSize] = useState(false)
    const [btnColorProperties, setBtnColorProperties] = useState(false)

    const [filteredData, setFilteredData] = useState([])
    const [inventoryList, setInventoryList] = useState([])
    const [loading, setLoading] = useState(false)
    const [preference, setPreference] = useState(false)

    // For Filter Button
    var BtnPrice = btnColorPrice ? '#826AF7' : '#FFFFFF'
    var BtnLocation = btnColorLocation ? '#826AF7' : '#FFFFFF'
    var BtnSize = btnColorSize ? '#826AF7' : '#FFFFFF'
    var BtnProperties = btnColorProperties ? '#826AF7' : '#FFFFFF'

    var textPrice = btnColorPrice ? '#FFFFFF' : '#7D7F88'
    var textSize = btnColorSize ? '#FFFFFF' : '#7D7F88'
    var textLocation = btnColorLocation ? '#FFFFFF' : '#7D7F88'
    var textProperties = btnColorProperties ? '#FFFFFF' : '#7D7F88'

    // open Model
    const [filterModalOpen, setFilterModalOpen] = useState(false)

    // const ColorChangePrice = () => {
    //     setBtnColorPrice(!btnColorPrice)
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

    // const showResult = () =>{
    //     if (btnColorPrice == true){
    //         items.budget == demand
    //     }
    //     else if (btnColorSize == true){
    //         items.size == size
    //     }
    //     else if(btnColorLocation == true){
    //         items.societyName == societyName
    //     }
    //     else if(btnColorProperties == true){
    //         items.societyName == bedroom
    //     }
    //     else if(btnColorPrice == true && btnColorSize == true){
    //         items.budget == demand && items.size == size
    //     }
    //     else if( btnColorLocation == true && btnColorProperties == true){
    //         items.societyName == societyName && items.societyName == bedroom
    //     }
    //     else if(btnColorPrice == true && btnColorLocation == true){
    //         items.budget == demand && items.societyName == societyName
    //     }
    //     else if(btnColorSize == true && btnColorProperties == true){
    //         items.size == size  && items.societyName == bedroom
    //     }
    //     else if (btnColorPrice == true && btnColorSize == true && btnColorLocation == true){
    //         items.budget == demand && items.size == sizes && items.societyName == societyName
    //     }
    //     else if (btnColorPrice == true && btnColorSize == true && btnColorProperties == true){
    //         items.budget == demand && items.size == sizes && items.societyName == bedroom
    //     }
    //     else if (btnColorPrice == true && btnColorLocation == true && btnColorProperties == true){
    //         items.budget == demand && items.societyName == societyName &&items.societyName == bedroom
    //     }
    //     else if (btnColorSize == true && btnColorLocation == true && btnColorProperties == true){
    //         items.budget == demand && items.societyName == societyName &&items.societyName == bedroom
    //     }
    //     else if (btnColorPrice == true && btnColorSize == true && btnColorLocation == true && btnColorProperties){
    //         items.budget == demand && items.size == sizes && items.societyName == societyName && items.bedrooms == bedroom
    //     }
    // }

    LogBox.ignoreLogs([
        "[react-native-gesture-handler] Seems like you\'re using an old API with gesture components, check out new Gestures system!",
    ]);

    const id = uid()
    // console.log("id", id)

    useEffect(() => {
        // loadInventoryList()
        const unsubscribe = navigation.addListener('focus', () => {
            loadInventoryList()
            setFilterModalOpen(true)
        });

        return () => {
            unsubscribe;
        };
    }, [])

    const loadInventoryList = async () => {
        setInventoryList([]);
        setLoading(true)
        const userID = user.uid
        const response = await InventoryApi.getInventory(userID);
        // console.log("response: ", response)
        if (response && response.length > 0) {
            setInventoryList(response)
            setLoading(false)
        }
        else {
            setLoading(false)
        }
    }


    // const priceFilter = () => {
    //     const newData = priceInventoryList.filter((item) => {
    //         return item.demand <= items.budget
    //     })
    //     setFilteredData(newData)
    // }

    // const sizeFilter = () => {
    //     const newData = sizeInventoryList.filter((item) => {
    //         return item.size == items.size
    //     })
    //     setFilteredData(newData)
    // }

    // const locationFilter = () => {
    //     const newData = locationInventoryList.filter((item) => {
    //         return item.societyName == items.societyName
    //     })
    //     setFilteredData(newData)
    // }

    // const accomodationFilter = () => {
    //     const newData = propertiesInventoryList.filter((item) => {
    //         return item.rooms.bedrooms == items.bedroomsQuantity && item.rooms.bathrooms == items.bathroomQuantity
    //     })
    //     setFilteredData(newData)
    // }

    // console.log("Inventory", inventoryList)

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
                    <Text style={HeaderStyle.HeaderText}>View Inventory</Text>
                    <TouchableOpacity style={{ rotation: 90, marginRight: 5 }} onPress={() => setFilterModalOpen(true)}>
                        <Icon1 name="equalizer" color="#1A1E25" size={20} />
                    </TouchableOpacity>
                </View>
            </View>

            {/* Modal View for Filter */}
            <Modal visible={filterModalOpen} animationType='slide' transparent={true}>
                <View style={{ flex: 1, flexDirection: 'column', justifyContent: 'flex-end', alignItems: 'center' }}>
                    <View style={{ height: 330, width: "98%", backgroundColor: '#ffffff', borderTopLeftRadius: 40, borderTopRightRadius: 40, }}>
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
                            <TouchableOpacity onPress={() => { setBtnColorPrice(!btnColorPrice) }}
                                style={{ height: 48, width: "90%", backgroundColor: BtnPrice, marginVertical: 5, borderColor: '#8A72FA', borderRadius: 39, borderWidth: 1, justifyContent: 'center', alignItems: 'center' }}>
                                <Text style={{ color: textPrice, fontSize: 14, fontWeight: "700" }}>Price</Text>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={() => { setBtnColorSize(!btnColorSize) }}
                                style={{ height: 48, width: "90%", backgroundColor: BtnSize, marginVertical: 5, borderColor: '#8A72FA', borderRadius: 39, borderWidth: 1, justifyContent: 'center', alignItems: 'center' }}>
                                <Text style={{ color: textSize, fontSize: 14, fontWeight: "700" }}>Size</Text>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={() => { setBtnColorLocation(!btnColorLocation) }}
                                style={{ height: 48, width: "90%", backgroundColor: BtnLocation, marginVertical: 5, borderColor: '#8A72FA', borderRadius: 39, borderWidth: 1, justifyContent: 'center', alignItems: 'center' }}>
                                <Text style={{ color: textLocation, fontSize: 14, fontWeight: "700" }}>Location</Text>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={() => { setBtnColorProperties(!btnColorProperties) }}
                                style={{ height: 48, width: "90%", backgroundColor: BtnProperties, marginVertical: 5, borderColor: '#8A72FA', borderRadius: 39, borderWidth: 1, justifyContent: 'center', alignItems: 'center' }}>
                                <Text style={{ color: textProperties, fontSize: 14, fontWeight: "700" }}>Accomodation</Text>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={() => setFilterModalOpen(false)}
                                style={{ height: 38, width: "45%", backgroundColor: "#8A72FA", marginVertical: 10, borderColor: '#8A72FA', borderRadius: 39, borderWidth: 1, justifyContent: 'center', alignItems: 'center' }}>
                                <Text style={{ fontSize: 14, fontWeight: '700', color: "#FFFFFF" }}>Show Results</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>
            <View style={{ width: "92%", justifyContent: "space-between", margin: 15, alignSelf: "center" }}>
                <Text style={styles.screenHeading}>My Inventory</Text>
            </View>

            {
                inventoryList.length < 1 ?
                    <View>
                        <Text style={styles.emptyUserRecord}>No Match Inventory</Text>
                    </View>
                    :
                    null
            }

            {
                btnColorPrice == true ?
                    <FlatList
                        data={inventoryList}
                        keyExtractor={(stock) => stock.id}
                        renderItem={({ item }) => {
                            // Range in Price & Size with convertions
                            var value = (items.budget / 100) * 10
                            const upperPrice = parseInt(items.budget) + parseInt(value)
                            const lowerPrice = items.budget - value

                            if (lowerPrice <= item.demand && item.demand <= upperPrice) {
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
                                        viewStatus={item.viewStatus}
                                    // navigatePress={() => navigation.navigate('InventoryDetailScreen', item)}
                                    />
                                )
                            }
                        }}
                    />
                    :
                    btnColorSize == true ?
                        <FlatList
                            data={inventoryList}
                            keyExtractor={(stock) => stock.id}
                            renderItem={({ item }) => {
                                // Range in Price & Size with convertions
                                if (size_type == "Kanal") {
                                    items.size * 20
                                }
                                var uppersize = parseInt(items.size) + parseInt(2)
                                var lowerSize = items.size - 2

                                if (lowerSize <= item.size && item.size <= uppersize && item.sizeType == items.size_type) {
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
                                            viewStatus={item.viewStatus}
                                        // navigatePress={() => navigation.navigate('InventoryDetailScreen', item)}
                                        />
                                    )
                                }
                            }}
                        />
                        :
                        btnColorLocation == true ?
                            <FlatList
                                data={inventoryList}
                                keyExtractor={(stock) => stock.id}
                                renderItem={({ item }) => {
                                    if (item.societyName == items.societyName) {
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
                                                viewStatus={item.viewStatus}
                                            // navigatePress={() => navigation.navigate('InventoryDetailScreen', item)}
                                            />
                                        )
                                    }
                                }}
                            />
                            :
                            btnColorProperties == true ?
                                <FlatList
                                    data={inventoryList}
                                    keyExtractor={(stock) => stock.id}
                                    renderItem={({ item }) => {
                                        if (item.rooms.bedrooms == items.bedroomsQuantity && item.rooms.bathrooms == items.bathroomQuantity) {
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
                                                    viewStatus={item.viewStatus}
                                                // navigatePress={() => navigation.navigate('InventoryDetailScreen', item)}
                                                />
                                            )
                                        }
                                    }}
                                />
                                :
                                btnColorPrice == true && btnColorSize == true ?
                                    <FlatList
                                        data={inventoryList}
                                        keyExtractor={(stock) => stock.id}
                                        renderItem={({ item }) => {
                                            // Range in Price & Size with convertions
                                            var value = (items.budget / 100) * 10
                                            const upperPrice = parseInt(items.budget) + parseInt(value)
                                            const lowerPrice = items.budget - value
                                            if (size_type == "Kanal") {
                                                items.size * 20
                                            }
                                            var uppersize = parseInt(items.size) + parseInt(2)
                                            var lowerSize = items.size - 2

                                            if ((lowerPrice <= item.demand && item.demand <= upperPrice) && ((lowerSize <= item.size && item.size <= uppersize) && item.sizeType == items.size_type)) {
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
                                                        viewStatus={item.viewStatus}
                                                    // navigatePress={() => navigation.navigate('InventoryDetailScreen', item)}
                                                    />
                                                )
                                            }
                                        }}
                                    />
                                    :
                                    btnColorLocation == true && btnColorProperties == true ?
                                        <FlatList
                                            data={inventoryList}
                                            keyExtractor={(stock) => stock.id}
                                            renderItem={({ item }) => {
                                                if (item.societyName == items.societyName && item.rooms.bedrooms == items.bedroomsQuantity && item.rooms.bathrooms == items.bathroomQuantity) {
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
                                                            viewStatus={item.viewStatus}
                                                        // navigatePress={() => navigation.navigate('InventoryDetailScreen', item)}
                                                        />
                                                    )
                                                }
                                            }}
                                        />
                                        :
                                        btnColorPrice == true && btnColorLocation == true ?
                                            <FlatList
                                                data={inventoryList}
                                                keyExtractor={(stock) => stock.id}
                                                renderItem={({ item }) => {
                                                    // Range in Price & Size with convertions
                                                    var value = (items.budget / 100) * 10
                                                    const upperPrice = parseInt(items.budget) + parseInt(value)
                                                    const lowerPrice = items.budget - value
                                                    if ((lowerPrice <= item.demand && item.demand <= upperPrice) && (item.societyName == items.societyName)) {
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
                                                                viewStatus={item.viewStatus}
                                                            // navigatePress={() => navigation.navigate('InventoryDetailScreen', item)}
                                                            />
                                                        )
                                                    }
                                                }}
                                            />
                                            :
                                            btnColorSize == true && btnColorProperties == true ?
                                                <FlatList
                                                    data={inventoryList}
                                                    keyExtractor={(stock) => stock.id}
                                                    renderItem={({ item }) => {
                                                        // Range in Price & Size with convertions
                                                        if (size_type == "Kanal") {
                                                            items.size * 20
                                                        }
                                                        var uppersize = parseInt(items.size) + parseInt(2)
                                                        var lowerSize = items.size - 2
                                                        if ((lowerSize <= item.size && item.size <= uppersize && item.sizeType == items.size_type) && (item.rooms.bedrooms == items.bedroomsQuantity && item.rooms.bathrooms == items.bathroomQuantity)) {
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
                                                                    viewStatus={item.viewStatus}
                                                                // navigatePress={() => navigation.navigate('InventoryDetailScreen', item)}
                                                                />
                                                            )
                                                        }
                                                    }}
                                                />
                                                :
                                                btnColorPrice == true && btnColorProperties == true ?
                                                    <FlatList
                                                        data={inventoryList}
                                                        keyExtractor={(stock) => stock.id}
                                                        renderItem={({ item }) => {
                                                            // Range in Price & Size with convertions
                                                            var value = (items.budget / 100) * 10
                                                            const upperPrice = parseInt(items.budget) + parseInt(value)
                                                            const lowerPrice = items.budget - value
                                                            if ((lowerPrice <= item.demand && item.demand <= upperPrice) && (item.rooms.bedrooms == items.bedroomsQuantity && item.rooms.bathrooms == items.bathroomQuantity)) {
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
                                                                        viewStatus={item.viewStatus}
                                                                    // navigatePress={() => navigation.navigate('InventoryDetailScreen', item)}
                                                                    />
                                                                )
                                                            }
                                                        }}
                                                    />
                                                    :
                                                    btnColorSize == true && btnColorLocation == true ?
                                                        <FlatList
                                                            data={inventoryList}
                                                            keyExtractor={(stock) => stock.id}
                                                            renderItem={({ item }) => {
                                                                // Range in Price & Size with convertions
                                                                if (size_type == "Kanal") {
                                                                    items.size * 20
                                                                }
                                                                var uppersize = parseInt(items.size) + parseInt(2)
                                                                var lowerSize = items.size - 2
                                                                if ((lowerSize <= item.size && item.size <= uppersize && item.sizeType == items.size_type) && (item.societyName == items.societyName)) {
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
                                                                            viewStatus={item.viewStatus}
                                                                        // navigatePress={() => navigation.navigate('InventoryDetailScreen', item)}
                                                                        />
                                                                    )
                                                                }
                                                            }}
                                                        />
                                                        :
                                                        btnColorPrice == true && btnColorSize == true && btnColorLocation == true ?
                                                            <FlatList
                                                                data={inventoryList}
                                                                keyExtractor={(stock) => stock.id}
                                                                renderItem={({ item }) => {
                                                                    // Range in Price & Size with convertions
                                                                    var value = (items.budget / 100) * 10
                                                                    const upperPrice = parseInt(items.budget) + parseInt(value)
                                                                    const lowerPrice = items.budget - value
                                                                    if (size_type == "Kanal") {
                                                                        items.size * 20
                                                                    }
                                                                    var uppersize = parseInt(items.size) + parseInt(2)
                                                                    var lowerSize = items.size - 2
                                                                    if ((lowerPrice <= item.demand && item.demand <= upperPrice) && (lowerSize <= item.size && item.size <= uppersize && item.sizeType == items.size_type) && (item.societyName == items.societyName)) {
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
                                                                                viewStatus={item.viewStatus}
                                                                            // navigatePress={() => navigation.navigate('InventoryDetailScreen', item)}
                                                                            />
                                                                        )
                                                                    }
                                                                }}
                                                            />
                                                            :
                                                            btnColorPrice == true && btnColorSize == true && btnColorProperties == true ?
                                                                <FlatList
                                                                    data={inventoryList}
                                                                    keyExtractor={(stock) => stock.id}
                                                                    renderItem={({ item }) => {
                                                                        // Range in Price & Size with convertions
                                                                        var value = (items.budget / 100) * 10
                                                                        const upperPrice = parseInt(items.budget) + parseInt(value)
                                                                        const lowerPrice = items.budget - value
                                                                        if (size_type == "Kanal") {
                                                                            items.size * 20
                                                                        }
                                                                        var uppersize = parseInt(items.size) + parseInt(2)
                                                                        var lowerSize = items.size - 2

                                                                        if ((lowerPrice <= item.demand && item.demand <= upperPrice) && (lowerSize <= item.size && item.size <= uppersize && item.sizeType == items.size_type) && (item.rooms.bedrooms == items.bedroomsQuantity && item.rooms.bathrooms == items.bathroomQuantity)) {
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
                                                                                    viewStatus={item.viewStatus}
                                                                                // navigatePress={() => navigation.navigate('InventoryDetailScreen', item)}
                                                                                />
                                                                            )
                                                                        }
                                                                    }}
                                                                />
                                                                :
                                                                btnColorPrice == true && btnColorLocation == true && btnColorProperties == true ?
                                                                    <FlatList
                                                                        data={inventoryList}
                                                                        keyExtractor={(stock) => stock.id}
                                                                        renderItem={({ item }) => {
                                                                            // Range in Price & Size with convertions
                                                                            var value = (items.budget / 100) * 10
                                                                            const upperPrice = parseInt(items.budget) + parseInt(value)
                                                                            const lowerPrice = items.budget - value

                                                                            if ((lowerPrice <= item.demand && item.demand <= upperPrice) && (item.societyName == items.societyName) && (item.rooms.bedrooms == items.bedroomsQuantity && item.rooms.bathrooms == items.bathroomQuantity)) {
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
                                                                                        viewStatus={item.viewStatus}
                                                                                    // navigatePress={() => navigation.navigate('InventoryDetailScreen', item)}
                                                                                    />
                                                                                )
                                                                            }
                                                                        }}
                                                                    />
                                                                    :
                                                                    btnColorSize == true && btnColorLocation == true && btnColorProperties == true ?
                                                                        <FlatList
                                                                            data={inventoryList}
                                                                            keyExtractor={(stock) => stock.id}
                                                                            renderItem={({ item }) => {
                                                                                // Range in Price & Size with convertions
                                                                                if (size_type == "Kanal") {
                                                                                    items.size * 20
                                                                                }
                                                                                var uppersize = parseInt(items.size) + parseInt(2)
                                                                                var lowerSize = items.size - 2

                                                                                if ((lowerSize <= item.size && item.size <= uppersize && item.sizeType == items.size_type) && (item.societyName == items.societyName) && (item.rooms.bedrooms == items.bedroomsQuantity && item.rooms.bathrooms == items.bathroomQuantity)) {
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
                                                                                            viewStatus={item.viewStatus}
                                                                                        // navigatePress={() => navigation.navigate('InventoryDetailScreen', item)}
                                                                                        />
                                                                                    )
                                                                                }
                                                                            }}
                                                                        />
                                                                        :
                                                                        btnColorPrice == true && btnColorSize == true && btnColorLocation == true && btnColorProperties == true ?
                                                                            <FlatList
                                                                                data={inventoryList}
                                                                                keyExtractor={(stock) => stock.id}
                                                                                renderItem={({ item }) => {
                                                                                    // Range in Price & Size with convertions
                                                                                    var value = (items.budget / 100) * 10
                                                                                    const upperPrice = parseInt(items.budget) + parseInt(value)
                                                                                    const lowerPrice = items.budget - value
                                                                                    if (size_type == "Kanal") {
                                                                                        items.size * 20
                                                                                    }
                                                                                    var uppersize = parseInt(items.size) + parseInt(2)
                                                                                    var lowerSize = items.size - 2

                                                                                    if ((lowerPrice <= item.demand && item.demand <= upperPrice) && (lowerSize <= item.size && item.size <= uppersize && item.sizeType == items.size_type) && (item.societyName == items.societyName) && (item.rooms.bedrooms == items.bedroomsQuantity && item.rooms.bathrooms == items.bathroomQuantity)) {
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
                                                                                                viewStatus={item.viewStatus}
                                                                                            // navigatePress={() => navigation.navigate('InventoryDetailScreen', item)}
                                                                                            />
                                                                                        )
                                                                                    }
                                                                                }}
                                                                            />
                                                                            :
                                                                            <FlatList
                                                                                data={inventoryList}
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
                                                                                            viewStatus={item.viewStatus}
                                                                                        // navigatePress={() => navigation.navigate('InventoryDetailScreen', item)}
                                                                                        />
                                                                                    )
                                                                                }
                                                                                }
                                                                            />

            }


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
