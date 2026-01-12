import React, { useEffect } from "react";
import {
  SafeAreaView,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
  Image,
} from "react-native";
import { useDispatch, useSelector } from "react-redux";
import HeaderBar from "../../components/ui/HeaderBar";
import { getConversation } from "../../features/Message/messageSlice";
import { COLORS, RADIUS, SPACING, TYPOGRAPHY } from "../../constants/theme";

export default function MessageListScreen({ navigation }) {
  const dispatch = useDispatch();

  const { token, user } = useSelector((state) => state.auth);
  const { conversations, loading } = useSelector(
    (state) => state.message
  );

  /* =====================
     FETCH CONVERSATIONS
  ===================== */
  useEffect(() => {
    if (token) {
      dispatch(getConversation());
    }
  }, [token, dispatch]);

  useEffect(() => {
    if (conversations && conversations.length > 0) {
      // Lấy conversationId đầu tiên và partner đầu tiên nếu chưa có
      const first = conversations[0];
      if (first && first._id) {
        navigation.navigate("Chat", {
          conversationId: first._id,
          partner: getPartnerUser(first.lastMessage),
        });
      }
    }
  }, [conversations]);

  /* =====================
     NOT LOGIN UI
  ===================== */
  if (!token) {
    return (
      <SafeAreaView style={styles.safe}>
        <View style={styles.emptyWrap}>
          <View style={styles.emptyImg}>
            <Text style={styles.emptyIcon}>?</Text>
          </View>
          <Text style={styles.emptyTitle}>Bạn chưa đăng nhập</Text>
          <Text style={styles.emptyDesc}>
            Vui lòng đăng nhập để xem tin nhắn của bạn.
          </Text>
          <TouchableOpacity
            style={styles.loginBtn}
            onPress={() => navigation.navigate("SignIn")}
          >
            <Text style={styles.loginBtnText}>Đăng nhập</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  /* =====================
     HELPER: GET PARTNER
  ===================== */
  const getPartnerUser = (lastMessage) => {
    if (!lastMessage || !user?._id) return null;

    return lastMessage.fromUserId._id === user._id
      ? lastMessage.toUserId
      : lastMessage.fromUserId;
  };

  /* =====================
     RENDER ITEM
  ===================== */
  const renderItem = ({ item }) => {
    const lastMessage = item.lastMessage;
    const partner = getPartnerUser(lastMessage);

    return (
      <TouchableOpacity
        style={styles.card}
        onPress={() =>
          navigation.navigate("Chat", {
            conversationId: item._id,
            partner,
          })
        }
      >
        {/* Avatar */}
        <Image
          source={{
            uri:
              partner?.avatar ||
              "https://ui-avatars.com/api/?name=User&background=0D8ABC&color=fff",
          }}
          style={styles.avatar}
        />

        {/* Content */}
        <View style={{ flex: 1 }}>
          <View style={styles.rowBetween}>
            <Text style={styles.title} numberOfLines={1}>
              {partner?.fullName || "Conversation"}
            </Text>
            <Text style={styles.time}>
              {lastMessage?.createdAt
                ? new Date(lastMessage.createdAt).toLocaleTimeString(
                    "vi-VN",
                    { hour: "2-digit", minute: "2-digit" }
                  )
                : ""}
            </Text>
          </View>

          <Text style={styles.preview} numberOfLines={1}>
            {lastMessage?.content || "Chưa có tin nhắn"}
          </Text>
        </View>

        {/* Badge */}
        {item.unreadCount > 0 && (
          <View style={styles.badge}>
            <Text style={styles.badgeText}>
              {item.unreadCount}
            </Text>
          </View>
        )}
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.safe}>
      {/* HẠ HEADER */}
      <View style={{ marginTop: 32 }}>
        <HeaderBar title="Tin nhắn" />
      </View>

      {loading ? (
        <ActivityIndicator
          size="large"
          color={COLORS.brandBlue}
          style={{ marginTop: 40 }}
        />
      ) : (
        <FlatList
          data={conversations}
          keyExtractor={(item) => item._id}
          renderItem={renderItem}
          contentContainerStyle={{
            padding: SPACING.lg,
            paddingBottom: 24,
          }}
        />
      )}
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

  card: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.lg,
    padding: SPACING.md,
    marginBottom: SPACING.md,
  },

  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    marginRight: SPACING.md,
    backgroundColor: COLORS.surfaceAlt,
  },

  rowBetween: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 4,
  },

  title: {
    fontWeight: "700",
    color: COLORS.textDark,
    maxWidth: "75%",
  },

  time: {
    color: COLORS.textMuted,
    fontSize: TYPOGRAPHY.caption,
  },

  preview: {
    color: COLORS.textMuted,
    fontSize: 14,
  },

  badge: {
    minWidth: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: COLORS.brandBlue,
    alignItems: "center",
    justifyContent: "center",
    marginLeft: 8,
    paddingHorizontal: 6,
  },

  badgeText: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 12,
  },

  /* EMPTY */
  emptyWrap: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: SPACING.xl,
  },

  emptyImg: {
    width: 160,
    height: 160,
    borderRadius: 80,
    backgroundColor: COLORS.brandBlue + "22",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 24,
  },

  emptyIcon: {
    fontSize: 54,
    color: COLORS.brandBlue,
    fontWeight: "bold",
  },

  emptyTitle: {
    fontSize: 22,
    fontWeight: "bold",
    color: COLORS.brandBlue,
    marginBottom: 10,
    textAlign: "center",
  },

  emptyDesc: {
    color: COLORS.textMuted,
    fontSize: 16,
    marginBottom: 32,
    textAlign: "center",
  },

  loginBtn: {
    backgroundColor: COLORS.brandBlue,
    borderRadius: 24,
    paddingVertical: 14,
    paddingHorizontal: 36,
  },

  loginBtnText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 18,
  },
});
