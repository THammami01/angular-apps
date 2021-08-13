export interface Incident {
  incidentNb: number;
  sourcePost: string;
  voltage: number;
  departure: string;
  aSType: string;
  incidentType: string | string[];
  startDatetime: string;
  firstRecoveryDatetime: string;
  endDatetime: string;
  cutOff: number;
  recovery: number;
  section: string;
  observations: string;
}