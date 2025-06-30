import { View, Text } from 'react-native'
import React from 'react'
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { NavigationContainer } from '@react-navigation/native';
import OnboardingScreen from '../screen/onboarding/OnboardingScreen';
import Home from '../screen/dashboard/Home';
import OnboardingForm from '../screen/onboarding/OnboardingForm';
import PendingVerificationScreen from '../screen/onboarding/PendingVerificationScreen';
import Login from '../screen/auth/Login';
import ProfileScreen from '../screen/account/ProfileScreen';
import BookingsScreen from '../screen/dashboard/BookingsScreen';
import NotificationsScreen from '../screen/dashboard/NotificationsScreen';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createDrawerNavigator } from '@react-navigation/drawer';
import Ionicons from 'react-native-vector-icons/Ionicons';
import CustomDrawer from '../component/CustomDrawer';
import SplashScreen from '../screen/SplashScreen';
import AccessDeniedScreen from '../screen/auth/AccessDeniedScreen';
import IDCardScreen from '../screen/account/IDCardScreen';
import BankScreen from '../screen/account/BankScreen';
import DocumentsScreen from '../screen/account/DocumentsScreen';
import EarningScreen from '../screen/dashboard/EarningScreen';
import RateCardScreen from '../screen/dashboard/RateCardScreen';
import TrainingScreen from '../screen/dashboard/TrainingScreen';
import SettingsScreen from '../screen/dashboard/SettingsScreen';
import SupportScreen from '../screen/dashboard/SupportScreen';
import AcceptedTaskDetailsScreen from '../screen/dashboard/AcceptedTaskDetailsScreen';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();
const Drawer = createDrawerNavigator();
function BottomTabs() {
    return (
        <Tab.Navigator
            screenOptions={({ route }) => ({
                tabBarIcon: ({ color, size }) => {
                    let icon;
                    if (route.name === 'Dashboard') icon = 'home';
                    else if (route.name === 'Bookings') icon = 'clipboard';
                    else if (route.name === 'Notifications') icon = 'notifications';
                    else if (route.name === 'Profile') icon = 'person';
                    return <Ionicons name={icon} size={size} color={color} />;
                },
                headerShown: false,
                tabBarActiveTintColor: '#FFC107',
                tabBarInactiveTintColor: 'gray',
                  tabBarStyle: {
                    backgroundColor: "#000",
                    height: Platform.OS === 'ios' ? 60 : 70,
                    paddingBottom: Platform.OS === 'ios' ? 10 : 5,
                    paddingTop: 10,
                    // borderTopEndRadius: 35,
                    // borderTopStartRadius: 35,
                }
            })}
        >
            <Tab.Screen name="Dashboard" component={Home} />
            <Tab.Screen name="Earnings" component={BookingsScreen} />
            {/* <Tab.Screen name="Notifications" component={NotificationsScreen} /> */}
            <Tab.Screen name="Profile" component={ProfileScreen} />
           
            <Tab.Screen name="Dashboard" component={Home} />
            <Tab.Screen name="Bookings" component={BookingsScreen} />
            <Tab.Screen name="Notifications" component={NotificationsScreen} />
        </Tab.Navigator>
    );
}

function DrawerMenu() {
    return (
        <Drawer.Navigator
            drawerContent={(props) => <CustomDrawer {...props} />}
            screenOptions={{ headerShown: false }}
        >
            <Drawer.Screen name="Home" component={Home} />
            <Drawer.Screen name="Earnings" component={EarningScreen} />
            <Drawer.Screen name="Rate Card" component={RateCardScreen} />
            <Drawer.Screen name="Profile" component={ProfileScreen} />
            <Drawer.Screen name="Notification" component={NotificationsScreen} />
            <Drawer.Screen name="Training" component={TrainingScreen} />
            <Drawer.Screen name="Settings" component={SettingsScreen} />
            <Drawer.Screen name="Support" component={SupportScreen} />
            <Drawer.Screen name="Home" component={BottomTabs} />
            <Drawer.Screen name="Earnings" component={BottomTabs} />
            <Drawer.Screen name="Rate Card" component={BottomTabs} />
            <Drawer.Screen name="Profile" component={ProfileScreen} />
        </Drawer.Navigator>
    );
}
const NavigationStack = () => {
    return (
        <NavigationContainer>
            <Stack.Navigator screenOptions={{ headerShown: false }}>
                <Stack.Screen name="Splash" component={SplashScreen} />
                <Stack.Screen name="Onboarding" component={OnboardingScreen} />
                <Stack.Screen name="Home" component={Home} />
                <Stack.Screen name="OnboardingForm" component={OnboardingForm} />
                <Stack.Screen name="PendingVerificationScreen" component={PendingVerificationScreen} />
                <Stack.Screen name="Login" component={Login} />
                <Stack.Screen name="AccessDeniedScreen" component={AccessDeniedScreen} />
                {/* <Stack.Screen name="Dashboard" component={Home} /> */}
                {/* <Stack.Screen name="Profile" component={ProfileScreen} /> */}
                <Stack.Screen name="BankScreen" component={BankScreen} />
                <Stack.Screen name="DocumentsScreen" component={DocumentsScreen} />
                <Stack.Screen name="IDCardScreen" component={IDCardScreen} />
                <Stack.Screen name="DashboardStack" component={DrawerMenu} />
                <Stack.Screen name="AcceptedTaskDetailsScreen" component={AcceptedTaskDetailsScreen} />
                <Stack.Screen name="Profile" component={ProfileScreen} />
                <Stack.Screen name="DashboardStack" component={DrawerMenu} />
            </Stack.Navigator>
        </NavigationContainer>
    )
}

export default NavigationStack