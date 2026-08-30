import PlayerStateWidget, { playerAttributeField, playerReferenceField } from './PlayerStateWidget';
import { formatNumber } from './playerStateUtils';
import './valueWidgets.css';

class NumberWidget extends PlayerStateWidget {
    static getWidgetInfo() {
        return {
            id: 'tplSqueezeboxrpcNumber2',
            visSet: 'squeezeboxrpc',
            visSetLabel: 'widget_set',
            visName: 'Squeezebox Number',
            visAttrs: [
                {
                    name: 'common',
                    fields: [
                        playerReferenceField,
                        playerAttributeField,
                        { name: 'html_prepend', type: 'text', label: 'squeezeboxrpc_html_prepend' },
                        { name: 'html_append', type: 'text', label: 'squeezeboxrpc_html_append' },
                        { name: 'digits', type: 'number', label: 'squeezeboxrpc_decimal_places' },
                        { name: 'is_comma', type: 'checkbox', default: true, label: 'squeezeboxrpc_decimal_comma' },
                        { name: 'is_tdp', type: 'checkbox', label: 'squeezeboxrpc_thousands_separator' },
                    ],
                },
            ],
            visDefaultStyle: { width: 100, height: 20 },
            visPrev: 'widgets/squeezeboxrpc/img/number.png',
        };
    }

    getWidgetInfo() {
        return NumberWidget.getWidgetInfo();
    }

    renderWidgetBody(props) {
        super.renderWidgetBody(props);
        const data = this.widgetState.rxData || this.widgetState.data || {};
        const configurationMessage = this.configurationMessage();
        if (configurationMessage) return <div>{configurationMessage}</div>;
        const value = formatNumber(this.widgetState.playerValue, data.digits, data.is_tdp, data.is_comma);
        return (
            <div
                className="squeezeboxrpc-value-widget"
                dangerouslySetInnerHTML={{ __html: `${data.html_prepend || ''}${value}${data.html_append || ''}` }}
            />
        );
    }
}

export default NumberWidget;
