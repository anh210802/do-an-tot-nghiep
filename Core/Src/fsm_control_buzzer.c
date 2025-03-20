/*
 * fsm_control_buzzer.c
 *
 *  Created on: Dec 30, 2024
 *      Author: anhxa
 */

#include "fsm_control_buzzer.h"

int counter = 0;
uint8_t set_buzzer_on[] = "!ID:000000:SET_BUZZER_ON#";
uint8_t set_buzzer_off[] = "!ID:000000:SET_BUZZER_OFF#";
uint8_t set_buzzer_error[] = "!ID:000000:SET_BUZZER_ERROR#";

void setToggle() {
    counter++;
    toggleBuzzer();
}

void setDeviceID() {
    // Copy ID vào các mảng dữ liệu một cách an toàn
    for (int i = 0; i < ID_SIZE && i + 4 < sizeof(set_buzzer_on) - 1; i++) {
        set_buzzer_on[i + 4] = id_device[i];
        set_buzzer_off[i + 4] = id_device[i];
        set_buzzer_error[i + 4] = id_device[i];
    }
}

void sendOn(UART_HandleTypeDef *huart) {
    HAL_UART_Transmit_IT(huart, set_buzzer_on, strlen((char *)set_buzzer_on));
}

void sendOff(UART_HandleTypeDef *huart) {
    HAL_UART_Transmit_IT(huart, set_buzzer_off, strlen((char *)set_buzzer_off));
}

void sendError(UART_HandleTypeDef *huart) {
    HAL_UART_Transmit_IT(huart, set_buzzer_error, strlen((char *)set_buzzer_error));
}

void fsm_control_buzzer(UART_HandleTypeDef *huart) {
    switch (control_buzzer_state) {
    case CONTROL_BUZZER_IDLE:
        setDeviceID();
        if (buzzer_flag) {
            sendOn(huart);
            SCH_Add_Task(setToggle, 1, DELAY_BUZZER);
            control_buzzer_state = CONTROL_BUZZER_ON;
        } else {
            counter = 0;
            sendOff(huart);
            control_buzzer_state = CONTROL_BUZZER_OFF;
        }
        break;

    case CONTROL_BUZZER_ON:
        if (counter >= 100 || !buzzer_flag) {
            SCH_Delete_Task(setToggle);
            buzzer_flag = false;
            counter = 0;
            sendOff(huart);
            control_buzzer_state = CONTROL_BUZZER_OFF;
        }
        break;

    case CONTROL_BUZZER_OFF:
    	offBuzzer();
        if (buzzer_flag) {
            sendOn(huart);
            SCH_Add_Task(setToggle, 1, DELAY_BUZZER);
            control_buzzer_state = CONTROL_BUZZER_ON;
        }
        break;

    default:
//        sendError(huart);
        break;
    }
}
