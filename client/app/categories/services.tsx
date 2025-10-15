import React, { useState } from "react";
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  ScrollView, 
  SafeAreaView,
  StatusBar,
  Alert
} from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
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

export default function ServicesPage() {
  const router = useRouter();
  const [savedDeals, setSavedDeals] = useState<number[]>([]);
  const [activeCategory, setActiveCategory] = useState("All");

  const toggleSaveDeal = (dealId: number) => {
    setSavedDeals(prev => 
      prev.includes(dealId) ? prev.filter(id => id !== dealId) : [...prev, dealId]
    );
  };

  const categories = [
    { id: "all", name: "All", icon: "build" },
    { id: "auto", name: "Auto", icon: "car" },
    { id: "home", name: "Home", icon: "home" },
    { id: "repair", name: "Repair", icon: "construct" },
    { id: "cleaning", name: "Cleaning", icon: "brush" },
  ];

  const servicesDeals: Deal[] = [
    { 
      id: 1, 
      title: "Premium Car Wash Package", 
      description: "Complete interior and exterior cleaning with wax treatment", 
      category: "auto",
      distance: "0.9mi", 
      rating: 4.6, 
      reviews: 187,
      originalPrice: "$35",
      discountPrice: "$10",
      timeLeft: "2 days left",
      icon: "car-wash",
      color: "#2196F3",
      features: ["Interior Vacuum", "Exterior Wash", "Wax Treatment", "Tire Shine"]
    },
    { 
      id: 2, 
      title: "Professional Home Cleaning", 
      description: "Deep cleaning service for your entire home with eco-friendly products", 
      category: "cleaning",
      distance: "1.8mi", 
      rating: 4.8, 
      reviews: 234,
      originalPrice: "$150",
      discountPrice: "$120",
      timeLeft: "5 days left",
      icon: "home",
      color: "#4CAF50",
      features: ["Eco-Friendly", "All Rooms", "Kitchen/Bath", "Window Cleaning"]
    },
    { 
      id: 3, 
      title: "AC Repair & Service", 
      description: "Complete AC system check, cleaning, and refrigerant recharge", 
      category: "repair",
      distance: "1.2mi", 
      rating: 4.7, 
      reviews: 156,
      originalPrice: "$129",
      discountPrice: "$89",
      timeLeft: "1 day left",
      icon: "snow",
      color: "#03A9F4",
      features: ["System Check", "Cleaning", "Recharge", "3 Month Warranty"]
    },
    { 
      id: 4, 
      title: "Handyman Services Package", 
      description: "3 hours of professional handyman services for various home repairs", 
      category: "home",
      distance: "0.7mi", 
      rating: 4.9, 
      reviews: 278,
      originalPrice: "$180",
      discountPrice: "$135",
      timeLeft: "3 days left",
      icon: "hammer",
      color: "#FF9800",
      features: ["Furniture Assembly", "Minor Repairs", "Installation", "Painting"]
    },
  ];

  const filteredDeals = activeCategory === "All" 
    ? servicesDeals 
    : servicesDeals.filter(deal => deal.category === activeCategory.toLowerCase());

  const renderIcon = (iconName: string) => {
    switch(iconName) {
      case "car-wash":
        return <Ionicons name="car" size={32} color="white" />;
      case "home":
        return <Ionicons name="home" size={32} color="white" />;
      case "snow":
        return <Ionicons name="snow" size={32} color="white" />;
      case "hammer":
        return <Ionicons name="hammer" size={32} color="white" />;
      default:
        return <Ionicons name="build" size={32} color="white" />;
    }
  };

  const handleOrderNow = async (deal: Deal) => {
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
        category: "services",
        specialInstructions: "",
        quantity: 1
      };

      console.log("📦 Sending services orderData:", orderData);

      const response = await createOrder(orderData);
      console.log("Services order response:", response);

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
      console.error("Services order error:", err.response?.data || err.message);
      Alert.alert("❌ Error", "Failed to place order.");
    }
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
        <Text style={styles.title}>🛠 Services & Repairs</Text>
        <View style={styles.headerRight} />
      </View>

      <ScrollView 
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
      >
        {/* Promotional Banner */}
        <View style={styles.promoBanner}>
          <View style={styles.promoIcon}>
            <Ionicons name="construct" size={32} color="#2196F3" />
          </View>
          <View style={styles.promoContent}>
            <Text style={styles.promoTitle}>Service Specials</Text>
            <Text style={styles.promoText}>Professional services at discounted rates</Text>
          </View>
        </View>

        {/* Category Filter */}
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          style={styles.categoryContainer}
          contentContainerStyle={styles.categoryContent}
        >
          {categories.map((category) => (
            <TouchableOpacity
              key={category.id}
              style={[
                styles.categoryPill,
                activeCategory === category.name && styles.categoryPillActive
              ]}
              onPress={() => setActiveCategory(category.name)}
            >
              <Ionicons 
                name={category.icon} 
                size={20} 
                color={activeCategory === category.name ? "#FFFFFF" : "#2196F3"} 
                style={styles.categoryIcon}
              />
              <Text style={[
                styles.categoryText,
                activeCategory === category.name && styles.categoryTextActive
              ]}>
                {category.name}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Deals List */}
        {filteredDeals.map((deal) => (
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
                  <Ionicons name="time-outline" size={12} color="#FFF" />
                  <Text style={styles.timeText}>{deal.timeLeft}</Text>
                </View>
              </View>
            </View>
            
            <TouchableOpacity 
              style={[styles.bookButton, { backgroundColor: deal.color }]} 
              onPress={() => handleOrderNow(deal)}
            >
              <Text style={styles.bookButtonText}>Book Service</Text>
            </TouchableOpacity>
          </View>
        ))}
        
        {/* Additional Info */}
        <View style={styles.infoSection}>
          <Text style={styles.infoTitle}>Why Choose Our Services?</Text>

          <View style={styles.infoItem}>
            <View style={styles.infoIcon}>
              <Ionicons name="checkmark-circle" size={20} color="#2196F3" />
            </View>
            <View style={styles.infoContent}>
              <Text style={styles.infoItemTitle}>Verified Professionals</Text>
              <Text style={styles.infoItemDesc}>All service providers are background-checked and rated</Text>
            </View>
          </View>

          <View style={styles.infoItem}>
            <View style={styles.infoIcon}>
              <Ionicons name="lock-closed" size={20} color="#2196F3" />
            </View>
            <View style={styles.infoContent}>
              <Text style={styles.infoItemTitle}>Secure Booking</Text>
              <Text style={styles.infoItemDesc}>Your appointment is confirmed and protected</Text>
            </View>
          </View>

          <View style={styles.infoItem}>
            <View style={styles.infoIcon}>
              <Ionicons name="thumbs-up" size={20} color="#2196F3" />
            </View>
            <View style={styles.infoContent}>
              <Text style={styles.infoItemTitle}>Satisfaction Guarantee</Text>
              <Text style={styles.infoItemDesc}>We ensure quality work or your money back</Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#FFFFFF" },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#F0F0F0",
  },
  backButton: { flexDirection: "row", alignItems: "center" },
  backText: { color: "#6C63FF", fontSize: 16, marginLeft: 4 },
  title: { fontSize: 18, fontWeight: "700", color: "#1A1A1A" },
  headerRight: { width: 24 },
  scrollView: { flex: 1 },
  promoBanner: {
    backgroundColor: "#E3F2FD",
    padding: 20,
    margin: 16,
    borderRadius: 12,
    flexDirection: "row",
    alignItems: "center",
  },
  promoIcon: { marginRight: 16 },
  promoContent: { flex: 1 },
  promoTitle: { fontSize: 18, fontWeight: "700", color: "#2196F3", marginBottom: 4 },
  promoText: { fontSize: 14, color: "#666", lineHeight: 20 },
  categoryContainer: { backgroundColor: "#FFFFFF", marginBottom: 8 },
  categoryContent: { paddingHorizontal: 16, paddingVertical: 12 },
  categoryPill: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: "#F5F5F5",
    marginRight: 8,
  },
  categoryPillActive: { backgroundColor: "#2196F3" },
  categoryIcon: { marginRight: 6 },
  categoryText: { fontSize: 14, color: "#666", fontWeight: "500" },
  categoryTextActive: { color: "#FFFFFF" },
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
  dealIconContainer: { height: 80, justifyContent: "center", alignItems: "center" },
  dealContent: { padding: 16 },
  dealHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 8 },
  dealTitle: { fontSize: 16, fontWeight: "700", color: "#1A1A1A", flex: 1, marginRight: 8 },
  ratingContainer: { flexDirection: "row", alignItems: "center", marginBottom: 8 },
  ratingText: { fontSize: 14, color: "#666", marginLeft: 4, marginRight: 8, fontWeight: "600" },
  reviewsText: { fontSize: 12, color: "#999", flex: 1 },
  distanceBadge: { flexDirection: "row", alignItems: "center", backgroundColor: "#F0EFFF", paddingHorizontal: 8, paddingVertical: 4, borderRadius: 12 },
  distanceText: { fontSize: 12, color: "#6C63FF", marginLeft: 4, fontWeight: "600" },
  dealDesc: { fontSize: 14, color: "#555", marginBottom: 12, lineHeight: 20 },
  featuresContainer: { flexDirection: "row", flexWrap: "wrap", marginBottom: 12 },
  featurePill: { backgroundColor: "#F5F5F5", paddingHorizontal: 10, paddingVertical: 6, borderRadius: 16, marginRight: 8, marginBottom: 8 },
  featureText: { fontSize: 12, color: "#666", fontWeight: "500" },
  priceContainer: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  originalPrice: { fontSize: 14, color: "#999", textDecorationLine: "line-through" },
  discountPrice: { fontSize: 18, color: "#2196F3", fontWeight: "700" },
  timeBadge: { flexDirection: "row", alignItems: "center", backgroundColor: "#2196F3", paddingHorizontal: 8, paddingVertical: 4, borderRadius: 12 },
  timeText: { fontSize: 12, color: "#FFF", fontWeight: "600", marginLeft: 4 },
  bookButton: { padding: 16, alignItems: "center" },
  bookButtonText: { color: "white", fontSize: 16, fontWeight: "600" },
  infoSection: { padding: 20, marginTop: 8, marginBottom: 30 },
  infoTitle: { fontSize: 18, fontWeight: "700", color: "#1A1A1A", marginBottom: 16 },
  infoItem: { flexDirection: "row", marginBottom: 20 },
  infoIcon: { width: 40, height: 40, borderRadius: 20, backgroundColor: "#E3F2FD", alignItems: "center", justifyContent: "center", marginRight: 12 },
  infoContent: { flex: 1 },
  infoItemTitle: { fontSize: 16, fontWeight: "600", color: "#333", marginBottom: 4 },
  infoItemDesc: { fontSize: 14, color: "#666", lineHeight: 20 },
});