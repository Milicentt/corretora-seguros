import React, {useState, useEffect} from 'react';
import {Text, View, FlatList, Pressable, ScrollView, Alert, Image} from 'react-native';
import {Ionicons} from '@expo/vector-icons';
import {supabase} from '../lib/supabase';
import DetalhesScreen from './detalhesnav'; 
import CadastroComissionador from './cadastro-comissionador';
import TabelasScreen from './tabelas';
import {listaMenus} from './menuDados';
import {styles} from './navegacao.styles';
import CadastroComissoesScreen from './cadastroComissoes';

export default function HomeDashboard({aoSair}: {aoSair?: () => void}) {
  const [telaAtual, setTelaAtual] = useState('Menu');
  const [ehAdmin, setEhAdmin] = useState(false);
  const [nomeUsuario, setNomeUsuario] = useState('Corretor(a)');

  // Estados reais vazios aguardando conexao com o Supabase da colega
  const [ultimosLancamentos, setUltimosLancamentos] = useState<any[]>([]);
  const [totalMes, setTotalMes] = useState('R$ 0,00');
  const [repassesAbertos, setRepassesAbertos] = useState('0 corretores');

  // Verifica no Supabase se o usuario logado eh administrador e pega o nome dele
  useEffect(() => {
    if (telaAtual !== 'Menu') return;

    async function carregarPainel() {
      const {data: {user}} = await supabase.auth.getUser();
      if (!user) return;

      const admin =
        user.user_metadata?.role === 'admin' ||
        user.email === 'admin@corretora.example.com';

      if (admin) setEhAdmin(true);

      let nomeAtual = user.user_metadata?.nome || '';
      if (nomeAtual) {
        setNomeUsuario(nomeAtual);
      } else if (user.email === 'admin@corretora.example.com') {
        setNomeUsuario('Administrador');
      } else if (user.email) {
        setNomeUsuario(user.email.split('@')[0]);
      }

      // Busca as comissoes reais no Supabase
      let query = supabase.from('comissoes').select('*').order('id', {ascending: false});
      if (!admin && nomeAtual) {
        query = query.eq('produtor', nomeAtual);
      }

      const {data} = await query;
      if (data) {
        const somaTotal = data.reduce((acc, item) => acc + Number(item.valor_produtor || 0), 0);
        setTotalMes(`R$ ${somaTotal.toFixed(2).replace('.', ',')}`);

        const qtdPendentes = data.filter((item) => item.status === 'Pendente').length;
        setRepassesAbertos(`${qtdPendentes} pendente(s)`);

        const recentes = data.slice(0, 3).map((item) => ({
          id: item.id,
          cliente: item.cliente,
          parceiro: item.produtor,
          valor: `R$ ${Number(item.valor_produtor || 0).toFixed(2).replace('.', ',')}`,
        }));
        setUltimosLancamentos(recentes);
      }
    }

    carregarPainel();
  }, [telaAtual]);

  // Filtra os menus: esconde o cadastro de usuarios para corretores comuns
  const menusPermitidos = listaMenus.filter(
    (item) =>
      ehAdmin ||
      item.titulo === 'Cadastrar Comissões' ||
      item.titulo === 'Tabela de Comissões'
  );

  // Bloqueio de seguranca: para fazer com que apenas administradores acessam a tela de usuarios
  if (telaAtual === 'Cadastrar Usuários') {
    if (!ehAdmin) {
      Alert.alert('Acesso Negado', 'Apenas administradores podem cadastrar usuários.');
      setTelaAtual('Menu');
      return null;
    }

    return (
      <View style={{flex: 1}}>
        <Pressable style={styles.btnVoltarTopo} onPress={() => setTelaAtual('Menu')}>
          <Ionicons name="arrow-back-outline" size={24} color="#30356B" />
          <Text style={styles.txtVoltarTopo}>Voltar ao Painel</Text>
        </Pressable>
        <CadastroComissionador />
      </View>
    );
  }

  // Bloqueio no Pagamento de Comissoes para nao-admins
  if (telaAtual === 'Pagamento de Comissões' && !ehAdmin) {
    Alert.alert('Acesso Negado', 'Apenas administradores podem realizar pagamentos.');
    setTelaAtual('Menu');
    return null;
  }

  // Abre a tela de tabelas e pagamentos do outro amigo
  if (telaAtual === 'Tabela de Comissões' || telaAtual === 'Pagamento de Comissões') {
    return (
      <View style={{flex: 1}}>
        <Pressable style={styles.btnVoltarTopo} onPress={() => setTelaAtual('Menu')}>
          <Ionicons name="arrow-back-outline" size={24} color="#30356B" />
          <Text style={styles.txtVoltarTopo}>Voltar ao Painel</Text>
        </Pressable>
        <TabelasScreen ehAdmin={ehAdmin} modo={telaAtual}/>
      </View>
    );
  }

  // Desviar para o molde caso ainda nao tenha tela pronta
   if (telaAtual === 'Cadastrar Comissões') {
    return <CadastroComissoesScreen ehAdmin={ehAdmin} aoVoltar={() => setTelaAtual('Menu')} />;
  }

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
    <ScrollView style={styles.containerPrincipal} contentContainerStyle={{paddingBottom: 40}}>
      
      {/* Cabecalho com a logo oficial da corretora */}
      <View style={styles.cabecalho}>
        <Image
          source={require('../../assets/images/logo-corretora.png')}
          style={styles.logoPequena}
          resizeMode="contain"
          accessibilityLabel="Logo Rio do A Corretora de Seguros"
        />
        <Pressable 
          style={styles.btnSair} 
          onPress={() => { if (aoSair) aoSair(); }}
        >
          <Ionicons name="log-out-outline" size={16} color="#30356B" />
          <Text style={styles.txtSair}>Sair</Text>
        </Pressable>
      </View>

      <Text style={styles.tituloPrincipal}>Painel Principal</Text>
      <Text style={styles.textoDescricao}>Bem vindo, {nomeUsuario}. Selecione o botão que quiser usar.</Text>

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
        data={menusPermitidos}
        keyExtractor={(item) => String(item.id)}
        numColumns={2}
        scrollEnabled={false}
        columnWrapperStyle={styles.linhaGrade}
        renderItem={({item}) => (
          <Pressable 
            style={[styles.cartaoMenu, {borderLeftColor: item.cor}]} 
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
          <Text style={{color: '#807873', fontSize: 13, paddingVertical: 10}}>
            Nenhuma divisão registrada no banco de dados ainda.
          </Text>
        ) : (
             ultimosLancamentos.map((item) => (
            <View key={item.id} style={styles.itemRecente}>
              <View style={{flex: 1, paddingRight: 10}}>
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