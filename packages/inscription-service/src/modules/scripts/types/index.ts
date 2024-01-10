export interface ScanDeployJSON {
  p: 'msc-20'
  op: 'deploy'
  tick: string
  max: string
  lim: string
}
export interface ScanMintJSON {
  p: 'msc-20'
  op: 'mint'
  tick: string
  amt: string | number
  hex: string
}
export interface ScanTransferJSON {
  p: 'msc-20'
  op: 'transfer'
  tick: string
  amt: string
}
export interface ScanListJSON {
  p: 'msc-20'
  op: 'list'
  tick: string
  amt: string
  pre: string
  exp: string
  hex: string
  r: string
  s: string
  v: number
}
export interface ScanCancelJSON {
  p: 'msc-20'
  op: 'cancel'
  tick: string
  hash: string
}

export interface ScriptLogOptions {
  from: string
  to?: string
  hash?: string
  amount?: string
  desc?: string
}
