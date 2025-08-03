const BaseDriver = require('base-driver');

/**
 * Вспомогательные функции для форматирования чисел
 */
function formatLevel(level, width = 5) {
  if (level < 0) {
    return '-' + Math.abs(level).toString().padStart(width - 1, '0');
  }
  return level.toString().padStart(width, '0');
}

function formatSignedLevel(level, width = 6) {
  const absLevel = Math.abs(level);
  const paddedLevel = absLevel.toString().padStart(width - 1, '0');
  return level < 0 ? '-' + paddedLevel : '+' + paddedLevel;
}

/**
 * Драйвер для матричных микшеров Extron
 */
class ExtronMatrixMixerDriver extends BaseDriver {
  // Метаданные драйвера
  static metadata = {
    name: 'ExtronMatrixMixer',
    manufacturer: 'Extron',
    version: '1.0.0',
    description: 'Драйвер для матричных микшеров Extron с поддержкой групп и регулировки громкости'
  };

  // Определение команд
  static commands = {
    // Групповые команды
    setGroupInputGain: {
      description: 'Установка входного усиления для группы',
      parameters: [
        { 
          name: 'group', 
          type: 'number', 
          description: 'Номер группы (1-16)', 
          required: true,
          min: 1,
          max: 16
        },
        { 
          name: 'value', 
          type: 'number', 
          description: 'Уровень усиления (-18.0 до 24.0 dB)', 
          required: true,
          min: -18,
          max: 24
        }
      ]
    },
    getGroupInputGain: {
      description: 'Запрос входного усиления для группы',
      parameters: [
        { 
          name: 'group', 
          type: 'number', 
          description: 'Номер группы (1-16)', 
          required: true,
          min: 1,
          max: 16
        }
      ]
    },
    setGroupMixpointGain: {
      description: 'Установка усиления микшера для группы',
      parameters: [
        { 
          name: 'group', 
          type: 'number', 
          description: 'Номер группы (1-16)', 
          required: true,
          min: 1,
          max: 16
        },
        { 
          name: 'value', 
          type: 'number', 
          description: 'Уровень усиления (-24.0 до 12.0 dB)', 
          required: true,
          min: -24,
          max: 12
        }
      ]
    },
    getGroupMixpointGain: {
      description: 'Запрос усиления микшера для группы',
      parameters: [
        { 
          name: 'group', 
          type: 'number', 
          description: 'Номер группы (1-16)', 
          required: true,
          min: 1,
          max: 16
        }
      ]
    },
    setGroupMute: {
      description: 'Установка состояния Mute для группы',
      parameters: [
        { 
          name: 'group', 
          type: 'number', 
          description: 'Номер группы (1-16)', 
          required: true,
          min: 1,
          max: 16
        },
        { 
          name: 'value', 
          type: 'boolean', 
          description: 'Состояние Mute (true=включено, false=выключено)', 
          required: true
        }
      ]
    },
    getGroupMute: {
      description: 'Запрос состояния Mute для группы',
      parameters: [
        { 
          name: 'group', 
          type: 'number', 
          description: 'Номер группы (1-16)', 
          required: true,
          min: 1,
          max: 16
        }
      ]
    },
    setGroupOutputAttenuation: {
      description: 'Установка аттенюации выхода для группы',
      parameters: [
        { 
          name: 'group', 
          type: 'number', 
          description: 'Номер группы (1-16)', 
          required: true,
          min: 1,
          max: 16
        },
        { 
          name: 'value', 
          type: 'number', 
          description: 'Уровень аттенюации (-100.0 до 0.0 dB)', 
          required: true,
          min: -100,
          max: 0
        }
      ]
    },
    getGroupOutputAttenuation: {
      description: 'Запрос аттенюации выхода для группы',
      parameters: [
        { 
          name: 'group', 
          type: 'number', 
          description: 'Номер группы (1-16)', 
          required: true,
          min: 1,
          max: 16
        }
      ]
    },
    setGroupPostmixerTrim: {
      description: 'Установка трима пост-микшера для группы',
      parameters: [
        { 
          name: 'group', 
          type: 'number', 
          description: 'Номер группы (1-16)', 
          required: true,
          min: 1,
          max: 16
        },
        { 
          name: 'value', 
          type: 'number', 
          description: 'Уровень трима (-12.0 до 6.0 dB)', 
          required: true,
          min: -12,
          max: 6
        }
      ]
    },
    getGroupPostmixerTrim: {
      description: 'Запрос трима пост-микшера для группы',
      parameters: [
        { 
          name: 'group', 
          type: 'number', 
          description: 'Номер группы (1-16)', 
          required: true,
          min: 1,
          max: 16
        }
      ]
    },
    setGroupPremixerGain: {
      description: 'Установка усиления пре-микшера для группы',
      parameters: [
        { 
          name: 'group', 
          type: 'number', 
          description: 'Номер группы (1-16)', 
          required: true,
          min: 1,
          max: 16
        },
        { 
          name: 'value', 
          type: 'number', 
          description: 'Уровень усиления (-100.0 до 6.0 dB)', 
          required: true,
          min: -100,
          max: 6
        }
      ]
    },
    getGroupPremixerGain: {
      description: 'Запрос усиления пре-микшера для группы',
      parameters: [
        { 
          name: 'group', 
          type: 'number', 
          description: 'Номер группы (1-16)', 
          required: true,
          min: 1,
          max: 16
        }
      ]
    },
    
    // Индивидуальные входы
    setInputGain: {
      description: 'Установка входного усиления',
      parameters: [
        { 
          name: 'input', 
          type: 'number', 
          description: 'Номер входа (1-4)', 
          required: true,
          min: 1,
          max: 4
        },
        { 
          name: 'value', 
          type: 'number', 
          description: 'Уровень усиления (-18.0 до 24.0 dB)', 
          required: true,
          min: -18,
          max: 24
        }
      ]
    },
    getInputGain: {
      description: 'Запрос входного усиления',
      parameters: [
        { 
          name: 'input', 
          type: 'number', 
          description: 'Номер входа (1-4)', 
          required: true,
          min: 1,
          max: 4
        }
      ]
    },
    setInputMute: {
      description: 'Установка состояния Mute для входа',
      parameters: [
        { 
          name: 'input', 
          type: 'number', 
          description: 'Номер входа (1-4)', 
          required: true,
          min: 1,
          max: 4
        },
        { 
          name: 'value', 
          type: 'boolean', 
          description: 'Состояние Mute (true=включено, false=выключено)', 
          required: true
        }
      ]
    },
    getInputMute: {
      description: 'Запрос состояния Mute для входа',
      parameters: [
        { 
          name: 'input', 
          type: 'number', 
          description: 'Номер входа (1-4)', 
          required: true,
          min: 1,
          max: 4
        }
      ]
    },
    setPremixerGain: {
      description: 'Установка усиления пре-микшера',
      parameters: [
        { 
          name: 'input', 
          type: 'number', 
          description: 'Номер входа (1-4)', 
          required: true,
          min: 1,
          max: 4
        },
        { 
          name: 'value', 
          type: 'number', 
          description: 'Уровень усиления (-100.0 до 6.0 dB)', 
          required: true,
          min: -100,
          max: 6
        }
      ]
    },
    getPremixerGain: {
      description: 'Запрос усиления пре-микшера',
      parameters: [
        { 
          name: 'input', 
          type: 'number', 
          description: 'Номер входа (1-4)', 
          required: true,
          min: 1,
          max: 4
        }
      ]
    },
    setPremixerMute: {
      description: 'Установка состояния Mute для пре-микшера',
      parameters: [
        { 
          name: 'input', 
          type: 'number', 
          description: 'Номер входа (1-4)', 
          required: true,
          min: 1,
          max: 4
        },
        { 
          name: 'value', 
          type: 'boolean', 
          description: 'Состояние Mute (true=включено, false=выключено)', 
          required: true
        }
      ]
    },
    getPremixerMute: {
      description: 'Запрос состояния Mute для пре-микшера',
      parameters: [
        { 
          name: 'input', 
          type: 'number', 
          description: 'Номер входа (1-4)', 
          required: true,
          min: 1,
          max: 4
        }
      ]
    },
    
    // Микшерные точки
    setMixpointGain: {
      description: 'Установка усиления микшерной точки',
      parameters: [
        { 
          name: 'input', 
          type: 'number', 
          description: 'Номер входа (1-4)', 
          required: true,
          min: 1,
          max: 4
        },
        { 
          name: 'output', 
          type: 'number', 
          description: 'Номер выхода (1-4)', 
          required: true,
          min: 1,
          max: 4
        },
        { 
          name: 'value', 
          type: 'number', 
          description: 'Уровень усиления (-24.0 до 12.0 dB)', 
          required: true,
          min: -24,
          max: 12
        }
      ]
    },
    getMixpointGain: {
      description: 'Запрос усиления микшерной точки',
      parameters: [
        { 
          name: 'input', 
          type: 'number', 
          description: 'Номер входа (1-4)', 
          required: true,
          min: 1,
          max: 4
        },
        { 
          name: 'output', 
          type: 'number', 
          description: 'Номер выхода (1-4)', 
          required: true,
          min: 1,
          max: 4
        }
      ]
    },
    setMixpointMute: {
      description: 'Установка состояния Mute для микшерной точки',
      parameters: [
        { 
          name: 'input', 
          type: 'number', 
          description: 'Номер входа (1-4)', 
          required: true,
          min: 1,
          max: 4
        },
        { 
          name: 'output', 
          type: 'number', 
          description: 'Номер выхода (1-4)', 
          required: true,
          min: 1,
          max: 4
        },
        { 
          name: 'value', 
          type: 'boolean', 
          description: 'Состояние Mute (true=включено, false=выключено)', 
          required: true
        }
      ]
    },
    getMixpointMute: {
      description: 'Запрос состояния Mute для микшерной точки',
      parameters: [
        { 
          name: 'input', 
          type: 'number', 
          description: 'Номер входа (1-4)', 
          required: true,
          min: 1,
          max: 4
        },
        { 
          name: 'output', 
          type: 'number', 
          description: 'Номер выхода (1-4)', 
          required: true,
          min: 1,
          max: 4
        }
      ]
    },
    
    // Выходы
    setOutputAttenuation: {
      description: 'Установка аттенюации выхода',
      parameters: [
        { 
          name: 'output', 
          type: 'number', 
          description: 'Номер выхода (1-4)', 
          required: true,
          min: 1,
          max: 4
        },
        { 
          name: 'value', 
          type: 'number', 
          description: 'Уровень аттенюации (-100.0 до 0.0 dB)', 
          required: true,
          min: -100,
          max: 0
        }
      ]
    },
    getOutputAttenuation: {
      description: 'Запрос аттенюации выхода',
      parameters: [
        { 
          name: 'output', 
          type: 'number', 
          description: 'Номер выхода (1-4)', 
          required: true,
          min: 1,
          max: 4
        }
      ]
    },
    setOutputMute: {
      description: 'Установка состояния Mute для выхода',
      parameters: [
        { 
          name: 'output', 
          type: 'number', 
          description: 'Номер выхода (1-4)', 
          required: true,
          min: 1,
          max: 4
        },
        { 
          name: 'value', 
          type: 'boolean', 
          description: 'Состояние Mute (true=включено, false=выключено)', 
          required: true
        }
      ]
    },
    getOutputMute: {
      description: 'Запрос состояния Mute для выхода',
      parameters: [
        { 
          name: 'output', 
          type: 'number', 
          description: 'Номер выхода (1-4)', 
          required: true,
          min: 1,
          max: 4
        }
      ]
    },
    setOutputPostmixerTrim: {
      description: 'Установка трима пост-микшера для выхода',
      parameters: [
        { 
          name: 'output', 
          type: 'number', 
          description: 'Номер выхода (1-4)', 
          required: true,
          min: 1,
          max: 4
        },
        { 
          name: 'value', 
          type: 'number', 
          description: 'Уровень трима (-12.0 до 6.0 dB)', 
          required: true,
          min: -12,
          max: 6
        }
      ]
    },
    getOutputPostmixerTrim: {
      description: 'Запрос трима пост-микшера для выхода',
      parameters: [
        { 
          name: 'output', 
          type: 'number', 
          description: 'Номер выхода (1-4)', 
          required: true,
          min: 1,
          max: 4
        }
      ]
    },
    
    // Другие команды
    getPartNumber: {
      description: 'Запрос номера модели устройства',
      parameters: []
    },
    setPresetRecall: {
      description: 'Вызов пресета',
      parameters: [
        { 
          name: 'preset', 
          type: 'number', 
          description: 'Номер пресета (1-16)', 
          required: true,
          min: 1,
          max: 16
        }
      ]
    }
  };

