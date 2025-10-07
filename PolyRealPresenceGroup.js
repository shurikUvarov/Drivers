const BaseDriver = require('base-driver');

class PolyRealPresenceGroupDriver extends BaseDriver {
  static metadata = {
    name: 'Poly RealPresence Group',
    manufacturer: 'Poly',
    version: '1.0.0',
    description: 'Драйвер для систем видеоконференцсвязи Poly RealPresence Group (300/310/500/700)'
  };

  static commands = {
    setAutoAnswer: {
      description: 'Установить режим автоответа',
      parameters: [
        {
          name: 'mode',
          type: 'string',
          description: 'Режим автоответа',
          required: true,
          enum: ['Yes', 'No', 'Do Not Disturb']
        }
      ]
    },
    getAutoAnswer: {
      description: 'Получить текущий режим автоответа',
      parameters: []
    },

    setVolume: {
      description: 'Установить уровень громкости',
      parameters: [
        {
          name: 'level',
          type: 'number',
          description: 'Громкость (0-50)',
          required: true,
          min: 0,
          max: 50
        }
      ]
    },
    getVolume: {
      description: 'Получить текущий уровень громкости',
      parameters: []
    },

    setTransmitMute: {
      description: 'Включить/выключить микрофон (near mute)',
      parameters: [
        {
          name: 'value',
          type: 'boolean',
          description: 'true = mute on, false = mute off',
          required: true
        }
      ]
    },
    getTransmitMute: {
      description: 'Получить состояние микрофона (near mute)',
      parameters: []
    },

    setVideoMute: {
      description: 'Включить/выключить видеозаглушку (near videomute)',
      parameters: [
        {
          name: 'value',
          type: 'boolean',
          description: 'true = videomute on, false = off',
          required: true
        }
      ]
    },
    getVideoMute: {
      description: 'Получить состояние видеозаглушки (near videomute)',
      parameters: []
    },

    dialAuto: {
      description: 'Набор номера (авто-режим)',
      parameters: [
        {
          name: 'number',
          type: 'string',
          description: 'Номер/адрес для набора',
          required: true
        }
      ]
    },
    answerCall: {
      description: 'Ответить на входящий видеовызов',
      parameters: []
    },
    hangupAll: {
      description: 'Завершить все вызовы',
      parameters: []
    },

    getFirmware: {
      description: 'Получить версию ПО',
      parameters: []
    },
    getCallInfo: {
      description: 'Запросить информацию о звонках',
      parameters: []
    },

    // Presentation / Content control
    setAutoShowContent: {
      description: 'Включить/выключить авто-показ контента',
      parameters: [
        { name: 'mode', type: 'string', description: 'On/Off', required: true, enum: ['On', 'Off'] }
      ]
    },
    getAutoShowContent: {
      description: 'Получить состояние авто-показа контента',
      parameters: []
    },

    setContentNear: {
      description: 'Начать передачу контента с локального источника',
      parameters: [
        { name: 'source', type: 'string', description: 'Источник контента', required: true, enum: ['1', '2', '3', '4', '6'] }
      ]
    },
    stopContentNear: {
      description: 'Остановить передачу локального контента',
      parameters: []
    },

    setContentFar: {
      description: 'Управление контентом на дальнем конце',
      parameters: [
        { name: 'action', type: 'string', description: 'Действие', required: true, enum: ['Play', 'Stop'] }
      ]
    },
    getContentSource: {
      description: 'Получить текущий источник контента (near)',
      parameters: []
    },
    registerPresentationEvents: {
      description: 'Регистрация событий презентации',
      parameters: []
    },
    getPresentationStatus: {
      description: 'Запрос статуса презентации (через регистрацию событий)',
      parameters: []
    },

    // Camera NEAR controls
    setCameraNearPanTilt: {
      description: 'Движение камеры NEAR (пан/тилт)',
      parameters: [
        { name: 'direction', type: 'string', required: true, enum: ['Left', 'Right', 'Up', 'Down', 'Stop'] }
      ]
    },
    setCameraNearZoom: {
      description: 'Зум камеры NEAR',
      parameters: [
        { name: 'action', type: 'string', required: true, enum: ['Zoom+', 'Zoom-', 'Stop'] }
      ]
    },
    setCameraNearSource: {
      description: 'Выбор локальной камеры NEAR',
      parameters: [
        { name: 'source', type: 'string', required: true, enum: ['1', '2', '3', '4'] }
      ]
    },
    getCameraNearSource: { description: 'Статус локальной камеры NEAR', parameters: [] },
    getCameraNearPosition: { description: 'Позиция NEAR (pan/tilt/zoom)', parameters: [] },
    setCameraNearPosition: {
      description: 'Установить позицию NEAR',
      parameters: [
        { name: 'pan', type: 'number', required: true },
        { name: 'tilt', type: 'number', required: true },
        { name: 'zoom', type: 'number', required: true }
      ]
    },
    setCameraNearTracking: {
      description: 'Трекинг камеры NEAR (on/off)',
      parameters: [ { name: 'value', type: 'string', required: true, enum: ['On', 'Off'] } ]
    },
    getCameraNearTracking: { description: 'Статус трекинга NEAR', parameters: [] },
    setCameraNearTrackingMode: {
      description: 'Режим трекинга NEAR',
      parameters: [ { name: 'mode', type: 'string', required: true, enum: ['Speaker', 'Group', 'Group with Transition', 'Off'] } ]
    },
    getCameraNearTrackingMode: { description: 'Текущий режим трекинга NEAR', parameters: [] },

    // Camera FAR controls
    setCameraFarPanTilt: {
      description: 'Движение камеры FAR (пан/тилт)',
      parameters: [
        { name: 'direction', type: 'string', required: true, enum: ['Left', 'Right', 'Up', 'Down', 'Stop'] }
      ]
    },
    setCameraFarZoom: {
      description: 'Зум камеры FAR',
      parameters: [
        { name: 'action', type: 'string', required: true, enum: ['Zoom+', 'Zoom-', 'Stop'] }
      ]
    },
    setCameraFarSource: {
      description: 'Выбор камеры FAR',
      parameters: [
        { name: 'source', type: 'string', required: true, enum: ['1', '2', '3', '4'] }
      ]
    },
    getCameraFarSource: { description: 'Статус камеры FAR', parameters: [] },

    // PIP / Selfview / Dual / Multipoint / DTMF / VideoFormat / Levels
    setPipLocation: {
      description: 'Выбор расположения PIP',
      parameters: [
        { name: 'location', type: 'string', required: true, enum: ['Lower Left','Lower Right','Upper Left','Upper Right','Top','Right','Bottom','Side by Side','Fullscreen'] }
      ]
    },
    getPipLocation: { description: 'Текущая позиция PIP', parameters: [] },

    setSelfview: {
      description: 'Selfview On/Off/Auto',
      parameters: [ { name: 'mode', type: 'string', required: true, enum: ['On', 'Off', 'Auto'] } ]
    },
    getSelfview: { description: 'Статус Selfview', parameters: [] },

    setDualMonitor: {
      description: 'Включить/выключить DualMonitor',
      parameters: [ { name: 'value', type: 'string', required: true, enum: ['Yes', 'No'] } ]
    },
    getDualMonitor: { description: 'Статус DualMonitor', parameters: [] },

    setMultipointMode: {
      description: 'Режим многоточечного соединения',
      parameters: [ { name: 'mode', type: 'string', required: true, enum: ['Auto', 'Discussion', 'Presentation', 'Fullscreen'] } ]
    },
    getMultipointMode: { description: 'Текущий режим многоточечного соединения', parameters: [] },

    setMultipointAutoAnswer: {
      description: 'MP AutoAnswer',
      parameters: [ { name: 'mode', type: 'string', required: true, enum: ['Yes', 'No', 'Do Not Disturb'] } ]
    },
    getMultipointAutoAnswer: { description: 'Статус MP AutoAnswer', parameters: [] },

    sendDtmf: {
      description: 'Отправить DTMF тон',
      parameters: [ { name: 'digit', type: 'string', required: true, enum: ['0','1','2','3','4','5','6','7','8','9','*','#'] } ]
    },

    getVideoFormatStatus: {
      description: 'Статус видеоформата монитора',
      parameters: [ { name: 'monitor', type: 'string', required: true, enum: ['1','2','3'] } ]
    },

    setTransmitLevel: {
      description: 'Установить уровень передачи аудио (-20..30)',
      parameters: [ { name: 'level', type: 'number', required: true, min: -20, max: 30 } ]
    },
    getTransmitLevel: { description: 'Статус уровня передачи аудио', parameters: [] }
  };

