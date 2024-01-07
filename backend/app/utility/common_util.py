from flask_mail import Message
from flask import current_app
import random
import string



#======================================================================
## Generate a random six-digit OTP using digits
def generate_otp():
    return ''.join(random.choices(string.digits, k=6))

#======================================================================

#Sends an email containing the OTP for password reset.
def send_otp_email(p_emailId, p_otp):
    
    # Email subject and body with the OTP
    subject = 'Password Reset OTP'
    body = f'Your OTP for password reset is: {p_otp}'
    
    # Create a Message object for the email
    msg = Message(subject, recipients=[p_emailId])
    msg.body = body

    try:
        # Send the email 
        mail = current_app.extensions['mail']
        mail.send(msg)
    except Exception as e:
        raise

#=============================================================
def send_some_other_email(mailIds, p_subject,p_body):
    # Send some other email
    subject = p_subject
    body = f'Content: {p_body}'
    
    
    # Create a Message object for the email
    msg = Message(subject, recipients=[mailIds])
    msg.body = body

    try:
         # Send the email 
        mail = current_app.extensions['mail']
        mail.send(msg)
    except Exception as e:
        raise


