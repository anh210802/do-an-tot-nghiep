/* USER CODE BEGIN Header */
/**
  ******************************************************************************
  * @file           : main.c
  * @brief          : Main program body
  ******************************************************************************
  * @attention
  *
  * Copyright (c) 2024 STMicroelectronics.
  * All rights reserved.
  *
  * This software is licensed under terms that can be found in the LICENSE file
  * in the root directory of this software component.
  * If no LICENSE file comes with this software, it is provided AS-IS.
  *
  ******************************************************************************
  */
/* USER CODE END Header */
/* Includes ------------------------------------------------------------------*/
#include "main.h"

/* Private includes ----------------------------------------------------------*/
/* USER CODE BEGIN Includes */
#include "global.h"
#include "software_timer.h"
#include "scheduler.h"
#include "mpu6050.h"
#include "gps.h"
#include "fsm_start.h"
#include "fsm_find_device.h"
#include "fsm_control_buzzer.h"
#include "fsm_handle_data.h"
#include "fsm_send_data.h"
//#include "i2c.h"
/* USER CODE END Includes */

/* Private typedef -----------------------------------------------------------*/
/* USER CODE BEGIN PTD */

/* USER CODE END PTD */

/* Private define ------------------------------------------------------------*/
/* USER CODE BEGIN PD */

/* USER CODE END PD */

/* Private macro -------------------------------------------------------------*/
/* USER CODE BEGIN PM */

/* USER CODE END PM */

/* Private variables ---------------------------------------------------------*/
ADC_HandleTypeDef hadc;

I2C_HandleTypeDef hi2c1;

TIM_HandleTypeDef htim2;

UART_HandleTypeDef huart1;
UART_HandleTypeDef huart2;

/* USER CODE BEGIN PV */

/* USER CODE END PV */

/* Private function prototypes -----------------------------------------------*/
void SystemClock_Config(void);
static void MX_GPIO_Init(void);
static void MX_ADC_Init(void);
static void MX_I2C1_Init(void);
static void MX_TIM2_Init(void);
static void MX_USART1_UART_Init(void);
static void MX_USART2_UART_Init(void);
/* USER CODE BEGIN PFP */

/* USER CODE END PFP */

/* Private user code ---------------------------------------------------------*/
/* USER CODE BEGIN 0 */

uint8_t		u8_flag_10ms = 0;
#define BUFFER_SIZE 512
char gpsBuffer[BUFFER_SIZE];
char gpggaBuffer[BUFFER_SIZE];
char outputBuffer[BUFFER_SIZE];
//float latitude = 6.0, longitude = 6.0;
float longitude = 0;  // Ví dụ giá trị kinh độ
float latitude = 0;
char id[6] = "010001";
void sendTestMessage() {
    char testMessage[] = "!Test message#\r\n";
    HAL_UART_Transmit(&huart1, (uint8_t*)testMessage, sizeof(testMessage), HAL_MAX_DELAY);
}
void sendTestMessage1() {
    char testMessage[] = "!aaaaaaaaaaaaa#\r\n";
    HAL_UART_Transmit(&huart1, (uint8_t*)testMessage, sizeof(testMessage), HAL_MAX_DELAY);
}
void filterGPGGA(const char* input) {
    const char* gpggaStart = strstr(input, "$GNGGA"); // Tìm câu $GPGGA
    if (gpggaStart != NULL) {
        const char* gpggaEnd = strstr(gpggaStart, "\r\n"); // Tìm dấu kết thúc câu
        if (gpggaEnd != NULL) {
            size_t gpggaLength = gpggaEnd - gpggaStart + 2; // �?ộ dài câu $GPGGA
            strncpy(gpggaBuffer, gpggaStart, gpggaLength); // Sao chép câu $GPGGA
            gpggaBuffer[gpggaLength] = '\0'; // Thêm ký tự kết thúc chuỗi
        }
    }
}


