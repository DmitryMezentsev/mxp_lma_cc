import {APP_TITLE} from '../constants/config';


export const setTitle = title => {
    document.title = `${APP_TITLE} :: ${title}`;
};

