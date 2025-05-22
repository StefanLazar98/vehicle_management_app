import { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList, Image } from 'react-native';
import { router } from 'expo-router';
import { collection, query, where, onSnapshot } from 'firebase/firestore';
import { db, auth } from '@/firebaseConfig';
import { Plus, CircleAlert as AlertCircle } from 'lucide-react-native';
import type { Vehicle } from '@/types/schema';

export default function VehiclesScreen() {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const user = auth.currentUser;
    if (!user) return;

    const vehiclesRef = collection(db, 'vehicles');
    const q = query(vehiclesRef, where('userId', '==', user.uid));

    const unsubscribe = onSnapshot(q, 
      (snapshot) => {
        const vehicleList = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as Vehicle[];
        setVehicles(vehicleList);
        setLoading(false);
      },
      (err) => {
        console.error('Error fetching vehicles:', err);
        setError('Failed to load vehicles');
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, []);

  if (loading) {
    return (
      <View style={styles.container}>
        <Text>Loading vehicles...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <AlertCircle size={48} color="#ef4444" />
        <Text style={styles.errorText}>{error}</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={vehicles}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.vehicleCard}
            onPress={() => router.push(`/vehicles/${item.id}`)}
          >
            <Image
              source={{ uri: 'https://images.pexels.com/photos/170811/pexels-photo-170811.jpeg' }}
              style={styles.vehicleImage}
            />
            <View style={styles.vehicleInfo}>
              <Text style={styles.vehicleName}>{item.make} {item.model}</Text>
              <Text style={styles.licensePlate}>{item.licensePlate}</Text>
              <View style={styles.details}>
                <Text style={styles.detailText}>
                  {item.fuelType.charAt(0).toUpperCase() + item.fuelType.slice(1)}
                </Text>
                <Text style={styles.detailText}>
                  {item.currentMileage.toLocaleString()} km
                </Text>
              </View>
            </View>
          </TouchableOpacity>
        )}
        ListEmptyComponent={() => (
          <View style={styles.emptyState}>
            <Text style={styles.emptyStateText}>No vehicles added yet</Text>
            <TouchableOpacity
              style={styles.addButton}
              onPress={() => router.push('/vehicles/add')}
            >
              <Text style={styles.addButtonText}>Add Your First Vehicle</Text>
            </TouchableOpacity>
          </View>
        )}
      />
      
      {vehicles.length > 0 && (
        <TouchableOpacity
          style={styles.fab}
          onPress={() => router.push('/vehicles/add')}
        >
          <Plus color="#fff" size={24} />
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f3f4f6',
  },
  vehicleCard: {
    backgroundColor: '#fff',
    marginHorizontal: 16,
    marginVertical: 8,
    borderRadius: 12,
    overflow: 'hidden',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  vehicleImage: {
    width: '100%',
    height: 160,
  },
  vehicleInfo: {
    padding: 16,
  },
  vehicleName: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 4,
  },
  licensePlate: {
    fontSize: 16,
    color: '#6b7280',
    marginBottom: 8,
  },
  details: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  detailText: {
    fontSize: 14,
    color: '#6b7280',
  },
  fab: {
    position: 'absolute',
    right: 16,
    bottom: 16,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#007AFF',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
  },
  emptyState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
    marginTop: 100,
  },
  emptyStateText: {
    fontSize: 18,
    color: '#6b7280',
    marginBottom: 20,
  },
  addButton: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
  },
  addButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  errorContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  errorText: {
    fontSize: 16,
    color: '#ef4444',
    marginTop: 12,
    textAlign: 'center',
  },
});