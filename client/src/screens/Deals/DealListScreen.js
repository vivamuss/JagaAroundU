import React, { useEffect, useState, useCallback } from "react";
import { 
  View, 
  Text, 
  FlatList, 
  TouchableOpacity, 
  StyleSheet, 
  SafeAreaView, 
  RefreshControl,
  Image,
  ActivityIndicator,
  Alert
} from "react-native";
import { getDeals, deleteDeal } from "../../services/api";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

export default function DealListScreen() {
  const [deals, setDeals] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const router = useRouter();

  const fetchDeals = useCallback(async () => {
    try {
      setError(null);
      const response = await getDeals();
      setDeals(response.data);
    } catch (err) {
      setError("Failed to load deals. Please try again.");
      console.error(err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchDeals();
  }, [fetchDeals]);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchDeals();
  }, [fetchDeals]);

  const handleDeleteDeal = (dealId, dealTitle) => {
    Alert.alert(
      "Delete Deal",
      `Are you sure you want to delete "${dealTitle}"?`,
      [
        {
          text: "Cancel",
          style: "cancel"
        },
        { 
          text: "Delete", 
          style: "destructive",
          onPress: async () => {
            try {
              await deleteDeal(dealId);
              // Remove the deal from local state
              setDeals(prevDeals => prevDeals.filter(deal => deal._id !== dealId));
              Alert.alert("Success", "Deal deleted successfully");
            } catch (err) {
              Alert.alert("Error", "Failed to delete deal");
            }
          }
        }
      ]
    );
  };

  const renderDealItem = ({ item }) => (
    <TouchableOpacity 
      style={styles.dealCard}
      onPress={() => router.push(`/deals/${item._id}`)}
    >
      <View style={styles.dealImageContainer}>
        {item.image ? (
          <Image source={{ uri: item.image }} style={styles.dealImage} />
        ) : (
          <View style={styles.dealImagePlaceholder}>
            <Ionicons name="pricetag" size={24} color="#6C63FF" />
          </View>
        )}
        <View style={styles.discountBadge}>
          <Text style={styles.discountText}>{item.discount}% OFF</Text>
        </View>
      </View>

      <View style={styles.dealContent}>
        <Text style={styles.dealTitle} numberOfLines={1}>{item.title}</Text>
        <Text style={styles.dealDescription} numberOfLines={2}>{item.description}</Text>
        
        <View style={styles.dealMeta}>
          {item.category && (
            <View style={styles.categoryTag}>
              <Text style={styles.categoryText}>{item.category}</Text>
            </View>
          )}
          
          {item.location && (
            <View style={styles.location}>
              <Ionicons name="location" size={12} color="#666" />
              <Text style={styles.locationText}>{item.location}</Text>
            </View>
          )}
        </View>

        {item.expiryDate && (
          <View style={styles.expiry}>
            <Ionicons name="time" size={12} color="#FF3B30" />
            <Text style={styles.expiryText}>Expires: {new Date(item.expiryDate).toLocaleDateString()}</Text>
          </View>
        )}

        <View style={styles.dealActions}>
          <TouchableOpacity 
            style={styles.actionButton}
            onPress={() => router.push(`/deals/edit/${item._id}`)}
          >
            <Ionicons name="create" size={18} color="#6C63FF" />
            <Text style={styles.actionText}>Edit</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[styles.actionButton, styles.deleteButton]}
            onPress={() => handleDeleteDeal(item._id, item.title)}
          >
            <Ionicons name="trash" size={18} color="#FF3B30" />
            <Text style={[styles.actionText, styles.deleteText]}>Delete</Text>
          </TouchableOpacity>
        </View>
      </View>
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <SafeAreaView style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#6C63FF" />
        <Text style={styles.loadingText}>Loading deals...</Text>
      </SafeAreaView>
    );
  }

  if (error) {
    return (
      <SafeAreaView style={styles.centerContainer}>
        <Ionicons name="alert-circle" size={48} color="#FF3B30" />
        <Text style={styles.errorText}>{error}</Text>
        <TouchableOpacity style={styles.retryButton} onPress={fetchDeals}>
          <Text style={styles.retryButtonText}>Try Again</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>🔥 Hot Deals</Text>
        <TouchableOpacity 
          style={styles.createButton}
          onPress={() => router.push("/deals/create")}
        >
          <Ionicons name="add" size={20} color="white" />
          <Text style={styles.createButtonText}>New Deal</Text>
        </TouchableOpacity>
      </View>

      {deals.length === 0 ? (
        <View style={styles.emptyState}>
          <Ionicons name="pricetags" size={64} color="#E0E0E0" />
          <Text style={styles.emptyStateTitle}>No deals yet</Text>
          <Text style={styles.emptyStateText}>Create your first deal to get started</Text>
          <TouchableOpacity 
            style={styles.emptyStateButton}
            onPress={() => router.push("/deals/create")}
          >
            <Text style={styles.emptyStateButtonText}>Create Deal</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <FlatList
          data={deals}
          keyExtractor={(item) => item._id}
          renderItem={renderDealItem}
          contentContainerStyle={styles.listContent}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              colors={["#6C63FF"]}
              tintColor="#6C63FF"
            />
          }
          showsVerticalScrollIndicator={false}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8F9FA",
  },
  centerContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F8F9FA",
    padding: 20,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: "white",
    borderBottomWidth: 1,
    borderBottomColor: "#F0F0F0",
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#1A1A1A",
  },
  createButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#6C63FF",
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 12,
    shadowColor: "#6C63FF",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 5,
  },
  createButtonText: {
    color: "white",
    fontWeight: "600",
    marginLeft: 6,
  },
  listContent: {
    padding: 16,
  },
  dealCard: {
    backgroundColor: "white",
    borderRadius: 16,
    marginBottom: 16,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  dealImageContainer: {
    position: "relative",
    height: 160,
  },
  dealImage: {
    width: "100%",
    height: "100%",
  },
  dealImagePlaceholder: {
    width: "100%",
    height: "100%",
    backgroundColor: "#F0F0F0",
    justifyContent: "center",
    alignItems: "center",
  },
  discountBadge: {
    position: "absolute",
    top: 12,
    right: 12,
    backgroundColor: "#FF3B30",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  discountText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 12,
  },
  dealContent: {
    padding: 16,
  },
  dealTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#1A1A1A",
    marginBottom: 6,
  },
  dealDescription: {
    fontSize: 14,
    color: "#666",
    marginBottom: 12,
    lineHeight: 20,
  },
  dealMeta: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  categoryTag: {
    backgroundColor: "#F0F0FF",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  categoryText: {
    color: "#6C63FF",
    fontSize: 12,
    fontWeight: "500",
  },
  location: {
    flexDirection: "row",
    alignItems: "center",
  },
  locationText: {
    fontSize: 12,
    color: "#666",
    marginLeft: 4,
  },
  expiry: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  expiryText: {
    fontSize: 12,
    color: "#FF3B30",
    marginLeft: 4,
    fontWeight: "500",
  },
  dealActions: {
    flexDirection: "row",
    justifyContent: "flex-end",
    borderTopWidth: 1,
    borderTopColor: "#F0F0F0",
    paddingTop: 16,
    marginTop: 4,
  },
  actionButton: {
    flexDirection: "row",
    alignItems: "center",
    marginLeft: 16,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    backgroundColor: "#F0F0F0",
  },
  deleteButton: {
    backgroundColor: "#FFF0F0",
  },
  actionText: {
    marginLeft: 4,
    fontSize: 12,
    fontWeight: "500",
    color: "#6C63FF",
  },
  deleteText: {
    color: "#FF3B30",
  },
  emptyState: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 40,
  },
  emptyStateTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#666",
    marginTop: 16,
    marginBottom: 8,
  },
  emptyStateText: {
    fontSize: 14,
    color: "#888",
    textAlign: "center",
    marginBottom: 24,
  },
  emptyStateButton: {
    backgroundColor: "#6C63FF",
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 12,
  },
  emptyStateButtonText: {
    color: "white",
    fontWeight: "600",
  },
  loadingText: {
    marginTop: 12,
    color: "#666",
  },
  errorText: {
    marginTop: 12,
    color: "#FF3B30",
    textAlign: "center",
    marginBottom: 16,
  },
  retryButton: {
    backgroundColor: "#6C63FF",
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  retryButtonText: {
    color: "white",
    fontWeight: "600",
  },
});