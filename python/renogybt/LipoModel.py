import json

class LipoModel:
    def __init__(self, json_str1, json_str2):
        # Parse the JSON strings and merge them into one dictionary
        self.data = json.loads(json_str1)
        self.data.update(json.loads(json_str2))

        # You might want to validate the required keys in self.data

    def estimate_lipo_charging_time_cccv(self):
        current_voltage = self.data['currentVoltage']
        target_voltage_cc = self.data['targetVoltageCC']
        constant_current = self.data['constantCurrent']
        battery_total_capacity = self.data['batteryTotalCapacity']
        taper_current_threshold = self.data['taperCurrentThreshold']
        average_cv_factor = self.data['averageCVFactor']

        if current_voltage >= target_voltage_cc:
            return 0  # Already at or above target voltage for CC phase

        # Calculate time for CC phase
        cc_phase_capacity = (target_voltage_cc - current_voltage) * battery_total_capacity / target_voltage_cc
        time_cc = cc_phase_capacity / constant_current  # Time for CC phase in hours

        # Estimate time for CV phase (manufacturer suggests 7 hours total, so subtract CC phase time)
        # This is an approximation since we don't have the exact tapering profile
        time_cv = max(7 - time_cc, 0) * average_cv_factor  # Apply factor to adjust for actual tapering profile

        # Total time is the sum of both phases
        total_time = time_cc + time_cv

        # Add the result to the data dictionary
        self.data['estimatedChargingTime'] = total_time
        return total_time  # Time left in hours until the battery is fully charged


    def estimate_lipo_discharging_time(self):
        current_capacity = self.data['currentCapacityPercentage']
        discharge_rate = self.data['dischargeRate']
        battery_total_capacity = self.data['batteryTotalCapacity']
        min_voltage = self.data['minVoltage']
        current_voltage = self.data['currentVoltageDischarge']

       # Calculate the remaining capacity that can be used before reaching the minimum voltage
        usable_capacity = (current_voltage - min_voltage) * battery_total_capacity / current_voltage

        # If the discharge rate is zero or usable capacity is already below zero, return 'Infinity' or 'Already below min voltage'
        if discharge_rate == 0:
            return 'Infinity'  # Can't estimate time if there's no consumption
        if usable_capacity <= 0:
            return 'Already below min voltage'

        # Calculate time left until the battery reaches the minimum voltage
        time_left_hours = usable_capacity / discharge_rate

        self.data['estimatedDischargingTime'] = time_left_hours

        return time_left_hours  # Time left in hours until the battery reaches min voltage

    def calculate(self):
        self.estimate_lipo_charging_time_cccv()
        self.estimate_lipo_discharging_time()
        return json.dumps(self.data, indent=4)
