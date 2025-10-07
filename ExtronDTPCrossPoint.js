const BaseDriver = require('base-driver');

class ExtronDTPCrossPointDriver extends BaseDriver {
    static metadata = {
        name: 'Extron DTP CrossPoint 4K',
        manufacturer: 'Extron',
        version: '1.0.0',
        description: 'Драйвер для Extron DTP CrossPoint 86/108 4K (основные функции)'
    };

    static commands = {
        enableVerbose: {
            description: 'Включить verbose режим',
            parameters: []
        },
        refreshMatrix: {
            description: 'Обновить состояние связей',
            parameters: []
        },

        // Matrix tie
        setTie: {
            description: 'Связь вход-выход',
            parameters: [{
                name: 'input',
                type: 'number',
                required: true
            }, {
                name: 'output',
                type: 'string',
                required: true
            }, {
                name: 'type',
                type: 'string',
                enum: ['Audio/Video', 'Video', 'Audio'],
                required: true
            }]
        },

        // Mutes / Global
        setVideoMute: {
            description: 'Мьют видео на выходе',
            parameters: [{
                name: 'output',
                type: 'string',
                required: true
            }, {
                name: 'value',
                type: 'string',
                enum: ['Off', 'Video', 'Video & Sync'],
                required: true
            }]
        },
        setGlobalVideoMute: {
            description: 'Глобальный видео мьют',
            parameters: [{
                name: 'value',
                type: 'string',
                enum: ['Off', 'Video', 'Video & Sync'],
                required: true
            }]
        },

        // HDCP
        setHdcpInputAuthorization: {
            description: 'HDCP авторизация на входе',
            parameters: [{
                name: 'input',
                type: 'number',
                required: true
            }, {
                name: 'value',
                type: 'string',
                enum: ['On', 'Off'],
                required: true
            }]
        },
        getHdcpInputAuthorization: {
            description: 'Статус HDCP авторизации входа',
            parameters: [{
                name: 'input',
                type: 'number',
                required: true
            }]
        },
        getHdcpInputStatus: {
            description: 'HDCP статус входа',
            parameters: [{
                name: 'input',
                type: 'number',
                required: true
            }]
        },
        setHdcpOutputAuthorization: {
            description: 'HDCP авторизация выхода',
            parameters: [{
                name: 'output',
                type: 'string',
                required: true
            }, {
                name: 'value',
                type: 'string',
                enum: ['On', 'Auto'],
                required: true
            }]
        },
        getHdcpOutputAuthorization: {
            description: 'Статус HDCP авторизации выхода',
            parameters: [{
                name: 'output',
                type: 'string',
                required: true
            }]
        },
        getHdcpOutputStatus: {
            description: 'HDCP статус выхода',
            parameters: [{
                name: 'output',
                type: 'string',
                required: true
            }]
        },

        // EDID
        getEdidAssignment: {
            description: 'Назначение EDID входа',
            parameters: [{
                name: 'input',
                type: 'number',
                required: true
            }]
        },

        // Executive
        setExecutiveMode: {
            description: 'Executive Mode',
            parameters: [{
                name: 'mode',
                type: 'string',
                enum: ['Off', 'Mode 1', 'Mode 2'],
                required: true
            }]
        },
        getExecutiveMode: {
            description: 'Статус Executive Mode',
            parameters: []
        },

        // Presets
        recallPreset: {
            description: 'Вызов пресета',
            parameters: [{
                name: 'id',
                type: 'number',
                required: true
            }]
        },

        // Inputs/Temperature
        getInputSignalStatus: {
            description: 'Статус сигналов на входах',
            parameters: []
        },
        getTemperature: {
            description: 'Температура',
            parameters: []
        },

        // Output resolution
        setOutputResolution: {
            description: 'Установить разрешение на выходе',
            parameters: [{
                name: 'output',
                type: 'number',
                required: true
            }, {
                name: 'code',
                type: 'string',
                required: true
            }]
        },
        getOutputResolution: {
            description: 'Статус разрешения на выходе',
            parameters: [{
                name: 'output',
                type: 'number',
                required: true
            }]
        },

        // Test pattern
        setTestPattern: {
            description: 'Тестовый паттерн',
            parameters: [{
                name: 'output',
                type: 'number',
                required: true
            }, {
                name: 'pattern',
                type: 'string',
                enum: ['Off', 'Crop', 'Alternating Pixels', 'Crosshatch', 'Color Bars', 'Grayscale', 'Blue Mode'],
                required: true
            }]
        },
        getTestPattern: {
            description: 'Статус тестового паттерна',
            parameters: [{
                name: 'output',
                type: 'number',
                required: true
            }]
        },

        // Output audio select
        setOutputAudioSelect: {
            description: 'Выбор источника аудио на выходе',
            parameters: [{
                name: 'output',
                type: 'number',
                required: true
            }, {
                name: 'mode',
                type: 'string',
                enum: ['Original HDMI', 'Embedded Audio', 'No Audio'],
                required: true
            }]
        },
        getOutputAudioSelect: {
            description: 'Статус источника аудио на выходе',
            parameters: [{
                name: 'output',
                type: 'number',
                required: true
            }]
        },
        getOutputAudioSelectAll: {
            description: 'Статус источника аудио на всех выходах',
            parameters: []
        },

        // Freeze
        setFreeze: {
            description: 'Freeze на выходе',
            parameters: [{
                name: 'output',
                type: 'number',
                required: true
            }, {
                name: 'value',
                type: 'string',
                enum: ['On', 'Off'],
                required: true
            }]
        },
        getFreeze: {
            description: 'Статус Freeze',
            parameters: [{
                name: 'output',
                type: 'number',
                required: true
            }]
        },

        // ================= AUDIO BLOCK =================
        // Amplifier (Mono/SA)
        setAmplifierAttenuationMA: {
            description: 'Аттенюация усилителя (Mono)',
            parameters: [{
                name: 'value',
                type: 'number',
                min: -100,
                max: 0,
                required: true
            }]
        },
        getAmplifierAttenuationMA: {
            description: 'Статус аттенюации усилителя (Mono)',
            parameters: []
        },
        setAmplifierAttenuationSA: {
            description: 'Аттенюация усилителя (Stereo)',
            parameters: [{
                name: 'lr',
                type: 'string',
                enum: ['Left', 'Right'],
                required: true
            }, {
                name: 'value',
                type: 'number',
                min: -100,
                max: 0,
                required: true
            }]
        },
        getAmplifierAttenuationSA: {
            description: 'Статус аттенюации усилителя (Stereo)',
            parameters: [{
                name: 'lr',
                type: 'string',
                enum: ['Left', 'Right'],
                required: true
            }]
        },
        setAmplifierMuteMA: {
            description: 'Мьют усилителя (Mono)',
            parameters: [{
                name: 'value',
                type: 'string',
                enum: ['On', 'Off'],
                required: true
            }]
        },
        getAmplifierMuteMA: {
            description: 'Статус мьюта усилителя (Mono)',
            parameters: []
        },
        setAmplifierMuteSA: {
            description: 'Мьют усилителя (Stereo)',
            parameters: [{
                name: 'lr',
                type: 'string',
                enum: ['Left', 'Right'],
                required: true
            }, {
                name: 'value',
                type: 'string',
                enum: ['On', 'Off'],
                required: true
            }]
        },
        getAmplifierMuteSA: {
            description: 'Статус мьюта усилителя (Stereo)',
            parameters: [{
                name: 'lr',
                type: 'string',
                enum: ['Left', 'Right'],
                required: true
            }]
        },
        setAmplifierPostmixerTrim: {
            description: 'Postmixer Trim усилителя (Stereo)',
            parameters: [{
                name: 'lr',
                type: 'string',
                enum: ['Left', 'Right'],
                required: true
            }, {
                name: 'value',
                type: 'number',
                min: -12,
                max: 12,
                required: true
            }]
        },
        getAmplifierPostmixerTrim: {
            description: 'Статус Postmixer Trim (Stereo)',
            parameters: [{
                name: 'lr',
                type: 'string',
                enum: ['Left', 'Right'],
                required: true
            }]
        },

        // Analog outputs 1..4
        setAnalogAttenuation: {
            description: 'Аналоговая аттенюация выхода',
            parameters: [{
                name: 'lr',
                type: 'string',
                enum: ['Left', 'Right'],
                required: true
            }, {
                name: 'output',
                type: 'number',
                required: true
            }, {
                name: 'value',
                type: 'number',
                min: -100,
                max: 0,
                required: true
            }]
        },
        getAnalogAttenuation: {
            description: 'Статус аналоговой аттенюации',
            parameters: [{
                name: 'lr',
                type: 'string',
                enum: ['Left', 'Right'],
                required: true
            }, {
                name: 'output',
                type: 'number',
                required: true
            }]
        },
        setAnalogMute: {
            description: 'Аналоговый мьют выхода',
            parameters: [{
                name: 'lr',
                type: 'string',
                enum: ['Left', 'Right'],
                required: true
            }, {
                name: 'output',
                type: 'number',
                required: true
            }, {
                name: 'value',
                type: 'string',
                enum: ['On', 'Off'],
                required: true
            }]
        },
        getAnalogMute: {
            description: 'Статус аналогового мьюта',
            parameters: [{
                name: 'lr',
                type: 'string',
                enum: ['Left', 'Right'],
                required: true
            }, {
                name: 'output',
                type: 'number',
                required: true
            }]
        },

        // DTP outputs
        setDtpAttenuation: {
            description: 'DTP аттенюация выхода',
            parameters: [{
                name: 'lr',
                type: 'string',
                enum: ['Left', 'Right'],
                required: true
            }, {
                name: 'output',
                type: 'number',
                required: true
            }, {
                name: 'value',
                type: 'number',
                min: -100,
                max: 0,
                required: true
            }]
        },
        getDtpAttenuation: {
            description: 'Статус DTP аттенюации',
            parameters: [{
                name: 'lr',
                type: 'string',
                enum: ['Left', 'Right'],
                required: true
            }, {
                name: 'output',
                type: 'number',
                required: true
            }]
        },
        setDtpMute: {
            description: 'DTP мьют выхода',
            parameters: [{
                name: 'lr',
                type: 'string',
                enum: ['Left', 'Right'],
                required: true
            }, {
                name: 'output',
                type: 'number',
                required: true
            }, {
                name: 'value',
                type: 'string',
                enum: ['On', 'Off'],
                required: true
            }]
        },
        getDtpMute: {
            description: 'Статус DTP мьюта',
            parameters: [{
                name: 'lr',
                type: 'string',
                enum: ['Left', 'Right'],
                required: true
            }, {
                name: 'output',
                type: 'number',
                required: true
            }]
        },

        // HDMI audio on outputs 1..4
        setHdmiAttenuation: {
            description: 'HDMI аудио аттенюация',
            parameters: [{
                name: 'lr',
                type: 'string',
                enum: ['Left', 'Right'],
                required: true
            }, {
                name: 'output',
                type: 'number',
                required: true
            }, {
                name: 'value',
                type: 'number',
                min: -100,
                max: 0,
                required: true
            }]
        },
        getHdmiAttenuation: {
            description: 'Статус HDMI аудио аттенюации',
            parameters: [{
                name: 'lr',
                type: 'string',
                enum: ['Left', 'Right'],
                required: true
            }, {
                name: 'output',
                type: 'number',
                required: true
            }]
        },
        setHdmiMute: {
            description: 'HDMI аудио мьют',
            parameters: [{
                name: 'lr',
                type: 'string',
                enum: ['Left', 'Right'],
                required: true
            }, {
                name: 'output',
                type: 'number',
                required: true
            }, {
                name: 'value',
                type: 'string',
                enum: ['On', 'Off'],
                required: true
            }]
        },
        getHdmiMute: {
            description: 'Статус HDMI аудио мьюта',
            parameters: [{
                name: 'lr',
                type: 'string',
                enum: ['Left', 'Right'],
                required: true
            }, {
                name: 'output',
                type: 'number',
                required: true
            }]
        },

        // Inputs
        setInputAudioSwitchMode: {
            description: 'Режим аудио входа',
            parameters: [{
                name: 'input',
                type: 'number',
                required: true
            }, {
                name: 'mode',
                type: 'string',
                enum: ['Auto', 'Digital', 'Analog'],
                required: true
            }]
        },
        getInputAudioSwitchMode: {
            description: 'Статус режима аудио входа',
            parameters: [{
                name: 'input',
                type: 'number',
                required: true
            }]
        },
        getInputAudioSwitchModeAll: {
            description: 'Статус режима аудио всех входов',
            parameters: []
        },
        setInputGain: {
            description: 'Гейн аудио входа',
            parameters: [{
                name: 'format',
                type: 'string',
                enum: ['Analog', 'Digital'],
                required: true
            }, {
                name: 'lr',
                type: 'string',
                enum: ['Left', 'Right'],
                required: true
            }, {
                name: 'input',
                type: 'number',
                required: true
            }, {
                name: 'value',
                type: 'number',
                min: -18,
                max: 24,
                required: true
            }]
        },
        getInputGain: {
            description: 'Статус гейна аудио входа',
            parameters: [{
                name: 'format',
                type: 'string',
                enum: ['Analog', 'Digital'],
                required: true
            }, {
                name: 'lr',
                type: 'string',
                enum: ['Left', 'Right'],
                required: true
            }, {
                name: 'input',
                type: 'number',
                required: true
            }]
        },
        setInputMute: {
            description: 'Мьют аудио входа',
            parameters: [{
                name: 'lr',
                type: 'string',
                enum: ['Left', 'Right'],
                required: true
            }, {
                name: 'input',
                type: 'number',
                required: true
            }, {
                name: 'value',
                type: 'string',
                enum: ['On', 'Off'],
                required: true
            }]
        },
        getInputMute: {
            description: 'Статус мьюта аудио входа',
            parameters: [{
                name: 'lr',
                type: 'string',
                enum: ['Left', 'Right'],
                required: true
            }, {
                name: 'input',
                type: 'number',
                required: true
            }]
        },

        // Mic lines
        setMicLineGain: {
            description: 'Гейн микрофонного входа (1..4)',
            parameters: [{
                name: 'input',
                type: 'number',
                required: true
            }, {
                name: 'value',
                type: 'number',
                min: -18,
                max: 80,
                required: true
            }]
        },
        getMicLineGain: {
            description: 'Статус гейна микрофонного входа',
            parameters: [{
                name: 'input',
                type: 'number',
                required: true
            }]
        },
        setMicLineMute: {
            description: 'Мьют микрофонного входа',
            parameters: [{
                name: 'input',
                type: 'number',
                required: true
            }, {
                name: 'value',
                type: 'string',
                enum: ['On', 'Off'],
                required: true
            }]
        },
        getMicLineMute: {
            description: 'Статус мьюта микрофонного входа',
            parameters: [{
                name: 'input',
                type: 'number',
                required: true
            }]
        },
        getMicrophoneSignalStatus: {
            description: 'Уровень сигнала микрофона',
            parameters: [{
                name: 'input',
                type: 'number',
                required: true
            }]
        },

        // Premixer / Prematrix / Postmixer / PostMatrix
        setPremixerGain: {
            description: 'Premixer Gain (Mic 1..4)',
            parameters: [{
                name: 'input',
                type: 'number',
                required: true
            }, {
                name: 'value',
                type: 'number',
                min: -100,
                max: 12,
                required: true
            }]
        },
        getPremixerGain: {
            description: 'Статус Premixer Gain',
            parameters: [{
                name: 'input',
                type: 'number',
                required: true
            }]
        },
        setPremixerMute: {
            description: 'Premixer Mute (Mic 1..4)',
            parameters: [{
                name: 'input',
                type: 'number',
                required: true
            }, {
                name: 'value',
                type: 'string',
                enum: ['On', 'Off'],
                required: true
            }]
        },
        getPremixerMute: {
            description: 'Статус Premixer Mute',
            parameters: [{
                name: 'input',
                type: 'number',
                required: true
            }]
        },
        setPrematrixTrim: {
            description: 'Pre-matrix trim (на вход)',
            parameters: [{
                name: 'lr',
                type: 'string',
                enum: ['Left', 'Right'],
                required: true
            }, {
                name: 'input',
                type: 'number',
                required: true
            }, {
                name: 'value',
                type: 'number',
                min: -12,
                max: 12,
                required: true
            }]
        },
        getPrematrixTrim: {
            description: 'Статус Pre-matrix trim',
            parameters: [{
                name: 'lr',
                type: 'string',
                enum: ['Left', 'Right'],
                required: true
            }, {
                name: 'input',
                type: 'number',
                required: true
            }]
        },
        setOutputPostmixerTrim: {
            description: 'Postmixer Trim (на выход)',
            parameters: [{
                name: 'lr',
                type: 'string',
                enum: ['Left', 'Right'],
                required: true
            }, {
                name: 'output',
                type: 'number',
                required: true
            }, {
                name: 'value',
                type: 'number',
                min: -12,
                max: 12,
                required: true
            }]
        },
        getOutputPostmixerTrim: {
            description: 'Статус Postmixer Trim',
            parameters: [{
                name: 'lr',
                type: 'string',
                enum: ['Left', 'Right'],
                required: true
            }, {
                name: 'output',
                type: 'number',
                required: true
            }]
        },
        setPostMatrixGain: {
            description: 'Post-matrix Gain (на выход)',
            parameters: [{
                name: 'lr',
                type: 'string',
                enum: ['Left', 'Right'],
                required: true
            }, {
                name: 'output',
                type: 'number',
                required: true
            }, {
                name: 'value',
                type: 'number',
                min: -100,
                max: 12,
                required: true
            }]
        },
        getPostMatrixGain: {
            description: 'Статус Post-matrix Gain',
            parameters: [{
                name: 'lr',
                type: 'string',
                enum: ['Left', 'Right'],
                required: true
            }, {
                name: 'output',
                type: 'number',
                required: true
            }]
        },
        setPostMatrixMute: {
            description: 'Post-matrix Mute (на выход)',
            parameters: [{
                name: 'lr',
                type: 'string',
                enum: ['Left', 'Right'],
                required: true
            }, {
                name: 'output',
                type: 'number',
                required: true
            }, {
                name: 'value',
                type: 'string',
                enum: ['On', 'Off'],
                required: true
            }]
        },
        getPostMatrixMute: {
            description: 'Статус Post-matrix Mute',
            parameters: [{
                name: 'lr',
                type: 'string',
                enum: ['Left', 'Right'],
                required: true
            }, {
                name: 'output',
                type: 'number',
                required: true
            }]
        },

        // Mixpoint (matrix mixer)
        setMixpointGain: {
            description: 'Mixpoint Gain (Input->Output)',
            parameters: [{
                name: 'inputLabel',
                type: 'string',
                required: true
            }, {
                name: 'outputLabel',
                type: 'string',
                required: true
            }, {
                name: 'value',
                type: 'number',
                min: -100,
                max: 12,
                required: true
            }]
        },
        getMixpointGain: {
            description: 'Статус Mixpoint Gain',
            parameters: [{
                name: 'inputLabel',
                type: 'string',
                required: true
            }, {
                name: 'outputLabel',
                type: 'string',
                required: true
            }]
        },
        setMixpointMute: {
            description: 'Mixpoint Mute (Input->Output)',
            parameters: [{
                name: 'inputLabel',
                type: 'string',
                required: true
            }, {
                name: 'outputLabel',
                type: 'string',
                required: true
            }, {
                name: 'value',
                type: 'string',
                enum: ['On', 'Off'],
                required: true
            }]
        },
        getMixpointMute: {
            description: 'Статус Mixpoint Mute',
            parameters: [{
                name: 'inputLabel',
                type: 'string',
                required: true
            }, {
                name: 'outputLabel',
                type: 'string',
                required: true
            }]
        },

        // Phantom power (Mic 1..4)
        setPhantomPower: {
            description: 'Фантомное питание',
            parameters: [{
                name: 'input',
                type: 'number',
                required: true
            }, {
                name: 'value',
                type: 'string',
                enum: ['On', 'Off'],
                required: true
            }]
        },
        getPhantomPower: {
            description: 'Статус фантомного питания',
            parameters: [{
                name: 'input',
                type: 'number',
                required: true
            }]
        },

        // Virtual Returns A..H
        setVirtualReturnGain: {
            description: 'Virtual Return Gain (A..H)',
            parameters: [{
                name: 'channel',
                type: 'string',
                enum: ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'],
                required: true
            }, {
                name: 'value',
                type: 'number',
                min: -100,
                max: 12,
                required: true
            }]
        },
        getVirtualReturnGain: {
            description: 'Статус Virtual Return Gain',
            parameters: [{
                name: 'channel',
                type: 'string',
                enum: ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'],
                required: true
            }]
        },
        setVirtualReturnMute: {
            description: 'Virtual Return Mute (A..H)',
            parameters: [{
                name: 'channel',
                type: 'string',
                enum: ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'],
                required: true
            }, {
                name: 'value',
                type: 'string',
                enum: ['On', 'Off'],
                required: true
            }]
        },
        getVirtualReturnMute: {
            description: 'Статус Virtual Return Mute',
            parameters: [{
                name: 'channel',
                type: 'string',
                enum: ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'],
                required: true
            }]
        },

        // Expansion premixer (inputs 1..16)
        setExpansionPremixerGain: {
            description: 'Expansion Premixer Gain (1..16)',
            parameters: [{
                name: 'input',
                type: 'number',
                required: true
            }, {
                name: 'value',
                type: 'number',
                min: -100,
                max: 12,
                required: true
            }]
        },
        getExpansionPremixerGain: {
            description: 'Статус Expansion Premixer Gain',
            parameters: [{
                name: 'input',
                type: 'number',
                required: true
            }]
        },
        setExpansionPremixerMute: {
            description: 'Expansion Premixer Mute (1..16)',
            parameters: [{
                name: 'input',
                type: 'number',
                required: true
            }, {
                name: 'value',
                type: 'string',
                enum: ['On', 'Off'],
                required: true
            }]
        },
        getExpansionPremixerMute: {
            description: 'Статус Expansion Premixer Mute',
            parameters: [{
                name: 'input',
                type: 'number',
                required: true
            }]
        },

        // Group functions (1..32)
        setGroupMicLineInputGain: {
            description: 'Group Mic/Line Input Gain',
            parameters: [{
                name: 'group',
                type: 'number',
                required: true
            }, {
                name: 'value',
                type: 'number',
                min: -80,
                max: 80,
                required: true
            }]
        },
        getGroupMicLineInputGain: {
            description: 'Статус Group Mic/Line Input Gain',
            parameters: [{
                name: 'group',
                type: 'number',
                required: true
            }]
        },
        setGroupMixpoint: {
            description: 'Group Mixpoint',
            parameters: [{
                name: 'group',
                type: 'number',
                required: true
            }, {
                name: 'value',
                type: 'number',
                min: -100,
                max: 12,
                required: true
            }]
        },
        getGroupMixpoint: {
            description: 'Статус Group Mixpoint',
            parameters: [{
                name: 'group',
                type: 'number',
                required: true
            }]
        },
        setGroupMute: {
            description: 'Group Mute',
            parameters: [{
                name: 'group',
                type: 'number',
                required: true
            }, {
                name: 'value',
                type: 'string',
                enum: ['On', 'Off'],
                required: true
            }]
        },
        getGroupMute: {
            description: 'Статус Group Mute',
            parameters: [{
                name: 'group',
                type: 'number',
                required: true
            }]
        },
        setGroupOutputAttenuation: {
            description: 'Group Output Attenuation',
            parameters: [{
                name: 'group',
                type: 'number',
                required: true
            }, {
                name: 'value',
                type: 'number',
                min: -100,
                max: 0,
                required: true
            }]
        },
        getGroupOutputAttenuation: {
            description: 'Статус Group Output Attenuation',
            parameters: [{
                name: 'group',
                type: 'number',
                required: true
            }]
        },
        setGroupPremixerGain: {
            description: 'Group Premixer Gain',
            parameters: [{
                name: 'group',
                type: 'number',
                required: true
            }, {
                name: 'value',
                type: 'number',
                min: -100,
                max: 12,
                required: true
            }]
        },
        getGroupPremixerGain: {
            description: 'Статус Group Premixer Gain',
            parameters: [{
                name: 'group',
                type: 'number',
                required: true
            }]
        },
        setGroupPostmixerTrim: {
            description: 'Group Postmixer Trim',
            parameters: [{
                name: 'group',
                type: 'number',
                required: true
            }, {
                name: 'value',
                type: 'number',
                min: -12,
                max: 12,
                required: true
            }]
        },
        getGroupPostmixerTrim: {
            description: 'Статус Group Postmixer Trim',
            parameters: [{
                name: 'group',
                type: 'number',
                required: true
            }]
        },
        setGroupPrematrixTrim: {
            description: 'Group Prematrix Trim',
            parameters: [{
                name: 'group',
                type: 'number',
                required: true
            }, {
                name: 'value',
                type: 'number',
                min: -12,
                max: 12,
                required: true
            }]
        },
        getGroupPrematrixTrim: {
            description: 'Статус Group Prematrix Trim',
            parameters: [{
                name: 'group',
                type: 'number',
                required: true
            }]
        }
    };

