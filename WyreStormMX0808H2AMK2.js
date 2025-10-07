const BaseDriver = require('base-driver');

/**
 * Драйвер для матричного коммутатора MX-0808-H2A-MK2
 */
class MX0808H2AMK2Driver extends BaseDriver {
  // Метаданные драйвера
  static metadata = {
    name: 'MX-0808-H2A-MK2',
    manufacturer: 'WyreStorm',
    version: '1.0.0',
    description: 'Драйвер для матричного коммутатора MX-0808-H2A-MK2'
  };

  // Определение команд
  static commands = {
    // Управление видео
    setVideoSwitch: {
      description: 'Переключение видеовхода на выход',
      parameters: [
        {
          name: 'input',
          type: 'string',
          description: 'Источник: hdmiin1–hdmiin8 или hdmiin0 (выкл)',
          required: true,
          enum: ['hdmiin0', 'hdmiin1', 'hdmiin2', 'hdmiin3', 'hdmiin4', 'hdmiin5', 'hdmiin6', 'hdmiin7', 'hdmiin8']
        },
        {
          name: 'output',
          type: 'string',
          description: 'Выход: hdmiout1–hdmiout8 или all',
          required: true,
          enum: ['hdmiout1', 'hdmiout2', 'hdmiout3', 'hdmiout4', 'hdmiout5', 'hdmiout6', 'hdmiout7', 'hdmiout8', 'all']
        }
      ]
    },
    getVideoMapping: {
      description: 'Запрос текущего подключения видео',
      parameters: [
        {
          name: 'output',
          type: 'string',
          description: 'Выход: hdmiout1–hdmiout8',
          required: true,
          enum: ['hdmiout1', 'hdmiout2', 'hdmiout3', 'hdmiout4', 'hdmiout5', 'hdmiout6', 'hdmiout7', 'hdmiout8']
        }
      ]
    },

    // Управление аудио
    setAudioSwitchMode: {
      description: 'Установка режима аудио (только для совместимых моделей)',
      parameters: [
        {
          name: 'mode',
          type: 'string',
          description: 'followvm или independent',
          required: true,
          enum: ['followvm', 'independent']
        }
      ]
    },
    setAudioSwitch: {
      description: 'Переключение аудио (только в режиме independent)',
      parameters: [
        {
          name: 'input',
          type: 'string',
          description: 'Источник: hdmiin1–hdmiin8',
          required: true,
          enum: ['hdmiin1', 'hdmiin2', 'hdmiin3', 'hdmiin4', 'hdmiin5', 'hdmiin6', 'hdmiin7', 'hdmiin8']
        },
        {
          name: 'output',
          type: 'string',
          description: 'Выход: audioout1–audioout8 или all',
          required: true,
          enum: ['audioout1', 'audioout2', 'audioout3', 'audioout4', 'audioout5', 'audioout6', 'audioout7', 'audioout8', 'all']
        }
      ]
    },
    getAudioMapping: {
      description: 'Запрос текущего подключения аудио',
      parameters: [
        {
          name: 'output',
          type: 'string',
          description: 'Выход: audioout1–audioout8',
          required: true,
          enum: ['audioout1', 'audioout2', 'audioout3', 'audioout4', 'audioout5', 'audioout6', 'audioout7', 'audioout8']
        }
      ]
    },
    setMute: {
      description: 'Отключение/включение звука (не поддерживается на MK2)',
      parameters: [
        {
          name: 'output',
          type: 'string',
          description: 'Выход: audioout1–audioout8 или all',
          required: true,
          enum: ['audioout1', 'audioout2', 'audioout3', 'audioout4', 'audioout5', 'audioout6', 'audioout7', 'audioout8', 'all']
        },
        {
          name: 'state',
          type: 'string',
          description: 'on = отключить, off = включить',
          required: true,
          enum: ['on', 'off']
        }
      ]
    },
    getMuteState: {
      description: 'Запрос состояния отключения звука',
      parameters: [
        {
          name: 'output',
          type: 'string',
          description: 'Выход: audioout1–audioout8',
          required: true,
          enum: ['audioout1', 'audioout2', 'audioout3', 'audioout4', 'audioout5', 'audioout6', 'audioout7', 'audioout8']
        }
      ]
    },
    setAudioDeembedType: {
      description: 'Установка типа деэмбеддинга аудио (только MK2)',
      parameters: [
        {
          name: 'type',
          type: 'string',
          description: 'Тип аудио: hdmi или arc',
          required: true,
          enum: ['hdmi', 'arc']
        },
        {
          name: 'output',
          type: 'string',
          description: 'Выход: audioout1–audioout8',
          required: true,
          enum: ['audioout1', 'audioout2', 'audioout3', 'audioout4', 'audioout5', 'audioout6', 'audioout7', 'audioout8']
        }
      ]
    },
    getAudioDeembedType: {
      description: 'Запрос типа деэмбеддинга аудио (только MK2)',
      parameters: [
        {
          name: 'output',
          type: 'string',
          description: 'Выход: audioout1–audioout8',
          required: true,
          enum: ['audioout1', 'audioout2', 'audioout3', 'audioout4', 'audioout5', 'audioout6', 'audioout7', 'audioout8']
        }
      ]
    },

    // Сцены
    savePreset: {
      description: 'Сохранение сцены',
      parameters: [
        {
          name: 'preset',
          type: 'number',
          description: 'Номер сцены: 1–3',
          required: true,
          min: 1,
          max: 3
        }
      ]
    },
    restorePreset: {
      description: 'Восстановление сцены',
      parameters: [
        {
          name: 'preset',
          type: 'number',
          description: 'Номер сцены: 1–3',
          required: true,
          min: 1,
          max: 3
        }
      ]
    },

    // CEC управление питанием
    setCECPower: {
      description: 'Включение/выключение дисплея через CEC',
      parameters: [
        {
          name: 'output',
          type: 'string',
          description: 'Выход: hdmiout1–hdmiout8 или all',
          required: true,
          enum: ['hdmiout1', 'hdmiout2', 'hdmiout3', 'hdmiout4', 'hdmiout5', 'hdmiout6', 'hdmiout7', 'hdmiout8', 'all']
        },
        {
          name: 'state',
          type: 'string',
          description: 'on = включить, off = выключить',
          required: true,
          enum: ['on', 'off']
        }
      ]
    },
    setAutoCECFunction: {
      description: 'Включение автоматического CEC включения',
      parameters: [
        {
          name: 'output',
          type: 'string',
          description: 'Выход: hdmiout1–hdmiout8 или all',
          required: true,
          enum: ['hdmiout1', 'hdmiout2', 'hdmiout3', 'hdmiout4', 'hdmiout5', 'hdmiout6', 'hdmiout7', 'hdmiout8', 'all']
        },
        {
          name: 'state',
          type: 'string',
          description: 'on = включить, off = выключить',
          required: true,
          enum: ['on', 'off']
        }
      ]
    },
    getAutoCECFunction: {
      description: 'Запрос состояния AUTOCEC',
      parameters: [
        {
          name: 'output',
          type: 'string',
          description: 'Выход: hdmiout1–hdmiout8 или all',
          required: true,
          enum: ['hdmiout1', 'hdmiout2', 'hdmiout3', 'hdmiout4', 'hdmiout5', 'hdmiout6', 'hdmiout7', 'hdmiout8', 'all']
        }
      ]
    },
    setAutoCECDelay: {
      description: 'Установка задержки выключения CEC (в минутах)',
      parameters: [
        {
          name: 'output',
          type: 'string',
          description: 'Выход: hdmiout1–hdmiout8 или all',
          required: true,
          enum: ['hdmiout1', 'hdmiout2', 'hdmiout3', 'hdmiout4', 'hdmiout5', 'hdmiout6', 'hdmiout7', 'hdmiout8', 'all']
        },
        {
          name: 'delay',
          type: 'number',
          description: 'Задержка: 1–30 минут',
          required: true,
          min: 1,
          max: 30
        }
      ]
    },
    getAutoCECDelay: {
      description: 'Запрос задержки выключения CEC',
      parameters: [
        {
          name: 'output',
          type: 'string',
          description: 'Выход: hdmiout1–hdmiout8 или all',
          required: true,
          enum: ['hdmiout1', 'hdmiout2', 'hdmiout3', 'hdmiout4', 'hdmiout5', 'hdmiout6', 'hdmiout7', 'hdmiout8', 'all']
        }
      ]
    },
    sendCustomCECCommand: {
      description: 'Отправка пользовательской CEC-команды (только MX-0808-H2A-MK2)',
      parameters: [
        {
          name: 'output',
          type: 'string',
          description: 'Выход: hdmiout1–hdmiout8',
          required: true,
          enum: ['hdmiout1', 'hdmiout2', 'hdmiout3', 'hdmiout4', 'hdmiout5', 'hdmiout6', 'hdmiout7', 'hdmiout8']
        },
        {
          name: 'command',
          type: 'string',
          description: 'HEX-команда до 16 символов',
          required: true
        }
      ]
    },

    // Standby
    standby: {
      description: 'Перевод в режим низкого энергопотребления',
      parameters: []
    },
    wake: {
      description: 'Выход из режима Standby',
      parameters: []
    },
    getStandbyStatus: {
      description: 'Запрос статуса Standby',
      parameters: []
    },

    // ИК-код
    setIRSystemCode: {
      description: 'Установка ИК-режима',
      parameters: [
        {
          name: 'mode',
          type: 'string',
          description: 'Режим: mode1, mode2 или all',
          required: true,
          enum: ['mode1', 'mode2', 'all']
        }
      ]
    },
    getIRSystemCode: {
      description: 'Запрос текущего ИК-режима',
      parameters: []
    },

    // Диагностика
    getIP: {
      description: 'Запрос IP-адреса',
      parameters: []
    },
    getFirmwareVersion: {
      description: 'Запрос версии прошивки',
      parameters: []
    },
    reboot: {
      description: 'Перезагрузка устройства',
      parameters: []
    },
    reset: {
      description: 'Сброс к заводским настройкам',
      parameters: []
    }
  };

