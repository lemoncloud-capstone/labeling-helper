import { COCOExporter } from './COCOExporter';
import { VGGExporter } from './VGGExporter';
import { AnnotationFormatType } from '../../../data/enums/AnnotationFormatType';

export class PolygonLabelsExporter {
    public static export(exportFormatType: AnnotationFormatType): void {
        switch (exportFormatType) {
            case AnnotationFormatType.VGG:
                VGGExporter.export();
                break;
            case AnnotationFormatType.COCO:
                COCOExporter.export();
                break;
            default:
                return;
        }
    }
}
