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
import Spinner from 'react-native-loading-spinner-overlay';

import { HeaderStyle } from '../../constants/Styles';
import { AuthContext } from '../../auth/AuthProvider'
import DealCard from '../../components/DealCard/DealCard';

import DealRequest from '../../api/DealRequest';
import PermissionAPI from '../../api/PermissionsAPIs/checkUserAPI'

export default function Deal({ navigation }) {
    const { user } = useContext(AuthContext);

    const [filteredData, setFilteredData] = useState([])
    const [search, setSearch] = useState('')
    const [noFoundDeal, setNoFoundDeal] = useState('')
    const [dealRecord, setDealRecord] = useState([])
    const [loading, setLoading] = useState(false)
    // const [leadData, setLeadData] = useState([])r

    const [accessType, setAccessType] = useState()
    const [accessBusinessID,setAccessBusinessID]=useState()

    useEffect(() => {
        checkPermissions()
        const unsubscribe = navigation.addListener('focus', () => {
            checkPermissions()
        });
        return () => {
            unsubscribe;
        };
    }, [])

    const checkPermissions = async() => {
        const response = await PermissionAPI.checkUserType(user.uid)
        // console.log("type", response)
        if(response && response == 1){
            const respone = await PermissionAPI.checkAccessType(user.uid)
            // console.log("access", respone)
            setAccessType(respone[0].user_role)
            setAccessBusinessID(respone[0].businessID)
            ShowDeal(respone[0].user_role, respone[0].businessID)
           
        }
        else{
            ShowDeal("business", user.uid)
        }
    } 

    const ShowDeal = async (access, business) => {
        setDealRecord([])
        setFilteredData([])

        // console.log("id", id)
        setLoading(true)
        const response = await DealRequest.getDeal(user.uid, access, business)
        console.log("respone>>>>>>>>>>>>>>>>", response)
        if (response && response.length > 0) {
            setDealRecord(response)
            setFilteredData(response)
            setLoading(false)
        }
        else {
            setLoading(false)
        }
        setLoading(false)
    }

    const searchLeadDealFilter = (text) => {
        if (text) {
            //   setSearchData(false)
            const newData = dealRecord.filter((item) => {
                const itemData = item.title ? item.title.toUpperCase() : ''.toUpperCase();
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
                    <Text style={HeaderStyle.HeaderText}>Deals</Text>
                    <Image style={HeaderStyle.HeaderImage} resizeMode='contain' source={{uri: user.photoURL}} />
                </View>
            </View>

            {/* Search Container */}
            <View style={HeaderStyle.searchContainer}>
                <Icon1 name="search" color="#1A1E25" size={30} style={{ marginLeft: 10 }} />
                <TextInput style={HeaderStyle.searchText}
                    placeholder='Search Deal by Title here...'
                    placeholderTextColor={"#7D7F88"}
                    value={search}
                    onChangeText={(text) => searchLeadDealFilter(text)}
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

            {/* New Deal Container */}
            <View style={{ width: "92%", justifyContent: "center", margin: 15, alignItems: 'flex-end' }}>
                <TouchableOpacity onPress={() => navigation.navigate('DealLeads',
                    {
                        "type": accessType ? accessType : "business",
                        "businessID": accessBusinessID ? accessBusinessID : user.uid
                    }
                    )}
                    style={{ backgroundColor: "#fff", borderWidth: 0.5, borderColor: "#E3E3E7", width: 90, height: 34, justifyContent: 'center', alignItems: 'center', borderRadius: 4, elevation: 2, marginRight: 10 }}
                >
                    <Text style={{ color: '#8A73FB', fontSize: 12, fontWeight: '500' }}>New Deal</Text>
                </TouchableOpacity>
            </View>

            {/* Deal Done */}
            {
                dealRecord.length < 1 ?
                    <View >
                        <Text style={styles.emptyUserRecord}>You do not have any Deal!</Text>
                    </View>
                    :
                    <FlatList
                        data={dealRecord}
                        keyExtractor={(stock) => stock.id}
                        renderItem={({ item }) => (
                            <DealCard
                                title={item.title}
                                amount={item.dealAmount}
                                transactionType ={item.inventoryDetail.transactionType}
                                navigation={() => navigation.navigate("Dealdetail", item)}
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
