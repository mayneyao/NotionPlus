import { doAction, getAllActionCode } from './core'
import { showMsg } from './msg'
import Notabase from 'notabase'

declare global {
  interface Window {
    nb: Notabase
  }
}

window.nb = new Notabase()

const getNotionContext = () => {
  const pathNameList = window.location.pathname.split('/')
  const currentPageId = pathNameList[pathNameList.length - 1]
  const search = new URLSearchParams(window.location.search)
  const selectedRecordId = search.get('p')
  return {
    currentURL: window.location.href,
    currentPageId,
    selectedRecordId: selectedRecordId || undefined,
  }
}

const doActionWrapper = ({ actionCode, actionName, actionParams }: any) => {
  console.log(actionCode);
  console.log("ready to exec", actionName, actionParams)
  if (actionCode && actionCode[actionName]) {
    const notionContext = getNotionContext();
    doAction({
      actionName,
      actionParams,
      actionCode,
      blockID: notionContext.selectedRecordId,
    }).then(res => {
      console.log("action res", res)

      showMsg(`Action: ${actionName} done ✔`)
    })
    showMsg(`Exec Action: ${actionName}`);
  } else {
    console.log(`Action: ${actionName} Not Found!`)
  }
}


const handleKeyPress = (e: KeyboardEvent, actionCode: any) => {
  if ((e.altKey) && e.key === "Enter") {
    const inputValue = (document.activeElement as HTMLInputElement).value!
    const inputArray = inputValue.split(" ");
    const action = inputArray[0]
    const params = inputArray.slice(1)
    doActionWrapper({
      actionCode,
      actionName: action,
      actionParams: params
    });
  }
}

const loadNotionPlus = (actionCode: any) => {
  const reactRoot = document.createElement('div')
  reactRoot.setAttribute('id', 'notionplus')
  document.body.append(reactRoot)
  document.addEventListener('keyup', (e) => handleKeyPress(e, actionCode))
}

(async () => {
  const actionCode = await getAllActionCode()
  if (!actionCode) {
    console.warn("actions can't load, You need to config ActionTableUrl")
    console.warn("请在 NotionPlus 选项配置页中填入 ActionTableUrl，否则插件不会正常工作")
  }
  loadNotionPlus(actionCode)
  console.log('NotionPlus V2.0.1');
  // console.log('try `const data = await nb.fetch(window.location.href)` via browser console');
})();