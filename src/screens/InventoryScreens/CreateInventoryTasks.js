import React, { useContext, useState, useEffect } from 'react'
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
    BackHandler
} from 'react-native';

import firestore from '@react-native-firebase/firestore'

import { AuthContext } from '../../auth/AuthProvider'
import Spinner from 'react-native-loading-spinner-overlay';
import Icon from 'react-native-vector-icons/AntDesign';
import Icon2 from 'react-native-vector-icons/FontAwesome'
import DateTimePicker from '@react-native-community/datetimepicker';

import TaskApi from '../../api/TasksRequest'
import { HeaderStyle } from '../../constants/Styles';
import { Tile } from 'react-native-elements';

const Header = ({goBack, profile}) => {
    return (
        <View style={HeaderStyle.mainContainer}>
            <View style={HeaderStyle.arrowbox}>
                <TouchableOpacity onPress={goBack}>
                    <Icon name="left" color="#1A1E25" size={20} />
                </TouchableOpacity>
            </View>

            <View style={HeaderStyle.HeaderTextContainer}>
                <Text style={HeaderStyle.HeaderText}>Add Task</Text>
                <Image style={HeaderStyle.HeaderImage} resizeMode='contain' source={{ uri: profile }} />
            </View>
        </View>
    )
}

const InventoryCard = ({propertyImg,propertyType, houseName, address, rooms, area, areatype, rent, transactionType}) => {
    return (
        <View style={{ ...inventoryModalStyles.card, height: 140, width: "100%" }}>
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

export default function CreateInventoryTasks({navigation, route}) {
    const { user } = useContext(AuthContext);

    const items = route.params
    console.log("CreateInventoryTasks =>items =>", items)
    const { 
        societyName, cityName, id, transactionType, houseName, demand, rooms, size, sizeType, propertyImg,propertyType, facilities, description,
        businessID, role
    } = items
    // console.log("propertyType",propertyType)

    const [loading, setLoading] = useState(false)
    // Subject States
    const [btnMeetingColor, setBtnMeetingColor] = useState(false)
    const [btnCallColor, setBtnCallColor] = useState(true)
    const [btnToDoColor, setBtnToDoColor] = useState(false)
    const [btnSiteVisitColor, setBtnSiteVisitColor] = useState(false)

    // Status States
    const [btnNewColor, setBtnNewColor] = useState(true)
    const [btnDoneColor, setBtnDoneColor] = useState(false)
    const [btnLateColor, setBtnLateColor] = useState(false)
    const [btnPendingColor, setBtnPendingColor] = useState(false)

    // Priority States
    const [btnHighColor, setBtnHighColor] = useState(false)
    const [btnMediumColor, setBtnMediumColor] = useState(true)
    const [btnLowColor, setBtnLowColor] = useState(false)

    const [note, setNote] = useState('')
    const [title, setTitle]= useState('')

    // Date States
    const [date, setDate] = useState(new Date());
    const [mode, setMode] = useState('date');
    const [show, setShow] = useState(false);

    let today = new Date().toLocaleDateString()
    let todayTime = new Date().toLocaleTimeString()

    const [properTime, setProperTime] = useState(todayTime)
    const [properDate, setProperDate] = useState(today)

    console.log("today", today)
    console.log("date", date)
    console.log("proper", properDate)
    console.log("proper", properTime)


    const [subject, setSubject] = useState("Call")
    const [status, setStatus] = useState("New")
    const [priorty, setPriorty] = useState("Medium")

    // console.log("status", status)
    const onChange = (event, selectedDate) => {
        const currentDate = selectedDate || date;
        setShow(false);
        setDate(currentDate);

        let tempDate = new Date(currentDate)
        let fDate = (tempDate.getMonth()+1) + "/" + tempDate.getDate() + "/" + tempDate.getFullYear()
        setProperDate(fDate)
        let fTime = tempDate.getHours() + ':' + tempDate.getMinutes();
        setProperTime(fTime)
    };

    // const onChange = (event, selectedDate) => {
    //     setShow(false);
    //     selectdate = selectedDate
    //     const currentDate = selectedDate;
    //     setCurrentDay(days[new Date(currentDate).getDay()])
    //     setTodayDate(currentDate)
    //     getTodayTask()
    // };

    console.log("title", title)

    const showMode = (currentMode) => {
        setShow(true);
        setMode(currentMode);
    };

    // const showDatepicker = () => {
    //     showMode('date');
    // };

    const ColorChangeSubjectHandler = (text) => {
        // console.log(text)
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
        // console.log(text)

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
        // console.log(text)
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

    const addInventoryTaskHandler = async () => {
        setLoading(true)
        if(title !== ""){
            try {
                firestore()
                    .collection('Tasks')
                    .add({
                        user_id: user.uid,
                        title: title.trim(),
                        subject: subject,
                        priorty: priorty,
                        status: status,
                        inventory: items,
                        date: properDate,
                        time: properTime,
                        inventoryID: id,
                        businessID: businessID,
                        role: role,
                        name: user.displayName,
                        note: note,
                        timestamp: firestore.Timestamp.fromDate(new Date())
                    })
                    .then(() => {
                        // Alert.alert(
                        //     "Task Added",
                        //     //"Image and Data has been uploaded successfully!"
                        // )
                        setLoading(false)
                        setNote('')
                        // setAlertModal(true)
                        // resetAllHandler()
                        navigation.pop(1, id)
                    })

            } catch (err) {
                console.log(err)
                setLoading(false)
            }
        }else {
            Alert.alert(
                "Notice",
                "Please add Title"
            )
            setLoading(false)
        }
    }

    return (
        <ScrollView keyboardShouldPersistTaps="always" contentContainerStyle={{ flexGrow: 1, backgroundColor: "#FCFCFC" }}>
            {
                loading ?
                    <Spinner visible={true} />
                    :
                    null
            }
            <Header
                goBack={()=>navigation.goBack()}
                profile={user.photoURL}
            />

            <View style={[styles.headingContainer, { marginTop: 35 }]}>
                <Text style={styles.headingText}>Title <Text style={{color:'red'}}> *</Text></Text>
                <TextInput
                    style={{borderBottomColor:'#E2E2E2', borderBottomWidth:1}}
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
                <Text style={styles.headingText}>Due Date <Text style={{color:'red'}}> *</Text></Text>
                <TouchableOpacity onPress={() => showMode('date')} style={styles.datePickerContainer}>
                    <Text>{properDate}</Text>
                    <TouchableOpacity onPress={() => showMode('date')}>
                        <Image style={HeaderStyle.calendarIcon} resizeMode='contain' source={require('../../assets/images/calendar.png')} />
                    </TouchableOpacity>
                </TouchableOpacity>

                <Text style={[styles.headingText,{marginTop:10}]}>Due Time <Text style={{color:'red'}}> *</Text></Text>
                <TouchableOpacity onPress={() => showMode('time')} style={styles.datePickerContainer}>
                    <Text>{properTime}</Text>
                    <TouchableOpacity onPress={() => showMode('time')}>
                        {/* <Image style={HeaderStyle.calendarIcon} resizeMode='contain' source={require('../../assets/images/calendar.png')} /> */}
                        <Icon
                            name='clockcircleo'
                            size={20}
                            color="#876FF9"
                            style={{marginRight:7}}
                        />
                    </TouchableOpacity>
                </TouchableOpacity>

                {show && (
                    <DateTimePicker
                        testID="dateTimePicker"
                        value={date}
                        mode={mode}
                        dateFormat="dayofweek day month"
                        is24Hour={true}
                        onChange={onChange}
                    />
                )}
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
                    <TouchableOpacity style={{flex: 1,}}></TouchableOpacity>
                </View>
                <View style={{ borderWidth: 1, borderColor: "#E2E2E2", marginTop: 15 }} />
            </View>
            <View style={styles.headingContainer}>
                <Text style={styles.headingText}>Note</Text>
                <TextInput
                    // style={{borderBottomColor:'#E2E2E2', borderBottomWidth:1}}
                    placeholder='Enter Note here...'
                    placeholderTextColor={"#A1A1A1"}
                    keyboardType="default"
                    multiline
                    numberOfLines={2}
                    value={note}
                    onChangeText={(value) => setNote(value)}
                />
                <View style={{ borderWidth: 1, borderColor: "#E2E2E2", marginTop: 15 }} />
            </View>
            <View style={styles.headingContainer}>
                <Text style={styles.headingText}>Inventory</Text>
                <InventoryCard
                    propertyImg={propertyImg}
                    houseName={houseName}
                    address={societyName + ", " + cityName}
                    transactionType={transactionType}
                    rooms={rooms.bedrooms}
                    area={size}
                    areatype={sizeType} 
                    rent={demand} 
                    propertyType={propertyType}              
                />
            </View>

            <TouchableOpacity style={styles.SaveBtn} onPress={addInventoryTaskHandler}>
                <Text style={styles.saveBtnText}>Save</Text>
            </TouchableOpacity>

            {/* <TouchableOpacity style={styles.linkButton}>
                <Text style={styles.linkButtonText}>Link to Lead</Text>
            </TouchableOpacity> */}

        </ScrollView>
    )
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
        // alignItems: 'center',
        height: 47,
        backgroundColor: "#876FF9",
        borderRadius: 10,
        marginTop: 40,
        marginBottom:20,
        elevation: 2
    },
    saveBtnText: {
        color: "#FFFFFF",
        fontSize: 15,
        fontWeight: "900",
        // lineHeight: 14,
        alignSelf:'center'
    },
    linkButton: {
        borderColor: '#6D52EF',
        borderWidth: 1,
        borderRadius: 10,
        marginTop:20,
        width: "92%",
        justifyContent: "center",
        alignSelf: "center",
        alignItems: 'center',
        height: 47,
        marginBottom:15,
    },
    linkButtonText: {
        color:'black',
        fontSize:13,
        fontWeight:'900',
        fontFamily:''
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
    card: {
        marginTop:10,
        // borderColor:'red',
        // borderWidth:1,
        height:189,
        marginBottom:10,
        flexDirection: 'row',
        backgroundColor: 'white',
        elevation: 3,
        borderRadius: 10,
        overflow: 'hidden',
    },
    imageContainer: {
        width: '30%',
        alignItems:'center',
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
    rating:{
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
        flex:1,
        marginLeft:3
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
    typeText:{
        fontFamily:'Lato',
        fontWeight:'900',
        fontSize:14,
        color:'#826AF7',
        // alignSelf:'flex-end'
    }
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