  // Определение обработчиков ответов
  static responses = {
    // Групповые ответы
    groupResponse: {
      description: 'Ответ для групповых команд',
      matcher: {
        pattern: /GrpmD(\d{2})\*([0-9+-]{1,5})\r\n/
      },
      extract: function(match) {
        const group = parseInt(match[1], 10);
        const value = parseInt(match[2], 10) / 10;
        return {
          type: 'groupResponse',
          group: group,
          value: value
        };
      }
    },
    
    // Ответы для входов
    inputGainResponse: {
      description: 'Ответ для входного усиления',
      matcher: {
        pattern: /DsG(3000[0-3])\*([0-9+-]{1,5})\r\n/
      },
      extract: function(match) {
        const input = parseInt(match[1], 10) - 29999;
        const value = parseInt(match[2], 10) / 10;
        return {
          type: 'inputGain',
          input: input,
          value: value
        };
      }
    },
    inputMuteResponse: {
      description: 'Ответ для состояния Mute входа',
      matcher: {
        pattern: /DsM(3000[0-3])\*(0|1)\r\n/
      },
      extract: function(match) {
        const input = parseInt(match[1], 10) - 29999;
        const value = match[2] === '1';
        return {
          type: 'inputMute',
          input: input,
          value: value
        };
      }
    },
    premixerGainResponse: {
      description: 'Ответ для усиления пре-микшера',
      matcher: {
        pattern: /DsG(3010[0-3])\*([0-9+-]{1,5})\r\n/
      },
      extract: function(match) {
        const input = parseInt(match[1], 10) - 30099;
        const value = parseInt(match[2], 10) / 10;
        return {
          type: 'premixerGain',
          input: input,
          value: value
        };
      }
    },
    premixerMuteResponse: {
      description: 'Ответ для состояния Mute пре-микшера',
      matcher: {
        pattern: /DsM(3010[0-3])\*(0|1)\r\n/
      },
      extract: function(match) {
        const input = parseInt(match[1], 10) - 30099;
        const value = match[2] === '1';
        return {
          type: 'premixerMute',
          input: input,
          value: value
        };
      }
    },
    
    // Ответы для микшерных точек
    mixpointGainResponse: {
      description: 'Ответ для усиления микшерной точки',
      matcher: {
        pattern: /DsG2([0-3]{2})([0-3]{2})\*([0-9+-]{1,5})\r\n/
      },
      extract: function(match) {
        const inputMap = {'00': '1', '01': '2', '02': '3', '03': '4'};
        const outputMap = {'00': '1', '01': '2', '02': '3', '03': '4'};
        
        const input = inputMap[match[1]] || match[1];
        const output = outputMap[match[2]] || match[2];
        const value = parseInt(match[3], 10) / 10;
        
        return {
          type: 'mixpointGain',
          input: input,
          output: output,
          value: value
        };
      }
    },
    mixpointMuteResponse: {
      description: 'Ответ для состояния Mute микшерной точки',
      matcher: {
        pattern: /DsM2([0-3]{2})([0-3]{2})\*(0|1)\r\n/
      },
      extract: function(match) {
        const inputMap = {'00': '1', '01': '2', '02': '3', '03': '4'};
        const outputMap = {'00': '1', '01': '2', '02': '3', '03': '4'};
        
        const input = inputMap[match[1]] || match[1];
        const output = outputMap[match[2]] || match[2];
        const value = match[3] === '1';
        
        return {
          type: 'mixpointMute',
          input: input,
          output: output,
          value: value
        };
      }
    },
    
    // Ответы для выходов
    outputAttenuationResponse: {
      description: 'Ответ для аттенюации выхода',
      matcher: {
        pattern: /DsG(6000[0-3])\*([0-9+-]{1,5})\r\n/
      },
      extract: function(match) {
        const output = parseInt(match[1], 10) - 59999;
        const value = parseInt(match[2], 10) / 10;
        return {
          type: 'outputAttenuation',
          output: output,
          value: value
        };
      }
    },
    outputMuteResponse: {
      description: 'Ответ для состояния Mute выхода',
      matcher: {
        pattern: /DsM(6000[0-3])\*(0|1)\r\n/
      },
      extract: function(match) {
        const output = parseInt(match[1], 10) - 59999;
        const value = match[2] === '1';
        return {
          type: 'outputMute',
          output: output,
          value: value
        };
      }
    },
    outputPostmixerTrimResponse: {
      description: 'Ответ для трима пост-микшера выхода',
      matcher: {
        pattern: /DsG(6010[0-3])\*([0-9 -]{1,5})\r\n/
      },
      extract: function(match) {
        const output = parseInt(match[1], 10) - 60099;
        const value = parseInt(match[2], 10) / 10;
        return {
          type: 'outputPostmixerTrim',
          output: output,
          value: value
        };
      }
    },
    
    // Прочие ответы
    partNumberResponse: {
      description: 'Номер модели устройства',
      matcher: {
        pattern: /(Pno[0-9A-Z-]+)\r\n/
      },
      extract: function(match) {
        return {
          type: 'partNumber',
          partNumber: match[1]
        };
      }
    },
    verboseModeResponse: {
      description: 'Подтверждение режима Verbose',
      matcher: {
        pattern: /Vrb3\r\n/
      },
      extract: function(match) {
        return {
          type: 'verboseMode',
          enabled: true
        };
      }
    },
    errorResponse: {
      description: 'Ошибка устройства',
      matcher: {
        pattern: /E(\d{2})\r\n/
      },
      extract: function(match) {
        const errorCodes = {
          '10': 'Invalid command',
          '11': 'Invalid preset',
          '12': 'Invalid port number',
          '13': 'Invalid parameter (number is out of range)',
          '14': 'Not valid for this configuration',
          '17': 'System timed out',
          '22': 'Busy',
          '25': 'Device is not present'
        };
        const code = match[1];
        return {
          type: 'error',
          code: code,
          message: errorCodes[code] || 'Unrecognized error code'
        };
      }
    }
  };

