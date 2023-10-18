import React, { useState, useEffect, useContext } from 'react';
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
    FlatList,
    ScrollView,
    Dimensions,
    BackHandler
} from 'react-native';
import Icon from 'react-native-vector-icons/AntDesign';
import Icon1 from 'react-native-vector-icons/EvilIcons';
import { HeaderStyle } from '../../constants/Styles';
import { AuthContext } from '../../auth/AuthProvider'
import DealLeadsCard from '../../components/DealCard/DealLeadsCard';
import Spinner from 'react-native-loading-spinner-overlay';
import LeadApi from '../../api/LeadsRequest'

export default function DealLeads({ navigation, route }) {

    const { user } = useContext(AuthContext);

    const {type, businessID} = route.params

    const [btnAllLeads, setBtnAllLeads] = useState(false)
    const [btnColorRent, setBtnColorRent] = useState(true)
    const [btnColorSale, setBtnColorSale] = useState(false)
    const [btnColorBuy, setBtnColorBuy] = useState(false)
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

    useEffect(() => {
        ShowLeads()
        const unsubscribe = navigation.addListener('focus', () => {
            ShowLeads()
        });
        return () => {
            unsubscribe;
        };
    }, [])
    
    const ShowLeads = async () => {
        let tempSale = []
        let tempRent = []
        let tempBuy = []
        let tempToLet = []
        setLoading(true)
        const response = await LeadApi.getLeads(user.uid, type, businessID)
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
            setNoFoundUser("Don't have any Deal....")
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
                    <Text style={HeaderStyle.HeaderText}>Deal Leads</Text>
                    <Image style={HeaderStyle.HeaderImage} resizeMode='contain' source={{uri: user.photoURL}} />
                </View>
            </View>

            {/* Search Container */}
            <View style={HeaderStyle.searchContainer}>
                <Icon1 name="search" color="#1A1E25" size={30} style={{ marginLeft: 10 }} />
                <TextInput style={HeaderStyle.searchText}
                    placeholder='Search Leads here...'
                    placeholderTextColor={"#7D7F88"}
                    value={search}
                    onChangeText={(text) => btnColorSale === true ? searchLeadSaleFilter(text) : btnColorRent === true ? searchLeadRentFilter(text) : btnColorBuy === true ? searchLeadBuyFilter(text) : btnColorToLet === true ? searchLeadToLetFilter(text) : null}
                // btnAllLeads == true ? searchLeadFilter(text) :
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
            <View style={{ flexDirection: 'row', justifyContent: "space-between", margin: 15, alignSelf: "flex-end", width:140 }}>
                {/* <TouchableOpacity style={{ flex: 0.34 }} onPress={() => ColorAllLeads()}>
                    <Text style={{ color: textAllLeads, fontSize: 15, fontWeight: "500", marginTop: 15 }}>All Leads</Text>
                </TouchableOpacity> */}
                {/* <View style={{ flex: 1, flexDirection: "row", justifyContent: "space-between", width:'40%'}}> */}
                    {/* <TouchableOpacity onPress={() => ColorChangeSale()}
                        style={{ flex: 1, backgroundColor: BtnSale, borderWidth: 1, borderColor: "#E3E3E7", height: 30, justifyContent: 'center', alignItems: 'center', borderRadius: 92, marginRight: 10 }}>
                        <Text style={{ color: textSale, fontSize: 12 }}>Sale</Text>
                    </TouchableOpacity> */}
                    <TouchableOpacity onPress={() => ColorChangeRent()}
                        style={{ backgroundColor: BtnRent, borderWidth: 1, borderColor: "#E3E3E7", height: 30,  borderRadius: 4, width:64,justifyContent:'center' }}>
                        <Text style={{ color: textRent, fontSize: 12,alignSelf:'center' }}>For Rent</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => ColorChangeBuy()}
                        style={{  backgroundColor: BtnBuy, borderWidth: 1, borderColor: "#E3E3E7", height: 30,  borderRadius: 4,  width:64,justifyContent:'center' }}>
                        <Text style={{ color: textBuy, fontSize: 12,alignSelf:'center' }}>Buy</Text>
                    </TouchableOpacity>
                    {/* <TouchableOpacity onPress={() => ColorChangeToLet()}
                        style={{ flex: 1, backgroundColor: BtnToLet, borderWidth: 1, borderColor: "#E3E3E7", height: 30, justifyContent: 'center', alignItems: 'center', borderRadius: 92, marginRight: 10 }}>
                        <Text style={{ color: textToLet, fontSize: 12 }}>To Let</Text>
                    </TouchableOpacity> */}
                {/* </View>     */}
            </View>

            {/* <View style={{ borderWidth: 1, borderColor: "#E2E2E2", width: "92%", alignSelf: 'center'}} /> */}
            {
                // leadData.length < 1 && btnAllLeads === true ?
                //     <View >
                //         <Text style={styles.emptyUserRecord}>{noFoundUser}</Text>
                //     </View>
                //     :
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

            {
                // btnAllLeads == true ?
                //     <FlatList
                //         data={filteredData.length > 0 ? filteredData : leadData}
                //         keyExtractor={(stock) => stock.id}
                //         renderItem={({ item }) => (
                //             <DealLeadsCard
                //                 key={item.id}
                //                 name={item.leadName}
                //                 mobile={item.mobile}
                //                 notes={item.notes}
                //                 size = {item.size}
                //                 sizeType ={item.size_type}
                //                 navigation = {()=>navigation.navigate("DealInventories", item)}
                //             />
                //         )}
                //     />
                //     :
                btnColorSale === true ?
                    <FlatList
                        data={filteredData.length > 0 ? filteredData : saleRecord}
                        keyExtractor={(stock) => stock.id}
                        renderItem={({ item }) => (
                            <DealLeadsCard
                                key={item.id}
                                name={item.leadName}
                                mobile={item.mobile}
                                notes={item.notes}
                                size={item.size}
                                sizeType={item.size_type}
                                navigation={() => navigation.navigate("DealInventories", item)}
                            />
                        )}
                    />
                    :
                    btnColorBuy === true ?
                        <FlatList
                            data={filteredData.length > 0 ? filteredData : buyRecord}
                            keyExtractor={(stock) => stock.id}
                            renderItem={({ item }) => {
                                console.log(";;;", item)
                            return(
                                <DealLeadsCard
                                    key={item.id}
                                    name={item.leadName}
                                    mobile={item.mobile}
                                    notes={item.notes}
                                    size={item.size}
                                    sizeType={item.size_type}
                                    societyName ={item.societyName}
                                    navigation={() => navigation.navigate("DealInventories", item)}
                                />
                            )}}
                        />
                        :
                        btnColorRent === true ?
                            <FlatList
                                data={filteredData.length > 0 ? filteredData : rentRecord}
                                keyExtractor={(stock) => stock.id}
                                renderItem={({ item }) => (
                                    <DealLeadsCard
                                        key={item.id}
                                        name={item.leadName}
                                        mobile={item.mobile}
                                        notes={item.notes}
                                        size={item.size}
                                        sizeType={item.size_type}
                                        societyName={item.societyName}
                                        

                                        navigation={() => navigation.navigate("DealInventories", item)}
                                    />
                                )}
                            />
                            :
                            <FlatList
                                data={filteredData.length > 0 ? filteredData : toLetRecord}
                                keyExtractor={(stock) => stock.id}
                                renderItem={({ item }) => (
                                    <DealLeadsCard
                                        key={item.id}
                                        name={item.leadName}
                                        mobile={item.mobile}
                                        notes={item.notes}
                                        size={item.size}
                                        sizeType={item.size_type}
                                        navigation={() => navigation.navigate("DealInventories", item)}
                                    />
                                )}
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
    ViewinventryBtn:
    {
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
