import PlayerStateWidget, { playerAttributeField, playerReferenceField } from './PlayerStateWidget';
import './valueWidgets.css';

class ImageWidget extends PlayerStateWidget {
    static getWidgetInfo() {
        return {
            id: 'tplSqueezeboxrpcImage2', visSet: 'vis2squeezeboxrpc', visSetLabel: 'widget_set',
            visName: 'Squeezebox Image',
            visAttrs: [{ name: 'common', fields: [
                playerReferenceField, playerAttributeField,
                { name: 'stretch', type: 'checkbox', label: 'squeezeboxrpc_stretch' },
                { name: 'html_prepend', type: 'text', label: 'squeezeboxrpc_html_prepend' },
                { name: 'html_append', type: 'text', label: 'squeezeboxrpc_html_append' },
            ] }],
            visDefaultStyle: { width: 100, height: 100 },
            visPrev: 'widgets/squeezeboxrpc/img/image.png',
        };
    }

    getWidgetInfo() { return ImageWidget.getWidgetInfo(); }

    renderWidgetBody(props) {
        super.renderWidgetBody(props);
        const data = this.widgetState.rxData || this.widgetState.data || {};
        const source = String(this.widgetState.playerValue || '');
        return (
            <div className={`squeezeboxrpc-image-widget${data.stretch ? ' stretch' : ''}`}>
                {data.html_prepend ? <span dangerouslySetInnerHTML={{ __html: data.html_prepend }} /> : null}
                <img src={source} alt="" />
                {data.html_append ? <span dangerouslySetInnerHTML={{ __html: data.html_append }} /> : null}
            </div>
        );
    }
}

export default ImageWidget;
