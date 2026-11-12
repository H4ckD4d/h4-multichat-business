import 'package:flutter/material.dart';

void main() => runApp(const H4MultiChatApp());

class DemoConversation {
  final String name;
  final String account;
  final String message;
  const DemoConversation(this.name, this.account, this.message);
}

const demoConversations = <DemoConversation>[
  DemoConversation('Cliente Exemplo', 'Comercial', 'Gostaria de conhecer os serviços.'),
  DemoConversation('Contato Demonstração', 'Suporte', 'Preciso de uma informação.'),
  DemoConversation('Contato Fictício', 'Financeiro', 'Podem enviar uma proposta?'),
];

class H4MultiChatApp extends StatelessWidget {
  const H4MultiChatApp({super.key});
  @override
  Widget build(BuildContext context) => MaterialApp(
    title: 'H4 MultiChat Business',
    debugShowCheckedModeBanner: false,
    theme: ThemeData(useMaterial3: true, colorSchemeSeed: const Color(0xFF7EB64B)),
    home: const InboxDemoPage(),
  );
}

class InboxDemoPage extends StatefulWidget {
  const InboxDemoPage({super.key});
  @override
  State<InboxDemoPage> createState() => _InboxDemoPageState();
}

class _InboxDemoPageState extends State<InboxDemoPage> {
  String filter = 'Todos';
  String query = '';
  @override
  Widget build(BuildContext context) {
    final filtered = demoConversations.where((c) =>
      (filter == 'Todos' || c.account == filter) &&
      '${c.name} ${c.message}'.toLowerCase().contains(query.toLowerCase()),
    ).toList();
    return Scaffold(
      appBar: AppBar(title: const Text('H4 MultiChat'), actions: const [
        Padding(padding: EdgeInsets.all(12), child: Center(child: Text('DEMO', style: TextStyle(fontSize: 12)))),
      ]),
      bottomNavigationBar: const SafeArea(
        child: Padding(
          padding: EdgeInsets.symmetric(horizontal: 16, vertical: 8),
          child: Text(
            'Criado por @h4ckd4d · Chris Cruz | Protótipo pré-MVP',
            textAlign: TextAlign.center,
            style: TextStyle(fontSize: 11, color: Colors.grey),
          ),
        ),
      ),
      body: Column(children: [
        const MaterialBanner(content: Text('Protótipo visual: nenhuma mensagem real é enviada ou recebida.'), actions: [SizedBox.shrink()]),
        Padding(padding: const EdgeInsets.all(16), child: TextField(
          onChanged: (value) => setState(() => query = value),
          decoration: const InputDecoration(labelText: 'Buscar conversas', prefixIcon: Icon(Icons.search), border: OutlineInputBorder()),
        )),
        SizedBox(height: 48, child: ListView(scrollDirection: Axis.horizontal, padding: const EdgeInsets.symmetric(horizontal: 14), children: [
          for (final account in ['Todos', 'Comercial', 'Suporte', 'Financeiro'])
            Padding(padding: const EdgeInsets.only(right: 8), child: ChoiceChip(
              selected: filter == account, label: Text(account), onSelected: (_) => setState(() => filter = account))),
        ])),
        Expanded(child: ListView.builder(itemCount: filtered.length, itemBuilder: (context, index) {
          final conversation = filtered[index];
          return ListTile(
            leading: CircleAvatar(child: Text(conversation.name[0])),
            title: Text(conversation.name),
            subtitle: Text('${conversation.account} · ${conversation.message}', maxLines: 2, overflow: TextOverflow.ellipsis),
            trailing: const Icon(Icons.chevron_right),
            onTap: () => showDialog<void>(context: context, builder: (dialogContext) => AlertDialog(
              title: Text(conversation.name),
              content: Text('${conversation.message}\n\nNúmero: ${conversation.account}\n\nApenas simulação.'),
              actions: [TextButton(onPressed: () => Navigator.pop(dialogContext), child: const Text('Fechar'))],
            )),
          );
        })),
      ]),
    );
  }
}
