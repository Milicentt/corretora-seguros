import {StyleSheet} from 'react-native';

export const styles = StyleSheet.create({
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
    elevation: 2,
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