/**
 * action 执行相关逻辑
 */
import Notabase, { getFullBlockId } from 'notabase';
import { showMsg, MsgHorizontalType } from './msg';

const nb = new Notabase()

export interface IActionCode {
  [name: string]: {
    code?: string;
    lang?: 'JavaScript' | 'Python'
    hasChildrenTask: boolean;
    children?: string[];
    childrenType?: string;
    isGlobal?: boolean;
  }
}

export interface IEnv {
  [key: string]: string
}

// TODO: 环境变量
export const getEnv = async () => {
  const ENV: IEnv = {}
  const data = await browser.storage.sync.get(['envTableUrl'])
  const { envTableUrl } = data
  const envs = await nb.fetch(envTableUrl)
  envs.rows.forEach(row => {
    const { Key, Value } = row
    ENV[Key as string] = Value as string
  })
  return ENV;

}

export const getAllActionCode = async () => {
  const actionCode: IActionCode = {}
  const data = await browser.storage.sync.get(['serverHost', 'authToken', 'actionTableUrl'])
  let { actionTableUrl } = data;
  if (actionTableUrl) {
    const actions = await nb.fetch(actionTableUrl)
    actions.rows.forEach((actionRow: any) => {
      let hasChildrenTask = Boolean(actionRow.Children)
      const actionRowName: string = actionRow && actionRow.Name
      if (hasChildrenTask && actionRowName) {
        actionCode[actionRowName] = {
          hasChildrenTask,
          children: actionRow.Children.filter((r: any) => r).map((r: any) => r.Name),
          childrenType: actionRow.ChildrenType,
          isGlobal: actionRow.IsGlobal,
        }
      } else {
        let codeBlockId = actionRow.content && actionRow.content[0]
        if (codeBlockId) {
          // eslint-disable-next-line
          const { type, properties } = nb.blockStore[codeBlockId].value
          let code = properties && properties.title[0][0]
          let lang = properties && properties.language[0][0]
          actionCode[actionRow.Name] = {
            code,
            lang,
            hasChildrenTask,
            isGlobal: actionRow.IsGlobal,
          }
        }
      }
    })
    console.log("action code is ready")
    console.log(actionCode)
  } else {
    return;
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
  console.log(parsedBlockID)
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
          const code = func.code
          if (!code) return;
          try {
            console.log(actionParams);
            const _actionParams = actionParams ? actionParams : [];
            if (func.isGlobal) {
              nb.startAtomic();
              // eslint-disable-next-line
              const funcBody = eval(code)
              console.log("exec global action");
              const res = await funcBody(..._actionParams)
              nb.endAtomic();
              return res
            } else {
              // 非全局 action 才有上下文
              // this table
              let table = await nb.fetch(window.location.href)
              // this row 
              let records = table.rows.filter((o: any) => o.id === parsedBlockID)
              console.log("obj is >>>>>", records);
              if (records.length === 1) {
                console.log("action applay on one row");
                // eslint-disable-next-line
                const funcBody = eval(code)
                return await funcBody(..._actionParams)
                // return showMsg(`${actionCode} is not a function`);
              } else {
                console.log("action applay on all rows");
                nb.startAtomic();
                records = table.rows;
                // eslint-disable-next-line
                const funcBody = eval(code)
                const res = await funcBody(..._actionParams)
                nb.endAtomic();
                return res;
                // return showMsg(`${actionCode} is not a function`);
              }
            }
          } catch (error) {
            console.log(error)
            showMsg("oops~ something error\n checkout devtools console", MsgHorizontalType.left)
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