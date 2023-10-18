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
    ScrollView,
    Button,
    Dimensions,
    BackHandler,
    FlatList,
    RefreshControl,
    Modal
} from 'react-native';

import { WelcomeScreenStyles } from '../../constants/Styles'
import { HeaderStyle } from '../../constants/Styles';
import TaskApi from '../../api/TasksRequest'
import { AuthContext } from '../../auth/AuthProvider'

import firestore from '@react-native-firebase/firestore'

import InventoryApi from '../../api/InventoryAPIs/CreateInventory'
// import LeadsApi from '../../api/TasksRequest'

import Icon from 'react-native-vector-icons/AntDesign';
import Icon1 from 'react-native-vector-icons/EvilIcons';
import Icon2 from 'react-native-vector-icons/FontAwesome'
import DateTimePicker from '@react-native-community/datetimepicker';
import Spinner from 'react-native-loading-spinner-overlay';

import { Picker } from '@react-native-picker/picker';
import { NotificationApi } from '../../services';

import PermissionAPI from '../../api/PermissionsAPIs/checkUserAPI'



const InventoryCard = ({ propertyImg,propertyType, houseName, address, rooms, area, areatype, rent, transactionType }) => {
    return (
        <View style={{ ...inventoryModalStyles.card, height: 140, width: "92%" }}>
        <View style={inventoryModalStyles.imageContainer}>
            {
                propertyImg ?
                    <Image
                        source={{ uri: propertyImg }}
                        style={{ width: '100%', height: '100%' }}
                        resizeMode='stretch'
                    />
                    :
                    <Image
                        //source={require('../assets/images/image2.jpg')}
                        source={require('../../assets/images/nommage.jpg')}
                        style={{ width: '100%', height: '100%' }}
                        resizeMode='contain'
                    />
            }

        </View>
        <View style={inventoryModalStyles.detailsContainer}>
            <Text numberOfLines={1} style={{ ...inventoryModalStyles.houseName, width: "80%", marginTop: 10 }}>{houseName}</Text>
            <Text numberOfLines={1} style={{ ...inventoryModalStyles.houseAddress, width: "90%" }}>{address}</Text>
            <Text style={inventoryModalStyles.property}>{propertyType}</Text>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', width: '80%', alignItems: 'center' }}>
                {
                    propertyType == 'Plot' || propertyType == 'Files' || propertyType == 'Shop' || propertyType == 'Agriculture' ?
                        null
                        :

                        <>

                            <Icon2
                                name='bed'
                                color='#7D7F88'
                                size={14}
                                style={{ marginRight: 5 }}
                            />
                            <View style={{ width: "30%" }}>

                                <Text numberOfLines={1} style={{ ...inventoryModalStyles.houseAddress }}>{rooms} Rooms</Text>
                            </View>
                        </>
                }
                <View style={{ flexDirection: "row", alignItems: "center", }}>

                    <Icon2
                        name='home'
                        color='#7D7F88'
                        size={14}
                        style={{ marginRight: 5 }}
                    />
                    <View style={{ width: "70%" }}>

                        <Text numberOfLines={1} style={{ ...inventoryModalStyles.houseAddress }}>{area + " " + areatype}</Text>
                    </View>
                </View>
                {/* <Icon2
                    name='home'
                    color='#7D7F88'
                    size={14}
                />
                <Text style={inventoryModalStyles.houseAddress}>{area + " " + areatype}</Text> */}
            </View>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', width: '90%', alignItems: 'center', marginBottom: 10 }}>
                <Text style={inventoryModalStyles.houseRent}>Rs. {rent.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                    {
                        transactionType == "Sale" ?
                            <Text style={inventoryModalStyles.rentType}></Text>
                            :
                            <Text style={inventoryModalStyles.rentType}>/ month</Text>
                    }
                </Text>
                {/* <Text style={inventoryModalStyles.typeText}>Inventory</Text> */}
            </View>
        </View>
    </View>
    )
}

const LeadCard = ({ name, size, type, mobile, transaction }) => {
    return (
        <View style={{ ...leadModalStyles.card, width: "92%", marginTop: 20 }}>


            <View style={{ flex: 1, marginBottom: 10 }}>
                <Text style={leadModalStyles.name}>{name}</Text>
                <Text style={{ ...leadModalStyles.size, marginTop: 10 }}>{size} {type}</Text>
            </View>
            <View style={{ flex: 1, marginBottom: 10 }}>
                <Text style={leadModalStyles.phone}>{mobile}</Text>
                <Text style={{ ...leadModalStyles.size, marginTop: 10, textAlign: "right", marginRight: 20 }}>{transaction}</Text>
            </View>

        </View>
    )
}

const InventoryDetailsCard = ({ propertyImg,propertyType, houseName, address, rooms, area, areatype, rent, transactionType, backPress }) => {
    return (
      
        <View style={inventoryModalStyles.card}>
        <View style={inventoryModalStyles.imageContainer}>
            {
                propertyImg ?
                    <Image
                        source={{ uri: propertyImg }}
                        style={{ width: '100%', height: '100%' }}
                        resizeMode='stretch'
                    />
                    :
                    <Image
                        //source={require('../assets/images/image2.jpg')}
                        source={require('../../assets/images/nommage.jpg')}
                        style={{ width: '100%', height: '100%' }}
                        resizeMode='contain'
                    />
            }
        </View>
        <View style={inventoryModalStyles.detailsContainer}>
            <TouchableOpacity
                style={inventoryModalStyles.AddTaskButton}
                onPress={backPress}
            >
                <Text style={inventoryModalStyles.AddTaskButtonText}>Add to Task</Text>
            </TouchableOpacity>
            <Text numberOfLines={1} style={{ ...inventoryModalStyles.houseName, width: "80%", marginTop: 5 }}>{houseName}</Text>
            <Text numberOfLines={1} style={{ ...inventoryModalStyles.houseAddress, width: "80%" }}>{address}</Text>
            <Text style={inventoryModalStyles.property}>{propertyType}</Text>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', width: "80%", alignItems: 'center' }}>


                {
                    propertyType == 'Plot' || propertyType == 'Files' || propertyType == 'Shop' || propertyType == 'Agriculture' ?
                        null
                        :

                        <>
                            <Icon2
                                name='bed'
                                color='#7D7F88'
                                size={14}
                                style={{ marginRight: 5 }}
                            />
                            <View style={{ width: "30%" }}>
                                <Text numberOfLines={1} style={{ ...inventoryModalStyles.houseAddress }}>{rooms} Rooms</Text>
                            </View>
                        </>

                }


                <View style={{ flexDirection: "row", alignItems: "center", }}>

                    <Icon2
                        name='home'
                        color='#7D7F88'
                        size={14}
                        style={{ marginRight: 5 }}
                    />
                    <View style={{ width: "70%" }}>

                        <Text numberOfLines={1} style={{ ...inventoryModalStyles.houseAddress }}>{area + " " + areatype}</Text>
                    </View>
                </View>
            </View>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', width: '90%', alignItems: 'center', marginBottom: 10 }}>
                <Text numberOfLines={1} style={inventoryModalStyles.houseRent}>Rs. {rent.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                    {
                        transactionType == "Sale" ?
                            <Text style={inventoryModalStyles.rentType}></Text>
                            :
                            <Text style={inventoryModalStyles.rentType}>/ month</Text>
                    }

                </Text>
                {/* <Text style={styles.typeText}>Inventory</Text> */}
            </View>
        </View>
    </View>
    )
}

const LeadDetailsCard = ({ name, size, type, mobile, backPress }) => {
    return (
        <View style={leadModalStyles.card}>


            <View style={{ flex: 1, marginBottom: 10 }}>
                <Text style={leadModalStyles.name}>{name}</Text>
                <Text style={{ ...leadModalStyles.size, marginTop: 10 }}>{size} {type}</Text>
            </View>
            <View style={{ flex: 1, marginBottom: 10 }}>
                <Text style={leadModalStyles.phone}>{mobile}</Text>
                <TouchableOpacity style={{ ...leadModalStyles.button, marginTop: 10 }} onPress={backPress}>
                    <Text style={leadModalStyles.buttonText}>Add to task</Text>
                </TouchableOpacity>
            </View>

        </View>
    )
}



export default function CreateTask({ navigation, route }) {
    const { user } = useContext(AuthContext);

    const { type, businessID } = route.params
    // const LeadData = route.params && route.params.type === "Leads" ? route.params.item : undefined
    // const InventoryData = route.params && route.params.type === "Inventory" ? route.params.item : undefined
    // setLeads(items)
    // const inventory = items.

    const [btnMeetingColor, setBtnMeetingColor] = useState(false)
    const [btnCallColor, setBtnCallColor] = useState(true)
    const [btnToDoColor, setBtnToDoColor] = useState(false)
    const [btnSiteVisitColor, setBtnSiteVisitColor] = useState(false)

    const [leads, setLeads] = useState()
    const [inventories, setInventories] = useState()


    const [currentDate, setCurrentDate] = useState('');

    useEffect(() => {
        var date = new Date().getDate(); //Current Date
        var month = new Date().getMonth() + 1; //Current Month
        var year = new Date().getFullYear(); //Current Year
        setCurrentDate(
            month + '/' + date + '/' + year
        );
    }, []);



    const [btnNewColor, setBtnNewColor] = useState(true)
    const [btnDoneColor, setBtnDoneColor] = useState(false)
    const [btnLateColor, setBtnLateColor] = useState(false)
    const [btnPendingColor, setBtnPendingColor] = useState(false)

    const [btnHighColor, setBtnHighColor] = useState(false)
    const [btnMediumColor, setBtnMediumColor] = useState(true)
    const [btnLowColor, setBtnLowColor] = useState(false)

    const [subject, setSubject] = useState("Call")
    const [status, setStatus] = useState("New")
    const [priorty, setPriorty] = useState("Medium")
    let today = new Date().toLocaleDateString()
    let todayTime = new Date().toLocaleTimeString()

    const [loading, setLoading] = useState(false)

    const [note, setNote] = useState('')

    const [title, setTitle] = useState('')
    // modal states
    const [inventoryModal, setInventoryModal] = useState(false)
    const [leadModal, setLeadModal] = useState(false)

    // date states
    const [date, setDate] = useState(new Date());
    const [mode, setMode] = useState('date');
    const [show, setShow] = useState(false);


    // inventory filter
    const [filterSale, setFilterSale] = useState(true)
    const [filterLet, setFilterLet] = useState(false)

    const [inventoryList, setInventoryList] = useState([])
    const [totalProperties, setTotalProperties] = useState(0)


    // lead filter
    const [filterLeadSale, setFilterLeadSale] = useState(true)
    const [filterLeadLet, setFilterLeadLet] = useState(false)
    const [filterLeadBuy, setFilterLeadBuy] = useState(false)
    const [filterLeadRent, setFilterLeadRent] = useState(false)

    const [leadList, setLeadList] = useState([])
    const [totalLeads, setTotalLeads] = useState(0)

    const [properDate, setProperDate] = useState(today)
    const [properTime, setProperTime] = useState(todayTime)


    // Task Reassign to Lead
    const [value, setValue] = useState("")
    const [salePerson, setSalePerson] = useState(user.displayName)
    const [personalUser, setPersonalUser] = useState([])
    const [userType, setUserType] = useState("")
    const [reassignId, setReassignId] = useState("")
    const [oneDeviceToken, setOneDeviceToken] = useState("")

    useEffect(() => {
        getUsers()
        checkPermissions()
    }, [])

    const sendNotification = async () => {
        if (oneDeviceToken !== "") {
            try {
                let res = await NotificationApi("Task Assign", `${user.displayName} assign new a Task to you`, oneDeviceToken)
                console.log("notification responce: ", res)
                if (res.msg === "Successfully") {
                    navigation.goBack()
                }
                else {
                    alert("Notication not Send But Task created")
                    navigation.goBack()
                }
            } catch (error) {
                alert("Error in Notification But task has been created")
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
    }      // Upper Code for Task Reassign



    const onChange = (event, selectedDate) => {
        const currentDate = selectedDate || date;
        setShow(false);
        setDate(currentDate);

        console.log("date>>>>>", date)

        let tempDate = new Date(currentDate)

        console.log("temp date", tempDate.toLocaleDateString())

        let fDate = (tempDate.getMonth() + 1) + "/" + tempDate.getDate() + "/" + tempDate.getFullYear()
        setProperDate(tempDate.toLocaleDateString())
        let fTime = tempDate.getHours() + ':' + tempDate.getMinutes();
        setProperTime(fTime)
    };

    // check user admin or agent
    const checkPermissionsc = async () => {                              // add c at end of "checkPermissionsc" 
        const response = await PermissionAPI.checkUserType(user.uid)
        console.log("response permissions", response)
        if (response && response == 1) {
            console.log(">>>>>>>>>>>>>> in side if")
            const respone = await PermissionAPI.checkAccessType(user.uid)
            console.log("access", respone)
            setAccessType(respone)
            getAllTasks(respone.user_role, respone.businessID)
        }
        else {
            getAllTasks("business", user.uid)
        }
    }


    // const onChange = (event, selectedDate) => {
    //     const currentDate = selectedDate;
    //     setShow(false);
    //     setDate(currentDate);
    // };

    const showMode = (currentMode) => {
        setShow(true);
        setMode(currentMode);
    };

    // const showDatepicker = () => {
    //     showMode('date');
    // };


    const ColorChangeSubjectHandler = (text) => {
        switch (true) {
            case (text == "Meeting"):
                setBtnMeetingColor(true)
                setBtnCallColor(false)
                setBtnToDoColor(false)
                setBtnSiteVisitColor(false)
                setSubject(text)
                break;
            case (text == "Call"):
                setBtnMeetingColor(false)
                setBtnCallColor(true)
                setBtnToDoColor(false)
                setBtnSiteVisitColor(false)
                setSubject(text)
                break;
            case (text == "ToDo"):
                setBtnMeetingColor(false)
                setBtnCallColor(false)
                setBtnToDoColor(true)
                setBtnSiteVisitColor(false)
                setSubject(text)
                break;
            case (text == "SiteVisit"):
                setBtnMeetingColor(false)
                setBtnCallColor(false)
                setBtnToDoColor(false)
                setBtnSiteVisitColor(true)
                setSubject(text)
                break;
            default:
                break;
        }
    }

    const ColorChangeStatusHandler = (text) => {
        switch (true) {
            case (text == "New"):
                setBtnNewColor(true)
                setBtnDoneColor(false)
                setBtnLateColor(false)
                setBtnPendingColor(false)
                setStatus(text)
                break;

            case (text == "Done"):
                setBtnNewColor(false)
                setBtnDoneColor(true)
                setBtnLateColor(false)
                setBtnPendingColor(false)
                setStatus(text)
                break;
            case (text == "Late"):
                setBtnNewColor(false)
                setBtnDoneColor(false)
                setBtnLateColor(true)
                setBtnPendingColor(false)
                setStatus(text)
                break;
            case (text == "Pending"):
                setBtnNewColor(false)
                setBtnDoneColor(false)
                setBtnLateColor(false)
                setBtnPendingColor(true)
                setStatus(text)
                break;
            default:
                break;
        }
    }

    const ColorChangePriortyHandler = (text) => {
        switch (true) {
            case (text == "High"):
                setBtnHighColor(true)
                setBtnMediumColor(false)
                setBtnLowColor(false)
                setPriorty(text)
                break;

            case (text == "Medium"):
                setBtnHighColor(false)
                setBtnMediumColor(true)
                setBtnLowColor(false)
                setPriorty(text)
                break;
            case (text == "Low"):
                setBtnHighColor(false)
                setBtnMediumColor(false)
                setBtnLowColor(true)
                setPriorty(text)
                break;
            default:
                break;

        }

    }

    const changeFilterHandler = (id) => {
        switch (id) {
            case 1:
                setFilterSale(true)
                setFilterLet(false)
                break;
            case 2:
                setFilterSale(false)
                setFilterLet(true)
                break;
        }
    }

    const changeLeadFilterHandler = (id) => {
        switch (id) {
            case 1:
                setFilterLeadSale(true)
                setFilterLeadLet(false)
                setFilterLeadBuy(false)
                setFilterLeadRent(false)
                break;
            case 2:
                setFilterLeadSale(false)
                setFilterLeadLet(true)
                setFilterLeadBuy(false)
                setFilterLeadRent(false)
                break;
            case 3:
                setFilterLeadSale(false)
                setFilterLeadLet(false)
                setFilterLeadBuy(true)
                setFilterLeadRent(false)
                break;
            case 4:
                setFilterLeadSale(false)
                setFilterLeadLet(false)
                setFilterLeadBuy(false)
                setFilterLeadRent(true)
                break;
        }
    }

    useEffect(() => {
        getInventories()
    }, [])

    const getInventories = async () => {
        const userID = user.uid
        const response = await InventoryApi.getInventory(userID);
        if (response && response.length > 0) {
            setInventoryList(response)
            // setFilteredDataSource(response)
            setTotalProperties(response.length)
            setLoading(false)
        }
        else {
            setLoading(false)
            setInventoryList([])
        }
    }

    useEffect(() => {
        getLeads()
    }, [])

    const getLeads = async () => {
        const userID = user.uid
        const response = await TaskApi.getLeadsForTasks(userID)
        if (response && response.length > 0) {
            setLeadList(response)
            setTotalLeads(response.length)
            setLoading(false)
        }
        else {
            setLoading(false)
            setLeadList([])
        }
    }


    const addInventoryToTaskHandler = (item) => {
        setInventories(item)
        setInventoryModal(false)
    }

    const addLeadToTaskHandler = (item) => {
        setLeads(item)
        setLeadModal(false)
    }




    const CreateTasks = async () => {
        setLoading(true)
        if (title !== "" && subject !== "" && status !== "" && priorty !== "") {
            try {
                const res = await TaskApi.createNewTask(
                    reassignId == "" ? user.uid : reassignId,
                    title ? title.trim() : "",
                    subject,
                    properDate,
                    properTime,
                    properDate < today ? "Late" : status,
                    priorty,
                    inventories ? inventories : null,
                    inventories ? inventories.id : null,
                    leads ? leads : null,
                    leads ? leads.id : null,
                    note ? note : "",
                    // type == "own" ? businessID : user.uid,
                    reassignId != "" ? reassignId : user.uid,
                    type,
                    user.displayName,
                    leads ? leads.leadName : null,
                    firestore.Timestamp.fromDate(new Date()),
                )
                if (res) {
                    sendNotification()
                    setLoading(false)
                    // Alert.alert("Task created")
                }
                else {
                    setLoading(false)
                }

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


    return (
        <ScrollView contentContainerStyle={{ flexGrow: 1, backgroundColor: "#FCFCFC" }} keyboardShouldPersistTaps="always">
            {
                loading ?
                    <Spinner visible={true} />
                    :
                    null
            }
            <View style={HeaderStyle.mainContainer}>

                <View style={HeaderStyle.arrowbox}>
                    <TouchableOpacity onPress={() => navigation.goBack()}>
                        <Icon name="left" color="#1A1E25" size={20} />
                    </TouchableOpacity>


                </View>

                <View style={HeaderStyle.HeaderTextContainer}>
                    <Text style={HeaderStyle.HeaderText}>Tasks</Text>
                    <Image
                        style={HeaderStyle.HeaderImage} resizeMode='contain'
                        //source={require('../../assets/images/personpic.png')}
                        source={{ uri: user.photoURL }}
                    />
                </View>
            </View>

            <View style={[styles.headingContainer, { marginTop: 35 }]}>
                <Text style={styles.headingText}>Title <Text style={{ color: 'red' }}> *</Text></Text>
                <TextInput
                    style={{ borderBottomColor: '#E2E2E2', borderBottomWidth: 1 }}
                    placeholder='Enter Title'
                    placeholderTextColor={"#A1A1A1"}
                    keyboardType="default"
                    value={title}
                    onChangeText={(value) => setTitle(value)}
                />
            </View>
            <View style={styles.headingContainer}>
                <Text style={styles.headingText}>Subject</Text>
                <View style={styles.MainBtnContainer}>
                    <TouchableOpacity onPress={() => ColorChangeSubjectHandler("Meeting")}
                        style={[styles.btnStyle, { backgroundColor: btnMeetingColor ? '#826AF7' : '#F2F2F3', }]}>
                        <Text style={[styles.btnText, { color: btnMeetingColor ? '#FFFFFF' : '#7D7F88', }]}>Meeting</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => ColorChangeSubjectHandler("Call")}
                        style={[styles.btnStyle, { backgroundColor: btnCallColor ? '#826AF7' : '#F2F2F3', }]}>
                        <Text style={[styles.btnText, { color: btnCallColor ? '#FFFFFF' : '#7D7F88', }]}>Call</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => ColorChangeSubjectHandler("ToDo")}
                        style={[styles.btnStyle, { backgroundColor: btnToDoColor ? '#826AF7' : '#F2F2F3', }]}>
                        <Text style={[styles.btnText, { color: btnToDoColor ? '#FFFFFF' : '#7D7F88', }]}>To Do</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => ColorChangeSubjectHandler("SiteVisit")}
                        style={[styles.btnStyle, { backgroundColor: btnSiteVisitColor ? '#826AF7' : '#F2F2F3', marginRight: 0 }]}>
                        <Text style={[styles.btnText, { color: btnSiteVisitColor ? '#FFFFFF' : '#7D7F88' }]}>Site Visit</Text>
                    </TouchableOpacity>
                </View>
                <View style={{ borderWidth: 1, borderColor: "#E2E2E2", marginTop: 15 }} />
            </View>

            <View style={styles.headingContainer}>
                <Text style={styles.headingText}>Due Date</Text>
                <TouchableOpacity onPress={() => showMode('date')}>
                    <View style={styles.datePickerContainer}>
                        <Text>{properDate}</Text>
                        <Image style={HeaderStyle.calendarIcon} resizeMode='contain' source={require('../../assets/images/calendar.png')} />
                    </View>
                </TouchableOpacity>

                <Text style={[styles.headingText, { marginTop: 10 }]}>Due Time</Text>
                <TouchableOpacity onPress={() => showMode('time')}>
                    <View style={styles.datePickerContainer}>
                        <Text>{properTime}</Text>
                        <Icon
                            name='clockcircleo'
                            size={20}
                            color="#876FF9"
                            style={{ marginRight: 7 }}
                        />
                    </View>
                </TouchableOpacity>
                {/* <View>

                onPress={showDatepicker} 
                </View> */}
                {show && (
                    <DateTimePicker
                        testID="dateTimePicker"
                        value={date}
                        mode={mode}
                        dateFormat="day dayofweek month"
                        // is24Hour={true}
                        onChange={onChange}
                    />

                )}

                {/* <DatePicker
                    style={styles.datePickerStyle}
                    date={date} // Initial date from state
                    mode="date" // The enum of date, datetime and time
                    placeholder="select date"
                    format="DD-MM-YYYY"
                    minDate="01-01-2016"
                    maxDate="01-01-2050"
                    confirmBtnText="Confirm"
                    cancelBtnText="Cancel"
                    customStyles={{
                        dateIcon: {
                            //display: 'none',
                            position: 'absolute',
                            left: 0,
                            top: 4,
                            marginLeft: 0,
                        },
                    }}
                    onDateChange={(date) => {
                        setDate(date);
                    }}
                    onChangeText={(value) => setDate(value)}
                /> */}
                <View style={{ borderWidth: 1, borderColor: "#E2E2E2", marginTop: 15 }} />


            </View>




            <View style={styles.headingContainer}>
                <Text style={styles.headingText}>Status</Text>
                <View style={styles.MainBtnContainer}>
                    <TouchableOpacity onPress={() => ColorChangeStatusHandler("New")}
                        style={[styles.btnStyle, { backgroundColor: btnNewColor ? '#826AF7' : '#F2F2F3', }]}>
                        <Text style={[styles.btnText, { color: btnNewColor ? '#FFFFFF' : '#7D7F88' }]}>New</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => ColorChangeStatusHandler("Done")}
                        style={[styles.btnStyle, { backgroundColor: btnDoneColor ? '#826AF7' : '#F2F2F3', }]}>
                        <Text style={[styles.btnText, { color: btnDoneColor ? '#FFFFFF' : '#7D7F88', }]}>Done</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => ColorChangeStatusHandler("Late")}
                        style={[styles.btnStyle, { backgroundColor: btnLateColor ? '#826AF7' : '#F2F2F3', }]}>
                        <Text style={[styles.btnText, { color: btnLateColor ? '#FFFFFF' : '#7D7F88', }]}>Late</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => ColorChangeStatusHandler("Pending")}
                        style={[styles.btnStyle, { backgroundColor: btnPendingColor ? '#826AF7' : '#F2F2F3', marginRight: 0 }]}>
                        <Text style={[styles.btnText, { color: btnPendingColor ? '#FFFFFF' : '#7D7F88', }]}>Pending</Text>
                    </TouchableOpacity>
                </View>
                <View style={{ borderWidth: 1, borderColor: "#E2E2E2", marginTop: 15 }} />
            </View>

            <View style={styles.headingContainer}>
                <Text style={styles.headingText}>Priorty</Text>
                <View style={styles.MainBtnContainer}>
                    <TouchableOpacity onPress={() => ColorChangePriortyHandler("High")}
                        style={[styles.btnStyle, { backgroundColor: btnHighColor ? '#826AF7' : '#F2F2F3', }]}>
                        <Text style={[styles.btnText, { color: btnHighColor ? '#FFFFFF' : '#7D7F88', }]}>High</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => ColorChangePriortyHandler("Medium")}
                        style={[styles.btnStyle, { backgroundColor: btnMediumColor ? '#826AF7' : '#F2F2F3', }]}>
                        <Text style={[styles.btnText, { color: btnMediumColor ? '#FFFFFF' : '#7D7F88' }]}>Medium</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => ColorChangePriortyHandler("Low")}
                        style={[styles.btnStyle, { backgroundColor: btnLowColor ? '#826AF7' : '#F2F2F3', }]}>
                        <Text style={[styles.btnText, { color: btnLowColor ? '#FFFFFF' : '#7D7F88', }]}>Low</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={{
                            flex: 1,
                            // backgroundColor: btnPendingColor ? '#826AF7' : '#F2F2F3',

                            // borderWidth: 1, borderColor: "#E3E3E7", height: 30, justifyContent: 'center', alignItems: 'center', borderRadius: 92,
                        }}>
                        {/* <Text style={{
                            color: btnPendingColor ? '#FFFFFF' : '#7D7F88',
                            fontSize: 12
                        }}>Pending</Text> */}
                    </TouchableOpacity>
                </View>
                <View style={{ borderWidth: 1, borderColor: "#E2E2E2", marginTop: 15 }} />
            </View>

            <View style={styles.headingContainer}>
                <Text style={styles.headingText}>
                    Note
                </Text>
                <TextInput
                    style={{ borderBottomColor: '#E2E2E2', borderBottomWidth: 1 }}
                    placeholder='Enter Note'
                    placeholderTextColor={"#A1A1A1"}
                    keyboardType="default"
                    multiline
                    numberOfLines={3}
                    value={note}
                    onChangeText={(value) => setNote(value)}
                />
            </View>


            {
                userType == 0 ?
                    <>
                        <View style={{ flexDirection: "row", justifyContent: "space-between", }}>
                            <View style={{ flex: 0.6 }}>
                                <Text style={[styles.headingText, { marginTop: 15, marginHorizontal: 14 }]}>Sale Person</Text>
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
                    :
                    null
            }


            {
                leads ?
                    // LeadData.map((leads) => (
                    <LeadCard
                        name={leads.leadName}
                        size={leads.size}
                        type={leads.size_type}
                        mobile={leads.mobile}
                        transaction={leads.property_type}
                    />
                    // ))  
                    : null
            }

            {
                inventories ?
                    <InventoryCard
                        houseName={inventories.houseName}
                        propertyImg={inventories.propertyImg}
                        rent={inventories.demand}
                        transactionType={inventories.transactionType}
                        address={inventories.societyName + ", " + inventories.cityName}
                        rooms={inventories.rooms.bedrooms}
                        area={inventories.size}
                        areatype={inventories.sizeType}
                        propertyType={inventories.propertyType}
                    />
                    : null
            }

            <TouchableOpacity onPress={CreateTasks} style={styles.SaveBtn}>
                <Text style={styles.saveBtnText}>Save</Text>
            </TouchableOpacity>

            {
                inventories ? null :
                    <TouchableOpacity style={styles.linkButton} onPress={() => setInventoryModal(true)}>
                        <Text style={styles.linkButtonText}>Link to Inventory</Text>
                    </TouchableOpacity>
            }

            {
                leads ? null :
                    <TouchableOpacity style={[styles.linkButton, { marginBottom: 15 }]} onPress={() => setLeadModal(true)}>
                        <Text style={styles.linkButtonText}>Link to Lead</Text>
                    </TouchableOpacity>
            }


            {/* Inventory Modal */}
            <Modal visible={inventoryModal} animationType='slide' transparent={true}>
                <View style={{ flex: 1 }}>
                    <View style={{ height: '20%', backgroundColor: 'grey', opacity: 0.5 }}></View>
                    <View style={{ height: '80%', marginTop: 'auto', elevation: 7 }}>
                        <View style={{
                            flex: 1, backgroundColor: '#fbfcfa', bottom: 0,
                            left: 0,
                            right: 0,
                            zIndex: 10,
                            borderTopLeftRadius: 10,
                            borderTopRightRadius: 10
                        }}
                        >
                            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                                <View />
                                <Text style={{ fontSize: 20, color: 'black', alignSelf: 'center', fontWeight: '700', marginLeft: 35, letterSpacing: 0.5 }}>Link Inventory</Text>
                                <TouchableOpacity style={[styles.closeIconContainer, { margin: 10 }]} onPress={() => setInventoryModal(false)}>
                                    <Icon1
                                        name='close'
                                        color="black"
                                        size={25}
                                    />
                                </TouchableOpacity>
                            </View>

                            <View style={inventoryModalStyles.filterContainer}>
                                <TouchableOpacity
                                    style={[inventoryModalStyles.filterButton, { backgroundColor: filterSale ? '#826AF7' : '#F2F2F3' }]}
                                    onPress={() => changeFilterHandler(1)}
                                >
                                    <Text style={[inventoryModalStyles.filterButtonText, { color: filterSale ? '#FFFFFF' : '#7D7F88' }]}>For Sale</Text>
                                </TouchableOpacity>
                                <TouchableOpacity
                                    style={[inventoryModalStyles.filterButton, { backgroundColor: filterLet ? '#826AF7' : '#F2F2F3' }]}
                                    onPress={() => changeFilterHandler(2)}
                                >
                                    <Text style={[inventoryModalStyles.filterButtonText, { color: filterLet ? '#FFFFFF' : '#7D7F88' }]}>To Let</Text>
                                </TouchableOpacity>
                            </View>

                            <Text style={inventoryModalStyles.screenHeading}>My Inventory</Text>
                            <Text style={inventoryModalStyles.totalInventory}>Total Properties: {totalProperties}</Text>

                            {
                                inventoryList.length < 0 ?
                                    <Text style={{
                                        color: '#917AFD',
                                        alignSelf: 'center',
                                        fontSize: 20,
                                        marginTop: '20%',
                                        fontWeight: "800"
                                        ,
                                    }}>You Have No Inventory</Text>
                                    : null
                            }

                            {
                                filterLet == false && filterSale == true ?
                                    <FlatList
                                        data={inventoryList}
                                        keyExtractor={(stock) => stock.id}
                                        renderItem={({ item, index }) => {
                                            if (item.transactionType == 'Sale') {
                                                return (
                                                    <InventoryDetailsCard
                                                        address={item.societyName + ", " + item.cityName}
                                                        houseName={item.houseName}
                                                        propertyImg={item.propertyImg}
                                                        catagory={item.catagory}
                                                        rent={item.demand}
                                                        rooms={item.rooms.bedrooms}
                                                        area={item.size}
                                                        areatype={item.sizeType}
                                                        transactionType={item.transactionType}
                                                        propertyType={item.propertyType}
                                                        //image="https://images.pexels.com/photos/323780/pexels-photo-323780.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
                                                        backPress={() => addInventoryToTaskHandler(item)}
                                                    />
                                                )
                                            }
                                        }}
                                        refreshControl={<RefreshControl refreshing={loading} onRefresh={getInventories} />}
                                    />
                                    :
                                    filterLet == true && filterSale == false ?
                                        <FlatList
                                            data={inventoryList}
                                            keyExtractor={(stock) => stock.id}
                                            renderItem={({ item, index }) => {
                                                if (item.transactionType == 'Let') {
                                                    return (
                                                        <InventoryDetailsCard
                                                            address={item.societyName + ", " + item.cityName}
                                                            houseName={item.houseName}
                                                            propertyImg={item.propertyImg}
                                                            catagory={item.catagory}
                                                            rent={item.demand}
                                                            rooms={item.rooms.bedrooms}
                                                            area={item.size}
                                                            areatype={item.sizeType}
                                                            transactionType={item.transactionType}
                                                            propertyType={item.propertyType}
                                                            backPress={() => addInventoryToTaskHandler(item)}
                                                        //image="https://images.pexels.com/photos/323780/pexels-photo-323780.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
                                                        // navigatePress={() => navigation.navigate('InventoryDetailScreen', item)}
                                                        />
                                                    )
                                                }
                                            }}
                                            refreshControl={<RefreshControl refreshing={loading} onRefresh={getInventories} />}
                                        />
                                        : <Text style={inventoryModalStyles.errorText}>No Inventories Found</Text>
                            }
                        </View>

                    </View>
                </View>

            </Modal>

            {/* Leads Modal */}
            <Modal visible={leadModal} animationType='slide' transparent={true}>
                <View style={{ flex: 1 }}>
                    <View style={{ height: '20%', backgroundColor: 'grey', opacity: 0.5 }}></View>
                    <View style={{ height: '80%', marginTop: 'auto', elevation: 7 }}>
                        <View style={{
                            flex: 1, backgroundColor: '#fbfcfa', bottom: 0,
                            left: 0,
                            right: 0,
                            zIndex: 10,
                            borderTopLeftRadius: 10,
                            borderTopRightRadius: 10
                        }}
                        >
                            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                                <View />
                                <Text style={{ fontSize: 20, color: 'black', alignSelf: 'center', fontWeight: '700', marginLeft: 35, letterSpacing: 0.5 }}>Link Lead</Text>
                                <TouchableOpacity style={[styles.closeIconContainer, { margin: 10 }]} onPress={() => setLeadModal(false)}>
                                    <Icon1
                                        name='close'
                                        color="black"
                                        size={25}
                                    />
                                </TouchableOpacity>
                            </View>

                            <View style={{...leadModalStyles.filterContainer, marginBottom: 30 }}>
                                <TouchableOpacity
                                    style={[leadModalStyles.filterButton, { backgroundColor: filterLeadSale ? '#826AF7' : '#F2F2F3' }]}
                                    onPress={() => changeLeadFilterHandler(1)}
                                >
                                    <Text style={[leadModalStyles.filterButtonText, { color: filterLeadSale ? '#FFFFFF' : '#7D7F88' }]}>Sale</Text>
                                </TouchableOpacity>
                                <TouchableOpacity
                                    style={[leadModalStyles.filterButton, { backgroundColor: filterLeadLet ? '#826AF7' : '#F2F2F3' }]}
                                    onPress={() => changeLeadFilterHandler(2)}
                                >
                                    <Text style={[leadModalStyles.filterButtonText, { color: filterLeadLet ? '#FFFFFF' : '#7D7F88' }]}>To Let</Text>
                                </TouchableOpacity>
                                <TouchableOpacity
                                    style={[leadModalStyles.filterButton, { backgroundColor: filterLeadBuy ? '#826AF7' : '#F2F2F3' }]}
                                    onPress={() => changeLeadFilterHandler(3)}
                                >
                                    <Text style={[leadModalStyles.filterButtonText, { color: filterLeadBuy ? '#FFFFFF' : '#7D7F88' }]}>Buy</Text>
                                </TouchableOpacity>
                                <TouchableOpacity
                                    style={[leadModalStyles.filterButton, { backgroundColor: filterLeadRent ? '#826AF7' : '#F2F2F3' }]}
                                    onPress={() => changeLeadFilterHandler(4)}
                                >
                                    <Text style={[leadModalStyles.filterButtonText, { color: filterLeadRent ? '#FFFFFF' : '#7D7F88' }]}>For Rent</Text>
                                </TouchableOpacity>
                            </View>

                            {
                                leadList.length < 0 ?
                                    <Text style={{
                                        color: '#917AFD',
                                        alignSelf: 'center',
                                        fontSize: 20,
                                        marginTop: '20%',
                                        fontWeight: "800"
                                    }}>Yo Have No Lead</Text>
                                    : null
                            }

                            {
                                filterLeadSale ?
                                    <FlatList
                                        data={leadList}
                                        keyExtractor={(stock) => stock.id}
                                        renderItem={({ item, index }) => {
                                            if (item.property_type == 'Sale') {
                                                return (
                                                    <LeadDetailsCard
                                                        name={item.leadName}
                                                        mobile={item.mobile}
                                                        size={item.size}
                                                        type={item.size_type}
                                                        backPress={() => addLeadToTaskHandler(item)}
                                                    />
                                                )
                                            }
                                        }}
                                        refreshControl={<RefreshControl refreshing={loading} onRefresh={getLeads} />}
                                    />
                                    : filterLeadBuy ?
                                        <FlatList
                                            data={leadList}
                                            keyExtractor={(stock) => stock.id}
                                            renderItem={({ item, index }) => {
                                                if (item.property_type == 'Buy') {
                                                    return (
                                                        <LeadDetailsCard
                                                            name={item.leadName}
                                                            mobile={item.mobile}
                                                            size={item.size}
                                                            type={item.size_type}
                                                            backPress={() => addLeadToTaskHandler(item)}
                                                        />
                                                    )
                                                }
                                            }}
                                            refreshControl={<RefreshControl refreshing={loading} onRefresh={getLeads} />}
                                        />
                                        : filterLeadRent ?
                                            <FlatList
                                                data={leadList}
                                                keyExtractor={(stock) => stock.id}
                                                renderItem={({ item, index }) => {
                                                    if (item.property_type == 'Rent') {
                                                        return (
                                                            <LeadDetailsCard
                                                                name={item.leadName}
                                                                mobile={item.mobile}
                                                                size={item.size}
                                                                type={item.size_type}
                                                                backPress={() => addLeadToTaskHandler(item)}
                                                            />
                                                        )
                                                    }
                                                }}
                                                refreshControl={<RefreshControl refreshing={loading} onRefresh={getLeads} />}
                                            />
                                            : filterLeadLet ?
                                                <FlatList
                                                    data={leadList}
                                                    keyExtractor={(stock) => stock.id}
                                                    renderItem={({ item, index }) => {
                                                        if (item.property_type == 'Let') {
                                                            return (
                                                                <LeadDetailsCard
                                                                    name={item.leadName}
                                                                    mobile={item.mobile}
                                                                    size={item.size}
                                                                    type={item.size_type}
                                                                    backPress={() => addLeadToTaskHandler(item)}
                                                                />
                                                            )
                                                        }
                                                    }}
                                                    refreshControl={<RefreshControl refreshing={loading} onRefresh={getLeads} />}
                                                />
                                                : null
                            }

                        </View>

                    </View>
                </View>

            </Modal>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    headingContainer: {
        width: "92%",
        alignSelf: "center",
        marginTop: 20
    },
    headingText: {
        fontSize: 14,
        fontWeight: "900",
        letterSpacing: 0.013,
        color: "#1A1E25"
    },
    MainBtnContainer: {
        flex: 1,
        flexDirection: "row",
        justifyContent: "space-between",
        marginTop: 15
    },
    btnStyle: {
        flex: 1,

        borderWidth: 1,
        borderColor: "#E3E3E7",
        height: 30,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 92,
        marginRight: 5
    },
    btnText: {
        fontWeight: "400",
        fontSize: 12,
        letterSpacing: 0.013

    },
    SaveBtn: {
        width: "92%",
        justifyContent: "center",
        alignSelf: "center",
        alignItems: 'center',
        height: 47,
        backgroundColor: "#876FF9",
        borderRadius: 10,
        marginTop: 45,
        //elevation: 9
    },
    saveBtnText: {
        color: "#FFFFFF",
        fontSize: 13,
        fontWeight: "900",
        lineHeight: 14
    },
    linkButton: {
        borderColor: '#6D52EF',
        borderWidth: 1,
        borderRadius: 10,
        marginTop: 20,
        width: "92%",
        justifyContent: "center",
        alignSelf: "center",
        alignItems: 'center',
        height: 47,
    },
    linkButtonText: {
        color: 'black',
        fontSize: 13,
        fontWeight: '900',
        fontFamily: ''
    },
    datePickerContainer: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center"
    },
    datePickerStyle: {
        width: '100%',
        backgroundColor: '#fff',
    },
    leadCard: {
        // borderColor:'red',
        // borderWidth:1,
        height: 90,
        width: '92%',
        alignSelf: 'center',
        marginTop: 20,
        flexDirection: 'row',
        backgroundColor: 'white',
        borderRadius: 10,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 4.84,
        elevation: 5,
    },
    leadName: {
        fontFamily: 'SF Pro Text',
        fontWeight: '700',
        fontSize: 16,
        color: '#1A1E25',
        letterSpacing: 0.3,
        margin: 10
    },
    leadSize: {
        fontFamily: 'SF Pro Text',
        fontWeight: '400',
        fontSize: 14,
        color: '#7D7F88',
        letterSpacing: 0.3,
        marginLeft: 10
    },
    leadPhone: {
        fontFamily: 'SF Pro Text',
        fontWeight: '400',
        fontSize: 14,
        color: '#7D7F88',
        letterSpacing: 0.3,
        margin: 10,
        alignSelf: 'flex-end'
    },
    leadButton: {
        backgroundColor: '#F2F2F3',
        width: 97,
        borderColor: '#E3E3E7',
        borderWidth: 0.8,
        borderRadius: 1,
        height: 30,
        alignItems: 'center',
        alignSelf: 'flex-end',
        justifyContent: 'center',
        // elevation: 1,
        marginRight: 10
    },
    leadButtonText: {
        fontFamily: 'Lato',
        fontStyle: 'normal',
        fontWeight: '400',
        fontSize: 12,
        color: '#7D7F88'
    },
    card: {
        width: '92%',
        alignSelf: 'center',
        // borderColor:'red',
        // borderWidth:1,
        marginBottom: 20,
        marginTop: 10,
        flexDirection: 'row',
        // padding:5,
        backgroundColor: 'white',
        height: 150,
        elevation: 4,
        borderRadius: 10,
        overflow: 'hidden',
        flex: 1
    },
    imageContainer: {
        width: '25%',
        alignItems: 'center',
        // borderColor:'green',
        // borderWidth:1
    },
    detailsContainer: {
        width: '70%',
        // borderColor:'blue',
        // borderWidth:1,
        marginLeft: 10,
        // justifyContent:'space-between'
    },
    rating: {
        color: '#1A1E25',
        fontFamily: 'SF Pro Text',
        fontWeight: '400',
        fontSize: 12,
        fontStyle: 'normal',
        // marginTop: 10
    },
    houseName: {
        color: '#1A1E25',
        fontFamily: 'SF Pro Text',
        fontWeight: '800',
        fontSize: 16,
        fontStyle: 'normal',
        marginTop: 10
    },
    houseAddress: {
        color: '#7D7F88',
        fontFamily: 'SF Pro Text',
        fontWeight: '400',
        fontSize: 13,
        fontStyle: 'normal',
        flex: 1,
        marginLeft: 3
        // marginTop: 5
    },
    houseRent: {
        color: '#1A1E25',
        fontFamily: 'SF Pro Text',
        fontWeight: '700',
        fontSize: 18,
        fontStyle: 'normal',
        marginTop: 10
        // alignSelf:'flex-end'
    },
    rentType: {
        color: '#7D7F88',
        fontFamily: 'SF Pro Text',
        fontWeight: '400',
        fontSize: 13,
        fontStyle: 'normal'
    },
    typeText: {
        color: '#826AF7',
        fontFamily: 'Lato',
        fontWeight: '900',
        fontSize: 14
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
        elevation: 3,
        alignSelf: 'flex-end',
    },
    heading: {
        fontFamily: 'Lato',
        fontWeight: '700',
        fontSize: 16,
        color: 'black',
        // margin: 10
    },
    pickerStyle: {
        backgroundColor: "white",
        color: "#7D7F88",
        justifyContent: 'center',
        width: 155,
        borderRadius: 4,
        borderColor: "#BABCBF",
        borderWidth: 1,
        elevation: 2,
        height: 35,
        marginLeft: 20
    },
})

