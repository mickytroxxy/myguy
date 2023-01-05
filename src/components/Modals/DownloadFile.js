import React, { memo, useContext, useState } from 'react'
import { View, TouchableOpacity, Text } from 'react-native'
import { AppContext } from '../../context/AppContext';
import AisInput from '../forms/AisInput';
import { FontAwesome} from "@expo/vector-icons";
import { WebView } from 'react-native-webview';
const DownloadFile = memo((props) => {
    const {QRCode,pdfUrl} = props.attr;
    const {appState:{setModalState,showToast}} = useContext(AppContext);
    const [value,setValue] = useState("");
    const onMessage = async (message) => {
        showToast("Your file has been downloaded")
    };
    return (
        <View style={{flex:1}}>
            <Text>{pdfUrl}</Text>
            <WebView source={{ html: `
                <html>
                    <head>
                        <meta charset="utf-8" />
                        <script src="https://unpkg.com/pdf-lib@1.4.0"></script>
                        <script src="https://unpkg.com/downloadjs@1.4.7"></script>
                    </head>
                
                    <body onLoad="modifyPdf()">
                        <button onclick="modifyPdf()">Modify PDF</button>
                    </body>
                    
                    <script>
                        const { degrees, PDFDocument, rgb, StandardFonts } = PDFLib
                        async function modifyPdf() {
                            //const url = ${pdfUrl}
                            const url = 'https://pdf-lib.js.org/assets/with_update_sections.pdf'
                            const existingPdfBytes = await fetch(url).then(res => res.arrayBuffer())
                            const pdfDoc = await PDFDocument.load(existingPdfBytes)
                            const helveticaFont = await pdfDoc.embedFont(StandardFonts.Helvetica)
                            const pages = pdfDoc.getPages()
                            const firstPage = pages[0]
                            const { width, height } = firstPage.getSize()
                            firstPage.drawText('This text was added with JavaScript!', {
                                x: 5,
                                y: height / 2 + 300,
                                size: 50,
                                font: helveticaFont,
                                color: rgb(0.95, 0.1, 0.1),
                                rotate: degrees(-45),
                            })
                            const pdfBytes = await pdfDoc.save()
                            const pdfUrl = window.URL.createObjectURL(new Blob([pdfBytes], { type: 'application/pdf' }))
                            window.ReactNativeWebView.postMessage(pdfUrl)
                            const link = document.createElement('a')
                            link.href = pdfUrl
                            link.download = 'my-modified-pdf.pdf'
                            link.click()
                        }
                    </script>
                </html>
                ` }} onMessage={onMessage} scrollEnabled={true}
                javaScriptEnabled={true}
                domStorageEnabled={true}
                originWhitelist={["*"]}  
            />
        </View>
    )
})

export default DownloadFile