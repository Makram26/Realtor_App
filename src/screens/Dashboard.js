import React, { useState, useEffect, useContext } from 'react';
import {
    Image,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
    FlatList,
    Dimensions,
    BackHandler,
    RefreshControl,
    ScrollView
} from 'react-native';
import { WelcomeScreenStyles } from '../constants/Styles';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/EvilIcons';
import Icon1 from 'react-native-vector-icons/Entypo';
import { RFPercentage, RFValue } from "react-native-responsive-fontsize";
const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;
import GetDashboardTask from '../api/GetDashboardTask';
import { AuthContext } from '../auth/AuthProvider'
import { NavigationContainer, useNavigation } from '@react-navigation/native';

import TasksCard from '../components/TasksCard';

import InventoryAPI from '../api/InventoryAPIs/CreateInventory'
import LeadAPI from '../api/LeadsRequest'
import MarketplaceAPI from '../api/MarketplaceAPI'
// import TaskAPI from '../api/TasksRequest'

import BusinessAPI from '../api/UserAPI'

import PermissionAPI from '../api/PermissionsAPIs/checkUserAPI'

import TaskApi from '../api/TasksRequest'

import firestore from '@react-native-firebase/firestore'
import DateTimePicker from '@react-native-community/datetimepicker';
import Spinner from 'react-native-loading-spinner-overlay';
import * as RNLocalize from "react-native-localize";

import messaging from '@react-native-firebase/messaging'
// import notifee from '@notifee/react-native'

var days = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wendesday",
    "Thursday",
    "Friday",
    "Saturday"
];

const StatusBox = ({ quantity, date, type, size, navigation }) => {
    return (
        <TouchableOpacity onPress={navigation}>
            <View style={styles.statusBox}>
                <View style={{ marginTop: 5, marginLeft: 15 }}>
                    <Text style={styles.statusQuantity}>{quantity}</Text>
                    {/* <Text style={styles.date}>{date}</Text> */}
                </View>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', width: '80%', alignSelf: 'center' }}>
                    <Text style={[styles.statusType, { fontSize: type == "Market" ? 15 : 16 }]}>{type}</Text>
                    {
                        type == "Inventory" ?
                            <Image
                                source={require('../assets/images/inventoryIcon.png')}
                                style={{ width: 20, height: 18, alignSelf: 'flex-start', marginLeft: 10 }}
                            />
                            : type == "Leads" ?
                                <Image
                                    source={require('../assets/images/leadIcon.png')}
                                    style={{ width: 13, height: 18, alignSelf: 'flex-start', marginLeft: 15 }}
                                />
                                :
                                type == "Market" ?
                                    <Image
                                        source={require('../assets/images/dealsIcon.png')}
                                        style={{ width: 13, height: 15, alignSelf: 'flex-start', marginLeft: 15 }}
                                    />
                                    :
                                    <Image
                                        source={require('../assets/images/tasksIcon.png')}
                                        style={{ width: 16, height: 18, alignSelf: 'flex-start', marginLeft: 18 }}
                                    />
                    }


                </View>
            </View>
        </TouchableOpacity>
    )
}