  static responses = {
    autoAnswerStatus: {
      description: 'Статус автоответа',
      matcher: {
        pattern: /(mpautoanswer|autoanswer)\s+(yes|no|donotdisturb)/i
      },
      extract: function (match) {
        const valueMap = { yes: 'Yes', no: 'No', donotdisturb: 'Do Not Disturb' };
        return {
          type: 'autoAnswerStatus',
          scope: match[1].toLowerCase() === 'mpautoanswer' ? 'multipoint' : 'single',
          autoAnswer: valueMap[match[2].toLowerCase()]
        };
      }
    },
    volumeStatus: {
      description: 'Текущая громкость',
      matcher: {
        pattern: /volume\s+(\d+)/i
      },
      extract: function (match) {
        return {
          type: 'volumeStatus',
          volume: parseInt(match[1], 10)
        };
      }
    },
    transmitMuteStatus: {
      description: 'Состояние микрофона (near)',
      matcher: {
        pattern: /mute\s+near\s+(on|off)/i
      },
      extract: function (match) {
        const on = match[1].toLowerCase() === 'on';
        return {
          type: 'transmitMuteStatus',
          transmitMute: on,
          state: on ? 'On' : 'Off'
        };
      }
    },
    videoMuteStatus: {
      description: 'Состояние видеозаглушки (near)',
      matcher: {
        pattern: /videomute\s+near\s+(on|off)/i
      },
      extract: function (match) {
        const on = match[1].toLowerCase() === 'on';
        return {
          type: 'videoMuteStatus',
          videoMute: on,
          state: on ? 'On' : 'Off'
        };
      }
    },
    firmwareVersion: {
      description: 'Версия ПО',
      matcher: {
        pattern: /Software\s+Version:\s+([\d.]+)/i
      },
      extract: function (match) {
        return {
          type: 'firmware',
          version: match[1]
        };
      }
    },
    callState: {
      description: 'Состояние вызова',
      matcher: {
        pattern: /(active:\s*call|ended:\s*call|incoming:\s*call)/i
      },
      extract: function (match) {
        const raw = match[1].toLowerCase();
        let state = 'Unknown';
        if (raw.includes('active')) state = 'Active';
        else if (raw.includes('ended')) state = 'Inactive';
        else if (raw.includes('incoming')) state = 'Incoming';
        return { type: 'callState', state };
      }
    },
    callInfoBlock: {
      description: 'Блок информации о вызовах',
      matcher: {
        pattern: /callinfo\s+begin[\s\S]+callinfo\s+end/i
      },
      extract: function (match) {
        return {
          type: 'callInfo',
          raw: match[0]
        };
      }
    },
    // Presentation responses
    autoShowContentStatus: {
      description: 'Состояние авто-показа контента',
      matcher: {
        pattern: /autoshowcontent\s+(on|off)/i
      },
      extract: function (match) {
        const on = match[1].toLowerCase() === 'on';
        return {
          type: 'autoShowContent',
          autoShowContent: on ? 'On' : 'Off'
        };
      }
    },
    contentSourceStatus: {
      description: 'Текущий источник контента (near)',
      matcher: {
        pattern: /vcbutton\s+source\s+get\s+([12346]|none)/i
      },
      extract: function (match) {
        const v = match[1].toLowerCase();
        return {
          type: 'contentSource',
          source: v === 'none' ? 'Stop' : match[1]
        };
      }
    },
    presentationAlreadyActive: {
      description: 'Регистрация событий презентации уже активна',
      matcher: {
        pattern: /already\s+active:vcbutton/i
      },
      extract: function () {
        return { type: 'presentationStatus', status: 'Registered' };
      }
    },
    presentationStatus: {
      description: 'Событие статуса презентации',
      matcher: {
        pattern: /vcbutton\s+(farplay|farstop|stop|play)/i
      },
      extract: function (match) {
        const action = match[1].toLowerCase();
        const map = {
          farplay: { status: 'Far Play', origin: 'far', playing: true },
          farstop: { status: 'Far Stop', origin: 'far', playing: false },
          play: { status: 'Near Play', origin: 'near', playing: true },
          stop: { status: 'Stop', origin: 'near', playing: false }
        };
        const info = map[action] || { status: 'Unknown' };
        return Object.assign({ type: 'presentationStatus', action }, info);
      }
    },
    // Camera / PIP / Selfview / Dual / Multipoint / VideoFormat / Levels responses
    cameraNearSourceStatus: {
      description: 'Источник камеры NEAR',
      matcher: { pattern: /camera\s+near\s+source\s+(-?\d+)/i },
      extract: function (match) {
        const v = match[1];
        return { type: 'cameraNearSource', source: v === '-1' ? 'Unavailable' : v };
      }
    },
    cameraFarSourceStatus: {
      description: 'Источник камеры FAR',
      matcher: { pattern: /camera\s+far\s+source\s+(-?\d+)/i },
      extract: function (match) {
        const v = match[1];
        return { type: 'cameraFarSource', source: v === '-1' ? 'Unavailable' : v };
      }
    },
    cameraNearPositionStatus: {
      description: 'Позиция камеры NEAR (pan/tilt/zoom)',
      matcher: { pattern: /camera\s+near\s+position\s+(-?\d+)\s+(-?\d+)\s+(-?\d+)/i },
      extract: function (match) {
        return {
          type: 'cameraNearPosition',
          pan: parseInt(match[1], 10),
          tilt: parseInt(match[2], 10),
          zoom: parseInt(match[3], 10)
        };
      }
    },
    cameraNearTrackingStatus: {
      description: 'Трекинг камеры NEAR',
      matcher: { pattern: /camera\s+near\s+tracking\s+(on|off|voice|groupframe|framespeaker|framegroup|framegroupwithtransition)/i },
      extract: function (match) {
        const m = match[1].toLowerCase();
        const map = {
          on: 'On', off: 'Off', voice: 'Voice', groupframe: 'GroupFrame', framespeaker: 'SpeakerFrame', framegroup: 'GroupFrame', framegroupwithtransition: 'GroupFrame with Transition'
        };
        return { type: 'cameraNearTracking', tracking: map[m] || 'Off' };
      }
    },
    cameraNearTrackingModeStatus: {
      description: 'Режим трекинга NEAR',
      matcher: { pattern: /cameratracking\s+near\s+(off|speaker|group|groupwithtransition)/i },
      extract: function (match) {
        const m = match[1].toLowerCase();
        const map = { off: 'Off', speaker: 'Speaker', group: 'Group', groupwithtransition: 'Group with Transition' };
        return { type: 'cameraNearTrackingMode', mode: map[m] };
      }
    },
    pipLocationStatus: {
      description: 'Текущая позиция PIP',
      matcher: { pattern: /configlayout\s+monitor1\s+(pip_lower_left|pip_lower_right|pip_upper_left|pip_upper_right|pip_top|pip_right|pip_bottom|side_by_side|full_screen)/i },
      extract: function (match) {
        const map = {
          pip_lower_left: 'Lower Left', pip_lower_right: 'Lower Right', pip_upper_left: 'Upper Left', pip_upper_right: 'Upper Right',
          pip_top: 'Top', pip_right: 'Right', pip_bottom: 'Bottom', side_by_side: 'Side by Side', full_screen: 'Fullscreen'
        };
        return { type: 'pipLocation', location: map[match[1]] };
      }
    },
    selfviewStatus: {
      description: 'Selfview статус',
      matcher: { pattern: /systemsetting\s+selfview\s+(on|off|auto)/i },
      extract: function (match) {
        const m = match[1].toLowerCase();
        const map = { on: 'On', off: 'Off', auto: 'Auto' };
        return { type: 'selfview', mode: map[m] };
      }
    },
    dualMonitorStatus: {
      description: 'DualMonitor статус',
      matcher: { pattern: /dualmonitor\s+(yes|no)/i },
      extract: function (match) {
        return { type: 'dualMonitor', value: match[1].toLowerCase() === 'yes' ? 'Yes' : 'No' };
      }
    },
    multipointModeStatus: {
      description: 'MP режим',
      matcher: { pattern: /mpmode\s+(auto|discussion|presentation|fullscreen)/i },
      extract: function (match) {
        const m = match[1].toLowerCase();
        return { type: 'multipointMode', mode: m.charAt(0).toUpperCase() + m.slice(1) };
      }
    },
    videoFormatStatus: {
      description: 'Статус видеоформата монитора',
      matcher: { pattern: /configdisplay\s+monitor([1-3])\s+([\w ]+)/i },
      extract: function (match) {
        return { type: 'videoFormatStatus', monitor: match[1], value: match[2].trim() };
      }
    },
    transmitLevelStatus: {
      description: 'Уровень передачи аудио',
      matcher: { pattern: /audiotransmitlevel\s+(-?\d+)/i },
      extract: function (match) {
        return { type: 'transmitLevel', level: parseInt(match[1], 10) };
      }
    },
    muteFarStatus: {
      description: 'Mute FAR статус',
      matcher: { pattern: /mute\s+far\s+(on|off)/i },
      extract: function (match) {
        const on = match[1].toLowerCase() === 'on';
        return { type: 'muteFar', value: on ? 'On' : 'Off' };
      }
    },
    error: {
      description: 'Сообщение об ошибке',
      matcher: {
        pattern: /error:\s*(.+)/i
      },
      extract: function (match) {
        return {
          type: 'error',
          message: match[1].trim()
        };
      }
    }
  };

