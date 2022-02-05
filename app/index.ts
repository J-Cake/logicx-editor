import StateManager from './stateManager';

export interface GlobalState {

}

const state = new StateManager<GlobalState>();

export default state;