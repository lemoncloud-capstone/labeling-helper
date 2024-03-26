import { Direction } from './enums/Direction';
import { IPoint } from '../interfaces/IPoint';

export interface RectAnchor {
    type: Direction;
    position: IPoint;
}
