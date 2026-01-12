import React, { useEffect, useRef } from "react";
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
import { useDispatch, useSelector } from "react-redux";
import { getMessage } from "../../features/Message/messageSlice";
import HeaderBar from "../../components/ui/HeaderBar";
import { COLORS, RADIUS, SPACING, TYPOGRAPHY } from "../../constants/theme";
import { studios } from "../../constants/mockData";

export default function ChatScreen({ route, navigation }) {
  const dispatch = useDispatch();
  const { conversationId, partner } = route.params || {};
  const messages = useSelector((state) => Array.isArray(state.message.messages) ? state.message.messages : []);
  const loading = useSelector((state) => state.message.loading);
  const scrollViewRef = useRef();

  useEffect(() => {
    if (conversationId) {
      dispatch(getMessage(conversationId));
    }
  }, [conversationId, dispatch]);

  useEffect(() => {
    if (scrollViewRef.current && messages.length > 0) {
      scrollViewRef.current.scrollToEnd({ animated: true });
    }
  }, [messages]);

  const studio = studios[0];

  return (
    <SafeAreaView style={styles.safe}>
      {/* ===== WRAPPER ĐỂ HẠ HEADER ===== */}
      <View style={styles.container}>
        {/* HEADER */}
        <HeaderBar
          title="Tin nhắn"
          onBack={() => navigation.goBack?.()}
        />

        {/* SUMMARY */}
        <View style={styles.summary}>
          <Image source={{ uri: studio.image }} style={styles.thumbnail} />

          <View style={{ flex: 1, marginLeft: SPACING.md }}>
            <Text style={styles.title}>{studio.name}</Text>
            <Text style={styles.price}>4.070.000 / 16 tiếng</Text>
          </View>

          <View style={styles.rating}>
            <Text style={styles.ratingText}>4.5</Text>
          </View>
        </View>

        {/* CHAT */}
        <ScrollView
          ref={scrollViewRef}
          style={{ flex: 1 }}
          contentContainerStyle={styles.chatContent}
          onContentSizeChange={() => scrollViewRef.current?.scrollToEnd({ animated: true })}
        >
          {loading ? (
            <Text style={{ textAlign: 'center', marginTop: 40 }}>Đang tải tin nhắn...</Text>
          ) : messages.length === 0 ? (
            <Text style={{ textAlign: 'center', marginTop: 40, color: COLORS.textMuted }}>Chưa có tin nhắn nào</Text>
          ) : (
            messages.map((msg) => {
              const outbound = partner && msg.fromUserId?._id !== partner._id;
              return (
                <View
                  key={msg._id}
                  style={[
                    styles.bubble,
                    outbound ? styles.bubbleRight : styles.bubbleLeft,
                    { flexDirection: 'row', alignItems: 'flex-end', marginBottom: 10 }
                  ]}
                >
                  {!outbound && (
                    <Image
                      source={{ uri: msg.fromUserId?.avatar || undefined }}
                      style={{ width: 32, height: 32, borderRadius: 16, marginRight: 8, backgroundColor: COLORS.border }}
                    />
                  )}
                  <View style={{ flexShrink: 1, minWidth: 120 }}>
                    <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 2 }}>
                      <Text style={{ fontWeight: 'bold', color: outbound ? COLORS.surface : COLORS.brandBlue, fontSize: 13 }}>
                        {msg.fromUserId?.fullName || msg.fromUserId?.username}
                      </Text>
                      {msg.fromUserId?.username && (
                        <Text style={{ color: outbound ? COLORS.surface : COLORS.textMuted, fontSize: 11, marginLeft: 6 }}>
                          @{msg.fromUserId?.username}
                        </Text>
                      )}
                    </View>
                    <Text
                      style={[
                        styles.bubbleText,
                        outbound ? styles.bubbleTextLight : styles.bubbleTextDark,
                        { lineHeight: 20 }
                      ]}
                    >
                      {msg.content}
                    </Text>
                    <Text
                      style={[
                        styles.time,
                        outbound ? styles.timeLight : styles.timeDark,
                        { fontSize: 11 }
                      ]}
                    >
                      {msg.createdAt ? new Date(msg.createdAt).toLocaleTimeString("vi-VN", { hour: '2-digit', minute: '2-digit' }) : ''}
                    </Text>
                  </View>
                  {outbound && (
                    <Image
                      source={{ uri: msg.fromUserId?.avatar || undefined }}
                      style={{ width: 32, height: 32, borderRadius: 16, marginLeft: 8, backgroundColor: COLORS.border }}
                    />
                  )}
                </View>
              );
            })
          )}
        </ScrollView>

        {/* INPUT */}
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
      </View>
    </SafeAreaView>
  );
}

/* =====================
   STYLES
===================== */
const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: COLORS.background,
  },

  /* container để hạ header */
  container: {
    marginTop: 32,
  },

  summary: {
    flexDirection: "row",
    alignItems: "center",
    padding: SPACING.lg,
    backgroundColor: COLORS.surface,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },

  thumbnail: {
    width: 56,
    height: 56,
    borderRadius: RADIUS.md,
  },

  title: {
    fontWeight: "700",
    color: COLORS.textDark,
    marginBottom: 2,
  },

  price: {
    color: COLORS.brandBlue,
    fontWeight: "600",
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
    color: COLORS.textDark,
  },

  chatContent: {
    padding: SPACING.lg,
    paddingBottom: 24,
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
    opacity: 0.85,
  },

  timeDark: {
    color: COLORS.textMuted,
  },

  inputRow: {
    flexDirection: "row",
    padding: SPACING.lg,
    backgroundColor: COLORS.surface,
    alignItems: "center",
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
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
