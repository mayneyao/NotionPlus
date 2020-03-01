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
  const selectedViewId = search.get('v')
  return {
    currentURL: window.location.href,
    currentPageId,
    selectedRecordId: selectedViewId && selectedRecordId ? selectedRecordId : currentPageId,
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
    showMsg(`Action: ${actionName} Not Found!`);
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
    const quikFindEle = document.querySelector(".notion-quick-find-menu");
    // wa 
    if (quikFindEle && quikFindEle.parentElement &&
      quikFindEle.parentElement.parentElement &&
      quikFindEle.parentElement.parentElement.parentElement) {
      quikFindEle.parentElement.parentElement.parentElement.innerHTML = ""
    }
  }

  // 快速搜索窗口下，选中的结果，按住右箭头快速填充到输入框
  if (e.code === "ArrowRight") {
    const searchRes = document.querySelectorAll(`#notion-app > div > div.notion-overlay-container.notion-default-overlay-container >
     div > div > div > div > div > div > section > div > div > div`)
    const selectItem = searchRes && Array.from(searchRes).find(item => (item as HTMLLIElement).style.backgroundColor === "rgba(55, 53, 47, 0.08)")
    if (selectItem) {
      const selectPageText = (selectItem!.firstChild!.childNodes[1].firstChild! as HTMLLIElement).innerText;
      // console.log(selectPageText);
      (document.activeElement as HTMLInputElement).value = selectPageText
      e.preventDefault();
      e.stopImmediatePropagation();
    }
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