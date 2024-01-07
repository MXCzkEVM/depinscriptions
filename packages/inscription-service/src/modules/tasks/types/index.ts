import { ScanCancelJSON, ScanDeployJSON, ScanListJSON, ScanMintJSON, ScanTransferJSON } from '../../scripts'

export type InscriptionJSON = ScanDeployJSON | ScanMintJSON | ScanTransferJSON | ScanListJSON | ScanCancelJSON
