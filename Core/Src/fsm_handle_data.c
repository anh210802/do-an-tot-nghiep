/*
 * fsm_handle_data.c
 *
 *  Created on: Dec 31, 2024
 *      Author: anhxa
 */

#include "fsm_handle_data.h"

MPU6050_t MPU6050;


void handleSensorData(I2C_HandleTypeDef* hi2c) {
	MPU6050_Read_Accel(hi2c, &MPU6050);
	ax = MPU6050.Ax;
	ay = MPU6050.Ay;
	az = MPU6050.Az;
//	ax = MPU6050.Accel_X_RAW;
//	ay = MPU6050.Accel_Y_RAW;
//	az = MPU6050.Accel_Z_RAW;
//	SENSOR_flag = false;
}

void handleBatteryData(ADC_HandleTypeDef* hadc) {
	ADC_value = HAL_ADC_GetValue(hadc);
//    BATTERY_flag = false;
}

void fsm_handle_data(UART_HandleTypeDef *huart1, ADC_HandleTypeDef* hadc, UART_HandleTypeDef* huart2, I2C_HandleTypeDef* hi2c) {
//    switch (send_data_state) {
//        case HANDLE_DATA_IDLE:
//            if (GPS_flag) {
//            	send_data_state = HANDLE_DATA_GPS;
//            } else if (SENSOR_flag) {
//            	send_data_state = HANDLE_DATA_SENSOR;
//            } else if (BATTERY_flag) {
//            	send_data_state = HANDLE_DATA_BATTERY;
//            }
//            break;
//
//        case HANDLE_DATA_GPS:
//            handleGPSData(huart2);
//            send_data_state = HANDLE_DATA_IDLE;
//            break;
//
//        case HANDLE_DATA_SENSOR:
//            handleSensorData(hi2c);
//            send_data_state = HANDLE_DATA_IDLE;
//            counter_done += 1;
//            break;
//
//        case HANDLE_DATA_BATTERY:
//            handleBatteryData(hadc);
//            send_data_state = HANDLE_DATA_IDLE;
//            counter_done += 1;
//            break;
//
//        default:
//            break;
//    }
}
