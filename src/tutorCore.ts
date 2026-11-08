/**
 * TutorUNAD - Módulo de Lógica Pura y Algoritmos del Negocio
 * Contiene funciones deterministas para gamificación, filtros, reputación y analítica.
 */

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'Estudiante Solicitante' | 'Tutor Par';
  program: string;
  cead: string;
  points: number;
  ratingAvg: number;
  ratingsCount: number;
  solvedCount: number;
  specialties: string[];
  badges: string[];
  avatarBg: string;
}

export interface Answer {
  id: string;
  questionId: string;
  authorId: string;
  authorName: string;
  authorRole: string;
  authorLevel: string;
  authorPoints: number;
  content: string;
  codeSnippet?: string;
  createdAt: number;
  isAccepted: boolean;
  ratingStars?: number;
}

export interface Question {
  id: string;
  title: string;
  subject: string;
  description: string;
  codeSnippet?: string;
  tags: string[];
  authorId: string;
  authorName: string;
  authorRole: string;
  authorProgram: string;
  authorCead: string;
  authorPoints: number;
  createdAt: number;
  status: 'Abierta' | 'Resuelta';
  answers: Answer[];
}

export interface LevelInfo {
  level: 'Novato' | 'Plata' | 'Oro';
  badgeName: string;
  min: number;
  max: number;
  nextThreshold: number;
  progressPct: number;
  color: string;
}

/**
 * RF05/RF07: Calcula el nivel y progreso gamificado según los puntos acumulados.
 * - Novato: 0 a 49 pts
 * - Nivel Plata: 50 a 99 pts
 * - Nivel Oro: 100+ pts
 */
export function calculateLevel(points: number): LevelInfo {
  const safePoints = Math.max(0, points);
  if (safePoints >= 100) {
    return {
      level: 'Oro',
      badgeName: 'Tutor Nivel Oro',
      min: 100,
      max: Infinity,
      nextThreshold: 100,
      progressPct: 100,
      color: '#F4A900' // Dorado UNAD
    };
  }
  if (safePoints >= 50) {
    const progress = Math.min(100, Math.round(((safePoints - 50) / (100 - 50)) * 100));
    return {
      level: 'Plata',
      badgeName: 'Tutor Nivel Plata',
      min: 50,
      max: 99,
      nextThreshold: 100,
      progressPct: progress,
      color: '#A0AAB2' // Plata
    };
  }
  const progress = Math.min(100, Math.round((safePoints / 50) * 100));
  return {
    level: 'Novato',
    badgeName: 'Tutor Novato',
    min: 0,
    max: 49,
    nextThreshold: 50,
    progressPct: progress,
    color: '#0083B0' // Azul claro UNAD
  };
}

/**
 * RF05: Calcula el incremento de puntos al aceptar una respuesta útil
 * y calificar con estrellas.
 * - Solución útil aceptada: +10 puntos
 * - Calificación con 5 estrellas: +5 puntos extra
 */
export function calculateReputationDelta(isAccepted: boolean, ratingStars: number): number {
  let delta = 0;
  if (isAccepted) {
    delta += 10;
  }
  if (ratingStars === 5) {
    delta += 5;
  }
  return delta;
}

/**
 * Normaliza y limpia etiquetas/tags desde entrada de texto
 */
