/*
 * fsm_handle_data.h
 *
 *  Created on: Dec 31, 2024
 *      Author: anhxa
 */

#ifndef INC_FSM_HANDLE_DATA_H_
#define INC_FSM_HANDLE_DATA_H_

#include "software_timer.h"
#include "main.h"
#include "global.h"
#include "scheduler.h"
#include "mpu6050.h"

void fsm_handle_data(UART_HandleTypeDef *huart1, ADC_HandleTypeDef* hadc, UART_HandleTypeDef* huart2, I2C_HandleTypeDef* hi2c);
void handleSensorData(I2C_HandleTypeDef* hi2c);
void handleBatteryData(ADC_HandleTypeDef* hadc);
#endif /* INC_FSM_HANDLE_DATA_H_ */
