/*
 * fsm_control_buzzer.h
 *
 *  Created on: Dec 30, 2024
 *      Author: anhxa
 */

#ifndef INC_FSM_CONTROL_BUZZER_H_
#define INC_FSM_CONTROL_BUZZER_H_

#include "software_timer.h"
#include "main.h"
#include "global.h"
#include "scheduler.h"

void fsm_control_buzzer(UART_HandleTypeDef *huart);

#endif /* INC_FSM_CONTROL_BUZZER_H_ */
