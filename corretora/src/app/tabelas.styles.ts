import {StyleSheet} from 'react-native';

export const styles = StyleSheet.create({
    container: {
    flex: 1,
    backgroundColor: '#F0FAFC',
    paddingHorizontal: 16,
    paddingTop: 12,
  },
  titulo: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#30356B',
    marginBottom: 16,
  },

  subtitulo: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#30356B',
    marginTop: 12,
    marginBottom: 8,
  },
  caixaPicker: {
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#E1F1F6',
    marginBottom: 12,
    overflow: 'hidden',
  },
  picker: {
    height: 50,
    color: '#30356B',
  },
  cardTabela: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 12,
    marginBottom: 16,
    elevation: 2,
  },
  cabecalhoTabela: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#E1F1F6',
    paddingBottom: 8,
    marginBottom: 8,
  },
  celulaCabecalho: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#807873',
  },
  linhaTabela: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#F0FAFC',
  },
  textoCliente: {
    fontSize: 14,
    fontWeight: '600',
    color: '#30356B',
  },
  textoSecundario: {
    fontSize: 11,
    color: '#807873',
    marginTop: 2,
  },
  celulaTexto: {
    fontSize: 12,
    color: '#30356B',
  },
  textoValor: {
    fontSize: 13,
    fontWeight: 'bold',
    color: '#1688B5',
  },
  btnPagar: {
    backgroundColor: '#1688B5',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 6,
  },
  txtBtnPagar: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: 'bold',
  },
  rodapeTotal: {
    marginTop: 10,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: '#E1F1F6',
    alignItems: 'flex-end',
  },
  txtTotal: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#30356B',
  },
  textoVazio: {
    textAlign: 'center',
    color: '#807873',
    fontSize: 13,
    paddingVertical: 16,
  },
  badgeStatus: {
    fontSize: 12,
    fontWeight: 'bold',
  },
  statusPago: {
    color: '#1688B5',
  },
  statusPendente: {
    color: '#D97706',
  },
});