const inventoryModalStyles = StyleSheet.create({
    filterContainer: {
        // borderColor:'red',
        // borderWidth:1, 
        flexDirection: 'row',
        marginTop: 20,
        width: 140,
        alignSelf: 'flex-end',
        justifyContent: 'space-between',
        marginRight: 15
    },
    filterButton: {
        width: 64,
        backgroundColor: '#826AF7',
        height: 30,
        borderRadius: 4,
        // alignItems:'center',
        justifyContent: 'center',
        elevation: 2
    },
    filterButtonText: {
        fontSize: 10,
        color: 'white',
        alignSelf: 'center',
        fontWeight: '400'
    },
    screenHeading: {
        color: '#1A1E25',
        fontSize: 18,
        fontWeight: '600',
        fontStyle: 'normal',
        fontFamily: 'SF Pro Text',
        letterSpacing: 0.13,
        marginTop: 10,
        marginLeft: 10
    },
    totalInventory: {
        color: '#7D7F88',
        fontFamily: 'SF Pro Text',
        fontWeight: '400',
        fontSize: 12,
        fontStyle: 'normal',
        marginTop: 5,
        marginLeft: 10,
        marginBottom: 10
    },
    card: {
        marginTop: 10,
        // borderColor:'red',
        // borderWidth:1,
        height: 170,
        marginBottom: 10,
        flexDirection: 'row',
        backgroundColor: 'white',
        elevation: 9,
        borderRadius: 10,
        overflow: 'hidden',
        width: '96%',
        alignSelf: 'center'
    },
    imageContainer: {
        width: '30%',
        alignItems: 'center',
        // borderColor:'green',
        // borderWidth:1
    },
    detailsContainer: {
        width: '70%',
        // borderColor:'blue',
        // borderWidth:1,
        marginLeft: 15,
        // justifyContent:'space-between'
    },
    rating: {
        color: '#1A1E25',
        fontFamily: 'SF Pro Text',
        fontWeight: '400',
        fontSize: 12,
        fontStyle: 'normal',
        // marginTop: 10
    },
    houseName: {
        color: '#1A1E25',
        fontFamily: 'SF Pro Text',
        fontWeight: '800',
        fontSize: 16,
        fontStyle: 'normal',
        // marginTop: 5
    },
    houseAddress: {
        color: '#7D7F88',
        fontFamily: 'SF Pro Text',
        fontWeight: '400',
        fontSize: 13,
        fontStyle: 'normal',
        marginRight: 5,
        // flex: 1,
        // marginLeft: 3
        // marginTop: 5
    },
    houseRent: {
        color: '#1A1E25',
        fontFamily: 'SF Pro Text',
        fontWeight: '700',
        fontSize: 18,
        fontStyle: 'normal',
        marginTop: 10
        // alignSelf:'flex-end'
    },
    rentType: {
        color: '#7D7F88',
        fontFamily: 'SF Pro Text',
        fontWeight: '400',
        fontSize: 13,
        fontStyle: 'normal'
    },
    AddTaskButton: {
        width: 70,
        backgroundColor: '#F0F0F1',
        height: 30,
        borderRadius: 4,
        // alignItems:'center',
        justifyContent: 'center',
        elevation: 1,
        alignSelf: "flex-end",
        marginRight: 30,
        marginTop: 10
    },
    AddTaskButtonText: {
        fontSize: 10,
        color: '#7D7F88',
        alignSelf: 'center',
        fontWeight: '400'
    },
    errorText: {
        color: '#917AFD',
        alignSelf: 'center',
        marginTop: '30%',
        fontSize: 25,
        fontWeight: 'bold',
        elevation: 6
    },
    property: {
        color: '#1A1E25',
        fontFamily: 'SF Pro Text',
        fontWeight: '400',
        fontSize: 16,
        fontStyle: 'normal',
        // flex: 1,
        // marginLeft: 3
    },


})

