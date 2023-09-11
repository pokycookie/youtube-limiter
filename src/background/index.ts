import { checkTabs, setTotal } from './utils'

chrome.runtime.onInstalled.addListener(async () => {
  await chrome.storage.local.set({ total: 0, oldest: null })
})

chrome.tabs.onUpdated.addListener(async (id, info, tab) => {
  if (info.status !== 'complete') return
  if (!checkTabs(await chrome.tabs.query({}))) return

  const now = new Date().getTime()

  let oldest = await chrome.storage.local
    .get('oldest')
    .then((res) => res.oldest)
  if (!oldest) await chrome.storage.local.set({ oldest: now })

  await setTotal(now)

  console.group('onUpdated')
  console.log('now: ' + now)
  console.log(
    'oldest: ' +
      (await chrome.storage.local.get('oldest').then((res) => res.oldest))
  )
  console.groupEnd()
})

chrome.tabs.onRemoved.addListener(async (id, info) => {
  if (checkTabs(await chrome.tabs.query({}))) return

  const now = new Date().getTime()

  const oldest = await chrome.storage.local
    .get('oldest')
    .then((res) => res.oldest)

  if (!oldest) return

  await setTotal(now)

  await chrome.storage.local.set({ oldest: null })

  console.group('onRemoved')
  console.log('now: ' + now)
  console.log('oldest: ' + oldest)
  console.groupEnd()
})
