import { useEffect, useState } from 'react'
import { onAuthStateChanged, signInWithEmailAndPassword, signOut, User } from 'firebase/auth'
import { addDoc, collection, deleteDoc, doc, doc as fdoc, setDoc as fSetDoc, updateDoc } from 'firebase/firestore'
import { auth, db } from '../lib/firebase'
import { uploadImage, fit } from '../lib/cloudinary'
import { useItems, Item, useHotspots, Hotspot, useProfile } from '../lib/content'
import { jewelryCategories } from '../data/placeholder'

const tabs: [string, string][] = [['jewelry', 'Joyería'], ['references', 'Referencias'], ['certificates', 'Certificados'], ['looks', 'Estilos'], ['hotspots', 'Perforaciones']]

function ItemCard({ it, name, refresh }: { it: Item; name: string; refresh: () => void }) {
  const [price, setPrice] = useState(it.price != null ? String(it.price) : '')
  const [category, setCategory] = useState<string>(it.category ?? jewelryCategories[0])
  const [saved, setSaved] = useState('')
  const ar = name === 'jewelry' ? '4:5' : name === 'references' ? '1:1' : name === 'looks' ? '4:5' : undefined
  const cls = name === 'references' ? 'frame sq' : name === 'certificates' ? 'frame tall' : 'frame'
  async function savePrice() {
    if (!db) return
    await updateDoc(doc(db, name, it.id), { price: price === '' ? null : Number(price), category })
    setSaved('Guardado')
  }
  async function remove() {
    if (!db || !confirm('¿Eliminar este elemento?')) return
    await deleteDoc(doc(db, name, it.id)); refresh()
  }
  return (
    <figure className="slot">
      <div className={cls}><img src={fit(it.image, 500, ar)} alt={it.title} /></div>
      <figcaption>{it.title} <button onClick={remove}>Eliminar</button></figcaption>
      {name === 'jewelry' && (
        <div className="adm-price">
          <select value={category} onChange={(e) => { setCategory(e.target.value); setSaved('') }} aria-label="Sección">
            {jewelryCategories.map((c) => <option key={c} value={c}>{c}</option>)}
          </select>
          <input type="number" min="0" placeholder="Precio (MXN)" value={price} onChange={(e) => { setPrice(e.target.value); setSaved('') }} />
          <button onClick={savePrice}>Guardar</button><span role="status">{saved}</span>
        </div>
      )}
    </figure>
  )
}

