# -*- coding: utf-8 -*-
"""
 VERSION 2 DATALOGGER PICTURE 

This is a temporary script file.
"""
# import os
# import pywintypes
import socket 
import http.server
import cv2  
import socketserver 
# import png
import pyqrcode
# from pyqrcode import QRCode
# from PIL import Image
from win10toast import ToastNotifier


hostname = socket.gethostname()    
IP = socket.gethostbyname(hostname)      
print("Your Computer IP Address is:" + IP)

# sites code 
sites = [ "UMIG"]
for i in range (0, len(sites)):
  print (sites[i])     
  
#url code    
  no_of_url = IP + ":" + "5000" + "\V2_DT\V5"+ sites[i] + ".jpg"   
 
  print (no_of_url) 
            
  
    
  url = pyqrcode.create(no_of_url)
  url.png(sites[i]+".png",scale=8)
  img = cv2.imread(sites[i]+".png")
  print (url)


  cv2.imwrite(r'C:\Users\Razon\Desktop\QR Code Pics\V5 ' + sites[i] + '.png',img)

toast = ToastNotifier()  
toast.show_toast("File Organizer", "The process has been started", duration=30)
   

        

#Start http server
Handler = http.server.SimpleHTTPRequestHandler
with socketserver.TCPServer(("", 8000), Handler) as httpd:
    print("Running your port")
    httpd.serve_forever()
    