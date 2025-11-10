const BaseDriver = require('base-driver');

/**
 * Драйвер для PTZ камер (VISCA протокол)
 * Поддерживает управление панорамированием, наклоном, зумом и пресетами
 */
class PtzCameraDriver extends BaseDriver {
  // Метаданные драйвера
  static metadata = {
    name: 'PTZ Camera',
    manufacturer: 'VISCA Compatible',
    version: '1.0.2',
    description: 'Драйвер для PTZ камер с поддержкой протокола VISCA'
  };
  
  // Определение команд
  static commands = {
    moveContinuous: {
      description: 'Непрерывное движение камеры',
      parameters: [
        {
          name: 'moveDirection',
          type: 'string',
          description: 'Направление движения',
          required: true,
          enum: ['stop', 'up', 'down', 'left', 'right', 'upLeft', 'upRight', 'downLeft', 'downRight']
        },
        {
          name: 'panSpeed',
          type: 'number',
          description: 'Скорость панорамирования (1-24)',
          required: false,
          min: 1,
          max: 24
        },
        {
          name: 'tiltSpeed',
          type: 'number',
          description: 'Скорость наклона (1-20)',
          required: false,
          min: 1,
          max: 20
        }
      ]
    },
    moveAbsolute: {
      description: 'Абсолютное позиционирование камеры',
      parameters: [
        {
          name: 'panDegrees',
          type: 'number',
          description: 'Угол панорамирования (-170 до 170 градусов)',
          required: true,
          min: -170,
          max: 170
        },
        {
          name: 'tiltDegrees',
          type: 'number',
          description: 'Угол наклона (-20 до 90 градусов)',
          required: true,
          min: -20,
          max: 90
        },
        {
          name: 'panSpeed',
          type: 'number',
          description: 'Скорость панорамирования (1-24)',
          required: false,
          min: 1,
          max: 24
        },
        {
          name: 'tiltSpeed',
          type: 'number',
          description: 'Скорость наклона (1-20)',
          required: false,
          min: 1,
          max: 20
        },
        {
          name: 'panOffsetDeg',
          type: 'number',
          description: 'Смещение панорамирования',
          required: false
        },
        {
          name: 'tiltOffsetDeg',
          type: 'number',
          description: 'Смещение наклона',
          required: false
        },
        {
          name: 'panDivider',
          type: 'number',
          description: 'Делитель панорамирования',
          required: false
        },
        {
          name: 'tiltDivider',
          type: 'number',
          description: 'Делитель наклона',
          required: false
        },
        {
          name: 'verify',
          type: 'boolean',
          description: 'Проверить позицию после движения',
          required: false
        },
        {
          name: 'settleMs',
          type: 'number',
          description: 'Время стабилизации перед проверкой (мс)',
          required: false
        }
      ]
    },
    zoom: {
      description: 'Управление зумом',
      parameters: [
        {
          name: 'zoomMode',
          type: 'string',
          description: 'Режим зума',
          required: true,
          enum: ['stop', 'in', 'out', 'setPosition']
        },
        {
          name: 'zoomSpeed',
          type: 'number',
          description: 'Скорость зума (0-7)',
          required: false,
          min: 0,
          max: 7
        },
        {
          name: 'zoomRatio',
          type: 'number',
          description: 'Коэффициент зума (1.0-20.0)',
          required: false,
          min: 1.0,
          max: 20.0
        }
      ]
    },
    presetSet: {
      description: 'Сохранить пресет',
      parameters: [
        {
          name: 'presetNumber',
          type: 'number',
          description: 'Номер пресета (0-255)',
          required: true,
          min: 0,
          max: 255
        }
      ]
    },
    presetRecall: {
      description: 'Восстановить пресет',
      parameters: [
        {
          name: 'presetNumber',
          type: 'number',
          description: 'Номер пресета (0-255)',
          required: true,
          min: 0,
          max: 255
        }
      ]
    },
    presetReset: {
      description: 'Сбросить пресет',
      parameters: [
        {
          name: 'presetNumber',
          type: 'number',
          description: 'Номер пресета (0-255)',
          required: true,
          min: 0,
          max: 255
        }
      ]
    },
    inquirePosition: {
      description: 'Запрос текущей позиции',
      parameters: []
    },
    inquireZoom: {
      description: 'Запрос текущего зума',
      parameters: []
    },
    setConfig: {
      description: 'Установка глобальных параметров конфигурации',
      parameters: [
        {
          name: 'panDivider',
          type: 'number',
          description: 'Глобальный делитель панорамирования',
          required: false
        },
        {
          name: 'tiltDivider',
          type: 'number',
          description: 'Глобальный делитель наклона',
          required: false
        },
        {
          name: 'panOffsetDeg',
          type: 'number',
          description: 'Глобальное смещение панорамирования',
          required: false
        },
        {
          name: 'tiltOffsetDeg',
          type: 'number',
          description: 'Глобальное смещение наклона',
          required: false
        }
      ]
    }
  };
  
