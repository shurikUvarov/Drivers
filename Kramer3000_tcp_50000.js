const BaseDriver = require('base-driver');

/**
 * Драйвер для устройств Kramer (протокол 3000)
 */
class Kramer3000Driver extends BaseDriver {
  // Метаданные драйвера
  static metadata = {
    name: 'Kramer3000',
    manufacturer: 'Kramer',
    version: '1.0.0',
    description: 'Драйвер для устройств Kramer, поддерживающих протокол 3000 (команда RESET)'
  };

  // Описание доступных команд
  static commands = {
    reset: {
      description: 'Сброс устройства',
      parameters: []
    },
    getButtonRGB: {
      description: 'Запрос цвета кнопки',
      parameters: [
        {
          name: 'button',
          type: 'number',
          description: 'Номер кнопки (1-20)',
          required: true,
          min: 1,
          max: 20
        }
      ]
    },
    setButton: {
      description: 'Команда BTN для заданной кнопки',
      parameters: [
        {
          name: 'button',
          type: 'number',
          description: 'Номер кнопки (1-20)',
          required: true,
          min: 1,
          max: 20
        },
        {
          name: 'action',
          type: 'string',
          description: 'press | release | hold (по умолчанию press)',
          required: false,
          enum: ['press', 'release', 'hold']
        }
      ]
    }
  };

  // Шаблоны ответов
  static responses = {
    resetOk: {
      description: 'Подтверждение сброса',
      matcher: {
        // Пример: "~01@RESET OK"\r
        pattern: /~01@RESET\s+OK/
      },
      extract: function () {
        return {
          type: 'reset',
          status: 'OK'
        };
      }
    },
    buttonEvent: {
      description: 'Событие кнопки (press/hold/release)',
      matcher: {
        // "~01@BTN 1,3,p"
        pattern: /~01@BTN\s+\d+,(\d+),([phr])/
      },
      extract: function (match) {
        const actionMap = { p: 'press', r: 'release', h: 'hold' };
        return {
          type: 'buttonEvent',
          button: parseInt(match[1], 10),
          action: actionMap[match[2]] || match[2]
        };
      }
    },
    rgbStatus: {
      description: 'Состояние RGB кнопки',
      matcher: {
        // "~01@RGB 1,102,255,51,1"
        pattern: /~01@RGB\s+(\d+),(\d+),(\d+),(\d+),(\d+)/
      },
      extract: function (match) {
        return {
          type: 'rgbStatus',
          button: parseInt(match[1], 10),
          r: parseInt(match[2], 10),
          g: parseInt(match[3], 10),
          b: parseInt(match[4], 10),
          mode: parseInt(match[5], 10)
        };
      }
    }
  };

  /**
   * Формирование команды RESET
   */
  reset() {
    return { payload: '#RESET\r' };
  }

  /**
   * Запрос цвета конкретной кнопки
   * @param {{ button: number }} params
   */
  getButtonRGB(params) {
    const { button } = params;
    return { payload: `#RGB? ${button}\r` };
  }

  /**
   * Отправка команды BTN (##BTN <button>,01,R\r)
   * @param {{ button: number }} params
   */
  setButton(params) {
    const { button, action = 'press' } = params;
    const actionMap = { press: 'P', release: 'R', hold: 'H' };
    const code = actionMap[String(action).toLowerCase()] || 'P';
    return { payload: `##BTN ${button},01,${code}\r` };
  }

  /**
   * Кастомный разбор ответов, способный обрабатывать несколько сообщений
   */
  parseResponse(raw) {
    const str = typeof raw === 'string' ? raw : (raw && raw.data) ? raw.data : '';
    if (!str) return null;

    // Разбиваем по CR/LF
    const parts = str.split(/\r?\n/).filter(Boolean);

    const results = [];
    parts.forEach(part => {
      for (const key in this.constructor.responses) {
        const resp = this.constructor.responses[key];
        const pattern = resp.matcher.pattern;
        const match = part.match(pattern);
        if (match) {
          const parsed = resp.extract(match);
          results.push(parsed);
          break;
        }
      }
    });

    if (results.length === 0) return null;
    if (results.length === 1) return results[0];
    return results;
  }

  initialize() {
    if (this.debug) {
      console.log('Kramer3000Driver инициализирован');
    }
  }
}

module.exports = Kramer3000Driver; 
