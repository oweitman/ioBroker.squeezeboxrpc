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
            preview:
                '<span style="display:block;margin-left:auto;margin-right:auto;aspect-ratio:1;background-color:currentColor;-webkit-mask:url(widgets/squeezeboxrpc/img/shuffle0.svg) center/contain no-repeat;mask:url(widgets/squeezeboxrpc/img/shuffle0.svg) center/contain no-repeat;"></span>',
        });
    }

    getWidgetInfo() {
        return ShuffleButtonWidget.getWidgetInfo();
    }
}

export default ShuffleButtonWidget;
