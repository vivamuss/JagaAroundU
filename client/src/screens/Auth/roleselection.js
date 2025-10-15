import React, { useState } from "react";
import { 
  View, 
  Text, 
  TouchableOpacity, 
  StyleSheet, 
  SafeAreaView, 
  ScrollView,
  Alert
} from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from 'expo-linear-gradient';

const COLORS = {
  primary: '#2E8B57',
  primaryLight: '#3CB371',
  secondary: '#FF6B35',
  background: '#F8F9FA',
  text: '#1A1A1A',
  textLight: '#666',
  white: '#FFFFFF',
};

export default function RoleSelectionScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const [selectedRole, setSelectedRole] = useState(params.type || '');

  const handleRoleSelect = (role) => {
    setSelectedRole(role);
  };

  const handleContinue = () => {
    if (!selectedRole) {
      Alert.alert("Error", "Please select a role to continue");
      return;
    }

    if (selectedRole === 'user') {
      router.push(`/auth/signup?role=user`);
    } else {
      router.push(`/auth/signup?role=vendor`);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity 
            style={styles.backButton}
            onPress={() => router.back()}
          >
            <Ionicons name="arrow-back" size={24} color={COLORS.primary} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Choose Your Role</Text>
          <View style={{ width: 24 }} />
        </View>

        {/* Illustration */}
        <View style={styles.iconContainer}>
          <View style={styles.icon}>
            <Ionicons name="person-circle" size={50} color={COLORS.primary} />
          </View>
        </View>

        <Text style={styles.title}>How will you use Hot Deals?</Text>
        <Text style={styles.subtitle}>Select your role to get started</Text>

        {/* Role Selection Cards */}
        <View style={styles.roleCards}>
          <TouchableOpacity 
            style={[
              styles.roleCard,
              selectedRole === 'user' && styles.roleCardSelected
            ]}
            onPress={() => handleRoleSelect('user')}
          >
            <LinearGradient
              colors={selectedRole === 'user' ? [COLORS.primary, COLORS.primaryLight] : ['#F8F9FA', '#F8F9FA']}
              style={styles.roleCardGradient}
            >
              <Ionicons 
                name="people" 
                size={32} 
                color={selectedRole === 'user' ? 'white' : COLORS.primary} 
              />
              <Text style={[
                styles.roleCardTitle,
                selectedRole === 'user' && styles.roleCardTitleSelected
              ]}>
                User
              </Text>
              <Text style={[
                styles.roleCardDescription,
                selectedRole === 'user' && styles.roleCardDescriptionSelected
              ]}>
                I want to find amazing deals and offers near me
              </Text>
              
              {selectedRole === 'user' && (
                <View style={styles.selectedBadge}>
                  <Ionicons name="checkmark-circle" size={20} color="white" />
                </View>
              )}
            </LinearGradient>
          </TouchableOpacity>

          <TouchableOpacity 
            style={[
              styles.roleCard,
              selectedRole === 'vendor' && styles.roleCardSelected
            ]}
            onPress={() => handleRoleSelect('vendor')}
          >
            <LinearGradient
              colors={selectedRole === 'vendor' ? [COLORS.secondary, '#FF8C42'] : ['#F8F9FA', '#F8F9FA']}
              style={styles.roleCardGradient}
            >
              <Ionicons 
                name="business" 
                size={32} 
                color={selectedRole === 'vendor' ? 'white' : COLORS.secondary} 
              />
              <Text style={[
                styles.roleCardTitle,
                selectedRole === 'vendor' && styles.roleCardTitleSelected
              ]}>
                Vendor
              </Text>
              <Text style={[
                styles.roleCardDescription,
                selectedRole === 'vendor' && styles.roleCardDescriptionSelected
              ]}>
                I want to post deals and grow my business
              </Text>
              
              {selectedRole === 'vendor' && (
                <View style={styles.selectedBadge}>
                  <Ionicons name="checkmark-circle" size={20} color="white" />
                </View>
              )}
            </LinearGradient>
          </TouchableOpacity>
        </View>

        {/* Features Comparison */}
        <View style={styles.featuresSection}>
          <Text style={styles.featuresTitle}>What you'll get:</Text>
          
          {selectedRole === 'user' && (
            <View style={styles.featuresList}>
              <View style={styles.featureItem}>
                <Ionicons name="checkmark-circle" size={20} color={COLORS.primary} />
                <Text style={styles.featureText}>Discover exclusive deals near you</Text>
              </View>
              <View style={styles.featureItem}>
                <Ionicons name="checkmark-circle" size={20} color={COLORS.primary} />
                <Text style={styles.featureText}>Save favorite offers</Text>
              </View>
              <View style={styles.featureItem}>
                <Ionicons name="checkmark-circle" size={20} color={COLORS.primary} />
                <Text style={styles.featureText}>Get personalized recommendations</Text>
              </View>
              <View style={styles.featureItem}>
                <Ionicons name="checkmark-circle" size={20} color={COLORS.primary} />
                <Text style={styles.featureText}>Track your orders and savings</Text>
              </View>
            </View>
          )}

          {selectedRole === 'vendor' && (
            <View style={styles.featuresList}>
              <View style={styles.featureItem}>
                <Ionicons name="checkmark-circle" size={20} color={COLORS.secondary} />
                <Text style={styles.featureText}>Post unlimited deals and promotions</Text>
              </View>
              <View style={styles.featureItem}>
                <Ionicons name="checkmark-circle" size={20} color={COLORS.secondary} />
                <Text style={styles.featureText}>Reach local customers</Text>
              </View>
              <View style={styles.featureItem}>
                <Ionicons name="checkmark-circle" size={20} color={COLORS.secondary} />
                <Text style={styles.featureText}>Analytics and insights</Text>
              </View>
              <View style={styles.featureItem}>
                <Ionicons name="checkmark-circle" size={20} color={COLORS.secondary} />
                <Text style={styles.featureText}>Manage business profile</Text>
              </View>
            </View>
          )}
        </View>

        {/* Continue Button */}
        <TouchableOpacity 
          style={[
            styles.continueButton,
            !selectedRole && styles.continueButtonDisabled
          ]}
          onPress={handleContinue}
          disabled={!selectedRole}
        >
          <LinearGradient
            colors={[COLORS.primary, COLORS.primaryLight]}
            style={styles.continueButtonGradient}
          >
            <Text style={styles.continueButtonText}>
              Continue as {selectedRole === 'user' ? 'User' : selectedRole === 'vendor' ? 'Vendor' : '...'}
            </Text>
            <Ionicons name="arrow-forward" size={20} color="white" />
          </LinearGradient>
        </TouchableOpacity>

        {/* Login Redirect */}
        <View style={styles.loginRedirect}>
          <Text style={styles.loginText}>Already have an account? </Text>
          <TouchableOpacity onPress={() => router.push("/auth/login")}>
            <Text style={styles.loginLink}>Sign In</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  scrollContent: {
    flexGrow: 1,
    padding: 20,
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
    fontSize: 18,
    fontWeight: "600",
    color: COLORS.text,
  },
  iconContainer: {
    alignItems: "center",
    marginVertical: 20,
  },
  icon: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: "#F0F0F0",
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: COLORS.text,
    textAlign: "center",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: COLORS.textLight,
    textAlign: "center",
    marginBottom: 30,
  },
  roleCards: {
    gap: 16,
    marginBottom: 30,
  },
  roleCard: {
    borderRadius: 16,
    overflow: 'hidden',
    borderWidth: 2,
    borderColor: 'transparent',
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  roleCardSelected: {
    borderColor: COLORS.primary,
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 6,
  },
  roleCardGradient: {
    padding: 24,
    borderRadius: 14,
  },
  roleCardTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: COLORS.text,
    marginTop: 16,
    marginBottom: 8,
    textAlign: 'center',
  },
  roleCardTitleSelected: {
    color: 'white',
  },
  roleCardDescription: {
    fontSize: 14,
    color: COLORS.textLight,
    textAlign: 'center',
    lineHeight: 20,
  },
  roleCardDescriptionSelected: {
    color: 'rgba(255,255,255,0.9)',
  },
  selectedBadge: {
    position: 'absolute',
    top: 16,
    right: 16,
  },
  featuresSection: {
    marginBottom: 30,
  },
  featuresTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: COLORS.text,
    marginBottom: 16,
    textAlign: 'center',
  },
  featuresList: {
    gap: 12,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  featureText: {
    fontSize: 14,
    color: COLORS.text,
    flex: 1,
  },
  continueButton: {
    borderRadius: 12,
    overflow: 'hidden',
    marginBottom: 20,
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  continueButtonDisabled: {
    opacity: 0.6,
  },
  continueButtonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    paddingHorizontal: 24,
    gap: 8,
  },
  continueButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: "600",
  },
  loginRedirect: {
    flexDirection: "row",
    justifyContent: "center",
  },
  loginText: {
    color: COLORS.textLight,
  },
  loginLink: {
    color: COLORS.primary,
    fontWeight: "600",
  },
});