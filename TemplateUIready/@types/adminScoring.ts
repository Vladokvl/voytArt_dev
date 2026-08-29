export type AdminScoringParameters = {
  relativeOverlapWeightPct: number
  rawOverlapWeightPct: number
  qualityWeightPct: number
  clusterCoherenceWeightPct: number
  minMutualContactsMasked: number
  universalContactThresholdPct: number
  inviteClusterCoherenceThresholdPct: number
}

export type AdminScoringParametersResponse = {
  status: 'success'
  data: AdminScoringParameters
}