    static responses = {
        verboseAck: {
            matcher: {
                pattern: /Vrb3/i
            },
            extract: () => ({
                type: 'verbose',
                value: true
            })
        },
        qik: {
            matcher: {
                pattern: /Qik/i
            },
            extract: () => ({
                type: 'matrixChanged'
            })
        },
        presetAck: {
            matcher: {
                pattern: /Rpr\d\*\d+/i
            },
            extract: () => ({
                type: 'presetAck'
            })
        },

        // Matrix dumps
        matrixDumpVideo: {
            matcher: {
                pattern: /Vgp00 Out(\d{2})\*([0-9 -]*)Vid/i
            },
            extract: m => ({
                type: 'matrixDump',
                tieType: 'Video',
                outputStart: parseInt(m[1], 10),
                payload: m[2]
            })
        },
        matrixDumpAudio: {
            matcher: {
                pattern: /Vgp00 Out(\d{2})\*([0-9 -]*)Aud/i
            },
            extract: m => ({
                type: 'matrixDump',
                tieType: 'Audio',
                outputStart: parseInt(m[1], 10),
                payload: m[2]
            })
        },
        outputTieStatus: {
            matcher: {
                pattern: /(?:Out(\d+) In(\d+) (All|Vid|Aud))|(?:In(\d+) (All|Vid|Aud))/
            },
            extract: m => ({
                type: 'outputTieStatus',
                groups: m.slice(1)
            })
        },

        // EDID
        edidAssignment: {
            matcher: {
                pattern: /EdidA(0[1-9]|10)\*(\d+)/i
            },
            extract: m => ({
                type: 'edid',
                input: parseInt(m[1], 10),
                code: m[2]
            })
        },

        // Executive
        executiveMode: {
            matcher: {
                pattern: /Exe(0|1|2)/i
            },
            extract: m => ({
                type: 'executive',
                mode: {
                    '0': 'Off',
                    '1': 'Mode 1',
                    '2': 'Mode 2'
                } [m[1]]
            })
        },

        // HDCP
        hdcpInputAuth: {
            matcher: {
                pattern: /HdcpE(\d{2})\*(0|1)/i
            },
            extract: m => ({
                type: 'hdcpInputAuth',
                input: parseInt(m[1], 10),
                value: m[2] === '1' ? 'On' : 'Off'
            })
        },
        hdcpInputStatus: {
            matcher: {
                pattern: /HdcpI(\d{2})\*(0|1|2)/i
            },
            extract: m => ({
                type: 'hdcpInputStatus',
                input: parseInt(m[1], 10),
                value: {
                    '0': 'No Source Connected',
                    '1': 'HDCP Content',
                    '2': 'No HDCP Content'
                } [m[2]]
            })
        },
        hdcpOutputAuth: {
            matcher: {
                pattern: /HdcpS(([1-8])(A|B|a|b|))\*(0|1)/
            },
            extract: m => ({
                type: 'hdcpOutputAuth',
                output: m[1].toUpperCase(),
                value: m[4] === '1' ? 'On' : 'Auto'
            })
        },
        hdcpOutputStatus: {
            matcher: {
                pattern: /HdcpO(1|2|3|3A|3B|4|4A|4B|5|5A|5B|6|6A|6B|7|8)\*(0|1|2|3)/
            },
            extract: m => ({
                type: 'hdcpOutputStatus',
                output: m[1].toUpperCase(),
                value: {
                    '0': 'No monitor connected',
                    '1': 'Monitor connected, HDCP not supported',
                    '2': 'Monitor connected, not encrypted',
                    '3': 'Monitor connected, currently encrypted'
                } [m[2]]
            })
        },

        // Input signal
        inputSignals: {
            matcher: {
                pattern: /Frq00 ([0-1]+)/
            },
            extract: m => ({
                type: 'inputSignals',
                map: m[1]
            })
        },

        // Freeze
        freezeStatus: {
            matcher: {
                pattern: /Frz(\d{2})\*(00|01)/
            },
            extract: m => ({
                type: 'freeze',
                output: parseInt(m[1], 10),
                value: m[2] === '01' ? 'On' : 'Off'
            })
        },

        // Output audio select
        outputAudioSelectSingle: {
            matcher: {
                pattern: /AfmtO(\d{2})\*([0-2])/
            },
            extract: m => ({
                type: 'outputAudioSelect',
                output: parseInt(m[1], 10),
                value: {
                    '0': 'Original HDMI',
                    '1': 'Embedded Audio',
                    '2': 'No Audio'
                } [m[2]]
            })
        },
        outputAudioSelectAll: {
            matcher: {
                pattern: /AfmtO([0-2]{2,8})/
            },
            extract: m => ({
                type: 'outputAudioSelectAll',
                payload: m[1]
            })
        },

        // Output resolution
        outputResolution: {
            matcher: {
                pattern: /Rate(\d{2})\*(\d{2})/
            },
            extract: m => ({
                type: 'outputResolution',
                output: parseInt(m[1], 10),
                code: m[2]
            })
        },

        // Temperature
        temperature: {
            matcher: {
                pattern: /Sts00\*\d{1,3}\.\d{1,3}\s(\d{1,3}\.\d{1,3})\s\d+\s\d+/
            },
            extract: m => ({
                type: 'temperature',
                value: Math.round(parseFloat(m[1]))
            })
        },

        // Errors
        error: {
            matcher: {
                pattern: /E(01|1[0-7]|2[245678]|3[012])/
            },
            extract: m => ({
                type: 'error',
                code: m[1]
            })
        },

        // ================= AUDIO RESPONSES =================
        amplifierAttenuation: {
            matcher: {
                pattern: /Ds[gG]600(16|17)\*([-]?\d{1,4}|0)/
            },
            extract: m => ({
                type: 'amplifierAttenuationSA',
                lr: m[1] === '16' ? 'Left' : 'Right',
                value: parseInt(m[2], 10) / 10
            })
        },
        amplifierMute: {
            matcher: {
                pattern: /Ds[mM]600(16|17)\*(0|1)/
            },
            extract: m => ({
                type: 'amplifierMuteSA',
                lr: m[1] === '16' ? 'Left' : 'Right',
                value: m[2] === '1' ? 'On' : 'Off'
            })
        },
        amplifierPostmixerTrim: {
            matcher: {
                pattern: /Ds[gG]6011([67])\*([0-9 -]{1,4})/
            },
            extract: m => ({
                type: 'amplifierPostmixerTrim',
                lr: m[1] === '6' ? 'Left' : 'Right',
                value: parseInt(m[2], 10) / 10
            })
        },

        analogAttenuation: {
            matcher: {
                pattern: /Ds[gG]6000([0-7])\*([-]?\d{1,4}|0)/
            },
            extract: m => ({
                type: 'analogAttenuation',
                index: parseInt(m[1], 10),
                value: parseInt(m[2], 10) / 10
            })
        },
        analogMute: {
            matcher: {
                pattern: /Ds[mM]6000([0-7])\*(0|1)/
            },
            extract: m => ({
                type: 'analogMute',
                index: parseInt(m[1], 10),
                value: m[2] === '1' ? 'On' : 'Off'
            })
        },

        dtpAttenuation: {
            matcher: {
                pattern: /Ds[gG]600([01][0-9])\*([-]?\d{1,4}|0)/
            },
            extract: m => ({
                type: 'dtpAttenuation',
                index: parseInt(m[1], 10),
                value: parseInt(m[2], 10) / 10
            })
        },
        dtpMute: {
            matcher: {
                pattern: /Ds[mM]600([01][0-9])\*(0|1)/
            },
            extract: m => ({
                type: 'dtpMute',
                index: parseInt(m[1], 10),
                value: m[2] === '1' ? 'On' : 'Off'
            })
        },

        hdmiAttenuation: {
            matcher: {
                pattern: /Ds[gG]6020([0-7])\*([-]?\d{1,4}|0)/
            },
            extract: m => ({
                type: 'hdmiAttenuation',
                index: parseInt(m[1], 10),
                value: parseInt(m[2], 10) / 10
            })
        },
        hdmiMute: {
            matcher: {
                pattern: /Ds[mM]6020([0-7])\*(0|1)/
            },
            extract: m => ({
                type: 'hdmiMute',
                index: parseInt(m[1], 10),
                value: m[2] === '1' ? 'On' : 'Off'
            })
        },

        inputAudioSwitchModeSingle: {
            matcher: {
                pattern: /AfmtI(\d{2})\*([0-2])/
            },
            extract: m => ({
                type: 'inputAudioSwitchMode',
                input: parseInt(m[1], 10),
                mode: {
                    '0': 'Auto',
                    '1': 'Digital',
                    '2': 'Analog'
                } [m[2]]
            })
        },
        inputAudioSwitchModeAll: {
            matcher: {
                pattern: /AfmtI([0-2]{8,10})/
            },
            extract: m => ({
                type: 'inputAudioSwitchModeAll',
                payload: m[1]
            })
        },

        inputGain: {
            matcher: {
                pattern: /Ds([gGhH])300([01][0-9])\*([0-9 -]{1,4})/
            },
            extract: m => ({
                type: 'inputGain',
                format: {
                    'G': 'Analog',
                    'H': 'Digital',
                    'g': 'Analog',
                    'h': 'Digital'
                } [m[1]],
                index: parseInt(m[2], 10),
                value: parseInt(m[3], 10) / 10
            })
        },
        inputMute: {
            matcher: {
                pattern: /Ds[mM]300([01][0-9])\*([01])/
            },
            extract: m => ({
                type: 'inputMute',
                index: parseInt(m[1], 10),
                value: m[2] === '1' ? 'On' : 'Off'
            })
        },

        micLineGain: {
            matcher: {
                pattern: /Ds[gG]4000([0-3])\*([0-9 -]{1,4})/
            },
            extract: m => ({
                type: 'micLineGain',
                input: parseInt(m[1], 10) + 1,
                value: parseInt(m[2], 10) / 10
            })
        },
        micLineMute: {
            matcher: {
                pattern: /Ds[mM]4000([0-3])\*(0|1)/
            },
            extract: m => ({
                type: 'micLineMute',
                input: parseInt(m[1], 10) + 1,
                value: m[2] === '1' ? 'On' : 'Off'
            })
        },
        microphoneSignalStatus: {
            matcher: {
                pattern: /Ds[vV]4000([0-3])\*[01]\*([0-9]{1,4})/
            },
            extract: m => ({
                type: 'microphoneSignal',
                input: parseInt(m[1], 10) + 1,
                value: -(parseInt(m[2], 10) / 10)
            })
        },

        premixerGain: {
            matcher: {
                pattern: /Ds[gG]4010([0-7])\*(-?\d{1,4})/
            },
            extract: m => ({
                type: 'premixerGain',
                input: parseInt(m[1], 10) + 1,
                value: parseInt(m[2], 10) / 10
            })
        },
        premixerMute: {
            matcher: {
                pattern: /Ds[mM]4010([0-7])\*(0|1)/
            },
            extract: m => ({
                type: 'premixerMute',
                input: parseInt(m[1], 10) + 1,
                value: m[2] === '1' ? 'On' : 'Off'
            })
        },
        prematrixTrim: {
            matcher: {
                pattern: /Ds[gG]301([01][0-9])\*([0-9 -]{1,4})/
            },
            extract: m => ({
                type: 'prematrixTrim',
                index: parseInt(m[1], 10),
                value: parseInt(m[2], 10) / 10
            })
        },
        outputPostmixerTrim: {
            matcher: {
                pattern: /Ds[gG]601(0[0-9]|1[0-5])\*([0-9 -]{1,4})/
            },
            extract: m => ({
                type: 'outputPostmixerTrim',
                index: parseInt(m[1], 10),
                value: parseInt(m[2], 10) / 10
            })
        },
        postMatrixGain: {
            matcher: {
                pattern: /Ds[gG]500([01][0-9])\*([-]?\d{1,4}|\d{1,3})/
            },
            extract: m => ({
                type: 'postMatrixGain',
                index: parseInt(m[1], 10),
                value: parseInt(m[2], 10) / 10
            })
        },
        postMatrixMute: {
            matcher: {
                pattern: /Ds[mM]500([01][0-9])\*(0|1)/
            },
            extract: m => ({
                type: 'postMatrixMute',
                index: parseInt(m[1], 10),
                value: m[2] === '1' ? 'On' : 'Off'
            })
        },

        mixpointGain: {
            matcher: {
                pattern: /Ds[gG]2([0-9]{2})([0-9]{2})\*([-]?[0-9]{1,4}|0)/
            },
            extract: m => ({
                type: 'mixpointGain',
                row: parseInt(m[1], 10),
                col: parseInt(m[2], 10),
                value: parseInt(m[3], 10) / 10
            })
        },
        mixpointMute: {
            matcher: {
                pattern: /Ds[mM]2([0-9]{2})([0-9]{2})\*(0|1)/
            },
            extract: m => ({
                type: 'mixpointMute',
                row: parseInt(m[1], 10),
                col: parseInt(m[2], 10),
                value: m[3] === '1' ? 'On' : 'Off'
            })
        },

        phantomPower: {
            matcher: {
                pattern: /DsZ4000([0-3])\*([01])/
            },
            extract: m => ({
                type: 'phantomPower',
                input: parseInt(m[1], 10) + 1,
                value: m[2] === '1' ? 'On' : 'Off'
            })
        },

        virtualReturnGain: {
            matcher: {
                pattern: /Ds[gG]5010([0-7])\*([-]?\d{1,4}|\d{1,3})/
            },
            extract: m => ({
                type: 'virtualReturnGain',
                channelIndex: parseInt(m[1], 10),
                value: parseInt(m[2], 10) / 10
            })
        },
        virtualReturnMute: {
            matcher: {
                pattern: /Ds[mM]5010([0-7])\*([01])/
            },
            extract: m => ({
                type: 'virtualReturnMute',
                channelIndex: parseInt(m[1], 10),
                value: m[2] === '1' ? 'On' : 'Off'
            })
        },

        expansionPremixerGain: {
            matcher: {
                pattern: /Ds[gG]502([01][0-9])\*([0-9 -]{1,5})/
            },
            extract: m => ({
                type: 'expPremixerGain',
                inputIndex: parseInt(m[1], 10),
                value: parseInt(m[2], 10) / 10
            })
        },
        expansionPremixerMute: {
            matcher: {
                pattern: /Ds[mM]502([01][0-9])\*([01])/
            },
            extract: m => ({
                type: 'expPremixerMute',
                inputIndex: parseInt(m[1], 10),
                value: m[2] === '1' ? 'On' : 'Off'
            })
        },

        groupValue: {
            matcher: {
                pattern: /GrpmD(\d{1,2})\*([-+]?\d{1,4})/
            },
            extract: m => ({
                type: 'groupValue',
                group: parseInt(m[1], 10),
                value: parseInt(m[2], 10) / 10
            })
        }
    };

