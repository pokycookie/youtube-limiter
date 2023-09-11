export function checkTabs(tabs: chrome.tabs.Tab[]) {
  return tabs.some((tab) => tab.url?.startsWith('https://www.youtube.com'))
}

export async function setTotal(now: number) {
  const oldest = await chrome.storage.local
    .get('oldest')
    .then((res) => res.oldest)
  if (!oldest) return

  const total = await chrome.storage.local.get('total').then((res) => res.total)
  await chrome.storage.local.set({ total: total + (now - oldest) })
  await chrome.storage.local.set({ oldest: now })

  console.group('total')
  console.log((total + (now - oldest)) / 1000 + ' sec')
  console.groupEnd()
}