  initialize() {
    this.publishCommand('getVolume');
    this.publishCommand('getTransmitMute');
    this.publishCommand('getVideoMute');
    this.publishCommand('getAutoAnswer');
    this.publishCommand('getFirmware');
    // Presentation init
    this.publishCommand('registerPresentationEvents');
    this.publishCommand('getContentSource');
    this.publishCommand('getAutoShowContent');
    // Camera / Others init
    this.publishCommand('getCameraNearSource');
    this.publishCommand('getCameraNearPosition');
    this.publishCommand('getCameraNearTracking');
    this.publishCommand('getCameraNearTrackingMode');
    this.publishCommand('getCameraFarSource');
    this.publishCommand('getPipLocation');
    this.publishCommand('getSelfview');
    this.publishCommand('getDualMonitor');
    this.publishCommand('getMultipointMode');
    this.publishCommand('getMultipointAutoAnswer');
    this.publishCommand('getTransmitLevel');
    this.publishCommand('getVideoFormatStatus', { monitor: '1' });
  }

  setAutoAnswer(params) {
    const { mode } = params;
    const mapping = { 'Yes': 'yes', 'No': 'no', 'Do Not Disturb': 'donotdisturb' };
    const value = mapping[mode];
    this.state.autoAnswer = mode;
    return { payload: `autoanswer ${value}\r\n` };
  }

