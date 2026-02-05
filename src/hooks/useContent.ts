import advocacyData from '../content/advocacy/index.json';
import aboutData from '../content/about/index.json';
import learnMoreData from '../content/learnMore/index.json';
import impactStatementData from '../content/impactStatement/index.json';
import quizData from '../content/quiz/index.json';

// Use Vite's glob import to load all news items
const newsModules = import.meta.glob('../content/news/*/index.json', { eager: true });
const newsData = Object.values(newsModules).map((mod: any) => mod.default);

export function useAdvocacyContent() {
  return advocacyData;
}

export function useAboutContent() {
  return aboutData;
}

export function useLearnMoreContent() {
  return learnMoreData;
}

export function useImpactStatementContent() {
  return impactStatementData;
}

export function useQuizContent() {
  return quizData;
}

export function useNewsContent() {
  return newsData;
}
