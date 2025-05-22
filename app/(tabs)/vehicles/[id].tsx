import { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, ScrollView } from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import { doc, getDoc, updateDoc, deleteDoc } from 'firebase/firestore';
import { db } from '@/firebaseConfig';
import { Pencil, Trash2, CircleAlert as AlertCircle } from 'lucide-react-native';
import type { Vehicle } from '@/types/schema';

export default function VehicleDetailsScreen() {
  const { id } = useLocalSearchParams();
  const [vehicle, setVehicle] = useState<Vehicle | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchVehicle = async () => {
      try {
        const docRef = doc(db, 'vehicles', id as string);
        const docSnap = await getDoc(docRef);
        
        if (docSnap.exists()) {
          setVehicle({ id: docSnap.id, ...docSnap.data() } as Vehicle);
        } else {
          setError('Vehicle not found');
        }
      } catch (err) {
        console.error('Error fetching vehicle:', err);
        setError('Failed to load vehicle details');
      } finally {
        setLoading(false);
      }
    };

    fetchVehicle();
  }, [id]);

  const handleDelete = () => {
    Alert.alert(
      'Delete Vehicle',
      'Are you sure you want to delete this vehicle? This action cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              await deleteDoc(doc(db, 'vehicles', id as string));
              router.back();
            } catch (err) {
              console.error('Error deleting vehicle:', err);
              Alert.alert('Error', 'Failed to delete vehicle');
            }
          },
        },
      ]
    );
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <Text>Loading vehicle details...</Text>
      </View>
    );
  }

  if (error || !vehicle) {
    return (
      <View style={styles.errorContainer}>
        <AlertCircle size={48} color="#ef4444" />
        <Text style={styles.errorText}>{error}</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>{vehicle.make} {vehicle.model}</Text>
        <Text style={styles.subtitle}>{vehicle.licensePlate}</Text>
      </View>

      <View style={styles.infoCard}>
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Fuel Type</Text>
          <Text style={styles.infoValue}>
            {vehicle.fuelType.charAt(0).toUpperCase() + vehicle.fuelType.slice(1)}
          </Text>
        </View>
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Current Mileage</Text>
          <Text style={styles.infoValue}>
            {vehicle.currentMileage.toLocaleString()} km
          </Text>
        </View>
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Added On</Text>
          <Text style={styles.infoValue}>
            {new Date(vehicle.createdAt).toLocaleDateString()}
          </Text>
        </View>
      </View>

      <View style={styles.actions}>
        <TouchableOpacity
          style={[styles.button, styles.editButton]}
          onPress={() => router.push(`/vehicles/${id}/edit`)}
        >
          <Pencil size={20} color="#fff" />
          <Text style={styles.buttonText}>Edit Vehicle</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.button, styles.deleteButton]}
          onPress={handleDelete}
        >
          <Trash2 size={20} color="#fff" />
          <Text style={styles.buttonText}>Delete Vehicle</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    padding: 20,
    backgroundColor: '#f3f4f6',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#111827',
  },
  subtitle: {
    fontSize: 18,
    color: '#6b7280',
    marginTop: 4,
  },
  infoCard: {
    margin: 16,
    padding: 16,
    backgroundColor: '#fff',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
  },
  infoLabel: {
    fontSize: 16,
    color: '#6b7280',
  },
  infoValue: {
    fontSize: 16,
    fontWeight: '500',
    color: '#111827',
  },
  actions: {
    padding: 16,
    gap: 12,
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    borderRadius: 8,
    gap: 8,
  },
  editButton: {
    backgroundColor: '#007AFF',
  },
  deleteButton: {
    backgroundColor: '#ef4444',
  },
  buttonText: {
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