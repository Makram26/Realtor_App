import React, { useState, useContext } from 'react'
import { StyleSheet, Text, View, TouchableOpacity, Image, ScrollView, Dimensions, Modal } from 'react-native'
import { BackgroundImage } from 'react-native-elements/dist/config';

import { AuthContext } from '../../auth/AuthProvider'

import Spinner from 'react-native-loading-spinner-overlay';

import Icon from 'react-native-vector-icons/Ionicons'
import Icon1 from 'react-native-vector-icons/Entypo'
import Icon2 from 'react-native-vector-icons/MaterialIcons'

// import MapView, { Marker } from 'react-native-maps';

const { width } = Dimensions.get('window')
const height = width * 0.4

export default function MarketplaceDetails({ route, navigation }) {
  const items = route.params
  console.log("MarketplaceDetails-Inventory===>>>", items)
  const {
    societyName, cityName, id, transactionType, houseName,
    demand, rooms, size, sizeType, propertyImg, facilities, description, leadName, propertyType,
    businessID, name, role, catagory, isLead, toMarketplace, mobileNumber } = items

  // console.log(catagory)
  const { user } = useContext(AuthContext);

  const [showImageModal, setShowImageModal] = useState(false)

  return (
    <View style={styles.body}>
      <ScrollView contentContainerStyle={{ flexGrow: 1, backgroundColor: "#fbfcfa" }}>

        {/* Image Setting */}
        {
          propertyImg ?
            <BackgroundImage
              source={{ uri: propertyImg }}
              style={{ width: "100%", alignSelf: 'center', height: 269, backgroundColor: 'white' }}>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                <TouchableOpacity style={styles.headerIconContainer} onPress={() => navigation.pop()}>
                  <Icon
                    name='chevron-back-outline'
                    color="black"
                    size={25}
                  />
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.headerIconContainer}
                // onPress={() => navigation.navigate('EditInventory', items)}
                >
                  <Image
                    source={require('../../assets/icons/Edit.png')}
                    style={{ width: 18, height: 18 }}
                  />
                </TouchableOpacity>
              </View>
              <TouchableOpacity
                style={{
                  alignSelf: 'flex-end',
                  marginTop: 150,
                  backgroundColor: '#FCFCFC',
                  borderWidth: 0.5,
                  borderRadius: 50,
                  borderColor: '#E3E3E7',
                  width: 34,
                  height: 34,
                  alignItems: 'center',
                  justifyContent: 'center',
                  elevation: 7,
                  marginRight: 15
                }}
                onPress={() => setShowImageModal(true)}
              >
                {/* <Image 
                                source={require('../../assets/icons/circles.png')}  
                                style={{width: 18, height:18}}
                            /> */}
                <Icon
                  name='expand-outline'
                  size={15}
                  color="black"
                />
              </TouchableOpacity>
            </BackgroundImage>
            :
            <BackgroundImage
              source={require('../../assets/images/nommage.jpg')}
              style={{ width: "100%", alignSelf: 'center', height: 269, backgroundColor: 'white' }}
              resizeMode="contain"
            >
              <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                <TouchableOpacity style={styles.headerIconContainer} onPress={() => navigation.pop()}>
                  <Icon
                    name='chevron-back-outline'
                    color="black"
                    size={25}
                  />
                </TouchableOpacity>
                <View
                  style={styles.headerIconContainer}
                // onPress={() => navigation.navigate('EditInventory', items)}
                >
                  <Image
                    source={require('../../assets/icons/Edit.png')}
                    style={{ width: 18, height: 18 }}
                  />
                </View>
              </View>
            </BackgroundImage>
        }

        <View style={{ marginTop: 15, width: '90%', alignSelf: 'center' }}>
          <View style={{ marginTop: 20, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
            <Text style={{ fontSize: 18, fontWeight: '600', color: '#1A1E25' }}>Property Catagory</Text>
            <Text style={{ fontSize: 17, fontWeight: '400', color: '#7D7F88' }}>{propertyType}</Text>
          </View>
          <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 5, marginTop: 20 }}>

            {
              houseName !== "" ?
                <>
                  {
                    propertyType === "Files" ?
                      <Text style={{ fontSize: 20, height: 40, fontWeight: '700', color: '#1A1E25' }}>
                        File# <Text style={{ fontSize: 18, fontWeight: '500', color: '#1A1E25', lineHeight: 20 }}>
                          {houseName}
                        </Text>
                      </Text>
                      :
                      <Text style={{ fontSize: 20, height: 40, fontWeight: '700', color: '#1A1E25' }}>
                        House# <Text style={{ fontSize: 18, fontWeight: '500', color: '#1A1E25', lineHeight: 20 }}>
                          {houseName}
                        </Text>
                      </Text>
                  }
                </>
                :
                null
            }
            {/* {
              houseName.includes('House') ?
                <Text style={{ fontSize: 18, fontWeight: '500', color: '#1A1E25', lineHeight: 20 }}>{houseName}</Text>
              :
                <Text style={{ fontSize: 20, height: 40, fontWeight: '700', color: '#1A1E25' }}>
                  House# <Text style={{ fontSize: 18, fontWeight: '500', color: '#1A1E25', lineHeight: 20 }}>{houseName}</Text>
                </Text>
            } */}

          </View>
          <View >
            {/* <View style={{ flexDirection: 'row' ,justifyContent:'space-between'}}> */}
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              {/* <Icon
                                name='location-sharp'
                                color="#1A1E25"
                                size={15}
                            /> */}
              <Image source={require('../../assets/icons/location.png')} />
              <Text style={{ fontSize: 16, fontWeight: '400', marginLeft: 6, color: '#7D7F88' }}>
                {societyName + ", " + cityName}
              </Text>
            </View>

            {
              propertyType == 'Plot' || propertyType == 'Files' || propertyType == 'Shop' || propertyType == 'Agriculture' ?
                null
                :
                <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 5 }}>
                  <Image source={require('../../assets/icons/room.png')} />
                  <Text style={{ width: 154, fontSize: 16, fontWeight: '400', marginLeft: 6, color: '#7D7F88' }}>
                    {rooms.bedrooms} Room
                  </Text>
                </View>
            }
            
            {/* </View> */}
            <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 5 }}>
              {/* <Icon2
                                name='house-siding'
                                color="#1A1E25"
                                size={15}
                            /> */}
              <Image source={require('../../assets/icons/house.png')} />
              <Text style={{ width: 154, fontSize: 16, fontWeight: '400', marginLeft: 6, color: '#7D7F88' }}>
                {size} {sizeType}
              </Text>
            </View>
          </View>
          <View style={{ marginTop: 20 }}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
              <Text style={{ fontSize: 18, fontWeight: '700', color: '#1A1E25' }}>Facilities</Text>
              {/* <Text style={{ fontSize: 14, fontWeight: '400', color: '#917AFD', marginTop: 6 }}>See All Facilities</Text> */}
            </View>

            <View style={{ flexWrap: 'wrap', justifyContent: 'space-between', width: '100%', flexDirection: 'row' }}>

              {
                facilities.gas ?
                  <View style={{ marginTop: 15, flexDirection: 'row', width: '45%', }}>
                    <Image source={require('../../assets/icons/Vector2.png')} style={{ width: 20, height: 20, marginRight: 4 }} />
                    <Text style={{ fontSize: 16, fontWeight: '400', alignSelf: 'center', color: '#1A1E25', marginLeft: 5 }}>Sui Gas</Text>
                  </View>
                  : null
              }


              {
                facilities.mainRoad ?
                  <View style={{ marginTop: 15, flexDirection: 'row', width: '45%', }}>
                    <Icon
                      name='water'
                      color="#7D7F88"
                      size={18}
                      style={{ width: 20, height: 20 }}
                    />
                    <Text style={{ fontSize: 16, fontWeight: '400', alignSelf: 'center', color: '#1A1E25', marginLeft: 5 }}>Main Road</Text>
                  </View>
                  : null
              }



              {
                facilities.facingPark ?
                  <View style={{ marginTop: 15, flexDirection: 'row', width: '45%', }}>
                    <Image source={require('../../assets/icons/Vector5.png')} style={{ width: 20, height: 20, marginRight: 4 }} />
                    <Text style={{ fontSize: 16, fontWeight: '400', alignSelf: 'center', color: '#1A1E25', marginLeft: 5 }}>Facing Park</Text>

                  </View>
                  : null
              }
              {
                facilities.corner ?
                  <View style={{ marginTop: 15, flexDirection: 'row', width: '45%', }}>
                    <Icon2
                      name='electrical-services'
                      color="#7D7F88"
                      size={18}
                      style={{ width: 20, height: 20, }}
                    />
                    <Text style={{ fontSize: 16, fontWeight: '400', alignSelf: 'center', color: '#1A1E25', marginLeft: 5 }}>Corner</Text>
                  </View>
                  : null
              }
              {
                facilities.ownerBuild ?
                  <View style={{ marginTop: 15, flexDirection: 'row', width: '45%', }}>
                    <Image source={require('../../assets/icons/Vector1.png')} style={{ width: 20, height: 20, marginRight: 9 }} />
                    <Text style={{ fontSize: 16, fontWeight: '400', alignSelf: 'center', color: '#1A1E25', marginLeft: 5 }}>Owner Built</Text>
                  </View>
                  : null
              }
              {
                facilities.gated ?
                  <View style={{ marginTop: 15, flexDirection: 'row', width: '45%' }}  >
                    <Image source={require('../../assets/icons/Vector3.png')} style={{ width: 20, height: 20, marginRight: 9 }} />
                    <Text style={{ fontSize: 16, fontWeight: '400', alignSelf: 'center', color: '#1A1E25', marginLeft: 5 }}>Gated</Text>
                  </View>
                  : null
              }
            </View>



          </View>
          <View style={{ borderBottomWidth: 1, borderColor: "#E2E2E2", marginTop: 25 }} />

          {
            mobileNumber !== "" ?
              <View style={{ marginTop: 20 }}>
                <Text style={{ fontSize: 18, fontWeight: '700', color: '#1A1E25' }}>Contact Number</Text>
                <Text style={{ fontFamily: 'SF Pro Text', fontWeight: '400', fontSize: 16, marginTop: 5 }}>
                  {mobileNumber}
                </Text>
              </View>
              : null
          }


          <View style={{ marginVertical: 20 }}>
            <Text style={{ fontSize: 18, fontWeight: '700', color: '#1A1E25' }}>Description</Text>
            {
              description !== "" ?
                <Text style={{ fontFamily: 'SF Pro Text', fontWeight: '400', fontSize: 16, marginTop: 5 }}>
                  {description}
                </Text>
                :
                <Text style={{ fontFamily: 'SF Pro Text', fontWeight: '400', fontSize: 16, marginTop: 5, fontStyle: 'italic' }}>No description</Text>
            }

          </View>

        </View>
      </ScrollView>
      <View style={{ marginTop: 10, width: '100%', alignSelf: 'center', elevation: 2, backgroundColor: 'white', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
        <View>
          <Text style={{ fontSize: 18, fontWeight: '600', color: '#917AFD', marginLeft: 10, marginTop: 10 }}>{transactionType == "Sale" ? "Demand" : "Budget"}</Text>
          <Text style={{ fontSize: 16, fontWeight: '600', color: '#1A1E25', marginLeft: 10, marginTop: 10, marginBottom: 10 }}>PKR {demand.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")} <Text style={{ fontSize: 16, fontWeight: '400', color: '#1A1E25' }}>{transactionType == "Sale" ? "" : "/ month"}</Text></Text>
        </View>
      </View>

      {/* Image Modal */}
      <Modal visible={showImageModal} animationType='slide' transparent={true}>
        <View style={{ backgroundColor: '#D3D3D3', opacity: 0.5, height: '25%' }}></View>
        <View style={{ height: '50%', elevation: 7, backgroundColor: 'white', flexDirection: 'row' }}>
          <TouchableOpacity style={[styles.closeIconContainer, { marginLeft: 5, }]} onPress={() => setShowImageModal(false)}>
            <Icon
              name='close'
              color="black"
              size={25}
            />
          </TouchableOpacity>
          <Image
            source={{ uri: propertyImg }}
            style={{ height: '100%', alignSelf: 'center', width: 350 }}
            resizeMode="contain"
          />
        </View>
        <View style={{ backgroundColor: '#D3D3D3', opacity: 0.5, height: '25%' }}></View>
      </Modal>
    </View>
  )
}

const styles = StyleSheet.create({
  body: {
    flex: 1,
    backgroundColor: '#fbfcfa'
  },
  header: {
    flexDirection: 'row',
    width: '95%',
    alignSelf: 'center',
    // borderColor: 'red',
    // borderWidth: 1,
    marginTop: 10,
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  headerIconContainer: {
    backgroundColor: '#FCFCFC',
    borderWidth: 0.5,
    borderRadius: 50,
    borderColor: '#E3E3E7',
    width: 34,
    height: 34,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 7,
    margin: 20
  },

  headerIconContainerMove: {
    width: 34,
    height: 34,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 1,
    margin: 30,
  },

  imageText: {
    backgroundColor: "#FCFCFC",
    width: 58,
    height: 25,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 60,
    marginLeft: 270,
    elevation: 10,
  },

  headerText: {
    fontFamily: 'Lato',
    fontWeight: '700',
    fontSize: 21,
    color: '#404040'
  },

  favoriteIcon: {
    width: 20,
    height: 17.8,
    marginTop: 5,
    // marginLeft: 60,
  },

  inventoryCard: {
    width: '95%',
    alignSelf: 'center',
    borderColor: '#c3c3c3',
    borderWidth: 1,
    marginTop: 30,
    marginBottom: 15,
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'space-between',
    borderRadius: 5,
    elevation: 9,
    backgroundColor: 'white',
    overflow: 'hidden'
  },
  imageContainer: {
    // borderColor: 'red',
    // borderWidth: 1,
    backgroundColor: 'white',
    height,
    width,
    elevation: 5,
    borderRadius: 6
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
    // alignSelf:'flex-end'
  },
})