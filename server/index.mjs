import http from 'node:http';
import { readFileSync, existsSync } from 'node:fs';
const PORT=Number(process.env.PORT||8787);
const KEY=process.env.OPENAI_API_KEY;
const MODEL=process.env.OPENAI_MODEL||'gpt-6.2-astra';
const ORIGIN=process.env.ALLOWED_ORIGIN||'*';
const system=`You are English Speaking Master, a patient expert English conversation tutor for Persian-speaking learners. Teach from absolute beginner to advanced. Reply primarily in Persian, while using natural English examples. Correct the learner's English gently: show their original sentence, corrected sentence, a brief Persian explanation, and one natural alternative when useful. Keep conversation interactive: ask one question at a time, adapt to their level, and encourage them to answer in English. Use transliteration in Persian only when useful. Do not claim to hear pronunciation from text. For roleplay, stay in character but give concise feedback after each learner turn.`;
const server=http.createServer(async(req,res)=>{
  const headers={'Access-Control-Allow-Origin':ORIGIN,'Access-Control-Allow-Methods':'POST, OPTIONS','Access-Control-Allow-Headers':'Content-Type'};
  if(req.method==='OPTIONS'){res.writeHead(204,headers);return res.end();}
  if(req.url==='/health'){res.writeHead(200,{...headers,'Content-Type':'application/json'});return res.end(JSON.stringify({ok:true,service:'English Speaking Master AI'}));}
  if(req.method!=='POST'||req.url!=='/api/chat'){res.writeHead(404,headers);return res.end(JSON.stringify({error:'Not found'}));}
  if(!KEY){res.writeHead(503,{...headers,'Content-Type':'application/json'});return res.end(JSON.stringify({error:'OPENAI_API_KEY روی سرور تنظیم نشده است.'}));}
  let body='';req.on('data',c=>{body+=c;if(body.length>50000)req.destroy();});
  req.on('end',async()=>{try{
    const parsed=JSON.parse(body);const messages=Array.isArray(parsed.messages)?parsed.messages.slice(-12):[];
    if(!messages.length)throw new Error('پیام خالی است.');
    const input=messages.map(m=>({role:m.role==='assistant'?'assistant':'user',content:String(m.text||'').slice(0,4000)}));
    const upstream=await fetch('https://api.openai.com/v1/responses',{method:'POST',headers:{'Authorization':`Bearer ${KEY}`,'Content-Type':'application/json'},body:JSON.stringify({model:MODEL,instructions:system,input,max_output_tokens:700})});
    const data=await upstream.json();
    if(!upstream.ok){res.writeHead(upstream.status,{...headers,'Content-Type':'application/json'});return res.end(JSON.stringify({error:data.error?.message||'خطا در سرویس هوش مصنوعی'}));}
    res.writeHead(200,{...headers,'Content-Type':'application/json'});res.end(JSON.stringify({reply:data.output_text||'متأسفم، پاسخی دریافت نشد.'}));
  }catch(e){res.writeHead(400,{...headers,'Content-Type':'application/json'});res.end(JSON.stringify({error:e.message||'درخواست نامعتبر است.'}));}});
});
server.listen(PORT,()=>console.log(`AI server listening on http://localhost:${PORT}`));