  getAutoAnswer() {
    return { payload: 'autoanswer get\r\n' };
  }

  setVolume(params) {
    const { level } = params;
    const safe = Math.max(0, Math.min(50, Number(level)));
    this.state.volume = safe;
    return { payload: `volume set ${safe}\r\n` };
  }

  getVolume() {
    return { payload: 'volume get\r\n' };
  }

  setTransmitMute(params) {
    const { value } = params;
    this.state.transmitMute = !!value;
    return { payload: `mute near ${value ? 'on' : 'off'}\r\n` };
  }

  getTransmitMute() {
    return { payload: 'mute near get\r\n' };
  }

  setVideoMute(params) {
    const { value } = params;
    this.state.videoMute = !!value;
    return { payload: `videomute near ${value ? 'on' : 'off'}\r\n` };
  }

  getVideoMute() {
    return { payload: 'videomute near get\r\n' };
  }

  dialAuto(params) {
    const { number } = params;
    return { payload: `dial auto "${number}"\r\n` };
  }

  answerCall() {
    return { payload: 'answer video\r\n' };
  }

  hangupAll() {
    return { payload: 'hangup all\r\n' };
  }

  getFirmware() {
    return { payload: 'whoami\r\n' };
  }

  getCallInfo() {
    return { payload: 'callinfo all\r\n' };
  }

