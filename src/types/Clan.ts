export interface ClanLevelInfo {
  level: number;
  exp: number;
  expToNextLevel: number;
}

export interface ClanResourceProduction {
  spiritStoneRate: number;
  materialRate: number;
  contributionRate: number;
  expBonus: number;
}

export interface ClanDefense {
  formationStrength: number;
  buildingDefense: number;
  counterAttack: number;
  alertLevel: number;
}

export interface Building {
  id: string;
  type: string;
  name: string;
  level: number;
  defenseValue: number;
  isFunctional: boolean;
  lastRepaired: Date;
}

export interface Clan {
  id: string;
  name: string;
  levelInfo: ClanLevelInfo;
  memberCount: number;
  maxMembers: number;
  activeMembers: number;
  resourceStorage: {
    spiritStones: number;
    materials: Record<string, number>;
  };
  territoryArea: number;
  production: ClanResourceProduction;
  defense: ClanDefense;
  buildings: Building[];
}