# Meta WhatsApp Business Platform

Para conectar números de clientes: avaliar requisitos atuais de Tech Provider, Meta Embedded Signup e permissões no painel Meta for Developers. Nunca pedir senha do WhatsApp do cliente.

## Webhooks
- GET: `hub.mode=subscribe`, `hub.verify_token` e `hub.challenge`.
- POST: validar `X-Hub-Signature-256` usando HMAC-SHA256 e os **bytes originais** do corpo com o App Secret.
- Para produção: HTTPS público, filas persistentes e idempotência transacional.

## Regras essenciais
A Cloud API é destinada a números comerciais elegíveis. Mensagens de atendimento, modelos aprovados, limites e preços são definidos pela Meta e podem mudar. Respeitar a janela de atendimento de 24 horas e opt-in quando aplicável.

Referência oficial: https://developers.facebook.com/docs/whatsapp/cloud-api/

## Segurança do protótipo
O demo **não é seguro para expor publicamente**: não tem login, tenant real, persistência, rate limiting de aplicação ou políticas de dados. Use localhost e apenas conteúdo fictício.
