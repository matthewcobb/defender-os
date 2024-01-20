import asyncio
import logging
import time
from .BLE import BLEDevice
from .Utils import bytes_to_int, int_to_bytes, crc16_modbus

POLL_INTERVAL = 5 # SECONDS

class BaseClient:
    def __init__(self, config):
        self.initialized = False
        self.device = BLEDevice(config['mac_address'])
        self.device_id = config['device_id']
        self.data = {}
        self.sections = []
        self.section_index = 0
        self.loop = asyncio.get_event_loop()

    async def connect(self):
        connected = await self.device.discover_and_connect()
        if not connected:
            return False
        await self.device.setup_notifications(self.on_data_received)

        self.initialized = True
        return True

    def trigger_read_section(self):
        logging.info("Requesting data...")
        if not self.loop.is_running():
            self.loop.run_until_complete(self.read_section())
        else:
            asyncio.run_coroutine_threadsafe(self.read_section(), self.loop)

    async def read_section(self):
        if not self.sections:
            logging.error("No sections to read")
            return

        section = self.sections[self.section_index]
        request = self.create_generic_read_request(
            self.device_id, 3, section['register'], section['words']
        )
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
    def on_data_received(self, response):
        operation = bytes_to_int(response, 1, 1)

        if operation == 3: # read operation
            logging.info("on_data_received: response for read operation")
            if (self.section_index < len(self.sections) and
                self.sections[self.section_index]['parser'] != None and
                self.sections[self.section_index]['words'] * 2 + 5 == len(response)):
                # parse and update data
                self.sections[self.section_index]['parser'](response)

            if self.section_index >= len(self.sections) - 1: # last section, read complete
                self.section_index = 0
                self.on_read_operation_complete()
                self.data = {}
            else:
                self.section_index += 1
                time.sleep(0.5)
                asyncio.create_task(self.read_section())
        else:
            logging.warn("on_data_received: unknown operation={}".format(operation))

    async def on_disconnect(self):
        await self.device.disconnect()
        self.initialized = False


