import test from 'node:test';
import assert from 'node:assert/strict';
import {
  calculateLevel,
  calculateReputationDelta,
  parseTags,
  filterQuestions,
  calculateAnalytics,
  deleteQuestionFromList,
  type Question,
  type User
} from './tutorCore';

test('calculateLevel maps points to the correct gamification tier', () => {
  assert.equal(calculateLevel(0).level, 'Novato');
  assert.equal(calculateLevel(49).level, 'Novato');
  assert.equal(calculateLevel(50).level, 'Plata');
  assert.equal(calculateLevel(99).level, 'Plata');
  assert.equal(calculateLevel(100).level, 'Oro');
  assert.equal(calculateLevel(150).level, 'Oro');
});

test('calculateReputationDelta grants 10 pts for accepted answer and 5 bonus for 5 stars', () => {
  // Accepted answer with 4 stars -> +10
  assert.equal(calculateReputationDelta(true, 4), 10);
  // Accepted answer with 5 stars -> +15
  assert.equal(calculateReputationDelta(true, 5), 15);
  // Unaccepted answer with 5 stars -> +5
  assert.equal(calculateReputationDelta(false, 5), 5);
  // Unaccepted with 3 stars -> 0
  assert.equal(calculateReputationDelta(false, 3), 0);
});

test('parseTags cleans prefixes and delimiters', () => {
  const result = parseTags('#calculo, #derivadas; limites  #integral');
  assert.deepEqual(result, ['calculo', 'derivadas', 'limites', 'integral']);
});

test('filterQuestions filters by search term, subject, tag and status', () => {
  const sampleQuestions: Question[] = [
    {
      id: 'q1',
      title: 'Duda con derivadas de seno',
      subject: 'Cálculo Diferencial',
      description: 'Regla de la cadena',
      tags: ['calculo', 'derivadas'],
      authorId: 'u1',
      authorName: 'Ana Martínez',
      authorRole: 'Estudiante Solicitante',
      authorProgram: 'Ingeniería de Sistemas',
      authorCead: 'JAG',
      authorPoints: 10,
      createdAt: 1000,
      status: 'Abierta',
      answers: []
    },
    {
      id: 'q2',
      title: 'Método filter en arreglos JS',
      subject: 'Fundamentos de Programación',
      description: 'Filtrar aprobados',
      tags: ['programacion', 'javascript'],
      authorId: 'u2',
      authorName: 'Carlos Gómez',
      authorRole: 'Estudiante Solicitante',
      authorProgram: 'Ingeniería de Sistemas',
      authorCead: 'JAG',
      authorPoints: 30,
      createdAt: 2000,
      status: 'Resuelta',
      answers: [
        {
          id: 'a1',
          questionId: 'q2',
          authorId: 'u3',
          authorName: 'Juan Ramírez',
          authorRole: 'Tutor Par',
          authorLevel: 'Oro',
          authorPoints: 120,
          content: 'Usa array.filter(item => item.nota >= 3.0)',
          createdAt: 2500,
          isAccepted: true,
          ratingStars: 5
        }
      ]
    }
  ];

  // Test search term
  const termMatches = filterQuestions(sampleQuestions, { searchTerm: 'derivadas' });
  assert.equal(termMatches.length, 1);
  assert.equal(termMatches[0].id, 'q1');

  // Test subject filter
  const progMatches = filterQuestions(sampleQuestions, { subject: 'Fundamentos de Programación' });
  assert.equal(progMatches.length, 1);
  assert.equal(progMatches[0].id, 'q2');

  // Test status unanswered
  const unanswered = filterQuestions(sampleQuestions, { status: 'unanswered' });
  assert.equal(unanswered.length, 1);
  assert.equal(unanswered[0].id, 'q1');

  // Test status resolved
  const resolved = filterQuestions(sampleQuestions, { status: 'resolved' });
  assert.equal(resolved.length, 1);
  assert.equal(resolved[0].id, 'q2');
});