    initialize() {
        this.publishCommand('enableVerbose');
        this.publishCommand('refreshMatrix');
        this.publishCommand('getInputSignalStatus');
        this.publishCommand('getTemperature');
    }

    // Verbose
    enableVerbose() {
        return {
            payload: 'w3cv\r\n'
        };
    }

    // Matrix tie
    setTie(params) {
        const {
            input,
            output,
            type
        } = params;
        const map = {
            'Audio/Video': '!',
            'Video': '%',
            'Audio': '$'
        };
        if (String(output).toLowerCase() === 'all') return {
            payload: `${input}*${map[type]}\r\n`
        };
        return {
            payload: `${input}*${output}${map[type]}\r\n`
        };
    }
    refreshMatrix() {
        return {
            payload: 'w0*1*1VC\r\nw0*1*2VC\r\n'
        };
    }

    // Video mute
    setVideoMute(params) {
        const {
            output,
            value
        } = params;
        const map = {
            'Off': '0',
            'Video': '1',
            'Video & Sync': '2'
        };
        if (String(output).toLowerCase() === 'all') return {
            payload: `${map[value]}*B\r\n`
        };
        return {
            payload: `${output}*${map[value]}B\r\n`
        };
    }
    setGlobalVideoMute(params) {
        const {
            value
        } = params;
        const map = {
            'Off': '0',
            'Video': '1',
            'Video & Sync': '2'
        };
        return {
            payload: `${map[value]}*B\r\n`
        };
    }

