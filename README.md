# Jogo do Bicho - Sistema de Sorteios

Este projeto implementa um sistema de sorteios baseado no "Jogo do Bicho", utilizando **TypeScript**, **Prisma ORM**, e **Node.js**. O sistema permite gerenciar sorteios, apostas em animais, calcular prêmios e dividendos, além de realizar transações financeiras como distribuição de lucros entre vencedores e sócios.

## Funcionalidades

- **Gerenciamento de Sorteios**: Criação, cálculo de prêmios e dividendos e sorteio de vencedor com base nas apostas.
- **Apostas em Animais**: Os usuários podem apostar em três tipos de animais (gato, cachorro e veado), e o sistema calcula probabilidades proporcionais com base na quantidade de apostas.
- **Transações Financeiras**: Gerenciamento de transações de depósitos, saques, prêmios, e distribuição de dividendos entre sócios.
- **Integração com Prisma**: Utiliza Prisma ORM para comunicação com o banco de dados, gerenciando modelos como `Raffle`, `Ordens`, `Winners`, e `Partners`.
- **Distribuição de Prêmios**: Cálculo automático do prêmio para os ganhadores e dividendos para os sócios de acordo com sua participação.

## Modelos no Banco de Dados

Este projeto utiliza o Prisma ORM para gerenciar os modelos de banco de dados. Abaixo estão os principais modelos utilizados no projeto, representando usuários, transações, sorteios, ordens, vencedores e sócios.

### Modelos

#### **User** (Usuário)
Representa os usuários do sistema, que podem realizar apostas e ter transações associadas.

- `id`: Identificador único do usuário (Int, chave primária).
- `name`: Nome do usuário (String).
- `email`: Email único (String, único).
- `cpf`: CPF único do usuário (String, único).
- `balance`: Saldo do usuário (Float).
- `transactions`: Relação com o modelo de transações (`Transaction[]`).

#### **Transaction** (Transação)
Representa as transações financeiras associadas a um usuário ou sócio.

- `id`: Identificador único da transação (Int, chave primária).
- `type`: Tipo da transação (String).
- `value`: Valor da transação (Float).
- `cpf`: CPF associado à transação (String).
- `userId`: Identificador do usuário associado à transação (opcional).
- `user`: Relação opcional com o modelo `User` (relacionamento com chave estrangeira).
- `partnerId`: Identificador do sócio associado à transação (opcional).
- `partner`: Relação opcional com o modelo `Partner` (relacionamento com chave estrangeira).

#### **Raffle** (Sorteio)
Representa um sorteio no sistema, que contém apostas (ordens) e vencedores.

- `id`: Identificador único do sorteio (Int, chave primária).
- `date`: Data do sorteio (DateTime).
- `time`: Horário do sorteio (DateTime).
- `totalBet`: Total de apostas no sorteio (Float, opcional).
- `prize`: Valor do prêmio total (Float, opcional).
- `dividend`: Valor dos dividendos distribuídos aos sócios (Float, opcional).
- `animal`: Animal sorteado como vencedor (String).
- `winners`: Relação com o modelo `Winner[]` (lista de vencedores do sorteio).
- `ordens`: Relação com o modelo `Ordens[]` (lista de apostas associadas ao sorteio).

#### **Winner** (Vencedor)
Representa os vencedores de um sorteio.

- `id`: Identificador único do vencedor (Int, chave primária).
- `name`: Nome do vencedor (String).
- `raffleId`: Identificador do sorteio associado ao vencedor (Int).
- `raffle`: Relação com o modelo `Raffle` (relacionamento com chave estrangeira).

#### **Ordens** (Apostas)
Representa uma aposta feita em um animal específico para um sorteio.

- `id`: Identificador único da ordem (Int, chave primária).
- `animal`: Animal apostado (String).
- `value`: Valor da aposta (Float).
- `cpf`: CPF do usuário que fez a aposta (String).
- `raffleId`: Identificador do sorteio associado à aposta (Int).
- `raffle`: Relação com o modelo `Raffle` (relacionamento com chave estrangeira).

#### **Partner** (Sócio)
Representa os sócios que recebem dividendos com base nas apostas.

- `id`: Identificador único do sócio (Int, chave primária).
- `name`: Nome do sócio (String).
- `email`: Email único do sócio (String, único).
- `cpf`: CPF único do sócio (String, único).
- `balance`: Saldo do sócio (Float).
- `participation`: Percentual de participação nos dividendos (Float).
- `transactions`: Relação com o modelo de transações (`Transaction[]`).


## Serviços

- **RaffleService**: Serviço responsável por:
  - Criar sorteios.
  - Calcular o número de apostas em cada animal.
  - Sortear o animal vencedor.
  - Calcular prêmios e dividendos.
  - Processar pagamentos aos ganhadores e sócios

- **OrdensService**: Gerencia as ordens de apostas, com funcionalidades para:
  - Criar novas apostas (ordens) vinculadas a um sorteio.
  - Verificar o saldo do usuário antes de permitir a aposta.
  - Processar a retirada do valor apostado do saldo do usuário.
  - Interagir com o Prisma para criar novas entradas no banco de dados para cada ordem feita.
  
- **TransactionService**: Gerencia transações financeiras como:
  - Adicionar lucros ao saldo dos ganhadores.
  - Distribuir dividendos para os sócios.
  - Verificar saldo e processar transações.

## Tecnologias Utilizadas

- **Node.js**: Ambiente de execução para JavaScript no servidor.
- **TypeScript**: Superset de JavaScript que adiciona tipagem estática.
- **Prisma ORM**: Ferramenta ORM para interagir com o banco de dados.
- **SQLite**: Banco de dados utilizado durante o desenvolvimento.
- **Express**: Framework para construir APIs em Node.js.
