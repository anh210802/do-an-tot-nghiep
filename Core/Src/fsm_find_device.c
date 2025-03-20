/*
 * fsm_find_device.c
 *
 *  Created on: Dec 30, 2024
 *      Author: anhxa
 */

#include "fsm_find_device.h"

int check_id_request(uint8_t* buffer, uint8_t * id) {
	if (buffer[1] == 'I' && buffer[2] == 'D') {
		for (int i = 0; i < ID_SIZE; i++) {
			if (id[i] != buffer[i+4]) return 0;
		}
	}
	return 1;
}

int check_request(uint8_t* buffer, uint8_t * id) {
	for(int i = 0; i < 4; i++) {
		if (action[i] != buffer[i+11]) return 0;
	}
	return 1;
}

void fsm_find_device(UART_HandleTypeDef *huart) {
	switch(find_device_state) {
	case FIND_DEVICE_IDLE:
		if (buffer_flag) {
			buffer_flag = false;
			find_device_state = FIND_DEVICE_CHECK_REQUEST;
		}
		break;
	case FIND_DEVICE_CHECK_REQUEST:
//		HAL_UART_Transmit_IT(huart, buffer, sizeof(buffer));
		if (check_id_request(buffer, id_device) == 1 && check_request(buffer, id_device) == 1) {
			find_device_state = FIND_DEVICE_UPDATE_BUZZER;
		} else {
			find_device_state = FIND_DEVICE_IDLE;
		}
		break;
	case FIND_DEVICE_UPDATE_BUZZER:
		if (buffer[16] == '1') {
			buzzer_flag = true;
			find_device_state = FIND_DEVICE_IDLE;
//			HAL_UART_Transmit_IT(huart, (uint8_t*) "on", 2);
		} else if (buffer[16] == '0') {
			buzzer_flag = false;
			find_device_state = FIND_DEVICE_IDLE;
//			HAL_UART_Transmit_IT(huart, (uint8_t*) "off", 3);
		} else {
			find_device_state = FIND_DEVICE_IDLE;
		}
		break;
	default:
		break;
	}
}
