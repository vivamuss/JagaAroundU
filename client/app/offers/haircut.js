// app/deals/haircut.js
import React from "react";
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Image, Alert } from "react-native";
import { useRouter } from "expo-router";
import { Ionicons, MaterialIcons, FontAwesome5, Feather } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { createOrder } from "../../src/services/api";

export default function HaircutDeal() {
  const router = useRouter();

  const handleOrderNow = async () => {
    try {
      const orderData = {
        customerName: "Guest",
        customerEmail: "guest@example.com",
        customerPhone: "0000000000",
        dealId: "haircut-premium-1",
        dealTitle: "Premium Haircut Special - $15",
        dealDescription: "Professional haircut service at a special price this week only. Our experienced stylists will give you the perfect look with a consultation, wash, and style included.",
        originalPrice: 45.00,
        discountPrice: 15.00,
        category: "beauty",
        specialInstructions: "Premium haircut service with consultation, wash, and style",
        quantity: 1
      };

      console.log("📦 Sending haircut orderData:", orderData);

      const response = await createOrder(orderData);
      console.log("Haircut order response:", response);

      Alert.alert(
        "✅ Success",
        "Your haircut deal has been added to My Orders!",
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
      console.error("Haircut order error:", err.response?.data || err.message);
      Alert.alert("❌ Error", "Failed to place order. Please try again.");
    }
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Beauty Deal</Text>
      </View>

      <View style={styles.card}>
        <View style={styles.imageContainer}>
          <Image 
            source={{ uri: "https://images.unsplash.com/photo-1560066984-138dadb4c035?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTF8fGhhaXJjdXR8ZW58MHx8MHx8fDA%3D&auto=format&fit=crop&w=800&q=60" }} 
            style={styles.image}
            resizeMode="cover"
          />
          <View style={styles.promoBadge}>
            <Text style={styles.promoText}>WEEK ONLY</Text>
          </View>
        </View>

        <View style={styles.content}>
          <Text style={styles.title}>💇 Premium Haircut Special</Text>
          
          <View style={styles.infoRow}>
            <Ionicons name="location-sharp" size={18} color="#8B7355" />
            <Text style={styles.infoText}>0.3 miles away • 456 Style Avenue</Text>
          </View>
          
          <View style={styles.infoRow}>
            <MaterialIcons name="category" size={18} color="#8B7355" />
            <Text style={styles.infoText}>Beauty & Salon</Text>
          </View>
          
          <View style={styles.infoRow}>
            <FontAwesome5 name="clock" size={16} color="#8B7355" />
            <Text style={styles.infoText}>Limited time offer</Text>
          </View>
          
          <View style={styles.divider} />
          
          <Text style={styles.description}>
            Professional haircut service at a special price this week only. 
            Our experienced stylists will give you the perfect look with a 
            consultation, wash, and style included.
          </Text>
          
          <View style={styles.featuresContainer}>
            <Text style={styles.featuresTitle}>Service Includes:</Text>
            <View style={styles.featureItem}>
              <Feather name="check" size={18} color="#C8A97E" />
              <Text style={styles.featureText}>Professional consultation</Text>
            </View>
            <View style={styles.featureItem}>
              <Feather name="check" size={18} color="#C8A97E" />
              <Text style={styles.featureText}>Hair wash with premium products</Text>
            </View>
            <View style={styles.featureItem}>
              <Feather name="check" size={18} color="#C8A97E" />
              <Text style={styles.featureText}>Precision haircut</Text>
            </View>
            <View style={styles.featureItem}>
              <Feather name="check" size={18} color="#C8A97E" />
              <Text style={styles.featureText}>Blow-dry and style</Text>
            </View>
          </View>
          
          <View style={styles.priceContainer}>
            <Text style={styles.originalPrice}>$45.00</Text>
            <Text style={styles.discountedPrice}>$15.00</Text>
          </View>
          
          <View style={styles.ratingContainer}>
            <View style={styles.stars}>
              {[1, 2, 3, 4, 5].map((star) => (
                <Ionicons key={star} name="star" size={16} color="#FFD700" />
              ))}
            </View>
            <Text style={styles.ratingText}>4.9 (128 reviews)</Text>
          </View>
          
          <TouchableOpacity onPress={handleOrderNow}>
            <LinearGradient
              colors={['#D4AF37', '#C8A97E']}
              style={styles.button}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
            >
              <Text style={styles.buttonText}>Book Appointment</Text>
            </LinearGradient>
          </TouchableOpacity>
          
          <TouchableOpacity onPress={() => router.back()} style={styles.backLink}>
            <Text style={styles.backLinkText}>Back to all deals</Text>
          </TouchableOpacity>
        </View>
      </View>
      
      <View style={styles.footer}>
        <Text style={styles.footerText}>*Advance booking recommended</Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#faf7f5",
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
  promoBadge: {
    position: "absolute",
    top: 16,
    right: 16,
    backgroundColor: "#D4AF37",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  promoText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 12,
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
    color: "#8B7355",
    marginLeft: 8,
  },
  divider: {
    height: 1,
    backgroundColor: "#f0e6d6",
    marginVertical: 16,
  },
  description: {
    fontSize: 16,
    lineHeight: 24,
    color: "#6b6357",
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
    color: "#6b6357",
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
    color: "#D4AF37",
  },
  ratingContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },
  stars: {
    flexDirection: "row",
    marginRight: 8,
  },
  ratingText: {
    fontSize: 14,
    color: "#8B7355",
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
    color: "#C8A97E",
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