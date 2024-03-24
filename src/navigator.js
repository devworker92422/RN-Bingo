import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { NavigationContainer } from '@react-navigation/native';
import LoginScreen from './screens/LoginScreen';
import PasswordUpdateScreen from './screens/PasswordUpdateScreen';
import MainScreen from './screens/MainScreen';
import SettingScreen from './screens/SettingScreen';
import PunchBoardScreen from './screens/PunchBoardScreen';
import SealedScreen from './screens/SealedScreen';
import HistoryScreen from './screens/HistoryScreen';

const Stack = createNativeStackNavigator();

const Navigator = () => {
    return (
        <NavigationContainer >
            <Stack.Navigator initialRouteName='main' screenOptions={{ headerShown: false }}>
                <Stack.Screen name='pwdUpdate' component={PasswordUpdateScreen} />
                <Stack.Screen name='main' component={MainScreen} />
                <Stack.Screen name='setting' component={SettingScreen} />
                <Stack.Screen name='punchBoard' component={PunchBoardScreen} />
                <Stack.Screen name='sealed' component={SealedScreen} />
                <Stack.Screen name='history' component={HistoryScreen} />
            </Stack.Navigator>
        </NavigationContainer>
    )
}

export default Navigator;