void parseGPSData(char* nmea) {
    char* token;

    // Tìm chuỗi $GPGGA
    token = strstr(nmea, "$GNGGA");
//    token =  nmea;
    if (token != NULL) {
        token = strtok(token, ","); // B�? qua "$GPGGA"
        token = strtok(NULL, ","); // B�? qua th�?i gian
        token = strtok(NULL, ","); // Lấy giá trị vĩ độ (latitude)

        if (token != NULL) {
            float rawLatitude = atof(token); // Lấy giá trị DDMM.MMMM
            float degrees = (int)(rawLatitude / 100); // Lấy phần độ
            float minutes = rawLatitude - (degrees * 100); // Lấy phần phút
            latitude = degrees + (minutes / 60.0); // Chuyển sang decimal degrees

            token = strtok(NULL, ","); // Lấy hướng vĩ độ (N/S)
            if (token != NULL && *token == 'S') {
                latitude = -latitude; // Nếu là 'S', đổi sang giá trị âm
            }
        }

        token = strtok(NULL, ","); // Lấy giá trị kinh độ (longitude)
        if (token != NULL) {
            float rawLongitude = atof(token); // Lấy giá trị DDMM.MMMM
            float degrees = (int)(rawLongitude / 100); // Lấy phần độ
            float minutes = rawLongitude - (degrees * 100); // Lấy phần phút
            longitude = degrees + (minutes / 60.0); // Chuyển sang decimal degrees
            token = strtok(NULL, ","); // Lấy hướng kinh độ (E/W)

            if (token != NULL && *token == 'W') {
                longitude = -longitude; // Nếu là 'W', đổi sang giá trị âm
            }
        }
    }
}


void sendCoordinates() {
    if (latitude != 0.0 && longitude != 0.0) {
    	uint8_tToChar(id, id_device);
        snprintf(outputBuffer, sizeof(outputBuffer), "!ID:%s:GPS:%.6f:%.6f#\r\n", id, longitude, latitude);
        HAL_UART_Transmit_IT(&huart1, (uint8_t*)outputBuffer, strlen(outputBuffer));
    } else {
        snprintf(outputBuffer, sizeof(outputBuffer), "!Invalid GPS Data#\r\n");
        HAL_UART_Transmit_IT(&huart1, (uint8_t*)outputBuffer, strlen(outputBuffer));
    }
    //memset(outputBuffer, 0, sizeof(outputBuffer));
}

void HAL_UART_RxCpltCallback(UART_HandleTypeDef *huart) {
	if(huart->Instance == USART1) {
		if (temp != 13) {
			if (buffer_index < MAX_BUFFER_SIZE - 1) {
				buffer[buffer_index++] = temp;
			} else {
				buffer_index = 0;
				buffer_flag = 1;
			}
		} else {
			buffer[buffer_index] = '\0';
			buffer_index = 0;
			buffer_flag = 1;
		}
		HAL_UART_Receive_IT(&huart1, &temp, 1);
	}
	if (huart->Instance == USART2) {
		filterGPGGA(gpsBuffer);
		parseGPSData(gpggaBuffer);
//		sendCoordinates();
		HAL_UART_Receive_IT(&huart2, (uint8_t*)gpsBuffer, BUFFER_SIZE);
	}
}

void fsm_start_task(void) {
	fsm_start(&huart1, buffer);
}

void fsm_find_device_task(void) {
	fsm_find_device(&huart1);
}

void fsm_control_buzzer_task(void) {
	fsm_control_buzzer(&huart1);
}

void fsm_handle_data_task(void) {
	handleBatteryData(&hadc);
	handleSensorData(&hi2c1);
}

void fsm_send_data_task(void) {
	if (handle_data_flag == true) {
		send_data(&huart1);
	}
}

//MPU6050_t MPU6050;

//void handleSensorData(void) {
//	MPU6050_Read_All(&hi2c1, &MPU6050);
//	ax = MPU6050.Ax;
//	ay = MPU6050.Ay;
//	az = MPU6050.Az;
//	SENSOR_flag = false;
//}
//
//void handleBatteryData(void) {
//	ADC_value = HAL_ADC_GetValue(&hadc);
//    BATTERY_flag = false;
//}

/* USER CODE END 0 */

/**
  * @brief  The application entry point.
  * @retval int
  */