  // Обработчики ответов
  static responses = {
    // Видео
    videoSwitchResponse: {
      description: 'Ответ на переключение видео',
      matcher: {
        pattern: /^SW (hdmiin\d+) (hdmiout\d+|all)$/
      },
      extract: function(match) {
        return {
          type: 'videoSwitch',
          input: match[1],
          output: match[2]
        };
      }
    },
    videoMappingResponse: {
      description: 'Ответ на запрос подключения видео',
      matcher: {
        pattern: /^MP (hdmiin\d+) (hdmiout\d+)$/
      },
      extract: function(match) {
        return {
          type: 'videoMapping',
          input: match[1],
          output: match[2]
        };
      }
    },

    // Аудио
    audioSwitchModeResponse: {
      description: 'Ответ на установку режима аудио',
      matcher: {
        pattern: /^AUDIOSW_M (followvm|independent)$/
      },
      extract: function(match) {
        return {
          type: 'audioSwitchMode',
          mode: match[1]
        };
      }
    },
    audioSwitchResponse: {
      description: 'Ответ на переключение аудио',
      matcher: {
        pattern: /^AUDIOSW (hdmiin\d+) (audioout\d+|all)$/
      },
      extract: function(match) {
        return {
          type: 'audioSwitch',
          input: match[1],
          output: match[2]
        };
      }
    },
    audioMappingResponse: {
      description: 'Ответ на запрос подключения аудио',
      matcher: {
        pattern: /^AUDIOMP (hdmiin\d+) (audioout\d+)$/
      },
      extract: function(match) {
        return {
          type: 'audioMapping',
          input: match[1],
          output: match[2]
        };
      }
    },
    muteResponse: {
      description: 'Ответ на отключение/включение звука',
      matcher: {
        pattern: /^MUTE (audioout\d+|all) (on|off)$/
      },
      extract: function(match) {
        return {
          type: 'mute',
          output: match[1],
          state: match[2]
        };
      }
    },
    audioDeembedTypeResponse: {
      description: 'Ответ на установку/запрос типа деэмбеддинга (только MK2)',
      matcher: {
        pattern: /^AUDIOSW (hdmi|arc) (audioout\d+)$/
      },
      extract: function(match) {
        return {
          type: 'audioDeembedType',
          type: match[1],
          output: match[2]
        };
      }
    },

    // Сцены
    presetResponse: {
      description: 'Ответ на сохранение/восстановление сцены',
      matcher: {
        pattern: /^PRESET (\d)$/
      },
      extract: function(match) {
        return {
          type: 'preset',
          number: parseInt(match[1], 10)
        };
      }
    },

    // CEC
    cecPowerResponse: {
      description: 'Ответ на управление питанием через CEC',
      matcher: {
        pattern: /^CEC_PWR (hdmiout\d+|all) (on|off)$/
      },
      extract: function(match) {
        return {
          type: 'cecPower',
          output: match[1],
          state: match[2]
        };
      }
    },
    autoCECFunctionResponse: {
      description: 'Ответ на установку/запрос AUTOCEC',
      matcher: {
        pattern: /^AUTOCEC_FN (hdmiout\d+|all) (on|off)$/
      },
      extract: function(match) {
        return {
          type: 'autoCECFunction',
          output: match[1],
          state: match[2]
        };
      }
    },
    autoCECDelayResponse: {
      description: 'Ответ на установку/запрос задержки CEC',
      matcher: {
        pattern: /^AUTOCEC_D (hdmiout\d+|all) (\d+)$/
      },
      extract: function(match) {
        return {
          type: 'autoCECDelay',
          output: match[1],
          delay: parseInt(match[2], 10)
        };
      }
    },
    customCECResponse: {
      description: 'Ответ на пользовательскую CEC-команду',
      matcher: {
        pattern: /^CEC_CMD (hdmiout\d+) (.+)$/
      },
      extract: function(match) {
        return {
          type: 'customCEC',
          output: match[1],
          command: match[2]
        };
      }
    },

    // Standby
    standbyStatusResponse: {
      description: 'Ответ на запрос статуса Standby',
      matcher: {
        pattern: /^(STANDBY|WAKE)$/
      },
      extract: function(match) {
        return {
          type: 'standbyStatus',
          status: match[1]
        };
      }
    },

    // ИК
    irSystemCodeResponse: {
      description: 'Ответ на установку/запрос ИК-режима',
      matcher: {
        pattern: /^IR_SC (mode1|mode2|all)$/
      },
      extract: function(match) {
        return {
          type: 'irSystemCode',
          mode: match[1]
        };
      }
    },

    // Диагностика
    ipResponse: {
      description: 'Ответ на запрос IP-адреса',
      matcher: {
        pattern: /^IPADDR ([\d.]+)$/
      },
      extract: function(match) {
        return {
          type: 'ipAddress',
          ip: match[1]
        };
      }
    },
    firmwareResponse: {
      description: 'Ответ на запрос версии прошивки',
      matcher: {
        pattern: /^VER (v[\d.]+)$/
      },
      extract: function(match) {
        return {
          type: 'firmwareVersion',
          version: match[1]
        };
      }
    },
    rebootResponse: {
      description: 'Ответ на перезагрузку',
      matcher: {
        pattern: /^REBOOT$/
      },
      extract: function() {
        return { type: 'reboot' };
      }
    },
    resetResponse: {
      description: 'Ответ на сброс',
      matcher: {
        pattern: /^RESET$/
      },
      extract: function() {
        return { type: 'reset' };
      }
    }
  };

