import io from '../data_io'

const state = {
  Backgrounds: [],
  Talents: [],
  Skills: [],
  CoreBonuses: [],
  Frames: [],
  Manufacturers: [],
  MechWeapons: [],
  WeaponMods: [],
  MechSystems: [],
  PilotGear: [],
  Tags: [],
  Licenses: []
}

const mutations = {
  LOAD_DATA (state) {
    state.Backgrounds = io.loadData('backgrounds')
    state.Talents = io.loadData('talents')
    state.Skills = io.loadData('skills')
    state.CoreBonuses = io.loadData('core_bonus')
    state.Frames = io.loadData('frames')
    state.Manufacturers = io.loadData('manufacturers')
    state.MechWeapons = io.loadData('weapons')
    state.WeaponMods = io.loadData('mods')
    state.MechSystems = io.loadData('systems')
    state.PilotGear = io.loadData('pilot_gear')
    state.Tags = io.loadData('tags')
  },
  LOAD_BREW (state, userDataPath, brewDataFolder) {
    state.Backgrounds = state.Backgrounds.concat(io.loadBrewData(userDataPath, brewDataFolder, 'backgrounds'))
    state.Talents = state.Talents.concat(io.loadBrewData(userDataPath, brewDataFolder, 'talents'))
    state.Skills = state.Skills.concat(io.loadBrewData(userDataPath, brewDataFolder, 'skills'))
    state.CoreBonuses = state.CoreBonuses.concat(io.loadBrewData(userDataPath, brewDataFolder, 'core_bonus'))
    state.Frames = state.Frames.concat(io.loadBrewData(userDataPath, brewDataFolder, 'frames'))
    state.Manufacturers = state.Manufacturers.concat(io.loadBrewData(userDataPath, brewDataFolder, 'manufacturers'))
    state.MechWeapons = state.MechWeapons.concat(io.loadBrewData(userDataPath, brewDataFolder, 'weapons'))
    state.WeaponMods = state.WeaponMods.concat(io.loadBrewData(userDataPath, brewDataFolder, 'mods'))
    state.MechSystems = state.MechSystems.concat(io.loadBrewData(userDataPath, brewDataFolder, 'systems'))
    state.PilotGear = state.PilotGear.concat(io.loadBrewData(userDataPath, brewDataFolder, 'pilot_gear'))
    state.Tags = state.Tags.concat(io.loadBrewData(userDataPath, brewDataFolder, 'tags'))
  },
  BUILD_LICENSES (state) {
    var licenses = []
    state.Frames.filter(x => x.source.toLowerCase() !== 'gms').forEach((frame) => {
      licenses.push({
        source: frame.source.toLowerCase(),
        license: frame.name.toLowerCase(),
        unlocks: [
          [], // level 1
          [frame], // level 2
          [] // level 3
        ]
      })
    })
    state.MechWeapons
      .concat(state.WeaponMods, state.MechSystems)
      .filter(x => x.source && x.source.toLowerCase() !== 'gms' && x.source.toLowerCase() !== '')
      .forEach((item) => {
        var idx = licenses.findIndex(x => x.license === item.license.toLowerCase())
        licenses[idx].unlocks[item.license_level - 1].push(item)
      })
    state.Licenses = licenses
  }
}

const actions = {
  loadData (context) {
    context.commit('LOAD_DATA')
  },
  buildLicenses (context) {
    context.commit('BUILD_LICENSES')
  }
}

const getters = {
  getItemById: state => (itemType, id) => {
    return state[itemType].find(x => x.id === id) || {}
  },
  getLicenseByName: state => license => {
    return state.Licenses.find(x => x.license === license)
  },
  getItemCollection: state => itemType => {
    return state[itemType]
  }
}

export default {
  state,
  mutations,
  actions,
  getters
}