  // Инициализация при подключении
  initialize() {
    //console.log('Инициализация драйвера Extron Matrix Mixer');
    this.publishCommand('getOutputAttenuation', { output: 1 });
    // Включение Verbose режима
    this.sendCommand('verboseMode');
    
    // Запрос начальной информации
    this.publishCommand('getPartNumber');
    
    // Запрос состояния для всех групп (1-16)
    for (let group = 1; group <= 16; group++) {
      this.publishCommand('getGroupInputGain', { group: group });
      this.publishCommand('getGroupMute', { group: group });
    }

    // Запрос состояния для всех входов и выходов (1-4)
    for (let i = 1; i <= 4; i++) {
      this.publishCommand('getInputGain', { input: i });
      this.publishCommand('getInputMute', { input: i });
      this.publishCommand('getPremixerGain', { input: i });
      this.publishCommand('getPremixerMute', { input: i });
      
      this.publishCommand('getOutputMute', { output: i });
      
      // Запрос для всех микшерных точек
      for (let j = 1; j <= 4; j++) {
        this.publishCommand('getMixpointGain', { input: i, output: j });
        this.publishCommand('getMixpointMute', { input: i, output: j });
      }
    }
  }

  // Методы команд
  verboseMode() {
    return { payload: 'w3cv\r\n' };
  }
  
