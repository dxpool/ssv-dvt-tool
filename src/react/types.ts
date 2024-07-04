export enum StepKey {
  MnemonicImport,
  MnemonicGeneration,
  KeyConfiguration,
  SlitKeyStore,
  KeyGeneration,
  Finish,
  BTECConfiguration,
  BTECGeneration,
  FinishBTEC
}

export enum ReuseMnemonicAction {
  RegenerateKeys,
  GenerateBLSToExecutionChange
}

export enum Network {
  MAINNET = "Mainnet",
  HOLESKY = "Holesky"
}

export enum LowerCaseNetwork {
  MAINNET = "mainnet",
  HOLESKY = "holesky"
}