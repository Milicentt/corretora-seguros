nota do snack expo (por que não deixar? caso queira pular a nota dele, vá para o final)
# Sample Snack app

Open the `App.js` file to start writing some code. You can preview the changes directly on your phone or tablet by scanning the **QR code** or use the iOS or Android emulators. When you're done, click **Save** and share the link!

When you're ready to see everything that Expo provides (or if you want to use your own editor) you can **Download** your project and use it with [expo cli](https://docs.expo.dev/get-started/installation/#expo-cli)).

All projects created in Snack are publicly available, so you can easily share the link to this project via link, or embed it on a web page with the `<>` button.

If you're having problems, you can tweet to us [@expo](https://twitter.com/expo) or ask in our [forums](https://forums.expo.dev/c/expo-dev-tools/61) or [Discord](https://chat.expo.dev/).

Snack is Open Source. You can find the code on the [GitHub repo](https://github.com/expo/snack).



 Gestão de Comissões - Rio do A Corretora de Seguros

Aplicativo mobile feito em React Native (Expo) com banco de dados Supabase para controlar o cálculo e o repasse de comissões entre a corretora e os produtores parceiros.

Funcionalidades

- **Login e Controle de Acesso:** Separação entre Administrador (acesso total) e Produtor (vê apenas as próprias comissões e vendas).
- **Cálculo de Repasse (Pagamento Total e Esgotamento):**
  - *Pagamento Total:* Repasse integral à vista sobre a comissão da apólice.
  - *Esgotamento:* Cálculo progressivo usando a fórmula `P / (100 / C)`, descontando parcelas inteiras ou residuais até zerar o saldo do produtor.
- **Recursos do Celular:** Envio de resumo automático pelo WhatsApp (`Linking`) no lançamento e na baixa de pagamentos, além de compartilhamento nativo (`Share`).
- **Segurança no Banco:** Políticas de acesso (RLS) configuradas no Supabase para usuários autenticados.

 Tecnologias

- React Native / Expo
- TypeScript
- Supabase (PostgreSQL e Auth)
- Jest (testes unitários, de componente e de integração)

## Como rodar o projeto

1. Clone o repositório e instale as dependências:
```bash
git clone https://github.com
cd corretora-seguros
npm install
```

2. Configure as variáveis de ambiente:
Renomeie o arquivo `.env.example` para `.env` e adicione a URL e a chave pública do seu projeto Supabase:
```bash
cp .env.example .env
```

3. Tabelas necessárias no Supabase (schema `public` com RLS ativado):
- `comissionadores`: `id` (int8, identity), `nome` (text), `telefone` (text), `porcentagem_padrao` (float8), `chave_pix` (text), `user_id` (uuid).
- `comissoes`: `id` (int8, identity), `cliente` (text), `produtor` (text), `valor_comissao` (float8), `porcentagem_produtor` (float8), `valor_produtor` (float8), `parcelas` (int4), `valor_parcela` (float8), `data_venda` (text), `status` (text).

4. Inicie o servidor do Expo:
```bash
npx expo start
```
Abra o aplicativo **Expo Go** no celular (na mesma rede Wi-Fi) e leia o QR Code exibido no terminal.
OU faça um tunnel usando npx expo start --tunnel ngrok, o próprio comando ja diz algumas informações que você deverá seguir.  

Testes automatizados

Para rodar os testes unitários, de componente e de integração com Jest:
```bash
npm test
``` 67