# importing flask
from flask import *
# import pymysql
import pymysql
# import os
import os
from flask_cors import CORS
# initialize your app
app=Flask(__name__)
CORS(app)
from flask import request, jsonify







@app.route("/api/signup",methods=["POST"])
def signup():
    # extracting user imputs from a form
    username=request.form["username"]
    email=request.form["email"]
    password=request.form["password"]
    phone=request.form["phone"]

    # connecting to our database
    connection=pymysql.connect(user="root",host="localhost",password="",database="matatu")
    
    # execuitng sql queries
    cursor=connection.cursor()
    sql="insert into signup(username,password,email,phone)values(%s,%s,%s,%s)"

    # defining our data
    data=(username,password,email,phone)
    # executing data
    cursor.execute(sql,data)
    # saving to our database
    connection.commit()
    return jsonify ({"message":"Thankyou for joining"})


# sign in/login api


@app.route("/api/signin", methods=["POST"])
def signin():
    data = request.form  

    email = data.get("email")
    password = data.get("password")

    connection = pymysql.connect(user="root",host="localhost",password="", database="matatu")
        
       
        
        
    

    cursor = connection.cursor(pymysql.cursors.DictCursor)

    sql = "SELECT * FROM signup WHERE email=%s AND password=%s"
    values = (email, password)

    cursor.execute(sql, values)

    if cursor.rowcount == 0:
        return jsonify({"message": "login failed"})
    else:
        user = cursor.fetchone()
        return jsonify({"message": "login successful", "user": user})
    


  












    


import requests
import datetime
import base64
from requests.auth import HTTPBasicAuth

@app.route('/api/mpesa_payment', methods=['POST'])
def mpesa_payment():
    if request.method == 'POST':
    # Extract POST Values sent
        data = request.get_json()

        amount = data['amount']
        phone = data['phone']
        seat = data.get('seat')
        # Provide consumer_key and consumer_secret provided by safaricom
        consumer_key = "GTWADFxIpUfDoNikNGqq1C3023evM6UH"
        consumer_secret = "amFbAoUByPV2rM5A"

        # Authenticate Yourself using above credentials to Safaricom Services, and Bearer Token this is used by safaricom for security identification purposes - Your are given Access
        api_URL = "https://sandbox.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials" # AUTH URL
        # Provide your consumer_key and consumer_secret
        response = requests.get(api_URL, auth=HTTPBasicAuth(consumer_key, consumer_secret))
        # Get response as Dictionary
        data = response.json()
        # Retrieve the Provide Token
        # Token allows you to proceed with the transaction
        access_token = "Bearer" + ' ' + data['access_token']

        # GETTING THE PASSWORD
        timestamp = datetime.datetime.today().strftime('%Y%m%d%H%M%S') # Current Time
        passkey = 'bfb279f9aa9bdbcf158e97dd71a467cd2e0c893059b10f78e6b72ada1ed2c919' # Passkey(Safaricom Provided)
        business_short_code = "174379" # Test Paybile (Safaricom Provided)
        # Combine above 3 Strings to get data variable
        data = business_short_code + passkey + timestamp
        # Encode to Base64
        encoded = base64.b64encode(data.encode())
        password = encoded.decode()
        

        # BODY OR PAYLOAD
        payload = {
        "BusinessShortCode": "174379",
        "Password":password,
        "Timestamp": timestamp,
        "TransactionType": "CustomerPayBillOnline",
        "Amount":amount, # use 1 when testing
        "PartyA": phone, # change to your number
        "PartyB": "174379",
        "PhoneNumber": phone,
        "CallBackURL": "https://coding.co.ke/api/confirm.php",
        "AccountReference": "Mwangi Collins David",
        "TransactionDesc": "Payments for Products"
        }

        # POPULAING THE HTTP HEADER, PROVIDE THE TOKEN ISSUED EARLIER
        headers = {
        "Authorization": access_token,
        "Content-Type": "application/json"
        }

        # Specify STK Push Trigger URL
        url = "https://sandbox.safaricom.co.ke/mpesa/stkpush/v1/processrequest"
        # Create a POST Request to above url, providing headers, payload
        # Below triggers an STK Push to the phone number indicated in the payload and the amount.
        response = requests.post(url, json=payload, headers=headers)
        print(response.text) #
        # Give a Response
        return jsonify({"message": "An MPESA Prompt has been sent to Your Phone, Please Check & Complete Payment"})








































app.run(debug=True)

