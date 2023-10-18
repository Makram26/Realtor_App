import React, { useState, useEffect, useContext } from 'react'
import { StyleSheet, Text, View, TextInput, TouchableOpacity, FlatList, RefreshControl, LogBox, Image, Modal, ScrollView } from 'react-native'

import { AuthContext } from '../../auth/AuthProvider'
import Icon from 'react-native-vector-icons/AntDesign';

import Icon1 from 'react-native-vector-icons/FontAwesome'
import MarketplaceAPI from '../../api/MarketplaceAPI'

import AsyncStorage from '@react-native-async-storage/async-storage'

import Header from '../../components/Header'
// import InventoryCard from '../../components/InventoryCard'
import Spinner from 'react-native-loading-spinner-overlay';
import { shortenAddress } from '../../functions/shortenAddress'
import { HeaderStyle } from '../../constants/Styles';

import firestore from '@react-native-firebase/firestore'
import { Alert } from 'react-native';

const Headers = ({ filterPress, goBackPress, propertyImg, ...otherprops }) => {
  return (
    <View style={styles.header}>
      <TouchableOpacity style={styles.menu} onPress={goBackPress}>
        <Icon
          name='left'
          color='#1A1E25'
          size={22}
        />
      </TouchableOpacity>
      <View style={styles.searchbar}>
        <Icon1
          name='search'
          color='#1A1E25'
          size={18}
          style={{ marginLeft: 10 }}
        />
        <TextInput
          placeholder='Seach Location'
          placeholderTextColor='#1A1E25'
          style={styles.searchbarPlaceholder}
          {...otherprops}
        />
      </View>
      <TouchableOpacity onPress={filterPress} style={styles.filter}>
        <Icon
          name='filter'
          color='white'
          size={20}
        // style={{ marginLeft: 10 }}
        />
      </TouchableOpacity>
    </View>
  )
}

