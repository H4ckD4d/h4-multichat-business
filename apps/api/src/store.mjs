/** Demo only: fictitious data, in memory. Not suitable for production or real tenants. */
export function makeDemoStore() {
  const accounts = [
    {id:'comercial', name:'Comercial', phoneNumberId:'demo-1', displayNumber:'+55 ••• 1001'},
    {id:'suporte', name:'Suporte', phoneNumberId:'demo-2', displayNumber:'+55 ••• 2002'},
    {id:'financeiro', name:'Financeiro', phoneNumberId:'demo-3', displayNumber:'+55 ••• 3003'},
  ];
  const threads = [
    {id:'t1', accountId:'comercial', contact:'Cliente Exemplo', from:'5511999000001', messages:[{id:'s1',body:'Gostaria de conhecer os serviços.',direction:'in',at:'10:20'}]},
    {id:'t2', accountId:'suporte', contact:'Contato Demonstração', from:'5511999000002', messages:[{id:'s2',body:'Preciso de uma informação.',direction:'in',at:'10:12'}]},
    {id:'t3', accountId:'financeiro', contact:'Contato Fictício', from:'5511999000003', messages:[{id:'s3',body:'Podem enviar uma proposta?',direction:'in',at:'09:47'}]},
  ];
  const seen = new Set();
  function ingest(messages) {
    let count = 0;
    for (const msg of messages) {
      if (seen.has(msg.id)) continue;
      const account = accounts.find(a => a.phoneNumberId === msg.phoneNumberId);
      if (!account) continue;
      seen.add(msg.id);
      let thread = threads.find(t => t.accountId === account.id && t.from === msg.from);
      if (!thread) {
        thread = {id:`thread-${account.id}-${msg.from}`,accountId:account.id,contact:msg.contactName,from:msg.from,messages:[]};
        threads.unshift(thread);
      }
      thread.messages.push({id:msg.id,body:msg.body,direction:'in',at:new Date(msg.timestamp).toLocaleTimeString('pt-BR',{hour:'2-digit',minute:'2-digit',timeZone:'UTC'})});
      count++;
    }
    return count;
  }
  function reply(threadId,body) {
    const thread = threads.find(t => t.id === threadId);
    if (!thread || typeof body !== 'string' || !body.trim() || body.length > 4096) return null;
    thread.messages.push({id:`out-${Date.now()}-${Math.random()}`,body:body.trim(),direction:'out',at:new Date().toLocaleTimeString('pt-BR',{hour:'2-digit',minute:'2-digit'})});
    return thread;
  }
  return {accounts,threads,ingest,reply};
}
