import React, {useState, useEffect} from 'react';
import {Text, View, TextInput, Pressable, Alert, Linking, ScrollView, Share} from 'react-native';
import {Ionicons} from '@expo/vector-icons';
import {supabase} from '../lib/supabase';
import {styles} from './cadastroComissoes.styles';

// Regra exata do esgotamento ditada pela corretora:
// >= 1 recebe parcela inteira; > 0 e < 1 recebe essa fracao; <= 0 nao recebe nada
export function calcularProximoRepasseEsgotamento(saldoParcelas: number, valorParcelaBase: number) {
  if (saldoParcelas >= 1) {
    return {
      valorPagar: valorParcelaBase,
      novoSaldo: Number((saldoParcelas - 1).toFixed(2)),
      descricao: '1 parcela inteira (100%)',
    };
  }
  if (saldoParcelas > 0) {
    return {
      valorPagar: Number((valorParcelaBase * saldoParcelas).toFixed(2)),
      novoSaldo: 0,
      descricao: `${Math.round(saldoParcelas * 100)}% da parcela`,
    };
  }
  return {
    valorPagar: 0,
    novoSaldo: 0,
    descricao: 'Esgotado (R$ 0,00)',
  };
}

// Funcao pura com a formula real validada com a corretora: P / (100 / C)
export function calcularComissaoParcelada(
  valorSeguro: number,
  comissaoSeguradora: number,
  porcentagemProdutor: number,
  parcelasCliente: number,
  modoEsgotamento: boolean
) {
  if (!valorSeguro || !comissaoSeguradora || !porcentagemProdutor) {
    return {
      comissaoCorretora: 0,
      totalProdutor: 0,
      parcelasEsgotamento: 1,
      valorParcelaProdutor: 0,
    };
  }

  const comissaoCorretora = (valorSeguro * comissaoSeguradora) / 100;
  const totalProdutor = (comissaoCorretora * porcentagemProdutor) / 100;
  const qtdParcelas = parcelasCliente > 0 ? parcelasCliente : 1;
  const parcelaCliente = valorSeguro / qtdParcelas;

  const parcelasEsgotamento = modoEsgotamento
    ? Number((qtdParcelas / (100 / comissaoSeguradora)).toFixed(2))
    : 1;

    const valorParcelaCheiaProdutor = (parcelaCliente * porcentagemProdutor) / 100;
  const valorParcelaProdutor = modoEsgotamento
    ? Math.min(totalProdutor, valorParcelaCheiaProdutor)
    : totalProdutor;

  return {
    comissaoCorretora,
    totalProdutor,
    parcelasEsgotamento,
    valorParcelaProdutor,
  };
}

