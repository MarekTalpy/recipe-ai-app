export const RECIPE_CONFIG = {
  MIN_CONFIDENCE: 0.3,
  MAX_INGREDIENTS: 30,
  DEFAULT_LIMIT: 5,
  LIMIT_RANGE: { MIN: 1, MAX: 10 },
  PRECISION_MODES: {
    HIGH: 'high',
    MEDIUM: 'medium',
    LOW: 'low',
  },
  CUISINES: ['Italian', 'Mexican', 'Asian', 'French', 'Any'],
  MAX_PREP_TIME: ['15 min', '30 min', '60 min', 'Any'],
  PREP_TIME_OPTIONS: {
    QUICK: '15 min',
    MEDIUM: '30 min',
    RELAXED: '60 min',
    ANY: 'any',
  },
};
