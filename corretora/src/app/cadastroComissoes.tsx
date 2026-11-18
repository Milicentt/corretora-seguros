import React, {useState, useEffect} from 'react';
import {Text, View, TextInput, Pressable, Alert, Linking, ScrollView, Share} from 'react-native';
import {Ionicons} from '@expo/vector-icons';
import {supabase} from '../lib/supabase';
import {styles} from './cadastroComissoes.styles';

// Funcao pura isolada e Base para os testes unitarios
export function calcularComissaoParcelada(valor: number, porcentagem: number, parcelas: number) {
  if (!valor || !porcentagem) return {totalProdutor: 0, valorParcela: 0};
  const totalProdutor = (valor * porcentagem) / 100;
  const qtdParcelas = parcelas > 0 ? parcelas : 1;
  return {
    totalProdutor,
    valorParcela: totalProdutor / qtdParcelas,
  };
}

export default function CadastroComissoesScreen({aoVoltar}: {aoVoltar: () => void}) {
  const [produtores, setProdutores] = useState<any[]>([]);
  const [produtorSelecionado, setProdutorSelecionado] = useState<any>(null);
  const [cliente, setCliente] = useState('');
  const [valorComissao, setValorComissao] = useState('');
  const [porcentagem, setPorcentagem] = useState('');
  const [parcelas, setParcelas] = useState('1');
  const [dataVenda, setDataVenda] = useState(new Date().toLocaleDateString('pt-BR'));
  const [salvando, setSalvando] = useState(false);

  // Busca os produtores reais cadastrados no Supabase
  useEffect(() => {
    async function buscarProdutores() {
      const {data} = await supabase.from('comissionadores').select('*');
      if (data) setProdutores(data);
    }
    buscarProdutores();
  }, []);

  // Preenche a porcentagem automatica ao tocar no produtor
  function selecionarProdutor(item: any) {
    setProdutorSelecionado(item);
    setPorcentagem(String(item.porcentagem_padrao || ''));
  }

  // Recurso do celular: abrir WhatsApp via Linking
    function notificarWhatsApp(total: number, parcelaValor: number, qtdParcelas: number) {
    if (!produtorSelecionado?.telefone) return;

    const textoParcela = qtdParcelas > 1
      ? `em ${qtdParcelas}x de R$ ${parcelaValor.toFixed(2)} (esgotamento)`
      : 'à vista';

    const mensagem = `Olá ${produtorSelecionado.nome}! Nova comissão lançada do cliente ${cliente}. Seu total é R$ ${total.toFixed(2)} (${textoParcela}).`;
    const url = `whatsapp://send?phone=55${produtorSelecionado.telefone}&text=${encodeURIComponent(mensagem)}`;

    Linking.canOpenURL(url).then((suportado) => {
      if (suportado) {
        Linking.openURL(url);
      } else {
        Alert.alert('Aviso', 'Comissão salva, mas o WhatsApp não está instalado neste aparelho.');
      }
    });
  }

  // Segundo recurso nativo: bandeja oficial de compartilhamento do celular
  async function compartilharComprovante(total: number, parcelaValor: number, qtdParcelas: number) {
    const textoParcela = qtdParcelas > 1
      ? `em ${qtdParcelas}x de R$ ${parcelaValor.toFixed(2)}`
      : 'à vista';

    const nomeProdutor = produtorSelecionado?.nome || 'Não selecionado';
    const nomeCliente = cliente.trim() || 'Não informado';
    const resumo = `Comprovante - Rio do A Corretora\nProdutor: ${nomeProdutor}\nCliente: ${nomeCliente}\nRepasse: R$ ${total.toFixed(2)} (${textoParcela})`;

    try {
      await Share.share({message: resumo});
    } catch {
      Alert.alert('Aviso', 'Não foi possível abrir o compartilhamento.');
    }
  }

  async function salvarComissao() {
    if (salvando) return;

    if (!produtorSelecionado || !cliente.trim() || !valorComissao.trim() || !porcentagem.trim()) {
      Alert.alert('Atenção', 'Selecione o produtor e preencha cliente, valor e porcentagem.');
      return;
    }

    const valorNum = parseFloat(valorComissao.replace(',', '.'));
    const porcentagemNum = parseFloat(porcentagem.replace(',', '.'));
    const parcelasNum = parseInt(parcelas, 10) || 1;

    const {totalProdutor, valorParcela} = calcularComissaoParcelada(valorNum, porcentagemNum, parcelasNum);

    setSalvando(true);

      try {
      const {error} = await supabase.from('comissoes').insert([
        {
          cliente: cliente.trim(),
          produtor: produtorSelecionado.nome,
          valor_comissao: valorNum,
          porcentagem_produtor: porcentagemNum,
          valor_produtor: totalProdutor,
          parcelas: parcelasNum,
          valor_parcela: valorParcela,
          data_venda: dataVenda.trim() || new Date().toLocaleDateString('pt-BR'),
          status: 'Pendente',
        },
      ]);

      if (error) {
        Alert.alert('Erro no Banco', 'Não foi possível salvar: ' + error.message);
        return;
      }

      Alert.alert('Sucesso', 'Comissão registrada no banco de dados!');
      notificarWhatsApp(totalProdutor, valorParcela, parcelasNum);

      // Limpa os campos para o proximo lancamento
      setCliente('');
      setValorComissao('');
      setParcelas('1');
    } catch {
      Alert.alert('Erro', 'Falha na conexão ao tentar salvar.');
    } finally {
      setSalvando(false);
    }
  }

  // Previa em tempo real na tela
  const previa = calcularComissaoParcelada(
    parseFloat(valorComissao.replace(',', '.')) || 0,
    parseFloat(porcentagem.replace(',', '.')) || 0,
    parseInt(parcelas, 10) || 1
  );

  return (
    <ScrollView style={styles.container} contentContainerStyle={{paddingBottom: 120}}>
      <Pressable
        style={styles.btnVoltar}
        onPress={aoVoltar}
        accessibilityRole="button"
        accessibilityLabel="Voltar ao painel principal"
      >
        <Ionicons name="arrow-back-outline" size={24} color="#30356B" />
        <Text style={styles.txtVoltar}>Voltar ao Painel</Text>
      </Pressable>

      <Text style={styles.titulo}>Lançar Comissão</Text>
      <Text style={styles.subtitulo}>Selecione o produtor e informe os dados da apólice.</Text>

      <Text style={styles.label}>Produtor Parceiro *</Text>
      <View style={styles.listaProdutores}>
        {produtores.length === 0 ? (
          <Text style={{color: '#807873', fontSize: 13}}>
            Nenhum produtor cadastrado no banco ainda.
          </Text>
        ) : (
          produtores.map((item) => {
            const ativo = produtorSelecionado?.id === item.id;
            return (
              <Pressable
                key={item.id}
                style={[styles.chipProdutor, ativo && styles.chipProdutorAtivo]}
                onPress={() => selecionarProdutor(item)}
              >
                <Text style={[styles.txtChip, ativo && styles.txtChipAtivo]}>
                  {item.nome} ({item.porcentagem_padrao}%)
                </Text>
              </Pressable>
            );
          })
        )}
      </View>

      <Text style={styles.label}>Nome do Cliente *</Text>
      <TextInput
        style={styles.input}
        placeholder="Ex: Carlos Eduardo"
        accessibilityLabel="Campo para nome do cliente"
        value={cliente}
        onChangeText={setCliente}
      />

      <Text style={styles.label}>Valor Total da Comissão (R$) *</Text>
      <TextInput
        style={styles.input}
        placeholder="Ex: 1500"
        keyboardType="numeric"
        accessibilityLabel="Campo para valor total da comissão"
        value={valorComissao}
        onChangeText={setValorComissao}
      />

      <Text style={styles.label}>Porcentagem do Produtor (%) *</Text>
      <TextInput
        style={styles.input}
        placeholder="Ex: 30"
        keyboardType="numeric"
        accessibilityLabel="Campo para porcentagem do produtor"
        value={porcentagem}
        onChangeText={setPorcentagem}
      />

      <Text style={styles.label}>Quantidade de Parcelas (1 = À vista)</Text>
      <TextInput
        style={styles.input}
        placeholder="Ex: 1 ou 4"
        keyboardType="numeric"
        accessibilityLabel="Campo para quantidade de parcelas"
        value={parcelas}
        onChangeText={setParcelas}
      />
  <Text style={styles.label}>Data da Venda / 1ª Parcela *</Text>
   <TextInput
     style={styles.input}
     placeholder="Ex: 18/11/2026"
     keyboardType="numeric"
     accessibilityLabel="Campo para data da venda ou vencimento"
     value={dataVenda}
     onChangeText={setDataVenda}
   />
      <View style={styles.caixaResumoCalculo}>
        <Text style={styles.txtResumoCalculo}>
          Total do Produtor: <Text style={styles.valorDestaque}>R$ {previa.totalProdutor.toFixed(2)}</Text>
        </Text>
        <Text style={styles.txtResumoCalculo}>
          Repasse por Parcela ({parseInt(parcelas, 10) || 1}x): R$ {previa.valorParcela.toFixed(2)}
        </Text>
      </View>

      <Pressable
        style={styles.botaoSalvar}
        onPress={salvarComissao}
        accessibilityRole="button"
        accessibilityLabel="Salvar comissão e notificar produtor no WhatsApp"
      >
        <Ionicons name="checkmark-circle-outline" size={20} color="#FFFFFF" style={{marginRight: 8}} />
        <Text style={styles.txtBotao}>
          {salvando ? 'Salvando...' : 'Salvar e Notificar'}
        </Text>
      </Pressable>
      <Pressable
  style={[styles.botaoSalvar, {backgroundColor: '#30356B', marginTop: 12}]}
  onPress={() => compartilharComprovante(previa.totalProdutor, previa.valorParcela, parseInt(parcelas, 10) || 1)}
  accessibilityRole="button"
  accessibilityLabel="Compartilhar resumo do cálculo"
>
  <Ionicons name="share-social-outline" size={20} color="#FFFFFF" style={{marginRight: 8}} />
  <Text style={styles.txtBotao}>Compartilhar Resumo</Text>
</Pressable>
    </ScrollView>
  );
}