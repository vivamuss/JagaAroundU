// app/deals/pizza.js
import React from "react";
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Image, Alert } from "react-native";
import { useRouter } from "expo-router";
import { Ionicons, MaterialIcons, FontAwesome, MaterialCommunityIcons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { createOrder } from "../../src/services/api";

export default function PizzaDeal() {
  const router = useRouter();

  const handleOrderNow = async () => {
    try {
      const orderData = {
        customerName: "Guest",
        customerEmail: "guest@example.com",
        customerPhone: "0000000000",
        dealId: "pizza-halfprice-1",
        dealTitle: "Half-Price Large Pizzas - 50% Off",
        dealDescription: "Authentic Italian pizzeria offering 50% off all large pizzas. Choose from our specialty pizzas or build your own with premium toppings.",
        originalPrice: 21, // Average price
        discountPrice: 10.5, // Average discounted price
        category: "food",
        specialInstructions: "50% off all large pizzas - carry-out or delivery",
        quantity: 1
      };

      console.log("📦 Sending pizza orderData:", orderData);

      const response = await createOrder(orderData);
      console.log("Pizza order response:", response);

      Alert.alert(
        "✅ Success",
        "Your pizza deal has been added to My Orders!",
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
      console.error("Pizza order error:", err.response?.data || err.message);
      Alert.alert("❌ Error", "Failed to place order. Please try again.");
    }
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Food Deal</Text>
      </View>

      <View style={styles.card}>
        <View style={styles.imageContainer}>
          <Image 
            source={{ uri: "https://images.unsplash.com/photo-1513104890138-7c749659a591?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8cGl6emF8ZW58MHx8MHx8fDA%3D&auto=format&fit=crop&w=800&q=60" }} 
            style={styles.image}
            resizeMode="cover"
          />
          <View style={styles.discountBadge}>
            <Text style={styles.discountText}>50% OFF</Text>
          </View>
        </View>

        <View style={styles.content}>
          <Text style={styles.title}>🍕 Half-Price Large Pizzas</Text>
          
          <View style={styles.infoRow}>
            <Ionicons name="location-sharp" size={18} color="#E52527" />
            <Text style={styles.infoText}>0.5 miles away • 789 Pizza Street</Text>
          </View>
          
          <View style={styles.infoRow}>
            <MaterialIcons name="category" size={18} color="#E52527" />
            <Text style={styles.infoText}>Food & Dining</Text>
          </View>
          
          <View style={styles.infoRow}>
            <MaterialCommunityIcons name="clock-time-three" size={18} color="#E52527" />
            <Text style={styles.infoText}>Valid until 10 PM today</Text>
          </View>
          
          <View style={styles.divider} />
          
          <Text style={styles.description}>
            Authentic Italian pizzeria offering 50% off all large pizzas. 
            Choose from our specialty pizzas or build your own with premium toppings.
          </Text>
          
          <View style={styles.featuresContainer}>
            <Text style={styles.featuresTitle}>Deal Includes:</Text>
            <View style={styles.featureItem}>
              <Ionicons name="checkmark-circle" size={18} color="#4CAF50" />
              <Text style={styles.featureText}>Any large pizza (regular price $18-24)</Text>
            </View>
            <View style={styles.featureItem}>
              <Ionicons name="checkmark-circle" size={18} color="#4CAF50" />
              <Text style={styles.featureText}>All specialty pizzas included</Text>
            </View>
            <View style={styles.featureItem}>
              <Ionicons name="checkmark-circle" size={18} color="#4CAF50" />
              <Text style={styles.featureText}>Carry-out or delivery</Text>
            </View>
            <View style={styles.featureItem}>
              <Ionicons name="checkmark-circle" size={18} color="#4CAF50" />
              <Text style={styles.featureText}>No limit on number of pizzas</Text>
            </View>
          </View>
          
          <View style={styles.priceContainer}>
            <Text style={styles.originalPrice}>$18-24</Text>
            <Text style={styles.discountedPrice}>$9-12</Text>
          </View>
          
          <View style={styles.ratingContainer}>
            <View style={styles.stars}>
              {[1, 2, 3, 4, 4.5].map((star, index) => (
                <FontAwesome 
                  key={index} 
                  name={star % 1 === 0 ? "star" : "star-half-full"} 
                  size={16} 
                  color="#FFD700" 
                />
              ))}
            </View>
            <Text style={styles.ratingText}>4.5 (362 reviews)</Text>
          </View>
          
          <View style={styles.timeInfo}>
            <MaterialCommunityIcons name="clock-fast" size={18} color="#E52527" />
            <Text style={styles.timeText}>Estimated delivery: 25-35 min</Text>
          </View>
          
          <TouchableOpacity onPress={handleOrderNow}>
            <LinearGradient
              colors={['#E52527', '#FF8A8C']}
              style={styles.button}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
            >
              <Ionicons name="restaurant" size={20} color="#fff" style={styles.buttonIcon} />
              <Text style={styles.buttonText}>Order Now</Text>
            </LinearGradient>
          </TouchableOpacity>
          
          <TouchableOpacity onPress={() => router.back()} style={styles.backLink}>
            <Text style={styles.backLinkText}>Back to all deals</Text>
          </TouchableOpacity>
        </View>
      </View>
      
      <View style={styles.footer}>
        <Text style={styles.footerText}>*Delivery fee may apply. Minimum order required for delivery.</Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFF9F5",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    backgroundColor: "#fff",
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  backButton: {
    padding: 4,
    marginRight: 16,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "600",
    color: "#333",
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 12,
    margin: 16,
    overflow: "hidden",
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  imageContainer: {
    position: "relative",
  },
  image: {
    width: "100%",
    height: 220,
  },
  discountBadge: {
    position: "absolute",
    top: 16,
    right: 16,
    backgroundColor: "#E52527",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  discountText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 14,
  },
  content: {
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "700",
    color: "#2d3436",
    marginBottom: 16,
  },
  infoRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  infoText: {
    fontSize: 16,
    color: "#6b6b6b",
    marginLeft: 8,
  },
  divider: {
    height: 1,
    backgroundColor: "#ffe6e6",
    marginVertical: 16,
  },
  description: {
    fontSize: 16,
    lineHeight: 24,
    color: "#4f4f4f",
    marginBottom: 20,
  },
  featuresContainer: {
    marginBottom: 20,
  },
  featuresTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#2d3436",
    marginBottom: 12,
  },
  featureItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  featureText: {
    fontSize: 16,
    color: "#4f4f4f",
    marginLeft: 8,
  },
  priceContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  originalPrice: {
    fontSize: 18,
    color: "#9e9e9e",
    textDecorationLine: "line-through",
    marginRight: 12,
  },
  discountedPrice: {
    fontSize: 28,
    fontWeight: "700",
    color: "#E52527",
  },
  ratingContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  stars: {
    flexDirection: "row",
    marginRight: 8,
  },
  ratingText: {
    fontSize: 14,
    color: "#6b6b6b",
  },
  timeInfo: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
    backgroundColor: "#FFF0F0",
    padding: 10,
    borderRadius: 8,
  },
  timeText: {
    fontSize: 14,
    color: "#E52527",
    marginLeft: 8,
    fontWeight: "500",
  },
  button: {
    borderRadius: 8,
    paddingVertical: 16,
    alignItems: "center",
    marginBottom: 16,
    flexDirection: "row",
    justifyContent: "center",
  },
  buttonIcon: {
    marginRight: 8,
  },
  buttonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "600",
  },
  backLink: {
    alignItems: "center",
  },
  backLinkText: {
    fontSize: 16,
    color: "#E52527",
    fontWeight: "500",
  },
  footer: {
    padding: 16,
    alignItems: "center",
  },
  footerText: {
    fontSize: 14,
    color: "#9e9e9e",
    textAlign: "center",
  },
});