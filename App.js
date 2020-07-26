import 'react-native-gesture-handler';
import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import SecondPage from "./src/SecondPage";
import {createStackNavigator} from "@react-navigation/stack";
import FirstPage from "./src/FirstPage";
import {ScannerProvider} from "./src/ScannerContext";

const Stack = createStackNavigator();

const App: () => React$Node = () => {
    return (
        <NavigationContainer>
            <ScannerProvider>
                <Stack.Navigator>
                    <Stack.Screen name={"first"} component={FirstPage}/>
                    <Stack.Screen name={"second"} component={SecondPage}/>
                </Stack.Navigator>
            </ScannerProvider>
        </NavigationContainer>
    );
};


export default App;
