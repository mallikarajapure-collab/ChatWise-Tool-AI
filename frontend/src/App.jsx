import { useEffect, useMemo, useState } from 'react'
import { Activity, ArrowDownRight, ArrowRight, BookOpen, Bot, Check, ChevronDown, CircleHelp, ExternalLink, FlaskConical, Gauge, Layers3, LoaderCircle, Plus, Search, Send, ShieldCheck, Sparkles, WandSparkles, X } from 'lucide-react'

const API = 'http://127.0.0.1:8000/api'
const nav = [
  { id: 'discover', label: 'Discover tools', icon: Search },
  { id: 'compare', label: 'Response lab', icon: FlaskConical },
  { id: 'knowledge', label: 'Knowledge base', icon: BookOpen },
  { id: 'history', label: 'Evaluation history', icon: Activity },
]
const initials = (name='AI') => name.split(/\s+/).map(s=>s[0]).join('').slice(0,2).toUpperCase()

export default function App() {
  const [page, setPage] = useState('discover')
  const [health, setHealth] = useState(null)
  const [tools, setTools] = useState([])
  const [evaluations, setEvaluations] = useState([])
  const [task, setTask] = useState('')
  const [budget, setBudget] = useState('Any')
  const [priority, setPriority] = useState('Balanced')
  const [result, setResult] = useState(null)
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')
  const [toast, setToast] = useState('')
  const [comparePrompt, setComparePrompt] = useState('')
  const [compareItems, setCompareItems] = useState([
    {tool:'ChatGPT',response:'',correctness:3,relevance:3,clarity:3,notes:''},
    {tool:'Gemini',response:'',correctness:3,relevance:3,clarity:3,notes:''},
  ])
  const [entry, setEntry] = useState({name:'',category:'General',summary:'',strengths:'',limitations:'',pricing:'Check official site',source_url:''})

  async function request(path, options={}) {
    const response = await fetch(`${API}${path}`, {headers:{'Content-Type':'application/json'}, ...options})
    const body = await response.json().catch(()=>({}))
    if (!response.ok) throw new Error(body.detail || `Request failed (${response.status})`)
    return body
  }
  async function refresh() {
    try {
      const [h,t,e] = await Promise.all([request('/health'),request('/tools'),request('/evaluations')])
      setHealth(h); setTools(t); setEvaluations(e); setError('')
    } catch { setHealth(null); setError('Backend is not connected. Start the FastAPI server in the backend folder.') }
  }
  useEffect(()=>{ refresh() },[])
  function notify(message) { setToast(message); window.setTimeout(()=>setToast(''),2600) }

  async function findTools(e) {
    e?.preventDefault()
    if (task.trim().length < 3) { setError('Describe the task in a little more detail.'); return }
    setBusy(true); setError(''); setResult(null)
    try { setResult(await request('/recommend',{method:'POST',body:JSON.stringify({task,budget,priority,limit:3})})) }
    catch(err) { setError(err.message) }
    finally { setBusy(false) }
  }
  async function saveComparison(e) {
    e.preventDefault()
    if (comparePrompt.trim().length < 3) { setError('Enter the prompt you tested.'); return }
    if (compareItems.length < 2 || compareItems.some(x=>!x.response.trim())) { setError('Paste a response for every tool before saving.'); return }
    setBusy(true); setError('')
    try {
      await request('/compare',{method:'POST',body:JSON.stringify({prompt:comparePrompt,items:compareItems})})
      await refresh(); notify('Comparison saved'); setPage('history')
    } catch(err) { setError(err.message) }
    finally { setBusy(false) }
  }
  async function saveEntry(e) {
    e.preventDefault()
    try {
      await request('/tools',{method:'POST',body:JSON.stringify({...entry,strengths:entry.strengths.split(',').map(x=>x.trim()).filter(Boolean),limitations:entry.limitations.split(',').map(x=>x.trim()).filter(Boolean),last_verified:'Needs verification'})})
      setEntry({name:'',category:'General',summary:'',strengths:'',limitations:'',pricing:'Check official site',source_url:''})
      await refresh(); notify('Knowledge entry added')
    } catch(err) { setError(err.message) }
  }
  const average = item => ((item.correctness+item.relevance+item.clarity)/3).toFixed(1)
  const top = useMemo(()=>result?.recommendations?.[0], [result])

  return <div className="app-shell">
    <aside className="sidebar">
      <div className="brand"><div className="brand-mark"><WandSparkles size={21}/></div><div><b>chatwise<span>.ai</span></b><small>AI TOOL INTELLIGENCE</small></div></div>
      <div className="workspace"><div className="workspace-dot">C</div><div><b>Personal workspace</b><small>GIST · Task 04</small></div><ChevronDown size={15}/></div>
      <div className="nav-label">WORKSPACE</div>
      <nav>{nav.map(item=><button key={item.id} className={`nav-item ${page===item.id?'active':''}`} onClick={()=>{setPage(item.id);setError('')}}><item.icon size={17}/><span>{item.label}</span>{item.id==='history'&&evaluations.length>0&&<em>{evaluations.length}</em>}</button>)}</nav>
      <div className="sidebar-bottom"><div className="help-icon"><CircleHelp size={17}/></div><div><b>Evidence over hype.</b><p>Find tools by fit, then test them with your own prompts.</p></div></div>
      <div className="profile"><div className="avatar">CW</div><div><b>ChatWise AI</b><small>Research workspace</small></div><div className="profile-menu">···</div></div>
    </aside>
    <main className="main">
      <header className="topbar"><div className="breadcrumbs">Workspace <span>/</span> <b>{nav.find(x=>x.id===page)?.label || 'Overview'}</b></div><div className="top-actions"><div className={`api-status ${health?'online':'offline'}`}><i/>{health?'API connected':'API offline'}</div><button className="icon-button" title="Refresh backend status" onClick={refresh}><Activity size={17}/></button></div></header>
      <div className="content">
        {error&&<div className="alert"><CircleHelp size={17}/><span>{error}</span><button onClick={()=>setError('')}><X size={15}/></button></div>}
        {page==='discover'&&<>
          <div className="eyebrow"><Sparkles size={14}/> PERSONALIZED AI DISCOVERY</div>
          <div className="hero-row"><div><h1>Find the AI that<br/><span>fits your workflow.</span></h1><p className="lede">Skip the hype. Describe what you need and get recommendations grounded in tool knowledge, limitations, and source links.</p></div><div className="hero-art"><div className="orbit orbit-one"></div><div className="orbit orbit-two"></div><div className="core"><WandSparkles size={31}/></div><div className="orbit-node node-a"><Bot size={17}/></div><div className="orbit-node node-b"><Search size={17}/></div><div className="orbit-node node-c"><Layers3 size={17}/></div></div></div>
          <form className="search-panel" onSubmit={findTools}><div className="panel-heading"><div className="panel-icon"><Search size={18}/></div><div><b>What are you trying to do?</b><small>Be specific. Context helps us find a better fit.</small></div><span className="step-pill">01 / DISCOVER</span></div><textarea value={task} onChange={e=>setTask(e.target.value)} placeholder="e.g. I need to summarize research papers, compare sources, and create cited study notes..." rows="3"/><div className="filters"><label><span>Budget</span><select value={budget} onChange={e=>setBudget(e.target.value)}><option>Any</option><option>Free</option><option>Paid</option></select></label><label><span>Priority</span><select value={priority} onChange={e=>setPriority(e.target.value)}><option>Balanced</option><option>Research and citations</option><option>Writing quality</option><option>Coding support</option><option>Document Q&A</option></select></label><button className="primary-button" disabled={busy}>{busy?<LoaderCircle className="spin" size={17}/>:<Sparkles size={16}/>} Find my fit <ArrowRight size={16}/></button></div></form>
          <div className="section-title"><div><span className="eyebrow">HOW IT WORKS</span><h2>From question to confident choice.</h2></div><span className="muted small">A transparent, evidence-first workflow</span></div>
          <div className="steps-grid"><div className="step-card"><span className="step-number">01</span><div className="step-icon purple"><Search size={18}/></div><h3>Retrieve evidence</h3><p>Search the local knowledge base for relevant capabilities and trade-offs.</p></div><div className="step-card"><span className="step-number">02</span><div className="step-icon blue"><ShieldCheck size={18}/></div><h3>Inspect sources</h3><p>Review evidence snippets and official links before trusting a recommendation.</p></div><div className="step-card"><span className="step-number">03</span><div className="step-icon orange"><FlaskConical size={18}/></div><h3>Test side by side</h3><p>Use the Response Lab to compare answers to the same prompt.</p></div></div>
          {result&&<section className="results"><div className="section-title"><div><span className="eyebrow">YOUR MATCHES</span><h2>Recommendations for your task</h2></div><span className="step-pill">{result.recommendations.length} RESULTS</span></div><div className="answer-card"><div className="answer-heading"><Sparkles size={18}/><b>ChatWise analysis</b><span>Evidence-based summary</span></div><p>{result.answer}</p><small>{result.retrieval_method} · {result.note}</small></div><div className="tool-grid">{result.recommendations.map((tool,i)=><article className="tool-card" key={tool.name}><div className="tool-top"><div className={`tool-logo logo-${i}`}>{initials(tool.name)}</div><span className="match-tag">{tool.relevance_score}% relevance</span></div><h3>{tool.name}</h3><p>{tool.summary}</p><div className="evidence"><b><ShieldCheck size={14}/> Evidence</b><span>{tool.evidence}</span></div><div className="tag-row">{(tool.strengths||[]).slice(0,2).map(s=><span key={s}>{s}</span>)}</div>{tool.limitations?.length>0&&<div className="limitation"><b>Watch out</b><p>{tool.limitations.join(' · ')}</p></div>}<a href={tool.source_url} target="_blank" rel="noreferrer">Official source <ExternalLink size={13}/></a></article>)}</div></section>}
          <div className="bottom-note"><ShieldCheck size={17}/><span><b>Designed for transparent decisions.</b> Similarity is not quality. Verify current features and pricing in official sources.</span><ArrowDownRight size={17}/></div>
        </>}
        {page==='compare'&&<><div className="eyebrow"><FlaskConical size={14}/> SIDE-BY-SIDE EVALUATION</div><h1 className="page-heading">The response lab<span>.</span></h1><p className="lede">Give different tools the same prompt, paste their answers, then rate them using the same criteria.</p><form className="lab-panel" onSubmit={saveComparison}><label className="field-label">TEST PROMPT<textarea value={comparePrompt} onChange={e=>setComparePrompt(e.target.value)} rows="3" placeholder="Paste the exact prompt you gave every AI tool..."/></label><div className="lab-header"><div><h2>Responses to evaluate</h2><p>Use the same prompt for each tool.</p></div><button type="button" className="secondary-button" disabled={compareItems.length>=4} onClick={()=>setCompareItems([...compareItems,{tool:'',response:'',correctness:3,relevance:3,clarity:3,notes:''}])}><Plus size={15}/> Add tool</button></div><div className="response-grid">{compareItems.map((item,i)=><div className="response-card" key={i}><div className="response-title"><div className="tool-logo">{initials(item.tool||`Tool ${i+1}`)}</div><input aria-label="Tool name" value={item.tool} onChange={e=>setCompareItems(compareItems.map((x,j)=>i===j?{...x,tool:e.target.value}:x))} placeholder={`Tool ${i+1} name`}/>{compareItems.length>2&&<button type="button" className="plain-icon" onClick={()=>setCompareItems(compareItems.filter((_,j)=>j!==i))}><X size={15}/></button>}</div><textarea rows="6" value={item.response} onChange={e=>setCompareItems(compareItems.map((x,j)=>i===j?{...x,response:e.target.value}:x))} placeholder="Paste the complete AI response here..."/><div className="ratings">{[['Correctness','correctness'],['Relevance','relevance'],['Clarity','clarity']].map(([label,key])=><label key={key}><span>{label}</span><select value={item[key]} onChange={e=>setCompareItems(compareItems.map((x,j)=>i===j?{...x,[key]:Number(e.target.value)}:x))}>{[1,2,3,4,5].map(n=><option key={n} value={n}>{n} / 5</option>)}</select></label>)}</div><div className="score-row"><span>Mean of your ratings</span><b>{average(item)} <small>/ 5</small></b></div><input className="notes-input" value={item.notes} onChange={e=>setCompareItems(compareItems.map((x,j)=>i===j?{...x,notes:e.target.value}:x))} placeholder="Optional notes / evidence"/></div>)}</div><div className="lab-footer"><span><ShieldCheck size={15}/> Human-rated evaluation · not an objective benchmark</span><button className="primary-button" disabled={busy}>{busy?<LoaderCircle className="spin" size={16}/>:<Check size={16}/>} Save comparison</button></div></form></>}
        {page==='knowledge'&&<><div className="eyebrow"><BookOpen size={14}/> RETRIEVAL SOURCE LIBRARY</div><h1 className="page-heading">Knowledge base<span>.</span></h1><p className="lede">The evidence layer behind recommendations. Review every entry and add verified sources as your project grows.</p><div className="stats-row"><div className="stat-card"><span>TOOL ENTRIES</span><b>{tools.length}</b><small>Stored locally in JSON</small></div><div className="stat-card"><span>RETRIEVAL</span><b>TF-IDF</b><small>Lexical relevance ranking</small></div><div className="stat-card"><span>SOURCE CHECK</span><b>Manual</b><small>Verify before submission</small></div></div><div className="knowledge-layout"><div className="kb-list"><div className="list-head"><h2>Current entries</h2><span>{tools.length} tools</span></div>{tools.map(t=><article className="kb-item" key={t.name}><div className="tool-logo">{initials(t.name)}</div><div className="kb-main"><div className="kb-name">{t.name}<span>{t.category}</span></div><p>{t.summary}</p><div className="kb-meta"><a href={t.source_url} target="_blank" rel="noreferrer">Open source <ExternalLink size={12}/></a><span>{t.last_verified}</span></div></div></article>)}</div><form className="add-form" onSubmit={saveEntry}><h2><Plus size={18}/> Add knowledge entry</h2><p>Use official-source information. Keep limitations clear.</p><label>Name<input required value={entry.name} onChange={e=>setEntry({...entry,name:e.target.value})} placeholder="AI tool name"/></label><label>Category<input value={entry.category} onChange={e=>setEntry({...entry,category:e.target.value})}/></label><label>Summary<textarea required minLength="10" rows="3" value={entry.summary} onChange={e=>setEntry({...entry,summary:e.target.value})} placeholder="What does it help with?"/></label><label>Strengths <small>(comma-separated)</small><input value={entry.strengths} onChange={e=>setEntry({...entry,strengths:e.target.value})} placeholder="Research, writing"/></label><label>Limitations <small>(comma-separated)</small><input value={entry.limitations} onChange={e=>setEntry({...entry,limitations:e.target.value})} placeholder="Usage limits, verify facts"/></label><label>Pricing note<input value={entry.pricing} onChange={e=>setEntry({...entry,pricing:e.target.value})}/></label><label>Official source URL<input type="url" value={entry.source_url} onChange={e=>setEntry({...entry,source_url:e.target.value})} placeholder="https://..."/></label><button className="primary-button full" type="submit"><Plus size={16}/> Save entry</button></form></div></>}
        {page==='history'&&<><div className="eyebrow"><Activity size={14}/> YOUR TEST RECORDS</div><h1 className="page-heading">Evaluation history<span>.</span></h1><p className="lede">A local log of your comparisons, so you can inspect what you tested and why a tool fit.</p>{evaluations.length===0?<div className="empty-state"><div className="empty-icon"><FlaskConical size={24}/></div><h2>No comparisons saved yet</h2><p>Open the Response Lab, test at least two answers, and save your first comparison.</p><button className="primary-button" onClick={()=>setPage('compare')}>Go to Response Lab <ArrowRight size={16}/></button></div>:<div className="history-list">{evaluations.map((e,i)=><article className="history-card" key={i}><div className="history-top"><div><span className="eyebrow">COMPARISON {String(evaluations.length-i).padStart(2,'0')}</span><h2>{e.prompt}</h2></div><span className="date">{new Date(e.created_at).toLocaleString()}</span></div><div className="history-tools">{e.items.map((it,j)=><div className="history-tool" key={j}><div className="tool-logo">{initials(it.tool)}</div><div><b>{it.tool}</b><small>{it.response.slice(0,130)}{it.response.length>130?'…':''}</small></div><strong>{average(it)}<small>/5</small></strong></div>)}</div><small className="muted">{e.method}</small></article>)}</div>}</>}
      </div>
      <footer className="footer"><span>CHATWISE AI <i>·</i> GIST INTERNSHIP PROJECT</span><span>Built for evidence-first AI discovery</span></footer>
    </main>
    {toast&&<div className="toast"><Check size={16}/>{toast}</div>}
  </div>
}
