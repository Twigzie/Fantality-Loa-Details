import Store from "electron-store";
import log from "electron-log";
import { StatusEffectBuffTypeFlags } from "meter-core/logger/data";
import { classes } from "src/constants/classes";
import { merge } from "lodash"; //TODO: when we rework, remove lodash (required for merge)
import { randomUUID } from "crypto";
import { app } from "electron";

const store = new Store();

export function resetSettings() {
  try {

    const settings = structuredClone(defaultSettings);
    settings.clientId = randomUUID();
    saveSettings(settings);

    log.info("Reset settings.");

  } catch (e) {
    log.info("Settings reset failed: " + (e as string));
  }
}

export function getSettings() {

  try {

    const appSettings = structuredClone(defaultSettings);
    const settingsStr = store.get("settings");
    if (typeof settingsStr === "object")
      merge(appSettings, structuredClone(settingsStr));
    else if (typeof settingsStr === "string")
      merge(appSettings, JSON.parse(settingsStr));


    if (appSettings.appVersion === "" || appSettings.clientId === "") {
      if (appSettings.appVersion === "")
        appSettings.appVersion = app.getVersion();
      if (appSettings.clientId === "")
        appSettings.clientId = randomUUID();
      saveSettings(appSettings);
    }

    for (const k in appSettings.damageMeter.classes) {
      if (!(k in classes))
        delete appSettings.damageMeter.classes[k];
    }
    for (const k in appSettings.damageMeter.tabs) {
      if (!(k in defaultSettings.damageMeter.tabs))
        delete appSettings.damageMeter.tabs[k];
    }

    log.info("Found and applied settings.");

    return appSettings;

  } catch (e) {
    log.info("Setting retrieval failed, returning default: " + (e as string));
    return structuredClone(defaultSettings);
  }

}

