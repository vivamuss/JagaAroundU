import React, { useState, useEffect } from "react";
import {
  View, Text, StyleSheet, TouchableOpacity, ScrollView, SafeAreaView, StatusBar, Alert
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

export default function FoodPage() {
  const router = useRouter();
  const [savedDeals, setSavedDeals] = useState<number[]>([]);
  const [activeCategory, setActiveCategory] = useState("All");
  const [foodDeals, setFoodDeals] = useState<Deal[]>([]);

  const categories = [
    { id: "all", name: "All", icon: "restaurant" },
    { id: "pizza", name: "Pizza", icon: "pizza" },
    { id: "burger", name: "Burgers", icon: "fast-food" },
    { id: "asian", name: "Asian", icon: "fish" },
    { id: "mexican", name: "Mexican", icon: "restaurant" },
  ];

  // Fetch deals from backend (optional)
  useEffect(() => {
    // For now, static deals
    setFoodDeals([
      { id: 1, title: "Gourmet Pizza - 50% Off", description: "Authentic Italian pizza with premium ingredients", category: "pizza", distance: "0.5mi", rating: 4.7, reviews: 245, originalPrice: "$24.99", discountPrice: "$12.49", timeLeft: "5h 23m", icon: "pizza", color: "#FF6B35", features: ["Large Size", "Premium Toppings", "Free Delivery", "30 Min Guarantee"] },
      { id: 2, title: "Burger Combo Deal", description: "Gourmet burger with free fries and drink", category: "burger", distance: "1.0mi", rating: 4.8, reviews: 183, originalPrice: "$15.99", discountPrice: "$9.99", timeLeft: "3h 45m", icon: "fast-food", color: "#FF9800", features: ["Angus Beef", "Craft Bun", "Truffle Fries", "Refillable Drink"] },
      { id: 3, title: "Sushi Platter Special", description: "Chef's selection of premium sushi and sashimi", category: "asian", distance: "0.8mi", rating: 4.9, reviews: 312, originalPrice: "$38.50", discountPrice: "$28.99", timeLeft: "1d", icon: "fish", color: "#2196F3", features: ["12 Pieces", "Fresh Wasabi", "Miso Soup", "Edamame"] },
      { id: 4, title: "Taco Tuesday Fiesta", description: "3 authentic tacos with margarita special", category: "mexican", distance: "1.2mi", rating: 4.6, reviews: 127, originalPrice: "$18.75", discountPrice: "$12.99", timeLeft: "2d", icon: "restaurant", color: "#4CAF50", features: ["Choice of Protein", "Homemade Salsa", "Fresh Guacamole", "House Margarita"] },
    ]);
  }, []);

  const filteredDeals = activeCategory === "All"
    ? foodDeals
    : foodDeals.filter(deal => deal.category.toLowerCase() === activeCategory.toLowerCase());

  const toggleSaveDeal = (dealId: number) => {
    setSavedDeals(prev => prev.includes(dealId) ? prev.filter(id => id !== dealId) : [...prev, dealId]);
  };

  const renderIcon = (iconName: string) => {
    const iconMap: Record<string, string> = {
      pizza: "pizza",
      "fast-food": "fast-food",
      fish: "fish",
      restaurant: "restaurant",
    };
    return <Ionicons name={iconMap[iconName] || "restaurant"} size={32} color="white" />;
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

  // ✅ Strip everything except numbers + dot
  originalPrice: Number(deal.originalPrice.replace(/[^0-9.]/g, "")),
  discountPrice: Number(deal.discountPrice.replace(/[^0-9.]/g, "")),

  category: "food",
  specialInstructions: "",
  quantity: 1
};

console.log("📦 Sending orderData:", orderData);

      const response = await createOrder(orderData);
      console.log("Order response:", response);

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
      console.error("Order error:", err.response?.data || err.message);
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
        <Text style={styles.title}>🍔 Food & Dining</Text>
        <View style={styles.headerRight} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Categories */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.categoryContainer} contentContainerStyle={styles.categoryContent}>
          {categories.map(category => (
            <TouchableOpacity
              key={category.id}
              style={[styles.categoryPill, activeCategory === category.name && styles.categoryPillActive]}
              onPress={() => setActiveCategory(category.name)}
            >
              <Ionicons name={category.icon} size={20} color={activeCategory === category.name ? "#FFF" : "#FF6B35"} style={styles.categoryIcon} />
              <Text style={[styles.categoryText, activeCategory === category.name && styles.categoryTextActive]}>{category.name}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Deals */}
        {filteredDeals.map(deal => (
          <View key={deal.id} style={styles.dealCard}>
            <View style={[styles.dealIconContainer, { backgroundColor: deal.color }]}>{renderIcon(deal.icon)}</View>
            <View style={styles.dealContent}>
              <View style={styles.dealHeader}>
                <Text style={styles.dealTitle}>{deal.title}</Text>
                <TouchableOpacity onPress={() => toggleSaveDeal(deal.id)}>
                  <Ionicons name={savedDeals.includes(deal.id) ? "heart" : "heart-outline"} size={24} color={savedDeals.includes(deal.id) ? "#FF3B30" : "#CCC"} />
                </TouchableOpacity>
              </View>
              <Text style={styles.dealDesc}>{deal.description}</Text>

              <View style={styles.featuresContainer}>
                {deal.features.slice(0, 2).map((f, i) => <View key={i} style={styles.featurePill}><Text style={styles.featureText}>{f}</Text></View>)}
                {deal.features.length > 2 && <View style={styles.featurePill}><Text style={styles.featureText}>+{deal.features.length - 2} more</Text></View>}
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

            <TouchableOpacity style={[styles.orderButton, { backgroundColor: deal.color }]} onPress={() => handleOrderNow(deal)}>
              <Text style={styles.orderButtonText}>Order Now</Text>
            </TouchableOpacity>
          </View>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#FFF" },
  header: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", paddingHorizontal: 20, paddingVertical: 16, borderBottomWidth: 1, borderBottomColor: "#F0F0F0" },
  backButton: { flexDirection: "row", alignItems: "center" },
  backText: { color: "#6C63FF", fontSize: 16, marginLeft: 4 },
  title: { fontSize: 18, fontWeight: "700", color: "#1A1A1A" },
  headerRight: { width: 24 },
  categoryContainer: { backgroundColor: "#FFF", marginBottom: 8 },
  categoryContent: { paddingHorizontal: 16, paddingVertical: 12 },
  categoryPill: { flexDirection: "row", alignItems: "center", paddingHorizontal: 16, paddingVertical: 8, borderRadius: 20, backgroundColor: "#F5F5F5", marginRight: 8 },
  categoryPillActive: { backgroundColor: "#FF6B35" },
  categoryIcon: { marginRight: 6 },
  categoryText: { fontSize: 14, color: "#666", fontWeight: "500" },
  categoryTextActive: { color: "#FFF" },
  dealCard: { backgroundColor: "white", borderRadius: 12, marginHorizontal: 16, marginBottom: 16, overflow: "hidden", shadowColor: "#000", shadowOpacity: 0.1, shadowOffset: { width: 0, height: 2 }, shadowRadius: 8, elevation: 3 },
  dealIconContainer: { height: 80, justifyContent: "center", alignItems: "center" },
  dealContent: { padding: 16 },
  dealHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 8 },
  dealTitle: { fontSize: 16, fontWeight: "700", color: "#1A1A1A", flex: 1, marginRight: 8 },
  dealDesc: { fontSize: 14, color: "#555", marginBottom: 12, lineHeight: 20 },
  featuresContainer: { flexDirection: "row", flexWrap: "wrap", marginBottom: 12 },
  featurePill: { backgroundColor: "#F5F5F5", paddingHorizontal: 10, paddingVertical: 6, borderRadius: 16, marginRight: 8, marginBottom: 8 },
  featureText: { fontSize: 12, color: "#666", fontWeight: "500" },
  priceContainer: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  originalPrice: { fontSize: 14, color: "#999", textDecorationLine: "line-through" },
  discountPrice: { fontSize: 18, color: "#FF6B35", fontWeight: "700" },
  timeBadge: { flexDirection: "row", alignItems: "center", backgroundColor: "#FF6B35", paddingHorizontal: 8, paddingVertical: 4, borderRadius: 12 },
  timeText: { fontSize: 12, color: "#FFF", fontWeight: "600", marginLeft: 4 },
  orderButton: { padding: 16, alignItems: "center" },
  orderButtonText: { color: "white", fontSize: 16, fontWeight: "600" },
});
