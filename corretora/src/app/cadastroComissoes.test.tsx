import {describe, it, expect, jest} from '@jest/globals';
import React from 'react';
import {Alert} from 'react-native';
import renderer, {act} from 'react-test-renderer';
import CadastroComissoesScreen, {calcularComissaoParcelada} from './cadastroComissoes';

// Simula os icones para evitar atualizacoes assincronas apos o fim do teste
jest.mock('@expo/vector-icons', () => ({
  Ionicons: 'Ionicons',
}));

// Simula o banco de dados para o teste rodar offline
jest.mock('../lib/supabase', () => ({
  supabase: {
    from: () => ({
      select: () => Promise.resolve({data: []}),
      insert: () => Promise.resolve({error: null}),
    }),
  },
}));

describe('Suite de Testes - Modulo de Comissoes', () => {
  // 1. TESTE UNITARIO: Valida a regra matematica pura
  it('1. Unitario: deve calcular o repasse parcelado (esgotamento) corretamente', () => {
    const resultado = calcularComissaoParcelada(2000, 25, 4);
    expect(resultado.totalProdutor).toBe(500);
    expect(resultado.valorParcela).toBe(125);
  });

  // 2. TESTE DE COMPONENTE: Valida se a tela renderiza na arvore visual
  it('2. Componente: deve renderizar a tela de Lançar Comissão sem quebrar', async () => {
    let arvore: any;
    await act(async () => {
      arvore = renderer.create(<CadastroComissoesScreen aoVoltar={() => {}} />);
    });
    expect(arvore.toJSON()).not.toBeNull();
    act(() => {
      arvore.unmount();
    });
  });

  // 3. TESTE DE INTEGRACAO / VALIDACAO: Testa a trava de seguranca do formulario
  it('3. Integracao: deve exibir alerta ao tentar salvar sem preencher campos obrigatorios', async () => {
    const alertaSpy = jest.spyOn(Alert, 'alert');
    let arvore: any;

    await act(async () => {
      arvore = renderer.create(<CadastroComissoesScreen aoVoltar={() => {}} />);
    });

    const botaoSalvar = arvore.root.findByProps({
      accessibilityLabel: 'Salvar comissão e notificar produtor no WhatsApp',
    });

    await act(async () => {
      botaoSalvar.props.onPress();
    });

    expect(alertaSpy).toHaveBeenCalledWith(
      'Atenção',
      'Selecione o produtor e preencha cliente, valor e porcentagem.'
    );

    act(() => {
      arvore.unmount();
    });
  });
});