const InventoryCard = ({
  propertyImg,
  houseName,
  address,
  rooms,
  area,
  areatype,
  rent,
  navigatePress,
  transactionType,
  from,
  removeMarketplace,
  propertyType
}) => {
  return (
    <TouchableOpacity style={styles.card} onPress={navigatePress}>

      {/* Image Container */}
      <View style={styles.imageContainer}>
        {/* <BackgroundImage source={{uri: image}} style={{flex: 1}} resizeMode="stretch"> */}
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


      {/* Property Details such as Property type and price etc. */}
      <View style={styles.detailsContainer}>
        <Text style={styles.houseName}>{houseName}</Text>
        <Text style={styles.houseAddress}>{address}</Text>
        <Text style={styles.houseAddress}>{propertyType}</Text>

        <View style={{ flexDirection: 'row', justifyContent: 'space-between', width: '60%', marginTop: 10, alignItems: 'center' }}>
          {
            propertyType == 'Plot' || propertyType == 'Files' || propertyType == 'Shop' || propertyType == 'Agriculture' ?
              null
              :
              <>
                <Icon1
                  name='bed'
                  color='#7D7F88'
                  size={14}
                />
                <Text style={styles.houseAddress}>{rooms} Rooms</Text>
              </>
          }
          <Icon1
            name='home'
            color='#7D7F88'
            size={14}
          />
          <Text style={styles.houseAddress}>{area + " " + areatype}</Text>
        </View>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', width: '95%', alignItems: 'center', marginBottom: 10 }}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
            <Text style={styles.houseRent}>
              PKR
              {rent.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
              {
                transactionType == "Sale" ?
                  <Text style={styles.rentType}></Text>
                  :
                  <Text style={styles.rentType}>/ month</Text>
              }
            </Text>
          </View>
          {
            from == "My" ?
              <TouchableOpacity
                style={{
                  backgroundColor: 'red',
                  borderRadius: 5,
                  width: 70,
                  height: 30,
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
                onPress={removeMarketplace}
              >
                <Text style={{ color: 'white', fontSize: 12, alignSelf: 'center' }}>Remove</Text>
              </TouchableOpacity>
              : null
          }
        </View>

      </View>
    </TouchableOpacity>
  )
}

export default function MyMarketplaceScreen({ navigation }) {
  const { user } = useContext(AuthContext);

  const [inventoryList, setInventoryList] = useState([])
  const [filteredDataSource, setFilteredDataSource] = useState([]);
  const [search, setSearch] = useState('')

  const [inventoryTypeBuy, setInventoryTypeBuy] = useState(false)
  const [inventoryTypeLet, setInventoryTypeLet] = useState(true)

  const [loading, setLoading] = useState(false)

  const [showFilterModal, setShowFilterModal] = useState(false)


  // Transaction States
  const [saleType, setSaleType] = useState(false)
  const [letType, setLetType] = useState(false)

  const [societyName, setSocietyName] = useState('')
  const [searchSocietyName, setSearchSocietyName] = useState('')
  const [societyData, setSocietyData] = useState()
  const [filterSocietyData, setFilterSocietyData] = useState()
  const [cityName, setCityName] = useState('')
  const [country, setCountry] = useState()


  // Property States
  const [plotsProperty, setPlotsProperty] = useState(false)
  const [houseProperty, setHouseProperty] = useState(false)
  const [flatProperty, setFlatProperty] = useState(false)
  const [shopProperty, setShopProperty] = useState(false)
  const [buildingProperty, setBuildingProperty] = useState(false)
  const [factoryProperty, setFactoryProperty] = useState(false)
  const [farmProperty, setFarmProperty] = useState(false)
  const [officeProperty, setOfficeProperty] = useState(false)
  const [pentHouseProperty, setPentHouseProperty] = useState(false)
  const [agricultureProperty, setAgricultureProperty] = useState(false)
  const [fileProperty, setFileProperty] = useState(false)

  // Min/Max values
  const [minValue, setMinValue] = useState('')
  const [maxValue, setMaxValue] = useState('')

  // show filters boolean
  const [showFilters, setShowFilters] = useState(false)


  const changePropertyHandler = (id) => {
    switch (id) {
      case 1:
        setPlotsProperty(true)
        setHouseProperty(false)
        setFlatProperty(false)
        setShopProperty(false)
        setBuildingProperty(false)
        setFactoryProperty(false)
        setFarmProperty(false)
        setOfficeProperty(false)
        setPentHouseProperty(false)
        setAgricultureProperty(false)
        setFileProperty(false)
        break;
      case 2:
        setPlotsProperty(false)
        setHouseProperty(true)
        setFlatProperty(false)
        setShopProperty(false)
        setBuildingProperty(false)
        setFactoryProperty(false)
        setFarmProperty(false)
        setOfficeProperty(false)
        setPentHouseProperty(false)
        setAgricultureProperty(false)
        setFileProperty(false)
        break;
      case 3:
        setPlotsProperty(false)
        setHouseProperty(false)
        setFlatProperty(true)
        setShopProperty(false)
        setBuildingProperty(false)
        setFactoryProperty(false)
        setFarmProperty(false)
        setOfficeProperty(false)
        setPentHouseProperty(false)
        setAgricultureProperty(false)
        setFileProperty(false)
        break;
      case 4:
        setPlotsProperty(false)
        setHouseProperty(false)
        setFlatProperty(false)
        setShopProperty(false)
        setBuildingProperty(false)
        setFactoryProperty(false)
        setFarmProperty(false)
        setOfficeProperty(true)
        setPentHouseProperty(false)
        setAgricultureProperty(false)
        setFileProperty(false)
        break;
      case 5:
        setPlotsProperty(false)
        setHouseProperty(false)
        setFlatProperty(false)
        setShopProperty(true)
        setBuildingProperty(false)
        setFactoryProperty(false)
        setFarmProperty(false)
        setOfficeProperty(false)
        setPentHouseProperty(false)
        setAgricultureProperty(false)
        setFileProperty(false)
        break;
      case 6:
        setPlotsProperty(false)
        setHouseProperty(false)
        setFlatProperty(false)
        setShopProperty(false)
        setBuildingProperty(true)
        setFactoryProperty(false)
        setFarmProperty(false)
        setOfficeProperty(false)
        setPentHouseProperty(false)
        setAgricultureProperty(false)
        setFileProperty(false)
        break;
      case 7:
        setPlotsProperty(false)
        setHouseProperty(false)
        setFlatProperty(false)
        setShopProperty(false)
        setBuildingProperty(false)
        setFactoryProperty(true)
        setFarmProperty(false)
        setOfficeProperty(false)
        setPentHouseProperty(false)
        setAgricultureProperty(false)
        setFileProperty(false)
        break;
      case 8:
        setPlotsProperty(false)
        setHouseProperty(false)
        setFlatProperty(false)
        setShopProperty(false)
        setBuildingProperty(false)
        setFactoryProperty(false)
        setFarmProperty(true)
        setOfficeProperty(false)
        setPentHouseProperty(false)
        setAgricultureProperty(false)
        setFileProperty(false)
        break;
      case 9:
        setPlotsProperty(false)
        setHouseProperty(false)
        setFlatProperty(false)
        setShopProperty(false)
        setBuildingProperty(false)
        setFactoryProperty(false)
        setFarmProperty(false)
        setOfficeProperty(false)
        setPentHouseProperty(true)
        setAgricultureProperty(false)
        setFileProperty(false)
        break;
      case 10:
        setPlotsProperty(false)
        setHouseProperty(false)
        setFlatProperty(false)
        setShopProperty(false)
        setBuildingProperty(false)
        setFactoryProperty(false)
        setFarmProperty(false)
        setOfficeProperty(false)
        setPentHouseProperty(false)
        setAgricultureProperty(true)
        setFileProperty(false)
        break;
      case 11:
        setPlotsProperty(false)
        setHouseProperty(false)
        setFlatProperty(false)
        setShopProperty(false)
        setBuildingProperty(false)
        setFactoryProperty(false)
        setFarmProperty(false)
        setOfficeProperty(false)
        setPentHouseProperty(false)
        setAgricultureProperty(false)
        setFileProperty(true)
        break;
    }
  }


  useEffect(() => {
    // loadInventoryList()
    getMarketplaceInventories()
    const unsubscribe = navigation.addListener('focus', () => {
      getMarketplaceInventories()
    });

    return () => {
      unsubscribe;
    };
  }, [])

  const getMarketplaceInventories = async () => {
    setLoading(true)
    setInventoryList([])
    setFilteredDataSource([])
    // const userID = user.uid
    // var country = await AsyncStorage.getItem("@country");
    var city = await AsyncStorage.getItem("@city");
    console.log("city", city)
    const response = await MarketplaceAPI.getMarketplace(city, "Pakistan");
    console.log("response===>>", response)
    if (response && response.length > 0) {
      setInventoryList(response)
      setFilteredDataSource(response)
      setLoading(false)
    }
    else {
      setLoading(false)
    }
  }

  useEffect(() => {
    getID()
  }, [])

  const getID = async () => {
    var data = await AsyncStorage.getItem("@areas");
    var city = await AsyncStorage.getItem("@city");
    var country = await AsyncStorage.getItem("@country");

    setCityName(city)
    setCountry(country)
    data = data.replace(/'/g, '"');
    data = JSON.parse(data);
    setSocietyData(data)
  }

  const changeSocietyName = (name) => {
    setSocietyName(name)
    setSearchSocietyName("")
  }

  const searchFilter = (text) => {
    if (text) {
      const newData = societyData.filter((item) => {
        const itemData = item.name ? item.name.toUpperCase() : ''.toUpperCase();
        const textData = text.toUpperCase()
        return itemData.indexOf(textData) > -1
      })
      setFilterSocietyData(newData)
      setSearchSocietyName(text)
    } else {
      setFilterSocietyData(societyData)
      setSearchSocietyName(text)
    }
  }

  const chnageInventoryTypeHandler = (name) => {
    switch (name) {
      case 1:
        setInventoryTypeBuy(false)
        setInventoryTypeLet(true)
        break;
      case 2:
        setInventoryTypeBuy(true)
        setInventoryTypeLet(false)
        break;
    }
  }

  const changeTransactionHandler = (id) => {
    // console.log("id", id)
    if (id == 1) {
      setSaleType(true)
      setLetType(false)
    }
    else {
      setSaleType(false)
      setLetType(true)
    }
  }

  const applyFiltersHandler = () => {
    setShowFilters(true)
    setShowFilterModal(false)
    getFilterInventories()
  }

  const removeFilterHandler = () => {
    setShowFilters(false)
    getMarketplaceInventories()
  }

  const getFilterInventories = async () => {
    setLoading(true)
    setInventoryList([])
    setFilteredDataSource([])
    const userID = user.uid
    const response = await MarketplaceAPI.getFilterMarketPlaceInventories(
      userID,
      saleType ? "Sale" : letType ? "Let" : "Nothing",
      societyName,
      plotsProperty ? "Plot" : houseProperty ? "House" : flatProperty ? "Flat" : shopProperty ? "Shop" : buildingProperty ? "Building" : factoryProperty ? "Factory" : farmProperty ? "Farm House" : officeProperty ? "Office" : pentHouseProperty ? "Pent House" : agricultureProperty ? "Agri" : fileProperty ? "Files" : "Nothing",
      minValue,
      maxValue
    );
    console.log("filter=>inventory=>response", response)
    if (response && response.length > 0) {
      setInventoryList(response)
      setFilteredDataSource(response)
      setLoading(false)
    }
    else {
      setLoading(false)
    }
    // setLoading(false)


  }

  const removeFromMarketplaceHandler = async (id, propertyID) => {
    setLoading(true)
    try {
      firestore()
        .collection("Marketplace")
        .doc(id)
        .delete()
        .then(() => {
          console.log("Marketplace Status Updated")
          // setLoading(false)
          updateInventoryStatus(propertyID)
        })
    } catch (error) {
      console.log(error)
      setLoading(false)
    }
  }

  // Remove Inventory from MarketPlace
  const updateInventoryStatus = async (propertyID) => {
    setLoading(true)
    try {
      firestore()
        .collection("Inventory")
        .doc(propertyID)
        .update({
          toMarketplace: false
        })
        .then(() => {
          console.log("Inventory Status Updated")
          Alert.alert("Inventory Removed Succesfully")
          setLoading(false)
        })
    } catch (error) {
      console.log(error)
      setLoading(false)
    }
  }

  // Market Place Inventory Seach 
  const searchInventoryFilter = (text) => {
    if (text) {
      // const newData = inventoryList.filter((item) => {
      //   const itemData = item.societyName ? item.societyName.toUpperCase() : ''.toUpperCase() || item.houseName ? item.houseName.toUpperCase() : ''.toUpperCase();
      //   const textData = text.toUpperCase()
      //   return itemData.indexOf(textData) > -1
      // })
      const newData = inventoryList.filter(function (item) {
        if (item.societyName.toLowerCase().includes(text.toLowerCase())) {
            return item;
        }
        if (item.houseName.toLowerCase().includes(text.toLowerCase())) {
            return item;
        }
    });
      setFilteredDataSource(newData)
      setSearch(text)
    } else {
      setFilteredDataSource(inventoryList)
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
      <Headers
        goBackPress={() => navigation.goBack()}
        propertyImg={user.photoURL}
        filterPress={() => setShowFilterModal(true)}
        value={search}
        onChangeText={(text) => searchInventoryFilter(text)}
      />
      <View style={{ width: '95%', alignSelf: 'center' }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 30, marginBottom: 30 }}>
          <View style={{ marginLeft: 5 }}>
            <Text style={styles.screenHeading}>Marketplace</Text>
            <Text style={styles.totalInventory}>Total Properties: </Text>
          </View>
          <View style={styles.typeContainer}>
            <TouchableOpacity style={[styles.type, { backgroundColor: inventoryTypeLet ? '#917AFD' : '#F2F2F3' }]} onPress={() => chnageInventoryTypeHandler(1)} >
              <Text style={[styles.typeText, { color: inventoryTypeLet ? 'white' : '#1A1E25' }]}>My Inventory</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.type, { backgroundColor: inventoryTypeBuy ? '#917AFD' : '#F2F2F3' }]} onPress={() => chnageInventoryTypeHandler(2)} >
              <Text style={[styles.typeText, { color: inventoryTypeBuy ? 'white' : '#1A1E25' }]}>Marketplace</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>

      {
        showFilters ?
          <TouchableOpacity style={styles.removeFilterButton} onPress={removeFilterHandler}>
            <Text style={{ color: 'black', fontSize: 13, fontWeight: '400' }}>Remove Filters</Text>
            <Icon1
              name='remove'
              size={15}
              color="black"
            />
          </TouchableOpacity>
          : null
      }

      {
        inventoryTypeLet ?
          <FlatList
            data={filteredDataSource}
            keyExtractor={(stock) => stock.id}
            renderItem={({ item, index }) => {
              if (item.user_id == user.uid) {
                return (
                  <InventoryCard
                    address={item.societyName + ", " + item.cityName}
                    houseName={item.houseName}
                    propertyImg={item.propertyImg}
                    catagory={item.catagory}
                    rent={item.demand}
                    rooms={item.rooms.bedrooms}
                    area={item.size}
                    areatype={item.sizeType}
                    propertyType={item.propertyType}
                    transactionType={item.transactionType}
                    from="My"
                    removeMarketplace={() => removeFromMarketplaceHandler(item.id, item.propertyID)}
                    //image="https://images.pexels.com/photos/323780/pexels-photo-323780.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
                    navigatePress={() => navigation.navigate('MarketplaceDetails', item)}
                  />
                )
              }
            }}
            refreshControl={<RefreshControl refreshing={false} onRefresh={getMarketplaceInventories} />}
          />
          :
          <FlatList
            data={filteredDataSource}
            keyExtractor={(stock) => stock.id}
            renderItem={({ item, index }) => {
              if (item.user_id !== user.uid) {
                return (
                  <InventoryCard
                    address={item.societyName + ", " + item.cityName}
                    houseName={item.houseName}
                    propertyImg={item.propertyImg}
                    catagory={item.catagory}
                    rent={item.demand}
                    rooms={item.rooms.bedrooms}
                    area={item.size}
                    areatype={item.sizeType}
                    propertyType={item.propertyType}
                    transactionType={item.transactionType}
                    from="Other"
                    //image="https://images.pexels.com/photos/323780/pexels-photo-323780.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
                    navigatePress={() => navigation.navigate('MarketplaceDetails', item)}
                  />
                )
              }
            }}
            refreshControl={<RefreshControl refreshing={false} onRefresh={getMarketplaceInventories} />}
          />
      }



      {/* FILTER MODAL */}
      <Modal visible={showFilterModal} animationType='slide' transparent={true}>
        <View style={{ backgroundColor: '#D3D3D3', opacity: 0.5, height: '10%' }}></View>
        <View style={{ height: '90%', elevation: 7, backgroundColor: 'white' }}>
          <ScrollView contentContainerStyle={{ flexGrow: 1, backgroundColor: 'white' }}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
              <View />
              <Text style={{ fontSize: 18, color: 'black', alignSelf: 'center', fontWeight: '700' }}>Filter Marketplace</Text>
              <TouchableOpacity style={[styles.closeIconContainer, { margin: 10 }]} onPress={() => setShowFilterModal(false)}>
                <Icon
                  name='close'
                  color="black"
                  size={25}
                />
              </TouchableOpacity>
            </View>
            <View style={{ width: '90%', alignSelf: 'center' }}>
              <Text style={[styles.heading, { marginTop: 25 }]}>
                Transaction Type
              </Text>
              <View style={transactionStyles.typeContainer}>
                <TouchableOpacity
                  style={[transactionStyles.type, { backgroundColor: saleType ? '#917AFD' : '#F2F2F3' }]}
                  onPress={() => changeTransactionHandler(1)}
                >
                  <Text style={[transactionStyles.typeText, { color: saleType ? 'white' : '#7D7F88' }]}>For Sale</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[transactionStyles.type, { backgroundColor: letType ? '#917AFD' : '#F2F2F3' }]}
                  onPress={() => changeTransactionHandler(2)}
                >
                  <Text style={[transactionStyles.typeText, { color: letType ? 'white' : '#7D7F88' }]}>To Let</Text>
                </TouchableOpacity>
              </View>

              <Text style={[styles.heading, { marginTop: 15 }]}>
                Find your place in {cityName}
              </Text>
              <View style={styles.societyContainer}>
                <TextInput
                  placeholder='Search society here...'
                  placeholderTextColor="#1A1E25"
                  style={styles.demandInput1}
                  keyboardType='default'
                  value={searchSocietyName}
                  onChangeText={(text) => searchFilter(text)}
                />
                <Icon1
                  name='search'
                  color="#1A1E25"
                  size={25}
                  style={{ marginRight: 20 }}
                />
              </View>
              {
                searchSocietyName !== "" ?
                  <View style={{ height: 200, marginTop: 10 }}>
                    <FlatList
                      data={filterSocietyData}
                      keyExtractor={(stock) => stock.id}
                      renderItem={({ item }) => {
                        return (
                          <TouchableOpacity
                            style={{ borderBottomColor: '#ccc', borderBottomWidth: 1, marginBottom: 5 }}
                            onPress={() => changeSocietyName(item.name)}
                          >
                            <Text style={{ color: 'black', fontSize: 15, marginBottom: 10, marginLeft: 10 }}>{item.name}</Text>
                          </TouchableOpacity>
                        )
                      }}
                    />
                  </View>
                  : null
              }

              <Text style={{ fontSize: 15, fontWeight: '500', marginTop: 10, color: 'black' }}>Society: {societyName}</Text>

              <Text style={[styles.heading, { marginTop: 15 }]}>
                Property Type
              </Text>
              <ScrollView
                horizontal={true}
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={propertyStyles.container}>
                <TouchableOpacity style={[propertyStyles.typeContainer, { marginHorizontal: 10, backgroundColor: plotsProperty ? '#917AFD' : '#F2F2F3' }]} onPress={() => changePropertyHandler(1)}>
                  <Text style={[propertyStyles.type, { color: plotsProperty ? 'white' : '#7D7F88' }]}>Plot</Text>
                </TouchableOpacity>
                <TouchableOpacity style={[propertyStyles.typeContainer, { marginHorizontal: 10, backgroundColor: houseProperty ? '#917AFD' : '#F2F2F3' }]} onPress={() => changePropertyHandler(2)}>
                  <Text style={[propertyStyles.type, { color: houseProperty ? 'white' : '#7D7F88' }]}>House</Text>
                </TouchableOpacity>
                <TouchableOpacity style={[propertyStyles.typeContainer, { marginHorizontal: 10, backgroundColor: flatProperty ? '#917AFD' : '#F2F2F3' }]} onPress={() => changePropertyHandler(3)}>
                  <Text style={[propertyStyles.type, { color: flatProperty ? 'white' : '#7D7F88' }]}>Apartment</Text>
                </TouchableOpacity>
                <TouchableOpacity style={[propertyStyles.typeContainer, { marginHorizontal: 10, backgroundColor: fileProperty ? '#917AFD' : '#F2F2F3' }]} onPress={() => changePropertyHandler(11)}>
                  <Text style={[propertyStyles.type, { color: fileProperty ? 'white' : '#7D7F88' }]}>File</Text>
                </TouchableOpacity>
                <TouchableOpacity style={[propertyStyles.typeContainer, { marginRight: 10, backgroundColor: officeProperty ? '#917AFD' : '#F2F2F3' }]} onPress={() => changePropertyHandler(4)}>
                  <Text style={[propertyStyles.type, { color: officeProperty ? 'white' : '#7D7F88' }]}>Office</Text>
                </TouchableOpacity>
                <TouchableOpacity style={[propertyStyles.typeContainer, { marginHorizontal: 10, backgroundColor: shopProperty ? '#917AFD' : '#F2F2F3' }]} onPress={() => changePropertyHandler(5)}>
                  <Text style={[propertyStyles.type, { color: shopProperty ? 'white' : '#7D7F88' }]}>Shop</Text>
                </TouchableOpacity>
                <TouchableOpacity style={[propertyStyles.typeContainer, { marginHorizontal: 10, backgroundColor: buildingProperty ? '#917AFD' : '#F2F2F3' }]} onPress={() => changePropertyHandler(6)}>
                  <Text style={[propertyStyles.type, { color: buildingProperty ? 'white' : '#7D7F88' }]}>Building</Text>
                </TouchableOpacity>
                <TouchableOpacity style={[propertyStyles.typeContainer, , { marginLeft: 10, backgroundColor: factoryProperty ? '#917AFD' : '#F2F2F3' }]} onPress={() => changePropertyHandler(7)}>
                  <Text style={[propertyStyles.type, { color: factoryProperty ? 'white' : '#7D7F88' }]}>Factory</Text>
                </TouchableOpacity>
                <TouchableOpacity style={[propertyStyles.typeContainer, { marginHorizontal: 10, backgroundColor: farmProperty ? '#917AFD' : '#F2F2F3' }]} onPress={() => changePropertyHandler(8)}>
                  <Text style={[propertyStyles.type, { color: farmProperty ? 'white' : '#7D7F88' }]}>Farm House</Text>
                </TouchableOpacity>
                <TouchableOpacity style={[propertyStyles.typeContainer, { marginHorizontal: 10, backgroundColor: pentHouseProperty ? '#917AFD' : '#F2F2F3' }]} onPress={() => changePropertyHandler(9)}>
                  <Text style={[propertyStyles.type, { color: pentHouseProperty ? 'white' : '#7D7F88' }]}>Pent House</Text>
                </TouchableOpacity>
                <TouchableOpacity style={[propertyStyles.typeContainer, { marginHorizontal: 10, backgroundColor: agricultureProperty ? '#917AFD' : '#F2F2F3' }]} onPress={() => changePropertyHandler(10)}>
                  <Text style={[propertyStyles.type, { color: agricultureProperty ? 'white' : '#7D7F88' }]}>Agriculture</Text>
                </TouchableOpacity>
              </ScrollView>

              <Text style={[styles.heading, { marginTop: 15 }]}>
                Price Range
              </Text>

              <View style={styles.valuesContainer}>
                <Text style={{ color: 'black', fontSize: 15, fontWeight: '600' }}>Min Amount:</Text>
                <TextInput
                  style={styles.valueInput}
                  value={minValue}
                  placeholderTextColor="#7D7F88"
                  keyboardType='number-pad'
                  onChangeText={(text) => setMinValue(text)}
                />
              </View>

              <View style={styles.valuesContainer}>
                <Text style={{ color: 'black', fontSize: 15, fontWeight: '600' }}>Max Amount:</Text>
                <TextInput
                  style={styles.valueInput}
                  value={maxValue}
                  placeholderTextColor="#7D7F88"
                  keyboardType='number-pad'
                  onChangeText={(text) => setMaxValue(text)}
                />
              </View>
            </View>

            <View style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
              width: '90%',
              alignSelf: 'center',
              // backgroundColor:'red',
              marginTop: '20%'
            }}>
              <TouchableOpacity style={styles.resetButton}>
                <Icon
                  name='reload1'
                  size={25}
                  color="#917AFD"
                />
                <Text style={styles.resetButtonText}>Reset all</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.showResultsButton} onPress={applyFiltersHandler}>
                <Text style={styles.showResultsButtonText}>Show Results</Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </View>

      </Modal>

    </View>
  )
}

