import { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { router } from 'expo-router';
import { collection, addDoc } from 'firebase/firestore';
import { db, auth } from '@/firebaseConfig';
import type { FuelType } from '@/types/schema';

const FUEL_TYPES: FuelType[] = ['petrol', 'diesel', 'electric', 'hybrid', 'lpg'];

export default function AddVehicleScreen() {
  const [make, setMake] = useState('');
  const [model, setModel] = useState('');
  const [licensePlate, setLicensePlate] = useState('');
  const [fuelType, setFuelType] = useState<FuelType>('petrol');
  const [currentMileage, setCurrentMileage] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    try {
      setError(null);
      setLoading(true);

      if (!make || !model || !licensePlate || !currentMileage) {
        setError('Please fill in all fields');
        return;
      }

      const mileage = parseInt(currentMileage);
      if (isNaN(mileage) || mileage < 0) {
        setError('Please enter a valid mileage');
        return;
      }

      const user = auth.currentUser;
      if (!user) {
        setError('You must be logged in to add a vehicle');
        return;
      }

      const vehicleData = {
        userId: user.uid,
        make,
        model,
        licensePlate: licensePlate.toUpperCase(),
        fuelType,
        currentMileage: mileage,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      await addDoc(collection(db, 'vehicles'), vehicleData);
      router.back();
    } catch (err) {
      console.error('Error adding vehicle:', err);
      setError('Failed to add vehicle');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.form}>
        {error && <Text style={styles.error}>{error}</Text>}

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Make</Text>
          <TextInput
            style={styles.input}
            value={make}
            onChangeText={setMake}
            placeholder="e.g., Toyota"
            autoCapitalize="words"
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Model</Text>
          <TextInput
            style={styles.input}
            value={model}
            onChangeText={setModel}
            placeholder="e.g., Camry"
            autoCapitalize="words"
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>License Plate</Text>
          <TextInput
            style={styles.input}
            value={licensePlate}
            onChangeText={setLicensePlate}
            placeholder="e.g., ABC123"
            autoCapitalize="characters"
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Fuel Type</Text>
          <View style={styles.fuelTypeContainer}>
            {FUEL_TYPES.map((type) => (
              <TouchableOpacity
                key={type}
                style={[
                  styles.fuelTypeButton,
                  fuelType === type && styles.fuelTypeButtonActive,
                ]}
                onPress={() => setFuelType(type)}
              >
                <Text
                  style={[
                    styles.fuelTypeText,
                    fuelType === type && styles.fuelTypeTextActive,
                  ]}
                >
                  {type.charAt(0).toUpperCase() + type.slice(1)}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Current Mileage (km)</Text>
          <TextInput
            style={styles.input}
            value={currentMileage}
            onChangeText={setCurrentMileage}
            placeholder="e.g., 50000"
            keyboardType="numeric"
          />
        </View>

        <TouchableOpacity
          style={[styles.button, loading && styles.buttonDisabled]}
          onPress={handleSubmit}
          disabled={loading}
        >
          <Text style={styles.buttonText}>
            {loading ? 'Adding Vehicle...' : 'Add Vehicle'}
          </Text>
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
  form: {
    padding: 20,
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 8,
    color: '#374151',
  },
  input: {
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
  },
  fuelTypeContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  fuelTypeButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#d1d5db',
    backgroundColor: '#fff',
  },
  fuelTypeButtonActive: {
    backgroundColor: '#007AFF',
    borderColor: '#007AFF',
  },
  fuelTypeText: {
    color: '#374151',
    fontSize: 14,
  },
  fuelTypeTextActive: {
    color: '#fff',
  },
  button: {
    backgroundColor: '#007AFF',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 20,
  },
  buttonDisabled: {
    opacity: 0.5,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  error: {
    color: '#ef4444',
    marginBottom: 20,
    fontSize: 14,
  },
});