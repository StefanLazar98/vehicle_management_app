import { Tabs } from 'expo-router';
import { Chrome as Home, Car, ChartBar, Bell, Settings } from 'lucide-react-native';

export default function TabsLayout() {
  return (
    <Tabs screenOptions={{
      headerShown: true,
      tabBarStyle: {
        backgroundColor: '#fff',
        borderTopColor: '#e5e5e5',
      },
      tabBarActiveTintColor: '#007AFF',
      tabBarInactiveTintColor: '#6b7280',
    }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Dashboard',
          tabBarIcon: ({ color, size }) => <Home size={size} color={color} />,
        }}
      />
      <Tabs.Screen
        name="vehicles"
        options={{
          title: 'Vehicles',
          tabBarIcon: ({ color, size }) => <Car size={size} color={color} />,
        }}
      />
      <Tabs.Screen
        name="expenses"
        options={{
          title: 'Expenses',
          tabBarIcon: ({ color, size }) => <ChartBar size={size} color={color} />,
        }}
      />
      <Tabs.Screen
        name="maintenance"
        options={{
          title: 'Tasks',
          tabBarIcon: ({ color, size }) => <Bell size={size} color={color} />,
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: 'Settings',
          tabBarIcon: ({ color, size }) => <Settings size={size} color={color} />,
        }}
      />
    </Tabs>
  );
}