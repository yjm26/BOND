import AppActionCard from '../AppActionCard'

export default function AppHomeActionGrid({ actions }) {
  const count = actions.length
  const gridClass =
    count >= 5
      ? 'grid gap-px bg-[#ede9df]/10 p-px sm:grid-cols-2 xl:grid-cols-5'
      : 'grid gap-px bg-[#ede9df]/10 p-px sm:grid-cols-2 xl:grid-cols-4'

  return (
    <div className={`border-t border-[#ede9df]/10 ${gridClass}`}>
      {actions.map((item, index) => (
        <AppActionCard key={item.label} item={item} index={index} />
      ))}
    </div>
  )
}