    // HDCP
    setHdcpInputAuthorization(params) {
        const {
            input,
            value
        } = params;
        const map = {
            On: '1',
            Off: '0'
        };
        return {
            payload: `wE${input}*${map[value]}HDCP\r\n`
        };
    }
    getHdcpInputAuthorization(params) {
        const {
            input
        } = params;
        return {
            payload: `wE${input}HDCP\r\n`
        };
    }
    getHdcpInputStatus(params) {
        const {
            input
        } = params;
        return {
            payload: `wI${input}HDCP\r\n`
        };
    }
    setHdcpOutputAuthorization(params) {
        const {
            output,
            value
        } = params;
        const map = {
            On: '1',
            Auto: '0'
        };
        return {
            payload: `wS${output}*${map[value]}HDCP\r\n`
        };
    }
    getHdcpOutputAuthorization(params) {
        const {
            output
        } = params;
        return {
            payload: `wS${output}HDCP\r\n`
        };
    }
    getHdcpOutputStatus(params) {
        const {
            output
        } = params;
        return {
            payload: `wO${output}HDCP\r\n`
        };
    }

    // EDID
    getEdidAssignment(params) {
        const {
            input
        } = params;
        return {
            payload: `wA${input}EDID\r\n`
        };
    }

    // Executive
    setExecutiveMode(params) {
        const {
            mode
        } = params;
        const map = {
            'Off': '0X',
            'Mode 1': '1X',
            'Mode 2': '2X'
        };
        return {
            payload: `${map[mode]}\r\n`
        };
    }
    getExecutiveMode() {
        return {
            payload: 'X\r\n'
        };
    }