  // Метод инициализации
  initialize() {
    // Можно запросить начальное состояние при необходимости
    // this.publishCommand('getStandbyStatus');
  }

  // Методы команд
  setVideoSwitch(params) {
    const { input, output } = params;
    return { payload: `SET SW ${input} ${output}\r\n` };
  }

  getVideoMapping(params) {
    const { output } = params;
    return { payload: `GET MP ${output}\r\n` };
  }

  setAudioSwitchMode(params) {
    const { mode } = params;
    return { payload: `SET AUDIOSW_M ${mode}\r\n` };
  }

  setAudioSwitch(params) {
    const { input, output } = params;
    return { payload: `SET AUDIOSW ${input} ${output}\r\n` };
  }

  getAudioMapping(params) {
    const { output } = params;
    return { payload: `GET AUDIOMP ${output}\r\n` };
  }

  setMute(params) {
    const { output, state } = params;
    return { payload: `SET MUTE ${output} ${state}\r\n` };
  }

  getMuteState(params) {
    const { output } = params;
    return { payload: `GET MUTE ${output}\r\n` };
  }

  setAudioDeembedType(params) {
    const { type, output } = params;
    return { payload: `SET AUDIOSW ${type} ${output}\r\n` };
  }

  getAudioDeembedType(params) {
    const { output } = params;
    return { payload: `GET AUDIOSW ${output}\r\n` };
  }

