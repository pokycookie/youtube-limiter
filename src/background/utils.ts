export function checkTabs(tabs: chrome.tabs.Tab[]) {
  return tabs.some((tab) => tab.url?.startsWith('https://www.youtube.com'))
}

export async function setTotal(now: number) {
  let { oldest } = await chrome.storage.local.get('oldest')
  let { total } = await chrome.storage.local.get('total')

  if (!oldest) return
  if (new Date(oldest).getDate() !== new Date(now).getDate()) {
    oldest = new Date(new Date(now).setHours(0, 0, 0, 0))
    total = 0
  }

  await chrome.storage.local.set({ total: total + (now - oldest) })
  await chrome.storage.local.set({ oldest: now })

  return total + (now - oldest)
}

export async function getTotal() {
  return await chrome.storage.local.get('total').then((res) => res.total)
}