  // Групповые команды
  setGroupInputGain(params) {
    const { group, value } = params;
    if (group < 1 || group > 16) {
      throw new Error('Group must be between 1 and 16');
    }
    if (value < -18 || value > 24) {
      throw new Error('Value must be between -18 and 24');
    }
    
    const level = Math.round(value * 10);
    const levelStr = formatSignedLevel(level, 6);
    const commandString = `wd${group}*${levelStr}grpm\r\n`;
    return { payload: commandString };
  }
  
  getGroupInputGain(params) {
    const { group } = params;
    if (group < 1 || group > 16) {
      throw new Error('Group must be between 1 and 16');
    }
    
    const commandString = `wd${group}grpm\r\n`;
    return { payload: commandString };
  }
  
  setGroupMixpointGain(params) {
    const { group, value } = params;
    if (group < 1 || group > 16) {
      throw new Error('Group must be between 1 and 16');
    }
    if (value < -24 || value > 12) {
      throw new Error('Value must be between -24 and 12');
    }
    
    const level = Math.round(value * 10);
    const levelStr = formatSignedLevel(level, 6);
    const commandString = `wd${group}*${levelStr}grpm\r\n`;
    return { payload: commandString };
  }
  
  getGroupMixpointGain(params) {
    const { group } = params;
    if (group < 1 || group > 16) {
      throw new Error('Group must be between 1 and 16');
    }
    
    const commandString = `wd${group}grpm\r\n`;
    return { payload: commandString };
  }
  