  // Определение обработчиков ответов
  static responses = {
    position: {
      description: 'Текущая позиция камеры',
      matcher: {
        pattern: /9050([0-9a-f]{16})/i
      },
      extract: function(match, data) {
        const hexString = match[1];
        const bytes = [];
        for (let i = 0; i < hexString.length; i += 2) {
          bytes.push(parseInt(hexString.substr(i, 2), 16));
        }
        
        const dataBytes = [];
        for (let i = 0; i < bytes.length; i++) {
          dataBytes.push(bytes[i] & 0x0F);
        }
        
        if (dataBytes.length >= 8) {
          const pan = ((dataBytes[0] << 12) | (dataBytes[1] << 8) | (dataBytes[2] << 4) | dataBytes[3]) & 0xFFFF;
          const tilt = ((dataBytes[4] << 12) | (dataBytes[5] << 8) | (dataBytes[6] << 4) | dataBytes[7]) & 0xFFFF;
          
          const PAN_COUNTS_PER_DEG = 45.335;
          const TILT_COUNTS_PER_DEG = 45.333;
          
          const panSigned = (pan & 0x8000) ? (pan - 65536) : pan;
          const tiltSigned = (tilt & 0x8000) ? (tilt - 65536) : tilt;
          
          const panDeg = (panSigned / PAN_COUNTS_PER_DEG)*3;
          const tiltDeg = (tiltSigned / TILT_COUNTS_PER_DEG)*3;
          
          return {
            type: 'position',
            panDegrees: panDeg,
            tiltDegrees: tiltDeg,
            raw: {
              panHex: pan.toString(16).toUpperCase().padStart(4, '0'),
              tiltHex: tilt.toString(16).toUpperCase().padStart(4, '0')
            }
          };
        }
        return null;
      }
    },
    zoom: {
      description: 'Текущее значение зума',
      matcher: {
        pattern: /9050([0-9a-f]{8})/i
      },
      extract: function(match, data) {
        const hexString = match[1];
        const bytes = [];
        for (let i = 0; i < hexString.length; i += 2) {
          bytes.push(parseInt(hexString.substr(i, 2), 16));
        }
        
        const dataBytes = [];
        for (let i = 0; i < bytes.length; i++) {
          dataBytes.push(bytes[i] & 0x0F);
        }
        
        if (dataBytes.length >= 4) {
          const z = ((dataBytes[0] << 12) | (dataBytes[1] << 8) | (dataBytes[2] << 4) | dataBytes[3]) & 0xFFFF;
          let ratio;
          if (z <= 0x4000) {
            ratio = 1.0 + (z / 0x4000) * 19.0;
          } else {
            ratio = 20.0 + ((z - 0x4000) / (0x7AC0 - 0x4000)) * 12.0;
          }
          
          return {
            type: 'zoom',
            zoomRatio: ratio,
            raw: {
              zoomHex: z.toString(16).toUpperCase().padStart(4, '0')
            }
          };
        }
        return null;
      }
    },
    ack: {
      description: 'Подтверждение команды',
      matcher: {
        pattern: /9041/i
      },
      extract: function() {
        return { type: 'ack', status: 'success' };
      }
    },
    error: {
      description: 'Ошибка выполнения команды',
      matcher: {
        pattern: /90600([2-5])/i
      },
      extract: function(match) {
        const errorCodes = {
          '2': 'syntax_error',
          '3': 'command_buffer_full',
          '4': 'command_cancelled',
          '5': 'no_socket'
        };
        return {
          type: 'error',
          code: match[1],
          message: errorCodes[match[1]] || 'unknown_error'
        };
      }
    }
  };