const styles = StyleSheet.create({
  screen: {
    backgroundColor: '#FCFCFC',
    flex: 1
  },
  typeContainer: {
    // marginTop: 35,
    // borderColor:'red',
    // borderWidth:1,
    width: '50%',
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
    borderRadius: 6,
    alignItems: 'center',
    justifyContent: 'center',
    width: 86,
    height: 35,
    elevation: 1
    // flex:1
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
  screenHeading: {
    color: '#1A1E25',
    fontFamily: 'SF Pro Text',
    fontWeight: '700',
    fontSize: 20,
    fontStyle: 'normal',
  },
  totalInventory: {
    color: '#7D7F88',
    fontFamily: 'SF Pro Text',
    fontWeight: '400',
    fontSize: 12,
    fontStyle: 'normal',
    marginTop: 5
  },
  header: {
    width: '95%',
    alignSelf: 'center',
    // borderColor:'red',
    // borderWidth:1,
    marginTop: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  menu: {
    height: 34,
    width: 34,
    borderRadius: 10,
    borderColor: '#E3E3E7',
    borderWidth: 0.5,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FDFDFD',
    elevation: 9
  },
  searchbar: {
    width: '65%',
    alignSelf: 'center',
    borderColor: '#E3E3E7',
    borderWidth: 0.8,
    flexDirection: 'row',
    alignItems: 'center',
    // borderColor:'red',
    // borderWidth:1,
    backgroundColor: 'white',
    borderRadius: 20,
    height: 48
    // justifyContent:'center'
  },
  societyContainer: {
    backgroundColor: '#F2F2F3',
    borderWidth: 0.8,
    borderColor: '#E3E3E7',
    borderRadius: 10,
    alignItems: 'center',
    height: 50,
    flexDirection: 'row',
    marginTop: 15,
    // marginBottom: 10
  },
  demandInput1: {
    color: '#1A1E25',
    fontSize: 16,
    fontFamily: 'Lato',
    fontWeight: '600',
    alignSelf: 'flex-start',
    marginLeft: 5,
    // lex:1,
    width: '90%',
  },
  searchbarPlaceholder: {
    color: '#1A1E25',
    fontFamily: 'SF Pro Text',
    fontWeight: '400',
    fontSize: 12,
    fontStyle: 'normal',
    // marginTop: 10,
    // borderColor:'green',
    // borderWidth:1,
    lineHeight: 15,
    marginLeft: 5,
    // alignItems:'center',
    // alignSelf:'center',
    // width:'100%'
    flex: 1
  },
  filter: {
    width: 48,
    height: 48,
    borderRadius: 10,
    borderColor: '#E3E3E7',
    borderWidth: 0.5,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#917AFD',
    elevation: 9
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
    elevation: 4,
    alignSelf: 'flex-end'
  },
  heading: {
    fontFamily: 'Lato',
    fontWeight: '700',
    fontSize: 16,
    color: 'black',
    marginTop: 2
  },
  valuesContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    alignSelf: 'center',
    // borderColor:'red',
    // borderWidth:1,
    marginTop: 10
  },
  valueInput: {
    borderColor: '#E3E3E7',
    borderWidth: 0.8,
    width: '25%',
    height: 45,
    backgroundColor: '#F2F2F3',
    borderRadius: 5
  },
  resetButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '30%',
    height: 50
  },
  resetButtonText: {
    color: '#7D7F88',
    fontSize: 16,
    fontWeight: '500',
    fontFamily: 'SF Pro Text'
  },
  showResultsButton: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 156,
    height: 50,
    backgroundColor: '#222831',
    borderRadius: 72
  },
  showResultsButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '500',
    fontFamily: 'SF Pro Text'
  },
  removeFilterButton: {
    width: 130,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    alignSelf: 'flex-end',
    marginRight: 20,
    borderColor: '#E3E3E7',
    borderWidth: 0.8,
    backgroundColor: 'white',
    elevation: 2,
    marginBottom: 20,
    height: 30,
    borderRadius: 20
  },
  card: {
    width: '95%',
    alignSelf: 'center',
    // borderColor:'red',
    // borderWidth:1,
    marginBottom: 20,
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
  }

})

