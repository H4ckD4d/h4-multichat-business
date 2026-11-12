# Arquitetura-alvo (não implementada ainda)

```
Flutter (macOS/Android/iOS) + Next.js (Admin)
            | HTTPS / WebSocket
NestJS API (OIDC/OAuth, RBAC, tenant scoping)
            |                 \
      PostgreSQL             Redis/queue
            |                  |
         events <--- Meta Cloud API webhooks
            |
WhatsApp Business Platform (Cloud API)
```

## Modelo de dados
`organizations`, `users`, `memberships`, `whatsapp_accounts`, `phone_numbers`, `contacts`, `conversations`, `messages`, `webhook_events`, `audit_logs`.

## Invariantes
- Um telefone pertence somente a uma organização autorizada em determinado momento.
- Toda consulta e alteração de dados é restrita ao contexto autenticado do tenant.
- Webhooks precisam de verificação de assinatura e mapeamento de telefone.
- Processamento idempotente com armazenamento durável.
- Tokens nunca são expostos ao frontend nem guardados em código.
- UI informa claramente qual linha enviará cada resposta.

## Por que o demo é simples?
O servidor Node.js do pacote serve para validar a estrutura inicial com zero dependências. Não tem autenticação, filas, banco de dados, configuração de múltiplas empresas nem Cloud API de envio: esses recursos serão implementados antes do primeiro piloto.