  // Presentation / Content control methods
  setAutoShowContent(params) {
    const { mode } = params;
    const val = mode === 'On' ? 'on' : 'off';
    this.state.autoShowContent = mode;
    return { payload: `autoshowcontent ${val}\r\n` };
  }

  getAutoShowContent() {
    return { payload: 'autoshowcontent get\r\n' };
  }

  setContentNear(params) {
    const { source } = params;
    this.state.content = { origin: 'near', source };
    return { payload: `vcbutton play ${source}\r\n` };
  }

  stopContentNear() {
    this.state.content = { origin: 'near', source: 'Stop' };
    return { payload: 'vcbutton stop\r\n' };
  }

  setContentFar(params) {
    const { action } = params;
    const cmd = action === 'Play' ? 'farplay' : 'farstop';
    this.state.contentFarRequested = action;
    return { payload: `vcbutton ${cmd}\r\n` };
  }

  getContentSource() {
    return { payload: 'vcbutton source get\r\n' };
  }

  registerPresentationEvents() {
    return { payload: 'vcbutton register\r\n' };
  }

  getPresentationStatus() {
    // Используем регистрацию событий для получения актуального статуса
    return { payload: 'vcbutton register\r\n' };
  }

  // Camera NEAR
  setCameraNearPanTilt(params) {
    const { direction } = params;
    return { payload: `camera near move ${direction.toLowerCase()}\r\n` };
  }
  setCameraNearZoom(params) {
    const { action } = params;
    return { payload: `camera near move ${action.toLowerCase()}\r\n` };
  }
  setCameraNearSource(params) {
    const { source } = params;
    return { payload: `camera near ${source}\r\n` };
  }
  getCameraNearSource() { return { payload: 'camera near source\r\n' }; }
  getCameraNearPosition() { return { payload: 'camera near getposition\r\n' }; }
  setCameraNearPosition(params) {
    const { pan, tilt, zoom } = params;
    return { payload: `camera near setposition ${pan} ${tilt} ${zoom}\r\n` };
  }
  setCameraNearTracking(params) {
    const { value } = params; // On/Off
    return { payload: `camera near tracking ${value.toLowerCase()}\r\n` };
  }
  getCameraNearTracking() { return { payload: 'camera near tracking get\r\n' }; }
  setCameraNearTrackingMode(params) {
    const { mode } = params;
    const map = { 'Speaker': 'speaker', 'Group': 'group', 'Group with Transition': 'groupwithtransition', 'Off': 'off' };
    return { payload: `cameratracking near mode ${map[mode]}\r\n` };
  }
  getCameraNearTrackingMode() { return { payload: 'cameratracking near mode get\r\n' }; }

