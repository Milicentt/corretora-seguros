import React, { useState } from 'react';
import { Text, View, FlatList, Pressable, ScrollView, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import DetalhesScreen from './detalhesnav'; 
import CadastroComissionador from './cadastro-comissionador';
import TabelasScreen from './tabelas';
import { listaMenus } from './menuDados';
import { styles } from './navegacao.styles';

export default function HomeDashboard({ aoSair }: { aoSair?: () => void }) {
  const [telaAtual, setTelaAtual] = useState('Menu');

  // Estados reais vazios aguardando conexao com o Supabase da colega
  const [ultimosLancamentos, setUltimosLancamentos] = useState<any[]>([]);
  const [totalMes, setTotalMes] = useState('R$ 0,00');
  const [repassesAbertos, setRepassesAbertos] = useState('0 corretores');

  // Abre a tela de cadastro de usuarios que o colega fez
  if (telaAtual === 'Cadastrar Usuários') {
    return (
      <View style={{ flex: 1 }}>
        <Pressable style={styles.btnVoltarTopo} onPress={() => setTelaAtual('Menu')}>
          <Ionicons name="arrow-back-outline" size={24} color="#30356B" />
          <Text style={styles.txtVoltarTopo}>Voltar ao Painel</Text>
        </Pressable>
        <CadastroComissionador />
      </View>
    );
  }

  // Abre a tela de tabelas e pagamentos do outro amigo
  if (telaAtual === 'Tabela de Comissões' || telaAtual === 'Pagamento de Comissões') {
    return (
      <View style={{ flex: 1 }}>
        <Pressable style={styles.btnVoltarTopo} onPress={() => setTelaAtual('Menu')}>
          <Ionicons name="arrow-back-outline" size={24} color="#30356B" />
          <Text style={styles.txtVoltarTopo}>Voltar ao Painel</Text>
        </Pressable>
        <TabelasScreen />
      </View>
    );
  }

  // Desviar para o molde caso ainda nao tenha tela pronta
  if (telaAtual !== 'Menu') {
    return (
      <DetalhesScreen 
        rota={telaAtual} 
        aoVoltar={() => setTelaAtual('Menu')} 
      />
    );
  }

  // Gambiarra temporaria pro TS parar de reclamar do nome do icone
  const renderizarIcone = (nomeIcone: string, cor: string) => {
    return <Ionicons name={nomeIcone as any} size={28} color={cor} style={styles.espacoIcone} />;
  };

  return (
    <ScrollView style={styles.containerPrincipal} contentContainerStyle={{ paddingBottom: 40 }}>
      
      {/* Cabecalho usando a classe cabecalho do seu styles */}
      <View style={styles.cabecalho}>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <Ionicons name="shield-checkmark" size={24} color="#1688B5" />
          <Text style={{ fontSize: 16, fontWeight: 'bold', color: '#1688B5', marginLeft: 8 }}>
            Rio do A Corretora
          </Text>
        </View>
          <Pressable 
          style={styles.btnSair} 
          onPress={() => { if (aoSair) aoSair(); }}
        >
          <Ionicons name="log-out-outline" size={16} color="#30356B" />
          <Text style={styles.txtSair}>Sair</Text>
        </Pressable>
      </View>

      <Text style={styles.tituloPrincipal}>Painel Principal</Text>
      <Text style={styles.textoDescricao}>Bem vindo (tal pessoa). Selecione o botão que quiser usar.</Text>

      {/* Cards de resumo financeiro */}
      <View style={styles.areaResumo}>
        <View style={styles.cardResumo}>
          <Text style={styles.labelResumo}>Total no Mês</Text>
          <Text style={styles.valorResumo}>{totalMes}</Text>
        </View>
        <View style={styles.cardResumoSecundario}>
          <Text style={styles.labelResumo}>Repasses Abertos</Text>
          <Text style={styles.valorResumo}>{repassesAbertos}</Text>
        </View>
      </View>
      <Text style={styles.secaoTitulo}>Módulos do Sistema</Text>

      <FlatList
        data={listaMenus}
        keyExtractor={(item) => String(item.id)}
        numColumns={2}
        scrollEnabled={false}
        columnWrapperStyle={styles.linhaGrade}
        renderItem={({ item }) => (
          <Pressable 
            style={[styles.cartaoMenu, { borderLeftColor: item.cor }]} 
            onPress={() => setTelaAtual(item.titulo)}
          >
            {renderizarIcone(item.icone, item.cor)}
            <Text style={styles.textoCartao}>{item.titulo}</Text>
          </Pressable>
        )}
      />

        {/* Area inferior preparada pro supa */}
      <View style={styles.areaRecentes}>
        <Text style={styles.secaoTitulo}>Últimas Divisões</Text>
        
        {ultimosLancamentos.length === 0 ? (
          <Text style={{ color: '#807873', fontSize: 13, paddingVertical: 10 }}>
            Nenhuma divisão registrada no banco de dados ainda.
          </Text>
        ) : (
          ultimosLancamentos.map((item) => (
            <View key={item.id} style={styles.itemRecente}>
              <View>
                <Text style={styles.clienteRecente}>{item.cliente}</Text>
                <Text style={styles.corretorRecente}>Parceiro: {item.parceiro}</Text>
              </View>
              <Text style={styles.valorRecente}>{item.valor}</Text>
            </View>
          ))
        )}
      </View>

    </ScrollView>
  );
}