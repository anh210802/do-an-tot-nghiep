/*
 * scheduler.h
 *
 *  Created on: Dec 29, 2024
 *      Author: anhxa
 */

#ifndef INC_SCHEDULER_H_
#define INC_SCHEDULER_H_

#include <stdint.h>
#define SCH_MAX_TASKS	20

typedef struct {
	void (*pTask)(void);
	uint32_t	Delay;
	uint32_t	Period;
	uint8_t		RunMe;

	uint32_t	TaskID;
}sTasks;

void SCH_Init(void);

void SCH_Add_Task(void (*pFunction)(), uint32_t DELAY, uint32_t PERIOD);

void SCH_Update(void);

void SCH_Dispatch_Tasks(void);

void SCH_Delete_Task(void(*pFunction)());


#endif /* INC_SCHEDULER_H_ */