  constructor() {
    super();
    // Константы для преобразования координат
    this.PAN_MAX_DEG = 170;
    this.PAN_MAX_COUNTS = 0x1E1B;
    this.PAN_MIN_COUNTS = 0xE1E5;
    this.PAN_COUNTS_PER_DEG = this.PAN_MAX_COUNTS / this.PAN_MAX_DEG;
    
    this.TILT_MAX_DEG = 90;
    this.TILT_MAX_COUNTS = 0x0FF0;
    this.TILT_MIN_COUNTS = 0xFC75;
    this.TILT_COUNTS_PER_DEG = this.TILT_MAX_COUNTS / this.TILT_MAX_DEG;
    
    // Глобальные настройки (как в оригинальном узле)
    this.config = {
      panDivider: 3,
      tiltDivider: 3,
      panOffsetDeg: 0,
      tiltOffsetDeg: 0
    };
    
    // Состояние камеры
    this.state = {
      pan: 0,
      tilt: 0,
      zoom: 1.0,
      moving: false
    };
  }

  // Вспомогательные методы
  clamp(n, min, max) {
    if(n < min) return min;
    if(n > max) return max;
    return n;
  }

  toUnsigned16FromSigned(value) {
    let v = value;
    if(v < 0) { v = 65536 + v; }
    return v & 0xFFFF;
  }

  degToCountsAxis(axis, deg) {
    const perDeg = (axis === 'tilt') ? this.TILT_COUNTS_PER_DEG : this.PAN_COUNTS_PER_DEG;
    return Math.round(deg * perDeg);
  }

  u16ToNibbleBytes(u16) {
    const n1 = (u16 >> 12) & 0x0F;
    const n2 = (u16 >> 8) & 0x0F;
    const n3 = (u16 >> 4) & 0x0F;
    const n4 = (u16) & 0x0F;
    return [n1, n2, n3, n4];
  }

  // Генерация VISCA команд
  generateViscaCommand(id, commandData) {
    const header = 0x80 + (id & 0x07);
    const terminator = 0xFF;
    
    if (Array.isArray(commandData)) {
      return Buffer.from([header, ...commandData, terminator]);
    }
    
    return Buffer.from([header, ...commandData, terminator]);
  }

  // Методы команд
  moveContinuous(params) {
    const { moveDirection, panSpeed = 10, tiltSpeed = 10 } = params;
    
    const speedPan = this.clamp(panSpeed, 1, 24);
    const speedTilt = this.clamp(tiltSpeed, 1, 20);
    
    let command;
    switch(moveDirection) {
      case 'stop':
        command = [0x01, 0x06, 0x01, 0x00, 0x00, 0x03, 0x03];
        break;
      case 'up':
        command = [0x01, 0x06, 0x01, speedPan, speedTilt, 0x03, 0x01];
        break;
      case 'down':
        command = [0x01, 0x06, 0x01, speedPan, speedTilt, 0x03, 0x02];
        break;
      case 'left':
        command = [0x01, 0x06, 0x01, speedPan, speedTilt, 0x01, 0x03];
        break;
      case 'right':
        command = [0x01, 0x06, 0x01, speedPan, speedTilt, 0x02, 0x03];
        break;
      case 'upLeft':
        command = [0x01, 0x06, 0x01, speedPan, speedTilt, 0x01, 0x01];
        break;
      case 'upRight':
        command = [0x01, 0x06, 0x01, speedPan, speedTilt, 0x02, 0x01];
        break;
      case 'downLeft':
        command = [0x01, 0x06, 0x01, speedPan, speedTilt, 0x01, 0x02];
        break;
      case 'downRight':
        command = [0x01, 0x06, 0x01, speedPan, speedTilt, 0x02, 0x02];
        break;
      default:
        throw new Error(`Invalid move direction: ${moveDirection}`);
    }
    
    this.state.moving = moveDirection !== 'stop';
    
    return { payload: this.generateViscaCommand(1, command) };
  }

