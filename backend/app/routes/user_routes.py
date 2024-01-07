from flask import Blueprint, request
from flask_jwt_extended import jwt_required,get_jwt_identity 
from controllers.user_controller import UserController
from utility.utility import check_blacklist


user_routes = Blueprint('user_routes', __name__)


# ==================================================================================
# Define route to get user profile
@user_routes.route('/profile', methods=['GET'])
@jwt_required()
@check_blacklist
def get_profile():
    try:
        current_user = get_jwt_identity()
        result = UserController.getCurrent_User(current_user)
        return result
    except Exception as e:
        return e

# ==================================================================================
# Define route for user registration
@user_routes.route('/register', methods=['POST'])
def register():
    try:
        data = request.get_json()
        result = UserController.create_user(data)
        return result
    except Exception as e:
        return e
    
# ==================================================================   
# Define route to update user password
@user_routes.route('/updatePassword', methods=['POST'])
def update_password():
    try:
        newPassword = request.json.get('newPassword');
        email = request.json.get('email');
        return UserController.updatePassword(newPassword, email);
    except Exception as e:
        return e
    

# ==================================================================================
# Define route to update user information
@user_routes.route('/updateUser', methods=['POST'])
@jwt_required()
@check_blacklist
def updateUser():
    try:
        current_userId = get_jwt_identity()
        data = request.get_json()
        result = UserController.update_user(current_userId,data)
        return result
    except Exception as e:
        return e


