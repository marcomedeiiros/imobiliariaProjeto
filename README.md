# Ernando Leão - Especialistas em Terrenos

Uma plataforma imobiliária robusta e moderna, especializada na gestão e venda de terrenos e lotes. Desenvolvida com foco em segurança, performance e experiência do usuário (UX).

---

## Visão Geral do Projeto

Este sistema foi projetado para facilitar a conexão entre compradores e os melhores terrenos da região da Serra. Conta com uma interface intuitiva para os clientes e um painel administrativo completo para a gestão do catálogo de imóveis.

### Funcionalidades Principais

#### Área do Cliente (Frontend)
- **Busca Avançada**: Filtros dinâmicos por localização, tipo de terreno e faixa de preço.
- **Catálogo Interativo**: Grid de propriedades responsivo com carregamento otimizado.
- **Detalhes Completos**: Visualização detalhada de cada terreno com suporte a vídeos e mapas.
- **Interface Premium**: Design moderno com animações suaves e tipografia elegante.

#### Painel Administrativo (Backend & Admin)
- **Primeiro Acesso**: Fluxo de configuração inicial para definição de senha mestre.
- **Segurança Avançada**: Autenticação via **JWT (JSON Web Tokens)** e proteção contra ataques de força bruta (Rate Limit).
- **Gestão de Imóveis (CRUD)**: Adição, edição e exclusão de terrenos através de um painel seguro.
- **Sessões Protegidas**: Validação contínua da sessão e logout automático para garantir a segurança dos dados.

---

## Stack Tecnológica

### Frontend
- **React 19**: Biblioteca UI moderna e performática.
- **Vite**: Build tool extremamente rápida para desenvolvimento.
- **Vanilla CSS**: Estilização personalizada e modular.
- **Lucide React**: Biblioteca de ícones elegantes.

### Backend
- **Node.js & Express**: Servidor robusto e escalável.
- **SQLite 3**: Banco de dados relacional leve e eficiente.
- **Bcrypt**: Hashing seguro de senhas com fatores de custo elevados.
- **Jose**: Implementação completa de JWT e JWS.

---

## Instalação e Uso

### 1. Pré-requisitos
- **Node.js** (v18+) instalado.
- Gerenciador de pacotes **npm**.

### 3. Rodando o Backend (API)
Em um terminal, execute:
```bash
npm i     # Instala as dependências
npm run server  # Inicia a API
```

### 4. Rodando o Frontend (Interface)
Em **outro** terminal, execute:
```bash
npm run dev     # Inicia o o servidor
```
Acesse [http://localhost:5173](http://localhost:5173) no seu navegador.