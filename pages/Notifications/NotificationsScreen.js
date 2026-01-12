import React, { useEffect } from "react";
import { SafeAreaView, View, Text, StyleSheet, FlatList, TouchableOpacity, Modal } from "react-native";
import HeaderBar from "../../components/ui/HeaderBar";
import { COLORS, RADIUS, SPACING, TYPOGRAPHY } from "../../constants/theme";
import { useDispatch, useSelector } from "react-redux";
import { getNotifications, markNotificationRead, deleteNotification } from "../../features/Notification/notificationSlice";
import NotificationSkeleton from "../../components/skeletons/NotificationSkeleton";
import { Feather } from "@expo/vector-icons";
import FullScreenLoading from "../../components/loadings/fullScreenLoading";
import ToastNotification from "../../components/toast/ToastNotification";

export default function NotificationsScreen({ navigation }) {
  const dispatch = useDispatch();
  const notifications = useSelector((state) => state.notification.notifications?.data?.notifications) || [];
  const loading = useSelector((state) => state.notification.loading);
  const pagination = useSelector((state) => state.notification.notifications?.data?.pagination);
  const user = useSelector((state) => state.auth.user);
  const [page, setPage] = React.useState(1);
  const [viewed, setViewed] = React.useState({});
  const [deleteId, setDeleteId] = React.useState(null);
  const [showModal, setShowModal] = React.useState(false);
  const [isDeleting, setIsDeleting] = React.useState(false);
  const [toast, setToast] = React.useState(null);

  useEffect(() => {
    dispatch(getNotifications({ page: 1 }));
  }, [dispatch]);

  // Load more notifications when scroll to end
  const handleEndReached = () => {
    if (pagination && page < pagination.totalPages && !loading) {
      const nextPage = page + 1;
      setPage(nextPage);
      dispatch(getNotifications({ page: nextPage }));
    }
  };

  // Mark as read when notification is in view
  const handleViewableItemsChanged = React.useRef(({ viewableItems }) => {
    viewableItems.forEach(({ item }) => {
      if (!item.isRead && !viewed[item._id]) {
        dispatch(markNotificationRead(item._id));
        setViewed((prev) => ({ ...prev, [item._id]: true }));
      }
    });
  }).current;

  if (!user) {
    return (
      <SafeAreaView style={styles.safe}>
        <View style={styles.emptyWrap}>
          <View style={[styles.emptyImg, { backgroundColor: COLORS.brandBlue + '22', borderRadius: 90, justifyContent: 'center', alignItems: 'center' }]}> 
            <Text style={{ fontSize: 54, color: COLORS.brandBlue, fontWeight: 'bold' }}>?</Text>
          </View>
          <Text style={styles.emptyTitle}>Bạn chưa đăng nhập</Text>
          <Text style={styles.emptyDesc}>Vui lòng đăng nhập để xem thông báo của bạn.</Text>
          <TouchableOpacity style={styles.loginBtn} onPress={() => navigation.navigate('SignIn')}>
            <Text style={styles.loginBtnText}>Đăng nhập</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safe}>
      <View style={{ marginTop: 36, marginBottom: 8 }}>
        <HeaderBar title="Thông báo" onBack={() => navigation.goBack?.()} rightIcon="sliders" />
      </View>
      {loading && page === 1 ? (
        <NotificationSkeleton count={7} />
      ) : (
        <FlatList
          data={notifications}
          keyExtractor={(item) => item._id}
          contentContainerStyle={{ padding: SPACING.lg, paddingTop: 18 }}
          renderItem={({ item }) => (
            <View style={[styles.card, !item.isRead && styles.unreadCard]}>
              <View style={[styles.avatar, !item.isRead && styles.unreadAvatar]}>
                <Text style={styles.avatarText}>S</Text>
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.title}>{item.title}</Text>
                <Text style={styles.message}>{item.message}</Text>
                <Text style={styles.time}>{new Date(item.createdAt).toLocaleString("vi-VN")}</Text>
              </View>
              <TouchableOpacity onPress={() => { setDeleteId(item._id); setShowModal(true); }} style={styles.deleteBtn}>
                <Feather name="trash-2" size={20} color={COLORS.danger} />
              </TouchableOpacity>
            </View>
          )}
          initialNumToRender={7}
          maxToRenderPerBatch={7}
          windowSize={7}
          onEndReached={handleEndReached}
          onEndReachedThreshold={0.2}
          viewabilityConfig={{ itemVisiblePercentThreshold: 60 }}
          onViewableItemsChanged={handleViewableItemsChanged}
        />
      )}
      {/* Modal xác nhận xóa */}
      <Modal
        visible={showModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalBox}>
            <Text style={styles.modalTitle}>Xác nhận xóa</Text>
            <Text style={styles.modalDesc}>Bạn có chắc chắn muốn xóa thông báo này không?</Text>
            <View style={{ flexDirection: 'row', justifyContent: 'flex-end', marginTop: 18 }}>
              <TouchableOpacity onPress={() => setShowModal(false)} style={styles.modalBtnCancel}>
                <Text style={{ color: COLORS.textMuted, fontWeight: 'bold' }}>Hủy</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={async () => {
                  setIsDeleting(true);
                  setShowModal(false);
                  try {
                    await dispatch(deleteNotification(deleteId)).unwrap();
                    setToast({ type: 'success', message: 'Xóa thông báo thành công!' });
                  } catch (err) {
                    setToast({ type: 'error', message: 'Xóa thông báo thất bại!' });
                  }
                  setIsDeleting(false);
                }}
                style={styles.modalBtnDelete}
              >
                <Text style={{ color: COLORS.danger, fontWeight: 'bold' }}>Xóa</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
      {isDeleting && <FullScreenLoading />}
      {toast && (
        <ToastNotification
          type={toast.type}
          message={toast.message}
          onClose={() => setToast(null)}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  card: {
    flexDirection: "row",
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.lg,
    padding: SPACING.md,
    marginBottom: SPACING.md,
    alignItems: "center",
  },
  unreadCard: {
    backgroundColor: COLORS.brandBlue + '22',
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: COLORS.brandBlue + "22",
    alignItems: "center",
    justifyContent: "center",
    marginRight: SPACING.md,
  },
  unreadAvatar: {
    backgroundColor: '#fff',
    borderWidth: 2,
    borderColor: COLORS.brandBlue,
  },
  avatarText: {
    color: COLORS.brandBlue,
    fontWeight: "700",
  },
  title: {
    color: COLORS.textDark,
    fontWeight: "600",
    fontSize: 16,
  },
  message: {
    color: COLORS.textMuted,
    fontSize: 15,
    marginBottom: 2,
  },
  time: {
    color: COLORS.textMuted,
    fontSize: TYPOGRAPHY.caption,
  },
  emptyWrap: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: SPACING.xl,
  },
  emptyTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: COLORS.brandBlue,
    marginBottom: 12,
    textAlign: 'center',
  },
  emptyDesc: {
    color: COLORS.textMuted,
    fontSize: 16,
    marginBottom: 32,
    textAlign: 'center',
  },
  loginBtn: {
    backgroundColor: COLORS.brandBlue,
    borderRadius: RADIUS.xl,
    paddingVertical: 14,
    paddingHorizontal: 32,
    alignItems: 'center',
  },
  loginBtnText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 18,
  },
  deleteBtn: {
    padding: 8,
    marginLeft: 8,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.25)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalBox: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 24,
    width: 300,
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.danger,
    marginBottom: 8,
  },
  modalDesc: {
    color: COLORS.textDark,
    fontSize: 15,
    textAlign: 'center',
  },
  modalBtnCancel: {
    paddingVertical: 10,
    paddingHorizontal: 18,
    borderRadius: 8,
    marginRight: 8,
    backgroundColor: '#f2f2f2',
  },
  modalBtnDelete: {
    paddingVertical: 10,
    paddingHorizontal: 18,
    borderRadius: 8,
    backgroundColor: '#fdeaea',
  },
});

