import Toast from 'react-native-toast-message';

export default function showAlert(title: string, message: string, type: 'success' | 'error' | 'info' = 'info') {
  Toast.show({
    type: type,
    text1: title,
    text2: message,
  });
}
