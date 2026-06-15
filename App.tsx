import React from "react";
import {
  Text,
  View,
  TouchableOpacity,
  StyleSheet,
  Platform,
  ActivityIndicator,
} from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import {
  SafeAreaProvider,
  useSafeAreaInsets,
} from "react-native-safe-area-context";
import {
  useFonts,
  PlusJakartaSans_400Regular,
  PlusJakartaSans_500Medium,
  PlusJakartaSans_600SemiBold,
  PlusJakartaSans_700Bold,
  PlusJakartaSans_800ExtraBold,
} from "@expo-google-fonts/plus-jakarta-sans";

import Home from "./src/main/tabs/Home";
import Progress from "./src/main/tabs/Progress";
import Snap from "./src/main/Snap";
import Chat from "./src/main/tabs/Chat";
import Profile from "./src/main/tabs/Profile";

const Tab = createBottomTabNavigator();

const screenIcon = (name: string) => {
  switch (name) {
    case "Home":
      return "🏠";
    case "Progress":
      return "📈";
    case "Snap":
      return "📸";
    case "Chat":
      return "💬";
    case "Profile":
      return "👤";
    default:
      return "•";
  }
};

export default function App() {
  const [fontsLoaded] = useFonts({
    "PlusJakartaSans-Regular": PlusJakartaSans_400Regular,
    "PlusJakartaSans-Medium": PlusJakartaSans_500Medium,
    "PlusJakartaSans-SemiBold": PlusJakartaSans_600SemiBold,
    "PlusJakartaSans-Bold": PlusJakartaSans_700Bold,
    "PlusJakartaSans-ExtraBold": PlusJakartaSans_800ExtraBold,
  });

  if (!fontsLoaded) {
    return (
      <View style={appStyles.loadingContainer}>
        <ActivityIndicator size="large" color="#FF6C00" />
      </View>
    );
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <NavigationContainer>
          <Tab.Navigator
            screenOptions={({ route }: { route: { name: string } }) => ({
              headerShown: false,
              tabBarShowLabel: true,
              tabBarActiveTintColor: "#FF6C00",
              tabBarInactiveTintColor: "#8F8F8F",
              tabBarLabelStyle: {
                fontFamily: "PlusJakartaSans-Medium",
                fontSize: 11,
              },
              tabBarStyle: {
                height: 74,
                paddingTop: 8,
                paddingBottom: Platform.OS === "ios" ? 18 : 10,
                paddingHorizontal: 10,
                borderTopWidth: 0,
                backgroundColor: "#FFFFFF",
                shadowColor: "#000",
                shadowOpacity: 0.08,
                shadowRadius: 12,
                shadowOffset: { width: 0, height: -3 },
                elevation: 10,
              },
              tabBarItemStyle: {
                marginHorizontal: 4,
              },
              tabBarIcon: ({ color }: { color: string }) => (
                <Text style={{ fontSize: 20, color }}>
                  {screenIcon(route.name)}
                </Text>
              ),
            })}
          >
            <Tab.Screen name="Home" component={Home} />
            <Tab.Screen name="Progress" component={Progress} />
            <Tab.Screen
              name="Snap"
              component={Snap}
              options={{
                tabBarLabel: "Snap",
                tabBarButton: (props) => <CustomTabBarButton {...props} />,
                tabBarIcon: () => <Text style={{ fontSize: 24 }}>📸</Text>,
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

const CustomTabBarButton = ({ children, onPress, style }: any) => {
  const insets = useSafeAreaInsets();
  const topOffset = -24 - (insets.bottom ? insets.bottom / 2 : 0);
  return (
    <View style={[style, fabStyles.placeholderWrap]}>
      <View
        style={[fabStyles.fabContainer, { top: topOffset }]}
        pointerEvents="box-none"
      >
        <TouchableOpacity
          activeOpacity={0.9}
          onPress={onPress}
          style={fabStyles.fabButton}
        >
          <Text style={{ fontSize: 28 }}>📸</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const appStyles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
  },
});

const fabStyles = StyleSheet.create({
  placeholderWrap: {
    alignItems: "center",
    justifyContent: "center",
  },
  fabContainer: {
    position: "absolute",
    alignItems: "center",
    left: 0,
    right: 0,
  },
  fabButton: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: "#FF6C00",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#FF6C00",
    shadowOpacity: 0.28,
    shadowRadius: 18,
    shadowOffset: { width: 0, height: 6 },
    elevation: 12,
  },
});
