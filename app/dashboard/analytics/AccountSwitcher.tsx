'use client';

import { ChevronDown } from 'lucide-react';

/**
 * Account switcher for the Analytics page.
 *
 * Fork fix (2026-11-06): this select was defined inside the async Server
 * Component page with an onChange handler, which crashes the render with
 * "Event handlers cannot be passed to Client Component props". It has to
 * live in its own Client Component file.
 */
export function AccountSwitcher({
  accounts,
  activeAccountId,
}: {
  accounts: { id: string; ig_username: string }[];
  activeAccountId: string;
}) {
  return (
    <div className="relative w-full sm:w-auto">
      <select
        defaultValue={activeAccountId}
        onChange={(e) => {
          const url = new URL(window.location.href);
          url.searchParams.set('accountId', e.target.value);
          window.location.href = url.toString();
        }}
        className="w-full appearance-none rounded-xl border border-neutral-200 bg-white px-3.5 py-2 pr-9 text-sm font-medium text-neutral-900 shadow-sm outline-none transition-all focus:border-neutral-400 focus:ring-2 focus:ring-neutral-200 sm:min-w-[200px] dark:border-neutral-800 dark:bg-neutral-900 dark:text-white dark:focus:border-neutral-700 dark:focus:ring-neutral-800"
      >
        {accounts.map((a) => (
          <option key={a.id} value={a.id}>
            @{a.ig_username}
          </option>
        ))}
      </select>
      <div className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400">
        <ChevronDown className="h-4 w-4" />
      </div>
    </div>
  );
}
