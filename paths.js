import { join } from 'node:path'

/**
 * 宿主进程里 `DSH_HOME` 不一定被注入（实测 Desktop 下为空），
 * 此时工作目录是 profile 根，落在同一处即可。
 */
export const stateDir = () => join(process.env.DSH_HOME ?? process.cwd(), 'zhiyin-proto')
export const stateFile = () => join(stateDir(), 'status.json')