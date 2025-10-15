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
import { Ionicons, MaterialCommunityIcons, FontAwesome5 } from "@expo/vector-icons";
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

export default function FitnessPage() {
  const router = useRouter();
  const [savedDeals, setSavedDeals] = useState<number[]>([]);

  const toggleSaveDeal = (dealId: number) => {
    setSavedDeals(prev => 
      prev.includes(dealId) ? prev.filter(id => id !== dealId) : [...prev, dealId]
    );
  };

  const fitnessDeals: Deal[] = [
    { 
      id: 1, 
      title: "Premium Gym Membership", 
      description: "30% off annual plan with access to all facilities and classes", 
      category: "gym",
      distance: "1.2mi", 
      rating: 4.7, 
      reviews: 245,
      originalPrice: "$599",
      discountPrice: "$419.30",
      timeLeft: "5 days left",
      icon: "fitness-center",
      color: "#4CAF50",
      features: ["All Facilities", "Group Classes", "Personal Trainer Discount", "Pool Access"]
    },
    { 
      id: 2, 
      title: "Yoga Studio Introductory Offer", 
      description: "First class free for new members with experienced instructors", 
      category: "yoga",
      distance: "0.7mi", 
      rating: 4.9, 
      reviews: 183,
      originalPrice: "$25",
      discountPrice: "Free",
      timeLeft: "3 days left",
      icon: "yoga",
      color: "#6C63FF",
      features: ["Beginner Friendly", "All Levels", "Mat Included", "Small Classes"]
    },
    { 
      id: 3, 
      title: "Personal Training Package", 
      description: "Get 5 sessions for the price of 3 with certified trainers", 
      category: "training",
      distance: "0.9mi", 
      rating: 4.8, 
      reviews: 127,
      originalPrice: "$375",
      discountPrice: "$225",
      timeLeft: "2 days left",
      icon: "dumbbell",
      color: "#FF9800",
      features: ["Custom Programs", "Nutrition Guidance", "Flexible Scheduling", "Progress Tracking"]
    },
    { 
      id: 4, 
      title: "CrossFit Foundation Course", 
      description: "Learn proper techniques with 2 weeks unlimited classes", 
      category: "crossfit",
      distance: "1.5mi", 
      rating: 4.6, 
      reviews: 94,
      originalPrice: "$120",
      discountPrice: "$79",
      timeLeft: "7 days left",
      icon: "weight-lifter",
      color: "#F44336",
      features: ["Beginner Program", "Skill Development", "Community Support", "Coaching Included"]
    },
  ];

  const renderIcon = (iconName: string) => {
    switch(iconName) {
      case "fitness-center":
        return <Ionicons name="fitness" size={32} color="white" />;
      case "yoga":
        return <FontAwesome5 name="yin-yang" size={32} color="white" />;
      case "dumbbell":
        return <Ionicons name="barbell" size={32} color="white" />;
      case "weight-lifter":
        return <MaterialCommunityIcons name="weight-lifter" size={32} color="white" />;
      default:
        return <Ionicons name="fitness" size={32} color="white" />;
    }
  };

  const handleOrderNow = async (deal: Deal) => {
    try {
      // Handle "Free" price case
      const originalPriceValue = deal.originalPrice === "Free" ? 0 : Number(deal.originalPrice.replace(/[^0-9.]/g, ""));
      const discountPriceValue = deal.discountPrice === "Free" ? 0 : Number(deal.discountPrice.replace(/[^0-9.]/g, ""));

      const orderData = {
        customerName: "Guest",
        customerEmail: "guest@example.com",
        customerPhone: "0000000000",
        dealId: deal.id.toString(),
        dealTitle: deal.title,
        dealDescription: deal.description,
        originalPrice: originalPriceValue,
        discountPrice: discountPriceValue,
        category: "fitness",
        specialInstructions: "",
        quantity: 1
      };

      console.log("📦 Sending fitness orderData:", orderData);

      const response = await createOrder(orderData);
      console.log("Fitness order response:", response);

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
      console.error("Fitness order error:", err.response?.data || err.message);
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
        <Text style={styles.title}>💪 Fitness & Wellness</Text>
        <View style={styles.headerRight} />
      </View>

      <ScrollView 
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
      >
        {/* Promotional Banner */}
        <View style={styles.promoBanner}>
          <View style={styles.promoIcon}>
            <Ionicons name="flash" size={32} color="#4CAF50" />
          </View>
          <View style={styles.promoContent}>
            <Text style={styles.promoTitle}>Fitness Specials</Text>
            <Text style={styles.promoText}>Exclusive deals on premium fitness services near you</Text>
          </View>
        </View>

        {/* Deals List */}
        {fitnessDeals.map((deal) => (
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
            
            <TouchableOpacity 
              style={[styles.bookButton, { backgroundColor: deal.color }]} 
              onPress={() => handleOrderNow(deal)}
            >
              <Text style={styles.bookButtonText}>Claim Offer</Text>
            </TouchableOpacity>
          </View>
        ))}
        
        {/* Additional Info */}
        <View style={styles.infoSection}>
          <Text style={styles.infoTitle}>Why Choose These Offers?</Text>
          <View style={styles.infoItem}>
            <View style={styles.infoIcon}>
              <Ionicons name="checkmark-circle" size={20} color="#4CAF50" />
            </View>
            <View style={styles.infoContent}>
              <Text style={styles.infoItemTitle}>Verified Quality</Text>
              <Text style={styles.infoItemDesc}>All partners are vetted for quality and customer satisfaction</Text>
            </View>
          </View>
          <View style={styles.infoItem}>
            <View style={styles.infoIcon}>
              <Ionicons name="lock-closed" size={20} color="#4CAF50" />
            </View>
            <View style={styles.infoContent}>
              <Text style={styles.infoItemTitle}>Secure Booking</Text>
              <Text style={styles.infoItemDesc}>Your reservation is confirmed and protected</Text>
            </View>
          </View>
          <View style={styles.infoItem}>
            <View style={styles.infoIcon}>
              <Ionicons name="arrow-undo" size={20} color="#4CAF50" />
            </View>
            <View style={styles.infoContent}>
              <Text style={styles.infoItemTitle}>Flexible Cancellation</Text>
              <Text style={styles.infoItemDesc}>Change or cancel up to 24 hours in advance</Text>
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
    backgroundColor: "#E8F5E9",
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
    color: "#4CAF50",
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
    color: "#4CAF50",
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
  bookButton: {
    padding: 16,
    alignItems: "center",
  },
  bookButtonText: {
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
    backgroundColor: "#E8F5E9",
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