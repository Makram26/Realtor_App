import React, { useState, useEffect, useContext } from 'react';
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
    RefreshControl,
    Modal
} from 'react-native';
import { WelcomeScreenStyles } from '../../constants/Styles'
import Icon from 'react-native-vector-icons/AntDesign';
import Icon1 from 'react-native-vector-icons/EvilIcons';
import CrossIcon from 'react-native-vector-icons/Entypo';
import FontAwesome from 'react-native-vector-icons/FontAwesome'
import firestore from '@react-native-firebase/firestore'

import { HeaderStyle } from '../../constants/Styles';
import TaskApi from '../../api/TasksRequest'
import { AuthContext } from '../../auth/AuthProvider'
import TasksCard from '../../components/TasksCard';
import Spinner from 'react-native-loading-spinner-overlay';

import PermissionAPI from '../../api/PermissionsAPIs/checkUserAPI'
import UsersAPI from '../../api/UserSettingAPIs/UserSettingsAPI'
import DateTimePicker from '@react-native-community/datetimepicker';


const Header = ({ navigate, photoURL }) => {
    return (
        <View style={HeaderStyle.mainContainer}>
            <View style={HeaderStyle.arrowbox}>
                <TouchableOpacity onPress={navigate}>
                    <Icon name="left" color="#1A1E25" size={20} />
                </TouchableOpacity>
            </View>
            <View style={HeaderStyle.HeaderTextContainer}>
                <Text style={HeaderStyle.HeaderText}>Tasks</Text>
                <Image style={HeaderStyle.HeaderImage} resizeMode='contain' source={{ uri: photoURL }} />
            </View>
        </View>
    )
}

const LeadCard = ({
    name,
    mobile,
    assign,
    admin_id
}) => {
    return (
        <TouchableOpacity style={styles.contactCard} onPress={assign}>
            <Text style={styles.leadName}>{name}</Text>
            <View style={styles.phoneContainer}>
                <Text style={styles.phone}>{mobile}</Text>
                <View style={styles.callButton}>
                    <Text style={styles.leadName}>Reassign</Text>
                </View>
            </View>
        </TouchableOpacity>
    )
}
var days = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wendesday",
    "Thursday",
    "Friday",
    "Saturday"
];

