# PRD — H4 MultiChat Business (MVP)

## Problema
Empresas com vários números empresariais autorizados necessitam administrar conversas em uma única interface, com identificação explícita do número de origem.

## Público
Pequenas e médias empresas com múltiplas linhas WhatsApp Business elegíveis para a API oficial.

## Escopo MVP
- Cadastro de empresas/usuários, autenticação e permissões.
- Integração Meta Embedded Signup de números elegíveis.
- Recebimento, exibição e envio de mensagens de texto dentro das políticas vigentes.
- Caixa de entrada unificada, busca, filtros por número, histórico desde a conexão e atualização em tempo real.
- Clientes macOS, Android e iOS via Flutter.
- Eventos auditáveis, observabilidade, isolamento e retenção de dados.

## Fora do escopo inicial
- WhatsApp pessoal, clientes não autorizados, importação de histórico completo, campanhas em massa, IA, CRM, Instagram ou Telegram.

## Aceitação
- Dois números autorizados exibidos separadamente na mesma caixa de entrada.
- Respostas enviadas somente pelo número explicitamente selecionado.
- Nenhum acesso entre empresas distintas.
- Eventos duplicados processados uma única vez.
- Falha de envio e restrições da janela de atendimento tratadas na UI.
- Testes de segurança, webhooks, integração e clientes móveis aprovados.
