import { checkTabs, setTotal } from './utils'

chrome.runtime.onInstalled.addListener(async () => {
  await chrome.storage.local.set({ total: 0, oldest: null })
  await chrome.storage.sync.set({ maxTime: 60 * 60 * 2 * 1000 })
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
})

chrome.runtime.onMessage.addListener((req, sender, res) => {
  const now = new Date().getTime()

  switch (req.key) {
    case 'getTotal':
      // IIFE 패턴을 사용해야만 async처리된 데이터를 넘겨줄 수 있음
      ;(async () => {
        await setTotal(now)
        const local = await chrome.storage.local.get(['total'])
        const sync = await chrome.storage.sync.get(['maxTime'])
        res({ total: local.total, maxTime: sync.maxTime })
      })()
      break
    default:
      console.error('Invalid message key')
      break
  }

  // return true를 사용해야만 async처리된 데이터를 넘겨줄 수 있음
  // ref: https://eddori.tistory.com/5
  // ref: https://stackoverflow.com/questions/44056271/chrome-runtime-onmessage-response-with-async-await
  return true
})
