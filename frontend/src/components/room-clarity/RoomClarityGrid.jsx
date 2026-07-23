export default function RoomClarityGrid({ items }) {
  return (
    <div className="grid border border-[#171716]/15 md:grid-cols-2 lg:grid-cols-3">
      {items.map((item, index) => (
        <article
          key={item.label}
          className={`min-h-[210px] bg-[#f4f0e7] p-5 transition duration-300 hover:bg-[#ede9df] sm:p-6 ${
            index % 3 !== 0 ? 'lg:border-l lg:border-[#171716]/15' : ''
          } ${index > 2 ? 'lg:border-t lg:border-[#171716]/15' : ''} ${
            index % 2 !== 0 ? 'md:border-l md:border-[#171716]/15 lg:border-l' : ''
          } ${index > 1 ? 'md:border-t md:border-[#171716]/15 lg:border-t-0' : ''}`}
        >
          <div className="flex items-start justify-between gap-4">
            <div className="font-mono text-[10px] uppercase tracking-[0.22em] text-[#6f6b62]">{item.label}</div>
            <div className="h-2 w-2 bg-[#d8b15f]" />
          </div>
          <h3 className="mt-12 text-[28px] font-medium leading-[1.02] tracking-[-0.035em] text-[#171716]">
            {item.value}
          </h3>
          <p className="mt-4 max-w-[260px] text-[14px] leading-[1.62] tracking-[-0.015em] text-[#5f5a50]">
            {item.body}
          </p>
        </article>
      ))}
    </div>
  )
}
