const BaseDriver = require('base-driver');

/**
 * Драйвер для видео-матрицы Intrend
 */
class IntrendMatrixDriver extends BaseDriver {
  // Метаданные драйвера
  static metadata = {
    name: 'IntrendMatrix',
    manufacturer: 'Intrend',
    version: '1.0.0',
    description: 'Драйвер для видео-матрицы Intrend'
  };

  // Описание доступных команд
  static commands = {
    setRoute: {
      description: 'Маршрутизация входа на выход',
      parameters: [
        {
          name: 'input',
          type: 'number',
          description: 'Номер входа',
          required: true,
          min: 1
        },
        {
          name: 'output',
          type: 'number',
          description: 'Номер выхода',
          required: true,
          min: 1
        }
      ]
    },
    getRouteMatrix: {
      description: 'Получить текущую таблицу маршрутизации',
      parameters: []
    }
  };

  // Шаблоны для обработки ответов устройства
  static responses = {
    routeStatus: {
      description: 'Ответ о текущей маршрутизации',
      matcher: {
        // Пример: "IN1 VIDEO OUT3"\r
        pattern: /IN(\d+)\s+VIDEO\s+OUT(\d+)/
      },
      extract: function (match) {
        return {
          type: 'route',
          input: parseInt(match[1], 10),
          output: parseInt(match[2], 10)
        };
      }
    },
    routeMatrix: {
      description: 'Таблица маршрутизации всех выходов',
      matcher: {
        // Пример: "SYS ROUTE-MATRIX 002 002 001 001 001 001 001 001"\r
        pattern: /SYS\s+ROUTE-MATRIX\s+((?:\d{3}\s*)+)/
      },
      extract: function (match) {
        const list = match[1].trim().split(/\s+/);
        const routes = {};
        list.forEach((value, idx) => {
          routes[idx + 1] = parseInt(value, 10); // выход (idx+1) → вход value
        });
        return {
          type: 'routeMatrix',
          routes
        };
      }
    }
  };

  /**
   * Формирование команды маршрутизации.
   * @param {{ input: number, output: number }} params
   * @returns {{ payload: string }}
   */
  setRoute(params) {
    const { input, output } = params;
    // Команда завершается символом CR (\r, 0x0D)
    return { payload: `SET IN${input} VIDEO OUT${output}\r` };
  }

  // Метод запроса таблицы маршрутизации
  getRouteMatrix() {
    return { payload: 'GET SYS ROUTE-MATRIX\r' };
  }

  /**
   * При инициализации можно запросить текущее состояние или выполнить
   * другую логику. Сейчас ничего не делаем.
   */
  initialize() {
    this.publishCommand('getRouteMatrix');
  }
}

module.exports = IntrendMatrixDriver; 
