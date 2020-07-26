import React, {useContext, useState} from 'react';
import {
    Image,
    PixelRatio,
    SafeAreaView,
    ScrollView,
    StatusBar,
    Text,
    TouchableOpacity,
    View,
    Dimensions,
    Alert
} from "react-native";
import PDFView from "react-native-view-pdf";
import ImagePicker from "react-native-image-crop-picker";
import {ScannerContext} from "./ScannerContext";

const deviceWidth = Dimensions.get("window").width;

const ImageHolder = ({image, imageComponent, idx, removeImage, cropImage}) => {
    return (
        <View style={styles.images.imageHolder}>
            <TouchableOpacity
                onPress={() => removeImage(idx)}
                style={[
                    styles.images.controlButtons.button,
                    styles.images.controlButtons.remove,
                ]}>
                <Text style={styles.images.controlButtons.text}>X</Text>
            </TouchableOpacity>

            <TouchableOpacity
                onPress={() => cropImage(idx, image)}
                style={[
                    styles.images.controlButtons.button,
                    styles.images.controlButtons.crop,
                ]}>
                <Text style={styles.images.controlButtons.text}>Crop</Text>
            </TouchableOpacity>

            <View style={styles.images.imageNumber.label}>
                <Text style={styles.images.imageNumber.text}>
                    {idx + 1}
                </Text>
            </View>

            {imageComponent}
        </View>
    )
}

const SecondPage = () => {
    const [showReader, setShowReader] = useState(false);
    const [areImagesLoading, setAreImagesLoading] = useState(false);

    const {
        images,
        fileName,

        mergeImages,
        removeImage,
        updateImage,
        generatePdf
    } = useContext(ScannerContext);

    const onSelectMultiple = () => {
        setAreImagesLoading(true);

        ImagePicker.openPicker({
            multiple: true,
            cropping: true,
            freeStyleCropEnabled: true,
            showCropFrame: true
        }).then(_images => {
            mergeImages(_images)
            setAreImagesLoading(false);
        }).catch(e => {
            console.warn(e.message);
            setAreImagesLoading(false);
        });
    }
    const onTakePhoto = () => {
        setAreImagesLoading(true);

        ImagePicker.openCamera({
            multiple: true,
            cropping: true,
            freeStyleCropEnabled: true,
            showCropFrame: true
        }).then(_images => {
            mergeImages(_images);
            setAreImagesLoading(false);
        }).catch(e => {
            console.warn(e.message)
            setAreImagesLoading(false);
        });
    };

    const onCropImage = (idx, image) => {
        setAreImagesLoading(true);

        ImagePicker.openCropper({
            path: images[idx].path,
            width: image.width * PixelRatio.get(),
            height: image.height * PixelRatio.get(),
            freeStyleCropEnabled: true,
            cropperChooseText: "Save",
            writeTempFile: false
        }).then(_image => {
            updateImage(_image, idx);
            setAreImagesLoading(false);
        }).catch(e => {
            console.warn(e.message);
            setAreImagesLoading(false);
        })
    };

    return (
        <>
            <SafeAreaView>
                <StatusBar barStyle={fileName ? "light-content" : "dark-content"}/>

                <ScrollView bounces={false} contentContainerStyle={{paddingVertical: 10, flexGrow: 1}}>
                    <View style={styles.header}>
                        <Text style={styles.title}>
                            Document scanner
                        </Text>
                    </View>

                    {areImagesLoading && (
                        <Text style={styles.images.emptyListText}>
                            Loading...
                        </Text>
                    )}

                    <View style={styles.images.container}>
                        {!areImagesLoading && !images.length && (
                            <Text style={styles.images.emptyListText}>
                                No images selected
                            </Text>
                        )}
                        {images.map((image, idx) => (
                            <ImageHolder
                                key={idx}
                                idx={idx}
                                image={image}
                                removeImage={removeImage}
                                cropImage={onCropImage}
                                imageComponent={
                                    <Image
                                        source={{uri: image.path}}
                                        style={styles.images.image}
                                    />
                                }
                            />
                        ))}
                    </View>

                    <TouchableOpacity
                        onPress={onSelectMultiple}
                        style={styles.buttons.default.button}
                    >
                        <Text style={styles.buttons.default.text}>
                            Select picture(s) from library
                        </Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        onPress={onTakePhoto}
                        style={styles.buttons.default.button}
                    >
                        <Text style={styles.buttons.default.text}>
                            Take picture(s) with camera
                        </Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        onPress={onTakePhoto}
                        style={styles.buttons.default.button}
                    >
                        <Text style={styles.buttons.default.text}>
                            Take picture(s) with camera
                        </Text>
                    </TouchableOpacity>

                    {!!images.length && (
                        <TouchableOpacity
                            onPress={() => {
                                generatePdf();
                                // setShowReader(true);
                            }}
                            style={[
                                styles.buttons.default.button,
                                styles.buttons.generate
                            ]}
                        >
                            <Text style={styles.buttons.default.text}>
                                Generate PDF
                            </Text>
                        </TouchableOpacity>
                    )}
                </ScrollView>
            </SafeAreaView>

            {showReader && (
                <>
                    <TouchableOpacity
                        onPress={() => setShowReader(false)}
                        style={styles.pdfViewer.closeButton}>
                        <Text>
                            X
                        </Text>
                    </TouchableOpacity>

                    <View style={styles.pdfViewer.container}>
                        <PDFView
                            style={styles.pdfViewer.document}
                            resource={fileName}
                            resourceType={'file'}
                            onError={(error) => console.log('Cannot render PDF', error)}
                        />
                    </View>
                </>
            )}
        </>
    )
};