  moveAbsolute(params) {
    const {
      panDegrees,
      tiltDegrees,
      panSpeed = 10,
      tiltSpeed = 10,
      panOffsetDeg = this.config.panOffsetDeg,
      tiltOffsetDeg = this.config.tiltOffsetDeg,
      panDivider = this.config.panDivider,
      tiltDivider = this.config.tiltDivider,
      verify = false,
      settleMs = 800
    } = params;
    
    const panDeg = this.clamp(panDegrees, -170, 170);
    const tiltDeg = this.clamp(tiltDegrees, -20, 90);
    
    const panDiv = (isNaN(panDivider) || panDivider === 0) ? 1 : panDivider;
    const tiltDiv = (isNaN(tiltDivider) || tiltDivider === 0) ? 1 : tiltDivider;
    
    const camPanDeg = this.clamp((panDeg / panDiv) + panOffsetDeg, -170, 170);
    const camTiltDeg = this.clamp((tiltDeg / tiltDiv) + tiltOffsetDeg, -20, 90);
    
    const panCounts = this.degToCountsAxis('pan', camPanDeg);
    const tiltCounts = this.degToCountsAxis('tilt', camTiltDeg);
    
    const panU16 = this.toUnsigned16FromSigned(panCounts);
    const tiltU16 = this.toUnsigned16FromSigned(tiltCounts);
    
    const panNib = this.u16ToNibbleBytes(panU16);
    const tiltNib = this.u16ToNibbleBytes(tiltU16);
    
    const speedPan = this.clamp(panSpeed, 1, 24);
    const speedTilt = this.clamp(tiltSpeed, 1, 20);
    
    const command = [
      0x01, 0x06, 0x02, 
      speedPan, speedTilt,
      ...panNib,
      ...tiltNib
    ];
    
    this.state.pan = panDeg;
    this.state.tilt = tiltDeg;
    this.state.moving = true;
    
    const result = { payload: this.generateViscaCommand(1, command) };
    
    // Если требуется проверка позиции, планируем запрос
    if (verify) {
      const delay = isNaN(settleMs) ? 800 : Math.max(100, settleMs);
      setTimeout(() => {
        this.publishCommand('inquirePosition', {
          panDivider: panDivider,
          tiltDivider: tiltDivider,
          panOffsetDeg: panOffsetDeg,
          tiltOffsetDeg: tiltOffsetDeg
        });
      }, delay);
    }
    
    return result;
  }

  zoom(params) {
    const { zoomMode, zoomSpeed = 3, zoomRatio } = params;
    
    let command;
    
    switch(zoomMode) {
      case 'stop':
        command = [0x01, 0x04, 0x07, 0x00];
        break;
      case 'in':
        const speedIn = this.clamp(zoomSpeed, 0, 7);
        command = [0x01, 0x04, 0x07, 0x20 + speedIn];
        break;
      case 'out':
        const speedOut = this.clamp(zoomSpeed, 0, 7);
        command = [0x01, 0x04, 0x07, 0x30 + speedOut];
        break;
      case 'setPosition':
        if (zoomRatio === undefined) {
          throw new Error('zoomRatio is required for setPosition mode');
        }
        const ratio = this.clamp(zoomRatio, 1.0, 20.0);
        const pos = Math.round(((ratio - 1.0) / 19.0) * 0x4000);
        const safePos = this.clamp(pos, 0, 0x7AC0);
        const zoomNib = this.u16ToNibbleBytes(safePos);
        command = [0x01, 0x04, 0x47, ...zoomNib];
        this.state.zoom = ratio;
        break;
      default:
        throw new Error(`Invalid zoom mode: ${zoomMode}`);
    }
    
    return { payload: this.generateViscaCommand(1, command) };
  }

  presetSet(params) {
    const { presetNumber } = params;
    const n = this.clamp(presetNumber, 0, 255);
    const command = [0x01, 0x04, 0x3F, 0x01, n];
    return { payload: this.generateViscaCommand(1, command) };
  }

  presetRecall(params) {
    const { presetNumber } = params;
    const n = this.clamp(presetNumber, 0, 255);
    const command = [0x01, 0x04, 0x3F, 0x02, n];
    return { payload: this.generateViscaCommand(1, command) };
  }

  presetReset(params) {
    const { presetNumber } = params;
    const n = this.clamp(presetNumber, 0, 255);
    const command = [0x01, 0x04, 0x3F, 0x00, n];
    return { payload: this.generateViscaCommand(1, command) };
  }

