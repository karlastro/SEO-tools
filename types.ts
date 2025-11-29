export enum ImpactLevel {
  HIGH = 'High',
  MEDIUM = 'Medium',
  LOW = 'Low'
}

export enum RecommendationType {
  KEEP = 'Keep',
  DELETE = 'Delete',
  REPLACE_PLUGIN = 'Replace with Lighter Plugin',
  REPLACE_MANUAL = 'Replace with Code'
}

export interface AlternativeOption {
  name: string;
  description: string;
  type: 'plugin' | 'code';
}

export interface PluginAnalysis {
  name: string;
  category: string;
  impactLevel: ImpactLevel;
  bloatScore: number; // 1-10
  functionality: string;
  reasonForImpact: string;
  recommendation: RecommendationType;
  alternative?: AlternativeOption;
  redundancyGroup?: string; // Group ID for duplicates
}

export interface AnalysisResult {
  overallHealthScore: number;
  estimatedLoadTimeImpact: string;
  summary: string;
  plugins: PluginAnalysis[];
  redundancyGroups: Record<string, string[]>; // Map Group ID to Plugin Names
}

export interface AnalysisError {
  message: string;
}