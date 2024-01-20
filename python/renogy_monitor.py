import logging
import configparser
import os
import sys
import asyncio
from renogybt import InverterClient, RoverClient, RoverHistoryClient, BatteryClient, DataLogger, Utils

logging.basicConfig(level=logging.DEBUG)

config_file = sys.argv[1] if len(sys.argv) > 1 else 'config.ini'
config_path = os.path.join(os.path.dirname(os.path.realpath(__file__)), config_file)
config = configparser.ConfigParser(inline_comment_prefixes=('#'))
config.read(config_path)
data_logger: DataLogger = DataLogger(config)

# the callback func when you receive data
def on_data_received(client, data):
    filtered_data = Utils.filter_fields(data, config['data']['fields'])
    logging.debug("{} => {}".format(client.device.alias(), filtered_data))
    # Disconnect if polling disabled
    if not config['data'].getboolean('enable_polling'):
        asyncio.run(client.disconnect())

# start client
async def main():
    if config['device']['type'] == 'RNG_CTRL':
        client = RoverClient(config, on_data_received)
        await client.connect()
    elif config['device']['type'] == 'RNG_CTRL_HIST':
        client = RoverHistoryClient(config, on_data_received)
        await client.connect()
    elif config['device']['type'] == 'RNG_BATT':
        client = BatteryClient(config, on_data_received)
        await client.connect()
    elif config['device']['type'] == 'RNG_INVT':
        client = InverterClient(config, on_data_received)
        await client.connect()
    else:
        logging.error("unknown device type")

    # Add here any additional code that should run after the client has connected
    # and potentially received data.

if __name__ == "__main__":
    asyncio.run(main())
