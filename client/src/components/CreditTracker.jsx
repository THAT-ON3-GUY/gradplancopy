export default function CreditTracker({ earned, total }) {
  const pct = Math.min((earned / total) * 100, 100);

  return (
    <div className="px-4 py-3 bg-byui-navy text-white">
      <div className="flex justify-between items-baseline mb-1">
        <span className="text-xs font-semibold uppercase tracking-wide text-blue-200">Total Credits</span>
        <span className="text-sm font-bold">
          <span className={earned >= total ? 'text-green-400' : 'text-byui-gold'}>{earned}</span>
          <span className="text-blue-300"> / {total}</span>
        </span>
      </div>
      <div className="w-full bg-byui-navyDark rounded-full h-2">
        <div
          className="h-2 rounded-full transition-all duration-500"
          style={{
            width: `${pct}%`,
            backgroundColor: pct >= 100 ? '#4ade80' : '#E1A829',
          }}
        />
      </div>
      <p className="text-xs text-blue-300 mt-1">{Math.max(total - earned, 0)} credits remaining</p>
    </div>
  );
}