function Manager({ name }: { name: string }) {
  const [tick, setTick] = useState(0)
  const items = useItems(name, [], tick)
  const [title, setTitle] = useState('')
  const [price, setPrice] = useState('')
  const [category, setCategory] = useState<string>(jewelryCategories[0])
  const [file, setFile] = useState<File | null>(null)
  const [msg, setMsg] = useState('')

  async function add() {
    if (!db || !file) return setMsg('Elige una foto.')
    try {
      setMsg('Subiendo…')
      const image = await uploadImage(file)
      const data: Record<string, unknown> = { title, image, order: Date.now() }
      if (name === 'jewelry') { data.price = price === '' ? null : Number(price); data.category = category }
      await addDoc(collection(db, name), data)
      setTitle(''); setPrice(''); setFile(null); setMsg('Guardado.'); setTick((t) => t + 1)
    } catch { setMsg('No se pudo guardar. Revisa tu conexión y la configuración de Cloudinary y Firebase.') }
  }
  return (
    <div>
      {name === 'looks' && <p className="lead">Sube aquí las fotos con las piezas ya editadas. Luego, en la pestaña Perforaciones, marca dónde va cada precio.</p>}
      <div className="adm-form">
        <input placeholder="Título" value={title} onChange={(e) => setTitle(e.target.value)} />
        {name === 'jewelry' && (
          <>
            <select value={category} onChange={(e) => setCategory(e.target.value)} aria-label="Sección">
              {jewelryCategories.map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
            <input type="number" min="0" placeholder="Precio (MXN)" value={price} onChange={(e) => setPrice(e.target.value)} />
          </>
        )}
        <input key={tick} type="file" accept="image/*" onChange={(e) => setFile(e.target.files?.[0] ?? null)} />
        <button onClick={add}>Agregar</button>
        <span role="status">{msg}</span>
      </div>
      <div className="grid g4">
        {items.map((it) => <ItemCard key={it.id} it={it} name={name} refresh={() => setTick((t) => t + 1)} />)}
      </div>
    </div>
  )
}

function HotspotRow({ h, onSaved, onDeleted }: { h: Hotspot; onSaved: () => void; onDeleted: () => void }) {
  const [name, setName] = useState(h.name)
  const [price, setPrice] = useState(String(h.price))
  const [healing, setHealing] = useState(h.healing ?? '')
  const [msg, setMsg] = useState('')
  async function save() {
    if (!db) return
    try { await updateDoc(doc(db, 'hotspots', h.id), { name, price: Number(price), healing }); setMsg('Guardado'); onSaved() }
    catch { setMsg('No se pudo guardar') }
  }
  async function remove() {
    if (!db || !confirm('¿Eliminar esta perforación?')) return
    await deleteDoc(doc(db, 'hotspots', h.id)); onDeleted()
  }
  return (
    <div className="hs-row">
      <div className="adm-form">
        <input value={name} onChange={(e) => { setName(e.target.value); setMsg('') }} aria-label="Nombre" placeholder="Nombre" />
        <input type="number" min="0" value={price} onChange={(e) => { setPrice(e.target.value); setMsg('') }} aria-label="Precio (MXN)" placeholder="Precio (MXN)" />
        <input value={healing} onChange={(e) => { setHealing(e.target.value); setMsg('') }} aria-label="Tiempo de cicatrización" placeholder="Cicatrización, ej. 2 a 4 meses" style={{ flex: 1 }} />
        <button onClick={save}>Guardar</button>
        <button onClick={remove}>Eliminar</button>
        <span role="status">{msg}</span>
      </div>
    </div>
  )
}

function HotspotsManager() {
  const looks = useItems('looks', [])
  const [lookId, setLookId] = useState('')
  const look = looks.find((l) => l.id === lookId) ?? looks[0]
  const [tick, setTick] = useState(0)
  const hotspots = useHotspots(look?.id, tick)
  const [pending, setPending] = useState<{ x: number; y: number } | null>(null)
  const [name, setName] = useState(''); const [price, setPrice] = useState(''); const [healing, setHealing] = useState('')

  function onImageClick(e: React.MouseEvent<HTMLDivElement>) {
    const r = e.currentTarget.getBoundingClientRect()
    setPending({ x: Math.round(((e.clientX - r.left) / r.width) * 1000) / 10, y: Math.round(((e.clientY - r.top) / r.height) * 1000) / 10 })
    setName(''); setPrice(''); setHealing('')
  }
  async function addHotspot() {
    if (!db || !look || !pending) return
    await addDoc(collection(db, 'hotspots'), { lookId: look.id, name, price: Number(price) || 0, healing, x: pending.x, y: pending.y, order: Date.now() })
    setPending(null); setTick((t) => t + 1)
  }

  if (!looks.length) return <p className="lead">Primero sube una foto en la pestaña Estilos.</p>
  return (
    <div>
      <p className="lead">Elige un estilo, toca la foto donde va una perforación y captura su nombre y precio.</p>
      <div className="adm-form">
        <select value={look?.id} onChange={(e) => setLookId(e.target.value)} aria-label="Estilo">
          {looks.map((l) => <option key={l.id} value={l.id}>{l.title}</option>)}
        </select>
      </div>
      {look && (
        <div className="hs-editor">
          <div className="hs-image" onClick={onImageClick}>
            {look.image ? <img src={fit(look.image, 700, '4:5')} alt={look.title} /> : <span className="slot-empty">Sin foto</span>}
            {hotspots.map((h) => <span key={h.id} className="hotspot-dot admin" style={{ left: `${h.x}%`, top: `${h.y}%` }} title={h.name} />)}
            {pending && <span className="hotspot-dot pending" style={{ left: `${pending.x}%`, top: `${pending.y}%` }} />}
          </div>
          {pending && (
            <div className="adm-form">
              <input placeholder="Nombre (ej. Helix)" value={name} onChange={(e) => setName(e.target.value)} />
              <input type="number" min="0" placeholder="Precio (MXN)" value={price} onChange={(e) => setPrice(e.target.value)} />
              <input placeholder="Cicatrización, ej. 2 a 4 meses" value={healing} onChange={(e) => setHealing(e.target.value)} style={{ flex: 1 }} />
              <button onClick={addHotspot}>Guardar aquí</button>
              <button onClick={() => setPending(null)}>Cancelar</button>
            </div>
          )}
        </div>
      )}
      <div className="hs-list">
        {hotspots.map((h) => <HotspotRow key={h.id} h={h} onSaved={() => setTick((t) => t + 1)} onDeleted={() => setTick((t) => t + 1)} />)}
      </div>
    </div>
  )
}

function ProfileHeader() {
  const { profile, refresh } = useProfile()
  const [busy, setBusy] = useState(false)
  async function onPhoto(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file || !db) return
    setBusy(true)
    try { const photo = await uploadImage(file); await fSetDoc(fdoc(db, 'settings', 'profile'), { photo }, { merge: true }); refresh() }
    finally { setBusy(false) }
  }
  return (
    <div className="ig-profile">
      <label className="ig-avatar">
        {profile.photo ? <img src={fit(profile.photo, 200, '1:1')} alt="Foto de perfil" /> : <span>+</span>}
        <input type="file" accept="image/*" hidden onChange={onPhoto} />
      </label>
      <div><strong>Dalto Piercer</strong><span>Panel de control</span></div>
      {busy && <span role="status">Subiendo…</span>}
    </div>
  )
}

