import React, {useState, useEffect} from 'react';
import {Text, Linking, View, FlatList, Pressable, ScrollView, Alert, Vibration} from 'react-native';
import {Picker} from '@react-native-picker/picker';
import {supabase} from '../lib/supabase';
import {styles} from './tabelas.styles';

export default function TabelasScreen({
  ehAdmin = false,
  modo = 'Tabela de Comissões',
}: {
  ehAdmin?: boolean;
  modo?: string;
}) {
  const [comissoes, setComissoes] = useState<any[]>([]);
  const [produtores, setProdutores] = useState<string[]>([]);
  const [produtorFiltro, setProdutorFiltro] = useState('Todos');
  const [nomeProdutorLogado, setNomeProdutorLogado] = useState('');
  const [carregando, setCarregando] = useState(true);

  // Busca as comissoes reais do Supabase respeitando a permissao recebida
  async function carregarDados() {
    setCarregando(true);
    try {
      const {data: {user}} = await supabase.auth.getUser();

      let query = supabase.from('comissoes').select('*').order('id', {ascending: false});

      // Se NAO for admin, filtra obrigatoriamente pelo nome do produtor logado
      if (!ehAdmin && user) {
        let nomeUser = user.user_metadata?.nome || '';

        if (!nomeUser) {
          const {data: perfil} = await supabase
            .from('comissionadores')
            .select('nome')
            .eq('user_id', user.id)
            .single();
          if (perfil?.nome) nomeUser = perfil.nome;
        }

        setNomeProdutorLogado(nomeUser || 'Produtor');
        query = query.eq('produtor', nomeUser || 'SEM_VINCULO');
      }

      const {data, error} = await query;
      if (error) {
        Alert.alert('Erro', 'Não foi possível carregar as comissões: ' + error.message);
        return;
      }

      if (data) {
        setComissoes(data);
        const listaUnica = Array.from(new Set(data.map((item) => item.produtor)));
        setProdutores(['Todos', ...listaUnica]);
      }
    } finally {
      setCarregando(false);
    }
  }

  useEffect(() => {
    carregarDados();
  }, [ehAdmin]);

  // Funcao exclusiva do administrador para dar baixa no pagamento
   async function marcarComoPago(item: any) {
    const {error} = await supabase
      .from('comissoes')
      .update({status: 'Pago'})
      .eq('id', item.id);

    if (error) {
      Alert.alert('Erro', 'Não foi possível atualizar o status: ' + error.message);
      return;
    }

    // Busca o telefone do produtor para notificar o pagamento no WhatsApp
    const {data: produtorDados} = await supabase
      .from('comissionadores')
      .select('telefone')
      .eq('nome', item.produtor)
      .single();

    const valorPago = Number(item.valor_parcela || item.valor_produtor || 0).toFixed(2);

    if (produtorDados?.telefone) {
      const textoParcela = item.parcelas > 1
        ? `da parcela no valor de R$ ${valorPago}`
        : `no valor total de R$ ${Number(item.valor_produtor).toFixed(2)}`;

      const msg = `Olá ${item.produtor}! A Rio do A Corretora informa que foi realizado o pagamento referente ao cliente ${item.cliente} ${textoParcela}.`;
      const url = `whatsapp://send?phone=55${produtorDados.telefone}&text=${encodeURIComponent(msg)}`;

      Linking.canOpenURL(url).then((suportado) => {
        if (suportado) {
          Linking.openURL(url);
        }
      });
    }
    Vibration.vibrate([0, 150, 100, 150]); // Vibração dupla de confirmação de pagamento
    Alert.alert('Baixa Realizada', `Pagamento referente ao cliente ${item.cliente} registrado!`);
    carregarDados();
  }

  const dadosFiltrados = comissoes.filter((item) => {
    if (!ehAdmin) return true;
    if (produtorFiltro === 'Todos') return true;
    return item.produtor === produtorFiltro;
  });

  const pendentes = dadosFiltrados.filter((item) => item.status === 'Pendente');
  const totalReceber = pendentes.reduce((soma, item) => soma + Number(item.valor_produtor || 0), 0);
  const ehTelaPagamento = ehAdmin && modo === 'Pagamento de Comissões';

  return (
    <ScrollView style={styles.container} contentContainerStyle={{paddingBottom: 120}}>
      <Text style={styles.titulo}>
        {ehTelaPagamento
          ? 'Pagamento de Comissões'
          : ehAdmin
          ? 'Tabela de Comissões'
          : `Minhas Comissões (${nomeProdutorLogado})`}
      </Text>

      {/* Seletor visivel apenas para o administrador */}
      {ehAdmin && (
        <View style={styles.caixaPicker}>
          <Picker
            selectedValue={produtorFiltro}
            onValueChange={(valor) => setProdutorFiltro(valor)}
            style={styles.picker}
            accessibilityLabel="Selecionar produtor para filtrar comissões"
          >
            {produtores.map((nome) => (
              <Picker.Item key={nome} label={`Produtor: ${nome}`} value={nome} />
            ))}
          </Picker>
        </View>
      )}

      {ehTelaPagamento ? (
        /* MODO PAGAMENTO: Mostra apenas os repasses pendentes com botao de baixa */
        <>
          <Text style={styles.subtitulo}>Repasses Pendentes ({pendentes.length})</Text>
          <View style={styles.cardTabela}>
            <View style={styles.cabecalhoTabela}>
              <Text style={[styles.celulaCabecalho, {flex: 2}]}>Cliente / Data</Text>
              <Text style={[styles.celulaCabecalho, {flex: 1.5}]}>Parcelas</Text>
              <Text style={[styles.celulaCabecalho, {flex: 1.5}]}>Repasse</Text>
              <Text style={[styles.celulaCabecalho, {flex: 1.2, textAlign: 'center'}]}>Ação</Text>
            </View>

            {pendentes.length === 0 ? (
              <Text style={styles.textoVazio}>
                {carregando ? 'Carregando dados...' : 'Nenhum repasse pendente para pagar.'}
              </Text>
            ) : (
              <FlatList
                data={pendentes}
                keyExtractor={(item) => String(item.id)}
                scrollEnabled={false}
                renderItem={({item}) => (
                  <View style={styles.linhaTabela}>
                    <View style={{flex: 2}}>
                      <Text style={styles.textoCliente}>{item.cliente}</Text>
                      <Text style={styles.textoSecundario}>
                        {item.produtor} {item.data_venda ? `• ${item.data_venda}` : ''}
                      </Text>
                    </View>

                    <Text style={[styles.celulaTexto, {flex: 1.5}]}>
                      {item.parcelas > 1
                        ? `${item.parcelas}x R$ ${Number(item.valor_parcela).toFixed(2)}`
                        : 'À vista'}
                    </Text>

                    <Text style={[styles.textoValor, {flex: 1.5}]}>
                      R$ {Number(item.valor_produtor).toFixed(2)}
                    </Text>

                    <View style={{flex: 1.2, alignItems: 'center'}}>
                      <Pressable
                        style={styles.btnPagar}
                        onPress={() => marcarComoPago(item)}
                        accessibilityRole="button"
                        accessibilityLabel={`Confirmar pagamento de ${item.cliente}`}
                      >
                        <Text style={styles.txtBtnPagar}>Pagar</Text>
                      </Pressable>
                    </View>
                  </View>
                )}
              />
            )}

            <View style={styles.rodapeTotal}>
              <Text style={styles.txtTotal}>Total a Pagar: R$ {totalReceber.toFixed(2)}</Text>
            </View>
          </View>
        </>
      ) : (
        /* MODO CONSULTA (TABELA): Mostra o historico completo de vendas e status */
        <>
          <Text style={styles.subtitulo}>Histórico Completo ({dadosFiltrados.length})</Text>
          <View style={styles.cardTabela}>
            <View style={styles.cabecalhoTabela}>
              <Text style={[styles.celulaCabecalho, {flex: 2}]}>Cliente / Produtor</Text>
              <Text style={[styles.celulaCabecalho, {flex: 1.5}]}>Repasse</Text>
              <Text style={[styles.celulaCabecalho, {flex: 1.2, textAlign: 'right'}]}>Status</Text>
            </View>

            {dadosFiltrados.length === 0 ? (
              <Text style={styles.textoVazio}>
                {carregando ? 'Carregando dados...' : 'Nenhum registro encontrado no banco.'}
              </Text>
            ) : (
              <FlatList
                data={dadosFiltrados}
                keyExtractor={(item) => String(item.id)}
                scrollEnabled={false}
                renderItem={({item}) => (
                  <View style={styles.linhaTabela}>
                    <View style={{flex: 2}}>
                      <Text style={styles.textoCliente}>{item.cliente}</Text>
                      <Text style={styles.textoSecundario}>
                        {item.produtor} {item.data_venda ? `(${item.data_venda})` : ''}
                      </Text>
                    </View>

                    <Text style={[styles.celulaTexto, {flex: 1.5}]}>
                      R$ {Number(item.valor_produtor).toFixed(2)}
                    </Text>

                    <Text
                      style={[
                        styles.badgeStatus,
                        {flex: 1.2, textAlign: 'right'},
                        item.status === 'Pago' ? styles.statusPago : styles.statusPendente,
                      ]}
                    >
                      {item.status}
                    </Text>
                  </View>
                )}
              />
            )}
          </View>
        </>
      )}
    </ScrollView>
  );
}