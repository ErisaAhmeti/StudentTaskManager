import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { MaterialCommunityIcons } from 'react-native-vector-icons';
import { TaskProvider } from './context/TaskContext';
import HomeScreen from './screens/HomeScreen';
import AddTaskScreen from './screens/AddTaskScreen';
import AnalyticsScreen from './screens/AnalyticsScreen';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

// Stack për Home
function HomeStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: '#581845' }, // Ngjyrë moderne
        headerTitleStyle: { color: 'white', fontSize: 18, fontWeight: 'bold' },
        headerTintColor: 'white',
        headerShadowVisible: false, // Fshin hijen poshtë header-it
      }}
    >
      <Stack.Screen name="Home" component={HomeScreen} options={{ title: 'Student Task Manager' }} />
      <Stack.Screen name="AddTask" component={AddTaskScreen} options={{ title: 'Add New Task' }} />
    </Stack.Navigator>
  );
}

// App funksioni kryesor
export default function App() {
  return (
    <TaskProvider>
      <NavigationContainer>
        <Tab.Navigator
          screenOptions={({ route }) => ({
            tabBarIcon: ({ color, size }) => {
              let iconName;
              if (route.name === 'Home') {
                iconName = 'format-list-checks';
              } else if (route.name === 'Analytics') {
                iconName = 'chart-arc';
              }
              return <MaterialCommunityIcons name={iconName} size={size} color={color} />;
            },
            tabBarStyle: {
              backgroundColor: '#F4F4F4', // Sfond i butë
              borderTopWidth: 0, // Heq vijën ndarëse
              height: 60,
              paddingBottom: 8,
            },
            tabBarActiveTintColor: '#4A90E2',
            tabBarInactiveTintColor: '#A0A0A0',
          })}
        >
          <Tab.Screen name="Home" component={HomeStack} options={{ headerShown: false }} />
          <Tab.Screen name="Analytics" component={AnalyticsScreen} />
        </Tab.Navigator>
      </NavigationContainer>
    </TaskProvider>
  );
}
