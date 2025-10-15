import { Platform } from "react-native";
import axios from "axios";

//const LOCAL_IP = "10.18.16.198";

// Detect device type for correct baseURL
const getBaseURL = () => {
  if (Platform.OS === "android") return "http://10.5.185.113:5000/api";
  //if (Platform.OS === "web") return `http://${LOCAL_IP}:5000/api`;
  return "http://10.5.185.113:5000/api"; // iOS / web
};

const API = axios.create({
  baseURL: getBaseURL(),
});

// ----------------- AUTH -----------------
export const registerUser = (data) => API.post("/auth/register", data);
export const loginUser = (data) => API.post("/auth/login", data);

// ----------------- DEALS -----------------
export const createDeal = (data) => API.post("/deals", data);
export const getDeals = () => API.get("/deals");
export const getNearbyDeals = async (lat, lng, radius = 5) => {
  const response = await API.get(`/deals/nearby`, { params: { lat, lng, radius } });
  return response.data;
};

// ----------------- ORDERS -----------------
export const createOrder = (orderData) => API.post("/orders", orderData);
export const getOrdersByCustomer = async (customerEmail) => {
  const response = await API.get(`/orders/customer/${customerEmail}`);
  return response.data;
};
export const getAllOrders = async () => {
  const response = await API.get("/orders");
  return response.data;
};
export const updateOrderStatus = (orderId, statusData) => API.put(`/orders/${orderId}/status`, statusData);
export const getOrderById = async (orderId) => {
  const response = await API.get(`/orders/${orderId}`);
  return response.data;
};
// ----------------- OFFERS -----------------
export const createOffer = (data) => API.post("/offers", data);
export const getNearbyOffers = async (lat, lng, radius = 5) => {
  const response = await API.get("/offers/nearby", { params: { lat, lng, radius } });
  return response.data;
};
