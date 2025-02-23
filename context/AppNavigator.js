import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { NavigationContainer } from '@react-navigation/native';
import HomeScreen from './HomeScreen';  // Ensure this is the correct import path
import AddTaskScreen from './AddTaskScreen';  // Correct import path for AddTaskScreen

const Stack = createStackNavigator();

const AppNavigator = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="HomeScreen">
        <Stack.Screen name="HomeScreen" component={HomeScreen} />
        <Stack.Screen name="AddTaskScreen" component={AddTaskScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;


