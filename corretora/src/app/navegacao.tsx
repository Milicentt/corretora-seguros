import React, {useState} from 'react';
import {StyleSheet, Text, View, FlatList, Pressable} from 'react-native';
import {Ionicons} from '@expo/vector-icons';
import DetalhesScreen from './detalhesnav'; 

export default function HomeDashboard() {
  const [currentScreen, setCurrentScreen] = useState('Menu');

  // TODO: Mover essa lista para um arquivo de constantes depois se crescer muito
  const listaMenus = [
    { id: '1', titulo: 'Cadastrar Usuários', icone: 'person-add-outline', cor: '#4A6FA5' },
    { id: '2', titulo: 'Cadastrar Comissões', icone: 'add-circle-outline', cor: '#3F604A' },
    { id: '3', titulo: 'Tabela de Comissões', icone: 'list-circle-outline', cor: '#6E7783' },
    { id: '4', titulo: 'Pagamento de Comissões', icone: 'cash-outline', cor: '#2E4C3E' }
  ];

  // Desviar caso nao esteja na home
  if (currentScreen !== 'Menu') {
    return (
      <DetalhesScreen 
        rota={currentScreen} 
        aoVoltar={() => setCurrentScreen('Menu')} 
      />
    );
  }

  // Gambiarra temporaria pro TS parar de reclamar do nome do icone
  const renderIcon = (iconName: string, color: string) => {
    return <Ionicons name={iconName as any} size={28} color={color} style={styles.iconSpace} />;
  };

  return (
    <View style={styles.mainContainer}>
      <Text style={styles.mainTitle}>Painel Principal</Text>
      <Text style={styles.descText}>Bem vindo (tal pessoa). Selecione o botão que quiser usar.</Text>

      <FlatList
        data={listaMenus}
        keyExtractor={(item) => String(item.id)}
        numColumns={2}
        columnWrapperStyle={styles.rowStyle}
        renderItem={({item}) => (
          <Pressable 
            style={[styles.menuCard, {borderLeftColor: item.cor}]} 
            onPress={() => setCurrentScreen(item.titulo)}
          >
            {renderIcon(item.icone, item.cor)}
            <Text style={styles.cardTxt}>{item.titulo}</Text>
          </Pressable>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: '#F8F5F2',
    padding: 20,
    paddingTop: 60,
  },
  mainTitle: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#514A46',
    marginBottom: 4,
  },
  descText: {
    fontSize: 14,
    color: '#807873',
    marginBottom: 24,
  },
  rowStyle: {
    justifyContent: 'space-between',
  },
  menuCard: {
    backgroundColor: '#FFFFFF',
    width: '48%',
    borderRadius: 12,
    padding: 20,
    marginBottom: 16,
    alignItems: 'center',
    justifyContent: 'center',
    borderLeftWidth: 5,
    elevation: 2, // Sombra basica para Android
  },
  iconSpace: {
    marginBottom: 10,
  },
  cardTxt: {
    fontSize: 14,
    fontWeight: '600',
    color: '#514A46',
    textAlign: 'center',
  },
});