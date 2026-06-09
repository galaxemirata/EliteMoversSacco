# importing flask
from flask import *
import pymysql
import os
from flask_cors import CORS

import json

# initialize app
app = Flask(__name__)
CORS(app)


# SIGNUP
@app.route("/api/signup", methods=["POST"])
def signup():

    username = request.form["username"]
    email = request.form["email"]
    password = request.form["password"]
    phone = request.form["phone"]
    profilePic = request.form["profilePic"]

    # ==========================
    # PHONE VALIDATION (FIX ONLY)
    # ==========================
    if not phone.isdigit():
        return jsonify({
            "error": "Phone number must contain digits only"
        }), 400
    connection=pymysql.connect(user="collins",host="mysql-collins.alwaysdata.net",password="modcom1234",database="collins_matatu")

    cursor = connection.cursor()

    sql = """
    INSERT INTO signup(username,password,email,phone,profilePic)
    VALUES(%s,%s,%s,%s,%s)
    """

    cursor.execute(
        sql,
        (username, password, email, phone, profilePic)
    )

    connection.commit()

    return jsonify({
        "message": "Thankyou for joining"
    })

# ==============================
# SIGNIN API
# ==============================
@app.route("/api/signin", methods=["POST"])
def signin():

    data = request.form

    email = data.get("email")
    password = data.get("password")

    connection=pymysql.connect(user="collins",host="mysql-collins.alwaysdata.net",password="modcom1234",database="collins_matatu")

    cursor = connection.cursor(pymysql.cursors.DictCursor)

    sql = "SELECT * FROM signup WHERE email=%s AND password=%s"

    cursor.execute(sql, (email, password))

    if cursor.rowcount == 0:
        return jsonify({"message": "login failed"})
    else:
        return jsonify({
            "message": "login successful",
            "user": cursor.fetchone()
        })




import requests
import datetime
import base64
from requests.auth import HTTPBasicAuth
import traceback

def get_db():
    return pymysql.connect(
        user="collins",
        host="mysql-collins.alwaysdata.net",
        password="modcom1234",
        database="collins_matatu",
        cursorclass=pymysql.cursors.DictCursor
    )


from flask import request, jsonify
connection=pymysql.connect(user="collins",host="mysql-collins.alwaysdata.net",password="modcom1234",database="collins_matatu")

@app.route('/api/mpesa_payment', methods=['POST'])
def mpesa_payment():

    if request.method == 'POST':

        # Extract POST Values sent
        data = request.get_json()

        amount = data.get('amount')
        phone = data.get('phone')

        # ✅ VEHICLE
        vehicle = data.get('vehicle')

        # ✅ GET ALL SELECTED SEATS
        seats = data.get('seats')

        pickup = data.get('pickup_location')

        route_name = data.get('route_name')

        seat_price = amount

        # Safaricom credentials
        consumer_key = "GTWADFxIpUfDoNikNGqq1C3023evM6UH"
        consumer_secret = "amFbAoUByPV2rM5A"

        api_URL = "https://sandbox.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials"

        response = requests.get(
            api_URL,
            auth=HTTPBasicAuth(
                consumer_key,
                consumer_secret
            )
        )

        data = response.json()

        access_token = "Bearer " + data['access_token']

        # Timestamp & password
        timestamp = datetime.datetime.today().strftime('%Y%m%d%H%M%S')

        passkey = 'bfb279f9aa9bdbcf158e97dd71a467cd2e0c893059b10f78e6b72ada1ed2c919'

        business_short_code = "174379"

        data_to_encode = business_short_code + passkey + timestamp

        encoded = base64.b64encode(
            data_to_encode.encode()
        )

        password = encoded.decode()

        # STK Push payload
        payload = {
            "BusinessShortCode": business_short_code,
            "Password": password,
            "Timestamp": timestamp,
            "TransactionType": "CustomerPayBillOnline",
            "Amount": amount,
            "PartyA": phone,
            "PartyB": business_short_code,
            "PhoneNumber": phone,
            "CallBackURL": "https://coding.co.ke/api/confirm.php",
            "AccountReference": phone,
            "TransactionDesc": "Payments for Products"
        }

        headers = {
            "Authorization": access_token,
            "Content-Type": "application/json"
        }

        url = "https://sandbox.safaricom.co.ke/mpesa/stkpush/v1/processrequest"

        response = requests.post(
            url,
            json=payload,
            headers=headers
        )

        print(response.text)

        # =============================
        # DATABASE INSERT
        # =============================
        try:

            connection=pymysql.connect(user="collins",host="mysql-collins.alwaysdata.net",password="modcom1234",database="collins_matatu")

            cursor = connection.cursor()

            insert_query = """
                INSERT INTO bookings(
                    number_plate,
                    seat_number,
                    phone,
                    amount,
                    route_name,
                    pickup_location,
                    status
                )
                VALUES(%s,%s,%s,%s,%s,%s,%s)
            """

            # ✅ SAVE EACH SEAT SEPARATELY
            for seat in seats:

                cursor.execute(insert_query, (
                    vehicle,
                    seat,
                    phone,
                    seat_price,
                    route_name,
                    pickup,
                    "Pending"
                ))

            connection.commit()

            cursor.close()
            connection.close()

        except Exception as e:
            print("DB Error:", e)

        return jsonify({
            "message": "Thankyou..Please check phone to complete payment"
        })
    

