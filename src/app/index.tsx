import { Ionicons } from '@expo/vector-icons';
import { useState } from 'react';
import {
  Alert,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function HomeScreen() {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [mostrarSenha, setMostrarSenha] = useState(false);

  function entrar() {
    if (!email.trim() || !senha.trim()) {
      Alert.alert('Atenção', 'Preencha o e-mail e a senha.');
      return;
    }

    Alert.alert('Olá!', 'Botão de entrar funcionando!');
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.conteudo}>
        <Text style={styles.titulo}>Bem-vindo(a)!</Text>

        <Text style={styles.subtitulo}>
          Entre na sua conta para continuar.
        </Text>

        <Text style={styles.label}>E-mail</Text>
        <View style={styles.campoEmail}>
          <Ionicons
            name="mail-outline"
            size={22}
            color="#668576"
          />
          <TextInput
            style={styles.inputComIcone}
            placeholder="Digite seu e-mail"
            keyboardType="email-address"
            autoCapitalize="none"
            accessibilityLabel="Campo de e-mail"
            value={email}
            onChangeText={setEmail}
          />
        </View>

        <Text style={styles.label}>Senha</Text>
        <View style={styles.campoSenha}>
          <Ionicons
            name="lock-closed-outline"
            size={22}
            color="#668576"
          />


          <TextInput
            style={styles.inputComIcone}
            placeholder="Digite sua senha"
            secureTextEntry={!mostrarSenha}
            accessibilityLabel="Campo de senha"
            value={senha}
            onChangeText={setSenha}
          />
          <Pressable onPress={() => setMostrarSenha(!mostrarSenha)}>

            <Ionicons
              name={mostrarSenha ? 'eye-off-outline' : 'eye-outline'}
              size={22}
              color="#668576"
            />
          </Pressable>
        </View>

        <Pressable
          style={styles.botao}
          onPress={entrar}
          accessibilityRole="button"
        >
          <Text style={styles.textoBotao}>Entrar</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  inputComIcone: {
    outlineWidth: 0,
    borderWidth: 0,
    outlineStyle: 'solid',
    flex: 1,
    paddingVertical: 15,
    paddingHorizontal: 12,
    fontSize: 15,
    color: '#3F604A',
  },
  container: {
    flex: 1,
    backgroundColor: '#F0FAFC',
    justifyContent: 'center',
    padding: 24,
  },
  conteudo: {
    width: '100%',
    maxWidth: 400,
    alignSelf: 'center',
  },
  titulo: {
    fontSize: 30,
    fontWeight: 'bold',
    color: '#30356B',
    textAlign: 'center',
    marginBottom: 12,
  },
  subtitulo: {
    fontSize: 15,
    color: '#807873',
    textAlign: 'center',
    marginBottom: 36,
  },
  label: {
    fontSize: 15,
    color: '#30356B',
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#E8EDE7',
    borderWidth: 0,
    borderRadius: 30,
    paddingHorizontal: 20,
    marginBottom: 16,
    fontSize: 15,
    color: '#3f604A',
  },
  botao: {
    backgroundColor: '#1688B5',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 12,
  },
  campoEmail: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E1F1F6',
    borderRadius: 30,
    paddingHorizontal: 20,
    marginBottom: 16,
  },
  textoBotao: {
    color: '#FFFFFF',
    fontSize: 17,
    fontWeight: 'bold',
  },
  campoSenha: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E1F1F6',
    paddingHorizontal: 20,
    marginBottom: 16,
    borderRadius: 30
  },
});