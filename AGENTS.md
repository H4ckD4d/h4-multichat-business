# Instruções para Codex — H4 MultiChat Business

## Objetivo
Implementar MVP SaaS para gerenciar múltiplos números **empresariais autorizados** do WhatsApp por meio da Cloud API oficial da Meta, com clientes macOS, Android e iOS.

## Estado atual
O protótipo web/API é apenas demonstração local: sem login e com mensagens fictícias. O Flutter é interface mock. **Não publicar nem tratar como software de produção.**

## Backlog obrigatório
1. Backend NestJS, PostgreSQL, migrations e esquema multi-tenant (`organizations`, `users`, `memberships`, `phone_numbers`, `contacts`, `conversations`, `messages`, `webhook_events`, `audit_logs`).
2. Autenticação OIDC/OAuth e controle de acesso RBAC em cada recurso; testes de isolamento entre tenants.
3. Meta Embedded Signup, permissões e gestão segura de tokens; mapear cada `phone_number_id` ao tenant autorizado.
4. Webhooks com HMAC sobre corpo bruto, processamento durável em fila, idempotência, tratamento de status e retentativas.
5. Caixa de entrada com envio real autorizado, janela de 24 horas, templates aprovados, sincronização em tempo real.
6. Flutter integrado ao backend e testes em macOS, Android e iOS.
7. Logs sem dados pessoais, monitoramento, backup, retenção e requisitos LGPD.

## Restrições
- Não utilizar WhatsApp Web, automações não oficiais ou sessões pessoais como integração principal.
- Nunca commitar tokens, segredos, conversas reais, números de clientes ou chaves privadas.
- Não presumir que histórico anterior à conexão possa ser importado.
- Implementar primeiro testes de segurança, isolamento e idempotência.
- Documentar em cada PR: alterações, comandos de teste, decisões e limitações.
