import React, { useState, useEffect, useContext } from 'react';
import { View, Text, StyleSheet, Alert, Modal } from 'react-native';
import { createStackNavigator } from '@react-navigation/stack';
import { NavigationContainer } from '@react-navigation/native';

import Dashboard from '../screens/Dashboard';
import Drawer from '../navigation/Drawer'
import Marketplace from '../screens/Marketplace';
import UserProfile from '../screens/UserProfile';
import UsersSetting from '../screens/UsersSetting';
import FAQ from '../screens/FAQ';
import AccountIntegrate from '../screens/AccountIntegrate';
import Feedback from '../screens/Feedback';

import CreateLeads from '../screens/AllLeads/CreateLeads';
import Leads from '../screens/AllLeads/Leads';
import UpdateLeads from '../screens/AllLeads/UpdateLeads'
import ViewInventory from '../screens/AllLeads/ViewInventory';
import FilterInventory from '../screens/AllLeads/FilterInventory';
import AddLeadInventory from '../screens/AllLeads/AddLeadInventory'
import LeadDetail from '../screens/AllLeads/LeadDetail';
import LeadTasks from '../screens/AllLeads/LeadTasks';
import CreateLeadTasks from '../screens/AllLeads/CreateLeadTasks';

import CreateTask from '../screens/HandleTask/CreateTask';
import Tasks from '../screens/HandleTask/Tasks';
import TaskToInventory from '../screens/HandleTask/TaskToInventory';
import TaskToLead from '../screens/HandleTask/TaskToLead';
import TaskDetail from '../screens/HandleTask/TaskDetail';
import EditTask from '../screens/HandleTask/EditTask';

import AddNewInventory from '../screens/InventoryScreens/AddNewInventory';
import FilterInventoryScreen from '../screens/InventoryScreens/FilterInventoryScreen';
import MyInventoryScreen from '../screens/InventoryScreens/MyInventoryScreen'
import InventoryDetailScreen from '../screens/InventoryScreens/InventoryDetailScreen';
import InventoryTasks from '../screens/InventoryScreens/InventoryTasks';
import CreateInventoryTasks from '../screens/InventoryScreens/CreateInventoryTasks';
import EditInventory from '../screens/InventoryScreens/EditInventory';
import AddToMarketplace from '../screens/InventoryScreens/AddToMarketplace';

import Deal from '../screens/DealScreens/Deal';
import DealLeads from '../screens/DealScreens/DealLeads';
import DealInventories from '../screens/DealScreens/DealInventories';
import DealInfo from '../screens/DealScreens/DealInfo';
import Dealdetail from '../screens/DealScreens/Dealdetail';
import DealInventoryDetail from '../screens/DealScreens/DealInvetoryDetail';
import DealLeadDetail from '../screens/DealScreens/DealLeadDetail';
import SelectLead from '../screens/DealScreens/SelectLead'
import CustomerInvoice from '../screens/DealScreens/CustomerInvoice';

import MarketplaceDetails from '../screens/MarketplaceScreens/MarketplaceDetails';
import MyMarketplaceScreen from '../screens/MarketplaceScreens/MyMarketplaceScreen'

import Invoices from '../screens/Invoice/Invoices';
import NewInvoice from '../screens/Invoice/NewInvoice';
import InvoiceDetail from '../screens/Invoice/InvoiceDetail';
import SupplierInvoices from '../screens/Invoice/SupplierInvoices';
import NewUserInvoice from '../screens/Invoice/NewUserInvoice';
import Customers from '../screens/Invoice/Customers';
import Suppliers from '../screens/Invoice/Suppliers';
import Payment from '../screens/Invoice/Payment';
import PaymentsRecord from '../screens/Invoice/PaymentsRecord';

import index from '../screens/Payment_Method/index'

import AddBulkInventory from '../screens/BulkInventory/AddBulkInventory';

// import Dashboard from '../screens/Dashboard';
import BottomTabNavigation from './BottomTabNavigation'

import Notification from '../screens/Notification';

import messaging from "@react-native-firebase/messaging"
import AlertModal from '../components/AlertModal';
// import notifee from '@notifee/react-native';
// import notifee, { AndroidImportance } from '@notifee/react-native';

const Stack = createStackNavigator();

