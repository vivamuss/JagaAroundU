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

export default function ShoppingPage() {
  const router = useRouter();
  const [savedDeals, setSavedDeals] = useState<number[]>([]);
  const [activeCategory, setActiveCategory] = useState("All");

  const toggleSaveDeal = (dealId: number) => {
    setSavedDeals(prev => 
      prev.includes(dealId) ? prev.filter(id => id !== dealId) : [...prev, dealId]
    );
  };

  const categories = [
    { id: "all", name: "All", icon: "grid" },
    { id: "clothing", name: "Clothing", icon: "shirt" },
    { id: "shoes", name: "Shoes", icon: "footsteps" },
    { id: "electronics", name: "Electronics", icon: "phone-portrait" },
    { id: "home", name: "Home", icon: "home" },
  ];

  const shoppingDeals: Deal[] = [
    { 
      id: 1, 
      title: "Buy 1 Get 1 Free T-Shirts", 
      description: "Premium cotton t-shirts from our trendy summer collection", 
      category: "clothing",
      distance: "0.6mi", 
      rating: 4.5, 
      reviews: 128,
      originalPrice: "$29.99",
      discountPrice: "BOGO",
      timeLeft: "3 days left",
      icon: "shirt",
      color: "#FF6B8B",
      features: ["100% Cotton", "Multiple Colors", "All Sizes", "Summer Collection"]
    },
    { 
      id: 2, 
      title: "50% Off All Sneakers", 
      description: "Latest styles from top brands with exclusive discount", 
      category: "shoes",
      distance: "1.3mi", 
      rating: 4.7, 
      reviews: 245,
      originalPrice: "$129.99",
      discountPrice: "$64.99",
      timeLeft: "2 days left",
      icon: "footsteps",
      color: "#6C63FF",
      features: ["All Brands", "All Sizes", "Limited Stock", "In-Store Only"]
    },
    { 
      id: 3, 
      title: "Electronics Clearance", 
      description: "Up to 40% off on headphones, speakers and accessories", 
      category: "electronics",
      distance: "1.8mi", 
      rating: 4.8, 
      reviews: 312,
      originalPrice: "$199.99",
      discountPrice: "$119.99",
      timeLeft: "5 days left",
      icon: "headset",
      color: "#2196F3",
      features: ["Premium Brands", "1-Year Warranty", "Free Setup", "Demo Available"]
    },
    { 
      id: 4, 
      title: "Home Decor Sale", 
      description: "Modern furniture and decor items at 30% discount", 
      category: "home",
      distance: "2.1mi", 
      rating: 4.6, 
      reviews: 187,
      originalPrice: "$299.99",
      discountPrice: "$209.99",
      timeLeft: "7 days left",
      icon: "home",
      color: "#4CAF50",
      features: ["Free Assembly", "Delivery Available", "Eco-Friendly", "30-Day Return"]
    },
  ];

  const filteredDeals = activeCategory === "All" 
    ? shoppingDeals 
    : shoppingDeals.filter(deal => deal.category === activeCategory.toLowerCase());

  const renderIcon = (iconName: string) => {
    switch(iconName) {
      case "shirt":
        return <Ionicons name="shirt" size={32} color="white" />;
      case "footsteps":
        return <Ionicons name="footsteps" size={32} color="white" />;
      case "headset":
        return <Ionicons name="headset" size={32} color="white" />;
      case "home":
        return <Ionicons name="home" size={32} color="white" />;
      default:
        return <Ionicons name="cart" size={32} color="white" />;
    }
  };

  const handleOrderNow = async (deal: Deal) => {
    try {
      // Handle "BOGO" and other non-numeric prices
      let originalPriceValue = 0;
      let discountPriceValue = 0;

      if (deal.originalPrice !== "BOGO") {
        originalPriceValue = Number(deal.originalPrice.replace(/[^0-9.]/g, ""));
      }
      
      if (deal.discountPrice !== "BOGO") {
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
        category: "shopping",
        specialInstructions: deal.discountPrice === "BOGO" ? "Buy One Get One Free Offer" : "",
        quantity: 1
      };

      console.log("📦 Sending shopping orderData:", orderData);

      const response = await createOrder(orderData);
      console.log("Shopping order response:", response);

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
      console.error("Shopping order error:", err.response?.data || err.message);
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
        <Text style={styles.title}>🛍 Shopping & Retail</Text>
        <View style={styles.headerRight} />
      </View>

      <ScrollView 
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
      >
        {/* Promotional Banner */}
        <View style={styles.promoBanner}>
          <View style={styles.promoIcon}>
            <Ionicons name="pricetag" size={32} color="#FF6B8B" />
          </View>
          <View style={styles.promoContent}>
            <Text style={styles.promoTitle}>Shopping Specials</Text>
            <Text style={styles.promoText}>Exclusive deals on fashion, electronics and more</Text>
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
                color={activeCategory === category.name ? "#FFFFFF" : "#FF6B8B"} 
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
              style={[styles.shopButton, { backgroundColor: deal.color }]} 
              onPress={() => handleOrderNow(deal)}
            >
              <Text style={styles.shopButtonText}>Shop Now</Text>
            </TouchableOpacity>
          </View>
        ))}
        
        {/* Additional Info */}
        <View style={styles.infoSection}>
          <Text style={styles.infoTitle}>Shopping Benefits</Text>
          <View style={styles.infoItem}>
            <View style={styles.infoIcon}>
              <Ionicons name="return-up-back" size={20} color="#FF6B8B" />
            </View>
            <View style={styles.infoContent}>
              <Text style={styles.infoItemTitle}>Easy Returns</Text>
              <Text style={styles.infoItemDesc}>30-day return policy on all items</Text>
            </View>
          </View>
          <View style={styles.infoItem}>
            <View style={styles.infoIcon}>
              <Ionicons name="shield-checkmark" size={20} color="#FF6B8B" />
            </View>
            <View style={styles.infoContent}>
              <Text style={styles.infoItemTitle}>Quality Guarantee</Text>
              <Text style={styles.infoItemDesc}>All products are quality checked</Text>
            </View>
          </View>
          <View style={styles.infoItem}>
            <View style={styles.infoIcon}>
              <Ionicons name="car" size={20} color="#FF6B8B" />
            </View>
            <View style={styles.infoContent}>
              <Text style={styles.infoItemTitle}>Free Shipping</Text>
              <Text style={styles.infoItemDesc}>On orders over $50</Text>
            </View>
          </View>
        </View>
      </ScrollView>
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
    backgroundColor: "#FFECF0",
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
    color: "#FF6B8B",
    marginBottom: 4,
  },
  promoText: {
    fontSize: 14,
    color: "#666",
    lineHeight: 20,
  },
  categoryContainer: {
    backgroundColor: "#FFFFFF",
    marginBottom: 8,
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
    backgroundColor: "#FF6B8B",
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
    color: "#FF6B8B",
    fontWeight: "700",
  },
  timeBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FF6B8B",
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
  shopButton: {
    padding: 16,
    alignItems: "center",
  },
  shopButtonText: {
    color: "white",
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
    backgroundColor: "#FFECF0",
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
});