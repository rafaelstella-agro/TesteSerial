import { UsbSerialManager, UsbSerial, Parity } from "react-native-usb-serialport-for-android";
import { ScrollView, Alert, Button, Text } from "react-native";
import { useLayoutEffect, useState } from "react";

const SerialPortComponent = () => {
    const [usbSerial, setUsbSerial] = useState(null)
    const [CampoTexto, setCampoTexto] = useState("")
    useLayoutEffect(() => {
        // initSerialPort()
    },[])

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
                const usbSerialport = await UsbSerialManager.open(devices[0].deviceId, { baudRate: 9600, parity: Parity.None, dataBits: 8, stopBits: 1 });
                setUsbSerial(usbSerialport)
            } else {
                // alert('USB permission denied');
                setCampoTexto("Permissão negada")
            }}).catch(err => setCampoTexto(err))
        } catch (err) {
          console.error(err);
        }
    }

    async function str2hex(data) {
        setCampoTexto("Conversao: " + data)
    }

    async function sendData(data) {
        if (usbSerial) {
            try {
                await usbSerial.send(data)
            } catch(e) {
                console.error(e)
            }
        }
    }

    return (
        <ScrollView>
            <Button onPress={() => buscarDispositivos()} title="Buscar"/>
            <Button onPress={() => initSerialPort()} title="Conectar"/>
            <Button onPress={() => sendData('0x31')} title="1 - LIGAR"/>
            <Button onPress={() => sendData('0x30')} title="0 - DESLIGAR"/>
            <Button onPress={() => str2hex("0")} title="Str 2 Hex"/>
            <Text>
                {CampoTexto}
            </Text>
        </ScrollView>
    )
}

export default SerialPortComponent