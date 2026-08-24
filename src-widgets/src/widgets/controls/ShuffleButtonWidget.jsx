import PlayerModeButton from './PlayerModeButton';

class ShuffleButtonWidget extends PlayerModeButton {
    static mode = 'shuffle';
    static imagePrefix = 'imageshuffle';
    static titleKey = 'squeezeboxrpc_shuffle';

    static getWidgetInfo() {
        return this.createWidgetInfo({
            id: 'tplSqueezeboxrpcShuffle2',
            visName: 'Squeezebox Shuffle button',
            imagePrefix: this.imagePrefix,
            preview: 'widgets/squeezeboxrpc/img/shuffle0.svg',
        });
    }

    getWidgetInfo() {
        return ShuffleButtonWidget.getWidgetInfo();
    }
}

export default ShuffleButtonWidget;
