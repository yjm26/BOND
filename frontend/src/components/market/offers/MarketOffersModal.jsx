import { useNavigate } from 'react-router-dom'
import { useOffers } from '../../../hooks/useOffers'
import MarketCounterOfferModal from './MarketCounterOfferModal'
import MarketOfferList from './MarketOfferList'
import MarketOffersTabs from './MarketOffersTabs'

export default function MarketOffersModal({ wallet, API_URL, onClose }) {
  const navigate = useNavigate()
  const {
    tab, setTab, incoming, displayed, loading,
    counterTarget, setCounterTarget,
    counterPrice, setCounterPrice,
    counterMsg, setCounterMsg,
    accept, decline, submitCounter, openRoom, startCounter,
    timeAgo, fmt,
  } = useOffers(wallet, API_URL, navigate, { defaultTab: 'incoming' })
  const incomingPendingCount = incoming.filter((offer) => offer.status === 'pending').length

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/55 p-4 backdrop-blur-sm" onClick={onClose}>
      <div className="flex max-h-[86vh] w-full max-w-[780px] flex-col overflow-hidden border border-[var(--a-line)] bg-[var(--a-panel)] text-[var(--a-ink)] shadow-2xl shadow-black/40" onClick={(event) => event.stopPropagation()}>
        <div className="flex items-start justify-between gap-5 border-b border-[var(--a-line)] p-5">
          <div>
            <div className="font-mono text-[10px] uppercase tracking-[0.24em] text-[var(--a-muted)]">Market offers</div>
            <h2 className="mt-3 text-[34px] font-medium leading-[0.95] tracking-[-0.06em] text-[var(--a-ink)]">Offers on Market</h2>
          </div>
          <button type="button" onClick={onClose} className="flex h-9 w-9 items-center justify-center border border-[var(--a-line)] text-[20px] leading-none text-[var(--a-ink)]/54 transition hover:border-[var(--a-line-strong)] hover:text-[var(--a-ink)]" aria-label="Close offers">×</button>
        </div>
        <MarketOffersTabs tab={tab} onTabChange={setTab} incomingPendingCount={incomingPendingCount} />
        <div className="min-h-0 overflow-y-auto">
          <MarketOfferList offers={displayed} tab={tab} actions={{ accept, decline, openRoom, startCounter }} timeAgo={timeAgo} fmt={fmt} loading={loading} />
        </div>
      </div>
      <MarketCounterOfferModal target={counterTarget} price={counterPrice} message={counterMsg} onPriceChange={setCounterPrice} onMessageChange={setCounterMsg} onCancel={() => setCounterTarget(null)} onSubmit={submitCounter} />
    </div>
  )
}
