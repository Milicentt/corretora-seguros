import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, SafeAreaView, FlatList, ActivityIndicator, TouchableOpacity } from 'react-native';
import { Picker } from '@react-native-picker/picker';

export default function App() {
  const [dataGeral, setDataGeral] = useState([]); // Dados completos para a 1ª tabela
  const [dataFiltrada, setDataFiltrada] = useState([]); // Dados filtrados para a 2ª tabela
  const [listaProdutores, setListaProdutores] = useState([]); // Lista dinâmica para o Picker
  const [produtorSelecionado, setProdutorSelecionado] = useState('TODOS'); // Item selecionado no Picker
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function buscarDadosDoBanco() {
      try {
        setTimeout(() => {
          const dadosDoBanco = [
            // Alterar para uso de banco de dados depois
            { id: '1', produtor: 'Ana Silva', comissaoTotal: 'R$ 1.200', comissaoParcial: 'R$ 600' },
            { id: '2', produtor: 'Carlos Lima', comissaoTotal: 'R$ 2.500', comissaoParcial: 'R$ 1.250' },
            { id: '3', produtor: 'Beatriz Souza', comissaoTotal: 'R$ 900', comissaoParcial: 'R$ 450' },
            { id: '4', produtor: 'Marcos Dias', comissaoTotal: 'R$ 3.100', comissaoParcial: 'R$ 1.550' },
            { id: '5', produtor: 'Ana Silva', comissaoTotal: 'R$ 800', comissaoParcial: 'R$ 400' },
          ];

          setDataGeral(dadosDoBanco);
          setDataFiltrada(dadosDoBanco);

          
          const produtoresUnicos = [...new Set(dadosDoBanco.map(item => item.produtor))];
          setListaProdutores(produtoresUnicos);

          setLoading(false);
        }, 1000);
      } catch (error) {
        console.error("Erro ao buscar dados:", error);
        setLoading(false);
      }
    }

    buscarDadosDoBanco();
  }, []);

  
  const filtrarProdutor = (valor) => {
    setProdutorSelecionado(valor);
    if (valor === 'TODOS') {
      setDataFiltrada(dataGeral);
    } else {
      const filtrados = dataGeral.filter(item => item.produtor === valor);
      setDataFiltrada(filtrados);
    }
  };

  const acaoBotao = (item) => {
    console.log('Botão clicado para:', item.produtor);
    alert(`Pago Para: ${item.produtor}`);
  };

  // Renderizador da 1ª Tabela (Geral)
  const renderItemGeral = ({ item, index }) => (
    <View style={[styles.row, index % 2 === 1 && styles.alternateRow]}>
      <Text style={styles.cell} numberOfLines={1}>{item.produtor}</Text>
      <Text style={styles.cell} numberOfLines={1}>{item.comissaoTotal}</Text>
      <Text style={styles.cell} numberOfLines={1}>{item.comissaoParcial}</Text>
      <Text style={styles.cell} numberOfLines={1}>{item.datalan}</Text>
      <View style = {styles.cellButtonContainer}>
        <TouchableOpacity
          style={styles.botao}
          onPress={() => acaoBotao(item)}
        >
          <Text style={styles.textoBotao}>Pagar</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  // Renderizador da 2ª Tabela (Filtrada)
  const renderItemFiltrado = ({ item, index }) => (
    <View style={[styles.row, index % 2 === 1 && styles.alternateRow]}>
      <Text style={styles.cell} numberOfLines={1}>{item.produtor}</Text>
      <Text style={styles.cell} numberOfLines={1}>{item.comissaoTotal}</Text>
      <Text style={styles.cell} numberOfLines={1}>{item.comissaoParcial}</Text>
      <Text style={styles.cell} numberOfLines={1}>{item.datalan}</Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* 1ª METADE DA TELA: Relatório Geral da Corretora */}
      <View style={styles.metadeSuperior}>
        <Text style={styles.titulo}>Relatório de Comissões Corretora</Text>

        <View style={styles.tabelaContainer}>
          {loading ? (
            <ActivityIndicator size="large" color="#2C3E50" style={{ flex: 1 }} />
          ) : (
            <>
              <View style={styles.headerRow}>
                <Text style={[styles.headerCell, styles.cell]}>Produtor</Text>
                <Text style={[styles.headerCell, styles.cell]}>Comissão Total</Text>
                <Text style={[styles.headerCell, styles.cell]}>Comissão Parcial</Text>
              </View>

              <FlatList
                data={dataGeral}
                keyExtractor={(item) => item.id}
                renderItem={renderItemGeral}
              />
            </>
          )}
        </View>
      </View>

      
      <View style={styles.metadeInferior}>
        <Text style={styles.titulo}>Relatório de Comissões por Produtor</Text>

        
        <View style={styles.pickerContainer}>
          <Picker
            selectedValue={produtorSelecionado}
            onValueChange={(itemValue) => filtrarProdutor(itemValue)}
            style={styles.picker}
          >
            <Picker.Item label="Selecione um produtor..." value="TODOS" />
            {listaProdutores.map((produtor, index) => (
              <Picker.Item key={index} label={produtor} value={produtor} />
            ))}
          </Picker>
        </View>

        <View style={styles.tabelaContainer}>
          {loading ? (
            <ActivityIndicator size="large" color="#2C3E50" style={{ flex: 1 }} />
          ) : (
            <>
              <View style={styles.headerRow}>
                <Text style={[styles.headerCell, styles.cell]}>Produtor</Text>
                <Text style={[styles.headerCell, styles.cell]}>Comissão Total</Text>
                <Text style={[styles.headerCell, styles.cell]}>Comissão Parcial</Text>
              </View>

              <FlatList
                data={dataFiltrada}
                keyExtractor={(item, index) => index.toString()}
                renderItem={renderItemFiltrado}
              />
            </>
          )}
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
    padding: 8,
  },
  metadeSuperior: {
    flex: 1,
    paddingHorizontal: 8,
    justifyContent: 'center',
  },
  metadeInferior: {
    flex: 1,
    paddingHorizontal: 8,
    justifyContent: 'center',
    backgroundColor: '#EDF2F7',
  },
  titulo: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#2C3E50',
    marginBottom: 4,
    textAlign: 'center',
  },
  pickerContainer: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 6,
    marginBottom: 6,
    height: 38,
    justifyContent: 'center',
  },
  picker: {
    height: 38,
    width: '100%',
  },
  tabelaContainer: {
    height: 250, 
    borderRadius: 8,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    backgroundColor: '#FFFFFF',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  headerRow: {
    flexDirection: 'row',
    backgroundColor: '#2C3E50',
    paddingVertical: 8,
    alignItems: 'center',
  },
  headerCell: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 11,
  },
  row: {
    flexDirection: 'row',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
  },
  alternateRow: {
    backgroundColor: '#F8FAFC',
  },
  cell: {
    flex: 1,
    textAlign: 'center',
    fontSize: 11,
    color: '#334155',
    paddingHorizontal: 2,
  },
  cellButtonContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  botao: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  textoBotao: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: 'bold',
  },
});