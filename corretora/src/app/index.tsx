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
          placeholder="E-mail"
          keyboardType="email-address"
          autoCapitalize="none"
          accessibilityLabel="Campo de e-mail"
          value={email}
          onChangeText={setEmail}
        />
        </View>

<View style={styles.campoSenha}>
  <Ionicons
    name="lock-closed-outline"
    size={22}
    color="#668576"
  />

<Ionicons
    name="eye-off-outline"
    size={22}
    color="#668576"
  />
  <TextInput
          style={styles.input}
          placeholder="Senha"
          secureTextEntry={true}
          accessibilityLabel="Campo de senha"
          value={senha}
          onChangeText={setSenha}
        />
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
  flex: 1,
  paddingVertical: 15,
  paddingHorizontal: 12,
  fontSize: 15,
  color: '#3F604A',
},
container: {
flex: 1,
backgroundColor: '#F8F5F2',
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
color: '#514A46',
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
color: '#514A46',
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
backgroundColor: '#8DAB9E',
padding: 16,
borderRadius: 12,
alignItems: 'center',
marginTop: 12,
},
campoEmail: {
flexDirection:'row',
alignItems:'center',
backgroundColor:'#E8EDE7',
borderRadius: 30,
paddingHorizontal: 20,
marginBottom: 16,
},
textoBotao: {
color: '#FFFFFF',
fontSize: 17,
fontWeight: 'bold',
},
campoSenha:{
flexDirection:'row',
alignItems:'center',
backgroundColor:'#E8EDE7',
paddingHorizontal: 20,
marginBottom:16,
borderRadius:30},
});