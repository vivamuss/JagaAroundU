import React, { useState, useEffect } from "react";
import { 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  Alert, 
  ActivityIndicator,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Modal,
  Dimensions
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import * as Location from "expo-location";
import { createOffer } from "../../src/services/api";
import { Ionicons } from "@expo/vector-icons";
import MapView, { Marker, PROVIDER_DEFAULT } from "react-native-maps";

const { width, height } = Dimensions.get("window");

const OfferPosting = () => {
  const navigation = useNavigation();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [locationLoading, setLocationLoading] = useState(false);
  const [userLocation, setUserLocation] = useState(null);
  const [locationError, setLocationError] = useState(false);
  const [showMapModal, setShowMapModal] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [mapRegion, setMapRegion] = useState(null);

  // Get user location when component mounts
  useEffect(() => {
    getCurrentLocation();
  }, []);

  const getCurrentLocation = async () => {
    setLocationLoading(true);
    setLocationError(false);
    
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        setLocationError(true);
        Alert.alert(
          "Location Permission Required", 
          "This app needs location access to show your offers on the map. Please enable location permissions in your device settings.",
          [
            { 
              text: "Open Settings", 
              onPress: () => Location.getProviderStatusAsync()
            },
            { text: "Cancel" }
          ]
        );
        return;
      }

      const location = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.High,
        timeout: 15000,
      });

      const newLocation = {
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
      };

      setUserLocation(newLocation);
      setSelectedLocation(newLocation);
      
      // Set map region to current location
      setMapRegion({
        ...newLocation,
        latitudeDelta: 0.01,
        longitudeDelta: 0.01,
      });
      
    } catch (error) {
      console.error("Location error:", error);
      setLocationError(true);
      Alert.alert(
        "Location Error", 
        "Unable to get your current location. Please check your GPS and try again."
      );
    } finally {
      setLocationLoading(false);
    }
  };

  const openMapForLocationSelection = () => {
    if (!mapRegion && userLocation) {
      setMapRegion({
        ...userLocation,
        latitudeDelta: 0.01,
        longitudeDelta: 0.01,
      });
    }
    setShowMapModal(true);
  };

  const handleMapPress = (event) => {
    const { coordinate } = event.nativeEvent;
    setSelectedLocation(coordinate);
  };

  const confirmLocation = () => {
    if (selectedLocation) {
      setUserLocation(selectedLocation);
      setShowMapModal(false);
      Alert.alert("Location Updated", "Your offer location has been updated.");
    }
  };

  const useCurrentLocation = () => {
    getCurrentLocation();
    setShowMapModal(false);
  };

  const handleSubmit = async () => {
    if (!title.trim()) {
      return Alert.alert("Missing Information", "Please enter a title for your offer.");
    }

    if (!description.trim()) {
      return Alert.alert("Missing Information", "Please enter a description for your offer.");
    }

    if (!userLocation) {
      return Alert.alert("Location Required", "We need your location to post this offer. Please wait for location detection or try again.");
    }

    setLoading(true);

    try {
      const offerData = {
        title: title.trim(),
        description: description.trim(),
        lat: userLocation.latitude,
        lng: userLocation.longitude,
      };

      await createOffer(offerData);
      
      Alert.alert(
        "Success!", 
        "Your offer has been posted successfully and is now visible to nearby users.",
        [
          {
            text: "OK",
            onPress: () => {
              setTitle("");
              setDescription("");
              navigation.navigate("NearbyOffers");
            }
          }
        ]
      );
      
    } catch (error) {
      console.error("Offer creation error:", error);
      Alert.alert(
        "Posting Failed", 
        error.response?.data?.message || "We couldn't post your offer. Please check your connection and try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView 
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <ScrollView 
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity 
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Ionicons name="arrow-back" size={24} color="#333" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Create New Offer</Text>
          <View style={styles.backButtonPlaceholder} />
        </View>

        {/* Form */}
        <View style={styles.form}>
          {/* Title Input */}
          <View style={styles.inputContainer}>
            <Text style={styles.label}>
              Offer Title <Text style={styles.required}>*</Text>
            </Text>
            <TextInput
              placeholder="What are you offering?"
              placeholderTextColor="#999"
              value={title}
              onChangeText={setTitle}
              style={styles.textInput}
              maxLength={100}
            />
            <Text style={styles.charCount}>{title.length}/100</Text>
          </View>

          {/* Description Input */}
          <View style={styles.inputContainer}>
            <Text style={styles.label}>
              Description <Text style={styles.required}>*</Text>
            </Text>
            <TextInput
              placeholder="Describe your offer in detail..."
              placeholderTextColor="#999"
              value={description}
              onChangeText={setDescription}
              multiline
              style={[styles.textInput, styles.textArea]}
              textAlignVertical="top"
              maxLength={500}
            />
            <Text style={styles.charCount}>{description.length}/500</Text>
          </View>

          {/* Location Card */}
          <View style={[
            styles.locationCard,
            locationError && styles.locationCardError
          ]}>
            <Ionicons 
              name={locationError ? "location-off" : "location"} 
              size={20} 
              color={locationError ? "#FF3B30" : "#007AFF"} 
            />
            <View style={styles.locationTextContainer}>
              <Text style={styles.locationTitle}>
                {locationError ? "Location Access Required" : "Offer Location"}
              </Text>
              <Text style={styles.locationSubtitle}>
                {locationLoading 
                  ? "Getting your location..." 
                  : locationError
                  ? "Tap to retry location detection"
                  : userLocation
                  ? `Lat: ${userLocation.latitude.toFixed(6)}, Lng: ${userLocation.longitude.toFixed(6)}`
                  : "Select a location for your offer"}
              </Text>
            </View>
            
            {locationLoading ? (
              <ActivityIndicator size="small" color="#007AFF" />
            ) : (
              <View style={styles.locationActions}>
                <TouchableOpacity onPress={getCurrentLocation} style={styles.locationActionButton}>
                  <Ionicons name="refresh" size={18} color="#007AFF" />
                </TouchableOpacity>
                <TouchableOpacity onPress={openMapForLocationSelection} style={styles.locationActionButton}>
                  <Ionicons name="map" size={18} color="#007AFF" />
                </TouchableOpacity>
              </View>
            )}
          </View>

          {/* Location Selection Help Text */}
          <Text style={styles.helpText}>
            Your offer will be visible to users near the selected location. 
            Use the map icon to choose a different location.
          </Text>

          {/* Submit Button */}
          <TouchableOpacity
            style={[
              styles.submitButton,
              (!title.trim() || !description.trim() || !userLocation || loading) && styles.submitButtonDisabled
            ]}
            onPress={handleSubmit}
            disabled={!title.trim() || !description.trim() || !userLocation || loading}
          >
            {loading ? (
              <ActivityIndicator color="#FFF" />
            ) : (
              <>
                <Ionicons name="add-circle-outline" size={20} color="#FFF" />
                <Text style={styles.submitButtonText}>Post Offer</Text>
              </>
            )}
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* Map Modal for Location Selection */}
      <Modal
        visible={showMapModal}
        animationType="slide"
        presentationStyle="pageSheet"
      >
        <View style={styles.modalContainer}>
          {/* Modal Header */}
          <View style={styles.modalHeader}>
            <TouchableOpacity 
              onPress={() => setShowMapModal(false)}
              style={styles.modalCloseButton}
            >
              <Ionicons name="close" size={24} color="#333" />
            </TouchableOpacity>
            <Text style={styles.modalTitle}>Select Offer Location</Text>
            <View style={styles.modalCloseButton} />
          </View>

          {/* Map */}
          {mapRegion && (
            <MapView
              style={styles.map}
              provider={PROVIDER_DEFAULT}
              region={mapRegion}
              showsUserLocation={true}
              onPress={handleMapPress}
            >
              {/* User Location */}
              {userLocation && (
                <Marker
                  coordinate={userLocation}
                  title="Your Current Location"
                  pinColor="#007AFF"
                />
              )}
              
              {/* Selected Location */}
              {selectedLocation && (
                <Marker
                  coordinate={selectedLocation}
                  title="Selected Offer Location"
                  pinColor="#FF6B35"
                />
              )}
            </MapView>
          )}

          {/* Modal Footer */}
          <View style={styles.modalFooter}>
            <Text style={styles.modalInstructions}>
              Tap on the map to select your offer location
            </Text>
            
            <View style={styles.modalButtons}>
              <TouchableOpacity 
                style={styles.secondaryButton}
                onPress={useCurrentLocation}
              >
                <Ionicons name="locate" size={18} color="#007AFF" />
                <Text style={styles.secondaryButtonText}>Use Current Location</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={[
                  styles.primaryButton,
                  !selectedLocation && styles.primaryButtonDisabled
                ]}
                onPress={confirmLocation}
                disabled={!selectedLocation}
              >
                <Ionicons name="checkmark" size={18} color="#FFF" />
                <Text style={styles.primaryButtonText}>Confirm Location</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8F9FA",
  },
  scrollContent: {
    flexGrow: 1,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: "#FFF",
    borderBottomWidth: 1,
    borderBottomColor: "#E9ECEF",
  },
  backButton: {
    padding: 4,
  },
  backButtonPlaceholder: {
    width: 32,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#333",
  },
  form: {
    padding: 20,
  },
  inputContainer: {
    marginBottom: 24,
  },
  label: {
    fontSize: 16,
    fontWeight: "500",
    color: "#333",
    marginBottom: 8,
  },
  required: {
    color: "#FF3B30",
  },
  textInput: {
    backgroundColor: "#FFF",
    borderWidth: 1,
    borderColor: "#D1D5DB",
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    color: "#333",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  textArea: {
    height: 120,
    paddingTop: 12,
  },
  charCount: {
    textAlign: "right",
    fontSize: 12,
    color: "#6B7280",
    marginTop: 4,
  },
  locationCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFF",
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  locationCardError: {
    borderColor: "#FF3B30",
    backgroundColor: "#FFF5F5",
  },
  locationTextContainer: {
    flex: 1,
    marginLeft: 12,
  },
  locationTitle: {
    fontSize: 16,
    fontWeight: "500",
    color: "#333",
    marginBottom: 2,
  },
  locationSubtitle: {
    fontSize: 14,
    color: "#6B7280",
  },
  locationActions: {
    flexDirection: "row",
    gap: 8,
  },
  locationActionButton: {
    padding: 6,
    backgroundColor: "#F0F7FF",
    borderRadius: 8,
  },
  helpText: {
    fontSize: 12,
    color: "#6B7280",
    marginBottom: 24,
    lineHeight: 16,
  },
  submitButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#007AFF",
    paddingVertical: 16,
    borderRadius: 12,
    gap: 8,
    shadowColor: "#007AFF",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  submitButtonDisabled: {
    backgroundColor: "#9CA3AF",
    shadowOpacity: 0,
    elevation: 0,
  },
  submitButtonText: {
    color: "#FFF",
    fontSize: 16,
    fontWeight: "600",
  },
  // Modal Styles
  modalContainer: {
    flex: 1,
    backgroundColor: "#FFF",
  },
  modalHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#E9ECEF",
  },
  modalCloseButton: {
    padding: 4,
    width: 32,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#333",
  },
  map: {
    flex: 1,
    width: "100%",
  },
  modalFooter: {
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: "#E9ECEF",
  },
  modalInstructions: {
    textAlign: "center",
    fontSize: 14,
    color: "#666",
    marginBottom: 16,
  },
  modalButtons: {
    flexDirection: "row",
    gap: 12,
  },
  secondaryButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: "#007AFF",
    borderRadius: 8,
    gap: 8,
  },
  secondaryButtonText: {
    color: "#007AFF",
    fontSize: 14,
    fontWeight: "500",
  },
  primaryButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 12,
    backgroundColor: "#007AFF",
    borderRadius: 8,
    gap: 8,
  },
  primaryButtonDisabled: {
    backgroundColor: "#9CA3AF",
  },
  primaryButtonText: {
    color: "#FFF",
    fontSize: 14,
    fontWeight: "500",
  },
});

export default OfferPosting;