export function parseTags(rawTags: string | string[]): string[] {
  if (Array.isArray(rawTags)) {
    return rawTags.map(t => t.trim().toLowerCase().replace(/^#+/, '')).filter(Boolean);
  }
  return rawTags
    .split(/[,;\s]+/)
    .map(t => t.trim().toLowerCase().replace(/^#+/, ''))
    .filter(t => t.length > 0);
}

/**
 * RF02 / RF03: Algoritmo de filtrado reactivo y ordenamiento de dudas
 */
export interface FilterCriteria {
  searchTerm?: string;
  subject?: string;
  status?: 'all' | 'unanswered' | 'resolved' | 'my-subjects';
  userSubjects?: string[];
  selectedTag?: string;
  sortBy?: 'recent' | 'reputation' | 'answers';
}

export function filterQuestions(questions: Question[], criteria: FilterCriteria): Question[] {
  const term = (criteria.searchTerm || '').trim().toLowerCase();
  const subjectFilter = criteria.subject || 'all';
  const statusFilter = criteria.status || 'all';
  const selectedTag = (criteria.selectedTag || '').trim().toLowerCase().replace(/^#+/, '');
  const userSubjects = (criteria.userSubjects || []).map(s => s.toLowerCase());

  let filtered = questions.filter(q => {
    // 1. Filtro por término de búsqueda en título, descripción, autor, materia o tags
    if (term) {
      const matchTitle = q.title.toLowerCase().includes(term);
      const matchDesc = q.description.toLowerCase().includes(term);
      const matchAuthor = q.authorName.toLowerCase().includes(term);
      const matchSubject = q.subject.toLowerCase().includes(term);
      const matchTags = q.tags.some(tag => tag.toLowerCase().includes(term));
      if (!matchTitle && !matchDesc && !matchAuthor && !matchSubject && !matchTags) {
        return false;
      }
    }

    // 2. Filtro por materia específica
    if (subjectFilter !== 'all' && q.subject.toLowerCase() !== subjectFilter.toLowerCase()) {
      return false;
    }

    // 3. Filtro por tag seleccionado
    if (selectedTag) {
      const hasTag = q.tags.some(t => t.toLowerCase() === selectedTag);
      if (!hasTag) return false;
    }

    // 4. Filtro por estado
    if (statusFilter === 'unanswered') {
      if (q.answers.length > 0) return false;
    } else if (statusFilter === 'resolved') {
      if (q.status !== 'Resuelta') return false;
    } else if (statusFilter === 'my-subjects') {
      if (userSubjects.length > 0 && !userSubjects.includes(q.subject.toLowerCase())) {
        return false;
      }
    }

    return true;
  });

  // Ordenamiento dinámico
  const sortBy = criteria.sortBy || 'recent';
  filtered.sort((a, b) => {
    if (sortBy === 'reputation') {
      return (b.authorPoints || 0) - (a.authorPoints || 0);
    }
    if (sortBy === 'answers') {
      return b.answers.length - a.answers.length;
    }
    // 'recent' por defecto
    return b.createdAt - a.createdAt;
  });

  return filtered;
}

/**
 * RF08: Panel de Analítica y Métricas para Proyecto de Grado
 */
export interface SubjectParetoItem {
  subject: string;
  count: number;
  percentage: number;
}

export interface AnalyticsSummary {
  totalQuestions: number;
  resolvedQuestions: number;
  unansweredQuestions: number;
  resolutionRatePct: number;
  totalAnswers: number;
  topTutor: User | null;
  subjectsPareto: SubjectParetoItem[];
}

export function calculateAnalytics(questions: Question[], users: User[]): AnalyticsSummary {
  const totalQuestions = questions.length;
  const resolvedQuestions = questions.filter(q => q.status === 'Resuelta').length;
  const unansweredQuestions = questions.filter(q => q.answers.length === 0).length;
  const totalAnswers = questions.reduce((acc, q) => acc + q.answers.length, 0);
  const resolutionRatePct = totalQuestions > 0 ? Math.round((resolvedQuestions / totalQuestions) * 100) : 0;

  // Tutores ordenados por reputación
  const tutors = users.filter(u => u.role === 'Tutor Par');
  tutors.sort((a, b) => b.points - a.points);
  const topTutor = tutors[0] || null;

  // Conteo por materia y Pareto
  const countsBySubject: Record<string, number> = {};
  questions.forEach(q => {
    countsBySubject[q.subject] = (countsBySubject[q.subject] || 0) + 1;
  });

  const subjectsPareto: SubjectParetoItem[] = Object.entries(countsBySubject)
    .map(([subject, count]) => ({
      subject,
      count,
      percentage: totalQuestions > 0 ? Math.round((count / totalQuestions) * 100) : 0
    }))
    .sort((a, b) => b.count - a.count);

  return {
    totalQuestions,
    resolvedQuestions,
    unansweredQuestions,
    resolutionRatePct,
    totalAnswers,
    topTutor,
    subjectsPareto
  };
}

/**
 * Elimina una duda por ID de forma inmutable
 */
export function deleteQuestionFromList(questions: Question[], id: string): Question[] {
  return questions.filter(q => q.id !== id);
}
