import DevicesList from '@/components/devices/devices';
import { ScrollView, StyleSheet, View } from 'react-native';

export default function Devices() {
  return (
    <ScrollView style={styles.container}>
      <View style={styles.section}>
        <DevicesList />
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  status: {
    fontSize: 18,
    marginBottom: 30,
    textAlign: 'center',
  },
  section: {
    marginBottom: 20,
  }
});