const styles = {
    header: {
        width: "100%",
        justifyContent: "center",
        alignItems: "center",
    },
    title: {
        fontSize: 28,
        fontWeight: "bold",
        margin: 20,
        textAlign: "center"
    },
    images: {
        emptyListText: {
            marginBottom: 20,
            fontStyle: "italic",
        },
        container: {
            flexDirection: "row",
            flexWrap: "wrap",
            justifyContent: "space-around"
        },
        image: {
            height: deviceWidth * 0.6,
            width: deviceWidth * 0.45,
            borderRadius: 6,
        },
        imageHolder: {
            position: "relative",
            borderRadius: 6,
            marginBottom: 20,
            shadowColor: "#000",
            shadowOffset: {
                width: 0,
                height: 2,
            },
            shadowOpacity: 0.25,
            shadowRadius: 3.84,

            elevation: 5,
        },
        imageNumber: {
            label: {
                width: 22,
                height: 22,
                backgroundColor: "#fff",
                borderRadius: 11,
                alignItems: "center",
                justifyContent: "center",

                position: "absolute",
                top: 5,
                right: 5,
                zIndex: 1
            },
            text: {fontWeight: "bold"}
        },
        controlButtons: {
            text: {fontWeight: "bold"},
            button: {
                position: 'absolute',
                zIndex: 1,
                bottom: 0,
                height: 26,
                justifyContent: "center",
                alignItems: "center",
            },
            remove: {
                right: 0,
                left: "50%",
                backgroundColor: "coral",
                borderBottomRightRadius: 6,
            },
            crop: {
                left: 0,
                right: "50%",
                backgroundColor: "cyan",
                borderBottomLeftRadius: 6
            }
        }
    },
    buttons: {
        default: {
            button: {
                paddingVertical: 10,
                width: deviceWidth * 0.95,
                alignSelf: "center",

                justifyContent: 'center',
                alignItems: "center",
                textAlign: "center",
                backgroundColor: "cyan",
                marginBottom: 15
            },
            text: {
                fontWeight: "bold"
            }
        },
        generate: {
            backgroundColor: "green",
        }
    },
    pdfViewer: {
        closeButton: {
            position: "absolute",
            width: 30,
            height: 30,
            borderRadius: 15,
            backgroundColor: "#fff",
            alignItems: "center",
            justifyContent: "center",
            top: 30,
            right: 20,
            zIndex: 4
        },
        container: {
            backgroundColor: "rgba(0,0,0,.7)",
            position: "absolute",
            height: "100%",
            width: "100%",
            zIndex: 3,
            padding: 10
        },
        document: {width: '100%', height: "100%"}
    }
};

export default SecondPage;
