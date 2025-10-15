import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  Dimensions,
  Linking,
  Platform,
  Modal
} from "react-native";
import { useNavigation, useIsFocused } from "@react-navigation/native";
import * as Location from "expo-location";
import { Ionicons } from "@expo/vector-icons";
import { getNearbyOffers } from "../../src/services/api";
import MapView, { Marker, PROVIDER_DEFAULT } from "react-native-maps";

const { width, height } = Dimensions.get("window");

const NearbyOffers = () => {
  const navigation = useNavigation();
  const isFocused = useIsFocused();
  const [offers, setOffers] = useState([]);
  const [filteredOffers, setFilteredOffers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userLocation, setUserLocation] = useState(null);
  const [selectedOffer, setSelectedOffer] = useState(null);
  const [mapRegion, setMapRegion] = useState(null);
  const [selectedRadius, setSelectedRadius] = useState(5); // Default 5km
  const [showRadiusModal, setShowRadiusModal] = useState(false);

  const radiusOptions = [
    { label: "2 Km", value: 2 },
    { label: "5 Km", value: 5 },
    { label: "10 Km", value: 10 },
    { label: "15 Km", value: 15 },
    { label: "20 Km", value: 20 },
    { label: "All", value: 50 }, // Large value to show all offers
  ];

  useEffect(() => {
    if (isFocused) {
      loadUserLocationAndOffers();
    }
  }, [isFocused]);

  useEffect(() => {
    filterOffersByRadius();
  }, [offers, selectedRadius, userLocation]);

  const loadUserLocationAndOffers = async () => {
    try {
      // Get user location
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        Alert.alert("Permission denied", "Location access is required to find nearby offers.");
        return;
      }

      const location = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.High,
      });

      const userLoc = {
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
      };

      setUserLocation(userLoc);
      setMapRegion({
        ...userLoc,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421,
      });

      // Load nearby offers with larger radius initially
      const nearbyOffers = await getNearbyOffers(
        userLoc.latitude,
        userLoc.longitude,
        50 // Load all offers initially, filter locally
      );

      setOffers(nearbyOffers);
    } catch (error) {
      console.error("Error loading offers:", error);
      Alert.alert("Error", "Failed to load nearby offers.");
    } finally {
      setLoading(false);
    }
  };

  const filterOffersByRadius = () => {
    if (!userLocation || offers.length === 0) {
      setFilteredOffers(offers);
      return;
    }

    if (selectedRadius === 50) { // "All" option
      setFilteredOffers(offers);
      return;
    }

    const filtered = offers.filter(offer => {
      const distance = calculateDistance(
        userLocation.latitude,
        userLocation.longitude,
        offer.location.coordinates[1],
        offer.location.coordinates[0]
      );
      return distance <= selectedRadius;
    });

    setFilteredOffers(filtered);
  };

  const calculateDistance = (lat1, lon1, lat2, lon2) => {
    const R = 6371; // Earth's radius in kilometers
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
      Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    const distance = R * c;
    return distance;
  };

  const openInMaps = (latitude, longitude, label) => {
    const url = Platform.select({
      ios: `maps:0,0?q=${label}@${latitude},${longitude}`,
      android: `geo:0,0?q=${latitude},${longitude}(${label})`,
    });
    
    Linking.openURL(url).catch(err => 
      Alert.alert("Error", "Could not open maps app.")
    );
  };

  const handleOfferPress = (offer) => {
    setSelectedOffer(offer);
    // Center map on selected offer
    setMapRegion({
      latitude: offer.location.coordinates[1],
      longitude: offer.location.coordinates[0],
      latitudeDelta: 0.01,
      longitudeDelta: 0.01,
    });
  };

  const refreshOffers = async () => {
    setLoading(true);
    await loadUserLocationAndOffers();
  };

  const handleRadiusSelect = (radius) => {
    setSelectedRadius(radius);
    setShowRadiusModal(false);
  };

  const getRadiusLabel = () => {
    const option = radiusOptions.find(opt => opt.value === selectedRadius);
    return option ? option.label : "5 Km";
  };

  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#007AFF" />
        <Text style={styles.loadingText}>Finding nearby offers...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Nearby Offers</Text>
        <TouchableOpacity onPress={refreshOffers}>
          <Ionicons name="refresh" size={24} color="#007AFF" />
        </TouchableOpacity>
      </View>

      {/* Radius Filter */}
      <View style={styles.filterContainer}>
        <Text style={styles.filterLabel}>Show offers within:</Text>
        <TouchableOpacity 
          style={styles.radiusSelector}
          onPress={() => setShowRadiusModal(true)}
        >
          <Ionicons name="filter" size={16} color="#007AFF" />
          <Text style={styles.radiusText}>{getRadiusLabel()}</Text>
          <Ionicons name="chevron-down" size={16} color="#007AFF" />
        </TouchableOpacity>
      </View>

      {/* Map Section */}
      <View style={styles.mapContainer}>
        {mapRegion && (
          <MapView
            style={styles.map}
            provider={PROVIDER_DEFAULT}
            region={mapRegion}
            showsUserLocation={true}
            showsMyLocationButton={true}
          >
            {/* User Location Marker */}
            {userLocation && (
              <Marker
                coordinate={userLocation}
                title="Your Location"
                pinColor="#007AFF"
              />
            )}

            {/* Offer Markers */}
            {filteredOffers.map((offer, index) => (
              <Marker
                key={offer._id || index}
                coordinate={{
                  latitude: offer.location.coordinates[1],
                  longitude: offer.location.coordinates[0],
                }}
                title={offer.title}
                description={offer.description}
                onPress={() => handleOfferPress(offer)}
                pinColor="#FF6B35"
              />
            ))}
          </MapView>
        )}
      </View>

      {/* Offers List */}
      <View style={styles.offersContainer}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>
            Offers ({filteredOffers.length})
          </Text>
          <Text style={styles.radiusInfo}>
            Within {getRadiusLabel().toLowerCase()}
          </Text>
        </View>
        
        <ScrollView 
          style={styles.offersList}
          showsVerticalScrollIndicator={false}
        >
          {filteredOffers.length === 0 ? (
            <View style={styles.emptyState}>
              <Ionicons name="location-outline" size={64} color="#CCC" />
              <Text style={styles.emptyStateText}>No offers found</Text>
              <Text style={styles.emptyStateSubtext}>
                {selectedRadius === 50 
                  ? "No offers available in your area"
                  : `No offers within ${getRadiusLabel().toLowerCase()}. Try increasing the search radius.`
                }
              </Text>
              <TouchableOpacity 
                style={styles.changeRadiusButton}
                onPress={() => setShowRadiusModal(true)}
              >
                <Text style={styles.changeRadiusText}>Change Radius</Text>
              </TouchableOpacity>
            </View>
          ) : (
            filteredOffers.map((offer, index) => {
              const distance = userLocation 
                ? calculateDistance(
                    userLocation.latitude,
                    userLocation.longitude,
                    offer.location.coordinates[1],
                    offer.location.coordinates[0]
                  )
                : 0;

              return (
                <TouchableOpacity
                  key={offer._id || index}
                  style={[
                    styles.offerCard,
                    selectedOffer?._id === offer._id && styles.offerCardSelected
                  ]}
                  onPress={() => handleOfferPress(offer)}
                >
                  <View style={styles.offerHeader}>
                    <Text style={styles.offerTitle} numberOfLines={1}>
                      {offer.title}
                    </Text>
                    <View style={styles.distanceBadge}>
                      <Ionicons name="location" size={12} color="#FFF" />
                      <Text style={styles.distanceText}>{distance.toFixed(1)} km</Text>
                    </View>
                  </View>
                  
                  <Text style={styles.offerDescription} numberOfLines={2}>
                    {offer.description}
                  </Text>
                  
                  <View style={styles.offerFooter}>
                    <Text style={styles.offerDate}>
                      {new Date(offer.createdAt).toLocaleDateString()}
                    </Text>
                    <TouchableOpacity
                      style={styles.directionsButton}
                      onPress={() => 
                        openInMaps(
                          offer.location.coordinates[1],
                          offer.location.coordinates[0],
                          offer.title
                        )
                      }
                    >
                      <Ionicons name="navigate" size={16} color="#007AFF" />
                      <Text style={styles.directionsText}>Directions</Text>
                    </TouchableOpacity>
                  </View>
                </TouchableOpacity>
              );
            })
          )}
        </ScrollView>
      </View>

      {/* Radius Selection Modal */}
      <Modal
        visible={showRadiusModal}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowRadiusModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Select Search Radius</Text>
            
            {radiusOptions.map((option) => (
              <TouchableOpacity
                key={option.value}
                style={[
                  styles.radiusOption,
                  selectedRadius === option.value && styles.radiusOptionSelected
                ]}
                onPress={() => handleRadiusSelect(option.value)}
              >
                <Text style={[
                  styles.radiusOptionText,
                  selectedRadius === option.value && styles.radiusOptionTextSelected
                ]}>
                  {option.label}
                </Text>
                {selectedRadius === option.value && (
                  <Ionicons name="checkmark" size={20} color="#007AFF" />
                )}
              </TouchableOpacity>
            ))}
            
            <TouchableOpacity
              style={styles.modalCloseButton}
              onPress={() => setShowRadiusModal(false)}
            >
              <Text style={styles.modalCloseText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8F9FA",
  },
  centerContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F8F9FA",
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: "#666",
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
  headerTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#333",
  },
  filterContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: 12,
    backgroundColor: "#FFF",
    borderBottomWidth: 1,
    borderBottomColor: "#E9ECEF",
  },
  filterLabel: {
    fontSize: 14,
    color: "#666",
  },
  radiusSelector: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: "#F0F7FF",
    borderRadius: 8,
  },
  radiusText: {
    fontSize: 14,
    fontWeight: "500",
    color: "#007AFF",
  },
  mapContainer: {
    height: height * 0.35,
  },
  map: {
    width: "100%",
    height: "100%",
  },
  offersContainer: {
    flex: 1,
    padding: 16,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#333",
  },
  radiusInfo: {
    fontSize: 12,
    color: "#666",
    backgroundColor: "#F0F7FF",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  offersList: {
    flex: 1,
  },
  offerCard: {
    backgroundColor: "#FFF",
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  offerCardSelected: {
    borderColor: "#007AFF",
    borderWidth: 2,
  },
  offerHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 8,
  },
  offerTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
    flex: 1,
    marginRight: 8,
  },
  distanceBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FF6B35",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    gap: 4,
  },
  distanceText: {
    color: "#FFF",
    fontSize: 12,
    fontWeight: "600",
  },
  offerDescription: {
    fontSize: 14,
    color: "#666",
    lineHeight: 20,
    marginBottom: 12,
  },
  offerFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  offerDate: {
    fontSize: 12,
    color: "#999",
  },
  directionsButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: "#F0F7FF",
    borderRadius: 8,
    gap: 4,
  },
  directionsText: {
    color: "#007AFF",
    fontSize: 12,
    fontWeight: "500",
  },
  emptyState: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 60,
  },
  emptyStateText: {
    fontSize: 18,
    fontWeight: "600",
    color: "#666",
    marginTop: 16,
  },
  emptyStateSubtext: {
    fontSize: 14,
    color: "#999",
    textAlign: "center",
    marginTop: 8,
    lineHeight: 20,
    marginBottom: 20,
  },
  changeRadiusButton: {
    backgroundColor: "#007AFF",
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  changeRadiusText: {
    color: "#FFF",
    fontSize: 14,
    fontWeight: "500",
  },
  // Modal Styles
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "flex-end",
  },
  modalContent: {
    backgroundColor: "#FFF",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    maxHeight: "80%",
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#333",
    textAlign: "center",
    marginBottom: 20,
  },
  radiusOption: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#F0F0F0",
  },
  radiusOptionSelected: {
    backgroundColor: "#F0F7FF",
  },
  radiusOptionText: {
    fontSize: 16,
    color: "#333",
  },
  radiusOptionTextSelected: {
    color: "#007AFF",
    fontWeight: "500",
  },
  modalCloseButton: {
    paddingVertical: 16,
    alignItems: "center",
    marginTop: 10,
    borderTopWidth: 1,
    borderTopColor: "#F0F0F0",
  },
  modalCloseText: {
    fontSize: 16,
    color: "#007AFF",
    fontWeight: "500",
  },
});

export default NearbyOffers;