'use strict';
let accounts=[]; let threads=[]; let selected=null; let filter='all';
const $=id=>document.getElementById(id);
const accountName=id=>accounts.find(a=>a.id===id)?.name ?? 'Número desconhecido';
async function refresh(){
  try {
    const [a,t]=await Promise.all([fetch('/api/accounts'),fetch('/api/threads')]);
    if(!a.ok||!t.ok) throw new Error('API indisponível');
    accounts=(await a.json()).accounts;
    threads=(await t.json()).threads;
    if(!selected || !threads.some(t=>t.id===selected)) selected=threads[0]?.id ?? null;
    render();
  }catch(err){$('thread-list').textContent='Não foi possível carregar a demonstração.';}
}
function render(){renderAccounts();renderThreads();renderChat();}
function renderAccounts(){
  const wrapper=$('account-buttons'); wrapper.replaceChildren();
  [{id:'all',name:'Todos'},...accounts].forEach(account=>{
    const b=document.createElement('button');b.type='button';b.className='filter-btn'+(filter===account.id?' active':'');
    b.textContent=account.name;b.onclick=()=>{filter=account.id;render()};wrapper.append(b);
  });
}
function renderThreads(){
  const query=$('search').value.toLocaleLowerCase('pt-BR');
  const rows=threads.filter(t=>(filter==='all'||t.accountId===filter)&&`${t.contact} ${t.messages.map(m=>m.body).join(' ')}`.toLocaleLowerCase('pt-BR').includes(query));
  $('thread-count').textContent=String(rows.length);
  const list=$('thread-list');list.replaceChildren();
  if(!rows.length){const p=document.createElement('p');p.className='empty-chat';p.style.padding='25px';p.textContent='Nenhuma conversa encontrada.';list.append(p);return;}
  rows.forEach(t=>{
    const last=t.messages.at(-1);
    const item=document.createElement('button');item.type='button';item.className='thread'+(selected===t.id?' active':'');
    const avatar=document.createElement('span');avatar.className='avatar';avatar.textContent=t.contact.slice(0,1).toUpperCase();
    const content=document.createElement('div');content.className='thread-content';
    const line=document.createElement('div');line.className='thread-top';
    const name=document.createElement('span');name.className='thread-name';name.textContent=t.contact;
    const at=document.createElement('span');at.className='thread-time';at.textContent=last?.at||'';
    line.append(name,at);
    const preview=document.createElement('div');preview.className='thread-preview';preview.textContent=last?.body||'';
    const acc=document.createElement('div');acc.className='thread-account';acc.textContent='● '+accountName(t.accountId);
    content.append(line,preview,acc);item.append(avatar,content);
    item.onclick=()=>{selected=t.id;render()};list.append(item);
  });
}
function renderChat(){
  const thread=threads.find(t=>t.id===selected);
  $('chat-contact').textContent=thread?.contact||'Selecione uma conversa';
  $('chat-account').textContent=thread?`Recebido em: ${accountName(thread.accountId)} · DEMO`:'Ambiente demonstrativo';
  $('chat-avatar').textContent=thread?.contact.slice(0,1).toUpperCase()||'?';
  $('message').disabled=!thread;$('send').disabled=!thread;
  const body=$('chat-body');body.replaceChildren();
  if(!thread){body.textContent='Selecione uma conversa.';return;}
  for(const m of thread.messages){
    const bubble=document.createElement('div');bubble.className='bubble'+(m.direction==='out'?' out':'');
    const text=document.createElement('div');text.textContent=m.body;
    const time=document.createElement('time');time.textContent=m.at;
    bubble.append(text,time);body.append(bubble);
  }
  body.scrollTop=body.scrollHeight;
}
$('refresh').addEventListener('click',refresh);
$('search').addEventListener('input',renderThreads);
$('message-form').addEventListener('submit',async event=>{
  event.preventDefault();const body=$('message').value.trim();
  if(!body||!selected)return;
  $('send').disabled=true;
  try{
    const response=await fetch('/api/demo/reply',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({threadId:selected,body})});
    if(!response.ok)throw new Error('Falha na simulação');
    $('message').value='';await refresh();
  }catch{alert('Não foi possível registrar a mensagem simulada.');}
  finally{$('send').disabled=false;}
});
refresh();
