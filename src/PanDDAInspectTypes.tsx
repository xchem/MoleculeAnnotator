
export const EventInteresting = {
  No: 'False',
  Yes: 'True',
} as const;
type EventInterestingType = typeof EventInteresting[keyof typeof EventInteresting];


export const LigandPlaced = {
  No: 'False',
  Yes: 'True',
} as const;
type LigandPlacedType = typeof LigandPlaced[keyof typeof LigandPlaced];


export const LigandConfidence = {
  Low: "Low",
  Medium: "Medium",
  High: "High",
} as const;
type LigandConfidenceType = typeof LigandConfidence[keyof typeof LigandConfidence];



export type PanDDAInspectState = {
  dataIdx: number;
  landmarkIdx: number;
  annotation: string,
  inputData: any;
  outputData: any;
  args: any;
  activeProteinMol: any;
  activeLigandMol: any;
  loading: boolean
};


export type PanDDAInspectEventHandlers = {
  handleSelectEvent: (setIsLoading: any, event: React.ChangeEvent<HTMLInputElement>, ) => void,
  handleNextEvent: (setIsLoading: any) => void,
  handlePreviousEvent: (setIsLoading: any) => void,
  handlePreviousSite: (setIsLoading: any) => void,
  handleNextSite: (setIsLoading: any) => void,
  handleNextUnviewed: (setIsLoading: any) => void,
  handleNextUnmodelled: (setIsLoading: any) => void,
  handleNextEventDontSave: (setIsLoading: any) => void,

  handleMergeLigand: () => void,
  handleMoveLigand: () => void,
  handleNextLigand: () => void,
  handleLoadLigandAutobuild: () => void,
  handleSaveLigand: () => void,
  handleReloadLigand: () => void,
  handleResetLigand: () => void,

  handleSetEventComment: (event: React.ChangeEvent<HTMLInputElement>) => void,
  handleSetInteresting: (event: React.ChangeEvent<HTMLInputElement>) => void,
  handleSetPlaced: (event: React.ChangeEvent<HTMLInputElement>) => void,
  handleSetConfidence: (event: React.ChangeEvent<HTMLInputElement>) => void,
  handleSetSiteName: (event: React.ChangeEvent<HTMLInputElement>) => void,
  handleSetSiteComment: (event: React.ChangeEvent<HTMLInputElement>) => void,

  handleLoadInputMTZ: () => void,
  handleLoadGroundState: () => void,
  handleLoadInputStructure: () => void,
  handleCreateNewLigand: () => void,

}