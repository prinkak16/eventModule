import React, {useCallback, useEffect, useRef, useState} from 'react';
import UploadIcon from '../../assets/upload-icon.svg';
import CloseIcon from '../../assets/close-icon.svg';
import './add-post-images.styles.scss';
import Cropper from "react-cropper";
import "cropperjs/dist/cropper.css";
import ImageViewer from "react-simple-image-viewer";

const ImageCropper = ({handleImages, Initial_images, isEditable, isCard}) => {
    const [imagesArray, setImagesArray] = useState(Initial_images)
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
        if (imagesArray.length > 0) {
            return alert("All Images need to be of same Aspect Ratio");
        }
        setAspectRatio({width: width, height: height})
        cropper.current.setAspectRatio(width / height);
    }
    const handleImagesClose = (imageIndex) => {
        const updatedImages = imagesArray.filter((image, idx) => idx !== imageIndex);
        setImagesArray(updatedImages);
    }
    const getCropData = async () => {
        if (typeof cropper.current !== "undefined") {
            const file = await dataUrlToFile(cropper.current.getCroppedCanvas().toDataURL(), imageToBeCroppedFileName.current)
            let cropBoxData = cropper.current.cropBoxData;
            let canvasData = cropper.current.canvasData;
            const widthFactor = canvasData.naturalWidth / canvasData.width;
            const heightFactor = canvasData.naturalHeight / canvasData.height;
            const cropData = `${cropBoxData.width * widthFactor}x${cropBoxData.height * heightFactor}+${(cropBoxData.left - cropBoxData.minLeft) * widthFactor}+${(cropBoxData.top - cropBoxData.minTop) * heightFactor}`
            console.log(cropBoxData);
            console.log(canvasData);
            setImagesArray([...imagesArray, {
                file: file,
                un_cropped_file: pickedImage.current,
                aspect_ratio: aspectRatio,
                crop_data: cropData
            }])
            console.log(cropData);
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
            handleImages(imagesArray)
        }
    }, [imagesArray])

    return (<>
        <span className='add-post-upload-text'>Upload Images :</span>
        <div style={{display: "flex", flexDirection: "row"}}>
            <div className='add-post-images-content'>
                {
                    (imagesArray && isEditable) ?
                        imagesArray.map((image, id) => {
                            return (<div key={id} className="add-post-images-preview">
                                <CloseIcon onClick={() => handleImagesClose(id)}/>
                                <img
                                    src={URL.createObjectURL(image.file)}
                                    style={{objectFit: "contain"}}
                                    alt="preview-image"/>
                            </div>)
                        }) :
                        imagesArray.map((image, index) => {
                            return (<div key={index} className="add-post-images-preview">
                                <img
                                    src={image}
                                    alt="preview-image"
                                    onClick={() => openImageViewer(index)}/>
                            </div>)
                        })}

                {isViewerOpen && (
                    <ImageViewer
                        src={imagesArray}
                        currentIndex={currentImageIndex}
                        disableScroll={false}
                        closeOnClickOutside={true}
                        onClose={closeImageViewer}
                    />)}

                {isCard === true ?
                    isEditable && (imagesArray.length < 1) && <label htmlFor="image-input">
                        <div className='add-post-images-upload'>
                            <UploadIcon/>
                            <span>Upload Images</span>
                        </div>
                    </label>
                    :
                    isEditable && (imagesArray.length < 4) && <label htmlFor="image-input">
                        <div className='add-post-images-upload'>
                            <UploadIcon/>
                            <span>Upload Images</span>
                        </div>
                    </label>
                }


                <input type='file' accept='image/*' onChange={handleImagesChange}
                       id='image-input' style={{display: 'none'}}/>
            </div>
            {imageToBeCropped &&
                <div className={"cropperContainer"}>
                    <Cropper
                        src={imageToBeCropped}
                        style={{flex: 1, minHeight: "400px",}}
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

                        <div style={{flex: 1}}/>
                        <button type="button" className={"button btn-crop-image"} onClick={getCropData}>
                            Crop Image
                        </button>
                    </div>
                </div>}
        </div>
    </>);
};

export default <ImageCropper></ImageCropper>;




















