'use client';

import { useRouter, useSearchParams, usePathname } from 'next/navigation';

export default function SortDropdown() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();

  const currentSort = searchParams.get('sort') || 'recommended';

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newSort = e.target.value;
    const params = new URLSearchParams(searchParams.toString());
    
    if (newSort === 'recommended') {
      params.delete('sort');
    } else {
      params.set('sort', newSort);
    }
    
    // Push the new URL without refreshing the page
    router.push(`${pathname}?${params.toString()}`);
  };

  return (
    <select 
      value={currentSort}
      onChange={handleChange}
      className="bg-white border border-slate-200 text-slate-900 text-sm font-bold px-4 py-3 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500 cursor-pointer shadow-sm w-full md:w-auto"
    >
      <option value="recommended">Recommended</option>
      <option value="price_asc">Price: Low to High</option>
      <option value="speed_desc">Speed: High to Low</option>
    </select>
  );
}