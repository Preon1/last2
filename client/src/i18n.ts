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
        'Last is a free, anonymous, ephemeral web messenger with open source code. This means it requires no installation or registration, is not tied to a phone number, email, or name, does not store logs, messages, or logins, does not create sessions or cookies, and does not collect any analytics. Any person or company can create an isolated copy of this app for their own communication needs.<br>Voice communication is encrypted, and chat messages are sent over an SSL-encrypted channel. (In the next version, messaging will also be wrapped in an additional client-to-client encryption layer to prevent access via server attacks).<br>What is implemented so far:<br>1. Group chat and private chats.<br>2. Voice calls<br>3. Group voice calls<br>4. Multiple languages.<br>What are the downsides of this approach?<br>1. No message history. It is not stored even on your device. Close the tab and open it again — everything disappears.<br>2. You cannot write to or call someone who is offline. Your messages are received only by those who are online right now. If you wrote to someone and later you and your interlocutor left, then those messages no longer exist. Communication is therefore session-based: agree with someone in advance, talk, and leave. You can also not leave and simply stay online all the time.<br>3. You may not know who exactly you are talking to. All that is required to enter is an arbitrary nickname, so the responsibility for understanding the identity of the other person lies entirely with the user.<br>4. (In the current version) Communication in a narrow circle. You do not have a list of personal contacts. You see everyone who is online right now, so a single instance* of the app is not designed for mass use by millions or even thousands of users. There are also limits on how many audio conferences can be supported by the server at the same time.<br>*An app instance is a copy that runs on any private server and is available via one or more web addresses or an IP. A group of users is therefore united only by knowing this address. The number of instances is unlimited.<br>The developer of the application is not responsible for how it is used and what data is transmitted through it. The application code may be copied and modified by anyone for their own needs provided that a link to the original repository is kept in the "About" section. The full license text is available in Git.',
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
        'Last is een gratis, anonieme, tijdelijke webmessenger met open source-code. Dit betekent dat er geen installatie of registratie nodig is, dat het niet gekoppeld is aan een telefoonnummer, e-mail of naam, geen logs, gesprekken of logins opslaat, geen sessies of cookies aanmaakt en geen statistieken verzamelt. Iedereen (personen of bedrijven) kan een geïsoleerde kopie van deze app opzetten voor eigen communicatiedoeleinden.<br>Spraakcommunicatie is versleuteld en berichten worden verstuurd via een met SSL versleuteld kanaal. (In de volgende versie wordt de berichtendienst ook voorzien van een extra client-naar-client versleutelingslaag om toegang via aanvallen op servers te voorkomen).<br>Wat is er op dit moment gerealiseerd:<br>1. Groepschat en privéchats.<br>2. Spraakgesprekken<br>3. Groepsspraakgesprekken<br>4. Meerdere talen.<br>Wat zijn de nadelen van deze aanpak?<br>1. Geen gespreksgeschiedenis. Die wordt zelfs niet op je apparaat opgeslagen. Tabblad sluiten en opnieuw openen — alles is verdwenen.<br>2. Je kunt geen bericht sturen of bellen naar iemand die niet online is. Je berichten worden alleen ontvangen door mensen die nu online zijn. Als je iemand iets hebt gestuurd en daarna jij en je gesprekspartner offline gaan, bestaan die berichten niet meer. Communicatie is dus sessiegebonden: spreek vooraf af, praat, en ga weer weg. Je kunt ook gewoon online blijven.<br>3. Je weet mogelijk niet met wie je precies praat. Voor toegang is alleen een willekeurige nickname nodig, dus de verantwoordelijkheid om de identiteit van de ander te begrijpen ligt volledig bij de gebruiker.<br>4. (In de huidige versie) Communicatie in een kleine kring. Je hebt geen lijst met persoonlijke contacten. Je ziet iedereen die nu online is, dus één app-instantie* is niet bedoeld voor massaal gebruik door miljoenen of zelfs duizenden gebruikers. Ook zijn er grenzen aan hoeveel audioconferenties de server tegelijkertijd kan ondersteunen.<br>*Een app-instantie is een kopie die op een private server draait en bereikbaar is via één of meerdere webadressen of een IP-adres. Een groep gebruikers wordt dus alleen verbonden door het kennen van dat adres. Het aantal instanties is onbeperkt.<br>De ontwikkelaar van de applicatie is niet verantwoordelijk voor hoe deze wordt gebruikt en welke gegevens er via worden verzonden. De code van de applicatie mag door iedereen worden gekopieerd en aangepast voor eigen gebruik, mits de link naar de oorspronkelijke repository behouden blijft in de sectie "Over". De volledige licentie is beschikbaar in Git.',
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
      replyingTo: 'Antwoorden aan {name}',
      replyTo: 'Antwoorden aan {name}',
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
      waitingToJoinNamed: 'Wachten om aan te sluiten bij {name}…',
      waitingToJoin: 'Wachten om aan te sluiten…',
      requestingToJoinNamed: 'Verzoek om aan te sluiten bij {name}…',
      requestingToJoin: 'Verzoek om aan te sluiten…',
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
      cancelRequest: 'Verzoek intrekken',
      addToCall: 'Aan gesprek toevoegen',
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
      estConfMax: 'schatting: max. ~{users} gebruikers',
      estCallsMax: 'schatting: max. ~{calls} 1:1-gesprekken',
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
        "Last est une messagerie web éphémère, gratuite et anonyme, dont le code est open source. Cela signifie qu’elle ne nécessite ni installation ni inscription, qu’elle n’est liée ni à un numéro de téléphone ni à une adresse e-mail ni à un nom, qu’elle ne conserve pas de journaux, de conversations ni d’identifiants, qu’elle ne crée pas de sessions ni de cookies et qu’elle ne collecte aucune statistique. Toute personne ou entreprise peut déployer une copie isolée de cette application pour ses besoins de communication.<br>Les communications vocales sont chiffrées, et les messages transitent via un canal chiffré SSL. (Dans la prochaine version, la messagerie sera également enveloppée d’une couche de chiffrement supplémentaire client-à-client afin d’empêcher l’accès via des attaques sur les serveurs).<br>Ce qui est actuellement disponible :<br>1. Chat général et chats privés.<br>2. Appels vocaux<br>3. Appels vocaux de groupe<br>4. Multilingue.<br>Quels sont les inconvénients de cette approche ?<br>1. Pas d’historique de conversation. Il n’est pas conservé, même sur votre appareil. Fermez l’onglet et rouvrez-le : tout disparaît.<br>2. Vous ne pouvez pas écrire ou appeler quelqu’un qui n’est pas en ligne. Vos messages ne sont reçus que par les personnes actuellement connectées. Si vous avez écrit à quelqu’un puis que vous et votre interlocuteur vous êtes déconnectés, ces messages n’existent plus. La communication est donc de type « session » : convenez d’un moment à l’avance, discutez, puis quittez. Vous pouvez aussi rester en ligne en permanence.<br>3. Vous ne savez pas forcément avec qui vous échangez. Pour entrer, un pseudonyme arbitraire suffit ; la responsabilité de comprendre l’identité de l’interlocuteur revient donc entièrement à l’utilisateur.<br>4. (Dans la version actuelle) Communication dans un cercle restreint. Vous n’avez pas de liste de contacts personnels. Vous voyez toutes les personnes en ligne ; une seule instance* de l’application n’est donc pas conçue pour un usage massif par des millions, voire des milliers d’utilisateurs. Il existe aussi des limites au nombre de conférences audio pouvant être prises en charge simultanément par le serveur.<br>*Une instance de l’application est une copie qui tourne sur un serveur privé et qui est accessible via une ou plusieurs adresses web ou une adresse IP. Un groupe d’utilisateurs est donc lié uniquement par la connaissance de cette adresse. Le nombre d’instances n’est pas limité.<br>Le développeur de l’application n’est pas responsable de la manière dont elle est utilisée ni des données qui y transitent. Le code de l’application peut être copié et modifié par quiconque pour ses besoins, à condition de conserver un lien vers le dépôt d’origine dans la section « À propos ». Le texte complet de la licence est disponible dans Git.",
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
      replying: 'En réponse',
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
      estConfMax: 'estimation : max ~{users} utilisateurs',
      estCallsMax: 'estimation : max ~{calls} appels 1:1',
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
      about: 'Über',
      close: 'Schließen',
      cancel: 'Abbrechen',
      proceed: 'Fortfahren',
      reply: 'Antworten',
      send: 'Senden',
      settings: 'Einstellungen',
      users: 'Nutzer',
      online: 'Online',
      busy: 'besetzt',
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
      title: 'Über',
      description:
        'Last ist ein kostenloser, anonymer, kurzlebiger Web-Messenger mit offenem Quellcode. Das bedeutet: keine Installation, keine Registrierung, keine Bindung an Telefonnummer, E-Mail oder Namen, keine Speicherung von Logs, Chats oder Logins, keine Sessions oder Cookies und keine Erhebung von Statistiken. Jede Person oder jedes Unternehmen kann eine isolierte Kopie dieser Anwendung für eigene Kommunikationszwecke betreiben.<br>Sprachkommunikation ist verschlüsselt, und Nachrichten werden über einen SSL-verschlüsselten Kanal übertragen. (In der nächsten Version wird die Nachrichtenübertragung zusätzlich in eine weitere Client-zu-Client-Verschlüsselungsschicht eingebettet, um Zugriffe durch Serverangriffe zu verhindern).<br>Derzeit umgesetzt:<br>1. Gruppenchat und private Chats.<br>2. Sprachanrufe<br>3. Gruppen-Sprachanrufe<br>4. Mehrsprachigkeit.<br>Was sind die Nachteile dieses Ansatzes?<br>1. Keine Chat-Historie. Sie wird nicht einmal auf deinem Gerät gespeichert. Tab schließen und neu öffnen – alles ist weg.<br>2. Du kannst niemandem schreiben oder ihn anrufen, der nicht online ist. Nachrichten erhalten nur Personen, die gerade online sind. Wenn du jemandem geschrieben hast und später du und dein Gesprächspartner offline geht, existieren diese Nachrichten nicht mehr. Kommunikation hat also Session-Charakter: vorher verabreden, sprechen und wieder gehen. Du kannst auch einfach dauerhaft online bleiben.<br>3. Du weißt möglicherweise nicht, mit wem genau du sprichst. Für den Einstieg reicht ein beliebiger Nickname – die Verantwortung, die Identität des Gegenübers einzuordnen, liegt vollständig beim Nutzer.<br>4. (In der aktuellen Version) Kommunikation in einem kleinen Kreis. Es gibt keine persönliche Kontaktliste. Du siehst alle, die gerade online sind; eine einzelne App-Instanz* ist daher nicht für die massenhafte Nutzung durch Millionen oder sogar Tausende Nutzer ausgelegt. Außerdem gibt es Grenzen dafür, wie viele Audio-Konferenzen der Server gleichzeitig unterstützen kann.<br>*Eine App-Instanz ist eine Kopie, die auf einem privaten Server läuft und über eine oder mehrere Web-Adressen oder eine IP erreichbar ist. Eine Nutzergruppe wird somit nur durch die Kenntnis dieser Adresse verbunden. Die Anzahl der Instanzen ist nicht begrenzt.<br>Der Entwickler der Anwendung übernimmt keine Verantwortung dafür, wie sie genutzt wird und welche Daten darüber übertragen werden. Der Quellcode der Anwendung darf von jedem für eigene Zwecke kopiert und verändert werden, sofern in der Rubrik „Über“ ein Link zum ursprünglichen Repository erhalten bleibt. Die vollständige Lizenz ist in Git verfügbar.',
      repoLink: 'Git-Repository',
    },
    theme: {
      label: 'Thema: {mode}',
      system: 'System',
      dark: 'Dunkel',
      light: 'Hell',
      toggleAria: 'Thema wechseln',
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
      replying: 'Antworten',
      replyingTo: 'Antwort an {name}',
      replyTo: 'Antwort an {name}',
      joinOngoingTitle: 'Einem laufenden Anruf beitreten?',
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
      requestingToJoinNamed: 'Beitritt zu {name} anfragen…',
      requestingToJoin: 'Beitritt anfragen…',
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
      cancelRequest: 'Anfrage zurückziehen',
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
      estConfMax: 'Schätzung: max. ~{users} Nutzer',
      estCallsMax: 'Schätzung: max. ~{calls} 1:1-Anrufe',
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
      subtitle: 'Без аккаунтов, без cookie, без сохранённых сессий.',
      yourName: 'Ваше имя',
      namePlaceholder: 'напр. Алекс',
      join: 'Присоединиться',
    },
    about: {
      title: 'О приложении',
      description:
        'Last — это анонимный бесплатный эфемерный веб мессенджер с открытым исходным кодом. Это означает, что он не трубет установки и регистрации, не привязан ни к номеру, ни к почте или имени, не сохраняет логи, переписки, логины, не создает сессии, куки и не собирает никакую статистику. Любой человек или компанию могут создать свою изолированную копию это приложения для персональных нужд коммуникации.<br>Голосовое общение зашифровано, а переписка осуществляется через SSL зашифрованный канал. (в следующей версии также будет обернуто в дополнительный слой шифрования клиент-клиент для предостращения доступа посредством атаки серверов).<br>Что на данный момен реализовано:<br>1. Общий чат и приватные чаты.<br>2. Голосовая связь<br>3. Групповая голосовая связь<br>4. Мультиязычность.<br>Какие минусы такого подхода?<br>1. Отсутвие истории переписки. Она не храниться даже на вашем устройстве. Закрыли вкладку и зашли заново - все исчезло.<br>2. Вы не можете написать или позвонить тому, кого нет в сети. Ваши сообщения получают только те, кто сейчас в сети. Если вы кому-то написали, потом вы и ваш собеседник вышли, то этих сообщений больше не существует. Таким образом, связь имеет сессионный характер - договорились с кем-то заранее, пообщались и вышли. Можно и не выходить и просто всегда быть в сети.<br>3. Вы можете не знать к кем именно вы общаетесь. Все, что требуется для входа это произвольный никнейм, поэтому ответственность в понимании личности собеседника лежит полностью на пользователе.<br>4. (в текущей версии) Общение в узком кругу. У вас нет списка личных контактов. Вы видите всех, кто сейчас в сети, поэтому один инстанс* приложения не рассчитан на массовое использование миллионами и даже тысячами пользователей. Также есть ограничения на то, сколько аудио конференций может быть одновременно поддержано сервером.<br>*Инстанс приложения - это его копия, которая работает на любом частном сервере и доступна по одному или нескольким веб-адресам или IP. Таким образом группу пользователей объединяет только знание этого адреса. Количество инстансов не ограниченно.<br>Разработчик приложения не несет ответственности за то каким образом оно используется и какие данные передаются через него. Код приложения может быть скопирован, и изменен кем угодно для своих нужд при условии сохранения ссылки на исходный репозиторий в разделе "О приложении". Полная версия лицензии на использование есть в GIT.',
      repoLink: 'Исходный код',
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
      noOneOnline: 'В сети только вы.',
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
      waitingToJoinNamed: 'Ожидание подключения к {name}…',
      waitingToJoin: 'Ожидание подключения…',
      requestingToJoinNamed: 'Запрос на подключение к {name}…',
      requestingToJoin: 'Запрос на подключение…',
      calling: 'Звоним…',
      callingNamed: 'Звоним {name}…',
      ringing: 'Гудки…',
      ringingNamed: 'Гудки у {name}…',
      inviting: 'Приглашаем…',
      connecting: 'Подключаемся…',
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
      estConfMax: 'оценка: макс. ~{users} пользователей',
      estCallsMax: 'оценка: макс. ~{calls} звонков 1:1',
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
  warnHtmlMessage: false,
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
