import React, { useContext, useState, useEffect } from 'react'
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
    RefreshControl,
    FlatList
} from 'react-native';

import { HeaderStyle } from '../../constants/Styles';
import { AuthContext } from '../../auth/AuthProvider'
import LeadsApi from '../../api/TasksRequest'

import Icon from 'react-native-vector-icons/AntDesign';
import Icon2 from 'react-native-vector-icons/FontAwesome'
import Icon1 from 'react-native-vector-icons/EvilIcons';

const Header = ({ goBack, photoURL }) => {
    return (
        <View style={HeaderStyle.mainContainer}>
            <View style={HeaderStyle.arrowbox}>
                <TouchableOpacity onPress={goBack}>
                    <Icon name="left" color="#1A1E25" size={20} />
                </TouchableOpacity>
            </View>
            <View style={HeaderStyle.HeaderTextContainer}>
                <Text style={HeaderStyle.HeaderText}>Link Lead</Text>
                <Image
                    style={HeaderStyle.HeaderImage} resizeMode='contain'
                    //source={require('../../assets/images/personpic.png')}
                    source={{ uri: photoURL }}
                />
            </View>
        </View>
    )
}

const LeadCard = ({ name, size, type, mobile, backPress }) => {
    return (
        <View style={styles.card}>
            <View style={{ flex: 1 }}>
                <Text style={styles.name}>{name}</Text>
                <Text style={styles.size}>{size} {type}</Text>
            </View>
            <View style={{ flex: 1 }}>
                <Text style={styles.phone}>{mobile}</Text>
                <TouchableOpacity style={styles.button} onPress={backPress}>
                    <Text style={styles.buttonText}>Add to task</Text>
                </TouchableOpacity>
            </View>
        </View>
    )
}

