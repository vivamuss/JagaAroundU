import React, { useEffect, useState } from "react";
import { 
  View, 
  Text, 
  StyleSheet, 
  FlatList, 
  SafeAreaView, 
  StatusBar, 
  ActivityIndicator,
  TouchableOpacity,
  RefreshControl
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { getOrdersByCustomer } from "./../../src/services/api.js";

interface Order {
  _id: string;
  dealTitle: string;
  dealDescription: string;
  discountPrice: number;
  originalPrice?: number;
  quantity: number;
  status: string;
  createdAt: string;
  category?: string;
}

export default function MyOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  // ⚠️ Replace with actual logged-in user's email (for now hardcoded)
  const customerEmail = "guest@example.com";

  const fetchOrders = async () => {
    try {
      const data = await getOrdersByCustomer(customerEmail);
      setOrders(data);
    } catch (err) {
      console.error("Error fetching orders:", err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    fetchOrders();
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'completed':
        return '#4CAF50';
      case 'confirmed':
        return '#2196F3';
      case 'pending':
        return '#FF9800';
      case 'cancelled':
        return '#F44336';
      default:
        return '#666';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status.toLowerCase()) {
      case 'completed':
        return 'checkmark-circle';
      case 'confirmed':
        return 'checkmark-done-circle';
      case 'pending':
        return 'time';
      case 'cancelled':
        return 'close-circle';
      default:
        return 'help-circle';
    }
  };

  const getCategoryIcon = (category?: string) => {
    switch (category?.toLowerCase()) {
      case 'food':
        return 'restaurant';
      case 'beauty':
        return 'cut';
      case 'fitness':
        return 'fitness';
      case 'coffee':
        return 'cafe';
      case 'services':
        return 'construct';
      case 'shopping':
        return 'cart';
      default:
        return 'gift';
    }
  };

  const getCategoryColor = (category?: string) => {
    switch (category?.toLowerCase()) {
      case 'food':
        return '#FF6B35';
      case 'beauty':
        return '#FF6B8B';
      case 'fitness':
        return '#4CAF50';
      case 'coffee':
        return '#6F4E37';
      case 'services':
        return '#2196F3';
      case 'shopping':
        return '#6C63FF';
      default:
        return '#9C27B0';
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return {
      date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      time: date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
      full: date.toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      })
    };
  };

  const OrderCard = ({ item }: { item: Order }) => {
    const dateInfo = formatDate(item.createdAt);
    const statusColor = getStatusColor(item.status);
    const statusIcon = getStatusIcon(item.status);
    const categoryIcon = getCategoryIcon(item.category);
    const categoryColor = getCategoryColor(item.category);

    return (
      <View style={styles.orderCard}>
        {/* Header */}
        <View style={styles.cardHeader}>
          <View style={styles.categoryIconContainer}>
            <Ionicons name={categoryIcon} size={20} color="#FFF" />
          </View>
          <View style={styles.headerText}>
            <Text style={styles.orderTitle} numberOfLines={1}>{item.dealTitle}</Text>
            <Text style={styles.orderDate}>{dateInfo.full}</Text>
          </View>
          {/* <View style={[styles.statusBadge, { backgroundColor: `${statusColor}15` }]}>
            <Ionicons name={statusIcon} size={14} color={statusColor} />
            <Text style={[styles.statusText, { color: statusColor }]}>
              {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
            </Text>
          </View> */}
        </View>

        {/* Description */}
        <Text style={styles.orderDesc} numberOfLines={2}>{item.dealDescription}</Text>

        {/* Price and Quantity */}
        <View style={styles.priceRow}>
          <View style={styles.priceContainer}>
            <Text style={styles.discountPrice}>${item.discountPrice * item.quantity}</Text>
            {item.quantity > 1 && (
              <Text style={styles.quantityText}>
                (${item.discountPrice} × {item.quantity})
              </Text>
            )}
          </View>
          {item.originalPrice && (
            <Text style={styles.originalPrice}>
              ${item.originalPrice * item.quantity}
            </Text>
          )}
        </View>

        {/* Footer */}
        <View style={styles.cardFooter}>
          <View style={styles.orderId}>
            <Ionicons name="receipt" size={14} color="#999" />
            <Text style={styles.orderIdText}>
              Order #{item._id.slice(-8).toUpperCase()}
            </Text>
          </View>
          {/* <TouchableOpacity style={styles.detailsButton}>
            <Text style={styles.detailsButtonText}>View Details</Text>
            <Ionicons name="chevron-forward" size={16} color="#6C63FF" />
          </TouchableOpacity> */}
        </View>
      </View>
    );
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="dark-content" />
        <View style={styles.header}>
          <Text style={styles.title}>📦 My Orders</Text>
        </View>
        <View style={styles.center}>
          <ActivityIndicator size="large" color="#6C63FF" />
          <Text style={styles.loadingText}>Loading your orders...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>📦 My Orders</Text>
        <Text style={styles.subtitle}>
          {orders.length} order{orders.length !== 1 ? 's' : ''} placed
        </Text>
      </View>

      {orders.length === 0 ? (
        <View style={styles.emptyState}>
          <Ionicons name="cart-outline" size={80} color="#E0E0E0" />
          <Text style={styles.emptyTitle}>No orders yet</Text>
          <Text style={styles.emptySubtitle}>
            When you place orders, they will appear here
          </Text>
          <TouchableOpacity style={styles.shopButton}>
            <Text style={styles.shopButtonText}>Start Shopping</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <FlatList
          data={orders}
          keyExtractor={(item) => item._id}
          renderItem={({ item }) => <OrderCard item={item} />}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              colors={['#6C63FF']}
              tintColor="#6C63FF"
            />
          }
          contentContainerStyle={styles.listContent}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: "#F8F9FA" 
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 8,
    backgroundColor: "#FFF",
    borderBottomWidth: 1,
    borderBottomColor: "#F0F0F0",
  },
  title: { 
    fontSize: 28, 
    fontWeight: "700", 
    color: "#1A1A1A",
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    color: "#666",
    fontWeight: "500",
  },
  listContent: {
    padding: 16,
  },
  orderCard: {
    backgroundColor: "#FFF",
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
    borderWidth: 1,
    borderColor: "#F0F0F0",
  },
  cardHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  categoryIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: "#6C63FF",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  headerText: {
    flex: 1,
  },
  orderTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1A1A1A",
    marginBottom: 2,
  },
  orderDate: {
    fontSize: 12,
    color: "#999",
  },
  statusBadge: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    fontSize: 12,
    fontWeight: "600",
    marginLeft: 4,
  },
  orderDesc: {
    fontSize: 14,
    color: "#666",
    lineHeight: 20,
    marginBottom: 12,
  },
  priceRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  priceContainer: {
    flexDirection: "row",
    alignItems: "baseline",
  },
  discountPrice: {
    fontSize: 20,
    fontWeight: "700",
    color: "#1A1A1A",
    marginRight: 8,
  },
  quantityText: {
    fontSize: 14,
    color: "#666",
  },
  originalPrice: {
    fontSize: 16,
    color: "#999",
    textDecorationLine: "line-through",
  },
  cardFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: "#F0F0F0",
  },
  orderId: {
    flexDirection: "row",
    alignItems: "center",
  },
  orderIdText: {
    fontSize: 12,
    color: "#999",
    marginLeft: 4,
  },
  detailsButton: {
    flexDirection: "row",
    alignItems: "center",
  },
  detailsButtonText: {
    fontSize: 14,
    color: "#6C63FF",
    fontWeight: "600",
    marginRight: 4,
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: "#666",
    fontWeight: "500",
  },
  emptyState: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 40,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: "600",
    color: "#666",
    marginTop: 16,
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 16,
    color: "#999",
    textAlign: "center",
    lineHeight: 24,
    marginBottom: 24,
  },
  shopButton: {
    backgroundColor: "#6C63FF",
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  shopButtonText: {
    color: "#FFF",
    fontSize: 16,
    fontWeight: "600",
  },
});