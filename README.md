# H4 MultiChat Business

**Uma caixa de entrada. Múltiplos números. Segurança desde a primeira linha de código.**

> **Status: protótipo técnico pré-MVP.** A interface utiliza conversas fictícias; ainda não há envio ou recebimento de mensagens reais do WhatsApp. Não utilize com clientes ou dados pessoais.

**Concepção, direção técnica e desenvolvimento:** **Chris Cruz — [@H4ckD4d](https://github.com/H4ckD4d)**  
**Projeto:** H4 MultiChat Business · Plataforma SaaS multiplataforma

## A história por trás do H4

### Do olhar de um hacker Red Team à construção de uma plataforma de comunicação

Antes de existir o H4 MultiChat Business, existia uma forma de enxergar tecnologia: **não basta que um sistema funcione; é preciso compreender como ele pode falhar e como protegê-lo.**

A trajetória de **Chris Cruz, conhecido como h4ckd4d**, atravessa eletrônica, redes, infraestrutura, desenvolvimento e segurança cibernética. No universo **Red Team**, a perspectiva é questionar premissas, investigar riscos com autorização e pensar como um adversário para fortalecer a defesa — não para comprometer sistemas de terceiros.

Dessa mentalidade nasceu uma pergunta simples: **por que uma empresa com vários números de WhatsApp precisa fragmentar sua comunicação entre tantas telas, contas e atendentes?**

A resposta imaginada é o **H4 MultiChat Business**: uma central onde vários números empresariais autorizados convivem em uma experiência organizada, com visibilidade, controle de acesso e rastreabilidade. Um produto concebido com o olhar de quem sabe que conveniência sem segurança não é solução.

**Nossa ideia é conectar conversas, não criar vulnerabilidades.**

Leia o [storytelling completo e os princípios do projeto](docs/STORYTELLING.md).

## O que estamos construindo

Uma plataforma SaaS para gerenciar **múltiplos números empresariais autorizados** usando a API oficial **WhatsApp Business Platform / Cloud API** da Meta, com experiência planejada para **macOS, Android e iPhone**.

O objetivo do MVP é validar uma caixa de entrada unificada com mensagens associadas ao número de origem, sincronização, gestão de acessos e isolamento de dados entre empresas.

## O que já existe neste repositório

- Dashboard web responsivo de demonstração com filtros, busca e respostas simuladas.
- API demonstrativa em Node.js 22 para execução local.
- Verificação de desafio GET e assinatura HMAC-SHA256 em webhooks da Meta.
- Eventos de texto em memória com deduplicação básica.
- Interface Flutter ilustrativa para macOS, Android e iOS.
- Testes automatizados, CI e orientações para continuação com Codex.

**Ainda não implementado:** integração de envio real, autenticação, PostgreSQL, isolamento multiempresa, Embedded Signup e aplicativos conectados à API. Este código **não está pronto para produção**.

## Executar a demonstração local

```bash
cd apps/api
npm test
npm start
```

Acesse `http://127.0.0.1:3000`. O serviço é uma **demonstração**, não um cliente WhatsApp em operação. Não exponha o servidor de testes publicamente.

Para executar a interface Flutter ilustrativa, instale o Flutter e, no diretório `apps/mobile`, use `flutter pub get` e `flutter run` em um dispositivo compatível.

## Princípios de desenvolvimento

1. **Integração oficial:** apenas números empresariais elegíveis e autorizados pela Meta.
2. **Segurança por design:** segredos protegidos, acesso mínimo necessário, auditoria e separação por empresa.
3. **Privacidade real:** não publicar credenciais, mensagens reais, números de clientes ou dados pessoais.
4. **Transparência:** distinguir demonstrações de funcionalidades efetivamente implementadas.
5. **Evolução responsável:** validar o MVP antes de adicionar automações, IA e novos canais.

## Organização e documentação

- [Requisitos de produto (PRD)](docs/PRD.md)
- [Arquitetura](docs/ARCHITECTURE.md)
- [Roadmap](docs/ROADMAP.md)
- [Meta e segurança](docs/META.md)
- [Storytelling e manifesto](docs/STORYTELLING.md)
- [Instruções para agentes de desenvolvimento](AGENTS.md)

## Créditos

**Chris Cruz — @h4ckd4d**  
**Criador, idealizador, direção técnica e desenvolvimento do H4 MultiChat Business.**  
GitHub: [github.com/H4ckD4d](https://github.com/H4ckD4d)

A abordagem Red Team aqui significa **segurança ofensiva ética e autorizada, aplicada à construção defensiva de software**. Este projeto não busca interceptar conversas, acessar contas alheias ou contornar as regras do WhatsApp.

## Licenciamento

O repositório é público, mas **não possui licença open-source atribuída**. A visibilidade pública não concede automaticamente direitos de cópia, redistribuição ou exploração comercial.
