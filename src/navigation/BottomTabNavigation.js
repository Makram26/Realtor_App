import React from 'react';
import {
    View,
    Text,
    TextInput,
    StyleSheet,
    ImageBackground,
    Image,
    TouchableOpacity,
    Dimensions,
    ScrollView,
    StatusBar,
    SafeAreaView
} from 'react-native';
import { createMaterialBottomTabNavigator } from '@react-navigation/material-bottom-tabs';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { RFPercentage, RFValue } from "react-native-responsive-fontsize";

import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';


import {FirstStackTab, SecondStackTab, ThirdStackTab, ForthStackTab, FifthStackTab} from '../navigation/AppNavigator'

import Drawer from '../navigation/Drawer'
import AppNavigator from '../navigation/AppNavigator'


const Tab = createBottomTabNavigator();
export default function BottomTabNavigation() {


    return (
        // <Tab.Navigator
        //     initialRouteName="Dashboard"
        //     activeColor="#6885E7"
        //     barStyle={{ backgroundColor: '#FFFFFF' }}


        //     tabBarOptions={{

        //         activeTintColor: "blue",
        //         labelStyle: { fontSize: 40 },
        //         style: { backgroundColor: "#000" },


        //     }}>
        <Tab.Navigator
            // initialRouteName="Leads"
            screenOptions={{
                tabBarActiveTintColor: '#6885E7',
                // headerPressColor:"red",
                // tabBarInactiveTintColor:"#000",
                tabBarStyle: { height: RFValue(60), paddingBottom: RFValue(10), },
                tabBarLabelStyle: {
                    fontSize: RFValue(10),
                  },
            }}
        >
            <Tab.Screen
                name="Home"
                component={FirstStackTab}

                options={{
                    headerShown: false,
                    tabBarLebal: 'Home', 
                    tabBarIcon: ({ color }) => (    
                        <MaterialCommunityIcons name="home" color={color} size={26} />
                    ),
                }}
              
            />
            <Tab.Screen
                name="Leads"
                component={SecondStackTab}

                options={{
                    headerShown: false,
                    tabBarLebal: 'Leads', tabBarIcon: ({ color }) => (
                        // <MaterialCommunityIcons name="account" color={color} size={26} />
                        <Image
                                source={require('../assets/images/negotiation.png')}
                                style={{tintColor:color,...styles.product_container_logo}}
                                resizeMode="contain"
                            />
                    ),
                }}
                // onPress={()=> console.log("akram")}
                listeners={({ navigation }) => ({
                    tabPress: (e) => {
                    //   console.log("Tab B pressed",e);
                       navigation.navigate("Leads")
                      // If current route is not Screen B1, then pop all and push Screen B1
                    },
                  })}
            />
            <Tab.Screen
                name="Inventory"
                component={FifthStackTab}
                options={{
                    headerShown: false,
                    tabBarLebal: 'Inventory', tabBarIcon: ({ color }) => (
                        // <MaterialCommunityIcons name="chat-processing-outline" color={color} size={26} />
                      
                        <Image
                        source={require('../assets/images/inventory.png')}
                        style={{tintColor:color,...styles.product_container_logo}}
                        resizeMode="contain"
                    />  
                    ),
                }}
            />
            <Tab.Screen
                name="Tasks"
                component={ThirdStackTab}
              
                options={{
                    headerShown: false,
                  
                    tabBarLebal: 'Tasks', tabBarIcon: ({ color }) => (
                        // <MaterialCommunityIcons name="heart-outline" color={color} size={26} />
                       
                        <Image
                        source={ require('../assets/images/list.png')}
                        style={{tintColor:color,...styles.product_container_logo}}
                        resizeMode="contain"
                    />  
                    ),
                }}
             
                />
                 <Tab.Screen
                name="Market"
                // component={Deal}
                component={ForthStackTab}              
                options={{
                    headerShown: false,
                  
                    tabBarLebal: 'Market', tabBarIcon: ({ color }) => (
                        // <MaterialCommunityIcons name="heart-outline" color={color} size={26} />
                        <Image
                        source={ require('../assets/images/promo.png')}
                        style={{tintColor:color,...styles.product_container_logo}}
                        resizeMode="contain"
                    />
                    ),
                }}
             
                />
            
        </Tab.Navigator>
    );
}

const styles=StyleSheet.create({
    product_container_logo: {
        width: "35%",
        height: RFValue(40),
        alignSelf: 'center',
        
        // tintColor: "#3827B4"
    },
})
