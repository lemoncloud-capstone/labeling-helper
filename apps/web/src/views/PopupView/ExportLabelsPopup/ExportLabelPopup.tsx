import React, { useState } from 'react';

import './ExportLabelPopup.scss';
import { connect } from 'react-redux';

import { AnnotationFormatType } from '../../../data/enums/AnnotationFormatType';
import { LabelType } from '../../../data/enums/LabelType';
import { ExportFormatData } from '../../../data/ExportFormatData';
import { ILabelFormatData } from '../../../interfaces/ILabelFormatData';
import { PopupActions } from '../../../logic/actions/PopupActions';
import { LineLabelsExporter } from '../../../logic/export/LineLabelExport';
import { PointLabelsExporter } from '../../../logic/export/PointLabelsExport';
import { PolygonLabelsExporter } from '../../../logic/export/polygon/PolygonLabelsExporter';
import { RectLabelsExporter } from '../../../logic/export/RectLabelsExporter';
import { TagLabelsExporter } from '../../../logic/export/TagLabelsExport';
import { AppState } from '../../../store';
import GenericLabelTypePopup from '../GenericLabelTypePopup/GenericLabelTypePopup';

interface IProps {
    activeLabelType: LabelType;
}

const ExportLabelPopup: React.FC<IProps> = ({ activeLabelType }) => {
    const [labelType, setLabelType] = useState(activeLabelType);
    const [exportFormatType, setExportFormatType] = useState(null);

    const onAccept = (type: LabelType) => {
        switch (type) {
            case LabelType.RECT:
                RectLabelsExporter.export(exportFormatType);
                break;
            case LabelType.POINT:
                PointLabelsExporter.export(exportFormatType);
                break;
            case LabelType.LINE:
                LineLabelsExporter.export(exportFormatType);
                break;
            case LabelType.POLYGON:
                PolygonLabelsExporter.export(exportFormatType);
                break;
            case LabelType.IMAGE_RECOGNITION:
                TagLabelsExporter.export(exportFormatType);
                break;
        }
        PopupActions.close();
    };

    const onReject = (type: LabelType) => {
        PopupActions.close();
    };

    const onSelect = (type: AnnotationFormatType) => {
        setExportFormatType(type);
    };

    const getOptions = (exportFormatData: ILabelFormatData[]) => {
        return exportFormatData.map((entry: ILabelFormatData) => {
            return (
                <div className="OptionsItem" onClick={() => onSelect(entry.type)} key={entry.type}>
                    {entry.type === exportFormatType ? (
                        <img draggable={false} src={'ico/checkbox-checked.png'} alt={'checked'} />
                    ) : (
                        <img draggable={false} src={'ico/checkbox-unchecked.png'} alt={'unchecked'} />
                    )}
                    {entry.label}
                </div>
            );
        });
    };

    const renderInternalContent = (type: LabelType) => {
        return (
            <>
                <div className="Message">
                    Select label type and the file format you would like to use to export labels.
                </div>
                ,<div className="Options">{getOptions(ExportFormatData[type])}</div>
            </>
        );
    };

    const onLabelTypeChange = (type: LabelType) => {
        setLabelType(type);
        setExportFormatType(null);
    };

    return (
        <GenericLabelTypePopup
            activeLabelType={labelType}
            title={`Export ${labelType.toLowerCase()} annotations`}
            onLabelTypeChange={onLabelTypeChange}
            acceptLabel={'Export'}
            onAccept={onAccept}
            disableAcceptButton={!exportFormatType}
            rejectLabel={'Cancel'}
            onReject={onReject}
            renderInternalContent={renderInternalContent}
        />
    );
};

const mapDispatchToProps = {};

const mapStateToProps = (state: AppState) => ({
    activeLabelType: state.labels.activeLabelType,
});

export default connect(mapStateToProps, mapDispatchToProps)(ExportLabelPopup);
