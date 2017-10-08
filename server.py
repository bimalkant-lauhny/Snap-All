import socket
import autopy
import pickle

srvsock = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
srvsock.bind(('', 3000))
srvsock.listen(5)

while True:
    clisock, (remhost, remport) = srvsock.accept()
    msg = clisock.recv(100)
    data = "FAILED"
    if msg == "TSC":
        data = autopy.bitmap.capture_screen()
        data.save('screenshot.png', "png")
        f = open('screenshot.png','rb')
        l = f.read(1024)
        while (l):
            print 'Sending...'
            clisock.send(l)
            l = f.read(1024)
        f.close()
        print "Done Sending"
        clisock.shutdown(socket.SHUT_WR)
    else:
        print "Unidentified Message from Server!"
    clisock.close()