    // Presets
    recallPreset(params) {
        const {
            id
        } = params;
        return {
            payload: `${id}.\r\n`
        };
    }

    // Input/Temperature
    getInputSignalStatus() {
        return {
            payload: '0LS\r\n'
        };
    }
    getTemperature() {
        return {
            payload: 'S\r\n'
        };
    }

    // Output resolution
    setOutputResolution(params) {
        const {
            output,
            code
        } = params;
        return {
            payload: `w${output}*${code}RATE\r\n`
        };
    }
    getOutputResolution(params) {
        const {
            output
        } = params;
        return {
            payload: `w${output}RATE\r\n`
        };
    }

    // Test pattern
    setTestPattern(params) {
        const {
            output,
            pattern
        } = params;
        const map = {
            'Off': '0',
            'Crop': '1',
            'Alternating Pixels': '2',
            'Crosshatch': '3',
            'Color Bars': '4',
            'Grayscale': '5',
            'Blue Mode': '6'
        };
        return {
            payload: `W${output}*${map[pattern]}TEST\r\n`
        };
    }
    getTestPattern(params) {
        const {
            output
        } = params;
        return {
            payload: `W${output}TEST\r\n`
        };
    }

    // Output audio select
    setOutputAudioSelect(params) {
        const {
            output,
            mode
        } = params;
        const map = {
            'Original HDMI': '0',
            'Embedded Audio': '1',
            'No Audio': '2'
        };
        return {
            payload: `wO${output}*${map[mode]}AFMT\r\n`
        };
    }
    getOutputAudioSelect(params) {
        const {
            output
        } = params;
        if (String(output).toLowerCase() === 'all') return {
            payload: 'wOAFMT\r\n'
        };
        return {
            payload: 'wOAFMT\r\n'
        };
    }
    getOutputAudioSelectAll() {
        return {
            payload: 'wOAFMT\r\n'
        };
    }

