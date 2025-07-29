# Руководство пользователя по созданию драйверов для Dynamic Driver

## Содержание

1. [Введение](#введение)
2. [Подготовка к разработке](#подготовка-к-разработке)
3. [Структура драйвера](#структура-драйвера)
4. [Пошаговая разработка драйвера](#пошаговая-разработка-драйвера)
5. [Тестирование драйвера](#тестирование-драйвера)
6. [Расширенные возможности](#расширенные-возможности)
7. [Устранение неполадок](#устранение-неполадок)

## Введение

Dynamic Driver позволяет создавать собственные драйверы для управления различными устройствами через Node-RED.

В этом руководстве мы рассмотрим процесс создания драйвера с нуля, шаг за шагом, и расскажем о лучших практиках разработки.

## Подготовка к разработке

### Необходимые инструменты

1. Базовые знания JavaScript и Node.js
2. Документация на протокол взаимодействия с вашим устройством


### Расположение файла драйвера

Все драйверы должны быть размещены в папке `drivers` внутри директории Dynamic Driver.

## Структура драйвера

Драйвер представляет собой модуль который включает в себя модуль `BaseDriver`. BaseDriver предоставляет необходимую функциональность для взаимодействия с системой и устройством.

### Основные элементы драйвера

- **Метаданные** - описательная информация о драйвере
- **Команды** - доступные для выполнения команды и их параметры
- **Обработчики ответов** - шаблоны для распознавания и обработки ответов устройства
- **Методы форматирования команд** - преобразование высокоуровневых команд в формат устройства
- **Метод инициализации** - настройка драйвера при подключении

## Пошаговая разработка драйвера

### Шаг 1: Создание файла драйвера



### Шаг 2: Определение базовой структуры драйвера

```javascript
const BaseDriver = require('base-driver');

/**
 * Драйвер для устройства MyDevice
 */
class MyDeviceDriver extends BaseDriver {
  
}

module.exports = MyDeviceDriver;
```

### Шаг 3: Добавление метаданных драйвера

Метаданные помогают системе идентифицировать драйвер и отображать информацию о нем в интерфейсе. Добавьте следующий статический объект в класс драйвера:

```javascript
static metadata = {
  name: 'MyDevice',              // Имя драйвера
  manufacturer: 'MyCompany',     // Производитель устройства
  version: '1.0.0',              // Версия драйвера
  description: 'Драйвер для устройства MyDevice от MyCompany' // Описание
};
```

### Шаг 4: Определение команд

Команды определяют действия, которые можно выполнить с устройством. Каждая команда описывается в объекте `static commands`. 
Для каждого параметра можно указать:
* `name`        — имя поля.
* `type`        — `string` | `number` | `boolean`.
* `description` — пояснение.
* `required`    — если `true`, параметр обязателен. Узел «Device Command» проверит его наличие и подсветит поле в редакторе.
* Дополнительно: `min`/`max` (числа), `enum` (список допустимых значений).

```javascript
static commands = {
  setPower: {
    description: 'Включение/выключение устройства',
    parameters: [
      {
        name: 'value',
        type: 'boolean',
        description: 'Состояние питания (true=включено, false=выключено)',
        required: true
      }
    ]
  },
  setVolume: {
    description: 'Установка громкости',
    parameters: [
      {
        name: 'level',
        type: 'number',
        description: 'Уровень громкости (0-100)',
        required: true,
        min: 0,
        max: 100
      }
    ]
  },
  setInput: {
    description: 'Выбор входного источника',
    parameters: [
      {
        name: 'source',
        type: 'string',
        description: 'Имя источника (HDMI1, HDMI2, USB и т.д.)',
        required: true,
        enum: ['HDMI1', 'HDMI2', 'USB', 'Component', 'Composite']
      }
    ]
  },
  getStatus: {
    description: 'Запрос статуса устройства',
    parameters: []
  }
};
```

### Шаг 5: Определение обработчиков ответов

Обработчики ответов определяют, как драйвер будет интерпретировать данные, полученные от устройства. Используйте регулярные выражения для поиска шаблонов в ответах.

```javascript
static responses = {
  status: {
    description: 'Статус устройства',
    matcher: {
      pattern: /Status: (.+), Power: (.+), Volume: (.+), Input: (.+)/
    },
    extract: function(match) {
      return {
        status: match[1],
        power: match[2] === 'ON',
        volume: parseInt(match[3], 10),
        input: match[4]
      };
    }
  },
  powerStatus: {
    description: 'Статус питания',
    matcher: {
      pattern: /Power: (.+)/
    },
    extract: function(match) {
      return {
        power: match[1] === 'ON'
      };
    }
  },
  volumeStatus: {
    description: 'Текущая громкость',
    matcher: {
      pattern: /Volume: (\d+)/
    },
    extract: function(match) {
      return {
        volume: parseInt(match[1], 10)
      };
    }
  },
  inputStatus: {
    description: 'Текущий вход',
    matcher: {
      pattern: /Input: (.+)/
    },
    extract: function(match) {
      return {
        input: match[1]
      };
    }
  },
  error: {
    description: 'Ошибка устройства',
    matcher: {
      pattern: /Error: (.+)/
    },
    extract: function(match) {
      return {
        message: match[1]
      };
    }
  }
};
```

### Шаг 6: Реализация методов команд

Для каждой команды создайте метод с тем же именем, который возвращает объект с полем `payload` содержащим команду в формате, понятном устройству.

```javascript
// Метод для команды setPower
setPower(params) {
  const { value } = params;
  // Обновляем состояние
  this.state.power = value;
  // Возвращаем объект с полем payload - форматированной командой
  return { payload: `PWR ${value ? 'ON' : 'OFF'}\r\n` };
}

// Метод для команды setVolume
setVolume(params) {
  const { level } = params;
  // Проверка диапазона
  const safeLevel = Math.max(0, Math.min(100, level));
  // Обновляем состояние
  this.state.volume = safeLevel;
  // Возвращаем объект с полем payload
  return { payload: `VOL ${safeLevel}\r\n` };
}

// Метод для команды setInput
setInput(params) {
  const { source } = params;
  // Обновляем состояние
  this.state.input = source;
  // Возвращаем объект с полем payload
  return { payload: `INPUT ${source}\r\n` };
}

// Метод для команды getStatus
getStatus() {
  // Команда без параметров
  return { payload: `STATUS\r\n` };
}
```

### Шаг 7: Реализация метода инициализации

Метод `initialize` вызывается автоматически после успешного подключения к устройству. Используйте его для запроса начального состояния устройства или выполнения других действий при подключении.

```javascript
initialize() {
  // Запрос начального статуса устройства
  this.sendCommand('getStatus');
  
  // Можно добавить дополнительные обработчики ответов динамически
  this.addResponseHandler(/Version: (.+)/, (match, data) => {
    // Обновляем информацию об устройстве
    this.deviceInfo.firmwareVersion = match[1];
    // Возвращаем обработанные данные
    return { 
      type: 'version',
      version: match[1]
    };
  });
  
  this.addResponseHandler(/Serial: (.+)/, (match, data) => {
    this.deviceInfo.serialNumber = match[1];
    return { 
      type: 'serial',
      serialNumber: match[1]
    };
  });
}
```

### Шаг 8: Сборка полного драйвера

Объединим все части для создания полного драйвера:

```javascript
const BaseDriver = require('base-driver');

/**
 * Драйвер для устройства MyDevice
 */
class MyDeviceDriver extends BaseDriver {
  // Метаданные драйвера
  static metadata = {
    name: 'MyDevice',
    manufacturer: 'MyCompany',
    version: '1.0.0',
    description: 'Драйвер для устройства MyDevice от MyCompany'
  };
  
  // Определение команд
  static commands = {
    setPower: {
      description: 'Включение/выключение устройства',
      parameters: [
        {
          name: 'value',
          type: 'boolean',
          description: 'Состояние питания (true=включено, false=выключено)',
          required: true
        }
      ]
    },
    setVolume: {
      description: 'Установка громкости',
      parameters: [
        {
          name: 'level',
          type: 'number',
          description: 'Уровень громкости (0-100)',
          required: true,
          min: 0,
          max: 100
        }
      ]
    },
    setInput: {
      description: 'Выбор входного источника',
      parameters: [
        {
          name: 'source',
          type: 'string',
          description: 'Имя источника (HDMI1, HDMI2, USB и т.д.)',
          required: true,
          enum: ['HDMI1', 'HDMI2', 'USB', 'Component', 'Composite']
        }
      ]
    },
    getStatus: {
      description: 'Запрос статуса устройства',
      parameters: []
    }
  };
  
  // Определение обработчиков ответов
  static responses = {
    status: {
      description: 'Статус устройства',
      matcher: {
        pattern: /Status: (.+), Power: (.+), Volume: (.+), Input: (.+)/
      },
      extract: function(match) {
        return {
          status: match[1],
          power: match[2] === 'ON',
          volume: parseInt(match[3], 10),
          input: match[4]
        };
      }
    },
    powerStatus: {
      description: 'Статус питания',
      matcher: {
        pattern: /Power: (.+)/
      },
      extract: function(match) {
        return {
          power: match[1] === 'ON'
        };
      }
    },
    volumeStatus: {
      description: 'Текущая громкость',
      matcher: {
        pattern: /Volume: (\d+)/
      },
      extract: function(match) {
        return {
          volume: parseInt(match[1], 10)
        };
      }
    },
    inputStatus: {
      description: 'Текущий вход',
      matcher: {
        pattern: /Input: (.+)/
      },
      extract: function(match) {
        return {
          input: match[1]
        };
      }
    },
    error: {
      description: 'Ошибка устройства',
      matcher: {
        pattern: /Error: (.+)/
      },
      extract: function(match) {
        return {
          message: match[1]
        };
      }
    }
  };
    
  // Инициализация при подключении
  initialize() {
    console.log('Инициализация устройства MyDevice');
    
    // Запрос начального статуса при подключении
    this.publishCommand('getStatus');
    

  }
  
  // Методы команд
  setPower(params) {
    if (this.debug) {
      console.log('Выполнение команды setPower:', params);
    }
    
    const { value } = params;
    this.state.power = value;
    return { payload: `PWR ${value ? 'ON' : 'OFF'}\r\n` };
  }
  
  setVolume(params) {
    if (this.debug) {
      console.log('Выполнение команды setVolume:', params);
    }
    
    const { level } = params;
    // Проверка диапазона
    const safeLevel = Math.max(0, Math.min(100, level));
    this.state.volume = safeLevel;
    return { payload: `VOL ${safeLevel}\r\n` };
  }
  
  setInput(params) {
    if (this.debug) {
      console.log('Выполнение команды setInput:', params);
    }
    
    const { source } = params;
    this.state.input = source;
    return { payload: `INPUT ${source}\r\n` };
  }
  
  getStatus() {
    if (this.debug) {
      console.log('Выполнение команды getStatus');
    }
    
    return { payload: `STATUS\r\n` };
  }
  
  // Обработка нестандартных ответов
  parseResponse(data) {
    try {
      // Примеры обработки нестандартных ответов
      if (data.includes('System Info:')) {
        const info = data.replace('System Info:', '').trim();
        return {
          type: 'systemInfo',
          info: info
        };
      }
      
      return null; // Возвращаем null если ответ не распознан
    } catch (error) {
      console.error('Ошибка при обработке ответа:', error);
      return {
        type: 'error',
        message: error.message,
        raw: data
      };
    }
  }
}

module.exports = MyDeviceDriver;
```

### Использование драйвера 

1. После создания драйвера, нажмите кнопку сохранить
2. Добавьте узел "Device command" в рабочую область
3. В настройках узла выберите драйвер из списка
4. Настройте параметры подключения (тип транспорта, адрес, порт)
6. В настройках узла "Device Command" выберите команду для выполнения
7. Добавьте узел "Device Response Listener" для получения ответов от устройства
8. Запустите поток и проверьте работу драйвера

## Расширенные возможности

### Обработка сложных протоколов

Некоторые устройства используют сложные протоколы с двоичными данными или специальными форматами. 
В таких случаях можно использовать дополнительные методы обработки данных:

```javascript
// Для бинарных данных можно использовать буферы
binaryCommand(params) {
  const { data } = params;
  // Создаем буфер с командой
  const buffer = Buffer.from([0x02, data.charCodeAt(0), 0x03]);
  return { payload: buffer };
}

// Обработка бинарных ответов
static responses = {
  binaryResponse: {
    description: 'Бинарный ответ',
    matcher: {
      pattern: /\x02(.+)\x03/
    },
    extract: function(match) {
      // Преобразование бинарных данных
      const payload = match[1];
      const value = payload.charCodeAt(0);
      return {
        value: value
      };
    }
  }
};
```

### Управление несколькими устройствами

Для протоколов, поддерживающих управление несколькими устройствами, можно добавить адресацию:

```javascript
setPower(params) {
  const { value, address = 1 } = params;
  this.state.power = value;
  // Добавляем адрес устройства в команду
  return { payload: `${address}:PWR ${value ? 'ON' : 'OFF'}\r\n` };
}
```

### Множественные ответы и publishResponse

Иногда устройство присылает **несколько независимых сообщений в одном сетевом пакете**. Базовый класс драйвера предоставляет два вспомогательных метода, благодаря которым такая ситуация легко обрабатывается.

Когда использовать:

1. **Один ответ** – верните объект из `parseResponse()` с помощью `return`.
2. **Несколько ответов сразу** – верните `Array` объектов, каждый будет опубликован системой по очереди.
3. **Асинхронная логика** – внутри `parseResponse()` вызывайте `this.publishResponse()` столько раз, сколько нужно, и затем верните `return null`.

```javascript
// Пример: в буфере сразу два ответа разделены переводом строки
parseResponse(data) {
  const parts = data.data.split('\r\n').filter(Boolean);
  if (parts.length === 1) {
    // Простой случай – один ответ
    return this._parseSingle(parts[0]);
  }

  // Сложный случай: публикуем через publishResponse
  parts.forEach(part => {
    const parsed = this._parseSingle(part);
    // second parameter не обязателен, но полезен для дебага, в данном случае в raw записываем сырой ответ
    this.publishResponse(parsed, { raw: part });
  });
  return null;
}
```
* **`publishResponse(payload, originalMsg)`** – публикует один распарсенный ответ наружу.
  * `payload` – объект-результат вашего парсинга (то же, что обычно возвращает `parseResponse`).
  * `originalMsg` – необязательный объект-обёртка для сырого пакета/любой вспомогательной информации. Он попадёт в узел «Device Response Listener» как `msg.originalMsg`. Если не нужен — опустите параметр.

> **Важно:** если вернёте `null` или `undefined`, система считает, что драйвер уже опубликовал ответы. Если ответ передается не корректно, он всегда попадает на первый выход.

> **Важно:** если драйвер возвращает сообщение, которое не соответствует правилам маршрутизации (например, отсутствует поле type или его значение не указано в outputsMap), узел-слушатель направит такое сообщение на первый выход. В этом случае настроенная карта выходов игнорируется.

### Инициирование команд и `publishCommand`

Иногда драйверу нужно **самому** отправить команду устройству — например, при `initialize()` или при изменении внутренних таймеров.В `BaseDriver` имеется вспомогательный метод `publishCommand`:

```javascript
publishCommand(command, params = {})
```

* `command` - Имя команды
* `params` - Параметры команды

#### Когда использовать

* Запрос начальных статусов в `initialize()`.
* Реакция на внутренние события драйвера без участия внешних узлов.

#### Пример: запрос статуса при инициализации

```javascript
initialize() {
  // Вместо прямого вызова sendCommand → write используйте publishCommand
  this.publishCommand('getStatus');

  // Или несколько команд сразу
  this.publishCommand('getVolume');
  this.publishCommand('getInput');
}
```

#### Передача готового объекта

Если у вас уже есть сформированный объект (например, после вычислений), можно передать его напрямую:

```javascript
this.publishCommand({ command: 'setPower', parameters: { value: true } });
```

#### Примеры вызова `publishCommand`

```javascript
// 1) Булев параметр – включаем питание
this.publishCommand('setPower', { value: true });

// 2) То же, но сразу объектом
this.publishCommand({ command: 'setPower', parameters: { value: false } });

// 3) Числовой параметр – установить громкость
this.publishCommand('setVolume', { level: 25 });

// 4) Значение из enum – переключиться на HDMI2
this.publishCommand('setInput', { source: 'HDMI2' });

// 5) Несколько числовых параметров
this.publishCommand('multiSet', { brightness: 80, contrast: 60 });
```

### Автоматический Keep-Alive

Узел **Device Connection** может автоматически отправлять «пинг»-команды, чтобы поддерживать соединение и регулярно опрашивать устройство.

* В настройках узла есть параметры:
  * **Keep Alive** – включить/выключить (по умолчанию выключена).
  * **Interval** – период в секундах (поле *Keep Alive interval*).


### Проверка регулярных выражений

Если обработчики ответов не срабатывают, проверьте корректность регулярных выражений:

```javascript
// Тестирование регулярного выражения
const regex = /Status: (.+), Power: (.+), Volume: (.+)/;
const testData = "Status: READY, Power: ON, Volume: 50";
const match = testData.match(regex);

if (match) {
  console.log('Совпадение найдено:');
  console.log('Статус:', match[1]);
  console.log('Питание:', match[2]);
  console.log('Громкость:', match[3]);
} else {
  console.log('Совпадение не найдено');
}
```

### Проблемы с форматированием команд

Если команды не отправляются корректно, убедитесь, что:

1. Метод (функция) имеет то же имя, что и команда в `static commands`
2. Команда корректно возвращает объект с полем `payload`

#### Подробно о параметрах команд

Ниже приведены типовые сценарии и то, как они описываются в массиве `parameters`.

| Сценарий | Как описать в `parameters` | Что увидит пользователь в узле **Device Command** |
|----------|---------------------------|-----------------------------------------------|
| Несколько числовых параметров | `multiSet` (см. пример ниже) | Два numeric-input поля. |
| Выпадающий список (enum) | `setInput` (см. пример ниже) | Dropdown-меню со значениями из `enum`. |
| Число с пределами | `setVolume` (см. пример ниже) | Numeric-input с валидацией `min`/`max`. |
| Булев параметр | `setPower` (см. пример ниже) | Dropdown-меню `True/False`. |

##### Примеры описаний

```js
// Несколько параметров
multiSet: {
  description: 'Яркость и контраст',
  parameters: [
    { name: 'brightness', type: 'number', min: 0, max: 100, required: true },
    { name: 'contrast',   type: 'number', min: 0, max: 100, required: true }
  ]
}

// Выпадающий список
setInput: {
  parameters: [
    { name: 'source', type: 'string', enum: ['HDMI1', 'HDMI2', 'USB'] }
  ]
}

// Число с пределами
setVolume: {
  parameters: [
    { name: 'level', type: 'number', min: 0, max: 100 }
  ]
}

// Булево
setPower: {
  parameters: [
    { name: 'value', type: 'boolean', required: true }
  ]
}
```

> Если у параметра указано `required: true`, узел не позволит оставить поле пустым.

##### Динамическое заполнение параметров из сообщения

Пример:

```javascript
// Function-node перед Device Command
msg.parameters = { brightness: 80, contrast: 55 };
return msg;
```

Если параметр содержит `enum`, убедитесь, что переданное значение входит в список.

---
 
