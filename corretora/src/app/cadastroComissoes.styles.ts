import {StyleSheet} from 'react-native';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F0FAFC',
    padding: 20,
    paddingTop: 50,
  },
  btnVoltar: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  txtVoltar: {
    color: '#30356B',
    marginLeft: 8,
    fontWeight: 'bold',
    fontSize: 16,
  },
  titulo: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#30356B',
    marginBottom: 4,
  },
  subtitulo: {
    fontSize: 14,
    color: '#807873',
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#30356B',
    marginBottom: 8,
  },
  listaProdutores: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 14,
  },
  chipProdutor: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#1688B5',
    borderRadius: 20,
    paddingHorizontal: 14,
    paddingVertical: 8,
    marginRight: 8,
    marginBottom: 8,
  },
  chipProdutorAtivo: {
    backgroundColor: '#1688B5',
  },
  txtChip: {
    color: '#1688B5',
    fontSize: 13,
    fontWeight: '600',
  },
  txtChipAtivo: {
    color: '#FFFFFF',
  },
  input: {
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    padding: 14,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#E1F1F6',
    fontSize: 15,
    color: '#30356B',
  },
  caixaResumoCalculo: {
    backgroundColor: '#E1F1F6',
    borderRadius: 12,
    padding: 16,
    marginBottom: 18,
  },
  txtResumoCalculo: {
    fontSize: 14,
    color: '#30356B',
    fontWeight: '600',
    marginBottom: 4,
  },
  valorDestaque: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1688B5',
  },
  botaoSalvar: {
    backgroundColor: '#1688B5',
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 2,
  },
  txtBotao: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 16,
  },
});