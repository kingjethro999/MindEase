import { Link } from 'expo-router';
import { StyleSheet, View, Text } from 'react-native';



export default function ModalScreen() {
  return (
    <View style={styles.container}>
      <Text>This is a modal</Text>
      <Link href="/" dismissTo style={styles.link}>
        <Text>Go to home screen</Text>
      </Link>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: theme.spacing.lg,
  },
  link: {
    marginTop: theme.spacing.md,
    paddingVertical: theme.spacing.md,
  },
});
