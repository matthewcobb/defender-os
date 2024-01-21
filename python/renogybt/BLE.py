import asyncio
import logging
from bleak import BleakClient, BleakScanner

ALIAS_PREFIX = 'BT-TH'
NOTIFY_CHAR_UUID = "0000fff1-0000-1000-8000-00805f9b34fb"
WRITE_CHAR_UUID = "0000ffd1-0000-1000-8000-00805f9b34fb"
DISCOVERY_TIMEOUT = 5  # seconds

class BLEDevice:
    def __init__(self, mac_address):
        self.mac_address = mac_address
        self.device = None
        self.write_characteristic = None

    async def initialize(self):
        asyncio.create_task(self.create_and_maintain_connection())

    async def discover_and_connect(self):
        logging.info(f"🔭 Looking for {self.mac_address}...")
        device = await BleakScanner.find_device_by_address(self.mac_address, timeout=DISCOVERY_TIMEOUT)
        if not device:
            logging.error(f"Device not found: {self.mac_address}")
            return False

        self.device = BleakClient(device)
        try:
            await self.device.connect()
            logging.info(f"Connected to {self.mac_address}")
            return True
        except Exception as e:
            logging.error(f"Connection failed: {e}")
            self.device = None
            return False

    async def create_and_maintain_connection(self):
        while True:
            if not self.device or not self.device.is_connected:
                logging.info(f"Trying to reconnect to {self.mac_address}")
                await self.discover_and_connect()
            await asyncio.sleep(5) # RETRY INTERVAL

    async def setup_notifications(self, on_data_received):
        for service in self.device.services:
            for characteristic in service.characteristics:
                if characteristic.uuid == NOTIFY_CHAR_UUID:
                    await self.device.start_notify(characteristic.uuid, on_data_received)
                    logging.info(f"Subscribed to notification {characteristic.uuid}")
                if characteristic.uuid == WRITE_CHAR_UUID:
                    self.write_characteristic = characteristic
                    logging.info(f"Found write characteristic {characteristic.uuid}")

    async def write_data(self, data):
        if not self.write_characteristic:
            logging.error("Write characteristic not found.")
            return False
        try:
            await self.device.write_gatt_char(self.write_characteristic.uuid, data)
            logging.debug("Write request sent.")
            return True
        except Exception as e:
            logging.error(f"Failed to write characteristic: {e}")
            return False

    async def disconnect(self):
        if self.device and self.device.is_connected:
            await self.device.disconnect()
            logging.info(f"Disconnected from {self.mac_address}")
