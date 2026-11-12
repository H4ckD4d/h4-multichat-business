/** Narrow parser for demo text messages, not a full Meta event processor. */
export function parseIncomingMessages(payload) {
  if (payload?.object !== 'whatsapp_business_account' || !Array.isArray(payload.entry)) return [];
  const result = [];
  for (const entry of payload.entry) {
    for (const change of entry?.changes ?? []) {
      const value = change?.value;
      const phoneNumberId = value?.metadata?.phone_number_id;
      if (!phoneNumberId || !Array.isArray(value?.messages)) continue;
      const contacts = new Map((value.contacts ?? []).filter(c => c?.wa_id).map(c => [c.wa_id, c.profile?.name]));
      for (const message of value.messages) {
        if (message?.type !== 'text' || typeof message?.text?.body !== 'string') continue;
        if (typeof message.id !== 'string' || typeof message.from !== 'string') continue;
        result.push({
          id: message.id,
          phoneNumberId: String(phoneNumberId),
          from: message.from,
          contactName: contacts.get(message.from) || message.from,
          body: message.text.body.slice(0, 4096),
          timestamp: /^\d+$/.test(String(message.timestamp)) ? Number(message.timestamp) * 1000 : Date.now(),
        });
      }
    }
  }
  return result;
}
