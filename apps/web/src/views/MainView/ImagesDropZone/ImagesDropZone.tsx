import React, { PropsWithChildren } from 'react';

import './ImagesDropZone.scss';
import { sortBy } from 'lodash';
import { DropzoneOptions, useDropzone } from 'react-dropzone';
import { connect } from 'react-redux';

import { PopupWindowType } from '../../../data/enums/PopupWindowType';
import { ProjectType } from '../../../data/enums/ProjectType';
import { AppState } from '../../../store';
import { updateActivePopupType, updateProjectData } from '../../../store/general/actionCreators';
import { ProjectData } from '../../../store/general/types';
import { addImageData, updateActiveImageIndex } from '../../../store/labels/actionCreators';
import { ImageData } from '../../../store/labels/types';
import { ImageDataUtil } from '../../../utils/ImageDataUtil';
import { TextButton } from '../../Common/TextButton/TextButton';

interface IProps {
    updateActiveImageIndexAction: (activeImageIndex: number) => any;
    addImageDataAction: (imageData: ImageData[]) => any;
    updateProjectDataAction: (projectData: ProjectData) => any;
    updateActivePopupTypeAction: (activePopupType: PopupWindowType) => any;
    projectData: ProjectData;
}

const ImagesDropZone: React.FC<IProps> = (props: PropsWithChildren<IProps>) => {
    const { acceptedFiles, getRootProps, getInputProps } = useDropzone({
        accept: {
            'image/*': ['.jpeg', '.png'],
        },
    } as DropzoneOptions);

    const startEditor = (projectType: ProjectType) => {
        if (acceptedFiles.length > 0) {
            const files = sortBy(acceptedFiles, (item: File) => item.name);
            props.updateProjectDataAction({
                ...props.projectData,
                type: projectType,
            });
            props.updateActiveImageIndexAction(0);
            props.addImageDataAction(files.map((file: File) => ImageDataUtil.createImageDataFromFileData(file)));
            props.updateActivePopupTypeAction(PopupWindowType.INSERT_LABEL_NAMES);
        }
    };

    const getDropZoneContent = () => {
        if (acceptedFiles.length === 0)
            return (
                <>
                    <input {...getInputProps()} />
                    <img draggable={false} alt={'upload'} src={'ico/box-opened.png'} />
                    <p className="extraBold">Drop images</p>
                    <p>or</p>
                    <p className="extraBold">Click here to select them</p>
                </>
            );
        else if (acceptedFiles.length === 1)
            return (
                <>
                    <img draggable={false} alt={'uploaded'} src={'ico/box-closed.png'} />
                    <p className="extraBold">1 image loaded</p>
                </>
            );
        else
            return (
                <>
                    <input {...getInputProps()} />
                    <img draggable={false} key={1} alt={'uploaded'} src={'ico/box-closed.png'} />
                    <p key={2} className="extraBold">
                        {acceptedFiles.length} images loaded
                    </p>
                </>
            );
    };

    const startEditorWithObjectDetection = () => startEditor(ProjectType.OBJECT_DETECTION);
    const startEditorWithImageRecognition = () => startEditor(ProjectType.IMAGE_RECOGNITION);

    return (
        <div className="ImagesDropZone">
            <div {...getRootProps({ className: 'DropZone' })}>{getDropZoneContent()}</div>
            <div className="DropZoneButtons">
                <TextButton
                    label={'Object Detection'}
                    isDisabled={!acceptedFiles.length}
                    onClick={startEditorWithObjectDetection}
                />
                <TextButton
                    label={'Image recognition'}
                    isDisabled={!acceptedFiles.length}
                    onClick={startEditorWithImageRecognition}
                />
            </div>
        </div>
    );
};

const mapDispatchToProps = {
    updateActiveImageIndexAction: updateActiveImageIndex,
    addImageDataAction: addImageData,
    updateProjectDataAction: updateProjectData,
    updateActivePopupTypeAction: updateActivePopupType,
};

const mapStateToProps = (state: AppState) => ({
    projectData: state.general.projectData,
});

export default connect(mapStateToProps, mapDispatchToProps)(ImagesDropZone);