const FirstStackTab = ({ navigation }) => {


  // Code For Showing Modal Like Notification
  const [alertModal, setAlertModal] = useState(false)
  const closeInventoryModalHandler = () => {
    setAlertModal(!alertModal)
  }

  // On Foreground Stage or Active state Notification and Redireact On Specific Screen
  messaging().onMessage(async remoteMessage => {
    if (remoteMessage.notification.title === "Lead Assign") {
      Alert.alert(remoteMessage.notification.title, remoteMessage.notification.body + ". Are You Want to See Now?",
        [
          { text: "Later", onPress: () => console.log("Later Pressed") },
          {
            text: "No",
            onPress: () => console.log("Cancel Pressed"),
            style: "cancel"
          },
          { text: "Yes", onPress: () => navigation.navigate('Leads') },
        ])
      // navigation.navigate('Leads');
    }
    else if (remoteMessage.notification.title === "Task Assign") {
      Alert.alert(remoteMessage.notification.title, remoteMessage.notification.body + ". Are You Want to See Now?",
        [
          { text: "Later", onPress: () => console.log("Later Pressed") },
          {
            text: "No",
            onPress: () => console.log("Cancel Pressed"),
            style: "cancel"
          },
          { text: "Yes", onPress: () => navigation.navigate('Tasks') },
        ])
    }
    else {
      navigation.navigate("Home")
    }
  })

  // On Background Running Stage Notification and Redireact On Specific Screen
  messaging().setBackgroundMessageHandler(async remoteMessage => {
    if (remoteMessage.notification.title === "Lead Assign") {
      navigation.navigate('Leads');
    }
    else if (remoteMessage.notification.title === "Task Assign") {
      navigation.navigate('Tasks')
    }
    else {
      navigation.navigate("Home")
    }
    //navigate to notification screen
  });
  const unsubscribe = messaging().onMessage(async remoteMessage => {
  })

  // On Quit Stage Notification and Redireact On Specific Screen
  // messaging().getInitialNotification()
  //   .then(remoteMessage => {
  //     if (remoteMessage.notification.title === "Lead Assign") {
  //       navigation.navigate('Leads');
  //     }
  //     else if (remoteMessage.notification.title === "Task Assign") {
  //       navigation.navigate('Tasks')
  //     }
  //     else {
  //       navigation.navigate("Home")
  //     }
  //   });


  return (
    <Stack.Navigator
    //  initialRouteName="Leads"
    >
      <Stack.Screen
        name="Home"
        component={Dashboard}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="UserProfile"
        component={UserProfile}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="UsersSetting"
        component={UsersSetting}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Marketplace"
        component={Marketplace}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="payment"
        component={index}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Drawer"
        component={Drawer}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="CreateTask"
        component={CreateTask}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="TaskDetail"
        component={TaskDetail}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="EditTask"
        component={EditTask}
        options={{ headerShown: false }}
      />

      <Stack.Screen name="Invoices" component={Invoices} options={{ headerShown: false }} />
      <Stack.Screen name="NewInvoice" component={NewInvoice} options={{ headerShown: false }} />
      <Stack.Screen name="InvoiceDetail" component={InvoiceDetail} options={{ headerShown: false }} />
      <Stack.Screen name="SupplierInvoices" component={SupplierInvoices} options={{ headerShown: false }} />
      <Stack.Screen name="NewUserInvoice" component={NewUserInvoice} options={{ headerShown: false }} />
      <Stack.Screen name="Customers" component={Customers} options={{ headerShown: false }} />
      <Stack.Screen name="Suppliers" component={Suppliers} options={{ headerShown: false }} />
      <Stack.Screen name="Payment" component={Payment} options={{ headerShown: false }} />
      <Stack.Screen name="PaymentsRecord" component={PaymentsRecord} options={{ headerShown: false }} />


      <Stack.Screen name="Deal" component={Deal} options={{ headerShown: false }} />
      <Stack.Screen name="DealLeads" component={DealLeads} options={{ headerShown: false }} />
      <Stack.Screen name="DealInventories" component={DealInventories} options={{ headerShown: false }} />
      <Stack.Screen name="DealInfo" component={DealInfo} options={{ headerShown: false }} />
      <Stack.Screen name="Dealdetail" component={Dealdetail} options={{ headerShown: false }} />
      <Stack.Screen name="DealInventoryDetail" component={DealInventoryDetail} options={{ headerShown: false }} />
      <Stack.Screen name="DealLeadDetail" component={DealLeadDetail} options={{ headerShown: false }} />
      <Stack.Screen name="SelectLead" component={SelectLead} options={{ headerShown: false }} />
      <Stack.Screen name="CustomerInvoice" component={CustomerInvoice} options={{ headerShown: false }} />

      <Stack.Screen
        name="FAQ"
        component={FAQ}
        options={{ headerShown: false }}
      />

      <Stack.Screen
        name="AccountIntegrate"
        component={AccountIntegrate}
        options={{ headerShown: false }}
      />

      <Stack.Screen
        name="Feedback"
        component={Feedback}
        options={{ headerShown: false }}
      />

      <Stack.Screen name="AddBulkInventory" component={AddBulkInventory} options={{ headerShown: false }} />

    </Stack.Navigator>

  )
}
export { FirstStackTab }


