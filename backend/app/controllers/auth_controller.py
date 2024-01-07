from werkzeug.security import check_password_hash
from flask import jsonify,session
from models.user import User
from models.blacklistToken import BlacklistToken
from utility.common_util import generate_otp,send_otp_email
from datetime import datetime, timedelta

##############################

def authenticate(username, password):
    try:
         # Retrieve user from the database based on the provided username
        user = User.query.filter_by(username=username).first()
        if user and check_password_hash(user.password, password):
            return user
    except Exception as e:
        return jsonify({'error': str(e)}), 500 


#############################
#This function adds the provided JWT identifier to the token blacklist.
def add_token_in_blacklist(p_Jit):
    try:
        return BlacklistToken.insert(p_Jit)
    
    except Exception as e:
        return jsonify({'error': str(e)}), 500 



#############################
#- This function checks whether the provided JWT identifier is blacklisted.
def isToken_Blacklisted(p_RawJit):
    try:
       return BlacklistToken.isTokenBlacklisted(p_RawJit)
    except Exception as e:
        return jsonify({'error': str(e)}), 500
    
    
########################################################
#Process the generation and sending of a One-Time Password (OTP) via email for password recovery.
def processForgotEmailOTP(p_email):
    try:
        # Check if the provided email exists in the User database
        if not User.query.filter_by(email=p_email).first():
            return jsonify({'error': 'Invalid email'}), 400
        
        # Generate a new OTP (One-Time Password)
        otp = generate_otp()
        
        # Store the OTP and emailin the session
        session['otp'] = {'value': otp, 'timestamp': datetime.now()}
        session['forgotemail'] = p_email

        # Send the generated OTP to the user's email
        send_otp_email(p_email, otp)
        # Return a success response
        return jsonify({'success' :True, 'message': 'OTP sent successfully'})
    except Exception as e:
        return jsonify({'error': str(e)}), 500 
    
    
#########################################################
 # Verify the provided OTP for email-based password recovery
def verify_ForgotEmailOTP(p_otp):
    try:
        #  if the user is trying to verify without initiating the process
        if 'otp' not in session or 'forgotemail' not in session:
           return jsonify({'error': 'Invalid request. Initiate the process first.'}), 400

        # Retrieve stored OTP, timestamp, and email from the session
        stored_otp = session['otp']['value']
        stored_timestamp = session['otp']['timestamp'] if 'otp' in session else None
        email = session['forgotemail']

        # Make stored_timestamp offset-naive
        stored_timestamp = stored_timestamp.replace(tzinfo=None) if stored_timestamp else None

    

        # Check if OTP has expired (5 minutes)
        expiry_time = stored_timestamp + timedelta(minutes=5)
        current_time = datetime.utcnow()

        if current_time > expiry_time:
            # Clear entire session data if OTP has expired
            session.clear()
            return jsonify({'success': False, 'error': 'OTP has expired'}), 400

        # if the provided OTP matches the stored OTP
        if p_otp == stored_otp:
            # Clear session data after successful verification
            session.clear()

            # Store email in the session for further processing (e.g., updating password)
            session['updatePasswordEmail'] = {'value': email, 'timestamp': datetime.utcnow()}

            return jsonify({'success': True, 'message': 'OTP verified successfully','email':email})
        # Return a failure response for invalid OTP
        return jsonify({'success': False,'error': 'Invalid OTP'}), 400
    except Exception as e:
        return jsonify({'error': str(e)}), 500    





