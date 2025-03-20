################################################################################
# Automatically-generated file. Do not edit!
# Toolchain: GNU Tools for STM32 (12.3.rel1)
################################################################################

# Add inputs and outputs from these tool invocations to the build variables 
C_SRCS += \
../Core/Src/fsm_control_buzzer.c \
../Core/Src/fsm_find_device.c \
../Core/Src/fsm_handle_data.c \
../Core/Src/fsm_send_data.c \
../Core/Src/fsm_start.c \
../Core/Src/global.c \
../Core/Src/gps.c \
../Core/Src/main.c \
../Core/Src/mpu6050.c \
../Core/Src/scheduler.c \
../Core/Src/software_timer.c \
../Core/Src/stm32l1xx_hal_msp.c \
../Core/Src/stm32l1xx_it.c \
../Core/Src/syscalls.c \
../Core/Src/sysmem.c \
../Core/Src/system_stm32l1xx.c 

OBJS += \
./Core/Src/fsm_control_buzzer.o \
./Core/Src/fsm_find_device.o \
./Core/Src/fsm_handle_data.o \
./Core/Src/fsm_send_data.o \
./Core/Src/fsm_start.o \
./Core/Src/global.o \
./Core/Src/gps.o \
./Core/Src/main.o \
./Core/Src/mpu6050.o \
./Core/Src/scheduler.o \
./Core/Src/software_timer.o \
./Core/Src/stm32l1xx_hal_msp.o \
./Core/Src/stm32l1xx_it.o \
./Core/Src/syscalls.o \
./Core/Src/sysmem.o \
./Core/Src/system_stm32l1xx.o 

C_DEPS += \
./Core/Src/fsm_control_buzzer.d \
./Core/Src/fsm_find_device.d \
./Core/Src/fsm_handle_data.d \
./Core/Src/fsm_send_data.d \
./Core/Src/fsm_start.d \
./Core/Src/global.d \
./Core/Src/gps.d \
./Core/Src/main.d \
./Core/Src/mpu6050.d \
./Core/Src/scheduler.d \
./Core/Src/software_timer.d \
./Core/Src/stm32l1xx_hal_msp.d \
./Core/Src/stm32l1xx_it.d \
./Core/Src/syscalls.d \
./Core/Src/sysmem.d \
./Core/Src/system_stm32l1xx.d 


# Each subdirectory must supply rules for building sources it contributes
Core/Src/%.o Core/Src/%.su Core/Src/%.cyclo: ../Core/Src/%.c Core/Src/subdir.mk
	arm-none-eabi-gcc "$<" -mcpu=cortex-m3 -std=gnu11 -g3 -DDEBUG -DUSE_HAL_DRIVER -DSTM32L151xBA -c -I../Core/Inc -I../Drivers/STM32L1xx_HAL_Driver/Inc -I../Drivers/STM32L1xx_HAL_Driver/Inc/Legacy -I../Drivers/CMSIS/Device/ST/STM32L1xx/Include -I../Drivers/CMSIS/Include -O0 -ffunction-sections -fdata-sections -Wall -fstack-usage -fcyclomatic-complexity -MMD -MP -MF"$(@:%.o=%.d)" -MT"$@" --specs=nano.specs -mfloat-abi=soft -mthumb -o "$@"

clean: clean-Core-2f-Src

clean-Core-2f-Src:
	-$(RM) ./Core/Src/fsm_control_buzzer.cyclo ./Core/Src/fsm_control_buzzer.d ./Core/Src/fsm_control_buzzer.o ./Core/Src/fsm_control_buzzer.su ./Core/Src/fsm_find_device.cyclo ./Core/Src/fsm_find_device.d ./Core/Src/fsm_find_device.o ./Core/Src/fsm_find_device.su ./Core/Src/fsm_handle_data.cyclo ./Core/Src/fsm_handle_data.d ./Core/Src/fsm_handle_data.o ./Core/Src/fsm_handle_data.su ./Core/Src/fsm_send_data.cyclo ./Core/Src/fsm_send_data.d ./Core/Src/fsm_send_data.o ./Core/Src/fsm_send_data.su ./Core/Src/fsm_start.cyclo ./Core/Src/fsm_start.d ./Core/Src/fsm_start.o ./Core/Src/fsm_start.su ./Core/Src/global.cyclo ./Core/Src/global.d ./Core/Src/global.o ./Core/Src/global.su ./Core/Src/gps.cyclo ./Core/Src/gps.d ./Core/Src/gps.o ./Core/Src/gps.su ./Core/Src/main.cyclo ./Core/Src/main.d ./Core/Src/main.o ./Core/Src/main.su ./Core/Src/mpu6050.cyclo ./Core/Src/mpu6050.d ./Core/Src/mpu6050.o ./Core/Src/mpu6050.su ./Core/Src/scheduler.cyclo ./Core/Src/scheduler.d ./Core/Src/scheduler.o ./Core/Src/scheduler.su ./Core/Src/software_timer.cyclo ./Core/Src/software_timer.d ./Core/Src/software_timer.o ./Core/Src/software_timer.su ./Core/Src/stm32l1xx_hal_msp.cyclo ./Core/Src/stm32l1xx_hal_msp.d ./Core/Src/stm32l1xx_hal_msp.o ./Core/Src/stm32l1xx_hal_msp.su ./Core/Src/stm32l1xx_it.cyclo ./Core/Src/stm32l1xx_it.d ./Core/Src/stm32l1xx_it.o ./Core/Src/stm32l1xx_it.su ./Core/Src/syscalls.cyclo ./Core/Src/syscalls.d ./Core/Src/syscalls.o ./Core/Src/syscalls.su ./Core/Src/sysmem.cyclo ./Core/Src/sysmem.d ./Core/Src/sysmem.o ./Core/Src/sysmem.su ./Core/Src/system_stm32l1xx.cyclo ./Core/Src/system_stm32l1xx.d ./Core/Src/system_stm32l1xx.o ./Core/Src/system_stm32l1xx.su

.PHONY: clean-Core-2f-Src