  setGroupMute(params) {
    const { group, value } = params;
    if (group < 1 || group > 16) {
      throw new Error('Group must be between 1 and 16');
    }
    
    const state = value ? '1' : '0';
    const commandString = `wd${group}*${state}grpm\r\n`;
    return { payload: commandString };
  }
  
  getGroupMute(params) {
    const { group } = params;
    if (group < 1 || group > 16) {
      throw new Error('Group must be between 1 and 16');
    }
    
    const commandString = `wd${group}grpm\r\n`;
    return { payload: commandString };
  }
  
  setGroupOutputAttenuation(params) {
    const { group, value } = params;
    if (group < 1 || group > 16) {
      throw new Error('Group must be between 1 and 16');
    }
    if (value < -100 || value > 0) {
      throw new Error('Value must be between -100 and 0');
    }
    
    const level = Math.round(value * 10);
    const levelStr = formatSignedLevel(level, 6);
    const commandString = `wd${group}*${levelStr}grpm\r\n`;
    return { payload: commandString };
  }
  
  getGroupOutputAttenuation(params) {
    const { group } = params;
    if (group < 1 || group > 16) {
      throw new Error('Group must be between 1 and 16');
    }
    
    const commandString = `wd${group}grpm\r\n`;
    return { payload: commandString };
  }
  
