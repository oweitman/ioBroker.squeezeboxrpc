import PlayerCommandButton from './PlayerCommandButton';

class RewindButtonWidget extends PlayerCommandButton {
    static command = 'rewind';
    static imageName = 'imagerew';
    static titleKey = 'squeezeboxrpc_rewind';

    static getWidgetInfo() {
        return this.createWidgetInfo({
            id: 'tplSqueezeboxrpcRewind2',
            visName: 'Squeezebox Rewind button',
            imageName: this.imageName,
            imageLabel: 'squeezeboxrpc_rewind_image',
            preview:
                '<span style="display:block;margin-left:auto;margin-right:auto;aspect-ratio:1;background-color:currentColor;-webkit-mask:url(widgets/squeezeboxrpc/img/rew.svg) center/contain no-repeat;mask:url(widgets/squeezeboxrpc/img/rew.svg) center/contain no-repeat;"></span>',
        });
    }

    getWidgetInfo() {
        return RewindButtonWidget.getWidgetInfo();
    }
}

export default RewindButtonWidget;