test('calculateAnalytics calculates resolution rate and top tutors accurately', () => {
  const users: User[] = [
    {
      id: 'u1',
      name: 'Juan Camilo Ramírez',
      email: 'juan@unad.edu.co',
      role: 'Tutor Par',
      program: 'Ingeniería de Sistemas',
      cead: 'JAG',
      points: 120,
      ratingAvg: 4.8,
      ratingsCount: 15,
      solvedCount: 12,
      specialties: ['JavaScript'],
      badges: ['Top Tutor 2026'],
      avatarBg: '#002B49'
    },
    {
      id: 'u2',
      name: 'Laura Gómez',
      email: 'laura@unad.edu.co',
      role: 'Tutor Par',
      program: 'Ingeniería Industrial',
      cead: 'Medellín',
      points: 85,
      ratingAvg: 4.9,
      ratingsCount: 9,
      solvedCount: 8,
      specialties: ['Cálculo'],
      badges: ['Especialista Cálculo'],
      avatarBg: '#0083B0'
    }
  ];

  const questions: Question[] = [
    {
      id: 'q1',
      title: 'Q1',
      subject: 'Cálculo Diferencial',
      description: 'D1',
      tags: ['calculo'],
      authorId: 'u3',
      authorName: 'Ana',
      authorRole: 'Estudiante Solicitante',
      authorProgram: 'Ingeniería',
      authorCead: 'JAG',
      authorPoints: 0,
      createdAt: 1000,
      status: 'Resuelta',
      answers: [{ id: 'a1', questionId: 'q1', authorId: 'u1', authorName: 'Juan', authorRole: 'Tutor Par', authorLevel: 'Oro', authorPoints: 120, content: 'sol', createdAt: 1100, isAccepted: true }]
    },
    {
      id: 'q2',
      title: 'Q2',
      subject: 'Cálculo Diferencial',
      description: 'D2',
      tags: ['calculo'],
      authorId: 'u3',
      authorName: 'Ana',
      authorRole: 'Estudiante Solicitante',
      authorProgram: 'Ingeniería',
      authorCead: 'JAG',
      authorPoints: 0,
      createdAt: 2000,
      status: 'Abierta',
      answers: []
    }
  ];

  const analytics = calculateAnalytics(questions, users);
  assert.equal(analytics.totalQuestions, 2);
  assert.equal(analytics.resolvedQuestions, 1);
  assert.equal(analytics.unansweredQuestions, 1);
  assert.equal(analytics.resolutionRatePct, 50);
  assert.equal(analytics.topTutor?.name, 'Juan Camilo Ramírez');
  assert.equal(analytics.subjectsPareto[0].subject, 'Cálculo Diferencial');
});

test('deleteQuestionFromList removes question by ID cleanly', () => {
  const sampleQuestions: Question[] = [
    {
      id: 'q1',
      title: 'Q1',
      subject: 'Cálculo Diferencial',
      description: 'D1',
      tags: ['calculo'],
      authorId: 'u1',
      authorName: 'Ana',
      authorRole: 'Estudiante Solicitante',
      authorProgram: 'Ingeniería',
      authorCead: 'JAG',
      authorPoints: 0,
      createdAt: 1000,
      status: 'Abierta',
      answers: []
    },
    {
      id: 'q2',
      title: 'Q2',
      subject: 'Álgebra Lineal',
      description: 'D2',
      tags: ['algebra'],
      authorId: 'u2',
      authorName: 'Carlos',
      authorRole: 'Estudiante Solicitante',
      authorProgram: 'Ingeniería',
      authorCead: 'JAG',
      authorPoints: 0,
      createdAt: 2000,
      status: 'Abierta',
      answers: []
    }
  ];

  const updated = deleteQuestionFromList(sampleQuestions, 'q1');
  assert.equal(updated.length, 1);
  assert.equal(updated[0].id, 'q2');
});