  setGroupPostmixerTrim(params) {
    const { group, value } = params;
    if (group < 1 || group > 16) {
      throw new Error('Group must be between 1 and 16');
    }
    if (value < -12 || value > 6) {
      throw new Error('Value must be between -12 and 6');
    }
    
    const level = Math.round(value * 10);
    const levelStr = formatSignedLevel(level, 6);
    const commandString = `wd${group}*${levelStr}grpm\r\n`;
    return { payload: commandString };
  }
  
  getGroupPostmixerTrim(params) {
    const { group } = params;
    if (group < 1 || group > 16) {
      throw new Error('Group must be between 1 and 16');
    }
    
    const commandString = `wd${group}grpm\r\n`;
    return { payload: commandString };
  }
  
  setGroupPremixerGain(params) {
    const { group, value } = params;
    if (group < 1 || group > 16) {
      throw new Error('Group must be between 1 and 16');
    }
    if (value < -100 || value > 6) {
      throw new Error('Value must be between -100 and 6');
    }
    
    const level = Math.round(value * 10);
    const levelStr = formatSignedLevel(level, 6);
    const commandString = `wd${group}*${levelStr}grpm\r\n`;
    return { payload: commandString };
  }
  
  getGroupPremixerGain(params) {
    const { group } = params;
    if (group < 1 || group > 16) {
      throw new Error('Group must be between 1 and 16');
    }
    
    const commandString = `wd${group}grpm\r\n`;
    return { payload: commandString };
  }
  