const SecondStackTab = () => {
  return (
    <Stack.Navigator initialRouteName='Leads'>
      <Stack.Screen
        name="Leads"
        component={Leads}
        options={{ headerShown: false }}
        
      />
      <Stack.Screen
        name="CreateLeads"
        component={CreateLeads}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="UpdateLeads"
        component={UpdateLeads}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="ViewInventory"
        component={ViewInventory}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="FilterInventory"
        component={FilterInventory}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="AddLeadInventory"
        component={AddLeadInventory}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="LeadDetail"
        component={LeadDetail}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="LeadTasks"
        component={LeadTasks}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="CreateLeadTasks"
        component={CreateLeadTasks}
        options={{ headerShown: false }}
      />
      <Stack.Screen name="InventoryDetailScreen" component={InventoryDetailScreen} options={{ headerShown: false }} />
      <Stack.Screen name="InventoryTasks" component={InventoryTasks} options={{ headerShown: false }} />
      <Stack.Screen name="CreateInventoryTasks" component={CreateInventoryTasks} options={{ headerShown: false }} />
      <Stack.Screen name="EditInventory" component={EditInventory} options={{ headerShown: false }} />

      <Stack.Screen name="Notification" component={Notification} options={{ headerShown: false }} />
    </Stack.Navigator>

  )
}
export { SecondStackTab }

const ThirdStackTab = () => {
  return (
    <Stack.Navigator initialRouteName='Tasks'>
      <Stack.Screen
        name="Tasks"
        component={Tasks}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="CreateTask"
        component={CreateTask}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="TaskToInventory"
        component={TaskToInventory}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="TaskToLead"
        component={TaskToLead}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="TaskDetail"
        component={TaskDetail}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="EditTask"
        component={EditTask}
        options={{ headerShown: false }}
      />
    </Stack.Navigator>

  )
}
export { ThirdStackTab }

const ForthStackTab = () => {
  return (
    <Stack.Navigator initialRouteName='MyMarketplaceScreen'>
      <Stack.Screen name="MyMarketplaceScreen" component={MyMarketplaceScreen} options={{ headerShown: false }} />
      <Stack.Screen name="MarketplaceDetails" component={MarketplaceDetails} options={{ headerShown: false }} />
      {/* <Stack.Screen name="DealInventories" component={DealInventories} options={{ headerShown: false }}/>
      <Stack.Screen name="DealInfo" component={DealInfo} options={{ headerShown: false }}/>
      <Stack.Screen name="Dealdetail" component={Dealdetail} options={{ headerShown: false }}/>
      <Stack.Screen name="DealInventoryDetail" component={DealInventoryDetail} options={{ headerShown: false }}/>
      <Stack.Screen name="DealLeadDetail" component={DealLeadDetail} options={{ headerShown: false }}/>
      
      <Stack.Screen name="SelectLead" component={SelectLead} options={{ headerShown: false }}/> */}
    </Stack.Navigator>

  )
}
export { ForthStackTab }

const FifthStackTab = () => {
  return (
    <Stack.Navigator >
      <Stack.Screen name="MyInventoryScreen" component={MyInventoryScreen} options={{ headerShown: false }} />
      <Stack.Screen name='AddNewInventory' component={AddNewInventory} options={{ headerShown: false }} />
      <Stack.Screen name="FilterInventoryScreen" component={FilterInventoryScreen} options={{ headerShown: false }} />
      <Stack.Screen name="InventoryDetailScreen" component={InventoryDetailScreen} options={{ headerShown: false }} />
      <Stack.Screen name="AddToMarketplace" component={AddToMarketplace} options={{ headerShown: false }} />
      <Stack.Screen name="InventoryTasks" component={InventoryTasks} options={{ headerShown: false }} />
      <Stack.Screen name="CreateInventoryTasks" component={CreateInventoryTasks} options={{ headerShown: false }} />
      <Stack.Screen name="EditInventory" component={EditInventory} options={{ headerShown: false }} />
    </Stack.Navigator>

  )
}
export { FifthStackTab }


export default function AppNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="CreateTask" component={CreateTask} options={{ headerShown: false }} />
        <Stack.Screen name="BottomTabNavigation" component={BottomTabNavigation} options={{ headerShown: false }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}