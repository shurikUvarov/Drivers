const BaseDriver = require('base-driver');

/**
 * Драйвер для управления камерами Panasonic через HTTP
 */
var baseUrl = "http://10.0.32.214" // ТУТ ТЫ САМ ВБИВАЕШЬ СВОЙ IP

class PanasonicCameraDriver extends BaseDriver {
  // Метаданные драйвера
  static metadata = {
    name: 'PanasonicCamera',
    manufacturer: 'Panasonic',
    version: '1.0.0',
    description: 'Драйвер для управления камерами Panasonic через HTTP (AW-HE100, AW-HE120 и другие)'
  };
  
  // Определение команд
  static commands = {
    // Команды для управления поворотом (Pan)
    pan: {
      description: 'Управление поворотом камеры',
      parameters: [
        {
          name: 'direction',
          type: 'string',
          description: 'Направление поворота',
          required: true,
          enum: ['left', 'right', 'stop']
        },
        {
          name: 'speed',
          type: 'number',
          description: 'Скорость поворота (1-49)',
          required: false,
          min: 1,
          max: 49,
          default: 25
        }
      ]
    },
    
    // Команды для управления наклоном (Tilt)
    tilt: {
      description: 'Управление наклоном камеры',
      parameters: [
        {
          name: 'direction',
          type: 'string',
          description: 'Направление наклона',
          required: true,
          enum: ['up', 'down', 'stop']
        },
        {
          name: 'speed',
          type: 'number',
          description: 'Скорость наклона (1-49)',
          required: false,
          min: 1,
          max: 49,
          default: 25
        }
      ]
    },
    
    // Команды для управления зумом (Zoom)
    zoom: {
      description: 'Управление зумом камеры',
      parameters: [
        {
          name: 'direction',
          type: 'string',
          description: 'Направление зума',
          required: true,
          enum: ['tele', 'wide', 'stop']
        },
        {
          name: 'speed',
          type: 'number',
          description: 'Скорость зума (1-49)',
          required: false,
          min: 1,
          max: 49,
          default: 25
        }
      ]
    },
    
    // Команды для управления пресетами
    preset: {
      description: 'Управление пресетами камеры',
      parameters: [
        {
          name: 'presetNumber',
          type: 'number',
          description: 'Номер пресета (1-100)',
          required: true,
          min: 1,
          max: 100
        },
        {
          name: 'action',
          type: 'string',
          description: 'Действие с пресетом',
          required: true,
          enum: ['recall', 'save']
        }
      ]
    },
    
    // Команда для одновременного управления Pan и Tilt
    panTilt: {
      description: 'Одновременное управление поворотом и наклоном',
      parameters: [
        {
          name: 'panDirection',
          type: 'string',
          description: 'Направление поворота',
          required: true,
          enum: ['left', 'right', 'stop']
        },
        {
          name: 'tiltDirection',
          type: 'string',
          description: 'Направление наклона',
          required: true,
          enum: ['up', 'down', 'stop']
        },
        {
          name: 'speed',
          type: 'number',
          description: 'Скорость движения (1-49)',
          required: false,
          min: 1,
          max: 49,
          default: 25
        }
      ]
    }
  };
  
  // Определение обработчиков ответов
  static responses = {
    // Обработчик для успешного выполнения команды
    successResponse: {
      description: 'Успешный ответ от камеры',
      matcher: {
        pattern: /OK/
      },
      extract: function(match) {
        return {
          type: 'success',
          message: 'Command executed successfully'
        };
      }
    },
    
    // Обработчик для ошибок
    errorResponse: {
      description: 'Ошибка выполнения команды',
      matcher: {
        pattern: /ER([1-3])/i
      },
      extract: function(match) {
        const errorMessages = {
          '1': 'Unsupported command',
          '2': 'Busy',
          '3': 'Outside acceptable range'
        };
        
        return {
          type: 'error',
          code: match[1],
          message: errorMessages[match[1]] || 'Unknown error'
        };
      }
    },
    
    // Обработчик для состояния пресетов
    presetResponse: {
      description: 'Ответ с состоянием пресета',
      matcher: {
        pattern: /s([0-9]{2})/
      },
      extract: function(match) {
        return {
          type: 'presetStatus',
          presetNumber: parseInt(match[1], 10) + 1
        };
      }
    }
  };
  
