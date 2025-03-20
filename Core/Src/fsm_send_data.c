/*
 * fsm_send_data.c
 *
 *  Created on: Dec 31, 2024
 *      Author: anhxa
 */

#include "fsm_send_data.h"

void send_data(UART_HandleTypeDef *huart) {
	char data[1024];
	char id_str[6] = "111111";
	int adc_str;

	uint8_tToChar(id_str, id_device);
	adc_str = (int)ADC_value;
	snprintf(data, sizeof(data),
			"!ID:%s:Accx:%.3f:Accy:%.3f:Accz:%.3f:POWER:%d#\r\n",
			id_str, ax, ay, az, adc_str);
	HAL_UART_Transmit_IT(huart, (uint8_t *)data, strlen(data));
}

void fsm_send_data(UART_HandleTypeDef *huart) {
//	switch(send_data_state) {
//	case SEND_DATA_IDLE:
//		if (handle_GPS_data_flag || handle_data_flag) {
//			send_data_state = SEND_DATA_SENDING;
//		}
//		break;
//	case SEND_DATA_SENDING:
//		if (handle_GPS_data_flag) {
//			handle_GPS_data_flag = false;
//			//
//			send_data_state = SEND_DATA_IDLE;
//		}
//
//		if (handle_data_flag) {
//			handle_data_flag = false;
//			send_data(huart);
//			send_data_state = SEND_DATA_IDLE;
//		}
//		break;
//	case SEND_DATA_OK:
//
//		break;
//	case SEND_DATA_RESEND:
//		break;
//	default:
//		break;
//	}
}
