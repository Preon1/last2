import { createI18n } from 'vue-i18n'

export const supportedLocales = ['en', 'nl', 'fr', 'de', 'ru'] as const
export type SupportedLocale = (typeof supportedLocales)[number]

const STORAGE_KEY = 'lrcom-locale'

function normalizeLocale(raw: string | null | undefined): SupportedLocale | null {
  const s = (raw ?? '').trim().toLowerCase()
  if (!s) return null

  // Accept exact match
  if ((supportedLocales as readonly string[]).includes(s)) return s as SupportedLocale

  // Accept prefixes like "de-DE" / "ru_RU"
  const base = s.split(/[-_]/)[0] ?? ''
  if ((supportedLocales as readonly string[]).includes(base)) return base as SupportedLocale

  return null
}

function detectInitialLocale(): SupportedLocale {
  try {
    const saved = normalizeLocale(localStorage.getItem(STORAGE_KEY))
    if (saved) return saved
  } catch {
    // ignore
  }

  const nav =
    normalizeLocale(navigator.language) ??
    normalizeLocale(Array.isArray(navigator.languages) ? navigator.languages[0] : null) ??
    null

  return nav ?? 'en'
}

export const messages = {
  en: {
    common: {
      about: 'About',
      close: 'Close',
      cancel: 'Cancel',
      proceed: 'Proceed',
      reply: 'Reply',
      send: 'Send',
      settings: 'Settings',
      users: 'Users',
      online: 'Online',
      busy: 'busy',
      language: 'Language',
      unreadMessages: 'Unread messages',
      logout: 'Logout',
    },
    setup: {
      subtitle: 'No accounts, no cookies, no saved sessions.',
      yourName: 'Your name',
      namePlaceholder: 'e.g. Alex',
      join: 'Join',
    },
    about: {
      title: 'About',
      description:
        'Last is an ephemeral, registration-less, audio-only WebRTC communicator. No accounts, no cookies, no saved sessions.',
      repoLink: 'Git repository',
    },
    theme: {
      label: 'Theme: {mode}',
      system: 'System',
      dark: 'Dark',
      light: 'Light',
      toggleAria: 'Toggle theme',
    },
    settings: {
      title: 'Settings',
      youLabel: 'You:',
    },
    sidebar: {
      groupChat: 'Group chat',
      noOneOnline: 'No one online right now.',
    },
    chat: {
      typeMessage: 'Type a message...',
      replying: 'Replying',
      replyingTo: 'Replying to {name}',
      replyTo: 'Reply to {name}',
      joinOngoingTitle: 'Join ongoing call?',
      joinOngoingBodyNamed: "You are attempting to join {name}'s ongoing call.",
      joinOngoingBody: 'You are attempting to join an ongoing call.',
      callAria: 'Call',
      sendAria: 'Send',
    },
    call: {
      notInCall: 'Not in call',
      inCall: 'In call: {names}',
      incomingFromLabel: 'Incoming call from',
      incomingFrom: 'Incoming call from {name}',
      unknown: 'Unknown',
      waitingToJoinNamed: 'Waiting to join {name}…',
      waitingToJoin: 'Waiting to join…',
      requestingToJoinNamed: 'Requesting to join {name}…',
      requestingToJoin: 'Requesting to join…',
      calling: 'Calling…',
      callingNamed: 'Calling {name}…',
      ringing: 'Ringing…',
      ringingNamed: 'Ringing {name}…',
      inviting: 'Inviting…',
      connecting: 'Connecting…',
      connected: 'Connected',
      incomingCall: 'Incoming call',
      incomingCallNamed: 'Incoming call: {name}',
      callEnded: 'Call ended.',
      callRejected: 'Call rejected.',
      callFailed: 'Call failed: {reason}',
      joinFailed: 'Join failed.',
      joinFailedReason: 'Join failed: {reason}',
      from: 'From {name}',
      accept: 'Accept',
      reject: 'Reject',
      cancelRequest: 'Cancel request',
      addToCall: 'Add to call',
      hangUp: 'Hang up',
      joinRequestNamed: '{name} wants to join this call.',
      joinRequestSomeone: 'Someone wants to join this call.',
      micPermissionDenied: 'Microphone permission denied.',
      micNotFound: 'No microphone found.',
      micInUse: 'Microphone is in use.',
      micError: 'Microphone error.',
    },
    session: {
      enterName: 'Enter a name.',
      connecting: 'Connecting…',
      nameTaken: 'Name is taken.',
      invalidName: 'Invalid name.',
      disconnected: 'Disconnected.',
      connectionError: 'Connection error.',
      turn: 'TURN {host}',
      udpRelayPortsRatio: 'UDP relay ports ~{used}/{total}',
      udpRelayPortsTotal: 'UDP relay ports {total}',
      udpRelayPortsUsed: 'UDP relay ports in use ~{used}',
      estConfMax: 'est conf max ~{users} users',
      estCallsMax: 'est 1:1 max ~{calls} calls',
    },
    confirm: {
      leave: 'Logout and leave {appName}?',
    },
    lang: {
      en: 'English',
      nl: 'Nederlands',
      fr: 'Français',
      de: 'Deutsch',
      ru: 'Русский',
    },
  },

  nl: {
    common: {
      about: 'Over',
      close: 'Sluiten',
      cancel: 'Annuleren',
      proceed: 'Doorgaan',
      reply: 'Antwoorden',
      send: 'Versturen',
      settings: 'Instellingen',
      users: 'Gebruikers',
      online: 'Online',
      busy: 'bezet',
      language: 'Taal',
      unreadMessages: 'Ongelezen berichten',
      logout: 'Uitloggen',
    },
    setup: {
      subtitle: 'Geen accounts, geen cookies, geen opgeslagen sessies.',
      yourName: 'Jouw naam',
      namePlaceholder: 'bijv. Alex',
      join: 'Meedoen',
    },
    about: {
      title: 'Over',
      description:
        'Last is een tijdelijk, registratievrij, audio-only WebRTC-communicatiemiddel. Geen accounts, geen cookies, geen opgeslagen sessies.',
      repoLink: 'Git-repository',
    },
    theme: {
      label: 'Thema: {mode}',
      system: 'Systeem',
      dark: 'Donker',
      light: 'Licht',
      toggleAria: 'Thema wisselen',
    },
    settings: {
      title: 'Instellingen',
      youLabel: 'Jij:',
    },
    sidebar: {
      groupChat: 'Groepschat',
      noOneOnline: 'Er is momenteel niemand online.',
    },
    chat: {
      typeMessage: 'Typ een bericht...',
      replying: 'Antwoorden',
      replyingTo: 'Antwoord aan {name}',
      replyTo: 'Antwoord aan {name}',
      joinOngoingTitle: 'Deelnemen aan lopend gesprek?',
      joinOngoingBodyNamed: 'Je probeert deel te nemen aan het lopende gesprek van {name}.',
      joinOngoingBody: 'Je probeert deel te nemen aan een lopend gesprek.',
      callAria: 'Bellen',
      sendAria: 'Versturen',
    },
    call: {
      notInCall: 'Niet in gesprek',
      inCall: 'In gesprek: {names}',
      incomingFromLabel: 'Inkomende oproep van',
      incomingFrom: 'Inkomende oproep van {name}',
      unknown: 'Onbekend',
      waitingToJoinNamed: 'Wachten om deel te nemen aan {name}…',
      waitingToJoin: 'Wachten om deel te nemen…',
      requestingToJoinNamed: 'Verzoek om deel te nemen aan {name}…',
      requestingToJoin: 'Verzoek om deel te nemen…',
      calling: 'Bellen…',
      callingNamed: 'Bellen {name}…',
      ringing: 'Overgaan…',
      ringingNamed: 'Overgaan bij {name}…',
      inviting: 'Uitnodigen…',
      connecting: 'Verbinden…',
      connected: 'Verbonden',
      incomingCall: 'Inkomende oproep',
      incomingCallNamed: 'Inkomende oproep: {name}',
      callEnded: 'Gesprek beëindigd.',
      callRejected: 'Oproep geweigerd.',
      callFailed: 'Oproep mislukt: {reason}',
      joinFailed: 'Deelnemen mislukt.',
      joinFailedReason: 'Deelnemen mislukt: {reason}',
      from: 'Van {name}',
      accept: 'Accepteren',
      reject: 'Weigeren',
      cancelRequest: 'Verzoek annuleren',
      addToCall: 'Toevoegen aan gesprek',
      hangUp: 'Ophangen',
      joinRequestNamed: '{name} wil deelnemen aan dit gesprek.',
      joinRequestSomeone: 'Iemand wil deelnemen aan dit gesprek.',
      micPermissionDenied: 'Microfoon-toestemming geweigerd.',
      micNotFound: 'Geen microfoon gevonden.',
      micInUse: 'Microfoon is in gebruik.',
      micError: 'Microfoonfout.',
    },
    session: {
      enterName: 'Voer een naam in.',
      connecting: 'Verbinden…',
      nameTaken: 'Naam is al in gebruik.',
      invalidName: 'Ongeldige naam.',
      disconnected: 'Verbinding verbroken.',
      connectionError: 'Verbindingsfout.',
      turn: 'TURN {host}',
      udpRelayPortsRatio: 'UDP relay-poorten ~{used}/{total}',
      udpRelayPortsTotal: 'UDP relay-poorten {total}',
      udpRelayPortsUsed: 'UDP relay-poorten in gebruik ~{used}',
      estConfMax: 'schatting conf max ~{users} gebruikers',
      estCallsMax: 'schatting 1:1 max ~{calls} gesprekken',
    },
    confirm: {
      leave: 'Uitloggen en {appName} verlaten?',
    },
    lang: {
      en: 'English',
      nl: 'Nederlands',
      fr: 'Français',
      de: 'Deutsch',
      ru: 'Русский',
    },
  },

  fr: {
    common: {
      about: 'À propos',
      close: 'Fermer',
      cancel: 'Annuler',
      proceed: 'Continuer',
      reply: 'Répondre',
      send: 'Envoyer',
      settings: 'Paramètres',
      users: 'Utilisateurs',
      online: 'En ligne',
      busy: 'occupé',
      language: 'Langue',
      unreadMessages: 'Messages non lus',
      logout: 'Déconnexion',
    },
    setup: {
      subtitle: 'Pas de comptes, pas de cookies, pas de sessions enregistrées.',
      yourName: 'Votre nom',
      namePlaceholder: 'ex. Alex',
      join: 'Rejoindre',
    },
    about: {
      title: 'À propos',
      description:
        "Last est un outil WebRTC éphémère, sans inscription, audio uniquement. Pas de comptes, pas de cookies, pas de sessions enregistrées.",
      repoLink: 'Dépôt Git',
    },
    theme: {
      label: 'Thème : {mode}',
      system: 'Système',
      dark: 'Sombre',
      light: 'Clair',
      toggleAria: 'Changer le thème',
    },
    settings: {
      title: 'Paramètres',
      youLabel: 'Vous :',
    },
    sidebar: {
      groupChat: 'Chat de groupe',
      noOneOnline: "Personne n’est en ligne pour le moment.",
    },
    chat: {
      typeMessage: 'Écrivez un message...',
      replying: 'Réponse',
      replyingTo: 'Réponse à {name}',
      replyTo: 'Réponse à {name}',
      joinOngoingTitle: "Rejoindre l'appel en cours ?",
      joinOngoingBodyNamed: "Vous essayez de rejoindre l'appel en cours de {name}.",
      joinOngoingBody: "Vous essayez de rejoindre un appel en cours.",
      callAria: 'Appeler',
      sendAria: 'Envoyer',
    },
    call: {
      notInCall: "Pas en appel",
      inCall: 'En appel : {names}',
      incomingFromLabel: 'Appel entrant de',
      incomingFrom: 'Appel entrant de {name}',
      unknown: 'Inconnu',
      waitingToJoinNamed: 'En attente pour rejoindre {name}…',
      waitingToJoin: 'En attente pour rejoindre…',
      requestingToJoinNamed: 'Demande pour rejoindre {name}…',
      requestingToJoin: 'Demande pour rejoindre…',
      calling: 'Appel…',
      callingNamed: 'Appel à {name}…',
      ringing: 'Sonnerie…',
      ringingNamed: 'Sonnerie chez {name}…',
      inviting: 'Invitation…',
      connecting: 'Connexion…',
      connected: 'Connecté',
      incomingCall: 'Appel entrant',
      incomingCallNamed: 'Appel entrant : {name}',
      callEnded: "Appel terminé.",
      callRejected: 'Appel refusé.',
      callFailed: "Échec de l'appel : {reason}",
      joinFailed: 'Échec pour rejoindre.',
      joinFailedReason: 'Échec pour rejoindre : {reason}',
      from: 'De {name}',
      accept: 'Accepter',
      reject: 'Refuser',
      cancelRequest: 'Annuler la demande',
      addToCall: "Ajouter à l'appel",
      hangUp: 'Raccrocher',
      joinRequestNamed: '{name} veut rejoindre cet appel.',
      joinRequestSomeone: "Quelqu'un veut rejoindre cet appel.",
      micPermissionDenied: 'Autorisation du micro refusée.',
      micNotFound: 'Aucun micro trouvé.',
      micInUse: 'Le micro est utilisé.',
      micError: 'Erreur du micro.',
    },
    session: {
      enterName: 'Entrez un nom.',
      connecting: 'Connexion…',
      nameTaken: 'Nom déjà pris.',
      invalidName: 'Nom invalide.',
      disconnected: 'Déconnecté.',
      connectionError: 'Erreur de connexion.',
      turn: 'TURN {host}',
      udpRelayPortsRatio: 'Ports relais UDP ~{used}/{total}',
      udpRelayPortsTotal: 'Ports relais UDP {total}',
      udpRelayPortsUsed: 'Ports relais UDP utilisés ~{used}',
      estConfMax: 'est conf max ~{users} utilisateurs',
      estCallsMax: 'est 1:1 max ~{calls} appels',
    },
    confirm: {
      leave: 'Se déconnecter et quitter {appName} ?',
    },
    lang: {
      en: 'English',
      nl: 'Nederlands',
      fr: 'Français',
      de: 'Deutsch',
      ru: 'Русский',
    },
  },

  de: {
    common: {
      about: 'Info',
      close: 'Schließen',
      cancel: 'Abbrechen',
      proceed: 'Fortfahren',
      reply: 'Antworten',
      send: 'Senden',
      settings: 'Einstellungen',
      users: 'Benutzer',
      online: 'Online',
      busy: 'beschäftigt',
      language: 'Sprache',
      unreadMessages: 'Ungelesene Nachrichten',
      logout: 'Abmelden',
    },
    setup: {
      subtitle: 'Keine Konten, keine Cookies, keine gespeicherten Sitzungen.',
      yourName: 'Dein Name',
      namePlaceholder: 'z. B. Alex',
      join: 'Beitreten',
    },
    about: {
      title: 'Info',
      description:
        'Last ist ein flüchtiger, registrierungsfreier, reiner Audio-WebRTC-Kommunikator. Keine Konten, keine Cookies, keine gespeicherten Sitzungen.',
      repoLink: 'Git-Repository',
    },
    theme: {
      label: 'Theme: {mode}',
      system: 'System',
      dark: 'Dunkel',
      light: 'Hell',
      toggleAria: 'Theme wechseln',
    },
    settings: {
      title: 'Einstellungen',
      youLabel: 'Du:',
    },
    sidebar: {
      groupChat: 'Gruppenchat',
      noOneOnline: 'Im Moment ist niemand online.',
    },
    chat: {
      typeMessage: 'Nachricht schreiben...',
      replying: 'Antwort',
      replyingTo: 'Antwort an {name}',
      replyTo: 'Antwort an {name}',
      joinOngoingTitle: 'Laufendem Anruf beitreten?',
      joinOngoingBodyNamed: 'Du versuchst, dem laufenden Anruf von {name} beizutreten.',
      joinOngoingBody: 'Du versuchst, einem laufenden Anruf beizutreten.',
      callAria: 'Anrufen',
      sendAria: 'Senden',
    },
    call: {
      notInCall: 'Nicht im Anruf',
      inCall: 'Im Anruf: {names}',
      incomingFromLabel: 'Eingehender Anruf von',
      incomingFrom: 'Eingehender Anruf von {name}',
      unknown: 'Unbekannt',
      waitingToJoinNamed: 'Warten auf Beitritt zu {name}…',
      waitingToJoin: 'Warten auf Beitritt…',
      requestingToJoinNamed: 'Anfrage zum Beitritt zu {name}…',
      requestingToJoin: 'Anfrage zum Beitritt…',
      calling: 'Rufe an…',
      callingNamed: 'Rufe {name} an…',
      ringing: 'Klingeln…',
      ringingNamed: 'Klingelt bei {name}…',
      inviting: 'Einladen…',
      connecting: 'Verbinden…',
      connected: 'Verbunden',
      incomingCall: 'Eingehender Anruf',
      incomingCallNamed: 'Eingehender Anruf: {name}',
      callEnded: 'Anruf beendet.',
      callRejected: 'Anruf abgelehnt.',
      callFailed: 'Anruf fehlgeschlagen: {reason}',
      joinFailed: 'Beitritt fehlgeschlagen.',
      joinFailedReason: 'Beitritt fehlgeschlagen: {reason}',
      from: 'Von {name}',
      accept: 'Annehmen',
      reject: 'Ablehnen',
      cancelRequest: 'Anfrage abbrechen',
      addToCall: 'Zum Anruf hinzufügen',
      hangUp: 'Auflegen',
      joinRequestNamed: '{name} möchte diesem Anruf beitreten.',
      joinRequestSomeone: 'Jemand möchte diesem Anruf beitreten.',
      micPermissionDenied: 'Mikrofonberechtigung verweigert.',
      micNotFound: 'Kein Mikrofon gefunden.',
      micInUse: 'Mikrofon wird bereits verwendet.',
      micError: 'Mikrofonfehler.',
    },
    session: {
      enterName: 'Name eingeben.',
      connecting: 'Verbinden…',
      nameTaken: 'Name ist bereits vergeben.',
      invalidName: 'Ungültiger Name.',
      disconnected: 'Getrennt.',
      connectionError: 'Verbindungsfehler.',
      turn: 'TURN {host}',
      udpRelayPortsRatio: 'UDP-Relay-Ports ~{used}/{total}',
      udpRelayPortsTotal: 'UDP-Relay-Ports {total}',
      udpRelayPortsUsed: 'UDP-Relay-Ports in Benutzung ~{used}',
      estConfMax: 'geschätzt conf max ~{users} Benutzer',
      estCallsMax: 'geschätzt 1:1 max ~{calls} Anrufe',
    },
    confirm: {
      leave: '{appName} verlassen und abmelden?',
    },
    lang: {
      en: 'English',
      nl: 'Nederlands',
      fr: 'Français',
      de: 'Deutsch',
      ru: 'Русский',
    },
  },

  ru: {
    common: {
      about: 'О приложении',
      close: 'Закрыть',
      cancel: 'Отмена',
      proceed: 'Продолжить',
      reply: 'Ответить',
      send: 'Отправить',
      settings: 'Настройки',
      users: 'Пользователи',
      online: 'Онлайн',
      busy: 'занят',
      language: 'Язык',
      unreadMessages: 'Непрочитанные сообщения',
      logout: 'Выйти',
    },
    setup: {
      subtitle: 'Без аккаунтов, без куки, без сохранённых сессий.',
      yourName: 'Ваше имя',
      namePlaceholder: 'напр. Алекс',
      join: 'Присоединиться',
    },
    about: {
      title: 'О приложении',
      description:
        'Last — это временный, без регистрации, аудио‑только WebRTC‑коммуникатор. Без аккаунтов, без куки, без сохранённых сессий.',
      repoLink: 'Git-репозиторий',
    },
    theme: {
      label: 'Тема: {mode}',
      system: 'Системная',
      dark: 'Тёмная',
      light: 'Светлая',
      toggleAria: 'Сменить тему',
    },
    settings: {
      title: 'Настройки',
      youLabel: 'Вы:',
    },
    sidebar: {
      groupChat: 'Групповой чат',
      noOneOnline: 'Сейчас никто не в сети.',
    },
    chat: {
      typeMessage: 'Введите сообщение...',
      replying: 'Ответ',
      replyingTo: 'Ответ для {name}',
      replyTo: 'Ответ для {name}',
      joinOngoingTitle: 'Присоединиться к текущему звонку?',
      joinOngoingBodyNamed: 'Вы пытаетесь присоединиться к текущему звонку {name}.',
      joinOngoingBody: 'Вы пытаетесь присоединиться к текущему звонку.',
      callAria: 'Позвонить',
      sendAria: 'Отправить',
    },
    call: {
      notInCall: 'Не в звонке',
      inCall: 'В звонке: {names}',
      incomingFromLabel: 'Входящий звонок от',
      incomingFrom: 'Входящий звонок от {name}',
      unknown: 'Неизвестно',
      waitingToJoinNamed: 'Ожидание присоединения к {name}…',
      waitingToJoin: 'Ожидание присоединения…',
      requestingToJoinNamed: 'Запрос на присоединение к {name}…',
      requestingToJoin: 'Запрос на присоединение…',
      calling: 'Звонок…',
      callingNamed: 'Звонок {name}…',
      ringing: 'Гудки…',
      ringingNamed: 'Гудки у {name}…',
      inviting: 'Приглашение…',
      connecting: 'Подключение…',
      connected: 'Подключено',
      incomingCall: 'Входящий звонок',
      incomingCallNamed: 'Входящий звонок: {name}',
      callEnded: 'Звонок завершён.',
      callRejected: 'Звонок отклонён.',
      callFailed: 'Звонок не удался: {reason}',
      joinFailed: 'Не удалось присоединиться.',
      joinFailedReason: 'Не удалось присоединиться: {reason}',
      from: 'От {name}',
      accept: 'Принять',
      reject: 'Отклонить',
      cancelRequest: 'Отменить запрос',
      addToCall: 'Добавить в звонок',
      hangUp: 'Положить трубку',
      joinRequestNamed: '{name} хочет присоединиться к этому звонку.',
      joinRequestSomeone: 'Кто-то хочет присоединиться к этому звонку.',
      micPermissionDenied: 'Доступ к микрофону запрещён.',
      micNotFound: 'Микрофон не найден.',
      micInUse: 'Микрофон уже используется.',
      micError: 'Ошибка микрофона.',
    },
    session: {
      enterName: 'Введите имя.',
      connecting: 'Подключение…',
      nameTaken: 'Имя уже занято.',
      invalidName: 'Некорректное имя.',
      disconnected: 'Отключено.',
      connectionError: 'Ошибка подключения.',
      turn: 'TURN {host}',
      udpRelayPortsRatio: 'UDP relay-порты ~{used}/{total}',
      udpRelayPortsTotal: 'UDP relay-порты {total}',
      udpRelayPortsUsed: 'UDP relay-порты в использовании ~{used}',
      estConfMax: 'оценка конф. макс ~{users} пользователей',
      estCallsMax: 'оценка 1:1 макс ~{calls} звонков',
    },
    confirm: {
      leave: 'Выйти и покинуть {appName}?',
    },
    lang: {
      en: 'English',
      nl: 'Nederlands',
      fr: 'Français',
      de: 'Deutsch',
      ru: 'Русский',
    },
  },
} as const

export const i18n = createI18n({
  legacy: false,
  locale: detectInitialLocale(),
  fallbackLocale: 'en',
  messages,
})

export function getLocale(): SupportedLocale {
  return normalizeLocale(String(i18n.global.locale.value)) ?? 'en'
}

export function setLocale(next: SupportedLocale) {
  i18n.global.locale.value = next
  try {
    localStorage.setItem(STORAGE_KEY, next)
  } catch {
    // ignore
  }
}

export function cycleLocale(): SupportedLocale {
  const cur = getLocale()
  const idx = supportedLocales.indexOf(cur)
  const next = supportedLocales[((idx >= 0 ? idx : -1) + 1) % supportedLocales.length] ?? 'en'
  setLocale(next)
  return next
}