  savePreset(params) {
    const { preset } = params;
    return { payload: `SAVE PRESET ${preset}\r\n` };
  }

  restorePreset(params) {
    const { preset } = params;
    return { payload: `RESTORE PRESET ${preset}\r\n` };
  }

  setCECPower(params) {
    const { output, state } = params;
    return { payload: `SET CEC_PWR ${output} ${state}\r\n` };
  }

  setAutoCECFunction(params) {
    const { output, state } = params;
    return { payload: `SET AUTOCEC_FN ${output} ${state}\r\n` };
  }

  getAutoCECFunction(params) {
    const { output } = params;
    return { payload: `GET AUTOCEC_FN ${output}\r\n` };
  }

  setAutoCECDelay(params) {
    const { output, delay } = params;
    return { payload: `SET AUTOCEC_D ${output} ${delay}\r\n` };
  }

  getAutoCECDelay(params) {
    const { output } = params;
    return { payload: `GET AUTOCEC_D ${output}\r\n` };
  }

  sendCustomCECCommand(params) {
    const { output, command } = params;
    return { payload: `SET CEC_CMD ${output} ${command}\r\n` };
  }

  standby() {
    return { payload: `STANDBY\r\n` };
  }

  wake() {
    return { payload: `WAKE\r\n` };
  }

  getStandbyStatus() {
    return { payload: `GET STANDBY\r\n` };
  }

  setIRSystemCode(params) {
    const { mode } = params;
    return { payload: `SET IR_SC ${mode}\r\n` };
  }

  getIRSystemCode() {
    return { payload: `GET IR_SC\r\n` };
  }

  getIP() {
    return { payload: `GET IPADDR\r\n` };
  }

  getFirmwareVersion() {
    return { payload: `GET VER\r\n` };
  }

  reboot() {
    return { payload: `REBOOT\r\n` };
  }

  reset() {
    return { payload: `RESET\r\n` };
  }
}

module.exports = MX0808H2AMK2Driver;