  // Camera FAR
  setCameraFarPanTilt(params) {
    const { direction } = params;
    return { payload: `camera far move ${direction.toLowerCase()}\r\n` };
  }
  setCameraFarZoom(params) {
    const { action } = params;
    return { payload: `camera far move ${action.toLowerCase()}\r\n` };
  }
  setCameraFarSource(params) {
    const { source } = params;
    return { payload: `camera far ${source}\r\n` };
  }
  getCameraFarSource() { return { payload: 'camera far source\r\n' }; }

  // PIP
  setPipLocation(params) {
    const { location } = params;
    const map = {
      'Lower Left': 'pip_lower_left',
      'Lower Right': 'pip_lower_right',
      'Upper Left': 'pip_upper_left',
      'Upper Right': 'pip_upper_right',
      'Top': 'pip_top',
      'Right': 'pip_right',
      'Bottom': 'pip_bottom',
      'Side by Side': 'side_by_side',
      'Fullscreen': 'full_screen'
    };
    return { payload: `configlayout monitor1 ${map[location]}\r\n` };
  }
  getPipLocation() { return { payload: 'configlayout monitor1 get\r\n' }; }

  // Selfview
  setSelfview(params) {
    const { mode } = params; // On/Off/Auto
    return { payload: `systemsetting selfview ${mode.toLowerCase()}\r\n` };
  }
  getSelfview() { return { payload: 'systemsetting get selfview\r\n' }; }

