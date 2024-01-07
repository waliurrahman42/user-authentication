from flask import jsonify,session
from models.user import User
from datetime import datetime, timedelta



class UserController:
     # ==================================================================================
    # Create a new user based on the provided data.
    @staticmethod
    def create_user(p_data):
        try:
            lusername = p_data.get('username')
            lpassword = p_data.get('password')
            lemail = p_data.get('email')
    
            # Call the create method of the User model to create a new user
            success, user, error_message = User.create(lusername, lpassword, lemail)
            if success:
                return jsonify({'message': 'User created successfully', 'user_id': user.id}), 201
            else:
                return jsonify({'error': error_message}), 500
        except Exception as e:
            return jsonify({'error': str(e)}), 500
    
   # ==================================================================================
    #Retrieve user information based on the provided user ID.
    @staticmethod
    def get_user_by_id(p_user_id):
        try:
            user, error_message = User.get_by_id(p_user_id)
            if user:
                return jsonify({'username': user.username, 'user_id': user.id})
            else:
                return jsonify({'error': error_message}), 404
        except Exception as e:
            return jsonify({'error': str(e)}), 500


   # ==================================================================================
    #Update user information based on the provided user ID and data.
    @staticmethod
    def update_user(p_user_id, p_data):
        try:
            lusername = p_data.get('username')
            lpassword = p_data.get('password')
            lemail = p_data.get('email')
            #retrieve user information.
            user, error_message = User.get_by_id(p_user_id)
            if not user:
                # send error response if the user with the provided ID is not found.
                return jsonify({'message': error_message})

            # Check if any fields are provided
            if not any([lusername, lpassword, lemail]):
                return jsonify({'message': 'No fields provided for update'})
            
            #update user information
            success = user.update(lusername, lpassword, lemail)
            if success:
                return jsonify({'message': 'User updated successfully'})
        except Exception as e:
            return jsonify({'error': str(e)}), 500





  

    # ==================================================================================
    #Retrieves information about the current logged-in user.
    @staticmethod
    def getCurrent_User(p_current_LoggedInuser):
        try:
            # Attempt to retrieve the user by ID
            user, error_message = User.get_by_id(p_current_LoggedInuser)
            # Check if user is not found, return an error message
            if not user:
                return jsonify({'message': error_message})
             # Build JSON response data for the current user
            return  UserController.build_json_response_data_of_current_user(user)
        except Exception as e:
            return jsonify({'error': str(e)}), 500
        


    # ==================================================================================
    # Updates the password for a user based on the provided email and password reset information.
    @staticmethod
    def updatePassword(p_password, p_email):
        try:
            # Retrieve stored email from the session
            stored_email = session['updatePasswordEmail']['value']

             # Check if the stored email is not present or does not match the provided email
            if not stored_email or stored_email != p_email:
                return jsonify({'error': 'Invalid request.'}), 404

            stored_timestamp = session['updatePasswordEmail']['timestamp'] if 'updatePasswordEmail' in session else None

            stored_timestamp = stored_timestamp.replace(tzinfo=None) if stored_timestamp else None

            # Check if OTP has expired (5 minutes)
            expiry_time = stored_timestamp + timedelta(minutes=5)
            current_time = datetime.utcnow()

            if current_time > expiry_time:
                # Clear entire session data if OTP has expired
                session.clear()
                return jsonify({'success': False, 'error': 'Time Out'}), 400

            # Retrieve user by email
            user, error_message = User.get_by_email(p_email)
            if user:
                # Update the user's password and clear the session data
                user.update_password(p_password)
                session.clear()
                return jsonify({'message': 'Password updated successfully'})
            else:
                return jsonify({'error': error_message}), 404

        except Exception as e:
            return jsonify({'error': str(e)}), 500
        
# ==================================================================================
    #Builds a JSON response containing information about the current user and their addresses.
    @staticmethod
    def build_json_response_data_of_current_user(p_user):
        try:
            user_data = {
                'username': p_user.username,
                'email': p_user.email
            }
            # Extract and format addresses data
            addresses_data = []

            for address in p_user.addresses:
                address_data = {
                    'addressId': address.id,
                    'street': address.street,
                    'city': address.city,
                    'state': address.state,
                    'zip_code': address.zip_code
                }
                addresses_data.append(address_data)

            return jsonify({
                'userData': user_data,
                'userAddresses': addresses_data
            }), 200
        except Exception as e:
            raise
# ==================================================================================
    