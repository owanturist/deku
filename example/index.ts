import {
    beginnerProgram
} from '../src/app';

import {
    Msg,
    Model
} from './App/Types';
import {
    initialModel,
    update
} from './App/State';
import {
    view
} from './App/View';

beginnerProgram<Msg, Model>({
    model: initialModel,
    view,
    update
}, document.getElementById('app'));
