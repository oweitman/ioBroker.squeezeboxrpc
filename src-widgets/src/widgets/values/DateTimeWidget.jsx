import PlayerStateWidget, { playerAttributeField, playerReferenceField } from './PlayerStateWidget';
import { formatDateTime } from './playerStateUtils';
import './valueWidgets.css';

class DateTimeWidget extends PlayerStateWidget {
    static getWidgetInfo() {
        return {
            id: 'tplSqueezeboxrpcDateTime2',
            visSet: 'squeezeboxrpc',
            visSetLabel: 'widget_set',
            visName: 'Squeezebox DateTime',
            visAttrs: [
                {
                    name: 'common',
                    fields: [
                        playerReferenceField,
                        playerAttributeField,
                        { name: 'html_prepend', type: 'text', label: 'squeezeboxrpc_html_prepend' },
                        { name: 'html_append', type: 'text', label: 'squeezeboxrpc_html_append' },
                        { name: 'format', type: 'text', default: 'hh:mm:ss', label: 'squeezeboxrpc_date_format' },
                        { name: 'factor', type: 'number', default: 1000, label: 'squeezeboxrpc_factor' },
                    ],
                },
            ],
            visDefaultStyle: { width: 150, height: 20 },
            visPrev: 'widgets/squeezeboxrpc/img/datetime.png',
        };
    }

    getWidgetInfo() {
        return DateTimeWidget.getWidgetInfo();
    }

    renderWidgetBody(props) {
        super.renderWidgetBody(props);
        const data = this.widgetState.rxData || this.widgetState.data || {};
        const value =
            this.widgetState.playerValue === undefined
                ? ''
                : formatDateTime(this.widgetState.playerValue, data.factor, data.format);
        return (
            <div
                className="squeezeboxrpc-value-widget"
                dangerouslySetInnerHTML={{ __html: `${data.html_prepend || ''}${value}${data.html_append || ''}` }}
            />
        );
    }
}

export default DateTimeWidget;
