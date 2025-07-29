const BaseDriver = require('base-driver');

/**
 * Драйвер для 3×2-коммутатора Atlona (аудио + видео)
 * Команда маршрутизации:  x?AVx&   (пример: x1AVx2 — вход 1 → выход 2)
 */
class AtlonaAVSwitcherDriver extends BaseDriver {
    /* ===== МЕТАДАННЫЕ ===== */
    static metadata = {
        name:         'Atlona-3x2-AV',
        manufacturer: 'Atlona',
        version:      '1.0.0',
        description:  'Драйвер матричного переключателя 3×2 (AV)',
    };

    /* ===== КОМАНДЫ ===== */
    static commands = {
        /** Назначить вход на выход */
        setRoute: {
            description: 'Переключить вход на выход',
            parameters: [
                { name: 'input',  type: 'number', min: 1, max: 3, required: true,
                  description: 'Номер входа (1-3)' },
                { name: 'output', type: 'number', min: 1, max: 2, required: true,
                  description: 'Номер выхода (1-2)' },
            ],
        },

        /** Запросить, какой вход назначен на указанный выход */
        getRoute: {
            description: 'Получить текущий маршрут для выхода',
            parameters: [
                { name: 'output', type: 'number', min: 1, max: 2, required: true,
                  description: 'Номер выхода (1-2)' },
            ],
        },
    };

    /* ===== ШАБЛОНЫ ОТВЕТОВ ===== */
    static responses = {
        /** Ответ вида «x1AVx2» */
        route: {
            description: 'Результат маршрутизации',
            matcher:  { pattern: /^x([1-3])AVx([1-2])$/i },
            extract:  ([, inp, out]) => ({ input: Number(inp), output: Number(out) }),
        },
    };

    /* ===== КОНСТРУКТОР ===== */
    constructor(options = {}) {
        super(options);
        // Храним текущее назначение: [выход1, выход2] ⇒ вход
        this.outputs = [1, 1];    // по умолчанию оба выхода на вход 1
    }

    /* ===== ИНИЦИАЛИЗАЦИЯ ===== */
    initialize() {
        // Узнаём маршруты обоих выходов
        this.getRoute({ output: 1 });
        this.getRoute({ output: 2 });
    }

    /* ===== РЕАЛИЗАЦИЯ КОМАНД ===== */
    /** setRoute({ input: 2, output: 1 }) */
    setRoute({ input, output }) {
        const inp = Math.max(1, Math.min(3, input));
        const out = Math.max(1, Math.min(2, output));
        this.outputs[out - 1] = inp;
        return { payload: `x${inp}AVx${out}\r\n` };
    }

    /** getRoute({ output: 2 }) */
    getRoute({ output }) {
        const out = Math.max(1, Math.min(2, output));
        // Протокол использует «?» для запроса активного входа
        return { payload: `x?AVx${out}\r\n` };
    }

    /* ===== ПАРСЕР ОТВЕТОВ ===== */
    parseResponse(data) {
        // «x1AVx2» — вход 1 → выход 2
        const m = data.data.match(/^x([1-3])AVx([1-2])$/i);
        if (m) {
            const inp = Number(m[1]);
            const out = Number(m[2]);
            this.outputs[out - 1] = inp;
            return { type: 'route', input: inp, output: out };
        }

        // Ошибка «ERR» (часто встречается у Atlona)
        if (/ERR/i.test(data)) {
            return { type: 'error', message: data.trim() };
        }

        return null; // неизвестный формат
    }
}

module.exports = AtlonaAVSwitcherDriver;
