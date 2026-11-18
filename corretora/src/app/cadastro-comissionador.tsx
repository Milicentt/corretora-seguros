import React, {useState} from 'react';
import {Text, TextInput, Pressable, Alert, ScrollView} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {Ionicons} from '@expo/vector-icons';
import {createClient} from '@supabase/supabase-js';
import {supabase} from '../lib/supabase';
import {styles} from './cadastro-comissionador.styles';

export default function CadastroComissionador() {
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [telefone, setTelefone] = useState('');
  const [chavePix, setChavePix] = useState('');
  const [salvando, setSalvando] = useState(false);

  async function salvarParceiro() {
    if (salvando) return;

    if (!nome.trim() || !email.trim() || !senha || !telefone.trim()) {
      Alert.alert('Atenção', 'Preencha nome, e-mail, senha e WhatsApp do corretor.');
      return;
    }

    if (senha.length < 6) {
      Alert.alert('Atenção', 'A senha precisa ter pelo menos 6 caracteres.');
      return;
    }

    setSalvando(true);

    try {
      // Cliente temporario sem sessao para nao deslogar o admin atual
      const url = process.env.EXPO_PUBLIC_SUPABASE_URL!;
      const chave = process.env.EXPO_PUBLIC_SUPABASE_PUBLISHABLE_KEY!;
      const supabaseTemp = createClient(url, chave, {
        auth: {persistSession: false, autoRefreshToken: false},
      });

      // 1. Cria o login do corretor no Supabase Auth com o nome dele
      const {data: authData, error: authError} = await supabaseTemp.auth.signUp({
        email: email.trim(),
        password: senha,
        options: {
          data: {
            nome: nome.trim(),
            role: 'corretor',
          },
        },
      });

      if (authError) {
        Alert.alert('Erro no Login', 'Não foi possível criar o acesso: ' + authError.message);
        return;
      }

      // 2. Salva os dados na tabela comissionadores vinculando o ID do usuario
      const {error: dbError} = await supabase.from('comissionadores').insert([
        {
          nome: nome.trim(),
          telefone: telefone.trim(),
          chave_pix: chavePix.trim(),
          user_id: authData.user?.id,
        },
      ]);

      if (dbError) {
        Alert.alert('Erro no Banco', 'Login criado, mas houve erro ao salvar perfil: ' + dbError.message);
        return;
      }

         Alert.alert('Sucesso', 'Corretor cadastrado! Ele já pode entrar no aplicativo com o e-mail e senha criados.');
      setNome('');
      setEmail('');
      setSenha('');
      setTelefone('');
      setChavePix('');
    } catch {
      Alert.alert('Erro', 'Falha na conexão ao tentar cadastrar.');
    } finally {
      setSalvando(false);
    }
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.conteudo}>
        <Text style={styles.titulo}>Cadastrar Corretor</Text>
        <Text style={styles.subtitulo}>
          Crie o acesso e os dados de repasse do corretor parceiro.
        </Text>

        <Text style={styles.label}>Nome Completo *</Text>
        <TextInput
          style={styles.input}
          placeholder="Ex: Ana Silva"
          accessibilityLabel="Campo para nome completo do corretor"
          value={nome}
          onChangeText={setNome}
        />

        <Text style={styles.label}>E-mail de Acesso *</Text>
        <TextInput
          style={styles.input}
          placeholder="Ex: ana@corretora.com"
          keyboardType="email-address"
          autoCapitalize="none"
          accessibilityLabel="Campo para e-mail de login do corretor"
          value={email}
          onChangeText={setEmail}
        />

        <Text style={styles.label}>Senha Inicial (Mín. 6 dígitos) *</Text>
        <TextInput
          style={styles.input}
          placeholder="Crie uma senha para ele"
          secureTextEntry
          accessibilityLabel="Campo para senha inicial do corretor"
          value={senha}
          onChangeText={setSenha}
        />

        <Text style={styles.label}>WhatsApp (DDD + Número) *</Text>
        <TextInput
          style={styles.input}
          placeholder="Ex: 21999999999"
          keyboardType="phone-pad"
          accessibilityLabel="Campo para WhatsApp do corretor"
          value={telefone}
          onChangeText={setTelefone}
        />

        <Text style={styles.label}>Chave Pix (Opcional)</Text>
        <TextInput
          style={styles.input}
          placeholder="CPF, E-mail ou Chave Aleatória"
          accessibilityLabel="Campo para chave Pix do corretor"
          value={chavePix}
          onChangeText={setChavePix}
        />

        <Pressable
          style={styles.botao}
          onPress={salvarParceiro}
          accessibilityRole="button"
          accessibilityLabel="Salvar cadastro e criar acesso do corretor"
        >
          <Ionicons name="person-add-outline" size={20} color="#FFFFFF" style={{marginRight: 8}} />
          <Text style={styles.textoBotao}>
            {salvando ? 'Cadastrando...' : 'Cadastrar Corretor'}
          </Text>
        </Pressable>
      </ScrollView>
    </SafeAreaView>
  );
}