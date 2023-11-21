import React, {useCallback, useEffect, useRef, useState} from 'react';
import {UploadIcon,CrossIcon} from '../../../assests/svg/index'
import Cropper from "react-cropper";
import "cropperjs/dist/cropper.css";
import './image-cropper.scss'
const ImageCropper = ({handleImage,Initial_images, isEditable=true
                          , isCard=false}) => {
    const [finalImageFile, setFinalImageFile] = useState([])
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [isViewerOpen, setIsViewerOpen] = useState(false);
    const [imageToBeCropped, setImageToBeCropped] = useState(null);
    const pickedImage = useRef(null);
    const cropper = useRef();
    const [aspectRatio, setAspectRatio] = isCard ? useState({
        width: 1, height: 1,
    }) : useState({
        width: 16, height: 9,
    });
    const imageToBeCroppedFileName = useRef();

    const openImageViewer = useCallback((index) => {
        setCurrentImageIndex(index);
        setIsViewerOpen(true);
    }, []);

    const closeImageViewer = () => {
        setCurrentImageIndex(0);
        setIsViewerOpen(false);
    };

    const handleImagesChange = (event) => {
        event.preventDefault();
        let files;
        files = event.target.files;

        const reader = new FileReader();
        reader.onload = () => {
            setImageToBeCropped(reader.result);
        };
        imageToBeCroppedFileName.current = files[0].name;
        reader.readAsDataURL(files[0]);
        pickedImage.current = files[0];
        event.target.value = "";
    }

    const changeAspectRatio = (width, height) => {
        if (finalImageFile.length > 0) {
            return alert("All Images need to be of same Aspect Ratio");
        }
        setAspectRatio({width: width, height: height})
        cropper.current.setAspectRatio(width / height);
    }
    const handleImagesClose = (imageIndex) => {
        const updatedImages = finalImageFile.filter((image, idx) => idx !== imageIndex);
        setFinalImageFile(updatedImages);
    }
    const getCropData = async () => {
        if (typeof cropper.current !== "undefined") {
            const file = await dataUrlToFile(cropper.current.getCroppedCanvas().toDataURL(), imageToBeCroppedFileName.current)
            let cropBoxData = cropper.current.cropBoxData;
            let canvasData = cropper.current.canvasData;
            const widthFactor = canvasData.naturalWidth / canvasData.width;
            const heightFactor = canvasData.naturalHeight / canvasData.height;
            const cropData = `${cropBoxData.width * widthFactor}x${cropBoxData.height * heightFactor}+${(cropBoxData.left - cropBoxData.minLeft) * widthFactor}+${(cropBoxData.top - cropBoxData.minTop) * heightFactor}`
            console.log('cropBoxData',cropBoxData);
            console.log('canvasdata',  canvasData);
            setFinalImageFile   ([ {
                file: file,
                un_cropped_file: pickedImage.current,
                aspect_ratio: aspectRatio,
                crop_data: cropData
            }])
            console.log('cropped data',cropData);
            setImageToBeCropped(null)
            // pickedImage.current = null
        }
    };
    const dataUrlToFile = async (dataUrl, fileName) => {
        const res = await fetch(dataUrl);
        const blob = await res.blob();
        return new File([blob], fileName, {type: 'image/png'});
    }

    useEffect(() => {
        if (isEditable) {
            handleImage(finalImageFile)
        }
        console.log('final image is ',finalImageFile)
    }, [finalImageFile])

    return (
        <div className={"image-cropper-container"}>
            <div>
                {
                    (finalImageFile && isEditable) ?
                        finalImageFile.map((image, index) => {
                            return (<div key={index} className="add-post-images-preview">
                                <CrossIcon onClick={() => handleImagesClose(index)} className="cross-icon"/>
                                <img
                                    src={URL.createObjectURL(image.file)}
                                    style={{objectFit: "contain"}}
                                    alt="preview-image"
                                    className={"view-image"}
                                />
                            </div>)
                        }) :
                        finalImageFile.map((image, index) => {
                            return (<div key={index} className="add-post-images-preview">
                                <img
                                    src={URL.createObjectURL(image.file)}
                                    alt="preview-image"
                                    onClick={() => openImageViewer(index)}/>
                                className={"view-image"}

                            </div>)
                        })}



                {isEditable &&(finalImageFile.length < 1)&&<label htmlFor="image-input">
                    <div className='add-post-image-upload'>
                        <UploadIcon className={"icon-style"} />
                    </div>
                </label>

                }


                <input type='file' accept='image/*' onChange={handleImagesChange}
                       id='image-input' style={{display: 'none'}}/></div>

            {imageToBeCropped &&
                <div className={"cropperContainer"}>
                    <Cropper
                        src={imageToBeCropped}
                        style={{flex: 1,     width: "784px",
                            height: "694px"}}
                        aspectRatio={aspectRatio.width / aspectRatio.height}
                        guides={false}
                        autoCrop={true}
                        autoCropArea={0.8}
                        viewMode={1}
                        zoomable={false}
                        onInitialized={(instance) => {
                            cropper.current = instance;
                        }}
                    />

                    <div className={"cropperActionsContainer"}>

                        {isCard === true ?
                            <button type="button"
                                    className={aspectRatio.width === 1 ? "button btn-active" : "button"}
                                    onClick={() => {
                                        changeAspectRatio(1, 1);
                                    }}>
                                1:1
                            </button>
                            :
                            <>
                                <button type="button"
                                        className={aspectRatio.width === 16 ? "button btn-active" : "button"}
                                        onClick={() => {
                                            changeAspectRatio(16, 9);
                                        }}>
                                    16:9
                                </button>
                                <button type="button"
                                        className={aspectRatio.width === 1 ? "button btn-active" : "button"}
                                        onClick={() => {
                                            changeAspectRatio(1, 1);
                                        }}>
                                    1:1
                                </button>
                                <button type="button"
                                        className={aspectRatio.width === 3 ? "button btn-active" : "button"}
                                        onClick={() => {
                                            changeAspectRatio(3, 4);
                                        }}>
                                    3:4
                                </button>
                            </>
                        }

                        <button type="button" className={"button btn-crop-image"} onClick={getCropData}>
                            Crop Image
                        </button>
                    </div>
                </div>}
        </div>
    );
};

export default ImageCropper;








