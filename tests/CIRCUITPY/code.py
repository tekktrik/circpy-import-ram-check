import time
import gc

time.sleep(5)

print("[RP2040JS:START]")

print(gc.mem_alloc())

print("[RP2040JS:END]")

while True:
    pass
