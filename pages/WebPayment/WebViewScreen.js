// c:\Users\ACER\Desktop\Code\S+Studio\FE_MOBILE\pages\WebViewScreen.js
import React from "react";
import { View, Text } from "react-native";
import { WebView } from "react-native-webview";
import { useNavigation } from "@react-navigation/native";

export default function WebViewScreen({ route }) {
  const { url, title, paymentInfo } = route.params || {};
  const navigation = useNavigation();

  // Theo dõi sự kiện hoàn thành/thất bại thanh toán
  const handleWebViewNavigationStateChange = (navState) => {
    // Chỉ kiểm tra redirect từ BE nếu url chứa 'payment-success' hoặc 'payment-fail'
    // Nếu không có, tự động về BookingHistory sau khi WebView load xong
    if (navState.url.includes('payment-success') || navState.url.includes('payment-fail')) {
      navigation.reset({
        index: 0,
        routes: [{ name: 'BookingHistory' }],
      });
    }
  };

  // Nếu không có redirect BE, tự động về BookingHistory sau khi load xong (ví dụ sau 2s)
  // (Chỉ thực hiện nếu url là trang thanh toán, không phải payment-success/fail)
  React.useEffect(() => {
    let timeout;
    if (url && (!url.includes('payment-success') && !url.includes('payment-fail'))) {
      timeout = setTimeout(() => {
        navigation.reset({
          index: 0,
          routes: [{ name: 'BookingHistory' }],
        });
      }, 2000); // 2s sau tự động về
    }
    return () => clearTimeout(timeout);
  }, [url, navigation]);

  return (
    <View style={{ flex: 1 }}>
      {title && (
        <View style={{ padding: 16, backgroundColor: '#fff', borderBottomWidth: 1, borderColor: '#eee' }}>
          <Text style={{ fontSize: 18, fontWeight: 'bold', color: '#2F64F3', textAlign: 'center' }}>{title}</Text>
        </View>
      )}
      {paymentInfo && (
        <View style={{ padding: 12, backgroundColor: '#f6fafd', borderBottomWidth: 1, borderColor: '#eee' }}>
          <Text style={{ fontSize: 15, color: '#222', marginBottom: 2 }}>Mã giao dịch: <Text style={{ fontWeight: 'bold' }}>{paymentInfo.paymentCode}</Text></Text>
          <Text style={{ fontSize: 15, color: '#222', marginBottom: 2 }}>Số tiền: <Text style={{ fontWeight: 'bold', color: '#2F64F3' }}>{paymentInfo.amount?.toLocaleString()}đ</Text></Text>
          <Text style={{ fontSize: 15, color: '#222', marginBottom: 2 }}>Trạng thái: <Text style={{ fontWeight: 'bold', color: paymentInfo.status === 'pending' ? '#E6A23C' : '#2F64F3' }}>{paymentInfo.status === 'pending' ? 'Chờ thanh toán' : paymentInfo.status}</Text></Text>
        </View>
      )}
      <WebView
        source={{ uri: url }}
        style={{ flex: 1 }}
        onNavigationStateChange={handleWebViewNavigationStateChange}
      />
    </View>
  );
}