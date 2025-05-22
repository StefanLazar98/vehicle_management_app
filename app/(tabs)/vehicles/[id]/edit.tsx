import { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { db } from '@/firebaseConfig';
import type { FuelType, Vehicle } from '@/types/schema';
import { CircleAlert as AlertCircle } from 'lucide-react-native';

const FUEL_TYPES: FuelType[] = ['petrol', 'diesel', 'electric', 'hybrid', 'lpg'];

export default function EditVehicleScreen() {
  const { id } = useLocalSearchParams();
  const [vehicle, setVehicle] = useState<Vehicle | null>(null);
  const [make, setMake] = useState('');
  const [model, setModel] = useState('');
  const [licensePlate, setLicensePlate] = useState('');
  const [fuelType, setFuelType] = useState<FuelType>('petrol');
  const [currentMileage, setCurrentMileage] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const fetchVehicle = async () => {
      try {
        const docRef = doc(db, 'vehicles', id as string);
        const docSnap = await getDoc(docRef);
        
        if (docSnap.exists()) {
          const vehicleData = { id: docSnap.id, ...docSnap.data() } as Vehicle;
          setVehicle(vehicleData);
          setMake(vehicleData.make);
          setModel(vehicleData.model);
          setLicensePlate(vehicleData.licensePlate);
          setFuelType(vehicleData.fuelType);
          setCurrentMileage(vehicleData.currentMileage.toString());
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

  const handleSubmit = async () => {
    try {
      setError(null);
      setSaving(true);

      if (!make || !model || !licensePlate || !currentMileage) {
        setError('Please fill in all fields');
        return;
      }

      const mileage = parseInt(currentMileage);
      if (isNaN(mileage) || mileage < 0) {
        setError('Please enter a valid mileage');
        return;
      }

      if (!vehicle) {
        setError('Vehicle data not loaded');
        return;
      }

      const vehicleData = {
        make,
        model,
        licensePlate: licensePlate.toUpperCase(),
        fuelType,
        currentMileage: mileage,
        updatedAt: new Date(),
      };

      await updateDoc(doc(db, 'vehicles', id as string), vehicleData);
      router.back();
    } catch (err) {
      console.error('Error updating vehicle:', err);
      setError('Failed to update vehicle');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <Text>Loading vehicle details...</Text>
      </View>
    );
  }

  if (error && !vehicle) {
    return (
      <View style={styles.errorContainer}>
        <AlertCircle size={48} color="#ef4444" />
        <Text style={styles.errorText}>{error}</Text>
      </View>
    );
  }

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
          style={[styles.button, saving && styles.buttonDisabled]}
          onPress={handleSubmit}
          disabled={saving}
        >
          <Text style={styles.buttonText}>
            {saving ? 'Saving Changes...' : 'Save Changes'}
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