# API do Logali

A API do Logali é projetada para suportar um sistema de cadastro, busca e gerenciamento de serviços, com funcionalidades voltadas tanto para prestadores quanto para clientes.

## Índice

- [Descrição Geral](#descrição-geral)
- [Principais Funcionalidades](#principais-funcionalidades)
- [Rotas Disponíveis](#rotas-disponíveis)
- [Detalhes Técnicos](#detalhes-técnicos)
- [Tecnologias Utilizadas](#tecnologias-utilizadas)
- [Instalação](#instalação)
- [Uso](#uso)
- [Contribuição](#contribuição)
- [Licença](#licença)

## Descrição Geral

A API do Logali utiliza o Node.js com Express e armazena dados no banco de dados MongoDB. Ela inclui suporte para autenticação de usuários, registro de serviços, geolocalização e integração com APIs externas, como o Google Maps. Além disso, a API utiliza o Redis para melhorar o desempenho e implementa limites de requisições para proteger contra abusos.

## Principais Funcionalidades

- **Autenticação de Usuários**
  - Login e registro de usuários com autenticação JWT.
  - Verificação de tokens para rotas protegidas.
  - Perfil de usuário com possibilidade de edição.

- **Cadastro e Gerenciamento de Serviços**
  - Permite que usuários com perfil de "provider" cadastrem um serviço.
  - Suporte para envio de até 3 imagens por serviço, com armazenamento no Cloudinary.
  - Atualização e exclusão de serviços cadastrados.

- **Busca de Serviços**
  - Busca baseada em filtros como categoria, nome e raio.
  - Integração com a Geocoding API para localização de endereços.
  - Direções para serviços utilizando a Directions API do Google.

- **Geolocalização**
  - Envio da localização atual do cliente.
  - Obtenção de rotas para serviços próximos.

- **Avaliações e Feedback**
  - Usuários podem avaliar e deixar feedback para os serviços utilizados.
  - Exibição da média de avaliações nos detalhes do serviço.

- **Controle de Visibilidade**
  - Opção para prestadores de serviço definirem se o endereço será visível ou não para os clientes.

- **Limites de Requisições**
  - Controle de uso das APIs do Google e endpoints sensíveis para evitar abusos.

## Rotas Disponíveis

### Autenticação
- `POST /user/auth/register` - Registro de novos usuários.
- `POST /user/auth/login` - Login de usuários e geração de tokens JWT.

### Gerenciamento de Usuários
- `GET /user/profile` - Retorna o perfil do usuário autenticado.
- `PATCH /user/profile/edit` - Permite a edição dos dados do usuário.

### Gerenciamento de Serviços
- `POST /user/provider/addservice` - Adiciona um novo serviço (apenas para usuários com provider: true).
- `PATCH /user/provider/editservice/:id` - Edita um serviço existente.
- `DELETE /user/provider/removeservice/:id` - Remove um serviço cadastrado.
- `GET /user/service/get-all-services` - Retorna todos os serviços cadastrados.
- `GET /user/service/get-services-filtered` - Retorna serviços com base em filtros como category, name, e radius.

### Geolocalização
- `POST /user/location/send-actual-location` - Envia a localização atual do usuário e retorna o endereço formatado.
- `GET /user/service/get-route/:id` - Retorna a rota entre a localização atual do cliente e o serviço especificado.

### Avaliações e Favoritos
- `POST /user/service/:id/rate` - Permite ao usuário avaliar um serviço.
- `POST /user/service/:id/favorite` - Adiciona um serviço à lista de favoritos do usuário.
- `GET /user/favorites` - Lista todos os serviços favoritos do usuário.

## Detalhes Técnicos

- **Banco de Dados**: MongoDB (armazenamento de informações de usuários, serviços e avaliações).
- **Gerenciamento de Imagens**: Uploads realizados no Cloudinary.
- **Cache**: Redis para otimizar requisições frequentes.
- **APIs Externas**: Integração com Google Cloud (Geocoding e Directions APIs).
- **Limitação de Requisições**: Middleware para evitar abuso nas chamadas de APIs sensíveis.

## Tecnologias Utilizadas

- **Linguagem**: Node.js
- **Framework**: Express
- **Banco de Dados**: MongoDB
- **Gerenciamento de Imagens**: Cloudinary
- **Cache**: Redis

## Instalação
