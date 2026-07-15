export const dashboardPtBr = {
  periodFilter: {
    title: 'Período de análise',
    from: 'De',
    to: 'Até',
  },
  header: {
    title: 'Evolução de treino',
    subtitle: 'Controle anual de frequência e exercícios mais praticados.',
    currentYearInfo: 'Dados exibidos para o ano atual ({{year}}), de janeiro a dezembro.',
    loadError: 'Não foi possível carregar os dados do dashboard com o período atual.',
  },
  actions: {
    addWorkout: 'Adicionar treino',
  },
  kpis: {
    workoutsTitle: 'Treinos no período',
    workoutsDescription: 'Quantidade total de dias com treino registrado.',
    activeMonthsTitle: 'Meses com atividade',
    activeMonthsDescription: 'Meses onde houve pelo menos um treino.',
    exercisesTitle: 'Exercícios registrados',
    exercisesDescription: 'Total de exercícios adicionados nos treinos.',
    averageTitle: 'Média por mês ativo',
    averageDescription: 'Ritmo médio de treinos para os meses ativos.',
  },
  heatmap: {
    title: 'Frequência diária',
    subtitle:
      'Visualização dos treinos do ano atual (janeiro a dezembro), com intensidade em escala progressiva.',
    totalCount: '{{count}} treino(s) no ano',
    tooltip: '{{count}} treino(s) em {{date}}',
    detailsTitle: 'Detalhes do dia',
    detailsHeading: '{{date}} · {{count}} treino(s)',
    noWorkouts: 'Nenhum treino registrado neste dia.',
    workoutTime: 'Início {{start}} · Fim {{end}}',
    noNotes: 'Sem observação para este treino.',
  },
  topExercises: {
    title: 'Exercícios mais frequentes',
    subtitle: 'Ranking com base nos exercícios registrados no período selecionado.',
    empty: 'Ainda não existem exercícios registrados para este período.',
    listItem: '{{count}} registro(s) · {{percentage}}%',
  },
} as const;
