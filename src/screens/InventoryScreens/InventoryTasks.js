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

import { AuthContext } from '../../auth/AuthProvider'
import Spinner from 'react-native-loading-spinner-overlay';
import Icon from 'react-native-vector-icons/AntDesign';
import Icon1 from 'react-native-vector-icons/EvilIcons';

import TaskApi from '../../api/TasksRequest'
import { HeaderStyle } from '../../constants/Styles';
import TasksCard from '../../components/TasksCard';

import firestore from '@react-native-firebase/firestore'

const Header = ({goBack, profile}) => {
    return (
        <View style={HeaderStyle.mainContainer}>
            <View style={HeaderStyle.arrowbox}>
                <TouchableOpacity onPress={goBack}>
                    <Icon name="left" color="#1A1E25" size={20} />
                </TouchableOpacity>
            </View>

            <View style={HeaderStyle.HeaderTextContainer}>
                <Text style={HeaderStyle.HeaderText}>Tasks</Text>
                <Image style={HeaderStyle.HeaderImage} resizeMode='contain' source={{ uri: profile }} />
            </View>
        </View>
    )
}

export default function InventoryTasks({navigation, route}) {
    const { user } = useContext(AuthContext);

    const inventoryID = route.params.id
    const items = route.params.items
    const {
        role,
        businessID
    } = items
    // console.log("inventoryID=>", inventoryID)

    const [loading, setLoading] = useState(false)
    const [search, setSearch] = useState('')
    const [taskData, setTaskData] = useState([])
    const [filterData, setFilteredData] = useState([])

    useEffect(() => {
        const unsubscribe = navigation.addListener('focus', () => {
            getInventoryTasks()
        });
    
        return () => {
          unsubscribe;
        };
    
    }, [])

    const getInventoryTasks = async() => {
        setLoading(true)
        // ID->received from props
        const response = await TaskApi.getInventoryTasks(inventoryID, role, businessID)
        if(response && response.length>0){
            setTaskData(response)
            setFilteredData(response)
            setLoading(false)
        }
        else{
            // Alert.alert("Fetch Failed.....")
            setLoading(false)
        }
    }

    const searchInventoryTaskFilter = (text) => {
        if (text) {
            const newData = taskData.filter((item) => {
                const itemData = item.subject ? item.subject.toUpperCase() : ''.toUpperCase();
                const textData = text.toUpperCase()
                return itemData.indexOf(textData) > -1
            })
            setFilteredData(newData)
            setSearch(text)
        } else {
            setFilteredData(taskData)
            setSearch(text)
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
                    console.log("Task Status Updated")
                    getInventoryTasks()
                    setLoading(false)
                    Alert.alert("Status Updated")
                    // navigation.navigate("Leads")
                })
        } catch (err) {
            console.log(err)
            setLoading(false)
            console.log(
                "Error occured",
            )
            Alert.alert("Error occured","Please try again")
        }
    }

    return (
        <ScrollView contentContainerStyle={{ flexGrow: 1, backgroundColor: "#FCFCFC" }}>
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
            <View style={HeaderStyle.searchContainer}>
                <Icon1 name="search" color="#1A1E25" size={30} style={{ marginLeft: 10 }} />
                <TextInput style={HeaderStyle.searchText}
                    placeholder='Search Task by Subject'
                    placeholderTextColor={"#7D7F88"}
                    value={search}
                    onChangeText={(text) => searchInventoryTaskFilter(text)}
                />
            </View>

            <View style={styles.mainContainer}>
                <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
                    <TouchableOpacity style={{ flex: 1, justifyContent: "center" }}  >
                        <Text style={{ fontSize: 15, fontWeight: "500", color: "#000000", letterSpacing: 0.02 }}>All Tasks</Text>
                    </TouchableOpacity>
                    <View style={{ flex: 1, flexDirection: "row", justifyContent:"flex-end" }}>
                        {/* <TouchableOpacity
                            style={{ backgroundColor: "#FDFDFD", borderWidth: 0.5, borderColor: "#E3E3E7", width: "45%", height: 34, justifyContent: 'center', alignItems: 'center', borderRadius: 5, elevation: 9, }}>
                            <Text style={{ fontSize: 11, color: "#8A73FB", fontWeight: "500", letterSpacing: 0.013 }}>Pending Tasks</Text>
                        </TouchableOpacity> */}

                        <TouchableOpacity
                            style={{ backgroundColor: "#FDFDFD", borderWidth: 0.5, borderColor: "#E3E3E7", width: "45%", height: 34, justifyContent: 'center', alignItems: 'center', borderRadius: 5, elevation: 4, }}
                            onPress={()=>navigation.navigate('CreateInventoryTasks', items)}
                        >
                            <Text style={{ fontSize: 11, color: "#8A73FB", fontWeight: "500", letterSpacing: 0.013 }}>New Task</Text>
                        </TouchableOpacity>
                    </View>
                </View>
                <View style={styles.underline} />
                {/* {console.log("filterDatafilterDatafilterDatafilterData",filterData)} */}
                <View style={{ paddingTop: 10 }}>
                    {
                        filterData && filterData.length>0 ?
                            <FlatList
                                data={filterData}
                                keyExtractor={(stock) => stock.id}
                                renderItem={({ item }) => (
                                    <TasksCard
                                        key={item.id}
                                        title={item.title}
                                        status={item.status}
                                        subject={item.subject}
                                        date={item.date}
                                        navigate={() => navigation.navigate('TaskDetail', item)}
                                        onPress={() => updateStatusHandler(item.id)}
                                    // onPress={() => navigation.navigate("UpdateLeads")}
                                    />
                                )}
                            />
                        :
                        <Text style={styles.emptyUserRecord}>This Inventory Has No Tasks!</Text>
                    }
                </View>
            </View>
        </ScrollView>
    )
}

const styles = StyleSheet.create({
    mainContainer: {
        flex: 1,
        // backgroundColor: "red",
        width: "90%",
        alignSelf: 'center',
        marginTop: 25,
        marginBottom: 5,
    },
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
})