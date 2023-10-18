import React, {useState, useCallback} from 'react';
import { 
StyleSheet, 
Text, 
View, 
TouchableOpacity, 
TextInput, 
ScrollView 
} from 'react-native';

import Icon from 'react-native-vector-icons/Ionicons'
import Icons from 'react-native-vector-icons/MaterialCommunityIcons'

// import Slider from '@react-native-community/slider'

import Slider from 'rn-range-slider';


import Label from '../../components/Slider/Label'
import Notch from '../../components/Slider/Notch'
import Rail from '../../components/Slider/Rail'
import RailSelected from '../../components/Slider/RailSelected'
import Thumb from '../../components/Slider/Thumb'


export default function FilterInventoryScreen({navigation}) {

    // Transaction States   
    const [saleType, setSaleType] = useState(false)
    const [letType, setLetType] = useState(true)

    // Property States
    const [anyProperty, setAnyProperty] = useState(false)
    const [houseProperty, setHouseProperty] = useState(true)
    const [studioProperty, setStudioProperty] = useState(false)
    const [cabinProperty, setCabinProperty] = useState(false)

    // Rooms States
    const [bedrooms, setBedrooms] = useState(0)
    const [bathrooms, setBathrooms] = useState(0)
    const [kitchen, setKitchen] = useState(0)

    // Facilities States
    const [gasFacilities, setGasFacilities] = useState(false)
    const [facingParkFacilities, setFacingParkFacilities] = useState(true)
    const [mainRoadFacilities, setMainRoadFacilities] = useState(false)
    const [cornerFacilities, setCornerFacilities] = useState(false)
    const [gatedFacilities, setGatedFacilities] = useState(false)
    const [ownerBuildFacilities, setOwnerBuildFacilities] = useState(false)

    // Slider States
    const [range, setRange] = useState('50%')
    const [sliding, setSliding] = useState('Inactive')

    // Input States
    const [location, setLocation] = useState('')
    const [demand, setDemand] = useState('')

    const [low, setLow] = useState(0);
    const [high, setHigh] = useState(100);
    const [min, setMin] = useState(0);
    const [max, setMax] = useState(100);
    const [floatingLabel, setFloatingLabel] = useState(false);

    const renderThumb = useCallback(() => <Thumb/>, []);
    const renderRail = useCallback(() => <Rail/>, []);
    const renderRailSelected = useCallback(() => <RailSelected/>, []);
    const renderLabel = useCallback(value => <Label text={value}/>, []);
    const renderNotch = useCallback(() => <Notch/>, []);
    const handleValueChange = useCallback((low, high) => {
        setLow(low);
        setHigh(high);
    }, []);


    const changeTransactionHandler = (id) => {
        console.log("id",id)
        if(id == 1){
            setSaleType(true)
            setLetType(false)
        }
        else{
            setSaleType(false)
            setLetType(true)
        }

    }

    const changePropertyHandler = (id) => {
        console.log("id",id)
        switch (id) {
            case 1:
                setAnyProperty(true)
                setHouseProperty(false)
                setStudioProperty(false)
                setCabinProperty(false)
                break;
            case 2:
                setAnyProperty(false)
                setHouseProperty(true)
                setStudioProperty(false)
                setCabinProperty(false)
                break;
            case 3:
                setAnyProperty(false)
                setHouseProperty(false)
                setStudioProperty(true)
                setCabinProperty(false)
                break;
            case 4:
                setAnyProperty(false)
                setHouseProperty(false)
                setStudioProperty(false)
                setCabinProperty(true)
                break;
        }
    }

    const applyFilterHandler = () => {
        const temp = []

        temp.push({
            transactionType: saleType ? "Sale" : "Let",
            location: location,
            propertyType: anyProperty ? 'Any' : houseProperty ? 'House' : studioProperty ? 'Studio' : 'Cabin',
            range: {
                low: low,
                high: high
            },
            price: demand,
            rooms: {
                bedrooms: bedrooms,
                bathrooms: bathrooms,
                kitchen: kitchen,
            },
            facilities: {
                gas: gasFacilities, //gas
                facingPark: facingParkFacilities, //facing park
                mainRoad: mainRoadFacilities, //mainRoad
                corner: cornerFacilities, //corner
                gated: gatedFacilities, //gated
                ownerBuild: ownerBuildFacilities //owner built
            },
        })

        console.log("SAVED", temp)
    }

    const restAllHandler = () => {

    }

    return (
        <View style={styles.screen}>
            <View style={styles.header}>
                <TouchableOpacity onPress={()=>navigation.pop()}>
                    <Icon
                        name='chevron-back-outline'
                        color="#1A1E25"
                        size={25}
                    />
                </TouchableOpacity>
                <View style={styles.searchbar}>
                    <Icon
                        name='search'
                        color='#1A1E25'
                        size={18}
                        style={{ marginLeft: 10 }}
                    />
                    <TextInput
                        placeholder='Seach Location'
                        placeholderTextColor='#1A1E25'
                        style={styles.searchbarPlaceholder}
                    />
                </View>
                <View style={styles.filter}>
                    <Icon
                        name='filter'
                        color='white'
                        size={24}
                    />
                </View>
            </View>

            <ScrollView style={styles.body}>

                {/* Transaction Type */}
                <View style={transactionStyles.container}>
                    <Text style={transactionStyles.heading}>Transaction Type</Text>
                    
                    <TouchableOpacity style={transactionStyles.resetContainer}>
                        <Icon
                            name='reload'
                            color="#917AFD"
                            size={16}
                        />
                        <Text style={transactionStyles.resetText}>
                            Reset all
                        </Text>
                    </TouchableOpacity>
                </View>

                <View style={transactionStyles.typeContainer}>
                   
                    <TouchableOpacity 
                        style={[transactionStyles.type,{backgroundColor:saleType ? '#917AFD': '#F2F2F3'}]} 
                        onPress={()=>changeTransactionHandler(1)}
                    >
                        <Text style={[transactionStyles.typeText, {color:saleType ? 'white' : '#7D7F88'}]}>For Sale</Text>
                    </TouchableOpacity>
                    
                    <TouchableOpacity 
                        style={[transactionStyles.type,{backgroundColor:letType ? '#917AFD': '#F2F2F3'}]} 
                        onPress={()=>changeTransactionHandler(2)}
                    >
                        <Text style={[transactionStyles.typeText, {color:letType ? 'white' : '#7D7F88'}]}>To Let</Text>
                    </TouchableOpacity>
                       
                </View>

                <View style={{borderColor:'#E2E2E2',borderWidth:1,marginVertical:10}}/>

                {/* Find your place */}
                <Text style={styles.heading}>
                    Find your place in
                </Text>

                <View style={styles.placeFindContainer}>
                    <Icon
                        name='location'
                        color="#6246EA"
                        size={25}
                        style={{marginLeft:5}}
                    />
                    <TextInput
                        placeholder='Lahore, DHA'
                        placeholderTextColor="#1A1E25"
                        style={{flex:1,marginLeft:5,color:'#1A1E25',}}
                        value={location}
                        onChangeText={(value) => setLocation(value)}
                    />
                    <Icon
                        name='search'
                        color="#1A1E25"
                        size={22}
                        style={{marginRight:10}}
                    />
                </View>

                <View style={{borderColor:'#E2E2E2',borderWidth:1,marginVertical:10}}/>

                {/* Property Type */}
                <Text style={styles.heading}>
                    Property type
                </Text>

                <View style={propertyStyles.container}>
                    <TouchableOpacity 
                        style={[propertyStyles.typeContainer,{backgroundColor:anyProperty ? '#917AFD': '#F2F2F3'}]} 
                        onPress={()=>changePropertyHandler(1)}
                    >
                        <Text style={[propertyStyles.type,{color:anyProperty ? 'white' : '#7D7F88'}]}>Any</Text>
                    </TouchableOpacity>
                    <TouchableOpacity 
                        style={[propertyStyles.typeContainer,{backgroundColor:houseProperty ? '#917AFD': '#F2F2F3'}]} 
                        onPress={()=>changePropertyHandler(2)}
                    >
                        <Text style={[propertyStyles.type, {color:houseProperty ? 'white' : '#7D7F88'}]}>House</Text>
                    </TouchableOpacity>
                    <TouchableOpacity 
                        style={[propertyStyles.typeContainer,{backgroundColor:studioProperty ? '#917AFD': '#F2F2F3'}]} 
                        onPress={()=>changePropertyHandler(3)}
                    >
                        <Text style={[propertyStyles.type, {color:studioProperty ? 'white' : '#7D7F88'}]}>Studio</Text>
                    </TouchableOpacity>
                    <TouchableOpacity 
                        style={[propertyStyles.typeContainer,{backgroundColor:cabinProperty ? '#917AFD': '#F2F2F3'}]} 
                        onPress={()=>changePropertyHandler(4)}
                    >
                        <Text style={[propertyStyles.type, {color:cabinProperty ? 'white' : '#7D7F88'}]}>Cabin</Text>
                    </TouchableOpacity> 
                </View>

                <View style={{borderColor:'#E2E2E2',borderWidth:1,marginVertical:10}}/>

                {/* Property Type */}
                <Text style={styles.heading}>
                    Price range
                </Text>

                <Text style={{
                    fontFamily:'Lato',
                    fontSize:16,
                    fontWeight:'400',
                    color:'#1A1E25',
                    marginLeft:20,
                    marginTop:5
                }}>Rs. {low} - Rs. {high} /month</Text>

                {/* 
                <Slider
                    style={{width: 250, height: 40}}
                    minimumValue={0}
                    maximumValue={50000}
                    minimumTrackTintColor="#6246EA"
                    maximumTrackTintColor="#000000"
                    thumbTintColor='#6246EA'
                    value={1000}
                    onValueChange={value => setRange(parseInt(value))}
                    onSlidingStart={()=>setSliding('Sliding')}
                    onSlidingComplete={()=>setSliding('Inactive')}
                /> */}

                <Slider
                    style={styles.slider}
                    min={min}
                    max={max}
                    step={1}
                    // disableRange={rangeDisabled}
                    floatingLabel={floatingLabel}
                    renderThumb={renderThumb}
                    renderRail={renderRail}
                    renderRailSelected={renderRailSelected}
                    renderLabel={renderLabel}
                    renderNotch={renderNotch}
                    onValueChanged={handleValueChange}
                />

                <Text style={styles.heading}>
                    Enter Price
                </Text>

                <View style={styles.demandContainer}>
                    <TextInput
                        placeholder='Type price here...'
                        placeholderTextColor="#1A1E25"
                        style={styles.demandInput}
                        keyboardType='numeric'
                        value={demand}
                        onChangeText={(value) => setDemand(value)}
                    />
                </View>

                <View style={{borderColor:'#E2E2E2',borderWidth:1,marginVertical:10}}/>

                <Text style={styles.heading}>
                    Rooms and beds
                </Text>

                <View style={roomStyles.container}>
                    <Text style={roomStyles.containerHeading}>Bedrooms</Text>

                    <View style={roomStyles.countContainer}>
                        <TouchableOpacity onPress={()=>{setBedrooms(prev => prev - 1)}} disabled={bedrooms < 1 ? true : false}>
                            <Icons
                                name='minus-circle-outline'
                                color={bedrooms < 1 ? '#BABCBF' : "#1A1E25"}
                                size={25}
                            />
                        </TouchableOpacity>
                        
                        <Text style={roomStyles.count}>
                            {bedrooms}
                        </Text>

                        <TouchableOpacity onPress={()=>{setBedrooms(prev => prev + 1)}}>
                            <Icons
                                name='plus-circle-outline'
                                color="#1A1E25"
                                size={25}
                            />
                        </TouchableOpacity>
                        
                    </View>
                </View>

                <View style={roomStyles.container}>
                    <Text style={roomStyles.containerHeading}>Bathrooms</Text>

                    <View style={roomStyles.countContainer}>
                        <TouchableOpacity onPress={()=>{setBathrooms(prev => prev - 1)}} disabled={bathrooms < 1 ? true : false}>
                            <Icons
                                name='minus-circle-outline'
                                color={bathrooms < 1 ? '#BABCBF' : "#1A1E25"}
                                size={25}
                            />
                        </TouchableOpacity>
                        
                        <Text style={roomStyles.count}>
                            {bathrooms}
                        </Text>

                        <TouchableOpacity onPress={()=>{setBathrooms(prev => prev + 1)}}>
                            <Icons
                                name='plus-circle-outline'
                                color="#1A1E25"
                                size={25}
                            />
                        </TouchableOpacity>
                    </View>
                </View>

                <View style={roomStyles.container}>
                    <Text style={roomStyles.containerHeading}>Kitchen</Text>

                    <View style={roomStyles.countContainer}>
                        <TouchableOpacity onPress={()=>{setKitchen(prev => prev - 1)}} disabled={kitchen < 1 ? true : false}>
                            <Icons
                                name='minus-circle-outline'
                                color={kitchen < 1 ? '#BABCBF' : "#1A1E25"}
                                size={25}
                            />
                        </TouchableOpacity>
                        
                        <Text style={roomStyles.count}>
                            {kitchen}
                        </Text>

                        <TouchableOpacity onPress={()=>{setKitchen(prev => prev + 1)}}>
                            <Icons
                                name='plus-circle-outline'
                                color="#1A1E25"
                                size={25}
                            />
                        </TouchableOpacity>
                    </View>
                </View>

                <View style={{borderColor:'#E2E2E2',borderWidth:1,marginVertical:15}}/>

                <Text style={styles.heading}>
                    Property Facilities
                </Text>
                <View style={styles.facilitiesContainer}>
                    <TouchableOpacity style={[styles.facilities, { width: 109, backgroundColor: gasFacilities ? '#917AFD' : '#F2F2F3' }]} onPress={() => { setGasFacilities(!gasFacilities) }}>
                        <Text style={[styles.facilitiesText, { color: gasFacilities ? 'white' : '#7D7F88' }]}>Sui Gas</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={[styles.facilities, { width: 109, backgroundColor: facingParkFacilities ? '#917AFD' : '#F2F2F3' }]} onPress={() => { setFacingParkFacilities(!facingParkFacilities) }}>
                        <Text style={[styles.facilitiesText, { color: facingParkFacilities ? 'white' : '#7D7F88' }]}>Facing Park</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={[styles.facilities, { width: 109, backgroundColor: mainRoadFacilities ? '#917AFD' : '#F2F2F3' }]} onPress={() => { setMainRoadFacilities(!mainRoadFacilities) }}>
                        <Text style={[styles.facilitiesText, { color: mainRoadFacilities ? 'white' : '#7D7F88' }]}>Main Road</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={[styles.facilities, { width: 109, marginTop: 25, backgroundColor: cornerFacilities ? '#917AFD' : '#F2F2F3' }]} onPress={() => { setCornerFacilities(!cornerFacilities) }}>
                        <Text style={[styles.facilitiesText, { color: cornerFacilities ? 'white' : '#7D7F88' }]}>Corner</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={[styles.facilities, { width: 109, backgroundColor: gatedFacilities ? '#917AFD' : '#F2F2F3' }]} onPress={() => { setGatedFacilities(!gatedFacilities) }}>
                        <Text style={[styles.facilitiesText, { color: gatedFacilities ? 'white' : '#7D7F88' }]}>Gated</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={[styles.facilities, { width: 109, backgroundColor: ownerBuildFacilities ? '#917AFD' : '#F2F2F3' }]} onPress={() => { setOwnerBuildFacilities(!ownerBuildFacilities) }}>
                        <Text style={[styles.facilitiesText, { color: ownerBuildFacilities ? 'white' : '#7D7F88' }]}>Owner Built</Text>
                    </TouchableOpacity>
                </View>
                <View style={{borderColor:'#E2E2E2',borderWidth:1,marginVertical:20}}/>

                <View style={styles.footer}>
                    
                    <TouchableOpacity style={transactionStyles.resetContainer}>
                        <Icon
                            name='reload'
                            color="#6246EA"
                            size={16}
                        />
                        <Text style={transactionStyles.resetText}>
                            Reset all
                        </Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={styles.footerButton}
                        onPress={applyFilterHandler}
                    >
                        <Text
                            style={styles.footerButtonText}
                        >
                            Show results
                        </Text>
                    </TouchableOpacity>
                </View>

            </ScrollView>

            
        </View>
    )
}