  // DualMonitor
  setDualMonitor(params) {
    const { value } = params; // Yes/No
    return { payload: `dualmonitor ${value.toLowerCase()}\r\n` };
  }
  getDualMonitor() { return { payload: 'dualmonitor get\r\n' }; }

  // Multipoint
  setMultipointMode(params) {
    const { mode } = params;
    return { payload: `mpmode ${mode.toLowerCase()}\r\n` };
  }
  getMultipointMode() { return { payload: 'mpmode get\r\n' }; }

  setMultipointAutoAnswer(params) {
    const { mode } = params; // Yes/No/Do Not Disturb
    const map = { 'Yes': 'yes', 'No': 'no', 'Do Not Disturb': 'donotdisturb' };
    return { payload: `mpautoanswer ${map[mode]}\r\n` };
  }
  getMultipointAutoAnswer() { return { payload: 'mpautoanswer get\r\n' }; }

  // DTMF
  sendDtmf(params) {
    const { digit } = params;
    return { payload: `gendial ${digit}\r\n` };
  }

  // Video format status
  getVideoFormatStatus(params) {
    const { monitor } = params; // '1'|'2'|'3'
    const map = { '1': 'monitor1', '2': 'monitor2', '3': 'monitor3' };
    return { payload: `configdisplay ${map[monitor]} get\r\n` };
  }

  // Transmit level
  setTransmitLevel(params) {
    const { level } = params;
    const safe = Math.max(-20, Math.min(30, Number(level)));
    return { payload: `audiotransmitlevel set ${safe}\r\n` };
  }
  getTransmitLevel() { return { payload: 'audiotransmitlevel get\r\n' }; }

  parseResponse(data) {
    try {
      let raw = data;
      if (data && Object.prototype.hasOwnProperty.call(data, 'payload')) {
        raw = data.payload;
      }
      if (Buffer.isBuffer(raw)) raw = raw.toString();
      if (typeof raw !== 'string') raw = String(raw ?? '');

      const results = [];
      const defs = this.constructor.responses || {};

      const tryMatch = (text) => {
        for (const [name, def] of Object.entries(defs)) {
          if (!def || !def.matcher || !def.matcher.pattern) continue;
          const pattern = def.matcher.pattern;
          const localRegex = new RegExp(pattern.source, pattern.flags);
          const match = text.match(localRegex);
          if (match) {
            let payload = def.extract ? def.extract(match) : { type: name, raw: match[0] };
            if (payload && !payload.type) payload.type = name;
            results.push(payload);
          }
        }
      };

      // Сначала пытаемся распознать многострочные блоки
      tryMatch(raw);
      // Затем построчно
      const lines = raw.split(/\r?\n/).filter(Boolean);
      lines.forEach((line) => tryMatch(line));

      if (results.length === 0) return null;
      if (results.length === 1) return results[0];
      return results;
    } catch (error) {
      return {
        type: 'error',
        message: error.message,
        raw: (data && data.payload) ? data.payload : data
      };
    }
  }
}

module.exports = PolyRealPresenceGroupDriver;


