export default {
  soon: 'Em breve!',
  humidity: 'Umidade',
  temperature: 'Temperatura',
  unexpected_error: 'Ocorreu um erro inesperado. Verifique sua conexão e tente novamente. Se o problema persistir, entre em contato com o suporte.',
  quantity: 'Quantidade',
  reset_zoom: 'Resetar zoom',
  data_found: 'Dados encontrados',
  showing_data: 'Mostrando dados de todos os monitores do período:',
  data: 'Dados',
  resume: 'Resumo',
  total_of_data: 'Total de dados',
  total_of_monitors: 'Total de monitores',
  on_selected_period: 'no período selecionado',
  last_monitors_data: 'Últimos dados dos monitores',
  select_a_period: 'Selecione um período para exportar os dados',
  loading_data: 'Carregando dados...',
  not_found_on_period: 'Nenhum dado encontrado para o período selecionado',
  documents: 'documentos',
  invalid_date_range: 'Período de datas inválido. A data de início deve ser anterior à data de término.',
  not_possible_export_empty: 'Não é possível exportar dados vazios.',
  alerts: {
    you_must_sign_in: 'Você deve estar logado para ver esta página!',
    no_permission: 'Você não tem permissão para acessar esta página!',
  },
  monitors_relation: 'Relação de monitores',
  quantity_of_data: 'Quantidade de dados',
  quantity_of_data_by_monitor: 'Total de dados ou erros por monitor',
  metereological_parameters: 'Parâmetros metereológicos',
  pollutants_parameters: 'Parâmetros poluentes',
  over_time: 'ao longo do tempo',
  latitude: 'Latitude',
  longitude: 'Longitude',
  name: 'nome',
  errors: 'Erros',
  time: {
    min: 'min',
    hour:'hora',
    hours:'horas',
  },
  components: {
    header: {
      hi: 'Olá,',
      login: 'Entrar',
      logout: 'Sair',
      signup: 'Cadastrar-se',
      profile: 'Perfil',
    },
    table_paginated: {
      export: 'Exportar',
      first: 'Primeira',
      before: 'Anterior',
      next: 'Próxima',
      last: 'Última',
      until: 'até',
      page: 'Página',
      of: 'de',
      without_data_to_show: 'Não há dados para exibir',
      type_to_search: 'Digite para pesquisar',
    }
  },
  routes: {
    profile: {
      title: 'Perfil',
      name: 'Nome',
      change_password: 'Você pode alterá-la a qualquer momento',
      placeholder_name: 'Digite seu nome',
      update_your_password: 'Atualize sua senha',
      update_your_name: 'Atualize seu nome',
      new_name: 'Digite o novo nome',
      your_email: 'Digite seu e-mail',
      last_password: 'Digite a senha atual',
      new_password: 'Digite a nova senha',
      save_changes: 'Salvar alterações',
    },
    admin : {
      title: 'Adminstrador',
    },
    map: {
      title: 'Mapa',
    },
    home: {
      title: 'Repositório de Dados',
      subtitle: 'Monitoramento da Qualidade do Ar - Rede MoQA',
      credits: "Imagem de",
    },
    not_found: {
      title: 'Página não encontrada',
      subtitle: 'A página que você está procurando não existe',
      action: 'Voltar para a página inicial',
    },
    update_monitors : {
      title: 'Atualizar Monitores',
    },
    dashboard: {
      title: 'Dashboard',
    },
    data: {
      title: 'Exportar dados',
      initial_date: 'Data inicial',
      final_date: 'Data final',
      initial_hour: 'Hora inicial',
      final_hour: 'Hora final',
      search: 'Buscar',
    },
    analyze: {
      title:'Análise',
    },
    login: {
      title: 'Acesse sua conta',
      email: 'E-mail',
      email_placeholder: 'Digite seu e-mail',
      password: 'Senha',
      password_placeholder: 'Digite sua senha',
      action: 'Entrar',
      errors: {
        "auth/claims-too-large": "O tamanho do token excedeu o limite máximo de 1 Megabyte.",
        "auth/email-already-exists": "O endereço de e-mail já está sendo usado por outra conta.",
        "auth/id-token-expired": "O token de autenticação expirou.",
        "auth/id-token-revoked": "O token de autenticação foi revogado.",
        "auth/insufficient-permission": "O usuário não possui permissão para realizar a ação solicitada.",
        "auth/internal-error": "O servidor de autenticação encontrou um erro inesperado ao tentar processar a solicitação.",
        "auth/invalid-argument": "Um argumento inválido foi fornecido a um método.",
        "auth/invalid-claims": "Os atributos de cadastro personalizados são inválidos.",
        "auth/invalid-continue-uri": "O endereço de retorno deve ser uma string de URL válida.",
        "auth/invalid-creation-time": "O horário de criação deve ser uma string de data UTC válida.",
        "auth/invalid-credential": "A credencial expirou ou está mal formatada.",
        "auth/invalid-disabled-field": "O campo de usuário desativado é inválido.",
        "auth/invalid-display-name": "O nome do usuário é inválido.",
        "auth/invalid-dynamic-link-domain": "O domínio de link dinâmico fornecido não está configurado ou autorizado para o projeto atual.",
        "auth/invalid-email": "O endereço de e-mail está mal formatado.",
        "auth/invalid-email-verified": "O endereço de e-mail está mal formatado.",
        "auth/invalid-hash-algorithm": "O algoritmo HASH não é compatível com a criptografia.",
        "auth/invalid-hash-block-size": "O tamanho do bloco HASH não é válido.",
        "auth/invalid-hash-derived-key-length": "O tamanho da chave derivada do HASH não é válido.",
        "auth/invalid-hash-key": "A chave HASH deve ter um buffer de bytes válido.",
        "auth/invalid-hash-memory-cost": "O custo da memória HASH não é válido.",
        "auth/invalid-hash-parallelization": "O carregamento paralelo HASH não é válido.",
        "auth/invalid-hash-rounds": "O arredondamento HASH não é válido.",
        "auth/invalid-hash-salt-separator": "O campo de separador de SALT deve ser um buffer de bytes válido.",
        "auth/invalid-id-token": "O token de autenticação não é um JWT válido.",
        "auth/invalid-last-sign-in-time": "O último horário de login deve ser uma string de data UTC válida.",
        "auth/invalid-page-token": "A próxima URL fornecida na solicitação é inválida.",
        "auth/invalid-password": "A senha é inválida, deve ter pelo menos 6 caracteres.",
        "auth/wrong-password": "A senha é inválida para a conta especificada.",
        "auth/invalid-password-hash": "O HASH da senha não é válida.",
        "auth/invalid-password-salt": "O SALT da senha não é válido.",
        "auth/invalid-phone-number": "O número de telefone deve ser um número de telefone válido.",
        "auth/invalid-photo-url": "A URL da foto do usuário é inválida.",
        "auth/invalid-provider-id": "O identificador de provedor não é compatível.",
        "auth/invalid-session-cookie-duration": "A duração do cookie da sessão deve ser um número válido em milissegundos, entre 5 minutos e 2 semanas.",
        "auth/invalid-uid": "O identificador fornecido deve ter no máximo 128 caracteres.", 
        "auth/invalid-user-import": "O registro do usuário a ser importado não é válido.",
        "auth/maximum-user-count-exceeded": "O número máximo permitido de usuários a serem importados foi excedido.",
        "auth/missing-android-pkg-name": "Deve ser fornecido um nome de pacote para instalar o aplicativo Android.",
        "auth/missing-continue-uri": "A próxima URL deve ser fornecida na solicitação.",
        "auth/missing-hash-algorithm": "É necessário fornecer o algoritmo HASH e seus parâmetros para importar usuários.",
        "auth/missing-ios-bundle-id": "Deve ser fornecido um nome de pacote para instalar o aplicativo iOS.",
        "auth/missing-uid": "Um identificador é necessário para a operação atual.",
        "auth/missing-oauth-client-secret": "O segredo do cliente OAuth é necessário para a autenticação do fluxo de código de autorização.",
        "auth/operation-not-allowed": "O provedor de login fornecido está desabilitado para o Firebase.",
        "auth/phone-number-already-exists": "O número de telefone já está sendo usado por outra conta.",
        "auth/project-not-found": "Nenhum projeto foi encontrado.",
        "auth/reserved-claims": "Um ou mais atributos personalizados fornecidos usam palavras reservadas.",
        "auth/session-cookie-expired": "O cookie da sessão expirou.",
        "auth/session-cookie-revoked": "O cookie da sessão foi revogado.",
        "auth/uid-already-exists": "O identificador fornecido já está em uso.",
        "auth/too-many-requests": "O número de solicitações excedeu o máximo permitido.",
        "auth/unauthorized-continue-uri": "O domínio do aplicativo não está na lista de autorizações.",
        "auth/user-not-found": "Não há registro de usuário existente correspondente ao identificador fornecido.",
      }
    }
  }
}
