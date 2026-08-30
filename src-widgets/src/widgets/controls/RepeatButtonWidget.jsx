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
            preview:
                '<span style="display:block;margin-left:auto;margin-right:auto;aspect-ratio:1;background-color:currentColor;-webkit-mask:url(widgets/squeezeboxrpc/img/repeat0.svg) center/contain no-repeat;mask:url(widgets/squeezeboxrpc/img/repeat0.svg) center/contain no-repeat;"></span>',
        });
    }

    getWidgetInfo() {
        return RepeatButtonWidget.getWidgetInfo();
    }
}

export default RepeatButtonWidget;
