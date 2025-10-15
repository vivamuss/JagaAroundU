import React, { useState, useEffect } from "react";
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity, 
  RefreshControl,
  ActivityIndicator,
  Alert
} from "react-native";
import { useRouter } from "expo-router";
import { Ionicons, MaterialIcons, FontAwesome5 } from "@expo/vector-icons";
import { createOrder } from "../../src/services/api";

export default function ExploreScreen() {
  const router = useRouter();
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState("All");

  // Simulate data loading
  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1500);
    
    return () => clearTimeout(timer);
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
    }, 2000);
  };

  // Categories for filtering
  const categories = [
    { id: "all", name: "All", icon: "grid" },
    { id: "food", name: "Food & Drink", icon: "restaurant" },
    { id: "retail", name: "Retail", icon: "cart" },
    { id: "services", name: "Services", icon: "construct" },
    { id: "entertainment", name: "Entertainment", icon: "film" },
  ];

  // Deals data with more details
  const deals = [
    { 
      id: 1, 
      title: "Gourmet Pizza - 50% Off", 
      description: "Authentic Italian pizza with premium ingredients", 
      category: "food",
      path: "/tabs/offers/pizza",
      distance: "0.8 mi",
      timeLeft: "5h 23m",
      originalPrice: "$24.99",
      discountPrice: "$12.49",
      rating: 4.7,
      icon: "pizza",
      color: "#FF6B35"
    },
    { 
      id: 2, 
      title: "Premium Coffee - BOGO", 
      description: "Specialty roasted beans from Ethiopia and Colombia", 
      category: "food",
      path: "/tabs/offers/coffee",
      distance: "1.2 mi",
      timeLeft: "12h 45m",
      originalPrice: "$5.99",
      discountPrice: "Buy 1 Get 1",
      rating: 4.8,
      icon: "cafe",
      color: "#6C63FF"
    },
    { 
      id: 3, 
      title: "Elite Fitness - 30% Off", 
      description: "Full access to all facilities and classes", 
      category: "services",
      path: "/tabs/offers/fitness",
      distance: "0.5 mi",
      timeLeft: "2d",
      originalPrice: "$299",
      discountPrice: "$209.30",
      rating: 4.5,
      icon: "fitness",
      color: "#4CAF50"
    },
    { 
      id: 4, 
      title: "Luxury Salon Experience", 
      description: "Professional stylists using premium products", 
      category: "services",
      path: "/tabs/offers/haircut",
      distance: "1.5 mi",
      timeLeft: "3d",
      originalPrice: "$55",
      discountPrice: "$15",
      rating: 4.9,
      icon: "cut",
      color: "#FF6B8B"
    },
    { 
      id: 5, 
      title: "Bookstore - 25% Off Bestsellers", 
      description: "Latest releases and classic literature", 
      category: "retail",
      path: "/tabs/offers/books",
      distance: "2.1 mi",
      timeLeft: "6d",
      originalPrice: "$28",
      discountPrice: "$21",
      rating: 4.6,
      icon: "book",
      color: "#2196F3"
    },
    { 
      id: 6, 
      title: "Cinema Ticket Package", 
      description: "4 tickets with popcorn and drinks included", 
      category: "entertainment",
      path: "/tabs/offers/cinema",
      distance: "3.2 mi",
      timeLeft: "1d",
      originalPrice: "$48",
      discountPrice: "$29.99",
      rating: 4.4,
      icon: "film",
      color: "#9C27B0"
    },
  ];

  const filteredDeals = selectedCategory === "All" 
    ? deals 
    : deals.filter(deal => deal.category === selectedCategory.toLowerCase());

  const renderIcon = (iconName, color) => {
    switch(iconName) {
      case "pizza":
        return <Ionicons name="pizza" size={32} color="white" />;
      case "cafe":
        return <Ionicons name="cafe" size={32} color="white" />;
      case "fitness":
        return <Ionicons name="barbell" size={32} color="white" />;
      case "cut":
        return <Ionicons name="cut" size={32} color="white" />;
      case "book":
        return <Ionicons name="book" size={32} color="white" />;
      case "film":
        return <Ionicons name="film" size={32} color="white" />;
      default:
        return <FontAwesome5 name="smile" size={32} color="white" />;
    }
  };

  const handleQuickOrder = async (deal) => {
    try {
      // Parse prices for different deal types
      let originalPriceValue = 0;
      let discountPriceValue = 0;
      let specialInstructions = "";

      if (deal.discountPrice === "Buy 1 Get 1") {
        // For BOGO deals, calculate effective price
        originalPriceValue = Number(deal.originalPrice.replace(/[^0-9.]/g, ""));
        discountPriceValue = originalPriceValue / 2; // Effective price per item
        specialInstructions = "Buy One Get One Free Offer";
      } else {
        originalPriceValue = Number(deal.originalPrice.replace(/[^0-9.]/g, ""));
        discountPriceValue = Number(deal.discountPrice.replace(/[^0-9.]/g, ""));
      }

      const orderData = {
        customerName: "Guest",
        customerEmail: "guest@example.com",
        customerPhone: "0000000000",
        dealId: deal.id.toString(),
        dealTitle: deal.title,
        dealDescription: deal.description,
        originalPrice: originalPriceValue,
        discountPrice: discountPriceValue,
        category: deal.category,
        specialInstructions: specialInstructions,
        quantity: 1
      };

      console.log("📦 Sending explore orderData:", orderData);

      const response = await createOrder(orderData);
      console.log("Explore order response:", response);

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
    } catch (err) {
      console.error("Explore order error:", err.response?.data || err.message);
      Alert.alert("❌ Error", "Failed to place order. Please try again.");
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#6C63FF" />
        <Text style={styles.loadingText}>Loading exclusive deals...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.pageTitle}>Exclusive Deals Nearby</Text>
        <Text style={styles.subtitle}>Limited-time offers tailored for you</Text>
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
              selectedCategory === category.name && styles.categoryPillActive
            ]}
            onPress={() => setSelectedCategory(category.name)}
          >
            <Ionicons 
              name={category.icon} 
              size={20} 
              color={selectedCategory === category.name ? "#FFFFFF" : "#6C63FF"} 
              style={styles.categoryIcon}
            />
            <Text style={[
              styles.categoryText,
              selectedCategory === category.name && styles.categoryTextActive
            ]}>
              {category.name}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <ScrollView 
        style={styles.scrollView}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {filteredDeals.length === 0 ? (
          <View style={styles.emptyState}>
            <Ionicons name="search-outline" size={64} color="#CCCCCC" />
            <Text style={styles.emptyStateText}>No deals found in this category</Text>
            <Text style={styles.emptyStateSubtext}>Check back later or try another category</Text>
          </View>
        ) : (
          filteredDeals.map((deal) => (
            <View key={deal.id} style={styles.dealCard}>
              <View style={[styles.dealIconContainer, { backgroundColor: deal.color }]}>
                {renderIcon(deal.icon)}
              </View>
              
              <View style={styles.dealContent}>
                <View style={styles.dealHeader}>
                  <Text style={styles.dealTitle}>{deal.title}</Text>
                  <View style={styles.ratingContainer}>
                    <Ionicons name="star" size={14} color="#FFD700" />
                    <Text style={styles.ratingText}>{deal.rating}</Text>
                  </View>
                </View>
                
                <Text style={styles.dealDescription}>{deal.description}</Text>
                
                <View style={styles.dealMeta}>
                  <View style={styles.distance}>
                    <Ionicons name="location-outline" size={14} color="#6C63FF" />
                    <Text style={styles.distanceText}>{deal.distance}</Text>
                  </View>
                  <View style={styles.timeBadge}>
                    <Ionicons name="time-outline" size={12} color="#FFF" />
                    <Text style={styles.timeText}>{deal.timeLeft}</Text>
                  </View>
                </View>
                
                <View style={styles.priceContainer}>
                  <Text style={styles.originalPrice}>{deal.originalPrice}</Text>
                  <Text style={styles.discountPrice}>{deal.discountPrice}</Text>
                </View>

                {/* Quick Order Button */}
                <TouchableOpacity 
                  style={[styles.quickOrderButton, { backgroundColor: deal.color }]}
                  onPress={() => handleQuickOrder(deal)}
                >
                  <Text style={styles.quickOrderText}>Quick Order</Text>
                </TouchableOpacity>
              </View>
            </View>
          ))
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: "#666",
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 24,
    paddingBottom: 16,
    backgroundColor: "#FFFFFF",
  },
  pageTitle: {
    fontSize: 24,
    fontWeight: "700",
    color: "#1A1A1A",
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    color: "#666",
  },
  categoryContainer: {
    backgroundColor: "#FFFFFF",
    borderBottomWidth: 1,
    borderBottomColor: "#F0F0F0",
  },
  categoryContent: {
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  categoryPill: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: "#F5F5F5",
    marginRight: 8,
  },
  categoryPillActive: {
    backgroundColor: "#6C63FF",
  },
  categoryIcon: {
    marginRight: 6,
  },
  categoryText: {
    fontSize: 14,
    color: "#666",
    fontWeight: "500",
  },
  categoryTextActive: {
    color: "#FFFFFF",
  },
  scrollView: {
    flex: 1,
    backgroundColor: "#F8F9FA",
  },
  dealCard: {
    flexDirection: "row",
    backgroundColor: "white",
    borderRadius: 12,
    marginHorizontal: 16,
    marginVertical: 8,
    padding: 12,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 8,
    elevation: 3,
  },
  dealIconContainer: {
    width: 64,
    height: 64,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  dealContent: {
    flex: 1,
    justifyContent: "center",
  },
  dealHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 4,
  },
  dealTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1A1A1A",
    flex: 1,
    marginRight: 8,
  },
  ratingContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  ratingText: {
    fontSize: 14,
    color: "#666",
    marginLeft: 4,
  },
  dealDescription: {
    fontSize: 14,
    color: "#555",
    marginBottom: 8,
    lineHeight: 20,
  },
  dealMeta: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  distance: {
    flexDirection: "row",
    alignItems: "center",
  },
  distanceText: {
    fontSize: 14,
    color: "#666",
    marginLeft: 4,
  },
  timeBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FF6B35",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  timeText: {
    fontSize: 12,
    color: "#FFF",
    fontWeight: "600",
    marginLeft: 4,
  },
  priceContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  originalPrice: {
    fontSize: 14,
    color: "#999",
    textDecorationLine: "line-through",
    marginRight: 8,
  },
  discountPrice: {
    fontSize: 16,
    color: "#6C63FF",
    fontWeight: "700",
  },
  quickOrderButton: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 4,
  },
  quickOrderText: {
    color: "white",
    fontSize: 14,
    fontWeight: "600",
  },
  emptyState: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 60,
    paddingHorizontal: 40,
  },
  emptyStateText: {
    fontSize: 18,
    fontWeight: "600",
    color: "#666",
    marginTop: 16,
    marginBottom: 8,
    textAlign: "center",
  },
  emptyStateSubtext: {
    fontSize: 14,
    color: "#999",
    textAlign: "center",
  },
});