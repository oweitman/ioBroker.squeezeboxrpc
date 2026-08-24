import PlayerStateWidget, { playerAttributeField, playerReferenceField } from './PlayerStateWidget';
import './valueWidgets.css';

class StringWidget extends PlayerStateWidget {
    static getWidgetInfo() {
        return {
            id: 'tplSqueezeboxrpcString2', visSet: 'vis2squeezeboxrpc', visSetLabel: 'widget_set',
            visName: 'Squeezebox String',
            visAttrs: [{ name: 'common', fields: [
                playerReferenceField, playerAttributeField,
                { name: 'html_prepend', type: 'text', label: 'squeezeboxrpc_html_prepend' },
                { name: 'html_append', type: 'text', label: 'squeezeboxrpc_html_append' },
            ] }],
            visDefaultStyle: { width: 100, height: 20 },
            visPrev: 'widgets/squeezeboxrpc/img/string.png',
        };
    }

    getWidgetInfo() { return StringWidget.getWidgetInfo(); }

    renderWidgetBody(props) {
        super.renderWidgetBody(props);
        const data = this.widgetState.rxData || this.widgetState.data || {};
        const value = this.widgetState.playerValue ?? '';
        return <div className="squeezeboxrpc-value-widget" dangerouslySetInnerHTML={{ __html: `${data.html_prepend || ''}${value}${data.html_append || ''}` }} />;
    }
}

export default StringWidget;
