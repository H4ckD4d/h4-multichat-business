import test from 'node:test';
import assert from 'node:assert/strict';
import {createHmac} from 'node:crypto';
import {validMetaSignature,verifyHandshake} from '../src/security.mjs';
import {parseIncomingMessages} from '../src/parser.mjs';
import {makeDemoStore} from '../src/store.mjs';
import {buildServer} from '../src/server.mjs';

test('Assinatura HMAC do webhook aceita corpo original e rejeita modificações',()=>{
  const raw=Buffer.from('{"a":1}');
  const signature='sha256='+createHmac('sha256','secret').update(raw).digest('hex');
  assert.equal(validMetaSignature(raw,signature,'secret'),true);
  assert.equal(validMetaSignature(Buffer.from('{"a":2}'),signature,'secret'),false);
  assert.equal(validMetaSignature(raw,'sha256=wrong','secret'),false);
  assert.equal(validMetaSignature(raw,signature,''),false);
});

test('Handshake exige token válido e modo subscribe',()=>{
  const url=new URL('https://example.invalid/webhooks/whatsapp?hub.mode=subscribe&hub.verify_token=ok&hub.challenge=123');
  assert.equal(verifyHandshake(url,'ok'),'123');
  assert.equal(verifyHandshake(url,'no'),null);
});

test('Parser extrai apenas texto dos eventos oficiais',()=>{
  const data={object:'whatsapp_business_account',entry:[{changes:[{value:{metadata:{phone_number_id:'demo-1'},contacts:[{wa_id:'5511',profile:{name:'Ana'}}],messages:[{id:'wamid.1',from:'5511',type:'text',text:{body:'Olá'},timestamp:'1770000000'},{id:'wamid.2',type:'image'}]}}]}]};
  assert.deepEqual(parseIncomingMessages(data).map(({id,contactName,phoneNumberId,body})=>({id,contactName,phoneNumberId,body})),[{id:'wamid.1',contactName:'Ana',phoneNumberId:'demo-1',body:'Olá'}]);
});

test('Store deduplica IDs e rejeita telefone desconhecido',()=>{
  const store=makeDemoStore();
  const message={id:'wamid.3',phoneNumberId:'demo-2',from:'5531',contactName:'Teste',body:'Mensagem',timestamp:Date.now()};
  assert.equal(store.ingest([message,message]),1);
  assert.equal(store.threads.find(t=>t.accountId==='suporte'&&t.from==='5531').messages.length,1);
  assert.equal(store.ingest([{...message,id:'wamid.4',phoneNumberId:'desconhecido'}]),0);
});

test('HTTP: endpoints demo, handshake e webhook assinado',async(t)=>{
  const server=buildServer({env:{META_VERIFY_TOKEN:'token',META_APP_SECRET:'secret'}});
  await new Promise(resolve=>server.listen(0,'127.0.0.1',resolve));
  t.after(()=>new Promise(resolve=>server.close(resolve)));
  const base=`http://127.0.0.1:${server.address().port}`;
  const health=await fetch(base+'/api/health');
  assert.equal(health.status,200);
  assert.equal((await health.json()).liveMessaging,false);
  const verify=await fetch(base+'/webhooks/whatsapp?hub.mode=subscribe&hub.verify_token=token&hub.challenge=42');
  assert.equal(await verify.text(),'42');
  const payload=Buffer.from(JSON.stringify({object:'whatsapp_business_account',entry:[{changes:[{value:{metadata:{phone_number_id:'demo-1'},messages:[{id:'wamid.test',from:'55001',type:'text',text:{body:'Teste'}}]}}]}]}));
  const signature='sha256='+createHmac('sha256','secret').update(payload).digest('hex');
  const post=await fetch(base+'/webhooks/whatsapp',{method:'POST',body:payload,headers:{'Content-Type':'application/json','X-Hub-Signature-256':signature}});
  assert.equal(post.status,200);
  const reply=await fetch(base+'/api/demo/reply',{method:'POST',body:JSON.stringify({threadId:'t1',body:'Retorno demo'})});
  assert.equal(reply.status,200);
  const threads=(await (await fetch(base+'/api/threads')).json()).threads;
  assert.ok(threads.find(x=>x.from==='55001'));
  assert.equal(threads.find(x=>x.id==='t1').messages.at(-1).body,'Retorno demo');
});
