import React from "react";
import {
  SafeAreaView,
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Image,
} from "react-native";
import HeaderBar from "../../components/ui/HeaderBar";
import { COLORS, RADIUS, SPACING, TYPOGRAPHY } from "../../constants/theme";
import { messages, studios } from "../../constants/mockData";

export default function ChatScreen({ navigation }) {
  const studio = studios[0];
  return (
    <SafeAreaView style={styles.safe}>
      <HeaderBar title="Tin nhắn" onBack={() => navigation.goBack?.()} />
      <View style={styles.summary}>
        <Image source={{ uri: studio.image }} style={styles.thumbnail} />
        <View style={{ flex: 1, marginLeft: SPACING.md }}>
          <Text style={styles.title}>{studio.name}</Text>
          <Text style={styles.price}>4.070.000/16 tiếng</Text>
        </View>
        <View style={styles.rating}>
          <Text style={styles.ratingText}>4.5</Text>
        </View>
      </View>
      <ScrollView
        contentContainerStyle={{ padding: SPACING.lg }}
        style={{ flex: 1 }}
      >
        {messages.map((msg) => {
          const outbound = msg.outbound;
          return (
            <View
              key={msg.id}
              style={[styles.bubble, outbound ? styles.bubbleRight : styles.bubbleLeft]}
            >
              <Text
                style={[
                  styles.bubbleText,
                  outbound ? styles.bubbleTextLight : styles.bubbleTextDark,
                ]}
              >
                {msg.text}
              </Text>
              <Text
                style={[
                  styles.time,
                  outbound ? styles.timeLight : styles.timeDark,
                ]}
              >
                {msg.time}
              </Text>
            </View>
          );
        })}
      </ScrollView>
      <View style={styles.inputRow}>
        <TextInput
          placeholder="Trả lời..."
          placeholderTextColor={COLORS.textMuted}
          style={styles.input}
        />
        <TouchableOpacity style={styles.sendButton}>
          <Text style={styles.sendIcon}>➤</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  summary: {
    flexDirection: "row",
    alignItems: "center",
    padding: SPACING.lg,
    backgroundColor: COLORS.surface,
  },
  thumbnail: {
    width: 56,
    height: 56,
    borderRadius: RADIUS.md,
  },
  title: {
    fontWeight: "700",
    color: COLORS.textDark,
  },
  price: {
    color: COLORS.brandBlue,
  },
  rating: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.background,
    alignItems: "center",
    justifyContent: "center",
  },
  ratingText: {
    fontWeight: "700",
  },
  bubble: {
    padding: SPACING.md,
    borderRadius: RADIUS.lg,
    marginBottom: SPACING.md,
    maxWidth: "80%",
  },
  bubbleLeft: {
    backgroundColor: COLORS.surface,
    alignSelf: "flex-start",
  },
  bubbleRight: {
    backgroundColor: COLORS.brandBlue,
    alignSelf: "flex-end",
  },
  bubbleText: {
    fontSize: TYPOGRAPHY.body,
  },
  bubbleTextLight: {
    color: COLORS.surface,
  },
  bubbleTextDark: {
    color: COLORS.textDark,
  },
  time: {
    fontSize: TYPOGRAPHY.caption,
    marginTop: 6,
    textAlign: "right",
  },
  timeLight: {
    color: COLORS.surface,
  },
  timeDark: {
    color: COLORS.textMuted,
  },
  inputRow: {
    flexDirection: "row",
    padding: SPACING.lg,
    backgroundColor: COLORS.surface,
    alignItems: "center",
  },
  input: {
    flex: 1,
    backgroundColor: COLORS.background,
    borderRadius: RADIUS.lg,
    paddingHorizontal: SPACING.lg,
    height: 48,
    marginRight: SPACING.md,
  },
  sendButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: COLORS.brandBlue,
    alignItems: "center",
    justifyContent: "center",
  },
  sendIcon: {
    color: COLORS.surface,
    fontSize: 18,
  },
});

