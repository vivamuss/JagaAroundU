// app/deals/coffee.js
import React from "react";
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Image, Alert } from "react-native";
import { useRouter } from "expo-router";
import { Ionicons, MaterialIcons, FontAwesome, MaterialCommunityIcons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { createOrder } from "../../src/services/api";

export default function CoffeeDeal() {
  const router = useRouter();

  const handleOrderNow = async () => {
    try {
      const orderData = {
        customerName: "Guest",
        customerEmail: "guest@example.com",
        customerPhone: "0000000000",
        dealId: "coffee-bogo-1",
        dealTitle: "Buy One Get One Free Coffee",
        dealDescription: "Enjoy a free espresso drink when you purchase one at regular price. Choose from lattes, cappuccinos, macchiatos, and more crafted by our expert baristas.",
        originalPrice: 5, // Average price
        discountPrice: 2.5, // Effective price per drink
        category: "coffee",
        specialInstructions: "BOGO Free Offer - Choose from eligible drinks",
        quantity: 1
      };

      console.log("📦 Sending coffee orderData:", orderData);

      const response = await createOrder(orderData);
      console.log("Coffee order response:", response);

      Alert.alert(
        "✅ Success",
        "Your coffee deal has been added to My Orders!",
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
      console.error("Coffee order error:", err.response?.data || err.message);
      Alert.alert("❌ Error", "Failed to place order. Please try again.");
    }
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Coffee Deal</Text>
      </View>

      <View style={styles.card}>
        <View style={styles.imageContainer}>
          <Image 
            source={{ uri: "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8Y29mZmVlfGVufDB8fDB8fHww&auto=format&fit=crop&w=800&q=60" }} 
            style={styles.image}
            resizeMode="cover"
          />
          <View style={styles.dealBadge}>
            <Text style={styles.dealText}>BOGO FREE</Text>
          </View>
        </View>

        <View style={styles.content}>
          <Text style={styles.title}>☕ Buy One Get One Free</Text>
          
          <View style={styles.infoRow}>
            <Ionicons name="location-sharp" size={18} color="#6F4E37" />
            <Text style={styles.infoText}>0.8 miles away • 101 Brew Avenue</Text>
          </View>
          
          <View style={styles.infoRow}>
            <MaterialIcons name="category" size={18} color="#6F4E37" />
            <Text style={styles.infoText}>Beverages & Café</Text>
          </View>
          
          <View style={styles.infoRow}>
            <MaterialCommunityIcons name="clock-outline" size={18} color="#6F4E37" />
            <Text style={styles.infoText}>Valid until 5 PM today</Text>
          </View>
          
          <View style={styles.divider} />
          
          <Text style={styles.description}>
            Enjoy a free espresso drink when you purchase one at regular price. 
            Choose from lattes, cappuccinos, macchiatos, and more crafted by our expert baristas.
          </Text>
          
          <View style={styles.featuresContainer}>
            <Text style={styles.featuresTitle}>Eligible Drinks:</Text>
            <View style={styles.featureItem}>
              <Ionicons name="cafe" size={18} color="#6F4E37" />
              <Text style={styles.featureText}>Lattes (all flavors)</Text>
            </View>
            <View style={styles.featureItem}>
              <Ionicons name="cafe" size={18} color="#6F4E37" />
              <Text style={styles.featureText}>Cappuccinos</Text>
            </View>
            <View style={styles.featureItem}>
              <Ionicons name="cafe" size={18} color="#6F4E37" />
              <Text style={styles.featureText}>Macchiatos</Text>
            </View>
            <View style={styles.featureItem}>
              <Ionicons name="cafe" size={18} color="#6F4E37" />
              <Text style={styles.featureText}>Mochas</Text>
            </View>
            <View style={styles.featureItem}>
              <Ionicons name="cafe" size={18} color="#6F4E37" />
              <Text style={styles.featureText}>Americanos</Text>
            </View>
          </View>
          
          <View style={styles.priceContainer}>
            <Text style={styles.originalPrice}>$4-6 per drink</Text>
            <Text style={styles.effectivePrice}>$2-3 per drink with deal</Text>
          </View>
          
          <View style={styles.ratingContainer}>
            <View style={styles.stars}>
              {[1, 2, 3, 4, 5].map((star) => (
                <FontAwesome 
                  key={star} 
                  name="star" 
                  size={16} 
                  color="#FFD700" 
                />
              ))}
            </View>
            <Text style={styles.ratingText}>4.8 (214 reviews)</Text>
          </View>
          
          <View style={styles.timeInfo}>
            <MaterialCommunityIcons name="clock-check-outline" size={18} color="#6F4E37" />
            <Text style={styles.timeText}>Open now: 6 AM - 8 PM</Text>
          </View>
          
          <TouchableOpacity onPress={handleOrderNow}>
            <LinearGradient
              colors={['#6F4E37', '#93653C']}
              style={styles.button}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
            >
              <Ionicons name="cafe-outline" size={20} color="#fff" style={styles.buttonIcon} />
              <Text style={styles.buttonText}>Redeem Offer</Text>
            </LinearGradient>
          </TouchableOpacity>
          
          <TouchableOpacity onPress={() => router.back()} style={styles.backLink}>
            <Text style={styles.backLinkText}>Back to all deals</Text>
          </TouchableOpacity>
        </View>
      </View>
      
      <View style={styles.footer}>
        <Text style={styles.footerText}>*Present this offer at checkout. Cannot be combined with other promotions.</Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F9F6F2",
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
  dealBadge: {
    position: "absolute",
    top: 16,
    right: 16,
    backgroundColor: "#6F4E37",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  dealText: {
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
    backgroundColor: "#EDE0D4",
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
    marginBottom: 16,
  },
  originalPrice: {
    fontSize: 16,
    color: "#9e9e9e",
    marginBottom: 4,
  },
  effectivePrice: {
    fontSize: 18,
    fontWeight: "700",
    color: "#6F4E37",
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
    backgroundColor: "#F5EBE0",
    padding: 10,
    borderRadius: 8,
  },
  timeText: {
    fontSize: 14,
    color: "#6F4E37",
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
    color: "#6F4E37",
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