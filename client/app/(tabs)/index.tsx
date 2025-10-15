import React, { useEffect, useRef } from "react";
import { 
  View, 
  Text, 
  TouchableOpacity, 
  StyleSheet, 
  ScrollView, 
  SafeAreaView,
  Animated,
  Easing,
  Dimensions
} from "react-native";
import { useRouter } from "expo-router";
import { Ionicons, FontAwesome5 } from "@expo/vector-icons";
import { LinearGradient } from 'expo-linear-gradient';

const { width, height } = Dimensions.get("window");

// New Color Palette
const COLORS = {
  primary: '#2E8B57',        // Sea Green
  primaryLight: '#3CB371',   // Medium Sea Green
  primaryDark: '#228B22',    // Forest Green
  secondary: '#FF6B35',      // Coral Orange
  accent: '#4169E1',         // Royal Blue
  background: '#F8F9FA',
  text: '#1A1A1A',
  textLight: '#666',
  white: '#FFFFFF',
  card: '#FFFFFF',
};

export default function HomeScreen() {
  const router = useRouter();
  
  // Animation values
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideUpAnim = useRef(new Animated.Value(30)).current;
  const headerSlideAnim = useRef(new Animated.Value(-50)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;
  
  // New background animation values
  const gradientAnim = useRef(new Animated.Value(0)).current;
  const particleAnim = useRef(new Animated.Value(0)).current;
  const waveAnim = useRef(new Animated.Value(0)).current;
  const shimmerAnim = useRef(new Animated.Value(0)).current;

  const deals = [
    { id: 1, title: "50% Off Pizza", description: "Local pizzeria offering half-price large pizzas", distance: "0.5mi", category: "Food", path: "/offers/pizza", color: "#FF9F43", icon: "pizza" },
    { id: 2, title: "Free Coffee", description: "Buy one get one free on all espresso drinks", distance: "0.8mi", category: "Beverages", path: "/offers/coffee", color: "#8B4513", icon: "cafe" },
    { id: 3, title: "Fitness Membership", description: "30% off annual gym membership", distance: "1.2mi", category: "Fitness", path: "/offers/fitness", color: COLORS.secondary, icon: "fitness" },
    { id: 4, title: "Haircut Special", description: "$15 haircuts this week only", distance: "0.3mi", category: "Beauty", path: "/offers/haircut", color: "#FF69B4", icon: "cut" },
  ];

  useEffect(() => {
    // Start animations when component mounts
    Animated.parallel([
      // Fade in animation
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      // Slide up animation
      Animated.timing(slideUpAnim, {
        toValue: 0,
        duration: 800,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
      // Header slide animation
      Animated.timing(headerSlideAnim, {
        toValue: 0,
        duration: 600,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
      // Pulse animation for CTA
      Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, {
            toValue: 1.05,
            duration: 1000,
            useNativeDriver: true,
          }),
          Animated.timing(pulseAnim, {
            toValue: 1,
            duration: 1000,
            useNativeDriver: true,
          }),
        ])
      ),
      // Background gradient animation
      Animated.loop(
        Animated.timing(gradientAnim, {
          toValue: 1,
          duration: 8000,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: false,
        })
      ),
      // Particle animation
      Animated.loop(
        Animated.timing(particleAnim, {
          toValue: 1,
          duration: 6000,
          easing: Easing.linear,
          useNativeDriver: true,
        })
      ),
      // Wave animation
      Animated.loop(
        Animated.timing(waveAnim, {
          toValue: 1,
          duration: 4000,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        })
      ),
      // Shimmer animation
      Animated.loop(
        Animated.sequence([
          Animated.timing(shimmerAnim, {
            toValue: 1,
            duration: 3000,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: true,
          }),
          Animated.timing(shimmerAnim, {
            toValue: 0,
            duration: 3000,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: true,
          }),
        ])
      ),
    ]).start();
  }, []);

  // Animated Gradient Background
  const AnimatedGradientBackground = () => {
    const interpolatedColors = gradientAnim.interpolate({
      inputRange: [0, 0.5, 1],
      outputRange: [
        'rgba(248, 249, 250, 1)',
        'rgba(245, 250, 248, 1)',
        'rgba(248, 249, 250, 1)'
      ]
    });

    return (
      <Animated.View 
        style={[
          StyleSheet.absoluteFill,
          {
            backgroundColor: interpolatedColors,
          }
        ]}
      />
    );
  };

  // Floating Particles Component
  const FloatingParticles = () => {
    const particles = Array.from({ length: 15 }, (_, i) => {
      const translateX = particleAnim.interpolate({
        inputRange: [0, 1],
        outputRange: [0, Math.random() * 100 - 50],
      });
      
      const translateY = particleAnim.interpolate({
        inputRange: [0, 1],
        outputRange: [0, Math.random() * 100 - 50],
      });

      const scale = particleAnim.interpolate({
        inputRange: [0, 0.5, 1],
        outputRange: [1, 1.2, 1],
      });

      const opacity = particleAnim.interpolate({
        inputRange: [0, 0.5, 1],
        outputRange: [0.1, 0.2, 0.1],
      });

      return (
        <Animated.View
          key={i}
          style={{
            position: 'absolute',
            top: Math.random() * height,
            left: Math.random() * width,
            width: Math.random() * 60 + 20,
            height: Math.random() * 60 + 20,
            backgroundColor: i % 3 === 0 ? COLORS.primary : i % 3 === 1 ? COLORS.secondary : COLORS.accent,
            borderRadius: 30,
            opacity,
            transform: [{ translateX }, { translateY }, { scale }],
          }}
        />
      );
    });

    return <>{particles}</>;
  };

  // Wave Pattern Component
  const WavePattern = () => {
    const translateX = waveAnim.interpolate({
      inputRange: [0, 1],
      outputRange: [0, -100],
    });

    return (
      <Animated.View
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: 200,
          transform: [{ translateX }],
          opacity: 0.03,
        }}
      >
        <LinearGradient
          colors={[COLORS.primary, COLORS.secondary, COLORS.accent]}
          style={StyleSheet.absoluteFill}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
        />
        <View style={{ height: 50, backgroundColor: COLORS.primary, marginBottom: 10 }} />
        <View style={{ height: 30, backgroundColor: COLORS.secondary, marginBottom: 10 }} />
        <View style={{ height: 40, backgroundColor: COLORS.accent, marginBottom: 10 }} />
      </Animated.View>
    );
  };

  // Shimmer Effect Component
  const ShimmerEffect = () => {
    const translateX = shimmerAnim.interpolate({
      inputRange: [0, 1],
      outputRange: [-width, width],
    });

    return (
      <Animated.View
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          transform: [{ translateX }],
        }}
      >
        <LinearGradient
          colors={['transparent', 'rgba(255,255,255,0.3)', 'transparent']}
          style={StyleSheet.absoluteFill}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
        />
      </Animated.View>
    );
  };

  // Enhanced Floating Shape with more animations
  const FloatingShape = ({ size, color, top, left, delay, rotation = 0 }) => {
    const floatAnim = useRef(new Animated.Value(0)).current;
    const rotateAnim = useRef(new Animated.Value(0)).current;

    useEffect(() => {
      setTimeout(() => {
        Animated.parallel([
          Animated.loop(
            Animated.sequence([
              Animated.timing(floatAnim, {
                toValue: 1,
                duration: 4000,
                easing: Easing.inOut(Easing.ease),
                useNativeDriver: true,
              }),
              Animated.timing(floatAnim, {
                toValue: 0,
                duration: 4000,
                easing: Easing.inOut(Easing.ease),
                useNativeDriver: true,
              }),
            ])
          ),
          Animated.loop(
            Animated.timing(rotateAnim, {
              toValue: 1,
              duration: 20000,
              easing: Easing.linear,
              useNativeDriver: true,
            })
          ),
        ]).start();
      }, delay);
    }, []);

    const translateY = floatAnim.interpolate({
      inputRange: [0, 1],
      outputRange: [0, -25],
    });

    const rotate = rotateAnim.interpolate({
      inputRange: [0, 1],
      outputRange: ['0deg', `${rotation}deg`],
    });

    const scale = floatAnim.interpolate({
      inputRange: [0, 0.5, 1],
      outputRange: [1, 1.1, 1],
    });

    return (
      <Animated.View
        style={{
          position: 'absolute',
          top,
          left,
          width: size,
          height: size,
          backgroundColor: color,
          borderRadius: size / 2,
          opacity: 0.08,
          transform: [{ translateY }, { rotate }, { scale }],
        }}
      />
    );
  };

  // Bouncing Deal Icons in Background
  const BouncingDealIcons = () => {
    const icons = [
      { icon: 'pizza', color: '#FF9F43', delay: 0 },
      { icon: 'cafe', color: '#8B4513', delay: 1000 },
      { icon: 'fitness', color: COLORS.secondary, delay: 2000 },
      { icon: 'cut', color: '#FF69B4', delay: 3000 },
      { icon: 'cart', color: COLORS.accent, delay: 4000 },
      { icon: 'fast-food', color: '#34C759', delay: 5000 },
    ];

    return icons.map((item, index) => {
      const bounceAnim = useRef(new Animated.Value(0)).current;

      useEffect(() => {
        setTimeout(() => {
          Animated.loop(
            Animated.sequence([
              Animated.timing(bounceAnim, {
                toValue: 1,
                duration: 2000,
                easing: Easing.inOut(Easing.ease),
                useNativeDriver: true,
              }),
              Animated.timing(bounceAnim, {
                toValue: 0,
                duration: 2000,
                easing: Easing.inOut(Easing.ease),
                useNativeDriver: true,
              }),
            ])
          ).start();
        }, item.delay);
      }, []);

      const translateY = bounceAnim.interpolate({
        inputRange: [0, 1],
        outputRange: [0, -20],
      });

      return (
        <Animated.View
          key={index}
          style={{
            position: 'absolute',
            top: Math.random() * height,
            left: Math.random() * width,
            transform: [{ translateY }],
            opacity: 0.1,
          }}
        >
          <Ionicons name={item.icon} size={24} color={item.color} />
        </Animated.View>
      );
    });
  };

  // Animated Category Item Component
  const AnimatedCategoryItem = ({ icon, color, text, onPress, delay }) => {
    const scaleValue = useRef(new Animated.Value(0)).current;
    const itemSlideAnim = useRef(new Animated.Value(50)).current;

    useEffect(() => {
      setTimeout(() => {
        Animated.parallel([
          Animated.spring(scaleValue, {
            toValue: 1,
            tension: 50,
            friction: 5,
            useNativeDriver: true,
          }),
          Animated.spring(itemSlideAnim, {
            toValue: 0,
            tension: 50,
            friction: 5,
            useNativeDriver: true,
          }),
        ]).start();
      }, delay);
    }, []);

    return (
      <TouchableOpacity onPress={onPress}>
        <Animated.View 
          style={[
            styles.categoryItem,
            {
              transform: [
                { scale: scaleValue },
                { translateY: itemSlideAnim }
              ],
            }
          ]}
        >
          <LinearGradient
            colors={[color, `${color}DD`]}
            style={styles.categoryIcon}
          >
            <Ionicons name={icon} size={24} color="white" />
          </LinearGradient>
          <Text style={styles.categoryText}>{text}</Text>
        </Animated.View>
      </TouchableOpacity>
    );
  };

  // Animated Deal Card Component
  const AnimatedDealCard = ({ deal, index }) => {
    const cardAnim = useRef(new Animated.Value(0)).current;
    const cardSlideAnim = useRef(new Animated.Value(100)).current;

    useEffect(() => {
      setTimeout(() => {
        Animated.parallel([
          Animated.timing(cardAnim, {
            toValue: 1,
            duration: 500,
            useNativeDriver: true,
          }),
          Animated.spring(cardSlideAnim, {
            toValue: 0,
            tension: 60,
            friction: 7,
            useNativeDriver: true,
          }),
        ]).start();
      }, index * 200);
    }, []);

    return (
      <Animated.View
        style={[
          styles.dealCard,
          {
            opacity: cardAnim,
            transform: [{ translateX: cardSlideAnim }],
          },
        ]}
      >
        <TouchableOpacity 
          style={styles.dealCardTouchable}
          onPress={() => router.push(deal.path)}
        >
          <LinearGradient
            colors={[deal.color, `${deal.color}DD`]}
            style={styles.dealIconContainer}
          >
            <Ionicons name={deal.icon} size={24} color="white" />
          </LinearGradient>
          <View style={styles.dealContent}>
            <Text style={styles.dealTitle}>{deal.title}</Text>
            <Text style={styles.dealDescription}>{deal.description}</Text>
            <View style={styles.dealMeta}>
              <View style={styles.distanceBadge}>
                <Ionicons name="location" size={12} color="white" />
                <Text style={styles.dealDistance}>{deal.distance}</Text>
              </View>
              <Text style={styles.dealCategory}>{deal.category}</Text>
            </View>
          </View>
          <Ionicons name="chevron-forward" size={20} color="#CCC" />
        </TouchableOpacity>
      </Animated.View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Enhanced Background Animations */}
      <AnimatedGradientBackground />
      <FloatingParticles />
      <WavePattern />
      <ShimmerEffect />
      <BouncingDealIcons />
      
      {/* Enhanced Floating Background Shapes */}
      <FloatingShape size={200} color={COLORS.primary} top={-100} left={-50} delay={0} rotation={45} />
      <FloatingShape size={150} color={COLORS.secondary} top={200} left={width - 100} delay={1000} rotation={-30} />
      <FloatingShape size={120} color={COLORS.accent} top={400} left={50} delay={2000} rotation={60} />
      <FloatingShape size={180} color="#FF9F43" top={height - 200} left={width - 150} delay={3000} rotation={-45} />
      <FloatingShape size={100} color="#34C759" top={height - 300} left={100} delay={4000} rotation={90} />
      
      <ScrollView 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Header */}
        <Animated.View 
          style={[
            styles.headerSection,
            {
              transform: [{ translateY: headerSlideAnim }],
            }
          ]}
        >
          <View style={styles.header}>
            <View>
              <Text style={styles.greeting}>Good morning! 👋</Text>
            </View>
            <TouchableOpacity style={styles.profileButton}>
              <LinearGradient
                colors={[COLORS.primary, COLORS.primaryLight]}
                style={styles.profileGradient}
              >
                <Ionicons name="person" size={20} color="white" />
              </LinearGradient>
            </TouchableOpacity>
          </View>
        </Animated.View>

        {/* Hero Banner */}
        <Animated.View 
          style={[
            styles.heroSection,
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideUpAnim }],
            }
          ]}
        >
          <LinearGradient
            colors={[COLORS.primary, COLORS.primaryLight, COLORS.primaryDark]}
            style={styles.heroBanner}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          >
            <View style={styles.heroContent}>
              <Text style={styles.heroTitle}>Exclusive Deals Await! 🎉</Text>
              <Text style={styles.heroSubtitle}>
                Discover limited-time offers near you
              </Text>
              <Animated.View style={{ transform: [{ scale: pulseAnim }] }}>
                <TouchableOpacity 
                  style={styles.heroButton} 
                  onPress={() => router.push("../(tabs)/offers/explore")}
                >
                  <Text style={styles.heroButtonText}>Explore Now →</Text>
                </TouchableOpacity>
              </Animated.View>
            </View>
          </LinearGradient>
        </Animated.View>

        {/* Categories Section */}
        <Animated.View 
          style={[
            styles.section,
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideUpAnim }],
            }
          ]}
        >
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Popular Categories</Text>
          </View>
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.categoriesScrollContent}
          >
            <AnimatedCategoryItem 
              icon="fast-food" 
              color="#FF9F43" 
              text="Food" 
              onPress={() => router.push("/categories/food")}
              delay={200}
            />
            <AnimatedCategoryItem 
              icon="cart" 
              color={COLORS.accent}
              text="Shopping" 
              onPress={() => router.push("/categories/shopping")}
              delay={300}
            />
            <AnimatedCategoryItem 
              icon="fitness" 
              color={COLORS.secondary}
              text="Fitness" 
              onPress={() => router.push("/categories/fitness")}
              delay={400}
            />
            <AnimatedCategoryItem 
              icon="cut" 
              color="#34C759" 
              text="Beauty" 
              onPress={() => router.push("/categories/beauty")}
              delay={500}
            />
            <AnimatedCategoryItem 
              icon="car-sport" 
              color="#007AFF" 
              text="Services" 
              onPress={() => router.push("/categories/services")}
              delay={600}
            />
            <AnimatedCategoryItem 
              icon="film" 
              color="#9C27B0" 
              text="Entertainment" 
              onPress={() => router.push("/categories/entertainment")}
              delay={600}
            />
          </ScrollView>
        </Animated.View>

        {/* Hot Deals Section */}
        <Animated.View 
          style={[
            styles.section,
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideUpAnim }],
            }
          ]}
        >
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>🔥 Hot Deals Nearby</Text>
            <TouchableOpacity>
              <Text style={styles.seeAllText}>See all</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.dealsContainer}>
            {deals.map((deal, index) => (
              <AnimatedDealCard key={deal.id} deal={deal} index={index} />
            ))}
          </View>
        </Animated.View>

        {/* Action Buttons Section */}
        <Animated.View 
          style={[
            styles.actionSection,
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideUpAnim }],
            }
          ]}
        >
          <Animated.View style={{ transform: [{ scale: pulseAnim }] }}>
            <TouchableOpacity 
              style={styles.primaryButton}
              onPress={() => router.push("/(tabs)/myorders")}
            >
              <LinearGradient
                colors={[COLORS.primary, COLORS.primaryLight]}
                style={styles.buttonGradient}
              >
                <Ionicons name="receipt" size={20} color="white" />
                <Text style={styles.primaryButtonText}>View My Orders</Text>
              </LinearGradient>
            </TouchableOpacity>
          </Animated.View>

          <TouchableOpacity 
            style={styles.secondaryButton}
            onPress={() => router.push("/(tabs)/nearbyoffers")}
          >
            <View style={styles.secondaryButtonContent}>
              <Ionicons name="map" size={20} color={COLORS.primary} />
              <Text style={styles.secondaryButtonText}>Nearby Offers</Text>
            </View>
          </TouchableOpacity>
          <Animated.View style={{ transform: [{ scale: pulseAnim }] }}>
            <TouchableOpacity 
              style={styles.primaryButton}
              onPress={() => router.push("/(tabs)/offerposting")}
            >
              <LinearGradient
                colors={[COLORS.primary, COLORS.primaryLight]}
                style={styles.buttonGradient}
              >
                <Ionicons name="receipt" size={20} color="white" />
                <Text style={styles.primaryButtonText}>Offers Posting</Text>
              </LinearGradient>
            </TouchableOpacity>
          </Animated.View>
        </Animated.View>

        {/* Auth Section */}
        <Animated.View 
          style={[
            styles.authSection,
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideUpAnim }],
            }
          ]}
        >
          <LinearGradient
            colors={['rgba(255,255,255,0.9)', 'rgba(255,255,255,0.7)']}
            style={styles.authContainer}
          >
            <Text style={styles.authTitle}>Unlock More Features! 🔓</Text>
            <Text style={styles.authPrompt}>
              Sign in to save deals, get personalized recommendations, and track your orders
            </Text>
            <View style={styles.authButtons}>
              <TouchableOpacity 
                style={[styles.authButton, styles.loginButton]}
                onPress={() => router.push("/auth/login")}
              >
                <Text style={styles.loginButtonText}>Login</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={[styles.authButton, styles.signupButton]}
                onPress={() => router.push("/auth/signup")}
              >
                <Text style={styles.signupButtonText}>Create Account</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={[styles.authButton, styles.signupButton]}
                onPress={() => router.push("/auth/role")}
              >
                <Text style={styles.signupButtonText}>Choose who you are</Text>
              </TouchableOpacity>
            </View>
          </LinearGradient>
        </Animated.View>

        {/* Bottom Spacing */}
        <View style={styles.bottomSpacing} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: COLORS.background,
    overflow: 'hidden',
  },
  scrollContent: {
    flexGrow: 1,
    paddingBottom: 30,
  },
  headerSection: {
    paddingTop: 10,
    paddingBottom: 10,
  },
  header: {
    flexDirection: "row", 
    justifyContent: "space-between", 
    alignItems: "center",
    paddingHorizontal: 20,
  },
  greeting: { 
    fontSize: 24, 
    fontWeight: "700", 
    color: COLORS.text,
    marginBottom: 4,
  },
  profileButton: { 
    padding: 4,
  },
  profileGradient: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  heroSection: {
    paddingHorizontal: 20,
    marginBottom: 30,
    marginTop: 10,
  },
  heroBanner: {
    borderRadius: 20,
    padding: 24,
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 8,
  },
  heroContent: {},
  heroTitle: { 
    fontSize: 26, 
    fontWeight: "bold", 
    color: "white", 
    marginBottom: 8,
  },
  heroSubtitle: { 
    fontSize: 16, 
    color: "rgba(255, 255, 255, 0.9)", 
    marginBottom: 24,
    lineHeight: 22,
  },
  heroButton: { 
    backgroundColor: "white", 
    borderRadius: 12, 
    paddingVertical: 12,
    paddingHorizontal: 20,
    alignItems: "center",
    alignSelf: 'flex-start',
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  heroButtonText: { 
    color: COLORS.primary, 
    fontWeight: "700", 
    fontSize: 16,
  },
  section: {
    marginBottom: 25,
  },
  sectionHeader: {
    flexDirection: "row", 
    justifyContent: "space-between", 
    alignItems: "center", 
    paddingHorizontal: 20, 
    marginBottom: 15,
  },
  sectionTitle: { 
    fontSize: 20, 
    fontWeight: "bold", 
    color: COLORS.text,
  },
  categoriesScrollContent: {
    paddingHorizontal: 15,
    paddingRight: 25,
  },
  categoryItem: { 
    alignItems: "center", 
    marginRight: 20,
    marginLeft: 5,
  },
  categoryIcon: { 
    width: 70, 
    height: 70, 
    borderRadius: 35, 
    justifyContent: "center", 
    alignItems: "center", 
    marginBottom: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 5,
  },
  categoryText: { 
    fontSize: 14, 
    color: COLORS.textLight, 
    fontWeight: "600",
  },
  seeAllText: { 
    color: COLORS.primary, 
    fontWeight: "600",
    fontSize: 16,
  },
  dealsContainer: {
    paddingHorizontal: 20,
    gap: 12,
  },
  dealCard: {
    backgroundColor: COLORS.card, 
    borderRadius: 16, 
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
    marginBottom: 8,
  },
  dealCardTouchable: {
    flexDirection: "row", 
    padding: 16, 
    alignItems: 'center',
  },
  dealIconContainer: {
    width: 50, 
    height: 50, 
    borderRadius: 12, 
    justifyContent: "center", 
    alignItems: "center", 
    marginRight: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  dealContent: { 
    flex: 1,
  },
  dealTitle: { 
    fontSize: 16, 
    fontWeight: "700", 
    color: COLORS.text, 
    marginBottom: 4,
  },
  dealDescription: { 
    fontSize: 14, 
    color: COLORS.textLight, 
    marginBottom: 8,
    lineHeight: 18,
  },
  dealMeta: { 
    flexDirection: "row",
    alignItems: 'center',
  },
  distanceBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.primary,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    marginRight: 12,
  },
  dealDistance: { 
    fontSize: 12, 
    color: "white", 
    fontWeight: "600",
    marginLeft: 4,
  },
  dealCategory: { 
    fontSize: 12, 
    color: "#888",
    fontWeight: "500",
  },
  actionSection: {
    paddingHorizontal: 20,
    marginBottom: 25,
    gap: 12,
  },
  primaryButton: {
    borderRadius: 12,
    overflow: 'hidden',
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  secondaryButton: {
    borderRadius: 12,
    borderWidth: 2,
    borderColor: COLORS.primary,
    backgroundColor: COLORS.white,
  },
  secondaryButtonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    paddingHorizontal: 20,
    gap: 8,
  },
  buttonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    paddingHorizontal: 20,
    gap: 8,
  },
  primaryButtonText: {
    color: 'white',
    fontWeight: "600", 
    fontSize: 16,
  },
  secondaryButtonText: {
    color: COLORS.primary,
    fontWeight: "600", 
    fontSize: 16,
  },
  authSection: {
    paddingHorizontal: 20,
    marginBottom: 10,
  },
  authContainer: {
    borderRadius: 16,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  authTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: COLORS.text,
    textAlign: 'center',
    marginBottom: 8,
  },
  authPrompt: { 
    fontSize: 14, 
    color: COLORS.textLight, 
    textAlign: "center", 
    marginBottom: 16, 
    lineHeight: 20,
  },
  authButtons: {
    gap: 10,
  },
  authButton: { 
    paddingVertical: 12, 
    borderRadius: 10, 
    alignItems: "center",
  },
  loginButton: { 
    backgroundColor: COLORS.primary,
  },
  signupButton: { 
    backgroundColor: "transparent", 
    borderWidth: 2, 
    borderColor: COLORS.primary,
  },
  loginButtonText: { 
    color: "white", 
    fontWeight: "600", 
    fontSize: 16,
  },
  signupButtonText: { 
    color: COLORS.primary, 
    fontWeight: "600", 
    fontSize: 16,
  },
  bottomSpacing: {
    height: 20,
  },
});