    // Freeze
    setFreeze(params) {
        const {
            output,
            value
        } = params;
        const map = {
            'On': '01',
            'Off': '00'
        };
        return {
            payload: `${output}*${value === 'On' ? '1' : '0'}F\r\n`
        };
    }
    getFreeze(params) {
        const {
            output
        } = params;
        return {
            payload: `${output}F\r\n`
        };
    }

    // ================= AUDIO METHODS =================
    // Amplifier
    setAmplifierAttenuationMA(params) {
        const {
            value
        } = params;
        const level = Math.round(value * 10);
        return {
            payload: `WG60016*${level}AU\r\n`
        };
    }
    getAmplifierAttenuationMA() {
        return {
            payload: 'WG60016AU\r\n'
        };
    }
    setAmplifierAttenuationSA(params) {
        const {
            lr,
            value
        } = params;
        const ch = lr === 'Left' ? '16' : '17';
        const level = Math.round(value * 10);
        return {
            payload: `WG600${ch}*${level}AU\r\n`
        };
    }
    getAmplifierAttenuationSA(params) {
        const {
            lr
        } = params;
        const ch = lr === 'Left' ? '16' : '17';
        return {
            payload: `WG600${ch}AU\r\n`
        };
    }
    setAmplifierMuteMA(params) {
        const {
            value
        } = params;
        return {
            payload: `WM60016*${value === 'On' ? '1' : '0'}AU\r\n`
        };
    }
    getAmplifierMuteMA() {
        return {
            payload: 'WM60016AU\r\n'
        };
    }
    setAmplifierMuteSA(params) {
        const {
            lr,
            value
        } = params;
        const ch = lr === 'Left' ? '16' : '17';
        return {
            payload: `WM600${ch}*${value === 'On' ? '1' : '0'}AU\r\n`
        };
    }
    getAmplifierMuteSA(params) {
        const {
            lr
        } = params;
        const ch = lr === 'Left' ? '16' : '17';
        return {
            payload: `WM600${ch}AU\r\n`
        };
    }
    setAmplifierPostmixerTrim(params) {
        const {
            lr,
            value
        } = params;
        const ch = lr === 'Left' ? '6' : '7';
        const level = Math.round(value * 10);
        return {
            payload: `WG6011${ch}*${level}AU\r\n`
        };
    }
    getAmplifierPostmixerTrim(params) {
        const {
            lr
        } = params;
        const ch = lr === 'Left' ? '6' : '7';
        return {
            payload: `WG6011${ch}AU\r\n`
        };
    }

    // Helpers for channel index mapping
    _lrIndex(output, lr) {
        const base = (parseInt(output, 10) * 2) - 2;
        return lr === 'Right' ? base + 1 : base;
    }

