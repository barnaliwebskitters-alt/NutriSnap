import React from 'react';
import { Text } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import Home from './src/main/tabs/Home';
import Progress from './src/main/tabs/Progress';
import Snap from './src/main/Snap';
import Chat from './src/main/tabs/Chat';
import Profile from './src/main/tabs/Profile';

const Tab = createBottomTabNavigator();

const screenIcon = (name: string) => {
  switch (name) {
    case 'Home':
      return '🏠';
    case 'Progress':
      return '📈';
    case 'Snap':
      return '📸';
    case 'Chat':
      return '💬';
    case 'Profile':
      return '👤';
    default:
      return '•';
  }
};

export default function App() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <NavigationContainer>
          <Tab.Navigator
            screenOptions={({ route }: { route: { name: string } }) => ({
              headerShown: false,
              tabBarShowLabel: true,
              tabBarActiveTintColor: '#FF6C00',
              tabBarInactiveTintColor: '#8F8F8F',
              tabBarStyle: {
                height: 74,
                paddingTop: 8,
                paddingBottom: 10,
                borderTopWidth: 0,
                backgroundColor: '#FFFFFF',
                shadowColor: '#000',
                shadowOpacity: 0.08,
                shadowRadius: 12,
                shadowOffset: { width: 0, height: -3 },
                elevation: 10,
              },
              tabBarIcon: ({ color }: { color: string }) => (
                <Text style={{ fontSize: 20, color }}>{screenIcon(route.name)}</Text>
              ),
            })}
          >
            <Tab.Screen name="Home" component={Home} />
            <Tab.Screen name="Progress" component={Progress} />
            <Tab.Screen
              name="Snap"
              component={Snap}
              options={{
                tabBarIcon: () => (
                  <Text style={{ fontSize: 24 }}>📸</Text>
                ),
              }}
            />
            <Tab.Screen name="Chat" component={Chat} />
            <Tab.Screen name="Profile" component={Profile} />
          </Tab.Navigator>
        </NavigationContainer>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
