n = 3
def upto(count):
    num = " " * n
    for i in range(1, count + 1):
        num = num[:i - 1] + str(i) + num[i:]
    return num

for i in range(n + 1):
    line = ""
    for j in range(n + 1):
        line += f"({upto(i)}, {upto(j)}) "
    print(line)
