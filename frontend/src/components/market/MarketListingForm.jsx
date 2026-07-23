import { CATEGORIES, SOCIAL_OPTIONS } from './marketConstants'

export default function MarketListingForm({ form, formError, setForm, setTouched, onSubmit }) {
  return (
    <div className="mb-5 border border-[#ede9df]/10 bg-[#20201f] p-5 sm:p-6">
      <div className="font-mono text-[10px] uppercase tracking-[0.24em] text-[#d8b15f]">New listing</div>
      <div className="mt-5 grid gap-3 sm:grid-cols-2">
        <input className="h-12 border border-[#ede9df]/12 bg-[#111110] px-4 text-[14px] text-[#ede9df] outline-none placeholder:text-[#ede9df]/28 focus:border-[#d8b15f]/60" placeholder="Title *" value={form.title} onChange={(event) => { setForm({ ...form, title: event.target.value }); setTouched((current) => ({ ...current, title: true })) }} />
        <div className="relative">
          <input className="h-12 w-full border border-[#ede9df]/12 bg-[#111110] px-4 pr-16 text-[14px] text-[#ede9df] outline-none placeholder:text-[#ede9df]/28 focus:border-[#d8b15f]/60" type="number" placeholder="Price *" value={form.price} onChange={(event) => { setForm({ ...form, price: event.target.value }); setTouched((current) => ({ ...current, price: true })) }} />
          <span className="absolute right-4 top-1/2 -translate-y-1/2 font-mono text-[10px] uppercase tracking-[0.14em] text-[#ede9df]/44">USDC</span>
        </div>
        <select className="h-12 border border-[#ede9df]/12 bg-[#111110] px-4 text-[13px] text-[#ede9df] outline-none focus:border-[#d8b15f]/60" value={form.category} onChange={(event) => setForm({ ...form, category: event.target.value })}>{CATEGORIES.filter((category) => category !== 'All').map((category) => <option key={category} value={category}>{category}</option>)}</select>
        <div className="grid grid-cols-[140px_1fr] gap-2">
          <select className="h-12 border border-[#ede9df]/12 bg-[#111110] px-3 text-[13px] text-[#ede9df] outline-none focus:border-[#d8b15f]/60" value={form.contactMethod} onChange={(event) => setForm({ ...form, contactMethod: event.target.value })}>{SOCIAL_OPTIONS.map((social) => <option key={social.key} value={social.key}>{social.label}</option>)}</select>
          <input className="h-12 border border-[#ede9df]/12 bg-[#111110] px-4 text-[14px] text-[#ede9df] outline-none placeholder:text-[#ede9df]/28 focus:border-[#d8b15f]/60" placeholder={SOCIAL_OPTIONS.find((social) => social.key === form.contactMethod)?.placeholder || '@username'} value={form.contactHandle} onChange={(event) => setForm({ ...form, contactHandle: event.target.value })} />
        </div>
        <textarea className="min-h-[96px] border border-[#ede9df]/12 bg-[#111110] px-4 py-3 text-[14px] text-[#ede9df] outline-none placeholder:text-[#ede9df]/28 focus:border-[#d8b15f]/60 sm:col-span-2" placeholder="Description — terms, proof, delivery expectations" value={form.description} onChange={(event) => setForm({ ...form, description: event.target.value })} />
      </div>
      <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
        <div className="font-mono text-[10px] uppercase tracking-[0.14em] text-[#ede9df]/38">Contact is required before a listing goes live.</div>
        <button onClick={onSubmit} className="h-11 border border-[#ede9df] bg-[#ede9df] px-5 font-mono text-[11px] font-semibold uppercase tracking-[0.16em] text-[#20201f] transition hover:bg-transparent hover:text-[#ede9df]">Post listing</button>
      </div>
      {formError && <div className="mt-3 border border-[#c98b4a]/30 bg-[#c98b4a]/10 px-4 py-3 text-[13px] text-[#c98b4a]">{formError}</div>}
    </div>
  )
}