const styles = StyleSheet.create({
    screen:{
        backgroundColor:'#FCFCFC',
        flex:1
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
    searchbar: {
        // width: '65%',
        alignSelf: 'center',
        borderColor: '#E3E3E7',
        borderWidth: 0.8,
        flexDirection: 'row',
        alignItems: 'center',
        // borderColor:'red',
        // borderWidth:1,
        backgroundColor: '#E3E3E7',
        borderRadius: 20,
        height: 48,
        flex:1,
        marginHorizontal:10
        // justifyContent:'center'
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
    body:{
        width:'95%',
        alignSelf:'center',
        // borderColor:'green',
        // borderWidth:1,
        marginTop:25, 
        flex:1,
        // marginBottom:30
    },
    heading:{
        fontFamily: 'Lato',
        fontWeight: '700',
        fontSize: 16,
        color: 'black',
        marginTop:10
    },
    placeFindContainer:{
        backgroundColor:'#F2F2F3',
        borderColor:'#E3E3E7',
        borderWidth:0.8,
        borderRadius:94,
        flexDirection:'row',
        height:48,
        alignItems:'center',
        marginTop:15,
        marginBottom:10
    },
    demandContainer:{
        backgroundColor:'#F2F2F3',
        borderWidth:0.8,
        borderColor:'#E3E3E7',
        borderRadius:94,
        alignItems:'center',
        height:48,
        marginTop:15,
        marginBottom:10
    },
    demandInput:{
        color:'#1A1E25',
        fontSize:16,
        fontFamily:'Lato',
        fontWeight:'600',
        alignSelf:'flex-start',
        marginLeft:15,
        // lex:1,
        width:'90%',
        
    },
    facilitiesContainer:{
        flex: 1,
        flexDirection:'row',
        alignItems:'center',
        // borderColor:'green',
        // borderWidth:1,
        marginTop: 10,
        // width:'83%',
        justifyContent:'space-between',
        marginBottom:15,
        flexWrap:'wrap',
        marginLeft: 10,
    },
    facilities:{
        backgroundColor: '#F2F2F3' ,
        alignItems:'center',
        justifyContent:'center',
        borderColor:'#E3E3E7',
        borderWidth:0.8,
        borderRadius:92,
        height:40,
        width:77,
        // flex:1,
        elevation:3
    },
    facilitiesText:{
        fontFamily: 'SF Pro Text',
        fontWeight: '400',
        fontSize: 16,
        color: '#7D7F88'
    },
    footer:{
        // borderColor:'blue',
        // borderWidth:1,
        flexDirection:'row',
        justifyContent:'space-between',
        marginTop:40,
        // padding:10,
        backgroundColor:'white',
        marginBottom:15,
        width:'93%',
        alignSelf:'center'
    },
    footerButton:{
        backgroundColor:'#222831',
        borderRadius:72,
        alignItems:'center',
        padding:5,
        width:158,
        height:48,
        justifyContent:'center',
        elevation:6
    },
    footerButtonText:{
        color:'white',
        fontSize:16,
        fontWeight:'500',
        fontFamily:'SF Pro Text',
        alignSelf:'center'
    }
})

const transactionStyles = StyleSheet.create({
    container:{
        flexDirection:'row',
        alignItems:'center',
        justifyContent:'space-between'
    },
    heading:{
        fontFamily: 'Lato',
        fontWeight: '700',
        fontSize: 16,
        color: '#1A1E25'
    },
    resetContainer:{
        flexDirection:'row',
        alignItems:'center',
        width:'22%',
        justifyContent:'space-between'
    },
    resetText:{
        fontFamily: 'SF Pro Text',
        fontWeight: '500',
        fontSize: 16,
        color: '#7D7F88'
    },
    typeContainer:{
        flexDirection:'row',
        alignItems:'center',
        // borderColor:'green',
        // borderWidth:1,
        marginTop:20,
        width:'60%',
        justifyContent:'space-between',
        marginBottom:10
    },
    type:{
        backgroundColor: '#F2F2F3' ,
        alignItems:'center',
        justifyContent:'center',
        borderColor:'#E3E3E7',
        borderWidth:0.8,
        borderRadius:92,
        height:36,
        width:106,
        elevation:7
    },
    typeText:{
        fontFamily: 'SF Pro Text',
        fontWeight: '400',
        fontSize: 16,
        // color: '#7D7F88'
    }
})

const propertyStyles = StyleSheet.create({
    container:{
        flexDirection:'row',
        alignItems:'center',
        // borderColor:'green',
        // borderWidth:1,
        marginTop:20,
        // width:'60%',
        justifyContent:'space-between',
        marginBottom:10
    },
    typeContainer:{
        backgroundColor: '#F2F2F3' ,
        alignItems:'center',
        justifyContent:'center',
        borderColor:'#E3E3E7',
        borderWidth:0.8,
        borderRadius:92,
        height:36,
        width:90,
        elevation:7
    },
    type:{
        fontFamily: 'SF Pro Text',
        fontWeight: '400',
        fontSize: 16,
        color: '#7D7F88'
    }
})

const roomStyles = StyleSheet.create({
    container:{
        flexDirection:'row',
        marginTop:15,
        // borderColor:'red',
        // borderWidth:1,
        justifyContent:'space-between',
        alignItems:'center'
    },
    containerHeading:{
        color:'#7D7F88',
        fontSize:16,
        fontFamily:'Lato',
        fontWeight:'500'
    },
    countContainer:{
        flexDirection:'row',
        justifyContent:'space-between',
        width:'35%',
        // borderColor:'green',
        // borderWidth:1
    },
    count:{
        fontFamily:'SF Pro Text',
        fontWeight:'500',
        fontSize:16,
        fontStyle:'normal'
    }
})