import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  StatusBar,
  Alert,
  TextInput,
  Modal
} from "react-native";
import { useRouter } from "expo-router";
import { Ionicons, MaterialIcons, FontAwesome5 } from "@expo/vector-icons";
import { createOrder } from "../../src/services/api";

interface Deal {
  id: number;
  title: string;
  description: string;
  category: string;
  distance: string;
  rating: number;
  reviews: number;
  originalPrice: string;
  discountPrice: string;
  timeLeft: string;
  icon: string;
  color: string;
  features: string[];
}

export default function BeautyPage() {
  const router = useRouter();
  const [savedDeals, setSavedDeals] = useState<number[]>([]);
  const [orderModalVisible, setOrderModalVisible] = useState(false);
  const [selectedDeal, setSelectedDeal] = useState<Deal | null>(null);
  const [customerInfo, setCustomerInfo] = useState({
    name: '',
    email: '',
    phone: '',
    specialInstructions: ''
  });
  const [ordering, setOrdering] = useState(false);

  const beautyDeals: Deal[] = [
    {
      id: 1,
      title: "Premium Haircut & Styling",
      description: "$15 haircuts with our top stylists - this week only",
      category: "hair",
      distance: "0.3mi",
      rating: 4.8,
      reviews: 142,
      originalPrice: "$45",
      discountPrice: "$15",
      timeLeft: "3 days left",
      icon: "cut",
      color: "#FF6B8B",
      features: ["Expert Stylists", "Free Consultation", "Hair Wash Included"]
    },
    {
      id: 2,
      title: "Luxury Spa Experience",
      description: "20% off all spa services including facials and massages",
      category: "spa",
      distance: "1.5mi",
      rating: 4.9,
      reviews: 89,
      originalPrice: "$120",
      discountPrice: "$96",
      timeLeft: "5 days left",
      icon: "spa",
      color: "#6C63FF",
      features: ["Full Body Massage", "Aromatherapy", "Steam Room Access"]
    },
    {
      id: 3,
      title: "Manicure & Pedicure Combo",
      description: "Get both manicure and pedicure for just $35 (regular $60)",
      category: "nails",
      distance: "0.8mi",
      rating: 4.7,
      reviews: 216,
      originalPrice: "$60",
      discountPrice: "$35",
      timeLeft: "2 days left",
      icon: "brush",
      color: "#4CAF50",
      features: ["Gel Polish", "Hand Massage", "Foot Spa"]
    },
    {
      id: 4,
      title: "Premium Hair Coloring",
      description: "30% off all hair coloring services with senior stylists",
      category: "hair",
      distance: "1.2mi",
      rating: 4.6,
      reviews: 187,
      originalPrice: "$150",
      discountPrice: "$105",
      timeLeft: "6 days left",
      icon: "color-lens",
      color: "#FF9800",
      features: ["Color Consultation", "Premium Products", "Aftercare Kit"]
    },
  ];

  const toggleSaveDeal = (dealId: number) => {
    setSavedDeals(prev => 
      prev.includes(dealId) ? prev.filter(id => id !== dealId) : [...prev, dealId]
    );
  };

  const renderIcon = (iconName: string) => {
    switch(iconName) {
      case "cut":
        return <Ionicons name="cut" size={32} color="white" />;
      case "spa":
        return <MaterialIcons name="spa" size={32} color="white" />;
      case "brush":
        return <Ionicons name="brush" size={32} color="white" />;
      case "color-lens":
        return <MaterialIcons name="color-lens" size={32} color="white" />;
      default:
        return <FontAwesome5 name="smile" size={32} color="white" />;
    }
  };

  // Simple order function without modal (like food.tsx)
  const handleSimpleOrder = async (deal: Deal) => {
    try {
      const orderData = {
        customerName: "Guest",
        customerEmail: "guest@example.com",
        customerPhone: "0000000000",
        dealId: deal.id.toString(),
        dealTitle: deal.title,
        dealDescription: deal.description,
        originalPrice: Number(deal.originalPrice.replace(/[^0-9.]/g, "")),
        discountPrice: Number(deal.discountPrice.replace(/[^0-9.]/g, "")),
        category: "beauty",
        specialInstructions: "",
        quantity: 1
      };

      console.log("📦 Sending beauty orderData:", orderData);

      const response = await createOrder(orderData);
      console.log("Beauty order response:", response);

      Alert.alert(
        "✅ Success",
        `${deal.title} added to My Orders!`,
        [
          {
            text: "View My Orders",
            onPress: () => router.push("/(tabs)/myorders"),
          },
          { text: "OK", style: "cancel" },
        ],
        { cancelable: true }
      );
    } catch (err: any) {
      console.error("Beauty order error:", err.response?.data || err.message);
      Alert.alert("❌ Error", "Failed to place order.");
    }
  };

  // Modal order function with customer info
  const openOrderModal = (deal: Deal) => {
    setSelectedDeal(deal);
    setOrderModalVisible(true);
  };

  const closeOrderModal = () => {
    setOrderModalVisible(false);
    setSelectedDeal(null);
    setCustomerInfo({
      name: '',
      email: '',
      phone: '',
      specialInstructions: ''
    });
  };

  const handleModalOrder = async () => {
    if (!customerInfo.name || !customerInfo.email || !customerInfo.phone) {
      Alert.alert("Error", "Please fill in all required fields");
      return;
    }

    if (!selectedDeal) {
      Alert.alert("Error", "No deal selected");
      return;
    }

    setOrdering(true);

    try {
      const orderData = {
        customerName: customerInfo.name,
        customerEmail: customerInfo.email,
        customerPhone: customerInfo.phone,
        dealId: selectedDeal.id.toString(),
        dealTitle: selectedDeal.title,
        dealDescription: selectedDeal.description,
        originalPrice: Number(selectedDeal.originalPrice.replace(/[^0-9.]/g, "")),
        discountPrice: Number(selectedDeal.discountPrice.replace(/[^0-9.]/g, "")),
        category: "beauty",
        specialInstructions: customerInfo.specialInstructions,
        quantity: 1
      };

      console.log("📦 Sending beauty modal orderData:", orderData);

      const response = await createOrder(orderData);

      Alert.alert(
        "✅ Success",
        `${selectedDeal.title} added to My Orders!`,
        [
          {
            text: "View My Orders",
            onPress: () => {
              closeOrderModal();
              router.push("/(tabs)/orders");
            }
          },
          { text: "OK", onPress: closeOrderModal }
        ]
      );
    } catch (err: any) {
      console.error("Beauty modal order error:", err.response?.data || err.message);
      Alert.alert("❌ Error", "Failed to place order.");
    } finally {
      setOrdering(false);
    }
  };

  const updateCustomerInfo = (field: string, value: string) => {
    setCustomerInfo(prev => ({
      ...prev,
      [field]: value
    }));
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="chevron-back" size={24} color="#6C63FF" />
          <Text style={styles.backText}>Back</Text>
        </TouchableOpacity>
        <Text style={styles.title}>💇 Beauty & Wellness</Text>
        <View style={styles.headerRight} />
      </View>

      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
      >
        {/* Promotional Banner */}
        <View style={styles.promoBanner}>
          <View style={styles.promoIcon}>
            <Ionicons name="sparkles" size={32} color="#6C63FF" />
          </View>
          <View style={styles.promoContent}>
            <Text style={styles.promoTitle}>Beauty Specials</Text>
            <Text style={styles.promoText}>Exclusive deals on premium beauty services near you</Text>
          </View>
        </View>

        {/* Deals List */}
        {beautyDeals.map((deal) => (
          <View key={deal.id} style={styles.dealCard}>
            <View style={[styles.dealIconContainer, { backgroundColor: deal.color }]}>
              {renderIcon(deal.icon)}
            </View>

            <View style={styles.dealContent}>
              <View style={styles.dealHeader}>
                <Text style={styles.dealTitle}>{deal.title}</Text>
                <TouchableOpacity onPress={() => toggleSaveDeal(deal.id)}>
                  <Ionicons
                    name={savedDeals.includes(deal.id) ? "heart" : "heart-outline"}
                    size={24}
                    color={savedDeals.includes(deal.id) ? "#FF3B30" : "#CCC"}
                  />
                </TouchableOpacity>
              </View>

              <View style={styles.ratingContainer}>
                <Ionicons name="star" size={16} color="#FFD700" />
                <Text style={styles.ratingText}>{deal.rating}</Text>
                <Text style={styles.reviewsText}>({deal.reviews} reviews)</Text>
                <View style={styles.distanceBadge}>
                  <Ionicons name="location" size={12} color="#6C63FF" />
                  <Text style={styles.distanceText}>{deal.distance}</Text>
                </View>
              </View>

              <Text style={styles.dealDesc}>{deal.description}</Text>

              {/* Features */}
              <View style={styles.featuresContainer}>
                {deal.features.slice(0, 2).map((feature, index) => (
                  <View key={index} style={styles.featurePill}>
                    <Text style={styles.featureText}>{feature}</Text>
                  </View>
                ))}
                {deal.features.length > 2 && (
                  <View style={styles.featurePill}>
                    <Text style={styles.featureText}>+{deal.features.length - 2} more</Text>
                  </View>
                )}
              </View>

              <View style={styles.priceContainer}>
                <View>
                  <Text style={styles.originalPrice}>{deal.originalPrice}</Text>
                  <Text style={styles.discountPrice}>{deal.discountPrice}</Text>
                </View>
                <View style={styles.timeBadge}>
                  <Text style={styles.timeText}>{deal.timeLeft}</Text>
                </View>
              </View>
            </View>

            {/* Order Buttons */}
            <View style={styles.buttonContainer}>
              <TouchableOpacity 
                style={[styles.orderButton, { backgroundColor: deal.color }]} 
                onPress={() => handleSimpleOrder(deal)}
              >
                <Text style={styles.orderButtonText}>Quick Order</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={[styles.detailedOrderButton, { borderColor: deal.color }]} 
                onPress={() => openOrderModal(deal)}
              >
                <Text style={[styles.detailedOrderButtonText, { color: deal.color }]}>
                  Detailed Order
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        ))}

        {/* Additional Info */}
        <View style={styles.infoSection}>
          <Text style={styles.infoTitle}>How it works</Text>
          <View style={styles.infoItem}>
            <View style={styles.infoIcon}>
              <Ionicons name="calendar-outline" size={20} color="#6C63FF" />
            </View>
            <View style={styles.infoContent}>
              <Text style={styles.infoItemTitle}>Place your order</Text>
              <Text style={styles.infoItemDesc}>Fill in your details and place the order</Text>
            </View>
          </View>
          <View style={styles.infoItem}>
            <View style={styles.infoIcon}>
              <Ionicons name="checkmark-circle-outline" size={20} color="#6C63FF" />
            </View>
            <View style={styles.infoContent}>
              <Text style={styles.infoItemTitle}>Order confirmation</Text>
              <Text style={styles.infoItemDesc}>Receive confirmation and order details</Text>
            </View>
          </View>
          <View style={styles.infoItem}>
            <View style={styles.infoIcon}>
              <Ionicons name="sparkles-outline" size={20} color="#6C63FF" />
            </View>
            <View style={styles.infoContent}>
              <Text style={styles.infoItemTitle}>Enjoy your service</Text>
              <Text style={styles.infoItemDesc}>Visit the salon and enjoy your beauty treatment</Text>
            </View>
          </View>
        </View>
      </ScrollView>

      {/* Order Modal */}
      <Modal
        visible={orderModalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={closeOrderModal}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Place Order</Text>
              <TouchableOpacity onPress={closeOrderModal} style={styles.closeButton}>
                <Ionicons name="close" size={24} color="#666" />
              </TouchableOpacity>
            </View>

            {selectedDeal && (
              <View style={styles.selectedDealInfo}>
                <Text style={styles.selectedDealTitle}>{selectedDeal.title}</Text>
                <Text style={styles.selectedDealPrice}>{selectedDeal.discountPrice}</Text>
              </View>
            )}

            <ScrollView style={styles.modalScroll}>
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Full Name *</Text>
                <TextInput
                  style={styles.input}
                  value={customerInfo.name}
                  onChangeText={(value) => updateCustomerInfo('name', value)}
                  placeholder="Enter your full name"
                  placeholderTextColor="#999"
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Email *</Text>
                <TextInput
                  style={styles.input}
                  value={customerInfo.email}
                  onChangeText={(value) => updateCustomerInfo('email', value)}
                  placeholder="Enter your email"
                  placeholderTextColor="#999"
                  keyboardType="email-address"
                  autoCapitalize="none"
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Phone Number *</Text>
                <TextInput
                  style={styles.input}
                  value={customerInfo.phone}
                  onChangeText={(value) => updateCustomerInfo('phone', value)}
                  placeholder="Enter your phone number"
                  placeholderTextColor="#999"
                  keyboardType="phone-pad"
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Special Instructions (Optional)</Text>
                <TextInput
                  style={[styles.input, styles.textArea]}
                  value={customerInfo.specialInstructions}
                  onChangeText={(value) => updateCustomerInfo('specialInstructions', value)}
                  placeholder="Any special requests or instructions..."
                  placeholderTextColor="#999"
                  multiline
                  numberOfLines={3}
                  textAlignVertical="top"
                />
              </View>
            </ScrollView>

            <View style={styles.modalFooter}>
              <TouchableOpacity
                style={[styles.cancelButton, ordering && styles.disabledButton]}
                onPress={closeOrderModal}
                disabled={ordering}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.orderButtonModal, ordering && styles.disabledButton]}
                onPress={handleModalOrder}
                disabled={ordering}
              >
                <Text style={styles.orderButtonText}>
                  {ordering ? 'Placing Order...' : 'Place Order'}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF"
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#F0F0F0",
  },
  backButton: {
    flexDirection: "row",
    alignItems: "center",
  },
  backText: {
    color: "#6C63FF",
    fontSize: 16,
    marginLeft: 4,
  },
  title: {
    fontSize: 18,
    fontWeight: "700",
    color: "#1A1A1A",
  },
  headerRight: {
    width: 24,
  },
  scrollView: {
    flex: 1,
  },
  promoBanner: {
    backgroundColor: "#F0EFFF",
    padding: 20,
    margin: 16,
    borderRadius: 12,
    flexDirection: "row",
    alignItems: "center",
  },
  promoIcon: {
    marginRight: 16,
  },
  promoContent: {
    flex: 1,
  },
  promoTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#6C63FF",
    marginBottom: 4,
  },
  promoText: {
    fontSize: 14,
    color: "#666",
    lineHeight: 20,
  },
  dealCard: {
    backgroundColor: "white",
    borderRadius: 12,
    marginHorizontal: 16,
    marginBottom: 16,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 8,
    elevation: 3,
  },
  dealIconContainer: {
    height: 80,
    justifyContent: "center",
    alignItems: "center",
  },
  dealContent: {
    padding: 16,
  },
  dealHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 8,
  },
  dealTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#1A1A1A",
    flex: 1,
    marginRight: 8,
  },
  ratingContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  ratingText: {
    fontSize: 14,
    color: "#666",
    marginLeft: 4,
    marginRight: 8,
    fontWeight: "600",
  },
  reviewsText: {
    fontSize: 12,
    color: "#999",
    flex: 1,
  },
  distanceBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F0EFFF",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  distanceText: {
    fontSize: 12,
    color: "#6C63FF",
    marginLeft: 4,
    fontWeight: "600",
  },
  dealDesc: {
    fontSize: 14,
    color: "#555",
    marginBottom: 12,
    lineHeight: 20,
  },
  featuresContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginBottom: 12,
  },
  featurePill: {
    backgroundColor: "#F5F5F5",
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 16,
    marginRight: 8,
    marginBottom: 8,
  },
  featureText: {
    fontSize: 12,
    color: "#666",
    fontWeight: "500",
  },
  priceContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  originalPrice: {
    fontSize: 14,
    color: "#999",
    textDecorationLine: "line-through",
  },
  discountPrice: {
    fontSize: 18,
    color: "#6C63FF",
    fontWeight: "700",
  },
  timeBadge: {
    backgroundColor: "#FFF0E6",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  timeText: {
    fontSize: 12,
    color: "#FF6B35",
    fontWeight: "600",
  },
  buttonContainer: {
    flexDirection: 'row',
    padding: 16,
    gap: 12,
  },
  orderButton: {
    flex: 1,
    padding: 16,
    borderRadius: 8,
    alignItems: "center",
  },
  orderButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
  },
  detailedOrderButton: {
    flex: 1,
    padding: 16,
    borderRadius: 8,
    alignItems: "center",
    borderWidth: 2,
    backgroundColor: 'white',
  },
  detailedOrderButtonText: {
    fontSize: 16,
    fontWeight: "600",
  },
  infoSection: {
    padding: 20,
    marginTop: 8,
    marginBottom: 30,
  },
  infoTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#1A1A1A",
    marginBottom: 16,
  },
  infoItem: {
    flexDirection: "row",
    marginBottom: 20,
  },
  infoIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#F0EFFF",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  infoContent: {
    flex: 1,
  },
  infoItemTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
    marginBottom: 4,
  },
  infoItemDesc: {
    fontSize: 14,
    color: "#666",
    lineHeight: 20,
  },
  // Modal styles
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "flex-end",
  },
  modalContent: {
    backgroundColor: "white",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: "80%",
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#F0F0F0",
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#1A1A1A",
  },
  closeButton: {
    padding: 4,
  },
  selectedDealInfo: {
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#F0F0F0",
  },
  selectedDealTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1A1A1A",
    marginBottom: 4,
  },
  selectedDealPrice: {
    fontSize: 18,
    fontWeight: "700",
    color: "#6C63FF",
  },
  modalScroll: {
    maxHeight: 300,
  },
  inputGroup: {
    paddingHorizontal: 20,
    paddingVertical: 12,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: "600",
    color: "#333",
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: "#E0E0E0",
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    color: "#333",
  },
  textArea: {
    height: 80,
    textAlignVertical: "top",
  },
  modalFooter: {
    flexDirection: "row",
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: "#F0F0F0",
  },
  cancelButton: {
    flex: 1,
    backgroundColor: "#F5F5F5",
    padding: 16,
    borderRadius: 8,
    marginRight: 12,
    alignItems: "center",
  },
  cancelButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#666",
  },
  orderButtonModal: {
    flex: 1,
    backgroundColor: "#6C63FF",
    padding: 16,
    borderRadius: 8,
    marginLeft: 12,
    alignItems: "center",
  },
  disabledButton: {
    opacity: 0.6,
  },
});