@app.route('/api/mpesa_cancel', methods=['POST'])
def mpesa_cancel():

    data = request.get_json()

    checkout_id = data.get("checkout_id")

    print("CANCELLED:", checkout_id)

    return jsonify({
        "message": "Payment stopped successfully"
    })

@app.route('/api/admin/vehicle_status/<int:vehicle_id>')
def vehicle_status(vehicle_id):

    connection = pymysql.connect(
        user="collins",
        host="mysql-collins.alwaysdata.net",
        password="modcom1234",
        database="collins_matatu",
        cursorclass=pymysql.cursors.DictCursor
    )

    cursor = connection.cursor()

    cursor.execute("""
        SELECT total_seats, number_plate
        FROM vehicles
        WHERE id=%s
    """, (vehicle_id,))

    vehicle = cursor.fetchone()

    cursor.execute("""
        SELECT COUNT(*) as booked
        FROM bookings
        WHERE number_plate=%s
    """, (vehicle["number_plate"],))

    booked = cursor.fetchone()

    cursor.close()
    connection.close()

    total = vehicle["total_seats"]
    booked_count = booked["booked"]

    return jsonify({
        "vehicle": vehicle["number_plate"],
        "total_seats": total,
        "booked_seats": booked_count,
        "is_full": booked_count >= total
    })

@app.route('/api/admin/add_vehicle', methods=['POST'])
def add_vehicle():

    data = request.get_json()

    number_plate = data.get('number_plate')
    driver_name = data.get('driver_name')
    route_name = data.get('route_name')
    total_seats = data.get('total_seats')
    price = data.get('price')

    # ✅ NECESSARY FIX ONLY
    admin_email = data.get('admin_email')

    connection=pymysql.connect(user="collins",host="mysql-collins.alwaysdata.net",password="modcom1234",database="collins_matatu")

    cursor = connection.cursor()

    cursor.execute("""
        INSERT INTO vehicles(
            number_plate,
            driver_name,
            route_name,
            total_seats,
            price,
            admin_email
        )
        VALUES(%s,%s,%s,%s,%s,%s)
    """, (
        number_plate,
        driver_name,
        route_name,
        total_seats,
        price,
        admin_email
    ))

    connection.commit()

    cursor.close()
    connection.close()

    return jsonify({
        "message": "Vehicle added successfully"
    })

@app.route('/api/vehicles')
def vehicles():

    connection=pymysql.connect(user="collins",host="mysql-collins.alwaysdata.net",password="modcom1234",database="collins_matatu")
    cursor = connection.cursor(
        pymysql.cursors.DictCursor
    )

    cursor.execute("""
        SELECT * FROM vehicles
        WHERE status='ACTIVE'
    """)

    vehicles = cursor.fetchall()

    cursor.close()
    connection.close()

    return jsonify(vehicles)

