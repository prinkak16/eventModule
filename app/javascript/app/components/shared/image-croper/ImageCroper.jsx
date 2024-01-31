import React, {useCallback, useEffect, useRef, useState} from 'react';
import {CrossIcon, UploadIcon} from '../../../assests/svg/index'
import Cropper from "react-cropper";
import "cropperjs/dist/cropper.css";
import './image-cropper.scss'
import {IconButton} from "@mui/material";

const ImageCropper = ({
                          handleImage, Initial_image, isEditable = false
                          , isCard = false, eventStatus
                      }) => {

    const [finalImageFile, setFinalImageFile] = useState([])
    const [showInitialImage, setShowInitialImage] = useState(isEditable);
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

    /*useEffect(()=>{
        console.log('initital image is ',initialImage)
    },[initialImage])
*/
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

            console.log('file size ', file.size, ' uncropped file size', pickedImage?.current.size);
            setFinalImageFile([{
                file: file,
                un_cropped_file: pickedImage.current,
                aspect_ratio: aspectRatio,
                crop_data: cropData
            }])
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
        handleImage(finalImageFile)

    }, [finalImageFile])

    return (
        <div className={"image-cropper-container"}>
            <div>
                {
                    (Array.isArray(finalImageFile) && finalImageFile.length > 0) ?
                        finalImageFile.map((image, index) => {
                            return (<div key={index} className="add-post-images-preview">
                                <IconButton disabled={eventStatus === 'expired'} className="cross-icon">
                                    <CrossIcon onClick={() => handleImagesClose(index)} disabled={true}/>

                                </IconButton>
                                <img
                                    src={URL.createObjectURL(image.file)}
                                    style={{objectFit: "contain"}}
                                    alt="Loading..."
                                    className={"view-image"}
                                />
                            </div>)
                        }) :
                        showInitialImage ? <div className="add-post-images-preview">
                            <IconButton disabled={eventStatus === 'expired'} className="cross-icon">
                                <CrossIcon onClick={() => {
                                    setShowInitialImage(false)
                                    setFinalImageFile([])
                                }}/>
                            </IconButton>

                            <img
                                src={Initial_image} style={{objectFit: "contain"}}
                                alt="Loading..."
                                className={"view-image"}
                            />
                        </div> : <></>

                }


                {!showInitialImage && (finalImageFile.length < 1) && <label htmlFor="image-input">
                    <div className='add-post-image-upload'>
                        <UploadIcon className={"icon-style"}/>
                    </div>
                </label>

                }


                <input type='file' accept='image/*' onChange={handleImagesChange}
                       id='image-input' style={{display: 'none'}}/></div>

            {imageToBeCropped &&
                <div className={"cropperContainer"}>
                    <Cropper
                        src={imageToBeCropped}
                        style={{
                            flex: 1, width: "600px",
                            height: "300px"
                        }}
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


                        <button type="button" className={"button btn-crop-image"} onClick={getCropData}>
                            Crop Image
                        </button>
                    </div>
                </div>}
        </div>
    );
};

export default ImageCropper;








