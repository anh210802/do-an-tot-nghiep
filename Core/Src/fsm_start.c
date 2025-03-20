/*
 * fsm_start.c
 *
 *  Created on: Dec 29, 2024
 *      Author: anhxa
 */

#include "fsm_start.h"

int timeout_connect = TIMEOUT_CONNECT;
bool update_id = false;

void handle_id(uint8_t* input, uint8_t* id) {
    if(input[3] == 'I' && input[4] == 'D') {
        for(int i = 0; i < ID_SIZE; i++) {
            if (input[i+6] >= '0' && input[i+6] <= '9') {
                id[i] = input[i+6];
            } else {
                return;
            }
        }
    }
}

void init_buzzer_and_led() {
    onBuzzer();
    onLed();
    HAL_Delay(200);
    offLed();
    offBuzzer();
}

void fsm_start(UART_HandleTypeDef* huart, uint8_t* buffer) {
    switch (start_state) {
    case START_INIT:
    	handle_GPS_data_flag = false;
        init_buzzer_and_led();
        start_state = START_CONNECTING;
        break;

    case START_CONNECTING:
        HAL_UART_Transmit_IT(huart, hello_device, sizeof(hello_device));
        if (!buffer_flag) {
            timeout_connect = TIMEOUT_CONNECT;
            start_state = START_WAIT;
        } else {
            buffer_flag = false;
            start_state = START_UPDATE_ID;
        }
        break;

    case START_WAIT:
        if (buffer_flag) {
            buffer_flag = false;
            start_state = START_UPDATE_ID;
        }
        else if (timeout_connect <= 0) {
            start_state = START_CONNECTING;
        } else {
            timeout_connect--;
        }
        break;

    case START_UPDATE_ID:
    	if (buffer[0] != '\0') {
    		handle_id(buffer, id_device);
			if (sizeof(id_device) == 6) {
				start_state = START_IDLE;
			} else {
				start_state = START_CONNECTING;
			}
    	}
        break;

    case START_IDLE:
    	init_buzzer_and_led();
    	HAL_Delay(200);
    	init_buzzer_and_led();

    	HAL_UART_Transmit_IT(huart, id_device, 6);
    	find_device_state = FIND_DEVICE_IDLE;
    	handle_data_state = HANDLE_DATA_IDLE;
    	control_buzzer_state = CONTROL_BUZZER_IDLE;
    	send_data_state = SEND_DATA_IDLE;
    	handle_data_flag = true;
    	start_idle_flag = true;
    	handle_GPS_data_flag = true;

        break;
    default:
        break;
    }
}

