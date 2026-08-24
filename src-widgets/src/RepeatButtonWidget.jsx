import PlayerModeButton from './PlayerModeButton';

class RepeatButtonWidget extends PlayerModeButton {
    static mode = 'repeat';
    static imagePrefix = 'imagerepeat';
    static titleKey = 'squeezeboxrpc_repeat';

    static getWidgetInfo() {
        return this.createWidgetInfo({
            id: 'tplSqueezeboxrpcRepeat2',
            visName: 'Squeezebox Repeat button',
            imagePrefix: this.imagePrefix,
            preview: 'widgets/squeezeboxrpc/img/repeat0.svg',
        });
    }

    getWidgetInfo() {
        return RepeatButtonWidget.getWidgetInfo();
    }
}

export default RepeatButtonWidget;
