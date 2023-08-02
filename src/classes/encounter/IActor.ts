import { PortraitController } from '../components'

interface IActor {
  ID: string
  EncounterName: string
  PortraitController: PortraitController
  Conditions: string[]
  Statuses: string[]
  Resistances: string[]
  Burn: number
  Destroyed: boolean
  Defeat: string
  Activations: number
  CurrentActivations: number
  Evasion: number
  EDefense: number
  TurnActions: number
  CurrentStructure: number
  CurrentHP: number
  CurrentStress: number
  CurrentHeat: number
  MaxStructure: number
  MaxHP: number
  MaxStress: number
  HeatCapacity: number
  CurrentMove: number
  MaxMove: number
  Reactions: string[]
  Icon: string
  NewTurn: () => void
  FullRepair: () => void
  Bonuses?: any[]
}

export { IActor }
