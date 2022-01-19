# -*- coding: utf-8 -*-
"""
Created on Tue Jan 19 12:09:26 2021

@author: skyso and Rikzo
"""

#for qr code
import socket 
import http.server
import cv2  
import socketserver 
# import png
import pyqrcode
# from pyqrcode import QRCode
# from PIL import Image

import base64
import pandas as pd
import numpy as np
import qrcode
from PIL import Image
from io import BytesIO


from qrcode.image.styledpil import StyledPilImage
from qrcode.image.styles.moduledrawers import RoundedModuleDrawer
from qrcode.image.styles.colormasks import SquareGradiantColorMask


from flask import Flask, flash,url_for, render_template, request, redirect, send_from_directory
from flask_mysqldb import MySQL
import MySQLdb
import pandas as pd
from flask_socketio import SocketIO

app = Flask(__name__)
app.config['SECRET_KEY'] = 'vnkdjnfjknfl1232#'
socketio = SocketIO(app)

# app.config['MYSQL_HOST'] = '127.0.0.1'
# app.config['MYSQL_USER'] = 'root'
# app.config['MYSQL_PASSWORD'] = ''
# app.config['MYSQL_DB'] = 'sandbox_db'

app.config['MYSQL_HOST'] = '192.168.150.112'
app.config['MYSQL_USER'] = 'pysys_local'
app.config['MYSQL_PASSWORD'] = 'NaCAhztBgYZ3HwTkvHwwGVtJn5sVMFgg'
app.config['MYSQL_DB'] = 'analysis_db'

mysql = MySQL(app)

#for qr code generation of ip adress 
hostname = socket.gethostname()    
IP = socket.gethostbyname(hostname)      
print("Your Computer IP Address is:" + IP)
 #sites code 
sites = ["<siname>"]
for i in range (0, len(sites)):
 print (sites[i])     
  
#url code    
 no_of_url = IP + ":" + "5000" + "/sites/_"+ sites[i]  


##### Qr Code Generation and Display Code #####

    
def return_image(image):
    data = BytesIO()
    image.save(data, "PNG")
    encoded_img_data = base64.b64encode(data.getvalue())
    return encoded_img_data

def generate_image(address:str=''):

    QRcode = qrcode.QRCode(
        error_correction=qrcode.constants.ERROR_CORRECT_H, box_size=8, version=1,
    )

    # taking url or text
    url = f"{no_of_url}"
    # addingg URL or text=to QRcode
    QRcode.add_data(url)

    # generating QR code
    QRcode.make(fit=True)
  
    
    # adding color to QR code
    QRimg = QRcode.make_image(
        back_color="white",\
        image_factory=StyledPilImage,\
        module_drawer=RoundedModuleDrawer(),\
        #color_mask=SquareGradiantColorMask()\
    ).convert('RGB')

    # set size of QR code
    return QRimg.resize((400, 400), Image.ANTIALIAS)

@app.route("/img", methods=["GET","POST"])
def home():
    if request.method == "POST":
        data = [x for x in request.form.values()]
        image = generate_image(data[0])

    else: 
        image = generate_image()

    image.save('C:/Users/Razon/Documents/Sky Scripts/ELLA/static/output.png')
    img_data = return_image(image)
    return render_template("home.html", img_data = img_data.decode('utf-8'), mth=request.method)

@app.route("/img", methods=["GET"])
def send():
    return send_from_directory(directory='./static/',path='output.png',as_attachment=True)
####### end of Code for QR Generration  ########

#ELLA Data Table
@app.route('/', methods=['GET', 'POST'])
def ITLog():
  
    cur =mysql.connection.cursor()
    sql = "SELECT * FROM equipment_logs"
    cur.execute(sql) # Execute the SQL
    list_users = cur.fetchall()
    return render_template('ITLog.html', list_users = list_users)

#add equipments
@app.route('/add_equipments_log', methods=['GET','POST'])
def add_equipments_log():
    if request.method == "POST":
      
        eq_id = request.form['eq_id']
        eq_type = request.form['eq_type']
        site = request.form['site']
        status = request.form['status']
        date = request.form['date_updated']
        remarks = request.form['remarks']
        cur = mysql.connection.cursor()
        cur.execute("INSERT INTO equipment_logs(eq_id, eq_type, site, status, date_updated, remarks) VALUES (%s, %s, %s, %s, %s, %s)",(eq_id, eq_type, site, status, date, remarks))
        mysql.connection.commit()
        cur.close()
        flash('Equipments detail Added successfully')
        return redirect(url_for('ITLog'))

#Datalogger History href
@app.route('/site', methods=['GET', 'POST'])
def CDTL():
    return render_template('CDTL.html')    

@app.route('/site/_<sname>' , methods = ['POST', 'GET'])
def site_log(sname):
    #db = MySQLdb.connect(host = '127.0.0.1', user = 'root', passwd = '', db = 'sandbox_db')

    cur =mysql.connection.cursor()
    sql = "SELECT * FROM equipment_logs where site = '"+sname+"'"
    cur.execute(sql) # Execute the SQL
    list_users = cur.fetchall()
 
    return render_template('site.html', imagesrc = r"{}.jpg".format(sname), list_users = list_users, sname = sname)



#edit Equipment
@app.route('/edit/<id>', methods = ['POST', 'GET'])
def get_equipments_log(id):
    cur =mysql.connection.cursor()
   
    cur.execute("SELECT * FROM equipment_logs WHERE inv_id={}".format(id))
    row = cur.fetchall()
    cur.close()
    print(row[0])
    return render_template('Edit.html', row = row[0])



#Update Equipment 
@app.route('/update/<id>', methods=['POST', 'GET'])
def update(id):
  
   if request.method == 'POST':
     
      eq_id = request.form['eq_id']
      eq_type = request.form['eq_type']
      site= request.form['site']
      status = request.form['status']
      date_updated = request.form['date_updated']
      remarks = request.form['remarks']
      cur =mysql.connection.cursor()
      sql="update equipment_logs set eq_id=%s, eq_type=%s,site=%s,status=%s,date_updated=%s,remarks=%s where inv_id=%s"
      val = (eq_id, eq_type,site,status,date_updated,remarks,id)
      cur.execute(sql, val)
      mysql.connection.commit()       
    
      flash('Equipment Details Updated')
      return redirect(url_for('ITLog')) 
            
    

 
if __name__ == "__main__":
    app.secret_key = 'super secret key'
    app.run(debug=True, host= '192.168.150.222')