import { CATEGORIES } from './marketConstants'

export default function MarketListingForm({ form, formError, setForm, setTouched, onClose, onSubmit }) {
  const submit = (event) => {
    event.preventDefault()
    onSubmit()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/55 p-4 backdrop-blur-sm" onClick={onClose}>
      <form
        onSubmit={submit}
        className="w-full max-w-[720px] border border-[#fafafa]/12 bg-[#111111] p-5 text-[#fafafa] shadow-2xl shadow-black/40 sm:p-6"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="flex items-start justify-between gap-5 border-b border-[#fafafa]/10 pb-5">
          <div>
            <div className="font-mono text-[10px] uppercase tracking-[0.24em] text-[#a3a3a3]">New listing</div>
            <h2 className="mt-3 text-[34px] font-medium leading-[0.95] tracking-[-0.06em] text-[#fafafa]">Create market listing</h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="flex h-9 w-9 items-center justify-center border border-[#fafafa]/12 text-[20px] leading-none text-[#fafafa]/54 transition hover:border-[#fafafa]/34 hover:text-[#fafafa]"
            aria-label="Close listing form"
          >
            ×
          </button>
        </div>

        <div className="mt-5 grid gap-3 sm:grid-cols-2">
          <input className="h-12 border border-[#fafafa]/12 bg-[#0a0a0a] px-4 text-[14px] text-[#fafafa] outline-none placeholder:text-[#fafafa]/28 focus:border-[#a3a3a3]/60" placeholder="Title *" value={form.title} onChange={(event) => { setForm({ ...form, title: event.target.value }); setTouched((current) => ({ ...current, title: true })) }} />
          <div className="relative">
            <input className="h-12 w-full border border-[#fafafa]/12 bg-[#0a0a0a] px-4 pr-16 text-[14px] text-[#fafafa] outline-none placeholder:text-[#fafafa]/28 focus:border-[#a3a3a3]/60" type="number" placeholder="Price *" value={form.price} onChange={(event) => { setForm({ ...form, price: event.target.value }); setTouched((current) => ({ ...current, price: true })) }} />
            <span className="absolute right-4 top-1/2 -translate-y-1/2 font-mono text-[10px] uppercase tracking-[0.14em] text-[#fafafa]/44">USDC</span>
          </div>
          <select className="h-12 border border-[#fafafa]/12 bg-[#0a0a0a] px-4 text-[13px] text-[#fafafa] outline-none focus:border-[#a3a3a3]/60 sm:col-span-2" value={form.category} onChange={(event) => setForm({ ...form, category: event.target.value })}>{CATEGORIES.filter((category) => category !== 'All').map((category) => <option key={category} value={category}>{category}</option>)}</select>
          <textarea className="min-h-[112px] border border-[#fafafa]/12 bg-[#0a0a0a] px-4 py-3 text-[14px] text-[#fafafa] outline-none placeholder:text-[#fafafa]/28 focus:border-[#a3a3a3]/60 sm:col-span-2" placeholder="Description — terms, proof, delivery expectations" value={form.description} onChange={(event) => setForm({ ...form, description: event.target.value })} />
        </div>

        {formError && <div className="mt-4 border border-[#b87333]/30 bg-[#b87333]/10 px-4 py-3 text-[13px] text-[#b87333]">{formError}</div>}

        <div className="mt-5 flex flex-col gap-3 border-t border-[#fafafa]/10 pt-5 sm:flex-row sm:items-center sm:justify-between">
          <div className="font-mono text-[10px] uppercase tracking-[0.14em] text-[#fafafa]/38">Contact details come from your BOND profile.</div>
          <div className="flex gap-2">
            <button type="button" onClick={onClose} className="h-11 border border-[#fafafa]/14 px-5 font-mono text-[11px] font-semibold uppercase tracking-[0.16em] text-[#fafafa]/64 transition hover:border-[#fafafa]/34 hover:text-[#fafafa]">Cancel</button>
            <button className="h-11 border border-[#fafafa] bg-[#fafafa] px-5 font-mono text-[11px] font-semibold uppercase tracking-[0.16em] text-[#111111] transition hover:bg-transparent hover:text-[#fafafa]">Post listing</button>
          </div>
        </div>
      </form>
    </div>
  )
}
