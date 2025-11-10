const BaseDriver = require('base-driver');

/**
 * Драйвер для аудиоустройства с текстовым протоколом управления
 * Поддерживает управление громкостью и отключением звука для выходных каналов
 */
class AudioDeviceDriver extends BaseDriver {
  // Метаданные драйвера
  static metadata = {
    name: 'AudioDevice',
    manufacturer: 'Generic',
    version: '1.0.0',
    description: 'Драйвер для управления аудиоустройством через текстовый протокол'
  };
  
  // Определение команд
  static commands = {
    setVolume: {
      description: 'Установить уровень громкости для выходного канала',
      parameters: [
        {
          name: 'channel',
          type: 'string',
          description: 'Название канала (например, Out1, Out2)',
          required: true
        },
        {
          name: 'level',
          type: 'number',
          description: 'Уровень громкости (обычно от -100.0 до 0.0)',
          required: true
        }
      ]
    },
    setMute: {
      description: 'Включить/выключить отключение звука для выходного канала',
      parameters: [
        {
          name: 'channel',
          type: 'string',
          description: 'Название канала (например, MuteOut1, MuteOut2)',
          required: true
        },
        {
          name: 'state',
          type: 'boolean',
          description: 'Состояние отключения звука (true=включен, false=выключен)',
          required: true
        }
      ]
    },
    getVolume: {
      description: 'Запросить текущий уровень громкости для выходного канала',
      parameters: [
        {
          name: 'channel',
          type: 'string',
          description: 'Название канала (например, Out1, Out2)',
          required: true
        }
      ]
    },
    getMute: {
      description: 'Запросить текущее состояние отключения звука для выходного канала',
      parameters: [
        {
          name: 'channel',
          type: 'string',
          description: 'Название канала (например, MuteOut1, MuteOut2)',
          required: true
        }
      ]
    },
    getStatus: {
      description: 'Запросить полный статус устройства',
      parameters: []
    }
  };
  
  // Обработчики ответов
  static responses = {
    volumeStatus: {
      description: 'Текущий уровень громкости',
      matcher: {
        pattern: /#(\w+)=(\-?\d+\.?\d*)/
      },
      extract: function(match) {
        return {
          type: 'volume',
          channel: match[1],
          level: parseFloat(match[2]),
          raw: match[0]
        };
      }
    },
    muteStatus: {
      description: 'Состояние отключения звука',
      matcher: {
        pattern: /#(\w+)=(TRUE|FALSE)/
      },
      extract: function(match) {
        return {
          type: 'mute',
          channel: match[1],
          state: match[2] === 'TRUE',
          raw: match[0]
        };
      }
    },
    error: {
      description: 'Ошибка устройства',
      matcher: {
        pattern: /(Error|ERROR)/i
      },
      extract: function(match) {
        return {
          type: 'error',
          message: match[0],
          raw: match[0]
        };
      }
    },
      controlObjectValue: {
    description: 'Значение контрольного объекта',
    matcher: {
      pattern: /^([^=]+)=([^\r\n]+)/
    },
    extract: function(match) {
      const name = match[1];
      const value = match[2];
      
      // Пытаемся определить тип значения
      let parsedValue;
      let valueType;
      
      if (value === 'TRUE' || value === 'FALSE') {
        parsedValue = value === 'TRUE' ? 'On' : 'Off';
        valueType = 'mode';
      } else if (!isNaN(parseFloat(value)) && isFinite(value)) {
        parsedValue = parseFloat(value);
        valueType = 'decibel';
      } else {
        parsedValue = value;
        valueType = 'text';
      }
      
      return {
        type: 'controlObjectValue',
        name: name,
        value: parsedValue,
        valueType: valueType,
        raw: value
      };
    }
  }
  };
  
  // Инициализация при подключении
  initialize() {
    console.log('Инициализация аудиоустройства');
    
    // Запрашиваем начальный статус устройства
    this.publishCommand('getStatus');
  }
  
