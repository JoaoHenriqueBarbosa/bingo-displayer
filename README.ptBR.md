# Exibidor de Bingo em Tempo Real

Este projeto é um exibidor de jogo de bingo em tempo real construído com Next.js e Supabase. Ele permite uma experiência de bingo sem interrupções, onde o jogo pode ser gerenciado em um computador e exibido em outro.

## Funcionalidades

- Atualizações em tempo real do jogo
- Interfaces separadas para gerenciamento e exibição do jogo
- Sistema de login seguro
- Design responsivo para vários tamanhos de tela

## Páginas

1. **Projetor Principal** (`/main-projector`)
   - Exibe o jogo atual em tempo real
   - Ideal para projetar em uma tela grande para os jogadores visualizarem

2. **Projetor de Jogo** (`/game/[id]/projector`)
   - Mostra um jogo específico por ID
   - Útil para revisar ou exibir um jogo específico

3. **Página Inicial** (`/`)
   - Exibe uma lista de jogos
   - Requer autenticação do usuário

4. **Verificar Números** (`/game/[id]/check-numbers`)
   - Permite verificar números para um jogo específico
   - Exibe detalhes do jogo e uma grade de números

5. **Login** (`/login`)
   - Página de autenticação segura
   - Fornece acesso aos recursos de gerenciamento de jogos

## Configuração

1. Clone o repositório
2. Instale as dependências com `npm install` ou `yarn install`
3. Configure seu projeto Supabase e adicione as variáveis de ambiente necessárias
4. Execute o servidor de desenvolvimento com `npm run dev` ou `yarn dev`

## Uso

1. Faça login usando as credenciais fornecidas ou configure sua própria conta de administrador
2. Crie um novo jogo ou selecione um existente na página inicial
3. Use a página de verificação de números para gerenciar o jogo atual
4. Abra a página do projetor principal no computador conectado ao projetor
5. À medida que você atualiza o jogo, a exibição no projetor será atualizada em tempo real

## Tecnologias Usadas

- Next.js
- React
- Supabase
- TypeScript
- Tailwind CSS

## Contribuições

Contribuições são bem-vindas! Por favor, sinta-se à vontade para enviar um Pull Request.

## Licença

Este projeto está licenciado sob a [Licença MIT](LICENSE).