  // Индивидуальные входы
  setInputGain(params) {
    const { input, value } = params;
    if (input < 1 || input > 4) {
      throw new Error('Input must be between 1 and 4');
    }
    if (value < -18 || value > 24) {
      throw new Error('Value must be between -18 and 24');
    }
    
    const level = Math.round(value * 10);
    const channel = input + 29999;
    const levelStr = formatLevel(level, 5);
    const commandString = `wG${channel}*${levelStr}AU\r\n`;
    return { payload: commandString };
  }
  
  getInputGain(params) {
    const { input } = params;
    if (input < 1 || input > 4) {
      throw new Error('Input must be between 1 and 4');
    }
    
    const channel = input + 29999;
    const commandString = `wG${channel}AU\r\n`;
    return { payload: commandString };
  }
  
  setInputMute(params) {
    const { input, value } = params;
    if (input < 1 || input > 4) {
      throw new Error('Input must be between 1 and 4');
    }
    
    const state = value ? '1' : '0';
    const channel = input + 29999;
    const commandString = `wM${channel}*${state}AU\r\n`;
    return { payload: commandString };
  }
  
  getInputMute(params) {
    const { input } = params;
    if (input < 1 || input > 4) {
      throw new Error('Input must be between 1 and 4');
    }
    
    const channel = input + 29999;
    const commandString = `wM${channel}AU\r\n`;
    return { payload: commandString };
  }
  
  setPremixerGain(params) {
    const { input, value } = params;
    if (input < 1 || input > 4) {
      throw new Error('Input must be between 1 and 4');
    }
    if (value < -100 || value > 6) {
      throw new Error('Value must be between -100 and 6');
    }
    
    const level = Math.round(value * 10);
    const channel = input + 30099;
    const levelStr = formatLevel(level, 5);
    const commandString = `wG${channel}*${levelStr}AU\r\n`;
    return { payload: commandString };
  }
  
  getPremixerGain(params) {
    const { input } = params;
    if (input < 1 || input > 4) {
      throw new Error('Input must be between 1 and 4');
    }
    
    const channel = input + 30099;
    const commandString = `wG${channel}AU\r\n`;
    return { payload: commandString };
  }
  
  setPremixerMute(params) {
    const { input, value } = params;
    if (input < 1 || input > 4) {
      throw new Error('Input must be between 1 and 4');
    }
    
    const state = value ? '1' : '0';
    const channel = input + 30099;
    const commandString = `wM${channel}*${state}AU\r\n`;
    return { payload: commandString };
  }
  
  getPremixerMute(params) {
    const { input } = params;
    if (input < 1 || input > 4) {
      throw new Error('Input must be between 1 and 4');
    }
    
    const channel = input + 30099;
    const commandString = `wM${channel}AU\r\n`;
    return { payload: commandString };
  }
  
  // Микшерные точки
  setMixpointGain(params) {
    const { input, output, value } = params;
    if (input < 1 || input > 4) {
      throw new Error('Input must be between 1 and 4');
    }
    if (output < 1 || output > 4) {
      throw new Error('Output must be between 1 and 4');
    }
    if (value < -24 || value > 12) {
      throw new Error('Value must be between -24 and 12');
    }
    
    const inputMap = {'1': '00', '2': '01', '3': '02', '4': '03'};
    const outputMap = {'1': '00', '2': '01', '3': '02', '4': '03'};
    
    const inputValue = inputMap[input];
    const outputValue = outputMap[output];
    const level = Math.round(value * 10);
    const levelStr = formatLevel(level, 5);
    
    const commandString = `wG2${inputValue}${outputValue}*${levelStr}AU\r\n`;
    return { payload: commandString };
  }
  
  getMixpointGain(params) {
    const { input, output } = params;
    if (input < 1 || input > 4) {
      throw new Error('Input must be between 1 and 4');
    }
    if (output < 1 || output > 4) {
      throw new Error('Output must be between 1 and 4');
    }
    
    const inputMap = {'1': '00', '2': '01', '3': '02', '4': '03'};
    const outputMap = {'1': '00', '2': '01', '3': '02', '4': '03'};
    
    const inputValue = inputMap[input];
    const outputValue = outputMap[output];
    
    const commandString = `wG2${inputValue}${outputValue}AU\r\n`;
    return { payload: commandString };
  }
  
