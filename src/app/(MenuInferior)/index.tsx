import { UsbSerialManager, UsbSerial, Parity } from "react-native-usb-serialport-for-android";
import { ScrollView, Button, Text } from "react-native";
import { useLayoutEffect, useState } from "react";
import { useRouter } from "expo-router";

const SerialPortComponent = () => {
    const [usbSerial, setUsbSerial] = useState<UsbSerial>()
    const [CampoTexto, setCampoTexto] = useState("")
    const router = useRouter()
    let mensagem = "";
    useLayoutEffect(() => {
        initSerialPort()
    },[])

    const stringToHex = (str) => {
        return str.split("")
            .map(c => c.charCodeAt(0).toString(16).padStart(2, "0"))
            .join("");
    };

    const hexToString = (hex) => {
        return hex.split(/(\w\w)/g)
            .filter(p => !!p)
            .map(c => String.fromCharCode(parseInt(c, 16)))
            .join("");
    }
    
    async function buscarDispositivos() {
        const devices = await UsbSerialManager.list();
        alert("Dispositivos encontrados: " + devices.length)
        console.log("Busca")
        for(let i=0;i<devices.length;i++)
        {
            console.log("Dispositivo: " + i)
            console.log("deviceId: " + devices[i].deviceId)
            console.log("productId: " + devices[i].productId)
            console.log("vendorId: " + devices[i].vendorId)
            console.log("")
        }
    }

    async function initSerialPort() {
        try {
            // check for the available devices
            const devices = await UsbSerialManager.list();
            // alert(devices[0].deviceId)
            setCampoTexto(""+devices[0].deviceId)
            // Send request for the first available device
            await UsbSerialManager.tryRequestPermission(devices[0].deviceId).then(async granted => {
            if (granted) {
                // alert("Concedido")
                setCampoTexto("Concedido")
                // open the port for communication
                const usbSerialport = (await UsbSerialManager.open(devices[0].deviceId, { baudRate: 9600, parity: Parity.None, dataBits: 8, stopBits: 1 }));
                setUsbSerial(usbSerialport)
                
                const sub = usbSerialport.onReceived((event) => {
                    // console.log("Recebido: " + event.data);
                    mensagem += event.data;
                    if(mensagem.length == 6)
                    {
                        //if(mensagem.charCodeAt(mensagem.length-2) )
                        console.log("Recebido: " + mensagem + " -> "  + hexToString(mensagem))
                        if(hexToString(mensagem).substring(0,1) === "3")
                        {
                            // console.log("Tela 1")
                            router.push("/tela1")
                        }
                        else if(hexToString(mensagem).substring(0,1) === "4")
                        {
                            // console.log("Tela 2")
                            router.push("/(MenuInferior)/tela2")
                        }
                        else if(hexToString(mensagem).substring(0,1) === "5")
                        {
                            // console.log("Tela 3")
                            router.push("/tela3")
                        }
                        else
                        {
                            console.log("Opcao invalida")
                        }
                        mensagem = "";
                    }
                });
            } else {
                // alert('USB permission denied');
                setCampoTexto("Permissão negada")
            }}).catch(err => setCampoTexto(err))
        } catch (err) {
          console.error(err);
        }
    }

    async function sendData(data) {
        if (usbSerial) {
            try {
                await usbSerial.send(stringToHex(data))
            } catch(e) {
                console.error(e)
            }
        }
    }

    return (
        <ScrollView>
            <Button onPress={() => buscarDispositivos()} title="Buscar"/>
            <Button onPress={() => initSerialPort()} title="Conectar"/>
            <Button onPress={() => sendData('1')} title="1 - LIGAR"/>
            <Button onPress={() => sendData('0')} title="0 - DESLIGAR"/>
            <Text>
                {CampoTexto}
            </Text>
        </ScrollView>
    )
}

export default SerialPortComponent