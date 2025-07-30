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
import Step1MobileVerification from '../screen/onboarding/steps/Step1MobileVerification';
import Step2PersonalInfo from '../screen/onboarding/steps/Step2PersonalInfo';
import Step3BankDetails from '../screen/onboarding/steps/Step3BankDetails';
import Step4DocumentUpload from '../screen/onboarding/steps/Step4DocumentUpload';
import Step5AddressInfo from '../screen/onboarding/steps/Step5AddressInfo';
import Step6ReviewSubmit from '../screen/onboarding/steps/Step6ReviewSubmit';
import UpdatePersonalInfo from '../screen/account/UpdatePersonalInfo';
import UpdateBankDetails from '../screen/account/UpdateBankDetails';
import UpdateAddress from '../screen/account/UpdateAddress';
import UpdateDocumnet from '../screen/account/UpdateDocumnet';
import ComingSoonScreen from '../screen/dashboard/ComingSoonScreen';
import PrivacyPolicy from '../screen/account/PrivacyPolicy';
import TermsAndConditions from '../screen/account/TermsAndCondition';
import RaiseTicketScreen from '../screen/setting/RaiseTicketScreen';
import TicketChat from '../screen/setting/TicketChat';
import MyTicketsScreen from '../screen/setting/MyTicketsScreen';
import FAQScreen from '../screen/setting/FAQScreen';
import Payout from '../screen/dashboard/Payout';
import ReferralScreen from '../screen/dashboard/ReferralScreen';
import InvitePartnerScreen from '../screen/dashboard/InvitePartnerScreen';

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
            <Tab.Screen name="Notifications" component={NotificationsScreen} />
            <Tab.Screen name="Profile" component={ProfileScreen} />
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
            <Drawer.Screen name="Payments" component={Payout} />
            <Drawer.Screen name="Refer" component={ReferralScreen} />

        </Drawer.Navigator>
    );
}

const linking = {
    prefixes: ['https://seeb.in'],
    config: {
        screens: {
            Step1_Mobile: {
                path: 'referral/partner',
                parse: {
                    ref: (ref) => ref,
                },
            },
        },
    },
};


const NavigationStack = ({ onReady }) => {
    const navigationRef = React.useRef();
    return (
        <NavigationContainer
            ref={navigationRef}
            onReady={() => {
                if (onReady) {
                    onReady(navigationRef.current);
                }
            }}
            linking={linking}
            fallback={<Text>Loading...</Text>}
        >
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
                <Stack.Screen name="Support" component={SupportScreen} />
                {/* <Stack.Screen name="Settings" component={SettingsScreen} />
                <Stack.Screen name="Earnings" component={EarningScreen} /> */}


                <Stack.Screen name="Step1_Mobile" component={Step1MobileVerification} />
                <Stack.Screen name="Step2PersonalInfo" component={Step2PersonalInfo} />
                <Stack.Screen name="Step3BankDetails" component={Step3BankDetails} />
                <Stack.Screen name="Step4DocumentUpload" component={Step4DocumentUpload} />
                <Stack.Screen name="Step5AddressInfo" component={Step5AddressInfo} />
                <Stack.Screen name="Step6ReviewSubmit" component={Step6ReviewSubmit} />
                <Stack.Screen name='UpdatePersonalInfo' component={UpdatePersonalInfo} />
                <Stack.Screen name='UpdateBankDetails' component={UpdateBankDetails} />
                <Stack.Screen name='UpdateAddress' component={UpdateAddress} />
                <Stack.Screen name='UpdateDocuments' component={UpdateDocumnet} />
                <Stack.Screen name='TrainingVideo' component={TrainingScreen} />
                <Stack.Screen name='ComingSoon' component={ComingSoonScreen} />
                <Stack.Screen name='PrivacyPolicy' component={PrivacyPolicy} />
                <Stack.Screen name='TermsAndConditions' component={TermsAndConditions} />

                <Stack.Screen name="RaiseTicket" component={RaiseTicketScreen} />
                <Stack.Screen name="TicketChat" component={TicketChat} />
                <Stack.Screen name="MyTickets" component={MyTicketsScreen} />
                <Stack.Screen name="FAQ" component={FAQScreen} />


                <Stack.Screen name="InvitePartnerScreen" component={InvitePartnerScreen} />


            </Stack.Navigator>
        </NavigationContainer>
    )
}

export default NavigationStack