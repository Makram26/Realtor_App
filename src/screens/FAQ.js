import React, { useContext, useEffect, useState } from 'react'
import { StyleSheet, Text, View, TouchableOpacity, Image, FlatList, RefreshControl, TextInput, Linking } from 'react-native'

import { HeaderStyle } from '../constants/Styles'
import { AuthContext } from '../auth/AuthProvider'

import Icon from 'react-native-vector-icons/AntDesign';
import Icon1 from 'react-native-vector-icons/Ionicons'

import Spinner from 'react-native-loading-spinner-overlay';

import LeadApi from '../api/LeadsRequest'

const Header = ({ goBack, profile }) => {
    return (
        <View style={HeaderStyle.mainContainer}>
            <View style={HeaderStyle.arrowbox}>
                <TouchableOpacity onPress={goBack}>
                    <Icon name="left" color="#1A1E25" size={20} />
                </TouchableOpacity>
            </View>

            <View style={HeaderStyle.HeaderTextContainer}>
                <Text style={HeaderStyle.HeaderText}>Contacts</Text>
                <Image style={HeaderStyle.HeaderImage} resizeMode='contain' source={{ uri: profile }} />
            </View>
        </View>
    )
}

const ContactCard = ({
    name,
    mobile,
    call
}) => {
    return (
        <View style={styles.contactCard}>
            <View style={{flex:0.45}}>

            <Text style={styles.leadName}>{name}</Text>
            </View>
            <View style={styles.phoneContainer}>
                <View style={{flex:1}}>

                <Text style={styles.phone}>{mobile}</Text>
                </View>
                <TouchableOpacity style={styles.callButton} onPress={call}>
                    <Icon1 name="call" color="#917AFD" size={20} />
                </TouchableOpacity>
            </View>
        </View>
    )
}

export default function FAQ({ navigation }) {
    const { user } = useContext(AuthContext);

    const [data, setData] = useState([])
    const [filteredData, setFilteredData] = useState([])

    const [loading, setLoading] = useState(false)

    const [search, setSearch] = useState('')

    useEffect(() => {
        loadContactList()
        const unsubscribe = navigation.addListener('focus', () => {
            loadContactList()
        });
        return () => {
            unsubscribe;
        };
    }, [])

    const loadContactList = async () => {
        setLoading(true)
        setData([])
        setFilteredData([])
        const response = await LeadApi.getLeadContactInformation(user.uid)
        if (response && response.length > 0) {
            setData(response)
            setFilteredData(response)
            setLoading(false)
        }
        else {
            setData([])
            setFilteredData([])
            setLoading(false)
        }
    }

    const showPhonePad = (mobile) => {
        let newNumber = mobile.split('-').join('')
        console.log(newNumber)
        let phoneNumber = `tel:${newNumber}`
        console.log(phoneNumber)
        Linking.openURL(phoneNumber)
    }

    const searchContact = (text) => {
        if (text) {
            const newData = data.filter((item) => {
                const itemData = item.leadName ? item.leadName.toUpperCase() : ''.toUpperCase();
                const textData = text.toUpperCase()
                return itemData.indexOf(textData) > -1
            })
            setFilteredData(newData)
            setSearch(text)
        } else {
            setFilteredData(data)
            setSearch(text)
        }
    }

    return (
        <View style={styles.screen}>
            {
                loading ?
                    <Spinner visible={true} />
                    :
                    null
            }
            <Header
                goBack={() => navigation.goBack()}
                profile={user.photoURL}
            />

            <View style={HeaderStyle.searchContainer}>
                <Icon1 name="search" color="#1A1E25" size={30} style={{ marginLeft: 10 }} />
                <TextInput style={HeaderStyle.searchText}
                    placeholder='Search contact here..'
                    placeholderTextColor={"#7D7F88"}
                    value={search}
                    onChangeText={(text) => searchContact(text)}
                />
            </View>

            <View style={styles.body}>

                {
                    data && data.length < 1 ?
                        <Text style={styles.text}>
                            No Contacts Information Exists
                        </Text>
                        : null
                }

                <FlatList
                    data={filteredData}
                    keyExtractor={(stock) => stock.id}
                    renderItem={({ item, index }) => {
                        return (
                            <ContactCard
                                name={item.leadName}
                                mobile={item.mobile}
                                call={()=>showPhonePad(item.mobile)}
                            />
                        )
                    }}
                    refreshControl={<RefreshControl refreshing={false} onRefresh={loadContactList} />}
                />
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
        flex: 1,
        marginTop:15,
        // borderColor:'green',
        // borderWidth:1
    },
    text: {
        fontSize: 20,
        fontFamily: 'Lato',
        letterSpacing: 1,
        marginTop: '50%',
        color: '#7F66F6',
        fontWeight: '700',
        lineHeight: 100,
        alignSelf: 'center'
    },
    contactCard: {
        width: '95%',
        alignSelf: 'center',
        // borderColor: 'red',
        // borderWidth: 1,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        // height: 60,
        marginTop:15,
        elevation:2,
        backgroundColor:'white',
        borderRadius:5,
        marginBottom:5,
        paddingTop:10,
        paddingBottom:10
    },
    leadName: {
        fontSize: 15,
        fontWeight: '600',
        color: "#1A1E25",
        marginLeft: 15
    },
    phoneContainer: {
        flex:0.5,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
       
    },
    phone: {
        fontSize: 13,
        fontWeight: '400',
        color: "#1A1E25",
        textAlign:"right",
        marginRight:10
        // marginRight: 15
    },
    callButton: {
        borderColor: '#917AFD',
        borderWidth: 1,
        padding: 5,
        borderRadius: 50,
        marginRight: 10
    }
})