    // Analog
    setAnalogAttenuation(params) {
        const {
            lr,
            output,
            value
        } = params;
        const idx = this._lrIndex(output, lr);
        const level = Math.round(value * 10);
        return {
            payload: `WG6000${idx}*${level}AU\r\n`
        };
    }
    getAnalogAttenuation(params) {
        const {
            lr,
            output
        } = params;
        const idx = this._lrIndex(output, lr);
        return {
            payload: `WG6000${idx}AU\r\n`
        };
    }
    setAnalogMute(params) {
        const {
            lr,
            output,
            value
        } = params;
        const idx = this._lrIndex(output, lr);
        return {
            payload: `WM6000${idx}*${value === 'On' ? '1' : '0'}AU\r\n`
        };
    }
    getAnalogMute(params) {
        const {
            lr,
            output
        } = params;
        const idx = this._lrIndex(output, lr);
        return {
            payload: `WM6000${idx}AU\r\n`
        };
    }

    // DTP
    _dtpIndex(output, lr) {
        const base = (parseInt(output, 10) * 2) - 2;
        return lr === 'Right' ? base + 1 : base;
    }
    setDtpAttenuation(params) {
        const {
            lr,
            output,
            value
        } = params;
        const idx = this._dtpIndex(output, lr);
        const level = Math.round(value * 10);
        const idxStr = idx.toString().padStart(2, '0');
        return {
            payload: `WG600${idxStr}*${level}AU\r\n`
        };
    }
    getDtpAttenuation(params) {
        const {
            lr,
            output
        } = params;
        const idx = this._dtpIndex(output, lr).toString().padStart(2, '0');
        return {
            payload: `WG600${idx}AU\r\n`
        };
    }
    setDtpMute(params) {
        const {
            lr,
            output,
            value
        } = params;
        const idx = this._dtpIndex(output, lr).toString().padStart(2, '0');
        return {
            payload: `WM600${idx}*${value === 'On' ? '1' : '0'}AU\r\n`
        };
    }
    getDtpMute(params) {
        const {
            lr,
            output
        } = params;
        const idx = this._dtpIndex(output, lr).toString().padStart(2, '0');
        return {
            payload: `WM600${idx}AU\r\n`
        };
    }

    // HDMI audio
    setHdmiAttenuation(params) {
        const {
            lr,
            output,
            value
        } = params;
        const idx = this._lrIndex(output, lr);
        const level = Math.round(value * 10);
        return {
            payload: `WG6020${idx}*${level}AU\r\n`
        };
    }
    getHdmiAttenuation(params) {
        const {
            lr,
            output
        } = params;
        const idx = this._lrIndex(output, lr);
        return {
            payload: `WG6020${idx}AU\r\n`
        };
    }
    setHdmiMute(params) {
        const {
            lr,
            output,
            value
        } = params;
        const idx = this._lrIndex(output, lr);
        return {
            payload: `WM6020${idx}*${value === 'On' ? '1' : '0'}AU\r\n`
        };
    }
    getHdmiMute(params) {
        const {
            lr,
            output
        } = params;
        const idx = this._lrIndex(output, lr);
        return {
            payload: `WM6020${idx}AU\r\n`
        };
    }

    // Inputs
    setInputAudioSwitchMode(params) {
        const {
            input,
            mode
        } = params;
        const map = {
            'Auto': '0',
            'Digital': '1',
            'Analog': '2'
        };
        return {
            payload: `wI${input}*${map[mode]}AFMT\r\n`
        };
    }
    getInputAudioSwitchMode(params) {
        const {
            input
        } = params;
        return {
            payload: `wI${input}AFMT\r\n`
        };
    }
    getInputAudioSwitchModeAll() {
        return {
            payload: 'wIAFMT\r\n'
        };
    }
    setInputGain(params) {
        const {
            format,
            lr,
            input,
            value
        } = params;
        const fmt = format === 'Analog' ? 'G' : 'H';
        const idx = this._lrIndex(input, lr);
        const level = Math.round(value * 10);
        return {
            payload: `w${fmt}${idx + 30000}*${level}AU\r\n`
        };
    }
    getInputGain(params) {
        const {
            format,
            lr,
            input
        } = params;
        const fmt = format === 'Analog' ? 'G' : 'H';
        const idx = this._lrIndex(input, lr);
        return {
            payload: `w${fmt}${idx + 30000}AU\r\n`
        };
    }
    setInputMute(params) {
        const {
            lr,
            input,
            value
        } = params;
        const idx = this._lrIndex(input, lr);
        return {
            payload: `wM${idx + 30000}*${value === 'On' ? '1' : '0'}AU\r\n`
        };
    }
    getInputMute(params) {
        const {
            lr,
            input
        } = params;
        const idx = this._lrIndex(input, lr);
        return {
            payload: `wM${idx + 30000}AU\r\n`
        };
    }

    // Mic lines
    setMicLineGain(params) {
        const {
            input,
            value
        } = params;
        const idx = parseInt(input, 10) - 1;
        const level = Math.round(value * 10);
        return {
            payload: `wG4000${idx}*${level}AU\r\n`
        };
    }
    getMicLineGain(params) {
        const {
            input
        } = params;
        const idx = parseInt(input, 10) - 1;
        return {
            payload: `wG4000${idx}AU\r\n`
        };
    }
    setMicLineMute(params) {
        const {
            input,
            value
        } = params;
        const idx = parseInt(input, 10) - 1;
        return {
            payload: `wM4000${idx}*${value === 'On' ? '1' : '0'}AU\r\n`
        };
    }
    getMicLineMute(params) {
        const {
            input
        } = params;
        const idx = parseInt(input, 10) - 1;
        return {
            payload: `wM4000${idx}AU\r\n`
        };
    }
    getMicrophoneSignalStatus(params) {
        const {
            input
        } = params;
        const idx = parseInt(input, 10) - 1;
        return {
            payload: `wv4000${idx}*1AU\r\nwv4000${idx}AU\r\n`
        };
    }

    // Premixer / trims / postmatrix
    setPremixerGain(params) {
        const {
            input,
            value
        } = params;
        const idx = parseInt(input, 10) - 1;
        const level = Math.round(value * 10);
        return {
            payload: `WG4010${idx}*${level}AU\r\n`
        };
    }
    getPremixerGain(params) {
        const {
            input
        } = params;
        const idx = parseInt(input, 10) - 1;
        return {
            payload: `WG4010${idx}AU\r\n`
        };
    }
    setPremixerMute(params) {
        const {
            input,
            value
        } = params;
        const map = {
            '1': '0',
            '2': '1',
            '3': '2',
            '4': '3'
        };
        const mic = map[String(input)];
        return {
            payload: `WM4010${mic}*${value === 'On' ? '1' : '0'}AU\r\n`
        };
    }
    getPremixerMute(params) {
        const {
            input
        } = params;
        const map = {
            '1': '0',
            '2': '1',
            '3': '2',
            '4': '3'
        };
        const mic = map[String(input)];
        return {
            payload: `WM4010${mic}AU\r\n`
        };
    }
    setPrematrixTrim(params) {
        const {
            lr,
            input,
            value
        } = params;
        const idx = this._lrIndex(input, lr);
        const level = Math.round(value * 10);
        return {
            payload: `wG${idx + 30100}*${level}AU\r\n`
        };
    }
    getPrematrixTrim(params) {
        const {
            lr,
            input
        } = params;
        const idx = this._lrIndex(input, lr);
        return {
            payload: `wG${idx + 30100}AU\r\n`
        };
    }
    setOutputPostmixerTrim(params) {
        const {
            lr,
            output,
            value
        } = params;
        const idx = this._lrIndex(output, lr).toString().padStart(2, '0');
        const level = Math.round(value * 10);
        return {
            payload: `wG601${idx}*${level}AU\r\n`
        };
    }
    getOutputPostmixerTrim(params) {
        const {
            lr,
            output
        } = params;
        const idx = this._lrIndex(output, lr).toString().padStart(2, '0');
        return {
            payload: `wG601${idx}AU\r\n`
        };
    }
    setPostMatrixGain(params) {
        const {
            lr,
            output,
            value
        } = params;
        const idx = this._lrIndex(output, lr).toString().padStart(2, '0');
        const level = Math.round(value * 10);
        return {
            payload: `WG500${idx}*${level}AU\r\n`
        };
    }
    getPostMatrixGain(params) {
        const {
            lr,
            output
        } = params;
        const idx = this._lrIndex(output, lr).toString().padStart(2, '0');
        return {
            payload: `WG500${idx}AU\r\n`
        };
    }
    setPostMatrixMute(params) {
        const {
            lr,
            output,
            value
        } = params;
        const idx = this._lrIndex(output, lr).toString().padStart(2, '0');
        return {
            payload: `WM500${idx}*${value === 'On' ? '1' : '0'}AU\r\n`
        };
    }
    getPostMatrixMute(params) {
        const {
            lr,
            output
        } = params;
        const idx = this._lrIndex(output, lr).toString().padStart(2, '0');
        return {
            payload: `WM500${idx}AU\r\n`
        };
    }