export function saveSettings(settings: Settings | string) {
  if (typeof settings === "object")
    store.set("settings", JSON.stringify(settings));
  else store.set("settings", settings);

  // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
  log.info(`Saved settings: ${settings}`);
}
export type ClassSettings = { color: string; defaultColor: string };
export type Settings = {
  appVersion: string;
  clientId: string;
  general: {
    startMainHidden: boolean;
    startMainMinimized: boolean;
    closeToSystemTray: boolean;
    saveScreenshots: boolean;
    updatesOnStartup: boolean;
    server: "steam" | "kr" | "ru";
    customLogPath: string | null;
    useRawSocket: boolean;
    listenPort: number;
  };
  shortcuts: {
    minimizeDamageMeter: {
      value: string;
      defaultValue: string;
    };
    resetSession: {
      value: string;
      defaultValue: string;
    };
    pauseDamageMeter: {
      value: string;
      defaultValue: string;
    };
  };
  uploads: {
    uploadLogs: boolean;
    uploadKey: string;
    api: {
      value?: string;
      defaultValue?: string;
    };
    endpoint: {
      value?: string;
      defaultValue?: string;
    };
    site: {
      value?: string;
      defaultValue?: string;
    };
    openOnUpload: boolean;
    uploadUnlisted: boolean;
    includeRegion: boolean;
  };
  damageMeter: {
    functionality: {
      dontResetOnZoneChange: boolean;
      pauseOnPhaseTransition: boolean;
      resetAfterPhaseTransition: boolean;
      displayEsther: boolean;
      estherColor: string;
      estherIncludeInTotal: boolean;
      autoMinimize: boolean;
      autoMinimizeTimer: number;
      minimizeToTaskbar: boolean;
      nameDisplay: string;
      nameDisplayV2: string;
    };
    design: {
      compactDesign: boolean;
      pinUserToTop: boolean;
      transparency: boolean;
      opacity: number;
      alwaysOnTop: boolean;
    };
    header: {
      [key: string]: {
        name: string;
        enabled: boolean;
      };
    };
    tabs: {
      [key: string]: {
        name: string;
        enabled: boolean;
      };
    };
    buffFilter: { [key: string]: number };
    classes: { [key: string]: ClassSettings };
  };
  logs: {
    minimumSessionDurationInMinutes: number;
    minimumEncounterDurationInMinutes: number;
    minimumDurationInMinutes: number;
    splitOnPhaseTransition: boolean;
    multithreadParsing: boolean;
  };
};
// TODO: find a better way to handle this
const defaultSettings: Settings = {
  appVersion: "",
  clientId: "",
  general: {
    startMainHidden: false,
    startMainMinimized: false,
    closeToSystemTray: true,
    saveScreenshots: true,
    updatesOnStartup: false,
    server: "steam",
    customLogPath: null,
    useRawSocket: false,
    listenPort: 6040,
  },
  shortcuts: {
    minimizeDamageMeter: {
      value: "CommandOrControl+Down",
      defaultValue: "CommandOrControl+Down",
    },
    resetSession: {
      value: "CommandOrControl+Up",
      defaultValue: "CommandOrControl+Up",
    },
    pauseDamageMeter: {
      value: "CommandOrControl+Right",
      defaultValue: "CommandOrControl+Right",
    },
  },
  uploads: {
    uploadLogs: false,
    uploadKey: "",
    api: {
      value: process.env.UPLOADS_API_URL,
      defaultValue: process.env.UPLOADS_API_URL,
    },
    endpoint: {
      value: process.env.UPLOADS_ENDPOINT,
      defaultValue: process.env.UPLOADS_ENDPOINT,
    },
    site: {
      value: process.env.UPLOADS_LOGIN_URL,
      defaultValue: process.env.UPLOADS_LOGIN_URL,
    },
    openOnUpload: false,
    uploadUnlisted: true,
    includeRegion: false,
  },
  damageMeter: {
    functionality: {
      dontResetOnZoneChange: false,
      pauseOnPhaseTransition: true,
      resetAfterPhaseTransition: true,
      displayEsther: true,
      estherColor: "#c2fc03",
      estherIncludeInTotal: true,
      autoMinimize: false,
      autoMinimizeTimer: 60,
      minimizeToTaskbar: false,
      nameDisplay: "name+class",
      nameDisplayV2: "name+gear+class",
    },
    design: {
      compactDesign: false,
      pinUserToTop: false,
      transparency: true,
      opacity: 0.9,
      alwaysOnTop: true,
    },
    header: {
      damage: {
        name: "Damage",
        enabled: true,
      },
      dps: {
        name: "DPS",
        enabled: true,
      },
      tank: {
        name: "Tanked",
        enabled: false,
      },
      bossHP: {
        name: "Boss HP",
        enabled: false,
      },
    },
    tabs: {
      damage: {
        name: "Damage/Tanked",
        enabled: true,
      },
      deathTime: {
        name: "Death Time",
        enabled: false,
      },
      damagePercent: {
        name: "D% (Damage Percent)",
        enabled: true,
      },
      dps: {
        name: "DPS/TPS",
        enabled: true,
      },
      critRate: {
        name: "Crit Rate",
        enabled: true,
      },
      dPartyBuff: {
        name: "Tab: Dmg % dealt during party synergies",
        enabled: true,
      },
      dSelfBuff: {
        name: "Tab: Dmg % dealt during self synergies (set, food, engravings, skills)",
        enabled: true,
      },
      dOtherBuff: {
        name: "Tab: Dmg % dealt during other buffs",
        enabled: false,
      },
      faRate: {
        name: "Front Attack Rate",
        enabled: true,
      },
      baRate: {
        name: "Back Attack Rate",
        enabled: true,
      },
      rdpsSynPercent: {
        name: "Synergy %",
        enabled: true,
      },
      rdpsSupSynPercent: {
        name: "Synergy % from supports",
        enabled: true,
      },
      rdpsDpsSynPercent: {
        name: "Synergy % from dps",
        enabled: true,
      },
      counterCount: {
        name: "Counter Count",
        enabled: true,
      },
      hPartyBuff: {
        name: "Tab: Hit % dealt during party synergies",
        enabled: false,
      },
      hSelfBuff: {
        name: "Tab: Hit % dealt during self synergies (set, food, engravings, skills)",
        enabled: false,
      },
      hOtherBuff: {
        name: "Tab: Hit % dealt during other buffs",
        enabled: false,
      },
      maxDmg: {
        name: "Skill View / Max Damage",
        enabled: true,
      },
      avgDmg: {
        name: "Skill View / Average Damage",
        enabled: true,
      },
      avgCast: {
        name: "Skill View / Average Damage per Cast",
        enabled: false,
      },
      totalHits: {
        name: "Skill View / Total Hits",
        enabled: true,
      },
      totalCasts: {
        name: "Skill View / Total Casts",
        enabled: false,
      },
      hpm: {
        name: "Skill View / Hits per Minute",
        enabled: true,
      },
      cpm: {
        name: "Skill View / Casts per Minute",
        enabled: false,
      },
      rdpsTab: {
        name: "Tab: Raid DPS/Contribution",
        enabled: true,
      },
      shieldGiven: {
        name: "Tab: Shield applied to other players",
        enabled: true,
      },
      shieldGotten: {
        name: "Tab: Shield gotten from other players",
        enabled: false,
      },
      eshieldGiven: {
        name: "Tab: Effective (used up) shield given to other players",
        enabled: true,
      },
      eshieldGotten: {
        name: "Tab: Effective (used up) shield gotten from other players",
        enabled: false,
      },
    },
    buffFilter: {
      party:
        StatusEffectBuffTypeFlags.DMG |
        StatusEffectBuffTypeFlags.CRIT |
        StatusEffectBuffTypeFlags.ATKSPEED |
        StatusEffectBuffTypeFlags.COOLDOWN,
      self:
        StatusEffectBuffTypeFlags.DMG |
        StatusEffectBuffTypeFlags.CRIT |
        StatusEffectBuffTypeFlags.ATKSPEED |
        StatusEffectBuffTypeFlags.COOLDOWN,
      other: StatusEffectBuffTypeFlags.ANY,
    },
    classes: {},
  },
  logs: {
    minimumSessionDurationInMinutes: 1,
    minimumEncounterDurationInMinutes: 0.5,
    minimumDurationInMinutes: 0.0,
    splitOnPhaseTransition: true,
    multithreadParsing: true,
  },
};