export default function CadastroComissoesScreen({
  ehAdmin = false,
  aoVoltar,
}: {
  ehAdmin?: boolean;
  aoVoltar: () => void;
}) {
  const [produtores, setProdutores] = useState<any[]>([]);
  const [produtorSelecionado, setProdutorSelecionado] = useState<any>(null);
  const [cliente, setCliente] = useState('');
  const [valorSeguro, setValorSeguro] = useState('');
  const [comissaoSeguradora, setComissaoSeguradora] = useState('20');
  const [porcentagemProdutor, setPorcentagemProdutor] = useState('');
  const [parcelas, setParcelas] = useState('1');
  const [modoEsgotamento, setModoEsgotamento] = useState(false);
  const [dataVenda, setDataVenda] = useState(new Date().toLocaleDateString('pt-BR'));
  const [salvando, setSalvando] = useState(false);

  // Busca produtores e trava a selecao caso o usuario logado seja um produtor comum
    useEffect(() => {
    async function carregarProdutoresEPerfil() {
      const {data: {user}} = await supabase.auth.getUser();
      const adminConfirmado =
        ehAdmin ||
        user?.user_metadata?.role === 'admin' ||
        user?.email === 'admin@corretora.example.com';

      const {data} = await supabase.from('comissionadores').select('*');
      if (data) {
        if (adminConfirmado) {
          setProdutores(data);
        } else if (user) {
          const meuPerfil = data.find(
            (p) => p.user_id === user.id || p.nome === user.user_metadata?.nome
          );
          if (meuPerfil) {
            setProdutores([meuPerfil]);
            setProdutorSelecionado(meuPerfil);
            setPorcentagemProdutor(String(meuPerfil.porcentagem_padrao || ''));
          }
        }
      }
    }
    carregarProdutoresEPerfil();
  }, [ehAdmin]);

  function selecionarProdutor(item: any) {
    if (!ehAdmin) return;
    setProdutorSelecionado(item);
    setPorcentagemProdutor(String(item.porcentagem_padrao || ''));
  }

  // Corrige o texto do WhatsApp para respeitar tanto Esgotamento quanto Parcelamento comum
   function notificarWhatsApp(total: number, parcelaValor: number, qtdEsgotamento: number) {
    if (!produtorSelecionado?.telefone) return;

    const textoModalidade = modoEsgotamento
      ? `via Esgotamento (${qtdEsgotamento} parcela(s) base de R$ ${parcelaValor.toFixed(2)})`
      : 'via Pagamento Total (à vista)';

    const mensagem = `Olá ${produtorSelecionado.nome}! Nova comissão lançada do cliente ${cliente}. Seu total é R$ ${total.toFixed(2)} ${textoModalidade}.`;
    const url = `whatsapp://send?phone=55${produtorSelecionado.telefone}&text=${encodeURIComponent(mensagem)}`;

    Linking.canOpenURL(url).then((suportado) => {
      if (suportado) {
        Linking.openURL(url);
      } else {
        Alert.alert('Aviso', 'Comissão salva, mas o WhatsApp não está instalado neste aparelho.');
      }
    });
  }

    async function compartilharComprovante(total: number, parcelaValor: number, qtdEsgotamento: number) {
    const textoModalidade = modoEsgotamento
      ? `Esgotamento (${qtdEsgotamento} parcela(s) base de R$ ${parcelaValor.toFixed(2)})`
      : 'Pagamento Total (à vista)';

    const nomeProdutor = produtorSelecionado?.nome || 'Não selecionado';
    const nomeCliente = cliente.trim() || 'Não informado';
    const resumo = `Comprovante - Rio do A Corretora\nProdutor: ${nomeProdutor}\nCliente: ${nomeCliente}\nModalidade: ${textoModalidade}\nRepasse Total: R$ ${total.toFixed(2)}`;

    try {
      await Share.share({message: resumo});
    } catch {
      Alert.alert('Aviso', 'Não foi possível abrir o compartilhamento.');
    }
  }

  async function salvarComissao() {
    if (salvando) return;

    if (!produtorSelecionado || !cliente.trim() || !valorSeguro.trim() || !porcentagemProdutor.trim()) {
      Alert.alert('Atenção', 'Selecione o produtor e preencha cliente, valor do seguro e porcentagem.');
      return;
    }

    const seguroNum = parseFloat(valorSeguro.replace(',', '.'));
    const seguradoraPct = parseFloat(comissaoSeguradora.replace(',', '.')) || 20;
    const produtorPct = parseFloat(porcentagemProdutor.replace(',', '.'));
    const parcelasNum = parseInt(parcelas, 10) || 1;

    const calc = calcularComissaoParcelada(
      seguroNum,
      seguradoraPct,
      produtorPct,
      parcelasNum,
      modoEsgotamento
    );

    const parcelasFinais = modoEsgotamento ? Math.ceil(calc.parcelasEsgotamento) : 1;

    setSalvando(true);

    try {
      const {error} = await supabase.from('comissoes').insert([
        {
          cliente: cliente.trim(),
          produtor: produtorSelecionado.nome,
          valor_comissao: calc.comissaoCorretora,
          porcentagem_produtor: produtorPct,
          valor_produtor: calc.totalProdutor,
          parcelas: parcelasFinais,
          valor_parcela: calc.valorParcelaProdutor,
          data_venda: dataVenda.trim() || new Date().toLocaleDateString('pt-BR'),
          status: 'Pendente',
        },
      ]);

      if (error) {
        Alert.alert('Erro no Banco', 'Não foi possível salvar: ' + error.message);
        return;
      }

      Alert.alert('Sucesso', 'Comissão registrada no banco de dados!');
      notificarWhatsApp(calc.totalProdutor, calc.valorParcelaProdutor, calc.parcelasEsgotamento);

      setCliente('');
      setValorSeguro('');
      setParcelas('1');
      setDataVenda(new Date().toLocaleDateString('pt-BR'));
    } catch {
      Alert.alert('Erro', 'Falha na conexão ao tentar salvar.');
    } finally {
      setSalvando(false);
    }
  }

  const parcelasDigitadas = parseInt(parcelas, 10) || 1;

  const previa = calcularComissaoParcelada(
    parseFloat(valorSeguro.replace(',', '.')) || 0,
    parseFloat(comissaoSeguradora.replace(',', '.')) || 0,
    parseFloat(porcentagemProdutor.replace(',', '.')) || 0,
    parcelasDigitadas,
    modoEsgotamento
  );

  const primeiraParcelaInfo = calcularProximoRepasseEsgotamento(
    previa.parcelasEsgotamento,
    previa.valorParcelaProdutor
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
      <Text style={styles.subtitulo}>
        {ehAdmin
          ? 'Selecione o produtor e a modalidade da seguradora.'
          : 'Preencha os dados da sua venda para registrar sua comissão.'}
      </Text>

      <Text style={styles.label}>Produtor Parceiro *</Text>
      <View style={styles.listaProdutores}>
        {produtores.length === 0 ? (
          <Text style={{color: '#807873', fontSize: 13}}>
            Nenhum produtor vinculado à sua conta.
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

      <Text style={styles.label}>Modalidade de Repasse *</Text>
      <View style={styles.listaProdutores}>
        <Pressable
          style={[styles.chipProdutor, !modoEsgotamento && styles.chipProdutorAtivo]}
          onPress={() => setModoEsgotamento(false)}
        >
          <Text style={[styles.txtChip, !modoEsgotamento && styles.txtChipAtivo]}>
            Pagamento Total
          </Text>
        </Pressable>
        <Pressable
          style={[styles.chipProdutor, modoEsgotamento && styles.chipProdutorAtivo]}
          onPress={() => setModoEsgotamento(true)}
        >
          <Text style={[styles.txtChip, modoEsgotamento && styles.txtChipAtivo]}>
            Esgotamento
          </Text>
        </Pressable>
      </View>

      <Text style={styles.label}>Nome do Cliente *</Text>
      <TextInput
        style={styles.input}
        placeholder="Ex: Carlos Eduardo"
        accessibilityLabel="Campo para nome do cliente"
        value={cliente}
        onChangeText={setCliente}
      />

      <Text style={styles.label}>Valor Total do Seguro (R$) *</Text>
      <TextInput
        style={styles.input}
        placeholder="Ex: 2400"
        keyboardType="numeric"
        accessibilityLabel="Campo para valor total do seguro"
        value={valorSeguro}
        onChangeText={setValorSeguro}
      />

      <Text style={styles.label}>Comissão da Seguradora (%) *</Text>
      <TextInput
        style={styles.input}
        placeholder="Ex: 20"
        keyboardType="numeric"
        accessibilityLabel="Campo para porcentagem de comissao da seguradora"
        value={comissaoSeguradora}
        onChangeText={setComissaoSeguradora}
      />

      <Text style={styles.label}>Porcentagem do Produtor (%) *</Text>
      <TextInput
        style={styles.input}
        placeholder="Ex: 50"
        keyboardType="numeric"
        editable={ehAdmin}
        accessibilityLabel="Campo para porcentagem do produtor"
        value={porcentagemProdutor}
        onChangeText={setPorcentagemProdutor}
      />

        {modoEsgotamento && (
     <>
       <Text style={styles.label}>Parcelas do Cliente (P)</Text>
       <TextInput
         style={styles.input}
         placeholder="Ex: 10"
         keyboardType="numeric"
         accessibilityLabel="Campo para quantidade de parcelas do cliente"
         value={parcelas}
         onChangeText={setParcelas}
       />
     </>
   )}

      <Text style={styles.label}>Data da Venda / 1ª Parcela *</Text>
      <TextInput
        style={styles.input}
        placeholder="Ex: 23/11/2026"
        keyboardType="numeric"
        accessibilityLabel="Campo para data da venda ou vencimento"
        value={dataVenda}
        onChangeText={setDataVenda}
      />

         <View style={styles.caixaResumoCalculo}>
        <Text style={styles.txtResumoCalculo}>
          Comissão da Corretora: R$ {previa.comissaoCorretora.toFixed(2)}
        </Text>
        <Text style={styles.txtResumoCalculo}>
          Total do Produtor: <Text style={styles.valorDestaque}>R$ {previa.totalProdutor.toFixed(2)}</Text>
        </Text>
        {modoEsgotamento && (
          <>
            <Text style={styles.txtResumoCalculo}>
              Índice de Esgotamento: {previa.parcelasEsgotamento} parcela(s)
            </Text>
            <Text style={styles.txtResumoCalculo}>
              1º Repasse: R$ {primeiraParcelaInfo.valorPagar.toFixed(2)} ({primeiraParcelaInfo.descricao})
            </Text>
          </>
        )}
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
         onPress={() =>
       compartilharComprovante(
         previa.totalProdutor,
         previa.valorParcelaProdutor,
         previa.parcelasEsgotamento
       )
     }
        accessibilityRole="button"
        accessibilityLabel="Compartilhar resumo do cálculo"
      >
        <Ionicons name="share-social-outline" size={20} color="#FFFFFF" style={{marginRight: 8}} />
        <Text style={styles.txtBotao}>Compartilhar Resumo</Text>
      </Pressable>
    </ScrollView>
  );
}