    // Mixpoint mapping labels -> codes must be managed by flow; here assume labels already valid codes
    setMixpointGain(params) {
        const {
            inputLabel,
            outputLabel,
            value
        } = params;
        const level = Math.round(value * 10);
        return {
            payload: `WG2${inputLabel}${outputLabel}*${level}AU\r\n`
        };
    }
    getMixpointGain(params) {
        const {
            inputLabel,
            outputLabel
        } = params;
        return {
            payload: `WG2${inputLabel}${outputLabel}AU\r\n`
        };
    }
    setMixpointMute(params) {
        const {
            inputLabel,
            outputLabel,
            value
        } = params;
        return {
            payload: `WM2${inputLabel}${outputLabel}*${value === 'On' ? '1' : '0'}AU\r\n`
        };
    }
    getMixpointMute(params) {
        const {
            inputLabel,
            outputLabel
        } = params;
        return {
            payload: `WM2${inputLabel}${outputLabel}AU\r\n`
        };
    }

    // Phantom power
    setPhantomPower(params) {
        const {
            input,
            value
        } = params;
        const map = {
            '1': '0',
            '2': '1',
            '3': '2',
            '4': '3'
        };
        const mic = map[String(input)];
        return {
            payload: `wZ4000${mic}*${value === 'On' ? '1' : '0'}AU\r\n`
        };
    }
    getPhantomPower(params) {
        const {
            input
        } = params;
        const map = {
            '1': '0',
            '2': '1',
            '3': '2',
            '4': '3'
        };
        const mic = map[String(input)];
        return {
            payload: `wZ4000${mic}AU\r\n`
        };
    }

    // Virtual returns
    _virtIndex(ch) {
        const map = {
            'A': 0,
            'B': 1,
            'C': 2,
            'D': 3,
            'E': 4,
            'F': 5,
            'G': 6,
            'H': 7
        };
        return map[ch];
    }
    setVirtualReturnGain(params) {
        const {
            channel,
            value
        } = params;
        const ch = this._virtIndex(channel);
        const level = Math.round(value * 10);
        return {
            payload: `WG5010${ch}*${level}AU\r\n`
        };
    }
    getVirtualReturnGain(params) {
        const {
            channel
        } = params;
        const ch = this._virtIndex(channel);
        return {
            payload: `WG5010${ch}AU\r\n`
        };
    }
    setVirtualReturnMute(params) {
        const {
            channel,
            value
        } = params;
        const ch = this._virtIndex(channel);
        return {
            payload: `WM5010${ch}*${value === 'On' ? '1' : '0'}AU\r\n`
        };
    }
    getVirtualReturnMute(params) {
        const {
            channel
        } = params;
        const ch = this._virtIndex(channel);
        return {
            payload: `WM5010${ch}AU\r\n`
        };
    }

    // Expansion premixer
    setExpansionPremixerGain(params) {
        const {
            input,
            value
        } = params;
        const idx = parseInt(input, 10);
        const level = Math.round(value * 10);
        return {
            payload: `wG${idx + 50199}*${level}AU\r\n`
        };
    }
    getExpansionPremixerGain(params) {
        const {
            input
        } = params;
        const idx = parseInt(input, 10);
        return {
            payload: `wG${idx + 50199}AU\r\n`
        };
    }
    setExpansionPremixerMute(params) {
        const {
            input,
            value
        } = params;
        const idx = parseInt(input, 10);
        return {
            payload: `wM${idx + 50199}*${value === 'On' ? '1' : '0'}AU\r\n`
        };
    }
    getExpansionPremixerMute(params) {
        const {
            input
        } = params;
        const idx = parseInt(input, 10);
        return {
            payload: `wM${idx + 50199}AU\r\n`
        };
    }

    // Groups
    setGroupMicLineInputGain(params) {
        const {
            group,
            value
        } = params;
        const level = Math.round(value * 10);
        return {
            payload: `WD${group}*${level}GRPM\r\n`
        };
    }
    getGroupMicLineInputGain(params) {
        const {
            group
        } = params;
        return {
            payload: `WD${group}GRPM\r\n`
        };
    }
    setGroupMixpoint(params) {
        const {
            group,
            value
        } = params;
        const level = Math.round(value * 10);
        return {
            payload: `WD${group}*${level}GRPM\r\n`
        };
    }
    getGroupMixpoint(params) {
        const {
            group
        } = params;
        return {
            payload: `WD${group}GRPM\r\n`
        };
    }
    setGroupMute(params) {
        const {
            group,
            value
        } = params;
        return {
            payload: `WD${group}*${value === 'On' ? '1' : '0'}GRPM\r\n`
        };
    }
    getGroupMute(params) {
        const {
            group
        } = params;
        return {
            payload: `WD${group}GRPM\r\n`
        };
    }
    setGroupOutputAttenuation(params) {
        const {
            group,
            value
        } = params;
        const level = Math.round(value * 10);
        return {
            payload: `WD${group}*${level}GRPM\r\n`
        };
    }
    getGroupOutputAttenuation(params) {
        const {
            group
        } = params;
        return {
            payload: `WD${group}GRPM\r\n`
        };
    }
    setGroupPremixerGain(params) {
        const {
            group,
            value
        } = params;
        const level = Math.round(value * 10);
        return {
            payload: `WD${group}*${level}GRPM\r\n`
        };
    }
    getGroupPremixerGain(params) {
        const {
            group
        } = params;
        return {
            payload: `WD${group}GRPM\r\n`
        };
    }
    setGroupPostmixerTrim(params) {
        const {
            group,
            value
        } = params;
        const level = Math.round(value * 10);
        return {
            payload: `WD${group}*${level}GRPM\r\n`
        };
    }
    getGroupPostmixerTrim(params) {
        const {
            group
        } = params;
        return {
            payload: `WD${group}GRPM\r\n`
        };
    }
    setGroupPrematrixTrim(params) {
        const {
            group,
            value
        } = params;
        const level = Math.round(value * 10);
        return {
            payload: `WD${group}*${level}GRPM\r\n`
        };
    }
    getGroupPrematrixTrim(params) {
        const {
            group
        } = params;
        return {
            payload: `WD${group}GRPM\r\n`
        };
    }

    parseResponse(data) {
        try {
            let raw = data && data.payload !== undefined ? data.payload : data;
            if (Buffer.isBuffer(raw)) raw = raw.toString();
            if (typeof raw !== 'string') raw = String(raw ?? '');

            const results = [];
            const defs = this.constructor.responses || {};

            const tryMatch = (text) => {
                for (const [name, def] of Object.entries(defs)) {
                    if (!def || !def.matcher || !def.matcher.pattern) continue;
                    const pattern = def.matcher.pattern;
                    const rx = new RegExp(pattern.source, pattern.flags);
                    const match = text.match(rx);
                    if (match) {
                        const payload = def.extract ? def.extract(match) : {
                            type: name,
                            raw: match[0]
                        };
                        results.push(payload);
                    }
                }
            };

            tryMatch(raw);
            raw.split(/\r?\n/).filter(Boolean).forEach(tryMatch);

            if (results.length === 0) return null;
            if (results.length === 1) return results[0];
            return results;
        } catch (e) {
            return {
                type: 'error',
                message: e.message,
                raw: data
            };
        }
    }
}

module.exports = ExtronDTPCrossPointDriver;
