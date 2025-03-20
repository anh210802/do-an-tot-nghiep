/*
 * global.c
 *
 *  Created on: Dec 29, 2024
 *      Author: anhxa
 */

#include "global.h"

StartState start_state = START_INIT;
FindDeviceState find_device_state = FIND_DEVICE_INIT;
HandleDataState handle_data_state = HANDLE_DATA_INIT;
ControlBuzzerState control_buzzer_state = CONTROL_BUZZER_INIT;
SendDataState send_data_state = SEND_DATA_INIT;

uint8_t temp = 0;
uint8_t buffer[MAX_BUFFER_SIZE] = {0};    // Clear buffer on initialization
uint8_t buffer_index = 0;
volatile bool buffer_flag = false;
volatile bool start_idle_flag = false;
volatile bool buzzer_flag = false;
volatile bool GPS_flag = false;
volatile bool BATTERY_flag = false;
volatile bool SENSOR_flag = false;

volatile bool handle_GPS_data_flag = false;
volatile bool handle_data_flag = false;

uint8_t id_device[ID_SIZE] = DEFAULT_ID_DEVICE;
uint8_t hello_device[MAX_BUFFER_SIZE] = DEFAULT_HELLO_DEVICE;

uint8_t action[4] = DEFAULT_ACCTION;

double ax = 0;
double ay = 0;
double az = 0;

uint32_t ADC_value = 123;


void onBuzzer(void) {
	HAL_GPIO_WritePin(BUZZER_GPIO_Port, BUZZER_Pin, RESET);
}

void offBuzzer(void) {
	HAL_GPIO_WritePin(BUZZER_GPIO_Port, BUZZER_Pin, SET);
}

void toggleBuzzer(void) {
	HAL_GPIO_TogglePin(BUZZER_GPIO_Port, BUZZER_Pin);
}

void onLed(void) {
	HAL_GPIO_WritePin(LED_GPIO_Port, LED_Pin, RESET);
}

void offLed(void) {
	HAL_GPIO_WritePin(LED_GPIO_Port, LED_Pin, SET);
}

void toggleLed(void) {
	HAL_GPIO_TogglePin(LED_GPIO_Port, LED_Pin);
}

void uint8_tToChar(char* str, uint8_t* text) {
	for (int i = 0; i < 6; i++) {
		str[i] = (char)text[i];
	}
	str[6] = '\0';
}