int main(void)
{

  /* USER CODE BEGIN 1 */

  /* USER CODE END 1 */

  /* MCU Configuration--------------------------------------------------------*/

  /* Reset of all peripherals, Initializes the Flash interface and the Systick. */
  HAL_Init();

  /* USER CODE BEGIN Init */

  /* USER CODE END Init */

  /* Configure the system clock */
  SystemClock_Config();

  /* USER CODE BEGIN SysInit */

  /* USER CODE END SysInit */

  /* Initialize all configured peripherals */
  MX_GPIO_Init();
  MX_ADC_Init();
  MX_I2C1_Init();
  MX_TIM2_Init();
  MX_USART1_UART_Init();
  MX_USART2_UART_Init();
  /* USER CODE BEGIN 2 */
  HAL_TIM_Base_Start_IT(&htim2);
  HAL_GPIO_WritePin(M0_GPIO_Port, M0_Pin, RESET);
  HAL_GPIO_WritePin(M1_GPIO_Port, M1_Pin, RESET);
  HAL_GPIO_WritePin(BUZZER_GPIO_Port, BUZZER_Pin, SET);
  HAL_GPIO_WritePin(LED_GPIO_Port, LED_Pin, SET);
  HAL_UART_Receive_IT(&huart1, &temp, 1);
  HAL_UART_Receive_IT(&huart2, (uint8_t*)gpsBuffer, BUFFER_SIZE);
  MPU6050_Init(&hi2c1);

  /* USER CODE END 2 */

  /* Infinite loop */
  /* USER CODE BEGIN WHILE */
  SCH_Add_Task(fsm_start_task, 1, 1);
  SCH_Add_Task(fsm_find_device_task, 2, 1);
  SCH_Add_Task(fsm_control_buzzer_task, 3, 1);
  SCH_Add_Task(fsm_handle_data_task, 5, 1);
//  SCH_Add_Task(fsm_send_data_task, 6, 10000);
  setTimer0(1000);
  setTimer1(5000);
  while (1)
  {
	  if (handle_GPS_data_flag == true) {
		  if (u8_flag_10ms){
			u8_flag_10ms = 0;
			parseGPSData(gpggaBuffer);
			sendCoordinates();
		  }
	  }
	  if (timer1_flag == 1) {
		  SENSOR_flag = true;
		  BATTERY_flag = true;
		  setTimer1(5000);
	  }

	  if (start_idle_flag) {
		  start_idle_flag = false;
		  SCH_Delete_Task(fsm_start_task);
	  }
	  SCH_Dispatch_Tasks();
    /* USER CODE END WHILE */

    /* USER CODE BEGIN 3 */
  }
  /* USER CODE END 3 */
}

/**
  * @brief System Clock Configuration
  * @retval None
  */
void SystemClock_Config(void)
{
  RCC_OscInitTypeDef RCC_OscInitStruct = {0};
  RCC_ClkInitTypeDef RCC_ClkInitStruct = {0};

  /** Configure the main internal regulator output voltage
  */
  __HAL_PWR_VOLTAGESCALING_CONFIG(PWR_REGULATOR_VOLTAGE_SCALE1);

  /** Initializes the RCC Oscillators according to the specified parameters
  * in the RCC_OscInitTypeDef structure.
  */
  RCC_OscInitStruct.OscillatorType = RCC_OSCILLATORTYPE_HSI;
  RCC_OscInitStruct.HSIState = RCC_HSI_ON;
  RCC_OscInitStruct.HSICalibrationValue = RCC_HSICALIBRATION_DEFAULT;
  RCC_OscInitStruct.PLL.PLLState = RCC_PLL_ON;
  RCC_OscInitStruct.PLL.PLLSource = RCC_PLLSOURCE_HSI;
  RCC_OscInitStruct.PLL.PLLMUL = RCC_PLL_MUL4;
  RCC_OscInitStruct.PLL.PLLDIV = RCC_PLL_DIV2;
  if (HAL_RCC_OscConfig(&RCC_OscInitStruct) != HAL_OK)
  {
    Error_Handler();
  }

  /** Initializes the CPU, AHB and APB buses clocks
  */
  RCC_ClkInitStruct.ClockType = RCC_CLOCKTYPE_HCLK|RCC_CLOCKTYPE_SYSCLK
                              |RCC_CLOCKTYPE_PCLK1|RCC_CLOCKTYPE_PCLK2;
  RCC_ClkInitStruct.SYSCLKSource = RCC_SYSCLKSOURCE_PLLCLK;
  RCC_ClkInitStruct.AHBCLKDivider = RCC_SYSCLK_DIV1;
  RCC_ClkInitStruct.APB1CLKDivider = RCC_HCLK_DIV1;
  RCC_ClkInitStruct.APB2CLKDivider = RCC_HCLK_DIV1;

  if (HAL_RCC_ClockConfig(&RCC_ClkInitStruct, FLASH_LATENCY_1) != HAL_OK)
  {
    Error_Handler();
  }
}

