import Notabase from 'notabase';
import { getFullBlockId } from 'notabase/src/utils';
const nb = new Notabase()


export interface IActionCode {
  [name: string]: {
    code: string;
    lang: 'JavaScript' | 'Python'
    hasChildrenTask: boolean;
    children?: string[];
    childrenType?: string;
  }
}

export const getAllActionCode = async () => {
  const actionCode: IActionCode = {}
  const data = await browser.storage.sync.get(['serverHost', 'authToken', 'actionTableUrl'])
  let { actionTableUrl } = data;
  if (actionTableUrl) {
    const actions = await nb.fetch(actionTableUrl)
    actions.rows.map((actionRow: any) => {
      let hasChildrenTask = Boolean(actionRow.Children)
      if (hasChildrenTask) {
        actionCode[actionRow.Name] = {
          hasChildrenTask,
          children: actionRow.Children.map(r => r.Name),
          childrenType: actionRow.ChildrenType
        }
      } else {
        let codeBlockId = actionRow.content && actionRow.content[0]
        if (codeBlockId) {
          const { type, properties } = nb.blockStore[codeBlockId].value
          let code = properties.title[0][0]
          let lang = properties.language[0][0]
          actionCode[actionRow.Name] = {
            code,
            lang,
            hasChildrenTask,
          }
        }
      }
    })
    console.log("action code is ready")
    console.log(actionCode)
  } else {
    // alert("⚠️ 您正在执行一项动态任务，但是动态任务表格地址没有正确配置，请在配置页中完善")
  }
  return actionCode
}


interface ActionParams {
  actionCode: IActionCode;
  blockID?: string;
  actionName: string;
  actionParams?: any[]
}
export const doAction = async ({ actionCode, blockID, actionName, actionParams }: ActionParams) => {
  console.log('exec action', actionName, actionParams)
  const parsedBlockID = blockID ? getFullBlockId(blockID) : undefined
  // this table
  let table = await nb.fetch(window.location.href)
  // this row 
  let obj = table.rows.find((o: any) => o.id === parsedBlockID)

  const data = await browser.storage.sync.get(['serverHost', 'authToken', 'actionTableUrl'])
  let { serverHost, authToken, actionTableUrl } = data;

  if (actionCode.hasOwnProperty(actionName)) {
    // js 代码浏览器运行
    let func = actionCode[actionName]

    console.log(func);
    if (func.hasChildrenTask) {
      switch (func.childrenType) {
        case "串":
          for (let taskName of func.children!) {
            await doAction({
              actionCode,
              actionName: taskName,
              blockID: parsedBlockID,
              actionParams,
            })
          }
          break
        case "并":
          func.children!.map(async taskName => {
            await doAction({
              actionCode,
              actionName: taskName,
              blockID: parsedBlockID,
              actionParams,
            })
          })
          break
      }
    } else {
      switch (func.lang) {
        case "JavaScript":
          let code = func.code
          try {
            console.log(actionParams);
            if (actionParams?.length) {
              // FIXME: 占定为带参数的函数只能执行一次
              const funcBody = eval(code)
              funcBody(...actionParams)
            } else {
              console.log("obj is >>>>>", obj);
              if (!obj) {
                console.log("action applay on all rows");
                table.rows.map((_obj: any) => {
                  let obj = _obj;
                  const funcBody = eval(code)
                  funcBody(...actionParams)
                })
              } else {
                console.log("action applay on one row");
                const funcBody = eval(code)
                funcBody(...actionParams)
              }
            }

          } catch (error) {
            console.log(error)
          }
          break
        case "Python":
          // python 代码走服务器运行
          if (!serverHost || !authToken) {
            alert("⚠️ 请在配置页中配置服务器地址和安全码")
          } else {
            if (actionName.startsWith("#") && !actionTableUrl) {
              alert("⚠️ 您正在执行一项动态任务，但是动态任务表格地址没有正确配置，请在配置页中完善")
            } else {
              fetch(serverHost, {
                method: "POST",
                body: JSON.stringify({
                  actionName,
                  blockID: parsedBlockID,
                  actionTableUrl
                }),
                headers: new Headers({
                  'Content-Type': 'application/json',
                  'authtoken': `${authToken}`
                })
              }).then(res => {
                if (res.status === 200) {
                } else {
                  console.log(`执行动作 ${actionName} 服务器遇到问题: ${res.statusText}`)
                }
              })
            }
          }
          break
      }
    }
  }
}