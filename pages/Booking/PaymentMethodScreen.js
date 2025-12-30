import React, { useState } from "react";
import {
  SafeAreaView,
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
} from "react-native";
import PrimaryButton from "../../components/ui/PrimaryButton";
import { COLORS, RADIUS, SPACING, TYPOGRAPHY } from "../../constants/theme";

const METHODS = [
  { id: "mastercard", label: "MasterCard", icon: require("../../assets/icon.png") },
  { id: "visa", label: "Visa", icon: require("../../assets/icon.png") },
  { id: "bank", label: "Ngân hàng", icon: require("../../assets/icon.png") },
  { id: "add", label: "Thêm phương thức thanh toán", icon: require("../../assets/icon.png") },
];

export default function PaymentMethodScreen({ navigation }) {
  const [selected, setSelected] = useState("bank");

  const handleConfirm = () => {
    if (selected === "add") {
      navigation.navigate("AddCard");
    } else {
      navigation.goBack();
    }
  };

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.sheet}>
        <View style={styles.handle} />
        <Text style={styles.title}>Phương thức thanh toán</Text>
        {METHODS.map((method) => (
          <TouchableOpacity
            key={method.id}
            style={styles.methodRow}
            onPress={() => setSelected(method.id)}
          >
            <Image source={method.icon} style={styles.icon} />
            <Text style={styles.methodLabel}>{method.label}</Text>
            <View
              style={[
                styles.radio,
                selected === method.id && styles.radioSelected,
              ]}
            />
          </TouchableOpacity>
        ))}
        <PrimaryButton label="Xác nhận" onPress={handleConfirm} />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: "rgba(13,31,51,0.6)",
    justifyContent: "flex-end",
  },
  sheet: {
    backgroundColor: COLORS.surface,
    borderTopLeftRadius: RADIUS.xl,
    borderTopRightRadius: RADIUS.xl,
    padding: SPACING.lg,
  },
  handle: {
    width: 56,
    height: 5,
    borderRadius: 2.5,
    backgroundColor: COLORS.border,
    alignSelf: "center",
    marginBottom: SPACING.md,
  },
  title: {
    fontSize: TYPOGRAPHY.headingS,
    fontWeight: "700",
    marginBottom: SPACING.lg,
    color: COLORS.textDark,
    textAlign: "center",
  },
  methodRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: SPACING.md,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  icon: {
    width: 40,
    height: 24,
    marginRight: SPACING.md,
    borderRadius: 4,
  },
  methodLabel: {
    flex: 1,
    fontSize: TYPOGRAPHY.body,
    color: COLORS.textDark,
  },
  radio: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: COLORS.border,
  },
  radioSelected: {
    borderColor: COLORS.brandBlue,
    backgroundColor: COLORS.brandBlue,
  },
});