/**
  * @brief ADC Initialization Function
  * @param None
  * @retval None
  */
static void MX_ADC_Init(void)
{

  /* USER CODE BEGIN ADC_Init 0 */

  /* USER CODE END ADC_Init 0 */

  ADC_ChannelConfTypeDef sConfig = {0};

  /* USER CODE BEGIN ADC_Init 1 */

  /* USER CODE END ADC_Init 1 */

  /** Configure the global features of the ADC (Clock, Resolution, Data Alignment and number of conversion)
  */
  hadc.Instance = ADC1;
  hadc.Init.ClockPrescaler = ADC_CLOCK_ASYNC_DIV1;
  hadc.Init.Resolution = ADC_RESOLUTION_12B;
  hadc.Init.DataAlign = ADC_DATAALIGN_RIGHT;
  hadc.Init.ScanConvMode = ADC_SCAN_DISABLE;
  hadc.Init.EOCSelection = ADC_EOC_SEQ_CONV;
  hadc.Init.LowPowerAutoWait = ADC_AUTOWAIT_DISABLE;
  hadc.Init.LowPowerAutoPowerOff = ADC_AUTOPOWEROFF_DISABLE;
  hadc.Init.ChannelsBank = ADC_CHANNELS_BANK_A;
  hadc.Init.ContinuousConvMode = DISABLE;
  hadc.Init.NbrOfConversion = 1;
  hadc.Init.DiscontinuousConvMode = DISABLE;
  hadc.Init.ExternalTrigConv = ADC_SOFTWARE_START;
  hadc.Init.ExternalTrigConvEdge = ADC_EXTERNALTRIGCONVEDGE_NONE;
  hadc.Init.DMAContinuousRequests = DISABLE;
  if (HAL_ADC_Init(&hadc) != HAL_OK)
  {
    Error_Handler();
  }

  /** Configure for the selected ADC regular channel its corresponding rank in the sequencer and its sample time.
  */
  sConfig.Channel = ADC_CHANNEL_0;
  sConfig.Rank = ADC_REGULAR_RANK_1;
  sConfig.SamplingTime = ADC_SAMPLETIME_4CYCLES;
  if (HAL_ADC_ConfigChannel(&hadc, &sConfig) != HAL_OK)
  {
    Error_Handler();
  }
  /* USER CODE BEGIN ADC_Init 2 */

  /* USER CODE END ADC_Init 2 */

}

/**
  * @brief I2C1 Initialization Function
  * @param None
  * @retval None
  */
static void MX_I2C1_Init(void)
{

  /* USER CODE BEGIN I2C1_Init 0 */

  /* USER CODE END I2C1_Init 0 */

  /* USER CODE BEGIN I2C1_Init 1 */

  /* USER CODE END I2C1_Init 1 */
  hi2c1.Instance = I2C1;
  hi2c1.Init.ClockSpeed = 400000;
  hi2c1.Init.DutyCycle = I2C_DUTYCYCLE_2;
  hi2c1.Init.OwnAddress1 = 0;
  hi2c1.Init.AddressingMode = I2C_ADDRESSINGMODE_7BIT;
  hi2c1.Init.DualAddressMode = I2C_DUALADDRESS_DISABLE;
  hi2c1.Init.OwnAddress2 = 0;
  hi2c1.Init.GeneralCallMode = I2C_GENERALCALL_DISABLE;
  hi2c1.Init.NoStretchMode = I2C_NOSTRETCH_DISABLE;
  if (HAL_I2C_Init(&hi2c1) != HAL_OK)
  {
    Error_Handler();
  }
  /* USER CODE BEGIN I2C1_Init 2 */

  /* USER CODE END I2C1_Init 2 */

}