  setMixpointMute(params) {
    const { input, output, value } = params;
    if (input < 1 || input > 4) {
      throw new Error('Input must be between 1 and 4');
    }
    if (output < 1 || output > 4) {
      throw new Error('Output must be between 1 and 4');
    }
    
    const inputMap = {'1': '00', '2': '01', '3': '02', '4': '03'};
    const outputMap = {'1': '00', '2': '01', '3': '02', '4': '03'};
    
    const inputValue = inputMap[input];
    const outputValue = outputMap[output];
    const state = value ? '1' : '0';
    
    const commandString = `wM2${inputValue}${outputValue}*${state}AU\r\n`;
    return { payload: commandString };
  }
  
  getMixpointMute(params) {
    const { input, output } = params;
    if (input < 1 || input > 4) {
      throw new Error('Input must be between 1 and 4');
    }
    if (output < 1 || output > 4) {
      throw new Error('Output must be between 1 and 4');
    }
    
    const inputMap = {'1': '00', '2': '01', '3': '02', '4': '03'};
    const outputMap = {'1': '00', '2': '01', '3': '02', '4': '03'};
    
    const inputValue = inputMap[input];
    const outputValue = outputMap[output];
    
    const commandString = `wM2${inputValue}${outputValue}AU\r\n`;
    return { payload: commandString };
  }
  
  // Выходы
  setOutputAttenuation(params) {
    const { output, value } = params;
    if (output < 1 || output > 4) {
      throw new Error('Output must be between 1 and 4');
    }
    if (value < -100 || value > 0) {
      throw new Error('Value must be between -100 and 0');
    }
    
    const level = Math.round(value * 10);
    const channel = output + 59999;
    const levelStr = formatLevel(level, 5);
    const commandString = `wG${channel}*${levelStr}AU\r\n`;
    return { payload: commandString };
  }
  
  getOutputAttenuation(params) {
    const { output } = params;
    if (output < 1 || output > 4) {
      throw new Error('Output must be between 1 and 4');
    }
    
    const channel = output + 59999;
    const commandString = `wG${channel}AU\r\n`;
    return { payload: commandString };
  }
  
  setOutputMute(params) {
    const { output, value } = params;
    if (output < 1 || output > 4) {
      throw new Error('Output must be between 1 and 4');
    }
    
    const state = value ? '1' : '0';
    const channel = output + 59999;
    const commandString = `wM${channel}*${state}AU\r\n`;
    return { payload: commandString };
  }
  
  getOutputMute(params) {
    const { output } = params;
    if (output < 1 || output > 4) {
      throw new Error('Output must be between 1 and 4');
    }
    
    const channel = output + 59999;
    const commandString = `wM${channel}AU\r\n`;
    return { payload: commandString };
  }
  
  setOutputPostmixerTrim(params) {
    const { output, value } = params;
    if (output < 1 || output > 4) {
      throw new Error('Output must be between 1 and 4');
    }
    if (value < -12 || value > 6) {
      throw new Error('Value must be between -12 and 6');
    }
    
    const level = Math.round(value * 10);
    const channel = output + 60099;
    const levelStr = formatLevel(level, 5);
    const commandString = `wG${channel}*${levelStr}AU\r\n`;
    return { payload: commandString };
  }
  
  getOutputPostmixerTrim(params) {
    const { output } = params;
    if (output < 1 || output > 4) {
      throw new Error('Output must be between 1 and 4');
    }
    
    const channel = output + 60099;
    const commandString = `wG${channel}AU\r\n`;
    return { payload: commandString };
  }
  
  // Другие команды
  getPartNumber() {
    return { payload: 'n\r\n' };
  }
  
  setPresetRecall(params) {
    const { preset } = params;
    if (preset < 1 || preset > 16) {
      throw new Error('Preset must be between 1 and 16');
    }
    
    const commandString = `${preset}.\r\n`;
    return { payload: commandString };
  }
}

module.exports = ExtronMatrixMixerDriver;