export default function Dashboard({ navigation }) {

    const { user } = useContext(AuthContext);
    const [taskData, setTaskData] = useState([])
    const [noFoundTask, setNoFoundTask] = useState("")
    const [filteredData, setFilteredData] = useState([])
    const [search, setSearch] = useState('')
    const [loading, setLoading] = useState(false)

    const [accessType, setAccessType] = useState()
    const [accessBusinessID,setAccessBusinessID]=useState()

    const [leads, setLeads] = useState(0)
    const [inventory, setInventory] = useState(0)
    const [deal, setDeal] = useState(0)
    const [task, setTask] = useState(0)

    const [businessName, setBusinessName] = useState('')
    useEffect(() => {
        checkPermissions()
        const unsubscribe = navigation.addListener('focus', () => {
            checkPermissions()
        });

        return () => {
            unsubscribe;
        };

    }, [])

    useEffect(() => {
        getInventoryAndLeads()
    }, [inventory, leads, deal, task])

    // useEffect(() => {
    //     checkPermissions()
    // }, [])

    
    // async function onDisplayNotification() {
    //     // Request permissions (required for iOS)
    //     await notifee.requestPermission()
    
    //     // Create a channel (required for Android)
    //     const channelId = await notifee.createChannel({
    //       id: 'default',
    //       name: 'Default Channel',
    //     });
    
    //     // Display a notification
    //     await notifee.displayNotification({
    //       title: 'Notification Title',
    //       body: 'Main body content of the notification',
    //       android: {
    //         channelId,
    //         smallIcon: 'name-of-a-small-icon', // optional, defaults to 'ic_launcher'.
    //         // pressAction is needed if you want the notification to open the app when pressed
    //         pressAction: {
    //           id: 'default',
    //         },
    //       },
    //     });
    //   }

    //   if (loading) {
    //     return null;
    //   }

    //   ==================

    const checkPermissions = async () => {
        const response = await PermissionAPI.checkUserType(user.uid)

        if (response && response == 1) {
            const respone = await PermissionAPI.checkAccessType(user.uid)

            setAccessType(respone[0].user_role)
            setAccessBusinessID(respone[0].businessID)
            getAllTasks(respone[0].user_role, respone[0].businessID)
        }
        else {
            getAllTasks("business", user.uid)
        }
    }

    const getAllTasks = async (access, business) => {
        setTaskData([])

        setLoading(true)
        let tempRecord = []

        try {
            const response = await TaskApi.getDashTasks(user.uid, access, business)
            if (response && response.length > 0) {
                // tempRecord = response
                setTaskData(response)
                setLoading(false)

            }
            else {
                setNoFoundTask("You do not have any recent Task!")
                setLoading(false)

            }
            // setTaskData(tempRecord)
        } catch (error) {
            console.log(error)
            setLoading(false)
        }
    }

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



    const getInventoryAndLeads = async () => {
        setLoading(true)
        const UID = user.uid
        const response = await InventoryAPI.inventoryCount(UID)
        const response1 = await LeadAPI.leadCount(UID)
        const response2 = await MarketplaceAPI.getMarketplaceCount(UID, "Pakistan")
        const response3 = await BusinessAPI.getBusinessName(UID)
        const taskResponse = await TaskApi.getTaskCount(UID)

        setInventory(response.length)
        setLeads(response1.length)
        setDeal(response2.length)
        setBusinessName(response3)
        setTask(taskResponse)
        setLoading(false)
    }




    // ======================== DateWise Search Task ======================= 

    let today = new Date().toLocaleDateString()
    const [todaydate, setTodayDate] = useState(new Date(today));
    let selectdate = new Date(today)
    const [mode, setMode] = useState('date');
    const [show, setShow] = useState(false);
    const [currentDay, setCurrentDay] = useState(days[new Date(todaydate).getDay()])

    // useEffect(() => {
    //     getTodayTask()
    //     const unsubscribe = navigation.addListener('focus', () => {
    //     setCurrentDay(days[new Date(todaydate).getDay()])
    //     setTodayDate(new Date(today))
    //         getTodayTask()
    //     });

    //     return () => {
    //         unsubscribe;
    //     };

    // }, [])


    const onChange = (event, selectedDate) => {
        // setTaskData([])
        setShow(false);
        selectdate = selectedDate
        const currentDate = selectedDate;
        setCurrentDay(days[new Date(currentDate).getDay()])
        setTodayDate(currentDate)
        checkPermissions2()
    };

    const checkPermissions2 = async () => {
        const response = await PermissionAPI.checkUserType(user.uid)
        if (response && response == 1) {
            const respone = await PermissionAPI.checkAccessType(user.uid)
            // setAccessType(respone)
            getTodayTask(respone.user_role, respone.businessID)
        }
        else {
            getTodayTask("business", user.uid)
        }
    }

    const showMode = (currentMode) => {
        setShow(true);
        setMode(currentMode);
    };

    const showDatepicker = () => {
        showMode('date');
    };

    const getTodayTask = async (access, business) => {
        setLoading(true)
        setTaskData([])
        let tempList = []


        const response = await GetDashboardTask.getDashTask(user.uid, todaydate.toLocaleDateString(), access, business)

        if (response && response.length > 0) {
            setTaskData(response)
            setLoading(false)
        }
        else {
            setNoFoundTask(`You do not have any Task!`)
            setLoading(false)
        }
        // setTaskData(tempList)
    }

    const updateStatusHandler = async (id) => {
        setLoading(true)
        try {
            firestore()
                .collection('Tasks')
                .doc(id)
                .update({
                    status: "Done"
                })
                .then(() => {
                    console.log("Task Status Updated")
                    // setStatusModalOpen(false)
                    // getAllTasks()
                    checkPermissions()
                    setLoading(false)
                    // Alert.alert("Status Updated")
                    // navigation.navigate("Leads")
                })
        } catch (err) {
            console.log(err)
            setLoading(false)
            console.log(
                "Error occured",
            )
            // Alert.alert("Error occured","Please try again")
        }
    }

    // For Test Push Notification on Multiple devices
    const sendNotification = () =>{
        firestore().collection("userToken").get().then(querySnap=>{
          const userDeviceToken = querySnap.docs.map(docSnap=>{
            return docSnap.data().token
          })
          console.log("Device Tokens :",userDeviceToken)
          fetch("https://c372-72-255-38-5.ngrok.io/send-noti",{
            method: 'post',
            headers: {
              'Content-Type': 'application/json' 
            },
            body: JSON.stringify({
              tokens: userDeviceToken
            })
          })
        })
      }


    return (
        // <ScrollView showsVerticalScrollIndicator={false} keyboardShouldPersistTaps='handled' contentContainerStyle={{ flexGrow: 1, backgroundColor: "#FCFCFC" }}>
        <ScrollView
            contentContainerStyle={{ flexGrow: 1, backgroundColor: "#FCFCFC" }}
            refreshControl={<RefreshControl refreshing={loading} onRefresh={getInventoryAndLeads} />}
        >
            {
                loading ?
                    <Spinner visible={true} />
                    :
                    null
            }
            <View style={{ width: windowWidth * 0.9, flexDirection: 'row', justifyContent: 'space-around', alignSelf: "center", marginVertical: 15 }}>
                <View style={{ flex: 0.15, height: 50, width: 50, elevation: 2, borderRadius: 10, backgroundColor: "#FDFDFD", alignItems: 'center', justifyContent: 'center' }}>
                    <TouchableOpacity onPress={() => navigation.navigate("Drawer")} >
                        <Icon name="navicon" color="#8870FA" size={40} />
                    </TouchableOpacity>
                </View>
                {/* <View style={{ flex: 0.7, flexDirection: 'row', borderColor: "#E3E3E7", borderWidth: 1, alignItems: 'center', borderRadius: 100, marginLeft: 20, marginRight: 20 }}>
                    <Icon name="search" color="#1A1E25" size={40} style={{ marginLeft: 10 }} />
                    <TextInput style={{ marginLeft: 2, width: "74%", fontSize: 12 }}
                        placeholder='Search tasks by name'
                        placeholderTextColor={"#718096"}
                        color="#000000"
                    />
                </View> */}
                <View style={{ flex: 0.7, alignItems: 'center', borderRadius: 100, marginLeft: 20, marginRight: 20, justifyContent: 'center' }}>
                    <Text style={{ alignSelf: 'center', fontSize: 16, color: '#696969', fontWeight: 'bold', letterSpacing: 1 }}>{businessName}</Text>
                </View>
                <View style={{ flex: 0.15, height: 50, width: 50, backgroundColor: "#917AFD", elevation: 2, borderRadius: 50, justifyContent: 'center', alignItems: 'center', }}>
                    <TouchableOpacity onPress={() => onDisplayNotification()}>
                    
                    <Image
                        style={{ width: 50, height: 50, borderRadius: 50 }}
                        resizeMode='contain'
                        //source={require('../../assets/images/personpic.png')}
                        source={{ uri: user.photoURL }}
                    />
                    </TouchableOpacity>
                </View>
            </View>

            <View style={{ width: '80%', alignSelf: 'center', flexDirection: 'row', justifyContent: 'space-between', flexWrap: 'wrap', backgroundColor: 'white', borderRadius: 10 }}>
                <StatusBox
                    quantity={inventory}
                    type="Inventory"
                    date="09/12/22"
                    size={false}
                    navigation={() => navigation.navigate("Inventory")}
                />

                <StatusBox
                    quantity={leads}
                    type="Leads"
                    date="09/12/22"
                    size={false}
                    navigation={() => navigation.navigate("Leads")}
                />

                <StatusBox
                    quantity={deal}
                    type="Market"
                    date="09/12/22"
                    size={false}
                    navigation= {() => navigation.navigate("MyMarketplaceScreen")}
                />
                <StatusBox
                    quantity={task}
                    type="Tasks"
                    date="09/12/22"
                    size={false}
                    navigation={() => navigation.navigate("Tasks")}
                />
            </View>

            <LinearGradient colors={["#8A72FA", "#674CEC"]} style={{ width: windowWidth * 0.9, alignSelf: "center", borderRadius: 20, elevation: 3, marginTop: 10, marginBottom: 10 }}>
                <View style={{ width: windowWidth * 0.85, alignSelf: "center", paddingVertical: 10 }}>
                    <Text style={{ fontSize: 20, fontWeight: "bold", color: "#FFFFFF" }}>Datewise Tasks</Text>
                    <View style={{ width: windowWidth, flexDirection: "row", marginTop: 10, marginBottom: 10 }}>
                        <TouchableOpacity onPress={() => showDatepicker()} style={{ width: windowWidth * 0.6, flexDirection: "row", justifyContent: "space-between", alignItems: "center", borderRadius: 10, borderWidth: 1, borderColor: "#FFFFFF", }}>
                            {/* <Text style={{ fontSize: 15, fontWeight: "600", color: "#FFFFFF" }}>Select Datewise Task</Text> */}
                            <View
                                style={{ flexDirection: "row", paddingTop: 5, paddingBottom: 5, marginLeft: 10 }}>
                                <Text style={{ fontSize: 16, color: "#FFFFFF", fontWeight: "500", letterSpacing: 0.013 }}>{currentDay}, </Text>
                                <Text style={{ fontSize: 16, color: "#FFFFFF", fontWeight: "500", letterSpacing: 0.013 }}>{todaydate.toLocaleDateString()}</Text>
                            </View>
                            <TouchableOpacity onPress={() => showDatepicker()}>
                                {/* <Image style={{ tintColor: "#FFFFFF", ...HeaderStyle.HeaderImage }} resizeMode='contain' source={require('../assets/images/calendar.png')} /> */}
                                <Icon
                                    name='calendar'
                                    color="white"
                                    size={32}
                                />
                            </TouchableOpacity>

                        </TouchableOpacity>
                        <View style={{ width: windowWidth * 0.23, marginLeft: 10 }}>
                            <TouchableOpacity
                                onPress={() => navigation.navigate("CreateTask",
                                {
                                    "type": accessType ? accessType : "business",
                                    "businessID": accessBusinessID ? accessBusinessID : user.uid
                                }
                                )}
                                style={{ flex: 1, backgroundColor: "#FDFDFD", borderWidth: 0.5, borderColor: "#E3E3E7", height: 34, justifyContent: 'center', alignItems: 'center', borderRadius: 5, elevation: 9, }}
                            >
                                <Text style={{ fontSize: 11, color: "#8A73FB", fontWeight: "500", letterSpacing: 0.013 }}>New Task</Text>
                            </TouchableOpacity>
                        </View>
                    </View>

                </View>
                {show && (
                    <DateTimePicker
                        testID="dateTimePicker"
                        value={todaydate}
                        mode={mode}
                        dateFormat="day dayofweek month"
                        onChange={onChange}
                    />
                )}


                <View style={{ width: windowWidth * 0.85, flexDirection: "row", justifyContent: "space-between", alignSelf: "center" }}>
                    {/* <View
                        style={{ flex: 1, marginRight: 15, backgroundColor: "#FDFDFD", borderWidth: 0.5, borderColor: "#E3E3E7", height: 34, justifyContent: 'center', alignItems: 'center', borderRadius: 5, elevation: 9, }}>
                        <Text style={{ fontSize: 14, color: "#8A73FB", fontWeight: "500", letterSpacing: 0.013 }}>{todaydate.toLocaleDateString()}</Text>
                    </View>

                    <View
                        style={{ flex: 1, marginRight: 15, backgroundColor: "#FDFDFD", borderWidth: 0.5, borderColor: "#E3E3E7", height: 34, justifyContent: 'center', alignItems: 'center', borderRadius: 5, elevation: 9, }}>
                        <Text style={{ fontSize: 14, color: "#8A73FB", fontWeight: "500", letterSpacing: 0.013 }}>{currentDay}</Text>
                    </View>
                    <TouchableOpacity
                        onPress={() => navigation.navigate("CreateTask")}
                        style={{ flex: 1, backgroundColor: "#FDFDFD", borderWidth: 0.5, borderColor: "#E3E3E7", height: 34, justifyContent: 'center', alignItems: 'center', borderRadius: 5, elevation: 9, }}
                    >
                        <Text style={{ fontSize: 11, color: "#8A73FB", fontWeight: "500", letterSpacing: 0.013 }}>New Task</Text>
                    </TouchableOpacity> */}
                </View>

            </LinearGradient>

            <View style={{ width: windowWidth * 0.9, alignSelf: 'center', marginTop: 10, marginBottom: 5 }}>

                <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
                    <TouchableOpacity style={{ flex: 1, justifyContent: "center" }}  >
                        <Text style={{ fontSize: 18, fontWeight: "600", color: "#000000", letterSpacing: 0.02 }}>Recent Tasks</Text>
                    </TouchableOpacity>
                </View>
                <View style={{ borderColor: '#E2E2E2', borderWidth: 0.5, marginVertical: 10 }} />

                <View style={{ paddingTop: 10 }}>
                    {/* {
                        taskData.length < 1 ?
                            <View>
                                <Text style={styles.emptyUserRecord}>{noFoundTask}</Text>
                            </View>
                        :
                            null
                    } */}
                    {/* <View> */}
                    <FlatList
                        data={taskData}
                        // initialNumToRender={20}
                        // maxToRenderPerBatch={20}
                        keyExtractor={(stock) => stock.id}
                        renderItem={({ item }) => {
                            if (item.status !== "Done" && item.date == todaydate.toLocaleDateString()) {
                                return (
                                    <TasksCard
                                        key={item.id}
                                        title={item.title}
                                        status={item.status}
                                        subject={item.subject}
                                        date={item.date}
                                        navigate={() => navigation.navigate('TaskDetail', item)}
                                        onPress={() => updateStatusHandler(item.id)}
                                    />
                                )
                            }
                        }}
                        refreshControl={<RefreshControl refreshing={false} onRefresh={getTodayTask} />}
                    />
                    {/* </View> */}
                </View>

            </View>
        </ScrollView >
    );
}
const styles = StyleSheet.create({
    Products_Check: {
        // height: 80,
        width: RFPercentage(15),
        marginLeft: RFValue(10),
        marginRight: RFValue(10),
        marginVertical: RFValue(10),

    },
    Products_Check_Image: {
        alignItems: 'center',
        backgroundColor: '#fff',
        borderRadius: 15,
        padding: 10,
        shadowColor: 'rgba(0,0,0, .4)', // IOS
        shadowOffset: { height: 1, width: 1 }, // IOS
        shadowOpacity: 1, // IOS
        shadowRadius: 1, //IOS
        // backgroundColor: '#fff',
        elevation: 20, // Android
    },
    product_container_logo: {
        width: "40%",
        height: RFValue(50),
        alignSelf: 'center',
        tintColor: "#3827B4"
    },
    emptyUserRecord: {
        color: '#8A73FB',
        alignSelf: 'center',
        fontWeight: '800',
        alignItems: 'center',
        fontSize: 20,
        marginVertical: '20%'
    },

    card: {
        width: '99%',
        alignSelf: 'center',
        alignContent: 'space-between',
        justifyContent: 'space-between',
        padding: 10,
        alignItems: 'center',
        marginBottom: 10,
        flexDirection: 'row',
        backgroundColor: 'white',
        height: 60,
        elevation: 2,
        borderRadius: 10,
        overflow: 'hidden',
        flex: 1
    },
    statusBox: {
        width: 142,
        borderRadius: 20,
        // borderColor:'green',
        // borderWidth:1,
        height: 107,
        justifyContent: 'space-between',
        backgroundColor: 'white',
        elevation: 4,
        marginBottom: 10
    },
    statusQuantity: {
        color: '#696969',
        fontSize: 34,
        fontFamily: 'Lato',
        fontStyle: 'normal',
        fontWeight: '500',
        // alignSelf:'center'
    },
    doneBtn:
    {
        // flex: 1.2,
        width: 90,
        backgroundColor: "#F2F2F3",
        borderRadius: 10,
        borderWidth: 0.8,
        borderColor: "#E3E3E7",
        height: 30,
        justifyContent: 'center',
        alignItems: 'center'
    },
    doneText: {
        color: "#7D7F88",
        padding: 0,
        fontSize: 12,
        fontWeight: "400",
        letterSpacing: 0.0113
        // padding: 5
    },
    date: {
        color: '#AEAEAE',
        fontSize: 14,
        fontFamily: 'Lato',
        fontStyle: 'normal',
        fontWeight: '400'
    },
    statusType: {
        color: '#404040',
        fontSize: 16,
        fontFamily: 'Lato',
        fontStyle: 'normal',
        fontWeight: '400',
        alignSelf: 'center',
        marginBottom: 5
    },
})