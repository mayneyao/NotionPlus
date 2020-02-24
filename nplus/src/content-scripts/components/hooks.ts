import { useEffect, useState } from 'react';

export type NotionContext = {
  currentURL: string;
  currentPageId: string;
  selectedRecordId?: string;
}

export function useNotionContext(): NotionContext {
  const initContext = {
    currentURL: '',
    currentPageId: '',
    selectedRecordId: undefined,
  }

  const [context, setContext] = useState(<NotionContext>initContext)

  useEffect(() => {
    const pathNameList = window.location.pathname.split('/')
    const currentPageId = pathNameList[pathNameList.length - 1]
    const search = new URLSearchParams(window.location.search)
    const selectedRecordId = search.get('p')
    setContext({
      currentURL: window.location.href,
      currentPageId,
      selectedRecordId: selectedRecordId || undefined,
    })
  }, [context.selectedRecordId])

  return context
}