  // Вспомогательная функция для формирования команды
  _createCommand(command, params) {
    const { speed = 25 } = params;
    
    switch(command) {
      case 'pan':
        if (params.direction === 'stop') {
          return '#PTS5050';
        } else if (params.direction === 'left') {
          return `#P${(50 - speed).toString().padStart(2, '0')}`;
        } else if (params.direction === 'right') {
          return `#P${(50 + speed).toString().padStart(2, '0')}`;
        }
        break;
        
      case 'tilt':
        if (params.direction === 'stop') {
          return '#PTS5050';
        } else if (params.direction === 'down') {
          return `#T${(50 - speed).toString().padStart(2, '0')}`;
        } else if (params.direction === 'up') {
          return `#T${(50 + speed).toString().padStart(2, '0')}`;
        }
        break;
        
      case 'zoom':
        if (params.direction === 'stop') {
          return '#Z50';
        } else if (params.direction === 'wide') {
          return `#Z${(50 - speed).toString().padStart(2, '0')}`;
        } else if (params.direction === 'tele') {
          return `#Z${(50 + speed).toString().padStart(2, '0')}`;
        }
        break;
        
      case 'panTilt':
        if (params.panDirection === 'stop' && params.tiltDirection === 'stop') {
          return '#PTS5050';
        } else {
          let panValue = 50;
          let tiltValue = 50;
          
          if (params.panDirection === 'left') panValue = 50 - speed;
          else if (params.panDirection === 'right') panValue = 50 + speed;
          
          if (params.tiltDirection === 'down') tiltValue = 50 - speed;
          else if (params.tiltDirection === 'up') tiltValue = 50 + speed;
          
          return `#PTS${panValue.toString().padStart(2, '0')}${tiltValue.toString().padStart(2, '0')}`;
        }
        break;
        
      case 'preset':
        const presetIndex = params.presetNumber - 1;
        const presetCode = presetIndex.toString().padStart(2, '0');
        
        if (params.action === 'recall') {
          return `#R${presetCode}`;
        } else if (params.action === 'save') {
          return `#M${presetCode}`;
        }
        break;
    }
    
    return null;
  }
  
  // Методы команд
  
  pan(params) {
    const command = this._createCommand('pan', params);
    if (!command) return null;
    
    const encodedCommand = encodeURIComponent(command);
    return { 
      url: `${baseUrl}/cgi-bin/aw_ptz?cmd=${encodedCommand}&res=1`
    };
  }
  
  tilt(params) {
    const command = this._createCommand('tilt', params);
    if (!command) return null;
    
    const encodedCommand = encodeURIComponent(command);
    return { 
      url: `${baseUrl}/cgi-bin/aw_ptz?cmd=${encodedCommand}&res=1`
    };
  }
  
  zoom(params) {
    const command = this._createCommand('zoom', params);
    if (!command) return null;
    
    const encodedCommand = encodeURIComponent(command);
    return { 
      url: `${baseUrl}/cgi-bin/aw_ptz?cmd=${encodedCommand}&res=1`
    };
  }
  
  preset(params) {
    const command = this._createCommand('preset', params);
    if (!command) return null;
    
    const encodedCommand = encodeURIComponent(command);
    return { 
      url: `${baseUrl}/cgi-bin/aw_ptz?cmd=${encodedCommand}&res=1`
    };
  }
  
  panTilt(params) {
    const command = this._createCommand('panTilt', params);
    if (!command) return null;
    
    const encodedCommand = encodeURIComponent(command);
    return { 
      url: `${baseUrl}/cgi-bin/aw_ptz?cmd=${encodedCommand}&res=1`
    };
  }
}

module.exports = PanasonicCameraDriver;
