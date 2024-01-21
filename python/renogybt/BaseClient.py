import asyncio
import logging
import time
from .BLE import BLEDevice
from .Utils import bytes_to_int, int_to_bytes, crc16_modbus

POLL_INTERVAL = 5

class BaseClient:
    def __init__(self, config):
        self.device = BLEDevice(config['mac_address'])
        self.device_id = config['device_id']
        self.latest_data = {}
        self.data = {}
        self.sections = []
        self.section_index = 0
        self.is_running = False
        self.is_reading = False

    async def start(self):
        await self.connect()
        self.is_running = True
        asyncio.create_task(self.poll_data())

    async def connect(self):
        try:
            connected = await self.device.discover_and_connect()
            if not connected:
                return False
            await self.device.setup_notifications(self.on_data_received)
            await asyncio.sleep(1)
        except Exception as e:
            await self.stop_service(e)
        except KeyboardInterrupt:
            await self.stop_service('Keyboard Interrupt')

    async def poll_data(self):
        while self.is_running:
            if not self.is_reading:
                await self.read_section()
            await asyncio.sleep(POLL_INTERVAL)

    async def read_section(self):
        self.is_reading = True
        if not self.sections:
            logging.error("No sections to read")
            return
        section = self.sections[self.section_index]
        logging.debug(f"🤖 Testing section {section['parser']}")
        request = self.create_generic_read_request(self.device_id, 3, section['register'], section['words'])
        success = await self.device.write_data(request)
        if not success:
            logging.error("Read operation failed.")

    def create_generic_read_request(self, device_id, function, regAddr, readWrd):
        data = None
        if regAddr != None and readWrd != None:
            data = []
            data.append(device_id)
            data.append(function)
            data.append(int_to_bytes(regAddr, 0))
            data.append(int_to_bytes(regAddr, 1))
            data.append(int_to_bytes(readWrd, 0))
            data.append(int_to_bytes(readWrd, 1))

            crc = crc16_modbus(bytes(data))
            data.append(crc[0])
            data.append(crc[1])
            logging.debug("{} {} => {}".format("create_request_payload", regAddr, data))
        return data

    # BaseClient handles read operation
    # SubClasses handle write
    async def on_data_received(self, sender, response):
        operation = bytes_to_int(response, 1, 1)

        if operation == 3: # read operation
            logging.debug(f"✅ DATA RECEIVED: Section Index: {self.section_index}")

            if (self.section_index < len(self.sections) and
                self.sections[self.section_index]['parser'] != None and
                self.sections[self.section_index]['words'] * 2 + 5 == len(response)):
                # parse and update data
                try:
                    self.sections[self.section_index]['parser'](response)
                except Exception as e:
                    logging.error(f"Error processing section {self.section_index}: {e}")

            if self.section_index >= len(self.sections) - 1: # last section, read complete
                self.section_index = 0
                self.on_read_operation_complete()
                # Reset the data for the next loop
                self.data = {}
            else:
                self.section_index += 1
                await asyncio.sleep(0.5)
                await self.read_section()
        else:
            logging.warn("on_data_received: unknown operation={}".format(operation))

    def on_read_operation_complete(self):
        logging.debug("on_read_operation_complete!")
        # Replace the latest data before its reset
        self.latest_data = self.data
        logging.info(self.latest_data)
        # Free up thread
        self.is_reading = False

    async def stop_service(self):
        logging.info(f"Disconnecting from {self.device}")
        await self.device.disconnect()
        self.is_running = False
