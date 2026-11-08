/**
 * ============================================================================
 * TUTORUNAD - Plataforma Web de Tutorías entre Estudiantes (UNAD, ECBTI)
 * Arquitectura JavaScript ES6+ Vanilla - Motor de Negocio y Persistencia Local
 * Cumplimiento de Requerimientos: RF01 al RF08
 * ============================================================================
 */

(function () {
  'use strict';

  // Guardia de ejecución única para entornos locales y servidores
  if (window.__TUTORUNAD_INITIALIZED__) {
    return;
  }
  window.__TUTORUNAD_INITIALIZED__ = true;

  // ==========================================================================
  // 1. CLAVES DE PERSISTENCIA EN LOCALSTORAGE
  // ==========================================================================
  const STORAGE_KEYS = {
    USERS: 'tutorunad_users',
    CURRENT_USER: 'tutorunad_current_user',
    QUESTIONS: 'tutorunad_questions',
    CHATS: 'tutorunad_chats'
  };

  // ==========================================================================
  // 2. SEMILLERO DE DATOS INICIALES (MOCK DATA OBLIGATORIO)
  // ==========================================================================
  const SEED_USERS = [
    {
      id: 'usr-ana-01',
      name: 'Ana Martínez',
      email: 'ana.martinez@unad.edu.co',
      role: 'Estudiante Solicitante',
      program: 'Ingeniería de Sistemas',
      cead: 'José Acevedo y Gómez (JAG Bogotá)',
      points: 25,
      ratingAvg: 5.0,
      ratingsCount: 2,
      solvedCount: 1,
      specialties: ['Fundamentos de Programación', 'Algoritmos'],
      badges: ['Estudiante Destacado', 'Participación Activa'],
      avatarBg: '#E87722'
    },
    {
      id: 'usr-juan-02',
      name: 'Juan Camilo Ramírez',
      email: 'juan.ramirez@unad.edu.co',
      role: 'Tutor Par',
      program: 'Ingeniería de Sistemas',
      cead: 'José Acevedo y Gómez (JAG Bogotá)',
      points: 120,
      ratingAvg: 4.8,
      ratingsCount: 15,
      solvedCount: 12,
      specialties: ['JavaScript', 'Bases de Datos', 'Estructuras de Datos'],
      badges: ['Top Tutor 2026', 'Especialista ECBTI', 'Respuesta Rápida', 'Mentor Solidario'],
      avatarBg: '#002B49'
    },
    {
      id: 'usr-laura-03',
      name: 'Laura Gómez',
      email: 'laura.gomez@unad.edu.co',
      role: 'Tutor Par',
      program: 'Ingeniería Industrial',
      cead: 'Medellín',
      points: 85,
      ratingAvg: 4.9,
      ratingsCount: 9,
      solvedCount: 8,
      specialties: ['Cálculo Diferencial', 'Álgebra Lineal', 'Estadística'],
      badges: ['Tutor Destacado', 'Especialista ECBTI', 'Respuesta Rápida'],
      avatarBg: '#0083B0'
    },
    {
      id: 'usr-carlos-04',
      name: 'Carlos Andrés Pérez',
      email: 'carlos.perez@unad.edu.co',
      role: 'Tutor Par',
      program: 'Ingeniería Electrónica',
      cead: 'Cali',
      points: 40,
      ratingAvg: 4.6,
      ratingsCount: 4,
      solvedCount: 3,
      specialties: ['Pensamiento Lógico', 'Física General'],
      badges: ['Mentor Solidario'],
      avatarBg: '#10B981'
    }
  ];

  const SEED_QUESTIONS = [
    {
      id: 'duda-001',
      title: '¿Cómo usar filter() para filtrar lista de estudiantes aprobados?',
      subject: 'Fundamentos de Programación',
      description: 'Hola compañeros, estoy realizando el paso 3 de la guía de actividades. Tengo un arreglo de objetos con las notas de los estudiantes de la UNAD y necesito filtrar únicamente a los que tengan nota definitiva mayor o igual a 3.0. ¿Podrían orientarme con la sintaxis de JavaScript?',
      codeSnippet: `const estudiantes = [
  { nombre: "Carlos", nota: 2.8 },
  { nombre: "María", nota: 4.5 },
  { nombre: "Julián", nota: 3.2 }
];
// ¿Cómo uso filter aquí para obtener los aprobados?`,
      tags: ['programacion', 'javascript', 'arrays'],
      authorId: 'usr-ana-01',
      authorName: 'Ana Martínez',
      authorRole: 'Estudiante Solicitante',
      authorProgram: 'Ingeniería de Sistemas',
      authorCead: 'JAG Bogotá',
      authorPoints: 25,
      createdAt: Date.now() - 3600000 * 5, // Hace 5 horas
      status: 'Resuelta',
      answers: [
        {
          id: 'ans-101',
          questionId: 'duda-001',
          authorId: 'usr-juan-02',
          authorName: 'Juan Camilo Ramírez',
          authorRole: 'Tutor Par',
          authorLevel: 'Oro',
          authorPoints: 120,
          content: '¡Hola Ana! En JavaScript, el método filter() itera sobre cada elemento y evalúa una condición booleana. Si devuelve true, el elemento se incluye en el nuevo arreglo sin modificar el original.',
          codeSnippet: `const aprobados = estudiantes.filter(estudiante => estudiante.nota >= 3.0);
console.log(aprobados);
// Retorna a María (4.5) y Julián (3.2)`,
          createdAt: Date.now() - 3600000 * 4,
          isAccepted: true,
          ratingStars: 5
        }
      ]
    },
    {
      id: 'duda-002',
      title: 'No entiendo la regla de la cadena en la derivada de f(x) = sin(2x²)',
      subject: 'Cálculo Diferencial',
      description: 'Buenas tardes grupo de estudio ECBTI. En la tarea 2 de cálculo diferencial me solicitan encontrar la derivada de f(x) = sin(2x²). Me confundo al identificar la función interna u(x) y la función externa, y no sé cómo multiplicar por la derivada interna.',
      codeSnippet: `f(x) = sin(2x²)
// ¿Cuál es u(x) y cómo se aplica dy/dx = (dy/du) * (du/dx)?`,
      tags: ['calculo', 'derivadas', 'regla-cadena'],
      authorId: 'usr-ana-01',
      authorName: 'Ana Martínez',
      authorRole: 'Estudiante Solicitante',
      authorProgram: 'Ingeniería de Sistemas',
      authorCead: 'JAG Bogotá',
      authorPoints: 25,
      createdAt: Date.now() - 3600000 * 2, // Hace 2 horas
      status: 'Abierta',
      answers: []
    },
    {
      id: 'duda-003',
      title: 'Demostración geométrica del límite sin(x)/x cuando x tiende a 0',
      subject: 'Cálculo Diferencial',
      description: 'Cordial saludo. Estoy preparando mi sustentación para la fase final y el tutor me preguntó sobre la justificación geométrica mediante el teorema del emparedado (o del encaje) de por qué lim(x->0) [sin(x)/x] = 1. ¿Alguien podría explicarme la relación con las áreas del círculo trigonométrico?',
      codeSnippet: `lim (x -> 0) [ sin(x) / x ] = 1
// Teorema del encaje: cos(x) <= sin(x)/x <= 1`,
      tags: ['calculo', 'limites', 'trigonometria'],
      authorId: 'usr-ana-01',
      authorName: 'Ana Martínez',
      authorRole: 'Estudiante Solicitante',
      authorProgram: 'Ingeniería de Sistemas',
      authorCead: 'JAG Bogotá',
      authorPoints: 25,
      createdAt: Date.now() - 3600000 * 26, // Hace 1 día
      status: 'Resuelta',
      answers: [
        {
          id: 'ans-102',
          questionId: 'duda-003',
          authorId: 'usr-laura-03',
          authorName: 'Laura Gómez',
          authorRole: 'Tutor Par',
          authorLevel: 'Plata',
          authorPoints: 85,
          content: '¡Hola Ana! La demostración se basa en comparar tres áreas en el círculo unitario para un ángulo x en radianes (0 < x < π/2):\n1. Área del triángulo menor: (1/2)*sin(x)\n2. Área del sector circular: (1/2)*x\n3. Área del triángulo mayor: (1/2)*tan(x)\n\nDividiendo entre (1/2)*sin(x) obtenemos: 1 <= x/sin(x) <= 1/cos(x). Al invertir e invertir el orden: cos(x) <= sin(x)/x <= 1. Como lim cos(x) = 1 cuando x->0, por teorema del emparedado el límite central es obligatoriamente 1.',
          codeSnippet: `Áreas: Triángulo_in <= Sector <= Triángulo_ext
(1/2)sin(x) <= (1/2)x <= (1/2)tan(x)
Invertir: cos(x) <= sin(x)/x <= 1
Por Sandwich: lim(x->0) = 1`,
          createdAt: Date.now() - 3600000 * 24,
          isAccepted: true,
          ratingStars: 5
        }
      ]
    },
    {
      id: 'duda-004',
      title: 'Multiplicación de matrices 3x3 y propiedades de la transpuesta',
      subject: 'Álgebra Lineal',
      description: 'Compañeros, ¿es verdad que (A * B)^T = A^T * B^T o el orden de los factores se invierte? Tengo un ejercicio práctico de la unidad 2 donde los resultados no me coinciden al aplicar la propiedad traspuesta.',
      codeSnippet: `// Duda conceptual:
(A * B)^T = ¿ B^T * A^T  ó  A^T * B^T ?`,
      tags: ['algebra', 'matrices', 'propiedades'],
      authorId: 'usr-ana-01',
      authorName: 'Ana Martínez',
      authorRole: 'Estudiante Solicitante',
      authorProgram: 'Ingeniería de Sistemas',
      authorCead: 'JAG Bogotá',
      authorPoints: 25,
      createdAt: Date.now() - 3600000 * 10,
      status: 'Abierta',
      answers: [
        {
          id: 'ans-103',
          questionId: 'duda-004',
          authorId: 'usr-juan-02',
          authorName: 'Juan Camilo Ramírez',
          authorRole: 'Tutor Par',
          authorLevel: 'Oro',
          authorPoints: 120,
          content: '¡Atención con eso! El orden de los factores SIEMPRE se invierte en la transpuesta del producto. La propiedad formal es: (A * B)^T = B^T * A^T. Si mantienes el orden original, las dimensiones ni siquiera coincidirían salvo matrices cuadradas simétricas.',
          codeSnippet: `// Propiedad correcta:
(A * B)^T = B^T * A^T`,
          createdAt: Date.now() - 3600000 * 9,
          isAccepted: false
        }
      ]
    }
  ];

  const SEED_CHATS = {
    'chat-usr-ana-01-usr-juan-02': [
      {
        senderId: 'usr-ana-01',
        senderName: 'Ana Martínez',
        text: '¡Hola Juan Camilo! Muchas gracias por resolver mi duda de JavaScript en el muro.',
        time: '10:30 AM',
        timestamp: Date.now() - 3600000 * 3
      },
      {
        senderId: 'usr-juan-02',
        senderName: 'Juan Camilo Ramírez',
        text: '¡Con todo gusto Ana! Recuerda que en la UNAD aprendemos juntos. ¿Tienes alguna otra duda con arreglos o programación funcional?',
        time: '10:32 AM',
        timestamp: Date.now() - 3600000 * 3 + 120000
      }
    ]
  };

  // ==========================================================================
  // 3. MOTOR DE ESTADO Y PERSISTENCIA (STATE STORE)
  // ==========================================================================
  const State = {
    users: [],
    currentUser: null,
    questions: [],
    chats: {},

    // Filtros activos en el muro
    filters: {
      searchTerm: '',
      subject: 'all',
      status: 'all',
      selectedTag: '',
      sortBy: 'recent'
    },

    // Estado del modal de chat activo
    activeChat: {
      partnerId: null,
      partnerName: null,
      partnerRole: null,
      subjectContext: null
    },

    // Duda abierta en detalle
    currentDetailQuestionId: null,

    // Inicializador del almacén
    init() {
      // 1. Usuarios
      const rawUsers = localStorage.getItem(STORAGE_KEYS.USERS);
      if (!rawUsers) {
        this.users = [...SEED_USERS];
        this.saveUsers();
      } else {
        try {
          this.users = JSON.parse(rawUsers);
        } catch (e) {
          this.users = [...SEED_USERS];
        }
      }

      // 2. Usuario activo
      const rawCurrentUser = localStorage.getItem(STORAGE_KEYS.CURRENT_USER);
      if (!rawCurrentUser) {
        this.currentUser = this.users[0]; // Ana Martínez por defecto
        this.saveCurrentUser();
      } else {
        try {
          const parsed = JSON.parse(rawCurrentUser);
          // Validar que el usuario aún exista en la lista
          const found = this.users.find(u => u.id === parsed.id);
          this.currentUser = found || this.users[0];
        } catch (e) {
          this.currentUser = this.users[0];
        }
      }

      // 3. Dudas
      const rawQuestions = localStorage.getItem(STORAGE_KEYS.QUESTIONS);
      if (!rawQuestions) {
        this.questions = [...SEED_QUESTIONS];
        this.saveQuestions();
      } else {
        try {
          this.questions = JSON.parse(rawQuestions);
        } catch (e) {
          this.questions = [...SEED_QUESTIONS];
        }
      }

      // 4. Chats
      const rawChats = localStorage.getItem(STORAGE_KEYS.CHATS);
      if (!rawChats) {
        this.chats = { ...SEED_CHATS };
        this.saveChats();
      } else {
        try {
          this.chats = JSON.parse(rawChats);
        } catch (e) {
          this.chats = { ...SEED_CHATS };
        }
      }
    },

    saveUsers() {
      localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(this.users));
    },

    saveCurrentUser() {
      localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(this.currentUser));
    },

    saveQuestions() {
      localStorage.setItem(STORAGE_KEYS.QUESTIONS, JSON.stringify(this.questions));
    },

    deleteQuestion(questionId) {
      this.questions = this.questions.filter(q => q.id !== questionId);
      this.saveQuestions();
    },

    saveChats() {
      localStorage.setItem(STORAGE_KEYS.CHATS, JSON.stringify(this.chats));
    },

    switchUser(userId) {
      const user = this.users.find(u => u.id === userId);
      if (user) {
        this.currentUser = user;
        this.saveCurrentUser();
        return true;
      }
      return false;
    },

    getUserById(userId) {
      return this.users.find(u => u.id === userId) || null;
    }
  };

  // ==========================================================================
  // 4. LÓGICA DE GAMIFICACIÓN Y REPUTACIÓN (RF05 / RF07)
  // ==========================================================================
  const Gamification = {
    /**
     * Calcula nivel, barra de progreso y umbrales
     */
    calculateLevel(points) {
      const safePoints = Math.max(0, points || 0);
      if (safePoints >= 100) {
        return {
          level: 'Oro',
          badgeName: 'Tutor Nivel Oro',
          min: 100,
          max: Infinity,
          nextThreshold: 100,
          progressPct: 100,
          color: '#F4A900',
          badgeClass: 'badge-oro'
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
          color: '#A0AAB2',
          badgeClass: 'badge-plata'
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
        color: '#0083B0',
        badgeClass: 'badge-novato'
      };
    },

    /**
     * Revisa e inserta insignias dinámicas según logros
     */
    updateBadges(user) {
      if (!user.badges) user.badges = [];
      const badgesSet = new Set(user.badges);

      if (user.points >= 100) {
        badgesSet.add('Top Tutor 2026');
      }
      if (user.solvedCount >= 5) {
        badgesSet.add('Especialista ECBTI');
      }
      if (user.ratingAvg >= 4.7 && user.ratingsCount >= 3) {
        badgesSet.add('Respuesta Rápida');
      }
      if (user.solvedCount >= 1) {
        badgesSet.add('Mentor Solidario');
      }

      user.badges = Array.from(badgesSet);
    },

    /**
     * Incrementa la reputación al aceptar respuesta y calificarla
     */
    awardSolution(tutorId, ratingStars) {
      const tutor = State.getUserById(tutorId);
      if (!tutor) return;

      // +10 por respuesta útil aceptada
      let pointsToAdd = 10;
      // +5 extra si es calificado con 5 estrellas
      if (ratingStars === 5) {
        pointsToAdd += 5;
      }

      tutor.points += pointsToAdd;
      tutor.solvedCount = (tutor.solvedCount || 0) + 1;

      // Recalcular promedio de estrellas
      const prevTotal = (tutor.ratingAvg || 5) * (tutor.ratingsCount || 0);
      tutor.ratingsCount = (tutor.ratingsCount || 0) + 1;
      tutor.ratingAvg = parseFloat(((prevTotal + ratingStars) / tutor.ratingsCount).toFixed(1));

      // Actualizar insignias
      this.updateBadges(tutor);
      State.saveUsers();

      // Si el tutor premiado es el usuario actual, actualizar la sesión
      if (State.currentUser && State.currentUser.id === tutor.id) {
        State.currentUser = tutor;
        State.saveCurrentUser();
      }
    }
  };

  // ==========================================================================
  // 5. UTILIDADES AUXILIARES (FECHAS, ESCAPE, CHIPS)
  // ==========================================================================
  const Utils = {
    escapeHTML(str) {
      if (!str) return '';
      return String(str)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;');
    },

    formatRelativeTime(timestamp) {
      const diffSec = Math.floor((Date.now() - timestamp) / 1000);
      if (diffSec < 60) return 'Hace un momento';
      const diffMin = Math.floor(diffSec / 60);
      if (diffMin < 60) return `Hace ${diffMin} min`;
      const diffHours = Math.floor(diffMin / 60);
      if (diffHours < 24) return `Hace ${diffHours} h`;
      const diffDays = Math.floor(diffHours / 24);
      if (diffDays === 1) return 'Ayer';
      if (diffDays < 7) return `Hace ${diffDays} días`;
      const date = new Date(timestamp);
      return date.toLocaleDateString('es-CO', { day: '2-digit', month: 'short' });
    },

    getInitials(name) {
      if (!name) return 'UN';
      const parts = name.trim().split(/\s+/);
      if (parts.length === 1) return parts[0].substring(0, 2).toUpperCase();
      return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
    },

    showToast(message, type = 'info') {
      const container = document.getElementById('toastNotifications');
      if (!container) return;
      const toast = document.createElement('div');
      toast.className = `toast-item ${type}`;
      toast.innerHTML = `
        <span style="font-size: 1.1rem;">${type === 'success' ? '✓' : type === 'gold' ? '★' : 'ℹ'}</span>
        <span>${message}</span>
      `;
      container.appendChild(toast);
      setTimeout(() => {
        toast.style.opacity = '0';
        toast.style.transform = 'translateX(20px)';
        toast.style.transition = 'all 0.3s ease';
        setTimeout(() => toast.remove(), 300);
      }, 4000);
    }
  };

  // ==========================================================================
  // 6. RENDERIZADORES DE LA INTERFAZ
  // ==========================================================================
  const UI = {
    /**
     * Elimina una duda académica con confirmación de usuario
     */
    confirmAndDeleteQuestion(questionId, questionTitle) {
      const confirmDelete = window.confirm(
        `¿Estás seguro de que deseas eliminar esta duda académica?\n\n"${questionTitle || 'Consulta'}"\n\nEsta acción quitará la publicación del muro de la UNAD y actualizará los registros.`
      );
      if (!confirmDelete) return;

      State.deleteQuestion(questionId);

      // Si el modal de detalle está abierto para esta duda, cerrarlo
      if (State.currentDetailQuestionId === questionId) {
        Modals.closeModal('detailModal');
        State.currentDetailQuestionId = null;
      }

      this.renderQuestionsWall();
      this.renderAnalyticsView();
      Utils.showToast('✓ Duda académica eliminada con éxito del muro.', 'success');
    },

    /**
     * Actualiza el widget superior del usuario activo en la barra de navegación
     */
    renderCurrentUserWidget() {
      const u = State.currentUser;
      const btn = document.getElementById('userSwitchBtn');
      const avatarEl = document.getElementById('headerUserAvatar');
      const nameEl = document.getElementById('headerUserName');
      const roleEl = document.getElementById('headerUserRole');

      if (!u || !btn) return;

      avatarEl.textContent = Utils.getInitials(u.name);
      avatarEl.style.backgroundColor = u.avatarBg || '#002B49';
      nameEl.textContent = u.name;

      if (u.role === 'Tutor Par') {
        const levelInfo = Gamification.calculateLevel(u.points);
        roleEl.textContent = `${levelInfo.badgeName} (${u.points} pts)`;
        roleEl.style.color = '#F4A900';
      } else {
        roleEl.textContent = 'Estudiante Solicitante';
        roleEl.style.color = '#D1D5DB';
      }

      this.renderUserDropdownItems();
    },

    /**
     * Renderiza la lista del menú desplegable para cambiar de usuario
     */
    renderUserDropdownItems() {
      const container = document.getElementById('userDropdownList');
      if (!container) return;
      container.innerHTML = '';

      State.users.forEach(user => {
        const isCurrent = State.currentUser && State.currentUser.id === user.id;
        const levelInfo = user.role === 'Tutor Par' ? Gamification.calculateLevel(user.points) : null;

        const item = document.createElement('button');
        item.type = 'button';
        item.className = `user-switch-item ${isCurrent ? 'active-user' : ''}`;
        item.innerHTML = `
          <div class="user-avatar-circle" style="background-color: ${user.avatarBg || '#002B49'}">
            ${Utils.getInitials(user.name)}
          </div>
          <div class="user-item-info">
            <div class="user-item-name">
              <span>${Utils.escapeHTML(user.name)}</span>
              ${isCurrent ? '<span style="color: #0083B0; font-size: 0.75rem;">✓ Activo</span>' : ''}
            </div>
            <div class="user-item-meta">
              ${user.role === 'Tutor Par' ? `<span class="user-badge-level ${levelInfo.badgeClass}">${levelInfo.level} - ${user.points} pts</span>` : '<span class="user-badge-level badge-solicitante">Solicitante</span>'}
              · ${Utils.escapeHTML(user.cead)}
            </div>
          </div>
        `;

        item.addEventListener('click', () => {
          State.switchUser(user.id);
          UI.renderCurrentUserWidget();
          UI.renderAll();
          document.getElementById('userDropdownMenu').classList.remove('show');
          Utils.showToast(`Has cambiado a la sesión de: ${user.name}`, 'info');
        });

        container.appendChild(item);
      });
    },

    /**
     * RF02 / RF03: Renderiza el Muro de Dudas aplicando filtros y ordenamiento
     */
    renderQuestionsWall() {
      const grid = document.getElementById('questionsGrid');
      const countBadge = document.getElementById('wallCountBadge');
      const activeTagIndicator = document.getElementById('activeTagIndicator');
      const activeTagName = document.getElementById('activeTagName');

      if (!grid) return;

      // Actualizar tag activo en la barra de filtros
      if (State.filters.selectedTag) {
        activeTagIndicator.classList.add('show');
        activeTagName.textContent = `#${State.filters.selectedTag}`;
      } else {
        activeTagIndicator.classList.remove('show');
      }

      // Algoritmo de filtrado reactivo
      const term = (State.filters.searchTerm || '').trim().toLowerCase();
      const subject = State.filters.subject;
      const status = State.filters.status;
      const tag = (State.filters.selectedTag || '').trim().toLowerCase();

      let list = State.questions.filter(q => {
        // Término de búsqueda
        if (term) {
          const mTitle = q.title.toLowerCase().includes(term);
          const mDesc = q.description.toLowerCase().includes(term);
          const mAuthor = q.authorName.toLowerCase().includes(term);
          const mSubject = q.subject.toLowerCase().includes(term);
          const mTags = q.tags.some(t => t.toLowerCase().includes(term));
          if (!mTitle && !mDesc && !mAuthor && !mSubject && !mTags) return false;
        }

        // Materia
        if (subject !== 'all' && q.subject.toLowerCase() !== subject.toLowerCase()) {
          return false;
        }

        // Tag temático
        if (tag && !q.tags.some(t => t.toLowerCase() === tag)) {
          return false;
        }

        // Estado
        if (status === 'unanswered' && q.answers.length > 0) return false;
        if (status === 'resolved' && q.status !== 'Resuelta') return false;
        if (status === 'my-subjects') {
          // Dudas publicadas por el usuario actual o que correspondan a su programa/materias
          if (q.authorId !== State.currentUser.id) return false;
        }

        return true;
      });

      // Ordenamiento dinámico
      list.sort((a, b) => {
        if (State.filters.sortBy === 'reputation') {
          return (b.authorPoints || 0) - (a.authorPoints || 0);
        }
        if (State.filters.sortBy === 'answers') {
          return b.answers.length - a.answers.length;
        }
        return b.createdAt - a.createdAt; // recent por defecto
      });

      if (countBadge) countBadge.textContent = `${list.length} ${list.length === 1 ? 'duda' : 'dudas'}`;

      if (list.length === 0) {
        grid.innerHTML = `
          <div class="empty-wall-state">
            <div class="empty-wall-icon">🔍</div>
            <div class="empty-wall-title">No se encontraron dudas con estos criterios</div>
            <div class="empty-wall-desc">Intenta cambiando el término de búsqueda o limpiando los filtros seleccionados para ver más publicaciones académicas de la ECBTI.</div>
            <button class="btn-unad-orange" id="btnResetFilters">Limpiar Todos los Filtros</button>
          </div>
        `;
        const resetBtn = document.getElementById('btnResetFilters');
        if (resetBtn) {
          resetBtn.addEventListener('click', () => {
            State.filters.searchTerm = '';
            State.filters.subject = 'all';
            State.filters.status = 'all';
            State.filters.selectedTag = '';
            document.getElementById('searchInput').value = '';
            document.getElementById('subjectFilterSelect').value = 'all';
            document.querySelectorAll('.chip-status-btn').forEach(b => b.classList.remove('active'));
            document.querySelector('.chip-status-btn[data-status="all"]')?.classList.add('active');
            UI.renderQuestionsWall();
          });
        }
        return;
      }

      grid.innerHTML = '';
      list.forEach(q => {
        const isResolved = q.status === 'Resuelta';
        const card = document.createElement('article');
        card.className = `question-card ${isResolved ? 'resolved-card' : 'open-card'}`;

        const tagsHtml = q.tags.map(t => `<span class="tag-chip" data-tag="${Utils.escapeHTML(t)}">#${Utils.escapeHTML(t)}</span>`).join('');
        const codeHtml = q.codeSnippet ? `<pre class="code-preview-snippet"><code>${Utils.escapeHTML(q.codeSnippet)}</code></pre>` : '';

        card.innerHTML = `
          <div>
            <div class="card-top-row">
              <span class="subject-badge">${Utils.escapeHTML(q.subject)}</span>
              <span class="status-badge ${isResolved ? 'resolved' : 'open'}">
                <span class="status-dot"></span>
                ${isResolved ? 'Resuelta' : 'Abierta'}
              </span>
            </div>

            <h3 class="question-title" data-qid="${q.id}">${Utils.escapeHTML(q.title)}</h3>
            <p class="question-snippet">${Utils.escapeHTML(q.description)}</p>
            ${codeHtml}
            <div class="question-tags-container">${tagsHtml}</div>
          </div>

          <div>
            <div class="card-author-row">
              <div class="author-meta">
                <div class="author-avatar-sm">${Utils.getInitials(q.authorName)}</div>
                <div class="author-text-info">
                  <div class="author-name-text">${Utils.escapeHTML(q.authorName)}</div>
                  <div class="author-sub-text">${Utils.escapeHTML(q.authorProgram)} · ${Utils.escapeHTML(q.authorCead)}</div>
                </div>
              </div>
              <div style="font-size: 0.72rem; color: var(--unad-text-muted); text-align: right;">
                ${Utils.formatRelativeTime(q.createdAt)}
              </div>
            </div>

            <div class="card-actions-row">
              <button class="btn-card-action" data-action="view-detail" data-qid="${q.id}">
                💬 Ver Respuestas (${q.answers.length})
              </button>
              <button class="btn-card-chat" data-action="open-chat" data-authorid="${q.authorId}" data-authorname="${Utils.escapeHTML(q.authorName)}" data-authorsubject="${Utils.escapeHTML(q.subject)}" title="Abrir chat directo con el estudiante o tutor">
                ✉ Chat
              </button>
              <button class="btn-card-delete" data-action="delete-card-question" data-qid="${q.id}" title="Eliminar esta duda académica">
                🗑️ Eliminar
              </button>
            </div>
          </div>
        `;

        // Eventos en tags para filtrar
        card.querySelectorAll('.tag-chip').forEach(chip => {
          chip.addEventListener('click', (e) => {
            e.stopPropagation();
            State.filters.selectedTag = chip.getAttribute('data-tag');
            UI.renderQuestionsWall();
          });
        });

        // Evento ver detalle
        card.querySelector('.question-title').addEventListener('click', () => {
          Modals.openDetailModal(q.id);
        });

        card.querySelector('[data-action="view-detail"]').addEventListener('click', () => {
          Modals.openDetailModal(q.id);
        });

        // Evento abrir chat
        card.querySelector('[data-action="open-chat"]').addEventListener('click', () => {
          Modals.openChatModal(q.authorId, q.authorName, 'Estudiante', q.subject);
        });

        // Evento eliminar duda
        card.querySelector('[data-action="delete-card-question"]')?.addEventListener('click', (e) => {
          e.stopPropagation();
          UI.confirmAndDeleteQuestion(q.id, q.title);
        });

        grid.appendChild(card);
      });
    },

    /**
     * RF05 / RF07: Renderiza la sección de Gamificación y Perfil de Tutor
     */
    renderGamificationView() {
      const currentUser = State.currentUser;
      const isTutor = currentUser.role === 'Tutor Par';

      // 1. Perfil del tutor actual o del tutor destacado
      const tutorDisplay = isTutor ? currentUser : (State.users.find(u => u.role === 'Tutor Par') || currentUser);
      const levelInfo = Gamification.calculateLevel(tutorDisplay.points);

      const avatarEl = document.getElementById('gamifProfileAvatar');
      const nameEl = document.getElementById('gamifProfileName');
      const programEl = document.getElementById('gamifProfileProgram');
      const badgeNameEl = document.getElementById('gamifLevelBadgeName');
      const pointsTextEl = document.getElementById('gamifPointsText');
      const progressFill = document.getElementById('gamifProgressBarFill');
      const statSolvedEl = document.getElementById('gamifStatSolved');
      const statRatingEl = document.getElementById('gamifStatRating');

      if (avatarEl) {
        avatarEl.textContent = Utils.getInitials(tutorDisplay.name);
        avatarEl.style.backgroundColor = tutorDisplay.avatarBg || '#002B49';
      }
      if (nameEl) nameEl.textContent = tutorDisplay.name;
      if (programEl) programEl.textContent = `${tutorDisplay.role} · ${tutorDisplay.program} (${tutorDisplay.cead})`;
      if (badgeNameEl) {
        badgeNameEl.textContent = `Nivel ${levelInfo.level}`;
        badgeNameEl.style.color = levelInfo.color;
      }
      if (pointsTextEl) {
        pointsTextEl.textContent = `${tutorDisplay.points} pts acumulados`;
      }
      if (progressFill) {
        progressFill.style.width = `${levelInfo.progressPct}%`;
      }
      if (statSolvedEl) statSolvedEl.textContent = tutorDisplay.solvedCount || 0;
      if (statRatingEl) statRatingEl.textContent = `${tutorDisplay.ratingAvg || '5.0'} ★`;

      // 2. Insignias desbloqueables
      const badgesContainer = document.getElementById('badgesGridContainer');
      if (badgesContainer) {
        const ALL_BADGES = [
          { name: 'Top Tutor 2026', icon: '🏆', desc: 'Alcanzar el Nivel Oro con más de 100 puntos de reputación en la plataforma.' },
          { name: 'Especialista ECBTI', icon: '⭐', desc: 'Resolver con éxito 5 o más dudas con solución aceptada por compañeros.' },
          { name: 'Respuesta Rápida', icon: '⚡', desc: 'Mantener un promedio de satisfacción pedagógica superior a 4.7 estrellas.' },
          { name: 'Mentor Solidario', icon: '🤝', desc: 'Participar activamente brindando orientación académica a estudiantes nuevos.' }
        ];

        badgesContainer.innerHTML = ALL_BADGES.map(b => {
          const isUnlocked = tutorDisplay.badges && tutorDisplay.badges.includes(b.name);
          return `
            <div class="badge-item-card ${isUnlocked ? 'unlocked' : ''}">
              <div class="badge-item-icon">${b.icon}</div>
              <div class="badge-item-name">${b.name}</div>
              <div class="badge-item-desc">${b.desc}</div>
              <span style="font-size: 0.68rem; font-weight: 700; color: ${isUnlocked ? '#16A34A' : '#94A3B8'};">
                ${isUnlocked ? '✓ Desbloqueada' : '🔒 Bloqueada'}
              </span>
            </div>
          `;
        }).join('');
      }

      // 3. Tabla Leaderboard
      const leaderboardTbody = document.getElementById('leaderboardTbody');
      if (leaderboardTbody) {
        const tutors = State.users.filter(u => u.role === 'Tutor Par');
        tutors.sort((a, b) => b.points - a.points);

        leaderboardTbody.innerHTML = '';
        tutors.forEach((tutor, idx) => {
          const lvl = Gamification.calculateLevel(tutor.points);
          const tr = document.createElement('tr');

          let rankBadge = `${idx + 1}`;
          if (idx === 0) rankBadge = `<span class="rank-badge-podium rank-1">🥇 1</span>`;
          else if (idx === 1) rankBadge = `<span class="rank-badge-podium rank-2">🥈 2</span>`;
          else if (idx === 2) rankBadge = `<span class="rank-badge-podium rank-3">🥉 3</span>`;

          tr.innerHTML = `
            <td class="rank-cell">${rankBadge}</td>
            <td>
              <div class="tutor-table-info">
                <div class="author-avatar-sm" style="background-color: ${tutor.avatarBg || '#002B49'}">
                  ${Utils.getInitials(tutor.name)}
                </div>
                <div>
                  <div style="font-weight: 700; color: var(--unad-primary);">${Utils.escapeHTML(tutor.name)}</div>
                  <div style="font-size: 0.72rem; color: var(--unad-text-muted);">${Utils.escapeHTML(tutor.program)} · ${Utils.escapeHTML(tutor.cead)}</div>
                </div>
              </div>
            </td>
            <td>
              <span class="user-badge-level ${lvl.badgeClass}">${lvl.level}</span>
            </td>
            <td>
              <span style="font-weight: 800; color: var(--unad-primary);">${tutor.points}</span> pts
            </td>
            <td>
              <span style="color: #F59E0B; font-weight: 700;">★ ${tutor.ratingAvg || '5.0'}</span>
              <span style="font-size: 0.72rem; color: var(--unad-text-muted);">(${tutor.ratingsCount || 0})</span>
            </td>
            <td>
              <span style="font-weight: 700; color: #10B981;">${tutor.solvedCount || 0}</span> resueltas
            </td>
            <td>
              <button class="btn-card-chat" data-action="chat-tutor" data-tutorid="${tutor.id}" data-tutorname="${Utils.escapeHTML(tutor.name)}" style="padding: 0.35rem 0.75rem; font-size: 0.75rem;">
                ✉ Solicitar Tutoría
              </button>
            </td>
          `;

          tr.querySelector('[data-action="chat-tutor"]').addEventListener('click', () => {
            Modals.openChatModal(tutor.id, tutor.name, 'Tutor Par', 'Tutoría Académica Personalizada');
          });

          leaderboardTbody.appendChild(tr);
        });
      }
    },

    /**
     * RF08: Renderiza el Panel de Analítica y Estadísticas del Proyecto de Grado
     */
    renderAnalyticsView() {
      const totalQuestions = State.questions.length;
      const resolvedQuestions = State.questions.filter(q => q.status === 'Resuelta').length;
      const unansweredQuestions = State.questions.filter(q => q.answers.length === 0).length;
      const totalAnswers = State.questions.reduce((acc, q) => acc + q.answers.length, 0);
      const resolutionRatePct = totalQuestions > 0 ? Math.round((resolvedQuestions / totalQuestions) * 100) : 0;

      // KPI Elements
      const elTotal = document.getElementById('kpiTotalQuestions');
      const elRate = document.getElementById('kpiResolutionRate');
      const elUnanswered = document.getElementById('kpiUnanswered');
      const elAnswers = document.getElementById('kpiTotalAnswers');
      const elTopTutor = document.getElementById('kpiTopTutor');

      if (elTotal) elTotal.textContent = totalQuestions;
      if (elRate) elRate.textContent = `${resolutionRatePct}%`;
      if (elUnanswered) elUnanswered.textContent = unansweredQuestions;
      if (elAnswers) elAnswers.textContent = totalAnswers;

      // Tutor con mayor reputación
      const tutors = State.users.filter(u => u.role === 'Tutor Par').sort((a, b) => b.points - a.points);
      const topTutor = tutors[0];
      if (elTopTutor && topTutor) {
        elTopTutor.textContent = `${topTutor.name} (${topTutor.points} pts)`;
      }

      // Pareto de Materias más consultadas
      const paretoContainer = document.getElementById('paretoBarsList');
      if (paretoContainer) {
        const countsBySubject = {};
        State.questions.forEach(q => {
          countsBySubject[q.subject] = (countsBySubject[q.subject] || 0) + 1;
        });

        const sortedSubjects = Object.entries(countsBySubject)
          .map(([subject, count]) => ({
            subject,
            count,
            pct: totalQuestions > 0 ? Math.round((count / totalQuestions) * 100) : 0
          }))
          .sort((a, b) => b.count - a.count);

        paretoContainer.innerHTML = sortedSubjects.map(item => `
          <div class="pareto-bar-item">
            <div class="pareto-label-row">
              <span style="color: var(--unad-primary);">${Utils.escapeHTML(item.subject)}</span>
              <span><strong>${item.count}</strong> dudas (${item.pct}%)</span>
            </div>
            <div class="pareto-track">
              <div class="pareto-fill" style="width: ${item.pct}%;"></div>
            </div>
          </div>
        `).join('');
      }

      // Distribución por CEADs
      const ceadContainer = document.getElementById('ceadBarsList');
      if (ceadContainer) {
        const countsByCead = {};
        State.questions.forEach(q => {
          const cead = q.authorCead || 'JAG Bogotá';
          countsByCead[cead] = (countsByCead[cead] || 0) + 1;
        });

        const sortedCeads = Object.entries(countsByCead)
          .map(([cead, count]) => ({
            cead,
            count,
            pct: totalQuestions > 0 ? Math.round((count / totalQuestions) * 100) : 0
          }))
          .sort((a, b) => b.count - a.count);

        ceadContainer.innerHTML = sortedCeads.map(item => `
          <div class="pareto-bar-item">
            <div class="pareto-label-row">
              <span style="color: var(--unad-primary);">${Utils.escapeHTML(item.cead)}</span>
              <span><strong>${item.count}</strong> registros (${item.pct}%)</span>
            </div>
            <div class="pareto-track">
              <div class="pareto-fill" style="width: ${item.pct}%; background: linear-gradient(90deg, #E87722 0%, #F4A900 100%);"></div>
            </div>
          </div>
        `).join('');
      }
    },

    renderAll() {
      this.renderQuestionsWall();
      this.renderGamificationView();
      this.renderAnalyticsView();
    }
  };

  // ==========================================================================
  // 7. GESTIÓN DE VENTANAS MODALES
  // ==========================================================================
  const Modals = {
    // Listado de tags temporales para nueva publicación
    currentNewTags: ['programacion'],

    init() {
      this.bindPublishModal();
      this.bindDetailModal();
      this.bindChatModal();
      this.bindRegisterModal();
    },

    openModal(modalId) {
      const modal = document.getElementById(modalId);
      if (modal) modal.classList.add('open');
    },

    closeModal(modalId) {
      const modal = document.getElementById(modalId);
      if (modal) modal.classList.remove('open');
    },

    // ------------------------------------------------------------------------
    // Modal 1: Publicar Duda (RF02 / RF04)
    // ------------------------------------------------------------------------
    bindPublishModal() {
      const modal = document.getElementById('publishModal');
      const openBtn = document.getElementById('btnOpenPublishModal');
      const closeBtn = document.getElementById('btnClosePublishModal');
      const cancelBtn = document.getElementById('btnCancelPublish');
      const form = document.getElementById('publishQuestionForm');
      const tagInput = document.getElementById('publishTagInput');
      const tagsContainer = document.getElementById('publishTagsList');

      if (openBtn) openBtn.addEventListener('click', () => {
        this.currentNewTags = ['duda-unad'];
        this.renderPublishTagChips();
        this.openModal('publishModal');
      });

      if (closeBtn) closeBtn.addEventListener('click', () => this.closeModal('publishModal'));
      if (cancelBtn) cancelBtn.addEventListener('click', () => this.closeModal('publishModal'));

      // Manejo de chips interactivos de tags
      if (tagInput) {
        tagInput.addEventListener('keydown', (e) => {
          if (e.key === 'Enter' || e.key === ',') {
            e.preventDefault();
            const val = tagInput.value.trim().toLowerCase().replace(/^#+/, '');
            if (val && !this.currentNewTags.includes(val)) {
              this.currentNewTags.push(val);
              this.renderPublishTagChips();
            }
            tagInput.value = '';
          }
        });
      }

      // Sugerencias rápidas de tags
      document.querySelectorAll('.btn-quick-tag').forEach(btn => {
        btn.addEventListener('click', () => {
          const t = btn.getAttribute('data-tag');
          if (t && !this.currentNewTags.includes(t)) {
            this.currentNewTags.push(t);
            this.renderPublishTagChips();
          }
        });
      });

      // Envío del formulario de publicación
      if (form) {
        form.addEventListener('submit', (e) => {
          e.preventDefault();
          const subject = document.getElementById('publishSubject').value;
          const title = document.getElementById('publishTitle').value.trim();
          const description = document.getElementById('publishDescription').value.trim();
          const codeSnippet = document.getElementById('publishCode').value.trim();

          if (!title || title.length < 8) {
            Utils.showToast('El título debe tener al menos 8 caracteres explicativos.', 'warning');
            return;
          }
          if (!description || description.length < 15) {
            Utils.showToast('La descripción debe detallar tu consulta con al menos 15 caracteres.', 'warning');
            return;
          }

          const newQuestion = {
            id: `duda-${Date.now()}`,
            title,
            subject,
            description,
            codeSnippet: codeSnippet || null,
            tags: this.currentNewTags.length > 0 ? [...this.currentNewTags] : ['consulta'],
            authorId: State.currentUser.id,
            authorName: State.currentUser.name,
            authorRole: State.currentUser.role,
            authorProgram: State.currentUser.program,
            authorCead: State.currentUser.cead,
            authorPoints: State.currentUser.points,
            createdAt: Date.now(),
            status: 'Abierta',
            answers: []
          };

          State.questions.unshift(newQuestion);
          State.saveQuestions();

          form.reset();
          this.currentNewTags = [];
          this.closeModal('publishModal');
          UI.renderQuestionsWall();
          UI.renderAnalyticsView();

          Utils.showToast('¡Tu duda ha sido publicada con éxito en el muro UNAD!', 'success');
        });
      }
    },

    renderPublishTagChips() {
      const container = document.getElementById('publishTagsList');
      const input = document.getElementById('publishTagInput');
      if (!container || !input) return;

      container.querySelectorAll('.tag-chip-editable').forEach(el => el.remove());

      this.currentNewTags.forEach(t => {
        const chip = document.createElement('span');
        chip.className = 'tag-chip-editable';
        chip.innerHTML = `#${Utils.escapeHTML(t)} <button type="button" class="btn-remove-tag" data-tag="${t}">×</button>`;

        chip.querySelector('.btn-remove-tag').addEventListener('click', () => {
          this.currentNewTags = this.currentNewTags.filter(item => item !== t);
          this.renderPublishTagChips();
        });

        container.insertBefore(chip, input);
      });
    },

    // ------------------------------------------------------------------------
    // Modal 2: Detalle de Duda, Respuestas y Calificación (RF04 / RF05)
    // ------------------------------------------------------------------------
    bindDetailModal() {
      const closeBtn = document.getElementById('btnCloseDetailModal');
      const form = document.getElementById('answerQuestionForm');

      if (closeBtn) closeBtn.addEventListener('click', () => this.closeModal('detailModal'));

      if (form) {
        form.addEventListener('submit', (e) => {
          e.preventDefault();
          const qId = State.currentDetailQuestionId;
          const q = State.questions.find(item => item.id === qId);
          if (!q) return;

          const content = document.getElementById('answerContent').value.trim();
          const codeSnippet = document.getElementById('answerCode').value.trim();

          if (!content || content.length < 10) {
            Utils.showToast('Por favor escribe una explicación pedagógica clara (mínimo 10 caracteres).', 'warning');
            return;
          }

          const userLevel = State.currentUser.role === 'Tutor Par' ? Gamification.calculateLevel(State.currentUser.points).level : 'Estudiante';

          const newAnswer = {
            id: `ans-${Date.now()}`,
            questionId: q.id,
            authorId: State.currentUser.id,
            authorName: State.currentUser.name,
            authorRole: State.currentUser.role,
            authorLevel: userLevel,
            authorPoints: State.currentUser.points,
            content,
            codeSnippet: codeSnippet || null,
            createdAt: Date.now(),
            isAccepted: false
          };

          q.answers.push(newAnswer);
          State.saveQuestions();

          form.reset();
          this.renderDetailModalContent(q.id);
          UI.renderQuestionsWall();
          UI.renderAnalyticsView();

          Utils.showToast('¡Respuesta publicada con éxito! Gracias por tu colaboración pedagógica.', 'success');
        });
      }
    },

    openDetailModal(questionId) {
      State.currentDetailQuestionId = questionId;
      this.renderDetailModalContent(questionId);
      this.openModal('detailModal');
    },

    renderDetailModalContent(questionId) {
      const q = State.questions.find(item => item.id === questionId);
      const container = document.getElementById('detailQuestionContainer');
      const answersList = document.getElementById('detailAnswersList');
      const answersCountBadge = document.getElementById('detailAnswersCountBadge');

      if (!q || !container || !answersList) return;

      const isResolved = q.status === 'Resuelta';
      const isAuthor = State.currentUser && State.currentUser.id === q.authorId;

      // Renderizar datos de la duda
      const codeHtml = q.codeSnippet ? `<pre class="code-preview-snippet"><code>${Utils.escapeHTML(q.codeSnippet)}</code></pre>` : '';
      const tagsHtml = q.tags.map(t => `<span class="tag-chip">#${Utils.escapeHTML(t)}</span>`).join('');

      container.innerHTML = `
        <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 0.75rem; flex-wrap: wrap; gap: 0.5rem;">
          <div style="display: flex; align-items: center; gap: 0.5rem;">
            <span class="subject-badge">${Utils.escapeHTML(q.subject)}</span>
            <span class="status-badge ${isResolved ? 'resolved' : 'open'}">
              <span class="status-dot"></span>
              ${isResolved ? 'Duda Resuelta' : 'Pendiente de Respuesta'}
            </span>
          </div>
          <button type="button" class="btn-modal-delete" data-action="delete-modal-question" title="Eliminar esta consulta del muro">
            🗑️ Eliminar Duda
          </button>
        </div>

        <h2 style="font-size: 1.3rem; font-weight: 800; color: var(--unad-primary); margin-bottom: 0.6rem;">
          ${Utils.escapeHTML(q.title)}
        </h2>

        <p style="font-size: 0.94rem; line-height: 1.5; color: var(--unad-text-main); margin-bottom: 0.85rem;">
          ${Utils.escapeHTML(q.description)}
        </p>
        ${codeHtml}

        <div class="question-tags-container" style="margin-bottom: 0.75rem;">${tagsHtml}</div>

        <div style="display: flex; align-items: center; justify-content: space-between; padding-top: 0.6rem; border-top: 1px solid var(--unad-border); font-size: 0.78rem; color: var(--unad-text-muted);">
          <span>Por: <strong>${Utils.escapeHTML(q.authorName)}</strong> (${Utils.escapeHTML(q.authorProgram)})</span>
          <span>${Utils.formatRelativeTime(q.createdAt)}</span>
        </div>
      `;

      // Evento eliminar duda desde el modal de detalle
      container.querySelector('[data-action="delete-modal-question"]')?.addEventListener('click', () => {
        UI.confirmAndDeleteQuestion(q.id, q.title);
      });

      if (answersCountBadge) {
        answersCountBadge.textContent = `${q.answers.length} ${q.answers.length === 1 ? 'respuesta' : 'respuestas'}`;
      }

      // Renderizar lista de respuestas
      if (q.answers.length === 0) {
        answersList.innerHTML = `
          <div style="text-align: center; padding: 2rem 1rem; background: var(--unad-bg-light); border-radius: var(--radius-md); border: 1px dashed var(--unad-border);">
            <div style="font-size: 1.8rem; margin-bottom: 0.5rem;">💡</div>
            <div style="font-weight: 700; color: var(--unad-primary);">Esta duda aún no tiene respuestas</div>
            <div style="font-size: 0.82rem; color: var(--unad-text-muted);">¡Sé el primer tutor o compañero en orientar a este estudiante!</div>
          </div>
        `;
        return;
      }

      answersList.innerHTML = '';
      q.answers.forEach(ans => {
        const item = document.createElement('div');
        item.className = `answer-card-item ${ans.isAccepted ? 'accepted-answer' : ''}`;

        const codeSnippetHtml = ans.codeSnippet ? `<pre class="code-preview-snippet"><code>${Utils.escapeHTML(ans.codeSnippet)}</code></pre>` : '';
        const levelBadgeClass = ans.authorLevel === 'Oro' ? 'badge-oro' : ans.authorLevel === 'Plata' ? 'badge-plata' : 'badge-novato';

        let ratingBlock = '';
        if (ans.isAccepted) {
          const starsCount = ans.ratingStars || 5;
          const starsVisual = '★'.repeat(starsCount) + '☆'.repeat(5 - starsCount);
          ratingBlock = `
            <div style="margin-top: 0.6rem; font-size: 0.82rem; color: #D97706; font-weight: 700; display: flex; align-items: center; gap: 0.4rem;">
              <span>${starsVisual}</span>
              <span>(Calificación otorgada por el solicitante: ${starsCount}/5)</span>
            </div>
          `;
        }

        let acceptButtonBlock = '';
        // Si el usuario actual es el autor de la duda y la duda está abierta (o la respuesta no está aceptada)
        if (isAuthor && !ans.isAccepted) {
          acceptButtonBlock = `
            <div style="margin-top: 0.85rem; padding-top: 0.75rem; border-top: 1px solid var(--unad-border); display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 0.5rem;">
              <span style="font-size: 0.78rem; color: var(--unad-text-muted);">¿Esta respuesta resolvió tu duda?</span>
              <button class="btn-unad-orange" data-action="accept-solution" data-ansid="${ans.id}" style="padding: 0.4rem 0.85rem; font-size: 0.78rem;">
                ✓ Marcar como Respuesta Útil y Calificar
              </button>
            </div>
          `;
        }

        item.innerHTML = `
          ${ans.isAccepted ? '<div class="accepted-badge-ribbon">✓ Solución Aceptada por el Solicitante (+15 pts)</div>' : ''}
          <div class="answer-author-header">
            <div style="display: flex; align-items: center; gap: 0.6rem;">
              <div class="author-avatar-sm" style="background-color: var(--unad-secondary);">
                ${Utils.getInitials(ans.authorName)}
              </div>
              <div>
                <div style="font-weight: 700; font-size: 0.88rem; color: var(--unad-primary);">
                  ${Utils.escapeHTML(ans.authorName)}
                  <span class="user-badge-level ${levelBadgeClass}" style="margin-left: 0.35rem;">
                    ${Utils.escapeHTML(ans.authorRole)} (${ans.authorLevel})
                  </span>
                </div>
                <div style="font-size: 0.7rem; color: var(--unad-text-muted);">
                  ${Utils.formatRelativeTime(ans.createdAt)}
                </div>
              </div>
            </div>
          </div>

          <div class="answer-content-body">${Utils.escapeHTML(ans.content)}</div>
          ${codeSnippetHtml}
          ${ratingBlock}
          ${acceptButtonBlock}
        `;

        // Evento Aceptar Solución y Calificar
        const acceptBtn = item.querySelector('[data-action="accept-solution"]');
        if (acceptBtn) {
          acceptBtn.addEventListener('click', () => {
            this.promptRatingAndAcceptSolution(q, ans);
          });
        }

        answersList.appendChild(item);
      });
    },

    /**
     * RF05: Flujo de Aceptación de Solución con Calificación de 5 Estrellas
     */
    promptRatingAndAcceptSolution(question, answer) {
      // Calificación interactiva con 5 estrellas por defecto
      let chosenStars = 5;
      const confirmRating = window.confirm(
        `¿Deseas aceptar la solución de ${answer.authorName}?\n\n` +
        `Esto otorgará +10 puntos de reputación al tutor y +5 puntos adicionales si otorgas 5 estrellas.\n` +
        `Presiona Aceptar para calificar con 5 Estrellas (Excelente tutoría).`
      );

      if (!confirmRating) return;

      answer.isAccepted = true;
      answer.ratingStars = chosenStars;
      question.status = 'Resuelta';

      // Bonificación en el motor de gamificación
      Gamification.awardSolution(answer.authorId, chosenStars);

      State.saveQuestions();

      this.renderDetailModalContent(question.id);
      UI.renderQuestionsWall();
      UI.renderGamificationView();
      UI.renderAnalyticsView();

      Utils.showToast(
        `¡Solución aceptada con éxito! Se han sumado +15 puntos de reputación a ${answer.authorName}.`,
        'gold'
      );
    },

    // ------------------------------------------------------------------------
    // Modal 3: Chat Simulado en Tiempo Real entre Pares (RF06)
    // ------------------------------------------------------------------------
    bindChatModal() {
      const closeBtn = document.getElementById('btnCloseChatModal');
      const form = document.getElementById('chatInputForm');
      const input = document.getElementById('chatTextInput');

      if (closeBtn) closeBtn.addEventListener('click', () => this.closeModal('chatModal'));

      if (form) {
        form.addEventListener('submit', (e) => {
          e.preventDefault();
          const text = input.value.trim();
          if (!text) return;

          this.sendChatMessage(text);
          input.value = '';
        });
      }
    },

    getChatKey(u1Id, u2Id) {
      const ids = [u1Id, u2Id].sort();
      return `chat-${ids[0]}-${ids[1]}`;
    },

    openChatModal(partnerId, partnerName, partnerRole, subjectContext) {
      // Si intenta chatear consigo mismo, avisar amablemente
      if (partnerId === State.currentUser.id) {
        Utils.showToast('No puedes abrir un chat contigo mismo. Cambia de usuario en la barra superior para interactuar entre pares.', 'warning');
        return;
      }

      State.activeChat = {
        partnerId,
        partnerName,
        partnerRole: partnerRole || 'Tutor Par',
        subjectContext: subjectContext || 'Orientación Académica ECBTI'
      };

      const titleEl = document.getElementById('chatPartnerName');
      const roleEl = document.getElementById('chatPartnerRole');
      const avatarEl = document.getElementById('chatPartnerAvatar');

      if (titleEl) titleEl.textContent = partnerName;
      if (roleEl) roleEl.textContent = `${partnerRole} · ${subjectContext}`;
      if (avatarEl) avatarEl.textContent = Utils.getInitials(partnerName);

      this.renderChatMessages();
      this.openModal('chatModal');
    },

    renderChatMessages() {
      const container = document.getElementById('chatMessagesContainer');
      if (!container || !State.activeChat.partnerId) return;

      const chatKey = this.getChatKey(State.currentUser.id, State.activeChat.partnerId);
      const messages = State.chats[chatKey] || [];

      container.innerHTML = '';

      if (messages.length === 0) {
        container.innerHTML = `
          <div style="text-align: center; padding: 2rem 1rem; color: var(--unad-text-muted); font-size: 0.85rem;">
            <div style="font-size: 2rem; margin-bottom: 0.4rem;">💬</div>
            <strong>Canal de Tutoría Sincrónica UNAD</strong><br>
            Inicia la conversación académica sobre <em>${Utils.escapeHTML(State.activeChat.subjectContext || '')}</em>.
          </div>
        `;
      } else {
        messages.forEach(msg => {
          const isOutgoing = msg.senderId === State.currentUser.id;
          const bubble = document.createElement('div');
          bubble.className = `chat-bubble ${isOutgoing ? 'outgoing' : 'incoming'}`;
          bubble.innerHTML = `
            <div>${Utils.escapeHTML(msg.text)}</div>
            <span class="chat-time-tag">${msg.time || 'Ahora'}</span>
          `;
          container.appendChild(bubble);
        });
      }

      // Scroll automático al fondo
      container.scrollTop = container.scrollHeight;
    },

    sendChatMessage(text) {
      const chatKey = this.getChatKey(State.currentUser.id, State.activeChat.partnerId);
      if (!State.chats[chatKey]) State.chats[chatKey] = [];

      const now = new Date();
      const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

      // Mensaje del usuario
      const userMessage = {
        senderId: State.currentUser.id,
        senderName: State.currentUser.name,
        text,
        time: timeStr,
        timestamp: Date.now()
      };

      State.chats[chatKey].push(userMessage);
      State.saveChats();
      this.renderChatMessages();

      // RF06: Motor de simulación de respuesta automatizada inteligente
      this.simulatePartnerResponse(chatKey, text);
    },

    simulatePartnerResponse(chatKey, promptText) {
      const typingIndicator = document.getElementById('chatTypingIndicator');
      const partnerName = State.activeChat.partnerName || 'Tutor Par';
      const subject = (State.activeChat.subjectContext || '').toLowerCase();

      // 1. Mostrar estado "Escribiendo..." tras 1.2s
      setTimeout(() => {
        if (typingIndicator) typingIndicator.classList.add('show');
        const container = document.getElementById('chatMessagesContainer');
        if (container) container.scrollTop = container.scrollHeight;

        // 2. Enviar respuesta pedagógica tras 2.4s adicionales
        setTimeout(() => {
          if (typingIndicator) typingIndicator.classList.remove('show');

          // Generación de respuesta contextual pedagógica
          let responseText = '';
          const lower = promptText.toLowerCase();

          if (lower.includes('gracias') || lower.includes('muchas gracias')) {
            responseText = `¡Con mucho gusto! Como tutores pares de la UNAD nuestro compromiso es el aprendizaje autónomo y colaborativo. Recuerda revisar la rúbrica TIGRE en el foro.`;
          } else if (lower.includes('derivada') || lower.includes('calculo') || subject.includes('cálculo')) {
            responseText = `Entendido. En este ejercicio de cálculo te recomiendo identificar claramente f(u) y u(x). Aplica primero la derivada de la función trigonométrica y luego multiplica por la derivada algebraica interna.`;
          } else if (lower.includes('javascript') || lower.includes('codigo') || lower.includes('array') || subject.includes('programación')) {
            responseText = `Excelente consulta. Recuerda que los métodos declarativos como filter, map y reduce son inmutables. Prueba encapsulando la condición dentro de una función flecha limpia.`;
          } else if (lower.includes('matrices') || lower.includes('algebra') || subject.includes('álgebra')) {
            responseText = `Para matrices en álgebra lineal, verifica siempre la compatibilidad de filas y columnas (m x n con n x p). La traspuesta invierte el orden del producto.`;
          } else {
            responseText = `He recibido tu mensaje. He revisado tu planteamiento y te sugiero consultar también el repositorio de OVI y OVA de la ECBTI en el campus virtual. ¿Te parece si revisamos un ejemplo paso a paso?`;
          }

          const now = new Date();
          const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

          const partnerMessage = {
            senderId: State.activeChat.partnerId,
            senderName: partnerName,
            text: responseText,
            time: timeStr,
            timestamp: Date.now()
          };

          if (!State.chats[chatKey]) State.chats[chatKey] = [];
          State.chats[chatKey].push(partnerMessage);
          State.saveChats();
          this.renderChatMessages();
        }, 2200);
      }, 1000);
    },

    // ------------------------------------------------------------------------
    // Modal 4: Registro / Inicio de Sesión UNAD (RF01)
    // ------------------------------------------------------------------------
    bindRegisterModal() {
      const openBtn = document.getElementById('btnOpenRegisterModal');
      const closeBtn = document.getElementById('btnCloseRegisterModal');
      const cancelBtn = document.getElementById('btnCancelRegister');
      const form = document.getElementById('registerUserForm');

      if (openBtn) openBtn.addEventListener('click', () => {
        document.getElementById('userDropdownMenu').classList.remove('show');
        this.openModal('registerModal');
      });

      if (closeBtn) closeBtn.addEventListener('click', () => this.closeModal('registerModal'));
      if (cancelBtn) cancelBtn.addEventListener('click', () => this.closeModal('registerModal'));

      if (form) {
        form.addEventListener('submit', (e) => {
          e.preventDefault();
          const name = document.getElementById('regName').value.trim();
          const email = document.getElementById('regEmail').value.trim().toLowerCase();
          const cead = document.getElementById('regCead').value;
          const program = document.getElementById('regProgram').value;
          const role = document.getElementById('regRole').value;

          // Validación de correo institucional UNAD
          if (!email.endsWith('@unad.edu.co') && !email.endsWith('@unadvirtual.edu.co')) {
            Utils.showToast('El correo debe ser institucional oficial (@unad.edu.co o @unadvirtual.edu.co).', 'warning');
            return;
          }

          // Si el usuario ya existe por correo, cambiar a ese usuario
          let existing = State.users.find(u => u.email === email);
          if (existing) {
            State.switchUser(existing.id);
            form.reset();
            this.closeModal('registerModal');
            UI.renderCurrentUserWidget();
            UI.renderAll();
            Utils.showToast(`Bienvenido de nuevo, ${existing.name}. Sesión iniciada con éxito.`, 'success');
            return;
          }

          // Crear nuevo usuario
          const colors = ['#002B49', '#0083B0', '#E87722', '#10B981', '#7C3AED', '#DB2777'];
          const randomColor = colors[Math.floor(Math.random() * colors.length)];

          const newUser = {
            id: `usr-${Date.now()}`,
            name,
            email,
            role,
            program,
            cead,
            points: role === 'Tutor Par' ? 50 : 10,
            ratingAvg: 5.0,
            ratingsCount: 0,
            solvedCount: 0,
            specialties: [program],
            badges: ['Bienvenida UNAD', 'Mentor Solidario'],
            avatarBg: randomColor
          };

          State.users.push(newUser);
          State.saveUsers();
          State.switchUser(newUser.id);

          form.reset();
          this.closeModal('registerModal');
          UI.renderCurrentUserWidget();
          UI.renderAll();

          Utils.showToast(`¡Usuario institucional ${newUser.name} registrado y autenticado exitosamente!`, 'success');
        });
      }
    }
  };

  // ==========================================================================
  // 8. EXPORTACIÓN DE DATOS PARA PROYECTO DE GRADO (RF08)
  // ==========================================================================
  const Exporter = {
    init() {
      const btnJson = document.getElementById('btnExportJson');
      const btnCsv = document.getElementById('btnExportCsv');

      if (btnJson) btnJson.addEventListener('click', () => this.exportJSON());
      if (btnCsv) btnCsv.addEventListener('click', () => this.exportCSV());
    },

    exportJSON() {
      const dataset = {
        metadata: {
          platform: 'TutorUNAD - Sistema de Tutorías entre Estudiantes',
          institution: 'Universidad Nacional Abierta y a Distancia (UNAD) - ECBTI',
          exportDate: new Date().toISOString(),
          version: '1.0.0-ECBTI-TESIS'
        },
        analytics: {
          totalQuestions: State.questions.length,
          resolvedQuestions: State.questions.filter(q => q.status === 'Resuelta').length,
          unansweredQuestions: State.questions.filter(q => q.answers.length === 0).length,
          totalUsers: State.users.length
        },
        users: State.users,
        questions: State.questions,
        chats: State.chats
      };

      const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(dataset, null, 2));
      const downloadAnchor = document.createElement('a');
      downloadAnchor.setAttribute('href', dataStr);
      downloadAnchor.setAttribute('download', `tutorunad_dataset_${Date.now()}.json`);
      document.body.appendChild(downloadAnchor);
      downloadAnchor.click();
      downloadAnchor.remove();

      Utils.showToast('Dataset JSON completo exportado correctamente.', 'success');
    },

    exportCSV() {
      const rows = [
        ['ID_Duda', 'Titulo', 'Asignatura', 'Tags', 'Estado', 'Autor', 'Rol_Autor', 'CEAD', 'Total_Respuestas', 'Solucion_Aceptada', 'Fecha_Registro']
      ];

      State.questions.forEach(q => {
        const hasAccepted = q.answers.some(a => a.isAccepted) ? 'SI' : 'NO';
        const dateStr = new Date(q.createdAt).toISOString();
        rows.push([
          q.id,
          `"${(q.title || '').replace(/"/g, '""')}"`,
          `"${q.subject || ''}"`,
          `"${(q.tags || []).join(';')}"`,
          q.status,
          `"${q.authorName || ''}"`,
          `"${q.authorRole || ''}"`,
          `"${q.authorCead || ''}"`,
          q.answers.length,
          hasAccepted,
          dateStr
        ]);
      });

      const csvContent = 'data:text/csv;charset=utf-8,' + rows.map(r => r.join(',')).join('\n');
      const downloadAnchor = document.createElement('a');
      downloadAnchor.setAttribute('href', encodeURI(csvContent));
      downloadAnchor.setAttribute('download', `tutorunad_dudas_respuestas_${Date.now()}.csv`);
      document.body.appendChild(downloadAnchor);
      downloadAnchor.click();
      downloadAnchor.remove();

      Utils.showToast('Matriz CSV para Excel y SPSS exportada correctamente.', 'success');
    }
  };

  // ==========================================================================
  // 9. ENLACE DE EVENTOS GLOBALES Y NAVEGACIÓN SPA
  // ==========================================================================
  function setupEventListeners() {
    // 1. Navegación por pestañas SPA
    const navLinks = document.querySelectorAll('.main-nav .nav-link');
    const views = document.querySelectorAll('.view-section');

    navLinks.forEach(link => {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        const targetViewId = link.getAttribute('data-view');

        navLinks.forEach(l => l.classList.remove('active'));
        link.classList.add('active');

        views.forEach(v => {
          if (v.id === targetViewId) {
            v.classList.add('active-view');
          } else {
            v.classList.remove('active-view');
          }
        });

        if (targetViewId === 'view-gamification') {
          UI.renderGamificationView();
        } else if (targetViewId === 'view-analytics') {
          UI.renderAnalyticsView();
        } else if (targetViewId === 'view-wall') {
          UI.renderQuestionsWall();
        }
      });
    });

    // 2. Dropdown de Switch de Usuario
    const userSwitchBtn = document.getElementById('userSwitchBtn');
    const userDropdownMenu = document.getElementById('userDropdownMenu');

    if (userSwitchBtn && userDropdownMenu) {
      userSwitchBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        userDropdownMenu.classList.toggle('show');
      });

      document.addEventListener('click', (e) => {
        if (!userDropdownMenu.contains(e.target) && !userSwitchBtn.contains(e.target)) {
          userDropdownMenu.classList.remove('show');
        }
      });
    }

    // 3. Buscador en tiempo real
    const searchInput = document.getElementById('searchInput');
    if (searchInput) {
      searchInput.addEventListener('input', (e) => {
        State.filters.searchTerm = e.target.value;
        UI.renderQuestionsWall();
      });
    }

    // 4. Filtro por asignatura
    const subjectFilterSelect = document.getElementById('subjectFilterSelect');
    if (subjectFilterSelect) {
      subjectFilterSelect.addEventListener('change', (e) => {
        State.filters.subject = e.target.value;
        UI.renderQuestionsWall();
      });
    }

    // 5. Ordenamiento dinámico
    const sortBySelect = document.getElementById('sortBySelect');
    if (sortBySelect) {
      sortBySelect.addEventListener('change', (e) => {
        State.filters.sortBy = e.target.value;
        UI.renderQuestionsWall();
      });
    }

    // 6. Chips de estado rápido
    const statusChips = document.querySelectorAll('.chip-status-btn');
    statusChips.forEach(chip => {
      chip.addEventListener('click', () => {
        statusChips.forEach(c => c.classList.remove('active'));
        chip.classList.add('active');
        State.filters.status = chip.getAttribute('data-status');
        UI.renderQuestionsWall();
      });
    });

    // 7. Botón limpiar tag activo
    const btnClearActiveTag = document.getElementById('btnClearActiveTag');
    if (btnClearActiveTag) {
      btnClearActiveTag.addEventListener('click', () => {
        State.filters.selectedTag = '';
        UI.renderQuestionsWall();
      });
    }

    // 8. Botón rápido publicar en el banner institucional
    const btnBannerPublish = document.getElementById('btnBannerPublish');
    if (btnBannerPublish) {
      btnBannerPublish.addEventListener('click', () => {
        const btnOpen = document.getElementById('btnOpenPublishModal');
        if (btnOpen) btnOpen.click();
      });
    }

    // 9. Enlace del logo a Home
    const brandNavHome = document.getElementById('brandNavHome');
    if (brandNavHome) {
      brandNavHome.addEventListener('click', () => {
        document.querySelector('.main-nav .nav-link[data-view="view-wall"]')?.click();
      });
    }

    // 10. Enlaces del footer
    const footerLinkAnalytics = document.getElementById('footerLinkAnalytics');
    if (footerLinkAnalytics) {
      footerLinkAnalytics.addEventListener('click', (e) => {
        e.preventDefault();
        document.querySelector('.main-nav .nav-link[data-view="view-analytics"]')?.click();
      });
    }

    const footerLinkGamification = document.getElementById('footerLinkGamification');
    if (footerLinkGamification) {
      footerLinkGamification.addEventListener('click', (e) => {
        e.preventDefault();
        document.querySelector('.main-nav .nav-link[data-view="view-gamification"]')?.click();
      });
    }

    const footerLinkExport = document.getElementById('footerLinkExport');
    if (footerLinkExport) {
      footerLinkExport.addEventListener('click', (e) => {
        e.preventDefault();
        document.querySelector('.main-nav .nav-link[data-view="view-analytics"]')?.click();
      });
    }
  }

  // ==========================================================================
  // 10. ARRANQUE DE LA APLICACIÓN
  // ==========================================================================
  document.addEventListener('DOMContentLoaded', () => {
    State.init();
    UI.renderCurrentUserWidget();
    UI.renderAll();
    Modals.init();
    Exporter.init();
    setupEventListeners();
  });

})();
