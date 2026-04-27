export interface Paper {
  id: string;
  title: string;
  authors: string[];
  primary_category: string;
  categories: string[];
  pdf_url: string;
  html_url: string;
  published: string;
  abstract?: string;
}

export interface AppEvaluation {
  score: number;
  recommended_type: "web_demo" | "mobile_app" | "cli_tool" | "api";
  app_idea: string;
  core_features: string[];
  difficulty: "상" | "중" | "하";
}

export interface ScoredPaper {
  paper: Paper;
  evaluation: AppEvaluation;
}

export type Platform =
  | "nextjs"
  | "ios"
  | "watchos"
  | "macos"
  | "react-native"
  | "cli"
  | "chrome-ext";

export const PLATFORM_LABELS: Record<Platform, string> = {
  nextjs: "Next.js 웹앱",
  ios: "iOS (SwiftUI)",
  watchos: "watchOS",
  macos: "macOS (SwiftUI)",
  "react-native": "React Native",
  cli: "CLI 도구",
  "chrome-ext": "Chrome Extension",
};