/**
  * @brief TIM2 Initialization Function
  * @param None
  * @retval None
  */
static void MX_TIM2_Init(void)
{

  /* USER CODE BEGIN TIM2_Init 0 */

  /* USER CODE END TIM2_Init 0 */

  TIM_ClockConfigTypeDef sClockSourceConfig = {0};
  TIM_MasterConfigTypeDef sMasterConfig = {0};

  /* USER CODE BEGIN TIM2_Init 1 */

  /* USER CODE END TIM2_Init 1 */
  htim2.Instance = TIM2;
  htim2.Init.Prescaler = 3999;
  htim2.Init.CounterMode = TIM_COUNTERMODE_UP;
  htim2.Init.Period = 7;
  htim2.Init.ClockDivision = TIM_CLOCKDIVISION_DIV1;
  htim2.Init.AutoReloadPreload = TIM_AUTORELOAD_PRELOAD_DISABLE;
  if (HAL_TIM_Base_Init(&htim2) != HAL_OK)
  {
    Error_Handler();
  }
  sClockSourceConfig.ClockSource = TIM_CLOCKSOURCE_INTERNAL;
  if (HAL_TIM_ConfigClockSource(&htim2, &sClockSourceConfig) != HAL_OK)
  {
    Error_Handler();
  }
  sMasterConfig.MasterOutputTrigger = TIM_TRGO_RESET;
  sMasterConfig.MasterSlaveMode = TIM_MASTERSLAVEMODE_DISABLE;
  if (HAL_TIMEx_MasterConfigSynchronization(&htim2, &sMasterConfig) != HAL_OK)
  {
    Error_Handler();
  }
  /* USER CODE BEGIN TIM2_Init 2 */

  /* USER CODE END TIM2_Init 2 */

}

/**
  * @brief USART1 Initialization Function
  * @param None
  * @retval None
  */
static void MX_USART1_UART_Init(void)
{

  /* USER CODE BEGIN USART1_Init 0 */

  /* USER CODE END USART1_Init 0 */

  /* USER CODE BEGIN USART1_Init 1 */

  /* USER CODE END USART1_Init 1 */
  huart1.Instance = USART1;
  huart1.Init.BaudRate = 9600;
  huart1.Init.WordLength = UART_WORDLENGTH_8B;
  huart1.Init.StopBits = UART_STOPBITS_1;
  huart1.Init.Parity = UART_PARITY_NONE;
  huart1.Init.Mode = UART_MODE_TX_RX;
  huart1.Init.HwFlowCtl = UART_HWCONTROL_NONE;
  huart1.Init.OverSampling = UART_OVERSAMPLING_16;
  if (HAL_UART_Init(&huart1) != HAL_OK)
  {
    Error_Handler();
  }
  /* USER CODE BEGIN USART1_Init 2 */

  /* USER CODE END USART1_Init 2 */

}

/**
  * @brief USART2 Initialization Function
  * @param None
  * @retval None
  */
static void MX_USART2_UART_Init(void)
{

  /* USER CODE BEGIN USART2_Init 0 */

  /* USER CODE END USART2_Init 0 */

  /* USER CODE BEGIN USART2_Init 1 */

  /* USER CODE END USART2_Init 1 */
  huart2.Instance = USART2;
  huart2.Init.BaudRate = 9600;
  huart2.Init.WordLength = UART_WORDLENGTH_8B;
  huart2.Init.StopBits = UART_STOPBITS_1;
  huart2.Init.Parity = UART_PARITY_NONE;
  huart2.Init.Mode = UART_MODE_TX_RX;
  huart2.Init.HwFlowCtl = UART_HWCONTROL_NONE;
  huart2.Init.OverSampling = UART_OVERSAMPLING_16;
  if (HAL_UART_Init(&huart2) != HAL_OK)
  {
    Error_Handler();
  }
  /* USER CODE BEGIN USART2_Init 2 */

  /* USER CODE END USART2_Init 2 */

}

