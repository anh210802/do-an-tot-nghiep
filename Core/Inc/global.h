/*
 * global.h
 *
 *  Created on: Dec 29, 2024
 *      Author: anhxa
 */

#ifndef INC_GLOBAL_H_
#define INC_GLOBAL_H_

#include "main.h"

#define DEFAULT_ID_DEVICE "000000"
#define DEFAULT_HELLO_DEVICE "!HELLO:FROM:DEVICE#"
#define DEFAULT_ACCTION "FIND"
#define MAX_BUFFER_SIZE 256
static const uint16_t TIMEOUT_CONNECT = 3000;
static const uint16_t TIMEOUT_SEND = 2000;
static const uint16_t TIMEOUT_BUZZER = 500;
static const uint16_t DELAY_BUZZER = 300;
#define ID_SIZE 6

#define SET_FLAG(x)    ((x) = true)
#define CLEAR_FLAG(x)  ((x) = false)
#define IS_FLAG_SET(x) ((x) == true)

// FSM Start
typedef enum {
    START_INIT,       // Initial state
    START_CONNECTING, // Attempting to connect
    START_WAIT,       // Waiting for connection
    START_UPDATE_ID,  // Updating device ID
    START_IDLE        // Idle state
} StartState;

// FSM find device
typedef enum {
	FIND_DEVICE_INIT,
    FIND_DEVICE_IDLE,            // Idle state
    FIND_DEVICE_CHECK_REQUEST,   // Checking requests
    FIND_DEVICE_UPDATE_BUZZER    // Updating buzzer flag
} FindDeviceState;

// FSM handle data
typedef enum {
	HANDLE_DATA_INIT,
    HANDLE_DATA_IDLE,            // Idle state
    HANDLE_DATA_GPS,             // Processing GPS data
    HANDLE_DATA_BATTERY,         // Processing battery data
    HANDLE_DATA_SENSOR           // Processing sensor data
} HandleDataState;

// FSM control buzzer
typedef enum {
	CONTROL_BUZZER_INIT,
    CONTROL_BUZZER_IDLE,         // Idle state
    CONTROL_BUZZER_ON,           // Turning buzzer ON
    CONTROL_BUZZER_OFF           // Turning buzzer OFF
} ControlBuzzerState;

// FSM send data
typedef enum {
	SEND_DATA_INIT,
    SEND_DATA_IDLE,              // Idle state
    SEND_DATA_SENDING,           // Sending data
    SEND_DATA_OK,                // Data sent successfully
    SEND_DATA_RESEND             // Resending data
} SendDataState;

// Global variables
extern StartState start_state;
extern FindDeviceState find_device_state;
extern HandleDataState handle_data_state;
extern ControlBuzzerState control_buzzer_state;
extern SendDataState send_data_state;

extern uint8_t temp;                    // Temporary byte storage
extern uint8_t buffer[MAX_BUFFER_SIZE]; // Buffer to store incoming data
extern uint8_t buffer_index;            // Index for buffer position
extern volatile bool buffer_flag;             // Flag indicating if buffer has new data
extern volatile bool start_idle_flag;
extern volatile bool buzzer_flag;
extern volatile bool GPS_flag;
extern volatile bool BATTERY_flag;
extern volatile bool SENSOR_flag;

extern volatile bool handle_GPS_data_flag;
extern volatile bool handle_data_flag;

extern uint8_t action[4];

extern uint8_t id_device[ID_SIZE];
extern uint8_t hello_device[MAX_BUFFER_SIZE];

extern double ax;
extern double ay;
extern double az;

extern uint32_t ADC_value;

// Configure buzzer function
void onBuzzer(void);
void offBuzzer(void);
void toggleBuzzer(void);

// Configure led function
void onLed(void);
void offLed(void);
void toggleLed(void);

void uint8_tToChar(char* str, uint8_t* text);

#endif /* INC_GLOBAL_H_ */
