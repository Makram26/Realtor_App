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

const LeadCard = ({ name, size, type, mobile, transaction }) => {
    return (
        <View style={{ ...leadModalStyles.card, width: "100%", marginTop: 20 }}>


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

export default function CreateLeadTasks({navigation, route}) {
    const { user } = useContext(AuthContext);

    const items = route.params
    // console.log("items", items)
    const { 
        leadName, 
        mobile, 
        catagory, 
        societyName, 
        bedroomsQuantity, 
        size, 
        size_type, 
        portion_type, 
        property_type, 
        unitType, 
        description, 
        budget,
        id,
        role,
        businessID 
    } = items

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

    const [subject, setSubject] = useState("Call")
    const [status, setStatus] = useState("New")
    const [priorty, setPriorty] = useState("Medium")

    // console.log("status", status)
    // const onChange = (event, selectedDate) => {
    //     const currentDate = selectedDate;
    //     setShow(false);
    //     setDate(currentDate);
    // };

    let todayTime = new Date().toLocaleTimeString()

    const [properTime, setProperTime] = useState(todayTime)
    const [properDate, setProperDate] = useState(today)

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

    const showMode = (currentMode) => {
        setShow(true);
        setMode(currentMode);
    };

    // const showDatepicker = () => {
    //     showMode('date');
    // };

    const ColorChangeSubjectHandler = (text) => {
        console.log(text)
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
        console.log(text)

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
        console.log(text)
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

    const addLeadTaskHandler = async () => {
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
                        lead: items ? items : null,
                        date: properDate,
                        time: properTime,
                        leadID: id,
                        role: role,
                        businessID: businessID,
                        name: user.displayName,
                        note: note,
                        timestamp: firestore.Timestamp.fromDate(new Date())
                    })
                    .then((docRef) => {
                        setLoading(false)
                        dealLead(docRef.id)
                        // setNote('')
                        // navigation.pop(1, id)
                        navigation.goBack();
                    })

            } catch (err) {
                console.log(err)
                setLoading(false)
            }
        } else {
            Alert.alert(
                "Notice",
                "Please add Title"
            )
            setLoading(false)
        }
    }

    const dealLead = async (docRef) => {
        setLoading(true)
        try {
            firestore()
                .collection('leads')
                .doc(docID)
                .update({
                    // inventoryProperty: houseProperty ? 'House' : flatProperty ? 'Flat' : farmHouseProperty ? 'Farm House' : pentHouseProperty ? 'Pent House' : officeProperty ? 'Office' : shopProperty ? 'Shop' : buildingProperty ? 'Building' : factoryProperty ? 'Factory' : housesProperty ? 'House' : plotsProperty ? 'Plot' : shopsProperty ? 'Shop' : officesProperty ? 'Office' : agricultureProperty ? 'Agriculture' : farmHousesProperty ? 'Farm House' : pentHopusesProperty ? 'Pent House' : buildingsProperty ? 'Building' : 'Flat',
                    taskID: docRef,
                    hasTask: true
                })
                .then(() => {
                    console.log("Lead Property Updated Updated")
                    setLoading(false)
                    setNote('')
                    navigation.pop(1, id)
                })

        } catch (err) {
            console.log(err)
            setLoading(false)
        }
    }


    return (
        <ScrollView contentContainerStyle={{ flexGrow: 1, backgroundColor: "#FCFCFC" }} keyboardShouldPersistTaps='always'>
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
                    <Text>{date.toLocaleDateString()}</Text>
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
                <Text style={styles.headingText}>Leads</Text>
                <LeadCard
                    name={leadName}
                    size={size}
                    type={size_type}
                    mobile={mobile}
                    transaction={property_type}
                />
            </View>

            <TouchableOpacity style={styles.SaveBtn} onPress={addLeadTaskHandler}>
                <Text style={styles.saveBtnText}>Save</Text>
            </TouchableOpacity>
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