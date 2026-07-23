import { CATEGORIES, SOCIAL_OPTIONS } from './marketConstants'

export default function MarketListingForm({ form, formError, setForm, setTouched, onClose, onSubmit }) {
  const submit = (event) => {
    event.preventDefault()
    onSubmit()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/55 p-4 backdrop-blur-sm" onClick={onClose}>
      <form
        onSubmit={submit}
        className="w-full max-w-[720px] border border-[#ede9df]/12 bg-[#20201f] p-5 text-[#ede9df] shadow-2xl shadow-black/40 sm:p-6"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="flex items-start justify-between gap-5 border-b border-[#ede9df]/10 pb-5">
          <div>
            <div className="font-mono text-[10px] uppercase tracking-[0.24em] text-[#d8b15f]">New listing</div>
            <h2 className="mt-3 text-[34px] font-medium leading-[0.95] tracking-[-0.06em] text-[#ede9df]">Create market listing</h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="flex h-9 w-9 items-center justify-center border border-[#ede9df]/12 text-[20px] leading-none text-[#ede9df]/54 transition hover:border-[#ede9df]/34 hover:text-[#ede9df]"
            aria-label="Close listing form"
          >
            ×
          </button>
        </div>

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
          <textarea className="min-h-[112px] border border-[#ede9df]/12 bg-[#111110] px-4 py-3 text-[14px] text-[#ede9df] outline-none placeholder:text-[#ede9df]/28 focus:border-[#d8b15f]/60 sm:col-span-2" placeholder="Description — terms, proof, delivery expectations" value={form.description} onChange={(event) => setForm({ ...form, description: event.target.value })} />
        </div>

        {formError && <div className="mt-4 border border-[#c98b4a]/30 bg-[#c98b4a]/10 px-4 py-3 text-[13px] text-[#c98b4a]">{formError}</div>}

        <div className="mt-5 flex flex-col gap-3 border-t border-[#ede9df]/10 pt-5 sm:flex-row sm:items-center sm:justify-between">
          <div className="font-mono text-[10px] uppercase tracking-[0.14em] text-[#ede9df]/38">Contact is required before a listing goes live.</div>
          <div className="flex gap-2">
            <button type="button" onClick={onClose} className="h-11 border border-[#ede9df]/14 px-5 font-mono text-[11px] font-semibold uppercase tracking-[0.16em] text-[#ede9df]/64 transition hover:border-[#ede9df]/34 hover:text-[#ede9df]">Cancel</button>
            <button className="h-11 border border-[#ede9df] bg-[#ede9df] px-5 font-mono text-[11px] font-semibold uppercase tracking-[0.16em] text-[#20201f] transition hover:bg-transparent hover:text-[#ede9df]">Post listing</button>
          </div>
        </div>
      </form>
    </div>
  )
}