export default function TaskToLead({ navigation }) {
    const { user } = useContext(AuthContext);

    // search 
    const [search, setSearch] = useState('')

    // filter
    const [filterSale, setFilterSale] = useState(true)
    const [filterLet, setFilterLet] = useState(false)
    const [filterBuy, setFilterBuy] = useState(false)
    const [filterRent, setFilterRent] = useState(false)

    // data
    const [data, setData] = useState([])
    const [filterData, setFilterData] = useState([])

    const [loading, setLoading] = useState(false)

    const searchLeadFilter = (text) => {
        // if (text) {
        //     //   setSearchData(false)
        //     const newData = taskData.filter((item) => {
        //         const itemData = item.subject ? item.subject.toUpperCase() : ''.toUpperCase();
        //         const textData = text.toUpperCase()
        //         return itemData.indexOf(textData) > -1
        //     })
        //     setFilteredData(newData)
        //     setSearch(text)
        // } else {
        //     //   setSearchData(true)
        //     setFilteredData("")
        //     setSearch(text)
        // }
    }

    useEffect(() => {
        getLeads()
    }, [])

    const getLeads = async () => {
        const userID = user.uid
        const response = await LeadsApi.getLeadsForTasks(userID)
        if (response && response.length > 0) {
            setData(response)
            setLoading(false)
        }
        else {
            setLoading(false)
            setData([])
        }
    }

    const changeFilterHandler = (id) => {
        switch (id) {
            case 1:
                setFilterSale(true)
                setFilterLet(false)
                setFilterBuy(false)
                setFilterRent(false)
                break;
            case 2:
                setFilterSale(false)
                setFilterLet(true)
                setFilterBuy(false)
                setFilterRent(false)
                break;
            case 3:
                setFilterSale(false)
                setFilterLet(false)
                setFilterBuy(true)
                setFilterRent(false)
                break;
            case 4:
                setFilterSale(false)
                setFilterLet(false)
                setFilterBuy(false)
                setFilterRent(true)
                break;
        }
    }

    return (
        <View style={styles.screen}>
            <Header
                goBack={() => navigation.pop(1)}
                photoURL={user.photoURL}
            />

            <View style={HeaderStyle.searchContainer}>
                <Icon1 name="search" color="#1A1E25" size={30} style={{ marginLeft: 10 }} />
                <TextInput style={HeaderStyle.searchText}
                    placeholder='Search Lead here..'
                    placeholderTextColor={"#7D7F88"}
                    value={search}
                    onChangeText={(text) => searchLeadFilter(text)}
                />
            </View>

            <View style={styles.body}>
                <View style={styles.filterContainer}>
                    <TouchableOpacity
                        style={[styles.filterButton, { backgroundColor: filterSale ? '#826AF7' : '#F2F2F3' }]}
                        onPress={() => changeFilterHandler(1)}
                    >
                        <Text style={[styles.filterButtonText, { color: filterSale ? '#FFFFFF' : '#7D7F88' }]}>Sale</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={[styles.filterButton, { backgroundColor: filterLet ? '#826AF7' : '#F2F2F3' }]}
                        onPress={() => changeFilterHandler(2)}
                    >
                        <Text style={[styles.filterButtonText, { color: filterLet ? '#FFFFFF' : '#7D7F88' }]}>To Let</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={[styles.filterButton, { backgroundColor: filterBuy ? '#826AF7' : '#F2F2F3' }]}
                        onPress={() => changeFilterHandler(3)}
                    >
                        <Text style={[styles.filterButtonText, { color: filterBuy ? '#FFFFFF' : '#7D7F88' }]}>Buy</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={[styles.filterButton, { backgroundColor: filterRent ? '#826AF7' : '#F2F2F3' }]}
                        onPress={() => changeFilterHandler(4)}
                    >
                        <Text style={[styles.filterButtonText, { color: filterRent ? '#FFFFFF' : '#7D7F88' }]}>For Rent</Text>
                    </TouchableOpacity>
                </View>

                {
                    filterSale ?
                        <FlatList
                            data={data}
                            keyExtractor={(stock) => stock.id}
                            renderItem={({ item, index }) => {
                                if (item.property_type == 'Sale') {
                                    return (
                                        <LeadCard
                                            name={item.leadName}
                                            mobile={item.mobile}
                                            size={item.size}
                                            type={item.size_type}
                                            backPress={() => navigation.navigate('CreateTask', {"item":item, "type":"Leads"})}
                                        />
                                    )
                                }
                            }}
                            refreshControl={<RefreshControl refreshing={loading} onRefresh={getLeads} />}
                        />
                        : filterBuy ?
                            <FlatList
                                data={data}
                                keyExtractor={(stock) => stock.id}
                                renderItem={({ item, index }) => {
                                    if (item.property_type == 'Buy') {
                                        return (
                                            <LeadCard
                                                name={item.leadName}
                                                mobile={item.mobile}
                                                size={item.size}
                                                type={item.size_type}
                                                backPress={() => navigation.navigate('CreateTask', {"item":item, "type":"Leads"})}
                                            />
                                        )
                                    }
                                }}
                                refreshControl={<RefreshControl refreshing={loading} onRefresh={getLeads} />}
                            />
                            : filterRent ?
                                <FlatList
                                    data={data}
                                    keyExtractor={(stock) => stock.id}
                                    renderItem={({ item, index }) => {
                                        if (item.property_type == 'Rent') {
                                            return (
                                                <LeadCard
                                                    name={item.leadName}
                                                    mobile={item.mobile}
                                                    size={item.size}
                                                    type={item.size_type}
                                                    backPress={() => navigation.navigate('CreateTask', {"item":item, "type":"Leads"})}
                                                />
                                            )
                                        }
                                    }}
                                    refreshControl={<RefreshControl refreshing={loading} onRefresh={getLeads} />}
                                />
                                : filterLet ?
                                    <FlatList
                                        data={data}
                                        keyExtractor={(stock) => stock.id}
                                        renderItem={({ item, index }) => {
                                            if (item.property_type == 'Let') {
                                                return (
                                                    <LeadCard
                                                        name={item.leadName}
                                                        mobile={item.mobile}
                                                        size={item.size}
                                                        type={item.size_type}
                                                        backPress={() => navigation.navigate('CreateTask', {"item":item, "type":"Leads"})}
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
    )
}

const styles = StyleSheet.create({
    screen: {
        flex: 1,
        backgroundColor: '#FCFCFC'
    },
    body: {
        width: '92%',
        alignSelf: 'center',
        flex: 1
    },
    filterContainer: {
        // borderColor:'red',
        // borderWidth:1,
        marginTop: 20,
        flexDirection: 'row',
        justifyContent: 'space-between'
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
        marginTop: 30,
        flexDirection: 'row',
        justifyContent: 'space-between',
        height: 90,
        borderBottomColor: '#D6D6D6',
        borderBottomWidth: 0.6
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