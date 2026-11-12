import http from 'node:http';
import {readFile} from 'node:fs/promises';
import {fileURLToPath} from 'node:url';
import path from 'node:path';
import {validMetaSignature,verifyHandshake} from './security.mjs';
import {parseIncomingMessages} from './parser.mjs';
import {makeDemoStore} from './store.mjs';

const webRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../../web');
const staticFiles = new Map([['/',['index.html','text/html; charset=utf-8']],['/app.js',['app.js','application/javascript; charset=utf-8']],['/style.css',['style.css','text/css; charset=utf-8']]]);
function json(res,code,data) {
  res.writeHead(code,{'Content-Type':'application/json; charset=utf-8','Cache-Control':'no-store','X-Content-Type-Options':'nosniff'});
  res.end(JSON.stringify(data));
}
async function readBody(req,max=1024*1024) {
  const chunks=[]; let size=0;
  for await (const part of req) {
    size+=part.length;
    if (size > max) {const e=new Error('large');e.status=413;throw e;}
    chunks.push(part);
  }
  return Buffer.concat(chunks);
}
export function buildServer({env=process.env,store=makeDemoStore()}={}) {
  return http.createServer(async(req,res)=>{
    const url=new URL(req.url,'http://127.0.0.1');
    try {
      if(req.method==='GET' && staticFiles.has(url.pathname)) {
        const [name,type]=staticFiles.get(url.pathname);
        const bytes=await readFile(path.join(webRoot,name));
        res.writeHead(200,{'Content-Type':type,'Cache-Control':'no-store','X-Content-Type-Options':'nosniff','Content-Security-Policy':"default-src 'self'; style-src 'self'; script-src 'self'"});
        return res.end(bytes);
      }
      if(req.method==='GET' && url.pathname==='/api/health') return json(res,200,{ok:true,mode:'demo',liveMessaging:false});
      if(req.method==='GET' && url.pathname==='/api/accounts') return json(res,200,{accounts:store.accounts});
      if(req.method==='GET' && url.pathname==='/api/threads') return json(res,200,{threads:store.threads});
      if(req.method==='POST' && url.pathname==='/api/demo/reply') {
        let data;
        try {data=JSON.parse((await readBody(req,8192)).toString('utf8'));}
        catch {return json(res,400,{error:'invalid_json'});}
        const thread=store.reply(data.threadId,data.body);
        return thread ? json(res,200,{thread}) : json(res,400,{error:'invalid_input'});
      }
      if(url.pathname==='/webhooks/whatsapp' && req.method==='GET') {
        const challenge=verifyHandshake(url,env.META_VERIFY_TOKEN);
        if(challenge===null) return json(res,403,{error:'verification_failed'});
        res.writeHead(200,{'Content-Type':'text/plain; charset=utf-8'});
        return res.end(challenge);
      }
      if(url.pathname==='/webhooks/whatsapp' && req.method==='POST') {
        const raw=await readBody(req);
        if(!validMetaSignature(raw,req.headers['x-hub-signature-256'],env.META_APP_SECRET)) return json(res,403,{error:'invalid_signature'});
        let data;
        try {data=JSON.parse(raw.toString('utf8'));}
        catch {return json(res,400,{error:'invalid_json'});}
        return json(res,200,{received:true,demoMessagesIngested:store.ingest(parseIncomingMessages(data))});
      }
      return json(res,404,{error:'not_found'});
    } catch(error) {return json(res,error.status===413?413:500,{error:error.status===413?'request_too_large':'internal_error'});}
  });
}
if(process.argv[1] && path.resolve(process.argv[1])===fileURLToPath(import.meta.url)) {
  const host=process.env.HOST||'127.0.0.1';
  const port=Number(process.env.PORT||3000);
  buildServer().listen(port,host,()=>console.log(`H4 MultiChat DEMO: http://${host}:${port} — DO NOT EXPOSE`));
}
