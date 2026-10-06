import React, { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { Button, Input, Text } from '@rneui/themed';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useAppContext, useAppColors } from '../context/AppContext';
import { createSession } from '../services/session';
import { colors } from '../theme/theme';

export default function LoginScreen({ navigation }) {
  const { setSession } = useAppContext();
  const palette = useAppColors();
  const styles = createStyles(palette);
  const [username, setUsername] = useState('student');
  const [password, setPassword] = useState('maize');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleLogin() {
    if (!username.trim() || !password) {
      setError('Enter your username and password.');
      return;
    }

    setLoading(true);
    const nextSession = await createSession(username.trim());
    setSession(nextSession);
    setLoading(false);
    navigation.navigate('Main');
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.accent} />
      <View style={styles.content}>
        <View style={styles.mark}>
          <MaterialCommunityIcons color={colors.blue} name="calendar-star" size={34} />
        </View>
        <Text h1 h1Style={styles.title}>MaizeMeet</Text>
        <Text style={styles.tagline}>There’s more happening here.</Text>

        <View style={styles.form}>
          <Input
            autoCapitalize="none"
            autoComplete="username"
            containerStyle={styles.inputContainer}
            inputContainerStyle={styles.input}
            inputStyle={{ color: palette.ink }}
            label="Campus username"
            labelStyle={{ color: palette.muted }}
            onChangeText={setUsername}
            value={username}
          />
          <Input
            autoComplete="password"
            containerStyle={styles.inputContainer}
            inputContainerStyle={styles.input}
            inputStyle={{ color: palette.ink }}
            label="Password"
            labelStyle={{ color: palette.muted }}
            onChangeText={setPassword}
            secureTextEntry
            value={password}
          />
          {error ? <Text style={styles.error}>{error}</Text> : null}
          <Button loading={loading} onPress={handleLogin} title="Sign in" />
          <Text style={styles.demo}>Demo account credentials are filled in for you.</Text>
        </View>
      </View>
    </SafeAreaView>
  );
}

const createStyles = (palette) => StyleSheet.create({
  safeArea: { backgroundColor: palette.cream, flex: 1 },
  accent: { backgroundColor: palette.maize, height: 8, left: 0, position: 'absolute', right: 0, top: 0 },
  content: { flex: 1, justifyContent: 'center', paddingHorizontal: 28 },
  mark: { alignItems: 'center', backgroundColor: palette.maize, borderRadius: 18, height: 64, justifyContent: 'center', width: 64 },
  title: { color: palette.blue, fontSize: 38, fontWeight: '900', letterSpacing: -1, marginTop: 16 },
  tagline: { color: palette.muted, fontSize: 17, marginTop: 3 },
  form: { backgroundColor: palette.surface, borderRadius: 18, marginTop: 32, padding: 20 },
  inputContainer: { paddingHorizontal: 0 },
  input: { borderBottomColor: palette.border },
  error: { color: palette.danger, marginBottom: 12 },
  demo: { color: palette.muted, fontSize: 12, marginTop: 15, textAlign: 'center' },
});
