import React from "react";
import {
  SafeAreaView,
  View,
  Text,
  StyleSheet,
  Image,
  ScrollView,
  TouchableOpacity,
  FlatList,
} from "react-native";
import { Feather } from "@expo/vector-icons";
import { COLORS, RADIUS, SPACING, TYPOGRAPHY } from "../../constants/theme";
import { studios, setDesigns, equipments } from "../../constants/mockData";

export default function HomeScreen({ navigation }) {
  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={{ paddingBottom: 120 }}>
        <View style={styles.header}>
          <View style={styles.avatar} />
          <View style={{ flex: 1 }}>
            <Text style={styles.name}>Dat Quang</Text>
            <Text style={styles.location}>TPHCM, Binh Tan</Text>
          </View>
          <TouchableOpacity style={styles.iconButton}>
            <Feather name="search" size={18} color={COLORS.textDark} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.iconButton}>
            <Feather name="bell" size={18} color={COLORS.textDark} />
          </TouchableOpacity>
        </View>
        <TouchableOpacity style={styles.locationCard}>
          <Feather name="map-pin" size={18} color={COLORS.brandBlue} />
          <Text style={styles.locationText}>Bạn có thể thay đổi vị trí của mình</Text>
          <Feather name="chevron-right" size={18} color={COLORS.textMuted} />
        </TouchableOpacity>

        <SectionHeader
          title="Phòng phổ biến"
          actionLabel="Xem tất cả"
          onPress={() => navigation.navigate("Search")}
        />
        <FlatList
          data={studios}
          keyExtractor={(item) => item.id}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ paddingHorizontal: SPACING.lg }}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.horizontalCard}
              onPress={() => navigation.navigate("Detail", { item })}
            >
              <Image source={{ uri: item.image }} style={styles.horizontalImage} />
              <View style={styles.horizontalContent}>
                <Text style={styles.cardTitle}>{item.name}</Text>
                <Text style={styles.cardMeta}>{item.size}</Text>
                <Text style={styles.cardPrice}>{item.price}</Text>
              </View>
            </TouchableOpacity>
          )}
        />

        <SectionHeader
          title="Set Design theo yêu cầu"
          actionLabel="Xem thêm"
          onPress={() => navigation.navigate("SetDesignList")}
        />
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ paddingHorizontal: SPACING.lg }}
        >
          {setDesigns.map((item) => (
            <TouchableOpacity
              key={item.id}
              style={styles.designCard}
              onPress={() => navigation.navigate("SetDesignDetail", { item })}
            >
              <Image source={{ uri: item.image }} style={styles.designImage} />
              <View style={styles.designContent}>
                <Text style={styles.cardTitle}>{item.name}</Text>
                <Text style={styles.cardPrice}>{item.price}</Text>
              </View>
            </TouchableOpacity>
          ))}
        </ScrollView>

        <SectionHeader
          title="Chúng tôi đang ở đây"
          actionLabel="Mở bản đồ"
        />
        <View style={styles.mapCard}>
          <Text style={styles.mapTitle}>S Cộng Studio</Text>
          <Text style={styles.mapSubtitle}>Ngô Văn Sở, Phim trường S cộng</Text>
        </View>

        <SectionHeader
          title="Dụng Cụ"
          actionLabel="Xem thêm"
        />
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ paddingHorizontal: SPACING.lg }}
        >
          {equipments.map((item) => (
            <View key={item.id} style={styles.equipmentCard}>
              <Image source={{ uri: item.image }} style={styles.equipmentImage} />
              <View style={{ flex: 1, marginLeft: SPACING.md }}>
                <Text style={styles.cardTitle}>{item.name}</Text>
                <Text style={styles.cardPrice}>{item.price}</Text>
                <Text style={styles.oldPrice}>{item.oldPrice}</Text>
              </View>
            </View>
          ))}
        </ScrollView>
      </ScrollView>
    </SafeAreaView>
  );
}

const SectionHeader = ({ title, actionLabel, onPress }) => (
  <View style={styles.sectionHeader}>
    <Text style={styles.sectionTitle}>{title}</Text>
    {actionLabel ? (
      <TouchableOpacity onPress={onPress}>
        <Text style={styles.sectionAction}>{actionLabel}</Text>
      </TouchableOpacity>
    ) : null}
  </View>
);

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    padding: SPACING.lg,
  },
  avatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: COLORS.brandBlue,
    marginRight: SPACING.md,
  },
  name: {
    fontSize: TYPOGRAPHY.headingS,
    fontWeight: "700",
    color: COLORS.textDark,
  },
  location: {
    color: COLORS.textMuted,
  },
  iconButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: COLORS.border,
    alignItems: "center",
    justifyContent: "center",
    marginLeft: SPACING.sm,
  },
  locationCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.surface,
    marginHorizontal: SPACING.lg,
    borderRadius: RADIUS.xl,
    padding: SPACING.md,
  },
  locationText: {
    flex: 1,
    marginHorizontal: SPACING.md,
    color: COLORS.textDark,
    fontWeight: "600",
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: SPACING.lg,
    marginTop: SPACING.xl,
    marginBottom: SPACING.md,
  },
  sectionTitle: {
    fontSize: TYPOGRAPHY.headingS,
    fontWeight: "700",
    color: COLORS.textDark,
  },
  sectionAction: {
    color: COLORS.brandBlue,
    fontWeight: "600",
  },
  horizontalCard: {
    width: 220,
    marginRight: SPACING.md,
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.xl,
    overflow: "hidden",
  },
  horizontalImage: {
    width: "100%",
    height: 140,
  },
  horizontalContent: {
    padding: SPACING.md,
  },
  cardTitle: {
    fontWeight: "700",
    color: COLORS.textDark,
    marginBottom: 4,
  },
  cardMeta: {
    color: COLORS.textMuted,
    marginBottom: 4,
  },
  cardPrice: {
    color: COLORS.brandBlue,
    fontWeight: "700",
  },
  designCard: {
    width: 180,
    marginRight: SPACING.md,
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.xl,
    overflow: "hidden",
  },
  designImage: {
    width: "100%",
    height: 160,
  },
  designContent: {
    padding: SPACING.md,
  },
  mapCard: {
    marginHorizontal: SPACING.lg,
    borderRadius: RADIUS.xl,
    backgroundColor: COLORS.surface,
    padding: SPACING.lg,
  },
  mapTitle: {
    fontWeight: "700",
    color: COLORS.textDark,
  },
  mapSubtitle: {
    color: COLORS.textMuted,
  },
  equipmentCard: {
    flexDirection: "row",
    alignItems: "center",
    width: 260,
    padding: SPACING.md,
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.xl,
    marginRight: SPACING.md,
  },
  equipmentImage: {
    width: 72,
    height: 72,
    borderRadius: RADIUS.md,
  },
  oldPrice: {
    textDecorationLine: "line-through",
    color: COLORS.danger,
  },
});

