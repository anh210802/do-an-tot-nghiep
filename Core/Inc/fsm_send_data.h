/*
 * fsm_send_data.h
 *
 *  Created on: Dec 31, 2024
 *      Author: anhxa
 */

#ifndef INC_FSM_SEND_DATA_H_
#define INC_FSM_SEND_DATA_H_

#include "software_timer.h"
#include "main.h"
#include "global.h"
#include "scheduler.h"

void fsm_send_data(UART_HandleTypeDef *huart);
void send_data(UART_HandleTypeDef *huart);

#endif /* INC_FSM_SEND_DATA_H_ */
