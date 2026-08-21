const KEY = 'hargun-panauti-tracker-v1';
const $ = (id) => document.getElementById(id);
let state = load();

function load(){
  try { return JSON.parse(localStorage.getItem(KEY)) || {events:[]}; }
  catch { return {events:[]}; }
}
function save(){ localStorage.setItem(KEY, JSON.stringify(state)); }
function localDateTimeValue(d=new Date()){
  const pad=n=>String(n).padStart(2,'0');
  return `${d.getFullYear()}-${pad(d.getMonth()+1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
}
function formatDate(iso){
  const d=new Date(iso); if(Number.isNaN(d.getTime())) return 'Unknown';
  return new Intl.DateTimeFormat(undefined,{month:'short',day:'numeric',year:'numeric',hour:'numeric',minute:'2-digit'}).format(d);
}
function render(){
  const events=[...state.events].sort((a,b)=>new Date(b.timestamp)-new Date(a.timestamp));
  $('totalCount').textContent=events.length;
  $('lastRecorded').textContent=events[0] ? formatDate(events[0].timestamp) : 'No events yet';
  $('history').innerHTML = events.length ? events.slice(0,5).map(row).join('') : '<div class="empty">No panauti recorded yet. Submit your first one.</div>';
  $('allHistory').innerHTML = events.length ? events.map(row).join('') : '<div class="empty">Your record is mercifully clean.</div>';
  document.querySelectorAll('[data-delete]').forEach(btn=>btn.addEventListener('click',()=>remove(btn.dataset.delete)));
}
function row(e){
  return `<div class="history-row"><div class="num">${e.count}</div><div class="meta"><div class="badge"><span class="dot ${escapeHtml(e.severity)}"></span>${escapeHtml(e.severity)}</div>${e.notes?`<div class="note">${escapeHtml(e.notes)}</div>`:''}</div><div class="cat">⌑ &nbsp;${escapeHtml(e.category)}</div><div class="date">${formatDate(e.timestamp)}</div><button class="trash" data-delete="${e.id}" title="Delete event" aria-label="Delete event">⌫</button></div>`;
}
function escapeHtml(s){return String(s??'').replace(/[&<>'"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[c]));}
function addEvent(){
  const selectedCategory=$('category').value;
  const specified=$('otherCategory').value.trim();
  const category=selectedCategory==='Others — please specify' ? (specified || 'Others — please specify') : selectedCategory;
  const event={
    id:crypto.randomUUID?.() || String(Date.now()),
    count:state.events.length+1,
    timestamp:new Date($('eventDate').value ? $('eventDate').value : Date.now()).toISOString(),
    severity:$('severity').value,
    category,
    notes:$('notes').value.trim()
  };
  state.events.push(event);
  save();
  render();
  $('notes').value='';
  $('otherCategory').value='';
  $('category').value='SPC';
  $('otherCategoryWrap').classList.add('hidden');
  $('eventDate').value=localDateTimeValue();
  document.querySelector('.history-panel').scrollIntoView({behavior:'smooth',block:'nearest'});
}
function remove(id){state.events=state.events.filter(e=>e.id!==id);state.events.sort((a,b)=>new Date(a.timestamp)-new Date(b.timestamp));state.events.forEach((e,i)=>e.count=i+1);save();render();}
function clear(){if(confirm('Clear the entire panauti history? This cannot be undone.')){state={events:[]};save();render();}}
$('eventDate').value=localDateTimeValue();
$('eventForm').addEventListener('submit',e=>{e.preventDefault();addEvent();});
$('category').addEventListener('change',e=>{
  const show=e.target.value==='Others — please specify';
  $('otherCategoryWrap').classList.toggle('hidden',!show);
  if(show) $('otherCategory').focus();
});
$('resetAll').addEventListener('click',clear);
$('clearHistory').addEventListener('click',clear);
$('viewAll').addEventListener('click',()=>$('allHistoryDialog').showModal());
$('closeDialog').addEventListener('click',()=>$('allHistoryDialog').close());
$('allHistoryDialog').addEventListener('click',e=>{if(e.target===$('allHistoryDialog')) $('allHistoryDialog').close();});
render();