@app.route('/api/booked_seats/<number_plate>')
def booked_seats(number_plate):

    connection = pymysql.connect(
        user="collins",
        host="mysql-collins.alwaysdata.net",
        password="modcom1234",
        database="collins_matatu",
        cursorclass=pymysql.cursors.DictCursor
    )

    cursor = connection.cursor()

    cursor.execute("""
        SELECT seat_number
        FROM bookings
        WHERE number_plate=%s
    """, (number_plate,))

    rows = cursor.fetchall()

    seats = [row["seat_number"] for row in rows]

    cursor.close()
    connection.close()

    return jsonify(seats)

@app.route("/api/adminsignin", methods=["POST"])
def adminsignin():

    data = request.form

    email = data.get("email")
    password = data.get("password")

    connection=pymysql.connect(user="collins",host="mysql-collins.alwaysdata.net",password="modcom1234",database="collins_matatu")

    cursor = connection.cursor(pymysql.cursors.DictCursor)

    sql = """
        SELECT * FROM admins
        WHERE email=%s AND password=%s
    """

    cursor.execute(sql, (email, password))

    admin = cursor.fetchone()

    cursor.close()
    connection.close()

    if admin:

        return jsonify({
            "success": True,
            "admin": admin
        })

    else:

        return jsonify({
            "success": False,
            "message": "Invalid admin credentials"
        })
    
@app.route('/api/admin/remove_vehicle/<int:vehicle_id>', methods=['DELETE'])
def remove_vehicle(vehicle_id):

    try:

        connection=pymysql.connect(user="collins",host="mysql-collins.alwaysdata.net",password="modcom1234",database="collins_matatu")

        cursor = connection.cursor(pymysql.cursors.DictCursor)

        # GET VEHICLE
        cursor.execute(
            "SELECT number_plate FROM vehicles WHERE id=%s",
            (vehicle_id,)
        )

        vehicle = cursor.fetchone()

        if not vehicle:
            return jsonify({
                "success": False,
                "message": "Vehicle not found"
            }), 404

        number_plate = vehicle["number_plate"]

        # DELETE ALL BOOKINGS FOR THIS VEHICLE
        cursor.execute(
            "DELETE FROM bookings WHERE number_plate=%s",
            (number_plate,)
        )

        # DELETE VEHICLE
        cursor.execute(
            "DELETE FROM vehicles WHERE id=%s",
            (vehicle_id,)
        )

        connection.commit()

        cursor.close()
        connection.close()

        return jsonify({
            "success": True,
            "message": "Vehicle and its bookings removed successfully"
        })

    except Exception as e:

        print("DELETE ERROR:", str(e))

        return jsonify({
            "success": False,
            "message": str(e)
        }), 500
    # ==============================
# ADMIN BOOKINGS API
# ==============================

@app.route('/api/admin/bookings', methods=['GET'])
def admin_bookings():

    connection=pymysql.connect(user="collins",host="mysql-collins.alwaysdata.net",password="modcom1234",database="collins_matatu")

    cursor = connection.cursor()

    cursor.execute("""
        SELECT *
        FROM bookings
    """)

    bookings = cursor.fetchall()

    cursor.close()
    connection.close()

    return jsonify(bookings)



@app.route("/api/update-profile-pic", methods=["POST"])
def update_profile_pic():
    data = request.get_json()

    email = data.get("email")
    profile_pic = data.get("profilePic")

    connection=pymysql.connect(user="collins",host="mysql-collins.alwaysdata.net",password="modcom1234",database="collins_matatu")

    cursor = connection.cursor()

    sql = """
        UPDATE signup
        SET profilePic = %s
        WHERE email = %s
    """

    cursor.execute(sql, (profile_pic, email))
    connection.commit()

    cursor.close()
    connection.close()

    return jsonify({
        "message": "Profile updated successfully",
        "profilePic": profile_pic
    })


@app.route('/api/paid_seats/<number_plate>')
def paid_seats(number_plate):

    connection = pymysql.connect(
        user="collins",
        host="mysql-collins.alwaysdata.net",
        password="modcom1234",
        database="collins_matatu",
        cursorclass=pymysql.cursors.DictCursor
    )

    cursor = connection.cursor()

    cursor.execute("""
        SELECT seat_number
        FROM bookings
        WHERE number_plate=%s
    """, (number_plate,))

    rows = cursor.fetchall()

    seats = [row["seat_number"] for row in rows]

    cursor.close()
    connection.close()

    return jsonify(seats)


# RUN APP

# app.run(debug=True)