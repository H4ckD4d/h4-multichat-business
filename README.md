# H4 MultiChat Business

> **Status: protótipo técnico pré-MVP.** Esta base não conecta contas reais automaticamente. O painel usa dados fictícios.

Plataforma SaaS para centralizar diversos números **empresariais autorizados** do WhatsApp em uma caixa de entrada, com plano de acesso via macOS, Android e iOS.

## Implementado neste pacote
- Dashboard web responsivo de demonstração: filtro por número, lista de conversas, busca e respostas simuladas.
- API Node.js 22 sem dependências para desenvolvimento local.
- Webhook Meta: validação do desafio GET e da assinatura HMAC-SHA256 nos POSTs.
- Recebimento de eventos de texto em memória e deduplicação básica.
- Projeto Flutter ilustrativo para os três sistemas operacionais.
- Testes automáticos, workflow de CI e instruções para Codex.

## Executar a demonstração

```bash
cd apps/api
npm test
npm start
```

Abra http://127.0.0.1:3000. O demo **não envia WhatsApp real**.

**Atenção:** sem autenticação, persistência, RBAC ou isolamento multiempresa. O servidor escuta somente localhost por padrão. **Nunca exponha o demo à Internet nem o utilize com clientes reais.**

## Protótipo Flutter

Instale Flutter no Mac e, em `apps/mobile`, execute `flutter pub get` e `flutter run`. É um modelo visual, ainda não conectado à API.

## Publicar no GitHub como repositório público

Depois de instalar o [GitHub CLI](https://cli.github.com/) e autenticar-se com `gh auth login`, execute na pasta deste projeto:

```bash
./scripts/publish-github.sh
```

Isso cria `H4ckD4d/h4-multichat-business`, com visibilidade **pública**, e envia a branch main. Se o nome existir, o script interrompe sem substituir nada.

## Desenvolvimento com Codex

Leia `AGENTS.md`. Etapa prioritária: substituir a estrutura demonstrativa por API NestJS, PostgreSQL multi-tenant, autenticação, Meta Embedded Signup e integração efetiva Flutter, com revisão de segurança.

## Documentação
- [Produto e requisitos](docs/PRD.md)
- [Arquitetura](docs/ARCHITECTURE.md)
- [Roadmap](docs/ROADMAP.md)
- [Meta e segurança](docs/META.md)

Este repositório não contém licença open-source definida. Um repositório público não implica autorização geral para copiar, redistribuir ou comercializar o código.
