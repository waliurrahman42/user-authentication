from functools import wraps
from flask import jsonify
from flask_jwt_extended import jwt_required,get_jwt_identity,get_jwt
from controllers.auth_controller import isToken_Blacklisted


#======================================================================
#Decorator function to check if the JWT token is blacklisted.
def check_blacklist(func):
    @wraps(func)
    def wrapper(*args, **kwargs):
         # Get the JWT token's jti (JWT ID)
        jti = get_jwt()["jti"]
         # Check if the token is blacklisted
        isBlocked , message = isToken_Blacklisted(jti)
        if isBlocked:
              # Return a JSON response with an unauthorized status code if the token is blacklisted
            return jsonify(message), 401
         # Call the original function if the token is not blacklisted
        return func(*args, **kwargs)
    return wrapper


