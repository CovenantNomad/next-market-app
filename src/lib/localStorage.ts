export const RECENT_KEYWORDS_KEY = 'recent_keywords_array'
export const RECENT_ITEM_IDS_KEY = 'recent_item_ids_key'

type ArrayKeys = typeof RECENT_KEYWORDS_KEY | typeof RECENT_ITEM_IDS_KEY

const getArray = (key: ArrayKeys) => {
  try {
    const items = localStorage.getItem(key)

    if (items) {
      return JSON.parse(items)
    }

    return []

  } catch (error) {
    return []
  }
}

const setArray = (key: ArrayKeys, value: unknown) => {
  localStorage.setItem(key, JSON.stringify(value))
  window.dispatchEvent(new Event(key))
}

export const getRecentKeywords = (): string[] => getArray(RECENT_KEYWORDS_KEY)

export const addRecentKeyword = (keyword: string) => {
  const items = getRecentKeywords()
  const existItem = items.find(item => item === keyword)

  if (existItem) {
    const otherItems = items.filter(item => item !== keyword)
    setArray(RECENT_KEYWORDS_KEY, [keyword, ...otherItems])

  } else {
    setArray(RECENT_KEYWORDS_KEY, [keyword, ...items])
  }
}

export const clearRecentKeyword = () => {
  setArray(RECENT_KEYWORDS_KEY, [])
}

export const getRecentItems = (): string[] => getArray(RECENT_ITEM_IDS_KEY)

export const addRecentItems = (productId: string) => {
  const items = getRecentItems()
  const existItem = items.find(item => item === productId)

  if (existItem) {
    const otherItems = items.filter(item => item !== productId)
    setArray(RECENT_ITEM_IDS_KEY, [productId, ...otherItems])

  } else {
    setArray(RECENT_ITEM_IDS_KEY, [productId, ...items])
  }
}

export const removeRecentItems = (productId: string) => {
  const items = getRecentItems()
  setArray(RECENT_ITEM_IDS_KEY, items.filter((item) => item !== productId))
}