const leadModalStyles = StyleSheet.create({
    filterContainer: {
        // borderColor:'red',
        // borderWidth:1,
        marginTop: 20,
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '95%',
        alignSelf: 'center',

    },
    filterButton: {
        width: 85,
        backgroundColor: '#826AF7',
        height: 33,
        borderRadius: 92,
        // alignItems:'center',
        justifyContent: 'center',
        elevation: 3
    },
    filterButtonText: {
        fontSize: 12,
        color: 'white',
        alignSelf: 'center',
        fontWeight: '400',
        fontFamily: 'Lato'
    },
    card: {
        // borderColor:'red',
        // borderWidth:1,
        marginBottom: 20,
        backgroundColor: "#FFFFFF",
        flexDirection: 'row',
        justifyContent: 'space-between',
        borderRadius: 10,
        // height: 90,
        // borderColor: '#D6D6D6',
        // borderWidth: 0.6,
        width: '95%',
        elevation: 9,
        alignSelf: 'center',
        marginBottom: 10
    },
    name: {
        fontFamily: 'SF Pro Text',
        fontWeight: '700',
        fontSize: 16,
        color: '#1A1E25',
        letterSpacing: 0.3,
        margin: 10
    },
    size: {
        fontFamily: 'SF Pro Text',
        fontWeight: '400',
        fontSize: 14,
        color: '#7D7F88',
        letterSpacing: 0.3,
        marginLeft: 10
    },
    phone: {
        fontFamily: 'SF Pro Text',
        fontWeight: '400',
        fontSize: 14,
        color: '#7D7F88',
        letterSpacing: 0.3,
        margin: 10,
        alignSelf: 'flex-end'
    },
    button: {
        backgroundColor: '#F2F2F3',
        width: 97,
        borderColor: '#E3E3E7',
        borderRadius: 1,
        height: 30,
        alignItems: 'center',
        alignSelf: 'flex-end',
        justifyContent: 'center',
        elevation: 1,
        marginRight: 10
    },
    buttonText: {
        fontFamily: 'Lato',
        fontStyle: 'normal',
        fontWeight: '400',
        fontSize: 12
    }
})