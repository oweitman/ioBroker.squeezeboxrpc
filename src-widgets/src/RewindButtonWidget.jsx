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
            preview: 'widgets/squeezeboxrpc/img/rew.png',
        });
    }

    getWidgetInfo() {
        return RewindButtonWidget.getWidgetInfo();
    }
}

export default RewindButtonWidget;