  inquirePosition(params = {}) {
    // Сохраняем параметры для использования при парсинге ответа
    this.lastInquiryParams = {
      panDivider: params.panDivider || this.config.panDivider,
      tiltDivider: params.tiltDivider || this.config.tiltDivider,
      panOffsetDeg: params.panOffsetDeg || this.config.panOffsetDeg,
      tiltOffsetDeg: params.tiltOffsetDeg || this.config.tiltOffsetDeg
    };
    
    const command = [0x09, 0x06, 0x12];
    return { payload: this.generateViscaCommand(1, command) };
  }

  inquireZoom() {
    const command = [0x09, 0x04, 0x47];
    return { payload: this.generateViscaCommand(1, command) };
  }

  setConfig(params) {
    if (params.panDivider !== undefined) {
      this.config.panDivider = params.panDivider;
    }
    if (params.tiltDivider !== undefined) {
      this.config.tiltDivider = params.tiltDivider;
    }
    if (params.panOffsetDeg !== undefined) {
      this.config.panOffsetDeg = params.panOffsetDeg;
    }
    if (params.tiltOffsetDeg !== undefined) {
      this.config.tiltOffsetDeg = params.tiltOffsetDeg;
    }
    
    return { payload: null }; // Нет команды для отправки на устройство
  }

  // Инициализация при подключении
  initialize() {
    console.log('PTZ Camera driver initialized');
    // Устанавливаем начальные значения конфигурации
    this.config = {
      panDivider: 1,
      tiltDivider: 1,
      panOffsetDeg: 0,
      tiltOffsetDeg: 0
    };
    
    // Можно выполнить начальные запросы статуса
    this.publishCommand('inquirePosition');
    this.publishCommand('inquireZoom');
  }

  // Обработка нестандартных ответов с учетом глобальных делителей
  parseResponse(data) {
    // data приходит как объект с полем data, содержащим строку
    const rawData = data.data;
    
    try {
      // Проверяем, есть ли префикс "[driver] " и извлекаем hex данные
      if (typeof rawData === 'string' && rawData.startsWith('[driver] ')) {
        const hexData = rawData.substring(9).trim(); // Убираем "[driver] "
        
        // Преобразуем hex строку в Buffer для дальнейшей обработки
        const buffer = Buffer.from(hexData, 'hex');
        
        // Создаем объект с полем payload для совместимости с обработчиками
        const processedData = { payload: buffer };
        
        // Для ответов position применяем глобальные делители и смещения
        if (hexData.startsWith('9050') && hexData.length === 22) { // position response
          const positionResult = this.constructor.responses.position.extract(
            hexData.match(this.constructor.responses.position.matcher.pattern),
            processedData
          );
          
          if (positionResult) {
            // Применяем глобальные делители и смещения к результату
            const config = this.lastInquiryParams || this.config;
            const panDiv = (isNaN(config.panDivider) || config.panDivider === 0) ? 1 : config.panDivider;
            const tiltDiv = (isNaN(config.tiltDivider) || config.tiltDivider === 0) ? 1 : config.tiltDivider;
            
            const userPanDeg = (positionResult.panDegrees - config.panOffsetDeg) * panDiv;
            const userTiltDeg = (positionResult.tiltDegrees - config.tiltOffsetDeg) * tiltDiv;
            
            const finalResult = {
              ...positionResult,
              panDegrees: userPanDeg,
              tiltDegrees: userTiltDeg,
              userCoordinates: {
                panDegrees: userPanDeg,
                tiltDegrees: userTiltDeg
              },
              cameraCoordinates: {
                panDegrees: positionResult.panDegrees,
                tiltDegrees: positionResult.tiltDegrees
              },
              config: config
            };
            
            this.publishResponse(finalResult);
            return null;
          }
        }
        
        // Для остальных ответов используем стандартную обработку
        this.publishResponse(processedData);
        return null;
      }
      
      return null;
    } catch (error) {
      console.error('Error parsing PTZ response:', error);
      return {
        type: 'parseError',
        message: error.message,
        raw: rawData
      };
    }
  }
}

module.exports = PtzCameraDriver;
