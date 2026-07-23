import { DEAL_TYPES } from '../../../utils/contract'

export default function ListingDealType({ dealType }) {
  const selectedDealType = DEAL_TYPES.find((type) => type.id === Number(dealType))
  return (
    <div className="flex items-center gap-2 text-[13px] text-stripe-body dark:text-gray-400">
      <span className={`inline-flex items-center text-[10px] font-medium px-2 py-[2px] rounded border font-mono uppercase tracking-[1px] ${Number(dealType) === 0 ? 'bg-indigo-50 dark:bg-indigo-500/10 text-indigo-700 dark:text-indigo-300 border-indigo-100 dark:border-indigo-500/20' : Number(dealType) === 1 ? 'bg-purple-50 dark:bg-purple-500/10 text-purple-700 dark:text-purple-300 border-purple-100 dark:border-purple-500/20' : 'bg-sky-50 dark:bg-sky-500/10 text-sky-700 dark:text-sky-300 border-sky-100 dark:border-sky-500/20'}`}>
        {selectedDealType?.label || 'Instant'}
      </span>
      <span className="text-[12px] opacity-70">{selectedDealType?.desc}</span>
    </div>
  )
}
