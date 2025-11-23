import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

// Placeholder screens
function LoginScreen() {
  return (
    <View style={styles.container}>
      <Text>Login Screen</Text>
    </View>
  );
}

function SignupScreen() {
  return (
    <View style={styles.container}>
      <Text>Signup Screen</Text>
    </View>
  );
}

function DashboardScreen() {
  return (
    <View style={styles.container}>
      <Text>Dashboard Screen</Text>
    </View>
  );
}

function PaymentScreen() {
  return (
    <View style={styles.container}>
      <Text>Payment Screen</Text>
    </View>
  );
}

function ProfileScreen() {
  return (
    <View style={styles.container}>
      <Text>Profile Screen</Text>
    </View>
  );
}

// Main tab navigator for authenticated users
function MainTabNavigator() {
  return (
    <Tab.Navigator>
      <Tab.Screen name="Dashboard" component={DashboardScreen} />
      <Tab.Screen name="Payment" component={PaymentScreen} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  );
}

// Main stack navigator
function AppNavigator() {
  return (
    <Stack.Navigator initialRouteName="Login">
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="Signup" component={SignupScreen} />
      <Stack.Screen name="Main" component={MainTabNavigator} options={{ headerShown: false }} />
    </Stack.Navigator>
  );
}

export default function App() {
  return (
    <NavigationContainer>
      <AppNavigator />
      <StatusBar style="auto" />
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
