# -*- coding: utf-8 -*-
"""
Created on Tue Dec  1 11:02:21 2020

@author: RikZo
"""

import http.server as SimpleHTTPServer
import socketserver as SocketServer
import logging

PORT = 5000

class GetHandler(
        SimpleHTTPServer.SimpleHTTPRequestHandler
        ):

    def do_GET(self):
        logging.error(self.headers)
        SimpleHTTPServer.SimpleHTTPRequestHandler.do_GET(self)



print ('Running ITLog Server...')
Handler = GetHandler
httpd = SocketServer.TCPServer(("", PORT), Handler)

httpd.serve_forever()