/**
  * @brief GPIO Initialization Function
  * @param None
  * @retval None
  */
static void MX_GPIO_Init(void)
{
  GPIO_InitTypeDef GPIO_InitStruct = {0};
/* USER CODE BEGIN MX_GPIO_Init_1 */
/* USER CODE END MX_GPIO_Init_1 */

  /* GPIO Ports Clock Enable */
  __HAL_RCC_GPIOH_CLK_ENABLE();
  __HAL_RCC_GPIOA_CLK_ENABLE();
  __HAL_RCC_GPIOB_CLK_ENABLE();

  /*Configure GPIO pin Output Level */
  HAL_GPIO_WritePin(GPIOA, LED_Pin|BUZZER_Pin, GPIO_PIN_RESET);

  /*Configure GPIO pin Output Level */
  HAL_GPIO_WritePin(GPIOB, M0_Pin|M1_Pin, GPIO_PIN_RESET);

  /*Configure GPIO pins : LED_Pin BUZZER_Pin */
  GPIO_InitStruct.Pin = LED_Pin|BUZZER_Pin;
  GPIO_InitStruct.Mode = GPIO_MODE_OUTPUT_PP;
  GPIO_InitStruct.Pull = GPIO_NOPULL;
  GPIO_InitStruct.Speed = GPIO_SPEED_FREQ_LOW;
  HAL_GPIO_Init(GPIOA, &GPIO_InitStruct);

  /*Configure GPIO pins : M0_Pin M1_Pin */
  GPIO_InitStruct.Pin = M0_Pin|M1_Pin;
  GPIO_InitStruct.Mode = GPIO_MODE_OUTPUT_PP;
  GPIO_InitStruct.Pull = GPIO_NOPULL;
  GPIO_InitStruct.Speed = GPIO_SPEED_FREQ_LOW;
  HAL_GPIO_Init(GPIOB, &GPIO_InitStruct);

/* USER CODE BEGIN MX_GPIO_Init_2 */
/* USER CODE END MX_GPIO_Init_2 */
}

/* USER CODE BEGIN 4 */
//void HAL_TIM_PeriodElapsedCallback(TIM_HandleTypeDef *htim){
//	SCH_Update();
//	timerRun();
//}

int counter_s = 0;
int counter_gps = 0;
void HAL_TIM_PeriodElapsedCallback(TIM_HandleTypeDef *htim){
	SCH_Update();
	timerRun();
	if(htim->Instance==TIM2) {
		if (counter_gps >= 5000) {
			counter_gps = 0;
			u8_flag_10ms = 1;
		}
		if (counter_s >= 5123) {
			counter_s = 0;
			handleSensorData(&hi2c1);
			handleBatteryData(&hadc);
			fsm_send_data_task();
		}
		counter_gps++;
		counter_s++;
	}
}
/* USER CODE END 4 */

/**
  * @brief  This function is executed in case of error occurrence.
  * @retval None
  */
void Error_Handler(void)
{
  /* USER CODE BEGIN Error_Handler_Debug */
  /* User can add his own implementation to report the HAL error return state */
  __disable_irq();
  while (1)
  {
  }
  /* USER CODE END Error_Handler_Debug */
}

#ifdef  USE_FULL_ASSERT
/**
  * @brief  Reports the name of the source file and the source line number
  *         where the assert_param error has occurred.
  * @param  file: pointer to the source file name
  * @param  line: assert_param error line source number
  * @retval None
  */
void assert_failed(uint8_t *file, uint32_t line)
{
  /* USER CODE BEGIN 6 */
  /* User can add his own implementation to report the file name and line number,
     ex: printf("Wrong parameters value: file %s on line %d\r\n", file, line) */
  /* USER CODE END 6 */
}
#endif /* USE_FULL_ASSERT */
