import { Stack } from 'expo-router';

export default function VehiclesLayout() {
  return (
    <Stack>
      <Stack.Screen 
        name="index" 
        options={{ 
          title: 'My Vehicles',
          headerTitleStyle: { fontWeight: '600' }
        }} 
      />
      <Stack.Screen 
        name="add" 
        options={{ 
          title: 'Add Vehicle',
          presentation: 'modal',
          headerTitleStyle: { fontWeight: '600' }
        }} 
      />
      <Stack.Screen 
        name="[id]" 
        options={{ 
          title: 'Vehicle Details',
          headerTitleStyle: { fontWeight: '600' }
        }} 
      />
      <Stack.Screen 
        name="[id]/edit" 
        options={{ 
          title: 'Edit Vehicle',
          headerTitleStyle: { fontWeight: '600' }
        }} 
      />
    </Stack>
  );
}