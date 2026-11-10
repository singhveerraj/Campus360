import express from 'express';
import cors from 'cors';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DATA_FILE = path.join(__dirname, 'data.json');
const app = express();
app.use(cors());
app.use(express.json());

const seed = {
  notices: [
    {id:1,title:'Mid-semester examination schedule released',category:'Examinations',date:'Today',body:'Check your department portal for the updated examination timetable.',important:true},
    {id:2,title:'Innovation & Entrepreneurship Week',category:'Events',date:'Yesterday',body:'Registrations are open for workshops, mentor sessions and the project showcase.',important:false},
    {id:3,title:'Library hours extended this week',category:'Facilities',date:'Nov 8',body:'The central library will remain open until 9:00 PM during preparation week.',important:false}
  ],
  events: [
    {id:1,title:'Campus Innovation Fest',date:'Nov 14, 2026',time:'10:00 AM',place:'Main Auditorium',tag:'Technology',spots:42},
    {id:2,title:'Design Thinking Workshop',date:'Nov 16, 2026',time:'11:30 AM',place:'Innovation Lab',tag:'Workshop',spots:18},
    {id:3,title:'Inter-Department Sports Meet',date:'Nov 20, 2026',time:'9:00 AM',place:'Sports Ground',tag:'Sports',spots:76}
  ],
  tickets: [],
  lostFound: []
};
function readData(){
  if(!fs.existsSync(DATA_FILE)) fs.writeFileSync(DATA_FILE, JSON.stringify(seed,null,2));
  try{return JSON.parse(fs.readFileSync(DATA_FILE,'utf8'));}catch{return structuredClone(seed);}
}
let db = readData();
function save(){fs.writeFileSync(DATA_FILE,JSON.stringify(db,null,2));}
app.get('/api/health',(req,res)=>res.json({ok:true,service:'Campus360 API'}));
app.get('/api/notices',(req,res)=>res.json(db.notices));
app.post('/api/notices',(req,res)=>{
  const {title,category='General',body=''}=req.body||{};
  if(!title?.trim()) return res.status(400).json({error:'Title is required'});
  const item={id:Date.now(),title:title.trim(),category,body,date:'Just now',important:false};
  db.notices.unshift(item);save();res.status(201).json(item);
});
app.get('/api/events',(req,res)=>res.json(db.events));
app.get('/api/tickets',(req,res)=>res.json(db.tickets));
app.post('/api/tickets',(req,res)=>{
  const {title,category='Other',description=''}=req.body||{};
  if(!title?.trim()||!description?.trim()) return res.status(400).json({error:'Title and description are required'});
  const item={id:Date.now(),title:title.trim(),category,description,status:'Submitted',date:new Date().toLocaleDateString()};
  db.tickets.unshift(item);save();res.status(201).json(item);
});
app.patch('/api/tickets/:id',(req,res)=>{
  const item=db.tickets.find(t=>String(t.id)===req.params.id);
  if(!item)return res.status(404).json({error:'Ticket not found'});
  const allowed=['Submitted','In Progress','Resolved'];
  if(!allowed.includes(req.body.status))return res.status(400).json({error:'Invalid status'});
  item.status=req.body.status;save();res.json(item);
});
app.get('/api/lost-found',(req,res)=>res.json(db.lostFound));
app.post('/api/lost-found',(req,res)=>{
  const {name,kind='Lost',location=''}=req.body||{};
  if(!name?.trim())return res.status(400).json({error:'Item name is required'});
  const item={id:Date.now(),name:name.trim(),kind,location,status:'Open',date:new Date().toLocaleDateString()};
  db.lostFound.unshift(item);save();res.status(201).json(item);
});
const port=process.env.PORT||4000;
app.listen(port,()=>console.log(`Campus360 API running at http://localhost:${port}`));
