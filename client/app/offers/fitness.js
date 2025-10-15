// app/deals/fitness.js
import React from "react";
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Image, Alert } from "react-native";
import { useRouter } from "expo-router";
import { Ionicons, MaterialIcons, FontAwesome5 } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { createOrder } from "../../src/services/api";

export default function FitnessDeal() {
  const router = useRouter();

  const handleOrderNow = async () => {
    try {
      const orderData = {
        customerName: "Guest",
        customerEmail: "guest@example.com",
        customerPhone: "0000000000",
        dealId: "fitness-premium-1",
        dealTitle: "Premium Fitness Membership - 30% Off",
        dealDescription: "Get 30% off on an annual membership at our state-of-the-art fitness center. Includes access to all equipment, group classes, and locker facilities.",
        originalPrice: 599.99,
        discountPrice: 419.99,
        category: "fitness",
        specialInstructions: "Annual membership with access to all facilities and classes",
        quantity: 1
      };

      console.log("📦 Sending fitness orderData:", orderData);

      const response = await createOrder(orderData);
      console.log("Fitness order response:", response);

      Alert.alert(
        "✅ Success",
        "Your fitness membership deal has been added to My Orders!",
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
      console.error("Fitness order error:", err.response?.data || err.message);
      Alert.alert("❌ Error", "Failed to place order. Please try again.");
    }
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Fitness Deal</Text>
      </View>

      <View style={styles.card}>
        <View style={styles.imageContainer}>
          <Image 
            source={{ uri: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8Z3ltJTIwaW50ZXJpb3J8ZW58MHx8MHx8fDA%3D&auto=format&fit=crop&w=800&q=60" }} 
            style={styles.image}
            resizeMode="cover"
          />
          <View style={styles.discountBadge}>
            <Text style={styles.discountText}>30% OFF</Text>
          </View>
        </View>

        <View style={styles.content}>
          <Text style={styles.title}>💪 Premium Fitness Membership</Text>
          
          <View style={styles.infoRow}>
            <Ionicons name="location-sharp" size={18} color="#6b6b6b" />
            <Text style={styles.infoText}>1.2 miles away • 123 Fitness Street</Text>
          </View>
          
          <View style={styles.infoRow}>
            <MaterialIcons name="category" size={18} color="#6b6b6b" />
            <Text style={styles.infoText}>Fitness & Wellness</Text>
          </View>
          
          <View style={styles.infoRow}>
            <FontAwesome5 name="clock" size={16} color="#6b6b6b" />
            <Text style={styles.infoText}>Expires in 7 days</Text>
          </View>
          
          <View style={styles.divider} />
          
          <Text style={styles.description}>
            Get 30% off on an annual membership at our state-of-the-art fitness center. 
            Includes access to all equipment, group classes, and locker facilities.
          </Text>
          
          <View style={styles.featuresContainer}>
            <Text style={styles.featuresTitle}>Membership Includes:</Text>
            <View style={styles.featureItem}>
              <Ionicons name="checkmark-circle" size={18} color="#4CAF50" />
              <Text style={styles.featureText}>Access to all equipment</Text>
            </View>
            <View style={styles.featureItem}>
              <Ionicons name="checkmark-circle" size={18} color="#4CAF50" />
              <Text style={styles.featureText}>Unlimited group classes</Text>
            </View>
            <View style={styles.featureItem}>
              <Ionicons name="checkmark-circle" size={18} color="#4CAF50" />
              <Text style={styles.featureText}>Locker & shower facilities</Text>
            </View>
            <View style={styles.featureItem}>
              <Ionicons name="checkmark-circle" size={18} color="#4CAF50" />
              <Text style={styles.featureText}>Free fitness assessment</Text>
            </View>
          </View>
          
          <View style={styles.priceContainer}>
            <Text style={styles.originalPrice}>$599.99</Text>
            <Text style={styles.discountedPrice}>$419.99/year</Text>
          </View>
          
          <TouchableOpacity onPress={handleOrderNow}>
            <LinearGradient
              colors={['#6a11cb', '#2575fc']}
              style={styles.button}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
            >
              <Text style={styles.buttonText}>Claim This Deal</Text>
            </LinearGradient>
          </TouchableOpacity>
          
          <TouchableOpacity onPress={() => router.back()} style={styles.backLink}>
            <Text style={styles.backLinkText}>Back to all deals</Text>
          </TouchableOpacity>
        </View>
      </View>
      
      <View style={styles.footer}>
        <Text style={styles.footerText}>Terms & Conditions Apply</Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f9fa",
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
    height: 200,
  },
  discountBadge: {
    position: "absolute",
    top: 16,
    right: 16,
    backgroundColor: "#FF5757",
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
    backgroundColor: "#e0e0e0",
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
    marginBottom: 20,
  },
  originalPrice: {
    fontSize: 18,
    color: "#9e9e9e",
    textDecorationLine: "line-through",
    marginRight: 12,
  },
  discountedPrice: {
    fontSize: 22,
    fontWeight: "700",
    color: "#2d3436",
  },
  button: {
    borderRadius: 8,
    paddingVertical: 16,
    alignItems: "center",
    marginBottom: 16,
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
    color: "#6c5ce7",
    fontWeight: "500",
  },
  footer: {
    padding: 16,
    alignItems: "center",
  },
  footerText: {
    fontSize: 14,
    color: "#9e9e9e",
  },
});