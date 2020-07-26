import React, {useContext, useState} from 'react';
import {SafeAreaView, TouchableOpacity, Text, ScrollView} from "react-native";
import {ScannerContext} from "./ScannerContext";

const FirstPage = ({navigation}) => {
    const scannerContext = useContext(ScannerContext);

    const [isShowingImages, setIsShowingImages] = useState(false);
    const [isShowingPdf, setIsShowingPdf] = useState(false);
    const [isShowingScanner, setIsShowingScanner] = useState(false);

    return (
        <SafeAreaView>
            <ScrollView>
                <TouchableOpacity onPress={() => navigation.navigate("second")}>
                    <Text>Go to second page</Text>
                </TouchableOpacity>

                <TouchableOpacity onPress={() => setIsShowingImages(!isShowingImages)}>
                    <Text>{'\n\n'}Show images array</Text>
                    {isShowingImages && (
                        <Text>{JSON.stringify(scannerContext.images, null, ' ')}</Text>
                    )}
                </TouchableOpacity>

                <TouchableOpacity onPress={() => setIsShowingPdf(!isShowingPdf)}>
                    <Text>{'\n'}Show pdf details</Text>
                    {isShowingPdf && (
                        <Text>{JSON.stringify(scannerContext.pdfFile, null, ' ')}</Text>
                    )}
                </TouchableOpacity>

                <TouchableOpacity onPress={() => setIsShowingScanner(!isShowingScanner)}>
                    <Text>{'\n'}Show full scanner context contents</Text>
                    {isShowingScanner && (
                        <Text>{JSON.stringify(scannerContext, null, ' ')}</Text>
                    )}
                </TouchableOpacity>
            </ScrollView>
        </SafeAreaView>
    );
};

export default FirstPage;