export default function Admin() {
  const [user, setUser] = useState<User | null>(null)
  const [ready, setReady] = useState(false)
  const [email, setEmail] = useState('')
  const [pass, setPass] = useState('')
  const [err, setErr] = useState('')
  const [tab, setTab] = useState(tabs[0][0])

  useEffect(() => {
    if (!auth) return setReady(true)
    return onAuthStateChanged(auth, (u) => { setUser(u); setReady(true) })
  }, [])

  if (!ready) return null
  if (!auth) return <main className="section"><h2>Panel de control</h2><p className="lead">Falta configurar Firebase en el archivo .env.</p></main>
  if (!user) return (
    <main className="section adm">
      <h2>Panel de control</h2>
      <div className="adm-form">
        <input type="email" placeholder="Correo" value={email} onChange={(e) => setEmail(e.target.value)} />
        <input type="password" placeholder="Contraseña" value={pass} onChange={(e) => setPass(e.target.value)} />
        <button onClick={() => signInWithEmailAndPassword(auth!, email, pass).catch(() => setErr('Correo o contraseña incorrectos.'))}>Entrar</button>
        <span role="alert">{err}</span>
      </div>
    </main>
  )
  return (
    <main className="section adm ig-in">
      <ProfileHeader />
      <div className="ig-tabs">
        {tabs.map(([k, l]) => <button key={k} className={tab === k ? 'on' : ''} onClick={() => setTab(k)}>{l}</button>)}
        <button className="ig-logout" onClick={() => signOut(auth!)}>Cerrar sesión</button>
      </div>
      <div key={tab} className="ig-in">
        {tab === 'hotspots' ? <HotspotsManager /> : <Manager name={tab} />}
      </div>
    </main>
  )
}
