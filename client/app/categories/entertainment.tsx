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
  venue: string;
}

export default function EntertainmentPage() {
  const router = useRouter();
  const [savedDeals, setSavedDeals] = useState<number[]>([]);

  const toggleSaveDeal = (dealId: number) => {
    setSavedDeals(prev => 
      prev.includes(dealId) ? prev.filter(id => id !== dealId) : [...prev, dealId]
    );
  };

  const entertainmentDeals: Deal[] = [
    { 
      id: 1, 
      title: "2-for-1 Movie Tickets", 
      description: "Buy one get one free on all movie tickets this weekend at premium theaters", 
      category: "movies",
      venue: "Cineplex Downtown",
      distance: "0.8mi", 
      rating: 4.8, 
      reviews: 342,
      originalPrice: "$24",
      discountPrice: "$12",
      timeLeft: "2 days left",
      icon: "film",
      color: "#6C63FF",
      features: ["Any Movie", "All Showtimes", "3D Included", "Free Popcorn"]
    },
    { 
      id: 2, 
      title: "Live Concert - 30% Off", 
      description: "Special discount on upcoming rock concert featuring popular bands", 
      category: "concerts",
      venue: "Madison Square Garden",
      distance: "1.5mi", 
      rating: 4.9, 
      reviews: 218,
      originalPrice: "$120",
      discountPrice: "$84",
      timeLeft: "5 days left",
      icon: "musical-notes",
      color: "#FF6B6B",
      features: ["VIP Access", "Meet & Greet", "Soundcheck", "Merch Discount"]
    },
    { 
      id: 3, 
      title: "Comedy Night Special", 
      description: "50% off stand-up comedy show tickets featuring top comedians", 
      category: "comedy",
      venue: "Laugh Factory",
      distance: "0.3mi", 
      rating: 4.7, 
      reviews: 156,
      originalPrice: "$40",
      discountPrice: "$20",
      timeLeft: "1 day left",
      icon: "mic",
      color: "#FF9800",
      features: ["Top Comedians", "Intimate Setting", "Drink Specials", "Free Parking"]
    },
    { 
      id: 4, 
      title: "Escape Room Adventure", 
      description: "Group discount for thrilling escape room experience with multiple themes", 
      category: "games",
      venue: "Mystery Rooms",
      distance: "1.2mi", 
      rating: 4.6, 
      reviews: 189,
      originalPrice: "$100",
      discountPrice: "$70",
      timeLeft: "7 days left",
      icon: "escape-room",
      color: "#4CAF50",
      features: ["4-6 Players", "Multiple Themes", "Photo Package", "Leaderboard"]
    },
    { 
      id: 5, 
      title: "Broadway Show Discount", 
      description: "25% off selected Broadway musical tickets with premium seating", 
      category: "theater",
      venue: "Theater District",
      distance: "2.1mi", 
      rating: 4.9, 
      reviews: 427,
      originalPrice: "$150",
      discountPrice: "$112.50",
      timeLeft: "3 days left",
      icon: "theater",
      color: "#9C27B0",
      features: ["Orchestra Seats", "Program Included", "Backstage Tour", "Cast Photo"]
    },
    { 
      id: 6, 
      title: "Bowling Night Deal", 
      description: "Unlimited bowling for 2 hours including shoe rental and food credit", 
      category: "bowling",
      venue: "Strike Zone",
      distance: "0.9mi", 
      rating: 4.5, 
      reviews: 203,
      originalPrice: "$60",
      discountPrice: "$42",
      timeLeft: "14 days left",
      icon: "bowling",
      color: "#2196F3",
      features: ["Shoe Rental", "Food Credit", "Lane Priority", "Group Discount"]
    },
  ];

  const renderIcon = (iconName: string) => {
    switch(iconName) {
      case "film":
        return <Ionicons name="film" size={32} color="white" />;
      case "musical-notes":
        return <Ionicons name="musical-notes" size={32} color="white" />;
      case "mic":
        return <Ionicons name="mic" size={32} color="white" />;
      case "escape-room":
        return <MaterialCommunityIcons name="door" size={32} color="white" />;
      case "theater":
        return <MaterialCommunityIcons name="drama-masks" size={32} color="white" />;
      case "bowling":
        return <FontAwesome5 name="bowling-ball" size={32} color="white" />;
      default:
        return <Ionicons name="happy" size={32} color="white" />;
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
        category: "entertainment",
        specialInstructions: "",
        quantity: 1,
        venue: deal.venue
      };

      console.log("🎭 Sending entertainment orderData:", orderData);

      const response = await createOrder(orderData);
      console.log("Entertainment order response:", response);

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
      console.error("Entertainment order error:", err.response?.data || err.message);
      Alert.alert("❌ Error", "Failed to place order. Please try again.");
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
        <Text style={styles.title}>🎭 Entertainment</Text>
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
            <Text style={styles.promoTitle}>Entertainment Specials</Text>
            <Text style={styles.promoText}>Exclusive deals on movies, concerts, and fun experiences near you</Text>
          </View>
        </View>

        {/* Deals List */}
        {entertainmentDeals.map((deal) => (
          <View key={deal.id} style={styles.dealCard}>
            <View style={[styles.dealIconContainer, { backgroundColor: deal.color }]}>
              {renderIcon(deal.icon)}
            </View>
            
            <View style={styles.dealContent}>
              <View style={styles.dealHeader}>
                <View style={styles.titleContainer}>
                  <Text style={styles.dealTitle}>{deal.title}</Text>
                  <Text style={styles.venueText}>{deal.venue}</Text>
                </View>
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
              <Text style={styles.bookButtonText}>Book Tickets</Text>
            </TouchableOpacity>
          </View>
        ))}
        
        {/* Additional Info */}
        <View style={styles.infoSection}>
          <Text style={styles.infoTitle}>Why Book With Us?</Text>
          <View style={styles.infoItem}>
            <View style={styles.infoIcon}>
              <Ionicons name="ticket" size={20} color="#6C63FF" />
            </View>
            <View style={styles.infoContent}>
              <Text style={styles.infoItemTitle}>Instant Confirmation</Text>
              <Text style={styles.infoItemDesc}>Get your tickets confirmed immediately via email</Text>
            </View>
          </View>
          <View style={styles.infoItem}>
            <View style={styles.infoIcon}>
              <Ionicons name="shield-checkmark" size={20} color="#6C63FF" />
            </View>
            <View style={styles.infoContent}>
              <Text style={styles.infoItemTitle}>Verified Partners</Text>
              <Text style={styles.infoItemDesc}>All venues and events are verified for quality</Text>
            </View>
          </View>
          <View style={styles.infoItem}>
            <View style={styles.infoIcon}>
              <Ionicons name="refresh" size={20} color="#6C63FF" />
            </View>
            <View style={styles.infoContent}>
              <Text style={styles.infoItemTitle}>Easy Rescheduling</Text>
              <Text style={styles.infoItemDesc}>Change your booking up to 24 hours before the event</Text>
            </View>
          </View>
          <View style={styles.infoItem}>
            <View style={styles.infoIcon}>
              <Ionicons name="card" size={20} color="#6C63FF" />
            </View>
            <View style={styles.infoContent}>
              <Text style={styles.infoItemTitle}>Best Price Guarantee</Text>
              <Text style={styles.infoItemDesc}>Found a better price? We'll match it!</Text>
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
  titleContainer: {
    flex: 1,
    marginRight: 8,
  },
  dealTitle: { 
    fontSize: 16, 
    fontWeight: "700",
    color: "#1A1A1A",
    marginBottom: 4,
  },
  venueText: {
    fontSize: 14,
    color: "#666",
    fontWeight: "500",
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
});