  // Методы команд
  setVolume(params) {
    const { channel, level } = params;
    
    // Формируем команду для установки громкости
    const command = `SET ${channel} ${level}\r\n`;
    
    if (this.debug) {
      console.log(`Установка громкости: channel=${channel}, level=${level}, команда=${command}`);
    }
    
    return { payload: command };
  }
  
  setMute(params) {
    const { channel, state } = params;
    
    // Формируем команду для установки состояния отключения звука
    const command = `SET ${channel} ${state ? 'TRUE' : 'FALSE'}\r\n`;
    
    if (this.debug) {
      console.log(`Установка отключения звука: channel=${channel}, state=${state}, команда=${command}`);
    }
    
    return { payload: command };
  }
  
  getVolume(params) {
    const { channel } = params;
    
    // Формируем команду для запроса громкости
    const command = `GET ${channel}\r\n`;
    
    if (this.debug) {
      console.log(`Запрос громкости: channel=${channel}, команда=${command}`);
    }
    
    return { payload: command };
  }
  
  getMute(params) {
    const { channel } = params;
    
    // Формируем команду для запроса состояния отключения звука
    const command = `GET ${channel}\r\n`;
    
    if (this.debug) {
      console.log(`Запрос состояния отключения звука: channel=${channel}, команда=${command}`);
    }
    
    return { payload: command };
  }
  
  getStatus() {
    // Формируем команду для запроса полного статуса
    const command = `STATUS\r\n`;
    
    if (this.debug) {
      console.log(`Запрос полного статуса: команда=${command}`);
    }
    
    return { payload: command };
  }
  
  // Основной метод обработки ответов
  parseResponse(data) {
  const rawData = data.data;
  
  
  try {
    // Если данные приходят в виде строки с префиксом "[driver] "
    if (typeof rawData === 'string' && rawData.startsWith('[driver] ')) {
      const cleanData = rawData.substring(9).trim();
      
      // Проверяем, является ли это значением контрольного объекта (формат "Name=Value")
      if (/^[^=]+=[^\r\n]+$/.test(cleanData)) {
        const match = cleanData.match(/^([^=]+)=([^\r\n]+)/);
        if (match) {
          const name = match[1];
          const value = match[2];
          
          // Определяем тип значения
          let parsedValue;
          let valueType;
          
          if (value === 'TRUE' || value === 'FALSE') {
            parsedValue = value === 'TRUE' ? 'On' : 'Off';
            valueType = 'mode';
          } else if (!isNaN(parseFloat(value)) && isFinite(value)) {
            parsedValue = parseFloat(value);
            valueType = 'decibel';
          } else {
            parsedValue = value;
            valueType = 'text';
          }
          
          return {
            type: 'controlObjectValue',
            name: name,
            value: parsedValue,
            valueType: valueType,
            raw: value
          };
        }
      }
      
      // Для остальных данных используем стандартную обработку
      this.publishResponse({ payload: Buffer.from(cleanData) });
      return null;
    }
    
    // Если данные приходят в чистом виде "Name=Value"
    if (typeof rawData === 'string' && /^[^=]+=[^\r\n]+$/.test(rawData)) {
      const match = rawData.match(/^([^=]+)=([^\r\n]+)/);
      if (match) {
        const name = match[1];
        const value = match[2];
        
        let parsedValue;
        let valueType;
        
        if (value === 'TRUE' || value === 'FALSE') {
          parsedValue = value === 'TRUE' ? 'On' : 'Off';
          valueType = 'mode';
        } else if (!isNaN(parseFloat(value)) && isFinite(value)) {
          parsedValue = parseFloat(value);
          valueType = 'decibel';
        } else {
          parsedValue = value;
          valueType = 'text';
        }
        
        return {
          type: 'controlObjectValue',
          name: name,
          value: parsedValue,
          valueType: valueType,
          raw: value
        };
      }
    }
    
    return null;
  } catch (error) {
    console.error('Error parsing Extron response:', error);
    return {
      type: 'parseError',
      message: error.message,
      raw: rawData
    };
  }
}
}

module.exports = AudioDeviceDriver;
