from flask import Blueprint, request, jsonify, session
from flask_jwt_extended import create_access_token,create_refresh_token, jwt_required, get_jwt_identity,get_jwt
from controllers.auth_controller import authenticate ,verify_ForgotEmailOTP, add_token_in_blacklist,processForgotEmailOTP 
from utility.utility import check_blacklist

auth_routes = Blueprint('auth_routes', __name__)


# ==================================================================================
# Define route for user login
@auth_routes.route('/login', methods=['POST'])
def login():
    try:
        data = request.get_json()
        print("Received login data:", data)
        # Extract 'username' and 'password' from the JSON data
        username = data.get('username')
        password = data.get('password')
       
        #if authentication is successful
        user = authenticate(username, password)
        if user:
             # Create access_token and refresh_token
            access_token = create_access_token(identity=user.id)
            refresh_token = create_refresh_token(identity=user.id)
            return  jsonify(access_token=access_token, refresh_token=refresh_token), 200
        else:
            return jsonify({'message': 'Invalid credentials'}), 401
    except Exception as e:
        return e

    

# Define route for user logout
@auth_routes.route('/logout', methods=['POST'])
@jwt_required()
@check_blacklist
def logout():
    try:
        # Get the user's identity from the JWT
        username = get_jwt_identity()
        
        # Get the JWT ID (jti) from the current token
        jti= get_jwt()['jti']

        # Check if the token is already blacklisted
        if add_token_in_blacklist(jti):
            return jsonify({'message': f'Logout successful for {username}'}), 200
    except Exception as e:
        return e
    



# Route for sending OTP via email for password recovery
@auth_routes.route('/forgot_password', methods=['POST'])
def forgot_password():
    try:
        print(session)
        email = request.json.get('email')
        if not email:
            return jsonify({'error': 'Invalid email'}), 400
        return processForgotEmailOTP(email);
    except Exception as e:
        return e

    

# Route for verifying the OTP during password recovery
@auth_routes.route('/verifyOtp', methods=['POST'])
def verify_otp():
    try:
        user_otp = request.json.get('otp')
        #email = request.json.get('email');
        #newPassword = request.json.get('newPassword');
        print(session)
        return  verify_ForgotEmailOTP(user_otp);
    except Exception as e:
        return e
    

# Route for refreshing access token
@auth_routes.route('/refresh', methods=['POST'])
@jwt_required(refresh=True)
def refresh():
    try:
        # Get the identity of the current user from the JWT
        current_user = get_jwt_identity()
        # Create a new access token for the current user
        new_access_token = create_access_token(identity=current_user)
         # Return JSON response with the new access_token 
        return jsonify(access_token=new_access_token), 200
    except Exception as e:
        # Return JSON response with an error message and status code 500 for exceptions
        return jsonify({'error': str(e)}), 500
    


    


    




