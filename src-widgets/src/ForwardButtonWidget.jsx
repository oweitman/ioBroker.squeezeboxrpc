import PlayerCommandButton from './PlayerCommandButton';

class ForwardButtonWidget extends PlayerCommandButton {
    static command = 'forward';
    static imageName = 'imagefwd';
    static titleKey = 'squeezeboxrpc_forward';

    static getWidgetInfo() {
        return this.createWidgetInfo({
            id: 'tplSqueezeboxrpcForward2',
            visName: 'Squeezebox Forward button',
            imageName: this.imageName,
            imageLabel: 'squeezeboxrpc_forward_image',
            preview: 'widgets/squeezeboxrpc/img/fwd.png',
        });
    }

    getWidgetInfo() {
        return ForwardButtonWidget.getWidgetInfo();
    }
}

export default ForwardButtonWidget;
