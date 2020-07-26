import React, {createContext, useState} from "react";
import ImageResizer from 'react-native-image-resizer';

export const ScannerContext = createContext({
    images: [],
    pdfFile: null,
    fileName: '',
    documentName: '',

    mergeImages: () => {
    },
    removeImage: () => {
    },
    generatePdf: () => {
    },
    updateImage: () => {
    },
    getAverageImageWidth: () => {
    }
});

export const ScannerProvider = ({children}) => {
    const [images, setImages] = useState([])
    const [pdfFile, setPdfFile] = useState(null);
    const [documentName, setDocumentName] = useState('document-name-provided-by-user');
    const [fileName, setFileName] = useState('');

    const mergeImages = _images => setImages([...images, ..._images]);
    const removeImage = idx => {
        const _images = [...images];
        _images.splice(idx, 1);
        setImages(_images);
    }
    const updateImage = (image, idx) => {
        const _images = [...images];
        _images[idx] = image;
        setImages([..._images])
    }
    const resizeImages = () => {
        images.forEach(image => {
            ImageResizer.createResizedImage(
                image.path,
                getAverageImageWidth(),
                image.height * getAverageImageWidth() / image.height,
                "JPEG",
                100
            )
                .then(response => {
                    console.log('res')
                    console.log(JSON.stringify(response, null, ' '))
                    // response.uri is the URI of the new image that can now be displayed, uploaded...
                    // response.path is the path of the new image
                    // response.name is the name of the new image with the extension
                    // response.size is the size of the new image
                })
                .catch(err => {
                    console.error(err.message)
                    // Oops, something went wrong. Check that the filename is correct and
                    // inspect err to get more details.
                });
        })
    }
    const generatePdf = async () => {
        resizeImages();
        // const options = {
        //     imagePaths: images.map(img => Platform.OS === 'ios' ? img.path : img.path.substr(7)),
        //     name: Platform.OS === 'ios' ? documentName : documentName + '.pdf',
        //     quality: 1
        // };
        // let pdf = await RNImageToPdf.createPDFbyImages(options);
        //
        // setPdfFile(pdf);
        // setFileName(Platform.OS === 'ios' ? documentName + '.pdf' : pdf.filePath)
    }
    const getAverageImageWidth = () => {
        let sum = 0;
        images.forEach(img => sum += img.width);
        return Math.round(sum / images.length);
    }

    return (
        <ScannerContext.Provider value={{
            images,
            pdfFile,
            documentName,
            fileName,

            mergeImages,
            removeImage,
            updateImage,
            generatePdf,

            getAverageImageWidth
        }}>
            {children}
        </ScannerContext.Provider>
    )
}