const transactionStyles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  heading: {
    fontFamily: 'Lato',
    fontWeight: '700',
    fontSize: 16,
    color: '#1A1E25'
  },
  resetContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '22%',
    justifyContent: 'space-between'
  },
  resetText: {
    fontFamily: 'SF Pro Text',
    fontWeight: '500',
    fontSize: 16,
    color: '#7D7F88',
    // marginTop:5
  },
  houseText: {
    fontFamily: 'SF Pro Text',
    fontWeight: '500',
    fontSize: 16,
    color: '#7D7F88',
    marginTop: 10,
    lineHeight: 30
  },

  typeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    // borderColor:'green',
    // borderWidth:1,
    marginTop: 20,
    width: '60%',
    justifyContent: 'space-between',
    marginBottom: 10
  },
  type: {
    backgroundColor: '#F2F2F3',
    alignItems: 'center',
    justifyContent: 'center',
    borderColor: '#E3E3E7',
    borderWidth: 0.8,
    borderRadius: 92,
    height: 36,
    width: 106,
    // elevation: 7
  },
  typeText: {
    fontFamily: 'SF Pro Text',
    fontWeight: '400',
    fontSize: 14,
    // color: '#7D7F88'
  },
})

const propertyStyles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    // borderColor:'green',
    // borderWidth:1,
    marginTop: 20,
    // width:'60%',
    justifyContent: 'space-between',
    marginBottom: 10
  },

  containerOne: {
    flexDirection: 'row',
    alignItems: 'center',
    // borderColor:'green',
    // borderWidth:1,
    marginTop: 20,
    // width:'60%',

    width: "250%",
    justifyContent: 'space-between',
    marginBottom: 10
  },
  typeContainer: {
    backgroundColor: '#F2F2F3',
    alignItems: 'center',
    justifyContent: 'center',
    borderColor: '#E3E3E7',
    borderWidth: 0.8,
    borderRadius: 92,
    // paddingHorizontal: 10,
    height: 38,
    width: 100,
    // elevation: 7,
    marginVertical: 5
  },
  type: {
    fontFamily: 'SF Pro Text',
    fontWeight: '400',
    fontSize: 12,
    color: '#7D7F88'
  },


  containerCatagory: {
    flexDirection: 'row',
    alignItems: 'center',
    // borderColor:'green',
    // borderWidth:1,
    marginTop: 20,
    // width:'60%'
    justifyContent: 'space-between',
    marginBottom: 10
  },

  typeContainercatagory: {
    backgroundColor: '#F2F2F3',
    alignItems: 'center',
    justifyContent: 'center',
    borderColor: '#E3E3E7',
    borderWidth: 0.8,
    borderRadius: 92,
    height: 36,
    width: 120,
    // elevation: 7
  },
  typecategory: {
    fontFamily: 'SF Pro Text',
    fontWeight: '400',
    fontSize: 12,
    color: '#7D7F88'
  },


})