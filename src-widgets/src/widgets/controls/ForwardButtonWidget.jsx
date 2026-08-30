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
            preview:
                '<span style="display:block;margin-left:auto;margin-right:auto;aspect-ratio:1;background-color:currentColor;-webkit-mask:url(widgets/squeezeboxrpc/img/fwd.svg) center/contain no-repeat;mask:url(widgets/squeezeboxrpc/img/fwd.svg) center/contain no-repeat;"></span>',
        });
    }

    getWidgetInfo() {
        return ForwardButtonWidget.getWidgetInfo();
    }
}

export default ForwardButtonWidget;
