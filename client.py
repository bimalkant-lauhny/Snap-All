import socket

clisock = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
clisock.connect(('192.168.43.103', 3000))
clisock.send("TSC")
f = open('torecv.png','wb')
print "Receiving..."
l = clisock.recv(1024)
while (l):
    print "Receiving..."
    f.write(l)
    l = clisock.recv(1024)
f.close()
print "Done Receiving."
clisock.close()
