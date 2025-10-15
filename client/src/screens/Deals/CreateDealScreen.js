import React, { useState } from "react";
import { 
  View, 
  TextInput, 
  Text, 
  TouchableOpacity, 
  StyleSheet, 
  SafeAreaView, 
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Alert,
  ActivityIndicator
} from "react-native";
import { createDeal } from "../../services/api";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

export default function CreateDealScreen() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [discount, setDiscount] = useState("");
  const [originalPrice, setOriginalPrice] = useState("");
  const [category, setCategory] = useState("");
  const [expiryDate, setExpiryDate] = useState("");
  const [location, setLocation] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleCreate = async () => {
    // Validation
    if (!title || !description || !discount) {
      Alert.alert("Error", "Please fill in all required fields");
      return;
    }

    if (parseInt(discount) <= 0 || parseInt(discount) > 100) {
      Alert.alert("Error", "Discount must be between 1-100%");
      return;
    }

    setIsLoading(true);
    
    try {
      await createDeal({ 
        title, 
        description, 
        discount: parseInt(discount),
        originalPrice: originalPrice ? parseFloat(originalPrice) : null,
        category,
        expiryDate,
        location
      });
      Alert.alert("Success", "Deal created successfully!");
      router.push("/deals");
    } catch (err) {
      Alert.alert("Error", "Failed to create deal. Please try again.");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const categories = [
    "Food & Dining",
    "Retail & Shopping",
    "Beauty & Spa",
    "Fitness & Wellness",
    "Entertainment",
    "Services",
    "Other"
  ];

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView 
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.keyboardAvoid}
      >
        <ScrollView contentContainerStyle={styles.scrollContent}>
          {/* Header */}
          <View style={styles.header}>
            <TouchableOpacity 
              style={styles.backButton}
              onPress={() => router.back()}
            >
              <Ionicons name="arrow-back" size={24} color="#6C63FF" />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>Create New Deal</Text>
            <View style={{ width: 24 }} /> {/* Spacer for balance */}
          </View>

          {/* Deal Icon */}
          <View style={styles.iconContainer}>
            <View style={styles.icon}>
              <Ionicons name="pricetag" size={40} color="#6C63FF" />
            </View>
          </View>

          <Text style={styles.sectionTitle}>Deal Information</Text>

          {/* Form */}
          <View style={styles.form}>
            <View style={styles.inputContainer}>
              <Ionicons name="pricetag" size={20} color="#666" style={styles.inputIcon} />
              <TextInput
                placeholder="Deal Title *"
                value={title}
                onChangeText={setTitle}
                style={styles.input}
                placeholderTextColor="#999"
              />
            </View>

            <View style={[styles.inputContainer, styles.textAreaContainer]}>
              <Ionicons name="document-text" size={20} color="#666" style={styles.inputIcon} />
              <TextInput
                placeholder="Description *"
                value={description}
                onChangeText={setDescription}
                style={[styles.input, styles.textArea]}
                multiline
                numberOfLines={4}
                placeholderTextColor="#999"
                textAlignVertical="top"
              />
            </View>

            <View style={styles.row}>
              <View style={[styles.inputContainer, styles.halfInput]}>
                <Ionicons name="trending-down" size={20} color="#666" style={styles.inputIcon} />
                <TextInput
                  placeholder="Discount % *"
                  value={discount}
                  onChangeText={setDiscount}
                  keyboardType="numeric"
                  style={styles.input}
                  placeholderTextColor="#999"
                />
              </View>

              <View style={[styles.inputContainer, styles.halfInput]}>
                <Ionicons name="cash" size={20} color="#666" style={styles.inputIcon} />
                <TextInput
                  placeholder="Original Price"
                  value={originalPrice}
                  onChangeText={setOriginalPrice}
                  keyboardType="numeric"
                  style={styles.input}
                  placeholderTextColor="#999"
                />
              </View>
            </View>

            <View style={styles.inputContainer}>
              <Ionicons name="calendar" size={20} color="#666" style={styles.inputIcon} />
              <TextInput
                placeholder="Expiry Date (YYYY-MM-DD)"
                value={expiryDate}
                onChangeText={setExpiryDate}
                style={styles.input}
                placeholderTextColor="#999"
              />
            </View>

            <View style={styles.inputContainer}>
              <Ionicons name="location" size={20} color="#666" style={styles.inputIcon} />
              <TextInput
                placeholder="Location or Address"
                value={location}
                onChangeText={setLocation}
                style={styles.input}
                placeholderTextColor="#999"
              />
            </View>

            <View style={styles.inputContainer}>
              <Ionicons name="grid" size={20} color="#666" style={styles.inputIcon} />
              <TextInput
                placeholder="Category"
                value={category}
                onChangeText={setCategory}
                style={styles.input}
                placeholderTextColor="#999"
              />
            </View>

            {/* Category Suggestions */}
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.categoryChips}>
              {categories.map((cat) => (
                <TouchableOpacity 
                  key={cat} 
                  style={[styles.categoryChip, category === cat && styles.categoryChipActive]}
                  onPress={() => setCategory(cat)}
                >
                  <Text style={[styles.categoryChipText, category === cat && styles.categoryChipTextActive]}>
                    {cat}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>

            <TouchableOpacity 
              style={[styles.createButton, isLoading && styles.createButtonDisabled]}
              onPress={handleCreate}
              disabled={isLoading}
            >
              {isLoading ? (
                <ActivityIndicator color="white" />
              ) : (
                <Text style={styles.createButtonText}>Publish Deal</Text>
              )}
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8F9FA",
  },
  keyboardAvoid: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    padding: 20,
    paddingBottom: 40,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  backButton: {
    padding: 8,
    borderRadius: 20,
    backgroundColor: "#F0F0F0",
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#1A1A1A",
  },
  iconContainer: {
    alignItems: "center",
    marginVertical: 20,
  },
  icon: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "#F0F0FF",
    justifyContent: "center",
    alignItems: "center",
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#1A1A1A",
    marginBottom: 16,
  },
  form: {
    marginBottom: 20,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "white",
    borderRadius: 12,
    marginBottom: 16,
    paddingHorizontal: 16,
    height: 56,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  textAreaContainer: {
    height: 120,
    alignItems: "flex-start",
    paddingTop: 16,
  },
  textArea: {
    height: 90,
  },
  inputIcon: {
    marginRight: 12,
  },
  input: {
    flex: 1,
    height: "100%",
    fontSize: 16,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  halfInput: {
    width: "48%",
  },
  categoryChips: {
    marginBottom: 20,
    flexGrow: 0,
  },
  categoryChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: "#F0F0F0",
    borderRadius: 20,
    marginRight: 10,
  },
  categoryChipActive: {
    backgroundColor: "#6C63FF",
  },
  categoryChipText: {
    color: "#666",
    fontSize: 12,
  },
  categoryChipTextActive: {
    color: "white",
  },
  createButton: {
    backgroundColor: "#6C63FF",
    borderRadius: 12,
    height: 56,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 10,
    shadowColor: "#6C63FF",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 5,
  },
  createButtonDisabled: {
    backgroundColor: "#A5A3FF",
  },
  createButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
  },
});