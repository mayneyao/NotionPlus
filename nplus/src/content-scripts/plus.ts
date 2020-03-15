import { doAction, getAllActionCode } from './core'
import { showMsg, MsgHorizontalType } from './msg'
import Notabase from 'notabase'


// 注册控制台和 Action 可调用的全局对象
declare global {
  interface Window {
    nb: Notabase;
    showMsg: (s: string, t: MsgHorizontalType) => void;
  }
}

window.nb = new Notabase()
window.showMsg = showMsg;

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


// interface IActionRes {
//   success: boolean;
//   msg: string;
//   data: {
//     icon: string;
//     title: string;
//     desc?: string;
//     action?: () => void;
//   }
// }

// const onActionDone = (res?: IActionRes) => {
//   if (res?.success) {
//     console.log("任务执行完毕")
//   }
// }

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
      showMsg(`Action: ${actionName} done ✔`, MsgHorizontalType.left)
      // onActionDone(res);
    })
    showMsg(`Exec Action: ${actionName}`, MsgHorizontalType.left);
  } else {
    showMsg(`Action: ${actionName} Not Found!`, MsgHorizontalType.left);
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
    const recentRes = document.querySelectorAll(`#notion-app > div > div.notion-overlay-container.notion-default-overlay-container >
     div > div > div > div > div > div > main > div > div > ul > div`)
    let res = searchRes;
    if (searchRes.length) res = searchRes;
    if (recentRes.length && !searchRes.length) res = recentRes;

    const selectItem = res && Array.from(res).find(item => (item as HTMLLIElement).style.backgroundColor === "rgba(55, 53, 47, 0.08)")
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
  console.log('NotionPlus V2.0.3');
  // console.log('try `const data = await nb.fetch(window.location.href)` via browser console');
})();