import { StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function CadastroComissionador() {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.conteudo}>
        <Text style={styles.titulo}>
          Cadastro de comissionadores
        </Text>

        <Text style={styles.subtitulo}>
          Cadastre as pessoas que receberão as comissões.
        </Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F7F8F5',
  },
  conteudo: {
    width: '100%',
    maxWidth: 480,
    alignSelf: 'center',
    padding: 24,
  },
  titulo: {
    fontSize: 26,
    fontWeight: '700',
    color: '#34483E',
    marginBottom: 12,
  },
  subtitulo: {
    fontSize: 16,
    color: '#668576',
    lineHeight: 24,
  },
});