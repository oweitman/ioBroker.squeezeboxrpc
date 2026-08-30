import add from '../img/add.svg';
import deleteIcon from '../img/delete.svg';
import fwd from '../img/fwd.svg';
import menuback from '../img/menuback.svg';
import next from '../img/next.svg';
import pause from '../img/pause.svg';
import play from '../img/play.svg';
import repeat0 from '../img/repeat0.svg';
import repeat1 from '../img/repeat1.svg';
import refresh from '../img/refresh.svg';
import rew from '../img/rew.svg';
import shuffle0 from '../img/shuffle0.svg';
import shuffle2 from '../img/shuffle2.svg';
import stop from '../img/stop.svg';

const inlineSvg = source => source.replace(/^\s*<\?xml[^>]*>\s*/i, '').trim();

export const svgIcons = {
    add: inlineSvg(add),
    delete: inlineSvg(deleteIcon),
    fwd: inlineSvg(fwd),
    menuback: inlineSvg(menuback),
    next: inlineSvg(next),
    pause: inlineSvg(pause),
    play: inlineSvg(play),
    repeat0: inlineSvg(repeat0),
    repeat1: inlineSvg(repeat1),
    refresh: inlineSvg(refresh),
    rew: inlineSvg(rew),
    shuffle0: inlineSvg(shuffle0),
    shuffle2: inlineSvg(shuffle2),
    stop: inlineSvg(stop),
};
