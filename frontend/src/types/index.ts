export interface Team {
  id: number;
  name: string;
  country: string;
  logoUrl: string | null;
}

export interface Season {
  id: number;
  name: string;
}

export interface PlayerStats {
  id: number;
  seasonId: number;
  season: Season;
  matchesPlayed: number;
  minutesPlayed: number;
  goals: number;
  assists: number;
  yellowCards: number;
  redCards: number;
  shotsOnTarget: number;
  successfulPasses: number;
  passAccuracy: number;
  aerialDuelsWon: number;
  aerialDuelsTotal: number;
  defensiveDuelsWon: number;
  defensiveDuelsTotal: number;
  xG: number;
  xA: number;
  recoveries: number;
}

export interface Player {
  id: number;
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  nationality: string;
  position: string;
  photoUrl: string | null;
  teamId: number | null;
  team: Team | null;
  stats: PlayerStats[];
}

export interface PaginatedResponse<T> {
  data: T[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
  error: null | string;
}

export interface ApiResponse<T> {
  data: T;
  error: null | string;
}

export interface PlayerPercentiles {
  goals: number;
  assists: number;
  xG: number;
  xA: number;
  shotsOnTarget: number;
  successfulPasses: number;
  passAccuracy: number;
  aerialDuelsWon: number;
  defensiveDuelsWon: number;
  recoveries: number;
  yellowCards: number;
  redCards: number;
}

export interface PlayerStatsResponse {
  player: Player;
  percentiles: PlayerPercentiles | null;
}