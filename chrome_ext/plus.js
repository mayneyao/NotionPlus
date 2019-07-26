const CHECKBOX_MARK = "M0,3 C0,1.34314 1.34326,0 3,0 L11,0 C12.6567,0 14,1.34314 14,3 L14,11 C14,12.6569 12.6567,14 11,14 L3,14 C1.34326,14 0,12.6569 0,11 L0,3 Z M3,1.5 C2.17139,1.5 1.5,2.17157 1.5,3 L1.5,11 C1.5,11.8284 2.17139,12.5 3,12.5 L11,12.5 C11.8286,12.5 12.5,11.8284 12.5,11 L12.5,3 C12.5,2.17157 11.8286,1.5 11,1.5 L3,1.5 Z M2.83252,6.8161 L3.39893,6.27399 L3.57617,6.10425 L3.92334,5.77216 L4.26904,6.10559 L4.44531,6.27582 L5.58398,7.37402 L9.28271,3.81073 L9.45996,3.64008 L9.80664,3.3056 L10.1538,3.63989 L10.3311,3.81067 L10.8936,4.35303 L11.0708,4.52399 L11.4434,4.88379 L11.0708,5.24353 L10.8936,5.41437 L6.1084,10.0291 L5.93115,10.2 L5.58398,10.5344 L5.23682,10.2 L5.05957,10.0292 L2.83057,7.87946 L2.65283,7.70801 L2.27832,7.34674 L2.6543,6.98694 L2.83252,6.8161 Z"
const NEW_MARK = "17,8 10,8 10,1 8,1 8,8 1,8 1,10 8,10 8,17 10,17 10,10 17,10 "

const doAction = (actionName, blockID) => {
    const serverHost = 'http://127.0.0.1:5000'
    return fetch(serverHost, {
        method: "POST",
        body: JSON.stringify({ "name": actionName, blockID }),
        headers: new Headers({ 'Content-Type': 'application/json' })
    })
}

function getActionColIndexNameMap() {
    let Cols = document.querySelectorAll("#notion-app > div > div.notion-cursor-listener > div.notion-frame > div.notion-scroller.vertical.horizontal > div.notion-scroller > div > div > div:nth-child(1) > div:nth-child(1) > div > div:nth-child(1) > div > div > div:nth-child(2)")
    let actionColIndex = {}
    Cols.forEach((item, index) => {
        if (item.innerHTML.startsWith('@') || item.innerHTML.startsWith('#')) {
            // 已#或@开头 并且属于 checkbox 类型            
            // .? 快来
            // fixme 
            if (item.previousSibling && item.previousSibling.firstChild.firstChild.getAttribute("d") === CHECKBOX_MARK) {
                let actionName = item.innerHTML
                actionColIndex[index] = actionName
            }
        }
    })
    return actionColIndex
}

function NotionPlus(e) {
    // 只有在表格页面才执行 click 检测

    let notionTableNewRowBtn = document.querySelector("#notion-app > div > div.notion-cursor-listener > div.notion-frame > div.notion-scroller.vertical.horizontal > div.notion-scroller > div > div > div:nth-child(4)")
    if (notionTableNewRowBtn) {
        let actionColIndexNameMap = getActionColIndexNameMap()
        let clickEle = e.target
        let actionRow = clickEle
        let lastEle;
        try {
            if (clickEle.firstChild.firstChild.tagName === 'polygon' && clickEle.firstChild.firstChild.getAttribute("points") === NEW_MARK) {
                // pass
            } else {
                while (!actionRow.dataset.blockId) {
                    lastEle = actionRow
                    actionRow = actionRow.parentElement
                }
                let clickEleColIndex = Array.from(actionRow.childNodes).indexOf(lastEle)
                if (clickEleColIndex in actionColIndexNameMap) {
                    let blockID = actionRow.dataset.blockId
                    let actionName = actionColIndexNameMap[clickEleColIndex]
                    console.log(actionName, blockID)
                    lastEle.style.background = '#ccc'
                    doAction(actionName, blockID).then(res => {
                        if (res.status === 200) {
                            lastEle.style.background = ''
                        } else {
                            lastEle.style.background = 'red'
                            console.log(`执行动作 ${actionName} 服务器遇到问题: ${res.statusText}`)
                        }

                    })
                }
            }
        } catch (error) {
            console.log(error)
        }
    } else {
        console.log("click from non-table page")
    }

}
document.addEventListener('click', NotionPlus)
console.log("激活 NontionPlus")