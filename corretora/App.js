import React, { useState } from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import LoginScreen from './src/app/index';
import NavegacaoPrincipalScreen from './src/app/navegacao';

export default function App() {
  const [usuarioLogado, setUsuarioLogado] = useState(false);

  return (
    <SafeAreaProvider>
      {usuarioLogado ? (
        <NavegacaoPrincipalScreen aoSair={() => setUsuarioLogado(false)} />
      ) : (
        <LoginScreen aoLogar={() => setUsuarioLogado(true)} />
      )}
    </SafeAreaProvider>
  );
}