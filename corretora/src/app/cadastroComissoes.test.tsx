import {describe, it, expect, jest} from '@jest/globals';
import React from 'react';
import {Alert} from 'react-native';
import renderer, {act} from 'react-test-renderer';
import CadastroComissoesScreen, {
  calcularComissaoParcelada,
  calcularProximoRepasseEsgotamento,
} from './cadastroComissoes';

jest.mock('@expo/vector-icons', () => ({
  Ionicons: 'Ionicons',
}));

jest.mock('../lib/supabase', () => ({
  supabase: {
    auth: {
      getUser: () => Promise.resolve({data: {user: {email: 'admin@corrertora.example.com'}}}),
    },
    from: () => ({
      select: () => Promise.resolve({data: []}),
      insert: () => Promise.resolve({error: null}),
    }),
  },
}));

describe('Suite de Testes - Modulo de Comissoes', () => {
  // 1. TESTE UNITARIO: Valida a formula P / (100 / C) e a regra progressiva (>= 1, < 1, 0)
  it('1. Unitario: deve calcular o esgotamento e as parcelas residuais corretamente', () => {
    const calc = calcularComissaoParcelada(2400, 20, 50, 12, true);
    expect(calc.comissaoCorretora).toBe(480);
    expect(calc.totalProdutor).toBe(240);
    expect(calc.parcelasEsgotamento).toBe(2.4);

    const parc1 = calcularProximoRepasseEsgotamento(2.4, 100);
    expect(parc1.valorPagar).toBe(100);
    expect(parc1.novoSaldo).toBe(1.4);

    const parc3 = calcularProximoRepasseEsgotamento(0.4, 100);
    expect(parc3.valorPagar).toBe(40);
    expect(parc3.novoSaldo).toBe(0);

    const parc4 = calcularProximoRepasseEsgotamento(0, 100);
    expect(parc4.valorPagar).toBe(0);
  });

  // 2. TESTE DE COMPONENTE: Valida se a tela renderiza sem quebrar (com timeout de 15s)
  it('2. Componente: deve renderizar a tela de Lançar Comissão sem quebrar', async () => {
    let arvore: any;
    await act(async () => {
      arvore = renderer.create(<CadastroComissoesScreen aoVoltar={() => {}} />);
    });
    expect(arvore.toJSON()).not.toBeNull();
    act(() => {
      arvore.unmount();
    });
  }, 15000);

  // 3. TESTE DE INTEGRACAO: Testa a trava de validacao com a mensagem atualizada
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
      'Selecione o produtor e preencha cliente, valor do seguro e porcentagem.'
    );

    act(() => {
      arvore.unmount();
    });
  }, 15000);
});