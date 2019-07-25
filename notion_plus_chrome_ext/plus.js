function getActionColIndex() {
    let Cols = document.querySelectorAll("#notion-app > div > div.notion-cursor-listener > div.notion-frame > div.notion-scroller.vertical.horizontal > div.notion-scroller > div > div > div:nth-child(1) > div:nth-child(1) > div > div:nth-child(1) > div > div > div:nth-child(2)")
    let actionColIndex = []
    Cols.forEach((item, index) => {
        if (item.innerHTML.startsWith('@') || item.innerHTML.startsWith('#')) {
            let actionName = item.innerHTML
            actionColIndex.push({
                index,
                actionName
            })
        }
    })
    return actionColIndex
}

const doAction = (actionName, blockID) => () => {
    const serverHost = 'http://127.0.0.1:5000'
    fetch(serverHost, {
        method: "POST",
        body: JSON.stringify({ "name": actionName, blockID }),
        headers: new Headers({ 'Content-Type': 'application/json' })
    })
}

const addClickEventListenrForEachRow = (actionColIndex) => {
    let rows = document.querySelectorAll("#notion-app > div > div.notion-cursor-listener > div.notion-frame > div.notion-scroller.vertical.horizontal > div.notion-scroller > div > div > div:nth-child(3) > div")

    let rowsCount = 0
    let eventCount = 0
    rows.forEach(item => {
        const blockID = item.dataset.blockId
        if (blockID) {
            rowsCount += 1
            for (let index of actionColIndex) {
                item.childNodes[index.index].addEventListener('click', doAction(index.actionName, blockID))
                eventCount += 1
            }
        }
    })

    let res = {
        'actions': actionColIndex.length,
        'rows': rowsCount,
        'success': eventCount
    }
    return res
}


function run() {
    console.log('开始为 action checkbox 添加监听事件')
    let actionColIndex = getActionColIndex()
    let res = addClickEventListenrForEachRow(actionColIndex)
    console.log(`共${res.rows} 条记录 ,${res.actions} 个动作`)
    console.log(`应添加事件/已添加事件 = ${res.rows * res.actions}/${res.success}`)
}
setTimeout(run, 3000)