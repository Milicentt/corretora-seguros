import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  containerPrincipal: {
    flex: 1,
    backgroundColor: '#F0FAFC',
    paddingHorizontal: 20,
    paddingTop: 50,
  },
  cabecalho: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  logoPequena: {
    width: 130,
    height: 45,
  },
  btnSair: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E1F1F6',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  txtSair: {
    color: '#30356B',
    fontSize: 13,
    fontWeight: '600',
    marginLeft: 4,
  },
  tituloPrincipal: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#30356B',
    marginBottom: 4,
  },
  textoDescricao: {
    fontSize: 14,
    color: '#807873',
    marginBottom: 20,
  },
  // Faixa de resumo rapido
  areaResumo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 22,
  },
  cardResumo: {
    backgroundColor: '#1688B5',
    width: '48%',
    borderRadius: 12,
    padding: 14,
    elevation: 2,
  },
  cardResumoSecundario: {
    backgroundColor: '#30356B',
    width: '48%',
    borderRadius: 12,
    padding: 14,
    elevation: 2,
  },
  labelResumo: {
    color: '#E1F1F6',
    fontSize: 12,
    marginBottom: 4,
  },
  valorResumo: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
  secaoTitulo: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#30356B',
    marginBottom: 12,
  },
  linhaGrade: {
    justifyContent: 'space-between',
  },
  cartaoMenu: {
    backgroundColor: '#FFFFFF',
    width: '48%',
    borderRadius: 12,
    padding: 18,
    marginBottom: 14,
    alignItems: 'center',
    justifyContent: 'center',
    borderLeftWidth: 5,
    elevation: 2,
  },
  espacoIcone: {
    marginBottom: 8,
  },
  textoCartao: {
    fontSize: 14,
    fontWeight: '600',
    color: '#30356B',
    textAlign: 'center',
  },
  // Area inferior para preencher o vazio
  areaRecentes: {
    marginTop: 8,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E1F1F6',
  },
  itemRecente: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#F0FAFC',
  },
  clienteRecente: {
    fontSize: 14,
    fontWeight: '600',
    color: '#30356B',
  },
  corretorRecente: {
    fontSize: 12,
    color: '#807873',
  },
  valorRecente: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#1688B5',
  },
  btnVoltarTopo: {
    paddingTop: 50,
    paddingHorizontal: 20,
    paddingBottom: 10,
    backgroundColor: '#F0FAFC',
    flexDirection: 'row',
    alignItems: 'center',
  },
  txtVoltarTopo: {
    marginLeft: 8,
    color: '#30356B',
    fontWeight: 'bold',
    fontSize: 16,
  },
});