import React, { useEffect, useState, useRef } from "react";
import {
  SafeAreaView,
  View,
  Text,
  StyleSheet,
  Image,
  ScrollView,
  TouchableOpacity,
  Modal,
  Dimensions,
  FlatList,
  TextInput,
} from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { getStudioById } from "../../features/Studio/studioSlice";
import HeaderBar from "../../components/ui/HeaderBar";
import PrimaryButton from "../../components/ui/PrimaryButton";
import FullScreenLoading from "../../components/loadings/fullScreenLoading";
import { COLORS, RADIUS, SPACING, TYPOGRAPHY } from "../../constants/theme";
import { Feather } from "@expo/vector-icons";
import {
  createComment,
  getComments,
  likeComment,
  likeReply,
  replyComment,
  unlikeComment,
} from "../../features/Comment/commentSlice";
import { useFocusEffect } from "@react-navigation/native";
import { getCurrentUser } from "../../features/Authentication/authSlice";
import StudioDetailSkeleton from "../../components/skeletons/StudioDetailSkeleton";

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get("window");

export default function StudioDetailScreen({ route, navigation }) {
  const { item } = route.params || {};
  const [liked, setLiked] = useState(false);
  const dispatch = useDispatch();
  const studio = useSelector((state) => state.studio.studioDetail);
  const user = useSelector((state) => state.auth.user);
  const token = useSelector((state) => state.auth.token);
  const loading = useSelector((state) => state.studio.studioDetailLoading);
  const error = useSelector((state) => state.studio.studioDetailError);
  const commentState = useSelector((state) => state.comment);
  const [optimisticLikes, setOptimisticLikes] = useState({});
  const [optimisticReplyUpdates, setOptimisticReplyUpdates] = useState({});
  const [optimisticReplyLikes, setOptimisticReplyLikes] = useState({});
  const { comments, loading: commentLoading } = commentState;
  const [replyingTo, setReplyingTo] = useState(null);
  const [replyContent, setReplyContent] = useState("");
  const [replyLoading, setReplyLoading] = useState(false);
  const replyInputRef = useRef(null);
  const [sliderIndex, setSliderIndex] = useState(0);
  const [showImageModal, setShowImageModal] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const [newComment, setNewComment] = useState("");
  const sliderRef = useRef();
  const autoPlayTimer = useRef();
  // Autoplay slider
  useEffect(() => {
    if (!studio?.images?.length || showImageModal) return;
    autoPlayTimer.current && clearInterval(autoPlayTimer.current);
    autoPlayTimer.current = setInterval(() => {
      setSliderIndex((prev) => {
        const next = prev + 1 >= studio.images.length ? 0 : prev + 1;
        // Scroll FlatList
        sliderRef.current?.scrollToIndex({ index: next, animated: true });
        return next;
      });
    }, 3500);
    return () => clearInterval(autoPlayTimer.current);
  }, [studio?.images, showImageModal]);

  useEffect(() => {
    if (item?._id) {
      dispatch(getStudioById(item._id));
    }
  }, [item?._id, dispatch]);

  useEffect(() => {
    if (token && !user) {
      dispatch(getCurrentUser());
    }
  }, [token, user, dispatch]);

  useFocusEffect(
    React.useCallback(() => {
      if (token) {
        dispatch(getCurrentUser());
      }
    }, [token, dispatch])
  );

  useEffect(() => {
    if (item?._id) {
      dispatch(
        getComments({
          targetType: "Studio",
          targetId: item._id,
          page: 1,
        })
      );
    }
  }, [item?._id, dispatch]);

  const isCommentLiked = React.useCallback(
    (comment) => {
      if (!user?._id) return false;
      if (optimisticLikes[comment._id] !== undefined) {
        return optimisticLikes[comment._id];
      }
      return comment.likes?.includes(user._id);
    },
    [user?._id, optimisticLikes]
  );
  const isReplyLiked = React.useCallback(
    (reply) => {
      if (!user?._id) return false;
      const optimistic = optimisticReplyUpdates[reply._id];
      if (optimistic?.isLiked !== undefined) {
        return optimistic.isLiked;
      }
      return reply.likes?.includes(user._id) ?? false;
    },
    [user?._id, optimisticReplyUpdates]
  );

  const getReplyLikeCount = React.useCallback(
    (reply) => {
      const optimistic = optimisticReplyUpdates[reply._id];
      if (optimistic?.likesCount !== undefined) {
        return optimistic.likesCount;
      }
      return reply.likes?.length ?? 0;
    },
    [optimisticReplyUpdates]
  );
  const handleToggleLikeReply = (commentId, reply) => {
    if (!user?._id) return;

    const currentlyLiked = isReplyLiked(reply);
    const currentCount = getReplyLikeCount(reply);

    const newLiked = !currentlyLiked;
    const newCount = currentlyLiked ? currentCount - 1 : currentCount + 1;

    setOptimisticReplyUpdates((prev) => ({
      ...prev,
      [reply._id]: { isLiked: newLiked, likesCount: newCount },
    }));

    dispatch(likeReply({ commentId, replyId: reply._id }))
      .unwrap()
      .then(() => {
        // Clear optimistic update on success
        setOptimisticReplyUpdates((prev) => {
          const updated = { ...prev };
          delete updated[reply._id];
          return updated;
        });
        // Refetch fresh data
        dispatch(
          getComments({
            targetType: "Studio",
            targetId: item._id,
          })
        );
      })
      .catch(() => {
        // Revert optimistic update on failure
        setOptimisticReplyUpdates((prev) => {
          const updated = { ...prev };
          delete updated[reply._id];
          return updated;
        });
      });
  };

  const handleToggleLike = (comment) => {
    if (!user?._id) return;
    const currentlyLiked = isCommentLiked(comment);

    setOptimisticLikes((prev) => ({
      ...prev,
      [comment._id]: !currentlyLiked,
    }));

    dispatch(likeComment(comment._id))
      .unwrap()
      .then(() => {
        setOptimisticLikes((prev) => {
          const updated = { ...prev };
          delete updated[comment._id];
          return updated;
        });
        dispatch(
          getComments({
            targetType: "Studio",
            targetId: item._id,
          })
        );
      })
      .catch(() => {
        setOptimisticLikes((prev) => ({
          ...prev,
          [comment._id]: currentlyLiked,
        }));
      });
  };
  const submitReply = async (commentId) => {
    if (!replyContent.trim()) return;
    setReplyLoading(true);
    try {
      await dispatch(
        replyComment({ commentId, content: replyContent })
      ).unwrap();
      setReplyContent("");
      setReplyingTo(null);
      dispatch(
        getComments({
          targetType: "Studio",
          targetId: item._id,
        })
      );
    } catch (err) {
      console.error("Reply failed:", err);
    } finally {
      setReplyLoading(false);
    }
  };
  const submitNewComment = async () => {
    if (!newComment.trim() || commentLoading) return;

    try {
      await dispatch(
        createComment({
          content: newComment.trim(),
          targetType: "Studio",
          targetId: item._id,
        })
      ).unwrap();
      setNewComment("");
      dispatch(
        getComments({
          targetType: "Studio",
          targetId: item._id,
        })
      );
    } catch (err) {
      console.error("Create comment failed:", err);
    }
  };
  const renderImageSlider = () => (
    <View style={styles.sliderWrapper}>
      <FlatList
        ref={sliderRef}
        data={studio?.images || []}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        keyExtractor={(_, idx) => idx.toString()}
        onMomentumScrollEnd={(e) => {
          const idx = Math.round(e.nativeEvent.contentOffset.x / SCREEN_WIDTH);
          setSliderIndex(idx);
        }}
        renderItem={({ item: img, index }) => (
          <TouchableOpacity
            activeOpacity={0.9}
            onPress={() => {
              setSliderIndex(index);
              setShowImageModal(true);
            }}
          >
            <View>
              <Image
                source={{ uri: img }}
                style={styles.hero}
                resizeMode="cover"
              />
              {/* Hiển thị badge đánh giá ở tất cả các ảnh */}
              <View style={styles.ratingBadge}>
                <Feather name="star" size={18} color={COLORS.brandGold} />
                <Text style={styles.ratingText}>
                  {studio.avgRating?.toFixed(1) || 0}
                </Text>
              </View>
            </View>
          </TouchableOpacity>
        )}
        extraData={sliderIndex}
      />
      {/* Indicator */}
      <View style={styles.sliderIndicatorWrap}>
        {(studio?.images || []).map((_, idx) => (
          <View
            key={idx}
            style={[
              styles.sliderDot,
              sliderIndex === idx && styles.sliderDotActive,
            ]}
          />
        ))}
      </View>
    </View>
  );

  // Modal xem ảnh fullscreen
  const renderImageModal = () => (
    <Modal visible={showImageModal} transparent animationType="fade">
      <View style={styles.modalBg}>
        <FlatList
          data={studio?.images || []}
          horizontal
          pagingEnabled
          initialScrollIndex={sliderIndex}
          getItemLayout={(_, i) => ({
            length: SCREEN_WIDTH,
            offset: SCREEN_WIDTH * i,
            index: i,
          })}
          renderItem={({ item }) => (
            <Image
              source={{ uri: item }}
              style={styles.fullImage}
              resizeMode="contain"
            />
          )}
          keyExtractor={(_, idx) => idx.toString()}
        />
        <TouchableOpacity
          style={styles.closeBtn}
          onPress={() => setShowImageModal(false)}
        >
          <Text style={{ color: "#fff", fontSize: 18 }}>Đóng</Text>
        </TouchableOpacity>
      </View>
    </Modal>
  );
  const renderComments = () => {
    const startReply = (commentId) => {
      setReplyingTo(commentId);
      setReplyContent("");
      setTimeout(() => replyInputRef.current?.focus(), 100);
    };

    const cancelReply = () => {
      setReplyingTo(null);
      setReplyContent("");
    };

    if (commentLoading && comments.length === 0) {
      return <Text style={styles.commentMuted}>Đang tải bình luận...</Text>;
    }

    return (
      <View style={styles.commentSection}>
        <Text style={styles.commentTitle}>Bình luận ({comments.length})</Text>

        {user ? (
          <View style={styles.newCommentContainer}>
            <View style={styles.avatar}>
              {user.avatar ? (
                <Image
                  source={{ uri: user.avatar }}
                  style={styles.avatarImage}
                />
              ) : (
                <Text style={styles.avatarText}>
                  {user.fullName?.charAt(0)?.toUpperCase() || "U"}
                </Text>
              )}
            </View>

            <View style={styles.newCommentInputWrapper}>
              <TextInput
                style={styles.newCommentTextInput}
                placeholder="Viết bình luận của bạn..."
                value={newComment}
                onChangeText={setNewComment}
                multiline
                autoCapitalize="sentences"
              />
              <View style={styles.newCommentActions}>
                <TouchableOpacity
                  onPress={submitNewComment}
                  disabled={!newComment.trim() || commentLoading}
                >
                  <Text
                    style={[
                      styles.sendText,
                      (!newComment.trim() || commentLoading) &&
                        styles.sendDisabled,
                    ]}
                  >
                    Gửi
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        ) : (
          <Text style={styles.loginToCommentText}>Đăng nhập để bình luận</Text>
        )}

        {/* Existing comments list */}
        {comments.length === 0 ? (
          <Text style={styles.commentMuted}>Chưa có bình luận</Text>
        ) : (
          comments.map((cmt) => (
            <View key={cmt._id} style={styles.commentItem}>
              <View style={styles.avatar}>
                {cmt.userId?.avatar ? (
                  <Image
                    source={{ uri: cmt.userId.avatar }}
                    style={styles.avatarImage}
                  />
                ) : (
                  <Text style={styles.avatarText}>
                    {cmt.userId?.fullName?.charAt(0)?.toUpperCase() || "U"}
                  </Text>
                )}
              </View>

              <View style={{ flex: 1 }}>
                <View style={styles.commentHeader}>
                  <Text style={styles.commentUser}>
                    {cmt.userId?.fullName || "Người dùng"}
                  </Text>
                  <Text style={styles.commentTime}>
                    {new Date(cmt.createdAt).toLocaleDateString("vi-VN")}
                  </Text>
                </View>

                <Text style={styles.commentContent}>{cmt.content}</Text>

                <View style={styles.commentFooter}>
                  <TouchableOpacity
                    style={styles.actionButton}
                    onPress={() => handleToggleLike(cmt)}
                  >
                    <Feather
                      name="heart"
                      size={16}
                      color={isCommentLiked(cmt) ? "#E53935" : COLORS.textMuted}
                      style={isCommentLiked(cmt) ? styles.filledHeart : null}
                    />
                    <Text
                      style={[
                        styles.commentAction,
                        isCommentLiked(cmt) && styles.likedText,
                      ]}
                    >
                      {cmt.likes?.length || 0}
                    </Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={styles.actionButton}
                    onPress={() => startReply(cmt._id)}
                  >
                    <Feather
                      name="message-circle"
                      size={16}
                      color={COLORS.textMuted}
                    />
                    <Text style={styles.commentAction}>Trả lời</Text>
                  </TouchableOpacity>

                  {cmt.replies?.length > 0 && (
                    <Text style={styles.commentAction}>
                      {cmt.replies.length} trả lời
                    </Text>
                  )}
                </View>

                {/* Reply Input */}
                {replyingTo === cmt._id && (
                  <View style={styles.replyInputWrapper}>
                    <TextInput
                      ref={replyInputRef}
                      style={styles.replyTextInput}
                      placeholder="Viết trả lời của bạn..."
                      value={replyContent}
                      onChangeText={setReplyContent}
                      multiline
                      autoFocus
                    />
                    <View style={styles.replyActions}>
                      <TouchableOpacity onPress={cancelReply}>
                        <Text style={styles.cancelText}>Hủy</Text>
                      </TouchableOpacity>
                      <TouchableOpacity
                        onPress={() => submitReply(cmt._id)}
                        disabled={!replyContent.trim()}
                      >
                        <Text
                          style={[
                            styles.sendText,
                            !replyContent.trim() && styles.sendDisabled,
                          ]}
                        >
                          Gửi
                        </Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                )}
                {cmt.replies?.length > 0 && (
                  <View style={styles.repliesContainer}>
                    {cmt.replies.map((reply) => (
                      <View key={reply._id} style={styles.replyItem}>
                        <View style={styles.avatar}>
                          {reply.userId?.avatar ? (
                            <Image
                              source={{ uri: reply.userId.avatar }}
                              style={styles.avatarImage}
                            />
                          ) : (
                            <Text style={styles.avatarText}>
                              {reply.userId?.fullName
                                ?.charAt(0)
                                ?.toUpperCase() || "U"}
                            </Text>
                          )}
                        </View>

                        <View style={{ flex: 1 }}>
                          <Text style={styles.replyUserName}>
                            {reply.userId?.fullName || "Người dùng"}
                          </Text>
                          <Text style={styles.replyContent}>
                            {reply.content}
                          </Text>

                          {/* Updated footer with like button */}
                          <View style={styles.replyFooter}>
                            <TouchableOpacity
                              style={styles.actionButton}
                              onPress={() =>
                                handleToggleLikeReply(cmt._id, reply)
                              }
                            >
                              <Feather
                                name="heart"
                                size={16}
                                color={
                                  isReplyLiked(reply)
                                    ? "#E53935"
                                    : COLORS.textMuted
                                }
                                style={
                                  isReplyLiked(reply)
                                    ? styles.filledHeart
                                    : null
                                }
                              />
                              <Text
                                style={[
                                  styles.commentAction,
                                  isReplyLiked(reply) && styles.likedText,
                                ]}
                              >
                                {getReplyLikeCount(reply)}
                              </Text>
                            </TouchableOpacity>

                            <Text style={styles.replyTime}>
                              {new Date(reply.createdAt).toLocaleDateString(
                                "vi-VN"
                              )}
                            </Text>
                          </View>
                        </View>
                      </View>
                    ))}
                  </View>
                )}
              </View>
            </View>
          ))
        )}
      </View>
    );
  };

  if (loading) return <FullScreenLoading />;

  if (error)
    return (
      <SafeAreaView style={styles.safe}>
        <Text style={{ color: "red", padding: 20 }}>Không thể tải studio</Text>
      </SafeAreaView>
    );

  return (
    <SafeAreaView style={[styles.safe, { paddingTop: 32 }]}>
      <HeaderBar
        title="Chi tiết"
        onBack={() => navigation.goBack?.()}
        rightIcon="more-vertical"
        onRightPress={() => setShowMenu((v) => !v)}
      />
      {/* Dropdown menu khi bấm ba chấm */}
      {showMenu && (
        <>
          <TouchableOpacity
            style={styles.overlay}
            activeOpacity={1}
            onPress={() => setShowMenu(false)}
          />
          <View style={styles.dropdownMenu}>
            <TouchableOpacity
              style={styles.menuItem}
              onPress={() => {
                setShowMenu(false); /* TODO: handle report */
              }}
            >
              <Feather
                name="alert-circle"
                size={20}
                color="#E53935"
                style={{ marginRight: 8 }}
              />
              <Text style={styles.menuItemText}>Báo cáo</Text>
            </TouchableOpacity>
          </View>
        </>
      )}
      {loading && <FullScreenLoading />}
      <ScrollView contentContainerStyle={{ paddingBottom: SPACING.xxl }}>
        {loading ? (
          <StudioDetailSkeleton />
        ) : error ? (
          <View style={{ padding: SPACING.xl }}>
            <Text style={{ color: "red" }}>
              Không thể tải thông tin studio.
            </Text>
          </View>
        ) : studio ? (
          <>
            {studio.images?.length > 0 && renderImageSlider()}
            {renderImageModal()}

            <View style={styles.sheet}>{renderComments()}</View>
          </>
        ) : null}
      </ScrollView>

      {/* Bottom bar */}
      <View style={styles.bottomBar}>
        <View>
          <Text style={styles.priceLabel}>Giá (tạm tính)</Text>
          <Text style={styles.totalPrice}>
            {studio?.basePricePerHour?.toLocaleString()}đ/giờ
          </Text>
        </View>
        <PrimaryButton
          style={{ flex: 1, marginLeft: SPACING.md }}
          label="Đặt ngay"
          onPress={() => {
            if (!user) {
              navigation.navigate("SignIn");
            } else {
              navigation.navigate("SelectDate", {
                studio,
                allowOvernight: true,
              });
            }
          }}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  hero: {
    width: SCREEN_WIDTH,
    height: 280,
    backgroundColor: COLORS.border,
    borderTopLeftRadius: 0,
    borderTopRightRadius: 0,
  },
  sliderWrapper: {
    width: SCREEN_WIDTH,
    height: 280,
    backgroundColor: COLORS.border,
  },
  sliderIndicatorWrap: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: -24,
    marginBottom: 8,
  },
  sliderDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: COLORS.textMuted,
    marginHorizontal: 3,
  },
  sliderDotActive: {
    backgroundColor: COLORS.brandBlue,
    width: 16,
  },
  modalBg: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.95)",
    justifyContent: "center",
    alignItems: "center",
  },
  fullImage: {
    width: SCREEN_WIDTH,
    height: SCREEN_HEIGHT,
    resizeMode: "contain",
  },
  closeBtn: {
    position: "absolute",
    top: 40,
    right: 24,
    backgroundColor: "rgba(0,0,0,0.5)",
    padding: 10,
    borderRadius: 20,
  },
  ratingBadge: {
    position: "absolute",
    top: 16,
    right: 16,
    backgroundColor: "rgba(255,255,255,0.92)",
    borderRadius: 16,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 10,
    paddingVertical: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 2,
    elevation: 2,
  },
  ratingText: {
    color: COLORS.brandGold,
    fontWeight: "700",
    marginLeft: 4,
    fontSize: 15,
  },
  sheet: {
    marginTop: -40,
    borderTopLeftRadius: RADIUS.xl,
    borderTopRightRadius: RADIUS.xl,
    backgroundColor: COLORS.surface,
    padding: SPACING.xl,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 2,
  },
  titleRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  title: {
    fontSize: TYPOGRAPHY.headingM,
    fontWeight: "700",
    color: COLORS.textDark,
    marginBottom: 6,
  },
  location: {
    color: COLORS.textMuted,
    marginBottom: 12,
    fontSize: 15,
  },
  infoRowGroup: {
    marginBottom: 10,
  },
  infoRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 4,
  },
  infoLabel: {
    color: COLORS.textMuted,
    fontWeight: "600",
    fontSize: 15,
    marginRight: 2,
  },
  infoValue: {
    color: COLORS.textDark,
    fontWeight: "600",
    fontSize: 15,
    marginLeft: 2,
  },
  price: {
    color: COLORS.brandBlue,
    fontWeight: "700",
    fontSize: 16,
    marginLeft: 4,
  },
  description: {
    color: COLORS.textDark,
    marginTop: 14,
    fontSize: 15,
    lineHeight: 22,
  },
  commentSection: {
    marginTop: 20,
    paddingTop: 16,
    borderTopWidth: 1,
    borderColor: COLORS.border,
  },

  commentTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: COLORS.textDark,
    marginBottom: 12,
  },

  commentMuted: {
    color: COLORS.textMuted,
    fontSize: 15,
  },

  commentItem: {
    flexDirection: "row",
    marginBottom: 16,
  },
  likeButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },

  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.border,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
    overflow: "hidden",
  },

  avatarImage: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },

  avatarText: {
    color: COLORS.textMuted,
    fontWeight: "700",
    fontSize: 16,
  },

  commentHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 2,
  },

  commentUser: {
    fontWeight: "700",
    color: COLORS.textDark,
  },

  commentTime: {
    fontSize: 12,
    color: COLORS.textMuted,
  },

  commentContent: {
    fontSize: 15,
    color: COLORS.textDark,
    lineHeight: 20,
    marginBottom: 6,
  },

  commentFooter: {
    flexDirection: "row",
    gap: 16,
  },

  commentAction: {
    fontSize: 13,
    color: COLORS.textMuted,
  },

  bottomBar: {
    flexDirection: "row",
    alignItems: "center",
    padding: SPACING.lg,
    backgroundColor: COLORS.surface,
    borderTopWidth: 1,
    borderColor: COLORS.border,
  },
  priceLabel: {
    color: COLORS.textMuted,
  },
  totalPrice: {
    color: COLORS.brandBlue,
    fontWeight: "700",
    fontSize: TYPOGRAPHY.headingS,
  },
  dropdownMenu: {
    position: "absolute",
    top: 56,
    right: 18,
    backgroundColor: "#fff",
    borderRadius: 12,
    paddingVertical: 6,
    paddingHorizontal: 0,
    shadowColor: "#000",
    shadowOpacity: 0.12,
    shadowRadius: 8,
    elevation: 6,
    zIndex: 100,
    minWidth: 140,
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    paddingHorizontal: 18,
  },
  menuItemText: {
    fontSize: 16,
    color: "#E53935",
    fontWeight: "bold",
  },
  replyInputWrapper: {
    marginTop: 12,
    backgroundColor: COLORS.background,
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  replyTextInput: {
    fontSize: 15,
    color: COLORS.textDark,
    maxHeight: 100,
  },
  replyActions: {
    flexDirection: "row",
    justifyContent: "flex-end",
    marginTop: 8,
    gap: 16,
  },
  cancelText: {
    color: COLORS.textMuted,
    fontSize: 14,
  },
  sendText: {
    color: COLORS.brandBlue,
    fontWeight: "600",
    fontSize: 14,
  },
  sendDisabled: {
    color: COLORS.textMuted,
  },
  repliesContainer: {
    marginTop: 12,
  },
  replyItem: {
    flexDirection: "row",
    marginBottom: 12,
    paddingLeft: 12,
  },
  replyUserName: {
    fontWeight: "700",
    color: COLORS.textDark,
    fontSize: 14,
  },
  replyContent: {
    fontSize: 14.5,
    color: COLORS.textDark,
    lineHeight: 20,
    marginTop: 2,
  },
  replyFooter: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 4,
    justifyContent: "space-between",
    width: "100%",
  },
  replyTime: {
    fontSize: 12,
    color: COLORS.textMuted,
  },
  newCommentContainer: {
    flexDirection: "row",
    marginBottom: 24,
    alignItems: "flex-start",
  },
  newCommentInputWrapper: {
    flex: 1,
    backgroundColor: COLORS.background,
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: COLORS.border,
    marginLeft: 12,
  },
  newCommentTextInput: {
    fontSize: 15,
    color: COLORS.textDark,
    maxHeight: 100,
    minHeight: 40,
  },
  newCommentActions: {
    flexDirection: "row",
    justifyContent: "flex-end",
    marginTop: 8,
  },
  loginToCommentText: {
    color: COLORS.textMuted,
    fontSize: 15,
    marginVertical: 16,
    textAlign: "center",
  },
  overlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0,0,0,0.01)",
    zIndex: 99,
  },
});