export default function Tasks({ navigation, route }) {
    const { user } = useContext(AuthContext);
    const [taskData, setTaskData] = useState([])
    const [noFoundTask, setNoFoundTask] = useState("")
    const [filteredData, setFilteredData] = useState([])
    const [search, setSearch] = useState('')
    const [loading, setLoading] = useState(false)


    // handle date and day
    let today = new Date().toLocaleDateString()

    const [todaydate, setTodayDate] = useState(new Date(today));
    const [currentDay, setCurrentDay] = useState(days[new Date(todaydate).getDay()])
    let selectdate = new Date(today)
    const [show, setShow] = useState(false);
    const [mode, setMode] = useState('date');
    const [filterState, setFilterState] = useState(false)

    // status states
    const [newTasks, setNewTasks] = useState(true)
    const [doneTasks, setDoneTasks] = useState(false)
    const [lateTasks, setLateTasks] = useState(false)
    const [pendingTasks, setPendingTasks] = useState(false)

    // handle task and agent tasks button
    const [myTaskStatus, setMyTaskStatus] = useState(true)
    const [agentTaskStatus, setAgentTaskStatus] = useState(false)

    const [accessType, setAccessType] = useState()
    const [accessBusinessID, setAccessBusinessID] = useState()
    const [filterDateWise, setFilterDateWise] = useState([])

    const windowWidth = Dimensions.get('window').width;
    const windowHeight = Dimensions.get('window').height;



    const onChange = (event, selectedDate) => {
        console.log("<<<<<<<<<<<", event.type)
        // setTaskData([])
        if (event.type == "set") {
            setShow(false);
            selectdate = selectedDate
            const currentDate = selectedDate;
            // console.log("currentDate===>>>", currentDate)
            setCurrentDay(days[new Date(currentDate).getDay()])
            setTodayDate(currentDate)
            searchLeadFilter(currentDate.toLocaleDateString())
        }
        else {
            setShow(false);
            selectdate = selectedDate
            const currentDate = selectedDate;
            // console.log("currentDate===>>>", currentDate)
            setCurrentDay(days[new Date(currentDate).getDay()])
            setTodayDate(currentDate)
        }

        // checkPermissions2()
    };

    const changeTaskHandler = (id) => {
        switch (id) {
            case 1:
                setNewTasks(true)
                setDoneTasks(false)
                setLateTasks(false)
                setPendingTasks(false)
                break;
            case 2:
                setNewTasks(false)
                setDoneTasks(true)
                setLateTasks(false)
                setPendingTasks(false)
                break;
            case 3:
                setNewTasks(false)
                setDoneTasks(false)
                setLateTasks(true)
                setPendingTasks(false)
                break;
            case 4:
                setNewTasks(false)
                setDoneTasks(false)
                setLateTasks(false)
                setPendingTasks(true)
                break;
        }
    }

    // const items = route.params
    // console.log("Task from leads", items)

    const [showAgentModal, setAgentModal] = useState(false)

    const [users, setUsers] = useState([])

    useEffect(() => {
        // getAllTasks()
        checkPermissions()
        const unsubscribe = navigation.addListener('focus', () => {
            checkPermissions()
        });

        return () => {
            unsubscribe;
        };

    }, [])

    const checkPermissions = async () => {
        setLoading(true)
        setMyTaskStatus(true)
        setAgentTaskStatus(false)
        const response = await PermissionAPI.checkUserType(user.uid)
        // console.log("response permissions", response)
        if (response && response == 1) {
            // console.log(">>>>>>>>>>>>>> in side if")
            const respone = await PermissionAPI.checkAccessType(user.uid)
            // console.log("access", respone)
            setAccessType(respone[0].user_role)
            setAccessBusinessID(respone[0].businessID)
            getAllTasks(respone[0].user_role, respone[0].businessID)
        }
        else {
            getAllTasks("business", user.uid)
        }
    }

    const getAllTasks = async (access, business) => {
        // console.log("access >>>>>>>", accessType)
        // console.log("business in get all tasks", business)


        // console.log("user id", user.uid)

        let tempRecord = []
        try {
            const response = await TaskApi.getTasks(user.uid, access, business)
            // console.log("respone", response)
            if (response && response.length > 0) {
                tempRecord = response
                setLoading(false)
            }
            else {
                setNoFoundTask("You do not have any Task!")
                setLoading(false)

            }
            setTaskData(tempRecord)
            setFilteredData(tempRecord)
        } catch (error) {
            console.log(error)
            setLoading(false)
        }
    }

    const getUsersList = async () => {
        setLoading(true)
        // console.log("business agent id",accessBusinessID)
        const userID = user.uid
        const response = await UsersAPI.getLeadUsers(userID, accessBusinessID)
        // console.log("response>leads>>>>", response)
        if (response && response.length > 0) {
            setUsers(response)
            setLoading(false)
        }
        else {
            setLoading(false)
            setUsers([])
        }
    }

    const getMyTasks = async () => {
        setLoading(true)
        setMyTaskStatus(true)
        setAgentTaskStatus(false)
        const response = await TaskApi.getMyTasks(user.uid)
        if (response && response.length > 0) {
            // console.log("get My Task",response)
            setTaskData(response)
            setFilteredData(response)
            setLoading(false)
        } else {
            setLoading(false)
        }
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
                    // console.log("Task Status Updated")
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
            Alert.alert("Error occured", "Please try again")
        }
    }

    const searchLeadFilter = (text) => {


        const newData = filteredData.filter((item) => {
            const itemData = item.date ? item.date.toUpperCase() : ''.toUpperCase();

            const textData = text.toUpperCase()
            return itemData.indexOf(textData) > -1
        })
        setFilterDateWise(newData)
        setFilterState(true)

    }

    const closeModalHandler = () => {
        setAgentModal(false)
        setMyTaskStatus(true)
        setAgentTaskStatus(false)
    }

    const closeAgentModal = (userID) => {
        setAgentModal(false)
        getTasksAgent(userID)
    }

    const getTasksAgent = async (userID) => {

        setTaskData([])
        setFilteredData([])
        setLoading(true)
        const response = await TaskApi.getTasksByAgent(userID)
        // console.log("get agent task", response)
        if (response && response.length > 0) {
            // console.log("res >>>>>>>>>>>>>",response)
            setTaskData(response)
            setFilteredData(response)
            setLoading(false)
            setAgentModal(false)
        } else {
            // console.log("in side else")
            setLoading(false)
            setAgentModal(false)
        }
    }

    const leadsModalHandler = () => {
        setAgentModal(true)
        setMyTaskStatus(false)
        setAgentTaskStatus(true)
        getUsersList()
    }
    const showMode = (currentMode) => {
        setShow(true);
        setMode(currentMode);
    };
    const showDatepicker = () => {
        showMode('date');
    };


    const RemoveAllFilterData = () => {
        setFilterDateWise([])
        setTodayDate(new Date(today))
        setFilterState(false)
    }
    return (
        <View style={{ flex: 1, backgroundColor: "#FCFCFC" }}>
            {
                loading ?
                    <Spinner visible={true} />
                    :
                    null
            }

            <Header
                navigate={() => navigation.goBack()}
                photoURL={user.photoURL}

            />

            {/* <View style={HeaderStyle.searchContainer}>
                <Icon1 name="search" color="#1A1E25" size={30} style={{ marginLeft: 10 }} />
                <TextInput style={HeaderStyle.searchText}
                    placeholder='Search Task here..'
                    placeholderTextColor={"#7D7F88"}
                    value={search}
                    onChangeText={(text) => searchLeadFilter(text)}
                />
            </View> */}
            <Text style={{ fontSize: 15, fontWeight: "500", color: "#464646", marginTop: 15, marginBottom: 5, marginLeft: 10 }}>Datewise Tasks</Text>

            <View style={{ paddingTop: 5, paddingBottom: 5, width: windowWidth - 20, alignSelf: "center", borderColor: "#E3E3E7", borderRadius: 10, flexDirection: "row", marginBottom: 10, borderWidth: 1 }}>

                <TouchableOpacity onPress={() => showDatepicker()} style={{ width: windowWidth * 0.85, flexDirection: "row", justifyContent: "space-between", alignItems: "center", borderRadius: 10, borderWidth: 1, borderColor: "#FFFFFF", }}>
                    <View
                        style={{ flexDirection: "row", paddingTop: 5, paddingBottom: 5, marginLeft: 10 }}>
                        {/* <Text style={{ fontSize: 16, color: "#917AFD", fontWeight: "500", letterSpacing: 0.013 }}>{currentDay}, </Text> */}
                        <Text style={{ fontSize: 16, color: "#464646", fontWeight: "500", letterSpacing: 0.013 }}>{todaydate.toLocaleDateString()}</Text>
                    </View>

                </TouchableOpacity>
                {
                    filterDateWise.length > 0 || filterState ?
                        <TouchableOpacity style={{ justifyContent: "center" }} onPress={() => RemoveAllFilterData()}>
                            <CrossIcon name="circle-with-cross" color="#1A1E25" size={30} style={{ marginLeft: 5 }} />
                        </TouchableOpacity>
                        :
                        <TouchableOpacity onPress={() => showDatepicker()}>
                            <Icon
                                name='calendar'
                                color="#464646"
                                size={32}
                            />
                        </TouchableOpacity>
                }

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

            {
                filteredData.length === 0 && search.length > 0 ?
                    <View style={{ width: "92%", alignSelf: "center", marginTop: 5, marginLeft: 5 }} >
                        <Text style={styles.searchRecord}>{search} Not found!</Text>
                    </View>
                    :
                    null

            }
            <View style={styles.mainContainer}>
                <View style={styles.typeContainer}>
                    <TouchableOpacity style={[styles.type, { backgroundColor: newTasks ? '#917AFD' : '#F2F2F3' }]} onPress={() => changeTaskHandler(1)}>
                        <Text style={[styles.typeText, { color: newTasks ? 'white' : '#1A1E25' }]}>New</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={[styles.type, { backgroundColor: doneTasks ? '#917AFD' : '#F2F2F3' }]} onPress={() => changeTaskHandler(2)}>
                        <Text style={[styles.typeText, { color: doneTasks ? 'white' : '#1A1E25' }]}>Done</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={[styles.type, { backgroundColor: lateTasks ? '#917AFD' : '#F2F2F3' }]} onPress={() => changeTaskHandler(3)}>
                        <Text style={[styles.typeText, { color: lateTasks ? 'white' : '#1A1E25' }]}>Late</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={[styles.type, { backgroundColor: pendingTasks ? '#917AFD' : '#F2F2F3' }]} onPress={() => changeTaskHandler(4)}>
                        <Text style={[styles.typeText, { color: pendingTasks ? 'white' : '#1A1E25' }]}>Pending</Text>
                    </TouchableOpacity>
                </View>
                <View style={styles.underline} />

                <View style=
                    {{
                        flexDirection: 'row',
                        alignItems: 'center',
                        justifyContent: 'space-between'
                    }}
                >

                    <View style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        // justifyContent: 'space-between',
                        width: '55%'
                    }}>
                        {
                            accessType != "own" ?
                                <>
                                    <TouchableOpacity
                                        style={{
                                            borderColor: '#E3E3E7',
                                            borderWidth: 1,
                                            padding: 5,
                                            borderRadius: 5,
                                            marginRight: 10,
                                            backgroundColor: myTaskStatus ? '#917AFD' : '#F2F2F3'
                                        }}
                                        onPress={() => checkPermissions()}
                                    >
                                        <Text style={{
                                            fontSize: 12,
                                            color: 'black',
                                            fontWeight: '500',
                                            color: myTaskStatus ? 'white' : '#1A1E25'
                                        }}>My Tasks</Text>
                                    </TouchableOpacity>
                                    {/* <TouchableOpacity
                                style={{
                                    borderColor: '#E3E3E7',
                                    borderWidth: 1,
                                    padding: 5,
                                    borderRadius: 5
                                }}
                                onPress={() => checkPermissions()}
                            >
                                <Text style={{
                                    fontSize: 12,
                                    color: 'black',
                                    fontWeight: '500'
                                }}>All Tasks</Text>
                            </TouchableOpacity> */}
                                    <TouchableOpacity
                                        style={{
                                            borderColor: '#E3E3E7',
                                            borderWidth: 1,
                                            padding: 5,
                                            borderRadius: 5,
                                            backgroundColor: agentTaskStatus ? '#917AFD' : '#F2F2F3'
                                        }}
                                        onPress={() => leadsModalHandler()}
                                    >
                                        <Text style={{
                                            fontSize: 12,
                                            color: 'black',
                                            fontWeight: '500',
                                            color: agentTaskStatus ? 'white' : '#1A1E25'
                                        }}>By Agent</Text>
                                    </TouchableOpacity>
                                </>

                                :
                                null
                        }
                    </View>


                    <TouchableOpacity
                        style={{
                            flexDirection: 'row',
                            alignSelf: 'flex-end',
                            width: 80,
                            justifyContent: 'space-between',
                            alignItems: 'center'
                        }}
                        onPress={() => navigation.navigate('CreateTask',
                            {
                                "type": accessType ? accessType : "business",
                                "businessID": accessBusinessID ? accessBusinessID : user.uid
                            }
                        )}
                    >
                        <FontAwesome
                            name='plus'
                            color="#826AF7"
                            size={15}
                        />
                        <Text style={{
                            fontSize: 14,
                            fontWeight: '600',
                            fontFamily: 'Lato',
                            color: '#826AF7'
                        }}>Add Task</Text>
                    </TouchableOpacity>

                </View>

                <View style={{ paddingTop: 10 }}>
                    {
                        taskData.length < 1 ?
                            <View >
                                <Text style={styles.emptyUserRecord}>{noFoundTask}</Text>
                            </View>
                            :
                            null
                    }

                    <View style={{ marginVertical: 10 }} />

                    <FlatList
                        data={filterState ? filterDateWise : filterDateWise.length > 0 ? filterDateWise : filteredData}
                        keyExtractor={(stock) => stock.id}
                        showsVerticalScrollIndicator={false}
                        renderItem={({ item, index }) => {
                            if (item.status == 'New' && newTasks == true) {
                                return (
                                    <TasksCard
                                        key={item.id}
                                        title={item.title}
                                        status={item.status}
                                        subject={item.subject}
                                        date={item.date}
                                        onPress={() => updateStatusHandler(item.id)}
                                        navigate={() => navigation.navigate('TaskDetail', item)}
                                    />
                                )
                            }
                            else if (item.status == 'Done' && doneTasks == true) {
                                return (
                                    <TasksCard
                                        key={item.id}
                                        title={item.title}
                                        status={item.status}
                                        subject={item.subject}
                                        date={item.date}
                                        onPress={() => updateStatusHandler(item.id)}
                                        navigate={() => navigation.navigate('TaskDetail', item)}
                                    />
                                )
                            }
                            else if (item.status == 'Late' && lateTasks == true) {
                                return (
                                    <TasksCard
                                        key={item.id}
                                        title={item.title}
                                        status={item.status}
                                        subject={item.subject}
                                        date={item.date}
                                        onPress={() => updateStatusHandler(item.id)}
                                        navigate={() => navigation.navigate('TaskDetail', item)}
                                    />
                                )
                            }
                            else if (item.status == 'Pending' && pendingTasks == true) {
                                return (
                                    <TasksCard
                                        key={item.id}
                                        title={item.title}
                                        status={item.status}
                                        subject={item.subject}
                                        date={item.date}
                                        onPress={() => updateStatusHandler(item.id)}
                                        navigate={() => navigation.navigate('TaskDetail', item)}
                                    />
                                )
                            }
                        }}
                        refreshControl={<RefreshControl refreshing={false} onRefresh={checkPermissions} />}
                    />

                    {/* <FlatList
                        data={filteredData}
                        keyExtractor={(stock) => stock.id}
                        renderItem={({ item }) => (
                            <TasksCard
                                key={item.id}
                                priorty={item.priorty}
                                status={item.status}
                                subject={item.subject}
                                date={item.date}
                            // onPress={() => navigation.navigate("UpdateLeads")}
                            />
                        )}
                    /> */}
                </View>
            </View>
            <Modal visible={showAgentModal} animationType='slide' transparent={true}>
                <View style={{ backgroundColor: '#D3D3D3', opacity: 0.5, height: '40%' }}></View>
                <View style={{ height: '60%', elevation: 7, backgroundColor: 'white' }}>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                        <View />
                        <Text style={{ fontSize: 18, color: 'black', alignSelf: 'center', fontWeight: '700' }}>Select Agent</Text>
                        <TouchableOpacity
                            style={[styles.closeIconContainer, { margin: 10 }]}
                            onPress={() => closeModalHandler()}
                        >
                            <Icon1
                                name='close'
                                color="black"
                                size={25}
                            />
                        </TouchableOpacity>
                    </View>

                    {
                        users && users.length > 0 ?
                            <FlatList
                                data={users}
                                showsVerticalScrollIndicator={false}

                                keyExtractor={(stock) => stock.id}
                                renderItem={({ item, index }) => {
                                    return (
                                        // <LeadCard
                                        //     name={item.name}
                                        //     mobile={item.contact}
                                        //     assign={() => closeAgentModal(item.uid)}
                                        //     admin_id={item.admin_id}
                                        // />
                                        <TouchableOpacity style={styles.contactCard} onPress={() => { closeAgentModal(item.admin_id) }}>
                                            <Text style={styles.leadName}>{item.name}</Text>
                                            <View style={styles.phoneContainer}>
                                                <Text style={styles.phone}>{item.contact}</Text>
                                                <View style={styles.callButton}>
                                                    <Text style={styles.leadName}>Reassign</Text>
                                                </View>
                                            </View>
                                        </TouchableOpacity>
                                    )
                                }}
                                refreshControl={<RefreshControl refreshing={false} onRefresh={getTasksAgent} />}
                            />
                            :
                            <Text style={styles.errorText}>No Users Found</Text>
                    }


                </View>

            </Modal>
        </View>
    );
}

const styles = StyleSheet.create({
    mainContainer: {
        flex: 1,
        // backgroundColor: "red",
        width: "92%",
        alignSelf: 'center',
        marginTop: 15,
        marginBottom: 5,


    },
    // mainContainer: {
    //     width: "98%",
    //     alignSelf: 'center'
    // },
    underline: {
        borderWidth: 0.6,
        marginTop: 10,
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
    typeContainer: {
        marginTop: 5,
        // borderColor:'red',
        // borderWidth:1,
        width: '100%',
        alignSelf: 'flex-end',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        // marginRight:10
    },
    type: {
        backgroundColor: '#F2F2F3',
        borderColor: '#E3E3E7',
        borderWidth: 1,
        borderRadius: 20,
        alignItems: 'center',
        justifyContent: 'center',
        width: 85,
        height: 35,
        elevation: 1,
        // flex:0.5
    },
    typeText: {
        color: '#1A1E25',
        fontFamily: 'Lato',
        fontWeight: '400',
        fontSize: 12,
        fontStyle: 'normal',
        alignSelf: 'center',
        textAlign: 'center'
    },


    // LeadCard
    contactCard: {
        width: '90%',
        padding: 5,
        margin: 5,
        elevation: 4,
    }





})
