import { ILine } from '../interfaces/ILine';
import { IPoint } from '../interfaces/IPoint';

export class PolygonUtil {
    public static getEdges(vertices: IPoint[], closed: boolean = true): ILine[] {
        const points: IPoint[] = closed ? vertices.concat(vertices[0]) : vertices;
        const lines: ILine[] = [];
        for (let i = 0; i < points.length - 1; i++) {
            lines.push({ start: points[i], end: points[i + 1] });
        }
        return lines;
    }
}
