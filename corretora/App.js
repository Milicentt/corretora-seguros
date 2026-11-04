import React from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import NavegacaoPrincipalScreen from './src/app/navegacao'; // <-- Garanta que está apontando para o arquivo certo aqui

export default function App() {
  return (
    <SafeAreaProvider>
      <NavegacaoPrincipalScreen />
    </SafeAreaProvider>
  );
}
