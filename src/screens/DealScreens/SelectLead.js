import React, { useState, useEffect, useContext, isValidElement } from 'react';
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
    BackHandler
} from 'react-native';
import { WelcomeScreenStyles } from '../../constants/Styles'
import Icon from 'react-native-vector-icons/AntDesign';
import Icon1 from 'react-native-vector-icons/EvilIcons';
import CheckBox from '@react-native-community/checkbox';
import dealerData from '../../utils/DealerData';
import { HeaderStyle } from '../../constants/Styles';
import { color } from 'react-native-elements/dist/helpers';
import { AuthContext } from '../../auth/AuthProvider'
import DealerCard from '../../components/DealCard/DealerCard';
import Spinner from 'react-native-loading-spinner-overlay';
import firestore from '@react-native-firebase/firestore'
import LeadApi from '../../api/LeadsRequest'

export default function SelectLead({ route, navigation }) {
    const items = route.params;
    const { id } = items
    // console.log("Inventory ID: " + id)
    const { user } = useContext(AuthContext);
    const [taskData, setTaskData] = useState([])
    const [noFoundTask, setNoFoundTask] = useState("")
    const [filteredData, setFilteredData] = useState([])
    const [search, setSearch] = useState('')
    const [loading, setLoading] = useState(false)

    const [selected, setSelected] = useState([])
    const [checked, setChecked] = useState([]);
    const [lead, setLead] = useState([]);
    const [leadkey, setLeadkey] = useState([])

    // const [leadkey, setLeadkey] =useState('')
    // const leadkey =[];


    useEffect(() => {
        ShowLeads()
    }, []);

    const ShowLeads = async () => {
        let tempSale = []
        let tempRent = []
        // setLoading(true)
        const response = await LeadApi.getDealsLeads(user.uid)
        // console.log("respone>>>>>", response)
        if (response && response.length > 0) {
            setLead(response)
        }
        else {
            // setNoFoundUser("You do not have any User!")
            // setLoading(false)
            console.log("No data found")
        }    
    }
    // console.log(" User Data:", lead)

    const onChangeValue = (value,index) => {
        const newData = [...lead];
        newData[index].checked =value
        let filterArray = newData.filter(item=>{
            return  item.checked == true
        })
        setSelected(filterArray)
        // setSearchInfo(newData);
    }

    // console.log("select", selected)

    const renderItem = ({ item, index }) => {
        return (
            <TouchableOpacity style={styles.card}>
                <View style={styles.leftContaioner}>
                    <Image style={{ height: 75, width: 75, borderRadius: 20 }} source={require('../../assets/images/personpic.png')} />
                </View>

                <View style={styles.centerContainer}>
                    <Text style={styles.name}>{item.leadName}</Text>
                    <Text style={styles.phone}>{item.mobile}</Text>
                </View>

                <View style={styles.rightContainer}>

                    <CheckBox
                        checkBoxColor="red"
                        // isChecked={checked.includes(item.id)}
                        disabled={false}
                        tintColors={{ true: "#917AFD", false: "black" }}
                        value={item.checked}
                        onValueChange={(newValue) => onChangeValue(newValue,index)}
                    />
                </View>

                <View style={{ borderWidth: 0.6, marginTop: 20, marginBottom: 10, borderColor: "#D6D6D6" }} />
            </TouchableOpacity>
        )
    }
    // =================================================================================

    // useEffect(() => {
    //     getAllTasks()
    //     const unsubscribe = navigation.addListener('focus', () => {
    //         getAllTasks()
    //     });

    //     return () => {
    //       unsubscribe;
    //     };

    //   }, [])


    // const getAllTasks = async () => {
    //     console.log("user id", user.uid)
    //     setLoading(true)
    //     let tempRecord = []
    //     try {
    //         const response = await TaskApi.getTasks(user.uid)
    //         console.log("respone", response)
    //         if (response && response.length > 0) {
    //             tempRecord = response
    //             setLoading(false)

    //         }
    //         else {
    //             setNoFoundTask("You do not have any Task!")
    //             setLoading(false)

    //         }
    //         setTaskData(tempRecord)
    //     } catch (error) {
    //         console.log(error)
    //         setLoading(false)
    //     }
    // }

    const searchLeadFilter = (text) => {
        if (text) {
            //   setSearchData(false)
            const newData = taskData.filter((item) => {
                const itemData = item.subject ? item.subject.toUpperCase() : ''.toUpperCase();
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


    const Check = (text, item) => {
        // console.log(text)
        // console.log(item)
        item.push({ checked: ture })
    }



    return (
        <View style={{ flexGrow: 1, backgroundColor: "#FCFCFC" }}>
            {
                loading ?
                    <Spinner visible={true} />
                    :
                    null
            }
            <View style={HeaderStyle.mainContainer}>
                {/* Header */}
                <View style={HeaderStyle.arrowbox}>
                    <TouchableOpacity onPress={() => navigation.goBack()}>
                        <Icon name="left" color="#1A1E25" size={20} />
                    </TouchableOpacity>
                </View>
                <View style={HeaderStyle.HeaderTextContainer}>
                    <Text style={HeaderStyle.HeaderText}>Select Lead</Text>
                    <Image style={HeaderStyle.HeaderImage} resizeMode='contain' 
                        //source={require('../../assets/images/personpic.png')} 
                        source={{ uri: user.photoURL }} 
                    />
                </View>
            </View>

            {/* Search Dealer */}
            <View style={HeaderStyle.searchContainer}>
                <Icon1 name="search" color="#1A1E25" size={30} style={{ marginLeft: 10 }} />
                <TextInput style={HeaderStyle.searchText}
                    placeholder='Search lead here..'
                    placeholderTextColor={"#7D7F88"}
                    value={search}
                    onChangeText={(text) => searchLeadFilter(text)}
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

            {/* Dealer Info List */}        
            <View style={styles.mainContainer}>
                <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
                    <TouchableOpacity style={{ flex: 1, justifyContent: "center" }}  >
                        <Text style={{ fontSize: 15, fontWeight: "500", color: "#000000", letterSpacing: 0.02 }}>All Dealer</Text>
                    </TouchableOpacity>
                </View>

                <FlatList
                    data={leadkey}
                    // keyExtractor={(item)} => item.key}
                    renderItem={({ item }) => (
                        <TouchableOpacity>
                            <Text>{item.key}</Text>
                        </TouchableOpacity>
                    )}
                />
                <View style={styles.underline} />

                <View style={{ paddingTopl: 10, height: "100%" }}>
                    {/* {
                        taskData.length < 1 ?
                            <View >
                                <Text style={styles.emptyUserRecord}>{noFoundTask}</Text>
                            </View>
                            :
                            null
                    } */}
                    <FlatList
                        data={lead}
                        renderItem={renderItem}
                        keyExtractor={(item) => item.key}
                    />
                </View>
            </View>
            
            <TouchableOpacity
                style={[styles.button, {
                    backgroundColor: checked ? "#917AFD" : "grey",
                },]}
                // disabled={checked == ''}
                onPress={() => navigation.navigate("DealInfo", { id, selected })}>
                <Text style={styles.btnText}>Confirm</Text>
            </TouchableOpacity>

        </View>
    );
}

const styles = StyleSheet.create({
    mainContainer: {
        flex: 1,
        // backgroundColor: "red",
        width: "92%",
        alignSelf: 'center',
        marginTop: 25,
        marginBottom: 5,


    },
    // mainContainer: {
    //     width: "98%",
    //     alignSelf: 'center'
    // },
    underline: {
        borderWidth: 0.6,
        marginTop: 20,
        marginBottom: 10,


        borderColor: "#D6D6D6"
    },
    searchRecord: {
        color: 'red',
        // alignSelf: 'center',
        fontWeight: '500',
        // alignItems: 'center',
        fontSize: 15,

    },
    emptyUserRecord: {
        color: '#8A73FB',
        alignSelf: 'center',
        fontWeight: '800',
        alignItems: 'center',
        fontSize: 20,
        marginVertical: '20%'
    },

    button: {
        backgroundColor: "#917AFD",
        borderRadius: 10,
        alignItems: 'center',
        marginHorizontal: 15,
        marginVertical: 10,
        marginTop: 50,
    },
    btnText: {
        textAlign: 'center',
        color: 'white',
        margin: 15,
    },



    card: {
        width: '100%',
        alignSelf: 'center',
        // borderColor:'red',
        // borderWidth:1,
        marginBottom: 15,
        flexDirection: 'row',
        // padding:5,
        backgroundColor: 'white',
        height: 80,
        elevation: 5,
        borderRadius: 10,
        overflow: 'hidden',
        flex: 1
    },

    leftContaioner: {
        flex: 1,
        alignContent: 'center',
        alignItems: 'center',
    },
    centerContainer: {
        flex: 2,
        alignSelf: "center"
    },
    rightContainer: {
        flex: 1,
        alignSelf: 'center',
        alignContent: 'center',
        alignItems: 'center'
    },

    name: {
        color: "#1A1E25",
        fontSize: 14,
        fontWeight: "600",
        letterSpacing: 0.0113,
        width: "75%",
        margin: 3,
    },
    phone: {
        color: "#1A1E25",
        fontSize: 14,
        letterSpacing: 0.0113,
        width: "75%",
        margin: 3,
    },

})





{/* ==========================FlatList for custome Data============ */ }
{/* <FlatList
                        data={lead}
                        keyExtractor={(stock) => stock.id}
                        renderItem={({ item, renderItem }) => (

                            <TouchableOpacity style={styles.card}>
                                <View style={styles.leftContaioner}>
                                    <Image style={{ height: 75, width: 75, borderRadius: 20 }} source={require('../../assets/images/personpic.png')} />
                                </View>

                                <View style={styles.centerContainer}>
                                    <Text style={styles.name}>{item.leadName}</Text>
                                    <Text style={styles.phone}>{item.mobile}</Text>
                                </View>

                                <View style={styles.rightContainer}>

                                    <CheckBox
                                        checkBoxColor={'#000000'}
                                        isChecked={checked.includes(item.id)}
                                        onClick={() => {
                                            const newIds = [...checked];
                                            const index = newIds.indexOf(item.id);
                                            if (index > -1) {
                                                newIds.splice(index, 1);
                                            } else {
                                                newIds.push(item.id)
                                            }
                                            setChecked(newIds)
                                        }}
                                    />
                                </View>


                                <View style={{ borderWidth: 0.6, marginTop: 20, marginBottom: 10, borderColor: "#D6D6D6" }} />
                            </TouchableOpacity>

                        )}
                    /> */}



{/* ==========================FlatList for custome Data============ */ }
{/* <FlatList
                        data={dealerData}
                        keyExtractor={(item)=> item.id}
                        renderItem={({item}) => (
                            <DealerCard
                                 id={item.id}
                                name={item.name}
                                phone={item.Phone}
                                // source={item.image}
                            // onPress={() => navigation.navigate("DealInfo")}
                            />
                            )}                       
                    /> */}



{/* ==========================Mapfunction or ScrollView for showing data from database============ */ }

{/* <ScrollView contentContainerStyle={{ paddingTop: 10, height: "100%" }}>

                    {lead.map((leads) => {
                        return (
                            
                            <TouchableOpacity style={styles.card}>
                                <View style={styles.leftContaioner}>
                                    <Image style={{ height: 75, width: 75, borderRadius: 20 }} source={require('../../assets/images/personpic.png')} />
                                </View>

                                <View style={styles.centerContainer}>
                                    <Text style={styles.name}>{leads.leadName}</Text>
                                    <Text style={styles.phone}>{leads.mobile}</Text>
                                </View>

                                <View style={styles.rightContainer}>
                                    <CheckBox
                                        disabled={false}
                                        value={toggleCheckBox}
                                        onValueChange={(newValue) => setToggleCheckBox(newValue)}
                                        tintColors={{ true: "#917AFD", false: "black" }}
                                    />
                                </View>


                                <View style={{ borderWidth: 0.6, marginTop: 20, marginBottom: 10, borderColor: "#D6D6D6" }} />
                            </TouchableOpacity>

                        )
                    })}
                    </ScrollView> */}