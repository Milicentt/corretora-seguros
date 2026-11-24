import React from 'react';
import {StyleSheet, Text, View, Pressable} from 'react-native';
import {Ionicons} from '@expo/vector-icons';

// Criado tipo separado para organizar melhor o componente
type Props = {
  rota: string;
  aoVoltar: () => void;
};

export default function DetalhesScreen({rota, aoVoltar}: Props) {
  return (
    <View style={styles.viewContainer}>
      
      {/* Botao de voltar pro menu */}
      <Pressable style={styles.btnBack} onPress={aoVoltar}>
        <Ionicons name="arrow-back-outline" size={24} color="#514A46" />
        <Text style={styles.txtVoltar}>Voltar</Text>
      </Pressable>

      {/* TODO: Substituir essa view vazia quando o grupo terminar */}
      <View style={styles.wrapper}>
        <Ionicons name="construct-outline" size={64} color="#807873" />
        <Text style={styles.screenTitle}>{rota}</Text>
        <Text style={styles.infoText}>
          parte que será feita por outro do grupo.
        </Text>
      </View>

    </View>
  );
}

const styles = StyleSheet.create({
  viewContainer: {
    padding: 20,
    backgroundColor: '#F8F5F2',
    flex: 1,
    paddingTop: 60,
  },
  btnBack: {
    flexDirection: 'row',
    marginBottom: 40,
    alignItems: 'center',
  },
  txtVoltar: {
    color: '#514A46',
    marginLeft: 8,
    fontWeight: '500',
    fontSize: 16,
  },
  wrapper: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  screenTitle: {
    fontWeight: 'bold',
    fontSize: 22,
    color: '#514A46',
    textAlign: 'center',
    marginTop: 16,
    marginBottom: 8,
  },
  infoText: {
    textAlign: 'center',
    color: '#807873',
    lineHeight: 20,
    fontSize: 14,
  },
});
